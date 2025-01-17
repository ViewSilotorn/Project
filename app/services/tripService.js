import { getAuth } from "firebase/auth";
const host = process.env.NEXT_PUBLIC_API_HOST;
const port = process.env.NEXT_PUBLIC_API_PORT;

// สร้าง base URL
const apiBaseUrl = `${host}:${port}`;

export const fetchTrips = async () => {
    
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