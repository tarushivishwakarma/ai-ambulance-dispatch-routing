const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const Hospital = require('../models/Hospital');
const Ambulance = require('../models/Ambulance');
const Incident = require('../models/Incident');
const IncidentHistory = require('../models/IncidentHistory');
const Alert = require('../models/Alert');
const RoadCondition = require('../models/RoadCondition');
const Dispatch = require('../models/Dispatch');
const Route = require('../models/Route');

const CITIES = [
  { name: 'New Delhi', state: 'Delhi', coords: [77.2090, 28.6139] },
  { name: 'Mumbai', state: 'Maharashtra', coords: [72.8777, 19.0760] },
  { name: 'Bengaluru', state: 'Karnataka', coords: [77.5946, 12.9716] },
  { name: 'Chennai', state: 'Tamil Nadu', coords: [80.2707, 13.0827] },
  { name: 'Kolkata', state: 'West Bengal', coords: [88.3639, 22.5726] },
  { name: 'Hyderabad', state: 'Telangana', coords: [78.4867, 17.3850] },
  { name: 'Pune', state: 'Maharashtra', coords: [73.8567, 18.5204] },
  { name: 'Ahmedabad', state: 'Gujarat', coords: [72.5714, 23.0225] },
  { name: 'Lucknow', state: 'Uttar Pradesh', coords: [80.9462, 26.8467] },
  { name: 'Jaipur', state: 'Rajasthan', coords: [75.7873, 26.9124] },
  { name: 'Chandigarh', state: 'Chandigarh', coords: [76.7794, 30.7333] },
  { name: 'Bhopal', state: 'Madhya Pradesh', coords: [77.4126, 23.2599] },
  { name: 'Patna', state: 'Bihar', coords: [85.1376, 25.5941] },
  { name: 'Bhubaneswar', state: 'Odisha', coords: [85.8245, 20.2961] },
  { name: 'Guwahati', state: 'Assam', coords: [91.7362, 26.1445] },
  { name: 'Kochi', state: 'Kerala', coords: [76.2673, 9.9312] },
  { name: 'Indore', state: 'Madhya Pradesh', coords: [75.8577, 22.7196] },
  { name: 'Nagpur', state: 'Maharashtra', coords: [79.0882, 21.1458] },
  { name: 'Dehradun', state: 'Uttarakhand', coords: [78.0322, 30.3165] },
  { name: 'Surat', state: 'Gujarat', coords: [72.8311, 21.1702] }
];

