using System.Security.Cryptography;
using System.Text;
using static System.Net.Mime.MediaTypeNames;

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
                _HashPassword = value;
            }
        }

        public static string StringSha256Hash(string text) =>
        string.IsNullOrEmpty(text) ? string.Empty : BitConverter.ToString(new System.Security.Cryptography.SHA256Managed().ComputeHash(System.Text.Encoding.UTF8.GetBytes(text))).Replace("-", string.Empty);
    }

    public class UserCreate
    {
        public string Name { get; set; }
        public string Password { get; set; }
    }
}