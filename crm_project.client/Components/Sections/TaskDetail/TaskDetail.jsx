import './TaskDetail.css';
import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const TaskDetail = ({ tasks, updateTask }) => {
  const { id } = useParams();
  const task = tasks.find(task => task.id.toString() === id);

  const [checkLists, setCheckLists] = useState([]);
  const [newListName, setNewListName] = useState('');
  const [newItems, setNewItems] = useState([]);
  const [currentListIndex, setCurrentListIndex] = useState(null);
  const [deadline, setDeadline] = useState('');

  const inputRef = useRef(null);

  useEffect(() => {
    if (task && task.checkLists) {
      setCheckLists(task.checkLists);
      setNewItems(new Array(task.checkLists.length).fill(''));
      setDeadline(task.endTime);
    }
  }, [task]);

  if (!task) {
    return <div>Задача не найдена</div>;
  }

  // Сохранение изменений в задаче
  const saveCheckLists = (updatedLists) => {
    const updatedTask = { ...task, checkLists: updatedLists };
    updateTask(updatedTask);
  };

  // Добавление нового чек-листа
  const handleAddList = () => {
    if (newListName.trim()) {
      const updatedLists = [...checkLists, { name: newListName, items: [] }];
      setCheckLists(updatedLists);
      setNewListName('');
      setNewItems([...newItems, '']);
      saveCheckLists(updatedLists);
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

  // Закрытие поля ввода при клике вне элемента
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
    setCheckLists(updatedLists);
    saveCheckLists(updatedLists); // Сохраняем обновленные чек-листы
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

  const getTaskStatus = () => {
    const currentDate = new Date();
    const deadlineDate = new Date(deadline);

    if (task.isCompleted) {
      return "Задача выполнена";
    } else if (currentDate > deadlineDate) {
      return "Задача просрочена";
    } else {
      return "Задача в процессе";
    }
  };

  return (
    <div className='mainBlockTaskDetail'>
      <div>
        <div>
          <h1 style={{ fontWeight: '400', fontSize: '1.8rem', padding: '10px 0 5px 10px' }}>
            {String(task.id).slice(2, 6)} - ({task.createdAt}) {task.title}
          </h1>
        </div>
        <div className='leftBlockTaskDetail'>
          {/* Чек-листы */}
          <div className='checkListTaskDetail'>
            <div>
              <h2>Задача №{task.id} - ждёт выполнения, </h2>
            </div>
            <div className='descriptionBlock'>
              <p>{task.description}</p>
            </div>
            {checkLists.map((list, listIndex) => {
              const totalItems = list.items.length;
              const completedItems = list.items.filter(item => item.isChecked).length;
              const progressPercentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

              return (
                <div className='mainListTaskDetail' key={listIndex}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h4>{list.name}</h4>
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
                                    <span
                                      className={item.isChecked ? 'checked' : ''}
                                      style={{ flex: 1 }}
                                    >
                                      {item.text}
                                    </span>
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
                      <button onClick={handleAddItem}>Сохранить</button>
                    </div>
                  )}
                </div>
              );
            })}
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="Добавить новый чек-лист"
              />
              <button onClick={handleAddList}>Добавить чек-лист</button>
            </div>
          </div>

          <div className='btnEDDTaskDetail'>
            <button className='btnEDD'>Редактировать</button>
            <button className='btnEDD' style={{ marginLeft: '20px' }}>Завершить</button>
            <button className='btnEDD' style={{ marginLeft: '20px' }}>Удалить</button>
          </div>
        </div>
      </div>
      <div className='rightBlockTaskDetail'>
        <div className='headRightBlockTaskDetail'>
          <span style={{ fontSize: '13px' }}>Ждёт выполнения с</span>
        </div>
        <div className='contentRightBlockTasDetail'>
          <p>{getTaskStatus()}</p>
          <ul style={{ marginTop: '20px' }}>
            <li>
              <label>Крайний срок:</label>
              <input
                type="date"
                value={deadline.split('T')[0]}
                onChange={(e) => {
                  setDeadline(e.target.value);
                  const updatedTask = { ...task, endTime: e.target.value };
                  updateTask(updatedTask);
                }}
              />
            </li>
            <li>Поставлена: {task.createdAt} {new Date(task.startTime).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</li>
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
            <li>Постановщик</li>
            <li>
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
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;;;