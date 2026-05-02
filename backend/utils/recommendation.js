
/**
 * Calculate a recommendation score for a donor based on multiple factors
 * @param {Object} donor - Donor document from MongoDB
 * @param {number} userLat - User/Hospital latitude
 * @param {number} userLng - User/Hospital longitude
 * @returns {number} Total score (0-100+)
 */
function calculateScore(donor, userLat, userLng) {
  let score = 0;

  // ✅ Factor 1: Active Status (+20 points)
  // Active donors are more reliable and likely to donate again
  if (donor.isActive) {
    score += 20;
  }

  // ✅ Factor 2: Donation Eligibility (+30 points)
  // Donors who haven't donated in 90 days are eligible and more likely to donate
  if (donor.lastDonationDate && donor.eligibleToDonate) {
    const daysSinceLastDonation = 
      (Date.now() - new Date(donor.lastDonationDate)) / (1000 * 60 * 60 * 24);
    
    if (daysSinceLastDonation >= 90) {
      score += 30;
    }
  } else if (!donor.lastDonationDate && donor.eligibleToDonate) {
    // New donors with no donation history
    score += 30;
  }

  // ✅ Factor 3: Age Range (+10 points)
  // Donors aged 18-50 are considered optimal for blood donation
  if (donor.age >= 18 && donor.age <= 50) {
    score += 10;
  }

  // ✅ Factor 4: Geographic Proximity (0-30 points)
  // Closer donors get higher scores using Euclidean distance
  // Score decreases with distance: score += max(0, 30 - distance * 10)
  if (donor.location && userLat && userLng) {
    try {
      const lat = parseFloat(donor.location.lat);
      const lng = parseFloat(donor.location.lng);
      const uLat = parseFloat(userLat);
      const uLng = parseFloat(userLng);

      if (!isNaN(lat) && !isNaN(lng) && !isNaN(uLat) && !isNaN(uLng)) {
        // Euclidean distance formula
        const distance = Math.sqrt(
          Math.pow(lat - uLat, 2) + Math.pow(lng - uLng, 2)
        );

        // Distance score: max 30 points, decreases as distance increases
        const distanceScore = Math.max(0, 30 - distance * 10);
        score += distanceScore;
      }
    } catch (error) {
      console.warn("Error calculating distance score:", error.message);
    }
  }

  return Math.round(score * 10) / 10; // Round to 1 decimal place
}

/**
 * Get recommended donors for a specific blood group and location
 * @param {Array} donors - Array of donor documents
 * @param {number} userLat - User/Hospital latitude
 * @param {number} userLng - User/Hospital longitude
 * @param {number} limit - Number of top donors to return (default: 5)
 * @returns {Array} Top donors sorted by score
 */
export function getTopDonors(donors, userLat, userLng, limit = 5) {
  const scored = donors.map((donor) => ({
    ...donor,
    score: calculateScore(donor, userLat, userLng),
  }));

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export default calculateScore;