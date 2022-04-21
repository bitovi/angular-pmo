
export interface Item {
  name: string;
  price: number;
}

export interface OrderContactInfo {
  name: string;
  address: string;
  phone: string;
}

export interface Order extends OrderContactInfo {
  _id?: string;
  status: string;
  items: Item[];
  restaurant: string;
}
