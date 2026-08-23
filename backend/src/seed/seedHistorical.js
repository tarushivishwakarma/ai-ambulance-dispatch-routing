const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Incident = require('../models/Incident');

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://tarushivishwakarma22_db_user:TarushiVishwakarma@cluster0.biw7npk.mongodb.net/';

const seedHistorical = async () => {
  try {
    console.log('Connecting to MongoDB...', MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB.');

    const citiesData = [
      { city: 'New Delhi', state: 'Delhi', lat: 28.6139, lng: 77.2090 },
      { city: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
      { city: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
      { city: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867 },
      { city: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
      { city: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639 },
      { city: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
      { city: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714 },
      { city: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873 },
      { city: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462 },
      { city: 'Kanpur', state: 'Uttar Pradesh', lat: 26.4499, lng: 80.3319 },
      { city: 'Surat', state: 'Gujarat', lat: 21.1702, lng: 72.8311 },
      { city: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577 },
      { city: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126 },
      { city: 'Patna', state: 'Bihar', lat: 25.5941, lng: 85.1376 },
      { city: 'Chandigarh', state: 'Chandigarh', lat: 30.7333, lng: 76.7794 },
      { city: 'Dehradun', state: 'Uttarakhand', lat: 30.3165, lng: 78.0322 },
      { city: 'Guwahati', state: 'Assam', lat: 26.1445, lng: 91.7362 },
      { city: 'Bhubaneswar', state: 'Odisha', lat: 20.2961, lng: 85.8245 },
      { city: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lng: 79.0882 },
      { city: 'Nashik', state: 'Maharashtra', lat: 20.0110, lng: 73.7903 },
      { city: 'Agra', state: 'Uttar Pradesh', lat: 27.1767, lng: 78.0081 },
      { city: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739 },
      { city: 'Amritsar', state: 'Punjab', lat: 31.6340, lng: 74.8723 },
      { city: 'Ludhiana', state: 'Punjab', lat: 30.9010, lng: 75.8523 },
      { city: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lng: 76.9558 },
      { city: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.6868, lng: 83.2185 },
      { city: 'Kochi', state: 'Kerala', lat: 9.9312, lng: 76.2673 },
      { city: 'Thiruvananthapuram', state: 'Kerala', lat: 8.5241, lng: 76.9366 },
      { city: 'Ranchi', state: 'Jharkhand', lat: 23.3441, lng: 85.3096 }
    ];

    const categoriesList = [
      { cat: 'ROAD_ACCIDENT', weight: 25 },
      { cat: 'MEDICAL', weight: 20 },
      { cat: 'CARDIAC', weight: 15 },
      { cat: 'TRAUMA', weight: 10 },
      { cat: 'RESPIRATORY', weight: 10 },
      { cat: 'FALL', weight: 7 },
      { cat: 'STROKE', weight: 6 },
      { cat: 'FIRE', weight: 4 },
      { cat: 'INDUSTRIAL', weight: 2 },
      { cat: 'OTHER', weight: 1 }
    ];

    const hospitals = [
      'AIIMS New Delhi', 'Safdarjung Hospital', 'KEM Hospital', 'Lilavati Hospital', 
      'Kokilaben Dhirubhai Ambani Hospital', 'NIMHANS', 'Manipal Hospital', 
      'Apollo Hospitals', 'NIMS Hyderabad', 'Yashoda Hospitals', 
      'Rajiv Gandhi Government General Hospital', 'MIOT International', 
      'SSKM Hospital', 'KGMU Lucknow', 'Medanta', 'PGIMER Chandigarh', 
      'AIIMS Bhopal', 'AIIMS Patna', 'AIIMS Bhubaneswar', 'AIIMS Nagpur', 
      'IMS BHU', 'Amrita Hospital', 'Aster Medcity'
    ];

    const outcomesList = [
      'PATIENT_TREATED', 'PATIENT_TRANSPORTED', 'STABILIZED', 
      'ADMITTED', 'DISCHARGED', 'TRANSFERRED', 'REFERRED', 'RESOLVED_ON_SCENE'
    ];

    // Build weighted array for categories
    let weightedCategories = [];
    categoriesList.forEach(c => {
      for(let i=0; i<c.weight; i++) {
        weightedCategories.push(c.cat);
      }
    });

    const yearsDistribution = [
      { year: 2020, count: 123 },
      { year: 2021, count: 99 },
      { year: 2022, count: 106 },
      { year: 2023, count: 128 },
      { year: 2024, count: 126 },
      { year: 2025, count: 101 },
      { year: 2026, count: 67 }
    ];

    console.log('Generating exactly 750 historical incidents...');
    let addedCount = 0;
    
    // Generate incidents per year
    for (const yDist of yearsDistribution) {
      for (let i = 0; i < yDist.count; i++) {
        const year = yDist.year;
        const month = Math.floor(Math.random() * 12);
        const day = Math.floor(Math.random() * 28) + 1; // simple days
        
        const cityObj = citiesData[Math.floor(Math.random() * citiesData.length)];
        const category = weightedCategories[Math.floor(Math.random() * weightedCategories.length)];
        const hospitalName = hospitals[Math.floor(Math.random() * hospitals.length)];
        
        // Severity distribution: CRITICAL 18%, HIGH 32%, MODERATE 50%
        let severityScore = 0;
        let severityClass = '';
        let ambulanceType = '';
        let affectedPeople = 1;
        const sevRand = Math.random();
        
        if (sevRand < 0.18) {
          severityClass = 'CRITICAL';
          severityScore = 9 + Math.random(); // 9-10
          ambulanceType = 'ALS';
          affectedPeople = Math.floor(Math.random() * 4) + 1;
        } else if (sevRand < 0.50) {
          severityClass = 'HIGH';
          severityScore = 7 + Math.random() * 1.9; // 7-8.9
          ambulanceType = Math.random() > 0.5 ? 'ALS' : 'BLS';
          affectedPeople = Math.floor(Math.random() * 2) + 1;
        } else {
          severityClass = 'MODERATE';
          severityScore = 4 + Math.random() * 2.9; // 4-6.9
          ambulanceType = 'BLS';
        }

        // Special overrides
        if (category === 'ROAD_ACCIDENT' || category === 'TRAUMA') {
          if (severityClass === 'CRITICAL') ambulanceType = 'TRAUMA';
          if (category === 'ROAD_ACCIDENT') affectedPeople += Math.floor(Math.random() * 3);
        } else if (category === 'NEONATAL') {
          ambulanceType = 'NEONATAL';
        }

        const stateAbbr = cityObj.state.substring(0, 2).toUpperCase();
        const randAmbNum = Math.floor(1000 + Math.random() * 9000);
        const ambulanceId = `AMB-${stateAbbr}-${randAmbNum}`;
        const outcome = outcomesList[Math.floor(Math.random() * outcomesList.length)];
        
        // Timeline generation (Sequential logic)
        const reportedAt = new Date(year, month, day, Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
        
        // AI Verification (5 to 60 seconds after reported)
        const aiVerifiedAt = new Date(reportedAt.getTime() + (Math.floor(Math.random() * 55) + 5) * 1000);
        
        // Dispatch (1 to 5 mins after AI verified)
        const dispatchTime = new Date(aiVerifiedAt.getTime() + (Math.floor(Math.random() * 4 * 60) + 60) * 1000);
        
        // Arrived on Scene (4 to 25 mins after dispatch)
        const arrivedAt = new Date(dispatchTime.getTime() + (Math.floor(Math.random() * 21) + 4) * 60000);
        
        // Hospital Arrival (10 to 45 mins after arrived on scene)
        const hospitalArr = new Date(arrivedAt.getTime() + (Math.floor(Math.random() * 35) + 10) * 60000);
        
        // Resolved (20 to 90 mins after hospital arrival)
        const resolvedAt = new Date(hospitalArr.getTime() + (Math.floor(Math.random() * 70) + 20) * 60000);
        
        const incidentId = `HIST-SYN-${year}-${String(i).padStart(4, '0')}`;
        const desc = `Historical emergency: ${category} reported in ${cityObj.city}`;

        const result = await Incident.updateOne(
          { incidentId },
          {
            $setOnInsert: {
              incidentId,
              category,
              description: desc,
              location: {
                type: 'Point',
                coordinates: [cityObj.lng + (Math.random() * 0.05 - 0.025), cityObj.lat + (Math.random() * 0.05 - 0.025)]
              },
              address: `Generated Location, ${cityObj.city}`,
              city: cityObj.city,
              state: cityObj.state,
              severity: Math.floor(severityScore),
              severityScore,
              affectedPeople,
              isMedicalEmergency: ['MEDICAL', 'CARDIAC', 'TRAUMA', 'RESPIRATORY', 'STROKE'].includes(category),
              status: 'RESOLVED',
              dataSource: 'SYNTHETIC_DEMO',
              source: 'SYNTHETIC_DEMO',
              
              // Timeline fields
              reportedAt,
              aiVerifiedAt,
              dispatchTime,
              arrivedOnSceneTime: arrivedAt,
              hospitalArrivalTime: hospitalArr,
              resolvedAt,
              createdAt: reportedAt,
              updatedAt: resolvedAt,
              
              // Analytics fields
              hospitalName,
              ambulanceType,
              ambulanceId,
              outcome,
              aiAnalysis: {
                confidence: 85 + Math.random() * 14,
                category,
                severity: severityClass
              }
            }
          },
          { upsert: true, timestamps: false }
        );
        
        if (result.upsertedCount > 0) {
          addedCount++;
        }
      }
    }
    
    console.log(`Finished. Added ${addedCount} new historical incidents out of 750.`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedHistorical();
