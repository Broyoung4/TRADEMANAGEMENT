# Trade Management Application

A comprehensive web-based inventory and sales management system built with modern web technologies. This application enables users to efficiently manage their inventory, track sales, and analyze business performance through intuitive dashboards and detailed analytics.

## Overview

Trade Management is a full-stack application designed for small to medium-sized businesses to:
- **Manage Inventory**: Track items, quantities, cost prices, and stock units
- **Record Sales**: Log sales transactions with automatic profit calculations
- **Analyze Performance**: Visualize business metrics through interactive charts and analytics
- **User Authentication**: Secure multi-user access with NextAuth
- **Real-time Updates**: Automatic profit and pricing calculations

## Technology Stack

- **Frontend**: React 19, Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js
- **Visualization**: Chart.js and react-chartjs-2
- **Utilities**: bcrypt (password hashing), date-fns (date manipulation), CORS
- **Styling**: Tailwind CSS 4 with PostCSS
- **Development**: ESLint, TypeScript 5

## Features

### Inventory Management
- Add, update, and delete inventory items
- Track item quantities and multiple stock units
- Store cost prices and configure selling prices
- Support for different stock and selling units per item
- User-specific inventory isolation

### Sales Management
- Record sales transactions with item details
- Automatic profit calculation based on cost price at time of sale
- Track selling prices and units sold
- Historical sales records with timestamps
- User-specific sales isolation

### Analytics & Reporting
- Interactive dashboard with visual metrics
- Sales trend analysis with date-based charts
- Profit and revenue tracking
- Customizable date ranges for analysis
- Dark mode support with multiple theme options (Midnight Blue, Forest Green)

### User Management
- Secure authentication and authorization
- Multi-user support with data isolation
- User profile management

## Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── inventory/     # Inventory CRUD operations
│   │   │   └── sales/         # Sales CRUD operations
│   │   ├── analytics/         # Analytics page
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable React components
│   │   ├── Nav.tsx            # Navigation component
│   │   ├── Provider.tsx       # Context providers
│   │   └── FooterYear.tsx     # Footer component
│   ├── containers/            # Page-level components
│   │   ├── TradeApp.tsx       # Main application container
│   │   ├── AnalyticsPage.tsx  # Analytics dashboard
│   │   ├── SellingPriceList.tsx # Price management
│   │   └── InvoiceReceipt.tsx # Invoice generation
│   ├── models/                # Mongoose schemas
│   │   ├── inventory.ts       # Inventory schema
│   │   ├── sales.ts           # Sales schema
│   │   └── user.ts            # User schema
│   └── utils/
│       └── database.ts        # MongoDB connection utility
├── public/                    # Static assets
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── next.config.ts            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
└── eslint.config.mjs         # ESLint configuration
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- MongoDB instance (local or cloud)
- Environment variables configured

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd trademanagement
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env.local` file with:
```
MONGODB_URI=<your-mongodb-connection-string>
NEXTAUTH_SECRET=<your-secret-key>
NEXTAUTH_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## API Endpoints

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth configuration and routes

### Inventory
- `GET /api/inventory` - Retrieve all inventory items
- `POST /api/inventory` - Create new inventory item
- `GET /api/inventory/[id]` - Get specific inventory item
- `PUT /api/inventory/[id]` - Update inventory item
- `DELETE /api/inventory/[id]` - Delete inventory item

### Sales
- `GET /api/sales` - Retrieve all sales records
- `POST /api/sales` - Record new sale
- `GET /api/sales/[id]` - Get specific sale record
- `PUT /api/sales/[id]` - Update sale record
- `DELETE /api/sales/[id]` - Delete sale record

## Database Models

### Inventory
- `userId` - Reference to user (required)
- `itemName` - Item name (required)
- `quantity` - Current stock quantity (required, min: 0)
- `price` - Cost price (required, min: 0)
- `stockUnit` - Unit for stock tracking (required, e.g., pcs, kg)
- `sellingUnit` - Unit for selling (required)

### Sales
- `itemId` - Reference to inventory item (required)
- `itemName` - Item name (required)
- `quantitySold` - Quantity sold (required)
- `sellingPrice` - Price per unit (required)
- `profit` - Calculated profit (required)
- `costPriceAtTimeOfSale` - Cost price snapshot (required)
- `unitSold` - Unit of sale (required)
- `userId` - Reference to user (required)
- `saleDate` - Timestamp (default: current time)

### User
- Email-based authentication
- Password hashing with bcrypt
- User-specific data isolation

## Key Features in Detail

### Theme System
The application includes a comprehensive theming system with multiple color schemes:
- Midnight Blue theme
- Forest Green theme
- Extensible theme configuration for additional colors

### Responsive Design
- Mobile-first approach using Tailwind CSS
- Dark mode optimized UI
- Responsive layouts for all screen sizes

### Data Isolation
All user data is isolated at the database level using `userId` references, ensuring multi-tenant security.

## Development Guidelines

- Use TypeScript for type safety
- Follow existing component patterns in containers/ and components/
- API routes should validate user authentication
- Database queries should filter by `userId` for data isolation
- Tailwind CSS classes for styling consistency

## License

This project is private and maintained by Broyoung4.
