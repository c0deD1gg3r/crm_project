import { IoSearch } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { FaGear } from "react-icons/fa6";
import { BsFillLightningFill } from "react-icons/bs";
import './SearchTask.css';
import { useState, useRef, useEffect } from "react";
import { inputList, inputList2, inputList3 } from "./inputLists";
import axios from 'axios';

const SearchTask = ({ addTask, setTasks }) => {
  const [clearInputText, setClearInputText] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [inputValues, setInputValues] = useState({});
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  const loginAction = (e) => {
    setValidationErrors({});
    e.preventDefault();
    setIsSubmitting(true);
    let payload = { email: email, password: password, };
    axios.post('/api/login', payload)
      .then((r) => {
        setIsSubmitting(false);
        localStorage.setItem('token', r.data.token);
        navigate("/dashboard");
      })
      .catch((e) => {
        setIsSubmitting(false);
        if (e.response.data.errors != undefined) {
          console.log(e.response.data.errors);
        }
      });
  };

  // Не помню для чего, но без этого код не работает(вроде, проверять не стану)

  const Open = () => {
    setIsOpen(!isOpen);
  };

  // Не помню для чего, но без этого код не работает(вроде, проверять не стану)

  const Active = () => {
    setIsActive(true);
  };


  // Очистка текстового поля инпута
  const clearInput = () => {
    setClearInputText('');
  };

  // Закрывает инпут вне контекста, а иначе не пашит

  const handleClickOutside = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setIsActive(false);
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

  const handleCheckboxChange = (title) => {
    setSelectedCheckboxes(prev => {
      if (prev.includes(title)) {
        return prev.filter(item => item !== title);
      } else {
        return [...prev, title];
      }
    });
  };

  // Отрисовка названия выбранного чекбокса с инпутом(Аналог handleCheckboxChange)

  const handleInputChange = (title, value) => {
    setInputValues(prev => ({
      ...prev,
      [title]: value
    }));
  };


  // Удаление чекбокса

  const removeCheckbox = (title) => {
    setSelectedCheckboxes(prev => prev.filter(item => item !== title));
    setInputValues(prev => {
      const newInputValues = { ...prev };
      delete newInputValues[title];
      return newInputValues;
    });
  };

  // Отправка POST запроса по таскам

  const handleSubmitTask = async (e) => {
    e.preventDefault();
    const currentDate = new Date();
    const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}.${String(currentDate.getMonth() + 1).padStart(2, '0')}.${currentDate.getFullYear()}`;
    const startTime = new Date().toISOString();
    const endTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    try {
      const response = await axios.post('https://localhost:7297/api/Task', {
        title: taskTitle,
        description: taskDescription,
        startTime: startTime,
        endTime: endTime,
        createdAt: formattedDate,
      });

      const newTask = {
        id: response.data,
        title: taskTitle,
        description: taskDescription,
        createdAt: formattedDate,
        startTime: startTime,
        endTime: endTime,
      };

      setTasks((prevTasks) => [...prevTasks, newTask]);
      setTaskTitle('');
      setTaskDescription('');
      setIsCreatingTask(false);
      console.log('Task created:', newTask);
    } catch (error) {
      console.error('Error creating the task:', error);
    }
  };



  // Открытие формы по созданию тасок

  const handleCreateTaskClick = () => {
    setIsCreatingTask(!isCreatingTask);
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex' }}>
          <div>
            <h1 style={{ color: '#fff', fontWeight: '250' }}>Мои задачи</h1>
          </div>

          <div style={{ color: '#fff', fontSize: '33px', fontWeight: '100', marginLeft: '30px' }}>
            &#9734;
          </div>

          <div style={{ display: 'flex', marginLeft: '55px' }}>
            <div>
              <button style={{ borderRadius: '5px 0 0 5px' }} className='btn' onClick={handleCreateTaskClick}>СОЗДАТЬ </button>
            </div>

            {isCreatingTask && (
              <form onSubmit={handleSubmitTask}>
                <input
                  type="text"
                  placeholder="Название задачи"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Описание задачи"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  required
                />
                <button type="submit">Отправить</button>
              </form>
            )}

            <div className='StrelkaVniz'>
              <button style={{ borderRadius: '0 5px 5px 0', backgroundColor: '#4277d3' }} className='btn'>&#9660;</button>
            </div>

            <div className='inputContainerTasks' ref={containerRef}>
              <div>
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
              </div>
              {isActive && (
                <div className="mainContentTasks">
                  <div className="firstContentTasks">
                    {/* Не помню что должно быть, но на всякий случай оставлю */}
                  </div>
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
                        </div>

                        <div className="listsFieldDirections1">
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
                        </div>

                        <div className="listsFieldDirections1">
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
                        </div>
                      </div>
                    </div>
                    <div className="btnSearchClearMainBlock">
                      <button className="btnSearch"><IoSearch className="ioSearchBtn" size={20} /> НАЙТИ</button>
                      <button className="btnClear">СБРОСИТЬ</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='rightBlock'>
          <div className='iconGear'>
            <FaGear style={{ marginTop: '5px' }} />
          </div>

          <div className='iconLightning'>
            <BsFillLightningFill style={{ marginTop: '5px' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchTask;
