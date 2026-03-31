import React from 'react';

interface Model {
  name: string;
  inPrice: number;
  outPrice: number;
  cacheRate?: number;
}

interface EmbeddingModel {
  name: string;
  price: number;
}

interface VectorDb {
  name: string;
  price: number;
}

interface ScaleProjectionProps {
  selectedModel: Model;
  selectedEmbedding: EmbeddingModel;
  selectedDb: VectorDb;
  users: number;
  setUsers: (v: number) => void;
  msgsPerDay: number;
  inputTokens: number;
  outputTokens: number;
  useCaching: boolean;
  cachedTokens: number;
}

const PROJECTION_TIERS = [100, 500, 1000, 5000, 10000, 50000];

export default function ScaleProjectionCard({
  selectedModel,
  selectedEmbedding,
  selectedDb,
  users,
  setUsers,
  msgsPerDay,
  inputTokens,
  outputTokens,
  useCaching,
  cachedTokens
}: ScaleProjectionProps) {

  // 1. Calculate the base LLM cost per message (constant across all tiers)
  const actualCachedTokens = useCaching ? Math.min(inputTokens, cachedTokens) : 0;
  const uncachedTokens = inputTokens - actualCachedTokens;
  const cachePrice = selectedModel.inPrice * (selectedModel.cacheRate || 0.10);

  const uncachedCost = (uncachedTokens / 1000000) * selectedModel.inPrice;
  const cachedCost = (actualCachedTokens / 1000000) * cachePrice;
  const outputCost = (outputTokens / 1000000) * selectedModel.outPrice;
  const llmCostPerMsg = uncachedCost + cachedCost + outputCost;

  // 2. Calculate the base Embedding tokens per user per month (constant across all tiers)
  // 5100 is the sum of the daily tokens we defined in the Embedding card (500+4000+200+50+350)
  const embedTokensPerUserPerMonth = 5100 * 30; 

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 font-sans overflow-x-auto">
      <h2 className="text-2xl font-serif font-bold mb-1 flex items-center gap-2 text-gray-900">
        Scale Projection
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        {selectedModel.name} (${selectedModel.inPrice}/${parseFloat((selectedModel.inPrice * 0.1).toFixed(4))}/${selectedModel.outPrice}) + {selectedEmbedding.name} + {selectedDb.name} — <span className="italic">click a row to set users</span>
      </p>

      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="text-[10px] uppercase tracking-widest text-[#a39171] border-b-2 border-black">
            <th className="pb-4 pl-4 font-bold">Users</th>
            <th className="pb-4 font-bold text-center">Msgs/Month</th>
            <th className="pb-4 font-bold text-center">LLM Cost</th>
            <th className="pb-4 font-bold text-center">Embed Cost</th>
            <th className="pb-4 font-bold text-center">VDB Cost</th>
            <th className="pb-4 font-bold text-center">TOTAL/Month</th>
            <th className="pb-4 font-bold text-center">Per User</th>
            <th className="pb-4 pr-4 font-bold text-right">$/msg</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {PROJECTION_TIERS.map((tier) => {
            // Do the math for this specific row tier
            const msgsPerMonth = tier * msgsPerDay * 30;
            const llmMonthly = msgsPerMonth * llmCostPerMsg;
            const embedMonthly = ((tier * embedTokensPerUserPerMonth) / 1000000) * selectedEmbedding.price;
            const vdbMonthly = selectedDb.price; // Vector DB is a flat monthly fee
            const totalMonthly = llmMonthly + embedMonthly + vdbMonthly;
            
            const isCurrentTier = users === tier;

            return (
              <tr 
                key={tier} 
                onClick={() => setUsers(tier)}
                className={`border-b border-gray-100 cursor-pointer transition-colors ${
                  isCurrentTier ? 'bg-[#fdfbf7] border-l-4 border-l-[#c49a45]' : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                }`}
              >
                <td className="py-4 pl-4 font-bold text-gray-800">{tier.toLocaleString()}</td>
                <td className="py-4 text-center text-gray-500">{msgsPerMonth.toLocaleString()}</td>
                <td className="py-4 text-center text-[#c49a45] font-mono font-bold">${llmMonthly.toFixed(2)}</td>
                <td className="py-4 text-center text-blue-500 font-mono">${embedMonthly.toFixed(4)}</td>
                <td className="py-4 text-center text-green-500 font-mono">${vdbMonthly.toFixed(2)}</td>
                <td className="py-4 text-center text-black font-mono font-bold">${totalMonthly.toFixed(2)}</td>
                <td className="py-4 text-center text-gray-500 font-mono">${(totalMonthly / tier).toFixed(4)}</td>
                <td className="py-4 pr-4 text-right text-gray-500 font-mono">${llmCostPerMsg.toFixed(6)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}