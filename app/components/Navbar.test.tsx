import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navbar from "./Navbar";

describe("Navbar", () => {
  it("renders the brand link to /", () => {
    render(<Navbar />);
    const brandLink = screen.getByRole("link", { name: /bóthar/i });
    expect(brandLink).toHaveAttribute("href", "/");
  });

  it("starts with the mobile menu collapsed (aria-expanded=false)", () => {
    render(<Navbar />);
    const toggle = screen.getByRole("button", {
      name: /toggle navigation menu/i,
    });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("does not render the mobile menu before it is opened", () => {
    render(<Navbar />);
    // The mobile dropdown contains "About" and "How it works" as plain links.
    // Before opening, only the desktop nav (hidden via md:flex) renders them
    // — so we shouldn't see them duplicated.
    const aboutLinks = screen.getAllByRole("link", { name: /^about$/i });
    expect(aboutLinks).toHaveLength(1);
  });

  it("opens the mobile menu when the hamburger is clicked", async () => {
    const user = userEvent.setup();
    render(<Navbar />);
    const toggle = screen.getByRole("button", {
      name: /toggle navigation menu/i,
    });

    await user.click(toggle);

    expect(toggle).toHaveAttribute("aria-expanded", "true");
    // After opening, About appears in both the desktop nav and the mobile dropdown.
    const aboutLinks = screen.getAllByRole("link", { name: /^about$/i });
    expect(aboutLinks).toHaveLength(2);
  });

  it("closes the mobile menu when the hamburger is clicked again", async () => {
    const user = userEvent.setup();
    render(<Navbar />);
    const toggle = screen.getByRole("button", {
      name: /toggle navigation menu/i,
    });

    await user.click(toggle); // open
    await user.click(toggle); // close

    expect(toggle).toHaveAttribute("aria-expanded", "false");
    const aboutLinks = screen.getAllByRole("link", { name: /^about$/i });
    expect(aboutLinks).toHaveLength(1);
  });

  it("closes the mobile menu when a link inside it is clicked", async () => {
    const user = userEvent.setup();
    render(<Navbar />);
    const toggle = screen.getByRole("button", {
      name: /toggle navigation menu/i,
    });

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");

    // Find the About link inside the mobile dropdown specifically — it's the
    // second occurrence (the first is the always-mounted desktop nav).
    const aboutLinks = screen.getAllByRole("link", { name: /^about$/i });
    const mobileAboutLink = aboutLinks[1];
    await user.click(mobileAboutLink);

    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("links the mobile 'Find a lift' CTA to /signin?role=passenger", async () => {
    const user = userEvent.setup();
    render(<Navbar />);
    const toggle = screen.getByRole("button", {
      name: /toggle navigation menu/i,
    });
    await user.click(toggle);

    // Both desktop and mobile render the CTA — verify both point to the right place.
    const findLiftLinks = screen.getAllByRole("link", { name: /find a lift/i });
    expect(findLiftLinks.length).toBeGreaterThanOrEqual(1);
    for (const link of findLiftLinks) {
      expect(link).toHaveAttribute("href", "/signin?role=passenger");
    }
  });

  it("the hamburger button meets the 44×44px touch-target minimum", () => {
    render(<Navbar />);
    const toggle = screen.getByRole("button", {
      name: /toggle navigation menu/i,
    });
    // h-11 w-11 in Tailwind = 44px × 44px (2.75rem at default 16px root).
    expect(toggle.className).toMatch(/\bh-11\b/);
    expect(toggle.className).toMatch(/\bw-11\b/);
  });

  it("contains exactly one instance of the brand mark", () => {
    const { container } = render(<Navbar />);
    const brandSection = within(container).getByRole("link", {
      name: /bóthar/i,
    });
    expect(brandSection).toBeInTheDocument();
  });
});
