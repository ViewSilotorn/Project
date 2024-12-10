import style from '../repass.module.css';
import styles from '../login.module.css'
import Link from 'next/link';

export default function ForgotPassword() {
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
                                <button type="submit" className={style.btn}>Submit</button>
                            </div>
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