import React, { useState } from 'react';
import { ArrowLeft, Printer, Share2 } from 'lucide-react';

function BillingSystem({ records, setView }) {
  const [selectedFarmer, setSelectedFarmer] = useState('');
  const farmers = [...new Set(records.map(r => r.farmerName))].sort();
  const farmerRecords = selectedFarmer ? records.filter(r => r.farmerName === selectedFarmer) : [];
  const grandTotal = farmerRecords.reduce((sum, r) => sum + (r.total || 0), 0);

  const handlePrint = () => window.print();
  const handleShare = () => {
    let text = `*माऊली ट्रॅक्टर बिल*\nशेतकरी: ${selectedFarmer}\n------------------\n`;
    farmerRecords.forEach(r => {
      text += `${r.toolName}: ${r.quantity} ${r.unit} x ${r.rate} = ₹${r.total}\n`;
    });
    text += `------------------\n*एकूण: ₹${grandTotal}*`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="print:hidden">
        <div className="flex items-center gap-2 mb-4 p-4 border-b">
          <button onClick={() => setView('admin')} className="bg-gray-100 p-2 rounded-full"><ArrowLeft size={20}/></button>
          <h2 className="text-xl font-bold">बिलिंग सिस्टम</h2>
        </div>
        <div className="p-4">
          <label className="block text-gray-700 font-bold mb-2">शेतकरी निवडा</label>
          <select value={selectedFarmer} onChange={e => setSelectedFarmer(e.target.value)} className="w-full p-3 border-2 border-gray-300 rounded-lg text-lg mb-6 bg-white">
            <option value="">-- निवडा --</option>
            {farmers.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
      </div>

      {selectedFarmer && (
        <div className="p-4 print:p-0">
          <div className="border-2 border-gray-800 p-6 rounded-lg print:border-0 print:p-0">
            <div className="text-center mb-6 border-b-2 border-gray-800 pb-4">
              <h1 className="text-3xl font-bold text-green-800 mb-1">माऊली कृषी सेवा केंद्र</h1>
              <p className="text-gray-600">ट्रॅक्टर सर्व्हिसेस आणि अवजारे</p>
              <p className="font-bold mt-2 text-lg">बिल पावती</p>
            </div>
            <div className="flex justify-between mb-4 font-bold text-lg">
              <span>नाव: {selectedFarmer}</span>
              <span>दिनांक: {new Date().toLocaleDateString('en-IN')}</span>
            </div>
            <table className="w-full mb-6 text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-800">
                  <th className="py-2">तपशील</th>
                  <th className="py-2 text-right">प्रमाण</th>
                  <th className="py-2 text-right">दर</th>
                  <th className="py-2 text-right">रक्कम</th>
                </tr>
              </thead>
              <tbody>
                {farmerRecords.map((r, i) => (
                  <tr key={i} className="border-b border-gray-300">
                    <td className="py-2">
                      {r.toolName}
                      <span className="block text-xs text-gray-500">
                        {r.dateStr} {r.driverName ? `• ${r.driverName}` : ''}
                      </span>
                    </td>
                    <td className="py-2 text-right text-gray-600">{r.quantity} {r.unit}</td>
                    <td className="py-2 text-right text-gray-600">{r.rate}</td>
                    <td className="py-2 text-right font-bold">{r.total}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-800 text-xl font-bold">
                  <td colSpan="3" className="py-4 text-right">एकूण रक्कम:</td>
                  <td className="py-4 text-right">₹{grandTotal}</td>
                </tr>
              </tfoot>
            </table>
            <div className="print:hidden flex gap-4 mt-8">
              <button onClick={handlePrint} className="flex-1 bg-gray-800 text-white py-3 rounded-lg flex items-center justify-center gap-2"><Printer size={20} /> प्रिंट</button>
              <button onClick={handleShare} className="flex-1 bg-green-600 text-white py-3 rounded-lg flex items-center justify-center gap-2"><Share2 size={20} /> WhatsApp</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BillingSystem;