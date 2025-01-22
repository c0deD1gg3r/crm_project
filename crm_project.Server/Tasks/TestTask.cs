using UserApi.Model;

namespace TaskApi.Model
{
    public class TestTask : ITask
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime StartTime { get; set; } = DateTime.Now;
        public DateTime EndTime { get; set; } = DateTime.UnixEpoch;
    }

    public class TaskRequest
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
    }
}