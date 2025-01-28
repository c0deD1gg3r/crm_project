import { NavLink } from "react-router-dom";
import "./HeadListTask.css";

const HeadListTask = () => {
  return (
    <div className="mainBlockContent">
      <div className="leftLink">
        <ul>
          <li>
            <NavLink className='linksList'>Список</NavLink>
          </li>
          <li>
            <NavLink className='linksList'>Сроки</NavLink>
          </li>
          <li>
            <NavLink className='linksList'>Мой план</NavLink>
          </li>
          <li>
            <NavLink className='linksList'>Календарь</NavLink>
          </li>
          <li>
            <NavLink className='linksList'>Гант</NavLink>
          </li>
        </ul>
      </div>

      <div className="rightLink">
        <ul>
          <li>
            <NavLink className='linksList'>Мои</NavLink>
          </li>
          <li>
            <NavLink className='linksList'>Просроченные</NavLink>
          </li>
          <li>
            <NavLink className='linksList'>Комментарии</NavLink>
          </li>
          <li>
            <NavLink className='linksList'>Прочитать все</NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HeadListTask;