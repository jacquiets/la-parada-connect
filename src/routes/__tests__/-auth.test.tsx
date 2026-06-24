import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Route } from "../auth";

// Mock the TanStack Router imports
vi.mock("@tanstack/react-router", async (importOriginal) => {
  const mod = await importOriginal<typeof import("@tanstack/react-router")>();
  return {
    ...mod,
    createFileRoute: () => () => {
      // Mock the AuthPage component internally created by createFileRoute
      const { Route } = require("../auth"); // re-import to grab the actual component if needed
      // Actually we just need to return a component that renders AuthPage
      return () => <div>Mocked Route</div>;
    },
    useNavigate: () => vi.fn(),
  };
});

import { PasswordStrength } from "../../components/PasswordStrength";

describe("Componente PasswordStrength", () => {
  it("Debe mostrar todos los requerimientos como no cumplidos si la contraseña está vacía", () => {
    render(<PasswordStrength password="" />);
    
    // Check that all 5 requirements are present
    expect(screen.getByText(/Mínimo 8 caracteres/i)).toBeInTheDocument();
    expect(screen.getByText(/Al menos una mayúscula/i)).toBeInTheDocument();
    expect(screen.getByText(/Al menos una minúscula/i)).toBeInTheDocument();
    expect(screen.getByText(/Al menos un número/i)).toBeInTheDocument();
    expect(screen.getByText(/Al menos un símbolo/i)).toBeInTheDocument();

    // Verify colors/icons imply "not met" (text-muted-foreground class)
    const req0 = screen.getByTestId("req-0");
    expect(req0.className).toContain("text-muted-foreground");
  });

  it("Debe mostrar requerimientos cumplidos según la contraseña", () => {
    const { rerender } = render(<PasswordStrength password="aB1" />);
    
    // length < 8
    expect(screen.getByTestId("req-0").className).toContain("text-muted-foreground");
    // uppercase 'B'
    expect(screen.getByTestId("req-1").className).toContain("text-green-600");
    // lowercase 'a'
    expect(screen.getByTestId("req-2").className).toContain("text-green-600");
    // number '1'
    expect(screen.getByTestId("req-3").className).toContain("text-green-600");
    // no symbol
    expect(screen.getByTestId("req-4").className).toContain("text-muted-foreground");

    // Re-render with full password
    rerender(<PasswordStrength password="aB1!password" />);
    
    expect(screen.getByTestId("req-0").className).toContain("text-green-600");
    expect(screen.getByTestId("req-4").className).toContain("text-green-600");
  });
});
