import { NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const BOURBON_DATA_FILE = join(process.cwd(), 'data', 'bourbons', 'scraped-bourbons.json');

async function loadBourbonData() {
  try {
    if (!existsSync(BOURBON_DATA_FILE)) {
      // Initialize with empty array
      await writeFile(BOURBON_DATA_FILE, JSON.stringify([], null, 2));
      return [];
    }
    
    const data = await readFile(BOURBON_DATA_FILE, 'utf-8');
    const bourbons = JSON.parse(data);
    return bourbons;
  } catch (error) {
    console.log('Error loading bourbon data, returning empty array:', error);
    return [];
  }
}

async function saveBourbonData(bourbons: any[]) {
  try {
    await writeFile(BOURBON_DATA_FILE, JSON.stringify(bourbons, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving bourbon data:', error);
    return false;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    console.log('Local bourbon search with params:', { query, page, limit });
    
    // Load bourbon data
    const bourbonData = await loadBourbonData();
    
    // Filter the dataset based on search parameters
    let filteredBourbons = bourbonData.filter((bourbon: any) => {
      const matchesQuery = !query || 
        bourbon.name.toLowerCase().includes(query.toLowerCase()) ||
        bourbon.distiller.toLowerCase().includes(query.toLowerCase());
      
      return matchesQuery;
    });
    
    // Sort by name for consistent results
    filteredBourbons.sort((a: any, b: any) => a.name.localeCompare(b.name));
    
    // Apply pagination
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedBourbons = filteredBourbons.slice(start, end);
    
    console.log(`Found ${filteredBourbons.length} bourbons locally, returning ${paginatedBourbons.length} for page ${page}`);
    
    return NextResponse.json({
      data: paginatedBourbons,
      total: filteredBourbons.length,
      page,
      limit,
      totalPages: Math.ceil(filteredBourbons.length / limit),
      source: 'local',
      totalInDatabase: bourbonData.length
    });
  } catch (error) {
    console.error('Local bourbon API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch local bourbon data' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const newBourbon = await request.json();
    
    console.log('Adding new bourbon:', newBourbon);
    
    // Load existing bourbons
    const bourbons = await loadBourbonData();
    
    // Generate ID if not provided
    if (!newBourbon.id) {
      newBourbon.id = newBourbon.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    }
    
    // Check if bourbon already exists
    const existingIndex = bourbons.findIndex((b: any) => b.id === newBourbon.id);
    
    if (existingIndex >= 0) {
      // Update existing bourbon
      bourbons[existingIndex] = newBourbon;
    } else {
      // Add new bourbon
      bourbons.push(newBourbon);
    }
    
    // Save to file
    const saved = await saveBourbonData(bourbons);
    
    if (saved) {
      return NextResponse.json({
        success: true,
        bourbon: newBourbon,
        message: 'Bourbon saved successfully'
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to save bourbon to file' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error adding bourbon:', error);
    return NextResponse.json(
      { error: 'Failed to add bourbon' },
      { status: 500 }
    );
  }
}
