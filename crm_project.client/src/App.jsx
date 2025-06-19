import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from '../Components/Login/Login';
import MainPages from '../Components/Pages/MainPages/MainPages';
import { useState, useEffect } from 'react';
import Profile from '../Components/Profile/Profile';
import TaskDetailMain from '../Components/TaskDetailMain/TaskDetailMain';
import Register from '../Components/Register/Register';
import axios from 'axios';
import SelectionPage from '../Components/Aboba/SelectionPage';

const App = () => {
    const [userName, setUserName] = useState(localStorage.getItem('username') || '');
    const [tasks, setTasks] = useState([]);
    const [userRole, setUserRole] = useState(localStorage.getItem('role') || '');


    // Проверка аутентификации при загрузке
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const username = localStorage.getItem('username');
            const role = localStorage.getItem('role');
            if (username && role) {
                setUserName(username);
                setUserRole(role);
                setTasks([]);
                loadTasks();
            }
        }
    }, []);

    // Загрузка задач с сервера
    const loadTasks = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/tasks', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log('Полученные задачи:', response.data);
            setTasks(response.data);
            console.log('Пример задачи:', response.data[0]);
            const role = localStorage.getItem('role');
            console.log('Ваша роль:', role);
            console.log(`Загружено ${response.data.length} задач (роль: ${role})`);
        } catch (error) {
            console.error('Ошибка загрузки задач:', error);
            console.error('Детали ошибки:', error.response?.data);
        }
    };

    // Добавление задачи
    const addTask = async (task) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/tasks', task, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            loadTasks();
        } catch (error) {
            console.error('Ошибка добавления задачи:', error);
        }
    };

    // Обновление задачи
    const updateTask = async (updatedTask) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/tasks/${updatedTask.id}`, updatedTask, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            loadTasks();
        } catch (error) {
            console.error('Ошибка обновления задачи:', error);
        }
    };


    return (
        <BrowserRouter>
            <Routes>
                <Route path='/main' element={<MainPages
                    addTask={addTask}
                    tasks={tasks}
                    userName={userName}
                    setUserName={setUserName}
                    loadTasks={loadTasks}
                    setTasks={setTasks}
                    userRole={userRole}
                />}
                />
                <Route path='/' element={<SelectionPage />} />
                <Route path='/login' element={<Login setUserName={setUserName} />} />
                <Route path='/Register' element={<Register setUserName={setUserName} />} />
                <Route path="/task/:id" element={<TaskDetailMain
                    tasks={tasks}
                    userName={userName}
                    updateTask={updateTask}
                    setTasks={setTasks}
                    userRole={userRole}
                />}
                />
                <Route path="/profile/:profileName" element={<Profile />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;