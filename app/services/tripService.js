import { getAuth } from "firebase/auth";

const API_BASE_URL = 'http://192.168.3.251:8080'; 

export const fetchTrips = async () => {
    
    try {
        // กำหนด Token ที่จะส่งใน header
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) throw new Error("User is not logged in");

        const idToken = await user.getIdToken();
        console.log("JWT Token:", idToken);

        const res = await fetch(`${API_BASE_URL}/api/trips`, {
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