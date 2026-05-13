import { useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "hyperlyzer.frontend.name";
const DEFAULT_FRONTEND = "www.angular.easytravel.com";

const readSetting = (): string => {
  if (typeof window === "undefined") return DEFAULT_FRONTEND;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v && v.length > 0 ? v : DEFAULT_FRONTEND;
  } catch {
    return DEFAULT_FRONTEND;
  }
};

export const getFrontendName = readSetting;
export const FRONTEND_DEFAULT = DEFAULT_FRONTEND;

export const useFrontendSetting = (): [string, (v: string) => void] => {
  const [value, setValue] = useState<string>(readSetting);

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setValue(readSetting());
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const update = useCallback((next: string) => {
    const v = (next || "").trim() || DEFAULT_FRONTEND;
    try {
      window.localStorage.setItem(STORAGE_KEY, v);
    } catch {
      // ignore
    }
    setValue(v);
    // notify same-tab listeners
    window.dispatchEvent(
      new StorageEvent("storage", { key: STORAGE_KEY, newValue: v }),
    );
  }, []);

  return [value, update];
};
