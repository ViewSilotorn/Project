const host = process.env.NEXT_PUBLIC_API_HOST;
const port = process.env.NEXT_PUBLIC_API_PORT;

// สร้าง base URL
const apiBaseUrl = `${host}:${port}`;


// const fetchRoutes = async (idToken, map, data) => {
//     console.log("Fetching Trips and Drawing Routes...");
//     try {
//         const response = await fetch(`${configService.orToolURL}/vrp/solve_vrp`, {
//             method: 'POST', // ใช้ POST method
//             headers: {
//                 'Content-Type': 'application/json', // Content-Type เป็น JSON
//             },
//             body: JSON.stringify(data), // ส่ง data ใน body
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         const result = await response.json();

//         // ตรวจสอบว่ามีข้อมูล trips หรือไม่
//         if (result && result.trips) {
//             console.log("Trips found:", result.trips);
//             return result.trips;
//         } else {
//             console.warn("No trips found in API response");
//             return [];
//         }
//     } catch (error) {
//         console.error("Error fetching trips from API:", error);
//         return [];
//     }
// };


// count time
const fetchRoutes = async (idToken, map, data) => {
    console.log("Fetching Trips and Drawing Routes...");
    
    const controller = new AbortController(); // สร้าง AbortController ใหม่
    const timeoutId = setTimeout(() => {
        controller.abort(); // เรียกใช้ abort หลังจาก 60 วินาที
    }, 60000); // 60 วินาที

    try {
        const response = await fetch(`${apiBaseUrl}/vrp/solve_vrp`, {
            method: 'POST', // ใช้ POST method
            headers: {
                'Content-Type': 'application/json', // Content-Type เป็น JSON
            },
            body: JSON.stringify(data), // ส่ง data ใน body
            signal: controller.signal, // ใช้ signal เพื่อยกเลิกคำขอ
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        // ตรวจสอบว่ามีข้อมูล trips หรือไม่
        if (result && result.trips) {
            console.log("Trips found:", result.trips);
            return result.trips;
        } else {
            console.warn("No trips found in API response");
            return [];
        }
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log("Request was aborted due to timeout.");
        } else {
            console.error("Error fetching trips from API:", error);
        }
        return [];
    } finally {
        clearTimeout(timeoutId); // ล้าง timeout เมื่อคำขอเสร็จสิ้น
    }
};






// const fetchRoutes = async (idToken, map, data, controller) => {
//     console.log("Fetching Trips and Drawing Routes...");
    
//     try {
//         const response = await fetch(`${configService.orToolURL}/vrp/solve_vrp`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(data),
//             signal: controller.signal, // ส่ง signal ของ controller เพื่อให้ยกเลิกได้
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         const result = await response.json();

//         // ตรวจสอบว่ามีข้อมูล trips หรือไม่
//         if (result && result.trips) {
//             console.log("Trips found:", result.trips);
//             return result.trips;
//         } else {
//             console.warn("No trips found in API response");
//             return [];
//         }
//     } catch (error) {
//         if (error.name === 'AbortError') {
//             console.log("Request was aborted.");
//             return [];  // หยุดการใช้งานข้อมูลจากคำขอที่ถูกยกเลิก
//         } else {
//             console.error("Error fetching trips from API:", error);
//         }
//         return [];
//     }
// };






// ฟังก์ชันสำหรับสุ่มสีแบบ Hex
function getRandomHexColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


export { getRandomHexColor, fetchRoutes };