import React, { useRef } from 'react';
import './TasksSection.css';
import { NavLink } from 'react-router-dom';

const TasksSection = ({ tasks }) => {
  const leftBlockRef = useRef(null);
  const rightBlockRef = useRef(null);

  const handleScroll = (event) => {
    const { scrollTop } = event.target;
    if (rightBlockRef.current) {
      rightBlockRef.current.scrollTop = scrollTop;
    }
  };

  return (
    <div className="mainBlockContentTasksSection">
      <div
        className="leftBlockTasksSection"
        onScroll={handleScroll}
        ref={leftBlockRef}
      >
        <h1 style={{ color: '#242424', fontSize: '20px' }}>Задачи</h1>
        <ul style={{ padding: '10px 0 10px 10px' }}>
          <div style={{ display: 'inline-block' }}>
            {!!tasks.length && tasks.map((task) => (
              <div key={task.id}>
                <NavLink to={`/task/${task.id}`}>
                  <li style={{ listStyleType: 'none' }}>#{task.id} {task.title}</li>
                </NavLink>
              </div>
            ))}
          </div>
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
