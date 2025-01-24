"use client";

export default function RouteSidebar({ isOpen, openComponent, onClose }) {
  if (!isOpen) return null; // ถ้า Sidebar ไม่เปิด ให้คืนค่า null

  const items = [
    { name: "1", distance: "5 กม.", time: "10 นาที", color: "bg-red-500" },
    { name: "2", distance: "10 กม.", time: "20 นาที", color: "bg-blue-500" },
    { name: "3", distance: "15 กม.", time: "30 นาที", color: "bg-green-500" },
    { name: "4", distance: "20 กม.", time: "40 นาที", color: "bg-purple-500" },
    { name: "5", distance: "5 กม.", time: "10 นาที", color: "bg-red-500" }

  ];
  
  return (
    <aside
      id="additional-sidebar"
      className="fixed z-50 w-full sm:w-[500px] h-[500px] sm:h-screen bg-gray-100 border-t sm:border-t-0 sm:border-r border-gray-300 
             bottom-0 sm:top-0 lg:left-64 lg:top-0 transition-transform"
    >
      <div className="h-full flex flex-col overflow-y-auto px-3 pb-0">
        
        <div onClick={() => openComponent("HomeToSchools")} className="cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 text-gray-800 font-bold mt-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
            />
          </svg>
        </div>


        <h2 className="text-lg font-bold mt-[10px]">Routes</h2>

        <div className="max-w-3xl mx-auto p-4">
          <ul className="space-y-3">
            {items.map((item, index) => (
              <li
                key={index}
                className={`cursor-pointer flex items-center flex-row justify-between sm:items-center w-[350px] sm:w-[400px] h-[100px] rounded-lg text-gray-800 bg-white hover:bg-gray-100 transition-colors shadow-md hover:shadow-lg`}
              >
                {/* สีแท็บแสดงสถานะ */}
                <div className={`w-5 h-full rounded-l-lg ${item.color}`}></div>

                {/* ข้อมูลเส้นทาง */}
                <div className="flex-1 px-2">
                  <p className="mb-1 text-sm font-medium">
                    <strong>Route:</strong> {item.name} #
                  </p>
                  <p className="mb-1 text-sm">
                    <strong>Distance:</strong> {item.distance}
                  </p>
                  <p className="text-sm">
                    <strong>Time:</strong> {item.time}
                  </p>
                  <p className="text-sm">
                    <strong>Students:</strong> {item.time}
                  </p>
                </div>

                {/* ไอคอนลูกศร */}
                <div className="flex items-center mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5 gray-800 transition-colors"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto sticky bottom-0 left-0 right-0 bg-gray-100 border-t pt-6 pb-[20px] flex justify-between space-x-4">
          <button
  
            className="flex-1 bg-red-500 text-white p-2 rounded hover:bg-red-700"
          >
            Reset
          </button>
          <button
    
            className="flex-1 bg-green-500 text-white p-2 rounded hover:bg-green-700"
          >
            Save
          </button>
        </div>

      </div>
    </aside>
  );
}
