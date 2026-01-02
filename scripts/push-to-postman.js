/**
 * PUSH TO POSTMAN
 * 
 * This script pushes the Postman collection directly to your Postman workspace
 * using the Postman API. It will automatically sync to Postman Desktop.
 * 
 * Requirements:
 * 1. Postman API Key (get it from https://web.postman.co/settings/me/api-keys)
 * 2. Workspace ID (optional, uses default workspace if not provided)
 * 
 * Usage:
 *   npm run postman:push
 *   or
 *   POSTMAN_API_KEY=your_api_key npm run postman:push
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const POSTMAN_API_BASE = 'https://api.getpostman.com';

/**
 * Load API key from .postmanrc file or .env file or environment variable
 */
function loadConfig() {
  // Try .postmanrc first
  const postmanrcPath = path.join(__dirname, '..', '.postmanrc');
  if (fs.existsSync(postmanrcPath)) {
    const configContent = fs.readFileSync(postmanrcPath, 'utf8');
    const lines = configContent.split('\n');

    for (const line of lines) {
      if (line.trim() && !line.trim().startsWith('#')) {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').trim();
          if (key.trim() === 'POSTMAN_API_KEY' && !process.env.POSTMAN_API_KEY) {
            process.env.POSTMAN_API_KEY = value;
          }
          if (key.trim() === 'POSTMAN_WORKSPACE_ID' && !process.env.POSTMAN_WORKSPACE_ID) {
            process.env.POSTMAN_WORKSPACE_ID = value;
          }
        }
      }
    }
  }

  // Try .env file
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, '');
        if (key === 'POSTMAN_API_KEY' && !process.env.POSTMAN_API_KEY) {
          process.env.POSTMAN_API_KEY = value;
        }
        if (key === 'POSTMAN_WORKSPACE_ID' && !process.env.POSTMAN_WORKSPACE_ID) {
          process.env.POSTMAN_WORKSPACE_ID = value;
        }
      }
    });
  }

  const API_KEY = process.env.POSTMAN_API_KEY;
  const WORKSPACE_ID = process.env.POSTMAN_WORKSPACE_ID;

  if (!API_KEY) {
    console.error('❌ Error: POSTMAN_API_KEY is required');
    console.log('\n📝 Options to set your API key:');
    console.log('   1. Create .postmanrc file in project root with:');
    console.log('      POSTMAN_API_KEY=your_api_key_here');
    console.log('   2. Or add to .env file:');
    console.log('      POSTMAN_API_KEY=your_api_key_here');
    console.log('   3. Or set environment variable:');
    console.log('      POSTMAN_API_KEY=your_key npm run postman:push');
    console.log('\n📝 How to get your API key:');
    console.log('   Go to https://web.postman.co/settings/me/api-keys');
    process.exit(1);
  }

  return { API_KEY, WORKSPACE_ID };
}

// Load configuration
const { API_KEY, WORKSPACE_ID } = loadConfig();

/**
 * Make API request to Postman using https module
 */
