return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="relative flex flxe-col my-6 bg-white shadow-sm border bordre-slate-200 rounded-lg w-96">
          <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                Welcome back
              </h2>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form action="#" method="POST" className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                    Work email
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your Email"
                      required
                      autoComplete="email"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus -outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                    Password
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter you password"
                      required
                      autoComplete="email"
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus -outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-semibold text-600 hover:text-500">
                    Forgot password?
                  </a>
                </div>

                <div>
                  <button type="submit" className="flex w-full justify-center rounded-md bg-zinc-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm ">Login</button>
                </div>
                <hr></hr>
                <div>
                  <button type="submit" className="flex w-full justify-center rounded-md bg-zinc-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm ">Continue with Google</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );


//side bar
import { useState } from "react";

export default function Sidebar() {
  const [stops, setStops] = useState([
    { id: "1", name: "N207 Holborn" },
    { id: "2", name: "Bond Street (Stop W)" },
  ]);
  const [showSettings, setShowSettings] = useState(false);

  const toggleSettings = () => setShowSettings(!showSettings);

  return (
    <div className="w-1/3 h-full bg-white shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4">Line by Line</h2>

      <div className="space-y-4">
        {/* Address Input */}
        <div className="flex items-center border p-2 rounded">
          <input
            type="text"
            placeholder="One address per line"
            className="flex-grow outline-none"
          />
          <button className="ml-2 p-2 bg-gray-200 rounded hover:bg-gray-300">
            <span>&#8593;&#8595;</span>
          </button>
        </div>

        {/* Stops List */}
        <ul className="space-y-2">
          {stops.map((stop) => (
            <li
              key={stop.id}
              className="flex items-center justify-between border p-2 rounded"
            >
              {stop.name}
              <button className="text-gray-500 hover:text-gray-800">&#8597;</button>
            </li>
          ))}
        </ul>

        {/* Options */}
        <div className="space-y-2">
          <div>
            <input type="checkbox" id="reorder" className="mr-2" />
            <label htmlFor="reorder">Let us re-order stops</label>
          </div>
          <div>
            <input type="checkbox" id="round-trip" className="mr-2" />
            <label htmlFor="round-trip">Round Trip</label>
          </div>
        </div>

        {/* Optimization */}
        <div>
          <label className="block mb-2">Optimize for</label>
          <div>
            <input type="radio" id="short-time" name="optimize" className="mr-2" />
            <label htmlFor="short-time">Short time</label>
          </div>
          <div>
            <input
              type="radio"
              id="short-distance"
              name="optimize"
              className="mr-2"
            />
            <label htmlFor="short-distance">Shortest distance</label>
          </div>
        </div>

        {/* Toggle More Settings */}
        <button
          onClick={toggleSettings}
          className="text-blue-500 hover:underline text-sm"
        >
          {showSettings ? "Hide route settings" : "More route settings"}
        </button>

        {showSettings && (
          <div className="mt-4 bg-gray-50 p-4 border rounded">
            {/* Additional settings here */}
            <p>Route setting options...</p>
          </div>
        )}

        {/* View Directions Button */}
        <button className="w-full bg-blue-500 text-white py-2 rounded mt-4">
          View route directions
        </button>
      </div>
    </div>
  );
}