const getRandomOffset = () => (Math.random() - 0.5) * 0.1; // ~5km radius
const randomCity = () => CITIES[Math.floor(Math.random() * CITIES.length)];
const randomElem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const hospitalNames = [
  'AIIMS', 'Safdarjung Hospital', 'KGMU', 'Dr RMLIMS', 'Apollo Hospitals', 
  'Max Super Speciality', 'Medanta', 'KEM Hospital', 'Sion Hospital', 
  'PGIMER', 'Narayana Health', 'Apollo', 'SCB Medical College'
];
const demoNames = [
  'Demo Trauma Centre', 'Metro Emergency Hospital', 'National Demo Trauma Institute',
  'City Care Demo', 'Apex Demo Healthcare'
];

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected.');

  console.log('Clearing existing data...');
  await Hospital.deleteMany({});
  await Ambulance.deleteMany({});
  await Incident.deleteMany({});
  await IncidentHistory.deleteMany({});
  await Alert.deleteMany({});
  await RoadCondition.deleteMany({});
  await Dispatch.deleteMany({});
  await Route.deleteMany({});

  console.log('Generating 155 Hospitals...');
  const hospitals = [];
  for (let i = 0; i < 155; i++) {
    const city = randomCity();
    const isDemo = Math.random() > 0.5;
    const nameBase = isDemo ? randomElem(demoNames) : randomElem(hospitalNames);
    
    hospitals.push({
      name: `${nameBase} ${city.name}`,
      city: city.name,
      state: city.state,
      location: {
        type: 'Point',
        coordinates: [city.coords[0] + getRandomOffset(), city.coords[1] + getRandomOffset()]
      },
      address: `123 Main St, ${city.name}`,
      emergencyDepartment: true,
      traumaCenter: Math.random() > 0.3,
      traumaLevel: randomInt(1, 3),
      traumaCapable: true,
      icuAvailable: true,
      icuBeds: randomInt(20, 100),
      availableIcuBeds: randomInt(0, 20),
      emergencyBeds: randomInt(30, 150),
      availableEmergencyBeds: randomInt(5, 30),
      bedsAvailable: randomInt(10, 50),
      occupancy: randomInt(60, 95),
      type: isDemo ? 'PRIVATE' : 'GOVERNMENT',
      dataSource: 'SYNTHETIC_DEMO',
      status: Math.random() > 0.1 ? 'ACTIVE' : 'OVERCAPACITY'
    });
  }
  const insertedHospitals = await Hospital.insertMany(hospitals);

  console.log('Generating 160 Ambulances...');
  const ambulances = [];
  for (let i = 0; i < 160; i++) {
    const city = randomCity();
    const caps = ['BASIC_LIFE_SUPPORT', 'ADVANCED_LIFE_SUPPORT', 'PATIENT_TRANSPORT'];
    const capKeys = ['BLS', 'ALS', 'TRAUMA', 'NEONATAL', 'CARDIAC'];
    
    ambulances.push({
      ambulanceId: `AMB-${String(i+1).padStart(4, '0')}`,
      registrationNumber: `${city.state.substring(0,2).toUpperCase()}${randomInt(10,99)}AB${randomInt(1000,9999)}`,
      city: city.name,
      state: city.state,
      type: randomElem(caps),
      capability: randomElem(capKeys),
      driverName: `Driver ${i+1}`,
      driverPhone: `+9198${randomInt(10000000,99999999)}`,
      speed: randomInt(0, 80),
      heading: randomInt(0, 360),
      currentLocation: {
        type: 'Point',
        coordinates: [city.coords[0] + getRandomOffset(), city.coords[1] + getRandomOffset()]
      },
      status: randomElem(['AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'EN_ROUTE', 'ON_SCENE', 'TRANSPORTING', 'RETURNING', 'MAINTENANCE'])
    });
  }
  const insertedAmbulances = await Ambulance.insertMany(ambulances);

  console.log('Generating 120 Current Incidents...');
  const incidents = [];
  const categories = ['ROAD_ACCIDENT', 'MEDICAL', 'CARDIAC', 'FIRE', 'TRAUMA', 'FALL', 'STROKE', 'RESPIRATORY', 'INDUSTRIAL', 'OTHER'];
  const severities = [
    { sev: randomInt(9, 10), class: 'CRITICAL' },
    { sev: randomInt(7, 8), class: 'HIGH' },
    { sev: randomInt(4, 6), class: 'MODERATE' },
    { sev: randomInt(1, 3), class: 'LOW' }
  ];

  for (let i = 0; i < 120; i++) {
    const city = randomCity();
    const sv = randomElem(severities);
    
    incidents.push({
      incidentId: `INC-IND-${String(i+1000).padStart(4, '0')}`,
      category: randomElem(categories),
      description: `Emergency reported in ${city.name} area. Requires immediate attention.`,
      city: city.name,
      state: city.state,
      location: {
        type: 'Point',
        coordinates: [city.coords[0] + getRandomOffset(), city.coords[1] + getRandomOffset()]
      },
      status: randomElem(['PENDING', 'ASSIGNED', 'EN_ROUTE', 'ON_SCENE', 'TRANSPORTING']),
      severity: sv.sev,
      severityScore: sv.sev * 10,
      aiConfidence: (Math.random() * 0.3 + 0.7), // 0.7 to 1.0
      aiAnalysis: { reasoningSummary: `AI classified as ${sv.class} based on keywords.` },
      affectedPeople: randomInt(1, 5),
      reportedAt: new Date(Date.now() - randomInt(1, 60) * 60000) // within last hour
    });
  }
  const insertedIncidents = await Incident.insertMany(incidents);

  console.log('Generating 550 Historical Incidents...');
  const historical = [];
  for (let i = 0; i < 550; i++) {
    const year = randomElem([2020, 2021, 2022, 2023, 2024, 2025]);
    const month = randomInt(0, 11);
    const day = randomInt(1, 28);
    const date = new Date(year, month, day);
    const incRef = randomElem(insertedIncidents)._id; // Just for reference
    
    historical.push({
      incident: incRef,
      status: 'RESOLVED',
      note: 'Historically resolved incident.',
      createdAt: date
    });
  }
  await IncidentHistory.insertMany(historical);

  console.log('Generating 80 Alerts...');
  const alerts = [];
  const alertTypes = ['Heavy Rain', 'Flooding', 'Road Blockage', 'Traffic Congestion', 'Accident', 'Hospital Capacity Warning'];
  for (let i = 0; i < 80; i++) {
    const city = randomCity();
    alerts.push({
      type: randomElem(alertTypes),
      severity: randomElem(['CRITICAL', 'HIGH', 'MODERATE', 'LOW']),
      city: city.name,
      state: city.state,
      location: {
        type: 'Point',
        coordinates: [city.coords[0] + getRandomOffset(), city.coords[1] + getRandomOffset()]
      },
      message: `Warning: ${randomElem(alertTypes)} in ${city.name} area.`,
      source: 'System AI',
      status: 'ACTIVE',
      expiresAt: new Date(Date.now() + 86400000)
    });
  }
  await Alert.insertMany(alerts);

  console.log('Generating 85 Road Conditions...');
  const roadConditions = [];
  for (let i = 0; i < 85; i++) {
    const city = randomCity();
    roadConditions.push({
      roadName: `Main Road ${i}`,
      city: city.name,
      state: city.state,
      location: {
        type: 'Point',
        coordinates: [city.coords[0] + getRandomOffset(), city.coords[1] + getRandomOffset()]
      },
      type: randomElem(['ACCIDENT', 'ROAD_BLOCK', 'FLOODING', 'CONSTRUCTION', 'HEAVY_TRAFFIC']),
      severity: randomElem(['CRITICAL', 'HIGH', 'MODERATE', 'LOW']),
      description: `Traffic severely affected in ${city.name}.`,
      estimatedDelay: randomInt(5, 45),
      status: 'ACTIVE'
    });
  }
  await RoadCondition.insertMany(roadConditions);

  console.log('Generating 80 Dispatches and Routes...');
  const dispatches = [];
  const routes = [];
  
  // Link existing incidents that are not pending
  const activeIncs = insertedIncidents.filter(i => i.status !== 'PENDING').slice(0, 80);
  
  for (let i = 0; i < activeIncs.length; i++) {
    const inc = activeIncs[i];
    // Find an ambulance and hospital in the same city
    const amb = insertedAmbulances.find(a => a.city === inc.city) || insertedAmbulances[0];
    const hosp = insertedHospitals.find(h => h.city === inc.city) || insertedHospitals[0];

    const dispatchId = new mongoose.Types.ObjectId();
    
    dispatches.push({
      _id: dispatchId,
      incident: inc._id,
      ambulance: amb._id,
      hospital: hosp._id,
      priority: inc.severity >= 8 ? 'CRITICAL' : 'HIGH',
      eta: randomInt(5, 20),
      distance: randomInt(2, 15),
      status: inc.status === 'ASSIGNED' ? 'ASSIGNED' : 
              inc.status === 'EN_ROUTE' ? 'EN_ROUTE' : 
              inc.status === 'ON_SCENE' ? 'ARRIVED' : 'TRANSPORTING',
      assignedAt: new Date(),
      dispatchTime: new Date()
    });

    routes.push({
      dispatch: dispatchId,
      ambulance: amb._id,
      incident: inc._id,
      hospital: hosp._id,
      origin: amb.currentLocation.coordinates,
      destination: inc.location.coordinates,
      geometry: {
        coordinates: [
          amb.currentLocation.coordinates,
          [ (amb.currentLocation.coordinates[0] + inc.location.coordinates[0])/2, (amb.currentLocation.coordinates[1] + inc.location.coordinates[1])/2 ],
          inc.location.coordinates
        ]
      },
      distance: randomInt(2000, 15000),
      duration: randomInt(300, 1200),
      estimatedTime: randomInt(5, 20),
      status: 'ACTIVE'
    });
    
    // Update incident and ambulance with the assignments
    await Incident.updateOne({ _id: inc._id }, { assignedAmbulance: amb._id, recommendedHospital: hosp._id });
    await Ambulance.updateOne({ _id: amb._id }, { currentIncident: inc._id, currentAssignment: `INC-IND-${String(i+1000).padStart(4, '0')}` });
  }
  
  await Dispatch.insertMany(dispatches);
  await Route.insertMany(routes);

  console.log('Seed completed successfully!');
  console.log(`Summary:
  Hospitals: ${hospitals.length}
  Ambulances: ${ambulances.length}
  Incidents: ${incidents.length}
  Historical: ${historical.length}
  Alerts: ${alerts.length}
  Road Conditions: ${roadConditions.length}
  Dispatches: ${dispatches.length}
  Routes: ${routes.length}
  `);

  process.exit(0);
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
