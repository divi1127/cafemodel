import { useState } from "react";
import { motion } from "framer-motion";
import {
  Star,
  Check,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Filter,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card, Badge, EmptyState } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { PageEntrance, EntranceItem } from "@/components/animations/PageEntrance";
import { reviews as initialReviews } from "@/data/reviews";
import type { Review } from "@/types";
import { useOrderStore } from "@/stores/orderStore";

type FilterTab = "all" | "pending" | "approved" | "rejected";

const ratingDistribution = [
  { stars: "5★", count: 45, fill: "#10b981" },
  { stars: "4★", count: 32, fill: "#3b82f6" },
  { stars: "3★", count: 18, fill: "#f59e0b" },
  { stars: "2★", count: 8, fill: "#f97316" },
  { stars: "1★", count: 3, fill: "#ef4444" },
];

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={cn(
            "shrink-0",
            s <= rating ? "fill-amber-400 text-amber-400" : "text-[var(--muted)]"
          )}
          style={{ width: size, height: size }}
        />
      ))}
    </div>
  );
}

export default function ReviewsAdmin() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [filterTab, setFilterTab] = useState<FilterTab>("all");
  const { pushToast } = useOrderStore();

  const totalCount = reviews.length;
  const avgRating =
    totalCount > 0
      ? (reviews.reduce((a, r) => a + r.rating, 0) / totalCount).toFixed(1)
      : "0.0";
  const pendingCount = reviews.filter((r) => !r.approved).length;
  const approvedCount = reviews.filter((r) => r.approved).length;

  const filtered = reviews.filter((r) => {
    if (filterTab === "pending") return !r.approved;
    if (filterTab === "approved") return r.approved;
    if (filterTab === "rejected") return false;
    return true;
  });

  function approveReview(id: string) {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, approved: true } : r))
    );
    pushToast("Review approved");
  }

  function rejectReview(id: string) {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    pushToast("Review rejected and removed");
  }

  const filterTabs: { key: FilterTab; label: string; count: number }[] = [
    { key: "all", label: "All", count: totalCount },
    { key: "pending", label: "Pending", count: pendingCount },
    { key: "approved", label: "Approved", count: approvedCount },
    { key: "rejected", label: "Rejected", count: 0 },
  ];

  return (
    <PageEntrance>
      <div className="space-y-6">
        <EntranceItem>
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">Reviews</h1>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              Moderate and manage customer reviews
            </p>
          </div>
        </EntranceItem>

        <EntranceItem>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Reviews"
              value={totalCount}
              icon={<MessageSquare className="w-5 h-5" />}
            />
            <StatCard
              label="Average Rating"
              value={avgRating}
              icon={<Star className="w-5 h-5" />}
            />
            <StatCard
              label="Pending Moderation"
              value={pendingCount}
              icon={<Filter className="w-5 h-5" />}
            />
            <StatCard
              label="Approved"
              value={approvedCount}
              icon={<Check className="w-5 h-5" />}
            />
          </div>
        </EntranceItem>

        <EntranceItem>
          <Card className="p-5">
            <h3 className="font-semibold text-[var(--foreground)] mb-4">
              Rating Distribution
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={ratingDistribution}
                  layout="vertical"
                  barSize={20}
                >
                  <XAxis
                    type="number"
                    tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                    axisLine={{ stroke: "var(--border)" }}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="stars"
                    tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    width={30}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      return (
                        <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-3 shadow-xl">
                          <p className="text-sm font-medium text-[var(--foreground)]">
                            {payload[0].payload.stars} — {payload[0].value} reviews
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {ratingDistribution.map((entry, idx) => (
                      <motion.rect
                        key={idx}
                        fill={entry.fill}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </EntranceItem>

        <EntranceItem>
          <div className="flex gap-1 p-1 rounded-lg bg-[var(--card)] border border-[var(--border)] w-fit">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilterTab(tab.key)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors font-medium",
                  filterTab === tab.key
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                )}
              >
                {tab.label}
                <span
                  className={cn(
                    "px-1.5 py-0.5 text-xs rounded-full",
                    filterTab === tab.key
                      ? "bg-white/20 text-white"
                      : "bg-[var(--muted)] text-[var(--muted-foreground)]"
                  )}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </EntranceItem>

        {filtered.length === 0 ? (
          <EntranceItem>
            <Card className="p-12">
              <EmptyState
                icon={<MessageSquare className="w-12 h-12" />}
                title="No reviews found"
                description="No reviews match the selected filter"
              />
            </Card>
          </EntranceItem>
        ) : (
          <div className="space-y-4">
            {filtered.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Card className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="w-9 h-9 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-sm font-semibold text-[var(--primary)]">
                          {review.customer.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-medium text-[var(--foreground)]">
                            {review.customer}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <StarRating rating={review.rating} size={14} />
                            <span className="text-xs text-[var(--muted-foreground)]">
                              {review.date}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3">
                        <h5 className="font-semibold text-[var(--foreground)]">
                          {review.title}
                        </h5>
                        <p className="text-sm text-[var(--muted-foreground)] mt-1 leading-relaxed">
                          {review.body}
                        </p>
                      </div>

                      {review.productId && (
                        <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-[var(--muted)] text-xs text-[var(--muted-foreground)]">
                          <span className="font-medium">Product ID:</span>{" "}
                          {review.productId}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <Badge
                        variant={review.approved ? "success" : "warning"}
                      >
                        {review.approved ? "Approved" : "Pending"}
                      </Badge>

                      {!review.approved && (
                        <div className="flex gap-2 mt-2">
                          <Button
                            size="sm"
                            onClick={() => approveReview(review.id)}
                            className="flex items-center gap-1 bg-[var(--success)]/10 text-[var(--success)] hover:bg-[var(--success)]/20"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" /> Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => rejectReview(review.id)}
                            className="flex items-center gap-1 text-[var(--danger)] hover:bg-[var(--danger)]/10"
                          >
                            <ThumbsDown className="w-3.5 h-3.5" /> Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageEntrance>
  );
}
