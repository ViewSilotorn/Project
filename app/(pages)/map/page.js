"use client";

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Map from "../../components/Map";
import Image from 'next/image';
import { getAuth, signOut, onAuthStateChanged, sendPasswordResetEmail } from "firebase/auth";
import app from "../../../config.js";
import Link from 'next/link';
import st from '../../css/repass.module.css'

// componets
import HomeToSchools from "../../components/HomeToSchools";
import ButToSchools from "../../components/BusToSchool";
import HistoryRoute from "../../components/HistoryRoute";
import Student from "../../components/Students"
import Logo from '../../Image/Logo.png'
import Modal from "../../components/Modal";

export default function MapPage() {
    const [isOpen, setIsOpen] = useState(false); // จัดการสถานะของ Sidebar
    const [isDropdownOpen, setDropdownOpen] = useState(false); // State for Dropdown
    const [isSidebarOpen, setSidebarOpen] = useState(false); // State for Sidebar
    const [activeLink, setActiveLink] = useState("");
    const [activeComponent, setActiveComponent] = useState(null);
    const auth = getAuth(app);
    const router = useRouter();
    const [showPopupReset, setShowPopupReset] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [emailForPasswordReset, setEmailForPasswordReset] = useState("");

    const closeModal = () => setIsModalOpen(false);

    const openModal = () => {
        setShowPopupReset(false);
        setIsModalOpen(true);
    }

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const toggleComponent = (componentName) => {
        setActiveComponent((prev) =>
            prev === componentName ? null : componentName
        );
        setActiveLink(componentName); // ถ้าค่าปัจจุบันตรงกับคอมโพเนนต์ที่เลือก ให้ตั้งค่าเป็น null
    };

    const toggleNav = () => {
        if (window.innerWidth <= 640) {
            setIsOpen(!isOpen);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
                router.push("/signUp"); // Redirect if not logged in
            }
        });

        return () => unsubscribe();
    }, [auth, router]);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            router.push("/"); // Redirect to the home page after sign out
        } catch (error) {
            console.error("Error signing out:", error.message);
        }
    };

    const handlePasswordResetRequest = async (e) => {
        e.preventDefault();
        console.log("email");

        if (!emailForPasswordReset) {
            alert("Please enter your email address.");
            console.log(emailForPasswordReset);

            return;
        }

        try {
            await sendPasswordResetEmail(auth, emailForPasswordReset);
            // alert("Password reset email sent! Please check your inbox.");
            openModal(true)
            setShowPopupReset(false); // Close the modal after sending the reset email
        } catch (error) {
            alert("Error sending password reset email: " + error.message);
        }

    };

    // const [dateTime, setDateTime] = useState(null);
    // useEffect(() => {
    //     setDateTime(new Date());
    //     const interval = setInterval(() => {
    //         setDateTime(new Date());
    //     }, 1000);
    //     return () => clearInterval(interval);
    // }, []);

    // if (!dateTime) {
    //     // แสดงค่าเริ่มต้นหรือสถานะโหลด
    //     return <p className="text-gray-800 font-bold">Loading...</p>;
    // }



    return (
        <>
            <div className="lg:block">
                <button
                    onClick={toggleSidebar}
                    aria-controls="logo-sidebar"
                    type="button"
                    className="fixed top-4 left-4 z-40 inline-flex items-center p-3 text-sm text-gray-500 bg-white rounded-2xl sm:hidden"
                >
                    {/* <span className="sr-only">Open sidebar</span> */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>
            </div>

            {/* Sidebar */}
            <div
                id="logo-sidebar"
                className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } sm:translate-x-0 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700`}
                aria-label="Sidebar" >
                <div className="relative flex flex-col h-full max-h-full ">

                    <header className="p-4 flex justify-between items-center gap-x-2">
                        <a className="flex md:me-24">
                            <Image
                                src={Logo}
                                alt="FlowBite Logo"
                                width={32} // กำหนดความกว้าง
                                height={32} // กำหนดความสูง
                                className="h-8 me-3"
                            />
                            <span className="self-center text-sm font-semibold sm:text-sm whitespace-nowrap dark:text-white">
                                RouteWise
                            </span>
                        </a>

                        <div className="">
                            <button
                                onClick={toggleSidebar}
                                type="button"
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 end-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
                        </div>

                    </header>

                 
                        <div className="hs-accordion-group pb-0 px-2 w-full flex flex-col flex-wrap">
                            <ul className="space-y-1">
                                <li>
                                    <a
                                        onClick={() => {
                                            toggleComponent('HomeToSchools');
                                            toggleNav();
                                        }}
                                        className={`cursor-pointer flex items-center p-2 rounded-lg
                                        text-gray-900 dark:text-white
                                        hover:bg-gray-100 dark:hover:bg-gray-700
                                        group
                                        ${activeLink === "HomeToSchools"
                                                ? "bg-gray-100 dark:bg-gray-700"
                                                : ""
                                            }
                                        `}
                                    >
                                        {/* <svg
                                            className="size-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                            <polyline points="9 22 9 12 15 12 15 22" />
                                        </svg> */}
                                        <span className="flex-1 ms-3 whitespace-nowrap">Home To Schools</span>
                                        {/* <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                        Pro
                        </span> */}
                                    </a>
                                </li>

                                <li>
                                    <a
                                        onClick={() => {
                                            toggleComponent('ButToSchools');
                                            toggleNav();
                                        }}
                                        className={`cursor-pointer flex items-center p-2 rounded-lg
                                    text-gray-900 dark:text-white
                                    hover:bg-gray-100 dark:hover:bg-gray-700
                                    group
                                    ${activeLink === "ButToSchools"
                                                ? "bg-gray-100 dark:bg-gray-700"
                                                : ""
                                            }
                                    `}
                                    >
                                        {/* <svg
                                            className="size-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M4 16c0 .88.39 1.67 1 2.22v1.28c0 .83.67 1.5 1.5 1.5S8 20.33 8 19.5V19h8v.5c0 .82.67 1.5 1.5 1.5c.82 0 1.5-.67 1.5-1.5v-1.28c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5s1.5.67 1.5 1.5s-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z" />
                                         
                                        </svg> */}
                                        <span className="flex-1 ms-3 whitespace-nowrap">Bus To Schools</span>
                                        {/* <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                        Pro
                        </span> */}
                                    </a>
                                </li>

                                <li>
                                    <a
                                        onClick={() => {
                                            toggleComponent('HistoryRoute');
                                            toggleNav();
                                        }}
                                        className={`cursor-pointer flex items-center p-2 rounded-lg
                                        text-gray-900 dark:text-white
                                        hover:bg-gray-100 dark:hover:bg-gray-700
                                        group
                                        ${activeLink === "HistoryRoute"
                                                ? "bg-gray-100 dark:bg-gray-700"
                                                : ""
                                            }
                                        `}
                                    >
                                        {/* <svg
                                            className="size-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934a1.12 1.12 0 0 1-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689A1.125 1.125 0 0 0 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934a1.12 1.12 0 0 1 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
                                        </svg> */}
                                        <span className="flex-1 ms-3 whitespace-nowrap">History Routes</span>
                                        {/* <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                        Pro
                        </span> */}
                                    </a>
                                </li>

                                <li>
                                    <a
                                        onClick={() => {
                                            toggleComponent('Student');
                                            toggleNav();
                                        }}
                                        className={`cursor-pointer flex items-center p-2 rounded-lg
                                                    text-gray-900 dark:text-white
                                        hover:bg-gray-100 dark:hover:bg-gray-700
                                        group
                                        ${activeLink === "Student"
                                                ? "bg-gray-100 dark:bg-gray-700"
                                                : ""
                                            }
                                        `}
                                    >
                                        {/* <svg
                                            className="size-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0a1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789a6.721 6.721 0 0 1-3.168-.789a3.376 3.376 0 0 1 6.338 0Z" />
                                        </svg> */}
                                        <span className="flex-1 ms-3 whitespace-nowrap">Students</span>
                                        {/* <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                        Pro
                        </span> */}
                                    </a>
                                </li>
                            </ul>
                        </div>
           

                    <footer className="mt-auto p-2 border-t border-gray-200 dark:border-neutral-700">
                        <div className=" relative w-full inline-flex">
                            <div>
                                <button
                                    onClick={toggleDropdown}
                                    type="button"
                                    className="w-full inline-flex shrink-0 items-center gap-x-2 p-2 text-start text-sm text-gray-800 rounded-md hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                                >
                                    <span className="sr-only">Open user menu</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>

                                    <div>
                                        Mia Hudson

                                    </div>
                                    <div className="ml-20">
                                        <svg className="shrink-0 size-3.5 ms-auto" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7 15 5 5 5-5" /><path d="m7 9 5-5 5 5" /></svg>
                                    </div>
                                </button>
                            </div>
                            {isDropdownOpen && (
                                <div
                                    className="absolute bottom-full mb-2 w-60 transition-all opacity-100 z-20 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-neutral-900 dark:border-neutral-700"
                                    role="menu"
                                    aria-orientation="vertical"
                                    aria-labelledby="hs-sidebar-footer-example-with-dropdown"
                                >
                                    <div className="p-1">
                                        <a onClick={() => setShowPopupReset(true)} className="flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" href="#">
                                            Reset Password
                                        </a>
                                        <a onClick={handleSignOut} className="flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" >
                                            Sign out
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>

                    </footer>

                </div>

            </div>
            {/* Popup Reset */}
            {showPopupReset && (
                <div className={`${st.root_login} fixed inset-0  bg-black bg-opacity-50 z-50`}>
                    <main className={st.card}>
                        <div className="flex  flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                                <h2 className={st.title}>
                                    Reset password
                                </h2>
                                <div className={st.p}>
                                    Reset password with your email
                                </div>
                            </div>
                            <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
                                <form onSubmit={handlePasswordResetRequest} className="space-y-6">
                                    <div className={st.text_email}>
                                        <label htmlFor="email">
                                            Work email
                                        </label>
                                        <div className={st.input_placeholder_email}>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="Enter your email"
                                                value={emailForPasswordReset}
                                                onChange={(e) => setEmailForPasswordReset(e.target.value)}
                                                required
                                                autoComplete="email"
                                                className={st.input_email}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <button type="submit" // Explicitly set as a submit button
                                            className={st.btn}>Submit</button>
                                    </div>
                                </form>
                                <div className='mt-20'>
                                    <Link href="#" onClick={() => setShowPopupReset(false)} className={st.link}>
                                        <div className='flex'>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                                            </svg>
                                            <div className='ml-2 mt-1'>
                                                Back to log in
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </main >
                </div>
            )}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
            </Modal>


            {/* Additional Sidebar */}
            {activeComponent === 'HomeToSchools' && (
                <HomeToSchools isOpen={true} onClose={() => setActiveComponent(null)} />
            )}
            {activeComponent === 'ButToSchools' && (
                <ButToSchools isOpen={true} onClose={() => setActiveComponent(null)} />
            )}
            {activeComponent === 'HistoryRoute' && (
                <HistoryRoute isOpen={true} onClose={() => setActiveComponent(null)} />
            )}
            {activeComponent === 'Student' && (
                <Student isOpen={true} onClose={() => setActiveComponent(null)} />
            )}

            <div className="sm:ml-64">
                <div className="w-full h-full">
                    <Map />
                </div>
            </div>
        </>
    );
}