"use client";
import { useEffect, useState } from "react";
import St from '../css/student.module.css';
import { getAuth } from "firebase/auth";
import HandleDelete from "../services/HandleDelete";
import AddStudent from "../components/AddStudent"
import ListStudent from "../components/ListAtudent"

export default function StudentSidebar({ isOpen, onClose}) {
  if (!isOpen) return null; // ถ้า Sidebar ไม่เปิด ให้คืนค่า null

  const [students, setStudents] = useState([]);

  const [error, setError] = useState(null);
  // const [addStudent, setAddStudent] = useState(false);
  // const [addListStudent, setAddListStudent] = useState(false);
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

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    age: "",
    gender: "",
    address: "",
    latitude: "",
    longitude: "",
    status: "",
  });

  

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`http://192.168.3.251:8080/api/students/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: "654987",
          first_name: formData.first_name,
          last_name: formData.last_name,
          age: formData.age,
          gender: formData.gender,
          address: formData.address,
          latitude: formData.latitude,
          longitude: formData.longitude,
          status: formData.status,
        }),
      });

      const result = await response.json();
      console.log(result);
    } catch (error) {
      // Capture the error message to display to the user
      setError(error.message)
      console.error(error)
    }
  };

  useEffect(() => {
    const fetchDataStudent = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) throw new Error("User is not logged in");

        const idToken = await user.getIdToken();
        console.log("JWT Token:", idToken);

        const res = await fetch(`http://192.168.3.251:8080/api/students/page/${currentPage}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) throw new Error('Failed to fetch students');

        const data = await res.json();
        console.log(data);
        setStudents(data.students);  // ตั้งค่าข้อมูลนักเรียน
        setTotalCount(data.total_count);  // ตั้งค่าจำนวนรวมของนักเรียน
        setPerPage(data.per_page);  // ตั้งค่าจำนวนนักเรียนต่อหน้า
      } catch (error) {
        setError(error.message);
      }
    };

    fetchDataStudent();
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

  //button popup add student
  const toggleAddStudent = () => {
    setAddStudent(!addStudent);
  }

  //button popup add list student
  const toggleAddListStudent = () => {
    setAddListStudent(true);
  }

  const toggleEditPage = () => {
    setisEdit(true)
  }

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

  const handleEdit = () => {
    alert("Edit selected rows: " + selectedRows.join(", "));
  };

  const totalPages = Math.ceil(totalCount / perPage);
  const maxButtonsToShow = 5; // จำนวนปุ่มที่ต้องการแสดง
  const startPage = Math.floor((currentPage - 1) / maxButtonsToShow) * maxButtonsToShow + 1;
  const endPage = Math.min(startPage + maxButtonsToShow - 1, totalPages);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <aside
      id="additional-sidebar"
      className="fixed z-50 w-full sm:w-[1000px] h-[500px] sm:h-screen bg-gray-100 border-t sm:border-t-0 sm:border-r border-gray-300 
             bottom-0 sm:top-0 lg:left-64 lg:top-0 transition-transform"
    >
      <div className="h-full px-3 pb-4 overflow-y-auto flex flex-col">
        {/* <h2 className="text-lg font-bold">Students</h2> */}
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
        <div className="overflow-x-auto">
          <header>
            <div className="px-4 py-6">
              <div className="flex flex-col gap-28 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className={St.text}>Students</h1>

                  {/* <p className={`${St.p} mt-1.5`}>
                                            This page provides a detailed list of all students in your account.
                                        </p> */}
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <div className="relative">
                    <label htmlFor="Search" className="sr-only"> Search </label>
                    <input
                      type="text"
                      id="Search"
                      placeholder="Search..."
                      className={`${St.input_search} bg-white  py-2 px-10 border border-gray-400 rounded shadow`}
                    />
                    <span className="absolute inset-y-0 start-0 grid w-12 place-content-center">
                      <button type="button">
                        <span className="sr-only">Search</span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                          <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </span>
                  </div>
                  <div>
                    {/* <button className={`${St.btn_filter} bg-white py-2 px-5 border border-gray-400 rounded shadow`}>
                                                <div className="flex justify-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#707070" className="size-6">
                                                        <path fillRule="evenodd" d="M3.792 2.938A49.069 49.069 0 0 1 12 2.25c2.797 0 5.54.236 8.209.688a1.857 1.857 0 0 1 1.541 1.836v1.044a3 3 0 0 1-.879 2.121l-6.182 6.182a1.5 1.5 0 0 0-.439 1.061v2.927a3 3 0 0 1-1.658 2.684l-1.757.878A.75.75 0 0 1 9.75 21v-5.818a1.5 1.5 0 0 0-.44-1.06L3.13 7.938a3 3 0 0 1-.879-2.121V4.774c0-.897.64-1.683 1.542-1.836Z" clipRule="evenodd" />
                                                    </svg>
                                                    <div className="mt-1 ml-2">
                                                        Filter
                                                    </div>
                                                </div>
                                            </button> */}
                    <div className="relative">

                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#707070" className="absolute top-1/2 -translate-y-1/2 left-2 z-50 size-6">
                        <path fillRule="evenodd" d="M3.792 2.938A49.069 49.069 0 0 1 12 2.25c2.797 0 5.54.236 8.209.688a1.857 1.857 0 0 1 1.541 1.836v1.044a3 3 0 0 1-.879 2.121l-6.182 6.182a1.5 1.5 0 0 0-.439 1.061v2.927a3 3 0 0 1-1.658 2.684l-1.757.878A.75.75 0 0 1 9.75 21v-5.818a1.5 1.5 0 0 0-.44-1.06L3.13 7.938a3 3 0 0 1-.879-2.121V4.774c0-.897.64-1.683 1.542-1.836Z" clipRule="evenodd" />
                      </svg>

                      <select id="Offer"
                        className={`${St.btn_filter} pl-9 block w-full appearance-none`}>
                        <option value="">Soft by</option>
                        <option value="">By First name</option>
                        <option value="">By Last name</option>
                        <option value="">By Age</option>
                        <option value="">By Home address</option>
                        <option value="">By Latitude</option>
                        <option value="">By Longitude</option>
                        <option value="">By Status</option>
                      </select>
                      <svg className="absolute top-1/2 -translate-y-1/3 right-1 z-50" width="16" height="16"
                        viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.0002 5.99845L8.00008 9.99862L3.99756 5.99609" stroke="#111827" strokeWidth="1.6"
                          strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
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
                </div>
              </div>
            </div>
          </header>
          {/* Dropdown เมื่อเลือก Checkbox */}
          {selectedRows.length > 0 && (
            <div className="flex items-center space-x-4 px-12">
              {/* <button
                                    className="flex items-center space-x-2 text-blue-500 hover:text-blue-700"
                                    onClick={() => toggleEditPage()}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>

                                    <span>Edit</span>
                                </button> */}
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
          <div className="px-8">
            <table className="min-w-full divide-y-2 divide-gray-200">
              <thead className={`${St.Header} ltr:text-left rtl:text-right`}>
                <tr>
                  <th className="sticky inset-y-0 start-0 px-4 py-2">
                    <label htmlFor="SelectAll" className="sr-only">Select All</label>

                    <input
                      type="checkbox"
                      id="SelectAll"
                      className="size-5 mt-1.5 rounded border-gray-300"
                      onChange={handleSelectAll}
                      checked={selectedRows.length > 0 && selectedRows.length === students.length ? true : false}
                    />
                  </th>
                  <th className={`${St.Header_FN} whitespace-nowrap px-4 py-2`}>Firstname</th>
                  <th className={`${St.Header_LN} whitespace-nowrap px-4 py-2`}>Lastname</th>
                  <th className={`${St.Header_Age} whitespace-nowrap px-4 py-2`}>Age</th>
                  <th className={`${St.Header_GD} whitespace-nowrap px-4 py-2`}>Gender</th>
                  <th className={`${St.Header_HAdress} whitespace-nowrap px-4 py-2`}>Home Address</th>
                  <th className={`${St.Header_Lat} whitespace-nowrap px-4 py-2`}>Latitude</th>
                  <th className={`${St.Header_Lng} whitespace-nowrap px-4 py-2`}>Longitude</th>
                  <th className={`${St.Header_Status} whitespace-nowrap px-4 py-2`}>Status</th>
                  <th className="whitespace-nowrap px-4 py-2 text-gray-900">Action</th>
                </tr>
              </thead>

              <tbody className={`${St.text_Student} divide-y divide-gray-200`}>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td className="sticky inset-y-0 start-0 px-4 py-2">
                      <label htmlFor="SelectAll" className="sr-only">Select All</label>

                      <input type="checkbox" id="SelectAll" className="size-5 mt-1.5 rounded border-gray-300" checked={selectedRows.includes(student.id)} onChange={() => handleRowSelect(student.id)} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-2">{student.first_name} </td>
                    <td className="whitespace-nowrap px-4 py-2">{student.last_name}</td>
                    <td className={`${St.detail_Age} whitespace-nowrap px-4 py-2`}>{student.age}</td>
                    <td className="whitespace-nowrap px-4 py-2">{student.gender}</td>
                    <td className="whitespace-nowrap px-4 py-2">{student.address}</td>
                    <td className={`${St.detail_Lat} whitespace-nowrap px-4 py-2`}>{student.latitude}</td>
                    <td className={`${St.detail_Lng} whitespace-nowrap px-4 py-2`}>{student.longitude}</td>
                    <td className={`${St.detail_status} whitespace-nowrap px-4 py-2`}>{student.status}</td>
                    <td className="whitespace-nowrap px-4 py-2">
                      <div className="flex space-x-2 ">
                        <button onClick={toggleEditPage}>
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
            <ol className="flex justify-end gap-1 text-xs font-medium mt-10">
              <div className="sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className={`${St.text_showing} px-10`}>
                    Showing
                    <span className="px-2">{currentPage}</span>
                    to
                    <span className="px-2">{totalPages}</span>
                  </p>
                </div>
              </div>
              {/* ปุ่ม Prev */}
              <li>
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className={`inline-flex items-center justify-center rounded border border-gray-100 bg-white text-gray-900 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
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
              {Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index).map((page) => (
                <li key={page} className="block size-8 rounded border-blue-600 bg-blue-600 text-center leading-8 text-white">
                  <button
                    onClick={() => setCurrentPage(page)}
                    className={`block size-8 rounded border ${currentPage === page ? 'bg-blue-600 text-white' : 'border-gray-100 bg-white text-gray-900'}`}
                  >
                    {page}
                  </button>
                </li>
              ))}

              {/* ปุ่ม Next */}
              <li>
                <button
                  onClick={() => handleNextPage()}
                  className={`inline-flex items-center justify-center rounded border border-gray-100 bg-white text-gray-900 ${currentPage >= totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={currentPage >= totalPages}
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
            </ol>
          </div>
        </div>
      </div>
      <AddStudent isOpenAddStudent={openAddStudent} onCloseAddStudent={closeAddStudentModal}></AddStudent>
      <ListStudent isOpenListStudent={openListStudent} onCloseListStudent={closeListStudentModal}></ListStudent>
      {/* {addStudent && (
                <div className={`${styles.root_login}`}>
                    <main className={style.card}>
                        <div className="flex min-h-full flex-1 flex-col justify-center px-4 py-8 lg:py-12">
                            <Link href="" onClick={() => setAddStudent(false)} className={style.link}>
                                <div className='flex px-10'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                                    </svg>
                                    <div className='ml-2'>
                                        Back to Student
                                    </div>
                                </div>
                            </Link>
                            <div className="py-10 px-24">
                                <h2 className={style.title}>
                                    Add Student
                                </h2>
                                <div className={style.p}>
                                    Fill out the form below to add a new student to the system.
                                </div>
                            </div>
                            <div
                                className="flex items-center justify-center"
                            >
                                <form onSubmit={handleSubmit} className="grid grid-cols-6 gap-6">
                                    <div className={`${style.text_email} col-span-6 sm:col-span-3`}>
                                        <label htmlFor="FirstName" >
                                            First Name
                                        </label>
                                        <div className={style.input_placeholder_email}>
                                            <input
                                                type="text"
                                                id="FirstName"
                                                name="first_name"
                                                onChange={handleInputChange}
                                                className={style.input_email}
                                            />
                                        </div>
                                    </div>

                                    <div className={`${style.text_email} col-span-6 sm:col-span-3`}>
                                        <label htmlFor="FirstName" >
                                            Last Name
                                        </label>
                                        <div className={style.input_placeholder_email}>
                                            <input
                                                type="text"
                                                id="LastName"
                                                name="last_name"
                                                onChange={handleInputChange}
                                                className={style.input_email}
                                            />
                                        </div>
                                    </div>

                                    <div className={`${style.text_email} col-span-6 sm:col-span-3`}>
                                        <label htmlFor="Age" >
                                            Age
                                        </label>
                                        <div className={style.input_placeholder_email}>
                                            <input
                                                type="text"
                                                id="Age"
                                                name="age"
                                                onChange={handleInputChange}
                                                className={style.input_email}
                                            />
                                        </div>
                                    </div>

                                    <div className={`${style.text_email} col-span-6 sm:col-span-3`}>
                                        <label htmlFor="Gender" >
                                            Gender
                                        </label>
                                        <select
                                            id="Gender"
                                            name="gender"
                                            className={`${style.select} block`}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select gender</option>
                                            <option value="male">male</option>
                                            <option value="female">Female</option>
                                        </select>
                                    </div>

                                    <div className={`${style.text_email} col-span-6 sm:col-span-3`}>
                                        <label htmlFor="HomeAddress" >
                                            Home Address
                                        </label>
                                        <div className={style.input_placeholder_email}>
                                            <input
                                                type="text"
                                                id="HomeAddress"
                                                name="address"
                                                onChange={handleInputChange}
                                                className={style.input_email}
                                            />
                                        </div>
                                    </div>

                                    <div className={`${style.text_email} col-span-6 sm:col-span-3`}>
                                        <label htmlFor="Status" >
                                            Status
                                        </label>
                                        <select
                                            id="Status"
                                            name="status"
                                            className={`${style.select} block`}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Select status</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                        </select>
                                    </div>

                                    <div className={`${style.text_email} col-span-6 sm:col-span-3`}>
                                        <label htmlFor="Latitude" >
                                            Latitude
                                        </label>
                                        <div className={style.input_placeholder_email}>
                                            <input
                                                type="text"
                                                id="Latitude"
                                             />
                                        </div>
                                    </div>

                                    <div className={`${style.text_email} col-span-6 sm:col-span-3`}>
                                        <label htmlFor="Longitude" >
                                            Longitude
                                        </label>
                                        <div className={style.input_placeholder_email}>
                                            <input
                                                type="text"
                                                id="Longitude"
                                                name="longitude"
                                                onChange={handleInputChange}
                                                className={style.input_email}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-span-6 justify-end sm:flex sm:items-center sm:gap-4">
                                        <button
                                            type="submit"
                                            className={style.btn_add}
                                        >
                                            Add Student
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </main >
                </div>
            )}                              name="latitude"
                                                onChange={handleInputChange}
                                                className={style.input_email} */}


    </aside>

  );
}