"use client";
import style from '../css/side.module.css';
import styles from '../css/nav.module.css';
import Link from 'next/link';
import { useState } from "react";
import { getAuth } from "firebase/auth";
import { fetchStudents } from "../services/studentService";

const host = process.env.NEXT_PUBLIC_API_HOST;
const port = process.env.NEXT_PUBLIC_API_PORT;

// สร้าง base URL
const apiBaseUrl = `${host}:${port}`;

const addStudent = ({ isOpenAddStudent, onCloseAddStudent, onAddStudent }) => {
    if (!isOpenAddStudent) return null;

    const [error, setError] = useState(null);
    const [students, setStudents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

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


    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    //insert data student
    const handleSubmit = async (e) => {
        e.preventDefault();

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
                    latitude: formData.latitude,
                    longitude: formData.longitude,
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
                            Add New Student
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
                                <option value="0">0</option>
                                <option value="1">1</option>
                            </select>
                        </div>

                        <div className={`${style.text_email} col-span-6 sm:col-span-3`}>
                            <label htmlFor="Latitude" >
                                Latitude
                            </label>
                            <div className={style.input_placeholder_email}>
                                <input
                                    type="text"
                                    id="Latitude"
                                    name="latitude"
                                    onChange={handleInputChange}
                                    className={style.input_email}
                                    required
                                />
                            </div>
                        </div>

                        <div className={`${style.text_email} col-span-6 sm:col-span-3`}>
                            <label htmlFor="Longitude" >
                                Longitude
                            </label>
                            <div className={style.input_placeholder_email}>
                                <input
                                    type="text"
                                    id="Longitude"
                                    name="longitude"
                                    onChange={handleInputChange}
                                    className={style.input_email}
                                    required
                                />
                            </div>
                        </div>

                        <div className="col-span-6 justify-end sm:flex sm:items-center sm:gap-4">
                            <button
                                type="submit"
                                className={style.btn_add}
                            >
                                Submit
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
