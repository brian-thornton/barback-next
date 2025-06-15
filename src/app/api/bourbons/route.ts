import { NextResponse } from 'next/server';

const WHISKY_DB_URL = 'https://www.whisky.com/whisky-database/bottle-search/whisky.html';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    
    console.log('Making request to Whisky.com database:', `${WHISKY_DB_URL}?search=${query}`);
    
    const response = await fetch(`${WHISKY_DB_URL}?search=${encodeURIComponent(query)}`, {
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
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

    const html = await response.text();
    console.log('Received HTML response length:', html.length);

    // Parse the HTML response
    const bourbons = parseWhiskyComResponse(html);
    console.log('Parsed bourbons:', bourbons.length);

    return NextResponse.json({
      data: bourbons,
      total: bourbons.length
    });
  } catch (error) {
    console.error('Scraping error:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
    }
    return NextResponse.json(
      { error: 'Failed to fetch data from Whisky.com database' },
      { status: 500 }
    );
  }
}

function parseWhiskyComResponse(html: string) {
  const bourbons = [];
  const bottleRegex = /<div class="bottle-item">([\s\S]*?)<\/div>/g;
  const nameRegex = /<div class="bottle-name">([\s\S]*?)<\/div>/;
  const distillerRegex = /<div class="distillery-name">([\s\S]*?)<\/div>/;
  const abvRegex = /<div class="abv">([\s\S]*?)<\/div>/;
  const descriptionRegex = /<div class="description">([\s\S]*?)<\/div>/;
  const imageRegex = /<img[^>]+src="([^"]+)"/;

  let match;
  while ((match = bottleRegex.exec(html)) !== null) {
    const bottleHtml = match[1];
    const nameMatch = bottleHtml.match(nameRegex);
    const distillerMatch = bottleHtml.match(distillerRegex);
    const abvMatch = bottleHtml.match(abvRegex);
    const descriptionMatch = bottleHtml.match(descriptionRegex);
    const imageMatch = bottleHtml.match(imageRegex);

    const name = nameMatch ? nameMatch[1].trim() : '';
    if (!name) continue; // Skip if no name found

    bourbons.push({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      distiller: distillerMatch ? distillerMatch[1].trim() : '',
      abv: abvMatch ? abvMatch[1].trim() : '',
      description: descriptionMatch ? descriptionMatch[1].trim() : '',
      image: imageMatch ? imageMatch[1] : '',
      region: 'Kentucky', // Default to Kentucky for bourbons
      category: 'Bourbon',
      tastingNotes: {
        nose: 'Not available',
        palate: 'Not available',
        finish: 'Not available'
      }
    });
  }

  return bourbons;
} 