"use client";
import { useState, useEffect, useRef } from "react";
import styles from '../css/BusStop.module.css';

export default function BusToSchoolSidebar({ isOpen, onClose }) {

  if (!isOpen) return null; // ถ้า Sidebar ไม่เปิด ให้คืนค่า null

  const [numVehicles, setNumVehicles] = useState(10);
  const [maxStopsPerVehicle, setMaxStopsPerVehicle] = useState(20);
  const [maxTravelTime, setMaxTravelTime] = useState(150);

  const [rows, setRows] = useState([
    { id: 1, name: "John Doe", email: "johndoe@gmail.com", phone: "555-555-5555", isActive: true },
    { id: 2, name: "Jane Doe", email: "janedoe@gmail.com", phone: "555-555-5555", isActive: false },
    { id: 3, name: "Mark Smith", email: "marksmith@gmail.com", phone: "444-444-4444", isActive: true },
    { id: 4, name: "John Doe", email: "johndoe@gmail.com", phone: "555-555-5555", isActive: true },
    { id: 5, name: "Jane Doe", email: "janedoe@gmail.com", phone: "555-555-5555", isActive: false },
    { id: 6, name: "Mark Smith", email: "marksmith@gmail.com", phone: "444-444-4444", isActive: true },
    { id: 7, name: "John Doe", email: "johndoe@gmail.com", phone: "555-555-5555", isActive: true },
    { id: 8, name: "Jane Doe", email: "janedoe@gmail.com", phone: "555-555-5555", isActive: false },
    { id: 9, name: "Mark Smith", email: "marksmith@gmail.com", phone: "444-444-4444", isActive: true },
    { id: 10, name: "John Doe", email: "johndoe@gmail.com", phone: "555-555-5555", isActive: true },
  ]);

  // toggleStatus (สลับ Active/Inactive)
  const toggleStatus = (index) => {
    setRows((prevRows) => {
      const updated = [...prevRows];
      updated[index].isActive = !updated[index].isActive;
      return updated;
    });
  };


  // คลาสกลางสำหรับ input
  const inputClass = `
    w-[80px] p-[5px] 
    border border-gray-300 rounded
    text-[12px]
    focus:outline-none focus:ring-1 focus:ring-blue-500
  `;

  ///-----------------------------------------------------------

  const [fields, setFields] = useState([""]); // เริ่มต้น 1 ช่อง

  // เพิ่มช่องใหม่
  const addInput = () => {
    setFields((prev) => [...prev, ""]);
  };

  const clearAll = () => {
    setFields([""]);
  };

  // ลบช่องด้วย index
  const removeInput = (index) => {
    setFields((prev) => {
      const updated = [...prev];
      updated.splice(index, 1); // ลบ 1 ช่องที่ตำแหน่ง index
      return updated;
    });
  };

  // อัปเดตค่าของช่อง input
  const handleChange = (index, value) => {
    setFields((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };
  const [value, setValue] = useState(0);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;

    if (inputValue === "" || (!isNaN(inputValue) && Number(inputValue) >= 0)) {
      setValue(inputValue); // อัปเดตค่าใหม่ (รวมถึงกรณีช่องว่าง)
    }
  };

  const handleIncrement = () => {
    setValue((preValue) => (preValue === "" ? 1 : Number(preValue) + 1));
  };

  const handleDecrement = () => {
    if (value > 0) setValue(value - 1)
  };

  ///-----------------------------------------------------------
  return (
    <aside
      className="
      fixed z-50 w-full sm:w-[500px] 
      h-[500px] sm:h-screen
      bg-gray-100 border-t sm:border-t-0 sm:border-r border-gray-300
      bottom-0 sm:top-0 lg:left-64 lg:top-0
      transition-transform overflow-x-auto
    "
    >
      <div >
        <div className="relative h-screen flex flex-col overflow-y-auto p-5 pl-3" >
          <div className="flex  items-center gap-2">
            <div className="relative">
              <label htmlFor="Search" className="sr-only"> Search </label>
              <input
                type="text"
                id="Search"
                placeholder="Search..."
                className={`${styles.input_search} bg-white  py-2 px-10 border border-gray-400 rounded shadow`}
              />
              <span className="absolute inset-y-0 start-0 grid w-12 place-content-center">
                <button type="button">
                  <span className="sr-only">Search</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#00000029" className="size-6">
                    <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
                  </svg>
                </button>
              </span>
            </div>
            <div>
              <button className={`${styles.btn_filter}`}>
                <div className="flex justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#00000029" className="size-6">
                    <path fillRule="evenodd" d="M3.792 2.938A49.069 49.069 0 0 1 12 2.25c2.797 0 5.54.236 8.209.688a1.857 1.857 0 0 1 1.541 1.836v1.044a3 3 0 0 1-.879 2.121l-6.182 6.182a1.5 1.5 0 0 0-.439 1.061v2.927a3 3 0 0 1-1.658 2.684l-1.757.878A.75.75 0 0 1 9.75 21v-5.818a1.5 1.5 0 0 0-.44-1.06L3.13 7.938a3 3 0 0 1-.879-2.121V4.774c0-.897.64-1.683 1.542-1.836Z" clipRule="evenodd" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
          <div className='mt-10'>
            <span className={styles.stop_point}>Stopping Point</span>
          </div>
          <div className={styles.input_text_stp}>
            <input
              type="text"
              placeholder="Enter Stopping Point"
              className={styles.input_stp}
            />
          </div>
          <div className="flex flex-col items-start space-y-1 mt-8">
            <span className={styles.number}>Number of cars (Up to 4)</span>
            <div className="flex items-center">
              <input
                className={`${styles.number_input} mt-2 text-center`}
                value={value}
                onChange={handleInputChange}
                min="0"
              />
              <div className={`${styles.number_btn} p-1 mt-2 flex flex-col items-center`}>
                <button
                  onClick={handleIncrement}
                  className="disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                  </svg>
                </button>
                <button
                  onClick={handleDecrement}
                  className="disabled:opacity-50"
                  disabled={value <= 0}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <span className={styles.busStop}>Bus Stop</span>
          </div>
          {fields.map((val, idx) => (
            <div key={idx} className={`${styles.input_text_busStop} relative mt-2`}>
              <input
                type="text"
                value={val}
                onChange={(e) => handleChange(idx, e.target.value)}
                placeholder={`Bus Stop Station ${idx + 1}`}
                className={styles.input_busStop}
              />
              <svg xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="hiiden absolute top-1/2 right-3 w-5 h-5 text-gray-400 transform -translate-y-1/2 cursor-pointer hover:text-gray-600"
                onClick={() => removeInput(idx)}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>

            </div>
          ))}
          <div className='mt-3 flex items-center'>
            <div onClick={addInput}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#007BFF" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>

            </div>
            <div className={`${styles.text_add} ml-2`}>
              <span>Add other bus stop</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}