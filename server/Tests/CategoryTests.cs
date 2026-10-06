using System.ComponentModel.DataAnnotations;
using Service;
using Xunit;

namespace Tests;

public class CategoryTests
{
    [Fact]
    public void DistinctCategories_RemovesDuplicates()
    {
        var result = ProductService.DistinctCategories(["Shoes", "Books", "Shoes"]);

        Assert.Equal(["Books", "Shoes"], result);
    }

    [Fact]
    public void DistinctCategories_IsSorted()
    {
        var result = ProductService.DistinctCategories(["Shoes", "Books", "Home"]);

        Assert.Equal(["Books", "Home", "Shoes"], result);
    }

    [Fact]
    public void DistinctCategories_IgnoresNullAndEmpty()
    {
        var result = ProductService.DistinctCategories(["Shoes", null, "", "   "]);

        Assert.Equal(["Shoes"], result);
    }

    [Fact]
    public void DistinctCategories_TrimsSpaces()
    {
        var result = ProductService.DistinctCategories(["  Shoes  ", "Shoes"]);

        Assert.Equal(["Shoes"], result);
    }

    [Fact]
    public void DistinctCategories_NoProducts_ReturnsEmptyList()
    {
        Assert.Empty(ProductService.DistinctCategories([]));
    }

    [Fact]
    public void CleanCategory_TrimsSpaces()
    {
        Assert.Equal("Shoes", ProductService.CleanCategory("  Shoes  "));
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void CleanCategory_EmptyValue_ThrowsValidationException(string? category)
    {
        Assert.Throws<ValidationException>(() => ProductService.CleanCategory(category));
    }
}