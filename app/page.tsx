"use client";
import React, { useState } from 'react';
// import ModelConfigCard from '../components/ModelConfigCard';
import VectorDbCard,{VectorDb} from '../components/VectorDbCard';
import EmbeddingCard from '../components/EmbeddingCard';
import AllModelsRankedCard from '../components/AllModelsRankedCard';
import ScaleProjectionCard from '../components/ScaleProjectionCard';
import ScaleAndSummaryCard from '../components/ScaleAndSummaryCard';
import TopSummaryBanner from '../components/TopSummaryBanner';
import ModelConfigCard, { Model } from '../components/ModelConfigCard';

// --- DATA ARRAYS ---
const LLM_MODELS = [
  { id: 'gpt-5-nano', name: 'GPT-5 Nano', tag: 'CHEAPEST', inPrice: 0.05, outPrice: 0.4, source: 'openai.com', dotColor: 'bg-green-500', tagColor: '#22c55e',cacheRate: 0.10 },
  { id: 'deepseek-v3', name: 'DeepSeek V3.2', tag: 'LOW COST', inPrice: 0.28, outPrice: 0.42, source: 'deepseek.com', dotColor: 'bg-yellow-400', tagColor: '#eab308',cacheRate: 0.10 },
  { id: 'grok-4-fast', name: 'Grok 4.1 Fast', tag: 'BEST VALUE', inPrice: 0.2, outPrice: 0.5, source: 'x.ai', dotColor: 'bg-purple-500', tagColor: '#a855f7',cacheRate: 0.10 },
  { id: 'gpt-4-mini', name: 'GPT-4.1 Mini', tag: 'BALANCED', inPrice: 0.4, outPrice: 1.6, source: 'openai.com', dotColor: 'bg-cyan-400', tagColor: '#22d3ee',cacheRate: 0.10},
  { id: 'gemini-flash', name: 'Gemini 2.5 Flash', tag: 'FREE TIER', inPrice: 0.3, outPrice: 2.5, source: 'ai.google.dev', dotColor: 'bg-blue-500', tagColor: '#3b82f6',cacheRate: 0.25 },
  { id: 'claude-haiku', name: 'Claude Haiku 4.5', tag: 'BEST QUALITY', inPrice: 1.0, outPrice: 5.0, source: 'anthropic.com', dotColor: 'bg-orange-500', tagColor: '#f97316',cacheRate: 0.10 },
  { id: 'claude-sonnet', name: 'Claude Sonnet 4.6', tag: 'PREMIUM', inPrice: 3.0, outPrice: 15.0, source: 'anthropic.com', dotColor: 'bg-pink-500', tagColor: '#ec4899',cacheRate: 0.10 }
];

const VECTOR_DATABASES = [
  { id: 'pinecone-free', name: 'Pinecone Free', price: 0, storageLimit: '1M', description: 'Up to ~1,500 users', tag: 'FREE' },
  { id: 'pinecone-std', name: 'Pinecone Standard', price: 70, storageLimit: '5M', description: 'Up to ~7,500 users' },
  { id: 'supabase-free', name: 'Supabase Free', price: 0, storageLimit: '500K', description: 'Good if using Postgres', tag: 'FREE' },
  { id: 'supabase-pro', name: 'Supabase Pro', price: 25, storageLimit: '8GB', description: 'Great value' },
  { id: 'qdrant-free', name: 'Qdrant Free', price: 0, storageLimit: '1GB', description: 'Open source', tag: 'FREE' },
  { id: 'qdrant-cloud', name: 'Qdrant Cloud', price: 25, storageLimit: '4GB', description: 'Scalable' }
];

const EMBEDDING_MODELS = [
  { id: 'oai-small', name: 'text-embedding-3-small', provider: 'OpenAI', price: 0.02, dimensions: '1536d' },
  { id: 'oai-large', name: 'text-embedding-3-large', provider: 'OpenAI', price: 0.13, dimensions: '3072d' },
  { id: 'gemini-emb', name: 'Gemini text-embedding', provider: 'Google', price: 0, dimensions: '768d', tag: 'FREE' },
  { id: 'cohere-v3', name: 'embed-english-v3', provider: 'Cohere', price: 0.10, dimensions: '1024d' }
];
// interface Model {
//   id: string;
//   name: string;
//   tag?: string; // The '?' makes it optional, which matches your data
//   inPrice: number;
//   outPrice: number;
//   source: string;
//   dotColor: string;
//   tagColor: string;
//   cacheRate?: number;
// }
interface EmbeddingModel {
  id: string;
  name: string;
  provider: string;
  price: number;
  dimensions: string;
  tag?: string;
}

// interface VectorDb {
//   id: string;
//   name: string;
//   price: number;
//   storageLimit: string;
//   description: string;
//   tag?: string;
// }

export default function Home() {
  // --- GLOBAL STATES ---
  const [users, setUsers] = useState(1000);
  const [msgsPerDay, setMsgsPerDay] = useState(10);


  // --- COMPONENT STATES ---
  const [selectedModel, setSelectedModel] = useState<Model>(LLM_MODELS[5]);
  const [inputTokens, setInputTokens] = useState(1100);
  const [outputTokens, setOutputTokens] = useState(400);
  const [useCaching, setUseCaching] = useState(true);
  const [cachedTokens, setCachedTokens] = useState(450);

  const [selectedEmbedding, setSelectedEmbedding] = useState<EmbeddingModel>(EMBEDDING_MODELS[0]);
  const [selectedDb, setSelectedDb] = useState<VectorDb>(VECTOR_DATABASES[0]);

  return (
    <main className="min-h-screen bg-[#fdfbf7] p-4 md:p-8 font-sans">
      <div className="max-w-[1400px] mx-auto space-y-8">
        
        {/* TOP HEADER / LOGO AREA */}
        <div className="bg-[#1e1a16] text-[#d4af37] p-8 rounded-xl flex flex-col md:flex-row justify-between items-center shadow-lg border-b-4 border-[#c49a45]">
          <div>
            <h1 className="text-3xl font-serif font-bold text-white mb-2">Cost Calculator</h1>
            <p className="text-sm opacity-70">✔ All prices verified from official sources</p>
          </div>
          <div className="text-right mt-4 md:mt-0">
            <p className="text-xs uppercase tracking-widest opacity-60">Messages / Month</p>
            <p className="text-4xl font-serif font-bold">{(users * msgsPerDay * 30).toLocaleString()}</p>
          </div>
        </div>

        {/* ----------------------------------------------- */}
        {/* NEW: TOP SUMMARY BANNER                         */}
        {/* ----------------------------------------------- */}
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
            
            {/* 1. LLM CONFIGURATION */}
            <ModelConfigCard 
              models={LLM_MODELS}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
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
              models={LLM_MODELS}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
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