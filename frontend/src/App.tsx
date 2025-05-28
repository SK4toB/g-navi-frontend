import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './index.css' // App.css가 아니라 Tailwind가 들어있는 CSS

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800">
      <div className="flex gap-4">
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="h-16" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="h-16" alt="React logo" />
        </a>
      </div>

      <h1 className="text-4xl font-bold mt-6">Vite + React + Tailwind</h1>

      <div className="mt-4 p-4 bg-white rounded shadow">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </button>
        <p className="mt-2 text-sm text-gray-600">
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>

      <p className="mt-6 text-gray-500 text-sm">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
