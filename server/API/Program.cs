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

builder.Services.AddLinqToDBContext<DatabaseConnection>((provider, options) =>
    options
        .UseSQLite(builder.Configuration.GetConnectionString("Default") ?? "Data Source=satinroad.db", SQLiteProvider.Microsoft)
        .UseDefaultLogging(provider));

builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<ProductService>();

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
    db.CreateTable<Product>(tableOptions: TableOptions.CreateIfNotExists);
}

app.UseCors("Frontend");
app.MapControllers();
app.UseOpenApi();
app.UseSwaggerUi();
app.Run();