"use client";
import style from '../css/side.module.css';
import Link from 'next/link';
import { useState, useEffect, useRef } from "react";
import { getAuth } from "firebase/auth";
import { getStudentById, updateDataById } from '../services/studentService';
import mapboxgl from "mapbox-gl";
import showAlert from './ShowAlert';

const host = process.env.NEXT_PUBLIC_API_HOST;
const port = process.env.NEXT_PUBLIC_API_PORT;

// สร้าง base URL
const apiBaseUrl = `${host}:${port}`;

const EditStudent = ({ id, isOpenEditStudent, onCloseEditStudent, updateStudent }) => {
    if (!isOpenEditStudent) return null;

    const [error, setError] = useState("");
    const mapContainerRef = useRef(null);
    const markerRef = useRef(null);

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

    useEffect(() => {

        const fetchStudent = async () => {
            try {
                if (id) {
                    const student = await getStudentById(id);
                    if (student.gender == 'Male') {
                        student.gender = 'Male';
                    }
                    else {
                        student.gender = 'Female';
                    }

                    setFormData({
                        first_name: student.first_name || "",
                        last_name: student.last_name || "",
                        age: student.age || "",
                        gender: student.gender || "",
                        address: student.address || "",
                        latitude: student.latitude || "",
                        longitude: student.longitude || "",
                        status: student.status || "",
                    });
                }
            } catch (error) {
                setError("Failed to fetch student data.");
            }
        };
        fetchStudent();
    }, [id]);

    const [showMap, setShowMap] = useState(false);

    useEffect(() => {
        if (!showMap || !mapContainerRef.current || !formData.latitude || !formData.longitude) return;

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/outdoors-v12",
            center: [formData.longitude, formData.latitude], // (lng, lat)
            zoom: 12,
        });

        // Create marker
        const marker = new mapboxgl.Marker({ draggable: true })
            .setLngLat([formData.longitude, formData.latitude])
            .addTo(map);

        marker.on("dragend", () => {
            const lngLat = marker.getLngLat();
            setFormData((prev) => ({
                ...prev,
                latitude: lngLat.lat.toFixed(8),
                longitude: lngLat.lng.toFixed(8),
            }));
        });

        markerRef.current = marker;

        return () => map.remove(); // Cleanup on unmount
    }, [showMap, formData.latitude, formData.longitude]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // update data student
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const result = await updateDataById(id, formData);
            console.log('Update Student:', result);

            updateStudent(result);
            showAlert("Edit success!")
            onCloseEditStudent();
        } catch (error) {
            // Capture the error message to display to the user
            setError(error.message);
            console.error('Update failed:', error);
        }
    };

    return (
        <div
            className={`${isOpenEditStudent ? "fixed" : "hidden"
                } overflow-y-auto overflow-x-hidden fixed inset-0 bg-gray-600 bg-opacity-50 z-50  h-full w-full flex items-center justify-center`}
        >
            <div className="bg-white rounded-lg shadow-xl p-6 w-[990px] h-[683px] relative z-50 max-h-[90vh] overflow-y-auto">
                <div className=" sm:rounded-lg  flex flex-col justify-center py-7">
                    {/* <div className="flex min-h-full flex-1 flex-col justify-center px-4 py-8 lg:py-12"> */}
                    <Link href="" onClick={onCloseEditStudent} className={style.link}>
                        <div className='flex'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                            </svg>
                            <div className='ml-2'>
                                Back to Student
                            </div>
                        </div>
                    </Link>
                    <div className="py-8 px-10">
                        <h2 className={style.title}>
                            Edit
                        </h2>
                        <div className={style.p}>
                            Edit the student's details, including name and home address
                        </div>
                    </div>
                    < form onSubmit={handleUpdate} className="grid grid-cols-6 gap-6 px-10">
                        <div className={`${style.text_email} col-span-6 sm:col-span-3`}>
                            <label htmlFor="first_name" >
                                First Name
                            </label>
                            <div className={style.input_placeholder_email}>
                                <input
                                    type="text"
                                    name="first_name"
                                    value={formData?.first_name || ''}
                                    onChange={handleInputChange}
                                    className={style.input_email}
                                />
                            </div>
                        </div>

                        <div className={`${style.text_email} col-span-6 sm:col-span-3`}>
                            <label htmlFor="last_name" >
                                Last Name
                            </label>
                            <div className={style.input_placeholder_email}>
                                <input
                                    type="text"
                                    name="last_name"
                                    value={formData?.last_name || ''}
                                    onChange={handleInputChange}
                                    className={style.input_email}
                                />
                            </div>
                        </div>

                        <div className={`${style.text_email} col-span-6 sm:col-span-3`}>
                            <label htmlFor="age" >
                                Age
                            </label>
                            <div className={style.input_placeholder_email}>
                                <input
                                    type="text"
                                    name="age"
                                    value={formData?.age || ''}
                                    onChange={handleInputChange}
                                    className={style.input_email}
                                />
                            </div>
                        </div>

                        <div className={`${style.text_email} col-span-6 sm:col-span-3`}>
                            <label htmlFor="gender">
                                Gender
                            </label>
                            <select
                                name="gender"
                                className={`${style.select} block`}
                                value={formData?.gender || ''} // Default to an empty string if no value is set
                                onChange={handleInputChange}
                            >
                                <option value="">Select gender</option> {/* Use an empty value for the default option */}
                                <option value="Male">Male</option>
                                <option value="Female">Female</option> {/* Ensure consistent casing */}
                            </select>
                        </div>


                        <div className={`${style.text_email} col-span-6 sm:col-span-3`}>
                            <label htmlFor="address" >
                                Home Address
                            </label>
                            <div className={style.input_placeholder_email}>
                                <input
                                    type="text"
                                    name="address"
                                    className={style.input_email}
                                    value={formData?.address || ''}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className={`${style.text_email} col-span-6 sm:col-span-3`}>
                            <label htmlFor="status" >
                                Status
                            </label>
                            <select
                                name="status"
                                className={`${style.select} block`}
                                value={formData?.status || ''}
                                onChange={handleInputChange}
                            >
                                <option value="">Select status</option>
                                <option value="0">0</option>
                                <option value="1">1</option>
                            </select>
                        </div>

                        <div className={`${style.text_email} col-span-6 sm:col-span-3`}>
                            <label htmlFor="latitude" >
                                Latitude
                            </label>
                            <div className={style.input_placeholder_email}>
                                <input

                                    type="text"
                                    name="latitude"
                                    onClick={() => setShowMap(true)}
                                    value={formData?.latitude || ''}
                                    onChange={handleInputChange}
                                    className={style.input_email}
                                />
                            </div>
                        </div>

                        <div className={`${style.text_email} col-span-6 sm:col-span-3`}>
                            <label htmlFor="longitude" >
                                Longitude
                            </label>
                            <div className={style.input_placeholder_email}>
                                <input
                                    type="text"
                                    name="longitude"
                                    value={formData?.longitude || ''}
                                    onChange={handleInputChange}
                                    className={style.input_email}
                                />
                            </div>
                        </div>
                        {showMap && (
                            <div className={` ${style.modal_overlay} `}>
                                <div className={`${style.modal_content} overflow-x-auto`}>
                                    <button onClick={() => setShowMap(false)} type="button" className="bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                        </svg>
                                        <span className="sr-only">Close modal</span>
                                    </button>
                                    <div ref={mapContainerRef} style={{ width: "100%", height: "200px", marginTop: "10px" }}></div>
                                </div>
                            </div>
                        )}

                        <div className="col-span-6 justify-end sm:flex sm:items-center sm:gap-4">
                            <button
                                type="submit"
                                className={style.btn_add}
                            >
                                Save
                            </button>
                        </div>
                    </form>
                    {/* </div> */}
                </div>
            </div>
        </div >
    );
};

export default EditStudent;
