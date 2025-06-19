import './Register.css';
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';

const Register = ({ setUserName }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errorName, setErrorName] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Сброс предыдущих ошибок
    setErrorName('');
    setErrorPassword('');
    setErrorEmail('');
    setRegisterError('');

    let hasError = false;

    // Валидация полей
    if (!name.trim()) {
      setErrorName('Введите имя пользователя');
      hasError = true;
    }
    if (!password.trim()) {
      setErrorPassword('Введите пароль');
      hasError = true;
    } else if (password.length < 6) {
      setErrorPassword('Пароль должен содержать минимум 6 символов');
      hasError = true;
    }
    if (!email.trim()) {
      setErrorEmail('Введите email');
      hasError = true;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      setErrorEmail('Введите корректный email');
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/Register', {
        username: name,
        password: password,
        email: email
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Успешная регистрация:', response.data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username);
      setUserName(response.data.username);
      navigate('/main');
    } catch (error) {
      console.error('Полная ошибка регистрации:', error);
      if (error.response) {
        setRegisterError(error.response.data.error || 'Ошибка при регистрации');
      } else if (error.request) {
        setRegisterError('Сервер не отвечает. Проверьте подключение и запущен ли сервер.');
      } else {
        setRegisterError('Ошибка при отправке запроса: ' + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='registerMainContentBlock'>
      <div>
        <h1 style={{ marginTop: '3rem', color: "#ffffffdf" }}>Регистрация</h1>

        <form style={{ marginTop: '20px' }} onSubmit={handleRegister}>
          <div className='inputContainerRegister'>
            <FaUser className='iconInputRegister' />
            <input
              type="text"
              placeholder='Username'
              className='inputRegister'
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>
          {errorName && <p className="errorText">{errorName}</p>}

          <div className='inputContainerRegister'>
            <FaLock className='iconInputRegister' />
            <input
              type="password"
              placeholder='Password'
              className='inputRegister'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          {errorPassword && <p className="errorText">{errorPassword}</p>}

          <div className='inputContainerRegister'>
            <FaEnvelope className='iconInputRegister' />
            <input
              type="email"
              placeholder='Email'
              className='inputRegister'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          {errorEmail && <p className="errorText">{errorEmail}</p>}
          {registerError && <p className="errorText">{registerError}</p>}

          <button
            type="submit"
            className='btn'
            style={{ width: '100%', height: '50px' }}
            disabled={isLoading}
          >
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <NavLink to='/login' className='btnReg'>Уже есть аккаунт? Войти.</NavLink>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;