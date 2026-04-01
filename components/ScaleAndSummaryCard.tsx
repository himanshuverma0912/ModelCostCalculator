// Define types for the sub-objects
interface Model {
  inPrice: number;
  outPrice: number;
}

interface EmbeddingModel {
  price: number;
}

interface VectorDb {
  price: number;
}

interface ScaleAndSummaryProps {
  users: number;
  setUsers: (v: number) => void;
  msgsPerDay: number;
  setMsgsPerDay: (v: number) => void;
  selectedModel: Model;
  inputTokens: number;
  outputTokens: number;
  useCaching: boolean;
  cachedTokens: number;
  selectedEmbedding: EmbeddingModel;
  selectedDb: VectorDb;
}

export default function ScaleAndSummaryCard({
  users, setUsers,
  msgsPerDay, setMsgsPerDay,
  selectedModel, inputTokens, outputTokens, useCaching, cachedTokens,
  selectedEmbedding,
  selectedDb
}: ScaleAndSummaryProps) { // Typed props here
  // 1. LLM Math
  const actualCachedTokens = useCaching ? Math.min(inputTokens, cachedTokens) : 0;
  const uncachedTokens = inputTokens - actualCachedTokens;
  const cachePrice = selectedModel.inPrice * 0.10; 
  const llmCostPerMsg = ((uncachedTokens / 1000000) * selectedModel.inPrice) + 
                        ((actualCachedTokens / 1000000) * cachePrice) + 
                        ((outputTokens / 1000000) * selectedModel.outPrice);
  const llmMonthly = users * msgsPerDay * 30 * llmCostPerMsg;

  // 2. Embedding Math (5100 daily tokens per user from our previous breakdown)
  const embedMonthly = ((5100 * users * 30) / 1000000) * (selectedEmbedding?.price ?? 0);

  // 3. Vector DB Math
  const vdbMonthly = selectedDb.price;

  // 4. Totals and Percentages
  const totalMonthly = llmMonthly + embedMonthly + vdbMonthly;
  
  // Protect against division by zero if everything is somehow free
  const llmPct = totalMonthly > 0 ? (llmMonthly / totalMonthly) * 100 : 0;
  const embedPct = totalMonthly > 0 ? (embedMonthly / totalMonthly) * 100 : 0;
  const vdbPct = totalMonthly > 0 ? (vdbMonthly / totalMonthly) * 100 : 0;

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 font-sans">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">📊</span>
        <h2 className="text-2xl font-serif font-bold text-gray-900">Scale</h2>
      </div>
      <p className="text-sm text-gray-500 mb-6 border-b border-gray-200 pb-4">Adjust users & messages per day</p>

      {/* Sliders */}
      <div className="mb-8 mt-6">
        <label className="flex justify-between font-serif mb-2 text-gray-800">
          <span>Active Users: {users.toLocaleString()}</span>
        </label>
        <input 
          type="range" min="100" max="50000" step="100" value={users}
          onChange={(e) => setUsers(Number(e.target.value))}
          className="w-full accent-[#e3d5c1]"
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono">
          <span>100</span>
          <span>50,000</span>
        </div>
      </div>

      <div className="mb-8">
        <label className="flex justify-between font-serif mb-2 text-gray-800">
          <span>Messages / Day / User: {msgsPerDay}</span>
        </label>
        <input 
          type="range" min="1" max="50" step="1" value={msgsPerDay}
          onChange={(e) => setMsgsPerDay(Number(e.target.value))}
          className="w-full accent-[#e3d5c1]"
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono">
          <span>1</span>
          <span>50</span>
        </div>
      </div>

      {/* Dark Monthly Cost Summary Box */}
      <div className="bg-[#1e1a16] p-6 rounded-xl border border-[#3d3223]">
        <p className="text-[10px] uppercase tracking-widest text-[#a39171] mb-6 font-bold">
          Monthly Cost Summary
        </p>

        {/* ① LLM API */}
        <div className="mb-4">
          <div className="flex justify-between items-end mb-1">
            <span className="text-gray-200 text-sm font-serif">① LLM API</span>
            <div className="text-right">
              <span className="text-[#d4af37] font-bold font-mono mr-2">${llmMonthly.toFixed(2)}</span>
              <span className="text-gray-500 text-[10px] font-mono">{llmPct.toFixed(1)}%</span>
            </div>
          </div>
          <div className="w-full bg-[#3d3223] h-1.5 rounded-full overflow-hidden">
            <div className="bg-[#d4af37] h-full" style={{ width: `${llmPct}%` }}></div>
          </div>
        </div>

        {/* ② Embeddings */}
        <div className="mb-4">
          <div className="flex justify-between items-end mb-1">
            <span className="text-gray-200 text-sm font-serif">② Embeddings</span>
            <div className="text-right">
              <span className="text-blue-400 font-bold font-mono mr-2">${embedMonthly.toFixed(2)}</span>
              <span className="text-gray-500 text-[10px] font-mono">{embedPct.toFixed(1)}%</span>
            </div>
          </div>
          <div className="w-full bg-[#3d3223] h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-400 h-full" style={{ width: `${embedPct}%` }}></div>
          </div>
        </div>

        {/* ③ Vector DB */}
        <div className="mb-6">
          <div className="flex justify-between items-end mb-1">
            <span className="text-gray-200 text-sm font-serif">③ Vector DB</span>
            <div className="text-right">
              <span className="text-green-400 font-bold font-mono mr-2">${vdbMonthly.toFixed(2)}</span>
              <span className="text-gray-500 text-[10px] font-mono">{vdbPct.toFixed(1)}%</span>
            </div>
          </div>
          <div className="w-full bg-[#3d3223] h-1.5 rounded-full overflow-hidden">
            <div className="bg-green-400 h-full" style={{ width: `${vdbPct}%` }}></div>
          </div>
        </div>

        <hr className="border-[#3d3223] my-4" />

        {/* Total Row */}
        <div className="flex justify-between items-end pt-2">
          <span className="text-white font-bold tracking-widest">TOTAL</span>
          <div className="text-right">
            <div className="text-4xl font-serif font-bold text-[#d4af37] leading-none mb-1">
              ${totalMonthly.toFixed(2)}
            </div>
            <div className="text-[#a39171] text-[10px] font-mono">
              ${(totalMonthly / users).toFixed(4)} per user/month
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}