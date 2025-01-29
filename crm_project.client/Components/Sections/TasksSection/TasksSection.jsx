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

  const calculateProgress = (task) => {
    const currentDate = new Date();
    const deadlineDate = new Date(task.endTime);
    const startDate = new Date(task.createdAt);

    const totalDuration = deadlineDate - startDate;
    const elapsedDuration = currentDate - startDate;
    const progress = (elapsedDuration / totalDuration) * 100;

    return Math.min(Math.max(progress, 0), 100);
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
      {/* <div className="rightBlockTasksSection" ref={rightBlockRef}>
        <h1>Контент правого блока</h1>
        <ul style={{ padding: '0' }}>
          {tasks.map((task) => (
            <li key={task.id} style={{ listStyleType: 'none', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <NavLink to={`/task/${task.id}`} style={{ flex: 1 }}>
                  #{task.id} {task.title}
                </NavLink>
              </div>
              <div style={{ backgroundColor: '#e0e0e0', height: '5px', borderRadius: '5px', marginTop: '5px' }}>
                <div
                  style={{
                    width: `${calculateProgress(task)}%`,
                    height: '100%',
                    backgroundColor: '#4285f4',
                    borderRadius: '5px',
                  }}
                />
              </div>
              <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ height: '5px', width: '2px', backgroundColor: 'red', position: 'absolute', left: 0 }} />
                <div style={{ height: '5px', width: '2px', backgroundColor: 'red', position: 'absolute', right: 0 }} />
              </div>
            </li>
          ))}
        </ul>
      </div> */}
    </div>
  );
};

export default TasksSection;
