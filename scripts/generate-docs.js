#!/usr/bin/env node

/**
 * Automatic Documentation Generator
 * Scans src/routes and generates comprehensive API documentation with request/response examples
 * 
 * Usage: npm run generate-docs
 */

const fs = require('fs');
const path = require('path');

const ROUTES_DIR = path.join(__dirname, '../src/routes');
const SCHEMA_DIR = path.join(__dirname, '../src/schema');
const DOCS_DIR = path.join(__dirname, '../documentation');
const ROUTES_DOC_PATH = path.join(DOCS_DIR, 'ROUTES_DOCUMENTATION.md');

let totalRoutes = 0;
const routesByCategory = {};
const allRoutes = [];

// Base paths mapping
const basePaths = {
    'common/auth.route.ts': '/auth',
    'common/common.route.ts': '/common',
    'user/user.route.ts': '/users',
    'user/customer.route.ts': '/customer',
    'vendor/shop.route.ts': '/vendor',
    'vendor/barber.route.ts': '/barber'
};

// Route to schema mapping with manual field definitions
const routeSchemaMap = {
    '/auth/send-otp': {
        fields: {
            mobile: { type: 'string', required: true, example: '9876543210', description: '10 digit mobile number' },
            role: { type: 'enum', required: true, example: 'customer', description: 'User role (customer, vendor, admin)' }
        }
    },
    '/auth/verify-otp': {
        fields: {
            code: { type: 'string', required: true, example: '123456', description: 'OTP code received via SMS' },
            mobile: { type: 'string', required: true, example: '9876543210', description: '10 digit mobile number' },
            user_id: { type: 'string', required: false, example: '123e4567-e89b-12d3-a456-426614174000', description: 'User ID (optional, for existing users)' }
        }
    },
    '/auth/new-access-token': {
        fields: {
            refresh_token: { type: 'string', required: true, example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'Refresh token' }
        }
    },
    '/users/save-profile': {
        fields: {
            user_id: { type: 'string', required: false, example: '123e4567-e89b-12d3-a456-426614174000', description: 'User ID (optional)' },
            first_name: { type: 'string', required: true, example: 'John', description: 'First name' },
            last_name: { type: 'string', required: true, example: 'Doe', description: 'Last name' },
            email: { type: 'string', required: true, example: 'user@example.com', description: 'Email address' },
            location: {
                type: 'object',
                required: true,
                example: {
                    country: 'USA',
                    state: 'NY',
                    city: 'New York',
                    landmark: 'Near Central Park',
                    latitude: '40.7128',
                    longitude: '-74.0060'
                },
                description: 'User location',
                fields: {
                    country: { type: 'string', required: true, example: 'USA', description: 'Country' },
                    state: { type: 'string', required: true, example: 'NY', description: 'State' },
                    city: { type: 'string', required: true, example: 'New York', description: 'City' },
                    landmark: { type: 'string', required: false, example: 'Near Central Park', description: 'Landmark (optional)' },
                    latitude: { type: 'string', required: true, example: '40.7128', description: 'Latitude' },
                    longitude: { type: 'string', required: true, example: '-74.0060', description: 'Longitude' }
                }
            },
            is_onboarding_completed: { type: 'boolean', required: false, example: false, description: 'Onboarding completion status' },
            gender: { type: 'enum', required: true, example: 'male', description: 'Gender (male, female, unisex, others)' }
        }
    },
    '/users/update-profile': {
        fields: {
            user_id: { type: 'string', required: false, example: '123e4567-e89b-12d3-a456-426614174000', description: 'User ID (optional)' },
            first_name: { type: 'string', required: false, example: 'John', description: 'First name' },
            last_name: { type: 'string', required: false, example: 'Doe', description: 'Last name' },
            email: { type: 'string', required: false, example: 'user@example.com', description: 'Email address' },
            location: {
                type: 'object',
                required: false,
                example: {
                    country: 'USA',
                    state: 'NY',
                    city: 'New York'
                },
                description: 'User location (all fields optional)',
                fields: {
                    country: { type: 'string', required: false },
                    state: { type: 'string', required: false },
                    city: { type: 'string', required: false },
                    landmark: { type: 'string', required: false },
                    latitude: { type: 'string', required: false },
                    longitude: { type: 'string', required: false }
                }
            },
            is_onboarding_completed: { type: 'boolean', required: false, example: true, description: 'Onboarding completion status' },
            gender: { type: 'enum', required: false, example: 'male', description: 'Gender (male, female, unisex, others)' }
        }
    },
    '/users/update-location': {
        fields: {
            latitude: { type: 'string', required: true, example: '28.6139', description: 'Latitude coordinate' },
            longitude: { type: 'string', required: true, example: '77.2090', description: 'Longitude coordinate' },
            user_id: { type: 'string', required: true, example: '123e4567-e89b-12d3-a456-426614174000', description: 'User ID' }
        }
    },
    '/users/update-status': {
        fields: {
            user_id: { type: 'string', required: true, example: '123e4567-e89b-12d3-a456-426614174000', description: 'User ID' },
            status: { type: 'enum', required: true, example: 'active', description: 'Status (active, inactive, deleted)' }
        }
    },
    '/customer/near-by-shops': {
        queryParams: {
            latitude: { type: 'number', required: true, example: 28.6139, description: 'Latitude coordinate' },
            longitude: { type: 'number', required: true, example: 77.2090, description: 'Longitude coordinate' },
            radius: { type: 'number', required: false, example: 5, description: 'Search radius in km (default: 5)' }
        }
    },
    '/customer/book-appointment': {
        fields: {
            customer_id: { type: 'string', required: true, example: '123e4567-e89b-12d3-a456-426614174000', description: 'Customer UUID' },
            shop_id: { type: 'string', required: false, example: '123e4567-e89b-12d3-a456-426614174000', description: 'Shop UUID (optional)' },
            appointment_date: { type: 'string', required: true, example: '2026-01-15T10:00:00Z', description: 'ISO date string' },
            gender: { type: 'enum', required: true, example: 'male', description: 'Gender preference (male, female, unisex, others)' },
            notes: { type: 'string', required: false, example: 'Haircut and beard trim', description: 'Additional notes' },
            payment_mode: { type: 'enum', required: true, example: 'cash', description: 'Payment mode (cash, online, other)' },
            services: {
                type: 'array',
                required: true,
                example: [
                    {
                        service_id: '123e4567-e89b-12d3-a456-426614174000',
                        duration: 30,
                        price: 500,
                        discounted_price: 450
                    }
                ],
                description: 'Array of services',
                itemFields: {
                    service_id: { type: 'string', required: true, example: '123e4567-e89b-12d3-a456-426614174000', description: 'Service ID' },
                    duration: { type: 'number', required: true, example: 30, description: 'Duration in minutes' },
                    price: { type: 'number', required: true, example: 500, description: 'Service price' },
                    discounted_price: { type: 'number', required: false, example: 450, description: 'Discounted price (optional)' }
                }
            },
            location: {
                type: 'object',
                required: false,
                example: {
                    latitude: '28.6139',
                    longitude: '77.2090',
                    radius: 5
                },
                description: 'Location details (optional)',
                fields: {
                    latitude: { type: 'string', required: false, example: '28.6139', description: 'Latitude' },
                    longitude: { type: 'string', required: false, example: '77.2090', description: 'Longitude' },
                    radius: { type: 'number', required: false, example: 5, description: 'Radius in km' }
                }
            }
        }
    },
    '/customer/assign-appointments': {
        fields: {
            id: { type: 'string', required: true, example: '123e4567-e89b-12d3-a456-426614174000', description: 'Appointment ID' },
            barberId: { type: 'string', required: true, example: '123e4567-e89b-12d3-a456-426614174000', description: 'Barber ID' },
            extra_duration: { type: 'number', required: false, example: 15, description: 'Extra duration in minutes' }
        }
    },
    '/customer/change-appointment-status': {
        fields: {
            id: { type: 'string', required: true, example: '123e4567-e89b-12d3-a456-426614174000', description: 'Appointment ID' },
            status: { type: 'enum', required: true, example: 'accepted', description: 'Status (pending, accepted, in-progress, completed, rejected, cancelled)' },
            remark: { type: 'string', required: false, example: 'Customer requested cancellation', description: 'Remark (required if status is rejected or cancelled)' }
        }
    },
    '/customer/appointments': {
        queryParams: {
            user_id: { type: 'string', required: false, example: '123e4567-e89b-12d3-a456-426614174000', description: 'Filter by user ID' },
            shop_id: { type: 'string', required: false, example: '123e4567-e89b-12d3-a456-426614174000', description: 'Filter by shop ID' },
            barber_id: { type: 'string', required: false, example: '123e4567-e89b-12d3-a456-426614174000', description: 'Filter by barber ID' },
            status: { type: 'enum', required: false, example: 'pending', description: 'Filter by status' }
        }
    },
    '/vendor/save-shop-details': {
        fields: {
            user_id: { type: 'string', required: true, example: '123e4567-e89b-12d3-a456-426614174000', description: 'User ID' },
            shop_name: { type: 'string', required: true, example: 'My Barber Shop', description: 'Shop name' },
            shop_logo_url: { type: 'string', required: false, example: 'https://example.com/logo.jpg', description: 'Shop logo URL' },
            shop_banner_url: { type: 'string', required: false, example: 'https://example.com/banner.jpg', description: 'Shop banner URL' },
            gstin_number: { type: 'string', required: false, example: '29ABCDE1234F1Z5', description: 'GSTIN number (15 characters)' },
            email: { type: 'string', required: true, example: 'shop@example.com', description: 'Shop email' },
            mobile: { type: 'string', required: true, example: '9876543210', description: '10 digit mobile number' },
            shop_open_time: { type: 'string', required: false, example: '09:00', description: 'Shop opening time' },
            shop_close_time: { type: 'string', required: false, example: '21:00', description: 'Shop closing time' },
            weekly_holiday: { type: 'string', required: false, example: 'Sunday', description: 'Weekly holiday' },
            services: { type: 'array', required: false, example: [], description: 'Array of service IDs' }
        }
    },
    '/vendor/save-shop-location': {
        fields: {
            user_id: { type: 'string', required: true, example: '123e4567-e89b-12d3-a456-426614174000', description: 'User ID' },
            shop_id: { type: 'string', required: true, example: '123e4567-e89b-12d3-a456-426614174000', description: 'Shop ID' },
            address_line1: { type: 'string', required: true, example: '123 Main Street', description: 'Address line 1' },
            address_line2: { type: 'string', required: false, example: 'Apt 4B', description: 'Address line 2' },
            area: { type: 'string', required: true, example: 'Downtown', description: 'Area' },
            city: { type: 'string', required: true, example: 'New York', description: 'City' },
            state: { type: 'string', required: true, example: 'NY', description: 'State' },
            country: { type: 'string', required: true, example: 'USA', description: 'Country' },
            pincode: { type: 'string', required: true, example: '10001', description: '6 digit pincode' },
            latitude: { type: 'number', required: false, example: 28.6139, description: 'Latitude' },
            longitude: { type: 'number', required: false, example: 77.2090, description: 'Longitude' }
        }
    },
    '/vendor/save-shop-kyc': {
        fields: {
            shop_id: { type: 'string', required: true, example: '123e4567-e89b-12d3-a456-426614174000', description: 'Shop ID' },
            user_id: { type: 'string', required: true, example: '123e4567-e89b-12d3-a456-426614174000', description: 'User ID' },
            aadhar_number: { type: 'string', required: false, example: '123456789012', description: 'Aadhar number' },
            pan_number: { type: 'string', required: false, example: 'ABCDE1234F', description: 'PAN number' },
            aadhar_front: { type: 'string', required: false, example: 'https://example.com/aadhar-front.jpg', description: 'Aadhar front image URL' },
            aadhar_back: { type: 'string', required: false, example: 'https://example.com/aadhar-back.jpg', description: 'Aadhar back image URL' },
            pan_card: { type: 'string', required: false, example: 'https://example.com/pan.jpg', description: 'PAN card image URL' },
            shop_license: { type: 'string', required: false, example: 'https://example.com/license.jpg', description: 'Shop license image URL' }
        }
    },
    '/vendor/save-shop-bank': {
        fields: {
            shop_id: { type: 'string', required: true, example: '123e4567-e89b-12d3-a456-426614174000', description: 'Shop ID' },
            user_id: { type: 'string', required: true, example: '123e4567-e89b-12d3-a456-426614174000', description: 'User ID' },
            bank_name: { type: 'string', required: false, example: 'State Bank of India', description: 'Bank name' },
            account_number: { type: 'string', required: false, example: '1234567890', description: 'Account number' },
            ifsc_code: { type: 'string', required: false, example: 'SBIN0001234', description: 'IFSC code' },
            account_holder_name: { type: 'string', required: false, example: 'John Doe', description: 'Account holder name' }
        }
    },
    '/vendor/create-service': {
        fields: {
            name: { type: 'string', required: true, example: 'Haircut', description: 'Service name' },
            shop_id: { type: 'string', required: true, example: '123e4567-e89b-12d3-a456-426614174000', description: 'Shop ID' },
            description: { type: 'string', required: false, example: 'Professional haircut service', description: 'Service description' },
            duration: { type: 'number', required: true, example: 30, description: 'Duration in minutes' },
            price: { type: 'number', required: true, example: 500, description: 'Service price' },
            discounted_price: { type: 'number', required: false, example: 450, description: 'Discounted price' },
            gender: { type: 'enum', required: true, example: 'male', description: 'Gender (male, female, unisex, others)' },
            category: { type: 'string', required: true, example: 'Hair Services', description: 'Service category' },
            is_active: { type: 'boolean', required: false, example: true, description: 'Service active status' },
            image_url: { type: 'string', required: false, example: 'https://example.com/service.jpg', description: 'Service image URL' }
        }
    },
    '/vendor/add-services': {
        fields: {
            shop_id: { type: 'string', required: true, example: '123e4567-e89b-12d3-a456-426614174000', description: 'Shop ID' },
            services: { type: 'array', required: true, example: ['123e4567-e89b-12d3-a456-426614174000'], description: 'Array of service IDs' }
        }
    },
    '/vendor/update-service': {
        fields: {
            id: { type: 'string', required: true, example: '123e4567-e89b-12d3-a456-426614174000', description: 'Service ID' },
            name: { type: 'string', required: false, example: 'Haircut', description: 'Service name' },
            description: { type: 'string', required: false, example: 'Professional haircut service', description: 'Service description' },
            duration: { type: 'number', required: false, example: 30, description: 'Duration in minutes' },
            price: { type: 'number', required: false, example: 500, description: 'Service price' },
            discounted_price: { type: 'number', required: false, example: 450, description: 'Discounted price' },
            gender: { type: 'enum', required: false, example: 'male', description: 'Gender (male, female, unisex, others)' },
            category: { type: 'string', required: false, example: 'Hair Services', description: 'Service category' },
            is_active: { type: 'boolean', required: false, example: true, description: 'Service active status' },
            image_url: { type: 'string', required: false, example: 'https://example.com/service.jpg', description: 'Service image URL' }
        }
    },
    '/barber/login': {
        fields: {
            username: { type: 'string', required: true, example: 'barber123', description: 'Barber username' },
            login_pin: { type: 'number', required: true, example: 1234, description: 'Barber login PIN' }
        }
    },
    '/barber/create-barber': {
        fields: {
            user_id: { type: 'string', required: true, example: '123e4567-e89b-12d3-a456-426614174000', description: 'User ID' },
            shop_id: { type: 'string', required: true, example: '123e4567-e89b-12d3-a456-426614174000', description: 'Shop ID' },
            name: { type: 'string', required: true, example: 'John Barber', description: 'Barber name' },
            email: { type: 'string', required: false, example: 'barber@example.com', description: 'Barber email' },
            mobile: { type: 'string', required: true, example: '9876543210', description: '10 digit mobile number' },
            age: { type: 'number', required: false, example: 25, description: 'Barber age' },
            gender: { type: 'enum', required: true, example: 'male', description: 'Gender (male, female, unisex, others)' },
            specialist_in: { type: 'array', required: false, example: ['Haircut', 'Beard Trim'], description: 'Specializations' },
            status: { type: 'enum', required: false, example: 'active', description: 'Status (active, inactive, deleted)' }
        }
    },
    '/barber/update-barber': {
        fields: {
            id: { type: 'string', required: true, example: '123e4567-e89b-12d3-a456-426614174000', description: 'Barber ID' },
            user_id: { type: 'string', required: false, example: '123e4567-e89b-12d3-a456-426614174000', description: 'User ID' },
            shop_id: { type: 'string', required: false, example: '123e4567-e89b-12d3-a456-426614174000', description: 'Shop ID' },
            name: { type: 'string', required: false, example: 'John Barber', description: 'Barber name' },
            email: { type: 'string', required: false, example: 'barber@example.com', description: 'Barber email' },
            mobile: { type: 'string', required: false, example: '9876543210', description: '10 digit mobile number' },
            age: { type: 'number', required: false, example: 25, description: 'Barber age' },
            gender: { type: 'enum', required: false, example: 'male', description: 'Gender (male, female, unisex, others)' },
            specialist_in: { type: 'array', required: false, example: ['Haircut', 'Beard Trim'], description: 'Specializations' },
            status: { type: 'enum', required: false, example: 'active', description: 'Status (active, inactive, deleted)' }
        }
    },
    '/barber/availability': {
        fields: {
            id: { type: 'string', required: true, example: '123e4567-e89b-12d3-a456-426614174000', description: 'Barber ID' },
            available: { type: 'boolean', required: true, example: true, description: 'Availability status' }
        }
    },
    '/barber/barbers/:id': {
        pathParams: {
            id: { type: 'string', required: true, example: '123e4567-e89b-12d3-a456-426614174000', description: 'Shop ID' }
        },
        queryParams: {
            available: { type: 'boolean', required: false, example: true, description: 'Filter by availability' }
        }
    },
    '/common/save-token': {
        fields: {
            user_id: { type: 'string', required: true, example: '123e4567-e89b-12d3-a456-426614174000', description: 'User ID' },
            device_id: { type: 'string', required: true, example: '123e4567-e89b-12d3-a456-426614174000', description: 'Device ID' },
            token: {
                type: 'object',
                required: true,
                example: {
                    type: 'fcm',
                    token: 'fcm_token_string_here'
                },
                description: 'FCM token object',
                fields: {
                    type: { type: 'enum', required: true, example: 'fcm', description: 'Token type (fcm, apns)' },
                    token: { type: 'string', required: true, example: 'fcm_token_string_here', description: 'Token string' }
                }
            }
        }
    },
    '/common/update-device-info': {
        fields: {
            device_id: { type: 'string', required: false, example: '123e4567-e89b-12d3-a456-426614174000', description: 'Device ID' },
            device_type: { type: 'string', required: false, example: 'mobile', description: 'Device type' },
            device_model: { type: 'string', required: false, example: 'iPhone 13', description: 'Device model' },
            os_version: { type: 'string', required: false, example: 'iOS 15.0', description: 'OS version' },
            app_version: { type: 'string', required: false, example: '1.0.0', description: 'App version' },
            user_id: { type: 'string', required: false, example: '123e4567-e89b-12d3-a456-426614174000', description: 'User ID' }
        }
    }
};

