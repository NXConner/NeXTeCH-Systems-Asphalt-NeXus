export interface NavigationLink {
  path: string;
  label: string;
  icon?: string;
  badge?: number;
  description?: string;
}

export interface NavigationSection {
  title: string;
  links: NavigationLink[];
}

export class NavigationService {
  static getMainNavigation(): NavigationSection[] {
    return [
      {
        title: "Core Operations",
        links: [
          {
            path: "/dashboard",
            label: "Dashboard",
            icon: "LayoutDashboard",
            description: "Overview of all operations"
          },
          {
            path: "/jobs",
            label: "Jobs",
            icon: "Briefcase",
            description: "Manage active and scheduled jobs",
            badge: 3
          },
          {
            path: "/fleet",
            label: "Fleet Management",
            icon: "Truck",
            description: "Vehicle tracking and management"
          },
          {
            path: "/scheduling",
            label: "Scheduling",
            icon: "Calendar",
            description: "Schedule jobs and resources"
          }
        ]
      },
      {
        title: "Business Management",
        links: [
          {
            path: "/employee-management",
            label: "Employee Management",
            icon: "Users",
            description: "Comprehensive HR solution"
          },
          {
            path: "/accounting",
            label: "Accounting Platform",
            icon: "FileText",
            description: "Financial management solution"
          },
          {
            path: "/estimates",
            label: "Estimates",
            icon: "Calculator",
            description: "Create and manage project estimates"
          },
          {
            path: "/invoices",
            label: "Invoices",
            icon: "FileText",
            description: "Billing and invoice management",
            badge: 2
          },
          {
            path: "/crm",
            label: "Customer Relations",
            icon: "Users",
            description: "Customer relationship management"
          },
          {
            path: "/financial",
            label: "Financial Management",
            icon: "DollarSign",
            description: "Financial reporting and analysis"
          }
        ]
      },
      {
        title: "Operations & Safety",
        links: [
          {
            path: "/maintenance",
            label: "Maintenance",
            icon: "Wrench",
            description: "Equipment maintenance tracking",
            badge: 1
          },
          {
            path: "/inventory",
            label: "Inventory",
            icon: "Package",
            description: "Materials and parts inventory"
          },
          {
            path: "/safety",
            label: "Safety & Compliance",
            icon: "Shield",
            description: "Safety protocols and compliance"
          },
          {
            path: "/time-tracking",
            label: "Time Tracking",
            icon: "Clock",
            description: "Employee time and attendance"
          }
        ]
      },
      {
        title: "Advanced Features",
        links: [
          {
            path: "/gps",
            label: "Real-Time GPS",
            icon: "MapPin",
            description: "Live vehicle tracking"
          },
          {
            path: "/mapping",
            label: "Advanced Mapping",
            icon: "Map",
            description: "Route optimization and mapping"
          },
          {
            path: "/documents",
            label: "Document Management",
            icon: "FolderOpen",
            description: "Digital document storage"
          }
        ]
      }
    ];
  }

  static getQuickActions(): NavigationLink[] {
    return [
      {
        path: "/jobs?action=new",
        label: "New Job",
        icon: "Plus",
        description: "Create a new job"
      },
      {
        path: "/estimates?action=new",
        label: "New Estimate",
        icon: "Calculator",
        description: "Create project estimate"
      },
      {
        path: "/employee-management?action=new",
        label: "Add Employee",
        icon: "UserPlus",
        description: "Add a new employee"
      },
      {
        path: "/accounting?action=new-invoice",
        label: "Create Invoice",
        icon: "FileText",
        description: "Create a new invoice"
      }
    ];
  }

  static getBreadcrumbs(currentPath: string): NavigationLink[] {
    const pathSegments = currentPath.split('/').filter(Boolean);
    const breadcrumbs: NavigationLink[] = [
      { path: "/dashboard", label: "Dashboard" }
    ];

    let currentFullPath = "";
    for (const segment of pathSegments) {
      currentFullPath += `/${segment}`;
      const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ');
      breadcrumbs.push({
        path: currentFullPath,
        label: label
      });
    }

    return breadcrumbs;
  }
}
