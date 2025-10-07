// src/components/StationCard.jsx
import React, { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { useNavigate } from "react-router";

function StationCard({ stations, handleFavoriteClick }) {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // ✅ Check login only once on mount
    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    const handleLikeClick = (stationId) => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId"); // ✅ get userId for favorite API

        if (!token) {
            navigate("/login");
        } else {
            // pass both stationId and userId to parent handler
            handleFavoriteClick?.(stationId, userId);
        }
    };

    return (
        <div className="col-span-2 overflow-y-auto max-h-[500px] pr-2">
            <h2 className="text-xl font-semibold mb-4">Charging Stations</h2>

            {stations.length === 0 ? (
                <p className="text-gray-500">No stations available</p>
            ) : (
                stations.map((st) => (
                    <div
                        key={st.id}
                        className="p-4 mb-4 border rounded-lg shadow hover:shadow-lg transition-all bg-white"
                    >
                        {/* Card Header: Name + Favorite Button */}
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-bold text-lg">{st.name}</h3>
                            <button
                                className="text-lg"
                                onClick={() => handleLikeClick(st.id)}
                            >
                                {st.isFavorite ? "💖" : "🤍"}
                            </button>
                        </div>

                        {/* Station Details */}
                        <p className="text-sm text-gray-600 mb-1">{st.address}</p>
                        <p className="text-sm text-gray-500 mb-1">Latitude: {st.latitude}</p>
                        <p className="text-sm text-gray-500 mb-1">Longitude: {st.longitude}</p>
                        <p className="text-sm text-gray-500 mb-1">Charger Type: {st.chargerType}</p>
                        <p className="text-sm text-gray-500 mb-2">Specification: {st.specification}</p>

                        {/* Phone Number (if available) */}
                        {st.phone && (
                            <div className="flex items-center gap-2 text-blue-600">
                                <Phone size={18} />
                                <a href={`tel:${st.phone}`} className="hover:underline">
                                    {st.phone}
                                </a>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}

export default StationCard;

