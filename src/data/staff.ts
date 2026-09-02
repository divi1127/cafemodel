import type { StaffMember } from "@/types";

export const staff: StaffMember[] = [
  { id: "s1", name: "Aditi Rao", role: "Super Admin", email: "aditi@aurelia.cafe", phone: "9001110001", shift: "Split", attendance: 98, performance: 96, active: true },
  { id: "s2", name: "Vikram Joshi", role: "Manager", email: "vikram@aurelia.cafe", phone: "9001110002", shift: "Morning", attendance: 94, performance: 91, active: true },
  { id: "s3", name: "Leah Fernandes", role: "Cashier", email: "leah@aurelia.cafe", phone: "9001110003", shift: "Evening", attendance: 97, performance: 93, active: true },
  { id: "s4", name: "Omar Khan", role: "Kitchen Staff", email: "omar@aurelia.cafe", phone: "9001110004", shift: "Morning", attendance: 90, performance: 88, active: true },
  { id: "s5", name: "Isha Menon", role: "Waiter", email: "isha@aurelia.cafe", phone: "9001110005", shift: "Evening", attendance: 92, performance: 90, active: true },
  { id: "s6", name: "Rohit Das", role: "Delivery Staff", email: "rohit@aurelia.cafe", phone: "9001110006", shift: "Flexible", attendance: 88, performance: 85, active: true },
  { id: "s7", name: "Maya Chen", role: "Admin", email: "maya@aurelia.cafe", phone: "9001110007", shift: "Morning", attendance: 99, performance: 95, active: false },
];
