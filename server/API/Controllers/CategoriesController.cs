using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service;
using Service.Dtos;

namespace API.Controllers;

[ApiController]
[Route("api/categories")]
public class CategoriesController(CategoryService service) : ControllerBase
{
    // Anyone can browse categories - no auth required.
    [HttpGet]
    public ActionResult<List<CategoryResponseDto>> GetAll()
    {
        return Ok(service.GetAll());
    }

    // Only admins manage the category list itself.
    [HttpPost]
    [Authorize(Roles = Roles.Admin)]
    public ActionResult<CategoryResponseDto> Create(CreateCategoryRequestDto requestDto)
    {
        if (string.IsNullOrWhiteSpace(requestDto.Name))
            return BadRequest("Category name is required.");
        if (service.NameExists(requestDto.Name))
            return Conflict("A category with that name already exists.");
        var category = service.Create(requestDto);
        return CreatedAtAction(nameof(GetAll), category);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = Roles.Admin)]
    public ActionResult<CategoryResponseDto> Update(int id, UpdateCategoryRequestDto requestDto)
    {
        if (string.IsNullOrWhiteSpace(requestDto.Name))
            return BadRequest("Category name is required.");
        if (service.NameExists(requestDto.Name, id))
            return Conflict("A category with that name already exists.");
        var category = service.Update(id, requestDto);
        return category is null ? NotFound() : Ok(category);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = Roles.Admin)]
    public IActionResult Delete(int id)
    {
        return service.Delete(id) ? NoContent() : NotFound();
    }
}