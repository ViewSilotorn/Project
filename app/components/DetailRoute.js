"use client";
import { useEffect, useState } from "react";
import styles from '../css/HomeToSchools.module.css';
import { fetchStudentBatchData } from "../services/studentService";
import { subscribeAuthState } from "../services/authService"; // Service สำหรับ auth state

export default function DetailRouteSidebar({ route, routeIndex, color, distance, duration, onGoBack, mapRef, route_type, bus_SP }) {
  // console.log("Dis "+distance, "Dura "+duration);

  // console.log("Yoo this is : "+JSON.stringify(bus_SP, null, 2));
  // console.log("Yoo Route is : "+ JSON.stringify(route, null, 2));
  

  const [user, setUser] = useState(null);
  const [idToken, setIdToken] = useState("");
  const [coordinates, setCoordinates] = useState([]);
  const [studentData, setStudentData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeAuthState(setUser, setIdToken);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const allCoordinates = [];

    if (route_type === "home") {
      if (route && typeof route === "object") {
        Object.entries(route).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((coordinate) => {
              const [lat, lng] = coordinate;
              allCoordinates.push({ lat, lng });
            });
          }
        });
      }
    } else {
      if (bus_SP && typeof bus_SP === "object"){
        Object.entries(bus_SP).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((coordinate) => {
              const [lat, lng] = coordinate;
              allCoordinates.push({ lat, lng });
            });
          }
        })
      }
    }

    setCoordinates(allCoordinates);
    console.log("Coordinates length:", allCoordinates.length);
  }, [route, route_type, bus_SP]);

  useEffect(() => {
    const fetchStudentDataForBatch = async () => {
      try {
        const fetchedData = await fetchStudentBatchData(idToken, coordinates);
        setStudentData(fetchedData);
        console.log("Fetched Student Data:", fetchedData);
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (coordinates.length > 0 && idToken) {
      fetchStudentDataForBatch();
    }
  }, [coordinates, idToken]);

  const idClick = (id) => {
    console.log("นี่ๆ ID: " + id);
  };

  const goMarker = (id) => {
    mapRef.current.goMarkerById(id);
  };


  return (
    <aside
      id="detail-sidebar"
      className="fixed z-50 w-full sm:w-[500px] 
        h-[450px] sm:h-screen
        bg-white border-t sm:border-t-0 sm:border-r border-gray-300
        bottom-0 sm:top-0 lg:top-0
        transition-transform"
    >
      <div className="h-full flex flex-col px-3 pb-0">

        {/* Sticky top */}
        <div className="sticky top-0 bg-white">
          <div className="flex items-center justify-between mt-5 mb-2">
            <button
              onClick={onGoBack}
              className="p-2 rounded"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>

            </button>
            <div className="flex items-center grow justify-center mr-5">
              <div style={{ width: '40px', height: '40px', backgroundColor: color }}>
              </div>
              <p className="px-2">
                <strong>Route:</strong> {routeIndex.replace("route ", "")}
              </p>

            </div>
          </div>

        </div>
        <hr></hr>
        <div className=" mt-5">


          <div className="flex justify-between">
            <p className="text-black">
              <strong>Distance:</strong> {distance} KM.
            </p>

            <p className="text-black">
              <strong>Duration:</strong> {duration} MIN.
            </p>
          </div>

          {/* <p className="mt-4">
            <strong>Route Info:</strong> {route}
          </p> */}
        </div>


        <div className="overflow-y-auto mt-2 mb-5 ">
          {studentData.map((data, index) => (

            <div
              key={index}
              onClick={() => goMarker(data.id)}
              className={`${styles.card_detail} mt-2 cursor-pointer  hover:bg-gray-100 `}
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <div className="px-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="#265CB3" className="size-10">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
              </div>
              <div className="flex w-full flex-col">
                <div className="flex items-center justify-between">
                  <h5 className={styles.text_name}>
                    {data.first_name}   {data.last_name}
                  </h5>
                </div>
                <p className={styles.text_adress}>
                  {data.address}
                </p>
              </div>
            
            </div>
          ))}
        </div>

      </div>
    </aside>
  );
}
