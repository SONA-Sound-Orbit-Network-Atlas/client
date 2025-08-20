import { Routes, Route, BrowserRouter } from "react-router-dom"
import StellarSystem from "./pages/StellarSystem"

function App() {

  return (
    <>
      <h1>SONA</h1>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StellarSystem />} />
          <Route path="/stellar-system" element={<StellarSystem />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
