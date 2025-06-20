// import { IoSearch } from "react-icons/io5";
// import { RxCross2 } from "react-icons/rx";
// import { FaGear } from "react-icons/fa6";
// import { BsFillLightningFill } from "react-icons/bs";
import './SearchTask.css';
import { useState, useRef, useEffect } from "react";
// import { inputList } from "./inputLists";
import axios from 'axios';

const SearchTask = ({ setTasks }) => {
  // const [clearInputText, setClearInputText] = useState('');
  // const [isActive, setIsActive] = useState(false);
  // const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  // const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  // const [inputValues, setInputValues] = useState({});
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  // Открытие инпута для добавление полей
  // const Open = () => {
  //   setIsOpen(!isOpen);
  // };

  // Что-то вроде открытие инпута или удержание инпута
  // const Active = () => {
  //   setIsActive(true);
  // };

  // Очистка текстового поля инпута
  // const clearInput = () => {
  //   setClearInputText('');
  // };

  // Закрывает инпут вне контекста, а иначе не пашит
  const handleClickOutside = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      // setIsActive(false);
    }
  };

  // Закрывает инпут вне контекста, а иначе не пашит
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Проверка чекбокса есть/нет, если то при нажатие отрисует инпут
  // const handleCheckboxChange = (title) => {
  //   setSelectedCheckboxes(prev => {
  //     if (prev.includes(title)) {
  //       return prev.filter(item => item !== title);
  //     } else {
  //       return [...prev, title];
  //     }
  //   });
  // };

  // Отрисовка названия выбранного чекбокса с инпутом(Аналог handleCheckboxChange)
  // const handleInputChange = (title, value) => {
  //   setInputValues(prev => ({
  //     ...prev,
  //     [title]: value
  //   }));
  // };

  // Удаление чекбокса
  // const removeCheckbox = (title) => {
  //   setSelectedCheckboxes(prev => prev.filter(item => item !== title));
  //   setInputValues(prev => {
  //     const newInputValues = { ...prev };
  //     delete newInputValues[title];
  //     return newInputValues;
  //   });
  // };

  // Отправка POST запроса по таскам
  const handleSubmitTask = async (e) => {
    e.preventDefault();
    const endTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Токен не найден');
        return;
      }

      const response = await axios.post('http://localhost:5000/api/tasks', {
        title: taskTitle,
        description: taskDescription,
        endTime: endTime,
        creator: localStorage.getItem('username')
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const newTask = {
        ...response.data,
        checkLists: []
      };

      setTasks((prevTasks) => [...prevTasks, newTask]);
      setTaskTitle('');
      setTaskDescription('');
      setIsCreatingTask(false);
    } catch (error) {
      console.error('Ошибка создания задачи:', error);
    }
  };

  // Открытие формы по созданию тасок
  const handleCreateTaskClick = () => {
    setIsCreatingTask(!isCreatingTask);
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex' }}>
          <div>
            <h1 style={{ color: '#fff', fontWeight: '250' }}>Мои задачи</h1>
          </div>
          {/* <div style={{ color: '#fff', fontSize: '33px', fontWeight: '100', marginLeft: '30px' }}>
            &#9734;
          </div> */}
          <div style={{ display: 'flex', marginLeft: '55px' }}>
            {/* <div className='StrelkaVniz'>
              <button style={{ borderRadius: '0 5px 5px 0', backgroundColor: '#4277d3' }} className='btn'>&#9660;</button>
            </div> */}

            <div className='inputContainerTasks' ref={containerRef}>
              {/* <div>
                <input
                  type="text"
                  className='inputTasks'
                  placeholder='поиск'
                  value={clearInputText}
                  onChange={(e) => setClearInputText(e.target.value)}
                  onFocus={Active}
                />
                <IoSearch style={{ cursor: 'pointer' }} className={`iconSeachTasks ${isActive ? 'activeS' : ''}`} />
                <RxCross2 onClick={clearInput} className={`iconCrossTasks ${isActive ? 'activeC' : ''}`} />
              </div> */}
              {/* {isActive && (
                <div className="mainContentTasks">
                  <div className="firstContentTasks"> */}
              {/* TODO time laps */}
              {/* </div>
                  <div className="secondContentTasks">
                    <div>
                      {selectedCheckboxes.map((checkbox) => (
                        <div className="titleCheckboxBlock" key={checkbox}>
                          <h4>{checkbox}</h4>
                          <input
                            type="text"
                            value={inputValues[checkbox] || ''}
                            onChange={(e) => handleInputChange(checkbox, e.target.value)}
                            placeholder="Введите значение"
                            className="mainInput"
                          />
                          <button className="btnTitleCheckboxBlock" onClick={() => removeCheckbox(checkbox)}>&#65794;</button>
                        </div>
                      ))}
                    </div>
                    <div className="btnAddFieldMainBlock">
                      <button className={`btnAddField ${!isOpen ? 'active' : ''}`} onClick={Open}>Добавить поле</button>
                      <div className={`listsField ${!isOpen ? 'open' : ''}`}>
                        <div className="listsFieldDirections1">
                          {inputList.map((iList) => (
                            <div key={iList.id} className="listFieldMap1">
                              <input
                                type="checkbox"
                                className="inputILists1"
                                checked={selectedCheckboxes.includes(iList.title)}
                                onChange={() => handleCheckboxChange(iList.title)}
                                id={iList.id}
                              />
                              <ul style={{ listStyleType: 'none' }}>
                                <li><label htmlFor={iList.id}>{iList.title}</label></li>
                              </ul>
                            </div>
                          ))}
                        </div> */}

              {/* <div className="listsFieldDirections1">
                          {inputList2.map((iList2) => (
                            <div key={iList2.id} className="listFieldMap1">
                              <input
                                type="checkbox"
                                className="inputILists2"
                                checked={selectedCheckboxes.includes(iList2.title)}
                                onChange={() => handleCheckboxChange(iList2.title)}
                                id={iList2.title}
                              />
                              <ul style={{ listStyleType: 'none' }}>
                                <li><label htmlFor={iList2.title}>{iList2.title}</label></li>
                              </ul>
                            </div>
                          ))}
                        </div> */}

              {/* <div className="listsFieldDirections1">
                          {inputList3.map((iList3) => (
                            <div key={iList3.id} className="listFieldMap1">
                              <input
                                type="checkbox"
                                className="inputILists3"
                                checked={selectedCheckboxes.includes(iList3.title)}
                                onChange={() => handleCheckboxChange(iList3.title)}
                                id={iList3.title}
                              />
                              <ul style={{ listStyleType: 'none' }}>
                                <li><label htmlFor={iList3.title}>{iList3.title}</label></li>
                              </ul>
                            </div>
                          ))}
                        </div> */}
              {/* </div>
                    </div>
                    <div className="btnSearchClearMainBlock">
                      <button className="btnSearch"><IoSearch className="ioSearchBtn" size={20} /> НАЙТИ</button>
                      <button className="btnClear">СБРОСИТЬ</button>
                    </div>
                  </div>
                </div>
              )} */}
            </div>
          </div>

        </div>
        {/* <div className='rightBlock'>
          <div className='iconGear'>
            <FaGear style={{ marginTop: '5px' }} />
          </div>

          <div className='iconLightning'>
            <BsFillLightningFill style={{ marginTop: '5px' }} />
          </div>
        </div> */}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginLeft: '-30px' }}>
        <div className="create-task-container">
          <button className="btn" onClick={handleCreateTaskClick}>СОЗДАТЬ</button>
          {isCreatingTask && (
            <form className="mainCreateTask" onSubmit={handleSubmitTask}>
              <div>
                <input
                  type="text"
                  placeholder="Название задачи"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Описание задачи"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  required
                />
              </div>
              <button className="btnSubmit" type="submit">
                Создать задачу
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchTask;