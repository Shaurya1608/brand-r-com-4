const test = async () => {
  try {
    const res = await fetch('http://localhost:5001/api/speaker-interests/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Test User',
        designation: 'CEO',
        mobileNumber: '1234567890',
        organization: 'Test Org',
        city: 'Test City',
        stateCountry: 'Test State',
        pinCode: '12345',
        address: 'Test Address'
      })
    });
    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Response:', text);
  } catch (err) {
    console.error('Fetch error:', err);
  }
};
test();
