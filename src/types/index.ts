export interface User {
  id: string;
  name: string;
  email: string;
  points: number;
}

export interface QRScanResult {
  points: number;
  timestamp: Date;
  rawData: string;
}