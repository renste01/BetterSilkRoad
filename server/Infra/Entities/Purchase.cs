using LinqToDB.Mapping;

namespace Infra.Entities;

[Table("Purchases")]
public class Purchase
{
    [PrimaryKey, Identity] public int Id { get; set; }
    [Column, NotNull] public int BuyerId { get; set; }
    [Column, NotNull] public string ProductId { get; set; } = string.Empty;
    [Column, NotNull] public string ProductName { get; set; } = string.Empty;
    [Column, NotNull] public string SellerUsername { get; set; } = string.Empty;
    [Column] public string? Images { get; set; }
    [Column, NotNull] public decimal UnitPrice { get; set; }
    [Column, NotNull] public int Quantity { get; set; }
    [Column, NotNull] public DateTime PurchasedAtUtc { get; set; }
}