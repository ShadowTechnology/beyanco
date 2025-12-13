export interface Plan {
  id?: number;
  name: string;
  description?: string;
  price: number;      // INR
  duration: string;   // "monthly" | "yearly" | "lifetime"
  active?: boolean;
}
