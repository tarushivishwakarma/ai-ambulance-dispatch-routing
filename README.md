# AI Dispatch 🚑

**AI-powered Emergency Ambulance Dispatch & Routing System** built by **Team CompileOrCry**.

AI Dispatch is an intelligent emergency coordination platform designed to reduce ambulance response time in traffic-heavy cities. Instead of selecting an ambulance based only on distance, the system considers **severity, availability, vehicle suitability, predicted ETA, traffic conditions, and hospital requirements** to make better dispatch decisions.

> **Existing emergency infrastructure + an AI optimization layer.**

---

## 🚨 Problem

Emergency ambulances can lose critical time because of:

* Heavy and unpredictable traffic
* Inefficient ambulance allocation
* Static route selection
* Lack of real-time rerouting
* Difficulty matching patients with suitable hospitals
* Limited centralized visibility of emergency resources

Even when an ambulance is geographically nearby, it may not be the **fastest or most suitable** option.

---

## 💡 Proposed Solution

AI Dispatch follows this workflow:

```text
Emergency Request
       ↓
GPS Location Detection
       ↓
AI-Assisted Triage
       ↓
Severity Assessment
       ↓
Best Ambulance Selection
       ↓
Traffic-Aware Route Planning
       ↓
Live GPS Monitoring
       ↓
Dynamic Rerouting
       ↓
Hospital Matching
       ↓
Emergency Completion
```

The dispatch engine ranks available ambulances using multiple factors instead of simply choosing the nearest vehicle.

### Key decision factors

* Ambulance availability
* Current location
* Predicted travel time
* Emergency severity
* Ambulance type/equipment
* Traffic conditions
* Hospital distance
* Required medical facilities
* Bed/ICU availability

---

## ✨ Key Features

### 🧠 AI-Assisted Emergency Triage

Analyzes the emergency description and helps classify:

* Emergency category
* Severity level
* Required ambulance capability

### 🚑 Intelligent Ambulance Dispatch

Selects the ambulance with the **lowest predicted response time**, while considering suitability and availability.

### 🗺️ Dynamic Routing

Uses route optimization and traffic information to identify practical routes.

Candidate routes can be calculated using **A*** / **Dijkstra**, with traffic and road-blockage penalties.

### 🔄 Live Rerouting

Routes can be recalculated when traffic, road blockages, or other conditions change.

### 🏥 Smart Hospital Matching

Recommends hospitals according to:

* Trauma capability
* ICU availability
* Bed availability
* Distance
* Facility requirements

### 📍 Live Tracking

Provides real-time visibility of ambulance locations and status.

### 📊 Command Center

A centralized dashboard provides:

* Active incidents
* Critical emergencies
* Ambulance availability
* Active dispatches
* Hospital network
* Average response time
* Regional incident density
* Fleet status
* Road conditions

### 🚦 Traffic & Road Monitoring

Identifies active traffic blockages and applies route penalties to affected roads.

### 📈 Analytics

Historical and operational data can be used to identify:

* High-delay zones
* Accident hotspots
* Incident patterns
* Fleet utilization
* Response-time trends

---

## 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │ Emergency User      │
                    │ / Dispatcher        │
                    └──────────┬──────────┘
                               ↓
                    ┌─────────────────────┐
                    │ API / Backend       │
                    │ Express + FastAPI   │
                    └──────────┬──────────┘
                               ↓
              ┌────────────────────────────────┐
              │ AI Dispatch & Decision Engine  │
              │                                │
              │ • Triage                       │
              │ • Severity                     │
              │ • Ambulance Ranking            │
              │ • ETA Prediction                │
              └───────────────┬────────────────┘
                              ↓
             ┌────────────────────────────────┐
             │ Routing & Optimization Engine  │
             │                                │
             │ A* / Dijkstra                  │
             │ Traffic-aware routing           │
             │ Dynamic rerouting               │
             └───────────────┬────────────────┘
                             ↓
          ┌──────────────────────────────────────┐
          │ Hospital Matching & Capacity Layer   │
          │                                      │
          │ Trauma • ICU • Beds • Facilities     │
          └──────────────────┬───────────────────┘
                             ↓
                 ┌──────────────────────┐
                 │ Command Center       │
                 │ Live Dashboard       │
                 └──────────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Leaflet / Mapbox

