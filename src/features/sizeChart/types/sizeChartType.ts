export interface SizeChartRow {
  id?: string;
  sizeCode: string;
  chestMin: number | null;
  chestMax: number | null;
  waistMin: number | null;
  waistMax: number | null;
  hipMin: number | null;
  hipMax: number | null;
  heightMin: number | null;
  heightMax: number | null;
  weightMin: number | null;
  weightMax: number | null;
}

export interface SizeChart {
  id: string;
  name: string;
  rows: SizeChartRow[];
  createdAt: string;
  updatedAt: string;
}

export interface SizeChartPayload {
  name: string;
  rows: Omit<SizeChartRow, 'id'>[];
}

export interface SizeChartQueryParams {
  keyword?: string;
  page?: number;
  size?: number;
}
