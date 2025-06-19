import './Login.css';
import { FaUser } from "react-icons/fa6";
import { FaLock } from "react-icons/fa";
import axios from 'axios';
import { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';

const Login = ({ setUserName }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorUsername, setErrorUsername] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Сброс предыдущих ошибок
    setErrorUsername('');
    setErrorPassword('');
    setLoginError('');

    // Валидация полей
    let hasError = false;
    if (!username.trim()) {
      setErrorUsername('Введите имя пользователя');
      hasError = true;
    }
    if (!password.trim()) {
      setErrorPassword('Введите пароль');
      hasError = true;
    }
    if (hasError) return;

    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        username: username.trim(),
        password: password.trim()
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Успешный вход
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username);
      localStorage.setItem('role', response.data.role);
      setUserName(response.data.username);
      navigate('/main');

    } catch (error) {
      console.error('Ошибка входа:', error);

      if (error.response) {
        // Ошибка от сервера (неверные данные, пользователь не найден и т.д.)
        setLoginError(error.response.data.error || 'Ошибка при входе');
      } else if (error.request) {
        // Запрос был отправлен, но ответ не получен
        setLoginError('Сервер не отвечает. Проверьте подключение.');
      } else {
        // Ошибка при настройке запроса
        setLoginError('Ошибка при отправке запроса');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='loginMainContentBlock'>
      <div>
        <h1 style={{ marginTop: '3rem', color: "#ffffffdf" }}>Вход в систему</h1>

        <form style={{ marginTop: '20px' }} onSubmit={handleLogin}>
          <div className='inputContainerLogIN'>
            <FaUser className='iconInputLogIN' />
            <input
              type="text"
              placeholder='Имя пользователя'
              className='inputLogIN'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
            />
          </div>
          {errorUsername && <p className="errorText">{errorUsername}</p>}

          <div className='inputContainerLogIN'>
            <FaLock className='iconInputLogIN' />
            <input
              type="password"
              placeholder='Пароль'
              className='inputLogIN'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          {errorPassword && <p className="errorText">{errorPassword}</p>}

          {loginError && (
            <p className="errorText" style={{ textAlign: 'center', margin: '10px 0' }}>
              {loginError}
            </p>
          )}

          <button
            type="submit"
            className='btn'
            style={{ width: '100%', height: '50px' }}
            disabled={isLoading}
          >
            {isLoading ? 'Вход...' : 'Войти'}
          </button>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
            <NavLink to='/register' className='btnReg'>
              Нет аккаунта? Зарегистрироваться.
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;