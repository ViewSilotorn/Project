"use client";
import styles from '../css/route.module.css';
import ModalDelete from "../modals/ModalDelete";
import { useEffect, useState } from "react";
import { fetchTrips, deleteTripService } from '../services/tripService';
import { subscribeAuthState } from "../services/authService";
import FindingOverlay from '../modals/FindingOverlay'
import showAlert from '../modals/ShowAlert';

export default function HistoryRouteSidebar({ isOpen, onClose, openComponent, mapRef }) {
  if (!isOpen) return null; // ถ้า Sidebar ไม่เปิด ให้คืนค่า null

  // const [currentPage, setCurrentPage] = useState('History Routes');
  const [user, setUser] = useState(null);
  const [idToken, setIdToken] = useState("");
  const [routes, setRoutes] = useState([]);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeAuthState(setUser, setIdToken); // เรียกใช้ service
    return () => unsubscribe(); // เมื่อ component ถูกลบออก, ยกเลิกการ subscribe
  }, []); // ใช้ [] เพื่อให้เพียงแค่ครั้งแรกที่ mount

  //open modal Delete Student
  const openModalDelete = () => {
    // setSelectedUserId(id);
    setIsModalDeleteOpen(true);
  };

  const closeModalDelete = () => {
    setIsModalDeleteOpen(false);
    // setSelectedUserId(null);
  };

  const fetchTripsAgain = async () => {
    setIsLoadingData(true);
    try {
      if (idToken) {
        const data = await fetchTrips(idToken);
        setRoutes(data);
        console.log("Updated Trips:", data);
      }
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setIsLoadingData(false);
    }
  }

  const confirmDelete = async (tripId) => {
    try {
      await deleteTripService(idToken, tripId);

      // Swal.fire({
      //   title: "Deleted!",
      //   text: "Selected data has been deleted successfully.",
      //   icon: "success",
      //   timer: 2000, // ปิดอัตโนมัติใน 2 วินาที
      //   showConfirmButton: false, // ไม่ต้องกดปุ่ม OK
      // });
      showAlert("Deleted success!")
      closeModalDelete();
      await fetchTripsAgain();
    } catch (error) {
      console.error("Error deleting trip:", error);
      alert("Failed to delete trip! Check the console for more details.");
    }

  };


  useEffect(() => {
    //functionดึงข้อมูลจากAPI
    const fetchData = async () => {
      try {
        const data = await fetchTrips();
        console.log('Loaded Trips:', data); // ตรวจสอบข้อมูล
        setRoutes(data); // ตั้งค่า state
      } catch (error) {
        console.error('Error:', error.message);
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  const [isLoading, setIsLoading] = useState();
  const typePage = "history"
  const route_type = "home"

  const findingRouteByTripId = async (trips_id) => {
    try {
      setIsLoading(true); // เริ่มโหลด

      if (mapRef.current) {
        const { routes, routeColors, routeDistance, routeDuration, Didu } = await mapRef.current.handleSubmit(
          0,
          0,
          0,
          true,
          "his",
          trips_id
        );
        // openComponent("Route");
        openComponent("Route", { routes, routeColors, routeDistance, routeDuration, Didu, typePage, route_type});
      }

    } catch (error) {
      console.error("Error in findingRoute:", error);
    } finally {
      setIsLoading(false); // สิ้นสุดโหลด
    }
  };



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
                  <aa
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
          <div key={index} onClick={() => findingRouteByTripId(route.id)} className={`${styles.card} flex w-full my-1 p-4 max-w-lg flex-col rounded-lg bg-white shadow-sm hover:bg-gray-100`}>
            <div className="mt-1 flex items-center justify-between">
              <h3 className={styles.text_school}>{route.school}</h3>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <h3 className={styles.date}>
                {new Intl.DateTimeFormat('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                }).format(new Date(route.dataTime))}
              </h3>
              {/* <p className={`${styles.student} mt-1 max-w-2xl`}>
                  Students: {route.students}
                </p> */}
              <a
                className={styles.delete}
                onClick={(event) => {
                  event.stopPropagation();
                  openModalDelete(route.id);
                }}
              >
                delete
              </a>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <p className={styles.type}>
                Type:{" "}
                <span >
                  {route.types}
                </span>
              </p>
            </div>
            <ModalDelete isOpen={isModalDeleteOpen}
              onClose={(event) => {
                event.stopPropagation(); // ป้องกันการคลิกปิดแล้วไป trigger การคลิกของ card
                closeModalDelete();
              }}
              type='deleteHistory'
              onConfirm={(event) => {
                event.stopPropagation();
                confirmDelete(route.id);
              }}>
            </ModalDelete>
          </div>
        ))}
      </div>
      {isLoading && <FindingOverlay />}
    </aside>
  );
}