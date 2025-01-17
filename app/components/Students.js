"use client";
import { useEffect, useState } from "react";
import St from '../css/student.module.css';
import HandleDelete from "../services/HandleDelete";
import AddStudent from "../components/AddStudent"
import ListStudent from "../components/ListStudent"
import EditStudent from "../components/EditStudent"
import ModalDelete from "./ModalDelete";
import { fetchStudents } from "../services/studentService";

const host = process.env.NEXT_PUBLIC_API_HOST;
const port = process.env.NEXT_PUBLIC_API_PORT;

// สร้าง base URL
const apiBaseUrl = `${host}:${port}`;

export default function StudentSidebar({ isOpen, onClose }) {
  if (!isOpen) return null; // ถ้า Sidebar ไม่เปิด ให้คืนค่า null

  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [isEdit, setisEdit] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [openAddStudent, setOpenAddStudent] = useState(false);
  const openAddStudentModal = () => setOpenAddStudent(true);
  const closeAddStudentModal = () => setOpenAddStudent(false);

  const [openListStudent, setOpenListStudent] = useState(false);
  const openListStudentModal = () => setOpenListStudent(true);
  const closeListStudentModal = () => setOpenListStudent(false);

  const [openEditStudent, setOpenEditStudent] = useState(false);
  const openEditStudentModal = (id) => {
    setSelectedUserId(id);
    setOpenEditStudent(true);
};

const closeEditStudentModal = () => {
    setOpenEditStudent(false);
    setSelectedUserId(null);
};


  //Show student
  useEffect(() => {
    const loadStudents = async () => {
      try {
        const data = await fetchStudents(currentPage);
        console.log(data);
        setStudents(data.students);  // ตั้งค่าข้อมูลนักเรียน
        setTotalCount(data.total_count);  // ตั้งค่าจำนวนรวมของนักเรียน
        setPerPage(data.per_page);  // ตั้งค่าจำนวนนักเรียนต่อหน้า
      } catch (error) {
        setError(error.message);
      }
    };

    loadStudents();
  }, [currentPage]);


  const openModalDelete = (id) => {
    setSelectedUserId(id);
    setIsModalDeleteOpen(true);
  };

  const closeModalDelete = () => {
    setIsModalDeleteOpen(false);
    setSelectedUserId(null);
  };

  const confirmDelete = async () => {
    if (selectedUserId !== null) {
      await HandleDelete(selectedUserId);
      setStudents((prevStudents) => prevStudents.filter((student) => student.id !== selectedUserId));
      closeModalDelete();
    }
  };

  const [selectedAll, setSelectedAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setSelectedAll(isChecked);
    if (isChecked) {
      setSelectedRows(students.map((student) => student.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleRowSelect = (id) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((rowId) => rowId !== id)
        : [...prevSelected, id]
    );
  };

  const totalPages = Math.ceil(totalCount / perPage);
  const maxButtonsToShow = 5; // จำนวนปุ่มที่ต้องการแสดง
  const startPage = Math.floor((currentPage - 1) / maxButtonsToShow) * maxButtonsToShow + 1;
  const endPage = Math.min(startPage + maxButtonsToShow - 1, totalPages);

  // ฟังก์ชันสำหรับการเปลี่ยนหน้า
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleNextPage = () => {
    if (currentPage + maxButtonsToShow <= totalPages) {
      setCurrentPage(currentPage + maxButtonsToShow);
    } else {
      setCurrentPage(totalPages)
    }
  };

  const handlePrev = () => {
    if (currentPage - maxButtonsToShow >= 1) {
      setCurrentPage(currentPage - maxButtonsToShow);
    } else {
      setCurrentPage(1)
    }
  };

  const pageButtons = [];
  for (let i = startPage; i <= endPage; i++) {
    pageButtons.push(
      <li key={i} className="block size-8 rounded border-blue-600 bg-blue-600 text-center leading-8 text-white">
        <button
          onClick={() => handlePageChange(i)}
          className={`block size-8 rounded border ${currentPage === i ? 'bg-blue-600 text-white' : 'border-gray-100 bg-white text-gray-900'}`}
        >
          {i}
        </button>
      </li>
    );
  }

  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Soft by");

  const options = [
    "By First name",
    "By Last name",
    "By Age",
    "By Home address",
    "By Latitude",
    "By Longitude",
    "By Status",
  ];

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    // isOpenDropdown(false);
    // คุณสามารถเพิ่มฟังก์ชันการจัดเรียงข้อมูลที่นี่
    console.log(`Sorting by: ${option}`);
  };

  return (
    <aside
      id="additional-sidebar"
      className="fixed z-50 overflow-x-auto w-full sm:w-[1200px] h-[500px] sm:h-screen bg-gray-100 border-t sm:border-t-0 sm:border-r border-gray-300 
             bottom-0 sm:top-0 lg:left-64 lg:top-0 transition-transform"
    >
      <div className="h-full px-3 pb-4 flex flex-col">
        <header>
          <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-2">
            <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
              {/* <div>
                <h1 className={St.text}>Students</h1>

              </div> */}
              <div className="bg-white flex items-center border border-gray-300 rounded-md max-w-sm">
                <div className="relative flex">
                  <span className="inset-y-0 start-0 grid w-12 place-content-center">
                    <button type="button">
                      <span className="sr-only">Search</span>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </span>
                  {/* Search input */}
                  <input
                    type="text"
                    placeholder="Search..."
                    className={`${St.input_search} p-2 rounded-lg w-full`}
                  />

                  {/* Filter Icon */}
                  <button
                    type="button"
                    className="p-2 text-gray-500 "
                    onClick={() => setIsOpenDropdown(!isOpenDropdown)} // Toggle dropdown visibility
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isOpenDropdown && (
                    <div
                      className="absolute z-10 right-0 mt-12 rounded-md bg-white shadow-lg focus:outline-none"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="menu-button"
                    >
                      <div className="py-1" role="none">
                        {options.map((option) => (
                          <button
                            key={option}
                            onClick={() => handleOptionClick(option)}  // Update the selected option on click
                            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                            role="menuitem"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <div>
                  <button onClick={openAddStudentModal} className={St.btn_add}>
                    Add Student
                  </button>
                </div>
                <div >
                  <button onClick={openListStudentModal} className={St.btn_addList}>
                    Import list of Student
                  </button>
                </div>
                <div >
                  <button className={St.btn_example}>
                    Example File
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>
        {/* Dropdown เมื่อเลือก Checkbox */}
        {selectedRows.length > 0 && (
          <div className="flex items-center space-x-4 p-3">
            <button
              className="flex items-center space-x-2 text-red-500 hover:text-red-700"
              onClick={() => openModalDelete()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>

              <span>Delete</span>
            </button>
          </div>
        )}
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0 ">
              <tr>
                <th scope="col" className="p-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="SelectAll"
                      className="size-5 mt-1.5 rounded border-gray-300"
                      onChange={handleSelectAll}
                      checked={selectedRows.length > 0 && selectedRows.length === students.length ? true : false}
                    />
                    <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                  </div>
                </th>
                <th className={`${St.Header_FN} whitespace-nowrap px-4 py-2`}>First Name</th>
                <th className={`${St.Header_LN} whitespace-nowrap px-4 py-2`}>Last Name</th>
                <th className={`${St.Header_Age} whitespace-nowrap px-4 py-2`}>Age</th>
                <th className={`${St.Header_GD} whitespace-nowrap px-4 py-2`}>Gender</th>
                <th className={`${St.Header_HAdress} whitespace-nowrap px-4 py-2`}>Home Address</th>
                <th className={`${St.Header_Lat} whitespace-nowrap px-4 py-2`}>Latitude</th>
                <th className={`${St.Header_Lng} whitespace-nowrap px-4 py-2`}>Longitude</th>
                <th className={`${St.Header_Status} whitespace-nowrap px-4 py-2`}>Status</th>
                <th className="whitespace-nowrap px-4 py-2 ">Action</th>
              </tr>
            </thead>

            <tbody className={`${St.text_Student} divide-y divide-gray-200`}>
              {students.map((student) => (
                <tr key={student.id}>
                  <td className="w-4 p-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="SelectAll"
                        className="size-5 mt-1.5 rounded border-gray-300"
                        checked={selectedRows.includes(student.id)} onChange={() => handleRowSelect(student.id)} />
                      <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2">{student.first_name} </td>
                  <td className="whitespace-nowrap px-4 py-2">{student.last_name}</td>
                  <td className={`${St.detail_Age} whitespace-nowrap px-4 py-2`}>{student.age}</td>
                  <td className="whitespace-nowrap px-4 py-2">{student.gender}</td>
                  <td className="whitespace-nowrap px-4 py-2">{student.address}</td>
                  <td className={`${St.detail_Lat} whitespace-nowrap px-4 py-2`}>{student.latitude}</td>
                  <td className={`${St.detail_Lng} whitespace-nowrap px-4 py-2`}>{student.longitude}</td>
                  <td className={`${St.detail_status} whitespace-nowrap px-4 py-2`}>{student.status}</td>
                  {/* <td className="sticky inset-y-0 end-0 px-4 py-2"></td> */}
                  <td className="whitespace-nowrap px-4 py-2">
                    <div className="flex space-x-2 ">
                      <button onClick={() => openEditStudentModal(student.id)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#007BFF" className="size-6">
                          <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                          <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                        </svg>
                      </button>
                      <button onClick={() => openModalDelete(student.id)} >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#dc2626" className="size-6">
                          <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* button page change */}
          <ol className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4 p-5">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={(e) => {
                  e.preventDefault(); // Prevent default anchor behavior
                  if (currentPage > 1) setCurrentPage(currentPage - 1);
                }}
                className={`relative inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium ${currentPage > 1 ? 'bg-white text-gray-700 hover:bg-gray-50' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
              >
                Previous
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault(); // Prevent default anchor behavior
                  handleNextPage();
                }}
                className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium ${currentPage < Math.ceil(totalCount / perPage)
                  ? 'bg-white text-gray-700 hover:bg-gray-50'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:items-center sm:justify-between">
              <div>
                <p className={`${St.text_showing}`}>
                  Showing
                  <span className="px-2">{currentPage}</span>
                  to
                  <span className="px-2">{totalPages}</span>
                </p>
              </div>
            </div>
            {/* ปุ่ม Prev */}
            <div className="hidden sm:flex sm:items-center sm:justify-between">
              <li>
                <button
                  onClick={handlePrev}
                  className={`block size-8 rounded border border-gray-100 bg-white text-gray-900 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={currentPage === 1}
                >
                  <span className="sr-only">Prev Page</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-7"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </li>

              {/* ปุ่มตัวเลข */}
              {pageButtons}

              {/* ปุ่ม Next */}
              <li>
                <button
                  onClick={handleNextPage}
                  className={`block size-8 rounded border border-gray-100 bg-white text-gray-900 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={currentPage === totalPages}
                >
                  <span className="sr-only">Next Page</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-7"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </li>
            </div>
          </ol>
        </div>
      </div>
      <AddStudent isOpenAddStudent={openAddStudent} onCloseAddStudent={closeAddStudentModal}></AddStudent>
      <ListStudent isOpenListStudent={openListStudent} onCloseListStudent={closeListStudentModal}></ListStudent>
      <EditStudent isOpenEditStudent={openEditStudent} onCloseEditStudent={closeEditStudentModal}></EditStudent>
      <ModalDelete isOpen={isModalDeleteOpen} onClose={closeModalDelete} onConfirm={confirmDelete}></ModalDelete>
    </aside >
  );
}