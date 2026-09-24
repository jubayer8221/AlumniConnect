import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import { BreadcrumbLabelProvider } from "@/components/common/breadcrumbLabelContext";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

function AuthenticatedContent() {
  useDocumentTitle();

  return (
    <>
      <Breadcrumbs />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 3.5 },
          maxWidth: "100%",
          overflowX: "hidden",
          bgcolor: "background.default",
        }}
      >
        <Outlet />
      </Box>
    </>
  );
}

export default function AppLayout() {
  return (
    <BreadcrumbLabelProvider>
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <Sidebar />
        <MobileSidebar />
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            bgcolor: "background.default",
          }}
        >
          <Header />
          <AuthenticatedContent />
        </Box>
      </Box>
    </BreadcrumbLabelProvider>
  );
}
