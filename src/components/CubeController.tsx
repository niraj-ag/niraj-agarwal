import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from "react";

/*
 * CubeController — Shared Awareness Context
 *
 * Provides cube interaction state to both the MirrorCube and content components.
 * Keeps the cube decoupled from page-level scroll/hover logic.
 *
 * Systems:
 *   1. Scroll-based active section (IntersectionObserver)
 *   2. Hovered project index (set by ProjectItem components)
 *   3. Hover / Click states (set by cube wrapper)
 *   4. Mobile gyroscope orientation (DeviceOrientationEvent)
 */

export type ActiveSection =
  | "hero"
  | "builder"
  | "work"
  | "chapter"
  | "tools"
  | "beyond"
  | "contact";

interface GyroRotation {
  alpha: number;
  beta: number;
  gamma: number;
}

interface CubeContextValue {
  activeSection: ActiveSection;
  hoveredProjectIndex: number | null;
  setHoveredProjectIndex: (index: number | null) => void;
  isHovered: boolean;
  setIsHovered: (v: boolean) => void;
  isClicked: boolean;
  triggerClick: () => void;
  gyroRotation: GyroRotation | null;
  gyroAvailable: boolean;
  requestGyroPermission: () => void;
}

const CubeContext = createContext<CubeContextValue | null>(null);

export function useCubeContext(): CubeContextValue {
  const ctx = useContext(CubeContext);
  if (!ctx) {
    throw new Error("useCubeContext must be used within a CubeProvider");
  }
  return ctx;
}

// Section IDs to observe — order determines priority (last visible wins)
const SECTION_IDS: ActiveSection[] = [
  "hero",
  "builder",
  "work",
  "chapter",
  "tools",
  "beyond",
  "contact",
];

// Exponential moving average smoothing factor for gyroscope
// 0.18 balances responsiveness with smooth, premium feel
const GYRO_SMOOTHING = 0.18;

export function CubeProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState<ActiveSection>("hero");
  const [hoveredProjectIndex, setHoveredProjectIndex] = useState<number | null>(
    null
  );
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [gyroRotation, setGyroRotation] = useState<GyroRotation | null>(null);
  const [gyroAvailable, setGyroAvailable] = useState(false);

  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const smoothedGyroRef = useRef<GyroRotation>({ alpha: 0, beta: 0, gamma: 0 });
  const gyroBaselineRef = useRef<{ beta: number; gamma: number } | null>(null);
  const gyroListeningRef = useRef(false);
  const gyroPermissionRequestedRef = useRef(false);

  // --- Click with auto-reset ---
  const triggerClick = useCallback(() => {
    setIsClicked(true);
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    clickTimeoutRef.current = setTimeout(() => {
      setIsClicked(false);
      clickTimeoutRef.current = null;
    }, 1000);
  }, []);

  // --- Scroll-based active section via IntersectionObserver ---
  useEffect(() => {
    const visibleSections = new Map<string, boolean>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibleSections.set(entry.target.id, entry.isIntersecting);
        });

        // Pick the last visible section in DOM order
        for (let i = SECTION_IDS.length - 1; i >= 0; i--) {
          const id = SECTION_IDS[i];
          if (visibleSections.get(id)) {
            setActiveSection(id);
            return;
          }
        }
      },
      {
        // Trigger when at least 15% of the section is visible
        threshold: 0.15,
        rootMargin: "-10% 0px -10% 0px",
      }
    );

    // Observe each section element by ID
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, []);

  // --- Gyroscope orientation handler ---
  const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
    if (e.beta === null || e.gamma === null) return;

    // Capture baseline on first valid reading
    // This calibrates to however the user is holding their phone
    if (!gyroBaselineRef.current) {
      gyroBaselineRef.current = { beta: e.beta, gamma: e.gamma };
      smoothedGyroRef.current = { alpha: e.alpha || 0, beta: 0, gamma: 0 };
    }

    setGyroAvailable(true);

    // Compute relative tilt from baseline (how phone was first held)
    const relativeBeta = e.beta - gyroBaselineRef.current.beta;
    const relativeGamma = e.gamma - gyroBaselineRef.current.gamma;

    // Apply exponential moving average smoothing
    const prev = smoothedGyroRef.current;
    smoothedGyroRef.current = {
      alpha: prev.alpha + GYRO_SMOOTHING * ((e.alpha || 0) - prev.alpha),
      beta: prev.beta + GYRO_SMOOTHING * (relativeBeta - prev.beta),
      gamma: prev.gamma + GYRO_SMOOTHING * (relativeGamma - prev.gamma),
    };

    setGyroRotation({ ...smoothedGyroRef.current });
  }, []);

  // --- Start listening for gyro events (non-iOS or after permission) ---
  const startGyroListening = useCallback(() => {
    if (gyroListeningRef.current) return;
    gyroListeningRef.current = true;
    window.addEventListener("deviceorientation", handleOrientation);
  }, [handleOrientation]);

  // --- Request gyro permission (must be called from user gesture for iOS) ---
  const requestGyroPermission = useCallback(() => {
    if (gyroPermissionRequestedRef.current) return;
    gyroPermissionRequestedRef.current = true;

    if (typeof window === "undefined" || !("DeviceOrientationEvent" in window)) {
      return;
    }

    const DOE = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>;
    };

    if (typeof DOE.requestPermission === "function") {
      // iOS 13+ — must be called from a user gesture (tap/click)
      DOE.requestPermission()
        .then((permission) => {
          if (permission === "granted") {
            startGyroListening();
          }
        })
        .catch(() => {
          // Permission denied — fail silently
        });
    } else {
      // Android / non-iOS — just start listening
      startGyroListening();
    }
  }, [startGyroListening]);

  // --- Auto-start gyro on Android (no permission needed) ---
  useEffect(() => {
    if (typeof window === "undefined" || !("DeviceOrientationEvent" in window)) {
      return;
    }

    // Detect mobile
    const isMobileDevice =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || ("ontouchstart" in window && window.innerWidth < 1024);

    if (!isMobileDevice) return;

    const DOE = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>;
    };

    // Only auto-start on non-iOS (Android etc.) — iOS needs user gesture
    if (typeof DOE.requestPermission !== "function") {
      startGyroListening();
    }

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, [startGyroListening, handleOrientation]);

  // Cleanup click timeout on unmount
  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  return (
    <CubeContext.Provider
      value={{
        activeSection,
        hoveredProjectIndex,
        setHoveredProjectIndex,
        isHovered,
        setIsHovered,
        isClicked,
        triggerClick,
        gyroRotation,
        gyroAvailable,
        requestGyroPermission,
      }}
    >
      {children}
    </CubeContext.Provider>
  );
}
