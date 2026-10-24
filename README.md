# 🇮🇳 Utility Saathi (Civic OS)
### Transparent Electricity & Water Management Platform for Indian Households

[![Tests](https://img.shields.io/badge/Tests-23%2F23%20Passed-emerald.svg)](./src/services/testRunner.ts)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4.0-38bdf8.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![Recharts](https://img.shields.io/badge/Recharts-Analytics-8884d8.svg)](https://recharts.org/)
[![License](https://img.shields.io/badge/License-MIT-amber.svg)](LICENSE)

**Utility Saathi** is an everyday civic utility management and consumer protection platform designed to solve common pain points faced by residents, tenants, landlords, and municipal utility officers across Indian cities.

---

## ✨ Key Features

### 1. 📊 Usage Analytics & Interactive India State Maps
- **Interactive State Map:** Stylized SVG map exploring 7 major Indian states and their utility boards (**Rajasthan**, **Delhi**, **Gujarat**, **Maharashtra**, **Karnataka**, **Kerala**, and **Tamil Nadu**).
- **Comparative State Metrics:** Average domestic tariff per unit (kWh), daily consumption benchmarks, renewable energy share, and peak season profiles.
- **6-Month Consumption Trends:** Built with Recharts dual-utility area charts, monthly comparative bar charts, and domestic tier distribution donuts.

### 2. 🧾 Plain-English Bill Reconstruction & Anomaly Detection
- Eliminates confusing acronyms and opaque utility invoices.
- Breaks down official tariff slabs (BESCOM, BWSSB, BSES, etc.) into transparent math: base charges, energy tiers, fuel adjustment charges (FAC), and taxes.
- **Non-accusatory surge explanations:** Explains estimated-to-actual catch-up bills, seasonal surges, and dial meter rollovers without accusing residents of theft.

### 3. 🛡️ Double-Charge Shield & Idempotent Ledger
- **Accidental double-click protection:** Once a bank or UPI app confirms deduction, the bill is locked.
- **Transparent 3-way reconciliation:** Tracks bank debit confirmations vs. board receipts, preventing duplicate debits during slow network periods.

### 4. ⚡ Outage & Water Cut Tracking with Feeder Clustering
- Groups resident outage reports by electrical feeder or water pressure zone (`F-INDIRA-04-TR2`, etc.).
- Displays real-time status updates: *Reported* ➔ *Crew Dispatched* ➔ *Service Restored* with estimated restoration times (ETR).

### 5. 🟩 GitHub-Style Eco Streak & Community Percentile
- **28-Day Activity Grid:** Inspired by GitHub contribution heatmaps, color-coding daily consumption efficiency.
- **Neighborhood Leaderboard:** Shows how much energy you conserve compared to other nearby 2BHK households (*e.g., "Ahead of 84% of homes in Indiranagar"*).

### 6. 💡 Household Savings Calculator (AC & Solar)
- Calculates exact monthly and annual ₹ savings by shifting high-consumption habits (e.g. running AC at 24°C instead of 18°C).
- Grounded in official **Central Electricity Authority (CEA)** grid emission data (0.82 kg CO₂/kWh).

### 7. 👥 Role-Based Access Control (RBAC)
- **Tenant View:** Access current bills, payment receipts, and outage alerts for their rented flat.
- **Landlord View:** Anita Desai can manage multiple rented properties across Indiranagar and Whitefield from one screen.
- **Officer Desk / Admin Console:** Er. Vikram Singh can verify physical line faults, resolve resident disputes, and review audit trails.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript
- **Bundler & Dev Server:** Vite 8
- **Styling:** Tailwind CSS v4 (with vibrant Indian civic color palette)
- **Data Visualization:** Recharts
- **Icons:** Lucide React
- **CI/CD:** GitHub Actions (automated test runner and GitHub Pages deployment)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm (v9.0.0 or higher)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/utility-saathi.git
   cd utility-saathi
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Vite development server at `http://localhost:3000` |
| `npm run build` | Compiles TypeScript and creates optimized production bundle in `/dist` |
| `npm run preview` | Locally previews the production build |
| `npm test` | Runs the full 23-case statutory tariff and system verification test suite |
| `npm run lint` | Runs TypeScript type checking (`tsc --noEmit`) |

---

## 🚢 Deploying to GitHub Pages

An automated GitHub Actions workflow (`.github/workflows/deploy.yml`) is already included!

1. Push your repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Utility Saathi"
   git branch -M main
   git remote add origin https://github.com/your-username/utility-saathi.git
   git push -u origin main
   ```
2. In your GitHub repository, open **Settings** > **Pages**.
3. Under **Build and deployment > Source**, choose **GitHub Actions**.
4. The workflow will automatically test, build, and deploy your live app at:
   ```
   https://your-username.github.io/utility-saathi/
   ```

---

## 🔒 Security & Privacy

- All sensitive credentials and API tokens use server-side environment variables (`.env`).
- Client-side token storage conforms to strict CSRF and XSS protection best practices.
- Idempotency tokens ensure no duplicate financial transactions can be initiated.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
