using System.ComponentModel.DataAnnotations;
using Service.Dtos;
using Infra;
using Infra.Entities;
using LinqToDB;


namespace Service;

public class ProductService(DatabaseConnection db)
{
    private static ProductResponseDto ToResponseDto(Product product)
    {
        return new ProductResponseDto
        {
            ProductId = product.ProductId,
            ProductName = product.ProductName,
            Description = product.Description,
            Category = product.Category,
            Price = product.Price,
            Quantity = product.Quantity,
            SellerId = product.SellerId,
            SellerUsername = product.Seller?.UserName ?? string.Empty,
            Images = product.Images
        };
    }
    
    // Create
    public ProductResponseDto Create(CreateProductRequestDto requestDto, int sellerId)
    {
        var sellerExists = db.Users.Any(user => user.Id == sellerId);

        if (!sellerExists)
        {
            throw new ValidationException("The seller does not exist.");
        }
        if (string.IsNullOrWhiteSpace(requestDto.Category))
        {
            throw new ValidationException("Category is required.");
        }
        
        
        var product = new Product
        {
            ProductId = Guid.NewGuid().ToString(),
            ProductName = requestDto.ProductName,
            SellerId = sellerId,
            Description = requestDto.Description,
            Price = requestDto.Price,
            Category = CleanCategory(requestDto.Category),
            Quantity = requestDto.Quantity,
            Images = requestDto.Images
        };

        product.Seller = db.Users.First(user => user.Id == sellerId);
        db.Insert(product);
        return ToResponseDto(product);
    }

    // Read
    public List<ProductResponseDto> GetAll()
    {
        return db.Products
            .LoadWith(product => product.Seller)
            .ToList()
            .Select(ToResponseDto)
            .ToList();
    }

    public ProductResponseDto? GetById(string productId)
    {
        var product = db.Products
            .LoadWith(p => p.Seller)
            .FirstOrDefault(p => p.ProductId == productId);

        return product == null ? null : ToResponseDto(product);
    }
    
    public List<string> GetCategories() =>
        DistinctCategories(db.Products.Select(p => p.Category).ToList());

    public static List<string> DistinctCategories(IEnumerable<string?> categories) =>
        categories
            .Where(c => !string.IsNullOrWhiteSpace(c))
            .Select(c => c!.Trim())
            .Distinct()
            .OrderBy(c => c)
            .ToList();

    public static string CleanCategory(string? category)
    {
        if (string.IsNullOrWhiteSpace(category))
            throw new ValidationException("Category is required.");

        return category.Trim();
    }
    
    public List<ProductResponseDto> GetByCategory(string category)
    {
        return db.Products
            .LoadWith(p => p.Seller)
            .Where(p => p.Category == category)
            .ToList()
            .Select(ToResponseDto)
            .ToList();
    }
    
    // Update
    public ProductResponseDto? Update(UpdateProductRequestDto requestDto)
    {
        var product = db.Products
            .LoadWith(p => p.Seller)
            .FirstOrDefault(p => p.ProductId == requestDto.ProductIdForLookup);
        if (product == null)
            return null;
        if (requestDto.NewProductName != null)
            product.ProductName = requestDto.NewProductName;
        if (requestDto.NewDescription != null)
            product.Description = requestDto.NewDescription;
        if (requestDto.NewPrice != null)
            product.Price = (decimal)requestDto.NewPrice;
        if (requestDto.NewCategory != null)
            product.Category = CleanCategory(requestDto.NewCategory);
        if (requestDto.NewQuantity != null)
            product.Quantity = (int)requestDto.NewQuantity;
        if (requestDto.NewImages != null)
            product.Images = requestDto.NewImages;

        db.Update(product);
        return ToResponseDto(product);
    }
    
    //Delete
    public bool Delete(string productId)
    {
        var product = db.Products.FirstOrDefault(p => p.ProductId == productId);
        if (product == null)
            return false;

        db.Delete(product);
        return true;
    }
}
