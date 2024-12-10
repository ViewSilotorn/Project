'use client'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './login.module.css'

export default function Home() {
  const router = useRouter()
  return (
    <div className={styles.root_login}>
      <main className={styles.card}>
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className={styles.title}>
              Welcome back
            </h2>
            <div className={styles.p}>
              <span>Log in route optimize</span>
            </div>
          </div>
          <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
            <form action="#" method="POST" className="space-y-6">
              <div className={styles.text_email}>
                <label htmlFor="email" >
                  Work email
                </label>
                <div className={styles.input_placeholder_email}>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your Email"
                    required
                    autoComplete="email"
                    className={styles.input_email}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className={styles.text_password}>
                  Password
                </label>
                <div className={styles.input_placeholder_password}>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter you password"
                    required
                    autoComplete="password"
                    className={styles.input_password}
                  />
                </div>
              </div>

              <div className="text-sm">
                <Link href="/forGotPass" className={styles.text_fgpass}>
                  Forgot password?
                </Link>
              </div>

              <div>
                <button type="submit" onClick={() => router.push('/map')} className={styles.btn_login} >Login</button>
              </div>
              <div className={styles.hr_line}>
                <span className='mt-10'>Or</span>
              </div>
              <div>
                <button type="submit" className={styles.btn_google}>
                  <div className={styles.logo_google}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g >
                      <path d="M19.9895 10.1873C19.9895 9.36792 19.9214 8.76998 19.7742 8.1499H10.1992V11.8482H15.8195C15.7062 12.7673 15.0943 14.1514 13.7346 15.0815L13.7155 15.2053L16.7429 17.4972L16.9527 17.5176C18.8789 15.7791 19.9895 13.2213 19.9895 10.1873Z" fill="#4285F4" />
                      <path d="M10.1993 19.9312C12.9527 19.9312 15.2643 19.0453 16.9527 17.5173L13.7346 15.0812C12.8734 15.6681 11.7176 16.0777 10.1993 16.0777C7.50242 16.0777 5.21352 14.3393 4.39759 11.9365L4.27799 11.9464L1.13003 14.3271L1.08887 14.439C2.76588 17.6944 6.2106 19.9312 10.1993 19.9312Z" fill="#34A853" />
                      <path d="M4.39748 11.9368C4.18219 11.3167 4.05759 10.6523 4.05759 9.96583C4.05759 9.27927 4.18219 8.61492 4.38615 7.99484L4.38045 7.86278L1.19304 5.44385L1.08876 5.49232C0.397576 6.84324 0.000976562 8.36026 0.000976562 9.96583C0.000976562 11.5714 0.397576 13.0884 1.08876 14.4393L4.39748 11.9368Z" fill="#FBBC05" />
                      <path d="M10.1993 3.85336C12.1142 3.85336 13.406 4.66168 14.1425 5.33718L17.0207 2.59107C15.253 0.985496 12.9527 0 10.1993 0C6.2106 0 2.76588 2.23672 1.08887 5.49214L4.38626 7.99466C5.21352 5.59183 7.50242 3.85336 10.1993 3.85336Z" fill="#EB4335" />
                    </g>
                  </svg>
                  Continue with Google
                  </div>
                </button>
              </div>
              <div className={styles.text_account}>
                Don't have an account? <Link href="/signUp" className={styles.textaccount}>
                  Create account
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
