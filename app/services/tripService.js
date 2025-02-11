import { getAuth } from "firebase/auth";
const host = process.env.NEXT_PUBLIC_API_HOST;
const port = process.env.NEXT_PUBLIC_API_PORT;

// สร้าง base URL
const apiBaseUrl = `${host}:${port}`;

const fetchTrips = async () => {
    
    try {
        // กำหนด Token ที่จะส่งใน header
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) throw new Error("User is not logged in");

        const idToken = await user.getIdToken();
        console.log("JWT Token:", idToken);

        const res = await fetch(`${apiBaseUrl}/api/trips`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${idToken}`,
            },
        });

        // console.log('Response Status:', res.status);

        if (!res.ok) {
            throw new Error('Failed to fetch trips');
        }

        const data = await res.json();
        // console.log('Fetched Data:', data);
        return data;
    } catch (error) {
        throw error;  // จับ error และแสดง
    } 
};

// ฟังก์ชันสำหรับบันทึก Trip
const saveTrip = async (idToken, tripData) => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/trips/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}` // ใช้ token ถ้ามี Authentication
        },
        body: JSON.stringify(tripData)
      });
  
      if (!response.ok) {
        throw new Error(`Failed to save trip: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log("Trip Saved:", data);
      return data;
    } catch (error) {
      console.error("Error saving trip:", error);
      throw error;
    }
  };
  
  
  const deleteTrip = async (idToken, tripId) => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/trips/${tripId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`
        }
      });
  
      if (!response.ok) {
        throw new Error(`Failed to delete trip: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log("Trip deleted successfully:", data);
      return data;
    } catch (error) {
      console.error("Error deleting trip:", error);
      throw error;
    }
  };
  
  
  
  const deleteTripService = async (idToken, tripId) => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/trips/${tripId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`
        }
      });
  
      if (!response.ok) {
        throw new Error(`Failed to delete trip: ${response.status} ${response.statusText}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error in deleteTripService:", error);
      throw error;
    }
  };
  
  
  
  
  export { fetchTrips, saveTrip, deleteTrip, deleteTripService };
  