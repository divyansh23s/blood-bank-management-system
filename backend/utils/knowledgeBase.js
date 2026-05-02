// BBMS Knowledge Base for RAG Architecture
// This file contains all the information about the Blood Bank Management System
// that the chatbot will use to answer user questions

export const knowledgeBase = [
  {
    id: 1,
    category: "registration",
    title: "Donor Registration",
    content: `To register as a donor in BBMS:
1. Go to the registration page at /register/donor
2. Fill in your personal details: full name, email, phone number
3. Provide your blood group (A+, A-, B+, B-, AB+, AB-, O+, O-)
4. Enter your age (must be between 18-65 years)
5. Provide gender information
6. Enter your weight (must be at least 40kg)
7. Provide your complete address
8. Submit the form to create your donor account
9. After registration, you can login at /login with your email and password`
  },
  {
    id: 2,
    category: "registration",
    title: "Facility Registration (Hospital/Blood Lab)",
    content: `To register a facility (hospital or blood lab) in BBMS:
1. Go to /register/facility
2. Select the facility type (Hospital or Blood Lab)
3. Enter facility name, email, and phone
4. Provide the complete address
5. Enter the registration number
6. Submit for admin approval
7. Wait for admin to approve your facility
8. Once approved, you can login at /login`
  },
  {
    id: 3,
    category: "authentication",
    title: "Login Process",
    content: `To login to BBMS:
1. Go to /login page
2. Enter your email address
3. Enter your password
4. Click the login button
5. You will be redirected to your role-based dashboard
6. Supported roles: Donor, Hospital, Blood Lab, Admin`
  },
  {
    id: 4,
    category: "donation",
    title: "Blood Donation Eligibility",
    content: `Blood donation eligibility criteria in BBMS:
- Age: Must be between 18 and 65 years
- Weight: Must be at least 40 kg
- Health: Must be in good health
- Donation cooldown: Must wait 90 days between donations
- The system automatically calculates eligibility using the 'isEligible' virtual field
- Donors with certain medical conditions may be temporarily ineligible`
  },
  {
    id: 5,
    category: "donation",
    title: "Donor Dashboard Features",
    content: `The Donor Dashboard (/donor) provides:
1. Overview of your donor profile
2. View and edit your profile information
3. Browse upcoming blood donation camps
4. View your donation history
5. Check your donation eligibility status
6. See your blood group and donation count`
  },
  {
    id: 6,
    category: "donation",
    title: "Blood Donation Camps",
    content: `Blood donation camps in BBMS:
1. Blood labs can create blood donation camps
2. Camps have: hospital, location, date, and capacity
3. Donors can browse available camps at /donor/camps
4. Donors can register for camps
5. Camps have limited capacity
6. Labs manage registered donors at /lab/camps`
  },
  {
    id: 7,
    category: "hospital",
    title: "Hospital Blood Request",
    content: `How hospitals can request blood:
1. Login as a hospital/facility
2. Go to /hospital/blood-request-create
3. Select the blood type needed
4. Specify the number of units required
5. Submit the blood request
6. Track request status at /hospital/blood-request-history
7. Status options: pending, approved, rejected
8. Approved requests are fulfilled by blood labs`
  },
  {
    id: 8,
    category: "hospital",
    title: "Hospital Dashboard Features",
    content: `The Hospital Dashboard (/hospital) provides:
1. Create new blood requests
2. View blood request history and status
3. Check current blood inventory
4. Browse the donor directory
5. Search donors by blood group
6. View approved blood requests`
  },
  {
    id: 9,
    category: "hospital",
    title: "Hospital Blood Inventory",
    content: `Hospital blood inventory management:
1. View current blood stock at /hospital/inventory
2. See available blood groups and quantities
3. Track blood expiry dates
4. Monitor blood usage
5. Inventory is updated when requests are approved`
  },
  {
    id: 10,
    category: "blood_lab",
    title: "Blood Lab Dashboard Features",
    content: `The Blood Lab Dashboard (/lab) provides:
1. View and manage blood inventory
2. Create and manage blood donation camps
3. Handle blood requests from hospitals
4. Manage donor information
5. View and update lab profile
6. Process pending requests at /lab/requests`
  },
  {
    id: 11,
    category: "blood_lab",
    title: "Blood Lab Request Management",
    content: `How blood labs handle requests:
1. View pending requests at /lab/requests
2. See hospital details and blood requirements
3. Approve or reject blood requests
4. Approved requests reduce lab inventory
5. Rejected requests notify the hospital
6. Track all request history`
  },
  {
    id: 12,
    category: "blood_lab",
    title: "Blood Stock Management",
    content: `Blood stock management for labs:
1. View all blood inventory at /lab/inventory
2. See blood groups: A+, A-, B+, B-, AB+, AB-, O+, O-
3. Track quantity in units
4. Monitor expiry dates
5. Add new blood units to inventory
6. Remove expired blood units`
  },
  {
    id: 13,
    category: "admin",
    title: "Admin Dashboard Features",
    content: `The Admin Dashboard (/admin) provides:
1. View all registered facilities
2. Approve or reject facility registrations
3. View all registered donors
4. Manage facility accounts
5. Verify hospital and blood lab credentials
6. Monitor system activity`
  },
  {
    id: 14,
    category: "admin",
    title: "Facility Verification",
    content: `Admin facility verification process:
1. Go to /admin/verification
2. View pending facility registrations
3. Review facility details (name, registration number, address)
4. Approve legitimate facilities
5. Reject invalid or duplicate registrations
6. Approved facilities can then login`
  },
  {
    id: 15,
    category: "recommendation",
    title: "Donor Recommendation System",
    content: `BBMS Donor Recommendation System:
1. Hospitals can find compatible donors
2. System uses scoring algorithm to rank donors
3. Scoring factors:
   - Active status: +20 points
   - Donation eligibility (90-day cooldown): +30 points
   - Age 18-50: +10 points
   - Proximity to hospital: 0-30 points
4. Returns top 5 recommended donors
5. API endpoint: /api/recommend-donors?bloodGroup=A+&lat=X&lng=Y`
  },
  {
    id: 16,
    category: "technical",
    title: "API Endpoints",
    content: `BBMS API Endpoints:
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user
- GET /api/donor/profile - Get donor profile
- PUT /api/donor/profile - Update donor profile
- GET /api/donor/camps - Get available camps
- POST /api/hospital/blood/request - Create blood request
- GET /api/hospital/blood/requests - Get hospital requests
- GET /api/blood-lab/blood/requests - Get lab requests
- PUT /api/blood-lab/blood/requests/:id - Respond to request
- GET /api/blood-lab/inventory - Get lab blood inventory
- POST /api/blood-lab/camps - Create blood camp
- GET /api/admin/facilities - Get all facilities
- PUT /api/admin/facilities/:id - Update facility status
- GET /api/recommend-donors - Get recommended donors`
  },
  {
    id: 17,
    category: "technical",
    title: "Authentication & Security",
    content: `BBMS Authentication & Security:
- JWT (JSON Web Token) based authentication
- Tokens stored in Authorization header: Bearer <token>
- Passwords hashed using bcrypt
- Minimum password length: 6 characters
- Role-based access control (RBAC)
- Protected routes require valid JWT
- Token validation checks expiration`
  },
  {
    id: 18,
    category: "technical",
    title: "Data Models",
    content: `BBMS Data Models:
- Donor: fullName, email, phone, bloodGroup, age, gender, weight, address, donationHistory
- Facility: name, email, address, registrationNumber, type (hospital/lab), status
- Blood: bloodGroup, quantity, expiryDate, bloodLab/hospital reference
- BloodRequest: hospitalId, labId, bloodType, units, status (pending/approved/rejected)
- BloodCamp: hospital, location, date, capacity, registeredDonors
- Admin: name, email, role, lastLogin`
  },
  {
    id: 19,
    category: "general",
    title: "System Overview",
    content: `Blood Bank Management System (BBMS):
BBMS is a comprehensive platform for managing blood donations, hospital requests, and inventory. It connects donors, hospitals, blood labs, and administrators in one unified system. The goal is to ensure quick response times during emergencies, reduce manual errors, and improve operational workflow for blood bank operations.`
  },
  {
    id: 20,
    category: "general",
    title: "Contact & Support",
    content: `For support in BBMS:
1. Visit the contact page at /contact
2. Fill in your name, email, and message
3. Submit the form
4. The admin team will respond to your inquiry
5. For urgent matters, contact the blood bank directly by phone`
  }
];

