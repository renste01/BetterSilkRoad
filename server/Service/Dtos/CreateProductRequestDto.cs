namespace Service.Dtos;

public class CreateProductRequestDto
{
    public string ProductName { get; set; }
    public string SellerId { get; set; }
    public string ProductDescribtion { get; set; }
    public string ProductCategory { get; set; }
    public decimal Price { get; set; }
    public int Quantity { get; set; }
}