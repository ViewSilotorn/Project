"use client";
import styles from '../css/route.module.css';
import ModalDelete from "../modals/ModalDelete";
import { useEffect, useState } from "react";
import { fetchTrips } from '../services/tripService';

export default function HistoryRouteSidebar({ isOpen, onClose }) {
  if (!isOpen) return null; // ถ้า Sidebar ไม่เปิด ให้คืนค่า null

  // const [currentPage, setCurrentPage] = useState('History Routes');

  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  //open modal Delete Student
  const openModalDelete = () => {
    // setSelectedUserId(id);
    setIsModalDeleteOpen(true);
  };

  const closeModalDelete = () => {
    setIsModalDeleteOpen(false);
    // setSelectedUserId(null);
  };

  const confirmDelete = async () => {
    if (selectedUserId !== null) {
      await HandleDelete(selectedUserId);
      setStudents((prevStudents) => prevStudents.filter((student) => student.id !== selectedUserId));
      closeModalDelete();
    }
  };

  // const [routes, setRoutes] = useState([]);
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

  // useEffect(() => {
  //   //functionดึงข้อมูลจากAPI
  //   const fetchData = async () => {
  //     try {
  //       const data = await fetchTrips();
  //       console.log('Loaded Trips:', data); // ตรวจสอบข้อมูล
  //       setRoutes(data); // ตั้งค่า state
  //     } catch (error) {
  //       console.error('Error:', error.message);
  //       setError(error.message);
  //     }
  //   };

  //   fetchData();
  // }, []);

  return (
    <aside
      id="additional-sidebar"
      className="fixed z-50  overflow-y-auto w-full sm:w-[500px] h-[500px] sm:h-screen bg-white border-t sm:border-t-0 sm:border-r border-gray-300 bottom-0 sm:top-0 lg:top-0 transition-transform"
    >
      <div className="h-full px-3 pb-4 overflow-y-auto flex flex-col">
        <h2 className={`${styles.title} sticky top-0 bg-white p-3 mt-[10px]`}>History Routes</h2>
        <button
          type="button"
          className="bg-transparent hover:bg-gray-200  rounded-lg z-20 p-1.5 absolute top-4 end-4 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
          onClick={onClose}
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
          <div key={index} className={`${styles.card} flex w-full my-1 p-4 max-w-lg flex-col rounded-lg bg-white shadow-sm hover:bg-gray-100`}>
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
                <p className={styles.type}>
                  Type:{" "}
                  <span >
                    {route.type}
                  </span>
                </p>
                <a
                  className={styles.delete}
                  onClick={() => openModalDelete()}
                >
                  delete
                </a>
              </div>
            </div>
          </div>
        ))}
        <ModalDelete isOpen={isModalDeleteOpen} onClose={closeModalDelete} onConfirm={confirmDelete}></ModalDelete>
      </div>
    </aside>
  );
}