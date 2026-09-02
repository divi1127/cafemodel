import type { InventoryItem, PurchaseOrder, Supplier } from "@/types";

export const suppliers: Supplier[] = [
  { id: "su1", name: "Nilgiri Estate", contact: "estates@nilgiri.in", category: "Coffee" },
  { id: "su2", name: "Coastal Dairy", contact: "hello@coastaldairy.in", category: "Dairy" },
  { id: "su3", name: "Grain & Fire", contact: "orders@grainfire.in", category: "Bakery" },
  { id: "su4", name: "Green Leaf Co.", contact: "tea@greenleaf.in", category: "Tea" },
];

export const inventory: InventoryItem[] = [
  { id: "i1", name: "Coffee beans — estate blend", sku: "BEAN-EST", unit: "kg", stock: 41, capacity: 50, reorderAt: 12, supplierId: "su1" },
  { id: "i2", name: "Coffee beans — Kenya", sku: "BEAN-KEN", unit: "kg", stock: 8, capacity: 20, reorderAt: 6, supplierId: "su1" },
  { id: "i3", name: "Whole milk", sku: "MLK-WHL", unit: "L", stock: 18, capacity: 40, reorderAt: 10, supplierId: "su2", expiry: "2026-08-29" },
  { id: "i4", name: "Oat milk", sku: "MLK-OAT", unit: "L", stock: 9, capacity: 24, reorderAt: 8, supplierId: "su2", expiry: "2026-09-02" },
  { id: "i5", name: "Croissant dough", sku: "BKY-CRS", unit: "pc", stock: 24, capacity: 80, reorderAt: 20, supplierId: "su3", expiry: "2026-08-27" },
  { id: "i6", name: "San Marzano tomatoes", sku: "PRD-TOM", unit: "can", stock: 14, capacity: 30, reorderAt: 8, supplierId: "su3" },
  { id: "i7", name: "Darjeeling first flush", sku: "TEA-DJ", unit: "kg", stock: 3, capacity: 8, reorderAt: 2, supplierId: "su4" },
];

export const purchases: PurchaseOrder[] = [
  { id: "po1", supplierId: "su1", items: "Estate blend 20kg", amount: 42000, status: "received", date: "2026-08-20" },
  { id: "po2", supplierId: "su2", items: "Milk weekly", amount: 8600, status: "sent", date: "2026-08-25" },
  { id: "po3", supplierId: "su3", items: "Pastry & tomatoes", amount: 15400, status: "draft", date: "2026-08-26" },
];

export const wastage = [
  { id: "w1", item: "Croissant", qty: 6, reason: "End of day", date: "2026-08-25", cost: 240 },
  { id: "w2", item: "Milk", qty: 2, reason: "Expiry", date: "2026-08-24", cost: 180 },
];
