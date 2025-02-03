import style from '../css/side.module.css';
import styles from '../css/nav.module.css';
import Link from 'next/link';
import stAddList from '../css/addListStudent.module.css'
import { useState } from "react";
import { getAuth } from "firebase/auth";
import Papa from "papaparse"; // สำหรับการอ่านไฟล์ CSV
import { read, utils } from "xlsx"; // ไลบรารีสำหรับ XLS/XLSX
import { createBatchStudents} from "../services/studentService";

const host = process.env.NEXT_PUBLIC_API_HOST;
const port = process.env.NEXT_PUBLIC_API_PORT;

// สร้าง base URL
const apiBaseUrl = `${host}:${port}`;

const ListStudent = ({ isOpenListStudent, onCloseListStudent, onAddListStudent}) => {
    if (!isOpenListStudent) return null;

    const [students, setStudents] = useState([]);
    const [selectedFileName, setSelectedFileName] = useState("");
    const [StudentsList, setStudentsList] = useState(null);

    const handleFileUpload = (file) => {
        // const file = event.target.files[0];
        if (file) {
            setSelectedFileName(file.name); // บันทึกชื่อไฟล์
        }

        const fileExtension = file.name.split(".").pop().toLowerCase();
        if (fileExtension === "csv") {
            const reader = new FileReader();
            reader.onload = (e) => {
                const csvData = e.target.result;
                Papa.parse(csvData, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (result) => {
                        console.log("Parsed CSV Data:", result.data);
                        setStudents(result.data);
                    },
                });
            };
            reader.readAsText(file);
        } else if (fileExtension === "xls" || fileExtension === "xlsx") {
            const reader = new FileReader();
            reader.onload = (e) => {
                const binaryData = e.target.result;
                const workbook = read(binaryData, { type: "binary" });
                const sheetName = workbook.SheetNames[0];
                const sheetData = utils.sheet_to_json(workbook.Sheets[sheetName]);
                console.log("Parsed XLS/XLSX Data:", sheetData);
                setStudents(sheetData);
            };
            reader.readAsBinaryString(file);
        } else {
            alert("Invalid file type. Please upload a CSV, XLS, or XLSX file.");
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        handleFileUpload(file);
    }

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        handleFileUpload(file);
    }

    const handleDragOver = (event) => {
        event.preventDefault();
    }

    const handleAddStudent = () => {
        if (students.length === 0) {
            alert("Please upload a file before adding students.");
            return;
        }

        // ส่งข้อมูล students ไปยัง component หน้า Students (ถ้าใช้ state management เช่น Context หรือ Redux)
        setStudentsList((prev) => [...prev, ...students]);

        // หรือส่งไปที่ backend (API)
        // students.forEach(async (student) => {
        //     try {
        //         const auth = getAuth();
        //         const user = auth.currentUser;

        //         if (!user) throw new Error("User is not logged in");

        //         const idToken = await user.getIdToken();
        //         const response = await fetch(`${apiBaseUrl}/api/students`, {
        //             method: "POST",
        //             headers: {
        //                 Authorization: `Bearer ${idToken}`,
        //             },
        //             body: JSON.stringify(student),
        //         });

        //         if (!response.ok) {
        //             const errorData = await response.json();
        //             throw new Error(errorData.message || "Failed to add student");
        //         }

        //         console.log("Student added successfully");
        //     } catch (error) {
        //         console.error("Error adding student:", error.message);
        //     }
        // });
        createBatchStudents(students)

        onAddListStudent(students)

        // ปิด modal และรีเซ็ต state
        onCloseListStudent();
    };


    return (
        <div
            className={`${isOpenListStudent ? "fixed" : "hidden"
                } overflow-y-auto overflow-x-hidden fixed inset-0 bg-gray-600 bg-opacity-50 z-50  h-full w-full flex items-center justify-center`}
        >
            <div className="bg-white rounded-lg shadow-xl p-6 w-[663px] h-[766px] max-w-2xl relative z-50 max-h-[90vh] overflow-y-auto">
                <div className=" sm:rounded-lg  flex flex-col justify-center py-3">
                    <Link href="" onClick={onCloseListStudent} className={style.link}>
                        <div className='flex lg:px-5 py-2 sm:py-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 pb-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                            </svg>
                            <div className='ml-1'>
                                Back to Student
                            </div>
                        </div>
                    </Link>
                    <div className="lg:px-16 py-5 sm:py-5 px-2">
                        <h2 className={stAddList.title}>
                            Import List of Student
                        </h2>
                        <div className={stAddList.p}>
                            Easily add student details to assign routes and manage pickup schedules.
                        </div>
                    </div>
                    <div className={stAddList.card_input}>
                        <div onDragOver={handleDragOver} onDrop={handleDrop} className={stAddList.input_file}>
                            <label htmlFor="dropzone-file" >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#265CB3" className={stAddList.icon}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                                    </svg>

                                    <p className={stAddList.text_file}>Drag and drop file here</p>
                                    <div className={stAddList.text_filesup}>
                                        <p>
                                            <span >Files supported: XLS,XLSX,CSV</span>
                                        </p>
                                        <p>Size limit: 1 MB</p>
                                    </div>
                                    {selectedFileName && (
                                        <p className="mt-2 text-sm text-gray-600">Selected file: <span className="font-medium">{selectedFileName}</span></p>
                                    )}
                                </div>
                                <input
                                    id="dropzone-file"
                                    type="file"
                                    accept=".xls, .xlsx, .csv"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center space-x-4 mt-7">
                    <button className={stAddList.btn_add} onClick={handleAddStudent}>Add Student</button>
                    <button className={stAddList.btn_cancel} onClick={onCloseListStudent}>Cancel</button>
                </div>
            </div >
        </div>
    );
};

export default ListStudent;
