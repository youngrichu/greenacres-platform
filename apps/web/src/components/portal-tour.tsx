"use client";

import { useState, useCallback } from "react";
import {
  GuidedTour,
  RestartTourButton,
  type GuidedTourStep,
} from "@greenacres/ui";

const PORTAL_TOUR_ID = "portal-buyer-v1";

const portalSteps: GuidedTourStep[] = [
  {
    target: '[data-tour="portal-welcome"]',
    title: "Welcome to Your Portal",
    content:
      "This is your buyer dashboard — your central hub for browsing Ethiopian specialty coffees, tracking inquiries, and managing your account.",
    placement: "bottom",
    disableBeacon: true,
  },
  {
    target: '[data-tour="portal-sidebar-nav"]',
    title: "Navigation",
    content:
      "Use the sidebar to navigate between sections: Dashboard overview, Coffee Catalog, your Inquiries, and your Profile settings.",
    placement: "right",
  },
  {
    target: '[data-tour="portal-catalog-action"]',
    title: "Browse the Catalog",
    content:
      "Explore our curated selection of premium Ethiopian coffees with live pricing from Addis Ababa and Italian warehouses.",
    placement: "bottom",
  },
  {
    target: '[data-tour="portal-inquiries-action"]',
    title: "Track Your Inquiries",
    content:
      "View all your submitted inquiries and track their status — from pending review to confirmed and shipped.",
    placement: "bottom",
  },
  {
    target: '[data-tour="portal-inquiry-list"]',
    title: "Inquiry List",
    content:
      "As you browse coffees, add them here to build your inquiry. Submit everything at once when you're ready.",
    placement: "right",
  },
  {
    target: '[data-tour="portal-featured"]',
    title: "Featured Offerings",
    content:
      "Check out our top-rated lots and seasonal highlights. Click any coffee to see full details, cupping scores, and pricing.",
    placement: "top",
  },
  {
    target: '[data-tour="portal-profile-link"]',
    title: "Your Profile",
    content:
      "View and update your company details, contact information, and account preferences here.",
    placement: "right",
  },
];

export function PortalTour() {
  const [key, setKey] = useState(0);

  const handleRestart = useCallback(() => {
    setKey((prev) => prev + 1);
  }, []);

  return (
    <>
      <GuidedTour
        key={key}
        tourId={PORTAL_TOUR_ID}
        steps={portalSteps}
        forceRun={key > 0}
      />
    </>
  );
}

export function PortalRestartTourButton() {
  return (
    <RestartTourButton
      tourId={PORTAL_TOUR_ID}
      onRestart={() => window.location.reload()}
      className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-cream/50 hover:text-gold hover:bg-gold/5 transition-all text-sm border border-dashed border-gold/10 hover:border-gold/30"
    />
  );
}
