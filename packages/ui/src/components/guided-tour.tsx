"use client";

import React, { useState, useEffect, useCallback } from "react";
import Joyride, {
  type Step,
  type CallBackProps,
  type TooltipRenderProps,
  STATUS,
  EVENTS,
  ACTIONS,
} from "react-joyride";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  RotateCcw,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Custom Tooltip                                                     */
/* ------------------------------------------------------------------ */

function GreenAcresTooltip({
  continuous,
  index,
  step,
  backProps,
  closeProps,
  primaryProps,
  skipProps,
  tooltipProps,
  isLastStep,
  size,
}: TooltipRenderProps) {
  return (
    <div
      {...tooltipProps}
      className="guided-tour-tooltip"
      style={{
        maxWidth: 380,
        minWidth: 280,
        background: "rgba(15, 25, 15, 0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(196, 164, 105, 0.25)",
        borderRadius: 16,
        padding: 0,
        boxShadow:
          "0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(196, 164, 105, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)",
        overflow: "hidden",
        fontFamily: "inherit",
      }}
    >
      {/* Progress bar */}
      <div
        style={{
          height: 3,
          background: "rgba(196, 164, 105, 0.1)",
          borderRadius: "16px 16px 0 0",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${((index + 1) / size) * 100}%`,
            background: "linear-gradient(90deg, #c4a469, #d4b87a)",
            borderRadius: 2,
            transition: "width 0.4s ease",
          }}
        />
      </div>

      <div style={{ padding: "20px 24px" }}>
        {/* Header */}
        {step.title && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 600,
                color: "#c4a469",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Sparkles style={{ width: 16, height: 16, opacity: 0.8 }} />
              {step.title}
            </h3>
            <button
              {...closeProps}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 4,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                color: "rgba(245, 240, 230, 0.4)",
              }}
              aria-label="Close tour"
            >
              <X style={{ width: 16, height: 16 }} />
            </button>
          </div>
        )}

        {/* Body */}
        <div
          style={{
            fontSize: 14,
            lineHeight: 1.6,
            color: "rgba(245, 240, 230, 0.7)",
            marginBottom: 16,
          }}
        >
          {step.content}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          {/* Step counter */}
          <span
            style={{
              fontSize: 12,
              color: "rgba(245, 240, 230, 0.3)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {index + 1} / {size}
          </span>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 8 }}>
            {index > 0 && (
              <button
                {...backProps}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "8px 14px",
                  borderRadius: 10,
                  border: "1px solid rgba(196, 164, 105, 0.2)",
                  background: "rgba(196, 164, 105, 0.05)",
                  color: "rgba(245, 240, 230, 0.6)",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <ChevronLeft style={{ width: 14, height: 14 }} />
                Back
              </button>
            )}
            {continuous && (
              <button
                {...primaryProps}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "8px 18px",
                  borderRadius: 10,
                  border: "none",
                  background: "linear-gradient(135deg, #c4a469, #a88b4a)",
                  color: "#0f190f",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  boxShadow: "0 2px 8px rgba(196, 164, 105, 0.3)",
                }}
              >
                {isLastStep ? "Finish" : "Next"}
                {!isLastStep && (
                  <ChevronRight style={{ width: 14, height: 14 }} />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tour Persistence                                                   */
/* ------------------------------------------------------------------ */

function getTourKey(tourId: string) {
  return `greenacres_tour_completed_${tourId}`;
}

function isTourCompleted(tourId: string): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(getTourKey(tourId)) === "true";
}

function markTourCompleted(tourId: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(getTourKey(tourId), "true");
}

function resetTourStorage(tourId: string) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(getTourKey(tourId));
}

/* ------------------------------------------------------------------ */
/*  GuidedTour Component                                               */
/* ------------------------------------------------------------------ */

export interface GuidedTourStep extends Step {}

export interface GuidedTourProps {
  /** Unique ID used for localStorage persistence */
  tourId: string;
  /** Array of Joyride steps */
  steps: GuidedTourStep[];
  /** Called when the tour finishes or is skipped */
  onComplete?: () => void;
  /** If true, the tour will be forced to run regardless of localStorage */
  forceRun?: boolean;
}

export function GuidedTour({
  tourId,
  steps,
  onComplete,
  forceRun = false,
}: GuidedTourProps) {
  const [run, setRun] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Small delay to let the page render target elements first
    const timer = setTimeout(() => {
      if (forceRun || !isTourCompleted(tourId)) {
        setRun(true);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [tourId, forceRun]);

  const handleCallback = useCallback(
    (data: CallBackProps) => {
      const { status, action, type } = data;
      const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

      if (finishedStatuses.includes(status)) {
        setRun(false);
        markTourCompleted(tourId);
        onComplete?.();
      }

      // Handle close button
      if (action === ACTIONS.CLOSE && type === EVENTS.STEP_AFTER) {
        setRun(false);
        markTourCompleted(tourId);
        onComplete?.();
      }
    },
    [tourId, onComplete],
  );

  if (!mounted) return null;

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showSkipButton
      showProgress
      disableOverlayClose
      spotlightPadding={8}
      scrollOffset={100}
      tooltipComponent={GreenAcresTooltip}
      locale={{
        back: "Back",
        close: "Close",
        last: "Finish",
        next: "Next",
        skip: "Skip tour",
      }}
      styles={{
        options: {
          zIndex: 10000,
          arrowColor: "rgba(15, 25, 15, 0.92)",
          overlayColor: "rgba(0, 0, 0, 0.55)",
        },
        spotlight: {
          borderRadius: 12,
          boxShadow:
            "0 0 0 2px rgba(196, 164, 105, 0.4), 0 0 20px rgba(196, 164, 105, 0.15)",
        },
      }}
      floaterProps={{
        styles: {
          arrow: {
            length: 8,
            spread: 14,
          },
        },
        hideArrow: false,
      }}
      callback={handleCallback}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Restart Tour Button                                                */
/* ------------------------------------------------------------------ */

export interface RestartTourButtonProps {
  tourId: string;
  onRestart: () => void;
  className?: string;
}

export function RestartTourButton({
  tourId,
  onRestart,
  className,
}: RestartTourButtonProps) {
  return (
    <button
      onClick={() => {
        resetTourStorage(tourId);
        onRestart();
      }}
      className={className}
      style={
        !className
          ? {
              display: "flex",
              alignItems: "center",
              gap: 8,
              width: "100%",
              padding: "10px 16px",
              borderRadius: 10,
              border: "1px dashed rgba(196, 164, 105, 0.2)",
              background: "transparent",
              color: "rgba(245, 240, 230, 0.5)",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s",
            }
          : undefined
      }
    >
      <RotateCcw style={{ width: 15, height: 15 }} />
      Restart Tour
    </button>
  );
}
