using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace Service.Dtos;

public class UpdateProductRequestDto
{
    [NotNull] [MinLength(1)] public string ProductIdForLookup { get; set; }
    public string? NewProductName { get; set; }
    public string? NewProductDescribtion { get; set; }
    public string? NewProductCategory { get; set; }
    public decimal? NewPrice { get; set; }
    public int? NewQuantity { get; set; }
}