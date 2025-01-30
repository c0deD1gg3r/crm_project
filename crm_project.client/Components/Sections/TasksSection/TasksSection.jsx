import React, { useRef } from 'react';
import './TasksSection.css';
import { NavLink } from 'react-router-dom';
import { FaCheckCircle, FaExclamationTriangle, FaClock } from 'react-icons/fa';

const TasksSection = ({ tasks }) => {
  const leftBlockRef = useRef(null);
  const rightBlockRef = useRef(null);
  const filteredTasks = tasks.filter(task => !task.isDeleted);

  const handleScroll = (event) => {
    const { scrollTop } = event.target;
    if (rightBlockRef.current) {
      rightBlockRef.current.scrollTop = scrollTop;
    }
  };

  const getTaskIcon = (task) => {
    const currentDate = new Date();
    const deadline = new Date(task.endTime);
    let icon, tooltipText;

    if (task.isCompleted) {
      icon = <FaCheckCircle className="iconDone" />;
      tooltipText = "Задача выполнена";
    } else if (currentDate > deadline) {
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

  const getTaskText = (task) => {
    if (task.isCompleted) {
      return <span style={{ textDecoration: 'line-through' }}>{task.title}</span>;
    }
    return task.title;
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
            {filteredTasks.map((task) => (
              <div key={task.id}>
                <NavLink to={`/task/${task.id}`}>
                  <li style={{ listStyleType: 'none' }}>
                    #{task.id} {getTaskText(task)} {getTaskIcon(task)}
                  </li>
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
