"use client";
import React, { useState, useEffect } from 'react';

// 1. IMPORT SHARED TYPES
import { Model, VectorDb, EmbeddingModel } from '../types'; 

// 2. IMPORT COMPONENTS
import ModelConfigCard from '../components/ModelConfigCard';
import VectorDbCard from '../components/VectorDbCard';
import EmbeddingCard from '../components/EmbeddingCard';
import AllModelsRankedCard from '../components/AllModelsRankedCard';
import ScaleProjectionCard from '../components/ScaleProjectionCard';
import ScaleAndSummaryCard from '../components/ScaleAndSummaryCard';
import TopSummaryBanner from '../components/TopSummaryBanner';

// --- HARDCODED DATA (We keep these for now until you build their APIs) ---
const VECTOR_DATABASES: VectorDb[] = [
  { id: 'pinecone-free', name: 'Pinecone Free', price: 0, storageLimit: '1M', description: 'Up to ~1,500 users', tag: 'FREE' },
  { id: 'pinecone-std', name: 'Pinecone Standard', price: 70, storageLimit: '5M', description: 'Up to ~7,500 users' },
  { id: 'supabase-free', name: 'Supabase Free', price: 0, storageLimit: '500K', description: 'Good if using Postgres', tag: 'FREE' },
  { id: 'supabase-pro', name: 'Supabase Pro', price: 25, storageLimit: '8GB', description: 'Great value' },
  { id: 'qdrant-free', name: 'Qdrant Free', price: 0, storageLimit: '1GB', description: 'Open source', tag: 'FREE' },
  { id: 'qdrant-cloud', name: 'Qdrant Cloud', price: 25, storageLimit: '4GB', description: 'Scalable' }
];

const EMBEDDING_MODELS: EmbeddingModel[] = [
  { id: 'oai-small', name: 'text-embedding-3-small', provider: 'OpenAI', price: 0.02, dimensions: '1536d' },
  { id: 'oai-large', name: 'text-embedding-3-large', provider: 'OpenAI', price: 0.13, dimensions: '3072d' },
  { id: 'gemini-emb', name: 'Gemini text-embedding', provider: 'Google', price: 0, dimensions: '768d', tag: 'FREE' },
  { id: 'cohere-v3', name: 'embed-english-v3', provider: 'Cohere', price: 0.10, dimensions: '1024d' }
];

