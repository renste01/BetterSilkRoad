using Infra.Entities;
using LinqToDB;
using LinqToDB.Data;

namespace Infra;

public class DatabaseConnection : DataConnection
{
    public DatabaseConnection(DataOptions<DatabaseConnection> options)
        : base(options.Options)
    {
        
    }
    public ITable<Product> Products => this.GetTable<Product>();
    public ITable<User> Users => this.GetTable<User>();
    public ITable<Category> Categories => this.GetTable<Category>();
    public ITable<Purchase> Purchases => this.GetTable<Purchase>();
}