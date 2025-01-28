import Header from "../../../Header/Header";
import SearchTask from "../SearchTask/SearchTask";
import HeadListTask from "../HeadListTask/HeadListTask";
import TasksSection from "../TasksSection/TasksSection";

const GeneralSections = ({ addTask, tasks, setTasks }) => {
  return (
    <>
      <Header />
      <SearchTask addTask={addTask} setTasks={setTasks} />
      <HeadListTask />
      <TasksSection tasks={tasks} />
    </>
  );
};

export default GeneralSections;