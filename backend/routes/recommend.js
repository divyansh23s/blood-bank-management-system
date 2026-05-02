import express from "express";
const router = express.Router();
import Donor from "../models/donorModel.js";
import calculateScore, { getTopDonors } from "../utils/recommendation.js";

/**
 * GET /api/recommend-donors
 * Recommendation Endpoint for Donors
 *
 * Query Parameters:
 * - bloodGroup (required): Blood group to filter donors (e.g., A+, B-, AB+, O+)
 * - lat (optional): Latitude of hospital/user location
 * - lng (optional): Longitude of hospital/user location
 * - limit (optional): Number of donors to return (default: 5, max: 10)
 *
 * Response:
 * - 200: Array of top recommended donors with scores
 * - 400: Missing or invalid bloodGroup parameter
 * - 404: No donors found for the blood group
 * - 500: Server error
 */
router.get("/recommend-donors", async (req, res) => {
  try {
    // ✅ Validate required parameters
    const { bloodGroup, lat, lng, limit } = req.query;

    if (!bloodGroup) {
      return res.status(400).json({
        error: "Missing required parameter: bloodGroup",
        example: "/api/recommend-donors?bloodGroup=A%2B&lat=40.7128&lng=-74.0060",
      });
    }

    // ✅ Validate blood group format
    const validBloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    if (!validBloodGroups.includes(bloodGroup)) {
      return res.status(400).json({
        error: "Invalid blood group. Valid values: A+, A-, B+, B-, AB+, AB-, O+, O-",
      });
    }

    // ✅ Validate location coordinates if provided
    let userLat = null;
    let userLng = null;

    if (lat && lng) {
      userLat = parseFloat(lat);
      userLng = parseFloat(lng);

      if (isNaN(userLat) || isNaN(userLng)) {
        return res.status(400).json({
          error: "Invalid coordinates. lat and lng must be valid numbers.",
        });
      }

      // ✅ Validate latitude and longitude ranges
      if (userLat < -90 || userLat > 90) {
        return res.status(400).json({
          error: "Invalid latitude. Must be between -90 and 90.",
        });
      }
      if (userLng < -180 || userLng > 180) {
        return res.status(400).json({
          error: "Invalid longitude. Must be between -180 and 180.",
        });
      }
    }

    // ✅ Validate and parse limit
    let resultLimit = 5;
    if (limit) {
      resultLimit = parseInt(limit, 10);
      if (isNaN(resultLimit) || resultLimit < 1 || resultLimit > 10) {
        return res.status(400).json({
          error: "Invalid limit. Must be a number between 1 and 10.",
        });
      }
    }

    // ✅ Query donors by blood group and active status
    const donors = await Donor.find({
      bloodGroup: bloodGroup,
      isActive: true,
    }).lean(); // Use .lean() for faster read-only queries

    if (donors.length === 0) {
      return res.status(404).json({
        message: `No active donors found for blood group: ${bloodGroup}`,
        bloodGroup,
      });
    }

    // ✅ Calculate scores and get top donors
    const recommendedDonors = getTopDonors(donors, userLat, userLng, resultLimit);

    // ✅ Return response with metadata
    res.json({
      success: true,
      bloodGroup,
      totalDonorsMatched: donors.length,
      recommendedCount: recommendedDonors.length,
      location: userLat && userLng ? { lat: userLat, lng: userLng } : null,
      donors: recommendedDonors.map((donor) => ({
        id: donor._id,
        fullName: donor.fullName,
        bloodGroup: donor.bloodGroup,
        age: donor.age,
        score: donor.score,
        address: donor.address,
        phone: donor.phone || "Not provided",
        lastDonationDate: donor.lastDonationDate || "Never donated",
        eligibleToDonate: donor.eligibleToDonate,
      })),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in recommend-donors route:", error);
    res.status(500).json({
      error: "Server error while fetching recommended donors",
      message: error.message,
    });
  }
});

/**
 * GET /api/recommend-donors/health
 * Health check for recommendation system
 */
router.get("/recommend-donors/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "Donor Recommendation System",
    timestamp: new Date().toISOString(),
  });
});

export default router; 