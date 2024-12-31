export type InventoryProps = {
  title: string;
  description: string;
  action: any;
  btnTitle: string;
  data?: any;
  add?: string;
  selectedId?: any;
};

export type deleteBtnProps = {
  title: string;
  handleDelete: any;
};

export type InventoryDataProps = {
  id: string;
  itemName: string;
  quantity: string;
  costPerUnit: number;
  supplierBrand: number;
  reorderLevel: string;
  expirationDate: Date | null;
  createdAt: Date;
  updatedAt: Date | null;
}[];
