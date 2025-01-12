using Microsoft.EntityFrameworkCore;

namespace TaskApi.Model
{
    public class TaskContext : DbContext
    {
        public TaskContext(DbContextOptions<TaskContext> options) : base(options)
        {
        }

        public DbSet<TestTask> Tasks { get; set; } = null!;
    }
}