import GeneralSections from "../../Sections/GeneralSections/GeneralSections";

const MainPages = ({ addTask, tasks, setTasks }) => {
  return (
    <div>
      <GeneralSections addTask={addTask} tasks={tasks} setTasks={setTasks} />
    </div>
  );
};

export default MainPages;