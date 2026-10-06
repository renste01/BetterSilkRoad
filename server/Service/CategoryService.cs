using Infra;
using Infra.Entities;
using LinqToDB;
using Service.Dtos;

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
        var category = new Category
        {
            Name = requestDto.Name.Trim(),
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

        category.Name = requestDto.Name.Trim();
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
}