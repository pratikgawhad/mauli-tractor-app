import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  signInWithCustomToken, 
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  Tractor, 
  Users, 
  Save, 
  Search, 
  Printer, 
  Share2, 
  ArrowLeft, 
  Edit, 
  Trash2,
  X,
  Phone,
  User,
  Calendar
} from 'lucide-react';

// 🔥 Firebase Config तुमचे (येथे टाका)
const firebaseConfig = {
  apiKey: "AIzaSyDrmcBGKDTBSpofjIyZFcq3ph1dgziDytg",
  authDomain: "mauli-tractor.firebaseapp.com",
  projectId: "mauli-tractor",
  storageBucket: "mauli-tractor.firebasestorage.app",
  messagingSenderId: "921547270076",
  appId: "1:921547270076:web:94396dc21f39a6e14eedb9",
  measurementId: "G-TXSSJ5FC1C"
};

// Firebase Initialize
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = 'mauli-tractor';

// --- Constants ---
const ADMIN_ID = "Mauli123";
const ADMIN_PASS = "Mauli@123";

const TOOLS = [
  { id: 'trolly', name: 'ट्रॅक्टर ट्रॉली', icon: '🚛', type: 'special_trolly' },
  { id: 'hedamb', name: 'हेडंब', icon: '🌾', type: 'special_hedamb' },
  { id: 'perni', name: 'पेरणी यंत्र', icon: '🌱', type: 'fixed', rate: 1000, unit: 'एकर' },
  { id: 'teenfad', name: 'तीन फाड हरभरा', icon: '🌿', type: 'fixed', rate: 1500, unit: 'एकर' },
  { id: 'paltifad', name: 'पलटी फाड', icon: '🚜', type: 'hybrid_palti', defaultRate: 1500 },
  { id: 'panji', name: 'पांजी', icon: '⛏️', type: 'fixed', rate: 600, unit: 'एकर' },
  { id: 'tiri', name: 'तिरी', icon: '🥢', type: 'fixed', rate: 600, unit: 'एकर' },
  { id: 'ekka', name: 'एक्का', icon: '🗡️', type: 'fixed', rate: 400, unit: 'एकर' },
  { id: 'vakhar', name: 'वखर', icon: '🔪', type: 'fixed', rate: 500, unit: 'एकर' },
  { id: 'rotavator', name: 'रोटाव्हेटर', icon: '⚙️', type: 'special_rota' },
];

const CROPS = [
  { name: 'सोयाबीन', rate: 250 },
  { name: 'तूर', rate: 200 },
  { name: 'हरभरा', rate: 200 },
  { name: 'मक्का', rate: 200 },
  { name: 'उडीद', rate: 200 },
  { name: 'मूग', rate: 200 },
  { name: 'ज्वारी', rate: 200 },
  { name: 'गहू', rate: 200 },
  { name: 'इतर', rate: 200 },
];

