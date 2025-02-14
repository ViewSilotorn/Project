"use client";
import { useState, useEffect, useRef } from "react";
import styles from '../css/BusStop.module.css';
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import { fetchStudentAll } from "../services/studentService";

export default function BusToSchoolSidebar({ isOpen, onClose, mapRef, mapElements, onRadiusValuesChange }) {

  if (!isOpen) return null; // ถ้า Sidebar ไม่เปิด ให้คืนค่า null

  const [numVehicles, setNumVehicles] = useState(10);
  const [maxStopsPerVehicle, setMaxStopsPerVehicle] = useState(24);
  const [maxTravelTime, setMaxTravelTime] = useState(100);

  const [openDropdown, setOpenDropdown] = useState(false);

  const toggleDropdown = () => {
    setOpenDropdown(!openDropdown);
  };

  const elements = mapElements || [];

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
  // const toggleStatus = (index) => {
  //   setRows((prevRows) => {
  //     const updated = [...prevRows];
  //     updated[index].isActive = !updated[index].isActive;
  //     return updated;
  //   });
  // };


  // // คลาสกลางสำหรับ input
  // const inputClass = `
  //   w-[80px] p-[5px] 
  //   border border-gray-300 rounded
  //   text-[12px]
  //   focus:outline-none focus:ring-1 focus:ring-blue-500
  // `;

  ///-----------------input add bus stop---------------
  const [fields, setFields] = useState([]); // เก็บข้อมูล input
  const [showFields, setShowFields] = useState(false); // ควบคุมการแสดง input และปุ่ม Clear
  const [radiusValues, setRadiusValues] = useState([]); // สำหรับจัดการ radius ของแต่ละ field
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // สถานะปุ่ม
  const [showFields2, setShowFields2] = useState(true);

  
  const handleAddInput = async () => {
    setIsButtonDisabled(true); // ปิดปุ่มเมื่อกำลังเพิ่มข้อมูล

    // แสดง fields ทันที
    setShowFields(true);

    // เพิ่มฟิลด์ว่างๆ ทันที
    setFields((prevFields) => [...prevFields, ""]);
    setRadiusValues([...radiusValues, 1]);

    // รอให้ผู้ใช้คลิกแผนที่และอัปเดตข้อมูล
    await addInput();
    setIsButtonDisabled(false); // เปิดปุ่มอีกครั้งเมื่อ addInput เสร็จ
  };

  // เพิ่มช่องใหม่
  const addInput = async () => {
    if (mapRef.current) {
      try {
        // รอให้ผู้ใช้คลิกแผนที่
        const lnglat = await mapRef.current.handleAddCircleClick();
        console.log("Longitude and Latitude in BusToSchool:", lnglat);

        // อัปเดต fields ด้วยค่าพิกัดที่ได้จากแผนที่
        setFields((prevFields) => {
          const updatedFields = [...prevFields];
          updatedFields[updatedFields.length - 1] = `${lnglat.lng}, ${lnglat.lat}`; // อัปเดต field ล่าสุดที่ถูกเพิ่มเข้ามา
          return updatedFields;
        });
      } catch (error) {
        console.error("Error in addInput:", error);
      }
    }
    console.log("ปิด");
  };


  const clearAll = () => {
    setFields([]); // ลบ input ทั้งหมด
    setShowFields(false); // ซ่อน input และปุ่ม Clear
    if (mapRef.current) {
      mapRef.current.clearAllElements()
    }
    setRadiusValues([])
    setIsButtonDisabled(false)
  };


  // ลบช่องด้วย index
  const removeInput = (idx) => {
    setFields((prevFields) => prevFields.filter((_, i) => i !== idx)); // ลบ input ตาม index
    setRadiusValues((prevFields) => prevFields.filter((_, i) => i !== idx));
    // setFields(fields.filter((_, i) => i !== idx)); // ลบ input ตาม index
    if (fields.length === 1) {
      setShowFields(false); // ซ่อน input และปุ่ม Clear ถ้าไม่มี input เหลือ
    }
    if (mapRef.current) {
      mapRef.current.removeElement(idx); // เรียก removeElement ผ่าน ref
    }
    setIsButtonDisabled(false)
  };


  // อัปเดตค่าของช่อง input
  const handleChange = (idx, value) => {
    const updatedFields = [...fields];
    updatedFields[idx] = value;
    setFields(updatedFields);
  };

  // const [value, setValue] = useState(0);

  // const handleInputChange = (e) => {
  //   const inputValue = e.target.value;

  //   if (inputValue === "" || (!isNaN(inputValue) && Number(inputValue) >= 0)) {
  //     setValue(inputValue); // อัปเดตค่าใหม่ (รวมถึงกรณีช่องว่าง)
  //   }
  // };

  // const handleIncrement = () => {
  //   setValue((preValue) => (preValue === "" ? 1 : Number(preValue) + 1));
  // };

  // const handleDecrement = () => {
  //   if (value > 0) setValue(value - 1)
  // };

  useEffect(() => {
    // Initialize Geocoder for each field
    fields.forEach((field, index) => {
      if (!field.geocoderRef) {
        const geocoderContainer = document.getElementById(`geocoder-${index}`);
        if (geocoderContainer) {
          const geocoder = new MapboxGeocoder({
            accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
            placeholder: "Search for places...",
            marker: true,
            limit: 3, // จำนวนผลลัพธ์สูงสุดที่แสดง
          });

          geocoder.addTo(geocoderContainer);

          geocoder.on("result", (e) => {
            const { center, place_name } = e.result; // ดึงข้อมูล center (lng, lat)
            const [lng, lat] = center;

            console.log(`Selected Place: ${place_name}`);
            console.log(`Longitude: ${lng}, Latitude: ${lat}`);

            // อัปเดตฟิลด์ด้วยชื่อสถานที่
            handleChange(index, `${place_name} (${lng}, ${lat})`);
          });

          const updatedFields = [...fields];
          updatedFields[index].geocoderRef = geocoder;
          setFields(updatedFields);
        }
      }
    });
  }, [fields]);
  //-------------------

  const handleChangeRadius = (idx, value) => {
    if (/^\d*\.?\d{0,1}$/.test(value)) {
      const updatedRadius = [...radiusValues];

      updatedRadius[idx] = value; // อัปเดตค่า radius ของ field นั้น
      setRadiusValues(updatedRadius);

      // ส่งค่า radius ไปยัง Map เพื่ออัปเดตวงกลม
      if (mapRef.current) {
        mapRef.current.updateCircleRadius(idx, parseFloat(value));  // ส่งไปยัง Map
      }
      // ส่งค่าผ่าน props ไปยัง Parent Component (Sidebar)
      onRadiusValuesChange(updatedRadius); // ส่งค่ากลับไป
    }
  };

  // const toClose = () => {
  //   setFields([]); // ลบ input ทั้งหมด
  //   setShowFields(false); // ซ่อน input และปุ่ม Clear
  //   if (mapRef.current) {
  //     mapRef.current.clearAllElements()
  //   }
  //   setRadiusValues([])
  //   setIsButtonDisabled(false)
  //   onClose()
  // }

  const [dateTime, setDateTime] = useState(null);
  useEffect(() => {
    setDateTime(new Date());
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTabChange = (tabId) => {
    // ถ้าคลิกแท็บเดิมให้ปิดแท็บ (set to null)
    setActiveTab(tabId === activeTab ? null : tabId);
  }
  return (
    <aside
      className="fixed z-50 w-full sm:w-[500px] h-[500px] sm:h-screen bg-white border-t sm:border-t-0 sm:border-r border-gray-300
      bottom-0 sm:top-0 lg:top-0 transition-transform
    "
    >
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
      <div >
        <div className="relative h-screen flex flex-col overflow-y-auto p-5 pl-3" >
          <span className={styles.text_date}>
            {dateTime ? (
              <p>{dateTime.toLocaleString("en-US", { dateStyle: "full" })}</p>
            ) : (
              <p>Loading...</p>
            )}
          </span>
          <div className='py-8'>
            <label className={styles.text_information}>Information</label>
            <div className="flex items-center gap-5 sm:gap-10 py-5">
              <div className="flex flex-col">
                <label>Number of Bus:</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={numVehicles}
                  onChange={(e) => setNumVehicles(e.target.value)}
                  className={`${styles.number_input} mt-2 p-2`}
                />
              </div>

              <div className="flex flex-col">
                <label>Max Capacity:</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={maxStopsPerVehicle}
                  onChange={(e) => setMaxStopsPerVehicle(e.target.value)}
                  className={`${styles.max_input} mt-2 `}
                />
              </div>
              <div className="flex flex-col">
                <label>Time:</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={maxTravelTime}
                  onChange={(e) => setMaxTravelTime(e.target.value)}
                  className={`${styles.time_input} mt-2 `}
                />
              </div>
            </div>
          </div>
          {/* </div> */}
          <div className="">
            <div className="flex justify-between items-center mb-2">
              <span className={styles.busStop}>Bus Stop</span>
              {showFields && (
                <button
                  onClick={clearAll}
                  className="bg-red-500 text-white px-2 py-1 rounded 
               hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 
               text-sm"
                >
                  Clear All
                </button>
              )}
            </div>

            {showFields && (
              <>
                {fields.map((val, idx) => (
                  <div key={idx} className={`${styles.input_text_busStop} relative mt-2`}>
                    <input
                      type="text"
                      value={
                        elements[idx]
                          ? `${elements[idx].lng.toFixed(8)}, ${elements[idx].lat.toFixed(8)}`
                          : val
                      }
                      onChange={(e) => handleChange(idx, e.target.value)}
                      placeholder={`Bus Stop Station ${idx + 1}`}
                      className={styles.input_busStop}
                    />
                    {/* <svg xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="hiiden absolute top-1/2 right-3 w-5 h-5 text-gray-400 transform -translate-y-1/2 cursor-pointer hover:text-gray-600"
                      onClick={() => removeInput(idx)}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg> */}
                    <svg xmlns="http://www.w3.org/2000/svg"
                      fill="none" viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="hiiden absolute top-1/2 right-1 w-5 h-5 text-red-600  -translate-y-1/2 cursor-pointer hover:text-red-600"
                      onClick={() => removeInput(idx)}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                    <input
                      type="number"
                      min="0.0"
                      step="0.1"
                      value={radiusValues[idx] || ""}
                      className={`${styles.input_km} ml-3`}
                      onChange={(e) => handleChangeRadius(idx, e.target.value)}
                    />
                    <span className={styles.text_km}>Km.</span>
                  </div>
                ))}
              </>
            )}
            <div className='mt-3 flex items-center'>
              <button
                onClick={handleAddInput}
                disabled={isButtonDisabled} // ปิดการใช้งานปุ่มถ้ากดแล้ว
                className={`${isButtonDisabled ? "text-gray-400" : "text-blue-600 hover:text-blue-700"
                  } text-sm flex justify-items-center mr-1`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#007BFF" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <div className={`${styles.text_add} ml-2`}>
                  {isButtonDisabled ? "Add other bus stop" : "Add other bus stop"}
                </div>
              </button>
            </div>
            <div className="mt-5">
              <h1 className={styles.text_student}>Students Address</h1>
              <div className={`${styles.card} mt-2`}>
                <div className="flex justify-between p-8">
                  <span className={styles.text}>
                    Routes
                  </span>
                  <div onClick={toggleDropdown} >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5} stroke="currentColor"
                      className="size-6"
                      style={{
                        transform: openDropdown ? "rotate(180deg)" : "rotate(0deg)", // หมุนไอคอน
                        transition: "transform 0.3s ease", // การหมุนมีการ transition
                      }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>

                  </div>
                </div>
              </div>
            </div>
            {openDropdown && (
              <div className={styles.dropdown}>
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                  <li></li>

                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="mt-auto sticky bottom-0 flex justify-center bg-[#f9f9f9] border-t border-gray-300 w-full">
          <div className="bg-white w-screen py-3">
            <button
              className={`${styles.btn_route} mx-auto block bg-blue-500 hover:bg-blue-600 rounded px-4 py-2`}
            >
              Optimize Routes
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}