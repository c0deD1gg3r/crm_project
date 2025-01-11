import { NavLink } from 'react-router-dom';
import './Header.css';
import { IoSearch } from "react-icons/io5";
import Logo from '../Img/LogoLawyer10.png';

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
            <img src={Logo} alt="" />
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
          <button style={{ width: '5vw' }} className='btn'>Войти</button>
        </NavLink>
      </div>
    </div>
  );
};

export default Header;
