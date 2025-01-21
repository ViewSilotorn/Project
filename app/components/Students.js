"use client";
import { useEffect, useState } from "react";
import St from '../css/student.module.css';
import HandleDelete from "../services/HandleDelete";
import AddStudent from "../components/AddStudent"
import ListStudent from "../components/ListStudent"
import EditStudent from "../components/EditStudent"
import ModalDelete from "./ModalDelete";
import { fetchStudents, deleteStudents } from "../services/studentService";

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
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [openAddStudent, setOpenAddStudent] = useState(false);
  const openAddStudentModal = () => setOpenAddStudent(true);//open modal AddStudent
  const closeAddStudentModal = () => setOpenAddStudent(false);
  //   const handleAddStudents = () => {
  //     setStudents((prevStudents) => prevStudents.filter((student) => student.id !== selectedUserId));
  // };

  const [openListStudent, setOpenListStudent] = useState(false);
  const openListStudentModal = () => setOpenListStudent(true);//open modal Import Student
  const closeListStudentModal = () => setOpenListStudent(false);

  const [sid, setsid] = useState(null);//ส่งid

  const [openEditStudent, setOpenEditStudent] = useState(false);
  const openEditStudent2 = (id) => {//open modal Edit Student
    setsid(id);
    setOpenEditStudent(true)
  }
  const closeEditStudentModal = () => setOpenEditStudent(false);


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

  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  //open modal Delete Student
  const openModalDelete = (id) => {
    setSelectedUserId(id);
    setIsModalDeleteOpen(true);
  };

  const closeModalDelete = () => {
    setIsModalDeleteOpen(false);
    setSelectedUserId(null);
  };

  //delete student on id
  const confirmDelete = async () => {
    if (selectedUserId !== null) {
      await HandleDelete(selectedUserId);
      setStudents((prevStudents) => prevStudents.filter((student) => student.id !== selectedUserId));
      closeModalDelete();
    }
  };


  const [selectedRows, setSelectedRows] = useState([]);

  // Handle "Select All" checkbox
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      // ถ้าเลือกทั้งหมดให้เลือกทุก ID ในหน้าปัจจุบัน
      setSelectedRows(students.map((student) => student.id));
    } else {
      // ถ้าไม่เลือกทั้งหมดให้ลบการเลือกทั้งหมด
      setSelectedRows([]);
    }
  };

  // Handle individual row selection
  const handleRowSelect = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedRows.length === 0) {
      alert("Please select items to delete");
      return;
    }

    const confirmDelete = confirm("Are you sure you want to delete selected items?");
    if (!confirmDelete) return;

    try {
      // ลบทีละ ID ใน selectedRows
      for (const id of selectedRows) {
        await deleteStudents(id);
      }

      // อัปเดต UI หลังลบสำเร็จ
      setStudents((prevStudents) =>
        prevStudents.filter((student) => !selectedRows.includes(student.id))
      );

      setSelectedRows([]); // รีเซ็ตการเลือก
      alert("Selected data deleted successfully");
    } catch (error) {
      alert("An error occurred while deleting data.");
      console.error("Error:", error);
    }
  };



  // const [selectedAll, setSelectedAll] = useState(false);
  // const [selectedRows, setSelectedRows] = useState([]);

  // //check box All
  // const handleSelectAll = (e) => {
  //   const isChecked = e.target.checked;
  //   setSelectedAll(isChecked);
  //   if (isChecked) {
  //     setSelectedRows(students.map((student) => student.id));
  //   } else {
  //     setSelectedRows([]);
  //   }
  // };


  //check box on id
  // const handleRowSelect = (id) => {
  //   setSelectedRows((prevSelected) => {
  //     if (prevSelected.includes(id)) {
  //       return prevSelected.filter((studentId) => studentId !== id);
  //     } else {
  //       return [...prevSelected, id]
  //     }
  //   });
  // };

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

  //button next page
  const handleNextPage = () => {
    if (currentPage + maxButtonsToShow <= totalPages) {
      setCurrentPage(currentPage + maxButtonsToShow);
    } else {
      setCurrentPage(totalPages)
    }
  };

  //button previous page
  const handlePrev = () => {
    if (currentPage - maxButtonsToShow >= 1) {
      setCurrentPage(currentPage - maxButtonsToShow);
    } else {
      setCurrentPage(1)
    }
  };

  //Number on Button
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

  const [searchQuery, setSearchQuery] = useState(''); // State for search input
  const [loading, setLoading] = useState(false); // Loading state for search
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  //filter
  const options = [
    "All",
    "By First name",
    "By Last name",
    "By Age",
    "By Home address",
    "By Latitude",
    "By Longitude",
    "By Status",
  ];


  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    // console.log('Selected option:', option);
    setIsOpenDropdown(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault(); // ป้องกันการรีเฟรชหน้า
    if (!searchQuery.trim()) {
      alert("Please enter a search query."); // แจ้งเตือนเมื่อไม่กรอกข้อมูล
      return;
    }

    setLoading(true); // เริ่มสถานะการโหลด
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) throw new Error("User is not logged in");

      const idToken = await user.getIdToken();
      const response = await fetch(
        `${apiBaseUrl}/api/students/search?find=${searchQuery}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${idToken}`, // Add Authorization header
        },
      }
      );
      if (!response.ok) {
        throw new Error(`Error fetching search results: ${response.status}`);
      }
      const data = await response.json();

      setStudents(data); // อัปเดต st
    } catch (err) {
      setError(err.message); // แสดงข้อผิดพลาด
    } finally {
      setLoading(false); // ปิดสถานะการโหลด
    }
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
                  <form onSubmit={handleSearch}>
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className={`${St.input_search} p-2 rounded-lg w-full`}
                    />
                  </form>

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
                            onClick={() => handleOptionClick(option)}  // Update the selected option
                            className={`block w-full px-4 py-2 text-left text-sm ${selectedOption === option ? "bg-gray-200" : "hover:bg-gray-100"
                              }`}
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
        {/* <p><a class="text-blue-600 underline underline-offset-1 decoration-blue-600 hover:opacity-80 focus:outline-none focus:opacity-80 flex justify-end mb-5 mr-2" href="#">Example File</a></p> */}
        {/* Dropdown เมื่อเลือก Checkbox */}
        {selectedRows.length > 0 && (
          <div className="flex items-center space-x-4 p-3">
            <button
              className="flex items-center space-x-2 text-red-500 hover:text-red-700"
              onClick={handleBulkDelete}
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
                      checked={selectedRows.length > 0 && selectedRows.length === students.length ? true : false}
                      onChange={handleSelectAll}
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
              {students.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-4">No results found</td>
                </tr>
              ) : (
                students.map((student) => (
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
                        <button onClick={() => openEditStudent2(student.id)}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#007BFF" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                          </svg>
                        </button>
                        <button onClick={() => openModalDelete(student.id)} >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#dc2626" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
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
      <EditStudent isOpenEditStudent={openEditStudent} onCloseEditStudent={closeEditStudentModal} id={sid}></EditStudent>
      <ModalDelete isOpen={isModalDeleteOpen} onClose={closeModalDelete} onConfirm={confirmDelete}></ModalDelete>
    </aside >
  );
}