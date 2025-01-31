using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UserApi.Model;

namespace UserApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestUserController : ControllerBase
    {
        private UserContext _userContext;

        public TestUserController(UserContext userContext)
        {
            _userContext = userContext;
        }

        [HttpPost]
        public async Task<ActionResult<UserApi.Model.DefaultUser>> PostUser(UserApi.Model.UserCreate user)
        {
            UserApi.Model.DefaultUser UserCreating = new UserApi.Model.DefaultUser();

            UserCreating.Password = user.Password;
            //UserCreating.Password = DefaultUser.StringSha256Hash(UserCreating.Password);

            UserCreating.Name = user.Name;

            UserCreating.Id = _userContext.Users.Count();
            UserCreating.Id++;

            _userContext.Add(UserCreating);

            await _userContext.SaveChangesAsync();

            return CreatedAtAction(nameof(PostUser), UserCreating.Id, UserCreating);
            //return CreatedAtAction(nameof(PostUser), user);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserApi.Model.DefaultUser>>> GetUsers()
        {
            if (HttpContext.User.Identity.IsAuthenticated == false)
            {
                return Unauthorized();
            }

            return await _userContext.Users.Select(x => x).ToListAsync();
        }
    }
}