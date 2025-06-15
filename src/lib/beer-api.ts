import { API_CONFIG } from '@/config/api';

export interface Beer {
  id: string;
  name: string;
  brewery: string;
  style: string;
  abv: number;
  ibu: number;
  description: string;
  image: string;
  category: string;
  rating?: number;
  tastingNotes?: {
    appearance: string;
    aroma: string;
    flavor: string;
    mouthfeel: string;
    overall: string;
  };
}

interface SearchParams {
  query?: string;
  brewery?: string;
  style?: string;
  abv?: number;
  ibu?: number;
  page?: number;
  limit?: number;
}

export const beerApi = {
  async search(params: SearchParams = {}): Promise<{ data: Beer[]; total: number }> {
    try {
      console.log('Searching beers with params:', params);
      
      // Use the beers endpoint for searching
      const queryParams = new URLSearchParams();
      
      // Handle different types of searches
      if (params.query) {
        if (params.query.toLowerCase().includes('lager')) {
          // Search by style name
          queryParams.append('style', params.query);
        } else {
          // Search by beer name
          queryParams.append('name', params.query);
        }
      }
      
      if (params.brewery) queryParams.append('brewery', params.brewery);
      if (params.style) queryParams.append('style', params.style);
      if (params.abv) queryParams.append('abv', params.abv.toString());
      if (params.ibu) queryParams.append('ibu', params.ibu.toString());
      if (params.page) queryParams.append('p', params.page.toString());
      if (params.limit) queryParams.append('per_page', params.limit.toString());
      
      // Add required parameters for BreweryDB
      queryParams.append('withBreweries', 'Y');
      queryParams.append('withLabels', 'Y');
      queryParams.append('withSocialAccounts', 'Y');
      queryParams.append('withIngredients', 'Y');
      
      console.log('Search URL params:', queryParams.toString());
      
      const response = await fetch(
        `/api/beers?endpoint=beers&${queryParams.toString()}`,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`Failed to search beers: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Search results:', result);

      if (!result.data || !Array.isArray(result.data)) {
        console.log('No valid data in response');
        return { data: [], total: 0 };
      }

      // Map BreweryDB response to our Beer interface
      const beers: Beer[] = result.data.map((beer: any) => ({
        id: beer.id,
        name: beer.name,
        brewery: beer.breweries?.[0]?.name || 'Unknown',
        style: beer.style?.name || 'Unknown',
        abv: parseFloat(beer.abv) || 0,
        ibu: parseInt(beer.ibu) || 0,
        description: beer.description || '',
        image: beer.labels?.medium || '/placeholder-beer.jpg',
        category: beer.style?.category?.name || 'Unknown',
        rating: beer.rating?.average || 0,
        tastingNotes: {
          appearance: beer.tastingNotes?.appearance || 'Not available',
          aroma: beer.tastingNotes?.aroma || 'Not available',
          flavor: beer.tastingNotes?.flavor || 'Not available',
          mouthfeel: beer.tastingNotes?.mouthfeel || 'Not available',
          overall: beer.tastingNotes?.overall || 'Not available'
        }
      }));

      return {
        data: beers,
        total: result.totalResults || beers.length
      };
    } catch (error) {
      console.error('Error searching beers:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to search beers: ${error.message}`);
      }
      throw error;
    }
  },

  async getBeerById(id: string): Promise<Beer> {
    try {
      const response = await fetch(
        `/api/beers?endpoint=beers/${id}`,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`Failed to fetch beer: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      const beer = result.data;

      return {
        id: beer.id,
        name: beer.name,
        brewery: beer.breweries?.[0]?.name || 'Unknown',
        style: beer.style?.name || 'Unknown',
        abv: parseFloat(beer.abv) || 0,
        ibu: parseInt(beer.ibu) || 0,
        description: beer.description || '',
        image: beer.labels?.medium || '/placeholder-beer.jpg',
        category: beer.style?.category?.name || 'Unknown',
        rating: beer.rating?.average || 0,
        tastingNotes: {
          appearance: beer.tastingNotes?.appearance || 'Not available',
          aroma: beer.tastingNotes?.aroma || 'Not available',
          flavor: beer.tastingNotes?.flavor || 'Not available',
          mouthfeel: beer.tastingNotes?.mouthfeel || 'Not available',
          overall: beer.tastingNotes?.overall || 'Not available'
        }
      };
    } catch (error) {
      console.error('Error fetching beer:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to fetch beer: ${error.message}`);
      }
      throw error;
    }
  },

  async getStyles(): Promise<{ id: string; name: string }[]> {
    try {
      const response = await fetch(
        `/api/beers?endpoint=styles`,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch styles: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      return result.data.map((style: any) => ({
        id: style.id,
        name: style.name
      }));
    } catch (error) {
      console.error('Error fetching styles:', error);
      throw error;
    }
  }
}; 