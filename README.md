# AI Ambulance Dispatch & Emergency Intelligence System

> **Warning**: This is an academic/prototype emergency-response system and is not a replacement for official emergency services.

## Problem Statement
Current emergency response systems often struggle with duplicate reports, inaccurate severity assessment, inefficient ambulance allocation, and a lack of real-time intelligent routing, leading to delayed medical care.

## Solution
An AI-powered emergency intelligence platform that combines citizen reporting, AI verification, dynamic duplicate detection, intelligent ambulance dispatch, live tracking, dynamic OSRM routing, and hospital matching into a single cohesive system.

## Features
- **Citizen Reporting**: Report emergencies with GPS and evidence.
- **AI Verification**: Image/description analysis for incident classification and severity.
- **Intelligent Dispatch**: Algorithm-based ambulance allocation.
- **Dynamic Routing**: OSRM-based routing factoring in emergency road conditions.
- **Live Tracking**: Socket.IO-based real-time ambulance tracking.
- **Hospital Matching**: ETA and capability-based hospital recommendation.
- **Command Center**: Comprehensive real-time dashboard for authorities.
- **Analytics & Hotspots**: Historical data visualization.

## Architecture
- **Frontend**: React, Vite, Tailwind CSS, Zustand, Leaflet.
- **Backend**: Node.js, Express, Socket.IO.
- **Database**: MongoDB (Mongoose).
- **AI Service**: Python, FastAPI, Gemini API.

## Folder Structure
- `/frontend`: React web application.
- `/backend`: Node.js API and Socket server.
- `/ai-service`: Python FastAPI for AI tasks.
- `/docs`: Architecture, API, and project documentation.

## Setup Instructions
(To be added)

## Environment Variables
(To be added)

## Demo Mode
(To be added)

## Security
(To be added)

## Future Scope
(To be added)

## Team Contribution
See `docs/TEAM_WORKFLOW.md` for guidelines.
