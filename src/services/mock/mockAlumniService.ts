import type { AlumniService } from "@/services/interfaces/AlumniService";
import type {
  Alumni,
  CreateAlumniRequest,
  UpdateAlumniRequest,
  AlumniQueryParams,
  AlumniFilters,
} from "@/types/alumni";
import type { PaginatedResponse, ApiResponse } from "@/types/common";
import type { DashboardData } from "@/types/dashboard";
import { localStorageService } from "@/services/storage/localStorageService";
import { STORAGE_KEYS } from "@/services/storage/storageKeys";
import { seedAlumni } from "@/data/seedData";
import { generateAlumniId, generateUUID } from "@/utils/generateId";
import {
  addCredential,
  isUsernameUnique,
} from "@/services/mock/mockAuthService";

function delay(ms = 200): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function ensureAlumni(): Alumni[] {
  let alumni = localStorageService.get<Alumni[]>(STORAGE_KEYS.ALUMNI, []);
  if (alumni.length === 0) {
    alumni = [...seedAlumni];
    localStorageService.set(STORAGE_KEYS.ALUMNI, alumni);
  } else if (!alumni.some((record) => record.alumniId === "ALM-ADMIN")) {
    const adminProfile = seedAlumni.find(
      (record) => record.alumniId === "ALM-ADMIN",
    );
    if (adminProfile) {
      alumni = [adminProfile, ...alumni];
      localStorageService.set(STORAGE_KEYS.ALUMNI, alumni);
    }
  }
  return alumni;
}

function saveAlumni(alumni: Alumni[]): void {
  localStorageService.set(STORAGE_KEYS.ALUMNI, alumni);
}

