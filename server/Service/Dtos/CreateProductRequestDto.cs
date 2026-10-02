using System.ComponentModel.DataAnnotations;

namespace Service.Dtos;

public class CreateProductRequestDto
{
    [Required]
    [MinLength(1)]
    public string ProductName { get; set; }
    
    [Required]
    public int SellerId { get; set; }
    
    [Required]
    [MinLength(1)]
    public string ProductDescription { get; set; }
    
    [Required]
    [MinLength(1)]
    public string ProductCategory { get; set; }
    
    [Range(0, double.MaxValue)]
    public decimal Price { get; set; }
    
    [Range(0, double.MaxValue)]
    public int Quantity { get; set; }
    
    [Required]
    public string? ImageUrl { get; set; }
}