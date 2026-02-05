export type SortDirection = "asc" | "desc";


export type PageProps = {
    params: Promise<{
        id: string
    }>
}

export interface Sort  {
  field: string;
  direction: SortDirection;
}

export interface PageRequest {
  page: number;
  size: number;
  sorts: Sort[];
}