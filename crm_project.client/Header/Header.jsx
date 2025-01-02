import { NavLink } from 'react-router-dom';
import './Header.css';
import { IoSearch } from "react-icons/io5";

const Header = () => {
  const buttons = document.querySelectorAll(".btn");
  buttons.forEach((button) => {
    button.onclick = function (e) {
      let x = e.clientX - e.target.offsetLeft;
      let y = e.clientY - e.target.offsetTop;
      let ripple = document.createElement("span");
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      this.appendChild(ripple);
      setTimeout(function () {
        ripple.remove();
      }, 600);
    };
  });

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex' }}>
        <div>
          <NavLink to='/' className='mainPageHeader'>
            <h1 style={{ color: 'rgba(255, 255, 255, 0.87)', fontWeight: 450 }}>A1 GROUP</h1>
          </NavLink>
        </div>

        <div style={{ marginLeft: '50px' }}>
          <div className='inputContainer'>
            <input
              type="text"
              placeholder='искать сотрудника, документ, прочее...'
              className='inputHeader'
            />
            <IoSearch className='icon' />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex' }}>
        <NavLink to='/Login'>
          <button className='btn'>Войти</button>
        </NavLink>

        <NavLink to='/Register'>
          <button className='btn'>Зарегистрироваться</button>
        </NavLink>
      </div>
    </div>
  );
};

export default Header;
