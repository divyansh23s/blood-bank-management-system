# Quick Start Guide - Donor Recommendation System

## ✅ What's Already Done

Your AI-based donor recommendation system is ready with:

1. **Backend API** (`/api/recommend-donors`)
   - Smart scoring algorithm
   - Location-based ranking
   - Full validation and error handling
   - Performance optimized with `.lean()` queries

2. **Frontend Component** (`DonorRecommendationSystem.jsx`)
   - Blood group selector
   - Geolocation integration
   - Beautiful UI with Tailwind CSS
   - Real-time donor listings

3. **Documentation**
   - Complete scoring formula
   - API examples and error responses
   - Integration guides
   - Testing instructions

---

## 🚀 How to Use

### 1. Start Your Backend
```bash
cd backend
npm start
```
Server runs on `http://localhost:5001`

### 2. Start Your Frontend
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5173` or `5174`

### 3. Access the Component

#### Option A: Via React Router
Add this to your `App.jsx`:
```javascript
import DonorRecommendationSystem from './components/DonorRecommendationSystem';

<Route path="/donors/recommend" element={<DonorRecommendationSystem />} />
```

Then visit: `http://localhost:5173/donors/recommend`

#### Option B: Direct Import
```javascript
import DonorRecommendationSystem from './components/DonorRecommendationSystem';

<DonorRecommendationSystem />
```

---

## 📊 Scoring Breakdown

| Factor | Points |
|--------|--------|
| Active Donor | +20 |
| Eligible to Donate | +30 |
| Age 18-50 | +10 |
| Near Location | 0-30 |
| **Total Max** | **90** |

---

## 🔍 Example API Calls

### Get Donors (No Location)
```bash
curl "http://localhost:5001/api/recommend-donors?bloodGroup=A%2B"
```

### Get Donors (With Location)
```bash
curl "http://localhost:5001/api/recommend-donors?bloodGroup=O%2B&lat=40.7128&lng=-74.0060"
```

### Get Top 3 Donors
```bash
curl "http://localhost:5001/api/recommend-donors?bloodGroup=B%2B&lat=40.7128&lng=-74.0060&limit=3"
```

---

## 🎯 Features

✅ **Smart Scoring**
- Considers eligibility, activity, age, and proximity
- Dynamic calculation (not stored in DB)

✅ **Geolocation**
- Browser geolocation API integration
- Manual coordinate input option
- Validates latitude (-90 to 90) and longitude (-180 to 180)

✅ **Error Handling**
- Invalid blood groups
- Missing required parameters
- Coordinate validation
- Database errors

✅ **Responsive Design**
- Mobile-first approach
- Works on desktop, tablet, phone

✅ **Performance**
- Optimized database queries
- Lean queries for read-only operations
- Efficient distance calculations

---

## 📁 File Structure

```
backend/
├── utils/
│   └── recommendation.js         ← Scoring logic & functions
├── routes/
│   └── recommend.js              ← API endpoints
├── controllers/
│   └── (uses routes directly)
└── server.js                     ← Route registration

frontend/
├── src/components/
│   └── DonorRecommendationSystem.jsx  ← Main component
└── src/utils/
    └── chatbot.js                ← (Existing API service)
```

---

## 💡 Use Cases

### 1. Hospital Emergency Request
```
1. Hospital needs O+ blood urgently
2. Uses geolocation to find nearby donors
3. Gets top 5 recommended donors sorted by score
4. Calls donors based on ranking
```

### 2. Blood Camp Organization
```
1. Blood camp at specific location
2. Queries for all blood groups
3. Identifies eligible donors nearby
4. Sends invitations to highest-scoring donors
```

### 3. Donor Recruitment
```
1. NGO wants to recruit new O- donors
2. Searches for O- blood group
3. Gets all active O- donors
4. Plans recruitment campaign based on location
```

---

## 🔧 Customization

### Change Max Donors Returned
In `frontend/src/components/DonorRecommendationSystem.jsx`:
```javascript
if (isNaN(resultLimit) || resultLimit < 1 || resultLimit > 10) {
  // Change 10 to your desired max
}
```

### Adjust Scoring Weights
In `backend/utils/recommendation.js`:
```javascript
// Increase active status importance
if (donor.isActive) score += 30; // was 20

// Increase distance importance
const distanceScore = Math.max(0, 40 - distance * 10); // was 30
```

### Change Default Results
In `frontend/src/components/DonorRecommendationSystem.jsx`:
```javascript
let resultLimit = 5; // Change to your preferred default
```

---

## ⚠️ Important Notes

1. **Database Indexes**: For production, add index on `bloodGroup` and `isActive`:
```javascript
donorSchema.index({ bloodGroup: 1, isActive: 1 });
```

2. **CORS**: Ensure backend CORS allows frontend URL

3. **Location Data**: Donors need `location.lat` and `location.lng` for proximity scoring

4. **Date Format**: Ensure `lastDonationDate` is in ISO format

5. **Validation**: All inputs are validated on backend

---

## 🧪 Testing Checklist

- [ ] Search without location (shows all blood group donors)
- [ ] Search with location (shows nearby donors first)
- [ ] Try all 8 blood groups
- [ ] Test geolocation permission
- [ ] Test manual coordinate entry
- [ ] Test invalid blood group
- [ ] Test out-of-range coordinates
- [ ] Verify scoring order (highest first)
- [ ] Check error messages display correctly
- [ ] Test mobile responsiveness

---

## 📊 Expected Response

```json
{
  "success": true,
  "bloodGroup": "A+",
  "totalDonorsMatched": 25,
  "recommendedCount": 5,
  "location": null,
  "donors": [
    {
      "id": "...",
      "fullName": "John Doe",
      "bloodGroup": "A+",
      "age": 32,
      "score": 85.5,
      "address": {...},
      "phone": "...",
      "lastDonationDate": "2025-03-15",
      "eligibleToDonate": true
    }
    // ... 4 more
  ],
  "timestamp": "2025-04-15T10:30:45.123Z"
}
```

---

## 🔗 Related Files

- Full Documentation: `DONOR_RECOMMENDATION_DOCS.md`
- Scoring Algorithm: `backend/utils/recommendation.js`
- API Routes: `backend/routes/recommend.js`
- Frontend Component: `frontend/src/components/DonorRecommendationSystem.jsx`

---

## 📞 Troubleshooting

**Q: Getting "No active donors" error?**  
A: Check if donors have `isActive: true` in database

**Q: Scores always the same?**  
A: Donors need varied `age`, `lastDonationDate`, and `location` values

**Q: Geolocation not working?**  
A: Check browser permissions and ensure HTTPS in production

**Q: CORS error?**  
A: Verify backend CORS configuration includes your frontend URL

---

## ✨ Next Steps

1. ✅ Backend API is ready
2. ✅ Frontend component is ready
3. 🔄 Add to your navigation menu
4. 🔄 Integrate with hospital/admin dashboards
5. 🔄 Add authentication if needed
6. 🔄 Monitor and optimize based on usage

---

**Everything is ready to go! Just integrate and test.** 🎉