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
    console.log('Connected.');

    const cities = [
      { name: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462 },
      { name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
      { name: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
      { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
      { name: 'Delhi', state: 'Delhi', lat: 28.7041, lng: 77.1025 },
      { name: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
      { name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867 },
      { name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639 },
      { name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873 },
      { name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714 }
    ];

    const categories = ['MEDICAL_EMERGENCY', 'ROAD_ACCIDENT', 'FIRE', 'NATURAL_DISASTER', 'VIOLENCE', 'CARDIAC', 'TRAUMA'];
    const hospitals = ['KGMU', 'KEM Hospital', 'Narayana Health', 'Apollo Hospital', 'AIIMS', 'Fortis', 'Max Super Speciality', 'City General Hospital', 'Manipal Hospital'];
    const ambulanceTypes = ['ALS (Advanced Life Support)', 'BLS (Basic Life Support)', 'Neonatal', 'Bariatric'];
    
    console.log('Generating 500 historical incidents...');
    
    let addedCount = 0;
    
    for (let i = 1; i <= 500; i++) {
      const year = 2020 + (i % 7); // Spread across 2020-2026
      const month = (i % 12);
      const day = (i % 28) + 1;
      
      const city = cities[i % cities.length];
      const category = categories[i % categories.length];
      
      let severity = 5;
      let affectedPeople = 1;
      let desc = 'Medical emergency';
      
      if (category === 'ROAD_ACCIDENT') {
        severity = 7 + (i % 4);
        affectedPeople = 1 + (i % 4);
        desc = `Road accident in ${city.name} involving multiple vehicles.`;
      } else if (category === 'FIRE') {
        severity = 8 + (i % 3);
        affectedPeople = 2 + (i % 10);
        desc = `Building fire reported in ${city.name} industrial area.`;
      } else if (category === 'NATURAL_DISASTER') {
        severity = 10;
        affectedPeople = 10 + (i % 50);
        desc = `Flooding/disaster incident in ${city.name}.`;
      } else if (category === 'VIOLENCE') {
        severity = 6 + (i % 3);
        affectedPeople = 1 + (i % 2);
        desc = `Assault/violence reported near city center.`;
      } else {
        if (i % 3 === 0) {
          severity = 9;
          desc = `Cardiac emergency, patient unconscious.`;
        } else if (i % 5 === 0) {
          severity = 8;
          desc = `Stroke symptoms reported.`;
        }
      }

      // Generate realistic timeline
      const reportedAt = new Date(year, month, day, 10 + (i % 10), i % 60);
      const dispatchTime = new Date(reportedAt.getTime() + (2 + (i % 5)) * 60000); // 2-7 min later
      const arrivedAt = new Date(dispatchTime.getTime() + (5 + (i % 15)) * 60000); // 5-20 min later
      const hospitalArr = new Date(arrivedAt.getTime() + (10 + (i % 20)) * 60000); // 10-30 min later
      const resolvedAt = new Date(hospitalArr.getTime() + (30 + (i % 60)) * 60000); // 30-90 min later
      
      const incidentId = `HIST-DEMO-${year}-${String(i).padStart(4, '0')}`;
      
      // UPSERT to prevent duplicates
      const result = await Incident.updateOne(
        { incidentId },
        {
          $setOnInsert: {
            incidentId,
            category,
            description: desc,
            location: {
              type: 'Point',
              coordinates: [city.lng + (Math.random() * 0.1 - 0.05), city.lat + (Math.random() * 0.1 - 0.05)]
            },
            address: `Historical Location, ${city.name}`,
            city: city.name,
            state: city.state,
            severity,
            affectedPeople,
            isMedicalEmergency: ['MEDICAL_EMERGENCY', 'ROAD_ACCIDENT', 'CARDIAC', 'TRAUMA'].includes(category),
            status: 'RESOLVED',
            source: 'SYNTHETIC_DEMO',
            reportedAt,
            dispatchTime,
            arrivedOnSceneTime: arrivedAt,
            hospitalArrivalTime: hospitalArr,
            resolvedAt,
            createdAt: reportedAt,
            updatedAt: resolvedAt,
            hospitalName: hospitals[i % hospitals.length],
            ambulanceType: severity > 7 ? 'ALS (Advanced Life Support)' : ambulanceTypes[i % ambulanceTypes.length],
            outcome: severity === 10 ? (i % 3 === 0 ? 'FATALITY' : 'CRITICAL_TRANSFER') : 'TREATED_AND_DISCHARGED',
            aiAnalysis: { hospitalAssigned: hospitals[i % hospitals.length] } 
          }
        },
        { upsert: true, timestamps: false }
      );
      
      if (result.upsertedCount > 0) {
        addedCount++;
      }
    }
    
    console.log(`Finished. Added ${addedCount} new historical incidents.`);
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedHistorical();
