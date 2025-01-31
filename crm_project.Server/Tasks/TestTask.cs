using UserApi.Model;

// comment
namespace TaskApi.Model
{
    public class TestTask : ITask
    {
        public int Id { get; set; }
        public long CreatorID { get; set; }
        public long WorkerID { get; set; }
        public long CoWorkerID { get; set; }
        public long ObserverID { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime StartTime { get; set; } = DateTime.Now;
        public DateTime EndTime { get; set; } = DateTime.UnixEpoch;

        public void SetNewData(TaskRequest request)
        {
            CreatorID = request.CreatorID;
            WorkerID = request.WorkerID;
            CoWorkerID = request.CoWorkerID;
            ObserverID = request.ObserverID;
            Title = request.Title;
            Description = request.Description;
            StartTime = request.StartTime;
            EndTime = request.EndTime;
        }
    }

    public class TaskRequest
    {
        public long CreatorID { get; set; }
        public long WorkerID { get; set; }
        public long CoWorkerID { get; set; }
        public long ObserverID { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
    }
}