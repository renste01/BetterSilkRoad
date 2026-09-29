using Microsoft.AspNetCore.Mvc;
using Service;

namespace API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    public record LoginRequest(string Email, string Password);
    public record RegisterRequest(string Email, string Password);
    public record AuthResponse(int Id, string Email);

    // rows in it, there's no other way to create an account yet.
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            return BadRequest("Email and password are required.");

        var user = await _authService.RegisterAsync(request.Email, request.Password);
        if (user is null)
            return Conflict("An account with that email already exists.");

        return Ok(new AuthResponse(user.Id, user.Email));
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        var user = await _authService.LoginAsync(request.Email, request.Password);
        if (user is null)
            return Unauthorized("Invalid email or password.");

        return Ok(new AuthResponse(user.Id, user.Email));
    }
}