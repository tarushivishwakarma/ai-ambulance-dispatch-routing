export const CITIES = [
  { name: 'New Delhi', coords: [77.2090, 28.6139], region: 'North' },
  { name: 'Mumbai', coords: [72.8777, 19.0760], region: 'West' },
  { name: 'Lucknow', coords: [80.9462, 26.8467], region: 'North' },
  { name: 'Bengaluru', coords: [77.5946, 12.9716], region: 'South' },
  { name: 'Hyderabad', coords: [78.4867, 17.3850], region: 'South' },
  { name: 'Chennai', coords: [80.2707, 13.0827], region: 'South' },
  { name: 'Kolkata', coords: [88.3639, 22.5726], region: 'East' },
  { name: 'Pune', coords: [73.8567, 18.5204], region: 'West' },
  { name: 'Ahmedabad', coords: [72.5714, 23.0225], region: 'West' },
  { name: 'Jaipur', coords: [75.7873, 26.9124], region: 'North' },
  { name: 'Bhopal', coords: [77.4126, 23.2599], region: 'Central' },
  { name: 'Indore', coords: [75.8577, 22.7196], region: 'Central' },
  { name: 'Patna', coords: [85.1376, 25.5941], region: 'East' },
  { name: 'Chandigarh', coords: [76.7794, 30.7333], region: 'North' },
  { name: 'Bhubaneswar', coords: [85.8245, 20.2961], region: 'East' },
  { name: 'Guwahati', coords: [91.7362, 26.1445], region: 'Northeast' },
  { name: 'Kochi', coords: [76.2673, 9.9312], region: 'South' },
  { name: 'Nagpur', coords: [79.0882, 21.1458], region: 'Central' },
  { name: 'Surat', coords: [72.8311, 21.1702], region: 'West' },
  { name: 'Vadodara', coords: [73.1812, 22.3072], region: 'West' },
  { name: 'Kanpur', coords: [80.3319, 26.4499], region: 'North' },
  { name: 'Varanasi', coords: [82.9739, 25.3176], region: 'North' },
  { name: 'Agra', coords: [78.0081, 27.1767], region: 'North' },
  { name: 'Noida', coords: [77.3910, 28.5355], region: 'North' },
  { name: 'Gurugram', coords: [77.0266, 28.4595], region: 'North' },
  { name: 'Ghaziabad', coords: [77.4538, 28.6692], region: 'North' },
  { name: 'Dehradun', coords: [78.0322, 30.3165], region: 'North' },
  { name: 'Ranchi', coords: [85.3096, 23.3441], region: 'East' },
  { name: 'Raipur', coords: [81.6296, 21.2514], region: 'Central' },
  { name: 'Amritsar', coords: [74.8723, 31.6340], region: 'North' },
  { name: 'Ludhiana', coords: [75.8573, 30.9010], region: 'North' },
  { name: 'Nashik', coords: [73.7898, 19.9975], region: 'West' },
  { name: 'Visakhapatnam', coords: [83.2185, 17.6868], region: 'South' },
  { name: 'Coimbatore', coords: [76.9515, 11.0168], region: 'South' },
  { name: 'Mysuru', coords: [76.6394, 12.2958], region: 'South' },
  { name: 'Thiruvananthapuram', coords: [76.9366, 8.5241], region: 'South' },
  { name: 'Vijayawada', coords: [80.6480, 16.5062], region: 'South' },
  { name: 'Madurai', coords: [78.1198, 9.9252], region: 'South' },
  { name: 'Jodhpur', coords: [73.0243, 26.2389], region: 'North' },
  { name: 'Udaipur', coords: [73.6822, 24.5854], region: 'North' }
];

const HOSPITAL_NAMES = [
  'AIIMS', 'Apollo Hospital', 'Fortis Hospital', 'Max Super Speciality', 'Medanta', 
  'Narayana Health', 'Manipal Hospital', 'Ruby Hall Clinic', 'KGMU', 'SGPGI', 
  'Tata Memorial', 'Lilavati Hospital', 'Breach Candy', 'Hinduja Hospital', 
  'Sahara Hospital', 'CMC', 'PGIMER', 'Aster Medcity', 'Yashoda Hospitals', 
  'Care Hospitals', 'Sterling Hospital', 'Bombay Hospital', 'AMRI Hospitals', 'Peerless Hospital'
];

const randomCoord = (base, spread = 0.05) => base + (Math.random() * spread * 2 - spread);
const randomCity = () => CITIES[Math.floor(Math.random() * CITIES.length)];
const randomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

