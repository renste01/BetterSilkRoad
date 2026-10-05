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
        var product = service.Create(requestDto);
        return CreatedAtAction(nameof(GetProduct), new { productId = product.ProductId }, product);
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
        var product = service.Update(requestDto);
        if (product == null)
            return NotFound();

        return Ok(product);
    }
    
    // Delete Product
    [HttpDelete("{productId}")]
    public IActionResult DeleteProduct(string productId)
    {
        return service.Delete(productId) ? NoContent() : NotFound();
    }
}