# AI-Based Donor Recommendation System - Documentation

## Overview

This is a smart donor recommendation system for the Blood Bank Management System (BBMS) that uses a JavaScript-based scoring algorithm to recommend the most suitable donors based on:
- Blood group compatibility
- Donation eligibility
- Age range
- Geographic proximity

---

## 📊 Scoring Formula

The system calculates a recommendation score for each donor based on multiple factors:

### Scoring Breakdown

| Factor | Points | Criteria |
|--------|--------|----------|
| **Active Status** | +20 | Donor is marked as active (`isActive: true`) |
| **Donation Eligibility** | +30 | 90+ days since last donation AND `eligibleToDonate: true` |
| **Age Range** | +10 | Age between 18-50 years |
| **Geographic Proximity** | 0-30 | Based on distance from user location |

### Example Score Calculation

```
Donor Profile:
- isActive: true → +20 points
- lastDonationDate: 120 days ago, eligibleToDonate: true → +30 points
- age: 35 → +10 points
- distance: 2 km → +10 points (30 - 2*10 = 10)

Total Score: 20 + 30 + 10 + 10 = 70
```

### Distance Score Formula

```javascript
Distance Score = max(0, 30 - distance * 10)
```

- **Closer donors** get higher scores
- **Farther donors** get lower scores
- At 3+ km distance, proximity score becomes 0
- Uses Euclidean distance: √((Δlat)² + (Δlng)²)

---

## 🔌 API Endpoint

### GET `/api/recommend-donors`

Get recommended donors for a specific blood group and location.

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `bloodGroup` | String | ✓ Yes | Blood group (A+, A-, B+, B-, AB+, AB-, O+, O-) |
| `lat` | Number | ✗ No | User/Hospital latitude (-90 to 90) |
| `lng` | Number | ✗ No | User/Hospital longitude (-180 to 180) |
| `limit` | Number | ✗ No | Number of donors to return (1-10, default: 5) |

### Examples

#### Example 1: Basic Search (No Location)

```bash
GET /api/recommend-donors?bloodGroup=A%2B
```

**Response:**
```json
{
  "success": true,
  "bloodGroup": "A+",
  "totalDonorsMatched": 25,
  "recommendedCount": 5,
  "location": null,
  "donors": [
    {
      "id": "507f1f77bcf86cd799439011",
      "fullName": "John Doe",
      "bloodGroup": "A+",
      "age": 32,
      "score": 60,
      "address": {
        "city": "New York",
        "state": "NY",
        "pincode": "10001"
      },
      "phone": "+1-555-0123",
      "lastDonationDate": "2025-03-15",
      "eligibleToDonate": true
    },
    {
      "id": "507f1f77bcf86cd799439012",
      "fullName": "Jane Smith",
      "bloodGroup": "A+",
      "age": 28,
      "score": 58,
      "address": {
        "city": "New York",
        "state": "NY",
        "pincode": "10002"
      },
      "phone": "+1-555-0124",
      "lastDonationDate": "2025-02-10",
      "eligibleToDonate": true
    }
    // ... 3 more donors
  ],
  "timestamp": "2025-04-15T10:30:45.123Z"
}
```

#### Example 2: Search with Location

```bash
GET /api/recommend-donors?bloodGroup=O%2B&lat=40.7128&lng=-74.0060&limit=5
```

**Response:**
```json
{
  "success": true,
  "bloodGroup": "O+",
  "totalDonorsMatched": 42,
  "recommendedCount": 5,
  "location": {
    "lat": 40.7128,
    "lng": -74.006
  },
  "donors": [
    {
      "id": "507f1f77bcf86cd799439013",
      "fullName": "Robert Johnson",
      "bloodGroup": "O+",
      "age": 35,
      "score": 87.5,
      "address": {
        "city": "New York",
        "state": "NY",
        "pincode": "10001"
      },
      "phone": "+1-555-0125",
      "lastDonationDate": "2025-02-01",
      "eligibleToDonate": true
    },
    {
      "id": "507f1f77bcf86cd799439014",
      "fullName": "Sarah Williams",
      "bloodGroup": "O+",
      "age": 26,
      "score": 82.3,
      "address": {
        "city": "New York",
        "state": "NY",
        "pincode": "10005"
      },
      "phone": "+1-555-0126",
      "lastDonationDate": "2025-03-10",
      "eligibleToDonate": true
    }
    // ... 3 more donors
  ],
  "timestamp": "2025-04-15T10:35:20.456Z"
}
```

---

## ❌ Error Responses

### 1. Missing Blood Group

**Request:**
```bash
GET /api/recommend-donors
```

**Response (400):**
```json
{
  "error": "Missing required parameter: bloodGroup",
  "example": "/api/recommend-donors?bloodGroup=A%2B&lat=40.7128&lng=-74.0060"
}
```

### 2. Invalid Blood Group

**Request:**
```bash
GET /api/recommend-donors?bloodGroup=Z%2B
```

**Response (400):**
```json
{
  "error": "Invalid blood group. Valid values: A+, A-, B+, B-, AB+, AB-, O+, O-"
}
```

### 3. No Donors Found

**Request:**
```bash
GET /api/recommend-donors?bloodGroup=AB-
```

**Response (404):**
```json
{
  "message": "No active donors found for blood group: AB-",
  "bloodGroup": "AB-"
}
```

### 4. Invalid Coordinates

**Request:**
```bash
GET /api/recommend-donors?bloodGroup=A%2B&lat=invalid&lng=-74.0060
```

**Response (400):**
```json
{
  "error": "Invalid coordinates. lat and lng must be valid numbers."
}
```

### 5. Invalid Latitude

