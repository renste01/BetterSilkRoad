using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
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
    public ActionResult<ProductResponseDto> CreateProduct(
        CreateProductRequestDto requestDto)
    {
        var product = service.Create(requestDto);

        return CreatedAtAction(
            nameof(GetProduct),
            new { productId = product.ProductId },
            product);
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

        if (product is null)
        {
            return NotFound();
        }

        return Ok(product);
    }

    // Update Product - the listing's own seller or an admin only.
    [HttpPut]
    [Authorize]
    public ActionResult<ProductResponseDto> UpdateProduct(
        UpdateProductRequestDto requestDto)
    {
        var existing = service.GetById(requestDto.ProductIdForLookup);

        if (existing is null)
            return NotFound();

        if (!CanManage(existing.SellerId))
            return Forbid();

        var product = service.Update(requestDto);

        return product is null
            ? NotFound()
            : Ok(product);
    }

    // Delete Product - the listing's own seller or an admin only.
    // Admins can remove any product.
    [HttpDelete("{productId}")]
    [Authorize]
    public IActionResult DeleteProduct(string productId)
    {
        var existing = service.GetById(productId);

        if (existing is null)
            return NotFound();

        if (!CanManage(existing.SellerId))
            return Forbid();

        return service.Delete(productId)
            ? NoContent()
            : NotFound();
    }

    private bool CanManage(int sellerId)
    {
        if (User.IsInRole(Roles.Admin))
            return true;

        var callerId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        return callerId is not null
            && int.TryParse(callerId, out var id)
            && id == sellerId;
    }
}