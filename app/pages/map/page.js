"use client";

import { useEffect, useState, r } from "react";
import Map from "../../components/Map";
import Image from 'next/image';
import st from '../../css/repass.module.css'
import { getAuth, signOut, onAuthStateChanged, sendPasswordResetEmail } from "firebase/auth";
import app from "../../../config.js";
import Link from 'next/link';

// componets
import HomeToSchools from "../../components/HomeToSchools";
import ButToSchools from "../../components/BusToSchool";
import HistoryRoute from "../../components/HistoryRoute";
import Student from "../../components/Students"
import Logo from '../../Image/Logo.png'
import Modal from "../../components/Modal";

export default function MapPage() {
    const [isDropdownOpen, setDropdownOpen] = useState(false); // State for Dropdown
    const [isDropdownOpenRoutes, setDropdownOpenRoutes] = useState(false); // State for Dropdown
    const [isSidebarOpen, setSidebarOpen] = useState(false); // State for Sidebar
    const [isAdditionalSidebarOpen, setIsAdditionalSidebarOpen] = useState(false); // State สำหรับ Sidebar ที่สอง

    const [activeComponent, setActiveComponent] = useState(null);

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const toggleDropdownRoutes = () => {
        setDropdownOpenRoutes(!isDropdownOpenRoutes);
    };

    const toggleAdditionalSidebar = () => {
        setIsAdditionalSidebarOpen(!isAdditionalSidebarOpen);
    };

    const toggleComponent = (componentName) => {
        setActiveComponent((prev) =>
            prev === componentName ? null : componentName
        ); // ถ้าค่าปัจจุบันตรงกับคอมโพเนนต์ที่เลือก ให้ตั้งค่าเป็น null
    };

    const [dateTime, setDateTime] = useState(null);
    useEffect(() => {
        setDateTime(new Date());
        const interval = setInterval(() => {
            setDateTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    if (!dateTime) {
        // แสดงค่าเริ่มต้นหรือสถานะโหลด
        return <p className="text-gray-800 font-bold">Loading...</p>;
    }



    return (
        <>
            {/* <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="px-3 py-3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                         Left Section 
                        <div className="flex items-center justify-start rtl:justify-end">
                            <button
                                onClick={toggleSidebar}
                                aria-controls="logo-sidebar"
                                type="button"
                                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                            >
                                <span className="sr-only">Open sidebar</span>
                                <svg
                                    className="w-6 h-6"
                                    aria-hidden="true"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        clipRule="evenodd"
                                        fillRule="evenodd"
                                        d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                                    ></path>
                                </svg>
                            </button>
                            <a className="flex ms-2 md:me-24">
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
                        </div>

                        Right Section
                        <div className="flex items-center">
                            <p className="text-gray-500 font-bold text-[10px] sm:text-sm md:text-xl">
                                {dateTime.toLocaleString("en-US", {
                                    month: "short", // เช่น Jan
                                    day: "numeric", // เช่น 10
                                    year: "numeric", // เช่น 2025
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                    hour12: true,
                                })}
                            </p>
                            <div className="flex items-center ms-3">
                                <div>

                                    <button
                                        onClick={toggleDropdown}
                                        type="button"
                                        className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                                    >
                                        <span className="sr-only">Open user menu</span>
                                        <img
                                            className="w-8 h-8 rounded-full"
                                            src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                                            alt="user photo"
                                        />
                                    </button>
                                </div>
                                Dropdown Menu
                                {isDropdownOpen && (
                                    <div className="absolute right-5 top-5 mt-10 z-50 w-48 bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600">
                                        <div className="px-4 py-3">
                                            <p className="text-sm text-gray-900 dark:text-white">
                                                Neil Sims
                                            </p>
                                            <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300">
                                                neil.sims@flowbite.com
                                            </p>
                                        </div>
                                        <ul className="py-1">
                                            <li>
                                                <a
                                                    href="#"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                                                >
                                                    Dashboard
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href="#"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                                                >
                                                    Settings
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href="#"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                                                >
                                                    Sign out
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav> */}

            {/* Sidebar main */}
            {/* <aside
                id="logo-sidebar"
                className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } sm:translate-x-0 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700`}
                aria-label="Sidebar"
            >
                <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
                    <ul className="space-y-2 font-medium">
                        <li>
                            <button
                                type="button"
                                className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                                onClick={toggleDropdownRoutes}
                                aria-expanded={isDropdownOpenRoutes}
                            >
                                <svg
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 22 21"
                                    className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                >
                                    <path d="M10 0a10 10 0 100 20 10 10 0 000-20zm3.78 6.22a.75.75 0 01.072.832l-3.5 7a.75.75 0 01-1.296.078l-3.5-7a.75.75 0 01.962-1.04L10 6.804l2.984-1.456a.75.75 0 01.796.872z" />
                                </svg>
                                <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
                                    Find Routes
                                </span>
                                <svg
                                    className={`w-3 h-3 transform transition-transform ${isDropdownOpenRoutes ? "rotate-180" : ""
                                        }`}
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 10 6"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m1 1 4 4 4-4"
                                    />
                                </svg>
                            </button>
                            <ul
                                className={`py-2 space-y-2 ${isDropdownOpenRoutes ? "" : "hidden"
                                    }`}
                            >
                                <li>
                                    <a
                                        onClick={() => toggleComponent('HomeToSchools')}
                                        className="cursor-pointer flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                                    >
                                        Home To Schools
                                    </a>
                                </li>
                                <li>
                                    <a
                                        onClick={() => toggleComponent('ButToSchools')}
                                        className="cursor-pointer flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                                    >
                                        But To Schools
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a
                                onClick={() => toggleComponent('HistoryRoute')}
                                className="cursor-pointer flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                            >
                                <svg
                                    className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 22 21"
                                >
                                    <path d="M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5zM11.25 6a.75.75 0 011.5 0v5.25h3a.75.75 0 110 1.5h-3.75a.75.75 0 01-.75-.75V6z" />
                                </svg>
                                <span className="ms-3">History Routes</span>
                            </a>
                        </li>
                        <li>
                            <a
                                onClick={() => toggleComponent('Student')}
                                className="cursor-pointer flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                            >
                                <svg
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 22 21"
                                    className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                >
                                    <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.227.119-.34.18a.75.75 0 0 1-.707 0A50.88 50.88 0 0 0 7.5 12.173v-.224c0-.131.067-.248.172-.311a54.615 54.615 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.123 56.123 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859 1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" />
                                    <path d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.284a.75.75 0 0 1-.46.711 47.87 47.87 0 0 0-8.105 4.342.75.75 0 0 1-.832 0 47.87 47.87 0 0 0-8.104-4.342.75.75 0 0 1-.461-.71c.035-1.442.121-2.87.255-4.286.921.304 1.83.634 2.726.99v1.27a1.5 1.5 0 0 0-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.66a6.727 6.727 0 0 0 .551-1.607 1.5 1.5 0 0 0 .14-2.67v-.645a48.549 48.549 0 0 1 3.44 1.667 2.25 2.25 0 0 0 2.12 0Z" />
                                    <path d="M4.462 19.462c.42-.419.753-.89 1-1.395.453.214.902.435 1.347.662a6.742 6.742 0 0 1-1.286 1.794.75.75 0 0 1-1.06-1.06Z" />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Students</span>
                              
                            </a>
                        </li>
                    </ul>
 
                </div>
            </aside> */}



            <div className="relative">
                <div className="lg:block">
                    <button
                        onClick={toggleSidebar}
                        aria-controls="logo-sidebar"
                        type="button"
                        className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                    >
                        <span className="sr-only">Open sidebar</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                </div>
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

                        <div className="lg:block -me-2">
                            <button
                                onClick={toggleSidebar}
                                type="button"
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 end-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                                <svg
                                    aria-hidden="true"
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

                    <nav className="h-full overflow-y-auto ">
                        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
                            <ul className="space-y-2 font-medium">
                                <li>
                                    <button
                                        type="button"
                                        className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                                        onClick={toggleDropdownRoutes}
                                        aria-expanded={isDropdownOpenRoutes}
                                    >
                                        <svg
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 22 21"
                                            className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                        >
                                            <path d="M10 0a10 10 0 100 20 10 10 0 000-20zm3.78 6.22a.75.75 0 01.072.832l-3.5 7a.75.75 0 01-1.296.078l-3.5-7a.75.75 0 01.962-1.04L10 6.804l2.984-1.456a.75.75 0 01.796.872z" />
                                        </svg>
                                        <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
                                            Find Routes
                                        </span>
                                        <svg
                                            className={`w-3 h-3 transform transition-transform ${isDropdownOpenRoutes ? "rotate-180" : ""
                                                }`}
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 10 6"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="m1 1 4 4 4-4"
                                            />
                                        </svg>
                                    </button>
                                    <ul
                                        className={`py-2 space-y-2 ${isDropdownOpenRoutes ? "" : "hidden"
                                            }`}
                                    >
                                        <li>
                                            <a
                                                onClick={() => toggleComponent('HomeToSchools')}
                                                className="cursor-pointer flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                                            >
                                                Home To Schools
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                onClick={() => toggleComponent('ButToSchools')}
                                                className="cursor-pointer flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                                            >
                                                But To Schools
                                            </a>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <a
                                        onClick={() => toggleComponent('HistoryRoute')}
                                        className="cursor-pointer flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                    >
                                        <svg
                                            className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 22 21"
                                        >
                                            <path d="M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5zM11.25 6a.75.75 0 011.5 0v5.25h3a.75.75 0 110 1.5h-3.75a.75.75 0 01-.75-.75V6z" />
                                        </svg>
                                        <span className="ms-3">History Routes</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        onClick={() => toggleComponent('Student')}
                                        className="cursor-pointer flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                    >
                                        <svg
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 22 21"
                                            className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                        >
                                            <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.227.119-.34.18a.75.75 0 0 1-.707 0A50.88 50.88 0 0 0 7.5 12.173v-.224c0-.131.067-.248.172-.311a54.615 54.615 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.123 56.123 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859 1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" />
                                            <path d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.284a.75.75 0 0 1-.46.711 47.87 47.87 0 0 0-8.105 4.342.75.75 0 0 1-.832 0 47.87 47.87 0 0 0-8.104-4.342.75.75 0 0 1-.461-.71c.035-1.442.121-2.87.255-4.286.921.304 1.83.634 2.726.99v1.27a1.5 1.5 0 0 0-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.66a6.727 6.727 0 0 0 .551-1.607 1.5 1.5 0 0 0 .14-2.67v-.645a48.549 48.549 0 0 1 3.44 1.667 2.25 2.25 0 0 0 2.12 0Z" />
                                            <path d="M4.462 19.462c.42-.419.753-.89 1-1.395.453.214.902.435 1.347.662a6.742 6.742 0 0 1-1.286 1.794.75.75 0 0 1-1.06-1.06Z" />
                                        </svg>
                                        <span className="flex-1 ms-3 whitespace-nowrap">Students</span>

                                    </a>
                                </li>
                            </ul>

                        </div>
                    </nav>

                    <footer className="mt-auto p-2 border-t border-gray-200 dark:border-neutral-700">
                        <div className=" relative w-full inline-flex">
                            <div>
                                <button
                                    onClick={toggleDropdown}
                                    type="button"
                                    className="w-full inline-flex shrink-0 items-center gap-x-2 p-2 text-start text-sm text-gray-800 rounded-md hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                                >
                                    <span className="sr-only">Open user menu</span>
                                    <img
                                        className="w-8 h-8 rounded-full"
                                        src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                                        alt="user photo"
                                    />
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
                                        <a className="flex items-center gap-x-3 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" href="#">
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
            {/* {showPopupReset && (
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
                                <form className="space-y-6">
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
            </Modal> */}


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