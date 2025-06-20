
import './App.css'
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/home" element={<Dashboard />} />
    </Routes>
    </>
  )
}

export default App
