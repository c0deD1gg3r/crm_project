import './Login.css';
import { FaUser } from "react-icons/fa6";
import { FaLock } from "react-icons/fa";
import { FaLockOpen } from "react-icons/fa";

const Login = () => {
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
          />
        </div>
        <div className='inputContainerLogIN'>
          <FaLock className='iconInputLogIN' />
          <input
            type="password"
            placeholder='Password'
            className='inputLogIN'
          />
        </div>
        <button className='btn'>Войти</button>
      </div>
    </div>
  );
};

export default Login;
