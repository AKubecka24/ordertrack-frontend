export type Order = {
  id?: number;
  client_name: string;
  product_name: string;
  quantity: number;
  status: string;
  created_at?: string;
};
