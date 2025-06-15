import { API_CONFIG } from '@/config/api';
import { Bourbon } from '@/data/bourbons';

interface SearchParams {
  query?: string;
  distiller?: string;
  category?: string;
  region?: string;
  page?: number;
  limit?: number;
}

interface WhiskyHunterDistillery {
  name: string;
  slug: string;
  region: string;
  country: string;
  founded: number;
  status: string;
  owner: string;
  website: string;
  description: string;
}

interface WhiskyHunterAuction {
  name: string;
  slug: string;
  start_date: string;
  end_date: string;
  total_lots: number;
  total_volume: number;
  average_price: number;
}

const mapWhiskyHunterToBourbon = (distillery: WhiskyHunterDistillery): Bourbon => {
  return {
    id: distillery.slug,
    name: distillery.name,
    distiller: distillery.owner,
    abv: 'Unknown', // Whisky Hunter doesn't provide ABV info
    description: distillery.description,
    image: '/placeholder-bourbon.jpg', // Whisky Hunter doesn't provide images
    region: distillery.region,
    category: 'Bourbon',
    tastingNotes: {
      nose: 'Not available',
      palate: 'Not available',
      finish: 'Not available'
    }
  };
};

export const bourbonApi = {
  async search(params: SearchParams = {}): Promise<{ data: Bourbon[]; total: number }> {
    try {
      console.log('Searching bourbons with params:', params);
      
      const response = await fetch(
        `/api/bourbons?query=${encodeURIComponent(params.query || '')}`,
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
        throw new Error(`Failed to search bourbons: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Search results:', result);

      // Apply additional filters if provided
      let filteredData = result.data;
      
      if (params.distiller) {
        filteredData = filteredData.filter((bourbon: Bourbon) => 
          bourbon.distiller.toLowerCase().includes(params.distiller!.toLowerCase())
        );
      }
      
      if (params.region) {
        filteredData = filteredData.filter((bourbon: Bourbon) => 
          bourbon.region.toLowerCase().includes(params.region!.toLowerCase())
        );
      }
      
      if (params.category) {
        filteredData = filteredData.filter((bourbon: Bourbon) => 
          bourbon.category.toLowerCase().includes(params.category!.toLowerCase())
        );
      }

      // Apply pagination
      const page = params.page || 1;
      const limit = params.limit || 20;
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedData = filteredData.slice(start, end);

      return {
        data: paginatedData,
        total: filteredData.length
      };
    } catch (error) {
      console.error('Error searching bourbons:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to search bourbons: ${error.message}`);
      }
      throw error;
    }
  },

  async getBourbonById(id: string): Promise<Bourbon> {
    try {
      const response = await fetch(
        `/api/bourbons?query=${encodeURIComponent(id)}`,
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
        throw new Error(`Failed to fetch bourbon: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      const bourbon = result.data.find((b: Bourbon) => b.id === id);
      
      if (!bourbon) {
        throw new Error(`Bourbon with id ${id} not found`);
      }

      return bourbon;
    } catch (error) {
      console.error('Error fetching bourbon:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to fetch bourbon: ${error.message}`);
      }
      throw error;
    }
  },

  async getAuctionData(slug: string) {
    try {
      const response = await fetch(
        `/api/bourbons?endpoint=auction_data/${slug}/`,
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
        throw new Error(`Failed to fetch auction data: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching auction data:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to fetch auction data: ${error.message}`);
      }
      throw error;
    }
  }
}; 