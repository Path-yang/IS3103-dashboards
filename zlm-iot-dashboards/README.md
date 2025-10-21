# ZhangLiang MalaTang - IoT Analytics Dashboards

A production-ready, full-stack IoT analytics dashboard application for monitoring ZhangLiang MalaTang's backend operations across Singapore outlets.

## Overview

This dashboard platform provides real-time monitoring and analytics for:
- **Cold-chain temperature monitoring** across all outlet locations
- **Ingredient inventory levels** and refill patterns
- **Consumption trends** by ingredient and time period
- **Food waste tracking** with detailed disposal analytics

Built with modern web technologies for performance, scalability, and developer experience.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Charts**: Recharts
- **Maps**: Mapbox GL JS via react-map-gl
- **Package Manager**: pnpm

## Dashboards

### 1. Outlet Cold-Chain Map (`/dashboards/outlet-map`)
Interactive map of Singapore showing all outlet locations with real-time temperature status indicators.

**Features**:
- Green markers (≤4°C) for normal temperature
- Red markers (>4°C) for abnormal temperature
- Click markers to view detailed outlet information
- 24-hour temperature trend sparklines
- Fallback list view when Mapbox token is not configured

### 2. Cold-Chain Trends & Alerts (`/dashboards/coldchain-trends`)
Time-series analysis of abnormal temperature readings with outlet performance breakdown.

**Features**:
- Switchable time windows: 24h, 7d, 30d
- KPI metrics: Total alerts, avg response time, max temperature spike
- Line chart showing abnormal reading trends over time
- Horizontal bar chart of top outlets by abnormal count

### 3. Front Chiller Levels (`/dashboards/chiller-levels`)
Real-time monitoring of ingredient tray fill levels and refill activities.

**Features**:
- Outlet selector to view specific location data
- Grid of ingredient cards showing:
  - Current fill percentage with progress bar
  - Status badge (OK/LOW)
  - Refill count for the day
- Sticky footer with aggregate statistics

### 4. Consumption Estimation (`/dashboards/chiller-consumption`)
Weight-based consumption tracking by ingredient over configurable time periods.

**Features**:
- Time window selection: Daily, Weekly, Monthly
- Stacked or grouped bar chart toggle
- Top 3 ingredients display
- Multi-ingredient comparison over time

### 5. Food Waste Dashboard (`/dashboards/food-waste`)
Comprehensive waste tracking with filtering and detailed records.

**Features**:
- Multi-select ingredient filter
- Disposal reason filter (expiry, leftover, quality)
- Time-series bar chart of waste weight
- Detailed table of all waste records
- Total waste KPI

## Getting Started

### Prerequisites

- Node.js 18+ or 20+
- pnpm 8+ (recommended) or npm/yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd zlm-iot-dashboards
```

2. Install dependencies:
```bash
pnpm install
```

3. (Optional) Configure environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Mapbox token:
```
MAPBOX_TOKEN=your_mapbox_token_here
```

**Note**: The Mapbox token is optional. If not provided, the Outlet Map dashboard will display a fallback list view instead of the interactive map.

### Development

Run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
pnpm build
```

### Running Production Build Locally

```bash
pnpm build
pnpm start
```

### Linting & Type Checking

```bash
# Run ESLint
pnpm lint

# Run TypeScript type checker
pnpm typecheck
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MAPBOX_TOKEN` | No | Mapbox access token for interactive maps. Get yours at [mapbox.com](https://www.mapbox.com/). If not set, the outlet map will show a fallback list view. |

## Project Structure

```
zlm-iot-dashboards/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── outlets/          # Outlet endpoints
│   │   ├── coldchain/        # Cold-chain endpoints
│   │   ├── chiller/          # Chiller endpoints
│   │   └── waste/            # Waste endpoints
│   ├── dashboards/           # Dashboard pages
│   │   ├── outlet-map/
│   │   ├── coldchain-trends/
│   │   ├── chiller-levels/
│   │   ├── chiller-consumption/
│   │   └── food-waste/
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page
│   ├── error.tsx             # Error boundary
│   └── globals.css           # Global styles
├── components/               # React components
│   ├── ui/                   # shadcn/ui components
│   ├── shared/               # Shared custom components
│   └── dashboards/           # Dashboard-specific components
├── lib/                      # Utilities
│   ├── types.ts              # TypeScript type definitions
│   └── utils.ts              # Helper functions
├── data/                     # Mock data generators
│   ├── outlets.ts
│   ├── coldchain.ts
│   ├── chiller.ts
│   ├── ingredients.ts
│   └── waste.ts
├── public/                   # Static assets
├── .env.local.example        # Environment variables template
├── next.config.ts            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies and scripts
```

## Deploying to Vercel

### Method 1: Deploy via Vercel Dashboard

1. Push your code to GitHub:
```bash
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. Visit [vercel.com](https://vercel.com) and sign in
3. Click "New Project"
4. Import your GitHub repository
5. Configure project:
   - Framework Preset: Next.js (auto-detected)
   - Build Command: `pnpm build` (auto-detected)
   - Output Directory: `.next` (auto-detected)
6. Add environment variables (optional):
   - `MAPBOX_TOKEN`: Your Mapbox access token
7. Click "Deploy"

### Method 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel
```

Follow the prompts to link your project and deploy.

### Environment Variables on Vercel

In your Vercel project settings:
1. Go to Settings → Environment Variables
2. Add `MAPBOX_TOKEN` (optional)
3. Redeploy for changes to take effect

## API Endpoints (Mock Data)

All API endpoints currently return mock data. Replace these with real backend calls when integrating with actual IoT systems.

| Endpoint | Description |
|----------|-------------|
| `GET /api/outlets` | List all outlets with current status |
| `GET /api/outlets/[id]/temp-history` | 24-hour temperature history for an outlet |
| `GET /api/coldchain/summary?window=24h\|7d\|30d` | Cold-chain summary and trends |
| `GET /api/chiller/levels?outletId=...` | Chiller levels for an outlet |
| `GET /api/chiller/consumption?outletId=...&window=daily\|weekly\|monthly` | Consumption data |
| `GET /api/waste?ingredientIds=...&reason=...&window=...` | Waste records with filters |

## Development Notes

### Mock Data

All data is generated on-demand using seeded random values for realistic variation. The data generators are located in the `/data` directory.

To replace with real data:
1. Update API route handlers in `/app/api/*`
2. Replace mock data calls with actual backend API calls
3. Update TypeScript types if needed in `/lib/types.ts`

### Adding New Dashboards

1. Create a new route in `/app/dashboards/[name]/page.tsx`
2. Add corresponding API routes if needed
3. Update the home page (`/app/page.tsx`) to include the new dashboard link

### Styling

This project uses:
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** design system with CSS variables for theming
- Custom color palette defined in `globals.css`

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

ISC

## Screenshots

*Add screenshots of your dashboards here after deployment*

### Dashboard Home
![Home Page](./screenshots/home.png)

### Outlet Cold-Chain Map
![Outlet Map](./screenshots/outlet-map.png)

### Cold-Chain Trends
![Trends](./screenshots/trends.png)

### Chiller Levels
![Chiller Levels](./screenshots/chiller-levels.png)

### Consumption Estimation
![Consumption](./screenshots/consumption.png)

### Food Waste
![Food Waste](./screenshots/waste.png)

---

Built with ❤️ for ZhangLiang MalaTang