// --- Main App ---
export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login'); 
  const [records, setRecords] = useState([]);
  const [selectedTool, setSelectedTool] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // New State for Driver Details
  const [driverDetails, setDriverDetails] = useState({ name: '', mobile: '' });

  useEffect(() => {
    const initAuth = async () => {
      await signInAnonymously(auth);
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'driverRecords'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      docs.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setRecords(docs);
    }, (err) => console.error("Data fetch error", err));
    return () => unsubscribe();
  }, [user]);

  if (loading) return <div className="flex h-screen items-center justify-center bg-green-50 text-green-800">लोड होत आहे...</div>;

  return (
    <div className="min-h-screen bg-gray-100 font-sans pb-10">
      {/* Header */}
      <div className="bg-green-700 text-yellow-300 p-4 shadow-lg sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-2" onClick={() => setView('login')}>
          <Tractor size={32} />
          <div className="leading-tight">
            <h1 className="text-xl font-bold tracking-wider">माऊली ट्रॅक्टर</h1>
            {driverDetails.name && !isAdmin && view !== 'login' && (
              <p className="text-xs text-white">चालक: {driverDetails.name}</p>
            )}
            {isAdmin && view !== 'login' && (
              <p className="text-xs text-white">ॲडमिन मोड</p>
            )}
          </div>
        </div>
        {view !== 'login' && (
          <button 
            onClick={() => { setView('login'); setIsAdmin(false); setDriverDetails({name:'', mobile:''}); }}
            className="text-white text-xs bg-green-800 px-3 py-2 rounded border border-green-600"
          >
            बाहेर पडा
          </button>
        )}
      </div>

      <div className="p-4 max-w-md mx-auto md:max-w-2xl lg:max-w-4xl">
        {view === 'login' && <LoginScreen setView={setView} setDriverDetails={setDriverDetails} />}
        {view === 'admin-login' && <AdminLogin setView={setView} setIsAdmin={setIsAdmin} />}
        {view === 'driver' && <DriverDashboard setView={setView} setSelectedTool={setSelectedTool} />}
        {view === 'form' && selectedTool && (
          <ToolForm 
            tool={selectedTool} 
            setView={setView} 
            appId={appId}
            driverDetails={driverDetails}
            db={db}
            serverTimestamp={serverTimestamp}
            addDoc={addDoc}
            collection={collection}
          />
        )}
        {view === 'admin' && isAdmin && (
          <AdminDashboard 
            records={records} 
            appId={appId} 
            setView={setView}
            db={db}
            doc={doc}
            deleteDoc={deleteDoc}
          />
        )}
        {view === 'billing' && isAdmin && (
          <BillingSystem records={records} setView={setView} />
        )}
      </div>
    </div>
  );
}

// --- 1. Login Screen with Driver Details Form ---
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

