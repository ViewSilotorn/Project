import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import stAddList from '../css/addListStudent.module.css'


const ImportRouteModal = ({ isOpenImportRoute, onCloseImportRoute, openComponent, mapRef }) => {
    if (!isOpenImportRoute) return null; // If modal is not open, return nothing
    const [dragging, setDragging] = useState(false);

    const [selectedFile, setSelectedFile] = useState(null);
    const [alertMessage, setAlertMessage] = useState(null);


    // Handle when a file is dragged over the drop area
    const handleDragOver = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    // Handle when a file is dragged out of the drop area
    const handleDragLeave = () => {
        setDragging(false);
    };

    // Handle file drop event
    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);

        const files = e.dataTransfer.files;
        console.log("Files dropped: ", files);

        if (files.length > 0) {
            setSelectedFile(files[0]); 
        }
    };

    // Handle file selection (manual file selection)
    const handleFileSelect = (e) => {
        const files = e.target.files;
        console.log("Files selected: ", files);

        if (files.length > 0) {
            setSelectedFile(files[0]); 
        }
    };

    // Function to process the selected file
    const handleFileProcessing = () => {
        if (!selectedFile) {
            setAlertMessage({
                type: "warning",
                message: "Please select a file first!"
            });
            setTimeout(() => setAlertMessage(null), 3000);
            return;
        }

        const fileExtension = selectedFile.name?.split(".").pop().toLowerCase(); // ✅ ป้องกัน error

        if (fileExtension === "csv") {
            parseCSV(selectedFile);
        } else if (fileExtension === "xls" || fileExtension === "xlsx") {
            parseXLSX(selectedFile);
        } else {
            setAlertMessage({
                type: "warning",
                message: "Unsupported file type!"
            });
            setTimeout(() => setAlertMessage(null), 3000);
        }
    };

    // Parse CSV file to JSON using PapaParse
    const parseCSV = (file) => {
        Papa.parse(file, {
            complete: function (results) {
                console.log("CSV data:", results.data);
                // Assuming the structure for CSV is known, you can now convert to desired JSON structure
                const trips = [];
                results.data.forEach((row) => {
                    const routeName = row.route_name;
                    const coordinates = [parseFloat(row.latitude), parseFloat(row.longitude)];
                    const color = row.color;

                    let route = trips.find((trip) => trip[routeName]);
                    if (!route) {
                        route = { [routeName]: [], color: color };
                        trips.push(route);
                    }
                    route[routeName].push(coordinates);
                });

                const jsonResult = { trips };
                // console.log("Processed JSON ttt:", jsonResult.trips);
                findingRouteByImport(jsonResult.trips)
            },
            header: true, // If CSV file has headers
        });
    };

    // Parse XLSX file to JSON using xlsx library
    const parseXLSX = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet);

            console.log("XLSX data:", jsonData);
            // Process data into the desired structure
            const trips = [];
            jsonData.forEach((row) => {
                const routeName = row.route_name;
                const coordinates = [parseFloat(row.latitude), parseFloat(row.longitude)];
                const color = row.color;

                let route = trips.find((trip) => trip[routeName]);
                if (!route) {
                    route = { [routeName]: [], color: color };
                    trips.push(route);
                }
                route[routeName].push(coordinates);
            });

            const jsonResult = { trips };
            console.log("Processed JSON:", jsonResult);
        };
        reader.readAsBinaryString(file);
    };


    const typePage = "import"

    const findingRouteByImport = async (jsonResult) => {
        try {
            if (mapRef.current) {
                const { routes, routeColors, routeDistance, routeDuration, Didu } = await mapRef.current.handleSubmit(
                    0,
                    0,
                    0,
                    true,
                    "import",
                    0,
                    jsonResult
                );
                onCloseImportRoute()
                // openComponent("Route");
                openComponent("Route", { routes, routeColors, routeDistance, routeDuration, Didu, typePage });
            }


        } catch (error) {
            console.error("Error in findingRoute:", error);
        }
    };

    useEffect(() => {
        setSelectedFile(null);
    }, []);

    return (
        <div
            className={`${isOpenImportRoute ? "fixed" : "hidden"
                } overflow-y-auto overflow-x-hidden fixed inset-0 bg-gray-600 bg-opacity-50 z-50  h-full w-full flex items-center justify-center`}
        >
            <div className="bg-white rounded-lg shadow-xl p-6 w-[663px] h-[766px] max-w-2xl relative z-50 max-h-[90vh] overflow-y-auto">
                <div className=" sm:rounded-lg  flex flex-col justify-center py-3">
                {alertMessage && (
            <p className={`mt-2 text-sm text-${alertMessage.type === "warning" ? "yellow" : "red"}-600`}>
                {alertMessage.message}
            </p>
        )}
                    <div className='flex lg:px-5 py-2 sm:py-2'>
                        <button
                            type="button"
                            className="bg-transparent hover:bg-gray-200  rounded-lg z-20 p-1.5 absolute top-5 end-4 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={onCloseImportRoute}
                        >
                            <svg
                                aria-hidden="false"
                                className="w-6 h-6"
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
                    </div>
                    <div className="lg:px-16 py-5 sm:py-5 px-2">
                        <h2 className={stAddList.title}>
                            Import Routes
                        </h2>
                        <div className={stAddList.p}>
                            Easily import and manage bus routes by uploading your route data, ensuring efficient route planning and accurate student transportation.
                        </div>
                    </div>
                    <div className={stAddList.card_input}>
                        <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className={stAddList.input_file}>
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
                                        {/* <p>Size limit: 1 MB</p> */}
                                    </div>
                                    {selectedFile && (
                                        <p className="mt-2 text-sm text-gray-600">Selected file: <span className="font-medium">{selectedFile.name}</span></p>
                                    )}
                                    <input
                                        id="dropzone-file"
                                        type="file"
                                        accept=".xls, .xlsx, .csv"
                                        className="hidden"
                                        onChange={handleFileSelect} // Listen for file selection
                                    />
                                </div>
                                {/* <input
                                id="dropzone-file"
                                type="file"
                                accept=".xls, .xlsx, .csv"
                                className="hidden"
                                onChange={handleFileChange}
                            /> */}
                            </label>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center space-x-4 mt-7">
                    <button className={stAddList.btn_add} onClick={handleFileProcessing} disabled={!selectedFile}>Submit</button>
                    <button className={stAddList.btn_cancel} onClick={onCloseImportRoute}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default ImportRouteModal;


