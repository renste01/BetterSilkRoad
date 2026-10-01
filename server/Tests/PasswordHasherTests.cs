using Service;
using Xunit;

namespace Tests;

public class PasswordHasherTests
{
    [Fact]
    public void Verify_CorrectPassword_ReturnsTrue()
    {
        var hash = PasswordHasher.Hash("correct horse battery staple");

        Assert.True(PasswordHasher.Verify("correct horse battery staple", hash));
    }

    [Fact]
    public void Verify_WrongPassword_ReturnsFalse()
    {
        var hash = PasswordHasher.Hash("correct horse battery staple");

        Assert.False(PasswordHasher.Verify("wrong password", hash));
    }

    [Fact]
    public void Hash_SamePasswordTwice_ProducesDifferentOutput()
    {
        // Each call uses a fresh random salt, so two hashes of the same
        // password should never be identical but both must still verify.
        var first = PasswordHasher.Hash("same password");
        var second = PasswordHasher.Hash("same password");

        Assert.NotEqual(first, second);
        Assert.True(PasswordHasher.Verify("same password", first));
        Assert.True(PasswordHasher.Verify("same password", second));
    }

    [Theory]
    [InlineData("")]
    [InlineData("not-a-valid-hash")]
    [InlineData("1.2")]
    [InlineData("notanumber.c2FsdA==.aGFzaA==")]
    [InlineData("100000.not-valid-base64!!.not-valid-base64!!")]
    public void Verify_MalformedStoredHash_ReturnsFalseInsteadOfThrowing(string storedHash)
    {
        Assert.False(PasswordHasher.Verify("any password", storedHash));
    }
}