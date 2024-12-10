'use client'
import style from '../repass.module.css';
import styles from '../login.module.css'
import popup from '../success.module.css'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ForgotPassword() {
    const router = useRouter();
    const [showPopup, setShowPopup] = useState(false);

    const handleShowPopup = () => {
        setShowPopup(true);

        setTimeout(() => {
            setShowPopup(false);
        }, 3000);
    };
    return (
        <div className={styles.root_login}>
            <main className={styles.card}>
                <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <h2 className={style.title}>
                            Forgot password
                        </h2>
                        <div className={style.p}>
                            No worries, we'll send you reset instructions
                        </div>
                    </div>
                    <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form action="#" method="POST" className="space-y-6">
                            <div className={style.text_email}>
                                <label htmlFor="email">
                                    Email
                                </label>
                                <div className={style.input_placeholder_email}>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        required
                                        autoComplete="email"
                                        className={style.input_email}
                                    />
                                </div>
                            </div>

                            <div>
                                <button onClick={handleShowPopup} className={style.btn}>Submit</button>
                            </div>

                            {showPopup && (
                                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                    <div className="bg-white rounded-lg p-8 shadow-lg  w-80">
                                        <h2 className={popup.title}>
                                            Successfully reset
                                        </h2>
                                        <div className={popup.p}>
                                            can now log in with your new password.
                                        </div>
                                        <div className="flex justify-center items-center mb-6 mt-5">
                                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={2}
                                                    stroke="white"
                                                    className="w-8 h-8"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        </div>
                                        <button type="button" onClick={() => router.push('/')} className={popup.btn}>Back</button>
                                    </div>
                                </div>
                            )}
                        </form>
                        <div className='mt-96'>
                            <Link href="/" className={styles.link}>
                                <div className='flex'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                                    </svg>
                                    <div className='ml-2'>
                                        Back to log in
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </main >
        </div>
    );
}
