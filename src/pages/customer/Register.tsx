import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, UserPlus, User, Phone } from "lucide-react";
import { PageEntrance, EntranceItem } from "@/components/animations/PageEntrance";
import { TextReveal } from "@/components/animations/TextReveal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/Input";
import { useSessionStore } from "@/stores/sessionStore";

export default function Register() {
  const navigate = useNavigate();
  const login = useSessionStore((s) => s.login);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    login(name, email);
    navigate("/account");
  };

  return (
    <PageEntrance className="min-h-[80vh] flex items-center justify-center px-6 py-24">
      <EntranceItem className="w-full max-w-md">
        <Card className="p-8 sm:p-10">
          <div className="text-center space-y-3 mb-8">
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-[var(--primary)]">
              Create Account
            </p>
            <h1 className="font-display text-4xl font-bold text-[var(--foreground)]">
              <TextReveal text="Join Aurelia" />
            </h1>
            <p className="font-sans text-sm text-[var(--muted-foreground)]">
              Begin your premium coffee journey
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <Field label="Full Name">
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
                <Input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </Field>

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

            <Field label="Phone">
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
                <Input
                  type="tel"
                  placeholder="+91 98000 00000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10"
                />
              </div>
            </Field>

            <Field label="Password">
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
                <Input
                  type={showPw ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                  minLength={6}
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

            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
              By creating an account you agree to our{" "}
              <button type="button" className="text-[var(--primary)] hover:underline">
                Terms
              </button>{" "}
              and{" "}
              <button type="button" className="text-[var(--primary)] hover:underline">
                Privacy Policy
              </button>
              .
            </p>

            <Button type="submit" className="w-full py-3">
              <UserPlus size={16} />
              Create Account
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-[var(--muted-foreground)]">
            Already a member?{" "}
            <Link to="/login" className="text-[var(--primary)] hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </Card>
      </EntranceItem>
    </PageEntrance>
  );
}
