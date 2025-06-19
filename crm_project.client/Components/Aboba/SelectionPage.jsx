import './SelectionPage.css';
import { NavLink } from 'react-router-dom';

const SelectionPage = () => {
  return (
    <div className='divAbob'>
      <NavLink to='/login'>
        <button className='btnLog'>Войти</button>
      </NavLink>
      <NavLink to='/Register'>
        <button className='btnRegg'>Зарегистрироваться</button>
      </NavLink>
    </div>
  );
};

export default SelectionPage;