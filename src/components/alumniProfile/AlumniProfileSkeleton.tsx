import { Box, Card, CardContent, Skeleton } from "@mui/material";

export default function AlumniProfileSkeleton() {
  return (
    <Box aria-label="Loading alumni profile" aria-busy="true">
      <Skeleton variant="text" width={220} height={44} sx={{ mb: 2 }} />
      <Card sx={{ mb: 3, borderRadius: 3 }}>
        <Skeleton variant="rounded" height={170} />
      </Card>
      {[0, 1, 2].map((section) => (
        <Card key={section} sx={{ mb: 3, borderRadius: 3 }}>
          <CardContent>
            <Skeleton variant="text" width="35%" height={32} />
            <Skeleton variant="text" width="90%" />
            <Skeleton variant="text" width="75%" />
            <Skeleton variant="text" width="82%" />
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
