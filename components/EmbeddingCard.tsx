import React from 'react';

// Define the shape of an Embedding Model
interface EmbeddingModel {
  id: string;
  name: string;
  provider: string;
  price: number;
  dimensions: string;
  tag?: string; // Optional to prevent the error we discussed
}

interface EmbeddingCardProps {
  models: EmbeddingModel[];
  selectedModel: EmbeddingModel;
  setSelectedModel: (model: EmbeddingModel) => void;
  users: number;
}

const EMBEDDING_CATEGORIES = [
  { name: "User messages", dailyTokens: 500 },
  { name: "Sage responses", dailyTokens: 4000 },
  { name: "Workout sessions", dailyTokens: 200 },
  { name: "Daily check-ins", dailyTokens: 50 },
  { name: "RAG queries", dailyTokens: 350 }
];

export default function EmbeddingCard({ 
  models, 
  selectedModel, 
  setSelectedModel,
  users 
}:EmbeddingCardProps) {
  const totalDailyTokensPerUser = EMBEDDING_CATEGORIES.reduce((sum, cat) => sum + cat.dailyTokens, 0);
  const totalMonthlyTokens = totalDailyTokensPerUser * users * 30;
  const totalMonthlyCost = (totalMonthlyTokens / 1000000) * selectedModel.price;

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 font-sans h-full">
      
      {/* EXPLICITLY DARK HEADER */}
      <h2 className="text-2xl font-serif font-bold mb-1 flex items-center gap-2 text-gray-900">
        🔢 ② Embedding Model
      </h2>
      <p className="text-sm text-gray-500 mb-6 border-b border-gray-100 pb-4">Converts text to vectors for RAG storage & search</p>

      <p className="text-[10px] uppercase tracking-widest text-[#a39171] mb-4 font-bold">
        Select Embedding Model
      </p>

      <div className="space-y-3 mb-8">
        {models.map((m) => {
          const isSelected = selectedModel.id === m.id;
          
          return (
            <div 
              key={m.id}
              onClick={() => setSelectedModel(m)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all flex justify-between items-center ${
                isSelected ? 'border-[#1e1a16] bg-[#1e1a16] shadow-md' : 'border-gray-200 bg-white hover:border-[#c49a45]'
              }`}
            >
              <div className="flex items-center gap-2">
                {/* HIGH CONTRAST TEXT */}
                <span className={`font-bold ${isSelected ? 'text-white' : 'text-gray-900'}`}>{m.name}</span>
                <span className={`text-xs ${isSelected ? 'text-gray-400' : 'text-gray-500'}`}>
                  {m.provider}
                </span>
                {m.tag && (
                  <span className={`text-[10px] px-2 py-0.5 ml-2 rounded font-bold border ${isSelected ? 'border-gray-600 text-green-400' : 'border-gray-200 text-green-600 bg-green-50'}`}>
                    {m.tag}
                  </span>
                )}
              </div>
              <div className="text-right flex items-center gap-2 text-sm font-bold">
                {/* HIGH CONTRAST PRICE */}
                <span className={isSelected ? 'text-white' : 'text-gray-900'}>
                  {m.price === 0 ? 'Free' : `$${m.price}/1M`}
                </span>
                <span className={`text-xs font-normal ${isSelected ? 'text-gray-400' : 'text-gray-500'}`}>
                  · {m.dimensions}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[10px] uppercase tracking-widest text-[#a39171] mb-4 font-bold mt-8">
        What gets embedded (per user per day)
      </p>

      <div className="bg-[#fdfbf7] p-5 rounded-lg border border-[#e8e3d9]">
        <div className="space-y-4 text-sm text-gray-700">
          {EMBEDDING_CATEGORIES.map((cat, index) => {
            const monthlyCost = ((cat.dailyTokens * users * 30) / 1000000) * selectedModel.price;
            return (
              <div key={index} className="flex justify-between items-center border-b border-gray-200 pb-2 last:border-0 last:pb-0">
                <span className="w-1/3 font-medium">{cat.name}</span>
                <span className="w-1/3 text-right text-gray-500">{cat.dailyTokens} tok/day</span>
                <span className="w-1/3 text-right font-mono text-blue-600 font-bold">
                  ${monthlyCost.toFixed(4)}/mo
                </span>
              </div>
            );
          })}
          <div className="flex justify-between pt-3 border-t border-[#d1c8b8] font-bold text-gray-900 mt-2">
            <span>Total / month</span>
            <span className="font-mono text-blue-700 text-lg">${totalMonthlyCost.toFixed(4)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}