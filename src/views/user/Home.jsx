import React, { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import location from '../../assets/icons/location.png'
import manu from '../../assets/icons/menu.png'
import { motion } from "framer-motion";
import "leaflet/dist/leaflet.css";
import Location from '../../components/location';
import LoginRegister from './LoginRegister';
import axios from "axios";

function Home() {
    console.log("UserId from localStorage:", localStorage.getItem("userId"));


    const [userId, setUserId] = useState(localStorage.getItem("userId"));
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("userId"));

    const [stateFilter, setStateFilter] = useState("");
    const [cityFilter, setCityFilter] = useState("");
    const [specification, setSpecification] = useState("");
    const [chargerType, setChargerType] = useState("");
    const [dealership, setDealership] = useState("");
    const [showDealershipDropdown, setShowDealershipDropdown] = useState(false);

    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedSpecification, setSelectedSpecification] = useState("");
    const [specifications, setSpecifications] = useState([]);

    // Fetch States
    useEffect(() => {
        fetch("http://localhost:8081/api/stations/states")
            .then((res) => res.json())
            .then((data) => setStates(data))
            .catch((err) => console.error("Error fetching states:", err));
    }, []);

    // Fetch Cities based on State
    useEffect(() => {
        if (stateFilter) {
            fetch(`http://localhost:8081/api/stations/cities/${stateFilter}`)
                .then((res) => res.json())
                .then((data) => setCities(data))
                .catch((err) => console.error("Error fetching cities:", err));
        } else {
            setCities([]);
        }
    }, [stateFilter]);

    // Fetch Specifications
    useEffect(() => {
        fetch("http://localhost:8081/api/stations/specifications")
            .then((res) => res.json())
            .then((data) => setSpecifications(data))
            .catch((err) => console.error("Error fetching specifications:", err));
    }, []);

    // Sync login state when userId changes
    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) {
            setUserId(storedUserId);
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    const toggleOrSet = (current, value, setter) => {
        setter(current === value ? "" : value);
    };

    const handleFavoriteClick = async (stationId) => {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        if (!userId || !token) {
            setShowLoginModal(true);
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:8081/api/favorites/${userId}/${stationId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // ✅ send token
                    },
                }
            );
            console.log("Favorite saved:", response.data);
            alert("Station added to favorites!");

        } catch (error) {
            console.error("Error saving favorite:", error);
            alert("Failed to save favorite. Please try again.");
        }
    };



    return (
        <div>
            <Navbar onLoginClick={() => setShowLoginModal(true)} />
            <div
                className="h-[80vh] w-full bg-cover bg-center relative"
                style={{ backgroundImage: "url('/src/assets/images/hero-section-bg-img.png')" }}>

                <motion.h4
                    initial={{ x: -200, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="text-[rgb(217,57,74)] text-4xl font-bold p-0 absolute top-20 left-18"
                    style={{ fontFamily: "Merienda" }}
                >
                    Power Up Anywhere Anytime.
                </motion.h4>

                <p className="text-stone-600 text-sm text-center p-0 absolute top-32 left-18">
                    Your journey shouldn’t pause for a plug. Find the fastest chargers near <br /> you and keep moving without limits.
                </p>

                {/* ---------- FILTER DROPDOWNS ---------- */}
                <div className="w-full max-w-xl mx-auto p-4 rounded-lg absolute top-55 left-12">
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* State Dropdown (dynamic) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                State <span className="text-red-500">*</span>
                            </label>
                            <select
                                className="w-60 border-b-2 border-gray-300 focus:border-emerald-500 outline-none py-2"
                                value={stateFilter}
                                onChange={(e) => {
                                    setStateFilter(e.target.value);
                                    setCityFilter("");
                                }}
                            >
                                <option value="">All</option>
                                {states.map((state) => (
                                    <option key={state} value={state}>
                                        {state}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* City Dropdown (depends on state) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                City <span className="text-red-500">*</span>
                            </label>
                            <select
                                className="w-60 border-b-2 border-gray-300 focus:border-emerald-500 outline-none py-2"
                                value={cityFilter}
                                onChange={(e) => setCityFilter(e.target.value)}
                                disabled={!stateFilter}
                            >
                                <option value="">All</option>
                                {cities.map((city) => (
                                    <option key={city} value={city}>
                                        {city}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Charger Specification */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Charger Specification <span className="text-red-500">*</span>
                            </label>
                            <select
                                className="w-60 border-b-2 border-gray-300 focus:border-emerald-500 outline-none py-2"
                                value={selectedSpecification}
                                onChange={(e) => setSelectedSpecification(e.target.value)}
                            >
                                <option value="">All</option>
                                {specifications.map((spec, index) => (
                                    <option key={index} value={spec}>
                                        {spec}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </form>
                </div>
            </div>

            {/* ---------- FILTER BUTTONS ---------- */}
            <div className="w-full p-6 bg-white min-h-screen">
                <div className="flex flex-wrap gap-2 justify-center mb-6 bg-white w-110 p-3 rounded-lg shadow block mx-auto">
                    <div className='flex gap-1 border-r-2 border-gray-400 border-dashed pr-2'>
                        <div className='rounded-md border border-gray-500 bg-white shadow p-0.5 text-sm w-13 text-center'>
                            <button className=' h-full w-[50%] cursor-pointer'>
                                <img src={location} className='h-5' />
                            </button>
                            <button className=' h-full w-[50%] cursor-pointer'>
                                <img src={manu} className='h-5' />
                            </button>
                        </div>
                    </div>

                    <button
                        className="px-3 h-7 rounded-md border border-gray-500 shadow text-sm cursor-pointer"
                        onClick={() => setChargerType("AC")}
                        type="button"
                    >
                        AC
                    </button>

                    <button
                        className="px-3 h-7 rounded-md border border-gray-500 shadow text-sm cursor-pointer"
                        onClick={() => setChargerType("DC")}
                        type="button"
                    >
                        DC
                    </button>

                    {/* Dealership Dropdown */}
                    {showDealershipDropdown && (
                        <div className="absolute mt-1 w-40 rounded-md shadow-lg bg-white border border-gray-200 z-10">
                            <ul className="py-1">
                                <li
                                    className="px-3 py-1 text-sm hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                        setDealership("");
                                        setShowDealershipDropdown(false);
                                    }}
                                >
                                    All
                                </li>
                                <li
                                    className="px-3 py-1 text-sm hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                        setDealership("DC-MG");
                                        setShowDealershipDropdown(false);
                                    }}
                                >
                                    DC-MG
                                </li>
                                <li
                                    className="px-3 py-1 text-sm hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                        setDealership("IOCL");
                                        setShowDealershipDropdown(false);
                                    }}
                                >
                                    IOCL
                                </li>
                            </ul>
                        </div>
                    )}

                    <button
                        className="px-3 h-7 rounded-md border border-gray-500 shadow text-sm cursor-pointer bg-white"
                        type="button"
                        onClick={() => setShowDealershipDropdown(!showDealershipDropdown)}
                    >
                        Dealership ▾
                    </button>

                    <button
                        className="px-3 h-7 rounded-md border border-gray-500 shadow text-sm cursor-pointer"
                        onClick={() => toggleOrSet(chargerType, ["AC", "DC"], setChargerType)}
                        type="button"
                    >
                        AC & DC
                    </button>
                </div>

                {/* ---------- MAP COMPONENT WITH FILTERS ---------- */}
                <Location
                    stateFilter={stateFilter}
                    cityFilter={cityFilter}
                    specification={specification}
                    chargerType={chargerType}
                    dealership={dealership}
                    selectedSpecification={selectedSpecification}
                    handleFavoriteClick={handleFavoriteClick}
                />
            </div>
        </div>
    )
}

export default Home