using Infra.Entities;
using LinqToDB;
using LinqToDB.Data;

namespace Infra;

public class DatabaseConnections : DataConnection
{
    public DatabaseConnections(DataOptions<DatabaseConnections> options)
        : base(options.Options)
    {
    }

    public ITable<User> Users => this.GetTable<User>();
}