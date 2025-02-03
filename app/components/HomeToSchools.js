"use client";
import styles from '../css/HomeToSchools.module.css';
import { getAuth } from "firebase/auth";
import { useState, useEffect, useRef } from "react";
import { fetchStudents } from '../services/studentService';
import { subscribeAuthState } from "../services/authService";
import FindingOverlay from '../modals/FindingOverlay'
import St from '../css/student.module.css';

const host = process.env.NEXT_PUBLIC_API_HOST;
const port = process.env.NEXT_PUBLIC_API_PORT;

// สร้าง base URL
const apiBaseUrl = `${host}:${port}`;

export default function HomeToSchoolSidebar({ isOpen, openComponent, onClose, mapRef }) {
    if (!isOpen) return null; // ถ้า Sidebar ไม่เปิด ให้คืนค่า null

    const [students, setStudents] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [numVehicles, setNumVehicles] = useState(2);
    const [maxStopsPerVehicle, setMaxStopsPerVehicle] = useState(24);
    const [maxTravelTime, setMaxTravelTime] = useState(180);

    // const [downloadData, setDownloadData] = useState(false);
    const [user, setUser] = useState(null);
    const [idToken, setIdToken] = useState(""); // State สำหรับเก็บ token

    useEffect(() => {
        const unsubscribe = subscribeAuthState(setUser, setIdToken); // เรียกใช้ service
        return () => unsubscribe(); // เมื่อ component ถูกลบออก, ยกเลิกการ subscribe
    }, []); // ใช้ [] เพื่อให้เพียงแค่ครั้งแรกที่ mount

    //Show student
    // useEffect(() => {
    //     const loadStudents = async () => {
    //         try {
    //             const data = await fetchStudents(currentPage);
    //             console.log(data);
    //             setStudents(data.students);  // ตั้งค่าข้อมูลนักเรียน
    //             setTotalCount(data.total_count);  // ตั้งค่าจำนวนรวมของนักเรียน
    //             setPerPage(data.per_page);  // ตั้งค่าจำนวนนักเรียนต่อหน้า
    //         } catch (error) {
    //             setError(error.message);
    //         }
    //     };

    //     loadStudents();
    // }, [currentPage]);

    ////////////////////////////////ดึงข้อมูลนักเรียนทั้งหมด//////////////////////////////////////
    const [searchQuery, setSearchQuery] = useState(""); // State for search input
    const [loading, setLoading] = useState(false); // Loading state for search
    const [isOpenDropdown, setIsOpenDropdown] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('All status');


    // const loadStudents = async () => {
    //     const auth = getAuth();
    //     const user = auth.currentUser;

    //     if (!user) {
    //         setError("User is not logged in");
    //         return;
    //     }

    //     const idToken = await user.getIdToken();
    //     try {
    //         let data;
    //         if (searchQuery.trim()) {
    //             const response = await fetch(
    //                 `${apiBaseUrl}/api/students/search?page=${currentPage}&find=${searchQuery}`,
    //                 {
    //                     method: 'GET',
    //                     headers: {
    //                         'Authorization': `Bearer ${idToken}`,
    //                     },
    //                 }
    //             );

    //             if (response.ok) {
    //                 data = await response.json();
    //             } else {
    //                 throw new Error("Error fetching search results");
    //             }
    //         }
    //         else {
    //             data = await fetchStudents(currentPage);
    //             console.log('Student all: ', data);
    //         }
    //         setStudents(data.students);
    //         setTotalCount(data.total_count);  // Set the total count of students
    //         setError(null);  // Clear any previous error
    //     } catch (error) {
    //         setError(error.message);
    //     }
    // };

    const loadStudents = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            setError("User is not logged in");
            return;
        }

        const idToken = await user.getIdToken();
        try {
            let data;
            let filterStatus = ''; // Default filter

            // If there's a selected filter for status (Confirmed, Cancelled, etc.)
            if (selectedFilter === 'Confirmed') {
                filterStatus = 'true';
            } else if (selectedFilter === 'Canceled') {
                filterStatus = 'false';
            }

            // Handle search query
            if (searchQuery.trim()) {
                const response = await fetch(
                    `${apiBaseUrl}/api/students/search?page=${currentPage}&find=${searchQuery}`,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${idToken}`,
                        },
                    }
                );

                if (response.ok) {
                    data = await response.json();
                } else {
                    throw new Error("Error fetching search results");
                }
            } else if (filterStatus) {
                // If filter status is set (Confirmed or Cancelled)
                const response = await fetch(
                    `${apiBaseUrl}/api/students/status/${filterStatus}/page/${currentPage}`,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${idToken}`,
                        },
                    }
                );

                if (response.ok) {
                    data = await response.json();
                    console.log('filter:', data);

                } else {
                    throw new Error("Error fetching students with filter");
                }
            } else {
                // If neither search query nor filter is applied, fetch all students
                data = await fetchStudents(currentPage);
                console.log('Student all: ', data);
            }

            setStudents(data.students);
            setTotalCount(data.total_count); // Set the total count of students
            setError(null); // Clear any previous error
        } catch (error) {
            setError(error.message);
        }
    };


    useEffect(() => {
        loadStudents();
    }, [currentPage, searchQuery, selectedFilter]);


    //////////////////////////////////Search/////////////////////////////////////

    //filter
    const filters = ["All status", "Confirmed", "Canceled"];

    const handleSearchChange = (e) => {
        console.log("Search Query:", e.target.value);  // ตรวจสอบค่าที่พิมพ์
        setSearchQuery(e.target.value);
    };

    const handleOptionClick = (filter) => {
        setSelectedFilter(filter);
        console.log('Selected option:', filter);
        setIsOpenDropdown(false);
    };

    /////////////ดึงข้อมูลการค้นหา////////////////

    const handleSearch = async (e) => {
        e.preventDefault(); // ป้องกันการรีเฟรชหน้า
        if (!searchQuery.trim()) {
            alert("Please enter a search query.");
            return;
        }

        setLoading(true); // เริ่มสถานะการโหลด
        console.log("Searching for:", searchQuery);

        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) throw new Error("User is not logged in");

            const idToken = await user.getIdToken();

            const response = await fetch(
                `${apiBaseUrl}/api/students/search?page=${currentPage}&find=${searchQuery}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${idToken}`,
                    },
                }
            );

            if (!response.ok) {
                if (response.status === 404) {
                    // ถ้า API ตอบกลับด้วย 404
                    setStudents([]); // กำหนด students เป็น array ว่าง
                    setError("No results found."); // ตั้งค่า error เป็นข้อความ "No results found"
                } else {
                    throw new Error(`Error fetching search results: ${response.status}`);
                }
            } else {
                const data = await response.json();
                console.log("Search Results:", data);
                setStudents(data.students); // อัปเดตข้อมูลนักเรียน
                setTotalCount(data.total_count); // จำนวนข้อมูล
                setError(null); // ล้างข้อผิดพลาดเมื่อได้รับข้อมูลสำเร็จ
            }
        } catch (err) {
            setError(err.message); // แสดงข้อผิดพลาด
        } finally {
            setLoading(false); // ปิดสถานะการโหลด
        }
    };


    const handleNextPage = () => {
        if (currentPage < Math.ceil(totalCount / perPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const totalPages = Math.ceil(totalCount / perPage);

    // const toggleDownload = () => {
    //     setDownloadData(!downloadData);
    // }

    const findingRoute = async () => {
        try {
            setIsLoading(true); // เริ่มโหลด

            if (mapRef.current) {
                const { routes, routeColors, routeDistance, routeDuration, Didu } = await mapRef.current.handleSubmit(
                    parseInt(numVehicles),
                    parseInt(maxStopsPerVehicle),
                    parseInt(maxTravelTime),
                    true
                );
                // openComponent("Route");
                openComponent("Route", { routes, routeColors, routeDistance, routeDuration, Didu });
            }

        } catch (error) {
            console.error("Error in findingRoute:", error);
        } finally {
            setIsLoading(false); // สิ้นสุดโหลด
        }
    };

    const [dateTime, setDateTime] = useState(null);
    useEffect(() => {
        setDateTime(new Date());
        const interval = setInterval(() => {
            setDateTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);


    return (
        <aside
            id="additional-sidebar"
            className="fixed z-50 w-full sm:w-[500px] h-[500px] sm:h-screen bg-white border-t sm:border-t-0 sm:border-r border-gray-300 bottom-0 sm:top-0 lg:top-0 transition-transform"
        >
            <div className="h-full overflow-y-auto flex flex-col">
                {/* <h2 className="text-lg font-bold">Home To Schools</h2> */}
                {/* <h2 className="text-lg font-bold">Home To Schools</h2> */}
                <button
                    type="button"
                    className="bg-transparent hover:bg-gray-200 rounded-lg z-20 p-1.5 absolute top-4 end-5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    onClick={onClose}
                >
                    <svg
                        aria-hidden="false"
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        ></path>
                    </svg>
                    <span className="sr-only">Close menu</span>
                </button>
                <div className="h-full overflow-y-auto flex flex-col">
                    <div className="relative px-3 flex flex-col">
                        <div className='sticky top-0 z-10 bg-white'>
                            <div className="flex flex-col items-start space-y-1 mt-5">
                                {/* <span className={styles.text_date}>Tuesday, January 2025</span> */}
                                <span className={styles.text_date}>
                                    {dateTime ? (
                                        <p>{dateTime.toLocaleString("en-US", { dateStyle: "full" })}</p>
                                    ) : (
                                        <p>Loading...</p>
                                    )}
                                </span>
                                <div className='py-8'>
                                    <label className={styles.text_information}>Information</label>
                                    <div className="flex items-center gap-5 sm:gap-10 py-3">
                                        <div className="flex flex-col">
                                            <label>Bus:</label>
                                            <input
                                                type="number"
                                                min="1"
                                                required
                                                value={numVehicles}
                                                onChange={(e) => setNumVehicles(e.target.value)}
                                                className={`${styles.number_input} mt-2 p-2`}
                                            />
                                        </div>

                                        <div className="flex flex-col">
                                            <label>Max Capacity:</label>
                                            <input
                                                type="number"
                                                min="1"
                                                required
                                                value={maxStopsPerVehicle}
                                                onChange={(e) => setMaxStopsPerVehicle(e.target.value)}
                                                className={`${styles.max_input} mt-2 `}
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label>Max Time (min):</label>
                                            <input
                                                type="number"
                                                min="1"
                                                required
                                                value={maxTravelTime}
                                                onChange={(e) => setMaxTravelTime(e.target.value)}
                                                className={`${styles.time_input} mt-2 `}
                                            />
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="mb-2">
                                <span className={styles.text_student}>Students</span>
                            </div>
                            <div className="bg-white flex border border-gray-300 rounded-md mb-2 min-w-sm">
                                <div className="relative flex">
                                    <span className="inset-y-0 start-0 grid w-12 place-content-center">
                                        {/* icon Search */}
                                        <button type="button">
                                            <span className="sr-only">Search</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#707070" className="size-6">
                                                <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </span>
                                    {/* Search input */}
                                    <form onSubmit={handleSearch}>
                                        <input
                                            type="text"
                                            placeholder="Search..."
                                            value={searchQuery}
                                            onChange={handleSearchChange}
                                            className={`${St.input_search} rounded-lg w-full`}
                                        />
                                    </form>

                                    {/* Filter Icon */}
                                    <button
                                        type="button"
                                        className="p-2 text-gray-500  lg:ml-28"
                                        onClick={() => setIsOpenDropdown(!isOpenDropdown)
                                        } // Toggle dropdown visibility
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#CCCCCC" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                                        </svg>
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isOpenDropdown && (
                                        <div
                                            className="absolute z-10 right-0 mt-10 rounded-md bg-white shadow-lg focus:outline-none"
                                            role="menu"
                                            aria-orientation="vertical"
                                            aria-labelledby="menu-button"
                                        >
                                            <div className="py-1" role="none">
                                                {filters.map((filter) => (
                                                    <button
                                                        key={filter}
                                                        onClick={() => handleOptionClick(filter)}
                                                        className={`block w-full px-4 py-2 text-left text-sm ${selectedFilter === filter ? "bg-gray-200" : "hover:bg-gray-100"
                                                            }`}
                                                    >
                                                        {filter}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* <div className="flex mt-2 mb-3 items-center gap-2">
                                    <div className="relative">
                                        <label htmlFor="Search" className="sr-only"> Search </label>
                                        <input
                                            type="text"
                                            id="Search"
                                            placeholder="Name or ID"
                                            className={`${styles.input_search} bg-white  py-2 px-10 border border-gray-400 rounded shado`}
                                        />
                                        <span className="absolute inset-y-0 start-0 grid w-12 place-content-center">
                                            <button type="button">
                                                <span className="sr-only">Search</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#00000029" className="size-6 b">
                                                    <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </span>
                                    </div>
                                </div> */}
                            {/* <div className="relative mt-2 mb-2">
                                <label htmlFor="Search" className="sr-only"> Search </label>
                                <input
                                    type="text"
                                    id="Search"
                                    placeholder="Name Student" className={`${styles.input_search} bg-white  py-2 px-10 border border-gray-400 rounded shadow`} />
                                <span className="absolute inset-y-0 start-0 grid w-12 place-content-center">
                                    <button type="button">
                                        <span className="sr-only">Search</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#00000029" className="size-6 b">
                                            <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </span>
                            </div> */}
                        </div>

                        {students.length === 0 ? (
                            <div className="text-center py-4">
                                <span >No results found</span>
                            </div>
                        ) : (
                            students.map((student) => (
                                <div key={student.id} className={`${styles.card} flex w-full my-1 p-4 max-w-lg flex-col rounded-lg bg-white shadow-sm border border-slate-200`}>
                                    <div className="flex items-center gap-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="#265CB3" className="size-10">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                        </svg>

                                        <div className="flex w-full flex-col">
                                            <div className="flex items-center justify-between">
                                                <h5 className={styles.text_name}>
                                                    {student.first_name}   {student.last_name}
                                                </h5>
                                            </div>
                                            <p className={styles.text_adress}>
                                                {student.address}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            className={`${student.status === 1
                                                ? styles.btn_status
                                                : styles.btn_status_cancel
                                                } rounded-lg p-3 py-2 my-2 mb-2`}
                                        >
                                            {student.status === 1 ? 'Confirmed' : 'Canceled'}
                                        </button>
                                        {/* <button type="button"
                                                className={`${styles.btn_status} rounded-lg p-3 py-2 my-2  mb-2 `}>
                                                Confirmed
                                            </button><button type="button"
                                                className={`${styles.btn_status_cancel} rounded-lg p-3 py-2 my-2  mb-2 `}>
                                                Canceled
                                            </button> */}
                                        {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-10">
                                                <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" />
                                            </svg> */}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="sticky bottom-[70px] bg-white p-1">
                        <div className="w-full flex justify-between py-2 p-3">
                            <button
                                onClick={(e) => {
                                    e.preventDefault(); // Prevent default anchor behavior
                                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                                }}
                                className={`relative inline-flex items-center rounded-md border border-gray-300 px-4 py-2 ${currentPage > 1 ? 'bg-white  hover:bg-gray-50' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                Previous
                            </button>
                            <span className="py-2">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={(e) => {
                                    e.preventDefault(); // Prevent default anchor behavior
                                    handleNextPage();
                                }}
                                className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium ${currentPage < Math.ceil(totalCount / perPage)
                                    ? 'bg-white text-gray-700 hover:bg-gray-50'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                Next
                            </button>
                        </div>
                    </div>

                    {isLoading && <FindingOverlay />}

                    <div className="mt-auto sticky bottom-0 flex justify-center bg-[#f9f9f9] border-t border-gray-300 w-full">
                        <div className="bg-white w-screen py-3">
                            <button
                                className={`${styles.btn_route} mx-auto block bg-blue-500 hover:bg-blue-600 rounded px-4 py-2`}
                                onClick={() => {
                                    findingRoute();
                                }}
                            >
                                Optimize Routes
                            </button>
                        </div>
                    </div>
                    {/* <div className="bg-white p-5 sticky bottom-0 left-0 right-0 flex justify-center ">
                                <button className={`${styles.btn} w-full justify-center`} onClick={() => setCurrentPageHome('Routes')}>
                                    Optimize Route
                                </button>
                            </div> */}

                </div>


                {/* {currentPageHome === 'Routes' && (
                    <div className="h-full overflow-y-auto flex flex-col">
                        <div className="flex items-center p-2">
                            <svg onClick={() => setCurrentPageHome('Home To Schools')} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                            </svg>

                            <h1 className={`${styles.title} `}>Routes</h1>
                        </div>
                        <hr></hr>
                        <div className='px-3'>
                            <div className={`${styles.card1} flex w-full p-4 max-w-lg flex-col rounded-lg bg-white shadow-sm border border-slate-200 my-6 hover:bg-gray-100`} onClick={() => setCurrentPageHome('RoutesNumber')}>
                                <div className="flex items-center gap-4 py-2">
                                    <div className="flex w-full flex-col">
                                        <div className="flex items-center">
                                            <div className={`w-10 h-10 bg-orange-300 rounded`}></div>
                                            <h5 className={`${styles.text_card} px-5`}>
                                                Routes1
                                            </h5>
                                        </div>
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-10">
                                        <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="mt-auto sticky bottom-0 flex justify-center bg-[#f9f9f9] border-t border-gray-300 w-full">
                            <div className="flex bg-white w-screen py-3">
                                <button
                                    className={`${styles.btn_reset} mx-auto rounded px-4 py-2`}
                                >
                                    Reset
                                </button>
                                <button
                                    // onClick={toggleDownload}
                                    className={`${styles.btn_download} mx-auto block bg-blue-500 rounded px-4 py-2`}
                                >
                                    save
                                </button>
                            </div>
                        </div>
                    </div>
                )} */}

                {/* {currentPageHome === 'RoutesNumber' && (
                    <div>
                        <div className="flex items-center p-2 sticky top-0 bg-gray-50">
                            <svg onClick={() => setCurrentPageHome('Routes')} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-10">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                            </svg>
                            <div className="flex items-center p-2 space-x-2">
                                <div className={`w-8 h-8 bg-orange-300 rounded`}></div>
                                <h1 className={`${styles.title}`}>Routes</h1>
                            </div>
                        </div>
                        <hr className="mb-5"></hr>
                        {students.map((student) => (
                            <div className='px-3' key={student.id}>
                                <div className={`${styles.card} flex w-full my-2 p-4 max-w-lg flex-col rounded-lg bg-white shadow-sm border border-slate-200 hover:bg-gray-100`}>
                                    <div className="flex items-center gap-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#265CB3" className="size-10">
                                            <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
                                        </svg>

                                        <div className="flex w-full flex-col">
                                            <div className="flex items-center justify-between">
                                                <h5 className={styles.text_name}>
                                                    {student.first_name}  {student.last_name}
                                                </h5>
                                            </div>
                                            <p className={styles.text_adress}>
                                                {student.address}
                                            </p>
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-10">
                                            <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )} */}
            </div>
            {/* {downloadData && (
                <div
                    className="overflow-y-auto overflow-x-hidden fixed inset-0 bg-gray-600 bg-opacity-50 z-50  h-full w-full flex items-center justify-center"
                >
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl relative z-50 max-h-[90vh] overflow-y-auto">
                        <div className=" sm:rounded-lg  flex flex-col justify-center">
                            <Link href="" className={styles.link}>
                                <div className='flex'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                                    </svg>
                                    <div className='ml-2'>
                                        Back to Students
                                    </div>
                                </div>
                            </Link>
                            <div className="py-8">
                                <h2 className={styles.title}>
                                    Download
                                </h2>
                                <div className={styles.p}>
                                    Select the desired route(s) and choose the file format (CSV or Excel) to download the data.
                                </div>
                            </div>
                            <div class="relative flex flex-col">
                                <nav class="flex min-w-[240px] flex-col gap-1 p-2">
                                    <div
                                        role="button"
                                        className="flex w-full items-center rounded-lg p-0 transition-all "
                                    >
                                        <label
                                            htmlFor="check-vertical-list-group"
                                            className="flex w-full cursor-pointer items-center px-3 py-2"
                                        >
                                            <div className="inline-flex items-center">
                                                <label className="flex items-center cursor-pointer relative" htmlFor="check-vertical-list-group">
                                                    <input type="checkbox"
                                                        className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-sky-600 checked:bg-sky-600 checked:border-sky-600"
                                                        id="check-vertical-list-group" />
                                                    <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"
                                                            stroke="currentColor" strokeWidth="1">
                                                            <path fillRule="evenodd"
                                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                clipRule="evenodd"></path>
                                                        </svg>
                                                    </span>
                                                </label>
                                                <label class="cursor-pointer ml-3 text-slate-600 text-sm" for="check-vertical-list-group">
                                                    All
                                                </label>
                                            </div>
                                        </label>
                                    </div>
                                </nav>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="submit"
                                    className={styles.btn_csv}
                                >
                                   CSV
                                </button>
                                <button
                                    type="submit"
                                    className={styles.btn_csv}
                                >
                                    Excel
                                </button>
                            </div>
                        </div>
                    </div>
                </div >
            )} */}
        </aside>
    );
}