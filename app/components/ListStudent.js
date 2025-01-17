import style from '../css/side.module.css';
import styles from '../css/nav.module.css';
import Link from 'next/link';
import stAddList from '../css/addListStudent.module.css'
import { useEffect, useState } from "react";

const addStudent = ({ isOpenListStudent, onCloseListStudent }) => {
    if (!isOpenListStudent) return null;

    const [addListStudent, setAddListStudent] = useState(false);

    return (
        <div
        className={`${isOpenListStudent ? "fixed" : "hidden"
            } overflow-y-auto overflow-x-hidden fixed inset-0 bg-gray-600 bg-opacity-50 z-50  h-full w-full flex items-center justify-center`}
    >
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl relative z-50 max-h-[90vh] overflow-y-auto">
            <div className=" sm:rounded-lg  flex flex-col justify-center">
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
                            Add List of Student
                        </h2>
                        <div className={stAddList.p}>
                            Easily add student details to assign routes and manage pickup schedules.
                        </div>
                    </div>
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">

                    </div>

                    <div className={stAddList.card_input}>
                        <div className={stAddList.input_file}>
                            <label htmlFor="dropzone-file" >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    {/* <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                </svg> */}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#265CB3" className={stAddList.icon}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75v6.75m0 0-3-3m3 3 3-3m-8.25 6a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                                    </svg>

                                    <p className={stAddList.text_file}>Drag and drop file here</p>
                                    <div className={stAddList.text_filesup}>
                                        <p>
                                            <span >Files supported: XLS,XLSX,CSV</span>
                                        </p>
                                        <p>Size limit: 1 MB</p>
                                    </div>
                                </div>
                                <input id="dropzone-file" type="file" className="hidden" />
                            </label>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center space-x-4 mt-10">
                    <button className={stAddList.btn_add}>Add Student</button>
                    <button className={stAddList.btn_cancel} onClick={onCloseListStudent}>Cancel</button>
                </div>
            </div >
        </div>
    );
};

export default addStudent;
