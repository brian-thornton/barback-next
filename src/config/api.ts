export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.brewerydb.com/v2',
  apiKey: process.env.NEXT_PUBLIC_BREWERYDB_API_KEY,
  endpoints: {
    beers: '/beers',
    search: '/search',
    breweries: '/breweries',
    styles: '/styles'
  }
}; 