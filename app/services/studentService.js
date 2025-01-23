import { getAuth } from "firebase/auth";

const host = process.env.NEXT_PUBLIC_API_HOST;
const port = process.env.NEXT_PUBLIC_API_PORT;

// สร้าง base URL
const apiBaseUrl = `${host}:${port}`;

export const fetchStudents = async (currentPage) => {
    try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) throw new Error("User is not logged in");

        const idToken = await user.getIdToken();
        console.log("JWT Token:", idToken);

        const response = await fetch(`${apiBaseUrl}/api/students/page/${currentPage}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${idToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch students');
        }

        const data = await response.json();
        return data; // Return the data to the caller
    } catch (error) {
        console.error(error);
        throw error; // Re-throw error to handle in the calling component
    }
};

// ฟังก์ชันสำหรับการดึงข้อมูลนักเรียนตาม ID
export const getStudentById = async (id) => {
    try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) throw new Error("User is not logged in");

        const idToken = await user.getIdToken();
        const response = await fetch(`${apiBaseUrl}/api/students/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${idToken}`, // Add Authorization header
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch student data');
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};

// ฟังก์ชันสำหรับการอัปเดตข้อมูลนักเรียน
export const updateDataById = async (id, formData) => {

    console.log(id);
    console.log(formData);


    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) throw new Error("User is not logged in");

    const idToken = await user.getIdToken();
    const response = await fetch(`${apiBaseUrl}/api/students/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify(formData),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch students');
    }
    return await response.json();
};


//delete checkbox
export const deleteStudents = async (id) => {
    try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) throw new Error("User is not logged in");

        const idToken = await user.getIdToken();
        const response = await fetch(`${apiBaseUrl}/api/students/${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${idToken}`,
            },
            body: JSON.stringify({ id }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to delete students");
        }
        
        return await response.json();
    
    } catch (error) {
        console.error("Error in deleteStudents service:", error);
        throw error;
    }
}