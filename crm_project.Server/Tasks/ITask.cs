using UserApi.Model;

namespace TaskApi.Model
{
    public interface ITask
    {
        int Id { get; set; }
        string Title { get; set; }
        string Description { get; set; }
    }
}