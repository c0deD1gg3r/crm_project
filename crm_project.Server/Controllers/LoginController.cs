using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using UserApi.Model;

namespace UserApi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private UserContext userContext;

        public LoginController(UserContext userContext)
        {
            this.userContext = userContext;
        }

        [HttpPost]
        public async Task<ActionResult> Login(string username, string password)
        {
            if (ModelState.IsValid)
            {
                var usr = await userContext.Users.FirstOrDefaultAsync(x => x.Name == username);
                //var usr = await userContext.Users.FindAsync(username);

                if (usr == null)
                {
                    return BadRequest();
                }

                if (usr.Password != password)
                {
                    return BadRequest();
                }

                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, username),
                    new Claim(ClaimTypes.Role, "Admin"),
                };

                var claimsIdentify = new ClaimsIdentity
                    (claims, CookieAuthenticationDefaults.AuthenticationScheme);

                var authProperties = new AuthenticationProperties
                {
                    AllowRefresh = true,
                    ExpiresUtc = DateTimeOffset.UtcNow.AddDays(7),
                    IsPersistent = true,
                    IssuedUtc = DateTimeOffset.UtcNow
                };

                await HttpContext.SignInAsync(
                    CookieAuthenticationDefaults.AuthenticationScheme,
                    new ClaimsPrincipal(claimsIdentify),
                    authProperties);

                return Ok();
            }

            return BadRequest();
        }

        [Route("~/Logout")]
        [HttpDelete]
        public async Task<IActionResult> Out()
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            if (!HttpContext.User.Identity.IsAuthenticated)
            {
                return BadRequest();
            }

            await HttpContext.SignOutAsync();
            return Ok();
        }
    }
}