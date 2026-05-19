using TaskManager.Web.Repositories;

var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    WebRootPath = "client" 
});

builder.Services.AddControllers();
builder.Services.AddSingleton<ITaskRepository, InMemoryTaskRepository>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()      // разрешить любые источники
              .AllowAnyMethod()      // разрешить любые HTTP-методы
              .AllowAnyHeader();     // разрешить любые заголовки
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors();

app.UseDefaultFiles();
app.UseStaticFiles();
app.MapControllers();

app.Run();