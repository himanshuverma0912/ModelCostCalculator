import React from 'react';

// Define the shape of an Embedding Model
interface EmbeddingModel {
  id: string;
  name: string;
  provider: string;
  price: number;
  dimensions: string;
  tag?: string; 
}

interface EmbeddingCardProps {
  models: EmbeddingModel[];
  selectedModel: EmbeddingModel | null; // Changed to allow null
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
}: EmbeddingCardProps) {
  
  // Logic: Use 0 if no model is selected yet to prevent "Vanishing"
  const totalDailyTokensPerUser = EMBEDDING_CATEGORIES.reduce((sum, cat) => sum + cat.dailyTokens, 0);
  const totalMonthlyTokens = totalDailyTokensPerUser * users * 30;
  const totalMonthlyCost = (totalMonthlyTokens / 1000000) * (selectedModel?.price ?? 0);

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 font-sans h-full">
      
      <h2 className="text-2xl font-serif font-bold mb-1 flex items-center gap-2 text-gray-900">
        🔢 ② Embedding Model
      </h2>
      <p className="text-sm text-gray-500 mb-6 border-b border-gray-100 pb-4">
        Converts text to vectors for RAG storage & search
      </p>

      {/* DYNAMIC DROPDOWN SELECTOR */}
      <div className="bg-[#fdfbf7] p-5 rounded-lg border border-[#e8e3d9] mb-8">
        <p className="text-[10px] uppercase tracking-widest text-[#a39171] mb-2 font-bold">
          Select Embedding Model ({models.length} available)
        </p>
        <select 
          className="w-full p-3 border border-gray-300 rounded-lg text-sm font-medium bg-white focus:border-[#c49a45] focus:outline-none transition-all cursor-pointer text-gray-900 shadow-sm"
          value={selectedModel?.id || ""}
          onChange={(e) => {
            const model = models.find(m => m.id === e.target.value);
            if (model) setSelectedModel(model);
          }}
        >
          <option value="" disabled>-- Select a Model --</option>
          {models.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name} ({m.provider}) — {m.price === 0 ? 'Free' : `$${m.price}/1M`}
            </option>
          ))}
        </select>
        
        {/* DETAILS PREVIEW - Only shows if model is selected */}
        {selectedModel && (
          <div className="mt-3 flex justify-between items-center text-[11px] font-mono text-gray-500 px-1">
            <span>Provider: <span className="text-gray-800">{selectedModel.provider}</span></span>
            <span>Dim: <span className="text-gray-800">{selectedModel.dimensions}</span></span>
          </div>
        )}
      </div>

      <p className="text-[10px] uppercase tracking-widest text-[#a39171] mb-4 font-bold mt-8">
        What gets embedded (per user per day)
      </p>

      <div className="bg-[#fdfbf7] p-5 rounded-lg border border-[#e8e3d9]">
        <div className="space-y-4 text-sm text-gray-700">
          {EMBEDDING_CATEGORIES.map((cat, index) => {
            const monthlyCost = ((cat.dailyTokens * users * 30) / 1000000) * (selectedModel?.price ?? 0);
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