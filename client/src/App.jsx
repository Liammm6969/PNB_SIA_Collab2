import './App.css'
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import MyAccount from './pages/MyAccount.jsx';

function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/home" element={<Dashboard />} />
      <Route path="/my-account" element={<MyAccount />} />
    </Routes>
    </>
  )
}

export default App
