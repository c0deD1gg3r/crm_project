using System.Security.Cryptography;
using System.Text;

namespace UserApi.Model
{
    public class DefaultUser : IUser
    {
        public string Name { get; set; }
        public long Id { get; set; }

        private string _HashPassword;

        public string Password
        {
            get
            { return _HashPassword; }
            set
            {
                using (SHA256 sha256Hash = SHA256.Create())
                {
                    byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(value));
                    StringBuilder builder = new StringBuilder();
                    foreach (byte b in bytes)
                    {
                        builder.Append(b.ToString("x2")); // Convert to hexadecimal string
                    }
                    _HashPassword = builder.ToString();
                }
            }
        }
    }

    public class UserCreate
    {
        public string Name { get; set; }
        public string Password { get; set; }
    }
}