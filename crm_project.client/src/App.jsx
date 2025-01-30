import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from '../Components/Login/Login';
import MainPages from '../Components/Pages/MainPages/MainPages';
import { useState, useEffect } from 'react';
import TaskDetail from '../Components/Sections/TaskDetail/TaskDetail';

const App = () => {

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
                <Route path='/' element={<MainPages addTask={addTask} tasks={tasks} setTasks={setTasks} />} />
                <Route path='/Login' element={<Login />} />
                <Route path="/task/:id" element={<TaskDetail tasks={tasks} updateTask={updateTask} setTasks={setTasks} />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
