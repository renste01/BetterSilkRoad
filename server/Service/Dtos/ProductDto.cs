using Facet;
using Infra;

namespace Service.Dtos;

[Facet(typeof(Product), nameof(Product.SellerId))]
public partial class ProductDto;
