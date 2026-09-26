var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

var app = builder.Build();

app.MapControllers();
app.UseOpenApi();
app.UseSwaggerUi();
app.Run();


