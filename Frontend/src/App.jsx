import { Routes, Route } from "react-router-dom";
import './App.css'
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Profile from "./pages/profile";
import AdminPage from  './pages/admin';

// import Login from './pages/Login.jsx'
// import Register from './pages/Register.jsx'
// import Dashboard from './pages/Dashboard.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path='/profile' element={<Profile/>}/>
      <Route path='/admin' element={<AdminPage/>}/>
    </Routes>
  )
}

export default App;
