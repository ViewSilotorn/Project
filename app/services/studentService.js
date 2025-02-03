import { getAuth } from "firebase/auth";

const host = process.env.NEXT_PUBLIC_API_HOST;
const port = process.env.NEXT_PUBLIC_API_PORT;

// สร้าง base URL
const apiBaseUrl = `${host}:${port}`;

//get students
export const fetchStudents = async (currentPage) => {
    try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) throw new Error("User is not logged in");

        const idToken = await user.getIdToken();
        // console.log("JWT Token:", idToken);

        const response = await fetch(`${apiBaseUrl}/api/students/page/${currentPage}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${idToken}`,
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

export const fetchStudentBatchData = async (idToken, coordinates) => {
    try {
      // สร้าง URL
      const url = `${apiBaseUrl}/api/students/lnglat/batch`;
  
      // เรียก API ด้วย fetch
      const response = await fetch(url, {
        method: 'POST', // ใช้ POST method
        headers: {
          'Authorization': `Bearer ${idToken}`, // เพิ่ม Bearer token ใน headers
        },
        body: JSON.stringify(coordinates), // ส่งพิกัดหลายชุดใน body
      });
  
      // ตรวจสอบสถานะการตอบกลับ
      if (!response.ok) {
        // หากไม่สำเร็จ ขว้างข้อผิดพลาดพร้อมสถานะ
        const errorText = await response.text();
        throw new Error(`Failed to fetch data from API (status: ${response.status}): ${errorText}`);
      }
  
      // แปลง response เป็น JSON
      const data = await response.json();
      return data; // ส่งข้อมูลที่ได้กลับไป
    } catch (error) {
      // ดักจับข้อผิดพลาดที่เกิดขึ้น
      console.error("Error fetching batch student data: ", error);
      throw error; // ขว้างข้อผิดพลาดออกไปเพื่อให้ caller จัดการ
    }
  };

export const createBatchStudents = async (students) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) throw new Error("User is not logged in");

    const idToken = await user.getIdToken();
    try {
      const response = await fetch(`${apiBaseUrl}/api/students/batch`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify(students), // ส่งข้อมูลในรูปแบบ JSON
      });
      
      if (!response.ok) {
        throw new Error('Failed to create students');
      }
  
      const result = await response.json();
      console.log('Batch students created successfully:', result);
    } catch (error) {
      console.error('Error:', error);
    }
}

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

export const batchDeleteStudents = async (ids) => {
    try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) throw new Error("User is not logged in");

        const idToken = await user.getIdToken();
        const response = await fetch(`${apiBaseUrl}/api/students/batch-delete`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${idToken}`,
            },
            body: JSON.stringify({ ids }), // Send the array of IDs in the body
        });

        const result = await response.json();
        console.log(result); // Log the result from the server
    } catch (error) {
        console.error('Error deleting students:', error);
    }
};
