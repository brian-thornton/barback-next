import { NextResponse } from 'next/server';
import { API_CONFIG } from '@/config/api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint') || 'search';
    const query = searchParams.get('query') || '';
    
    if (!API_CONFIG.apiKey) {
      console.error('No API key found in environment variables');
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    // Log all search parameters
    console.log('All search parameters:', Object.fromEntries(searchParams.entries()));
    
    // Construct the API URL with all parameters
    const apiUrl = new URL(`${API_CONFIG.baseUrl}/${endpoint}`);
    apiUrl.searchParams.append('key', API_CONFIG.apiKey);
    
    // Add all other parameters from the request
    searchParams.forEach((value, key) => {
      if (key !== 'endpoint') {
        apiUrl.searchParams.append(key, value);
      }
    });

    console.log('Making request to BreweryDB API:', apiUrl.toString());
    console.log('API Key present:', !!API_CONFIG.apiKey);
    console.log('API Key length:', API_CONFIG.apiKey.length);
    
    const response = await fetch(apiUrl.toString(), {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      return NextResponse.json(
        { error: `Failed to fetch data: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Raw API Response:', JSON.stringify(data, null, 2));
    
    if (!data.data) {
      console.log('No data found in response');
      return NextResponse.json({ data: [], totalResults: 0 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
    }
    return NextResponse.json(
      { error: 'Failed to fetch data from BreweryDB API' },
      { status: 500 }
    );
  }
} 