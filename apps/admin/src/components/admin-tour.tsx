"use client";

import { useState, useCallback } from "react";
import {
  GuidedTour,
  RestartTourButton,
  type GuidedTourStep,
} from "@greenacres/ui";

const ADMIN_TOUR_ID = "admin-dashboard-v1";

const adminSteps: GuidedTourStep[] = [
  {
    target: '[data-tour="admin-welcome"]',
    title: "Welcome, Admin",
    content:
      "This is your command center for managing the Green Acres coffee platform — users, products, pricing, and inquiries.",
    placement: "bottom",
    disableBeacon: true,
  },
  {
    target: '[data-tour="admin-sidebar-nav"]',
    title: "Navigation",
    content:
      "Access all management sections from the sidebar: Overview, Prices, Products, Users, and Inquiries.",
    placement: "right",
  },
  {
    target: '[data-tour="admin-nav-users"]',
    title: "User Management",
    content:
      "Approve or reject new buyer registrations, manage existing accounts, and control access to the platform.",
    placement: "right",
  },
  {
    target: '[data-tour="admin-nav-products"]',
    title: "Product Catalog",
    content:
      "Add, edit, or archive coffee products. Manage origin details, processing methods, and cupping scores.",
    placement: "right",
  },
  {
    target: '[data-tour="admin-nav-prices"]',
    title: "Price Management",
    content:
      "Update live pricing for each warehouse location — Addis Ababa, Port Trieste, and Port Genoa.",
    placement: "right",
  },
  {
    target: '[data-tour="admin-nav-inquiries"]',
    title: "Inquiry Management",
    content:
      "Review and respond to buyer inquiries. Track status from submission through to completion.",
    placement: "right",
  },
  {
    target: '[data-tour="admin-stats"]',
    title: "Dashboard Overview",
    content:
      "Monitor key metrics at a glance — total users, pending approvals, product count, and inquiry volumes.",
    placement: "bottom",
  },
];

export function AdminTour() {
  const [key, setKey] = useState(0);

  const handleRestart = useCallback(() => {
    setKey((prev) => prev + 1);
  }, []);

  return (
    <>
      <GuidedTour
        key={key}
        tourId={ADMIN_TOUR_ID}
        steps={adminSteps}
        forceRun={key > 0}
      />
    </>
  );
}

export function AdminRestartTourButton() {
  return (
    <RestartTourButton
      tourId={ADMIN_TOUR_ID}
      onRestart={() => window.location.reload()}
      className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-cream/50 hover:text-gold hover:bg-gold/5 transition-all text-sm border border-dashed border-gold/10 hover:border-gold/30"
    />
  );
}