**Request:**
```bash
GET /api/recommend-donors?bloodGroup=A%2B&lat=95&lng=-74.0060
```

**Response (400):**
```json
{
  "error": "Invalid latitude. Must be between -90 and 90."
}
```

### 6. Server Error

**Response (500):**
```json
{
  "error": "Server error while fetching recommended donors",
  "message": "Database connection failed"
}
```

---

## 🚀 Integration Guide

### Frontend Integration

#### 1. Import Component
```javascript
import DonorRecommendationSystem from './components/DonorRecommendationSystem';

function App() {
  return (
    <div>
      <DonorRecommendationSystem />
    </div>
  );
}
```

#### 2. Add to Routes (React Router)
```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DonorRecommendationSystem from './components/DonorRecommendationSystem';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/donors/recommend" element={<DonorRecommendationSystem />} />
      </Routes>
    </BrowserRouter>
  );
}
```

#### 3. Custom API Call
```javascript
import axios from 'axios';

async function getRecommendedDonors(bloodGroup, lat, lng) {
  try {
    const response = await axios.get('http://localhost:5001/api/recommend-donors', {
      params: {
        bloodGroup,
        lat,
        lng,
        limit: 5
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching donors:', error);
    throw error;
  }
}

// Usage
const donors = await getRecommendedDonors('A+', 40.7128, -74.0060);
console.log(donors.donors); // Array of recommended donors
```

### Backend Integration

#### 1. Verify Route is Registered (server.js)
```javascript
import recommendRoutes from "./routes/recommend.js";
app.use("/api", recommendRoutes);
```

#### 2. Using Recommendation Utility Directly
```javascript
import calculateScore from './utils/recommendation.js';
import { getTopDonors } from './utils/recommendation.js';

// Calculate score for a single donor
const score = calculateScore(donor, 40.7128, -74.0060);

// Get top donors from array
const topDonors = getTopDonors(donorsArray, 40.7128, -74.0060, 5);
```

---

## 📱 Frontend Component Features

- ✅ Blood group selection (8 types)
- ✅ Geolocation API integration
- ✅ Manual coordinate input
- ✅ Real-time search
- ✅ Error handling
- ✅ Score visualization
- ✅ Loading states
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Donor card display with:
  - Full name and score
  - Age and eligibility status
  - Last donation date
  - Contact information
  - Address
  - Star rating based on score

---

## ⚙️ Configuration

### Score Multipliers

Adjust scoring in `utils/recommendation.js`:

```javascript
// Change active donor bonus
if (donor.isActive) score += 20; // Increase/decrease as needed

// Change eligibility bonus
if (daysSinceLastDonation >= 90) score += 30;

// Change age bonus
if (donor.age >= 18 && donor.age <= 50) score += 10;

// Change distance multiplier
const distanceScore = Math.max(0, 30 - distance * 10); // Adjust multiplier
```

### API Limits

```javascript
// In routes/recommend.js
let resultLimit = 5; // Default donors to return
if (resultLimit < 1 || resultLimit > 10) { } // Max 10 donors
```

---

## 🧪 Testing

### Test Case 1: Active Eligible Young Donor Nearby
```
Score: 80+ (Excellent)
Active + Eligible + Young + Nearby
```

### Test Case 2: Active but Not Eligible
```
Score: 20-40 (Low)
Active but hasn't waited 90 days
```

### Test Case 3: Eligible but Inactive
```
Score: 30-40 (Low)
Eligible but marked inactive
```

### Test Case 4: New Donor (Never Donated)
```
Score: 50+ (Good)
No donation history but meets other criteria
```

---

## 📋 Donor Model Fields Required

Ensure your Donor model has these fields:

```javascript
{
  fullName: String,
  bloodGroup: String, // A+, A-, B+, B-, AB+, AB-, O+, O-
  age: Number,
  lastDonationDate: Date, // null for new donors
  eligibleToDonate: Boolean,
  isActive: Boolean,
  address: {
    city: String,
    state: String,
    pincode: String
  },
  location: {
    lat: Number,
    lng: Number
  },
  phone: String
}
```

---

## 🔒 Security & Best Practices

1. **Input Validation**: All query parameters are validated
2. **Error Handling**: Graceful error messages for invalid input
3. **Rate Limiting**: Consider adding rate limiting for production
4. **CORS**: Ensure CORS is properly configured
5. **Database Indexes**: Index `bloodGroup` and `isActive` fields for performance
6. **Lean Queries**: Use `.lean()` for read-only queries to improve performance

---

## 📊 Performance Optimization

### Database Indexes

```javascript
// In your Donor model
donorSchema.index({ bloodGroup: 1, isActive: 1 });
```

### Query Optimization

The system uses `.lean()` to return plain JavaScript objects instead of Mongoose documents, which improves query performance by ~5-10x for read-only operations.

---

## 🐛 Troubleshooting

### Issue: All donors getting same score

**Solution**: Ensure donor documents have diverse `lastDonationDate`, `age`, and `location` values.

### Issue: Distance score always 0

**Solution**: Verify donor documents have `location.lat` and `location.lng` fields populated.

### Issue: Geolocation not working

**Solution**: Check browser permissions and ensure HTTPS in production.

### Issue: No donors returned

**Solution**: 
1. Check if donors with the blood group exist
2. Verify donors have `isActive: true`
3. Check database connection

---

## 📚 Further Enhancements

- Add machine learning for better scoring
- Implement machine learning for donation success prediction
- Add donor preferences and matching
- Implement real-time notifications
- Add donation history analytics
- Create admin dashboard for score tuning

---

## 📞 Support

For issues or questions, contact the development team or create an issue in the repository.

**Last Updated**: April 2025  
**Version**: 1.0.0