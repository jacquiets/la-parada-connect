import { Check, X } from "lucide-react";

interface PasswordStrengthProps {
  password?: string;
}

export function PasswordStrength({ password = "" }: PasswordStrengthProps) {
  const requirements = [
    { label: "Mínimo 8 caracteres", met: password.length >= 8 },
    { label: "Al menos una mayúscula", met: /[A-Z]/.test(password) },
    { label: "Al menos una minúscula", met: /[a-z]/.test(password) },
    { label: "Al menos un número", met: /[0-9]/.test(password) },
    { label: "Al menos un símbolo (!@#$%^&*)", met: /[^A-Za-z0-9]/.test(password) },
  ];

  return (
    <div className="mt-2 flex flex-col gap-1 text-xs" data-testid="password-strength">
      {requirements.map((req, idx) => (
        <div
          key={idx}
          className={`flex items-center gap-2 ${req.met ? "text-green-600" : "text-muted-foreground"}`}
          data-testid={`req-${idx}`}
        >
          {req.met ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
          <span>{req.label}</span>
        </div>
      ))}
    </div>
  );
}
