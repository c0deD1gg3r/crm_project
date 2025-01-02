using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UserApi.Models;

namespace UserApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UserTestController : ControllerBase
{
    private readonly UserContext _context;

    public UserTestController(UserContext context)
    { _context = context; }

    // Get: /api/UserTest
    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserDTO>>> GetUsers()
    {
        //return await _context.User.ToListAsync();
        return await _context.User.Select(x => UserToDTO(x)).ToListAsync();
    }

    private static UserDTO UserToDTO(User user) =>
        new UserDTO
        {
            Id = user.Id,
            Name = user.Name,
            isComplite = user.isComplite
        };
}