/**
 * Build example object from schema
 */
function buildExampleObject(schema) {
    if (!schema || !schema.fields) {
        return {};
    }

    const example = {};
    Object.keys(schema.fields).forEach(fieldName => {
        const field = schema.fields[fieldName];
        if (field.type === 'object' && field.fields) {
            // Build nested object - always include all fields with examples
            const nestedExample = {};
            Object.keys(field.fields).forEach(nestedFieldName => {
                const nestedField = field.fields[nestedFieldName];
                if (nestedField.example !== undefined) {
                    nestedExample[nestedFieldName] = nestedField.example;
                } else if (nestedField.required !== false) {
                    nestedExample[nestedFieldName] = nestedField.example || '';
                }
            });
            example[fieldName] = nestedExample;
        } else if (field.type === 'array') {
            if (field.itemFields) {
                // Array of objects - build example object for array item
                const itemExample = {};
                Object.keys(field.itemFields).forEach(itemFieldName => {
                    const itemField = field.itemFields[itemFieldName];
                    if (itemField.example !== undefined) {
                        itemExample[itemFieldName] = itemField.example;
                    } else if (itemField.required !== false) {
                        itemExample[itemFieldName] = itemField.example || '';
                    }
                });
                example[fieldName] = [itemExample];
            } else {
                // Array of primitives - use example if provided
                example[fieldName] = field.example || [];
            }
        } else {
            // Include required fields, include some optional fields
            if (field.required !== false) {
                example[fieldName] = field.example;
            } else if (field.example !== undefined && Math.random() > 0.3) {
                // Include some optional fields that have examples
                example[fieldName] = field.example;
            }
        }
    });
    return example;
}