function matchesFilters(
  alumni: Alumni,
  filters?: AlumniFilters,
  search?: string,
): boolean {
  if (search) {
    const q = search.toLowerCase();
    const searchable = [
      alumni.alumniId,
      alumni.fullName,
      alumni.email,
      alumni.phone,
      alumni.studentId,
      alumni.registrationNumber,
      alumni.companyName,
      alumni.designation,
      alumni.username,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    if (!searchable.includes(q)) return false;
  }
  if (filters) {
    if (filters.programId && alumni.programId !== filters.programId)
      return false;
    if (filters.departmentId && alumni.departmentId !== filters.departmentId)
      return false;
    if (filters.facultyId && alumni.facultyId !== filters.facultyId)
      return false;
    if (filters.admissionYear && alumni.admissionYear !== filters.admissionYear)
      return false;
    if (
      filters.graduationYear &&
      alumni.graduationYear !== filters.graduationYear
    )
      return false;
    if (filters.batch && alumni.batch !== filters.batch) return false;
    if (filters.gender && alumni.gender !== filters.gender) return false;
    if (filters.city && alumni.city !== filters.city) return false;
    if (filters.country && alumni.country !== filters.country) return false;
    if (filters.industry && alumni.industry !== filters.industry) return false;
    if (filters.companyName && alumni.companyName !== filters.companyName)
      return false;
    if (filters.status && alumni.status !== filters.status) return false;
    if (
      filters.isVerified !== undefined &&
      !!alumni.isVerified !== filters.isVerified
    )
      return false;
    if (
      filters.willingToMentor !== undefined &&
      !!alumni.willingToMentor !== filters.willingToMentor
    )
      return false;
  }
  return true;
}

function sortAlumni(
  items: Alumni[],
  sortBy?: string,
  sortDirection?: "asc" | "desc",
): Alumni[] {
  if (!sortBy) return items;
  const dir = sortDirection === "desc" ? -1 : 1;
  return [...items].sort((a, b) => {
    const av = (a as unknown as Record<string, unknown>)[sortBy];
    const bv = (b as unknown as Record<string, unknown>)[sortBy];
    if (av === bv) return 0;
    if (av === undefined || av === null) return 1;
    if (bv === undefined || bv === null) return -1;
    if (typeof av === "number" && typeof bv === "number")
      return (av - bv) * dir;
    return String(av).localeCompare(String(bv)) * dir;
  });
}

export const mockAlumniService: AlumniService = {
  async getAll(params?: AlumniQueryParams): Promise<PaginatedResponse<Alumni>> {
    await delay();
    const all = ensureAlumni();
    const filtered = all.filter((a) =>
      matchesFilters(a, params?.filters, params?.search),
    );
    const sorted = sortAlumni(filtered, params?.sortBy, params?.sortDirection);
    const page = params?.pageNumber || 1;
    const size = params?.pageSize || 10;
    const start = (page - 1) * size;
    const items = sorted.slice(start, start + size);
    return {
      success: true,
      message: "Alumni retrieved successfully",
      data: {
        items,
        totalCount: sorted.length,
        pageNumber: page,
        pageSize: size,
      },
    };
  },

  async getById(id: string): Promise<ApiResponse<Alumni>> {
    await delay();
    const all = ensureAlumni();
    const found = all.find((a) => a.id === id || a.alumniId === id);
    if (!found)
      return {
        success: false,
        message: "Alumni not found",
        data: null as unknown as Alumni,
      };
    return { success: true, message: "Alumni retrieved", data: found };
  },

  async getByAlumniId(alumniId: string): Promise<ApiResponse<Alumni>> {
    return this.getById(alumniId);
  },

  async create(data: CreateAlumniRequest): Promise<ApiResponse<Alumni>> {
    await delay();
    const all = ensureAlumni();
    if (!isUsernameUnique(data.username)) {
      return {
        success: false,
        message: "Username already exists",
        data: null as unknown as Alumni,
      };
    }
    const existingIds = all.map((a) => a.alumniId);
    const alumniId = generateAlumniId(existingIds);
    const now = new Date().toISOString();
    const fullName =
      data.fullName?.trim() ||
      [data.firstName, data.middleName, data.lastName]
        .filter(Boolean)
        .join(" ") ||
      "New Alumni";
    const [firstNamePart, ...remainingNameParts] = fullName.split(/\s+/);
    const lastNamePart = remainingNameParts.length
      ? remainingNameParts[remainingNameParts.length - 1]
      : "";
    const newAlumni: Alumni = {
      id: generateUUID(),
      alumniId,
      userId: generateUUID(),
      username: data.username,
      firstName: firstNamePart || fullName,
      middleName: data.middleName,
      lastName: lastNamePart || fullName,
      fullName,
      nativeName: data.nativeName,
      profilePhoto: data.profilePhoto,
      gender: data.gender,
      dateOfBirth: data.dateOfBirth,
      bloodGroup: data.bloodGroup,
      maritalStatus: data.maritalStatus,
      email: data.email,
      phone: data.phone,
      alternatePhone: data.alternatePhone,
      presentAddress: data.presentAddress,
      presentVillageArea: data.presentVillageArea,
      presentCountry: data.presentCountry,
      presentDivision: data.presentDivision,
      presentDistrict: data.presentDistrict,
      presentThana: data.presentThana,
      presentUnion: data.presentUnion,
      permanentAddress: data.permanentAddress,
      permanentVillageArea: data.permanentVillageArea,
      permanentCountry: data.permanentCountry,
      permanentDivision: data.permanentDivision,
      permanentDistrict: data.permanentDistrict,
      permanentThana: data.permanentThana,
      permanentUnion: data.permanentUnion,
      city: data.city,
      country: data.country,
      studentId: data.studentId,
      registrationNumber: data.registrationNumber,
      programId: data.programId,
      programName: data.programName,
      departmentId: data.departmentId,
      departmentName: data.departmentName,
      facultyId: data.facultyId,
      facultyName: data.facultyName,
      admissionYear: data.admissionYear,
      graduationYear: data.graduationYear,
      graduationSemester: data.graduationSemester,
      batch: data.batch,
      rollNumber: data.rollNumber,
      currentOccupation: data.currentOccupation,
      designation: data.designation,
      companyName: data.companyName,
      industry: data.industry,
      workLocation: data.workLocation,
      skills: data.skills,
      linkedinUrl: data.linkedinUrl,
      facebookUrl: data.facebookUrl,
      websiteUrl: data.websiteUrl,
      bio: data.bio,
      isMentor: data.isMentor,
      willingToMentor: data.willingToMentor,
      isVerified: data.isVerified || false,
      verificationStatus: data.isVerified ? "VERIFIED" : "PENDING",
      status: data.status,
      educationEntries: data.educationEntries,
      privacy: {
        showEmail: true,
        showPhone: true,
        showAddress: false,
        showCompany: true,
        showSocialLinks: true,
        profileVisibility: "PUBLIC",
      },
      createdAt: now,
      updatedAt: now,
    };
    all.push(newAlumni);
    saveAlumni(all);
    addCredential({
      username: data.username,
      password: data.password || "123456",
      role: "ALUMNI",
      alumniId,
      email: data.email,
      displayName: fullName,
    });
    return {
      success: true,
      message: "Alumni created successfully",
      data: newAlumni,
    };
  },

  async update(
    id: string,
    data: UpdateAlumniRequest,
  ): Promise<ApiResponse<Alumni>> {
    await delay();
    const all = ensureAlumni();
    const idx = all.findIndex((a) => a.id === id || a.alumniId === id);
    if (idx === -1)
      return {
        success: false,
        message: "Alumni not found",
        data: null as unknown as Alumni,
      };
    const fullName =
      data.fullName?.trim() ||
      (data.middleName || all[idx].middleName
        ? `${data.firstName || all[idx].firstName} ${data.middleName || all[idx].middleName || ""} ${data.lastName || all[idx].lastName}`
            .replace(/\s+/g, " ")
            .trim()
        : `${data.firstName || all[idx].firstName} ${data.lastName || all[idx].lastName}`);
    const updated: Alumni = {
      ...all[idx],
      ...data,
      fullName,
      nativeName: data.nativeName ?? all[idx].nativeName,
      updatedAt: new Date().toISOString(),
    } as Alumni;
    all[idx] = updated;
    saveAlumni(all);
    return {
      success: true,
      message: "Alumni updated successfully",
      data: updated,
    };
  },

  async delete(id: string): Promise<ApiResponse<null>> {
    await delay();
    const all = ensureAlumni();
    const filtered = all.filter((a) => a.id !== id && a.alumniId !== id);
    if (filtered.length === all.length)
      return { success: false, message: "Alumni not found", data: null };
    saveAlumni(filtered);
    return {
      success: true,
      message: "Alumni deleted successfully",
      data: null,
    };
  },

  async verify(id: string): Promise<ApiResponse<Alumni>> {
    await delay();
    const all = ensureAlumni();
    const idx = all.findIndex((a) => a.id === id || a.alumniId === id);
    if (idx === -1)
      return {
        success: false,
        message: "Alumni not found",
        data: null as unknown as Alumni,
      };
    all[idx].isVerified = true;
    all[idx].verificationStatus = "VERIFIED";
    all[idx].updatedAt = new Date().toISOString();
    saveAlumni(all);
    return {
      success: true,
      message: "Alumni verified successfully",
      data: all[idx],
    };
  },

  async updateStatus(
    id: string,
    status: Alumni["status"],
  ): Promise<ApiResponse<Alumni>> {
    await delay();
    const all = ensureAlumni();
    const idx = all.findIndex((a) => a.id === id || a.alumniId === id);
    if (idx === -1)
      return {
        success: false,
        message: "Alumni not found",
        data: null as unknown as Alumni,
      };
    all[idx].status = status;
    all[idx].updatedAt = new Date().toISOString();
    saveAlumni(all);
    return { success: true, message: "Status updated", data: all[idx] };
  },

  async updatePrivacy(
    id: string,
    privacy: Alumni["privacy"],
  ): Promise<ApiResponse<Alumni>> {
    await delay();
    const all = ensureAlumni();
    const idx = all.findIndex((a) => a.id === id || a.alumniId === id);
    if (idx === -1)
      return {
        success: false,
        message: "Alumni not found",
        data: null as unknown as Alumni,
      };
    all[idx].privacy = privacy;
    all[idx].updatedAt = new Date().toISOString();
    saveAlumni(all);
    return {
      success: true,
      message: "Privacy settings updated",
      data: all[idx],
    };
  },

  async getDashboardData(): Promise<ApiResponse<DashboardData>> {
    await delay(300);
    const all = ensureAlumni();
    const currentYear = new Date().getFullYear();

    const summary = {
      totalAlumni: all.length,
      activeAlumni: all.filter((a) => a.status === "ACTIVE").length,
      inactiveAlumni: all.filter((a) => a.status === "INACTIVE").length,
      pendingAlumni: all.filter((a) => a.status === "PENDING").length,
      verifiedAlumni: all.filter((a) => a.isVerified).length,
      mentors: all.filter((a) => a.isMentor).length,
      newAlumniThisYear: all.filter(
        (a) => new Date(a.createdAt).getFullYear() === currentYear,
      ).length,
      totalEvents: 0,
      upcomingEvents: 0,
      maleAlumni: all.filter((a) => a.gender === "Male").length,
      femaleAlumni: all.filter((a) => a.gender === "Female").length,
      otherAlumni: all.filter((a) => a.gender === "Other" || !a.gender).length,
    };

    const byGradYear: Record<string, number> = {};
    all.forEach((a) => {
      if (a.graduationYear) {
        const k = String(a.graduationYear);
        byGradYear[k] = (byGradYear[k] || 0) + 1;
      }
    });

    const byDept: Record<string, number> = {};
    all.forEach((a) => {
      if (a.departmentName)
        byDept[a.departmentName] = (byDept[a.departmentName] || 0) + 1;
    });

    const byProgram: Record<string, number> = {};
    all.forEach((a) => {
      if (a.programName)
        byProgram[a.programName] = (byProgram[a.programName] || 0) + 1;
    });

    const byLocation: Record<string, number> = {};
    all.forEach((a) => {
      if (a.country) byLocation[a.country] = (byLocation[a.country] || 0) + 1;
    });

    const byIndustry: Record<string, number> = {};
    all.forEach((a) => {
      if (a.industry)
        byIndustry[a.industry] = (byIndustry[a.industry] || 0) + 1;
    });

    const growth: Record<string, number> = {};
    all.forEach((a) => {
      if (a.admissionYear) {
        const k = String(a.admissionYear);
        growth[k] = (growth[k] || 0) + 1;
      }
    });

    const recentAlumni = [...all]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 5)
      .map((a) => ({
        id: a.id,
        fullName: a.fullName,
        alumniId: a.alumniId,
        profilePhoto: a.profilePhoto,
        departmentName: a.departmentName,
        createdAt: a.createdAt,
      }));

    const pendingVerification = all
      .filter((a) => !a.isVerified)
      .slice(0, 5)
      .map((a) => ({
        id: a.id,
        fullName: a.fullName,
        alumniId: a.alumniId,
        profilePhoto: a.profilePhoto,
        email: a.email,
      }));

    const data: DashboardData = {
      summary,
      alumniByGraduationYear: Object.entries(byGradYear)
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => Number(a.label) - Number(b.label)),
      alumniByDepartment: Object.entries(byDept)
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value),
      alumniByProgram: Object.entries(byProgram)
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value),
      alumniByLocation: Object.entries(byLocation)
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value),
      alumniByIndustry: Object.entries(byIndustry)
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value),
      alumniGrowth: Object.entries(growth)
        .map(([year, count]) => ({ year, count }))
        .sort((a, b) => Number(a.year) - Number(b.year)),
      mentorAvailability: {
        mentors: all.filter((a) => a.isMentor).length,
        willing: all.filter((a) => a.willingToMentor).length,
        total: all.length,
      },
      recentAlumni,
      upcomingEvents: [],
      recentNotices: [],
      pendingVerification,
    };

    return { success: true, message: "Dashboard data retrieved", data };
  },
};
