import { useState } from 'react';
import { Camera, AlertCircle, MapPin, Send, X } from 'lucide-react';
import { apiService } from '../services/apiService';
import { useNavigate } from 'react-router-dom';

const CitizenReport = () => {
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [media, setMedia] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locating, setLocating] = useState(false);
  const navigate = useNavigate();

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser. Please enter your location manually.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        setLatitude(lat);
        setLongitude(lng);
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          if (response.ok) {
            const data = await response.json();
            if (data && data.display_name) {
              setAddress(data.display_name);
            } else {
              setAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
            }
          } else {
            setAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
          }
        } catch (error) {
          console.error("Reverse geocoding failed:", error);
          setAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        } finally {
          setLocating(false);
        }
      },
      (error) => {
        setLocating(false);
        console.error("Geolocation error:", error);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert("Location permission denied. Please enter your location manually.");
            break;
          case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable. Please enter manually.");
            break;
          case error.TIMEOUT:
            alert("The request to get user location timed out. Please enter manually.");
            break;
          default:
            alert("An unknown error occurred while getting location.");
            break;
        }
      },
      { timeout: 10000 }
    );
  };

  const forwardGeocode = async (addressQuery) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressQuery)}`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
        }
      }
    } catch (err) {
      console.error("Forward geocoding failed", err);
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let finalLat = latitude;
      let finalLng = longitude;
      
      // If no GPS coordinates, try to geocode the manual address
      if (finalLat === null || finalLng === null) {
        if (!address.trim()) {
          throw new Error("Please provide an address or use your current location.");
        }
        const geo = await forwardGeocode(address);
        if (geo) {
          finalLat = geo.lat;
          finalLng = geo.lng;
          setLatitude(finalLat);
          setLongitude(finalLng);
        } else {
          throw new Error("Could not find coordinates for this address. Please try 'Use My Current Location' or provide a more specific city/street.");
        }
      }
      
      if (!isFinite(finalLat) || !isFinite(finalLng) || finalLat < -90 || finalLat > 90 || finalLng < -180 || finalLng > 180) {
        throw new Error("Invalid coordinates generated. Please try again.");
      }
      let payload;
      if (mediaFile) {
        payload = new FormData();
        payload.append('category', 'ROAD_ACCIDENT');
        payload.append('description', description + ' [Includes Photo Evidence]');
        payload.append('address', address);
        payload.append('latitude', finalLat);
        payload.append('longitude', finalLng);
        payload.append('severity', 8);
        payload.append('isMedicalEmergency', true);
        payload.append('affectedPeople', 1);
        payload.append('media', mediaFile);
      } else {
        payload = {
          category: 'ROAD_ACCIDENT',
          description: description,
          address,
          latitude: finalLat,
          longitude: finalLng,
          severity: 8,
          isMedicalEmergency: true,
          affectedPeople: 1
        };
      }
      
      await apiService.createIncident(payload);
      alert('Emergency reported successfully! Dispatch is reviewing.');
      navigate('/');
    } catch (error) {
      alert(error.message || 'Failed to report emergency');
    } finally {
      setIsSubmitting(false);
    }
  };

  const [mediaFile, setMediaFile] = useState(null);

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if(file) {
      setMediaFile(file);
      const reader = new FileReader();
      reader.onload = (event) => setMedia(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Reset coordinates if user manually changes the address
  const handleAddressChange = (e) => {
    setAddress(e.target.value);
    setLatitude(null);
    setLongitude(null);
  };

  return (
    <div className="min-h-screen bg-transparent text-text-main flex flex-col p-6 font-sans relative z-10">
      <header className="mb-8 border-b border-primary-700 pb-4">
        <h1 className="text-2xl font-bold text-text-main flex items-center gap-2">
          <AlertCircle className="text-emergency" />
          Declare Emergency
        </h1>
        <p className="text-sm text-text-muted mt-1">Your report will be analyzed by AI and sent directly to central command.</p>
      </header>

      <form onSubmit={handleSubmit} className="flex-1 max-w-2xl mx-auto w-full space-y-6">
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-bold uppercase tracking-wider text-text-muted mb-2 block">What is the emergency?</span>
            <textarea 
              required
              rows={4}
              className="w-full bg-primary-800 border border-primary-700 rounded-md p-4 text-text-main focus:border-info focus:ring-1 focus:ring-info outline-none resize-none shadow-sm"
              placeholder="E.g., Severe car crash on main road, 2 people injured..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </label>

          <label className="block">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold uppercase tracking-wider text-text-muted">Location</span>
              <button 
                type="button" 
                onClick={handleGetCurrentLocation}
                disabled={locating}
                className="text-info text-xs font-bold uppercase hover:underline flex items-center gap-1 disabled:opacity-50"
              >
                {locating ? "Locating..." : "Use My Current Location"}
              </button>
            </div>
            <div className="flex relative">
              <MapPin className="absolute left-3 top-3 text-info" size={20} />
              <input 
                type="text" 
                required
                className="w-full bg-primary-800 border border-primary-700 rounded-md py-3 pl-10 pr-4 text-text-main focus:border-info focus:ring-1 focus:ring-info outline-none shadow-sm"
                placeholder="Enter address manually or use GPS"
                value={address}
                onChange={handleAddressChange}
              />
            </div>
          </label>
        </div>

        <label className="bg-primary-800 border border-primary-700 rounded-lg p-6 text-center border-dashed shadow-sm cursor-pointer hover:bg-primary-600 block transition-colors">
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            className="hidden" 
            onChange={handleMediaChange}
          />
          {media ? (
            <div className="mt-2 relative inline-block">
               <img src={media} alt="Evidence" className="max-h-48 mx-auto rounded-lg shadow-sm" />
               <button 
                 type="button" 
                 onClick={(e) => { e.preventDefault(); setMedia(null); }} 
                 className="absolute -top-2 -right-2 bg-emergency text-white rounded-full p-1 shadow-md hover:scale-105 transition-transform"
               >
                 <X size={14}/>
               </button>
            </div>
          ) : (
            <>
              <Camera size={32} className="mx-auto text-text-muted mb-2" />
              <p className="text-sm text-text-muted font-medium mb-1">Attach Photo Evidence (Optional)</p>
              <p className="text-[10px] text-text-muted uppercase tracking-wider">Capture or select an image</p>
            </>
          )}
        </label>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full py-4 bg-emergency hover:bg-emergency-hover text-white font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(229,57,53,0.3)] disabled:opacity-50"
        >
          {isSubmitting ? 'Transmitting to Command...' : (
            <>
              Submit Report <Send size={18} />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CitizenReport;
