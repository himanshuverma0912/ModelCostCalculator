import React from 'react';

// Define the shape of a Model
interface Model {
  id: string;
  name: string;
  tag? : string;
  inPrice: number;
  outPrice: number;
  source: string;
  dotColor: string;
  tagColor: string;
  cacheRate?: number;
}

// Define the Props for the component
interface AllModelsRankedProps {
  models: Model[];
  selectedModel: Model;
  setSelectedModel: (model: Model) => void;
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
      {/* HIGH CONTRAST HEADER */}
      <h2 className="text-2xl font-serif font-bold mb-1 flex items-center gap-2 text-gray-900">
        ⚖️ All Models Ranked
      </h2>
      <p className="text-sm text-gray-500 mb-8 border-b border-gray-100 pb-4">
        Click any model to select it
      </p>

      <div className="space-y-6">
        {modelsWithCosts.map((m) => {
          const percentFilled = (m.monthlyCost / maxCost) * 100;
          const isSelected = selectedModel.id === m.id;

          return (
            <div 
              key={m.id} 
              className="group cursor-pointer"
              onClick={() => setSelectedModel(m)}
            >
              <div className="flex justify-between items-center mb-2">
                
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${m.dotColor}`}></span>
                  {/* DARKER MODEL NAME */}
                  <span className={`font-bold text-sm ${isSelected ? 'text-black' : 'text-gray-900'}`}>
                    {m.name}
                  </span>
                  
                  {/* DUAL TAG CONTAINER */}
                  <div className="flex items-center gap-1.5 ml-1">
                    {/* Tag 1: Always show the original tag */}
                    {m.tag && (
                      <span 
                        className={`text-[9px] px-1.5 py-0.5 rounded font-bold border ${isSelected ? 'border-gray-500 bg-gray-100' : 'border-current bg-gray-50'}`}
                        style={{ color: m.tagColor }}
                      >
                        {m.tag}
                      </span>
                    )}
                    {/* Tag 2: Append 'SELECTED' if active */}
                    {isSelected && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-bold border border-gray-400 bg-gray-100 text-gray-600 tracking-wide uppercase">
                        SELECTED
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  {/* READABLE PRICE BREAKDOWN */}
                  <span className={`${isSelected ? 'text-gray-400' : 'text-gray-600'} text-xs font-medium`}>
                    ${m.inPrice}/${parseFloat((m.inPrice * 0.1).toFixed(4))}/${m.outPrice}
                  </span>
                  <span 
                    className={`font-bold font-mono ${isSelected ? 'text-lg' : 'text-base'}`}
                    style={{ color: isSelected ? '#000' : m.tagColor }}
                  >
                    ${m.monthlyCost.toLocaleString(undefined, {minimumFractionDigits: 2})}/mo
                  </span>
                </div>
              </div>

              {/* SHARPER PROGRESS BAR */}
              <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden mb-1 border border-gray-100">
                <div 
                  className={`h-full transition-all duration-500 ${m.dotColor}`} 
                  style={{ width: `${percentFilled}%`, opacity: isSelected ? 1 : 0.85 }}
                ></div>
              </div>

              {/* READABLE SOURCE TEXT */}
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