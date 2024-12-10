"use client"
import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import styles from '../map.module.css';

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);
    const [isOpenDropdown, setIsOpenDropdown] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen); //เปลี่ยนสถานะเมื่อกดปุ่ม
    }

    // const toggleDropdown = () => {
    //     setIsOpenDropdown(!isOpenDropdown)
    // }

    return (
        <div className="relative">
            <div>
                <nav className="bg-back border-gray-200">
                    <div className="max-w-screen-xl flex">

                    </div>
                </nav>
            </div>
            <div className={`fixed top-0 bottom-0 left-0 bg-white shadow-lg transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
                } w-[400px] ${styles.sidebar}`}>
                <span>Logo</span>
                {/* <div id="dropdownMenuIconButton" onClick={toggleDropdown} className="flex justify-between w-full items-center cursor-pointer">
                        <h1>Username</h1>
                        <span><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                        </span>
                        Dropdown menu
                        {isOpenDropdown && (
                            <div id="dropdown" className="z-10 absolute bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 mt-2">
                                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconButton">
                                    <li>
                                        <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                            Logout
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div> */}


                {/* <ul className='flex space-x-4 text-sm lg:text-base'>
                        <li >
                            <a href='#' className={styles.box}>FindRoute</a>
                            <button class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded shadow">
                                FindRoute
                            </button>
                        </li>
                        <li >
                            <a href='#' className={styles.box}>Drivers</a>
                        </li>
                        <li>
                            <a href='#' className={styles.box}>Students</a>
                        </li>
                    </ul>
                    <ul className='flex space-x-4 text-sm lg:text-base'>
                        <li >
                            <a href='#' className={styles.box}>HomeToSchools</a>
                        </li>
                        <li >
                            <a href='#' className={styles.box}>BusStopToShools</a>
                        </li>
                        <li>
                            <a href='#' className={styles.box}>Route</a>
                        </li>
                    </ul> */}
                {/* <div className="grid gap-x-8 gap-y-4 grid-cols-3 ">
                        <div className={styles.box}><h1 className={styles.text_box}>FindRoute</h1></div>
                        <div className={styles.box1}>Drivers</div>
                        <div className={styles.box}>Students</div>
                        <div className={styles.box}>HomeToSchools</div>
                        <div className={styles.box}>BusStopToShool</div>
                        <div className={styles.box}>Route</div>
                    </div> */}
                <div className={styles.grid_container}>
                    <div className={`${styles.grid_item} ${styles.box} ${styles.text_box}`}>FindRoute</div>
                    <div className={`${styles.grid_item} ${styles.box} ${styles.text_box}`}>Drivers</div>
                    <div className={`${styles.grid_item} ${styles.box} ${styles.text_box}`}>Students</div>
                    <div className={`${styles.grid_item} ${styles.box} ${styles.text_box}`}>HomeToSchools</div>
                    <div className={`${styles.grid_item} ${styles.box} ${styles.text_box}`}>BusStopToShool</div>
                    <div className={`${styles.grid_item} ${styles.box} ${styles.text_box}`}>Route</div>
                </div>
                <div className="overflow-y-scroll ... ml-5 mt-2 mr-5">
                    <div >
                        <div>
                            <span>Stopping Point</span>
                        </div>
                        <div className="flex items-center border p-2 rounded mt-1">
                            <input
                                type="text"
                                placeholder="One address per line"
                                className="flex-grow outline-none"
                            />
                        </div>
                        <div>
                            <span>Number of cars (Up to 4)</span>
                        </div>
                        {/* <from className="max-w-sm mx-auto"> 
                            <label htmlFor="number-input" className="block mb-2 text-sm font-medium text"></label>
                            <input type="number" id="number-input" aria-describedby="helper-text-explanation" className="border borber-gray-300 rounded"/>
                        </from> */}
                        <div className="flex items-center border p-2 rounded mt-2">
                            <input
                                type="text"
                                placeholder="One address per line"
                                className="flex-grow outline-none"
                            />
                        </div>
                        <div>
                            <span>Bus Stop</span>
                        </div>
                        <div className="flex items-center border p-2 rounded mt-1">
                            <input
                                type="text"
                                placeholder="Bus Stop Station 1"
                                className="flex-grow outline-none"
                            />
                        </div>
                        <div className="flex items-center border p-2 rounded mt-1">
                            <input
                                type="text"
                                placeholder="Bus Stop Station 2"
                                className="flex-grow outline-none"
                            />
                        </div>
                        <div className="flex items-center border p-2 rounded mt-1">
                            <input
                                type="text"
                                placeholder="Bus Stop Station 3"
                                className="flex-grow outline-none"
                            />
                        </div>
                        <div>
                            <span>Students (55)</span> 
                        </div>
                        <div className="flex items-center border p-2 rounded mt-1">
                            <input
                            type="text"
                            placeholder="Students Number 1"
                            className="flex-grow outline-none"/>
                        </div>
                        <div className="flex items-center border p-2 rounded mt-1">
                            <input
                            type="text"
                            placeholder="Students Number 2"
                            className="flex-grow outline-none"/>
                        </div>
                      
                        {/* <div className="mt-2 flex">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            <span className="ml-2">Add another stop</span>
                        </div> */}
                    </div>
                </div>

            </div>
            <button onClick={toggleSidebar} className={`fixed top-1/2 -translate-y-1/2 z-50 bg-white border border-gray-300 shadow-md p-2 rounded-full transition-all duration-300 ${isOpen ? "left-[585px]" : "left-2"
                }`}>
                {isOpen ? (
                    <FaChevronLeft className="text-gray-700" />) : (
                    <FaChevronRight />
                )}

            </button>
        </div>
    );
}