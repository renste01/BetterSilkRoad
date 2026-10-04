using System.ComponentModel.DataAnnotations;
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

    // No "property:" target here - for record primary constructors, ASP.NET
    // Core requires validation attributes directly on the parameter, or it
    // throws rather than silently skip validation (which is what happened).
    public record RegisterRequest(
        [Required, EmailAddress] string Email,
        [Required, MinLength(8)] string Password,
        [Required, MinLength(1)] string UserName);

    public record LoginRequest(
        [Required, EmailAddress] string Email,
        [Required] string Password);

    public record AuthResponse(int Id, string Email, string UserName);

    [HttpPost("register")]
    [ProducesResponseType<AuthResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
    {
        var user = await _authService.RegisterAsync(
            request.Email,
            request.Password,
            request.UserName);
        if (user is null)
            return Conflict("An account with that email already exists.");

        return Ok(new AuthResponse(user.Id, user.Email, user.UserName));
    }

    [HttpPost("login")]
    [ProducesResponseType<AuthResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        var user = await _authService.LoginAsync(request.Email, request.Password);
        if (user is null)
            return Unauthorized("Invalid email or password.");

        return Ok(new AuthResponse(user.Id, user.Email, user.UserName));
    }
}