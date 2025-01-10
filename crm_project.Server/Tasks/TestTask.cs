using UserApi.Model;

namespace TaskApi.Model
{
    public class TestTask : ITask
    {
        public long Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DefaultUser TaskCreator { get; set; }
    }

    public class TaskCreation
    {
        public string Title { get; set; }
        public string Description { get; set; }

        public long uid { get; set; }
    }
}