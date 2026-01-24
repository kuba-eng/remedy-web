"use client";

import { useState, useCallback, memo } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { cn } from "@/lib/utils";
import { MapPin, Navigation } from "lucide-react";

const containerStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "0px",
};

const center = {
    lat: 49.5606914, // Žďár nad Sázavou (Doležalovo náměstí 73/2)
    lng: 15.9404878,
};

// Premium Dark/Minimalist Style
const mapStyles = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
    },
    {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
    },
    {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
    },
    {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
    },
    {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
    },
    {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
    },
    {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
    },
    {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
    },
    // Buildings & POIs - Visible but Dark
    {
        featureType: "landscape.man_made",
        elementType: "geometry.fill",
        stylers: [{ visibility: "on" }, { color: "#2b3544" }]
    },
    {
        featureType: "landscape.man_made",
        elementType: "geometry.stroke",
        stylers: [{ visibility: "on" }, { color: "#3e4c60" }]
    },
    {
        featureType: "poi.business",
        elementType: "labels.text.fill",
        stylers: [{ visibility: "on" }, { color: "#746855" }]
    },
    {
        featureType: "poi.business",
        elementType: "labels.icon",
        stylers: [{ visibility: "simplified" }, { saturation: -100 }, { lightness: -40 }]
    },
    // Custom Overrides for Remedy Brand
    {
        featureType: "all",
        elementType: "labels.icon",
        stylers: [{ visibility: "simplified" }]
    }
];

const options = {
    disableDefaultUI: true,
    zoomControl: true,
    scrollwheel: false, // Prevent scroll interference
    gestureHandling: "cooperative", // "Use two fingers to move"
    styles: mapStyles,
    tilt: 45, // Enable 45-degree imagery if available
};

export const CustomMap = memo(function CustomMap() {
    const { isLoaded, loadError } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "", // Ensure env var is set
    });

    const [isOpen, setIsOpen] = useState(false);

    // If no API key, show placeholder
    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
        return (
            <div className="w-full h-full min-h-[400px] bg-neutral-900 rounded-[24px] flex flex-col items-center justify-center text-neutral-500 border border-white/10 p-8 text-center">
                <MapPin className="w-12 h-12 mb-4 text-[#D9F99D] opacity-50" />
                <p className="font-bold mb-2">Google Maps API Key Required</p>
                <p className="text-sm max-w-sm">Please add `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` to your environment variables to view the premium map.</p>
            </div>
        )
    }

    if (loadError) {
        return (
            <div className="w-full h-full min-h-[400px] bg-neutral-900 rounded-[24px] flex items-center justify-center text-red-400">
                Map cannot be loaded right now.
            </div>
        );
    }

    // Custom Green Marker Icon (SVG Data URI)
    const markerIcon = `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="#D9F99D" stroke="#1a1a1a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3" fill="#1a1a1a"></circle>
    </svg>
    `)}`;

    return isLoaded ? (
        <div className="w-full h-full min-h-[400px] relative overflow-hidden bg-neutral-900">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={15}
                options={options}
            >
                <Marker
                    position={center}
                    onClick={() => setIsOpen(true)}
                    icon={markerIcon}
                />

                {isOpen && (
                    <InfoWindow
                        position={center}
                        onCloseClick={() => setIsOpen(false)}
                    >
                        {/* Glassmorphism Info Window Content */}
                        {/* Note: Google Maps InfoWindow styling is tricky to override completely via CSS.
                        We usually style the *content*. */}
                        <div className="p-1 min-w-[200px]">
                            <h3 className="font-bold text-[#1a1a1a] mb-1">REMEDY</h3>
                            <p className="text-sm text-neutral-600 mb-3">Doležalovo náměstí 73/2<br />Žďár nad Sázavou</p>

                            <a
                                href="https://www.google.com/maps/dir/?api=1&destination=Doležalovo+náměstí+73/2,+Žďár+nad+Sázavou"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-[#1a1a1a] text-[#D9F99D] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-black transition-colors"
                            >
                                <Navigation className="w-3 h-3" />
                                Navigovat
                            </a>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </div>
    ) : (
        // Loading State (Skeleton)
        <div className="w-full h-full min-h-[500px] bg-neutral-900 animate-pulse rounded-[24px]" />
    );
});