/**
 * Generate request body documentation
 */
function generateRequestBodyDoc(schema) {
    if (!schema || !schema.fields) {
        return null;
    }

    let doc = '**Request Body:**\n\n';
    doc += '```typescript\n';
    doc += '{\n';
    
    Object.keys(schema.fields).forEach(fieldName => {
        const field = schema.fields[fieldName];
        const optional = field.required === false ? '?' : '';
        const nullable = field.nullable ? ' | null' : '';
        
        let typeStr = field.type;
        if (field.type === 'enum') {
            typeStr = 'string'; // enum values as string
        } else if (field.type === 'array') {
            typeStr = field.itemFields ? 'Array<object>' : 'Array<any>';
        } else if (field.type === 'object') {
            typeStr = 'object';
        }
        
        doc += `  ${fieldName}${optional}: ${typeStr}${nullable};\n`;
    });
    
    doc += '}\n';
    doc += '```\n\n';
    
    // Add field descriptions
    doc += '**Fields:**\n\n';
    Object.keys(schema.fields).forEach(fieldName => {
        const field = schema.fields[fieldName];
        const required = field.required !== false ? ' (required)' : ' (optional)';
        doc += `- \`${fieldName}\` (${field.type})${required} - ${field.description || ''}\n`;
    });
    doc += '\n';
    
    // Example request body
    const exampleBody = buildExampleObject(schema);
    doc += '**Example Request Body:**\n\n';
    doc += '```json\n';
    doc += JSON.stringify(exampleBody, null, 2);
    doc += '\n';
    doc += '```\n\n';
    
    return doc;
}

