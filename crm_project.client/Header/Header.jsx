import { NavLink } from 'react-router-dom';
import './Header.css';
import { IoSearch } from "react-icons/io5";
import Logo from '../Img/LogoLawyer10.png';

const Header = ({ userName, setUserName }) => {
  const handleLogout = () => {
    setUserName('');
    localStorage.removeItem('userName');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <NavLink to='/' className='mainPageHeader'>
          <img src={Logo} alt="Logo" />
        </NavLink>

        <div style={{ marginLeft: '50px' }}>
          <div className='inputContainer'>
            <input type="text" placeholder='искать сотрудника, документ, прочее...' className='inputHeader' />
            <IoSearch className='icon' />
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {userName ? (
          <>
            <NavLink className='linkUserName' to={`/profile/${userName}`} style={{ marginRight: '50px', fontWeight: 'bold' }}>
              {userName}
            </NavLink>
            <button onClick={handleLogout} className='btn'>Выйти</button>
          </>
        ) : (
          <NavLink to='/Login'>
            <button className='btn'>Войти</button>
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default Header;