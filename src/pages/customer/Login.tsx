import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, LogIn, User } from "lucide-react";
import { PageEntrance, EntranceItem } from "@/components/animations/PageEntrance";
import { TextReveal } from "@/components/animations/TextReveal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/Input";
import { useSessionStore } from "@/stores/sessionStore";

export default function Login() {
  const navigate = useNavigate();
  const login = useSessionStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const name = email.split("@")[0] || "Guest";
    login(name.charAt(0).toUpperCase() + name.slice(1), email);
    navigate("/account");
  };

  const demoLogin = () => {
    login("Meera Shah", "meera@example.com");
    navigate("/account");
  };

  return (
    <PageEntrance className="min-h-[80vh] flex items-center justify-center px-6 py-24">
      <EntranceItem className="w-full max-w-md">
        <Card className="p-8 sm:p-10">
          <div className="text-center space-y-3 mb-8">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-[var(--primary)]">
              Welcome Back
            </p>
            <h1 className="font-display text-4xl font-bold text-[var(--foreground)]">
              <TextReveal text="Welcome Back" />
            </h1>
            <p className="font-sans text-sm text-[var(--muted-foreground)]">
              Sign in to your Aurelia account
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <Field label="Email">
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </Field>

            <Field label="Password">
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
                <Input
                  type={showPw ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </Field>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-[var(--border)] accent-[var(--primary)]"
                />
                <span className="text-sm text-[var(--muted-foreground)]">Remember me</span>
              </label>
              <button type="button" className="text-sm text-[var(--primary)] hover:underline">
                Forgot password?
              </button>
            </div>

            <Button type="submit" className="w-full py-3">
              <LogIn size={16} />
              Sign In
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border)]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[var(--card)] px-3 text-[var(--muted-foreground)] tracking-widest">
                or
              </span>
            </div>
          </div>

          <Button variant="line" className="w-full py-3" onClick={demoLogin}>
            <User size={16} />
            Login as Customer
          </Button>

          <p className="mt-8 text-center text-sm text-[var(--muted-foreground)]">
            Don't have an account?{" "}
            <Link to="/register" className="text-[var(--primary)] hover:underline font-medium">
              Create one
            </Link>
          </p>
        </Card>
      </EntranceItem>
    </PageEntrance>
  );
}
