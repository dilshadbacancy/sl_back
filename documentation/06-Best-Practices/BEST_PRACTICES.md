# Best Practices

Development, security, and operational best practices for the Salon Booking API.

---

## 1. Security Best Practices

### Authentication & Authorization

✅ **DO:**
- Always validate JWT tokens on protected routes
- Use HTTPS in production (never HTTP)
- Store tokens in HttpOnly cookies (not localStorage for sensitive apps)
- Implement token refresh before expiry
- Validate OTP with rate limiting (max 3 attempts per 5 minutes)
- Add CSRF protection for state-changing operations

```typescript
// Good: HttpOnly Cookie
response.cookie('access_token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 3600000 // 1 hour
});

// Bad: localStorage (vulnerable to XSS)
localStorage.setItem('token', token);
```

❌ **DON'T:**
- Hardcode credentials in code
- Log sensitive data (tokens, passwords, OTP)
- Send tokens in URL parameters
- Trust client-side validation alone
- Store passwords in plain text

### Password & OTP Management

✅ **DO:**
- Hash passwords using bcrypt (minimum 10 salt rounds)
- Expire OTPs in 5 minutes
- Rate limit OTP requests (max 5 per hour per mobile)
- Implement progressive delay after failed attempts

```typescript
// Good: Hash password
import bcrypt from 'bcrypt';
const hashedPassword = await bcrypt.hash(password, 10);

// Verify
const isValid = await bcrypt.compare(inputPassword, hashedPassword);
```

❌ **DON'T:**
- Use MD5 or SHA1 for passwords
- Set OTP expiry beyond 10 minutes
- Allow unlimited OTP attempts
- Log or email OTP in plain text

### API Security

✅ **DO:**
- Implement CORS properly (whitelist domains, not '*')
- Add rate limiting (e.g., 100 requests per 10 minutes per IP)
- Validate and sanitize all inputs
- Use parameterized queries (Sequelize does this)
- Add request validation middleware

```typescript
// Good: CORS configuration
const cors = require('cors');
app.use(cors({
  origin: ['https://app.example.com', 'https://admin.example.com'],
  credentials: true
}));

// Good: Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
```

❌ **DON'T:**
- Use CORS origin: '*'
- Trust user input without validation
- Use string concatenation for SQL queries
- Expose stack traces to clients

### Data Protection

