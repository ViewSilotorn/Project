"use client";
import { useState, useEffect } from "react";
import DetailRouteSidebar from "../components/DetailRoute";
import styles from '../css/HomeToSchools.module.css';
import { subscribeAuthState } from "../services/authService"
import { saveTrip } from "../services/tripService";
import ResetModal from "../modals/ResetModal";
import SaveModal from "../modals/SaveModal";
import showAlert from "../modals/ShowAlert";
import DownLoadModal from "../modals/DownloadModal";

export default function RouteSidebar({ isOpen, openComponent, onClose, mapRef, routes, routeColors, routeDistance, routeDuration, Didu, color, typePage, route_type, bus_SP, student_inBus }) {

  console.log("this st bus ja", student_inBus);

  const [activeComponent, setActiveComponent] = useState("list"); // "list" = หน้ารายการ, "detail" = หน้ารายละเอียด
  const [selectedRoute, setSelectedRoute] = useState(null); // เก็บข้อมูลเส้นทางที่เลือก
  // const [distance, setDistance] = useState(null);

  if (!isOpen) return null; // ถ้า Sidebar ไม่เปิด ให้คืนค่า null

  const [user, setUser] = useState(null);
  const [idToken, setIdToken] = useState(""); // State สำหรับเก็บ token

  useEffect(() => {
    const unsubscribe = subscribeAuthState(setUser, setIdToken); // เรียกใช้ service
    return () => unsubscribe(); // เมื่อ component ถูกลบออก, ยกเลิกการ subscribe
  }, []); // ใช้ [] เพื่อให้เพียงแค่ครั้งแรกที่ mount

  // console.log("F' Route Didu ->>>>"+Didu);
  // console.log("ROUTES Dur ->>>> "+routeDuration);

  const [showResetModal, setshowResetModal] = useState(false);

  const onclick = () => {
    setshowResetModal(true);
  }

  const cancel = () => {
    setshowResetModal(false);
  }

  const [showSaveModal, setshowSaveModal] = useState(false);

  const openModal = () => {
    setshowSaveModal(true);
  }

  const CloseModal = () => {
    setshowSaveModal(false);
  }
  // const handleRouteClick = (route, index) => {
  //   setSelectedRoute({ route, index }); // เก็บข้อมูลเส้นทาง
  //   setActiveComponent("detail"); // เปลี่ยนไปหน้ารายละเอียด
  // };

  const goBack = () => {
    mapRef.current.handleReset();
    setActiveComponent("list"); // กลับไปหน้ารายการ
  };


  const resetRoute = () => {
    if (mapRef.current) {
      mapRef.current.handleReset();
      mapRef.current.clearAllElements()
    }
    openComponent();
  };

  const backpage = () => {
    if (mapRef.current) {
      mapRef.current.handleReset();
      mapRef.current.clearAllElements()
    }
    openComponent('HistoryRoute');
  };

  const closePage = () => {
    if (mapRef.current) {
      mapRef.current.handleReset();
      mapRef.current.clearAllElements()
    }
    onClose()
  };

  const drawRoute = async (route, routeKey, routeColor, type) => {
    // console.log(distance, duration);
    mapRef.current.handleReset();
    await mapRef.current.handleDrawRoute(route, routeKey, routeColor, type);  // draw route

    // setSelectedRoute({ route, routeKey, routeColor, distance, duration}); // เก็บข้อมูลเส้นทาง
    // setActiveComponent("detail"); // เปลี่ยนไปหน้ารายละเอียด
  };
  const goDetail = async (route, routeKey, routeColor, type, distance, duration, route_type, bus_sp) => {
    mapRef.current.handleReset();
    await mapRef.current.handleDrawRoute(route, routeKey, routeColor, type);  // draw route

    setSelectedRoute({ route, routeKey, routeColor, distance, duration, route_type, bus_sp }); // เก็บข้อมูลเส้นทาง
    setActiveComponent("detail"); // เปลี่ยนไปหน้ารายละเอียด
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleSaveTrip = async () => {
    if (!idToken) {
      console.error("No idToken found");
      return;
    }

    setIsLoading(true);


    const formattedRoutes = routes.map((route, index) => ({
      [`route ${index + 1}`]: route,  // แก้ไขให้ route เป็น array ของพิกัดโดยตรง
      color: routeColors[index] || "#000000"  // ใช้สีจาก routeColors หรือค่า default
    }));

    const tripData = {
      school_id: 1,
      types: typePage,
      routes: formattedRoutes
    };

    console.log("this routes:", JSON.stringify(tripData, null, 2));

    try {
      const result = await saveTrip(idToken, tripData);
      
      showAlert("Save complete!")
      console.log("Trip saved successfully:", result);

      if (mapRef.current) {
        mapRef.current.handleReset();
        mapRef.current.clearAllElements()
      }
      openComponent("HistoryRoute");
    } catch (error) {
      console.error("Failed to save trip:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const [showModal, setShowModal] = useState(false);

   // ฟังก์ชันเมื่อกดปุ่ม
   const onButtonClick = () => {
    setShowModal(true); // แสดง Modal เมื่อกดปุ่ม
  };

  const onCloseModal = () => {
    setShowModal(false); // ปิด Modal
  };
  // ฟังก์ชันสำหรับดาวน์โหลดไฟล์ CSV
  const downloadFile = () => {
    // สร้าง CSV จาก routes และ routeColors
    const csvHeaders = `route_name,latitude,longitude,color,${route_type}\n`;
    const csvRows = [];

    // สร้างข้อมูล CSV โดยใช้ข้อมูลจาก routes และ routeColors
    routes.forEach((route, routeIndex) => {
      const routeKey = `route ${routeIndex + 1}`;
      const color = routeColors[routeIndex]; // ใช้สีที่ตรงกับแต่ละ route

      // เพิ่มพิกัดและสีลงใน CSV
      route[routeKey].forEach(coordinate => {
        const [latitude, longitude] = coordinate;
        csvRows.push(`${routeKey},${latitude},${longitude},${color}`);
      });
    });

    // รวม header และ rows
    const csvContent = csvHeaders + csvRows.join("\n");

    // สร้าง Blob จากข้อมูล CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // สร้าง URL สำหรับดาวน์โหลด
    const url = URL.createObjectURL(blob);

    // สร้าง link สำหรับดาวน์โหลด
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'routes_data.csv');

    // คลิกเพื่อดาวน์โหลด
    link.click();

    // ทำลาย URL หลังจากการดาวน์โหลดเสร็จ
    URL.revokeObjectURL(url);

    showAlert("Download complete!");
    setShowModal(false); // ปิด Modal
  };



  return (
    <aside
      id="additional-sidebar"
      className="fixed z-50 w-full sm:w-[500px] h-[500px] sm:h-screen bg-white border-t sm:border-t-0 sm:border-r border-gray-300 
             bottom-0 sm:top-0 lg:top-0 transition-transform"
    >
      <div className="h-full flex flex-col overflow-y-auto px-3 pb-0">

        {/* <button
          type="button"
          className="bg-transparent hover:bg-gray-200  rounded-lg z-20 p-1.5 absolute top-1.5 end-4 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
        </button> */}
        {/* Sticky top */}
        <div className="sticky top-0">
          <div className="flex items-center justify-center mt-5 mb-2">
            <button
              onClick={backpage}
              className="p-2 rounded"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>

            </button>
            <div className="flex items-center grow justify-center mr-5">
              <h1 className={styles.Route}>Routes All</h1>
            </div>
          </div>
        </div>
        <hr></hr>

        <div className="overflow-y-auto">
          <div className="w-full sm:w-full mx-auto p-4">
            <ul className="space-y-3 w-full">
              {/* เพิ่มรายการ All */}
              <li
                key="all"
                className={`${styles.card_route} flex items-center justify-between w-full hover:bg-gray-100 transition-colors `}
                onClick={() => {
                  routes.forEach((route, index) => {
                    drawRoute(routes[index], `route ${index + 1}`, routeColors[index], true);
                    // handleRouteClick(route, index);
                  });
                }}

              >

                {/* สีแท็บแสดงสถานะ */}
                <div className={`w-3 sm:w-5 h-full rounded-l-lg`} style={{
                  background: `linear-gradient(${routeColors.join(", ")})`,
                }}></div>

                {/* ข้อมูลเส้นทาง */}
                <div className="flex-1 px-4">
                  <p className="mb-1 ">
                    <strong>Route:</strong> All
                  </p>
                  {/* <p className="mb-1 text-xs sm:text-sm">
                    <strong>Distance:</strong> 
                  </p>
                  <p className="text-xs sm:text-sm">
                    <strong>Time:</strong> 
                  </p>
                  <p className="text-xs sm:text-sm">
                    <strong>Students:</strong> All
                  </p> */}
                </div>

                {/* ไอคอนลูกศร */}
                {/* <div className="flex items-center mr-2 sm:mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-4 sm:w-5 h-4 sm:h-5 gray-800 transition-colors"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </div> */}
              </li>

              {/* แมปข้อมูล items */}
              {routes.map((route, index) => {
                const diduArray = JSON.parse(Didu);
                console.log(route[`route ${index + 1}`]);
                return (
                  <li
                    key={index}
                    className={`${styles.card_route} flex items-center justify-between w-full hover:bg-gray-100 transition-colors `}
                  >
                    {/* สีแท็บแสดงสถานะ */}
                    <div
                      className={`w-3 sm:w-5 h-full rounded-l-lg`}
                      style={{ backgroundColor: routeColors[index] }}
                    ></div>

                    {/* <div className="flex px-5 items-center">
                      <div style={{ width: '40px', height: '40px', backgroundColor: routeColors[index] }}>
                      </div>
                    </div> */}

                    {/* ข้อมูลเส้นทาง */}
                    <div
                      className="flex-1 px-5"
                      onClick={() => {
                        drawRoute(route, `route ${index + 1}`, routeColors[index], true);
                        // handleRouteClick(route, index)
                      }}
                    >
                      <p className={`${styles.text_routedetail} py-1`}>
                        Route {index + 1}
                      </p>
                      <p className={`${styles.text_detail} py-1`}>
                        Distance: {diduArray[index].distance} Km.
                      </p>
                      <p className={`${styles.text_detail} py-1`}>
                        Time: {diduArray[index].duration} Min.
                      </p>
                      <p className={`${styles.text_detail} py-1`}>
                        {route_type === "home" ? (
                          <>
                            Students: {route[`route ${index + 1}`] ? route[`route ${index + 1}`].length - 2 : 0}
                          </>
                        ) : route_type === "bus" ? (
                          <>
                            Students: {bus_SP[index] && bus_SP[index][`bus ${index + 1}`] ? bus_SP[index][`bus ${index + 1}`].length : 0}
                          </>
                        ) : (
                          <>
                            Students: {route[`route ${index + 1}`] ? route[`route ${index + 1}`].length - 2 : 0}
                          </>
                        )}
                      </p>
                    </div>

                    {/* ไอคอนลูกศร */}
                    <div
                      onClick={() =>
                        route_type === "home" ?
                          goDetail(
                            route,
                            `route ${index + 1}`,
                            routeColors[index],
                            false,
                            diduArray[index].distance,
                            diduArray[index].duration,
                            route_type
                          )
                          : goDetail(
                            route,
                            `route ${index + 1}`,
                            routeColors[index],
                            false,
                            diduArray[index].distance,
                            diduArray[index].duration,
                            route_type,
                            bus_SP[index]
                          )
                      }
                      className="flex items-center mr-2 sm:mr-4 hover:text-blue-500">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                      </svg>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        {typePage === "Home To School" || typePage === "Bus To School" ? (
          <div className="mt-auto sticky bottom-0 left-0 right-0 bg-white border-t pt-6 pb-[20px] flex justify-between space-x-3">
            <button
              onClick={() => onclick()}
              className={` ${styles.btn_reset} flex-1 `}
            >
              Reset
            </button>
            <button
              onClick={openModal}
              disabled={isLoading}
              className={` ${styles.btn_save} flex-1 `}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        ) : typePage === "history" ? (
          <div className="mt-auto sticky bottom-0 left-0 right-0 bg-white border-t pt-6 pb-[20px] flex  justify-center space-x-3">
            {/* <button
                onClick={closePage}
                className="flex-1 text-white bg-red-500 p-2 rounded hover:bg-red-600"
              >
                Close
              </button> */}
            <button
              onClick={onButtonClick}
              className={styles.btn_download}
            >
              Download
            </button>
          </div>
        ) : (
          <div className="mt-auto sticky bottom-0 left-0 right-0 bg-gray-100 border-t pt-6 pb-[20px] flex justify-between space-x-3">
            <button
              onClick={closePage}
              className="flex-1 text-white bg-red-500 p-2 rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        )}

      </div>

      <ResetModal isOpen={showResetModal} onClose={cancel} resetRoute={resetRoute}></ResetModal>
      <SaveModal isOpen={showSaveModal} onClose={CloseModal} handleSaveTrip={handleSaveTrip}></SaveModal>
      <DownLoadModal isOpen={showModal} onClose={onCloseModal} onDownload={downloadFile}></DownLoadModal>

      {activeComponent === "detail" && selectedRoute && (
        <DetailRouteSidebar
          mapRef={mapRef}
          route={selectedRoute.route}
          routeIndex={selectedRoute.routeKey}
          color={selectedRoute.routeColor}
          distance={selectedRoute.distance}
          duration={selectedRoute.duration}
          route_type={selectedRoute.route_type}
          bus_SP={selectedRoute.bus_sp}

          onGoBack={goBack}
        />
      )}
    </aside>
  );
}
