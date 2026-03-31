import React from 'react';

export default function VectorDbCard({
  databases,
  selectedDb,
  setSelectedDb
}) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 font-sans h-full">
      
      {/* EXPLICITLY DARK HEADER */}
      <h2 className="text-2xl font-serif font-bold mb-1 flex items-center gap-2 text-gray-900">
        🗄️ ③ Vector Database
      </h2>
      <p className="text-sm text-gray-500 mb-6 border-b border-gray-100 pb-4">Stores & searches your embedding vectors</p>

      <p className="text-[10px] uppercase tracking-widest text-[#a39171] mb-4 font-bold">
        Select Plan
      </p>

      <div className="space-y-3 mb-8">
        {databases.map((db) => {
          const isSelected = selectedDb.id === db.id;
          
          return (
            <div
              key={db.id}
              onClick={() => setSelectedDb(db)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all flex justify-between items-center ${
                isSelected ? 'border-[#1e1a16] bg-[#1e1a16] shadow-md' : 'border-gray-200 bg-white hover:border-[#c49a45]'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* HIGH CONTRAST TITLE */}
                <span className={`font-bold ${isSelected ? 'text-white' : 'text-gray-900'}`}>{db.name}</span>
                {db.tag && (
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${isSelected ? 'border-gray-600 text-green-400' : 'border-gray-200 text-green-600 bg-green-50'}`}>
                    {db.tag}
                  </span>
                )}
              </div>
              <div className="text-right">
                {/* HIGH CONTRAST PRICE */}
                <div className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                  {db.price === 0 ? 'Free' : `$${db.price}/mo`}
                  {db.storageLimit && <span className={`font-normal ${isSelected ? 'text-gray-400' : 'text-gray-500'}`}> · {db.storageLimit}</span>}
                </div>
                <div className={`text-xs mt-0.5 ${isSelected ? 'text-gray-400' : 'text-gray-600'}`}>
                  {db.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-[#fdfbf7] p-5 rounded-lg border border-[#e8e3d9] flex justify-between items-center mt-auto">
        <div>
          <p className="font-serif font-bold text-lg text-gray-900">{selectedDb.name}</p>
          <p className="text-sm text-gray-600 mt-1">
            {selectedDb.storageLimit && `${selectedDb.storageLimit} · `}
            {selectedDb.description}
          </p>
        </div>
        <div className="text-right">
          <p className="font-serif font-bold text-3xl text-[#22c55e]">
            {selectedDb.price === 0 ? 'FREE' : `$${selectedDb.price}`}
          </p>
        </div>
      </div>
    </div>
  );
}