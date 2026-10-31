import {
  Trash2,
  Route,
  Droplets,
  Zap,
  Waves,
  Bus,
  GraduationCap,
  Stethoscope,
  FileText,
} from 'lucide-react';

export const CATEGORIES = [
  {
    key: 'Sanitation',
    label: 'Sanitation and Waste Management',
    department: 'Municipal Sanitation Department',
    icon: Trash2,
  },
  {
    key: 'Roads',
    label: 'Roads and Infrastructure',
    department: 'Roads and Buildings Department',
    icon: Route,
  },
  {
    key: 'Water',
    label: 'Water Supply',
    department: 'Water Supply and Sewerage Board',
    icon: Droplets,
  },
  {
    key: 'Electricity',
    label: 'Electricity and Streetlights',
    department: 'Electricity Distribution Company',
    icon: Zap,
  },
  {
    key: 'Drainage',
    label: 'Drainage',
    department: 'Municipal Drainage Division',
    icon: Waves,
  },
  {
    key: 'Transportation',
    label: 'Public Transportation',
    department: 'State Road Transport Corporation',
    icon: Bus,
  },
  {
    key: 'Education',
    label: 'Education and Scholarships',
    department: 'Department of School Education',
    icon: GraduationCap,
  },
  {
    key: 'Health',
    label: 'Public Health Facilities',
    department: 'Public Health and Family Welfare Department',
    icon: Stethoscope,
  },
  {
    key: 'Other',
    label: 'Other Public Services',
    department: 'District Collectorate — Grievance Cell',
    icon: FileText,
  },
];

export const STATUSES = [
  'Submitted',
  'Under Review',
  'Assigned',
  'In Progress',
  'Resolved',
  'Closed',
];

export const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

export const CLOSED_STATUSES = ['Resolved', 'Closed'];

export function categoryByLabel(label) {
  return CATEGORIES.find((c) => c.label === label || c.key === label) || CATEGORIES[8];
}

export function departmentFor(label) {
  return categoryByLabel(label).department;
}

export const statusStyles = {
  Submitted: 'bg-secondary text-secondary-foreground border-transparent',
  'Under Review': 'bg-amber-50 text-amber-800 border-amber-200',
  Assigned: 'bg-sky-50 text-sky-800 border-sky-200',
  'In Progress': 'bg-accent/10 text-accent border-accent/25',
  Resolved: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  Closed: 'bg-muted text-muted-foreground border-border',
};

export const priorityStyles = {
  Low: 'text-muted-foreground',
  Medium: 'text-amber-700',
  High: 'text-orange-700',
  Critical: 'text-red-700',
};

export function createGrievanceId() {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `JSA-${year}-${random}`;
}

export function historySteps(grievance, t) {
  const history = Array.isArray(grievance?.history) ? grievance.history.filter((entry) => entry?.status) : [];
  const entries = [...history];

  if (!entries.length) {
    entries.push({ status: grievance?.status || 'Submitted', date: grievance?.created_date });
  } else if (entries[entries.length - 1].status !== grievance?.status) {
    entries.push({ status: grievance?.status });
  }

  return entries.map((entry, index) => ({
    label: t(`status.${entry.status}`),
    done: true,
    note: entry.note || '',
    date: formatDate(entry.date),
    active: index === entries.length - 1,
  }));
}

export function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}