function postmanRequest(endpoint, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${POSTMAN_API_BASE}${endpoint}`);
    
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'X-Api-Key': API_KEY,
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(body));
    }

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);

          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(jsonData);
          } else {
            // Provide more detailed error messages
            if (res.statusCode === 401) {
              reject(new Error('Unauthorized: Invalid API key. Please check your POSTMAN_API_KEY.'));
            } else if (res.statusCode === 404) {
              reject(new Error(`Not found: ${endpoint}. The resource may not exist.`));
            } else if (res.statusCode === 400) {
              reject(new Error(`Bad request: ${jsonData.error?.message || JSON.stringify(jsonData)}`));
            } else {
              reject(new Error(jsonData.error?.message || `HTTP ${res.statusCode}: ${res.statusText}`));
            }
          }
        } catch (error) {
          reject(new Error(`Failed to parse response: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Postman API request failed: ${error.message}`));
    });

    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

/**
 * Get or create workspace
 */
async function getWorkspace() {
  if (WORKSPACE_ID) {
    try {
      const workspace = await postmanRequest(`/workspaces/${WORKSPACE_ID}`);
      return workspace.workspace;
    } catch (error) {
      console.warn(`⚠️  Workspace ${WORKSPACE_ID} not found, using default workspace`);
    }
  }

  // Get all workspaces and use the first one (usually personal workspace)
  const workspaces = await postmanRequest('/workspaces');
  if (workspaces.workspaces && workspaces.workspaces.length > 0) {
    return workspaces.workspaces[0];
  }

  throw new Error('No workspace found. Please create a workspace in Postman first.');
}

/**
 * Find existing collection by name
 */
async function findCollection(workspaceId, collectionName) {
  try {
    const collections = await postmanRequest(`/collections?workspace=${workspaceId}`);
    if (collections.collections) {
      return collections.collections.find((col) => col.name === collectionName);
    }
  } catch (error) {
    // Collection might not exist, which is fine
  }
  return null;
}

/**
 * Create or update collection
 */
async function pushCollection() {
  try {
    console.log('🚀 Pushing collection to Postman...\n');

    // Read collection file from scripts directory
    const collectionPath = path.join(__dirname, 'postman_collection.json');
    if (!fs.existsSync(collectionPath)) {
      throw new Error('Collection file not found. Run "npm run generate-postman" first.');
    }

    let collectionData;
    try {
      const fileContent = fs.readFileSync(collectionPath, 'utf8');
      collectionData = JSON.parse(fileContent);
      
      // Validate collection structure
      if (!collectionData.info || !collectionData.item) {
        throw new Error('Invalid collection structure. Collection must have "info" and "item" properties.');
      }
      
      console.log(`📄 Loaded collection: ${collectionData.info.name}`);
      
      // Count endpoints
      let endpointCount = 0;
      const countEndpoints = (items) => {
        items.forEach(item => {
          if (item.item) {
            // It's a folder
            countEndpoints(item.item);
          } else {
            // It's an endpoint
            endpointCount++;
          }
        });
      };
      countEndpoints(collectionData.item);
      
      console.log(`📊 Found ${collectionData.item.length} folder(s) with ${endpointCount} endpoint(s)\n`);
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(`Invalid JSON in collection file: ${error.message}`);
      }
      throw error;
    }

    // Get workspace
    console.log('📁 Getting workspace...');
    const workspace = await getWorkspace();
    console.log(`✅ Using workspace: ${workspace.name} (${workspace.id})\n`);

    // Check if collection exists
    const existingCollection = await findCollection(workspace.id, collectionData.info.name);

    let result;
    if (existingCollection) {
      // Update existing collection - preserve the uid
      console.log(`🔄 Updating existing collection: ${collectionData.info.name}...`);
      
      // Preserve the existing collection's _postman_id and uid
      collectionData.info._postman_id = existingCollection.uid;
      
      result = await postmanRequest(
        `/collections/${existingCollection.uid}`,
        'PUT',
        { collection: collectionData }
      );
      console.log(`✅ Collection updated successfully!`);
    } else {
      // Create new collection - remove _postman_id as it will be generated by Postman
      console.log(`✨ Creating new collection: ${collectionData.info.name}...`);
      const collectionForCreate = JSON.parse(JSON.stringify(collectionData));
      // Remove _postman_id for new collections (Postman will generate it)
      delete collectionForCreate.info._postman_id;
      
      result = await postmanRequest(
        `/collections?workspace=${workspace.id}`,
        'POST',
        { collection: collectionForCreate }
      );
      console.log(`✅ Collection created successfully!`);
    }

    console.log(`\n📦 Collection UID: ${result.collection.uid}`);
    console.log(`🔗 View in Postman: https://web.postman.co/workspace/${workspace.id}/collection/${result.collection.uid}`);
    
    // Push environment
    await pushEnvironment(workspace.id);
    
    console.log(`\n✨ Collection will sync to Postman Desktop automatically!`);
    console.log(`   Just wait a few seconds and refresh Postman Desktop (Cmd+R or F5).`);
    console.log(`\n💡 Don't forget to:`);
    console.log(`   1. Select the environment in Postman (top right)`);
    console.log(`   2. Update base_url if needed`);
    console.log(`   3. After login, tokens will be automatically saved to the environment\n`);

    return result;
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Push environment to Postman
 */
async function pushEnvironment(workspaceId) {
  try {
    const envPath = path.join(__dirname, 'postman_environment.json');
    if (!fs.existsSync(envPath)) {
      console.log(`\n⚠️  Environment file not found at: ${envPath}`);
      console.log(`   Run "npm run generate-postman" to generate it.\n`);
      return;
    }

    console.log(`\n🌍 Pushing environment...`);
    
    let envData;
    try {
      const fileContent = fs.readFileSync(envPath, 'utf8');
      envData = JSON.parse(fileContent);
      
      if (!envData.name || !envData.values) {
        throw new Error('Invalid environment structure. Environment must have "name" and "values" properties.');
      }
      
      console.log(`📄 Loaded environment: ${envData.name}`);
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(`Invalid JSON in environment file: ${error.message}`);
      }
      throw error;
    }

    // Check if environment exists
    const environments = await postmanRequest(`/environments?workspace=${workspaceId}`);
    const existingEnv = environments.environments?.find((env) => env.name === envData.name);

    let envResult;
    if (existingEnv) {
      console.log(`🔄 Updating existing environment: ${envData.name}...`);
      
      // Preserve the existing environment's _postman_id and uid
      envData.id = existingEnv.uid;
      
      envResult = await postmanRequest(
        `/environments/${existingEnv.uid}`,
        'PUT',
        { environment: envData }
      );
      console.log(`✅ Environment updated successfully!`);
    } else {
      console.log(`✨ Creating new environment: ${envData.name}...`);
      const envForCreate = JSON.parse(JSON.stringify(envData));
      // Remove id for new environments (Postman will generate it)
      delete envForCreate.id;
      
      envResult = await postmanRequest(
        `/environments?workspace=${workspaceId}`,
        'POST',
        { environment: envForCreate }
      );
      console.log(`✅ Environment created successfully!`);
    }

    console.log(`📦 Environment UID: ${envResult.environment.uid}`);
    console.log(`🔗 View in Postman: https://web.postman.co/workspace/${workspaceId}/environment/${envResult.environment.uid}`);
    
    return envResult;
  } catch (error) {
    console.warn(`\n⚠️  Could not push environment: ${error.message}`);
    console.log(`   You can manually import the environment file from: ${path.join(__dirname, 'postman_environment.json')}\n`);
  }
}

// Run the script
pushCollection();
