"use client";
import { useState } from "react";

export default function HistoryRouteSidebar({ isOpen, onClose }) {
  if (!isOpen) return null; // ถ้า Sidebar ไม่เปิด ให้คืนค่า null

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

  return (
    <aside
      id="additional-sidebar"
      className="fixed z-50 w-full sm:w-[500px] h-[500px] sm:h-screen bg-gray-100 border-t sm:border-t-0 sm:border-r border-gray-300 bottom-0 sm:top-0 lg:left-64 lg:top-0 transition-transform"
    >
      <div className="h-full px-3 pb-4 overflow-y-auto flex flex-col">
        <h2 className="text-lg font-bold mt-[10px]">History Routes</h2>

        <ul className="bg-white shadow overflow-y-auto sm:rounded-md max-w-lg mx-lg m-2 max-h-lg">
          {routes.map((route, index) => (
            <li
              key={index}
              className={`cursor-pointer border-t border-gray-200 hover:bg-gray-100 transition-all ${route.typeColor}`}
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
                    Edit
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}