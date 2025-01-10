"use client";

export default function StudentSidebar({ isOpen, onClose }) {
  if (!isOpen) return null; // ถ้า Sidebar ไม่เปิด ให้คืนค่า null

  return (
    <aside
      id="additional-sidebar"
      className="fixed z-50 w-full sm:w-[1000px] h-[500px] sm:h-screen bg-gray-100 border-t sm:border-t-0 sm:border-r border-gray-300 
             bottom-0 sm:top-0 lg:left-64 lg:top-0 transition-transform"
    >
      <div className="h-full px-3 pb-4 overflow-y-auto flex flex-col">
        <h2 className="text-lg font-bold">Students</h2>
        {/* <button
          onClick={onClose}
          className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-700"
        >
          Close Sidebar
        </button> */}

        {/* <div className="mt-auto">

          <button
            onClick={onClose}
            className="mt-4 w-full bg-green-500 text-white p-2 rounded hover:bg-green-700"
          >
            Optimize Routes
          </button>
        </div> */}
      </div>
    </aside>
  );
}