import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from '../Components/Login/Login';
import MainPages from '../Components/Pages/MainPages/MainPages';

const App = () => {
    return (
        <>
            <BrowserRouter>


                <Routes>
                    <Route path='/' element={<MainPages />} />
                    <Route path='/Login' element={<Login />} />
                </Routes>
            </BrowserRouter>
        </>
    );
};

export default App;