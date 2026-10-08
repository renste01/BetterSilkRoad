using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service;
using Service.Dtos;

namespace API;

[ApiController]
[Route("api/inventory")]
[Authorize]
public class InventoryController(ProductService service) : ControllerBase
{
    // Read the signed-in user's own products (their private inventory).
    // Admins only see their own items here too; this is a personal view.
    [HttpGet]
    public ActionResult<List<ProductResponseDto>> GetInventory()
    {
        var callerId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (callerId is null || !int.TryParse(callerId, out var sellerId))
            return Unauthorized();

        var items = service.GetAll()
            .Where(p => p.SellerId == sellerId)
            .ToList();

        return Ok(items);
    }
}