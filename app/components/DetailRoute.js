"use client";

export default function DetailRouteSidebar({ route, routeIndex, color, distance, duration, onGoBack,  }) {
  // console.log("Dis "+distance, "Dura "+duration);
  

  return (
    <aside
      id="detail-sidebar"
      className="fixed z-50 w-full sm:w-[500px] 
        h-[450px] sm:h-screen
        bg-gray-100 border-t sm:border-t-0 sm:border-r border-gray-300
        bottom-0 sm:top-0 lg:top-0
        transition-transform"
    >
      <div className="h-full flex flex-col px-3 pb-0">

        {/* Sticky top */}
        <div className="sticky top-0 bg-gray-100">
          <div className="flex items-center justify-between mt-2 mb-2">
            <button
              onClick={onGoBack}
              className="bg-gray-300 text-black p-2 rounded hover:bg-gray-400 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="mb-[5px] ">
          <div className="flex mt-5 items-center">
          <div style={{ width: '25px' , height:'25px', backgroundColor: color, borderRadius: '3px', marginRight: '5px'}}>
          </div>
            <p>
              <strong>Route:</strong> {routeIndex.replace("route ", "")}
            </p>

          </div>

          <div className="flex justify-between mb-2 mt">
            <p className="text-black">
              <strong>Distance:</strong> {distance} KM.
            </p>

            <p className="text-black">
              <strong>Distance:</strong> {duration} MIN.
            </p>
          </div>

            {/* <p className="mt-4">
            <strong>Route Info:</strong> {route}
          </p> */}
        </div>
        <hr></hr>

        <div className="overflow-y-auto mt-5 mb-5">
            {Object.entries(route).map(([key, value], index) => (
              <div key={index} >
                <ul >
                  {value.map((coordinate, idx) => (
                    <div className="cursor-pointer" key={idx} style={{ backgroundColor: '#CECECE', height: '45px', marginBottom: '10px', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {/* แสดงว่าเป็น Start หรือ Stop */}
                      {idx === 0 && <p className="text-green-500 font-bold mr-4">Start Schools</p>}
                      {idx === value.length - 1 && (
                        <p className="text-red-500 font-bold mr-4">Stop Schools</p>
                      )}
                      <p className="text-black mr-4">{idx + 1} #</p>
                      <p className="text-black">[{coordinate[0]}, {coordinate[1]}]</p>
                    </div>

                  ))}
                </ul>
                <p className="text-black">{value.length}</p>
              </div>
              
            ))}
          </div>


      </div>
    </aside>
  );
}
