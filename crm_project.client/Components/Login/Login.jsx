import './Login.css';
import { FaUser } from "react-icons/fa6";
import { FaLock } from "react-icons/fa";
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setUserName }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errorName, setErrorName] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Сброс предыдущих ошибок
    setErrorName('');
    setErrorPassword('');

    let hasError = false;

    // Проверяем, введены ли логин и пароль
    if (!name.trim()) {
      setErrorName('Введите логин');
      hasError = true;
    }
    if (!password.trim()) {
      setErrorPassword('Введите пароль');
      hasError = true;
    }

    // Если есть ошибки, выходим из функции
    if (hasError) return;

    try {
      const response = await axios.post('https://localhost:7297/api/TestUser', {
        name: name,
        password: password
      });

      console.log('Успешный вход:', response.data);
      setUserName(name);
      goToMain();
    } catch (error) {
      console.error('Ошибка входа:', error);
    }
  };

  // Возврат на мэйн страницу
  const goToMain = () => {
    navigate('/main');
  };

  return (
    <div className='loginMainContentBlock'>
      <div>
        <h1 style={{ marginTop: '3rem', color: "#ffffffdf" }}>Войти</h1>

        <form onSubmit={handleLogin}>
          <div className='inputContainerLogIN'>
            <FaUser className='iconInputLogIN' />
            <input
              type="text"
              placeholder='Your Name'
              className='inputLogIN'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          {errorName && <p className="errorText">{errorName}</p>}

          <div className='inputContainerLogIN'>
            <FaLock className='iconInputLogIN' />
            <input
              type="password"
              placeholder='Password'
              className='inputLogIN'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {errorPassword && <p className="errorText">{errorPassword}</p>}

          <button type="submit" className='btn' style={{ width: '100%', height: '50px' }}>Войти</button>
        </form>
      </div>
    </div>
  );
};

export default Login;