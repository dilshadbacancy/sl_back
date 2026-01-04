const fs = require('fs');
const path = require('path');

// Read package.json to get project name
const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const PROJECT_NAME = packageJson.name || 'API';
const COLLECTION_NAME = `${PROJECT_NAME.charAt(0).toUpperCase() + PROJECT_NAME.slice(1)} API`;

// Read port from .env file or environment variable
function getPortFromEnv() {
    // Try to read from .env file
    const envPath = path.join(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const lines = envContent.split('\n');
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
                const [key, ...valueParts] = trimmed.split('=');
                if (key && key.trim() === 'PORT' && valueParts.length > 0) {
                    const port = valueParts.join('=').trim();
                    return parseInt(port, 10);
                }
            }
        }
    }

    // Fallback to process.env.PORT or default
    return parseInt(process.env.PORT || '5000', 10);
}

const PORT = getPortFromEnv();
const BASE_URL = process.env.API_BASE_URL || `http://localhost:${PORT}`;

// Define all routes with their actual schemas from the codebase
const routes = [
    // Auth Routes
    {
        name: 'Send OTP',
        method: 'POST',
        path: '/auth/send-otp',
        description: 'Send OTP to user mobile number',
        body: {
            mobile: 'string (10 digits)',
            role: 'enum (customer, vendor, admin)'
        },
        auth: false
    },
    {
        name: 'Verify OTP',
        method: 'POST',
        path: '/auth/verify-otp',
        description: 'Verify OTP and get access token',
        body: {
            code: 'string',
            mobile: 'string (10 digits)',
            user_id: 'string (uuid) (optional)'
        },
        auth: false
    },
    {
        name: 'Logout',
        method: 'POST',
        path: '/auth/logout',
        description: 'Logout user and blacklist token',
        auth: true
    },
    {
        name: 'Generate New Access Token',
        method: 'POST',
        path: '/auth/new-access-token',
        description: 'Generate new access token using refresh token',
        body: {
            refresh_token: 'string'
        },
        auth: false
    },

    // User Routes
    {
        name: 'Save User Profile',
        method: 'POST',
        path: '/users/save-profile',
        description: 'Save user profile information',
        body: {
            user_id: 'string (uuid) (optional)',
            first_name: 'string',
            last_name: 'string',
            email: 'string (email)',
            location: {
                country: 'string',
                state: 'string',
                city: 'string',
                landmark: 'string (optional)',
                latitude: 'string',
                longitude: 'string'
            },
            is_onboarding_completed: 'boolean (optional)',
            gender: 'enum (male, female, unisex, others)'
        },
        auth: true
    },
    {
        name: 'Update User Profile',
        method: 'PUT',
        path: '/users/update-profile',
        description: 'Update user profile information',
        body: {
            user_id: 'string (uuid) (optional)',
            first_name: 'string (optional)',
            last_name: 'string (optional)',
            email: 'string (email) (optional)',
            location: {
                country: 'string (optional)',
                state: 'string (optional)',
                city: 'string (optional)',
                landmark: 'string (optional)',
                latitude: 'string (optional)',
                longitude: 'string (optional)'
            },
            is_onboarding_completed: 'boolean (optional)',
            gender: 'enum (male, female, unisex, others) (optional)'
        },
        auth: true
    },
    {
        name: 'Update User Location',
        method: 'PUT',
        path: '/users/update-location',
        description: 'Update user location',
        body: {
            latitude: 'string',
            longitude: 'string',
            user_id: 'string (uuid)'
        },
        auth: true
    },
    {
        name: 'Get User Profile',
        method: 'GET',
        path: '/users/user-profile',
        description: 'Get current user profile',
        auth: true
    },
    {
        name: 'Update User Status',
        method: 'PUT',
        path: '/users/update-status',
        description: 'Update user status',
        body: {
            user_id: 'string (uuid)',
            status: 'enum (active, inactive, deleted)'
        },
        auth: true
    },
    {
        name: 'Get All User Status',
        method: 'GET',
        path: '/users/get-status',
        description: 'Get all available user statuses',
        auth: true
    },
    {
        name: 'Get All Genders',
        method: 'GET',
        path: '/users/get-genders',
        description: 'Get all available genders',
        auth: true
    },
    {
        name: 'Get All Roles',
        method: 'GET',
        path: '/users/roles',
        description: 'Get all available roles',
        auth: true
    },
    {
        name: 'Check Profile Completion',
        method: 'GET',
        path: '/users/check-profile',
        description: 'Check if user profile is completed',
        auth: true
    },

    // Customer Routes
    {
        name: 'Get Near By Shops',
        method: 'GET',
        path: '/customer/near-by-shops',
        description: 'Get nearby shops based on location',
        query: {
            latitude: 'number',
            longitude: 'number',
            radius: 'number (optional, default: 5)'
        },
        auth: false
    },
    {
        name: 'Book Appointment',
        method: 'POST',
        path: '/customer/book-appointment',
        description: 'Book a new appointment',
        body: {
            customer_id: 'string (uuid)',
            shop_id: 'string (uuid) (optional)',
            appointment_date: 'string (ISO date)',
            gender: 'enum (male, female, unisex, others)',
            notes: 'string (optional)',
            payment_mode: 'enum (cash, card, upi, wallet)',
            services: [
                {
                    service_id: 'string (uuid)',
                    duration: 'number',
                    price: 'number',
                    discounted_price: 'number (optional)'
                }
            ],
            location: {
                latitude: 'string (optional)',
                longitude: 'string (optional)',
                radius: 'number (optional)'
            }
        },
        auth: true
    },
    {
        name: 'Assign Appointments',
        method: 'PUT',
        path: '/customer/assign-appointments',
        description: 'Assign appointments to barbers',
        body: {
            id: 'string (uuid)',
            barberId: 'string (uuid)',
            extra_duration: 'number (optional)'
        },
        auth: true
    },
    {
        name: 'Get All Appointments',
        method: 'GET',
        path: '/customer/appointments',
        description: 'Get all customer appointments',
        query: {
            user_id: 'string (uuid) (optional)',
            shop_id: 'string (uuid) (optional)',
            barber_id: 'string (uuid) (optional)',
            status: 'enum (pending, confirmed, completed, cancelled, rejected) (optional)'
        },
        auth: true
    },
    {
        name: 'Change Appointment Status',
        method: 'PUT',
        path: '/customer/change-appointment-status',
        description: 'Change appointment status',
        body: {
            id: 'string (uuid)',
            status: 'enum (pending, confirmed, completed, cancelled, rejected)',
            remark: 'string (optional, required if status is rejected or cancelled)'
        },
        auth: true
    },
    {
        name: 'Get Payment Modes',
        method: 'GET',
        path: '/customer/payment-modes',
        description: 'Get all available payment modes',
        auth: true
    },
    {
        name: 'Get Appointment Statuses',
        method: 'GET',
        path: '/customer/appointment-statuses',
        description: 'Get all available appointment statuses',
        auth: true
    },
    {
        name: 'Get All Categories',
        method: 'GET',
        path: '/customer/categories',
        description: 'Get all available salon/service categories',
        auth: true
    },

    // Vendor/Shop Routes
    {
        name: 'Save Shop Details',
        method: 'POST',
        path: '/vendor/save-shop-details',
        description: 'Save shop details',
        body: {
            user_id: 'string (uuid)',
            shop_name: 'string',
            shop_logo_url: 'string (url) (optional)',
            shop_banner_url: 'string (url) (optional)',
            gstin_number: 'string (15 chars) (optional)',
            email: 'string (email)',
            mobile: 'string (10 digits)',
            shop_open_time: 'string (optional)',
            shop_close_time: 'string (optional)',
            weekly_holiday: 'string (optional)',
            services: 'array (optional)'
        },
        auth: true
    },
    {
        name: 'Save Shop Location',
        method: 'POST',
        path: '/vendor/save-shop-location',
        description: 'Save shop location',
        body: {
            user_id: 'string (uuid)',
            shop_id: 'string (uuid)',
            address_line1: 'string',
            address_line2: 'string (optional)',
            area: 'string',
            city: 'string',
            state: 'string',
            country: 'string',
            pincode: 'string (6 digits)',
            latitude: 'number (optional)',
            longitude: 'number (optional)'
        },
        auth: true
    },
    {
        name: 'Save Shop KYC',
        method: 'POST',
        path: '/vendor/save-shop-kyc',
        description: 'Save shop KYC details',
        body: {
            shop_id: 'string (uuid)',
            user_id: 'string (uuid)',
            aadhar_number: 'string (optional)',
            pan_number: 'string (optional)',
            aadhar_front: 'string (url) (optional)',
            aadhar_back: 'string (url) (optional)',
            pan_card: 'string (url) (optional)',
            shop_license: 'string (url) (optional)'
        },
        auth: true
    },
    {
        name: 'Save Shop Bank Details',
        method: 'POST',
        path: '/vendor/save-shop-bank',
        description: 'Save shop bank details',
        body: {
            shop_id: 'string (uuid)',
            user_id: 'string (uuid)',
            bank_name: 'string (optional)',
            account_number: 'string (optional)',
            ifsc_code: 'string (optional)',
            account_holder_name: 'string (optional)'
        },
        auth: true
    },
    {
        name: 'Get Shop Profile',
        method: 'GET',
        path: '/vendor/get-shop-profile',
        description: 'Get shop profile',
        auth: true
    },
    {
        name: 'Create Service',
        method: 'POST',
        path: '/vendor/create-service',
        description: 'Create a new service',
        body: {
            name: 'string',
            shop_id: 'string (uuid)',
            description: 'string (optional)',
            duration: 'number',
            price: 'number',
            discounted_price: 'number (optional)',
            gender: 'enum (male, female, unisex, others)',
            category: 'string',
            is_active: 'boolean (default: true)',
            image_url: 'string (url) (optional)'
        },
        auth: true
    },
    {
        name: 'Get All Services',
        method: 'GET',
        path: '/vendor/services',
        description: 'Get all services',
        auth: true
    },
    {
        name: 'Add Services to Shop',
        method: 'POST',
        path: '/vendor/add-services',
        description: 'Add services to shop',
        body: {
            shop_id: 'string (uuid)',
            services: 'array (string[])'
        },
        auth: true
    },
    {
        name: 'Update Service',
        method: 'PUT',
        path: '/vendor/update-service',
        description: 'Update service details',
        body: {
            id: 'string (uuid)',
            name: 'string (optional)',
            description: 'string (optional)',
            duration: 'number (optional)',
            price: 'number (optional)',
            discounted_price: 'number (optional)',
            gender: 'enum (male, female, unisex, others) (optional)',
            category: 'string (optional)',
            is_active: 'boolean (optional)',
            image_url: 'string (url) (optional)'
        },
        auth: true
    },

    // Barber Routes
    {
        name: 'Login Barber',
        method: 'POST',
        path: '/barber/login',
        description: 'Login barber with username and PIN',
        body: {
            username: 'string',
            login_pin: 'number'
        },
        auth: false
    },
    {
        name: 'Get Barber Profile',
        method: 'GET',
        path: '/barber/barber-profile',
        description: 'Get barber profile',
        auth: true,
        authType: 'barber'
    },
    {
        name: 'Get Barber Appointments',
        method: 'GET',
        path: '/barber/barbers-appointments',
        description: 'Get all barber appointments',
        auth: true,
        authType: 'barber'
    },
    {
        name: 'Create Barber',
        method: 'POST',
        path: '/barber/create-barber',
        description: 'Create a new barber',
        body: {
            user_id: 'string (uuid)',
            shop_id: 'string (uuid)',
            name: 'string',
            email: 'string (email) (optional)',
            mobile: 'string (10 digits)',
            age: 'number (optional)',
            gender: 'enum (male, female, unisex, others)',
            specialist_in: 'array (optional)',
            status: 'enum (active, inactive, deleted) (optional)'
        },
        auth: true
    },
    {
        name: 'Update Barber',
        method: 'PUT',
        path: '/barber/update-barber',
        description: 'Update barber details',
        body: {
            id: 'string (uuid)',
            user_id: 'string (uuid) (optional)',
            shop_id: 'string (uuid) (optional)',
            name: 'string (optional)',
            email: 'string (email) (optional)',
            mobile: 'string (10 digits) (optional)',
            age: 'number (optional)',
            gender: 'enum (male, female, unisex, others) (optional)',
            specialist_in: 'array (optional)',
            status: 'enum (active, inactive, deleted) (optional)'
        },
        auth: true
    },
    {
        name: 'Get All Barbers of Shop',
        method: 'GET',
        path: '/barber/barbers/:id',
        description: 'Get all barbers of a shop',
        params: {
            id: 'string (shop_id)'
        },
        auth: true
    },
    {
        name: 'Toggle Barber Availability',
        method: 'PUT',
        path: '/barber/availability',
        description: 'Toggle barber availability',
        body: {
            id: 'string (uuid)',
            available: 'boolean'
        },
        auth: true
    },

    // Common Routes
    {
        name: 'Update Device Info',
        method: 'PUT',
        path: '/common/update-device-info',
        description: 'Update device information',
        body: {
            device_id: 'string (uuid) (optional)',
            device_type: 'string (optional)',
            device_model: 'string (optional)',
            os_version: 'string (optional)',
            app_version: 'string (optional)',
            user_id: 'string (uuid) (optional)'
        },
        auth: true
    },
    {
        name: 'Get Device Info',
        method: 'GET',
        path: '/common/device-info',
        description: 'Get device information',
        auth: true
    },
    {
        name: 'Save FCM Token',
        method: 'POST',
        path: '/common/save-token',
        description: 'Save FCM token for push notifications',
        body: {
            user_id: 'string (uuid)',
            device_id: 'string (uuid)',
            token: {
                type: 'enum (fcm, apns)',
                token: 'string'
            }
        },
        auth: true
    },
    {
        name: 'Get FCM Token',
        method: 'GET',
        path: '/common/fcm-token',
        description: 'Get FCM token',
        auth: true
    },
    {
        name: 'Upload Media',
        method: 'POST',
        path: '/common/upload-media',
        description: 'Upload media file',
        body: {
            file: 'file',
            folder: 'string (optional)'
        },
        auth: true
    },

    // Health Check
    {
        name: 'Health Check',
        method: 'GET',
        path: '/api',
        description: 'Check if server is running',
        auth: false
    }
];

