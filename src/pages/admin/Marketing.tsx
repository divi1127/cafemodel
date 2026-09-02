import { useState } from "react";
import { motion } from "framer-motion";
import {
  Megaphone,
  Users,
  BarChart3,
  Pause,
  Play,
  Trash2,
  Edit3,
  Eye,
  Mail,
  MessageSquare,
  Smartphone,
  Target,
  TrendingUp,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card, Badge, EmptyState } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { StatCard } from "@/components/ui/StatCard";
import { useOrderStore } from "@/stores/orderStore";
import { PageEntrance, EntranceItem } from "@/components/animations/PageEntrance";
import { campaigns as initialCampaigns } from "@/data/analytics";

type Tab = "campaigns" | "segments" | "promotions";

const statusVariant: Record<string, string> = {
  draft: "bg-gray-500/15 text-gray-400 border-gray-500/30",
  live: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  ended: "bg-gray-500/15 text-gray-400 border-gray-500/30",
};

const channelIcons: Record<string, React.ReactNode> = {
  email: <Mail className="w-4 h-4" />,
  sms: <MessageSquare className="w-4 h-4" />,
  push: <Smartphone className="w-4 h-4" />,
  social: <TrendingUp className="w-4 h-4" />,
};

const mockSegments = [
  { id: "1", name: "All Customers", count: 1247, color: "var(--primary)" },
  { id: "2", name: "High Spenders", count: 186, color: "#f59e0b" },
  { id: "3", name: "Coffee Lovers", count: 834, color: "#10b981" },
  { id: "4", name: "Inactive 30d", count: 203, color: "#ef4444" },
  { id: "5", name: "Birthday This Month", count: 42, color: "#8b5cf6" },
];

const mockPromotions = [
  { id: "1", title: "Happy Hour - 2 to 5 PM", discount: "20%", status: "active", channel: "All" },
  { id: "2", title: "Refer a Friend", discount: "₹100 Off", status: "active", channel: "App" },
  { id: "3", title: "Weekend Brunch Combo", discount: "15%", status: "scheduled", channel: "Email" },
  { id: "4", title: "Festive Season Sale", discount: "25%", status: "ended", channel: "Social" },
  { id: "5", title: "New Store Launch", discount: "30%", status: "active", channel: "Push" },
];

export default function Marketing() {
  const [activeTab, setActiveTab] = useState<Tab>("campaigns");
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const { pushToast } = useOrderStore();

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "campaigns", label: "Campaigns", icon: <Megaphone className="w-4 h-4" /> },
    { key: "segments", label: "Segments", icon: <Users className="w-4 h-4" /> },
    { key: "promotions", label: "Promotions", icon: <Star className="w-4 h-4" /> },
  ];

  function toggleCampaignStatus(id: string) {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        if (c.status === "live") return { ...c, status: "draft" as const };
        if (c.status === "draft") return { ...c, status: "live" as const };
        return c;
      })
    );
  }

  function deleteCampaign(id: string) {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
    pushToast("Campaign deleted");
  }

  const liveCampaigns = campaigns.filter((c) => c.status === "live").length;
  const totalReach = campaigns.reduce((a, c) => a + c.reach, 0);

  return (
    <PageEntrance>
      <div className="space-y-6">
        <EntranceItem>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[var(--foreground)]">Marketing</h1>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">
                Manage campaigns, segments, and promotional activities
              </p>
            </div>
            <Button className="flex items-center gap-2">
              <Megaphone className="w-4 h-4" /> New Campaign
            </Button>
          </div>
        </EntranceItem>

        <EntranceItem>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              label="Live Campaigns"
              value={liveCampaigns}
              icon={<Megaphone className="w-5 h-5" />}
            />
            <StatCard
              label="Total Reach"
              value={totalReach.toLocaleString()}
              icon={<Eye className="w-5 h-5" />}
            />
            <StatCard
              label="Active Segments"
              value={mockSegments.length}
              icon={<Users className="w-5 h-5" />}
            />
          </div>
        </EntranceItem>

        <EntranceItem>
          <div className="flex gap-1 p-1 rounded-lg bg-[var(--card)] border border-[var(--border)] w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors font-medium",
                  activeTab === tab.key
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </EntranceItem>

        {activeTab === "campaigns" && (
          <div className="space-y-4">
            {campaigns.length === 0 ? (
              <Card className="p-12">
                <EmptyState
                  icon={<Megaphone className="w-12 h-12" />}
                  title="No campaigns yet"
                  description="Create your first marketing campaign"
                />
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {campaigns.map((campaign, i) => (
                  <motion.div
                    key={campaign.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-[var(--foreground)]">
                              {campaign.name}
                            </h3>
                            <span
                              className={cn(
                                "inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md border capitalize",
                                statusVariant[campaign.status]
                              )}
                            >
                              {campaign.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-[var(--muted-foreground)]">
                            <span className="flex items-center gap-1">
                              <Target className="w-3.5 h-3.5" />
                              {campaign.segment}
                            </span>
                            <span className="flex items-center gap-1">
                              {channelIcons[campaign.channel] || (
                                <Megaphone className="w-3.5 h-3.5" />
                              )}
                              {campaign.channel}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5" />
                              {campaign.reach.toLocaleString()} reached
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleCampaignStatus(campaign.id)}
                            title={campaign.status === "live" ? "Pause" : "Resume"}
                          >
                            {campaign.status === "live" ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                          </Button>
                          <Button variant="ghost" size="sm" title="Edit">
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteCampaign(campaign.id)}
                            title="Delete"
                            className="text-[var(--danger)] hover:text-[var(--danger)]"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)] mb-1">
                          <span>Reach progress</span>
                          <span>{campaign.reach.toLocaleString()}</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-[var(--muted)]">
                          <div
                            className="h-full rounded-full bg-[var(--primary)]"
                            style={{
                              width: `${Math.min((campaign.reach / 5000) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "segments" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockSegments.map((segment, i) => (
              <motion.div
                key={segment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="p-5 hover:border-[var(--primary)]/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${segment.color}20` }}
                    >
                      <Users className="w-5 h-5" style={{ color: segment.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[var(--foreground)]">{segment.name}</h3>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        {segment.count.toLocaleString()} customers
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 w-full h-1.5 rounded-full bg-[var(--muted)]">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(segment.count / 1247) * 100}%`,
                        backgroundColor: segment.color,
                      }}
                    />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === "promotions" && (
          <div className="space-y-3">
            {mockPromotions.map((promo, i) => (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
                      <Star className="w-5 h-5 text-[var(--primary)]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[var(--foreground)]">{promo.title}</h3>
                      <p className="text-sm text-[var(--muted-foreground)]">
                        Channel: {promo.channel}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-[var(--primary)]">
                      {promo.discount}
                    </span>
                    <Badge
                      variant={
                        promo.status === "active"
                          ? "success"
                          : promo.status === "scheduled"
                          ? "default"
                          : "muted"
                      }
                    >
                      {promo.status}
                    </Badge>
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
