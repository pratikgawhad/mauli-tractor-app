import React, { useState } from 'react';
import { Tractor, Users } from 'lucide-react';

function LoginScreen({ setView, setDriverDetails }) {
  const [showDriverForm, setShowDriverForm] = useState(false);
  const [dName, setDName] = useState('');
  const [dMobile, setDMobile] = useState('');

  const handleDriverLogin = () => {
    if (!dName || !dMobile) {
      alert("कृपया नाव आणि मोबाईल नंबर टाका");
      return;
    }
    setDriverDetails({ name: dName, mobile: dMobile });
    setView('driver');
  };

  if (showDriverForm) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg mt-10 animate-fade-in">
        <h2 className="text-2xl font-bold text-center mb-6 text-green-800">चालकाची माहिती</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1 font-bold">चालकाचे नाव</label>
            <input 
              type="text" 
              value={dName}
              onChange={(e) => setDName(e.target.value)}
              className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-green-500 outline-none"
              placeholder="नाव टाका"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-bold">मोबाईल नंबर</label>
            <input 
              type="tel" 
              value={dMobile}
              onChange={(e) => setDMobile(e.target.value)}
              className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-green-500 outline-none"
              placeholder="मोबाईल नंबर"
            />
          </div>
          
          <button 
            onClick={handleDriverLogin}
            className="w-full bg-green-700 text-white py-3 rounded-lg text-lg font-semibold mt-4 shadow-md"
          >
            पुढे जा (Dashboard)
          </button>
          
          <button 
            onClick={() => setShowDriverForm(false)}
            className="w-full text-gray-500 py-2 text-sm"
          >
            मागे जा
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 mt-10">
      <div className="bg-white p-6 rounded-xl shadow-md text-center">
        <h2 className="text-xl font-bold mb-6 text-gray-800">स्वागत आहे</h2>
        <div className="space-y-4">
          <button 
            onClick={() => setShowDriverForm(true)}
            className="w-full bg-green-600 hover:bg-green-700 text-white text-xl py-6 rounded-lg shadow-lg flex items-center justify-center gap-3 transition-transform active:scale-95"
          >
            <Tractor size={32} />
            चालक लॉगिन
          </button>
          
          <button 
            onClick={() => setView('admin-login')}
            className="w-full bg-gray-800 hover:bg-gray-900 text-white text-xl py-6 rounded-lg shadow-lg flex items-center justify-center gap-3 transition-transform active:scale-95"
          >
            <Users size={32} />
            ॲडमिन लॉगिन
          </button>
        </div>
      </div>
      <p className="text-center text-gray-500 text-sm">माऊली कृषी सेवा केंद्र</p>
    </div>
  );
}

export default LoginScreen;