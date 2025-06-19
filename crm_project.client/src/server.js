import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mysql from 'mysql2/promise';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(bodyParser.json());

// Конфигурация подключения к MySQL
const pool = mysql.createPool({
  host: process.env.DB_SERVER,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  database: 'a1group',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log(process.env.DB_SERVER, process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_PORT);

// Middleware для проверки JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET || '1db79d1856921c184071a49e3227786ee45f0519ff87c0c2df0f681657fc6134', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Регистрация пользователя
app.post('/api/Register', async (req, res) => {
  try {
    console.log('Получен запрос на регистрацию:', req.body);
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ error: 'Все поля обязательны для заполнения' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // Добавляем пользователя в таблицу users
      const [userResult] = await connection.execute(
        'INSERT INTO users (username, password_hash, email, role) VALUES (?, ?, ?, ?)',
        [username, hashedPassword, email, 'user']
      );

      const userId = userResult.insertId;

      // Создаем пустой профиль пользователя (если таблица существует)
      try {
        await connection.execute(
          'INSERT INTO users_profile (ID, email, firstName, lastName, age, gender, phone) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [userId, email, '', '', 0, '', '']
        );
      } catch (profileError) {
        console.warn('Не удалось создать профиль:', profileError);
      }

      await connection.commit();

      const token = jwt.sign({ userId, username }, process.env.JWT_SECRET || '1db79d1856921c184071a49e3227786ee45f0519ff87c0c2df0f681657fc6134', { expiresIn: '1h' });
      res.status(201).json({ token, username });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Ошибка регистрации:', error);

    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Пользователь с таким именем или email уже существует' });
    } else if (error.code === 'ER_NO_SUCH_TABLE') {
      res.status(400).json({ error: 'Таблица профилей не существует' });
    } else {
      res.status(500).json({
        error: 'Ошибка сервера при регистрации',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
});

// Аутентификация пользователя
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Валидация
    if (!username || !password) {
      return res.status(400).json({ error: 'Все поля обязательны' });
    }

    // Поиск пользователя
    const [users] = await pool.query(
      'SELECT id, username, password_hash, role FROM users WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Неверные учетные данные' });
    }

    // Проверка пароля
    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Неверные учетные данные' });
    }

    // Генерация токена
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        id: user.id,
        role: user.role
      },
      process.env.JWT_SECRET || '1db79d1856921c184071a49e3227786ee45f0519ff87c0c2df0f681657fc6134',
      { expiresIn: '1h' }
    );

    res.json({
      token,
      username: user.username,
      userId: user.id,
      role: user.role
    });

  } catch (error) {
    console.error('🚨 Ошибка входа:', error);
    res.status(500).json({
      error: 'Внутренняя ошибка сервера',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Получение задач пользователя
app.get('/api/tasks', authenticateToken, async (req, res) => {
  try {
    const connection = await pool.getConnection();

    if (req.user.role === 'admin') {
      const [tasks] = await connection.query(
        'SELECT t.*, u.username as creatorName FROM tasks t JOIN users u ON t.creatorID = u.id WHERE t.isDeleted = 0'
      );
      connection.release();
      return res.json(tasks);
    }

    const [tasks] = await connection.query(
      'SELECT t.*, u.username as creatorName FROM tasks t JOIN users u ON t.creatorID = u.id WHERE t.creatorID = ? AND t.isDeleted = 0',
      [req.user.userId || req.user.id]
    );
    connection.release();
    res.json(tasks);
  } catch (error) {
    console.error('Ошибка получения задач:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Добавление задачи
app.post('/api/tasks', authenticateToken, async (req, res) => {
  try {
    const { title, description, endTime } = req.body;
    if (!title || !description || !endTime) {
      return res.status(400).json({ error: 'Поля title, description и endTime обязательны' });
    }

    const startTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const formattedEndTime = new Date(endTime).toISOString().slice(0, 19).replace('T', ' ');

    const connection = await pool.getConnection();

    const [result] = await connection.execute(
      'INSERT INTO tasks (creatorID, creatorName, title, description, startTime, endTime, createdAt, isCompleted) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [req.user.userId, req.user.username, title, description, startTime, formattedEndTime, createdAt, 0]
    );

    connection.release();

    const newTask = {
      id: result.insertId,
      creatorID: req.user.userId,
      creatorName: req.user.username,
      title,
      description,
      startTime,
      endTime: formattedEndTime,
      createdAt,
      isCompleted: false
    };
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Ошибка создания задачи:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Обновление задачи
app.put('/api/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, endTime, isCompleted } = req.body;

    let formattedEndTime = null;
    if (endTime) {
      const date = new Date(endTime);
      if (isNaN(date.getTime())) {
        return res.status(400).json({ error: 'Некорректный формат даты' });
      }
      formattedEndTime = date.toISOString().slice(0, 19).replace('T', ' ');
    }

    const connection = await pool.getConnection();

    if (req.user.role === 'admin') {
      await connection.execute(
        'UPDATE tasks SET title = ?, description = ?, endTime = ?, isCompleted = ? WHERE id = ?',
        [title, description, formattedEndTime, isCompleted, id]
      );
    } else {
      await connection.execute(
        'UPDATE tasks SET title = ?, description = ?, endTime = ?, isCompleted = ? WHERE id = ? AND creatorID = ?',
        [title, description, formattedEndTime, isCompleted, id, req.user.userId]
      );
    }

    connection.release();
    res.json({ success: true });
  } catch (error) {
    console.error('Ошибка обновления задачи:', error);
    res.status(500).json({
      error: 'Ошибка сервера',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Удаление задачи
app.delete('/api/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    await connection.execute(
      'UPDATE tasks SET isDeleted = 1 WHERE id = ? AND creatorID = ?',
      [id, req.user.userId]
    );
    connection.release();

    res.json({ success: true });
  } catch (error) {
    console.error('Ошибка удаления задачи:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Получение профиля пользователя
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(
      'SELECT firstName, lastName, age, gender, phone, email FROM users_profile WHERE ID = ?',
      [req.user.userId]
    );
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Профиль не найден' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Ошибка получения профиля:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Обновление профиля пользователя
app.put('/api/profile/:profileName', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, age, gender, phone, email } = req.body;
    const connection = await pool.getConnection();

    await connection.query(
      'UPDATE users_profile SET firstName = ?, lastName = ?, age = ?, gender = ?, phone = ?, email = ? WHERE ID = ?',
      [firstName, lastName, age, gender, phone, email, req.user.userId]
    );

    connection.release();
    res.json({ firstName, lastName, age, gender, phone, email });
  } catch (error) {
    console.error('Ошибка обновления профиля:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});