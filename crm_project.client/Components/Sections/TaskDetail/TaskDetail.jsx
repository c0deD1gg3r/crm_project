import './TaskDetail.css';
import { useParams } from 'react-router-dom';

const TaskDetail = ({ tasks }) => {
  const { id } = useParams();
  const task = tasks.find(task => task.id.toString() === id);

  // Уникальная уникальность уникального id (Unique uniqueness of unique id)
  const UUOUId = String(task.id).slice(2, -6) + String(task.id).slice(6, 8);

  if (!task) {
    return <div>Задача не найдена</div>;
  }

  return (
    <div className='mainBlockTaskDetail'>
      <div className='leftBlockTaskDetail'>
        <h1 style={{ color: '#fff', fontWeight: '400' }}>
          #{UUOUId} - ({task.createdAt}) {task.title}
        </h1>
        <p>{task.description}</p>
      </div>

      <div className='rightBlockTaskDetail'>
        <h1>ХУЙ</h1>
      </div>
    </div>
  );
};

export default TaskDetail;
