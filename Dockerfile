FROM oven/bun:1-alpine AS client-build

WORKDIR /client
COPY client/package.json client/bun.lock ./
RUN bun install --frozen-lockfile
COPY client/ ./
RUN bun run build

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS server-build

WORKDIR /src
COPY . .
RUN dotnet publish server/API/API.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0

WORKDIR /app
COPY --from=server-build /app/publish ./
COPY --from=client-build /client/dist ./wwwroot

ENV ASPNETCORE_URLS=http://0.0.0.0:8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "API.dll"]
