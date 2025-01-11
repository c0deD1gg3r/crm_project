import { IoSearch } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { FaGear } from "react-icons/fa6";
import { BsFillLightningFill } from "react-icons/bs";
import './TasksSection.css';
import { useState, useRef, useEffect } from "react";
import { inputList, inputList2, inputList3 } from "./inputLists";

const TasksSection = () => {
  const [clearInputText, setClearInputText] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [inputValues, setInputValues] = useState({});

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

  const handleCheckboxChange = (title) => {
    setSelectedCheckboxes(prev => {
      if (prev.includes(title)) {
        return prev.filter(item => item !== title);
      } else {
        return [...prev, title];
      }
    });
  };

  const handleInputChange = (title, value) => {
    setInputValues(prev => ({
      ...prev,
      [title]: value
    }));
  };

  const removeCheckbox = (title) => {
    setSelectedCheckboxes(prev => prev.filter(item => item !== title));
    setInputValues(prev => {
      const newInputValues = { ...prev };
      delete newInputValues[title];
      return newInputValues;
    });
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

export default TasksSection;
