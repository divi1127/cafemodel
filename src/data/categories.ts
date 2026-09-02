import { IMG } from "@/lib/images";
import type { Category } from "@/types";

export const categories: Category[] = [
  { id: "c1", name: "Coffee", description: "Single origin pours & espresso craft", image: IMG.espresso },
  { id: "c2", name: "Tea", description: "Leaf, steam, quiet ritual", image: IMG.tea },
  { id: "c3", name: "Cold Drinks", description: "Iced, sparkling, slow-sipped", image: IMG.cold },
  { id: "c4", name: "Milkshakes", description: "House cream, real fruit", image: IMG.shake },
  { id: "c5", name: "Pizza", description: "Wood-fired, thin, generous", image: IMG.pizza },
  { id: "c6", name: "Burgers", description: "Brioche, house sauce, char", image: IMG.burger },
  { id: "c7", name: "Sandwiches", description: "Pressed, layered, lunch-ready", image: IMG.sandwich },
  { id: "c8", name: "Pasta", description: "Silky sauces, fresh herbs", image: IMG.pasta },
  { id: "c9", name: "Snacks", description: "Crisp plates to share", image: IMG.fries },
  { id: "c10", name: "Desserts", description: "Plated sweetness", image: IMG.dessert },
  { id: "c11", name: "Cakes", description: "By the slice, by the moment", image: IMG.cake },
  { id: "c12", name: "Combos", description: "Curated pairings", image: IMG.combo },
  { id: "c13", name: "Specials", description: "Chef's limited pours", image: IMG.pastry },
];
