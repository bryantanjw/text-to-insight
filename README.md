# Text-to-Insight

Text-to-Insight is a powerful tool that translates natural language into complex SQL queries, tabular data, and visualizations. It effectively eliminates the barrier of technical expertise for database interactions by empowering users—especially those in business-facing roles—to effortlessly query data and generate visualizations.

https://github.com/user-attachments/assets/4fc125e3-01aa-4438-bbeb-7cca00865d58

## Features

- 🤖 Natural Language to SQL: Convert plain English questions into complex SQL queries
- 📊 Automatic Visualization: Generate relevant charts and graphs from query results
- 📝 SQL Explanation: Get natural language explanations of generated SQL queries
- 📋 Interactive Tables: View and explore query results in a clean tabular format
- 🎨 Customizable Visualizations: Modify generated charts using natural language
- 📚 Schema Understanding: Built-in understanding of your database schema

## Architecture

The project consists of two main components:

### Frontend (Next.js)

- Built with Next.js 13
- Uses Cloudscape Design System for UI components
- Vega-Lite for data visualization
- TypeScript for type safety

### Backend (Flask)

- Flask REST API
- OpenAI integration for natural language processing
- PostgreSQL database support
- SQLAlchemy for database operations

## Prerequisites

### API

- Python 3.10
- PostgreSQL database
- OpenAI API key

### Client

- Node.js 16+
- npm or yarn

## Getting Started

### Backend Setup

1. Navigate to the api directory:

```bash
    cd api
```

2. Install dependencies:

```bash
    pip install -r requirements.txt
```

3. Configure environment variables:

- Create a `.env` file based on `.env.example`
- Add your OpenAI API key
- Configure your PostgreSQL database URL

4. Start the development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to access the application.

## Database Schema

The application currently supports the following tables:

1. `crime_by_city`: Contains city-level crime data in the United States
2. `demographic_data`: Contains zip-code level demographic information
3. `national_housing_market_data`: Contains national-level housing market data

For detailed schema information, refer to the table metadata in `api/app/models/json/table_metadata.json`.
