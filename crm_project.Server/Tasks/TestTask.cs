using UserApi.Model;

namespace TaskApi.Model
{
    public class TestTask : ITask
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
    }

    public class TaskRequest
    {
        public string Title { get; set; }
        public string Description { get; set; }
    }
}