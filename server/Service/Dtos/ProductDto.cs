using Facet;
using Infra.Entities;

namespace Service.Dtos;

[Facet(typeof(Product), nameof(Product.SellerId))]
public partial class ProductDto;
