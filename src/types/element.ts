export interface Element {
  atomicNumber: number;
  symbol: string;
  name: string;
  atomicMass: string;
  category: string;
  block: string;
  valency: number[];
  electronConfiguration: string;
  uses: string[];
  state: string;
  discoveredBy: string;
  yearDiscovered: number;
  group: number;
  period: number;
  reactions?: Array<{
    equation: string;
    description: string;
  }>;
}