### Backend

* Node.js
* Express.js
* Python
* FastAPI
* Socket.IO

### Database

* MongoDB
* MongoDB Atlas

### AI / Machine Learning

* AI-assisted triage
* ETA prediction
* Traffic prediction
* Response-time prediction
* XGBoost / Random Forest *(planned/optional)*

### Routing & Maps

* A*
* Dijkstra
* Google Maps Platform / Mapbox
* OpenStreetMap
* OSRM

### Deployment

* Vercel
* Render / Railway
* MongoDB Atlas

---

## 📊 Dashboard Modules

The prototype includes:

* Emergency Operations Center
* Dispatch Command
* Live Incidents
* Ambulance Monitoring
* Healthcare Network
* Road Conditions & Routing
* System Analytics
* Emergency Reporting
* Authority Dashboard

The prototype currently uses **synthetic/demo data** for demonstration purposes.

---

## 🔄 Dispatch Logic

```text
New Emergency
      ↓
Identify Location
      ↓
Determine Severity
      ↓
Filter Available Ambulances
      ↓
Check Vehicle Suitability
      ↓
Calculate Predicted ETA
      ↓
Evaluate Traffic
      ↓
Rank Ambulances
      ↓
Dispatch Best Option
      ↓
Monitor GPS
      ↓
Traffic Changed?
   ↙          ↘
 YES           NO
  ↓             ↓
Recalculate    Continue
 Route         Monitoring
      ↓
Hospital Matching
      ↓
Emergency Completed
```

---

## 🎯 What Makes AI Dispatch Different?

AI Dispatch is **not intended to replace existing emergency services**.

The project focuses on adding an intelligence and optimization layer to existing emergency-response infrastructure.

### Core USP

> **"Don't just find the nearest ambulance. Find the best ambulance, predict the fastest achievable response, dynamically reroute it, and recommend the most suitable hospital."**

This makes the system more than a basic ambulance tracking application.

---

## 📈 Future Roadmap

* Integration with real emergency-service APIs
* Real-time government/municipal traffic feeds
* Traffic-signal priority for ambulances
* Advanced ETA prediction using larger historical datasets
* Predictive identification of high-risk zones
* Multi-ambulance coordination during mass-casualty events
* Voice-based emergency reporting
* Multilingual emergency interface
* IoT integration with ambulances
* Hospital API integration for real-time bed availability
* Integration with existing emergency response networks

---

## ⚠️ Current Limitations

The hackathon prototype has some limitations:

* Uses synthetic/demo operational data
* Real emergency-service API integration is not included
* Actual ambulance GPS hardware is not connected
* Hospital capacity data is simulated
* Traffic feeds may require external API integration
* ML prediction accuracy depends on availability of historical data

These limitations can be addressed during production deployment through partnerships and real-time data integrations.

---

## 👥 Team

### **CompileOrCry**

Built as a hackathon prototype focused on **AI, optimization, real-time systems, and emergency response**.

---

## 📌 Project Status

**Prototype / Hackathon Implementation**

The current prototype demonstrates the complete conceptual workflow from **emergency reporting → AI analysis → ambulance dispatch → routing → hospital matching → command-center monitoring**.

---

## 🚀 Getting Started

Clone the repository:

```bash
git clone <YOUR_REPOSITORY_URL>
cd <YOUR_REPOSITORY_NAME>
```

Install dependencies according to the frontend/backend project structure and configure the required environment variables.

Example:

```bash
npm install
npm run dev
```

For the Python service:

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

> Update these commands according to the actual repository structure before publishing the README.

---

## 📄 License

This project was developed as a **hackathon prototype** by Team CompileOrCry.
