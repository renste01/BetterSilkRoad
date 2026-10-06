using LinqToDB.Mapping;

namespace Infra.Entities;

[Table("Categories")]
public class Category
{
    [PrimaryKey, Identity]
    public int Id { get; set; }

    [Column, NotNull]
    public string Name { get; set; } = string.Empty;

    [Column]
    public string? Description { get; set; }
}