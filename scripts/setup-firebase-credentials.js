#!/usr/bin/env node

/**
 * Helper script to format Firebase credentials for .env file
 * 
 * Usage:
 * 1. Download service account JSON from Firebase Console
 * 2. Run: node scripts/setup-firebase-credentials.js path/to/service-account.json
 * 3. Copy the output to your .env file
 */

const fs = require('fs');
const path = require('path');

const jsonPath = process.argv[2];

if (!jsonPath) {
    console.error('❌ Error: Please provide path to Firebase service account JSON file');
    console.log('\nUsage:');
    console.log('  node scripts/setup-firebase-credentials.js path/to/service-account.json');
    console.log('\nExample:');
    console.log('  node scripts/setup-firebase-credentials.js ~/Downloads/salonwale-edab3-firebase-adminsdk-xxxxx.json');
    process.exit(1);
}

if (!fs.existsSync(jsonPath)) {
    console.error(`❌ Error: File not found: ${jsonPath}`);
    process.exit(1);
}

try {
    const jsonContent = fs.readFileSync(jsonPath, 'utf8');
    const serviceAccount = JSON.parse(jsonContent);

    console.log('\n✅ Firebase credentials extracted successfully!\n');
    console.log('='.repeat(80));
    console.log('Add this to your .env file:');
    console.log('='.repeat(80));
    console.log('\n');

    // Option 1: Full JSON (recommended)
    const jsonString = JSON.stringify(serviceAccount);
    console.log('# Option 1: Full JSON (Recommended)');
    console.log(`FIREBASE_SERVICE_ACCOUNT='${jsonString}'`);
    console.log('\n');

    // Option 2: Individual variables
    console.log('# Option 2: Individual Variables');
    console.log(`FIREBASE_PROJECT_ID=${serviceAccount.project_id}`);
    console.log(`FIREBASE_CLIENT_EMAIL=${serviceAccount.client_email}`);
    console.log(`FIREBASE_PRIVATE_KEY="${serviceAccount.private_key.replace(/\n/g, '\\n')}"`);
    console.log('\n');

    console.log('='.repeat(80));
    console.log('\n✅ Next steps:');
    console.log('1. Copy one of the options above to your .env file');
    console.log('2. Restart your server');
    console.log('3. Look for "✅ Firebase Admin SDK initialized successfully" in logs');
    console.log('\n');

} catch (error) {
    console.error('❌ Error parsing JSON file:', error.message);
    process.exit(1);
}