/**
 * Generate query parameters documentation
 */
function generateQueryParamsDoc(queryParams) {
    if (!queryParams || Object.keys(queryParams).length === 0) {
        return null;
    }

    let doc = '**Query Parameters:**\n\n';
    Object.keys(queryParams).forEach(paramName => {
        const param = queryParams[paramName];
        const required = param.required !== false ? ' (required)' : ' (optional)';
        doc += `- \`${paramName}\` (${param.type})${required} - ${param.description || ''}\n`;
    });
    doc += '\n';
    return doc;
}

/**
 * Generate path parameters documentation
 */
function generatePathParamsDoc(pathParams) {
    if (!pathParams || Object.keys(pathParams).length === 0) {
        return null;
    }

    let doc = '**Path Parameters:**\n\n';
    Object.keys(pathParams).forEach(paramName => {
        const param = pathParams[paramName];
        doc += `- \`${paramName}\` (${param.type}, required) - ${param.description || ''}\n`;
    });
    doc += '\n';
    return doc;
}

/**
 * Generate example response
 */
function generateExampleResponse(route) {
    const pathLower = route.routePath.toLowerCase();
    const method = route.method;
    
    let response = {
        success: true,
        message: '',
        data: {}
    };
    
    // Set message based on route
    if (pathLower.includes('send-otp')) {
        response.message = 'OTP sent successfully';
        response.data = { mobile: '9876543210' };
    } else if (pathLower.includes('verify-otp')) {
        response.message = 'OTP verified successfully';
        response.data = {
            access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTIzZTQ1NjctZTg5Yi0xMmQzLWE0NTYtNDI2NjE0MTc0MDAwIiwicm9sZSI6ImN1c3RvbWVyIiwiaWF0IjoxNzA0MjE2MDAwLCJleHAiOjE3MDQyMTk2MDB9...',
            refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTIzZTQ1NjctZTg5Yi0xMmQzLWE0NTYtNDI2NjE0MTc0MDAwIiwicm9sZSI6ImN1c3RvbWVyIiwiaWF0IjoxNzA0MjE2MDAwLCJleHAiOjE3MDQ4MjA4MDB9...',
            user: {
                id: '123e4567-e89b-12d3-a456-426614174000',
                mobile: '9876543210',
                role: 'customer'
            }
        };
    } else if (pathLower.includes('new-access-token')) {
        response.message = 'New access token generated';
        response.data = {
            access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        };
    } else if (pathLower.includes('book-appointment')) {
        response.message = 'Appointment submitted';
        response.data = {
            id: '123e4567-e89b-12d3-a456-426614174000',
            customer_id: '123e4567-e89b-12d3-a456-426614174000',
            shop_id: '123e4567-e89b-12d3-a456-426614174000',
            appointment_date: '2026-01-15T10:00:00Z',
            status: 'pending',
            created_at: new Date().toISOString()
        };
    } else if (pathLower.includes('assign-appointments')) {
        response.message = 'Appointments accepted';
        response.data = {
            id: '123e4567-e89b-12d3-a456-426614174000',
            barber_id: '123e4567-e89b-12d3-a456-426614174000',
            status: 'accepted'
        };
    } else if (pathLower.includes('change-appointment-status')) {
        response.message = 'Appointment status changed to accepted';
        response.data = {
            id: '123e4567-e89b-12d3-a456-426614174000',
            status: 'accepted'
        };
    } else if (pathLower.includes('login') && pathLower.includes('barber')) {
        response.message = 'Login successfully';
        response.data = {
            token: 'barber_token_here',
            barber: {
                id: '123e4567-e89b-12d3-a456-426614174000',
                name: 'John Barber',
                shop_id: '123e4567-e89b-12d3-a456-426614174000'
            }
        };
    } else if (method === 'GET') {
        response.message = 'Data fetched successfully';
        if (pathLower.includes('profile')) {
            response.data = {
                id: '123e4567-e89b-12d3-a456-426614174000',
                name: 'John Doe',
                email: 'user@example.com',
                mobile: '9876543210',
                role: 'customer'
            };
        } else if (pathLower.includes('appointments')) {
            response.data = [
                {
                    id: '123e4567-e89b-12d3-a456-426614174000',
                    customer_id: '123e4567-e89b-12d3-a456-426614174000',
                    shop_id: '123e4567-e89b-12d3-a456-426614174000',
                    appointment_date: '2026-01-15T10:00:00Z',
                    status: 'pending'
                }
            ];
        } else if (pathLower.includes('shops') || pathLower.includes('nearby')) {
            response.data = [
                {
                    id: '123e4567-e89b-12d3-a456-426614174000',
                    shop_name: 'My Barber Shop',
                    distance: 2.5,
                    location: {
                        latitude: 28.6139,
                        longitude: 77.2090
                    }
                }
            ];
        } else if (pathLower.includes('services')) {
            response.data = [
                {
                    id: '123e4567-e89b-12d3-a456-426614174000',
                    name: 'Haircut',
                    price: 500,
                    duration: 30
                }
            ];
        } else if (pathLower.includes('barbers')) {
            response.data = [
                {
                    id: '123e4567-e89b-12d3-a456-426614174000',
                    name: 'John Barber',
                    available: true
                }
            ];
        } else if (pathLower.includes('genders') || pathLower.includes('roles') || pathLower.includes('status')) {
            response.data = ['male', 'female', 'unisex', 'others'];
        } else if (pathLower.includes('payment-modes')) {
            response.data = ['cash', 'online', 'other'];
        } else if (pathLower.includes('appointment-statuses')) {
            response.data = ['pending', 'accepted', 'in-progress', 'completed', 'rejected', 'cancelled'];
        } else {
            response.data = {};
        }
    } else {
        response.message = 'Operation completed successfully';
        response.data = {
            id: '123e4567-e89b-12d3-a456-426614174000',
            status: 'success'
        };
    }
    
    return response;
}

