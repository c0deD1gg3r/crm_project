import './Login.css';
import { FaUser } from "react-icons/fa6";
import { FaLock } from "react-icons/fa";
import axios from 'axios';
import { useState } from 'react';

const Login = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://localhost:7297/api/TestUser', {
        name: name,
        password: password
      });

      console.log('Login successful:', response.data);
      goToMain();
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const goToMain = () => {
    // Main page
  };

  return (
    <div className='loginMainContentBlock'>
      <div>
        <h1 style={{ marginTop: '3rem' }}>Войти</h1>

        <form onSubmit={handleLogin}>
          <div className='inputContainerLogIN'>
            <FaUser className='iconInputLogIN' />
            <input
              type="text"
              placeholder='Your Name'
              className='inputLogIN'
              value={name}
              onChange={(e) => setName(e.target.value)} // обновляем состояние
            />
          </div>
          <div className='inputContainerLogIN'>
            <FaLock className='iconInputLogIN' />
            <input
              type="password"
              placeholder='Password'
              className='inputLogIN'
              value={password}
              onChange={(e) => setPassword(e.target.value)} // обновляем состояние
            />
          </div>
          <button type="submit" className='btn'>Войти</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
