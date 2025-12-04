import React, { useState } from 'react';
import { Search, Edit, Trash2, User } from 'lucide-react';
import EditRecordModal from './EditRecordModal';

function AdminDashboard({ records, appId, setView, db, doc, deleteDoc, updateDoc }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingRecord, setEditingRecord] = useState(null);

  // Search Logic
  const filteredRecords = records.filter(r => 
    r.farmerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.toolName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.driverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.dateStr?.includes(searchTerm)
  );

  const deleteRecord = async (id) => {
    if(!confirm("ही नोंद कायमची हटवायची आहे का? (Delete?)")) return;
    try {
      await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'driverRecords', id));
    } catch(e) { console.error(e); }
  };

  return (
    <div className="pb-24">
      {/* Edit Modal Component */}
      {editingRecord && (
        <EditRecordModal 
          record={editingRecord} 
          appId={appId} 
          close={() => setEditingRecord(null)} 
          db={db}
          doc={doc}
          updateDoc={updateDoc}
        />
      )}

      {/* Admin Nav */}
      <div className="flex gap-4 mb-6">
        <button className="flex-1 bg-green-700 text-white py-3 rounded-lg shadow font-bold">सर्व नोंदी</button>
        <button onClick={() => setView('billing')} className="flex-1 bg-white text-green-700 border-2 border-green-700 py-3 rounded-lg shadow font-bold">बिलिंग</button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <input 
          type="text"
          placeholder="शेतकरी, चालक, तारीख किंवा यंत्र शोधा..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border rounded-lg shadow-sm outline-none focus:ring-2 ring-green-500"
        />
        <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
      </div>

      {/* Records List */}
      <div className="space-y-4">
        {filteredRecords.map(rec => (
          <div key={rec.id} className="bg-white p-4 rounded-xl shadow border-l-4 border-green-500 relative">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-lg text-gray-800">{rec.farmerName}</h3>
                <p className="text-xs text-gray-500 mb-1">{rec.dateStr} • {rec.toolName}</p>
                
                {/* Driver Info Badge */}
                <div className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-xs text-gray-700 mb-1">
                  <User size={12}/> {rec.driverName || 'Unknown'} ({rec.driverMobile || 'N/A'})
                </div>

                <div className="flex flex-wrap gap-2 mt-1">
                    {rec.crop && <span className="text-xs bg-yellow-100 px-2 py-0.5 rounded text-yellow-800 border border-yellow-200">{rec.crop}</span>}
                    {rec.extraInfo && <span className="text-xs bg-blue-100 px-2 py-0.5 rounded text-blue-800 border border-blue-200">{rec.extraInfo}</span>}
                </div>
              </div>
              <div className="text-right">
                <span className="block font-bold text-green-700 text-xl">₹{rec.total}</span>
                <span className="text-xs text-gray-500">{rec.quantity} {rec.unit} x {rec.rate}</span>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-3 border-t pt-2 border-dashed">
              <button onClick={() => setEditingRecord(rec)} className="text-blue-600 flex items-center gap-1 text-sm font-semibold bg-blue-50 px-3 py-1 rounded hover:bg-blue-100 transition">
                <Edit size={16}/> संपादित करा (Edit)
              </button>
              <button onClick={() => deleteRecord(rec.id)} className="text-red-600 flex items-center gap-1 text-sm font-semibold bg-red-50 px-3 py-1 rounded hover:bg-red-100 transition">
                <Trash2 size={16}/> हटवा
              </button>
            </div>
          </div>
        ))}
        {filteredRecords.length === 0 && <p className="text-center text-gray-500 mt-10">काहीही सापडले नाही.</p>}
      </div>
    </div>
  );
}

export default AdminDashboard;