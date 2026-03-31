import React from 'react';

export default function TopSummaryBanner({
  selectedModel, selectedEmbedding, selectedDb,
  users, msgsPerDay, inputTokens, outputTokens, useCaching, cachedTokens
}) {
  const totalMsgs = users * msgsPerDay * 30;

  // 1. LLM Math (With Cache)
  const actualCachedTokens = useCaching ? Math.min(inputTokens, cachedTokens) : 0;
  const uncachedTokens = inputTokens - actualCachedTokens;
  const cachePrice = selectedModel.inPrice * (selectedModel.cacheRate || 0.10);

  const uncachedCost = (uncachedTokens / 1000000) * selectedModel.inPrice;
  const cachedCost = (actualCachedTokens / 1000000) * cachePrice;
  const outputCost = (outputTokens / 1000000) * selectedModel.outPrice;

  const llmCostPerMsg = uncachedCost + cachedCost + outputCost;
  const llmMonthly = totalMsgs * llmCostPerMsg;

  // 2. Savings Calculation (Math WITHOUT Cache)
  const costPerMsgNoCache = ((inputTokens / 1000000) * selectedModel.inPrice) + outputCost;
  const llmMonthlyNoCache = totalMsgs * costPerMsgNoCache;
  const savings = llmMonthlyNoCache - llmMonthly;
  const savingsPct = llmMonthlyNoCache > 0 ? (savings / llmMonthlyNoCache) * 100 : 0;

  // 3. Embedding & Vector DB Math
  const embedMonthly = ((5100 * users * 30) / 1000000) * selectedEmbedding.price;
  const vdbMonthly = selectedDb.price;

  // 4. Grand Total
  const trueTotal = llmMonthly + embedMonthly + vdbMonthly;

  return (
    <div className="space-y-4 font-sans mb-8">
      
      {/* ROW 1: The 4 Dark Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard title="LLM COST / MESSAGE" value={`$${llmCostPerMsg.toFixed(6)}`} />
        <MetricCard title="LLM MONTHLY" value={`$${llmMonthly.toFixed(2)}`} />
        <MetricCard title="EMBEDDING MONTHLY" value={`$${embedMonthly.toFixed(2)}`} valueColor="text-[#60a5fa]" />
        <MetricCard title="VECTOR DB MONTHLY" value={`$${vdbMonthly.toFixed(2)}`} valueColor="text-[#4ade80]" />
      </div>

      {/* ROW 2: The Green Prompt Caching Savings Banner */}
      {useCaching && actualCachedTokens > 0 && savings > 0 && (
        <div className="bg-[#f0fdf4] border border-[#bbf7d0] p-4 rounded-lg flex flex-col md:flex-row justify-between items-center text-[#166534] shadow-sm animate-fade-in">
          <div className="text-sm">
            💰 <span className="font-bold">Prompt caching saving you</span> — ${savings.toFixed(2)}/month vs no cache
          </div>
          <div className="text-xl font-serif font-bold mt-2 md:mt-0 text-[#22c55e]">
            {savingsPct.toFixed(1)}% off LLM bill
          </div>
        </div>
      )}

      {/* ROW 3: The Big Gold True Total Banner */}
      <div className="bg-[#c49a45] p-6 rounded-lg text-white flex flex-col md:flex-row justify-between items-center shadow-md">
        <div>
          <p className="uppercase tracking-widest text-sm font-bold opacity-90 mb-1">
            True Total / Month — {users.toLocaleString()} users
          </p>
          <p className="text-xs opacity-75">LLM + Embeddings + Vector DB</p>
        </div>
        <div className="text-right mt-4 md:mt-0">
          <h2 className="text-5xl font-serif font-bold mb-1">${trueTotal.toFixed(2)}</h2>
          <p className="text-[11px] opacity-80">
            ${(trueTotal / users).toFixed(4)} per user · ${llmCostPerMsg.toFixed(6)} per msg
          </p>
        </div>
      </div>

    </div>
  );
}

// Small helper component for the 4 dark cards
function MetricCard({ title, value, valueColor = "text-[#d4af37]" }) {
  return (
    <div className="bg-[#1e1a16] p-5 rounded-lg border border-[#3d3223] shadow-sm">
      <p className={`text-3xl font-serif font-bold ${valueColor} mb-2`}>{value}</p>
      <p className="text-[10px] uppercase tracking-widest text-[#a39171]">{title}</p>
    </div>
  );
}