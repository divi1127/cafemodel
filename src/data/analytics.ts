export const analytics = {
  kpis: {
    todaySales: 84560,
    todaySalesDelta: 18.4,
    totalOrders: 186,
    ordersDelta: 9.2,
    revenue: 612400,
    revenueDelta: 11.1,
    customers: 1240,
    customersDelta: 4.6,
    reservations: 28,
    pendingOrders: 7,
    lowStock: 3,
  },
  salesByDay: [
    { day: "Mon", sales: 62000, orders: 140 },
    { day: "Tue", sales: 58000, orders: 128 },
    { day: "Wed", sales: 71000, orders: 155 },
    { day: "Thu", sales: 69000, orders: 149 },
    { day: "Fri", sales: 88000, orders: 190 },
    { day: "Sat", sales: 102000, orders: 210 },
    { day: "Sun", sales: 84560, orders: 186 },
  ],
  categories: [
    { name: "Coffee", value: 42 },
    { name: "Food", value: 31 },
    { name: "Dessert", value: 15 },
    { name: "Tea", value: 12 },
  ],
  peakHours: [
    { hour: "8", orders: 12 },
    { hour: "9", orders: 28 },
    { hour: "10", orders: 22 },
    { hour: "11", orders: 18 },
    { hour: "12", orders: 34 },
    { hour: "13", orders: 40 },
    { hour: "14", orders: 26 },
    { hour: "15", orders: 16 },
    { hour: "16", orders: 21 },
    { hour: "17", orders: 30 },
    { hour: "18", orders: 36 },
    { hour: "19", orders: 32 },
  ],
  customersTrend: [
    { month: "Mar", customers: 820 },
    { month: "Apr", customers: 910 },
    { month: "May", customers: 980 },
    { month: "Jun", customers: 1050 },
    { month: "Jul", customers: 1160 },
    { month: "Aug", customers: 1240 },
  ],
};

export const expenses = [
  { id: "e1", label: "Rent", category: "Fixed", amount: 180000, date: "2026-08-01" },
  { id: "e2", label: "Payroll", category: "Staff", amount: 240000, date: "2026-08-01" },
  { id: "e3", label: "Beans", category: "COGS", amount: 42000, date: "2026-08-20" },
  { id: "e4", label: "Utilities", category: "Ops", amount: 28000, date: "2026-08-10" },
];

export const campaigns = [
  { id: "cm1", name: "Monsoon desserts", segment: "Dessert lovers", channel: "Push", status: "live" as const, reach: 4200 },
  { id: "cm2", name: "Birthday pour", segment: "Loyalty Reserve+", channel: "Email", status: "live" as const, reach: 860 },
  { id: "cm3", name: "Referral — invite a friend", segment: "All", channel: "In-app", status: "draft" as const, reach: 0 },
  { id: "cm4", name: "Festival Diwali preview", segment: "Inactive 60d", channel: "SMS", status: "ended" as const, reach: 2100 },
];

export const gallery = [
  { id: "g1", src: "https://images.unsplash.com/photo-1453614512568-7af3b2078d9e?auto=format&fit=crop&w=900&q=80", alt: "Latte art", tall: true },
  { id: "g2", src: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=900&q=80", alt: "Café counter" },
  { id: "g3", src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80", alt: "Plated dish", tall: true },
  { id: "g4", src: "https://images.unsplash.com/photo-1493857671505-72967e2e2760?auto=format&fit=crop&w=900&q=80", alt: "Interior" },
  { id: "g5", src: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=900&q=80", alt: "Barista" },
  { id: "g6", src: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=80", alt: "Evening table", tall: true },
  { id: "g7", src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80", alt: "Hands and cup" },
  { id: "g8", src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80", alt: "Dining room" },
];

export const events = [
  { id: "ev1", title: "Cupping Sunday", date: "31 Aug", copy: "Public tasting of three microlots." },
  { id: "ev2", title: "Latte art lab", date: "7 Sep", copy: "Small class with our head barista." },
  { id: "ev3", title: "Jazz after dusk", date: "12 Sep", copy: "Trio in the courtyard, seating limited." },
];

export const faqs = [
  { q: "Do you take reservations?", a: "Yes — evenings especially. Use the reservation page or call the floor." },
  { q: "Is there parking?", a: "Valet on weekends; street parking is limited. Metro is a six-minute walk." },
  { q: "Can I work from the café?", a: "Mornings until 11:30, laptops welcome. Lunch service we keep tables for dining." },
  { q: "Are you vegetarian-friendly?", a: "A full vegetarian menu, clearly marked, including pizzas and desserts." },
];
