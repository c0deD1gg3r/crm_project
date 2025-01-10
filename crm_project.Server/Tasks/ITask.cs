using UserApi.Model;

namespace TaskApi.Model
{
    public interface ITask
    {
        long Id { get; set; }
        string Title { get; set; }
        string Description { get; set; }
        DateTime? CreatedAt { get; set; }

        DefaultUser TaskCreator { get; set; }
    }
}