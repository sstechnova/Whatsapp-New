export type Permission =
  | 'manage_users'
  | 'manage_roles'
  | 'manage_organizations'
  | 'manage_billing'
  | 'manage_settings'
  | 'view_reports'
  | 'manage_templates'
  | 'manage_campaigns'
  | 'manage_integrations'
  | 'view_assigned_users'
  | 'use_templates'
  | 'send_messages';

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
  description: string;
}

export const defaultRoles: Record<string, Role> = {
  super_admin: {
    id: '1',
    name: 'Super Admin',
    permissions: [
      'manage_users',
      'manage_roles',
      'manage_organizations',
      'manage_billing',
      'manage_settings',
      'view_reports',
      'manage_templates',
      'manage_campaigns',
      'manage_integrations'
    ],
    description: 'Full system access with all permissions'
  },
  admin: {
    id: '2',
    name: 'Admin',
    permissions: [
      'manage_users',
      'view_reports',
      'manage_templates',
      'manage_campaigns'
    ],
    description: 'Administrative access with user management'
  },
  agent: {
    id: '3',
    name: 'Agent',
    permissions: [
      'view_assigned_users',
      'view_reports',
      'use_templates',
      'send_messages'
    ],
    description: 'Basic agent access with assigned user management'
  }
};

export function hasPermission(userRole: string, permission: Permission): boolean {
  const role = defaultRoles[userRole];
  if (!role) return false;
  return role.permissions.includes(permission);
}

export function canManageUser(currentUserRole: string, targetUserRole: string): boolean {
  // Super admin can manage everyone
  if (currentUserRole === 'super_admin') return true;
  
  // Admin can manage agents but not other admins or super admins
  if (currentUserRole === 'admin') {
    return targetUserRole === 'agent';
  }
  
  // Agents can't manage anyone
  return false;
}

export function getPermissionDescription(permission: Permission): string {
  const descriptions: Record<Permission, string> = {
    manage_users: 'Create, edit, and delete users',
    manage_roles: 'Manage user roles and permissions',
    manage_organizations: 'Manage organization settings and structure',
    manage_billing: 'Handle billing and subscription management',
    manage_settings: 'Configure system and application settings',
    view_reports: 'Access analytics and reporting dashboards',
    manage_templates: 'Create and manage message templates',
    manage_campaigns: 'Create and manage marketing campaigns',
    manage_integrations: 'Configure and manage system integrations',
    view_assigned_users: 'View and interact with assigned users',
    use_templates: 'Use existing message templates',
    send_messages: 'Send messages to users'
  };
  
  return descriptions[permission];
}