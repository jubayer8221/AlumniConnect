import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type BreadcrumbLabels = Record<string, string>;

interface BreadcrumbLabelContextValue {
  labels: BreadcrumbLabels;
  setBreadcrumbLabel: (path: string, label: string) => void;
  clearBreadcrumbLabel: (path: string) => void;
}

const BreadcrumbLabelContext =
  createContext<BreadcrumbLabelContextValue | null>(null);

export function BreadcrumbLabelProvider({ children }: { children: ReactNode }) {
  const [labels, setLabels] = useState<BreadcrumbLabels>({});
  const setBreadcrumbLabel = useCallback(
    (path: string, label: string) =>
      setLabels((current) => ({ ...current, [path]: label })),
    [],
  );
  const clearBreadcrumbLabel = useCallback(
    (path: string) =>
      setLabels((current) => {
        const next = { ...current };
        delete next[path];
        return next;
      }),
    [],
  );

  const value = useMemo<BreadcrumbLabelContextValue>(
    () => ({
      labels,
      setBreadcrumbLabel,
      clearBreadcrumbLabel,
    }),
    [clearBreadcrumbLabel, labels, setBreadcrumbLabel],
  );

  return (
    <BreadcrumbLabelContext.Provider value={value}>
      {children}
    </BreadcrumbLabelContext.Provider>
  );
}

export function useBreadcrumbLabels() {
  const context = useContext(BreadcrumbLabelContext);
  if (!context) {
    throw new Error(
      "useBreadcrumbLabels must be used inside BreadcrumbLabelProvider",
    );
  }
  return context;
}
