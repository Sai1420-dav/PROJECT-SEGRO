export function extractPointsFromQR(qrData: string): number {
  console.log('Processing QR data:', qrData);
  
  try {
    // Try to parse as JSON first (structured QR codes)
    const parsed = JSON.parse(qrData);
    if (parsed.points && typeof parsed.points === 'number') {
      console.log('Found points in JSON:', parsed.points);
      return Math.max(0, parsed.points);
    }
    if (parsed.amount && typeof parsed.amount === 'number') {
      console.log('Found amount in JSON:', parsed.amount);
      return Math.max(0, parsed.amount);
    }
  } catch {
    // If not JSON, try to extract numbers from the string
    const numberMatch = qrData.match(/(\d+(?:\.\d+)?)/);
    if (numberMatch) {
      const points = Math.floor(parseFloat(numberMatch[1]));
      console.log('Extracted points from text:', points);
      return Math.max(0, points);
    }
  }
  
  // Check for common QR code patterns
  const lowerData = qrData.toLowerCase();
  if (lowerData.includes('point') || lowerData.includes('reward') || lowerData.includes('credit')) {
    const numberMatch = qrData.match(/(\d+)/);
    if (numberMatch) {
      const points = parseInt(numberMatch[1], 10);
      console.log('Found points in reward text:', points);
      return Math.max(0, points);
    }
  }
  
  // If it's a URL, try to extract points from query parameters
  try {
    const url = new URL(qrData);
    const pointsParam = url.searchParams.get('points') || url.searchParams.get('amount') || url.searchParams.get('value');
    if (pointsParam) {
      const points = parseInt(pointsParam, 10);
      console.log('Found points in URL params:', points);
      return Math.max(0, points);
    }
  } catch {
    // Not a valid URL, continue
  }
  
  console.log('No points found, using default');
  // Default points if no valid number found
  return 10;
}

export function generateSampleQR(points: number): string {
  return JSON.stringify({
    points,
    timestamp: new Date().toISOString(),
    source: 'segro-reward'
  });
}