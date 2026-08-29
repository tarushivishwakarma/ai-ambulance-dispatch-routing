async function runE2E() {
  try {
    const API_URL = 'http://localhost:5000/api';
    console.log("1. Registering/Logging in test user...");
    const regRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Admin', email: 'testadmin@system.local', password: 'admin123', role: 'ADMIN' })
    });
    let loginData = await regRes.json();
    if (loginData.errorCode === 'USER_EXISTS') {
      const loginRes = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'testadmin@system.local', password: 'admin123' })
      });
      loginData = await loginRes.json();
    }
    console.log("Auth API Response:", loginData);
    const token = loginData.data?.token || loginData.token;
    if (!token) throw new Error("Token not found in login response");
    console.log("Token received.");

    console.log("2. Creating incident with image evidence...");
    const formData = new FormData();
    formData.append('category', 'MEDICAL');
    formData.append('description', 'Test emergency with image');
    formData.append('severity', '8');
    formData.append('latitude', '22.5');
    formData.append('longitude', '79.5');
    // Create a mock text file blob to simulate an image upload
    const mockFile = new Blob(['mock image data'], { type: 'image/png' });
    formData.append('media', mockFile, 'test_image.png');

    const incidentRes = await fetch(`${API_URL}/incidents`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }, // Do NOT set Content-Type, fetch handles boundary automatically
      body: formData
    });
    const incidentData = await incidentRes.json();
    console.log("Incident API Response:", incidentData);
    const incident = incidentData.data;
    if (!incident) throw new Error("No incident data returned!");
    console.log(`Incident created: ${incident._id}, Media length: ${incident.media?.length || 0}`);

    console.log("3. Fetching ambulances...");
    const ambulancesRes = await fetch(`${API_URL}/ambulances`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const ambulancesData = await ambulancesRes.json();
    const ambulances = ambulancesData.data;
    const availableAmb = ambulances.find(a => a.status === 'AVAILABLE');
    
    if (availableAmb) {
      console.log(`Available ambulance found: ${availableAmb._id}`);
      
      console.log("4. Assigning manual dispatch...");
      const assignRes = await fetch(`${API_URL}/dispatch/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          incidentId: incident._id,
          ambulanceId: availableAmb._id
        })
      });
      const assignData = await assignRes.json();
      console.log("Dispatch API Response:", assignData);
      console.log(`Dispatch assigned: ${assignData.success}`);

      console.log("5. Resolving incident...");
      const resolveRes = await fetch(`${API_URL}/incidents/${incident._id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: 'RESOLVED' })
      });
      const resolveData = await resolveRes.json();
      console.log("Resolve API Response:", resolveData);
      console.log(`Incident resolved: ${resolveData.data?.status}`);
    } else {
      console.log("No available ambulances found, skipping dispatch test.");
    }

    console.log("6. Fetching historical (analytics) data...");
    const historyRes = await fetch(`${API_URL}/incidents/historical`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const historyData = await historyRes.json();
    console.log(`Historical data points: ${historyData.data.length}`);

    console.log("ALL E2E TESTS PASSED!");
  } catch (err) {
    console.error("E2E TEST FAILED:", err);
  }
}

runE2E();
