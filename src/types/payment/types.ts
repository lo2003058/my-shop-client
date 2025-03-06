export interface Payment {
  id: number;
  method: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
