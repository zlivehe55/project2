/**
 * Test script for HomeDesigns.AI API
 * Run: node test-api.js
 */

require('dotenv').config();

const API_URL = process.env.HOMEDESIGNS_API_URL || 'https://api.homedesigns.ai';
const API_TOKEN = process.env.HOMEDESIGNS_API_TOKEN;

console.log('Testing HomeDesigns.AI API Integration\n');
console.log('=====================================');
console.log('API URL:', API_URL);
console.log('Token (first 20 chars):', API_TOKEN ? API_TOKEN.substring(0, 20) + '...' : 'NOT SET');
console.log('=====================================\n');

async function testCreditsCheck() {
  console.log('1. Testing Credits Check...');
  try {
    const response = await fetch(`${API_URL}/v1/credits`, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log('   ❌ Credits check failed:', response.status, errorText);
      return false;
    }

    const data = await response.json();
    console.log('   ✅ Credits check successful!');
    console.log('   Credits remaining:', data.credits_remaining || data.credits || 'N/A');
    console.log('   Plan:', data.plan || 'N/A');
    return true;
  } catch (error) {
    console.log('   ❌ Error:', error.message);
    return false;
  }
}

async function testDesignGeneration() {
  console.log('\n2. Testing Design Generation (using sample image)...');
  
  // Using a publicly accessible sample room image
  const sampleImageUrl = 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800';
  
  try {
    console.log('   Sending request to API...');
    console.log('   Image URL:', sampleImageUrl);
    console.log('   Style: modern');
    console.log('   Room Type: living-room');
    
    const response = await fetch(`${API_URL}/v1/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image_url: sampleImageUrl,
        room_type: 'living-room',
        design_style: 'modern',
        mode: 'interior',
        output_quality: 'standard'
      })
    });

    const responseText = await response.text();
    console.log('\n   Response status:', response.status);
    
    if (!response.ok) {
      console.log('   ❌ Generation failed:', responseText);
      return false;
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.log('   ❌ Could not parse response as JSON:', responseText.substring(0, 200));
      return false;
    }

    console.log('   ✅ Generation request successful!');
    console.log('   Response:', JSON.stringify(data, null, 2));
    
    if (data.output_url) {
      console.log('\n   🎨 Generated Image URL:', data.output_url);
    }
    
    return true;
  } catch (error) {
    console.log('   ❌ Error:', error.message);
    return false;
  }
}

async function listAvailableEndpoints() {
  console.log('\n3. Checking API documentation endpoint...');
  try {
    const response = await fetch(`${API_URL}/v1`);
    console.log('   Status:', response.status);
    if (response.ok) {
      const text = await response.text();
      console.log('   Response:', text.substring(0, 200));
    }
  } catch (error) {
    console.log('   Note:', error.message);
  }
}

async function runTests() {
  if (!API_TOKEN) {
    console.log('❌ ERROR: HOMEDESIGNS_API_TOKEN is not set in .env file');
    console.log('Please make sure your .env file contains the token.');
    return;
  }

  const creditsOk = await testCreditsCheck();
  
  if (creditsOk) {
    console.log('\n⚠️  Note: Design generation will use 1 credit from your account.');
    console.log('   Comment out testDesignGeneration() if you want to save credits.\n');
    
    // Uncomment the line below to actually test generation (uses 1 credit)
    // await testDesignGeneration();
    
    console.log('\n   (Generation test is commented out to save credits)');
    console.log('   Edit test-api.js and uncomment testDesignGeneration() to test.');
  }
  
  await listAvailableEndpoints();
  
  console.log('\n=====================================');
  console.log('Test complete!');
  console.log('=====================================');
}

runTests();

