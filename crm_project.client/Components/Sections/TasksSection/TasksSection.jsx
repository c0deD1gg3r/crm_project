import React, { useRef } from 'react';
import './TasksSection.css';

const TasksSection = () => {
  const leftBlockRef = useRef(null);
  const rightBlockRef = useRef(null);

  const handleScroll = (event) => {
    const { scrollTop } = event.target;
    if (rightBlockRef.current) {
      rightBlockRef.current.scrollTop = scrollTop; // Прокрутка правого блока синхронизируется с левым
    }
  };

  return (
    <div className="mainBlockContentTasksSection">
      <div
        className="leftBlockTasksSection"
        ref={leftBlockRef}
        onScroll={handleScroll}
      >
        <h1 style={{ color: '#242424', fontSize: '20px' }}>Задачи</h1>
        <ul>
          {/* Ваши элементы списка */}
          {Array.from({ length: 40 }, (_, index) => (
            <li key={index}>Задача {index + 1}</li>
          ))}
        </ul>
      </div>
      <div className="rightBlockTasksSection" ref={rightBlockRef}>
        <div>
          <h1>Контент правого блока</h1>
          {/* Дополнительный контент */}
        </div>
      </div>
    </div>
  );
};

export default TasksSection;
