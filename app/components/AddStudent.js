import style from '../css/side.module.css';
import styles from '../css/nav.module.css';
import Link from 'next/link';
import { useEffect, useState } from "react";

const addStudent = ({ isOpenAddStudent, onCloseAddStudent }) => {
    if (!isOpenAddStudent) return null;

    const [AddStudent, setAddStudent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) throw new Error("User is not logged in");

            const idToken = await user.getIdToken();
            console.log("JWT Token:", idToken);

            const response = await fetch('http://192.168.3.251:8080/api/students', {
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
            const data = await response.json();
            console.log("API Response:", data);
            // ...

            setAddStudent(false);
        } catch (error) {
            // Capture the error message to display to the user
            setError(error.message)
            console.error(error)
        }
    }
    return (
        <div className={`${styles.root_login}`}>
            <main className={style.card}>
                <div className="flex min-h-full flex-1 flex-col justify-center px-4 py-8 lg:py-12">
                    <Link href="" onClick={onCloseAddStudent} className={style.link}>
                        <div className='flex px-10'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                            </svg>
                            <div className='ml-2'>
                                Back to Student
                            </div>
                        </div>
                    </Link>
                    <div className="py-10 px-24">
                        <h2 className={style.title}>
                            Add Student
                        </h2>
                        <div className={style.p}>
                            Fill out the form below to add a new student to the system.
                        </div>
                    </div>
                    <div
                        className="flex items-center justify-center"
                    >
                        <form className="grid grid-cols-6 gap-6">
                            <div className={`${style.text_email} col-span-6 sm:col-span-3`}>
                                <label htmlFor="FirstName" >
                                    First Name
                                </label>
                                <div className={style.input_placeholder_email}>
                                    <input
                                        type="text"
                                        id="FirstName"
                                        name="first_name"
                                        // onChange={handleInputChange}
                                        className={style.input_email}
                                    />
                                </div>
                            </div>

                            <div className={`${style.text_email} col-span-6 sm:col-span-3`}>
                                <label htmlFor="FirstName" >
                                    Last Name
                                </label>
                                <div className={style.input_placeholder_email}>
                                    <input
                                        type="text"
                                        id="LastName"
                                        name="last_name"
                                        // onChange={handleInputChange}
                                        className={style.input_email}
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
                                        // onChange={handleInputChange}
                                        className={style.input_email}
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
                                    // onChange={handleInputChange}
                                >
                                    <option value="">Select gender</option>
                                    <option value="male">male</option>
                                    <option value="female">Female</option>
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
                                        // onChange={handleInputChange}
                                        className={style.input_email}
                                    />
                                </div>
                            </div>

                            <div className={`${style.text_email} col-span-6 sm:col-span-3`}>
                                <label htmlFor="Status" >
                                    Status
                                </label>
                                <select
                                    id="Status"
                                    name="status"
                                    className={`${style.select} block`}
                                    // onChange={handleInputChange}
                                >
                                    <option value="">Select status</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
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
                                        // onChange={handleInputChange}
                                        className={style.input_email}
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
                                        // onChange={handleInputChange}
                                        className={style.input_email}
                                    />
                                </div>
                            </div>

                            <div className="col-span-6 justify-end sm:flex sm:items-center sm:gap-4">
                                <button
                                    type="submit"
                                    className={style.btn_add}
                                >
                                    Add Student
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main >
        </div>
    );
};

export default addStudent;
