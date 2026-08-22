import { useState } from 'react';
import { Camera, AlertCircle, MapPin, Send } from 'lucide-react';
import { apiService } from '../services/apiService';
import { useNavigate } from 'react-router-dom';

const CitizenReport = () => {
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('Hazratganj, Lucknow (GPS Auto-detected)');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await apiService.createIncident({
        category: 'ROAD_ACCIDENT',
        description,
        address,
        location: { type: 'Point', coordinates: [80.9439, 26.8488] },
        severity: 8,
        isMedicalEmergency: true,
        affectedPeople: 1
      });
      alert('Emergency reported successfully! Dispatch is reviewing.');
      navigate('/');
    } catch (error) {
      alert(error.message || 'Failed to report emergency');
    } finally {
      setIsSubmitting(false);
    }
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
            <span className="text-sm font-bold uppercase tracking-wider text-text-muted mb-2 block">Location</span>
            <div className="flex relative">
              <MapPin className="absolute left-3 top-3 text-info" size={20} />
              <input 
                type="text" 
                className="w-full bg-primary-800 border border-primary-700 rounded-md py-3 pl-10 pr-4 text-text-main focus:border-info focus:ring-1 focus:ring-info outline-none shadow-sm"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </label>
        </div>

        <div className="bg-primary-800 border border-primary-700 rounded-lg p-6 text-center border-dashed shadow-sm">
          <Camera size={32} className="mx-auto text-text-muted mb-2" />
          <p className="text-sm text-text-muted font-medium mb-1">Attach Photo Evidence (Optional)</p>
          <p className="text-[10px] text-text-muted uppercase tracking-wider">Helps AI determine severity instantly</p>
        </div>

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
