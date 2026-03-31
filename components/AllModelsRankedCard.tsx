import React from 'react';
import { Model } from '../types'; 

interface AllModelsRankedProps {
  models: Model[];
  selectedModel: Model;
  setSelectedModel: (model: Model) => void;
  onRemoveModel: (id: string) => void; // <-- 1. ADD NEW PROP TYPE
  users: number;
  msgsPerDay: number;
  inputTokens: number;
  outputTokens: number;
  useCaching: boolean;
  cachedTokens: number;
}

export default function AllModelsRankedCard({
  models,
  selectedModel,
  setSelectedModel,
  onRemoveModel, // <-- 2. DESTRUCTURE IT HERE
  users,
  msgsPerDay,
  inputTokens,
  outputTokens,
  useCaching,
  cachedTokens
}: AllModelsRankedProps) {
  
  const modelsWithCosts = models.map(m => {
    const totalMsgs = users * msgsPerDay * 30;
    const actualCachedTokens = useCaching ? Math.min(inputTokens, cachedTokens) : 0;
    const uncachedTokens = inputTokens - actualCachedTokens;
    const cachePrice = m.inPrice * (m.cacheRate || 0.10);

    const uncachedCost = (uncachedTokens / 1000000) * m.inPrice;
    const cachedCost = (actualCachedTokens / 1000000) * cachePrice;
    const outputCost = (outputTokens / 1000000) * m.outPrice;
    
    const costPerMsg = uncachedCost + cachedCost + outputCost;
    const monthlyCost = costPerMsg * totalMsgs;

    return { ...m, monthlyCost };
  });

  const maxCost = Math.max(...modelsWithCosts.map(m => m.monthlyCost), 1);

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 font-sans h-full">
      <h2 className="text-2xl font-serif font-bold mb-1 flex items-center gap-2 text-gray-900">
        ⚖️ All Models Ranked
      </h2>
      <p className="text-sm text-gray-500 mb-8 border-b border-gray-100 pb-4">
        Click any model to select it
      </p>

      <div className="space-y-6">
        {modelsWithCosts.map((m) => {
          const percentFilled = (m.monthlyCost / maxCost) * 100;
          const isSelected = selectedModel?.id === m.id;

          return (
            <div 
              key={m.id} 
              className="group cursor-pointer relative" // <-- Added 'relative'
              onClick={() => setSelectedModel(m)}
            >
              <div className="flex justify-between items-center mb-2">
                
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className={`min-w-2.5 min-h-2.5 w-2.5 h-2.5 rounded-full ${m.dotColor}`}></span>
                  <span className={`font-bold text-sm truncate ${isSelected ? 'text-black' : 'text-gray-900'}`}>
                    {m.name}
                  </span>
                  
                  <div className="flex items-center gap-1.5 ml-1 flex-shrink-0">
                    {m.tag && (
                      <span 
                        className={`text-[9px] px-1.5 py-0.5 rounded font-bold border ${isSelected ? 'border-gray-500 bg-gray-100' : 'border-current bg-gray-50'}`}
                        style={{ color: m.tagColor }}
                      >
                        {m.tag}
                      </span>
                    )}
                    {isSelected && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-bold border border-gray-400 bg-gray-100 text-gray-600 tracking-wide uppercase">
                        SELECTED
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm pl-2">
                  <span className={`${isSelected ? 'text-gray-400' : 'text-gray-600'} text-xs font-medium hidden sm:inline-block`}>
                    ${m.inPrice}/${parseFloat((m.inPrice * (m.cacheRate || 0.1)).toFixed(4))}/${m.outPrice}
                  </span>
                  <span 
                    className={`font-bold font-mono ${isSelected ? 'text-lg' : 'text-base'}`}
                    style={{ color: isSelected ? '#000' : m.tagColor }}
                  >
                    ${m.monthlyCost.toLocaleString(undefined, {minimumFractionDigits: 2})}/mo
                  </span>
                  
                  {/* 3. NEW REMOVE BUTTON */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Stops the row from being "clicked" and selected
                      onRemoveModel(m.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-500 px-1 font-bold text-lg"
                    title="Remove Model"
                  >
                    ×
                  </button>

                </div>
              </div>

              <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden mb-1 border border-gray-100">
                <div 
                  className={`h-full transition-all duration-500 ${m.dotColor}`} 
                  style={{ width: `${percentFilled}%`, opacity: isSelected ? 1 : 0.85 }}
                ></div>
              </div>

              <div className={`text-[10px] font-mono ${isSelected ? 'text-gray-400' : 'text-gray-600'} font-medium`}>
                in/cached/out — source: {m.source}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}