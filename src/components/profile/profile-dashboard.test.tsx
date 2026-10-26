import { render, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProfileDashboard } from "./profile-dashboard";

const replace = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ replace, push: vi.fn() }) }));
vi.mock("@/domains/auth/use-auth-status", () => ({ useAuthStatus: () => ({ authenticated: false, demoSession: false, loading: false }) }));

describe("защищённый кабинет", () => {
  it("перенаправляет гостя на вход", async () => {
    render(<ProfileDashboard />);
    await waitFor(() => expect(replace).toHaveBeenCalledWith("/login?next=/profile"));
  });
});
