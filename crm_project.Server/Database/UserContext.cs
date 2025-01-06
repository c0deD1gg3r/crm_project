using Microsoft.EntityFrameworkCore;

namespace UserApi.Model
{
    public class UserContext : DbContext
    {
        public UserContext(DbContextOptions<UserContext> options) : base(options)
        {
        }

        public DbSet<UserApi.Model.DefaultUser> Users { get; set; } = null!;
    }
}