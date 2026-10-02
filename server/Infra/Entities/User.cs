using LinqToDB.Mapping;

namespace Infra.Entities;

[Table("Users")]
public class User
{
    [PrimaryKey, Identity]
    public int Id { get; set; }

    [Column, NotNull]
    public string Email { get; set; } = string.Empty;
  
    [Column] public string UserName { get; set; }

    [Column, NotNull]
    public string PasswordHash { get; set; } = string.Empty;

    [Column, NotNull]
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
  
    [Association(ThisKey = nameof(Id), OtherKey = nameof(Product.SellerId))]
    public List<Product> Products { get; set; }
}