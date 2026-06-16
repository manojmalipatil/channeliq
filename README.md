# ChannelIQ: AI Omnichannel Orchestrator ⚡

ChannelIQ is a next-generation AI-powered omnichannel customer support dashboard designed for marketing and operations teams. It provides real-time visibility into customer journeys across WhatsApp, Email, Webchat, and Push notifications, leveraging an AI agent to resolve tickets and intelligently escalate complex issues.

This project was built to demonstrate the immense business value of AI: deflecting tickets, saving costs, and improving customer sentiment across all communication channels.

## 🌟 Key Features
- **Live Event Feed**: Watch interactions stream in real-time across multiple channels.
- **Customer Journey Map**: A visual graph tracking a customer's progression and channel-switching behavior.
- **AI Marketing Analytics**: A dedicated analytics dashboard tracking 7-day sentiment trends, channel effectiveness, and estimated AI cost savings.
- **Interactive Simulator**: An AI-powered simulation engine that generates realistic customer conversations on demand.

## 🛠 Tech Stack
- **Frontend**: Next.js 14, React, Tailwind CSS, Native SVG Charts
- **Backend**: Python, FastAPI, Server-Sent Events (SSE) for real-time streaming
- **Database/Cache**: Redis
- **Infrastructure**: Docker & Docker Compose

---

## 🚀 Getting Started

Running the project is incredibly simple thanks to Docker. You don't need to manually install Node.js, Python, or Redis on your machine.

### Prerequisites
1. Ensure you have **Docker Desktop** installed and running on your machine.
   - [Download Docker Desktop](https://www.docker.com/products/docker-desktop)
2. Ensure you have Git installed.

### Installation & Execution

1. **Clone the repository:**
   ```bash
   git clone <your-github-repo-url>
   cd channeliq
   ```

2. **Build and start the application:**
   ```bash
   docker-compose up --build
   ```
   *Note: The first time you run this, it will take a few minutes to download the base Docker images and install dependencies.*

3. **Access the application:**
   - **Frontend Dashboard**: Open [http://localhost:3000](http://localhost:3000) in your browser.
   - **Backend API Docs**: Open [http://localhost:8000/docs](http://localhost:8000/docs) to view the Swagger API documentation.

### Stopping the Application
To stop the servers, press `Ctrl + C` in the terminal where Docker is running.
To completely tear down the containers and network, run:
```bash
docker-compose down
```

---

## 💡 How to Use the Dashboard
1. **Live Sync**: The dashboard connects to the backend via Server-Sent Events (SSE). It will automatically update without refreshing the page.
2. **Simulate Data**: Click the **"🚀 Simulate Journey"** or **"⚡ Bulk Test"** buttons in the header to trigger the AI simulation engine. You will see messages immediately stream into the Live Feed and Journey Map.
3. **Inspect Journeys**: Click on any customer node in the Journey Map to open the sliding Customer Panel, which reveals their unified, cross-channel conversation history.
4. **View Analytics**: Toggle the "Campaign Analytics" tab in the top header to view real-time calculations of AI deflection rates and marketing ROI based on the simulated data.

---

## 🏗 Architecture
- **`frontend/`**: The Next.js application containing the glassmorphic UI components.
- **`backend/`**: The FastAPI application handling the core business logic, simulation generation, and SSE streaming.
- **`docker-compose.yml`**: Orchestrates the frontend, backend, and Redis cache containers into a unified local network.

Enjoy orchestrating!
