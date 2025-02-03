"use client";

export default function SchoolsPage(isOpen, onClose) {
    if (!isOpen) return null;

    return (
        <>
            <aside
                id="additional-sidebar"
                className="fixed z-50 w-full sm:w-[500px] h-[500px] sm:h-screen bg-gray-100 border-t sm:border-t-0 sm:border-r border-gray-300 
             bottom-0 sm:top-0 lg:top-0 transition-transform"
            >

                <button
                    type="button"
                    className="bg-transparent hover:bg-gray-200  rounded-lg z-20 p-1.5 absolute top-2 end-4 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
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

            </aside>
        </>
    )

}