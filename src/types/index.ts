export type ProductCategory =
  | "Coffee"
  | "Tea"
  | "Cold Drinks"
  | "Milkshakes"
  | "Pizza"
  | "Burgers"
  | "Sandwiches"
  | "Pasta"
  | "Snacks"
  | "Desserts"
  | "Cakes"
  | "Combos"
  | "Specials";

export type OrderStatus =
  | "new"
  | "confirmed"
  | "preparing"
  | "ready"
  | "served"
  | "completed"
  | "cancelled";

export type TableStatus = "available" | "reserved" | "occupied" | "cleaning";

export type Fulfillment = "dine-in" | "takeaway" | "delivery";

export type StaffRole =
  | "Super Admin"
  | "Admin"
  | "Manager"
  | "Cashier"
  | "Kitchen Staff"
  | "Waiter"
  | "Delivery Staff";

export type MembershipTier = "Bean" | "Brew" | "Reserve" | "Estate";

export interface Addon {
  id: string;
  name: string;
  price: number;
}

export interface Variant {
  id: string;
  name: string;
  priceDelta: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  description: string;
  longDescription: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  gallery: string[];
  bestseller: boolean;
  available: boolean;
  discount?: number;
  addons: Addon[];
  variants: Variant[];
  tags: string[];
}

export interface Category {
  id: string;
  name: ProductCategory;
  description: string;
  image: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  addons: string[];
  notes?: string;
}

export interface Order {
  id: string;
  number: string;
  customerId: string;
  customerName: string;
  status: OrderStatus;
  fulfillment: Fulfillment;
  table?: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  createdAt: string;
  notes?: string;
  priority: "normal" | "high";
  payment: "cash" | "card" | "upi" | "wallet";
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  loyaltyPoints: number;
  tier: MembershipTier;
  spent: number;
  orders: number;
  favorites: string[];
  joinedAt: string;
  address: string;
}

export interface CafeTable {
  id: string;
  number: string;
  capacity: number;
  status: TableStatus;
  x: number;
  y: number;
  customer?: string;
  reservationId?: string;
  orderId?: string;
}

export interface Reservation {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  tableId: string;
  status: "pending" | "confirmed" | "seated" | "completed" | "cancelled";
  request?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  email: string;
  phone: string;
  shift: string;
  attendance: number;
  performance: number;
  active: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  unit: string;
  stock: number;
  capacity: number;
  reorderAt: number;
  supplierId: string;
  expiry?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  category: string;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  items: string;
  amount: number;
  status: "draft" | "sent" | "received";
  date: string;
}

export interface Offer {
  id: string;
  title: string;
  type: "coupon" | "bogo" | "happy-hour" | "festival" | "first-order" | "combo";
  code?: string;
  description: string;
  value: string;
  image: string;
  active: boolean;
  validUntil: string;
}

export interface Review {
  id: string;
  customer: string;
  productId?: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  approved: boolean;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  tall?: boolean;
}

export interface Campaign {
  id: string;
  name: string;
  segment: string;
  channel: string;
  status: "draft" | "live" | "ended";
  reach: number;
}

export interface Expense {
  id: string;
  label: string;
  category: string;
  amount: number;
  date: string;
}

export interface CartLine {
  key: string;
  productId: string;
  quantity: number;
  variantId?: string;
  addonIds: string[];
  notes?: string;
}
