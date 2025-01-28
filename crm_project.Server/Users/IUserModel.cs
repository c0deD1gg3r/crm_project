namespace UserApi.Model
{
    public interface IUser
    {
        long Id { get; set; }
        string Name { get; set; }
        string Password { get; set; }
    }
}