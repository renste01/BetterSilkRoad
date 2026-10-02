using System.ComponentModel.DataAnnotations;
using LinqToDB.Mapping;

namespace Infra.Entities;

[Table("Products")]
public class Product
{
    [PrimaryKey] public string ProductId { get; set; } = string.Empty;
    [Column, NotNull] public string ProductName { get; set; } = string.Empty;
    [Column, NotNull] public int SellerId { get; set; }
    [Column, NotNull] public string ProductDescription { get; set; } = string.Empty;
    [Column, NotNull] public string ProductCategory { get; set; } = string.Empty;
    [Column, NotNull] public decimal Price { get; set; }
    [Column, NotNull] public int Quantity { get; set; }
    [Column] public string? ImageUrl { get; set; }
    
    [LinqToDB.Mapping.Association(
        ThisKey = nameof(SellerId), 
        OtherKey = nameof(User.Id))]
    public User? Seller { get; set; }
}