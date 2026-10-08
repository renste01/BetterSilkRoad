using Infra;
using Infra.Entities;
using LinqToDB;
using Service.Dtos;

namespace Service;

public record CheckoutResult(string? Error, List<PurchaseResponseDto> Purchases);

public class PurchaseService(DatabaseConnection db)
{
    private static PurchaseResponseDto ToResponseDto(Purchase p) => new()
    {
        Id = p.Id,
        ProductId = p.ProductId,
        ProductName = p.ProductName,
        SellerUsername = p.SellerUsername,
        Images = p.Images,
        UnitPrice = p.UnitPrice,
        Quantity = p.Quantity,
        PurchasedAtUtc = DateTime.SpecifyKind(p.PurchasedAtUtc, DateTimeKind.Utc),
    };

    public List<PurchaseResponseDto> GetForBuyer(int buyerId) =>
        db.Purchases
            .Where(p => p.BuyerId == buyerId)
            .OrderByDescending(p => p.PurchasedAtUtc)
            .ToList()
            .Select(ToResponseDto)
            .ToList();

    public CheckoutResult Checkout(int buyerId, List<CheckoutItemDto> items)
    {
        var lines = items
            .GroupBy(i => i.ProductId)
            .Select(g => (ProductId: g.Key, Quantity: g.Sum(i => i.Quantity)))
            .ToList();

        if (lines.Count == 0)
            return new CheckoutResult("Your cart is empty.", []);

        using var tx = db.BeginTransaction();

        CheckoutResult Fail(string message)
        {
            tx.Rollback();
            return new CheckoutResult(message, []);
        }

        var now = DateTime.UtcNow;
        var purchases = new List<Purchase>();

        foreach (var (productId, quantity) in lines)
        {
            var product = db.Products
                .LoadWith(p => p.Seller)
                .FirstOrDefault(p => p.ProductId == productId);

            if (product == null)
                return Fail("A product in your cart no longer exists.");

            if (product.SellerId == buyerId)
                return Fail($"You cannot buy your own product ({product.ProductName}).");

            var affected = db.Products
                .Where(p => p.ProductId == productId && p.Quantity >= quantity)
                .Set(p => p.Quantity, p => p.Quantity - quantity)
                .Update();

            if (affected == 0)
                return Fail($"Not enough items in stock for {product.ProductName}.");

            var purchase = new Purchase
            {
                BuyerId = buyerId,
                ProductId = product.ProductId,
                ProductName = product.ProductName,
                SellerUsername = product.Seller?.UserName ?? string.Empty,
                Images = product.Images,
                UnitPrice = product.Price,
                Quantity = quantity,
                PurchasedAtUtc = now,
            };
            purchase.Id = db.InsertWithInt32Identity(purchase);
            purchases.Add(purchase);
        }

        tx.Commit();
        return new CheckoutResult(null, purchases.Select(ToResponseDto).ToList());
    }
}