✅ **DO:**
- Encrypt sensitive data at rest (PAN, Aadhar, bank account numbers)
- Use environment variables for API keys and secrets
- Implement soft deletes (don't permanently delete user data)
- Hash sensitive identifiers

```typescript
// Good: Encrypt sensitive data
import crypto from 'crypto';

function encryptAadhar(aadhar) {
  const cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
  return cipher.update(aadhar, 'utf8', 'hex') + cipher.final('hex');
}

// Good: Use environment variables
const API_KEY = process.env.FIREBASE_API_KEY;
```

❌ **DON'T:**
- Store plain Aadhar/PAN numbers
- Commit secrets to git
- Return unnecessary user data in API responses
- Log personally identifiable information

---

## 2. Performance Best Practices

### Database Optimization

✅ **DO:**
- Add indexes on frequently queried columns
- Use pagination for large result sets
- Eager load related data with `include` in Sequelize
- Cache frequently accessed data (Redis)

```typescript
// Good: Pagination
const shops = await Shop.findAll({
  offset: (page - 1) * limit,
  limit: limit,
  order: [['created_at', 'DESC']]
});

// Good: Eager loading
const appointments = await Appointment.findAll({
  include: [
    { model: User, attributes: ['name', 'mobile'] },
    { model: Shop, attributes: ['shop_name'] },
    { model: Barber, attributes: ['name'] }
  ]
});
```

❌ **DON'T:**
- Run N+1 queries (fetch parent, then loop and fetch children)
- Fetch all columns if you need only few
- Use LIKE queries without proper indexing
- Fetch full data sets and paginate in application

### Caching Strategy

✅ **DO:**
- Cache shop locations (change infrequently)
- Cache service lists per shop
- Cache barber availability data
- Use Redis for session storage

```typescript
// Good: Cache shop services
const CACHE_KEY = `shop_services_${shopId}`;
let services = await redis.get(CACHE_KEY);

if (!services) {
  services = await Service.findAll({ where: { shop_id: shopId } });
  await redis.setex(CACHE_KEY, 3600, JSON.stringify(services)); // 1 hour
}
```

❌ **DON'T:**
- Cache user-specific data without user ID in key
- Cache without considering data freshness
- Cache entire large objects unnecessarily

### API Response Optimization

✅ **DO:**
- Return only necessary fields
- Use field selection in queries
- Compress responses with gzip
- Implement pagination (default 20-50 items per page)

```typescript
// Good: Return only needed fields
const users = await User.findAll({
  attributes: ['id', 'name', 'mobile', 'email'],
  limit: 20
});

// Good: Gzip compression
app.use(compression());
```

❌ **DON'T:**
- Return all fields to all users
- Return entire related objects without need
- Send unlimited data
- Send uncompressed responses

### Query Optimization

✅ **DO:**
- Use `findAll` with `limit` instead of fetching everything
- Use `raw: true` when you don't need model instances
- Batch related queries together

```typescript
// Good: Raw queries for read-only operations
const results = await sequelize.query(
  'SELECT id, name, price FROM services WHERE shop_id = ?',
  { replacements: [shopId], raw: true }
);

// Good: Batch queries
const [shops, services, barbers] = await Promise.all([
  Shop.findAll({ limit: 50 }),
  Service.findAll({ limit: 100 }),
  Barber.findAll({ limit: 100 })
]);
```

❌ **DON'T:**
- Use `findAll()` without `limit`
- Fetch model instances when you need raw data
- Run sequential queries when you can parallelize

---

## 3. Code Quality Best Practices

### Error Handling

✅ **DO:**
- Use try-catch blocks consistently
- Create custom error classes
- Log errors with context
- Return appropriate HTTP status codes

```typescript
// Good: Custom error class
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

// Good: Error handling
try {
  const user = await User.findByPk(userId);
  if (!user) throw new NotFoundError('User not found');
  return user;
} catch (error) {
  logger.error('User fetch failed', { userId, error });
  throw error;
}
```

❌ **DON'T:**
- Swallow errors silently
- Return generic error messages to users
- Use status 200 for errors
- Log entire error objects (sensitive data)

### Validation

✅ **DO:**
- Use Zod schemas for input validation
- Validate at middleware level
- Include validation errors in response
- Validate business logic constraints

```typescript
// Good: Zod schema validation
import { z } from 'zod';

const appointmentSchema = z.object({
  customer_id: z.string().uuid(),
  shop_id: z.string().uuid(),
  appointment_date: z.string().datetime(),
  services: z.array(z.string().uuid()).min(1),
  payment_mode: z.enum(['CASH', 'ONLINE'])
});

// Good: Validation middleware
router.post('/book-appointment', validateRequest(appointmentSchema), bookAppointment);
```

❌ **DON'T:**
- Skip validation
- Validate only on frontend
- Allow invalid data into database
- Trust user input

### Code Structure

✅ **DO:**
- Follow MVC pattern (Models, Views, Controllers)
- Keep controllers thin (logic in services)
- Use dependency injection
- Write modular, reusable code

```typescript
// Good: Service layer for business logic
class AppointmentService {
  async bookAppointment(data) {
    // Business logic here
  }
}

// Good: Thin controller
appointmentController.post = async (req, res) => {
  const result = await appointmentService.bookAppointment(req.body);
  res.json(result);
};
```

❌ **DON'T:**
- Put business logic in controllers
- Create tightly coupled code
- Duplicate logic across routes
- Mix concerns in one file

---

## 4. Testing Best Practices

✅ **DO:**
- Write unit tests for services
- Write integration tests for API endpoints
- Test error scenarios
- Aim for 80%+ code coverage

```typescript
// Good: Service test
describe('AppointmentService', () => {
  it('should book appointment with valid data', async () => {
    const data = { customer_id: '1', shop_id: '1', ... };
    const result = await appointmentService.bookAppointment(data);
    expect(result.status).toBe('Pending');
  });
  
  it('should reject appointment without services', async () => {
    expect(() => appointmentService.bookAppointment({...}))
      .toThrow(ValidationError);
  });
});
```

❌ **DON'T:**
- Skip testing error cases
- Test only happy paths
- Write tests that depend on execution order
- Test multiple concerns in one test

---

## 5. Logging & Monitoring

✅ **DO:**
- Log errors with full context
- Use structured logging (JSON format)
- Monitor API response times
- Track failed authentications

```typescript
// Good: Structured logging
logger.info('User login', {
  userId: user.id,
  timestamp: new Date(),
  ipAddress: req.ip,
  success: true
});

logger.error('Payment failed', {
  appointmentId: apt.id,
  amount: apt.total_amount,
  error: error.message,
  timestamp: new Date()
});
```

❌ **DON'T:**
- Log sensitive data (passwords, tokens, OTP)
- Use console.log in production
- Log at DEBUG level for production
- Forget to log actual errors

---

## 6. Deployment Best Practices

✅ **DO:**
- Use environment variables for configuration
- Never commit `.env` files
- Use version control for all code
- Automate deployments
- Monitor production logs
- Keep dependencies updated

```bash
# Good: .env file (never commit)
NODE_ENV=production
DB_HOST=prod-db.aws.com
DB_USER=admin
DB_PASS=secure_password
JWT_SECRET=very_long_random_secret
FIREBASE_API_KEY=firebase_key
```

❌ **DON'T:**
- Hardcode credentials
- Deploy without testing
- Use old dependencies
- Skip backups
- Change production data manually

---

## 7. API Design Best Practices

### URL Design

✅ **DO:**
- Use nouns for resources: `/appointments`, `/shops`
- Use HTTP methods correctly (GET, POST, PUT, DELETE)
- Version API: `/api/v1/`
- Use query params for filtering/pagination

```
✅ GET    /api/v1/appointments
✅ POST   /api/v1/appointments
✅ GET    /api/v1/appointments/:id
✅ PUT    /api/v1/appointments/:id
✅ DELETE /api/v1/appointments/:id
✅ GET    /api/v1/appointments?status=Pending&limit=20
```

❌ **DON'T:**
```
❌ GET  /api/getAppointments
❌ POST /api/createAppointment
❌ GET  /api/appointment/delete/123
❌ POST /api/updateUser
```

### Response Format

✅ **DO:**
- Use consistent response structure
- Include appropriate status codes
- Provide meaningful error messages
- Include pagination metadata

```typescript
// Good: Consistent response
{
  success: true,
  code: 200,
  message: "Appointments fetched successfully",
  data: [...],
  pagination: {
    page: 1,
    limit: 20,
    total: 150,
    pages: 8
  }
}

// Good: Error response
{
  success: false,
  code: 400,
  message: "Validation failed",
  errors: [
    { field: "appointment_date", message: "Date must be in future" }
  ]
}
```

---

## 8. Documentation Best Practices

✅ **DO:**
- Document all endpoints with examples
- Maintain updated README
- Use code comments for complex logic
- Document API changes in CHANGELOG

❌ **DON'T:**
- Leave endpoints undocumented
- Write comments for obvious code
- Forget to update docs when changing API
- Use outdated documentation

---

## 9. Database Migration Best Practices

✅ **DO:**
- Create migrations for schema changes
- Test migrations on staging first
- Keep migrations reversible (down/rollback)
- Document migration purpose

❌ **DON'T:**
- Modify schema directly in production
- Run untested migrations
- Delete migrations after running
- Create non-reversible migrations

---

## 10. Dependency Management

✅ **DO:**
- Regular security audits: `npm audit`
- Keep dependencies updated
- Use lock files (package-lock.json)
- Document dependency versions

```bash
# Check for vulnerabilities
npm audit

# Update dependencies safely
npm update

# List outdated packages
npm outdated
```

❌ **DON'T:**
- Use outdated packages
- Ignore security vulnerabilities
- Use exact versions for libraries
- Commit node_modules

---

## Quick Reference: HTTP Status Codes

| Code | When to Use |
|------|-------------|
| **200** | Success - Request succeeded |
| **201** | Created - New resource created |
| **204** | No Content - Success, no response body |
| **400** | Bad Request - Invalid input data |
| **401** | Unauthorized - Authentication required |
| **403** | Forbidden - Authenticated but no permission |
| **404** | Not Found - Resource doesn't exist |
| **409** | Conflict - Data conflict (duplicate) |
| **429** | Too Many Requests - Rate limit exceeded |
| **500** | Server Error - Unexpected server error |
| **503** | Service Unavailable - Temporarily down |

---

## Checklist Before Production Deployment

- [ ] All tests passing
- [ ] Code reviewed and merged
- [ ] Security audit completed
- [ ] Error handling tested
- [ ] Rate limiting enabled
- [ ] CORS configured properly
- [ ] Logging enabled
- [ ] Database backups scheduled
- [ ] Monitoring and alerts set up
- [ ] Environment variables configured
- [ ] HTTPS enabled
- [ ] API documentation updated
- [ ] Performance tested
- [ ] Load testing completed
- [ ] Disaster recovery plan documented

---

## Resources

- [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [REST API Best Practices](https://restfulapi.net/)
- [Express.js Security](https://expressjs.com/en/advanced/best-practice-security.html)
- [Sequelize Documentation](https://sequelize.org/)
