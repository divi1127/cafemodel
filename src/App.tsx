import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { CustomerLayout } from "@/components/layout/CustomerLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { PosLayout, KitchenLayout } from "@/components/layout/OpsLayout";
import { Skeleton } from "@/components/ui/Card";

const Home = lazy(() => import("@/pages/customer/Home"));
const About = lazy(() => import("@/pages/customer/About"));
const MenuPage = lazy(() => import("@/pages/customer/MenuPage"));
const ProductDetail = lazy(() => import("@/pages/customer/ProductDetail"));
const Offers = lazy(() => import("@/pages/customer/Offers"));
const Gallery = lazy(() => import("@/pages/customer/Gallery"));
const Events = lazy(() => import("@/pages/customer/Events"));
const Reservation = lazy(() => import("@/pages/customer/Reservation"));
const Cart = lazy(() => import("@/pages/customer/Cart"));
const Checkout = lazy(() => import("@/pages/customer/Checkout"));
const OrderTracking = lazy(() => import("@/pages/customer/OrderTracking"));
const Login = lazy(() => import("@/pages/customer/Login"));
const Register = lazy(() => import("@/pages/customer/Register"));
const Account = lazy(() => import("@/pages/customer/Account"));
const Favorites = lazy(() => import("@/pages/customer/Favorites"));
const Loyalty = lazy(() => import("@/pages/customer/Loyalty"));
const Contact = lazy(() => import("@/pages/customer/Contact"));
const Reviews = lazy(() => import("@/pages/customer/Reviews"));
const FAQ = lazy(() => import("@/pages/customer/FAQ"));

const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
const Sales = lazy(() => import("@/pages/admin/Sales"));
const AdminOrders = lazy(() => import("@/pages/admin/Orders"));
const AdminMenu = lazy(() => import("@/pages/admin/AdminMenu"));
const Categories = lazy(() => import("@/pages/admin/Categories"));
const Products = lazy(() => import("@/pages/admin/Products"));
const Tables = lazy(() => import("@/pages/admin/Tables"));
const Reservations = lazy(() => import("@/pages/admin/Reservations"));
const Inventory = lazy(() => import("@/pages/admin/Inventory"));
const Customers = lazy(() => import("@/pages/admin/Customers"));
const Staff = lazy(() => import("@/pages/admin/Staff"));
const OffersAdmin = lazy(() => import("@/pages/admin/OffersAdmin"));
const Marketing = lazy(() => import("@/pages/admin/Marketing"));
const Finance = lazy(() => import("@/pages/admin/Finance"));
const Reports = lazy(() => import("@/pages/admin/Reports"));
const ReviewsAdmin = lazy(() => import("@/pages/admin/ReviewsAdmin"));
const Settings = lazy(() => import("@/pages/admin/Settings"));

const POS = lazy(() => import("@/pages/ops/POS"));
const Kitchen = lazy(() => import("@/pages/ops/Kitchen"));

function Loader() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Loading</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/menu/:slug" element={<ProductDetail />} />
          <Route path="/experience" element={<About />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/events" element={<Events />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-tracking" element={<OrderTracking />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<Account />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/loyalty" element={<Loyalty />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/faq" element={<FAQ />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="sales" element={<Sales />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="menu" element={<AdminMenu />} />
          <Route path="categories" element={<Categories />} />
          <Route path="products" element={<Products />} />
          <Route path="tables" element={<Tables />} />
          <Route path="reservations" element={<Reservations />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="customers" element={<Customers />} />
          <Route path="staff" element={<Staff />} />
          <Route path="offers" element={<OffersAdmin />} />
          <Route path="marketing" element={<Marketing />} />
          <Route path="finance" element={<Finance />} />
          <Route path="reports" element={<Reports />} />
          <Route path="reviews" element={<ReviewsAdmin />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="/pos" element={<PosLayout />}>
          <Route index element={<POS />} />
        </Route>

        <Route path="/kitchen" element={<KitchenLayout />}>
          <Route index element={<Kitchen />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