export const generatePanIndiaData = () => {
  const hospitals = [];
  const ambulances = [];
  const historicalIncidents = [];
  const incidents = [];
  const alerts = [];
  const roadConditions = [];
  const dispatches = [];
  const routes = [];

  // Generate 150 Hospitals
  for (let i = 1; i <= 150; i++) {
    const city = randomCity();
    const hName = HOSPITAL_NAMES[Math.floor(Math.random() * HOSPITAL_NAMES.length)];
    hospitals.push({
      _id: `HOS-IND-${String(i).padStart(3, '0')}`,
      name: `${hName} ${city.name}`,
      city: city.name,
      state: city.region,
      district: city.name,
      location: { type: 'Point', coordinates: [randomCoord(city.coords[0]), randomCoord(city.coords[1])] },
      hospitalType: Math.random() > 0.5 ? 'GOVERNMENT' : 'PRIVATE',
      specializations: ['TRAUMA', 'CARDIOLOGY', 'NEUROLOGY'],
      traumaLevel: Math.floor(Math.random() * 3) + 1,
      icuBeds: Math.floor(Math.random() * 50) + 10,
      availableBeds: Math.floor(Math.random() * 30),
      emergencyCapacity: Math.floor(Math.random() * 20) + 5,
      status: 'AVAILABLE',
      incomingAmbulances: 0
    });
  }

  // Generate 150 Ambulances
  const ambStatuses = ['AVAILABLE', 'EN_ROUTE', 'ON_SCENE', 'TRANSPORTING', 'UNAVAILABLE'];
  for (let i = 1; i <= 150; i++) {
    const city = randomCity();
    const status = ambStatuses[Math.floor(Math.random() * ambStatuses.length)];
    ambulances.push({
      _id: `AMB-${city.name.substring(0,3).toUpperCase()}-${String(i).padStart(3, '0')}`,
      ambulanceId: `IND-${city.name.substring(0,2).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      city: city.name,
      state: city.region,
      location: { type: 'Point', coordinates: [randomCoord(city.coords[0]), randomCoord(city.coords[1])] },
      status: status,
      capability: Math.random() > 0.3 ? 'ALS' : (Math.random() > 0.5 ? 'BLS' : 'TRAUMA'),
      driverName: `Driver ${i}`,
      driverPhone: `98765${Math.floor(10000 + Math.random() * 90000)}`,
      speed: status === 'EN_ROUTE' || status === 'TRANSPORTING' ? Math.floor(Math.random() * 60) + 20 : 0,
      heading: Math.floor(Math.random() * 360),
      lastUpdated: new Date().toISOString(),
      currentIncident: null
    });
  }

  // Generate 500 Historical Incidents
  const cats = ['ROAD_ACCIDENT', 'MEDICAL_EMERGENCY', 'FIRE', 'TRAUMA', 'CARDIAC', 'FLOODING'];
  for (let i = 1; i <= 500; i++) {
    const city = randomCity();
    const cat = cats[Math.floor(Math.random() * cats.length)];
    const year = 2020 + Math.floor(Math.random() * 6); // 2020-2025
    historicalIncidents.push({
      _id: `HIST-${year}-${String(i).padStart(4, '0')}`,
      year: year,
      date: randomDate(new Date(year, 0, 1), new Date(year, 11, 31)).toISOString(),
      state: city.region,
      city: city.name,
      category: cat,
      severity: Math.floor(Math.random() * 10) + 1,
      affectedPeople: Math.floor(Math.random() * 5),
      fatalities: Math.random() > 0.9 ? 1 : 0,
      injuries: Math.floor(Math.random() * 4),
      responseTime: Math.floor(Math.random() * 20) + 5, // minutes
      resolutionTime: Math.floor(Math.random() * 120) + 30
    });
  }

  // Generate 100 Current Incidents
  const incStatuses = ['ACTIVE', 'ASSIGNED', 'EN_ROUTE', 'ON_SCENE', 'TRANSPORTING', 'RESOLVED'];
  for (let i = 1; i <= 100; i++) {
    const city = randomCity();
    const cat = cats[Math.floor(Math.random() * cats.length)];
    const status = incStatuses[Math.floor(Math.random() * incStatuses.length)];
    const severities = [7, 8, 9, 10];
    
    // Realistic descriptions
    const descMap = {
      'ROAD_ACCIDENT': 'Two-vehicle collision reported near a major junction. Two people injured.',
      'MEDICAL_EMERGENCY': 'Individual reported unconscious at a public location. Bystander requested medical assistance.',
      'FIRE': 'Structural fire reported in commercial building. Evacuation in progress.',
      'TRAUMA': 'Fall from height reported at construction site.',
      'CARDIAC': 'Elderly patient complaining of severe chest pain and shortness of breath.',
      'FLOODING': 'Heavy waterlogging reported on the main road with vehicles unable to pass.'
    };

    incidents.push({
      _id: `INC-IND-${String(i).padStart(3, '0')}`,
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 120) * 60000).toISOString(),
      category: cat,
      description: descMap[cat] || `Emergency incident reported in ${city.name}`,
      severity: severities[Math.floor(Math.random() * severities.length)],
      location: { type: 'Point', coordinates: [randomCoord(city.coords[0]), randomCoord(city.coords[1])] },
      city: city.name,
      state: city.region,
      affectedPeople: Math.floor(Math.random() * 4),
      status: status,
      source: 'DEMO',
      assignedAmbulanceId: null,
      recommendedHospitalId: null,
      aiConfidence: 0.85 + Math.random() * 0.14
    });
  }

  // Generate 75 Alerts
  const alertTypes = ['FLOOD', 'HEAVY_RAIN', 'CYCLONE', 'HEATWAVE', 'LANDSLIDE', 'THUNDERSTORM', 'ROAD_HAZARD'];
  const alertSeverities = ['CRITICAL', 'HIGH', 'MODERATE', 'LOW'];
  for (let i = 1; i <= 75; i++) {
    const city = randomCity();
    const type = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    alerts.push({
      _id: `ALT-IND-${String(i).padStart(3, '0')}`,
      title: `${type.replace('_', ' ')} Warning`,
      description: `Severe ${type.toLowerCase()} conditions detected. Emergency units on standby.`,
      severity: alertSeverities[Math.floor(Math.random() * alertSeverities.length)],
      city: city.name,
      state: city.region,
      location: { type: 'Point', coordinates: [randomCoord(city.coords[0], 0.2), randomCoord(city.coords[1], 0.2)] },
      issuedAt: new Date(Date.now() - Math.floor(Math.random() * 24) * 3600000).toISOString(),
      expiresAt: new Date(Date.now() + Math.floor(Math.random() * 48) * 3600000).toISOString(),
      source: 'DEMO'
    });
  }

  // Generate 75 Road Conditions
  const rcTypes = ['ACCIDENT', 'ROAD_BLOCKAGE', 'FLOODING', 'CONSTRUCTION', 'CONGESTION', 'HAZARD'];
  for (let i = 1; i <= 75; i++) {
    const city = randomCity();
    const type = rcTypes[Math.floor(Math.random() * rcTypes.length)];
    roadConditions.push({
      _id: `RC-IND-${String(i).padStart(3, '0')}`,
      type: type,
      severity: Math.floor(Math.random() * 10) + 1,
      location: { type: 'Point', coordinates: [randomCoord(city.coords[0]), randomCoord(city.coords[1])] },
      city: city.name,
      state: city.region,
      description: `${type.replace('_', ' ')} causing significant delays.`,
      reportedAt: new Date().toISOString(),
      status: 'ACTIVE'
    });
  }

  // Generate 75 Dispatches & Routes
  // Link some incidents to ambulances and create routes
  const dispatchableIncidents = incidents.filter(i => ['ASSIGNED', 'EN_ROUTE', 'ON_SCENE', 'TRANSPORTING'].includes(i.status)).slice(0, 75);
  
  dispatchableIncidents.forEach((inc, index) => {
    // Find an ambulance in the same city
    const availableAmb = ambulances.find(a => a.city === inc.city && a.currentIncident === null);
    if (availableAmb) {
      const hospital = hospitals.find(h => h.city === inc.city) || hospitals[0];
      
      inc.assignedAmbulanceId = availableAmb._id;
      inc.recommendedHospitalId = hospital._id;
      
      availableAmb.status = inc.status;
      availableAmb.currentIncident = inc._id;

      const dispatchId = `DSP-IND-${String(index + 1).padStart(3, '0')}`;
      const routeId = `RTE-IND-${String(index + 1).padStart(3, '0')}`;

      dispatches.push({
        _id: dispatchId,
        incidentId: inc._id,
        ambulanceId: availableAmb._id,
        hospitalId: hospital._id,
        routeId: routeId,
        status: 'ACTIVE',
        dispatchedAt: new Date().toISOString(),
        eta: Math.floor(Math.random() * 15) + 5
      });

      // Synthetic Route Geometry
      const start = availableAmb.location.coordinates;
      const end = inc.location.coordinates;
      // Simple 3-point synthetic route
      const mid = [(start[0] + end[0]) / 2 + 0.01, (start[1] + end[1]) / 2 + 0.01];
      
      routes.push({
        _id: routeId,
        dispatchId: dispatchId,
        origin: { coordinates: start },
        destination: { coordinates: end },
        geometry: { type: 'LineString', coordinates: [start, mid, end] },
        distance: Math.floor(Math.random() * 10000) + 1000, // meters
        duration: Math.floor(Math.random() * 1200) + 300, // seconds
        status: 'ACTIVE'
      });
    } else {
      inc.status = 'ACTIVE'; // Fallback if no amb found
    }
  });

  return { 
    incidents, 
    ambulances, 
    hospitals, 
    historicalIncidents, 
    alerts, 
    roadConditions, 
    dispatches, 
    routes 
  };
};
