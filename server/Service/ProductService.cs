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
            Image = product.Image
        };
    }
    
    // Create
    public ProductResponseDto Create(CreateProductRequestDto requestDto)
    {
        var sellerExists = db.Users.Any(user => user.Id == requestDto.SellerId);

        if (!sellerExists)
        {
            throw new ValidationException("The seller does not exist.");
        }
        
        var product = new Product
        {
            ProductId = Guid.NewGuid().ToString(),
            ProductName = requestDto.ProductName,
            SellerId = requestDto.SellerId,
            Description = requestDto.Description,
            Price = requestDto.Price,
            Category = requestDto.Category,
            Quantity = requestDto.Quantity,
            Image = requestDto.Image
        };

        db.Insert(product);
        return ToResponseDto(product);
    }

    // Read
    public List<ProductResponseDto> GetAll()
    {
        return db.Products
            .ToList()
            .Select(ToResponseDto)
            .ToList();
    }

    public ProductResponseDto? GetById(string productId)
    {
        var product = db.Products.FirstOrDefault(p => p.ProductId == productId);

        return product == null ? null : ToResponseDto(product);
    }
    
    // Update
    public ProductResponseDto? Update(UpdateProductRequestDto requestDto)
    {
        var product = db.Products.FirstOrDefault(p => p.ProductId == requestDto.ProductIdForLookup);
        if (product == null)
            return null;
        if (requestDto.NewProductName != null)
            product.ProductName = requestDto.NewProductName;
        if (requestDto.NewDescription != null)
            product.Description = requestDto.NewDescription;
        if (requestDto.NewPrice != null)
            product.Price = (decimal)requestDto.NewPrice;
        if (requestDto.NewCategory != null)
            product.Category = requestDto.NewCategory;
        if (requestDto.NewQuantity != null)
            product.Quantity = (int)requestDto.NewQuantity;

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