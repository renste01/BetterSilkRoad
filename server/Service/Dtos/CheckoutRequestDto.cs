using System.ComponentModel.DataAnnotations;

namespace Service.Dtos;

public class CheckoutItemDto
{
    [Required, MinLength(1)]
    public string ProductId { get; set; } = string.Empty;

    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }
}

public class CheckoutRequestDto
{
    [Required, MinLength(1)]
    public List<CheckoutItemDto> Items { get; set; } = new();
}