import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from '../Components/Login/Login';
import MainPages from '../Components/Pages/MainPages/MainPages';
import { useState, useEffect } from 'react';
import TaskDetail from '../Components/TaskDetail/TaskDetail';
import Profile from '../Components/Profile/Profile';
import TaskDetailMain from '../Components/TaskDetailMain/TaskDetailMain';

const App = () => {
    const [userName, setUserName] = useState(localStorage.getItem('userName') || '');

    // Сохранение в localStorage при изменении имени пользователя
    useEffect(() => {
        if (userName) {
            localStorage.setItem('userName', userName);
        } else {
            localStorage.removeItem('userName');
        }
    }, [userName]);

    // Загрузка задач из localStorage
    const [tasks, setTasks] = useState(() => {
        const savedTasks = localStorage.getItem('tasks');
        return savedTasks ? JSON.parse(savedTasks) : [];
    });

    // Добавление задачи
    const addTask = (task) => {
        setTasks(prevTasks => {
            const updatedTasks = [...prevTasks, task];
            localStorage.setItem('tasks', JSON.stringify(updatedTasks));
            return updatedTasks;
        });
    };

    // Обновление существующей задачи
    const updateTask = (updatedTask) => {
        setTasks(prevTasks => {
            const updatedTasks = prevTasks.map(task =>
                task.id === updatedTask.id ? updatedTask : task
            );
            localStorage.setItem('tasks', JSON.stringify(updatedTasks));
            return updatedTasks;
        });
    };

    // Сохранение задач в localStorage при изменении
    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/main' element={<MainPages
                    addTask={addTask}
                    setTasks={setTasks}
                    tasks={tasks}
                    userName={userName}
                    setUserName={setUserName}
                />}
                />
                <Route path='/' element={<Login setUserName={setUserName} />} />
                <Route path="/task/:id" element={<TaskDetailMain
                    addTask={addTask}
                    setTasks={setTasks}
                    tasks={tasks}
                    userName={userName}
                    setUserName={setUserName} />} />
                <Route path="/profile/:profileName" element={<Profile />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;