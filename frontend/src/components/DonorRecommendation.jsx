import { useState } from "react";
import axios from "axios";

export default function DonorRecommendation() {
  const [bloodGroup, setBloodGroup] = useState("");
  const [donors, setDonors] = useState([]);

  const fetchDonors = async () => {
    const res = await axios.get(
      `http://localhost:5001/api/recommend-donors`,
      {
        params: {
          bloodGroup,
          lat: 28.6139,  // Delhi coords (you can make dynamic later)
          lng: 77.2090,
        },
      }
    );

    setDonors(res.data);
  };

  return (
    <div>
      <h2>Find Donors</h2>

      <input
        placeholder="Enter Blood Group"
        value={bloodGroup}
        onChange={(e) => setBloodGroup(e.target.value)}
      />

      <button onClick={fetchDonors}>Search</button>

      <ul>
        {donors.map((d) => (
          <li key={d._id}>
            {d.name} - Score: {d.score.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
}