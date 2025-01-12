import './Login.css';
import { useState } from 'react';
import { FaUser } from "react-icons/fa6";
import { FaLock } from "react-icons/fa";

const Login = () => {
  const [idValue, setIdValue] = useState('');
  const [pwValue, setPwValue] = useState('');

  const clickLogin = (e) => {
    e.preventDefault();
    fetch("https://127.0.0.1:5173/Components/Login/Login.jsx?t=1736711450153", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: idValue, password: pwValue }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.message === "SUCCESS") {
          alert("Вы успешно вошли.");
          goToMain();
        } else {
          alert("Пожалуйста, проверьте свои данные для входа в систему.");
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert("Произошла ошибка. Пожалуйста, попробуйте еще раз.");
      });
  };

  const goToMain = () => {
    // Здесь будет логика для перехода на мэйн страницу
  };

  return (
    <div className='loginMainContentBlock'>
      <div>
        <h1 style={{ marginTop: '3rem' }}>Войти</h1>

        <div className='inputContainerLogIN'>
          <FaUser className='iconInputLogIN' />
          <input
            type="text"
            placeholder='Your Name'
            className='inputLogIN'
            value={idValue}
            onChange={(e) => setIdValue(e.target.value)}
          />
        </div>
        <div className='inputContainerLogIN'>
          <FaLock className='iconInputLogIN' />
          <input
            type="password"
            placeholder='Password'
            className='inputLogIN'
            value={pwValue}
            onChange={(e) => setPwValue(e.target.value)}
          />
        </div>
        <button className='btn' onClick={clickLogin}>Войти</button>
      </div>
    </div>
  );
};

export default Login;
