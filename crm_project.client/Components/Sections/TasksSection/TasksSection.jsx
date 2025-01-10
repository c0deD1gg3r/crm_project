import { IoSearch } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { FaGear } from "react-icons/fa6";
import { BsFillLightningFill } from "react-icons/bs";
import './TasksSection.css';
import { useState, useRef, useEffect } from "react";
import { inputList, inputList2 } from "./inputLists";

const TasksSection = () => {
  const [clearInputText, setClearInputText] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null); // Создаем реф для контейнера

  const Open = () => {
    setIsOpen(!isOpen);
  };

  const Active = () => {
    setIsActive(true);
  };

  const clearInput = () => {
    setClearInputText('');
  };

  const handleClickOutside = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setIsActive(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
              <button style={{ borderRadius: '5px 0 0 5px' }} className='btn'>СОЗДАТЬ </button>
            </div>

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
                    {/*  */}
                  </div>
                  <div className="secondContentTasks">
                    <div className="btnAddFieldMainBlock">
                      <button className={`btnAddField ${!isOpen ? 'active' : ''}`} onClick={Open}>Добавить поле</button>
                      <div className={`listsField ${!isOpen ? 'open' : ''}`}>
                        <div className="listsFieldDirections1">
                          {inputList.map((iList) => {
                            return (
                              <div key={iList.id} className="listFieldMap1">
                                <ul style={{ listStyleType: 'none' }}>
                                  <li>{iList.title}</li>
                                </ul>
                              </div>
                            );
                          })}
                        </div>

                        <div className="listsFieldDirections1">
                          {inputList2.map((iList2) => {
                            return (
                              <div key={iList2.id} className="listFieldMap1">
                                <ul style={{ listStyleType: 'none' }}>
                                  <li>{iList2.title}</li>
                                </ul>
                              </div>
                            );
                          })}
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

export default TasksSection;
