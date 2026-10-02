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
    public void CreateProduct(CreateProductRequestDto requestDto)
    {
        service.Create(requestDto);
    }
    
    // Read Product(s)
    [HttpGet]
    public ActionResult<List<ProductResponseDto>> GetProducts()
    {
        return service.GetAll();
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
    public void UpdateProduct(UpdateProductRequestDto requestDto)
    {
        service.Update(requestDto);
    }
    
    // Delete Product
    [HttpDelete("{productId}")]
    public void DeleteProduct(string productId)
    {
        service.Delete(productId);
    }
}