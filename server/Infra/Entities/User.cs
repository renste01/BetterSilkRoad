using LinqToDB.Mapping;

namespace Infra.Entities;

public class User
{
    [PrimaryKey]public string UserId { get; set; }
    [Column] public string UserName { get; set; }
    
    [Association(ThisKey = nameof(UserId), OtherKey = nameof(Product.SellerId))]
    public List<Product> Products { get; set; }
}