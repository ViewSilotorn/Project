"use client";
import style from '../css/side.module.css';
import Link from 'next/link';
import { useEffect, useRef, useState } from "react";
import { getAuth } from "firebase/auth";
import { fetchStudents } from "../services/studentService";
import mapboxgl from "mapbox-gl";
import Swal from 'sweetalert2';
import showAlert from './ShowAlert';

const host = process.env.NEXT_PUBLIC_API_HOST;
const port = process.env.NEXT_PUBLIC_API_PORT;

// สร้าง base URL
const apiBaseUrl = `${host}:${port}`;

const addStudent = ({ isOpenAddStudent, onCloseAddStudent, onAddStudent }) => {
    if (!isOpenAddStudent) return null;
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [map, setMap] = useState(null);
    const mapContainer = useRef(null); // ใช้สำหรับเก็บ ref ของ container สำหรับแผนที่
    const [error, setError] = useState(null);

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
    const [showMap, setShowMap] = useState(false);

    useEffect(() => {
        if (showMap && mapContainer.current) {

            // ตั้งค่า Mapbox เมื่อ component mount
            mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;// ใส่ Mapbox Access Token ที่คุณได้รับ
            const mapInstance = new mapboxgl.Map({
                container: mapContainer.current, // ref ของ container
                style: 'mapbox://styles/mapbox/outdoors-v12', // เลือกสไตล์แผนที่
                center: [0, 0], // ตั้งค่าตำแหน่งเริ่มต้น
                zoom: 2, // ตั้งค่าระดับการซูม
            });

            // สร้าง marker ที่สามารถลากได้
            const marker = new mapboxgl.Marker({ draggable: true })
                .setLngLat([0, 0]) // ตั้งค่าเริ่มต้นที่ตำแหน่ง (Longitude, Latitude)
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
    }, [showMap]);


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

            const response = await fetch(`${apiBaseUrl}/api/students`, {
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
            <div className="bg-white rounded-lg shadow-xl p-6 w-[990px] h-[695px] relative z-50 max-h-[90vh] overflow-y-auto">
                <div className=" sm:rounded-lg  flex flex-col justify-center py-9">
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
                    <div className="py-8 px-10">
                        <h2 className={style.title}>
                            Add Student
                        </h2>
                        <div className={style.p}>
                            Fill out the form below to add a new student to the system.
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-6 gap-6 px-10">
                        <div className={`${style.text_email} col-span-6 sm:col-span-3`}>
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

                        <div className={`${style.text_email} col-span-6 sm:col-span-3`}>
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

                        <div className={`${style.text_email} col-span-6 sm:col-span-3`}>
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

                        <div className={`${style.text_email} col-span-6 sm:col-span-3`}>
                            <label htmlFor="Gender" >
                                Gender
                            </label>
                            <select
                                id="Gender"
                                name="gender"
                                className={`${style.select} block`}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>

                        <div className={`${style.text_email} col-span-6 sm:col-span-3`}>
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

                        <div className={`${style.text_email} col-span-6 sm:col-span-3`}>
                            <label htmlFor="Status" >
                                Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                className={`${style.select} block`}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select status</option>
                                <option value="0">Canceled</option>
                                <option value="1">Confirmed</option>
                            </select>
                        </div>

                        <div className={`${style.text_email} col-span-6 sm:col-span-3`}>
                            <label htmlFor="Latitude">Latitude</label>
                            <div className={style.input_placeholder_email}>
                                <input
                                    type="text"
                                    id="Latitude"
                                    name="latitude"
                                    onClick={() => setShowMap(true)}
                                    value={formData.latitude || ""}
                                    onChange={handleInputChange}
                                    readOnly
                                    className={style.input_email}
                                    required
                                />
                            </div>
                        </div>


                        <div className={`${style.text_email} col-span-6 sm:col-span-3`}>
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
                        {/* <div
                            ref={mapContainer}
                            style={{ width: "500px", height: "200px", border: "1px solid #ccc" }}
                        ></div> */}

                        {showMap && (
                            <div className={` ${style.modal_overlay} `}>
                                <div className={`${style.modal_content} overflow-x-auto`}>
                                    <button onClick={() => setShowMap(false)} type="button" className="bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                        <span className="sr-only">Close modal</span>
                                    </button>
                                    <div
                                        ref={mapContainer}
                                        style={{ width: "100%", height: "200px", marginTop: "10px" }}
                                    ></div>
                                </div>
                            </div>
                        )}

                        <div className="col-span-6 justify-end sm:flex sm:items-center sm:gap-4">
                            <button
                                type="submit"
                                className={style.btn_add}
                            >
                                Add Student
                            </button>
                        </div>
                    </form>
                    {/* </div> */}
                </div>
            </div>
        </div>
    );
};

export default addStudent;
