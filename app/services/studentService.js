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
export const updateStudent = async (id, formData) => {
    try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) throw new Error("User is not logged in");

        const idToken = await user.getIdToken();
        const response = await fetch(`${apiBaseUrl}/api/students/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`, // Add Authorization header
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            const result = await response.json();
            return result; // ส่งคืนผลลัพธ์เมื่ออัปเดตสำเร็จ
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update student');
        }
    } catch (error) {
        throw error;
    }
};
