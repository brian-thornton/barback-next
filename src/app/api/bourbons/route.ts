import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Use local API only
    const localUrl = new URL('/api/bourbons/local', request.url);
    searchParams.forEach((value, key) => {
      localUrl.searchParams.append(key, value);
    });
    
    const localResponse = await fetch(localUrl.toString());
    return NextResponse.json(await localResponse.json());
    
  } catch (error) {
    console.error('Bourbon API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bourbon data' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const bourbon = await request.json();
    
    // Forward to local API to save
    const localUrl = new URL('/api/bourbons/local', request.url);
    const response = await fetch(localUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bourbon),
    });
    
    return NextResponse.json(await response.json());
    
  } catch (error) {
    console.error('Bourbon API error:', error);
    return NextResponse.json(
      { error: 'Failed to save bourbon data' },
      { status: 500 }
    );
  }
}
