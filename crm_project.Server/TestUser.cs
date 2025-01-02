namespace UserApi.Models
{
    public class User
    {
        public int Id { get; set; }
        public string? Name { get; set; }

        public bool isComplite { get; set; }

        public string? Secret { get; set; }
    }
}