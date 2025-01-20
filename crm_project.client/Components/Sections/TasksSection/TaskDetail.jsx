import React from 'react';
import { useParams } from 'react-router-dom';

const TaskDetail = ({ tasks }) => {
  const { id } = useParams();
  const task = tasks.find(task => task.id.toString() === id);

  if (!task) {
    return <div>Задача не найдена</div>;
  }

  return (
    <div>
      <h1>{task.id}</h1>
      <p>{task.description}</p>
    </div>
  );
};

export default TaskDetail;