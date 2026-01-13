import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import { MapPin, Navigation, ChevronRight, Phone, Clock, Loader2 } from 'lucide-react'; 

// Use your backend URL (or import it from context if you have it centrally)
const BASE_URL = "https://parosa-755646660410.asia-south2.run.app/api"; 

// --- HAVERSINE FORMULA (Calculates distance in KM) ---
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
  // State
  const [allStores, setAllStores] = useState([]); // Raw data from DB
  const [displayedStores, setDisplayedStores] = useState([]); // Filtered/Sorted data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter State
  const [locationStatus, setLocationStatus] = useState('idle'); 
  const [selectedCity, setSelectedCity] = useState('');

  // Extract unique cities from currently loaded stores
  const uniqueCities = [...new Set(allStores.map(item => item.city))];

  // --- 1. FETCH DATA ON MOUNT ---
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/stores`);
        setAllStores(res.data);
        setDisplayedStores(res.data); // Show all initially
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch stores", err);
        setError("Unable to load store locations.");
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  // --- 2. HANDLER: GET USER LOCATION ---
  const handleUseMyLocation = () => {
    setLocationStatus('locating');
    if (!navigator.geolocation) {
      setLocationStatus('error');
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Calculate distance for all stores and sort
        const storesWithDistance = allStores.map(store => {
          const dist = calculateDistance(latitude, longitude, store.lat, store.lng);
          return { ...store, distance: dist };
        }).sort((a, b) => a.distance - b.distance); // Sort Nearest First

        setDisplayedStores(storesWithDistance);
        setLocationStatus('success');
        setSelectedCity(''); // Clear manual filter
      },
      (error) => {
        console.error(error);
        setLocationStatus('error');
      }
    );
  };

  // --- 3. HANDLER: MANUAL CITY SELECTION ---
  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    setLocationStatus('idle');

    if (city === "") {
      setDisplayedStores(allStores);
    } else {
      const filtered = allStores.filter(store => store.city === city);
      setDisplayedStores(filtered);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-parosa-bg">
        <Loader2 className="animate-spin text-parosa-dark" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-parosa-bg text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 bg-parosa-bg">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif text-parosa-dark mb-3">Find a Boutique</h1>
          <p className="text-gray-500 text-sm">Locate the nearest Parosa store to experience our collection in person.</p>
        </div>

        {/* CONTROLS */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* OPTION 1: Auto Detect */}
          <button 
            onClick={handleUseMyLocation}
            disabled={locationStatus === 'locating'}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-parosa-dark text-white px-6 py-3 rounded text-xs uppercase tracking-widest font-bold hover:bg-parosa-accent transition-colors"
          >
            {locationStatus === 'locating' ? 'Locating...' : (
              <>
                <Navigation size={14} />
                Use My Current Location
              </>
            )}
          </button>

          <span className="text-xs text-gray-400 font-bold uppercase">OR</span>

          {/* OPTION 2: Manual Select */}
          <div className="w-full md:w-1/2 relative">
            <MapPin size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select 
              value={selectedCity}
              onChange={handleCityChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded focus:outline-none focus:border-parosa-dark bg-white appearance-none text-sm"
            >
              <option value="">Select your City manually</option>
              {uniqueCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            <ChevronRight size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 rotate-90" />
          </div>
        </div>

        {/* STATUS MESSAGES */}
        {locationStatus === 'success' && (
          <div className="mb-6 text-center text-sm text-green-700 bg-green-50 py-2 rounded">
            Showing stores nearest to your location.
          </div>
        )}
        {locationStatus === 'error' && (
          <div className="mb-6 text-center text-sm text-red-600 bg-red-50 py-2 rounded">
            Couldn't access location. Please select your city manually below.
          </div>
        )}

        {/* STORE LIST */}
        <div className="grid grid-cols-1 gap-6">
          {displayedStores.length > 0 ? (
            displayedStores.map((store) => (
              <a 
                key={store._id} 
                href={store.googleMapsUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group block bg-white p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-serif text-parosa-dark">{store.name}</h3>
                      {store.distance && (
                        <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-bold">
                          {store.distance.toFixed(1)} km away
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm mb-3">{store.address}, {store.city}, {store.state} - {store.zip}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <Clock size={12} /> {store.timings}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone size={12} /> {store.phone}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-parosa-dark text-xs font-bold uppercase tracking-widest group-hover:text-green-700 transition-colors">
                    View on Map <ChevronRight size={16} className="ml-1" />
                  </div>
                </div>
              </a>
            ))
          ) : (
            <div className="text-center py-12 text-gray-400 text-sm">
              No stores found in this location.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default StoreFinder;