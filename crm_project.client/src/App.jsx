import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from '../Components/Login/Login';
import MainPages from '../Components/Pages/MainPages/MainPages';
import { useState, useEffect } from 'react';
import TaskDetail from '../Components/Sections/TaskDetail/TaskDetail';

const App = () => {
    const [tasks, setTasks] = useState(() => {
        // Загрузка задач из localStorage
        const savedTasks = localStorage.getItem('tasks');
        return savedTasks ? JSON.parse(savedTasks) : [];
    });

    const addTask = (task) => {
        setTasks(prevTasks => {
            const updatedTasks = [...prevTasks, task];
            localStorage.setItem('tasks', JSON.stringify(updatedTasks)); // Сохранение в localStorage
            return updatedTasks;
        });
    };

    useEffect(() => {
        // Сохранение задач в localStorage при изменении
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<MainPages addTask={addTask} tasks={tasks} setTasks={setTasks} />} />
                <Route path='/Login' element={<Login />} />
                <Route path="/task/:id" element={<TaskDetail tasks={tasks} />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;