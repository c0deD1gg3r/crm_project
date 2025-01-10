import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from '../Header/Header';
import Login from '../Components/Login/Login';
import Register from '../Components/Register/Register';
import MainPages from '../Components/Pages/MainPages/MainPages';

const App = () => {
    return (
        <>
            <BrowserRouter>
                <Header />

                <Routes>
                    <Route path='/' element={<MainPages />} />
                    <Route path='/Login' element={<Login />} />
                    <Route path='/Register' element={<Register />} />
                </Routes>
            </BrowserRouter>
        </>
    );
};

export default App;