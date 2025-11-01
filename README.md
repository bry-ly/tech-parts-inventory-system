# 🧭 Tech Parts Inventory System

A modern **Inventory Management System** built with **Next.js**, **Prisma**, **Better Auth**, and **Shadcn UI**.  
Designed for managing tech components efficiently with secure authentication, clean UI, and a scalable backend.

---

## 🚀 Features

- 🔐 **Authentication & Authorization** — Secure login with Better Auth; supports role-based access (Admin, Manager, Staff).  
- 📦 **Inventory Management** — Create, update, and monitor stock items, categories, and quantities in real time.  
- 🧾 **Audit Logging** — Tracks every change made to items for transparency and accountability.  
- ⚡ **Next.js App Router** — Optimized server-side rendering and routing for better performance.  
- 🧩 **Prisma ORM** — Type-safe database handling and schema migrations.  
- 🎨 **Shadcn UI + Tailwind CSS** — Clean, accessible, and responsive user interface.  
- 🗃️ **Scalable Database Support** — Works with PostgreSQL, MySQL, or SQLite for local development.  
- 🧠 **TypeScript Everywhere** — Full type safety across frontend and backend.  

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Framework** | [Next.js 15](https://nextjs.org/) |
| **ORM** | [Prisma](https://www.prisma.io/) |
| **Auth** | [Better Auth](https://better-auth.vercel.app/) |
| **UI Components** | [Shadcn UI](https://ui.shadcn.com/) + Tailwind CSS |
| **Validation** | [Zod](https://zod.dev/) |
| **Database** | PostgreSQL (production) / SQLite (development) |

---

## 📂 Project Structure

```
tech-parts-inventory-system/
├── app/                 # Next.js App Router pages & routes
│   ├── (auth)/          # Auth routes (login, register)
│   ├── dashboard/       # Protected dashboard routes
│   └── api/             # API endpoints
├── components/          # Reusable React + Shadcn components
├── prisma/              # Prisma schema and seed scripts
├── lib/                 # Utility functions (auth, prisma client, helpers)
├── hooks/               # Custom React hooks
├── public/              # Static assets
└── .env.example         # Environment variables sample
```

---

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/bry-ly/tech-parts-inventory-system.git
cd tech-parts-inventory-system
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the root directory and add your config:
```bash
DATABASE_URL="your_database_url_here"
BETTER_AUTH_SECRET="your_secret_key"
BETTER_AUTH_URL="http://localhost:3000"
NODE_ENV= development
```

### 4. Set up the database
```bash
npx prisma migrate dev --name init
npm prisma db seed
```

### 5. Run the development server
```bash
npm run dev
```
Then visit [http://localhost:3000](http://localhost:3000)

---


---

## 🧩 Example Prisma Schema (simplified)
```prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id            String    @id
  name          String
  email         String
  emailVerified Boolean   @default(false)
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @default(now()) @updatedAt
  sessions      Session[]
  accounts      Account[]

  @@unique([email])
  @@map("user")
}

model Session {
  id        String   @id
  expiresAt DateTime
  token     String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  ipAddress String?
  userAgent String?
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([token])
  @@map("session")
}

model Account {
  id                    String    @id
  accountId             String
  providerId            String
  userId                String
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  password              String?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  @@map("account")
}

model Verification {
  id         String   @id
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @default(now()) @updatedAt

  @@map("verification")
}

model Product {
  id             String   @id @default(cuid())
  userId         String
  // Basic Info
  name           String
  category       String
  manufacturer   String
  model          String?
  sku            String?  @unique
  // Inventory
  quantity       Int      @default(0)
  lowStockAt     Int?
  condition      String   @default("new")
  location       String?
  // Pricing
  price          Decimal  @db.Decimal(12, 2)
  // Technical
  specs          String?  @db.Text
  compatibility  String?  @db.Text
  // Business
  supplier       String?
  warrantyMonths Int?
  notes          String?  @db.Text
  // Media
  imageUrl       String?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@index([userId, category])
  @@index([manufacturer])
  @@index([createdAt])
}

```

---

## 🧪 Future Enhancements
- 📊 Dashboard analytics and charts for stock movement  
- 📬 Email notifications for low-stock alerts  
- 🗄️ CSV/Excel import and export  
- 🔁 Real-time stock updates using WebSockets or Pusher  
- 🧾 Detailed audit trails and versioning  

---

## 📜 License
This project is licensed under the **MIT License** — feel free to modify and use it.

---

## 💡 Credits
Created by **[Bry-Ly](https://github.com/bry-ly)**  
Built with caffeine, Prisma migrations, and questionable life choices.

