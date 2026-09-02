import { useState } from "react";
import {
  Sun,
  Moon,
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  Lock,
  Info,
  Database,
  Download,
  Trash2,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/Input";
import { PageEntrance, EntranceItem } from "@/components/animations/PageEntrance";
import { useUiStore } from "@/stores/uiStore";
import { useOrderStore } from "@/stores/orderStore";

function ToggleSwitch({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "relative w-11 h-6 rounded-full transition-colors shrink-0",
        enabled ? "bg-[var(--success)]" : "bg-[var(--muted)]"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform shadow-sm",
          enabled ? "left-[22px]" : "left-0.5"
        )}
      />
    </button>
  );
}

export default function Settings() {
  const { theme, toggleTheme } = useUiStore();
  const { pushToast } = useOrderStore();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });

  function toggleNotification(key: keyof typeof notifications) {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function handlePasswordChange() {
    if (!password || password !== confirmPassword) {
      pushToast("Passwords do not match");
      return;
    }
    setPassword("");
    setConfirmPassword("");
    pushToast("Password updated successfully");
  }

  function handleResetData() {
    pushToast("Demo data reset successfully");
  }

  function handleExportData() {
    pushToast("Data exported successfully");
  }

  return (
    <PageEntrance>
      <div className="space-y-6">
        <EntranceItem>
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)]">Settings</h1>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              Configure your application preferences
            </p>
          </div>
        </EntranceItem>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EntranceItem>
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
                  <Sun className="w-5 h-5 text-[var(--primary)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--foreground)]">Appearance</h3>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Customize the look and feel
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {theme === "dark" ? (
                      <Moon className="w-4 h-4 text-[var(--muted-foreground)]" />
                    ) : (
                      <Sun className="w-4 h-4 text-[var(--muted-foreground)]" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-[var(--foreground)]">Theme</p>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        Currently: {theme === "dark" ? "Dark" : "Light"}
                      </p>
                    </div>
                  </div>
                  <ToggleSwitch enabled={theme === "dark"} onToggle={toggleTheme} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-[var(--primary)]" />
                    <div>
                      <p className="text-sm font-medium text-[var(--foreground)]">
                        Accent Color
                      </p>
                      <p className="text-xs text-[var(--muted-foreground)]">
                        Primary theme color
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    {[
                      "bg-violet-500",
                      "bg-blue-500",
                      "bg-emerald-500",
                      "bg-amber-500",
                      "bg-rose-500",
                    ].map((color) => (
                      <div
                        key={color}
                        className={cn(
                          "w-6 h-6 rounded-full cursor-pointer border-2 border-transparent hover:border-white/30 transition-colors",
                          color
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </EntranceItem>

          <EntranceItem>
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-[var(--primary)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--foreground)]">Notifications</h3>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Manage notification preferences
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    key: "email" as const,
                    label: "Email Notifications",
                    desc: "Receive order and report updates via email",
                    icon: <Mail className="w-4 h-4" />,
                  },
                  {
                    key: "sms" as const,
                    label: "SMS Notifications",
                    desc: "Get critical alerts via text message",
                    icon: <MessageSquare className="w-4 h-4" />,
                  },
                  {
                    key: "push" as const,
                    label: "Push Notifications",
                    desc: "Real-time browser push notifications",
                    icon: <Smartphone className="w-4 h-4" />,
                  },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-[var(--muted-foreground)]">{item.icon}</div>
                      <div>
                        <p className="text-sm font-medium text-[var(--foreground)]">
                          {item.label}
                        </p>
                        <p className="text-xs text-[var(--muted-foreground)]">{item.desc}</p>
                      </div>
                    </div>
                    <ToggleSwitch
                      enabled={notifications[item.key]}
                      onToggle={() => toggleNotification(item.key)}
                    />
                  </div>
                ))}
              </div>
            </Card>
          </EntranceItem>

          <EntranceItem>
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-[var(--primary)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--foreground)]">Security</h3>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Manage your password and security
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <Field label="New Password">
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </Field>
                <Field label="Confirm Password">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </Field>
                <Button
                  onClick={handlePasswordChange}
                  className="flex items-center gap-2"
                >
                  <Check className="w-4 h-4" /> Update Password
                </Button>
              </div>
            </Card>
          </EntranceItem>

          <EntranceItem>
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
                  <Info className="w-5 h-5 text-[var(--primary)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--foreground)]">About</h3>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Application information
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: "App Name", value: "Cafe Manager Pro" },
                  { label: "Version", value: "2.4.1" },
                  { label: "Build", value: "2026.08.26" },
                  { label: "Runtime", value: "React 19 + TypeScript" },
                  { label: "UI", value: "Tailwind CSS v4" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0"
                  >
                    <span className="text-sm text-[var(--muted-foreground)]">
                      {item.label}
                    </span>
                    <span className="text-sm font-medium text-[var(--foreground)]">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </EntranceItem>
        </div>

        <EntranceItem>
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
                <Database className="w-5 h-5 text-[var(--primary)]" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--foreground)]">Data Management</h3>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Reset or export your application data
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <Button
                variant="ghost"
                onClick={handleExportData}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Export All Data
              </Button>
              <Button
                variant="ghost"
                onClick={handleResetData}
                className="flex items-center gap-2 text-[var(--danger)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/10"
              >
                <Trash2 className="w-4 h-4" /> Reset Demo Data
              </Button>
            </div>
          </Card>
        </EntranceItem>
      </div>
    </PageEntrance>
  );
}
