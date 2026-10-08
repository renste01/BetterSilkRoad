using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service;
using Service.Dtos;

namespace API.Controllers;

[ApiController]
[Route("api/purchases")]
[Authorize]
public class PurchasesController(PurchaseService service) : ControllerBase
{
    [HttpGet]
    public ActionResult<List<PurchaseResponseDto>> GetMyPurchases()
    {
        if (!TryGetUserId(out var buyerId))
            return Unauthorized();

        return Ok(service.GetForBuyer(buyerId));
    }

    [HttpPost("checkout")]
    public ActionResult<List<PurchaseResponseDto>> Checkout(CheckoutRequestDto requestDto)
    {
        if (!TryGetUserId(out var buyerId))
            return Unauthorized();

        var result = service.Checkout(buyerId, requestDto.Items);

        return result.Error is null
            ? Ok(result.Purchases)
            : Conflict(result.Error);
    }

    private bool TryGetUserId(out int userId) =>
        int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out userId);
}