using Infra;
using Infra.Entities;
using LinqToDB;
using LinqToDB.AspNet;
using LinqToDB.DataProvider.SQLite;
using LinqToDB.Extensions.Logging;
using Service;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApiDocument();

builder.Services.AddLinqToDBContext<DatabaseConnections>((provider, options) =>
    options
        .UseSQLite(builder.Configuration.GetConnectionString("Default") ?? "Data Source=satinroad.db", SQLiteProvider.Microsoft)
        .UseDefaultLogging(provider));

builder.Services.AddScoped<AuthService>();

// Allows the Bun dev server (localhost:3000) to call this API from the browser.
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
        policy.WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod());
});

var app = builder.Build();

//create the Users table if it doesn't exist yet.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<DatabaseConnections>();
    try
    {
        db.CreateTable<User>();
    }
    catch
    {
        // Table already exists.
    }
}

app.UseCors("Frontend");
app.MapControllers();
app.UseOpenApi();
app.UseSwaggerUi();
app.Run();