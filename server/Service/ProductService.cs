using System.ComponentModel.DataAnnotations;
using Service.Dtos;
using Infra;
using Infra.Entities;
using LinqToDB;


namespace Service;

public class ProductService(DatabaseConnection db)
{
    // Create
    public void Create(CreateProductRequestDto requestDto)
    {
        db.Insert(new Product
        {
          ProductId  = Guid.NewGuid().ToString(),
          ProductName = requestDto.ProductName,
          SellerId = requestDto.SellerId,
          ProductDesription = requestDto.ProductDescription,
          Price = requestDto.Price,
          ProductCategory = requestDto.ProductCategory,
          Quantity = requestDto.Quantity
        });
    }

    // Read
    public List<Product> GetAll()
    {
        return db.Products.LoadWith(p => p.Seller).ToList();
    }
    
    // Update
    public void Update(UpdateProductRequestDto requestDto)
    {
        var product = db.Products.FirstOrDefault(p => p.ProductId == requestDto.ProductIdForLookup) ??
                      throw new ValidationException("That product doesn't exist");
        if (requestDto.NewProductName != null)
            product.ProductName = requestDto.NewProductName;
        if (requestDto.NewProductDescription != null)
            product.ProductDesription = requestDto.NewProductDescription;
        if (requestDto.NewPrice != null)
            product.Price = (decimal)requestDto.NewPrice;
        if (requestDto.NewProductCategory != null)
            product.ProductCategory = requestDto.NewProductCategory;
        if (requestDto.NewQuantity != null)
            product.Quantity = (int)requestDto.NewQuantity;

        db.Update(product);
    }
    
    //Delete
    public void Delete(string productId)
    {
        var product = db.Products.FirstOrDefault(p => p.ProductId == productId) ??
                      throw new ValidationException("That product doesn't exist");
        db.Delete(product);
    }
}