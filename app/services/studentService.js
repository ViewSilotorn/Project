import axios from 'axios';

const API_BASE_URL = 'http://192.168.3.251:8080/api';

export const fetchPageData = async (page) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/students/page/${page}`);
        return response.data;
    } catch (error) {
        console.error('Error Page data', error);
        throw error;
    }
}

//  useEffect(() => {
//         const fetchDataStudent = async () => {
//             try {
//                 const data = await fetchPageData(currentPage);
//                 console.log('Loaded Trips:', data); // ตรวจสอบข้อมูล
//                 setStudents(data.students);  // ตั้งค่าข้อมูลนักเรียน
//                 setTotalCount(data.total_count);  // ตั้งค่าจำนวนรวมของนักเรียน
//                 setPerPage(data.per_page);  // ตั้งค่าจำนวนนักเรียนต่อหน้า
//             } catch (error) {
//                 console.error("Error fetching student data:", error);
//                 setError(error.message);
//             }
//         };

//         fetchDataStudent();
//     }, [currentPage]);