// --- 2. Admin Login ---
function AdminLogin({ setView, setIsAdmin }) {
  const [uid, setUid] = useState('');
  const [pass, setPass] = useState('');

  const handleLogin = () => {
    if (uid === ADMIN_ID && pass === ADMIN_PASS) {
      setIsAdmin(true);
      setView('admin');
    } else {
      alert('चुकीचे आयडी किंवा पासवर्ड');
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mt-10">
      <h2 className="text-2xl font-bold text-center mb-6 text-green-800">ॲडमिन प्रवेश</h2>
      <div className="space-y-4">
        <input 
          type="text" 
          value={uid}
          onChange={(e) => setUid(e.target.value)}
          className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-green-500 outline-none"
          placeholder="User ID"
        />
        <input 
          type="password" 
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          className="w-full border-2 border-gray-300 p-3 rounded-lg focus:border-green-500 outline-none"
          placeholder="Password"
        />
        <button 
          onClick={handleLogin}
          className="w-full bg-green-700 text-white py-3 rounded-lg text-lg font-semibold mt-4"
        >
          लॉगिन करा
        </button>
        <button onClick={() => setView('login')} className="w-full text-gray-500 py-2 text-sm">मागे जा</button>
      </div>
    </div>
  );
}

// --- 3. Driver Dashboard ---
function DriverDashboard({ setView, setSelectedTool }) {
  const handleSelect = (tool) => {
    setSelectedTool(tool);
    setView('form');
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-gray-700 border-l-4 border-green-600 pl-3">कामाचा प्रकार निवडा</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {TOOLS.map((tool) => (
          <div 
            key={tool.id}
            onClick={() => handleSelect(tool)}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center gap-3 active:bg-green-50 transition cursor-pointer h-32"
          >
            <span className="text-4xl">{tool.icon}</span>
            <span className="text-lg font-bold text-gray-800 text-center leading-tight">{tool.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- 4. Tool Form (Updated with Driver Details) ---
function ToolForm({ tool, setView, appId, driverDetails, db, serverTimestamp, addDoc, collection }) {
  const [formData, setFormData] = useState({
    farmerName: '',
    quantity: '',
    rate: '',
    total: 0,
    crop: 'सोयाबीन',
    unit: '',
    extraInfo: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let initData = { ...formData };
    if (tool.type === 'fixed') {
      initData.rate = tool.rate;
      initData.unit = tool.unit;
    } else if (tool.type === 'special_trolly') {
      initData.unit = 'फेऱ्या (Trips)';
      initData.extraInfo = '1 Baras';
    } else if (tool.type === 'special_hedamb') {
      initData.unit = 'क्विंटल';
      initData.crop = 'सोयाबीन';
      initData.rate = 250;
    } else if (tool.type === 'hybrid_palti') {
      initData.unit = 'एकर';
      initData.rate = 1500;
    } else if (tool.type === 'special_rota') {
      initData.unit = 'एकर';
      initData.rate = 800;
    }
    setFormData(initData);
  }, [tool]);

  useEffect(() => {
    const qty = parseFloat(formData.quantity) || 0;
    const rt = parseFloat(formData.rate) || 0;
    setFormData(prev => ({ ...prev, total: qty * rt }));
  }, [formData.quantity, formData.rate]);

  const handleCropChange = (cropName) => {
    const crop = CROPS.find(c => c.name === cropName);
    setFormData(prev => ({ ...prev, crop: cropName, rate: crop ? crop.rate : 200 }));
  };

  const handleRotaTypeChange = (type) => {
    let newRate = 800, newUnit = 'एकर';
    if (type === 'opt1') { newRate = 800; newUnit = 'एकर'; }
    if (type === 'opt2') { newRate = 1000; newUnit = 'तास'; }
    if (type === 'opt3') { newRate = 1200; newUnit = 'तास'; }
    setFormData(prev => ({ ...prev, rate: newRate, unit: newUnit }));
  };

  const handleSubmit = async () => {
    if (!formData.farmerName || !formData.quantity || !formData.total) {
      alert("कृपया सर्व माहिती भरा");
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'driverRecords'), {
        toolId: tool.id,
        toolName: tool.name,
        farmerName: formData.farmerName,
        quantity: parseFloat(formData.quantity),
        rate: parseFloat(formData.rate),
        total: parseFloat(formData.total),
        unit: formData.unit,
        extraInfo: formData.extraInfo,
        crop: tool.id === 'hedamb' ? formData.crop : null,
        
        // --- NEW: Saving Driver Details ---
        driverName: driverDetails.name,
        driverMobile: driverDetails.mobile,
        
        createdAt: serverTimestamp(),
        dateStr: new Date().toLocaleDateString('en-IN')
      });
      alert("माहिती यशस्वीरित्या जतन केली!");
      setView('driver');
    } catch (e) {
      console.error(e);
      alert("त्रुटी आली. पुन्हा प्रयत्न करा.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg pb-24">
      <div className="flex items-center gap-2 mb-6 border-b pb-4">
        <button onClick={() => setView('driver')} className="p-2 bg-gray-100 rounded-full"><ArrowLeft size={20} /></button>
        <h2 className="text-xl font-bold text-green-800">{tool.name} नोंदणी</h2>
      </div>

      <div className="bg-yellow-50 p-3 rounded-lg mb-4 border border-yellow-200">
        <p className="text-sm text-yellow-800 font-semibold">चालक: {driverDetails.name} ({driverDetails.mobile})</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-gray-700 font-bold mb-2">शेतकऱ्याचे नाव</label>
          <input 
            type="text"
            value={formData.farmerName}
            onChange={e => setFormData({...formData, farmerName: e.target.value})}
            className="w-full p-3 border-2 border-gray-300 rounded-lg text-lg"
            placeholder="नाव टाका"
          />
        </div>

        {tool.type === 'special_trolly' && (
          <div>
            <label className="block text-gray-700 font-bold mb-2">ट्रॉली साईझ</label>
            <div className="flex gap-4">
              {['1 Baras', '1.25 Baras'].map(size => (
                <button 
                  key={size}
                  onClick={() => setFormData({...formData, extraInfo: size})}
                  className={`flex-1 py-3 rounded-lg border-2 ${formData.extraInfo === size ? 'border-green-600 bg-green-50 text-green-800 font-bold' : 'border-gray-200'}`}
                >
                  {size === '1 Baras' ? '1 बारस' : '1.25 बारस'}
                </button>
              ))}
            </div>
          </div>
        )}

        {tool.type === 'special_hedamb' && (
          <div>
            <label className="block text-gray-700 font-bold mb-2">पीक निवडा</label>
            <select 
              value={formData.crop}
              onChange={e => handleCropChange(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg text-lg bg-white"
            >
              {CROPS.map(c => <option key={c.name} value={c.name}>{c.name} (₹{c.rate})</option>)}
            </select>
          </div>
        )}

        {tool.type === 'hybrid_palti' && (
          <div>
             <label className="block text-gray-700 font-bold mb-2">कामाचा प्रकार</label>
            <div className="flex gap-4 mb-2">
              <button onClick={() => setFormData({...formData, unit: 'एकर', rate: 1500})} className={`flex-1 py-2 rounded border ${formData.unit === 'एकर' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}>एकर (₹1500)</button>
              <button onClick={() => setFormData({...formData, unit: 'तास', rate: 0})} className={`flex-1 py-2 rounded border ${formData.unit === 'तास' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}>तास (मॅन्युअल)</button>
            </div>
          </div>
        )}

        {tool.type === 'special_rota' && (
          <div>
            <label className="block text-gray-700 font-bold mb-2">दर निवडा</label>
            <select onChange={e => handleRotaTypeChange(e.target.value)} className="w-full p-3 border-2 border-gray-300 rounded-lg text-lg bg-white">
              <option value="opt1">₹800 प्रति एकर</option>
              <option value="opt2">₹1000 प्रति तास</option>
              <option value="opt3">₹1200 प्रति तास</option>
            </select>
          </div>
        )}

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-gray-700 font-bold mb-2">{tool.type === 'special_trolly' ? 'फेऱ्या / Trips' : (formData.unit || 'प्रमाण')}</label>
            <input 
              type="number"
              value={formData.quantity}
              onChange={e => setFormData({...formData, quantity: e.target.value})}
              className="w-full p-3 border-2 border-gray-300 rounded-lg text-lg"
              placeholder="0"
            />
          </div>
          
          <div className="flex-1">
            <label className="block text-gray-700 font-bold mb-2">दर (Rate)</label>
            <input 
              type="number"
              value={formData.rate}
              readOnly={tool.type === 'fixed' || (tool.type === 'special_hedamb') || (tool.type === 'hybrid_palti' && formData.unit === 'एकर')}
              onChange={e => setFormData({...formData, rate: e.target.value})}
              className={`w-full p-3 border-2 rounded-lg text-lg ${tool.type === 'fixed' ? 'bg-gray-100 text-gray-500' : 'bg-white border-green-500'}`}
            />
          </div>
        </div>

        <div className="bg-green-100 p-4 rounded-xl flex justify-between items-center">
          <span className="text-green-800 font-bold text-lg">एकूण रक्कम:</span>
          <span className="text-3xl font-bold text-green-900">₹{formData.total}</span>
        </div>

        <button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-green-600 hover:bg-green-700 text-white text-xl py-4 rounded-lg shadow-lg flex items-center justify-center gap-2 mt-4"
        >
          <Save size={24} />
          {isSubmitting ? 'जतन होत आहे...' : 'जतन करा'}
        </button>
      </div>
    </div>
  );
}

// --- 5. Admin Dashboard (Updated with Full Edit) ---
function AdminDashboard({ records, appId, setView, db, doc, deleteDoc }) {
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

// --- 6. New Component: Edit Record Modal ---
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

// --- 7. Billing System (Updated) ---
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