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
            ProductDescription = product.ProductDescription,
            ProductCategory = product.ProductCategory,
            Price = product.Price,
            Quantity = product.Quantity,
            SellerId = product.SellerId,
            ImageUrl = product.ImageUrl
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
            ProductDescription = requestDto.ProductDescription,
            Price = requestDto.Price,
            ProductCategory = requestDto.ProductCategory,
            Quantity = requestDto.Quantity,
            ImageUrl = requestDto.ImageUrl
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
        if (requestDto.NewProductDescription != null)
            product.ProductDescription = requestDto.NewProductDescription;
        if (requestDto.NewPrice != null)
            product.Price = (decimal)requestDto.NewPrice;
        if (requestDto.NewProductCategory != null)
            product.ProductCategory = requestDto.NewProductCategory;
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