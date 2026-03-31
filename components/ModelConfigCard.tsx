import React from 'react';
export interface Model {
  id: string;
  name: string;
  inPrice: number;
  outPrice: number;
  dotColor: string;
  tagColor: string;
  tag?: string;      // Optional to stay safe
  source : string;
  cacheRate?: number;
}

interface ModelConfigProps {
  models: Model[];
  selectedModel: Model;
  setSelectedModel: (m: Model) => void;
  inputTokens: number;
  setInputTokens: (v: number) => void;
  outputTokens: number;
  setOutputTokens: (v: number) => void;
  useCaching: boolean;
  setUseCaching: (v: boolean) => void;
  cachedTokens: number;
  setCachedTokens: (v: number) => void;
}

export default function ModelConfigCard({ 
  models, 
  selectedModel, setSelectedModel, 
  inputTokens, setInputTokens, 
  outputTokens, setOutputTokens, 
  useCaching, setUseCaching, 
  cachedTokens, setCachedTokens 
}:ModelConfigProps) {
  
  // 1. The Core Caching Math
  const actualCachedTokens = useCaching ? Math.min(inputTokens, cachedTokens) : 0;
  const uncachedTokens = inputTokens - actualCachedTokens;
  const cachePrice = selectedModel.inPrice * (selectedModel.cacheRate || 0.10);

  const uncachedCost = (uncachedTokens / 1000000) * selectedModel.inPrice;
  const cachedCost = (actualCachedTokens / 1000000) * cachePrice;
  const outputCost = (outputTokens / 1000000) * selectedModel.outPrice;
  const totalCostPerMsg = uncachedCost + cachedCost + outputCost;

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 font-sans">
      
      {/* EXPLICITLY DARK HEADER */}
      <h2 className="text-2xl font-serif font-bold mb-1 flex items-center gap-2 text-gray-900">
        🤖 ① LLM Model
      </h2>
      <p className="text-sm text-gray-500 mb-6 border-b border-gray-100 pb-4">
        Prices verified from official provider pages
      </p>

      <p className="text-[10px] uppercase tracking-widest text-[#a39171] mb-4 font-bold">
        Select Model
      </p>

      {/* High Contrast Model List */}
      <div className="space-y-3 mb-6">
        {models.map((m) => {
          const displayCachePrice = parseFloat((m.inPrice * 0.1).toFixed(4));
          const isSelected = selectedModel.id === m.id;

          return (
            <div 
              key={m.id}
              onClick={() => setSelectedModel(m)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all flex justify-between items-center ${
                isSelected ? 'border-[#1e1a16] bg-[#1e1a16] shadow-md' : 'border-gray-200 bg-white hover:border-[#c49a45]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full ${m.dotColor}`}></span>
                {/* HIGH CONTRAST TITLE */}
                <span className={`font-bold ${isSelected ? 'text-white' : 'text-gray-900'}`}>{m.name}</span>
                
                {/* DUAL TAG CONTAINER */}
                <div className="flex items-center gap-1.5 ml-1">
                  {/* Tag 1: Always show the original tag */}
                  {m.tag && (
                    <span 
                      className={`text-[10px] px-2 py-0.5 rounded font-bold border ${isSelected ? 'border-current bg-transparent' : 'border-gray-200 bg-gray-50'}`} 
                      style={{ color: m.tagColor }}
                    >
                      {m.tag}
                    </span>
                  )}
                  {/* Tag 2: Append 'SELECTED' if active */}
                  {isSelected && (
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold border border-gray-500 text-gray-300 bg-transparent tracking-wide">
                      SELECTED
                    </span>
                  )}
                </div>

              </div>
              <div className="text-right">
                {/* HIGH CONTRAST PRICE */}
                <div className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                  ${m.inPrice} / ${m.outPrice}
                </div>
                <div className={`text-xs ${isSelected ? 'text-gray-400' : 'text-gray-500'}`}>
                  cache: ${displayCachePrice}/1M
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Green Source Box */}
      <div className="bg-green-50 border border-green-200 text-green-800 p-3 rounded-md text-sm mb-8 flex items-center gap-2">
        <span className="font-bold text-green-600">☑</span>
        <span>
          Source: <strong>{selectedModel.source || 'official docs'}</strong> — Input: <strong>${selectedModel.inPrice}/1M</strong> · Cached: <strong>${parseFloat((selectedModel.inPrice * 0.1).toFixed(4))}/1M</strong> · Output: <strong>${selectedModel.outPrice}/1M</strong>
        </span>
      </div>

      <hr className="my-8 border-gray-200" />

      {/* TOKEN CONFIGURATION */}
      <h3 className="text-[10px] font-bold mb-6 text-[#a39171] uppercase tracking-widest">
        Token Configuration
      </h3>

      <div className="mb-6">
        <label className="flex justify-between text-sm font-bold text-gray-900 mb-1">
          Input Tokens / Message: <span>{inputTokens.toLocaleString()}</span>
        </label>
        <p className="text-xs text-gray-500 mb-2">System prompt + user profile + RAG history + user message</p>
        <input 
          type="range" min="200" max="4000" step="50" value={inputTokens}
          onChange={(e) => setInputTokens(Number(e.target.value))}
          className="w-full accent-[#c49a45]"
        />
      </div>

      <div className="mb-8">
        <label className="flex justify-between text-sm font-bold text-gray-900 mb-1">
          Output Tokens / Message: <span>{outputTokens.toLocaleString()}</span>
        </label>
        <p className="text-xs text-gray-500 mb-2">The AI's generated response</p>
        <input 
          type="range" min="50" max="1000" step="10" value={outputTokens}
          onChange={(e) => setOutputTokens(Number(e.target.value))}
          className="w-full accent-[#c49a45]"
        />
      </div>

      <hr className="my-6 border-gray-200" />

      <div className="mb-6 flex items-start justify-between">
        <div>
          <label className="text-sm font-bold text-gray-900 block">Prompt Caching</label>
          {/* UPDATED: Dynamic price display */}
          <p className="text-xs text-gray-500">
            Cached tokens billed at <span className="font-bold text-green-600">${cachePrice.toFixed(3)}/1M</span> instead of <span className="font-bold text-gray-700">${selectedModel.inPrice}/1M</span>
          </p>
        </div>
        <input 
          type="checkbox" 
          checked={useCaching}
          onChange={(e) => setUseCaching(e.target.checked)}
          className="w-5 h-5 accent-[#c49a45] cursor-pointer"
        />
      </div>

      {useCaching && (
        <div className="mb-8">
          <label className="flex justify-between text-sm font-bold text-gray-900 mb-1">
            Cached Tokens: <span>{actualCachedTokens.toLocaleString()}</span>
          </label>
          <p className="text-xs text-gray-500 mb-2">Usually the system prompt and static context</p>
          <input 
            type="range" min="0" max={inputTokens} step="10" value={cachedTokens}
            onChange={(e) => setCachedTokens(Number(e.target.value))}
            className="w-full accent-green-500"
          />
        </div>
      )}

      {/* Cost Breakdown */}
      <div className="bg-[#fdfbf7] p-5 rounded-lg border border-[#e8e3d9]">
        <p className="text-[10px] uppercase tracking-widest text-[#a39171] mb-4 font-bold">
          Cost Breakdown Per Message
        </p>
        
        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex justify-between">
            <span className="font-medium">Uncached input ({uncachedTokens} tok × ${selectedModel.inPrice}/1M)</span>
            <span className="font-mono text-[#c49a45] font-bold">${uncachedCost.toFixed(6)}</span>
          </div>
          
          {useCaching && (
            <div className="flex justify-between items-center">
              <span className="font-medium">Cached input ({actualCachedTokens} tok × ${cachePrice.toFixed(2)}/1M) <span className="text-green-700 text-[10px] bg-green-100 px-1.5 py-0.5 rounded border border-green-200 uppercase ml-1">discounted</span></span>
              <span className="font-mono text-[#c49a45] font-bold">${cachedCost.toFixed(6)}</span>
            </div>
          )}
          
          <div className="flex justify-between">
            <span className="font-medium">Output ({outputTokens} tok × ${selectedModel.outPrice}/1M)</span>
            <span className="font-mono text-[#c49a45] font-bold">${outputCost.toFixed(6)}</span>
          </div>
          
          <div className="flex justify-between pt-3 border-t border-[#d1c8b8] font-bold text-gray-900 mt-2">
            <span>Total / message</span>
            <span className="font-mono text-[#d4af37] text-lg">${totalCostPerMsg.toFixed(6)}</span>
          </div>
        </div>
      </div>

    </div>
  );
}