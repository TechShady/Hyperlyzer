import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
} from "react";
import type { Timeframe } from "@dynatrace/strato-components/core";

export interface AppTimeframe {
  /** DQL expression or ISO string for the start of the timeframe */
  from: string;
  /** Whether `from` is an ISO datetime ("iso8601") or a DQL expression ("expression") */
  fromType: "expression" | "iso8601";
  /** DQL expression or ISO string for the end of the timeframe */
  to: string;
  /** Whether `to` is an ISO datetime or a DQL expression */
  toType: "expression" | "iso8601";
  /** Original Timeframe object from TimeframeSelector (for the selector value) */
  raw: Timeframe | null;
}

const DEFAULT_FROM = "now()-2h";
const DEFAULT_TO = "now()";

export const DEFAULT_TIMEFRAME: AppTimeframe = {
  from: DEFAULT_FROM,
  fromType: "expression",
  to: DEFAULT_TO,
  toType: "expression",
  raw: null,
};

interface Ctx {
  timeframe: AppTimeframe;
  setTimeframe: (tf: Timeframe | null) => void;
}

const TimeframeContext = createContext<Ctx>({
  timeframe: DEFAULT_TIMEFRAME,
  setTimeframe: () => {
    /* no-op */
  },
});

export const TimeframeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [timeframe, setTimeframeState] = useState<AppTimeframe>(
    DEFAULT_TIMEFRAME,
  );

  const setTimeframe = useCallback((tf: Timeframe | null) => {
    if (!tf) {
      setTimeframeState(DEFAULT_TIMEFRAME);
      return;
    }
    setTimeframeState({
      from: tf.from?.value || DEFAULT_FROM,
      fromType: tf.from?.type || "expression",
      to: tf.to?.value || DEFAULT_TO,
      toType: tf.to?.type || "expression",
      raw: tf,
    });
  }, []);

  const value = useMemo(() => ({ timeframe, setTimeframe }), [
    timeframe,
    setTimeframe,
  ]);

  return (
    <TimeframeContext.Provider value={value}>
      {children}
    </TimeframeContext.Provider>
  );
};

export const useAppTimeframe = (): Ctx => useContext(TimeframeContext);
