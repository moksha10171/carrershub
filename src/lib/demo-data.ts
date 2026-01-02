import sampleJobs from './sample-jobs.json';

// Demo company data for showcase purposes
export const demoCompany = {
    id: 'demo-company-id',
    name: 'TechCorp',
    slug: 'demo',
    logo_url: null,
    banner_url: null,
    website: 'https://techcorp.example.com',
    tagline: 'Building the future of technology',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
};

export const demoSettings = {
    id: 'demo-settings-id',
    company_id: 'demo-company-id',
    primary_color: '#6366F1',
    secondary_color: '#4F46E5',
    accent_color: '#8b5cf6',
    dark_mode_enabled: true,
    culture_video_url: null,
    meta_tags: {},
    updated_at: new Date().toISOString(),
};

export const demoSections = [
    {
        id: 'demo-section-1',
        company_id: 'demo-company-id',
        type: 'about',
        title: 'About TechCorp',
        content: `TechCorp is a leading technology company dedicated to innovation and excellence. We build cutting-edge solutions that empower businesses and individuals worldwide.
        
Our mission is to revolutionize the tech industry through innovative products, exceptional service, and a commitment to sustainability. Join us in shaping the future of technology.`,
        display_order: 1,
        is_visible: true,
        created_at: new Date().toISOString(),
    },
    {
        id: 'demo-section-2',
        company_id: 'demo-company-id',
        type: 'culture',
        title: 'Our Culture',
        content: `At TechCorp, we foster a culture of innovation, collaboration, and continuous learning. Our team members are passionate about technology and dedicated to making a positive impact.

We believe in work-life balance, flexible schedules, and creating an environment where everyone can thrive. Join a team that values your ideas and supports your growth.`,
        display_order: 2,
        is_visible: true,
        created_at: new Date().toISOString(),
    },
    {
        id: 'demo-section-3',
        company_id: 'demo-company-id',
        type: 'benefits',
        title: 'Benefits & Perks',
        content: `We offer comprehensive benefits designed to support your health, wealth, and happiness:

• Competitive salaries and equity packages
• Comprehensive health, dental, and vision insurance
• Flexible work arrangements (remote, hybrid, on-site)
• Generous PTO and parental leave
• Professional development budget
• Modern office spaces with free snacks and drinks
• Team events and offsites
• Cutting-edge technology and tools`,
        display_order: 3,
        is_visible: true,
        created_at: new Date().toISOString(),
    },
    {
        id: 'demo-section-4',
        company_id: 'demo-company-id',
        type: 'values',
        title: 'Our Values',
        content: `**Innovation:** We constantly push boundaries and explore new possibilities.

**Integrity:** We act with honesty and transparency in everything we do.

**Collaboration:** We work together to achieve extraordinary results.

**Excellence:** We strive for the highest quality in our products and services.

**Diversity:** We celebrate differences and create an inclusive environment for all.`,
        display_order: 4,
        is_visible: true,
        created_at: new Date().toISOString(),
    },
];

// Transform sample jobs to match demo company
export const demoJobs = sampleJobs.slice(0, 25).map((job, index) => {
    const now = new Date();
    const postedAt = new Date(now);
    postedAt.setDate(postedAt.getDate() - (job.posted_days_ago || 0));

    return {
        id: `demo-job-${index + 1}`,
        company_id: 'demo-company-id',
        title: job.title,
        slug: job.job_slug,
        work_policy: job.work_policy,
        location: job.location,
        department: job.department,
        employment_type: job.employment_type,
        experience_level: job.experience_level,
        job_type: job.job_type || 'Permanent',
        salary_range: job.salary_range || null,
        description: `<h2>About the Role</h2>
<p>We are looking for a talented <strong>${job.title}</strong> to join our ${job.department} team in ${job.location}.</p>

<h3>What You'll Do</h3>
<ul>
<li>Collaborate with cross-functional teams to deliver exceptional results</li>
<li>Drive innovation and contribute to our product roadmap</li>
<li>Mentor junior team members and share your expertise</li>
<li>Participate in agile development processes</li>
</ul>

<h3>Requirements</h3>
<ul>
<li>${job.experience_level} level experience in relevant field</li>
<li>Strong problem-solving and communication skills</li>
<li>Passion for technology and continuous learning</li>
<li>Ability to work in a ${job.work_policy.toLowerCase()} environment</li>
</ul>

<h3>What We Offer</h3>
<ul>
<li>Competitive salary and equity package</li>
<li>Comprehensive benefits (health, dental, vision)</li>
<li>Flexible work arrangements</li>
<li>Professional development opportunities</li>
<li>Collaborative and inclusive culture</li>
</ul>

<p>Join us in building the future of technology!</p>`,
        is_active: true,
        posted_at: postedAt.toISOString(),
        updated_at: now.toISOString(),
    };
});
