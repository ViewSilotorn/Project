
"use client";


import { useState } from "react";
import DetailRouteSidebar from "../components/DetailRoute";

export default function RouteSidebar({ isOpen, openComponent, onClose, mapRef, routes, routeColors, routeDistance, routeDuration, Didu }) {
  const [activeComponent, setActiveComponent] = useState("list"); // "list" = หน้ารายการ, "detail" = หน้ารายละเอียด
  const [selectedRoute, setSelectedRoute] = useState(null); // เก็บข้อมูลเส้นทางที่เลือก
  // const [distance, setDistance] = useState(null);

  if (!isOpen) return null; // ถ้า Sidebar ไม่เปิด ให้คืนค่า null

  // console.log("F' Route Didu ->>>>"+Didu);
  // console.log("ROUTES Dur ->>>> "+routeDuration);




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
    openComponent("HomeToSchools");
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
      className="fixed z-50 w-full sm:w-[500px] h-[500px] sm:h-screen bg-[#f9f9f9] border-t sm:border-t-0 sm:border-r border-gray-300 
             bottom-0 sm:top-0 lg:left-64 lg:top-0 transition-transform"
    >
      <div className="h-full flex flex-col overflow-y-auto px-3 pb-0">

        {/* Sticky top */}
        <div className="sticky top-0 bg-gray-100">
          <div className="flex items-center justify-between mt-2 mb-2">
            <h2 className="text-lg font-bold">Routes</h2>
          </div>
        </div>



        <div className="overflow-y-auto">
          <div className="w-full sm:w-full mx-auto p-4">
            <ul className="space-y-3 w-full">
              {/* เพิ่มรายการ All */}
              <li
                key="all"
                className={`cursor-pointer flex items-center justify-between w-full h-[80px] sm:h-[100px] rounded-lg text-gray-800 bg-white hover:bg-gray-100 transition-colors shadow-md hover:shadow-lg`}
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
                  <p className="mb-1 text-xs sm:text-sm font-medium">
                    <strong>Route:</strong> All #
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
                return (
                  <li
                    key={index}
                    className={`cursor-pointer flex items-center justify-between w-full h-[80px] sm:h-[100px] rounded-lg text-gray-800 bg-white hover:bg-gray-100 transition-colors shadow-md hover:shadow-lg`}
                  >
                    {/* สีแท็บแสดงสถานะ */}
                    <div
                      className={`w-3 sm:w-5 h-full rounded-l-lg`}
                      style={{ backgroundColor: routeColors[index] }}
                    ></div>

                    {/* ข้อมูลเส้นทาง */}
                    <div
                      className="flex-1 px-4"
                      onClick={() => {


                        drawRoute(route, `route ${index + 1}`, routeColors[index], true);
                        // handleRouteClick(route, index)
                      }}
                    >
                      <p className="mb-1 text-xs sm:text-sm font-medium">
                        <strong>Route:</strong> {index + 1} #
                      </p>
                      <p className="mb-1 text-xs sm:text-sm">
                        <strong>Distance:</strong> {diduArray[index].distance} KM
                      </p>
                      <p className="text-xs sm:text-sm">
                        <strong>Time:</strong> {diduArray[index].duration} Min
                      </p>
                      <p className="text-xs sm:text-sm">
                        <strong>Students: { }</strong>
                      </p>
                    </div>

                    {/* ไอคอนลูกศร */}
                    <div
                      onClick={() =>
                        goDetail(route, `route ${index + 1}`, routeColors[index], true, diduArray[index].distance, diduArray[index].duration)
                      }
                      className="flex items-center mr-2 sm:mr-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-4 sm:w-5 h-4 sm:h-5 gray-800 transition-colors hover:stroke-blue-600 "
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8.25 4.5l7.5 7.5-7.5 7.5"
                        />
                      </svg>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-auto sticky bottom-0 left-0 right-0 bg-gray-100 border-t pt-6 pb-[20px] flex justify-between space-x-3">
          <button
            onClick={resetRoute}
            className="flex-1 text-white bg-red-500 p-2 rounded hover:bg-red-600"
          >
            Reset
          </button>
          <button
            className="flex-1 text-white bg-green-500 p-2 rounded hover:bg-green-600"
          >
            Save
          </button>
        </div>

      </div>



      {activeComponent === "detail" && selectedRoute && (
        <DetailRouteSidebar
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
