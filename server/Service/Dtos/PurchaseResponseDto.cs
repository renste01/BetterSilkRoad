namespace Service.Dtos;

public class PurchaseResponseDto
{
    public int Id { get; set; }
    public string ProductId { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public string SellerUsername { get; set; } = string.Empty;
    public string? Images { get; set; }
    public decimal UnitPrice { get; set; }
    public int Quantity { get; set; }
    public DateTime PurchasedAtUtc { get; set; }
}