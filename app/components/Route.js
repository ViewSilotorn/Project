"use client";
import { useState } from "react";
import DetailRouteSidebar from "../components/DetailRoute";
import styles from '../css/HomeToSchools.module.css';

export default function RouteSidebar({ isOpen, openComponent, onClose, mapRef, routes, routeColors, routeDistance, routeDuration, Didu, color }) {
  const [activeComponent, setActiveComponent] = useState("list"); // "list" = หน้ารายการ, "detail" = หน้ารายละเอียด
  const [selectedRoute, setSelectedRoute] = useState(null); // เก็บข้อมูลเส้นทางที่เลือก
  // const [distance, setDistance] = useState(null);

  if (!isOpen) return null; // ถ้า Sidebar ไม่เปิด ให้คืนค่า null

  // console.log("F' Route Didu ->>>>"+Didu);
  // console.log("ROUTES Dur ->>>> "+routeDuration);

  const [showModal, setShowModal] = useState(false);

  const onclick = () => {
    setShowModal(true);
  }

  const cancel = () => {
    setShowModal(false);
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
    mapRef.current.handleReset();
    openComponent();
  };

  const drawRoute = async (route, routeKey, routeColor, type) => {
    // console.log(distance, duration);
    mapRef.current.handleReset();
    await mapRef.current.handleDrawRoute(route, routeKey, routeColor, type);  // draw route

    // setSelectedRoute({ route, routeKey, routeColor, distance, duration}); // เก็บข้อมูลเส้นทาง
    // setActiveComponent("detail"); // เปลี่ยนไปหน้ารายละเอียด
  };
  const goDetail = async (route, routeKey, routeColor, type, distance, duration) => {
    mapRef.current.handleReset();
    await mapRef.current.handleDrawRoute(route, routeKey, routeColor, type);  // draw route

    setSelectedRoute({ route, routeKey, routeColor, distance, duration }); // เก็บข้อมูลเส้นทาง
    setActiveComponent("detail"); // เปลี่ยนไปหน้ารายละเอียด
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
            <h1 className={styles.Route}>All Routes</h1>
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
                        Students: {route[`route ${index + 1}`] ? route[`route ${index + 1}`].length - 2 : 0}
                      </p>
                    </div>

                    {/* ไอคอนลูกศร */}
                    <div
                      onClick={() =>
                        goDetail(route, `route ${index + 1}`, routeColors[index], false, diduArray[index].distance, diduArray[index].duration)
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

        <div className="mt-auto sticky bottom-0 left-0 right-0 bg-white border-t pt-6 pb-[20px] flex justify-between space-x-3">
          <button
            onClick={() => onclick()}
            className={` ${styles.btn_reset} flex-1 `}
          >
            Reset
          </button>
          <button

            className={` ${styles.btn_save} flex-1 `}
          >
            Save
          </button>
        </div>

      </div>

      {showModal && (
        <div className={styles.modal_overlay}>
          <div className={styles.card_modal}>
            <div className="flex flex-1 flex-col justify-center relative px-6 lg:px-8">

              <button onClick={cancel} tabIndex="-1" type="button" className="absolute top-2 right-2 rtl:right-auto rtl:left-2">
                <svg title="Close" tabIndex="-1" className={styles.close}
                  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"></path>
                </svg>
                <span className="sr-only">
                  Close
                </span>
              </button>

              <div className="space-y-2 p-2 pt-5">
                <div className="p-4 space-y-2">
                  <h2 className={styles.title}>
                    Reset route
                  </h2>
                  <p className={styles.p}>
                    Are you sure you would to do this?
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="px-6 py-4">
                  <div className="grid gap-5 grid-cols-[repeat(auto-fit,minmax(0,1fr))]">
                    <button type="button"
                      onClick={resetRoute}
                      className={`${styles.btn_resetModal} inline-flex items-center justify-center`}>
                      <span className="flex items-center gap-1">
                        <span className={styles.text_resetModal}>
                          Reset
                        </span>
                      </span>
                    </button>
                    <button onClick={cancel}
                      type="button"
                      className={`${styles.btn_cancel} inline-flex items-center justify-center`}>
                      <span className="flex items-center gap-1">
                        <span className={styles.text_cancel}>
                          Cancel
                        </span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>


            {/* <h3>Do you want to download the file?</h3> */}
            {/* <div>
                          <button onClick={onDownload} className={St.btn_yes}>
                            Yes
                          </button>
                          <button onClick={onCloseModal} className={St.btn_no}>
                            No
                          </button>
                        </div> */}
          </div>
        </div>
      )}


      {activeComponent === "detail" && selectedRoute && (
        <DetailRouteSidebar
          mapRef={mapRef}
          route={selectedRoute.route}
          routeIndex={selectedRoute.routeKey}
          color={selectedRoute.routeColor}
          distance={selectedRoute.distance}
          duration={selectedRoute.duration}

          onGoBack={goBack}
        />
      )}
    </aside>
  );
}