// Simple text-based search for relevant context
export function getRelevantContext(query) {
  const queryLower = query.toLowerCase();
  const relevantDocs = [];
  
  // Score each document based on keyword matching
  for (const doc of knowledgeBase) {
    let score = 0;
    const contentLower = doc.content.toLowerCase();
    const titleLower = doc.title.toLowerCase();
    
    // Check for category match
    if (queryLower.includes(doc.category)) {
      score += 5;
    }
    
    // Check for title keywords
    const titleWords = titleLower.split(' ');
    for (const word of titleWords) {
      if (word.length > 3 && queryLower.includes(word)) {
        score += 3;
      }
    }
    
    // Check for content keywords
    const importantTerms = ['register', 'login', 'donate', 'blood', 'request', 'camp', 'eligibility', 'dashboard', 'admin', 'hospital', 'lab', 'donor'];
    for (const term of importantTerms) {
      if (queryLower.includes(term) && contentLower.includes(term)) {
        score += 2;
      }
    }
    
    if (score > 0) {
      relevantDocs.push({ ...doc, score });
    }
  }
  
  // Sort by score and return top 3-5 relevant documents
  relevantDocs.sort((a, b) => b.score - a.score);
  return relevantDocs.slice(0, 4).map(doc => doc.content).join('\n\n');
}

export default knowledgeBase;