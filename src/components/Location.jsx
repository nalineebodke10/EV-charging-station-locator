// src/components/Location.jsx
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";
import icon from "leaflet/dist/images/marker-icon.png";
import shadow from "leaflet/dist/images/marker-shadow.png";
import axios from "axios";

import StationCard from "./StationCard";

// Fix Leaflet default marker issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetina,
    iconUrl: icon,
    shadowUrl: shadow,
});

function Location({
    stateFilter,
    cityFilter,
    specification,
    chargerType,
    dealership,
    selectedSpecification,
}) {
    const [stations, setStations] = useState([]);
    const [filteredStations, setFilteredStations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch stations from API
    useEffect(() => {
        axios
            .get("http://localhost:8081/api/stations")
            .then((res) => {
                setStations(res.data);
                setFilteredStations(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Axios error:", err);
                setError("Failed to fetch charging stations");
                setLoading(false);
            });
    }, []);

    // Apply filters whenever props change
    useEffect(() => {
        let filtered = [...stations]; // always start from original data

        if (stateFilter) {
            filtered = filtered.filter(
                (st) => st.state?.toLowerCase() === stateFilter.toLowerCase()
            );
        }

        if (cityFilter) {
            filtered = filtered.filter(
                (st) => st.city?.toLowerCase() === cityFilter.toLowerCase()
            );
        }

        if (specification) {
            filtered = filtered.filter(
                (st) => String(st.specification) === String(specification)
            );
        }

        if (selectedSpecification) {
            filtered = filtered.filter(
                (st) => String(st.specification) === String(selectedSpecification)
            );
        }

        // ✅ Charger Type filter (AC/DC or both)
        if (chargerType) {
            if (Array.isArray(chargerType)) {
                filtered = filtered.filter((st) =>
                    chargerType.some((type) =>
                        st.chargerType?.toLowerCase().includes(type.toLowerCase())
                    )
                );
            } else {
                filtered = filtered.filter((st) =>
                    st.chargerType?.toLowerCase().includes(chargerType.toLowerCase())
                );
            }
        }

        // ✅ Dealership filter (e.g. DC-MG)
        if (dealership) {
            filtered = filtered.filter((st) =>
                st.dealership?.toLowerCase().includes(dealership.toLowerCase())
            );
        }

        setFilteredStations(filtered);
    }, [stations, stateFilter, cityFilter, specification, chargerType, dealership, selectedSpecification]);

    // ✅ Handle favorite API call
    const handleFavoriteClick = async (stationId, userId) => {
        try {
            const response = await axios.post(
                `http://localhost:8081/api/favorites/${userId}/${stationId}`
            );
            console.log("Favorite saved:", response.data);
            alert("Station added to favorites!");
        } catch (error) {
            console.error("Error saving favorite:", error);
            alert("Failed to save favorite. Please try again.");
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-8 shadow-lg rounded-lg w-[85%] bg-white my-[4%] p-4 block mx-auto">
            {/* Left Side - List of filtered stations */}
            <div className="col-span-2">
                <StationCard
                    stations={filteredStations}
                    handleFavoriteClick={handleFavoriteClick}
                />
            </div>

            {/* Right Side - Map */}
            <div className="col-span-6">
                {!loading && !error && (
                    <MapContainer
                        center={[20.5937, 78.9629]}
                        zoom={5}
                        scrollWheelZoom={true}
                        className="w-full h-[500px] rounded-lg shadow"
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        />
                        {filteredStations.map((st) => (
                            <Marker key={st.id} position={[st.latitude, st.longitude]}>
                                <Popup>
                                    <strong>{st.name}</strong>
                                    <br />
                                    {st.address}
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                )}
            </div>
        </div>
    );
}

export default Location;
