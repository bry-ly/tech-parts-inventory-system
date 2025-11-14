#!/bin/bash

echo "🚀 Setting up Inventory Management System..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate
echo "✅ Prisma client generated"
echo ""

# Run migrations
echo "🗃️  Running database migrations..."
npx prisma migrate dev --name add_inventory_features
echo "✅ Database migrations complete"
echo ""

echo "✨ Setup complete! You can now run:"
echo ""
echo "   npm run dev"
echo ""
echo "📚 Check INVENTORY_FEATURES.md for documentation on all new features"
echo ""
echo "🎉 Happy inventory managing!"



