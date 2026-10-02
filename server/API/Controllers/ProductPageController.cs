using Infra;
using Infra.Entities;
using LinqToDB;
using Microsoft.AspNetCore.Mvc;
using Service;
using Service.Dtos;

namespace API;

public class ProductPageController(ProductService service, DatabaseConnection dbc) : ControllerBase
{
    // Create product
    [HttpPost(nameof(CreateProduct))]
    public void CreateProduct(CreateProductRequestDto requestDto)
    {
        service.Create(requestDto);
    }
    
    // Read Product
    [HttpGet(nameof(GetProducts))]
    public List<Product> GetProducts()
    {
        return service.GetAll();
    }
    
    // Update Product
    [HttpPut(nameof(UpdateProduct))]
    public void UpdateProduct(UpdateProductRequestDto requestDto)
    {
        service.Update(requestDto);
    }
    
    // Delete Product
    [HttpDelete(nameof(DeleteProduct))]
    public void DeleteProduct(string productId)
    {
        service.Delete(productId);
    }
}