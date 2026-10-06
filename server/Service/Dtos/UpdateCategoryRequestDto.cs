using System.ComponentModel.DataAnnotations;

namespace Service.Dtos;

public class UpdateCategoryRequestDto
{
    [Required]
    [MinLength(1)]
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }
}