namespace Service.Dtos;

public class ProductResponseDto
{
    public string ProductId { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Quantity { get; set; } 
    public int SellerId { get; set; }
    public string? Image { get; set; }
}