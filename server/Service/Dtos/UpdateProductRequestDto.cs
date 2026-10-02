using System.ComponentModel.DataAnnotations;
namespace Service.Dtos;

public class UpdateProductRequestDto
{
    [Required]
    [MinLength(1)]
    public string ProductIdForLookup { get; set; } = string.Empty;
    public string? NewProductName { get; set; }
    public string? NewProductDescription { get; set; }
    public string? NewProductCategory { get; set; }
    [Range(0, double.MaxValue)]
    public decimal? NewPrice { get; set; }
    [Range(0, int.MaxValue)]
    public int? NewQuantity { get; set; }
}