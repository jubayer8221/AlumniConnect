export interface RoleItem {
  roleID: number;
  roleCode: string;
  roleName: string;
  description?: string | null;
  isActive?: boolean;
}

export interface CreateUpdateRoleRequest {
  roleID?: number | null;
  roleCode: string;
  roleName: string;
  description?: string | null;
  isActive: boolean;
}
