import React from "react";
import {
  Card,
  Box,
  Typography,
  LinearProgress,
  alpha,
  useTheme,
} from "@mui/material";
import {
  BadgeCheck,
  GraduationCap,
  Calendar,
  MapPin,
  Building2,
} from "lucide-react";
import { CommonAvatar, CommonStatusBadge } from "../common";
import type { AlumniProfileFullModel } from "@/types/alumni";
import { colors } from "@/theme/colors";

const NAVY = colors.darkSurfaceAlt;
const TEAL = colors.accent;

interface AlumniProfileCardProps {
  alumni: AlumniProfileFullModel;
  completion: number;
  missing?: string[];
  isOwner?: boolean;
  isAdmin?: boolean;
}

export default function AlumniProfileCard({
  alumni,
  completion,
}: AlumniProfileCardProps) {
  const theme = useTheme();
  const p = alumni.personalInformation;
  const c = alumni.contactInformation;
  const firstEdu = alumni.academicInformation[0];
  const firstJob = alumni.jobExperience[0];

  const location = c.presentDistrict
    ? `${c.presentDistrict}${c.presentCountry ? `, ${c.presentCountry}` : ""}`
    : undefined;

  const completionColor =
    completion >= 75
      ? theme.palette.success.main
      : completion >= 40
        ? theme.palette.warning.main
        : theme.palette.error.main;

  return (
    <Card
      elevation={0}
      sx={{
        mb: 3,
        overflow: "hidden",
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          position: "relative",
          px: { xs: 2.5, md: 3.5 },
          py: { xs: 2.5, md: 3 },
          background: `linear-gradient(135deg, ${NAVY} 0%, var(--color-dark-surface-blue) 65%, var(--color-dark-surface-deep) 100%)`,
          color: "var(--color-white)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${alpha(TEAL, 0.12)} 0%, transparent 70%)`,
            right: -80,
            top: -100,
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: { xs: 2, md: 2.5 },
          }}
        >
          <Box
            sx={{
              flexShrink: 0,
              width: { xs: 82, md: 104 },
              height: { xs: 82, md: 104 },
              borderRadius: "50%",
              p: 0.5,
              bgcolor: TEAL,
              boxShadow: "0 6px 20px rgba(var(--rgb-black), 0.2)",
            }}
          >
            <CommonAvatar
              src={p.profilePhoto ?? undefined}
              name={p.fullName}
              size={104}
              sx={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                border: `3px solid ${NAVY}`,
              }}
            />
          </Box>

          <Box sx={{ minWidth: 0, flex: 1 }}>
            {firstEdu?.departmentName && (
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: TEAL,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  mb: 0.35,
                }}
              >
                {firstEdu.departmentName}
              </Typography>
            )}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                flexWrap: "wrap",
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "1.35rem", md: "1.65rem" },
                  fontWeight: 800,
                  lineHeight: 1.2,
                  letterSpacing: "-0.02em",
                }}
              >
                {p.fullName}
              </Typography>
              {alumni.isVerified && (
                <BadgeCheck size={20} color={TEAL} strokeWidth={2.5} />
              )}
            </Box>
            {p.nativeName && (
              <Typography
                sx={{
                  mt: 0.35,
                  fontSize: "0.9rem",
                  color: "rgba(var(--rgb-white), 0.72)",
                }}
              >
                {p.nativeName}
              </Typography>
            )}

            {(firstJob?.designation || firstJob?.companyname) && (
              <Typography
                sx={{
                  mt: 0.55,
                  fontSize: "0.88rem",
                  color: "rgba(var(--rgb-white), 0.72)",
                  lineHeight: 1.4,
                }}
              >
                {firstJob?.designation}
                {firstJob?.companyname && (
                  <>
                    {" "}
                    <Box
                      component="span"
                      sx={{ color: "var(--color-white)", fontWeight: 600 }}
                    >
                      at {firstJob.companyname}
                    </Box>
                  </>
                )}
              </Typography>
            )}

            {alumni.status && (
              <Box sx={{ mt: 1 }}>
                <CommonStatusBadge status={alumni.status} />
              </Box>
            )}
          </Box>

          <Box
            sx={{
              display: { xs: "none", sm: "block" },
              width: 145,
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 0.7,
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.72rem",
                  color: "rgba(var(--rgb-white), 0.65)",
                  fontWeight: 500,
                }}
              >
                Profile completion
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: completionColor,
                }}
              >
                {completion}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={completion}
              sx={{
                height: 5,
                borderRadius: 5,
                bgcolor: "rgba(var(--rgb-white), 0.12)",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 5,
                  bgcolor: completionColor,
                },
              }}
            />
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          px: { xs: 2.5, md: 3.5 },
          py: 2,
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 0,
          bgcolor: "background.paper",
        }}
      >
        {firstEdu?.batch && (
          <MetaItem
            icon={<GraduationCap size={16} />}
            label="Batch"
            value={firstEdu.batch}
          />
        )}
        {firstEdu?.graduationYear != null && (
          <MetaItem
            icon={<Calendar size={16} />}
            label="Graduated"
            value={String(firstEdu.graduationYear)}
          />
        )}
        {firstJob?.companyname && (
          <MetaItem
            icon={<Building2 size={16} />}
            label="Organization"
            value={firstJob.companyname}
          />
        )}
        {location && (
          <MetaItem
            icon={<MapPin size={16} />}
            label="Location"
            value={location}
          />
        )}
      </Box>

      <Box sx={{ display: { xs: "block", sm: "none" }, px: 2.5, pb: 2.5 }}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            bgcolor: alpha(completionColor, 0.07),
            border: "1px solid",
            borderColor: alpha(completionColor, 0.15),
          }}
        >
          <Box
            sx={{ display: "flex", justifyContent: "space-between", mb: 0.8 }}
          >
            <Typography sx={{ fontSize: "0.75rem", fontWeight: 600 }}>
              Profile completion
            </Typography>
            <Typography
              sx={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: completionColor,
              }}
            >
              {completion}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={completion}
            sx={{
              height: 5,
              borderRadius: 5,
              bgcolor: alpha(completionColor, 0.12),
              "& .MuiLinearProgress-bar": {
                bgcolor: completionColor,
                borderRadius: 5,
              },
            }}
          />
        </Box>
      </Box>
    </Card>
  );
}

interface MetaItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function MetaItem({ icon, label, value }: MetaItemProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        minWidth: { xs: "50%", md: "auto" },
        pr: { xs: 1.5, md: 3 },
        mr: { xs: 1.5, md: 3 },
        mb: { xs: 1.5, md: 0 },
        borderRight: { xs: "none", md: "1px solid" },
        borderColor: "divider",
        "&:last-child": { borderRight: "none", mr: 0, pr: 0 },
      }}
    >
      <Box
        sx={{
          width: 30,
          height: 30,
          borderRadius: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: alpha(TEAL, 0.1),
          color: TEAL,
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: "0.67rem",
            color: "text.secondary",
            lineHeight: 1.2,
            mb: 0.2,
          }}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            fontSize: "0.8rem",
            fontWeight: 700,
            color: "text.primary",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: { xs: 130, md: 170 },
          }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );
}
