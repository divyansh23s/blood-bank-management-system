import { useState } from "react";
import axios from "axios";
import { Loader, AlertCircle, CheckCircle, MapPin, Phone, Droplet, Calendar } from "lucide-react";

const DonorRecommendationSystem = () => {
  const [bloodGroup, setBloodGroup] = useState("A+");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [donors, setDonors] = useState([]);
  const [metadata, setMetadata] = useState(null);

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  // Get current user location using Geolocation API
  const handleGetCurrentLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toString());
        setLongitude(position.coords.longitude.toString());
        setUseCurrentLocation(true);
        setError(null);
        setLoading(false);
      },
      (err) => {
        setError(`Unable to get location: ${err.message}`);
        setLoading(false);
      }
    );
  };

  // Fetch recommended donors from API
  const handleSearchDonors = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    setDonors([]);
    setMetadata(null);

    try {
      // Build query parameters
      let url = `http://localhost:5001/api/recommend-donors?bloodGroup=${encodeURIComponent(bloodGroup)}`;

      if (latitude && longitude) {
        url += `&lat=${encodeURIComponent(latitude)}&lng=${encodeURIComponent(longitude)}`;
      }

      const response = await axios.get(url);
      const data = response.data;

      if (data.success) {
        setDonors(data.donors);
        setMetadata({
          totalMatched: data.totalDonorsMatched,
          recommended: data.recommendedCount,
          location: data.location,
        });
        setSuccess(
          `Found ${data.recommendedCount} recommended donors out of ${data.totalDonorsMatched} available donors`
        );
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch recommended donors";
      setError(errorMessage);
      setDonors([]);
    } finally {
      setLoading(false);
    }
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString || dateString === "Never donated") return dateString;
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get score color based on score value
  const getScoreColor = (score) => {
    if (score >= 80) return "bg-green-100 text-green-800 border-green-300";
    if (score >= 60) return "bg-blue-100 text-blue-800 border-blue-300";
    if (score >= 40) return "bg-yellow-100 text-yellow-800 border-yellow-300";
    return "bg-orange-100 text-orange-800 border-orange-300";
  };

  const getScoreBadge = (score) => {
    if (score >= 80) return "⭐⭐⭐";
    if (score >= 60) return "⭐⭐";
    if (score >= 40) return "⭐";
    return "◆";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-red-700 mb-2">
            🩸 Blood Donor Recommendation System
          </h1>
          <p className="text-gray-600">
            Find compatible and nearby donors based on blood group and location
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-red-100">
          <form onSubmit={handleSearchDonors} className="space-y-6">
            {/* Blood Group Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select Blood Group <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {bloodGroups.map((bg) => (
                  <button
                    key={bg}
                    type="button"
                    onClick={() => setBloodGroup(bg)}
                    className={`py-2 px-3 rounded-lg font-semibold transition-all ${
                      bloodGroup === bg
                        ? "bg-red-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>

            {/* Location Section */}
            <div className="border-t pt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Location (Optional)
              </label>
              <div className="space-y-4">
                {/* Current Location Button */}
                <button
                  type="button"
                  onClick={handleGetCurrentLocation}
                  disabled={loading}
                  className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <MapPin size={18} />
                  {useCurrentLocation ? "✓ Using Current Location" : "Use My Current Location"}
                </button>

                {/* Manual Location Input */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Latitude"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    step="0.000001"
                    disabled={useCurrentLocation && latitude}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <input
                    type="number"
                    placeholder="Longitude"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    step="0.000001"
                    disabled={useCurrentLocation && longitude}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Searching Donors...
                </>
              ) : (
                <>
                  <Droplet size={18} />
                  Search Recommended Donors
                </>
              )}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-8 flex items-start gap-3">
            <AlertCircle className="text-red-500 flex-shrink-0 mt-1" size={20} />
            <div>
              <p className="font-semibold text-red-800">Error</p>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg mb-8 flex items-start gap-3">
            <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
            <div>
              <p className="font-semibold text-green-800">Success</p>
              <p className="text-green-700">{success}</p>
            </div>
          </div>
        )}

        {/* Metadata */}
        {metadata && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-8">
            <p className="text-blue-900">
              <span className="font-semibold">Blood Group:</span> {bloodGroup} |{" "}
              <span className="font-semibold">Total Donors:</span> {metadata.totalMatched}
              {metadata.location && (
                <>
                  {" "}
                  | <span className="font-semibold">Your Location:</span> (
                  {metadata.location.lat.toFixed(4)}, {metadata.location.lng.toFixed(4)})
                </>
              )}
            </p>
          </div>
        )}

        {/* Donors List */}
        {donors.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Recommended Donors ({donors.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {donors.map((donor, index) => (
                <div
                  key={donor.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all border-l-4 border-red-500 overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 border-b border-red-200">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">
                          #{index + 1}. {donor.fullName}
                        </h3>
                        <p className="text-sm text-gray-600">Blood Group: {donor.bloodGroup}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(donor.score)}`}>
                        {donor.score}
                      </span>
                    </div>
                    <div className="text-yellow-500 text-lg">{getScoreBadge(donor.score)}</div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-3">
                    {/* Age */}
                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="text-sm font-semibold">Age:</span>
                      <span className="text-sm">{donor.age} years</span>
                    </div>

                    {/* Eligible Status */}
                    <div className="flex items-center gap-2">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                        donor.eligibleToDonate
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {donor.eligibleToDonate ? "✓ Eligible" : "⊘ Not Eligible"}
                      </span>
                    </div>

                    {/* Last Donation */}
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar size={16} className="text-red-500" />
                      <span className="text-sm">
                        <span className="font-semibold">Last Donation:</span> {formatDate(donor.lastDonationDate)}
                      </span>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone size={16} className="text-red-500" />
                      <span className="text-sm">{donor.phone}</span>
                    </div>

                    {/* Address */}
                    <div className="flex items-start gap-2 text-gray-700">
                      <MapPin size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">
                        {donor.address?.city}, {donor.address?.state} {donor.address?.pincode}
                      </span>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                    <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition-all text-sm">
                      Contact Donor
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && donors.length === 0 && (metadata || success) && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Droplet size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 text-lg">No donors found. Try a different blood group or location.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorRecommendationSystem;
