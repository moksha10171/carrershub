export const WORK_POLICIES = ['Remote', 'Hybrid', 'On-site'] as const;
export const EMPLOYMENT_TYPES = ['Full time', 'Part time', 'Contract'] as const;
export const EXPERIENCE_LEVELS = ['Junior', 'Mid-level', 'Senior'] as const;
export const JOB_TYPES = ['Permanent', 'Temporary', 'Internship'] as const;

export const SECTION_TYPES = [
    { value: 'about', label: 'About Us' },
    { value: 'culture', label: 'Our Culture' },
    { value: 'benefits', label: 'Benefits & Perks' },
    { value: 'values', label: 'Our Values' },
    { value: 'team', label: 'Meet the Team' },
    { value: 'custom', label: 'Custom Section' },
] as const;

export const DEFAULT_COLORS = {
    primary: '#3B82F6',
    secondary: '#2563EB',
    accent: '#10B981',
} as const;

export const SAMPLE_COMPANY = {
    name: 'TechCorp',
    slug: 'techcorp',
    tagline: 'Building the future of technology, together.',
    website: 'https://techcorp.example.com',
} as const;
