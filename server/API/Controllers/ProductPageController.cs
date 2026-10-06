using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Service;
using Service.Dtos;

namespace API;

[ApiController]
[Route("api/products")]
public class ProductPageController(ProductService service) : ControllerBase
{
    // Create product
    [HttpPost]
    public ActionResult<ProductResponseDto> CreateProduct(CreateProductRequestDto requestDto)
    {
        try
        {
            var product = service.Create(requestDto);
            return CreatedAtAction(nameof(GetProduct), new { productId = product.ProductId }, product);
        }
        catch (ValidationException ex)
        {
            return BadRequest(ex.Message);
        }
    }
    
    // Read Product(s)
    [HttpGet]
    public ActionResult<List<ProductResponseDto>> GetProducts()
    {
        return Ok(service.GetAll());
    }
    
    [HttpGet("{productId}")]
    public ActionResult<ProductResponseDto> GetProduct(string productId)
    {
        var product = service.GetById(productId);
        if (product == null)
        {
            return NotFound();
        }

        return Ok(product);
    }
    
    // Update Product
    [HttpPut]
    public ActionResult<ProductResponseDto> UpdateProduct(UpdateProductRequestDto requestDto)
    {
        try
        {
            var product = service.Update(requestDto);
            if (product == null)
                return NotFound();

            return Ok(product);
        }
        catch (ValidationException ex)
        {
            return BadRequest(ex.Message);
        }
    }
    
    // Delete Product
    [HttpDelete("{productId}")]
    public IActionResult DeleteProduct(string productId)
    {
        return service.Delete(productId) ? NoContent() : NotFound();
    }
    
    [HttpGet("categories")]
    public ActionResult<IReadOnlyList<string>> GetCategories() => Ok(service.GetCategories());

    [HttpGet("category/{category}")]
    public ActionResult<List<ProductResponseDto>> GetByCategory(string category) =>
        Ok(service.GetByCategory(category));
}