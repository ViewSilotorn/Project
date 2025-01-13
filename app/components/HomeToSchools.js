"use client";
import styles from '../css/HomeToSchools.module.css';
import { getAuth } from "firebase/auth";
import { useState, useEffect, useRef } from "react";

export default function HomeToSchoolSidebar({ isOpen, onClose }) {
    if (!isOpen) return null; // ถ้า Sidebar ไม่เปิด ให้คืนค่า null

    const [currentPageHome, setCurrentPageHome] = useState('Home To Schools');

    const Data = [
        { id: 1, name: "John Doe", address: "123 Main St, Springfield" },
        { id: 2, name: "Jane Smith", address: "456 Elm St, Rivertown" },
        { id: 3, name: "Alice Johnson", address: "789 Oak Ave, Lakeview" },
        { id: 4, name: "Bob Brown", address: "321 Maple St, Cedarville" },
        { id: 5, name: "Carol White", address: "654 Pine Rd, Greenwood" },
        { id: 6, name: "David Black", address: "987 Birch Ln, Oakwood" },
        { id: 7, name: "Emma Green", address: "111 Ash Ct, Willowtown" },
        { id: 8, name: "Frank Gray", address: "222 Cherry Dr, Riverbend" },
        { id: 9, name: "Grace Blue", address: "333 Walnut St, Meadowlake" },
        { id: 10, name: "Henry Yellow", address: "444 Poplar Ave, Sunnyvale" },
    ]

    return (
        <aside
            id="additional-sidebar"
            className="fixed z-50 w-full sm:w-[500px] h-[500px] sm:h-screen bg-[#f9f9f9] border-t sm:border-t-0 sm:border-r border-gray-300 
             bottom-0 sm:top-0 lg:left-64 lg:top-0 transition-transform"
        >
            <div className="h-full overflow-y-auto flex flex-col">
                {/* <h2 className="text-lg font-bold">Home To Schools</h2> */}
                <div >
                    {currentPageHome === 'Home To Schools' && (
                        <div>
                            <div className="relative px-3 flex flex-col">
                                <div className="flex flex-col items-start space-y-1 mt-2">
                                    <span className={styles.text_date}>Tuesday, January 2025</span>
                                    <div className="flex items-center">
                                        <form className="max-w-sm mx-auto mt-3">
                                            <label htmlFor="number-input" className={`${styles.number} block`}>Number of cars:</label>
                                            <input type="number" id="number-input" min="0" className={`${styles.number_input} mt-2 `} required />
                                        </form>
                                    </div>
                                </div>
                                <div className="mt-5">
                                    <span className={styles.text_student}>Students</span>
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
                                <div className="relative mt-2 mb-2">
                                    <label htmlFor="Search" className="sr-only"> Search </label>
                                    <input
                                        type="text"
                                        id="Search"
                                        placeholder="Name or ID" className={`${styles.input_search} bg-white  py-2 px-10 border border-gray-400 rounded shadow`} />
                                    <span className="absolute inset-y-0 start-0 grid w-12 place-content-center">
                                        <button type="button">
                                            <span className="sr-only">Search</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#00000029" className="size-6 b">
                                                <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </span>
                                </div>

                                {Data.map((item) => (
                                    <div key={item.id} className={`${styles.card} flex w-full my-1 p-4 max-w-lg flex-col rounded-lg bg-white shadow-sm border border-slate-200 hover:bg-gray-100`}>
                                        <div className="flex items-center gap-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#265CB3" className="size-10">
                                                <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
                                            </svg>

                                            <div className="flex w-full flex-col">
                                                <div className="flex items-center justify-between">
                                                    <h5 className={styles.text_name}>
                                                        {item.name}
                                                    </h5>
                                                </div>
                                                <p className={styles.text_adress}>
                                                    {item.address}
                                                </p>
                                            </div>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-10">
                                                <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* <div className="bg-white p-5 sticky bottom-0 left-0 right-0 flex justify-center ">
                                <button className={`${styles.btn} w-full justify-center`} onClick={() => setCurrentPageHome('Routes')}>
                                    Optimize Route
                                </button>
                            </div> */}
                            <div className="sticky bottom-0 flex justify-center bg-[#f9f9f9] border-t border-gray-300 w-ful">
                                <div className="bg-white w-screen py-3">
                                    <button
                                        className="mx-auto block text-white bg-blue-500 hover:bg-blue-600 rounded px-4 py-2"
                                        onClick={() => setCurrentPageHome('Routes')}
                                    >
                                        Optimize Routes
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentPageHome === 'Routes' && (
                        <div>
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
                        </div>
                    )}

                    {currentPageHome === 'RoutesNumber' && (
                        <div>
                            <div className="flex items-center p-2">
                                <svg onClick={() => setCurrentPageHome('Routes')} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-10">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                                </svg>
                                <div className="flex items-center p-2 space-x-2">
                                    <div className={`w-8 h-8 bg-orange-300 rounded`}></div>
                                    <h1 className={`${styles.title}`}>Routes</h1>
                                </div>
                            </div>
                            <hr className="mb-5"></hr>
                            {Data.map((item) => (
                                <div className='px-3'>
                                    <div key={item.id} className={`${styles.card} flex w-full my-2 p-4 max-w-lg flex-col rounded-lg bg-white shadow-sm border border-slate-200 hover:bg-gray-100`}>
                                        <div className="flex items-center gap-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#265CB3" className="size-10">
                                                <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
                                            </svg>

                                            <div className="flex w-full flex-col">
                                                <div className="flex items-center justify-between">
                                                    <h5 className={styles.text_name}>
                                                        {item.name}
                                                    </h5>
                                                </div>
                                                <p className={styles.text_adress}>
                                                    {item.address}
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
                    )}
                </div>
            </div>
        </aside>
    );
}