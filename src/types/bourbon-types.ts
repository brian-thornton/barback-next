export interface Bourbon {
  id: string;
  name: string;
  distiller: string;
  abv: string;
  region: string;
  category: string;
  price: string;
  age: string;
  description: string;
  image: string;
  tastingNotes: {
    nose: string;
    palate: string;
    finish: string;
  };
}

export interface SearchParams {
  query?: string;
  distiller?: string;
  category?: string;
  region?: string;
  price?: string;
  age?: string;
  page?: number;
  limit?: number;
}

export interface SearchResult {
  data: Bourbon[];
  total: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

