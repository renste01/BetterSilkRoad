using LinqToDB.Mapping;

namespace Infra.Entities;

public class Product
{
    [PrimaryKey]public string ProductId { get; set; }
    [Column]public string ProductName { get; set; }
    [Column]public string SellerId { get; set; }
    [Column]public string ProductDesribtion { get; set; }
    [Column]public string ProductCategory { get; set; }
    [Column]public decimal Price { get; set; }
    [Column]public int Quantity { get; set; }
    
    [Association(ThisKey = nameof(SellerId), OtherKey = nameof(User.Id))]
    public User Seller { get; set; }
}