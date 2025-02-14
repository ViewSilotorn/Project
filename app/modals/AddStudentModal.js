"use client";
import style from '../css/side.module.css';
import Link from 'next/link';
import { useEffect, useRef, useState, useCallback } from "react";
import { getAuth } from "firebase/auth";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import showAlert from './ShowAlert';
import { subscribeAuthState } from "../services/authService"; // Service สำหรับ auth state
import configService from '../services/configService';
import { fetchMapCenter } from '../services/schoolService';

// const host = process.env.NEXT_PUBLIC_API_HOST;
// const port = process.env.NEXT_PUBLIC_API_PORT;

// // สร้าง base URL
// const apiBaseUrl = `${host}:${port}`;

const addStudent = ({isOpenAddStudent, onCloseAddStudent, onAddStudent }) => {
    if (!isOpenAddStudent) return null;

    const [schoolLocation, setSchoolLocation] = useState({ id: 0, name: "", latitude: "0", longitude: "0" });
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [map, setMap] = useState(null);
    const mapContainer = useRef(null); // ใช้สำหรับเก็บ ref ของ container สำหรับแผนที่
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        age: "",
        gender: "",
        address: "",
        latitude: "",
        longitude: "",
        status: "",
    });

    const getSchoolLocation = useCallback(async () => {
        const [longitude, latitude] = await fetchMapCenter();
        setSchoolLocation({ latitude, longitude });
    }, []);

    useEffect(() => {
        getSchoolLocation();
    }, [getSchoolLocation]);

    useEffect(() => {
        if (mapContainer.current) {
            const { latitude, longitude } = schoolLocation;

            // ตั้งค่า Mapbox เมื่อ component mount
            mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;// ใส่ Mapbox Access Token ที่คุณได้รับ
            const mapInstance = new mapboxgl.Map({
                container: mapContainer.current, // ref ของ container
                style: "mapbox://styles/mapbox/light-v10",// เลือกสไตล์แผนที่
                center: [longitude, latitude], // ตั้งค่าตำแหน่งเริ่มต้น [lng, lat]
                zoom: 3,
                attributionControl: false,
                dragPan: true,
                scrollZoom: true,
                boxZoom: false,
                dragRotate: false,
                maxBounds: [
                    [-180, -85],  // Southwest coordinates
                    [180, 85],    // Northeast coordinates
                ],
            });

            // สร้าง marker ที่สามารถลากได้
            const marker = new mapboxgl.Marker({ draggable: true })
                .setLngLat([longitude, latitude]) // ตั้งค่าเริ่มต้นที่ตำแหน่ง (Longitude, Latitude)
                .addTo(mapInstance);

            // เมื่อ marker ถูกลาก, จะอัพเดทค่าพิกัดในฟอร์ม
            marker.on('dragend', () => {
                const lngLat = marker.getLngLat();
                handleInputChange({ target: { name: "latitude", value: lngLat.lat.toFixed(8) } }, true);
                handleInputChange({ target: { name: "longitude", value: lngLat.lng.toFixed(8) } }, true);
            });

            setMap(mapInstance);

            // Clean up เมื่อ component ถูก unmount
            return () => mapInstance.remove();
        }
    }, []);


    const handleInputChange = (e, isFromMap = false) => {
        let { name, value } = e.target || {}; // ตรวจสอบว่า e.target มีค่าหรือไม่

        // ถ้ามาจากแผนที่ -> แปลงเป็นตัวเลข และจำกัดทศนิยม
        if (isFromMap) {
            value = parseFloat(value).toFixed(8);
        }

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    //insert data student
    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(formData.latitude + '/' + formData.longitude);
        console.log(parseFloat(formData.latitude).toFixed(8) + '//' + parseFloat(formData.longitude).toFixed(8));


        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) throw new Error("User is not logged in");

            const idToken = await user.getIdToken();
            console.log("JWT Token:", idToken);

            const response = await fetch(`${configService.baseURL}/api/students`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify({
                    student_id: "654987",
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    age: formData.age,
                    gender: formData.gender,
                    address: formData.address,
                    latitude: formData.latitude ? parseFloat(formData.latitude).toFixed(8) : null,
                    longitude: formData.longitude ? parseFloat(formData.longitude).toFixed(8) : null,
                    status: formData.status,
                }),

            });
            if (!response.ok) {
                throw new Error('Failed to submit the data. Please try again.')
            }

            // Handle response if necessary
            const data = await response.json(); // รอรับ response
            console.log("API Response:", data);

            onAddStudent(data);

            // Swal.fire({
            //     text: 'Import complete!',
            //     icon: 'success',
            //     timer: 2000,
            //     showConfirmButton: false, 
            //     customClass: {
            //         popup: style.myPopup,
            //         content: style.myContent,
            //         confirmButton: style.myConfirmButton,
            //       }
            // });
            showAlert("Import success!");
            // ...
            onCloseAddStudent();
        } catch (error) {
            // Capture the error message to display to the user
            setError(error.message)
            console.error(error)
        }
    }

    return (
        <div
            className={`${isOpenAddStudent ? "fixed" : "hidden"
                } overflow-y-auto overflow-x-hidden fixed inset-0 bg-gray-600 bg-opacity-50 z-50  h-full w-full flex items-center justify-center`}
        >
            <div className="bg-white rounded-lg shadow-xl p-6 w-[990px] h-[777px] relative z-50 max-h-[90vh] overflow-y-auto">
                <div className=" sm:rounded-lg  flex flex-col justify-center py-5 p-5">
                    {/* <div className="flex min-h-full flex-1 flex-col justify-center px-4 py-8 lg:py-12"> */}
                    <Link href="" onClick={onCloseAddStudent} className={style.link}>
                        <div className='flex'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 pb-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                            </svg>
                            <div className='ml-1'>
                                Back to Student
                            </div>
                        </div>
                    </Link>
                    <div className="py-8">
                        <h2 className={style.title}>
                            Add New Student
                        </h2>
                        <div className={style.p}>
                            Fill out the form below to add a new student to the system.
                        </div>
                    </div>


                    {/* <div className="grid grid-flow-col grid-rows-3 gap-4"> */}
                    <form onSubmit={handleSubmit} className='mt-3'>
                        <div className='grid lg:grid-cols-2 gap-4 sm:grid-cols-1'>
                            <div >
                                <div className='grid grid-cols-2 gap-4'>
                                    <div className={`${style.text_email}`}>
                                        <label htmlFor="first_name" >
                                            First Name
                                        </label>
                                        <div className={style.input_placeholder_email}>
                                            <input
                                                type="text"
                                                id="FirstName"
                                                name="first_name"
                                                onChange={handleInputChange}
                                                className={style.input_email}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className={`${style.text_email} col2-start`}>
                                        <label htmlFor="LastName" >
                                            Last Name
                                        </label>
                                        <div className={style.input_placeholder_email}>
                                            <input
                                                type="text"
                                                id="LastName"
                                                name="last_name"
                                                onChange={handleInputChange}
                                                className={style.input_email}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className={`${style.text_email} `}>
                                        <label htmlFor="Age" >
                                            Age
                                        </label>
                                        <div className={style.input_placeholder_email}>
                                            <input
                                                type="text"
                                                id="Age"
                                                name="age"
                                                onChange={handleInputChange}
                                                className={style.input_email}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className={`${style.text_email} `}>
                                        <label htmlFor="Gender" >
                                            Gender
                                        </label>
                                        <select
                                            id="Gender"
                                            name="gender"
                                            className={`${style.select}`}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                    </div>
                                </div>



                                <div className={`${style.text_email} mt-4`}>
                                    <label htmlFor="HomeAddress" >
                                        Home Address
                                    </label>
                                    <div className={style.input_placeholder_email}>
                                        <input
                                            type="text"
                                            id="HomeAddress"
                                            name="address"
                                            onChange={handleInputChange}
                                            className={style.input_email}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className={`${style.text_email} mt-4`}>
                                    <label htmlFor="Status" >
                                        Status
                                    </label>
                                    <select
                                        id="status"
                                        name="status"
                                        className={`${style.select} block p-1`}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select status</option>
                                        <option value="0">Cancelled</option>
                                        <option value="1">Confirmed</option>
                                    </select>
                                </div>

                                <div className='grid grid-cols-2 gap-4 mt-4'>
                                    <div className={`${style.text_email} `}>
                                        <label htmlFor="Latitude">Latitude</label>
                                        <div className={style.input_placeholder_email}>
                                            <input
                                                type="text"
                                                id="Latitude"
                                                name="latitude"
                                                // onClick={() => setShowMap(!showMap)}

                                                value={formData.latitude || ""}
                                                onChange={handleInputChange}
                                                readOnly
                                                className={style.input_email}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className={`${style.text_email} `}>
                                        <label htmlFor="Longitude">Longitude</label>
                                        <div className={style.input_placeholder_email}>
                                            <input
                                                type="text"
                                                id="Longitude"
                                                name="longitude"
                                                value={formData.longitude || ""}
                                                onChange={handleInputChange}
                                                readOnly
                                                className={style.input_email}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="cols-2">
                                    <div
                                        ref={mapContainer}
                                        style={{ width: "100%", height: "400px" }}
                                    ></div>
                                </div>
                            </div>
                        </div>



                        {/* {showMap && (
                                <div className="absolute w-[px] h-[120px] bg-white border rounded shadow-lg z-50">
                                    <div className="w-[600px] h-[120px]  border rounded-lg" ref={mapContainer} />
                                </div>
                            )} */}


                        <div className="cols-6 justify-end sm:flex sm:items-center sm:gap-4 py-8">
                            <button
                                type="submit"
                                className={style.btn_add}
                            >
                                Submit
                            </button>
                        </div>

                    </form>
                </div>
                {/* </div> */}
            </div>
        </div >
    );
};

export default addStudent;
