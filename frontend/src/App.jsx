import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CreatePaper from './component/Createpaper'
import ViewPaper from './component/Viewpaper'
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import UploadPaper from './component/Uploadpaper'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <BrowserRouter>
      <UploadPaper/>
      <ViewPaper/>
     </BrowserRouter>
    </>
  )
}

export default App
