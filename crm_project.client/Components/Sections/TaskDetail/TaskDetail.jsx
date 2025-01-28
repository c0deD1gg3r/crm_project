import './TaskDetail.css';
import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

const TaskDetail = ({ tasks, updateTask }) => {
  const { id } = useParams();
  const task = tasks.find(task => task.id.toString() === id);

  const [checkLists, setCheckLists] = useState([]);
  const [newListName, setNewListName] = useState('');
  const [newItems, setNewItems] = useState([]);
  const [currentListIndex, setCurrentListIndex] = useState(null);

  const inputRef = useRef(null);

  useEffect(() => {
    if (task && task.checkLists) {
      setCheckLists(task.checkLists);
      setNewItems(new Array(task.checkLists.length).fill(''));
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

  return (
    <div className='mainBlockTaskDetail'>
      <div className='leftBlockTaskDetail'>
        <h1 style={{ fontWeight: '400', fontSize: '1.8rem' }}>
          {String(task.id).slice(2, 6)} - ({task.createdAt}) {task.title}
        </h1>

        {/* Чек-листы */}
        <div className='checkListTaskDetail'>
          <div>
            <h2>Задача №{task.id}</h2>
          </div>
          <div className='descriptionBlock'>
            <p>{task.description}</p>
          </div>
          <h3>Чек-листы</h3>
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
                    <span>{completedItems} выполнено из {totalItems}</span>
                  </div>
                </div>
                <div style={{ marginTop: '20px' }}>
                  {list.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="checkListItem">
                      <input
                        type="checkbox"
                        checked={item.isChecked}
                        onChange={() => handleCheckItem(listIndex, itemIndex)}
                      />
                      <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                        <span className={item.isChecked ? 'checked' : ''} style={{ flex: 1 }}>
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
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button
                    className='btnAddListTaskDetail'
                    onClick={() => setCurrentListIndex(listIndex)}
                  >
                    Добавить пункт
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
      <div className='rightBlockTaskDetail'>
        <div className='headRightBlockTaskDetail'>
          <span style={{ fontSize: '13px' }}>Ждёт выполнения с</span>
        </div>
        <div className='contentRightBlockTasDetail'>
          <p>Здесь будет срок задачи</p>
          <ul style={{ marginTop: '20px' }}>
            <li>Крайний срок: </li>
            <li>Поставлена: {task.createdAt} {new Date(task.startTime).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</li>
            <li style={{ display: 'flex' }}>
              Стадия:{' '}
              {checkLists.map((list, listIndex) => {
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
              })}



              {/* {checkLists.reduce((acc, list) => acc + list.items.length, 0) > 0
                ? `${checkLists.reduce(
                  (acc, list) => acc + list.items.filter(item => item.isChecked).length,
                  0
                )} из ${checkLists.reduce((acc, list) => acc + list.items.length, 0)}`
                : 'Нет пунктов'} */}
            </li>
          </ul>
          <ul style={{ marginTop: '70px' }}>
            <li>Поставщик</li>
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