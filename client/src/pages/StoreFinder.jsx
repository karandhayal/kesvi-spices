import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Navigation, ChevronRight, Phone, Clock, Loader2, Map } from 'lucide-react';

// Change this to your actual backend URL (localhost for dev, actual URL for prod)
const BASE_URL = "https://parosa-755646660410.asia-south2.run.app/api"; 

// --- HAVERSINE FORMULA (Distance Calculation) ---
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const deg2rad = (deg) => deg * (Math.PI / 180);

const StoreFinder = () => {
  // --- STATE ---
  const [allStores, setAllStores] = useState([]); 
  const [displayedStores, setDisplayedStores] = useState([]); 
  const [cities, setCities] = useState([]); // List of cities from DB
  const [loading, setLoading] = useState(true);
  
  // Location & UI State
  const [locationStatus, setLocationStatus] = useState('idle'); // idle | locating | success | error
  const [selectedCity, setSelectedCity] = useState('');
  const [detectedCity, setDetectedCity] = useState('');

  // --- 1. INITIAL DATA FETCH ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Stores and Cities in parallel for speed
        const [storesRes, citiesRes] = await Promise.all([
          axios.get(`${BASE_URL}/stores`),
          axios.get(`${BASE_URL}/stores/cities`)
        ]);

        setAllStores(storesRes.data);
        setDisplayedStores(storesRes.data);
        setCities(citiesRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch data", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- 2. GPS HANDLER ---
  const handleUseMyLocation = () => {
    setLocationStatus('locating');
    setSelectedCity('');
    setDetectedCity('');

    if (!navigator.geolocation) {
      setLocationStatus('error');
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // A. Reverse Geocode (Find City Name via OpenStreetMap)
        try {
          const geoRes = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const address = geoRes.data.address;
          // Normalize city name logic
          const cityFound = address.city || address.town || address.village || address.state_district || "Unknown Location";
          setDetectedCity(cityFound);
        } catch (error) {
          console.error("Could not detect city name", error);
          setDetectedCity("Unknown Location");
        }

        // B. Calculate Distance & Sort
        const storesWithDistance = allStores.map(store => {
          const dist = calculateDistance(latitude, longitude, store.lat, store.lng);
          return { ...store, distance: dist };
        }).sort((a, b) => a.distance - b.distance);

        setDisplayedStores(storesWithDistance);
        setLocationStatus('success');
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLocationStatus('error');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // --- 3. MANUAL CITY FILTER ---
  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    setLocationStatus('idle'); 
    setDetectedCity('');

    if (city === "") {
      setDisplayedStores(allStores);
    } else {
      // Filter stores strictly by the selected city
      const filtered = allStores.filter(store => 
        store.city.toLowerCase() === city.toLowerCase()
      );
      setDisplayedStores(filtered);
    }
  };

  // --- LOADING VIEW ---
  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center bg-[#F9F9F9]">
        <Loader2 className="animate-spin text-gray-800 mb-4" size={40} />
        <p className="text-gray-500 font-serif tracking-widest text-sm">LOCATING BOUTIQUES...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">Find a Boutique</h1>
          <p className="text-gray-500 max-w-lg mx-auto leading-relaxed">
            Experience our collection in person. Locate the nearest Parosa store or browse by city.
          </p>
        </div>

        {/* --- CONTROLS SECTION --- */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 mb-10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            
            {/* 1. GPS Button */}
            <button 
              onClick={handleUseMyLocation}
              disabled={locationStatus === 'locating'}
              className={`w-full md:w-auto md:flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-lg text-sm font-bold uppercase tracking-widest transition-all duration-300
                ${locationStatus === 'locating' 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-900 text-white hover:bg-black hover:shadow-lg'
                }`}
            >
              {locationStatus === 'locating' ? (
                <> <Loader2 size={16} className="animate-spin" /> Locating... </>
              ) : (
                <> <Navigation size={16} /> Use My Current Location </>
              )}
            </button>

            {/* Divider */}
            <div className="hidden md:flex items-center justify-center w-12">
              <span className="text-xs text-gray-400 font-bold bg-[#F9F9F9] px-2 rounded-full">OR</span>
            </div>
            <div className="md:hidden w-full text-center border-b border-gray-100 leading-[0.1em] my-2">
              <span className="bg-white px-2 text-xs text-gray-400 font-bold">OR</span>
            </div>

            {/* 2. Manual Dropdown */}
            <div className="relative w-full md:w-auto md:flex-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <MapPin size={18} />
              </div>
              <select 
                value={selectedCity}
                onChange={handleCityChange}
                className="w-full appearance-none pl-12 pr-10 py-4 bg-white border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors cursor-pointer"
              >
                <option value="">Select City Manually</option>
                {cities.map((city) => (
                  <option key={city._id || city.name} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <ChevronRight size={16} className="rotate-90" />
              </div>
            </div>

          </div>

          {/* Messages */}
          {locationStatus === 'success' && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center text-center sm:text-left gap-3 text-sm text-green-800 bg-green-50 p-4 rounded-lg border border-green-100 animate-fade-in">
               <div className="bg-white p-1.5 rounded-full shadow-sm text-green-600">
                 <MapPin size={16} />
               </div>
               <span>
                 We detected you are near <strong>{detectedCity}</strong>. Showing closest stores:
               </span>
            </div>
          )}

          {locationStatus === 'error' && (
            <div className="mt-6 text-center text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
              Location access denied. Please select your city from the list instead.
            </div>
          )}
        </div>

        {/* --- STORE LIST GRID --- */}
        <div className="grid grid-cols-1 gap-6">
          {displayedStores.length > 0 ? (
            displayedStores.map((store) => (
              <a 
                key={store._id} 
                href={store.googleMapsUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative bg-white rounded-xl border border-gray-200 p-6 md:p-8 hover:shadow-xl hover:border-gray-300 transition-all duration-300 ease-out hover:-translate-y-1 block"
              >
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-6">
                  
                  {/* Left: Info */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-xl font-serif text-gray-900 group-hover:text-black transition-colors">
                        {store.name}
                      </h3>
                      {store.distance && (
                        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                          <Map size={10} /> {store.distance.toFixed(1)} km
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-500 text-sm leading-relaxed mb-4 max-w-lg">
                      {store.address}, {store.city}, {store.state} - {store.zip}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 md:gap-8 pt-4 border-t border-gray-100 mt-4">
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-medium uppercase tracking-wide">
                        <Clock size={14} className="text-gray-400" /> {store.timings}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-medium uppercase tracking-wide">
                        <Phone size={14} className="text-gray-400" /> {store.phone}
                      </div>
                    </div>
                  </div>

                  {/* Right: CTA */}
                  <div className="md:self-center">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-900 bg-gray-50 px-4 py-3 rounded-lg group-hover:bg-black group-hover:text-white transition-colors duration-300">
                      View Map <ChevronRight size={14} />
                    </div>
                  </div>

                </div>
              </a>
            ))
          ) : (
            // Empty State
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-xl border border-dashed border-gray-300">
              <MapPin size={48} className="text-gray-200 mb-4" />
              <p className="text-gray-500 font-medium">No stores found in this area.</p>
              <button 
                onClick={() => { setSelectedCity(''); setDisplayedStores(allStores); }}
                className="mt-4 text-sm text-gray-900 font-bold underline underline-offset-4 hover:text-black"
              >
                View all locations
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default StoreFinder;