export default function Home() {
  // --- GLOBAL STATES ---
  const [users, setUsers] = useState(1000);
  const [msgsPerDay, setMsgsPerDay] = useState(10);

  // --- DYNAMIC LLM STATES ---
  const [allModels, setAllModels] = useState<Model[]>([]); // The hidden master list (500+ models)
  const [llmModels, setLlmModels] = useState<Model[]>([]); // The visible list on the screen
  const [isLoading, setIsLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);

  // --- COMPONENT STATES ---
  const [inputTokens, setInputTokens] = useState(1100);
  const [outputTokens, setOutputTokens] = useState(400);
  const [useCaching, setUseCaching] = useState(true);
  const [cachedTokens, setCachedTokens] = useState(450);

  const [selectedEmbedding, setSelectedEmbedding] = useState<EmbeddingModel>(EMBEDDING_MODELS[0]);
  const [selectedDb, setSelectedDb] = useState<VectorDb>(VECTOR_DATABASES[0]);
  // --- 2. ADD THIS FUNCTION RIGHT HERE ---
  const handleRemoveModel = (idToRemove: string) => {
    if (llmModels.length <= 1) {
      alert("You must have at least one model in the comparison list.");
      return;
    }

    const newList = llmModels.filter(m => m.id !== idToRemove);
    setLlmModels(newList);

    // If the active model was the one deleted, switch selection to the first available one
    if (selectedModel?.id === idToRemove) {
      setSelectedModel(newList[0]);
    }
  };
  // --- FETCH DYNAMIC MODELS ON LOAD ---
  useEffect(() => {
    async function fetchModels() {
      try {
        setIsLoading(true);
        const rawUrl = 'https://raw.githubusercontent.com/BerriAI/litellm/main/model_prices_and_context_window.json';
        const response = await fetch(rawUrl);
        const data = await response.json();

        // Map EVERY valid chat model from the API
        const mappedModels: Model[] = Object.entries(data)
          .filter(([id, apiModel]: [string, any]) => 
             apiModel.input_cost_per_token !== undefined && 
             apiModel.mode === "chat"
          )
          .map(([id, apiModel]: [string, any]) => {
            const provider = apiModel.litellm_provider || "unknown";
            let dotColor = "bg-gray-400"; let tagColor = "#9ca3af";
            
            if (provider === "openai") { dotColor = "bg-green-500"; tagColor = "#22c55e"; }
            else if (provider === "anthropic") { dotColor = "bg-orange-500"; tagColor = "#f97316"; }
            else if (provider === "google" || provider === "gemini") { dotColor = "bg-blue-500"; tagColor = "#3b82f6"; }
            else if (provider === "deepseek") { dotColor = "bg-yellow-400"; tagColor = "#eab308"; }

            return {
              id: id,
              name: id.replace(/-2024.*/, '').replace(/-/g, ' ').toUpperCase(),
              tag: provider.toUpperCase(),
              inPrice: parseFloat((apiModel.input_cost_per_token * 1000000).toFixed(4)) || 0,
              outPrice: parseFloat((apiModel.output_cost_per_token * 1000000).toFixed(4)) || 0,
              source: provider,
              dotColor, tagColor,
              cacheRate: apiModel.cache_read_input_token_cost 
                ? (apiModel.cache_read_input_token_cost / apiModel.input_cost_per_token) : 0.10,
            };
          });

        // Save ALL 500+ models to the background state
        setAllModels(mappedModels);

        // Set a few default models so the screen isn't empty on first load
        const defaultIds = ["gpt-4o", "claude-3-5-sonnet-20240620", "gemini-1.5-pro"];
        const defaultModels = mappedModels.filter(m => defaultIds.includes(m.id));
        
        setLlmModels(defaultModels);
        if (defaultModels.length > 0) setSelectedModel(defaultModels[0]);

      } catch (error) {
        console.error("Failed to fetch LiteLLM models:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchModels();
  }, []);

  // --- LOADING GATE ---
  if (isLoading || !selectedModel) {
    return (
      <div className="min-h-screen bg-[#fdfbf7] flex flex-col items-center justify-center font-sans">
        <div className="w-12 h-12 border-4 border-[#c49a45] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[#1e1a16] font-serif font-bold text-xl">Loading Live Pricing Data...</p>
      </div>
    );
  }

  // --- MAIN RENDER ---
  return (
    <main className="min-h-screen bg-[#fdfbf7] p-4 md:p-8 font-sans">
      <div className="max-w-[1400px] mx-auto space-y-8">
        
        {/* TOP HEADER / LOGO AREA */}
        <div className="bg-[#1e1a16] text-[#d4af37] p-8 rounded-xl flex flex-col md:flex-row justify-between items-center shadow-lg border-b-4 border-[#c49a45]">
          <div>
            <h1 className="text-3xl font-serif font-bold text-white mb-2">Cost Calculator</h1>
            <p className="text-sm opacity-70">✔ Prices synced live via LiteLLM</p>
          </div>
          <div className="text-right mt-4 md:mt-0">
            <p className="text-xs uppercase tracking-widest opacity-60">Messages / Month</p>
            <p className="text-4xl font-serif font-bold">{(users * msgsPerDay * 30).toLocaleString()}</p>
          </div>
        </div>

        {/* TOP SUMMARY BANNER */}
        <TopSummaryBanner 
          selectedModel={selectedModel}
          selectedEmbedding={selectedEmbedding}
          selectedDb={selectedDb}
          users={users}
          msgsPerDay={msgsPerDay}
          inputTokens={inputTokens}
          outputTokens={outputTokens}
          useCaching={useCaching}
          cachedTokens={cachedTokens}
        />

        {/* MAIN GRID LAYOUT */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Configuration Stack (The Inputs) */}
          <div className="xl:col-span-6 flex flex-col gap-8">
            
            {/* --- NEW: MODEL SEARCH & ADD BROWSER --- */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-2">
              <p className="text-[10px] font-bold text-[#a39171] uppercase tracking-widest">
                ➕ Add a Model from Database
              </p>
              <select 
                className="w-full p-2.5 border border-gray-200 rounded-lg text-sm font-medium bg-[#fdfbf7] focus:border-[#c49a45] focus:outline-none transition-colors cursor-pointer text-gray-700"
                defaultValue=""
                onChange={(e) => {
                  const selectedId = e.target.value;
                  if (!selectedId) return;
                  
                  // 1. Find the model in the master list
                  const newModel = allModels.find(m => m.id === selectedId);
                  
                  // 2. Add it to the visible list (if it isn't already there)
                  if (newModel && !llmModels.some(m => m.id === newModel.id)) {
                    setLlmModels(prev => [...prev, newModel]);
                    setSelectedModel(newModel); // Auto-select it immediately
                  } else if (newModel) {
                    // Even if it's already in the list, auto-select it for convenience
                    setSelectedModel(newModel);
                  }
                  
                  // 3. Reset dropdown back to default placeholder
                  e.target.value = "";
                }}
              >
                <option value="" disabled>-- Search & Add from 500+ Models --</option>
                {allModels.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.source})
                  </option>
                ))}
              </select>
            </div>

            {/* 1. LLM CONFIGURATION */}
            <ModelConfigCard 
              models={llmModels} 
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel as any} 
              inputTokens={inputTokens}
              setInputTokens={setInputTokens}
              outputTokens={outputTokens}
              setOutputTokens={setOutputTokens}
              useCaching={useCaching}
              setUseCaching={setUseCaching}
              cachedTokens={cachedTokens}
              setCachedTokens={setCachedTokens}
            />

            {/* 2. EMBEDDING CONFIGURATION */}
            <EmbeddingCard 
              models={EMBEDDING_MODELS}
              selectedModel={selectedEmbedding}
              setSelectedModel={setSelectedEmbedding}
              users={users}
            />

            {/* 3. VECTOR DB CONFIGURATION */}
            <VectorDbCard 
              databases={VECTOR_DATABASES}
              selectedDb={selectedDb}
              setSelectedDb={setSelectedDb}
            />
          </div>

          {/* RIGHT COLUMN: Results & Scale Stack (The Outputs) */}
          <div className="xl:col-span-6 flex flex-col gap-8">
            
            {/* 4. SCALE & SUMMARY (The Grand Total) */}
            <ScaleAndSummaryCard 
              users={users}
              setUsers={setUsers}
              msgsPerDay={msgsPerDay}
              setMsgsPerDay={setMsgsPerDay}
              selectedModel={selectedModel}
              inputTokens={inputTokens}
              outputTokens={outputTokens}
              useCaching={useCaching}
              cachedTokens={cachedTokens}
              selectedEmbedding={selectedEmbedding}
              selectedDb={selectedDb}
            />

            {/* 5. ALL MODELS RANKED (The Comparison) */}
            <AllModelsRankedCard 
              models={llmModels}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel as any} // Safety cast
              onRemoveModel={handleRemoveModel}
              users={users}
              msgsPerDay={msgsPerDay}
              inputTokens={inputTokens}
              outputTokens={outputTokens}
              useCaching={useCaching}
              cachedTokens={cachedTokens}
            />
          </div>
          
        </div>

        {/* SCALE PROJECTION ROW */}
        <div className="mt-8">
          <ScaleProjectionCard 
            selectedModel={selectedModel}
            selectedEmbedding={selectedEmbedding}
            selectedDb={selectedDb}
            users={users}
            setUsers={setUsers}
            msgsPerDay={msgsPerDay}
            inputTokens={inputTokens}
            outputTokens={outputTokens}
            useCaching={useCaching}
            cachedTokens={cachedTokens}
          />
        </div>

      </div>
    </main>
  );
}