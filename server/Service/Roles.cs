namespace Service;

// Centralizes role name strings so "Admin" is never typo'd differently
// between where a token is issued and where [Authorize(Roles = ...)] checks it.
public static class Roles
{
    public const string Admin = "Admin";
}