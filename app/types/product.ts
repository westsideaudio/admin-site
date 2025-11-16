export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  sku: string;
  price: number;
  stock: number;
  cloudinaryPublicIds: string[];
  attributes: Object;
  featured: boolean;
}