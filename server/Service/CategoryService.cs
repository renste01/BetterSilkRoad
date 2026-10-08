using Infra;
using Infra.Entities;
using LinqToDB;
using Service.Dtos;
using System.ComponentModel.DataAnnotations;

namespace Service;

public class CategoryService(DatabaseConnection db)
{
    private static CategoryResponseDto ToResponseDto(Category category)
    {
        return new CategoryResponseDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
        };
    }

    // Read
    public List<CategoryResponseDto> GetAll()
    {
        return db.Categories
            .OrderBy(c => c.Name)
            .ToList()
            .Select(ToResponseDto)
            .ToList();
    }

    // Create
    public CategoryResponseDto Create(CreateCategoryRequestDto requestDto)
    {
        var name = CleanName(requestDto.Name);
        var category = new Category
        {
            Name = name,
            Description = requestDto.Description,
        };

        category.Id = db.InsertWithInt32Identity(category);
        return ToResponseDto(category);
    }

    // Update
    public CategoryResponseDto? Update(int id, UpdateCategoryRequestDto requestDto)
    {
        var category = db.Categories.FirstOrDefault(c => c.Id == id);
        if (category == null)
            return null;

        category.Name = CleanName(requestDto.Name);
        if (NameExists(category.Name, id))
            throw new ValidationException("A category with that name already exists.");
        category.Description = requestDto.Description;

        db.Update(category);
        return ToResponseDto(category);
    }

    // Delete
    public bool Delete(int id)
    {
        var category = db.Categories.FirstOrDefault(c => c.Id == id);
        if (category == null)
            return false;

        db.Delete(category);
        return true;
    }

    public bool NameExists(string name, int? exceptId = null) =>
        db.Categories.Any(c => c.Name.ToLower() == name.Trim().ToLower() && (!exceptId.HasValue || c.Id != exceptId.Value));

    private static string CleanName(string? name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ValidationException("Category name is required.");
        return name.Trim();
    }
}
