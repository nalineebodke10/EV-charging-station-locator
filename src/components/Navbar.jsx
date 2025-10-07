import React from 'react'
import { NavLink } from 'react-router'
import logo from '../assets/icons/logo.png'
import { useNavigate } from "react-router";
 
function Navbar() {
    const navigate = useNavigate();
    return (
        <div className="static top-0 h-16 bg-[#ffffff] shadow-sm border-b-1 border-stone-200 flex px-10 items-center gap-10 font-semibold text-stone-600" >
            <img src={logo} alt='logo' className='h-14 bg-white' />
            <NavLink to="/" className={({ isActive }) => isActive ? "border-b-3 border-indigo-500 py-5 " : "hover:border-b-3 border-stone-300 py-5"} >Home</NavLink>
            <NavLink to="/contact" className={({ isActive }) => isActive ? "border-b-3 border-indigo-500 py-5 " : "hover:border-b-3 border-stone-300 py-5"}>Contact</NavLink>
            <NavLink to="/about" className={({ isActive }) => isActive ? "border-b-3 border-indigo-500 py-5 " : "hover:border-b-3 border-stone-300 py-5"}>About</NavLink>

            <button
                className="border rounded-md px-3 py-1 bg-[rgb(230,100,113)] text-white hover:bg-[rgb(220,97,110)] cursor-pointer ml-auto"
                onClick={() => navigate("/login")}
            >
                Login
            </button>
        </div>
    )
}

export default Navbar