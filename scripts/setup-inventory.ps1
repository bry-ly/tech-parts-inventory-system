# PowerShell setup script for Windows

Write-Host "🚀 Setting up Inventory Management System..." -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✅ npm is installed: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not installed. Please install npm first." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install
Write-Host "✅ Dependencies installed" -ForegroundColor Green
Write-Host ""

# Generate Prisma client
Write-Host "🔧 Generating Prisma client..." -ForegroundColor Yellow
npx prisma generate
Write-Host "✅ Prisma client generated" -ForegroundColor Green
Write-Host ""

# Run migrations
Write-Host "🗃️  Running database migrations..." -ForegroundColor Yellow
npx prisma migrate dev --name add_inventory_features
Write-Host "✅ Database migrations complete" -ForegroundColor Green
Write-Host ""

Write-Host "✨ Setup complete! You can now run:" -ForegroundColor Cyan
Write-Host ""
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "📚 Check INVENTORY_FEATURES.md for documentation on all new features" -ForegroundColor Yellow
Write-Host ""
Write-Host "🎉 Happy inventory managing!" -ForegroundColor Magenta



