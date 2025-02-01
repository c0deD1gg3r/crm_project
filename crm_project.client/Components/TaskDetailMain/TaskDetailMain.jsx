import Header from "../../Header/Header";
import TaskDetail from "../TaskDetail/TaskDetail";

const TaskDetailMain = ({ tasks, updateTask, setTasks, userName, setUserName }) => {
  return (
    <div>
      <Header userName={userName} setUserName={setUserName} />
      <TaskDetail tasks={tasks} updateTask={updateTask} setTasks={setTasks} />
    </div>
  );
};

export default TaskDetailMain;