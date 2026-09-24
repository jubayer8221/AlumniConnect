import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { appConfig } from "@/config/appConfig";
import { matchRoute } from "@/config/routeRegistry";
import { useBreadcrumbLabels } from "@/components/common/breadcrumbLabelContext";

export function useDocumentTitle() {
  const location = useLocation();
  const { labels } = useBreadcrumbLabels();

  useEffect(() => {
    const descriptor = matchRoute(location.pathname);
    const label = descriptor?.dynamic
      ? (labels[location.pathname] ?? descriptor.label)
      : (descriptor?.label ?? appConfig.appName);
    document.title = `${label} · ${appConfig.appName}`;
  }, [labels, location.pathname]);
}
