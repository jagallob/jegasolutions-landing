#!/bin/bash

echo "🚀 Configurando JEGASolutions API Backend..."

# Verificar .NET 8.0
if ! command -v dotnet &> /dev/null; then
    echo "❌ .NET 8.0 SDK no está instalado. Por favor instálalo desde https://dotnet.microsoft.com/download"
    exit 1
fi

echo "✅ .NET SDK encontrado: $(dotnet --version)"

# Restaurar dependencias
echo "📦 Restaurando dependencias..."
dotnet restore

if [ $? -ne 0 ]; then
    echo "❌ Error restaurando dependencias"
    exit 1
fi

# Verificar PostgreSQL
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL no encontrado. Asegúrate de tener PostgreSQL instalado y ejecutándose."
    echo "   En Ubuntu/Debian: sudo apt install postgresql postgresql-contrib"
    echo "   En macOS: brew install postgresql"
    echo "   En Windows: https://www.postgresql.org/download/windows/"
fi

# Crear base de datos de desarrollo
echo "🗄️  Configurando base de datos..."
createdb jegasolutions_dev 2>/dev/null || echo "Base de datos ya existe o error de conexión"

# Aplicar migraciones
echo "🔄 Aplicando migraciones..."
dotnet ef database update

if [ $? -ne 0 ]; then
    echo "❌ Error aplicando migraciones. Verifica la conexión a PostgreSQL."
    exit 1
fi

# Crear archivo de configuración local
if [ ! -f "appsettings.Local.json" ]; then
    echo "📝 Creando archivo de configuración local..."
    cat > appsettings.Local.json << EOF
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=jegasolutions_dev;Username=postgres;Password=password"
  },
  "Wompi": {
    "BaseUrl": "https://production.wompi.co/v1/",
    "PublicKey": "pub_test_your_public_key_here",
    "PrivateKey": "prv_test_your_private_key_here"
  },
  "JWT": {
    "SecretKey": "your_super_secret_jwt_key_here_$(date +%s)",
    "Issuer": "JEGASolutions",
    "Audience": "JEGASolutions.Users",
    "ExpirationMinutes": 60
  }
}
EOF
    echo "✅ Archivo appsettings.Local.json creado"
    echo "⚠️  IMPORTANTE: Edita este archivo con tus credenciales reales"
fi

echo ""
echo "🎉 ¡Configuración completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Edita appsettings.Local.json con tus credenciales"
echo "2. Configura tus claves de Wompi"
echo "3. Ejecuta: dotnet run"
echo ""
echo "🌐 La API estará disponible en: https://localhost:7000"
echo "📚 Swagger UI: https://localhost:7000/swagger"
echo ""
echo "🔧 Para desarrollo con hot reload:"
echo "   dotnet watch run"
