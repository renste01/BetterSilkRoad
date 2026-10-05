using Infra;
using Infra.Entities;
using LinqToDB;
using LinqToDB.Async;

namespace Service;

public class AuthService(DatabaseConnection db)
{
    private readonly DatabaseConnection _db = db;
    
    public async Task<User?> RegisterAsync(
        string email,
        string password,
        string userName)
    {
        var normalizedEmail = email.Trim().ToLowerInvariant();
        IQueryable<User> users = _db.Users;

        var exists = await users.AnyAsync(u => u.Email == normalizedEmail);
        if (exists) return null;

        var user = new User
        {
            Email = normalizedEmail,
            UserName = userName.Trim(),
            PasswordHash = PasswordHasher.Hash(password),
            CreatedAtUtc = DateTime.UtcNow,
        };

        user.Id = await _db.InsertWithInt32IdentityAsync(user);
        return user;
    }

    // Returns null if the email doesn't exist or the password is wrong.
    public async Task<User?> LoginAsync(string email, string password)
    {
        var normalizedEmail = email.Trim().ToLowerInvariant();
        IQueryable<User> users = _db.Users;
        var user = await users.FirstOrDefaultAsync(u => u.Email == normalizedEmail);

        if (user is null) return null;
        return PasswordHasher.Verify(password, user.PasswordHash) ? user : null;
    }
}