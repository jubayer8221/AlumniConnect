import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { appConfig } from "@/config/appConfig";
// import { labelForSegment, isDynamicSegment } from "@/config/navigation";
import { useBreadcrumbLabels } from "@/components/common/breadcrumbLabelContext";
import { isDynamicSegment, labelForSegment } from "@/config/navigation";

export function useDocumentTitle() {
  const location = useLocation();
  const { labels } = useBreadcrumbLabels();

  useEffect(() => {
    const pathname = location.pathname;

    // Home / dashboard roots → just the app name.
    if (
      pathname === "/" ||
      pathname === "/dashboard" ||
      pathname === "/alumni/dashboard"
    ) {
      document.title = appConfig.appName;
      return;
    }

    const segments = pathname.split("/").filter(Boolean);
    const last = segments[segments.length - 1] ?? "";

    const label = isDynamicSegment(last)
      ? (labels[pathname] ?? "Details")
      : labelForSegment(last);

    document.title = `${label} · ${appConfig.appName}`;
  }, [labels, location.pathname]);
}
