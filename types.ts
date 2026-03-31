// types.ts

export interface Model {
  id: string;
  name: string;
  tag?: string;
  inPrice: number;
  outPrice: number;
  source: string;
  dotColor: string;
  tagColor: string;
  cacheRate?: number;
}

export interface EmbeddingModel {
  id: string;
  name: string;
  provider: string;
  price: number;
  dimensions: string;
  tag?: string;
}

export interface VectorDb {
  id: string;
  name: string;
  price: number;
  storageLimit: string;
  description: string;
  tag?: string;
}