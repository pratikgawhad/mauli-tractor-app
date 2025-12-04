import React from 'react';

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

export default DriverDashboard;