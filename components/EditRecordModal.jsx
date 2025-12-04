import React, { useState, useEffect } from 'react';
import { X, Tractor, User } from 'lucide-react';

function EditRecordModal({ record, appId, close, db, doc, updateDoc }) {
  const [formData, setFormData] = useState({...record});

  // Auto-recalculate Total when Qty or Rate changes
  useEffect(() => {
    const qty = parseFloat(formData.quantity) || 0;
    const rt = parseFloat(formData.rate) || 0;
    setFormData(prev => ({ ...prev, total: qty * rt }));
  }, [formData.quantity, formData.rate]);

  const handleSave = async () => {
    try {
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'driverRecords', record.id);
      // Remove ID from data to avoid duplicating it in the doc field
      const { id, ...dataToSave } = formData;
      await updateDoc(docRef, dataToSave);
      alert("माहिती अपडेट झाली!");
      close();
    } catch(e) {
      console.error(e);
      alert("Error Updating");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="bg-green-700 text-white p-4 flex justify-between items-center sticky top-0 z-10">
          <h3 className="font-bold text-lg">रेकॉर्ड एडिट करा (Full Edit)</h3>
          <button onClick={close}><X size={24}/></button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Section 1: Driver Details */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2"><User size={18}/> चालक तपशील</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500">चालकाचे नाव</label>
                <input 
                  value={formData.driverName || ''} 
                  onChange={e => setFormData({...formData, driverName: e.target.value})}
                  className="w-full border p-2 rounded" 
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">मोबाईल</label>
                <input 
                  value={formData.driverMobile || ''} 
                  onChange={e => setFormData({...formData, driverMobile: e.target.value})}
                  className="w-full border p-2 rounded" 
                />
              </div>
            </div>
          </div>

          {/* Section 2: Farmer & Work Details */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2"><Tractor size={18}/> कामाचा तपशील</h4>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500">शेतकऱ्याचे नाव</label>
                <input 
                  value={formData.farmerName} 
                  onChange={e => setFormData({...formData, farmerName: e.target.value})}
                  className="w-full border p-2 rounded font-semibold" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="text-xs text-gray-500">तारीख</label>
                   <input 
                    value={formData.dateStr} 
                    onChange={e => setFormData({...formData, dateStr: e.target.value})}
                    className="w-full border p-2 rounded" 
                  />
                </div>
                <div>
                   <label className="text-xs text-gray-500">यंत्र (Tool Name)</label>
                   <input 
                    value={formData.toolName} 
                    onChange={e => setFormData({...formData, toolName: e.target.value})}
                    className="w-full border p-2 rounded" 
                  />
                </div>
              </div>

              {/* Conditional Fields based on existing data */}
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="text-xs text-gray-500">पीक (Crop - if any)</label>
                    <input 
                      value={formData.crop || ''} 
                      onChange={e => setFormData({...formData, crop: e.target.value})}
                      className="w-full border p-2 rounded" 
                      placeholder="e.g. Soyabean"
                    />
                 </div>
                 <div>
                    <label className="text-xs text-gray-500">Info (e.g. Size/Baras)</label>
                    <input 
                      value={formData.extraInfo || ''} 
                      onChange={e => setFormData({...formData, extraInfo: e.target.value})}
                      className="w-full border p-2 rounded" 
                    />
                 </div>
              </div>
            </div>
          </div>

          {/* Section 3: Calculations */}
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
             <h4 className="font-bold text-yellow-800 mb-3">बिलिंग तपशील</h4>
             <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-gray-600 block mb-1">प्रमाण (Qty)</label>
                  <input 
                    type="number" 
                    value={formData.quantity} 
                    onChange={e => setFormData({...formData, quantity: e.target.value})}
                    className="w-full border p-2 rounded font-bold text-center" 
                  />
                  <input 
                    value={formData.unit} 
                    onChange={e => setFormData({...formData, unit: e.target.value})}
                    className="w-full border mt-1 p-1 text-xs text-center bg-gray-100"
                    placeholder="Unit" 
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 block mb-1">दर (Rate)</label>
                  <input 
                    type="number" 
                    value={formData.rate} 
                    onChange={e => setFormData({...formData, rate: e.target.value})}
                    className="w-full border p-2 rounded font-bold text-center" 
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 block mb-1">एकूण (Auto)</label>
                  <div className="w-full border bg-gray-100 p-2 rounded font-bold text-center text-green-700">
                    {formData.total}
                  </div>
                </div>
             </div>
          </div>

          <button onClick={handleSave} className="w-full bg-green-700 text-white py-4 rounded-lg font-bold text-lg shadow-lg hover:bg-green-800">
            माहिती अपडेट करा (Save Changes)
          </button>

        </div>
      </div>
    </div>
  );
}

export default EditRecordModal;