/**
 * Generate Postman collection from routes
 */
function generatePostmanCollection() {
    const collection = {
        info: {
            name: COLLECTION_NAME,
            description: `API collection for ${PROJECT_NAME} application`,
            schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
        },
        variable: [
            {
                key: 'base_url',
                value: BASE_URL,
                type: 'string'
            },
            {
                key: 'access_token',
                value: '',
                type: 'string'
            },
            {
                key: 'refresh_token',
                value: '',
                type: 'string'
            },
            {
                key: 'barber_token',
                value: '',
                type: 'string'
            }
        ],
        item: []
    };

    // Group routes by category
    const categories = {
        'Authentication': [],
        'User Management': [],
        'Customer': [],
        'Vendor/Shop': [],
        'Barber': [],
        'Common': [],
        'Health Check': []
    };

    routes.forEach(route => {
        let category = 'Common';
        if (route.path.startsWith('/auth')) category = 'Authentication';
        else if (route.path.startsWith('/users')) category = 'User Management';
        else if (route.path.startsWith('/customer')) category = 'Customer';
        else if (route.path.startsWith('/vendor')) category = 'Vendor/Shop';
        else if (route.path.startsWith('/barber')) category = 'Barber';
        else if (route.path.startsWith('/common')) category = 'Common';
        else if (route.path.startsWith('/api')) category = 'Health Check';

        categories[category].push(route);
    });

    // Convert to Postman format
    Object.keys(categories).forEach(categoryName => {
        if (categories[categoryName].length === 0) return;

        const folder = {
            name: categoryName,
            item: categories[categoryName].map(route => {
                const item = {
                    name: route.name,
                    request: {
                        method: route.method,
                        header: [],
                        url: {
                            raw: `{{base_url}}${route.path}`,
                            host: ['{{base_url}}'],
                            path: route.path.split('/').filter(p => p)
                        },
                        description: route.description || ''
                    }
                };

                // Handle path parameters
                if (route.params) {
                    item.request.url.path = route.path.split('/').filter(p => {
                        if (p.startsWith(':')) {
                            const paramName = p.substring(1);
                            if (route.params[paramName]) {
                                return `:${paramName}`;
                            }
                        }
                        return p && !p.startsWith(':');
                    });
                    item.request.url.variable = Object.keys(route.params).map(key => ({
                        key: key,
                        value: '',
                        description: route.params[key]
                    }));
                }

                // Add authentication
                if (route.auth) {
                    if (route.authType === 'barber') {
                        item.request.header.push({
                            key: 'Authorization',
                            value: 'Bearer {{barber_token}}',
                            type: 'text'
                        });
                    } else {
                        item.request.header.push({
                            key: 'Authorization',
                            value: 'Bearer {{access_token}}',
                            type: 'text'
                        });
                    }
                }

                // Helper function to parse type and generate example value
                const parseTypeAndValue = (typeDesc, fieldName = '') => {
                    if (!typeDesc) return '';

                    const desc = typeDesc.toLowerCase();
                    const fieldLower = fieldName.toLowerCase();

                    // Check for enum
                    if (desc.includes('enum')) {
                        const enumMatch = typeDesc.match(/enum\s*\(([^)]+)\)/i);
                        if (enumMatch) {
                            const enumValues = enumMatch[1].split(',').map(v => v.trim().replace(/['"]/g, ''));
                            return enumValues[0] || '';
                        }
                    }

                    // Check for number
                    if (desc.includes('number')) {
                        if (desc.includes('default')) {
                            const defaultMatch = typeDesc.match(/default:\s*([0-9.]+)/i);
                            if (defaultMatch) return parseFloat(defaultMatch[1]);
                        }
                        // Generate example based on field name
                        if (fieldLower.includes('age') || fieldLower.includes('count')) return 25;
                        if (fieldLower.includes('price') || fieldLower.includes('amount') || fieldLower.includes('cost')) return 100.50;
                        if (fieldLower.includes('radius') || fieldLower.includes('distance')) return 5;
                        if (fieldLower.includes('pin') || fieldLower.includes('code')) return 1234;
                        if (fieldLower.includes('duration')) return 30;
                        return 0;
                    }

                    // Check for boolean
                    if (desc.includes('boolean') || desc.includes('bool')) {
                        return false;
                    }

                    // Check for array
                    if (desc.includes('array')) {
                        return [];
                    }

                    // Check for object (nested)
                    if (desc.includes('object') || (typeof typeDesc === 'object' && !Array.isArray(typeDesc) && typeDesc !== null)) {
                        return typeDesc;
                    }

                    // Generate example strings based on field name
                    if (fieldLower.includes('mobile') || fieldLower.includes('phone')) return '9876543210';
                    if (fieldLower.includes('email')) return 'user@example.com';
                    if (fieldLower.includes('first_name') || fieldLower.includes('firstname')) return 'John';
                    if (fieldLower.includes('last_name') || fieldLower.includes('lastname')) return 'Doe';
                    if (fieldLower.includes('name') && !fieldLower.includes('username') && !fieldLower.includes('shop_name')) return 'John Doe';
                    if (fieldLower.includes('shop_name')) return 'My Shop';
                    if (fieldLower.includes('code') || fieldLower.includes('otp')) return '123456';
                    if (fieldLower.includes('token')) return 'your_token_here';
                    if (fieldLower.includes('user_id') || fieldLower.includes('customer_id') || fieldLower.includes('shop_id') || fieldLower.includes('barber_id') || fieldLower.includes('service_id') || fieldLower.includes('appointment_id') || fieldLower.includes('device_id') || (fieldLower.includes('id') && desc.includes('uuid'))) return '123e4567-e89b-12d3-a456-426614174000';
                    if (fieldLower.includes('uuid')) return '123e4567-e89b-12d3-a456-426614174000';
                    if (fieldLower.includes('latitude') || fieldLower.includes('lat')) return '28.6139';
                    if (fieldLower.includes('longitude') || fieldLower.includes('lng') || fieldLower.includes('lon')) return '77.2090';
                    if (fieldLower.includes('address_line1') || fieldLower.includes('address1')) return '123 Main Street';
                    if (fieldLower.includes('address_line2') || fieldLower.includes('address2')) return 'Apt 4B';
                    if (fieldLower.includes('area')) return 'Downtown';
                    if (fieldLower.includes('city')) return 'New York';
                    if (fieldLower.includes('state')) return 'NY';
                    if (fieldLower.includes('country')) return 'USA';
                    if (fieldLower.includes('zip') || fieldLower.includes('pincode')) return '10001';
                    if (fieldLower.includes('password')) return 'password123';
                    if (fieldLower.includes('username')) return 'johndoe';
                    if (fieldLower.includes('gstin')) return '29ABCDE1234F1Z5';
                    if (fieldLower.includes('ifsc')) return 'SBIN0001234';
                    if (fieldLower.includes('account_number')) return '1234567890';
                    if (fieldLower.includes('account_holder')) return 'John Doe';
                    if (fieldLower.includes('appointment_date') || (fieldLower.includes('date') && !fieldLower.includes('birth'))) return new Date().toISOString();
                    if (fieldLower.includes('open_time') || fieldLower.includes('close_time') || (fieldLower.includes('time') && !fieldLower.includes('duration'))) return '09:00';
                    if (fieldLower.includes('holiday')) return 'Sunday';
                    if (fieldLower.includes('remark') || fieldLower.includes('notes') || fieldLower.includes('description')) return 'Sample text';
                    if (fieldLower.includes('aadhar') || fieldLower.includes('pan')) return '123456789012';
                    if (fieldLower.includes('url') || fieldLower.includes('image') || fieldLower.includes('logo') || fieldLower.includes('banner')) return 'https://example.com/image.jpg';

                    // Check for optional
                    if (desc.includes('optional')) {
                        return null;
                    }

                    // Default to empty string for strings
                    return '';
                };

                // Helper to build nested objects
                const buildNestedObject = (obj) => {
                    if (!obj || typeof obj !== 'object') return {};

                    const result = {};
                    Object.keys(obj).forEach(key => {
                        const value = obj[key];
                        if (typeof value === 'object' && !Array.isArray(value) && value !== null && typeof value !== 'string') {
                            // It's a nested object
                            result[key] = buildNestedObject(value);
                        } else if (Array.isArray(value)) {
                            // It's an array - create example array item
                            if (value.length > 0 && typeof value[0] === 'object') {
                                // Array of objects
                                result[key] = [buildNestedObject(value[0])];
                            } else {
                                result[key] = [];
                            }
                        } else {
                            // It's a primitive value (string description)
                            result[key] = parseTypeAndValue(value, key);
                        }
                    });
                    return result;
                };

                // Add query parameters
                if (route.query) {
                    item.request.url.query = Object.keys(route.query).map(key => {
                        const desc = route.query[key];
                        const exampleValue = parseTypeAndValue(desc, key);
                        return {
                            key,
                            value: exampleValue !== null && exampleValue !== '' ? String(exampleValue) : '',
                            description: desc,
                            disabled: desc.toLowerCase().includes('optional')
                        };
                    });
                }

                // Add body
                if (route.body) {
                    if (route.name === 'Upload Media') {
                        item.request.body = {
                            mode: 'formdata',
                            formdata: [
                                {
                                    key: 'file',
                                    type: 'file',
                                    src: []
                                },
                                {
                                    key: 'folder',
                                    value: '',
                                    type: 'text',
                                    disabled: true
                                }
                            ]
                        };
                    } else {
                        // Generate body with proper example values
                        const bodyObj = buildNestedObject(route.body);

                        item.request.body = {
                            mode: 'raw',
                            raw: JSON.stringify(bodyObj, null, 2),
                            options: {
                                raw: {
                                    language: 'json'
                                }
                            }
                        };
                        item.request.header.push({
                            key: 'Content-Type',
                            value: 'application/json',
                            type: 'text'
                        });
                    }
                }

                return item;
            })
        };

        collection.item.push(folder);
    });

    return collection;
}

/**
 * Generate Postman environment
 */
function generatePostmanEnvironment() {
    const environment = {
        name: `${PROJECT_NAME.charAt(0).toUpperCase() + PROJECT_NAME.slice(1)} Environment`,
        values: [
            {
                key: 'base_url',
                value: BASE_URL,
                type: 'default',
                enabled: true
            },
            {
                key: 'access_token',
                value: '',
                type: 'secret',
                enabled: true
            },
            {
                key: 'refresh_token',
                value: '',
                type: 'secret',
                enabled: true
            },
            {
                key: 'barber_token',
                value: '',
                type: 'secret',
                enabled: true
            }
        ],
        _postman_variable_scope: 'environment'
    };

    return environment;
}

// Generate and save collection
const collection = generatePostmanCollection();
const collectionPath = path.join(__dirname, 'postman_collection.json');

// Generate and save environment
const environment = generatePostmanEnvironment();
const environmentPath = path.join(__dirname, 'postman_environment.json');

fs.writeFileSync(collectionPath, JSON.stringify(collection, null, 2));
fs.writeFileSync(environmentPath, JSON.stringify(environment, null, 2));

console.log(`✅ Postman collection generated successfully at: ${collectionPath}`);
console.log(`✅ Postman environment generated successfully at: ${environmentPath}`);
console.log(`📦 Total routes: ${routes.length}`);
console.log(`\n💡 To push to Postman:`);
console.log(`   Run: npm run postman:push`);
console.log(`   Or: npm run postman (generates and pushes)`);
console.log(`\n   After import:`);
console.log(`   - Select the environment in Postman`);
console.log(`   - Update base_url variable with your server URL`);
console.log(`   - After login, access_token will be automatically saved`);
