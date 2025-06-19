import './TaskDetail.css';
import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { FaCheckCircle, FaExclamationTriangle, FaClock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const TaskDetail = ({ tasks, updateTask, setTasks, userRole }) => {
  const { id } = useParams();
  const task = tasks.find(task => task.id.toString() === id);
  const navigate = useNavigate();

  // if (!task) {
  //   return <div>Задача не найдена</div>;
  // }

  const storageKey = `task_${id}_checklists`;

  // Загрузка из localStorage
  const loadFromLocalStorage = () => {
    if (!task) return [];
    const saved = localStorage.getItem(`task_${task.id}_checklists`);
    return saved ? JSON.parse(saved) : task?.checkLists || [];
  };

  const [checkLists, setCheckLists] = useState(loadFromLocalStorage());
  const [newListName, setNewListName] = useState('');
  const [newItems, setNewItems] = useState([]);
  const [currentListIndex, setCurrentListIndex] = useState(null);
  const [deadline, setDeadline] = useState(task?.endTime || '');
  const [isCompleted, setIsCompleted] = useState(false);
  const inputRef = useRef(null);
  const inputListRef = useRef(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showCompletedTask, setShowCompletedTask] = useState(false);
  const [showListInput, setShowListInput] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingListIndex, setEditingListIndex] = useState(null);
  const [editingItemIndex, setEditingItemIndex] = useState(null);

  // Инициализация состояния при монтировании компонента
  useEffect(() => {
    if (task) {
      const savedCheckLists = loadFromLocalStorage();
      const initialCheckLists = savedCheckLists.length > 0 ? savedCheckLists : (task.checkLists || []);

      setCheckLists(initialCheckLists);
      setNewItems(new Array(initialCheckLists.length).fill(''));
      setDeadline(task.endTime || '');
      setIsCompleted(task.isCompleted || false);

      if (savedCheckLists.length === 0 && task.checkLists) {
        localStorage.setItem(storageKey, JSON.stringify(task.checkLists));
      }
    }
  }, [task]);

  // Сохранение изменений в localStorage при обновлении checkLists
  useEffect(() => {
    if (task) {
      localStorage.setItem(storageKey, JSON.stringify(checkLists));
    }
  }, [checkLists, task]);

  const saveCheckLists = (updatedLists) => {
    setCheckLists(updatedLists);
    if (!task) return;

    const updatedTask = {
      ...task,
      checkLists: updatedLists,
      endTime: deadline,
    };

    console.log('Сохранение задачи с чек-листом:', updatedTask);
    updateTask(updatedTask);

    localStorage.setItem(storageKey, JSON.stringify(updatedLists));
  };

  // Добавление нового чек-листа
  const handleAddList = () => {
    if (newListName.trim()) {
      const updatedLists = [...checkLists, { name: newListName, items: [] }];
      setCheckLists(updatedLists);
      setNewListName('');
      setNewItems([...newItems, '']);
      saveCheckLists(updatedLists);
      setShowListInput(false);
    }
  };

  // Добавление нового пункта в чек-лист
  const handleAddItem = () => {
    if (currentListIndex !== null && newItems[currentListIndex]?.trim()) {
      const updatedLists = checkLists.map((list, index) =>
        index === currentListIndex
          ? { ...list, items: [...list.items, { text: newItems[currentListIndex], isChecked: false }] }
          : list
      );
      setCheckLists(updatedLists);
      const updatedNewItems = [...newItems];
      updatedNewItems[currentListIndex] = '';
      setNewItems(updatedNewItems);
      setCurrentListIndex(null);
      saveCheckLists(updatedLists);
    }
  };

  // Обработка изменения состояния пункта чек-листа
  const handleCheckItem = (listIndex, itemIndex) => {
    const updatedLists = checkLists.map((list, idx) =>
      idx === listIndex
        ? {
          ...list,
          items: list.items.map((item, i) =>
            i === itemIndex ? { ...item, isChecked: !item.isChecked } : item
          ),
        }
        : list
    );
    setCheckLists(updatedLists);
    saveCheckLists(updatedLists);
  };

  // Закрытие поля ввода при клике вне элемента | для пунктов чек-листа
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setCurrentListIndex(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Закрытие поля ввода при клике вне элемента | для чек-листов
  useEffect(() => {
    const handleClickOutside2 = (event) => {
      if (inputListRef.current && !inputListRef.current.contains(event.target)) {
        setShowListInput(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside2);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside2);
    };
  }, []);

  // Удаление пункта из чек-листа
  const handleDeleteItem = (listIndex, itemIndex) => {
    const updatedLists = checkLists.map((list, idx) =>
      idx === listIndex
        ? {
          ...list,
          items: list.items.filter((_, i) => i !== itemIndex),
        }
        : list
    );
    setCheckLists(updatedLists);
    saveCheckLists(updatedLists);
  };

  // Удаление чек-листа
  const handleDeleteCheckList = (listIndex) => {
    const updatedLists = checkLists.filter((_, idx) => idx !== listIndex);
    const updatedNewItems = newItems.filter((_, idx) => idx !== listIndex);

    setCheckLists(updatedLists);
    setNewItems(updatedNewItems);
    saveCheckLists(updatedLists);
  };

  // Обновление изменений после перемещения
  const handleDragEnd = (result, listIndex) => {
    if (!result.destination) return;

    const updatedItems = Array.from(checkLists[listIndex].items);
    const [movedItem] = updatedItems.splice(result.source.index, 1);
    updatedItems.splice(result.destination.index, 0, movedItem);

    const updatedLists = checkLists.map((list, idx) =>
      idx === listIndex ? { ...list, items: updatedItems } : list
    );

    setCheckLists(updatedLists);
    saveCheckLists(updatedLists);
  };


  // Обновление статуса задачи
  const getTaskStatus = () => {
    const currentDate = new Date();
    const deadlineDate = new Date(deadline);
    let statusText = '';
    let bgColor = '';
    let color = '';

    if (isCompleted) {
      statusText = 'Задача выполнена';
      bgColor = 'rgba(0, 254, 0, 0.96)';
      color = 'rgb(0, 120, 30)';
    } else if (currentDate > deadlineDate) {
      statusText = 'Задача просрочена!';
      bgColor = 'rgba(245, 73, 73, 0.7)';
      color = 'red';
    } else {
      statusText = 'Задача в процессе';
      bgColor = 'orange';
      color = 'rgb(255, 242, 0)';
    }

    return (
      <p style={{ backgroundColor: bgColor, padding: '10px', borderRadius: '5px', color: color, fontWeight: '500' }}>
        {statusText}
      </p>
    );
  };

  // Обновление статуса задачи но в другом месте =)
  const getTaskStatus2 = () => {
    const currentDate = new Date();
    const deadlineDate = new Date(deadline);
    if (isCompleted) {
      return <span style={{ color: 'green', fontWeight: 'bold' }}>Задача выполнена</span>;
    } else if (currentDate > deadlineDate) return <span style={{ color: 'red', fontWeight: 'bold' }}>Задача просрочена</span>;
    return <span style={{ color: 'orange', fontWeight: 'bold' }}>Задача в процессе</span>;
  };

  // Обновление иконки по статусу задачи
  const getTaskIcon = () => {
    const currentDate = new Date();
    const deadlineDate = new Date(task?.endTime);
    let icon, tooltipText;

    if (isCompleted) {
      icon = <FaCheckCircle className="iconDone" />;
      tooltipText = "Задача выполнена";
    } else if (currentDate > deadlineDate) {
      icon = <FaExclamationTriangle className="iconOverdue" />;
      tooltipText = "Задача просрочена";
    } else {
      icon = <FaClock className="iconLoading" />;
      tooltipText = "Задача в процессе";
    }

    return (
      <div className="tooltip-container">
        {icon}
        <span className="tooltip">{tooltipText}</span>
      </div>
    );
  };

  // Удаление задачи
  const handleDeleteTask = () => {
    setShowDeleteConfirmation(true);
  };

  // Если нет, то скрываем окно
  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  // Удаление задачи с переходом на главную
  const handleConfirmDelete = () => {
    const updatedTasks = tasks.map((t) =>
      t.id === task.id ? { ...t, isDeleted: true } : t
    );
    setTasks(updatedTasks);
    setShowDeleteConfirmation(false);
    localStorage.removeItem(`task_${task.id}_checklists`);
    navigate('/main');
  };

  // Завершение задачи
  const handleCompleteTask = () => {
    const updatedTask = {
      ...task,
      isCompleted: true,
      endTime: task.endTime,
      checkLists: checkLists
    };

    console.log('Выполнение заданий с помощью чек-листов:', updatedTask);
    updateTask(updatedTask);
    setIsCompleted(true);
    setShowCompletedTask(true);
    localStorage.setItem(`task_${task.id}_completed`, 'true');
    localStorage.removeItem(`task_${task.id}_checklists`);
    navigate('/main');
  };

  // Показывать модальное окно, если задача была завершена
  useEffect(() => {
    // const isTaskCompleted = localStorage.getItem(task?.id) === 'true';
    if (task?.isCompleted) {
      setShowCompletedTask(true);
    } else {
      setShowCompletedTask(false);
    }
  }, [task]);

  // Редактирование названия чек-листа
  const handleEditListName = (listIndex, newName) => {
    const updatedLists = checkLists.map((list, idx) =>
      idx === listIndex ? { ...list, name: newName } : list
    );
    setCheckLists(updatedLists);
    saveCheckLists(updatedLists);
  };

  // Редактирование текста пункта чек-листа
  const handleEditItemText = (listIndex, itemIndex, newText) => {
    const updatedLists = checkLists.map((list, idx) =>
      idx === listIndex
        ? {
          ...list,
          items: list.items.map((item, i) =>
            i === itemIndex ? { ...item, text: newText } : item
          ),
        }
        : list
    );
    setCheckLists(updatedLists);
    saveCheckLists(updatedLists);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}.${month}.${day} ${hours}:${minutes}`;
  };

  return (
    <div className='mainBlockTaskDetail'>
      <div>
        <div>
          <h1 style={{ fontWeight: '400', fontSize: '1.8rem', padding: '10px 0 5px 10px' }}>
            {String(task?.id)} - ({formatDateTime(task?.createdAt)}) {task?.title}
          </h1>
        </div>
        <div className='leftBlockTaskDetail'>
          <div className='checkListTaskDetail'>
            <div>
              <h2>Задача №{task?.id} - {getTaskStatus2()} {getTaskIcon(task)}</h2>
            </div>
            <div className='descriptionBlock'>
              <p>{task?.description}</p>
            </div>
            {checkLists.map((list, listIndex) => {
              const totalItems = list.items.length;
              const completedItems = list.items.filter(item => item.isChecked).length;
              const progressPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

              return (
                <div className='mainListTaskDetail' key={listIndex}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {isEditing && editingListIndex === listIndex ? (
                      <input
                        type="text"
                        value={list.name}
                        onChange={(e) => handleEditListName(listIndex, e.target.value)}
                        onBlur={() => setEditingListIndex(null)}
                      />
                    ) : (
                      <h4 onClick={() => { setIsEditing(true); setEditingListIndex(listIndex); }}>{list.name}</h4>
                    )}
                    <div className="progressContainer">
                      <div className="progress" style={{ width: `${progressPercentage}%` }}></div>
                    </div>
                    <div className='isDoneTaskDetail' style={{ marginLeft: '20px' }}>
                      <span>Выполнено {completedItems} из {totalItems}</span>
                    </div>
                  </div>
                  <DragDropContext onDragEnd={(result) => handleDragEnd(result, listIndex)}>
                    <Droppable droppableId={`list-${listIndex}`}>
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{ marginTop: '20px' }}
                        >
                          {list.items.map((item, itemIndex) => (
                            <Draggable key={itemIndex} draggableId={`item-${listIndex}-${itemIndex}`} index={itemIndex}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="checkListItem"
                                  style={{
                                    ...provided.draggableProps.style,
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginBottom: '10px',
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    checked={item.isChecked}
                                    onChange={() => handleCheckItem(listIndex, itemIndex)}
                                  />
                                  <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                                    {isEditing && editingItemIndex === itemIndex ? (
                                      <input
                                        type="text"
                                        value={item.text}
                                        onChange={(e) => handleEditItemText(listIndex, itemIndex, e.target.value)}
                                        onBlur={() => setEditingItemIndex(null)}
                                      />
                                    ) : (
                                      <span
                                        className={item.isChecked ? 'checked' : ''}
                                        style={{ flex: 1 }}
                                        onClick={() => { setIsEditing(true); setEditingItemIndex(itemIndex); }}
                                      >
                                        {item.text}
                                      </span>
                                    )}
                                    <button
                                      className="endButton"
                                      onClick={() => handleDeleteItem(listIndex, itemIndex)}
                                    >
                                      &#65794;
                                    </button>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                  {userRole === 'admin' && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <button
                        className='btnAddListTaskDetail'
                        onClick={() => setCurrentListIndex(listIndex)}
                      >
                        + <span>Добавить пункт</span>
                      </button>
                      <button
                        className='btnDeleteListTaskDetail'
                        onClick={() => handleDeleteCheckList(listIndex)}
                      >
                        Удалить чек-лист
                      </button>
                    </div>
                  )}
                  {currentListIndex === listIndex && (
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }} ref={inputRef}>
                      <input
                        type="text"
                        value={newItems[listIndex] || ''}
                        onChange={(e) => {
                          const updatedNewItems = [...newItems];
                          updatedNewItems[listIndex] = e.target.value;
                          setNewItems(updatedNewItems);
                        }}
                        placeholder="Добавить новый пункт"
                      />
                      <button style={{ marginTop: '15px' }} className='btnAddListTaskDetail' onClick={handleAddItem}>Сохранить</button>
                    </div>
                  )}
                </div>
              );
            })}
            <div className="addCheckListContainer" ref={inputListRef}>
              {userRole === 'admin' && (
                <>
                  {showListInput ? (
                    <>
                      <input
                        type="text"
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        placeholder="Добавить новый чек-лист"
                      />
                      <button className='addCheckList' onClick={handleAddList}>Сохранить</button>
                    </>
                  ) : (
                    <button className='addCheckList' onClick={() => setShowListInput(true)}>Добавить чек-лист</button>
                  )}
                </>
              )}
            </div>
          </div>

          {userRole === 'admin' && (
            <div className='btnEDDTaskDetail'>
              <button className='btnEDD' onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? 'Сохранить' : 'Редактировать'}
              </button>
              <button className='btnEDD' style={{ marginLeft: '20px' }} onClick={handleCompleteTask}>Завершить</button>
              {/* <button className='btnEDD' style={{ marginLeft: '20px' }} onClick={handleDeleteTask}>Удалить</button> */}
            </div>
          )}
          {showCompletedTask && (
            <div className='completedModal'>
              <div className='modalContent'>
                <p>Задача завершена</p>
                {/* <button className='btnEDD' style={{ marginLeft: '20px' }} onClick={handleDeleteTask}>Удалить</button> */}
              </div>
            </div>
          )}

          {/* {showDeleteConfirmation && (
            <div className="deleteConfirmationModal">
              <div className="modalContent">
                <p>Вы хотите удалить эту задачу?</p>
                <div>
                  <button onClick={handleConfirmDelete}>Да</button>
                  <button onClick={handleCancelDelete}>Нет</button>
                </div>
              </div>
            </div>
          )} */}
        </div>
      </div>
      <div className='rightBlockTaskDetail'>
        <div className='headRightBlockTaskDetail'>
          <span style={{ fontSize: '13px' }}>Ждёт выполнения до {deadline.split('T')[0]}</span>
        </div>
        <div className='contentRightBlockTasDetail'>
          {getTaskStatus()}
          <ul style={{ marginTop: '20px' }}>
            <li>
              <label>Крайний срок:</label>
              {userRole === 'admin' && (
                <input
                  type="date"
                  value={deadline.split('T')[0]}
                  onChange={(e) => {
                    setDeadline(e.target.value);
                    const updatedTask = { ...task, endTime: e.target.value };
                    updateTask(updatedTask);
                  }}
                />
              )}
            </li>
            <li>Поставлена: {task?.createdAt} {new Date(task?.startTime).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</li>
            <li style={{ display: 'flex' }}>
              Стадия:{' '}

              {/* После добавления нового чек-листа добавляется ещё один прогресс бар к уже существующему */}

              {/* {checkLists.map((list, listIndex) => {
                const totalItems = list.items.length;
                const completedItems = list.items.filter(item => item.isChecked).length;
                const progressPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
                return (
                  <div key={listIndex}>
                    <div className="progressContainer">
                      <div className="progress" style={{ width: `${progressPercentage}%`, marginTop: '13px' }}></div>
                    </div>
                  </div>
                );
              })} */}


              {checkLists.reduce((acc, list) => acc + list.items.length, 0) > 0
                ? `${checkLists.reduce(
                  (acc, list) => acc + list.items.filter(item => item.isChecked).length,
                  0
                )} из ${checkLists.reduce((acc, list) => acc + list.items.length, 0)}`
                : 'Нет пунктов'}
            </li>
          </ul>
          <ul style={{ marginTop: '70px' }}>
            <li>Постановщик: <b>{task?.creatorName}</b></li>
            {/* <li>
              Исполнитель
              <button className='btnAddListRightTaskDetail'>Добавить</button>
            </li>
            <li>
              Соисполнитель
              <button className='btnAddListRightTaskDetail'>Добавить</button>
            </li>
            <li>
              Наблюдатель
              <button className='btnAddListRightTaskDetail'>Добавить</button>
            </li> */}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;;;