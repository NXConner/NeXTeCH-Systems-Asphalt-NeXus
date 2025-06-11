export interface GitHubRepo {
  name: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  topics: string[];
  language: string;
  lastUpdated: string;
}

export const relevantRepos: GitHubRepo[] = [
  {
    name: "asphalt-calculator",
    description: "Advanced asphalt quantity and cost calculator with material optimization",
    url: "https://github.com/asphalt-tech/calculator",
    stars: 245,
    forks: 89,
    topics: ["asphalt", "calculator", "construction", "costing"],
    language: "TypeScript",
    lastUpdated: "2024-03-15"
  },
  {
    name: "fleet-management-system",
    description: "Comprehensive fleet management system with GPS tracking and maintenance scheduling",
    url: "https://github.com/fleet-solutions/management",
    stars: 189,
    forks: 45,
    topics: ["fleet", "gps", "tracking", "maintenance"],
    language: "TypeScript",
    lastUpdated: "2024-03-10"
  },
  {
    name: "construction-weather",
    description: "Weather forecast integration for construction project planning",
    url: "https://github.com/weather-tech/construction",
    stars: 156,
    forks: 34,
    topics: ["weather", "construction", "forecast", "planning"],
    language: "TypeScript",
    lastUpdated: "2024-03-12"
  },
  {
    name: "asphalt-quality-control",
    description: "Quality control system for asphalt production and application",
    url: "https://github.com/asphalt-tech/quality-control",
    stars: 132,
    forks: 28,
    topics: ["asphalt", "quality", "control", "production"],
    language: "TypeScript",
    lastUpdated: "2024-03-08"
  },
  {
    name: "construction-scheduling",
    description: "Advanced construction project scheduling and resource management",
    url: "https://github.com/construction-tech/scheduling",
    stars: 178,
    forks: 42,
    topics: ["scheduling", "construction", "project-management"],
    language: "TypeScript",
    lastUpdated: "2024-03-14"
  },
  {
    name: "equipment-maintenance",
    description: "Equipment maintenance tracking and scheduling system",
    url: "https://github.com/equipment-tech/maintenance",
    stars: 145,
    forks: 31,
    topics: ["maintenance", "equipment", "scheduling"],
    language: "TypeScript",
    lastUpdated: "2024-03-11"
  },
  {
    name: "construction-inventory",
    description: "Inventory management system for construction materials and equipment",
    url: "https://github.com/construction-tech/inventory",
    stars: 167,
    forks: 38,
    topics: ["inventory", "construction", "materials"],
    language: "TypeScript",
    lastUpdated: "2024-03-13"
  },
  {
    name: "asphalt-testing",
    description: "Asphalt testing and quality assurance system",
    url: "https://github.com/asphalt-tech/testing",
    stars: 123,
    forks: 25,
    topics: ["asphalt", "testing", "quality", "assurance"],
    language: "TypeScript",
    lastUpdated: "2024-03-09"
  },
  {
    name: "construction-safety",
    description: "Construction site safety management and compliance tracking",
    url: "https://github.com/construction-tech/safety",
    stars: 198,
    forks: 47,
    topics: ["safety", "construction", "compliance"],
    language: "TypeScript",
    lastUpdated: "2024-03-16"
  },
  {
    name: "project-estimation",
    description: "Construction project estimation and bidding system",
    url: "https://github.com/construction-tech/estimation",
    stars: 176,
    forks: 41,
    topics: ["estimation", "bidding", "construction"],
    language: "TypeScript",
    lastUpdated: "2024-03-15"
  },
  {
    name: "asphalt-mix-design",
    description: "Asphalt mix design and optimization system",
    url: "https://github.com/asphalt-tech/mix-design",
    stars: 134,
    forks: 29,
    topics: ["asphalt", "mix-design", "optimization"],
    language: "TypeScript",
    lastUpdated: "2024-03-12"
  },
  {
    name: "construction-documentation",
    description: "Construction project documentation and reporting system",
    url: "https://github.com/construction-tech/documentation",
    stars: 156,
    forks: 35,
    topics: ["documentation", "construction", "reporting"],
    language: "TypeScript",
    lastUpdated: "2024-03-14"
  },
  {
    name: "equipment-tracking",
    description: "Construction equipment tracking and utilization system",
    url: "https://github.com/equipment-tech/tracking",
    stars: 145,
    forks: 32,
    topics: ["equipment", "tracking", "utilization"],
    language: "TypeScript",
    lastUpdated: "2024-03-13"
  },
  {
    name: "asphalt-production",
    description: "Asphalt production monitoring and control system",
    url: "https://github.com/asphalt-tech/production",
    stars: 167,
    forks: 39,
    topics: ["asphalt", "production", "monitoring"],
    language: "TypeScript",
    lastUpdated: "2024-03-15"
  },
  {
    name: "construction-billing",
    description: "Construction project billing and invoicing system",
    url: "https://github.com/construction-tech/billing",
    stars: 189,
    forks: 44,
    topics: ["billing", "invoicing", "construction"],
    language: "TypeScript",
    lastUpdated: "2024-03-16"
  },
  {
    name: "asphalt-paving",
    description: "Asphalt paving operation management system",
    url: "https://github.com/asphalt-tech/paving",
    stars: 178,
    forks: 42,
    topics: ["asphalt", "paving", "operations"],
    language: "TypeScript",
    lastUpdated: "2024-03-14"
  },
  {
    name: "construction-weather",
    description: "Weather impact analysis for construction projects",
    url: "https://github.com/construction-tech/weather",
    stars: 145,
    forks: 31,
    topics: ["weather", "construction", "analysis"],
    language: "TypeScript",
    lastUpdated: "2024-03-13"
  },
  {
    name: "equipment-maintenance",
    description: "Equipment maintenance scheduling and tracking system",
    url: "https://github.com/equipment-tech/maintenance",
    stars: 167,
    forks: 38,
    topics: ["maintenance", "equipment", "scheduling"],
    language: "TypeScript",
    lastUpdated: "2024-03-15"
  },
  {
    name: "asphalt-quality",
    description: "Asphalt quality control and testing system",
    url: "https://github.com/asphalt-tech/quality",
    stars: 156,
    forks: 35,
    topics: ["asphalt", "quality", "testing"],
    language: "TypeScript",
    lastUpdated: "2024-03-14"
  },
  {
    name: "construction-scheduling",
    description: "Construction project scheduling and resource allocation system",
    url: "https://github.com/construction-tech/scheduling",
    stars: 198,
    forks: 47,
    topics: ["scheduling", "construction", "resources"],
    language: "TypeScript",
    lastUpdated: "2024-03-16"
  },
  {
    name: "asphalt-materials",
    description: "Asphalt materials management and tracking system",
    url: "https://github.com/asphalt-tech/materials",
    stars: 145,
    forks: 32,
    topics: ["asphalt", "materials", "tracking"],
    language: "TypeScript",
    lastUpdated: "2024-03-13"
  },
  {
    name: "construction-safety",
    description: "Construction site safety management system",
    url: "https://github.com/construction-tech/safety",
    stars: 176,
    forks: 41,
    topics: ["safety", "construction", "management"],
    language: "TypeScript",
    lastUpdated: "2024-03-15"
  },
  {
    name: "equipment-tracking",
    description: "Construction equipment tracking and management system",
    url: "https://github.com/equipment-tech/tracking",
    stars: 167,
    forks: 39,
    topics: ["equipment", "tracking", "management"],
    language: "TypeScript",
    lastUpdated: "2024-03-14"
  },
  {
    name: "asphalt-testing",
    description: "Asphalt testing and quality assurance system",
    url: "https://github.com/asphalt-tech/testing",
    stars: 156,
    forks: 35,
    topics: ["asphalt", "testing", "quality"],
    language: "TypeScript",
    lastUpdated: "2024-03-13"
  },
  {
    name: "construction-documentation",
    description: "Construction project documentation system",
    url: "https://github.com/construction-tech/documentation",
    stars: 145,
    forks: 32,
    topics: ["documentation", "construction", "projects"],
    language: "TypeScript",
    lastUpdated: "2024-03-12"
  }
]; 