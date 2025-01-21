"use client";
import styles from '../css/route.module.css';
import { useState } from "react";

export default function HistoryRouteSidebar({ isOpen, onClose }) {
  if (!isOpen) return null; // ถ้า Sidebar ไม่เปิด ให้คืนค่า null

  const [currentPage, setCurrentPage] = useState('History Routes');
  // Data for the history routes
  const routes = [
    {
      date: "Jan 13, 2025",
      students: 140,
      type: "Home To Schools",
      typeColor: "text-green-600",
    },
    {
      date: "Jan 9, 2025",
      students: 139,
      type: "Bus To Schools",
      typeColor: "text-red-600",
    },
    {
      date: "Jan 1, 2025",
      students: 120,
      type: "Home To Schools",
      typeColor: "text-yellow-600",
    },
    {
      date: "Jan 13, 2025",
      students: 140,
      type: "Home To Schools",
      typeColor: "text-green-600",
    },
    {
      date: "Jan 9, 2025",
      students: 139,
      type: "Bus To Schools",
      typeColor: "text-red-600",
    },
    {
      date: "Jan 1, 2025",
      students: 120,
      type: "Home To Schools",
      typeColor: "text-yellow-600",
    },
    // Add more items here for testing scroll
    {
      date: "Feb 5, 2025",
      students: 150,
      type: "Home To Schools",
      typeColor: "text-green-600",
    },
    {
      date: "Feb 6, 2025",
      students: 130,
      type: "Bus To Schools",
      typeColor: "text-red-600",
    },
    {
      date: "Feb 7, 2025",
      students: 125,
      type: "Home To Schools",
      typeColor: "text-yellow-600",
    },
    {
      date: "Jan 13, 2025",
      students: 140,
      type: "Home To Schools",
      typeColor: "text-green-600",
    },
    {
      date: "Jan 9, 2025",
      students: 139,
      type: "Bus To Schools",
      typeColor: "text-red-600",
    },
    {
      date: "Jan 1, 2025",
      students: 120,
      type: "Home To Schools",
      typeColor: "text-yellow-600",
    },
    {
      date: "Jan 13, 2025",
      students: 140,
      type: "Home To Schools",
      typeColor: "text-green-600",
    },
    {
      date: "Jan 9, 2025",
      students: 139,
      type: "Bus To Schools",
      typeColor: "text-red-600",
    },
    {
      date: "Jan 1, 2025",
      students: 120,
      type: "Home To Schools",
      typeColor: "text-yellow-600",
    },
    // Add more items here for testing scroll
    {
      date: "Feb 5, 2025",
      students: 150,
      type: "Home To Schools",
      typeColor: "text-green-600",
    },
    {
      date: "Feb 6, 2025",
      students: 130,
      type: "Bus To Schools",
      typeColor: "text-red-600",
    },
    {
      date: "Feb 7, 2025",
      students: 125,
      type: "Home To Schools",
      typeColor: "text-yellow-600",
    },
  ];

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
      className="fixed z-50  overflow-y-auto w-full sm:w-[500px] h-[500px] sm:h-screen bg-gray-100 border-t sm:border-t-0 sm:border-r border-gray-300 bottom-0 sm:top-0 lg:left-64 lg:top-0 transition-transform"
    >
      {currentPage === 'History Routes' && (
        <div className="h-full px-3 pb-4 overflow-y-auto flex flex-col">
          <h2 className={`${styles.title} sticky top-0 bg-gray-100 p-3 mt-[10px]`}>History Routes</h2>
          {/* {routes.map((route, index) => (
            <li
              key={index}
              className={`cursor-pointer border-t border-gray-200  transition-all ${route.typeColor}`}
            >
              <div className="px-4 py-5 sm:px-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {route.date}
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Students: {route.students}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-500">
                    Type:{" "}
                    <span className={`text-sm font-medium ${route.typeColor}`}>
                      {route.type}
                    </span>
                  </p>
                  <a
                    href="#"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    View
                  </a>
                </div>
              </div>
            </li>
          ))} */}
          {routes.map((route, index) => (
            <div key={index} className={`${styles.card} flex w-full my-1 p-4 max-w-lg flex-col rounded-lg bg-white shadow-sm`}>
              <div className="">
                <div className="flex items-center justify-between">
                  <h3 className={styles.date}>
                    {route.date}
                  </h3>
                  <p className={`${styles.student} mt-1 max-w-2xl`}>
                    Students: {route.students}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-500">
                    Type:{" "}
                    <span className={`${styles.type, route.typeColor} `}>
                      {route.type}
                    </span>
                  </p>
                  <a
                    href="#"
                    onClick={() => setCurrentPage('View')}
                    className={styles.view}
                  >
                    View
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {currentPage === 'View' && (
        <div >
          <div className="flex items-center p-2 sticky top-0 bg-gray-50">
            <svg onClick={() => setCurrentPage('History Routes')} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-10">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            <div className="flex items-center p-2 space-x-2">
              <div className={`w-8 h-8 bg-orange-300 rounded`}></div>
              <h1 className={`${styles.title}`}>Routes</h1>
            </div>
          </div>
          <hr className="mb-5"></hr>
          {Data.map((data, index) => (
            <div className='px-3' key={index}>
              <div className={`${styles.card} flex w-full my-2 p-4 max-w-lg flex-col rounded-lg bg-white shadow-sm `}>
                <div className="flex items-center gap-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#265CB3" className="size-10">
                    <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
                  </svg>

                  <div className="flex w-full flex-col">
                    <div className="flex items-center justify-between">
                      <h5 className={styles.text_name}>
                        {data.name}
                      </h5>
                    </div>
                    <p className={styles.text_adress}>
                      {data.address}
                    </p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-10">
                    <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
          <div className="mt-auto sticky bottom-0 flex justify-center bg-[#f9f9f9] border-t border-gray-300 w-full">
            <div className="flex bg-white w-screen py-3">
              {/* <button
                className={`${styles.btn_reset} mx-auto block bg-blue-500 rounded px-4 py-2`}
              >
                Reset
              </button> */}
              <button
                className={`${styles.btn_download} mx-auto px-4 py-2`}
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}