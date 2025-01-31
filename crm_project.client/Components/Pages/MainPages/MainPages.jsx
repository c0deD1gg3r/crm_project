import GeneralSections from "../../Sections/GeneralSections/GeneralSections";

const MainPages = ({ addTask, tasks, setTasks, userName, setUserName }) => {
  return (
    <div>
      <GeneralSections addTask={addTask} tasks={tasks} setTasks={setTasks} userName={userName} setUserName={setUserName} />
    </div>
  );
};

export default MainPages;