/**
 * Extract routes from a file
 */
function extractRoutesFromFile(filePath, category, basePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Pattern to find router methods: router.get, router.post, etc.
    const routePattern = /router\.(get|post|put|delete|patch)\s*\(\s*['"`]([^'"`]+)['"`]/g;
    let match;
    
    while ((match = routePattern.exec(content)) !== null) {
      const method = match[1].toUpperCase();
      const routePath = match[2];
      const fullPath = basePath + routePath;
      
      totalRoutes++;
      
      const route = {
        method,
        path: fullPath,
        routePath: routePath,
        category,
        file: path.relative(ROUTES_DIR, filePath)
      };
      
      allRoutes.push(route);
      
      if (!routesByCategory[category]) {
        routesByCategory[category] = [];
      }
      routesByCategory[category].push(route);
    }
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
  }
}

/**
 * Scan routes directory
 */
function scanRoutes() {
  // Scan common routes
  const commonPath = path.join(ROUTES_DIR, 'common');
  if (fs.existsSync(commonPath)) {
    const files = fs.readdirSync(commonPath).filter(f => f.endsWith('.route.ts') || f.endsWith('.route.js'));
    files.forEach(file => {
      const filePath = path.join(commonPath, file);
      const relativePath = `common/${file}`;
      const basePath = basePaths[relativePath] || '/common';
      const category = file.includes('auth') ? 'auth' : 'common';
      extractRoutesFromFile(filePath, category, basePath);
    });
  }

  // Scan user routes
  const userPath = path.join(ROUTES_DIR, 'user');
  if (fs.existsSync(userPath)) {
    const files = fs.readdirSync(userPath).filter(f => f.endsWith('.route.ts') || f.endsWith('.route.js'));
    files.forEach(file => {
      const filePath = path.join(userPath, file);
      const relativePath = `user/${file}`;
      const basePath = basePaths[relativePath] || '/users';
      const category = file.includes('customer') ? 'customer' : 'user';
      extractRoutesFromFile(filePath, category, basePath);
    });
  }

  // Scan vendor routes
  const vendorPath = path.join(ROUTES_DIR, 'vendor');
  if (fs.existsSync(vendorPath)) {
    const files = fs.readdirSync(vendorPath).filter(f => f.endsWith('.route.ts') || f.endsWith('.route.js'));
    files.forEach(file => {
      const filePath = path.join(vendorPath, file);
      const relativePath = `vendor/${file}`;
      const basePath = basePaths[relativePath] || '/vendor';
      const category = file.includes('barber') ? 'barber' : 'vendor';
      extractRoutesFromFile(filePath, category, basePath);
    });
  }

  // Add health check route
  allRoutes.push({
    method: 'GET',
    path: '/api',
    routePath: '/api',
    category: 'health',
    file: 'app.ts'
  });
  totalRoutes++;
  if (!routesByCategory['health']) {
    routesByCategory['health'] = [];
  }
  routesByCategory['health'].push({
    method: 'GET',
    path: '/api',
    routePath: '/api',
    category: 'health',
    file: 'app.ts'
  });
}

/**
 * Get route description based on path and method
 */
function getRouteDescription(route) {
  const pathLower = route.routePath.toLowerCase();
  const method = route.method;
  
  // Authentication routes
  if (pathLower.includes('send-otp')) return 'Send OTP to user mobile number';
  if (pathLower.includes('verify-otp')) return 'Verify OTP and get access token';
  if (pathLower.includes('logout')) return 'Logout user and blacklist token';
  if (pathLower.includes('new-access-token') || pathLower.includes('refresh')) return 'Generate new access token using refresh token';
  
  // User routes
  if (pathLower.includes('save-profile')) return 'Save user profile information';
  if (pathLower.includes('update-profile')) return 'Update user profile information';
  if (pathLower.includes('update-location')) return 'Update user location';
  if (pathLower.includes('user-profile') || pathLower.includes('get-profile')) return 'Get current user profile';
  if (pathLower.includes('update-status')) return 'Update user status';
  if (pathLower.includes('get-status')) return 'Get all available user statuses';
  if (pathLower.includes('get-genders') || pathLower.includes('genders')) return 'Get all available genders';
  if (pathLower.includes('roles')) return 'Get all available roles';
  if (pathLower.includes('check-profile')) return 'Check if user profile is completed';
  
  // Customer routes
  if (pathLower.includes('near-by-shops') || pathLower.includes('nearby')) return 'Get nearby shops based on location';
  if (pathLower.includes('book-appointment')) return 'Book a new appointment';
  if (pathLower.includes('assign-appointments') || pathLower.includes('assign')) return 'Assign appointments to barbers';
  if (pathLower.includes('appointments') && method === 'GET') return 'Get all customer appointments';
  if (pathLower.includes('change-appointment-status') || pathLower.includes('appointment-status')) return 'Change appointment status';
  if (pathLower.includes('payment-modes')) return 'Get all available payment modes';
  if (pathLower.includes('appointment-statuses')) return 'Get all available appointment statuses';
  
  // Vendor/Shop routes
  if (pathLower.includes('save-shop-details')) return 'Save shop details';
  if (pathLower.includes('save-shop-location')) return 'Save shop location';
  if (pathLower.includes('save-shop-kyc')) return 'Save shop KYC details';
  if (pathLower.includes('save-shop-bank')) return 'Save shop bank details';
  if (pathLower.includes('get-shop-profile') || pathLower.includes('shop-profile')) return 'Get shop profile';
  if (pathLower.includes('create-service')) return 'Create a new service';
  if (pathLower.includes('services') && method === 'GET') return 'Get all services';
  if (pathLower.includes('add-services')) return 'Add services to shop';
  if (pathLower.includes('update-service')) return 'Update service details';
  
  // Barber routes
  if (pathLower.includes('login') && pathLower.includes('barber')) return 'Login barber with username and PIN';
  if (pathLower.includes('barber-profile')) return 'Get barber profile';
  if (pathLower.includes('barbers-appointments')) return 'Get all barber appointments';
  if (pathLower.includes('create-barber')) return 'Create a new barber';
  if (pathLower.includes('update-barber')) return 'Update barber details';
  if (pathLower.includes('barbers') && method === 'GET') return 'Get all barbers of a shop';
  if (pathLower.includes('availability')) return 'Toggle barber availability';
  
  // Common routes
  if (pathLower.includes('update-device-info')) return 'Update device information';
  if (pathLower.includes('device-info') && method === 'GET') return 'Get device information';
  if (pathLower.includes('save-token') || pathLower.includes('fcm-token')) return 'Save FCM token for push notifications';
  if (pathLower.includes('fcm-token') && method === 'GET') return 'Get FCM token';
  if (pathLower.includes('upload-media')) return 'Upload media file';
  
  // Health check
  if (pathLower.includes('api') && method === 'GET') return 'Check if server is running';
  
  return `${method} ${route.path}`;
}

/**
 * Determine if route requires authentication
 */
function requiresAuth(route) {
  const pathLower = route.routePath.toLowerCase();
  
  // Public routes
  if (pathLower.includes('send-otp') || 
      pathLower.includes('verify-otp') || 
      pathLower.includes('new-access-token') ||
      pathLower.includes('login') ||
      pathLower.includes('near-by-shops') ||
      pathLower.includes('api')) {
    return false;
  }
  
  return true;
}

/**
 * Generate comprehensive route documentation in a single file
 */
function generateRoutesDocumentation() {
  // Ensure documentation directory exists
  if (!fs.existsSync(DOCS_DIR)) {
    fs.mkdirSync(DOCS_DIR, { recursive: true });
  }

  let doc = `# API Routes Documentation

**Last Updated:** ${new Date().toLocaleString()}  
**Total Routes:** ${totalRoutes}

---

## 📊 Routes Summary

| Category | Count | Methods |
|----------|-------|---------|
`;

  // Sort categories for better organization
  const categoryOrder = ['auth', 'user', 'customer', 'vendor', 'barber', 'common', 'health'];
  const sortedCategories = categoryOrder.filter(cat => routesByCategory[cat] && routesByCategory[cat].length > 0);
  
  sortedCategories.forEach(category => {
    const routes = routesByCategory[category];
    const methods = [...new Set(routes.map(r => r.method))].join(', ');
    doc += `| ${category.charAt(0).toUpperCase() + category.slice(1)} | ${routes.length} | ${methods} |\n`;
  });

  doc += `\n---\n\n`;

  // Generate detailed route documentation by category
  sortedCategories.forEach(category => {
    const routes = routesByCategory[category];
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
    
    doc += `## ${categoryName} Routes (${routes.length})\n\n`;
    
    // Sort routes by method (GET, POST, PUT, DELETE)
    const methodOrder = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
    routes.sort((a, b) => {
      const aIndex = methodOrder.indexOf(a.method);
      const bIndex = methodOrder.indexOf(b.method);
      if (aIndex !== bIndex) return aIndex - bIndex;
      return a.path.localeCompare(b.path);
    });
    
    routes.forEach(route => {
      const description = getRouteDescription(route);
      const authRequired = requiresAuth(route);
      const schemaInfo = routeSchemaMap[route.path];
      
      doc += `### ${route.method} ${route.path}\n\n`;
      doc += `**Description:** ${description}\n\n`;
      doc += `**Authentication:** ${authRequired ? 'Required' : 'Not Required'}\n\n`;
      doc += `**Defined In:** \`${route.file}\`\n\n`;
      
      // Add path parameters
      if (schemaInfo && schemaInfo.pathParams) {
        const pathDoc = generatePathParamsDoc(schemaInfo.pathParams);
        if (pathDoc) doc += pathDoc;
      }
      
      // Add query parameters
      if (schemaInfo && schemaInfo.queryParams) {
        const queryDoc = generateQueryParamsDoc(schemaInfo.queryParams);
        if (queryDoc) doc += queryDoc;
      } else if (route.method === 'GET' && route.routePath.includes('appointments')) {
        doc += '**Query Parameters:**\n\n';
        doc += `- \`user_id\` (string, optional) - Filter by user ID\n`;
        doc += `- \`shop_id\` (string, optional) - Filter by shop ID\n`;
        doc += `- \`barber_id\` (string, optional) - Filter by barber ID\n`;
        doc += `- \`status\` (enum, optional) - Filter by appointment status\n\n`;
      }
      
      // Add request body if POST/PUT
      if (['POST', 'PUT'].includes(route.method)) {
        if (schemaInfo && schemaInfo.fields) {
          const bodyDoc = generateRequestBodyDoc(schemaInfo);
          if (bodyDoc) {
            doc += bodyDoc;
          }
        } else {
          doc += `**Request Body:** Based on route requirements\n\n`;
        }
      }
      
      // Add example response
      const exampleResponse = generateExampleResponse(route);
      doc += `**Example Response:**\n\n`;
      doc += `\`\`\`json\n`;
      doc += JSON.stringify(exampleResponse, null, 2);
      doc += `\n\`\`\`\n\n`;
      
      doc += `---\n\n`;
    });
  });

  doc += `\n## 📝 Notes\n\n`;
  doc += `- All routes use JSON for request/response bodies\n`;
  doc += `- Authentication is done via Bearer token: \`Authorization: Bearer <token>\`\n`;
  doc += `- Base URL: \`http://localhost:3036\` (development) or your production domain\n`;
  doc += `- For detailed request/response examples, see Postman collection\n`;
  doc += `- All UUID fields should be valid UUID v4 format\n`;
  doc += `- Date fields should be in ISO 8601 format (e.g., 2026-01-15T10:00:00Z)\n\n`;
  doc += `**Generated:** ${new Date().toLocaleString()}\n`;

  fs.writeFileSync(ROUTES_DOC_PATH, doc, 'utf8');
  console.log(`✅ Routes documentation generated: ${ROUTES_DOC_PATH}`);
  console.log(`📄 Total routes documented: ${totalRoutes}`);
}

/**
 * Main execution
 */
function main() {
  console.log('🔍 Scanning routes...');
  
  try {
    scanRoutes();
    console.log(`📍 Found ${totalRoutes} routes across ${Object.keys(routesByCategory).length} categories`);
    
    generateRoutesDocumentation();
    
    console.log('\n✨ Documentation generation complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Documentation generation failed:', error);
    process.exit(1);
  }
}

main();
