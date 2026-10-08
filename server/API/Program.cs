using System.Text;
using Infra;
using Infra.Entities;
using LinqToDB;
using LinqToDB.AspNet;
using LinqToDB.Data;
using LinqToDB.DataProvider.SQLite;
using LinqToDB.Extensions.Logging;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Service;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApiDocument();

builder.Services.AddLinqToDBContext<DatabaseConnection>((provider, options) =>
    options
        .UseSQLite(builder.Configuration.GetConnectionString("Default") ?? "Data Source=satinroad.db", SQLiteProvider.Microsoft)
        .UseDefaultLogging(provider));

builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<ProductService>();
builder.Services.AddScoped<CategoryService>();
builder.Services.AddScoped<JwtTokenService>();
builder.Services.AddScoped<PurchaseService>();

// JWT bearer auth: tokens are issued by AuthController on login/register and
// carry a "role" claim of "Admin" for the account that registered first (see
// AuthService.RegisterAsync). [Authorize(Roles = Roles.Admin)] on a controller
// action checks that claim.
var jwtSection = builder.Configuration.GetSection("Jwt");
var jwtSecret = jwtSection["Secret"]
    ?? throw new InvalidOperationException("Jwt:Secret is not configured (check appsettings.Development.json).");

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwtSection["Issuer"] ?? "SatinRoad",
            ValidateAudience = true,
            ValidAudience = jwtSection["Audience"] ?? "SatinRoad",
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
        };
    });

builder.Services.AddAuthorization();

// Allows the Bun dev server (localhost:3000) to call this API from the browser.
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
        policy.WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

var app = builder.Build();


using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<DatabaseConnection>();

    db.CreateTable<User>(tableOptions: TableOptions.CreateIfNotExists);

    db.Execute("""
               CREATE UNIQUE INDEX IF NOT EXISTS IX_Users_UserName
               ON Users(UserName);
               """);

    db.CreateTable<Product>(tableOptions: TableOptions.CreateIfNotExists);
    db.CreateTable<Category>(tableOptions: TableOptions.CreateIfNotExists);
    db.CreateTable<Purchase>(tableOptions: TableOptions.CreateIfNotExists);
}

app.UseCors("Frontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.UseOpenApi();
app.UseSwaggerUi();
app.Run();