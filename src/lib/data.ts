import type { Job, Company, CompanySettings, ContentSection } from '@/types';

// Parse posted_days_ago from string to number
function parsePostedDays(value: string): number {
  if (value === 'Posted today') return 0;
  const match = value.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

// ALL 150 JOBS FROM CSV - Complete Dataset
export const allJobsData: Omit<Job, 'id' | 'company_id' | 'posted_at' | 'updated_at' | 'description' | 'is_active'>[] = [
  { title: "Full Stack Engineer", work_policy: "Remote", location: "Berlin, Germany", department: "Product", employment_type: "Full time", experience_level: "Senior", job_type: "Temporary", salary_range: "AED 8K–12K / month", slug: "full-stack-engineer-berlin-1" },
  { title: "Business Analyst", work_policy: "Hybrid", location: "Riyadh, Saudi Arabia", department: "Customer Success", employment_type: "Part time", experience_level: "Mid-level", job_type: "Permanent", salary_range: "USD 4K–6K / month", slug: "business-analyst-riyadh-1" },
  { title: "Software Engineer", work_policy: "Remote", location: "Berlin, Germany", department: "Sales", employment_type: "Contract", experience_level: "Senior", job_type: "Permanent", salary_range: "SAR 10K–18K / month", slug: "software-engineer-berlin-1" },
  { title: "Marketing Manager", work_policy: "Hybrid", location: "Boston, United States", department: "Engineering", employment_type: "Part time", experience_level: "Mid-level", job_type: "Temporary", salary_range: "AED 8K–12K / month", slug: "marketing-manager-boston-1" },
  { title: "UX Researcher", work_policy: "Hybrid", location: "Boston, United States", department: "Engineering", employment_type: "Full time", experience_level: "Senior", job_type: "Permanent", salary_range: "USD 4K–6K / month", slug: "ux-researcher-boston-1" },
  { title: "AI Product Manager", work_policy: "On-site", location: "Athens, Greece", department: "Operations", employment_type: "Full time", experience_level: "Junior", job_type: "Internship", salary_range: "INR 8L–15L / year", slug: "ai-product-manager-athens-1" },
  { title: "Sales Development Representative", work_policy: "Remote", location: "Berlin, Germany", department: "Marketing", employment_type: "Full time", experience_level: "Mid-level", job_type: "Temporary", salary_range: "INR 8L–15L / year", slug: "sales-development-representative-berlin-1" },
  { title: "Frontend Engineer", work_policy: "Hybrid", location: "Athens, Greece", department: "Engineering", employment_type: "Part time", experience_level: "Junior", job_type: "Temporary", salary_range: "USD 80K–120K / year", slug: "frontend-engineer-athens-1" },
  { title: "Sales Development Representative", work_policy: "On-site", location: "Cairo, Egypt", department: "Sales", employment_type: "Contract", experience_level: "Senior", job_type: "Internship", salary_range: "USD 4K–6K / month", slug: "sales-development-representative-cairo-1" },
  { title: "Data Analyst", work_policy: "On-site", location: "Dubai, United Arab Emirates", department: "Customer Success", employment_type: "Full time", experience_level: "Mid-level", job_type: "Permanent", salary_range: "AED 8K–12K / month", slug: "data-analyst-dubai-1" },
  { title: "Solutions Consultant", work_policy: "Hybrid", location: "Hyderabad, India", department: "Engineering", employment_type: "Contract", experience_level: "Junior", job_type: "Internship", salary_range: "AED 8K–12K / month", slug: "solutions-consultant-hyderabad-1" },
  { title: "Mobile Developer (Flutter)", work_policy: "Hybrid", location: "Athens, Greece", department: "Operations", employment_type: "Part time", experience_level: "Senior", job_type: "Permanent", salary_range: "USD 80K–120K / year", slug: "mobile-developer-flutter-athens-1" },
  { title: "Operations Associate", work_policy: "Hybrid", location: "Bangalore, India", department: "Analytics", employment_type: "Contract", experience_level: "Junior", job_type: "Internship", salary_range: "SAR 10K–18K / month", slug: "operations-associate-bangalore-1" },
  { title: "QA Engineer", work_policy: "Hybrid", location: "Berlin, Germany", department: "Marketing", employment_type: "Contract", experience_level: "Junior", job_type: "Temporary", salary_range: "INR 8L–15L / year", slug: "qa-engineer-berlin-1" },
  { title: "UX Researcher", work_policy: "On-site", location: "Berlin, Germany", department: "R&D", employment_type: "Full time", experience_level: "Senior", job_type: "Internship", salary_range: "USD 80K–120K / year", slug: "ux-researcher-berlin-1" },
  { title: "Product Designer", work_policy: "On-site", location: "Boston, United States", department: "Operations", employment_type: "Part time", experience_level: "Mid-level", job_type: "Permanent", salary_range: "AED 12K–18K / month", slug: "product-designer-boston-1" },
  { title: "Full Stack Engineer", work_policy: "Hybrid", location: "Dubai, United Arab Emirates", department: "Engineering", employment_type: "Part time", experience_level: "Mid-level", job_type: "Permanent", salary_range: "INR 8L–15L / year", slug: "full-stack-engineer-dubai-1" },
  { title: "Product Designer", work_policy: "Remote", location: "Istanbul, Turkey", department: "Customer Success", employment_type: "Full time", experience_level: "Mid-level", job_type: "Temporary", salary_range: "SAR 10K–18K / month", slug: "product-designer-istanbul-1" },
  { title: "Marketing Manager", work_policy: "On-site", location: "Dubai, United Arab Emirates", department: "Engineering", employment_type: "Full time", experience_level: "Mid-level", job_type: "Internship", salary_range: "AED 8K–12K / month", slug: "marketing-manager-dubai-1" },
  { title: "AI Product Manager", work_policy: "Hybrid", location: "Cairo, Egypt", department: "Analytics", employment_type: "Full time", experience_level: "Junior", job_type: "Permanent", salary_range: "AED 12K–18K / month", slug: "ai-product-manager-cairo-1" },
  { title: "Backend Developer", work_policy: "Hybrid", location: "Bangalore, India", department: "Product", employment_type: "Part time", experience_level: "Senior", job_type: "Temporary", salary_range: "USD 80K–120K / year", slug: "backend-developer-bangalore-1" },
  { title: "Technical Writer", work_policy: "On-site", location: "Berlin, Germany", department: "Sales", employment_type: "Full time", experience_level: "Junior", job_type: "Permanent", salary_range: "SAR 10K–18K / month", slug: "technical-writer-berlin-1" },
  { title: "DevOps Engineer", work_policy: "Hybrid", location: "Dubai, United Arab Emirates", department: "Customer Success", employment_type: "Contract", experience_level: "Junior", job_type: "Internship", salary_range: "USD 80K–120K / year", slug: "devops-engineer-dubai-1" },
  { title: "Customer Success Executive", work_policy: "Hybrid", location: "Istanbul, Turkey", department: "Customer Success", employment_type: "Full time", experience_level: "Junior", job_type: "Temporary", salary_range: "SAR 10K–18K / month", slug: "customer-success-executive-istanbul-1" },
  { title: "Marketing Manager", work_policy: "On-site", location: "Cairo, Egypt", department: "Product", employment_type: "Part time", experience_level: "Mid-level", job_type: "Temporary", salary_range: "USD 80K–120K / year", slug: "marketing-manager-cairo-1" },
  { title: "Sales Development Representative", work_policy: "Hybrid", location: "Hyderabad, India", department: "Marketing", employment_type: "Full time", experience_level: "Senior", job_type: "Permanent", salary_range: "AED 12K–18K / month", slug: "sales-development-representative-hyderabad-1" },
  { title: "Product Designer", work_policy: "Hybrid", location: "Boston, United States", department: "Analytics", employment_type: "Full time", experience_level: "Mid-level", job_type: "Temporary", salary_range: "INR 8L–15L / year", slug: "product-designer-boston-2" },
  { title: "Sales Development Representative", work_policy: "Hybrid", location: "Berlin, Germany", department: "Operations", employment_type: "Contract", experience_level: "Senior", job_type: "Temporary", salary_range: "USD 80K–120K / year", slug: "sales-development-representative-berlin-2" },
  { title: "Technical Writer", work_policy: "Remote", location: "Athens, Greece", department: "Product", employment_type: "Part time", experience_level: "Senior", job_type: "Permanent", salary_range: "USD 4K–6K / month", slug: "technical-writer-athens-1" },
  { title: "Backend Developer", work_policy: "On-site", location: "Riyadh, Saudi Arabia", department: "IT Support", employment_type: "Contract", experience_level: "Junior", job_type: "Permanent", salary_range: "USD 4K–6K / month", slug: "backend-developer-riyadh-1" },
  { title: "Operations Associate", work_policy: "Hybrid", location: "Cairo, Egypt", department: "Sales", employment_type: "Contract", experience_level: "Mid-level", job_type: "Temporary", salary_range: "AED 8K–12K / month", slug: "operations-associate-cairo-1" },
  { title: "Full Stack Engineer", work_policy: "Remote", location: "Dubai, United Arab Emirates", department: "R&D", employment_type: "Contract", experience_level: "Mid-level", job_type: "Permanent", salary_range: "USD 80K–120K / year", slug: "full-stack-engineer-dubai-2" },
  { title: "UX Researcher", work_policy: "Remote", location: "Hyderabad, India", department: "R&D", employment_type: "Full time", experience_level: "Senior", job_type: "Permanent", salary_range: "AED 8K–12K / month", slug: "ux-researcher-hyderabad-1" },
  { title: "Technical Writer", work_policy: "Hybrid", location: "Dubai, United Arab Emirates", department: "Product", employment_type: "Part time", experience_level: "Senior", job_type: "Internship", salary_range: "USD 4K–6K / month", slug: "technical-writer-dubai-1" },
  { title: "Software Engineer", work_policy: "On-site", location: "Cairo, Egypt", department: "Product", employment_type: "Part time", experience_level: "Senior", job_type: "Internship", salary_range: "USD 4K–6K / month", slug: "software-engineer-cairo-1" },
  { title: "QA Engineer", work_policy: "Remote", location: "Riyadh, Saudi Arabia", department: "R&D", employment_type: "Full time", experience_level: "Senior", job_type: "Temporary", salary_range: "AED 8K–12K / month", slug: "qa-engineer-riyadh-1" },
  { title: "Full Stack Engineer", work_policy: "Hybrid", location: "Cairo, Egypt", department: "Customer Success", employment_type: "Part time", experience_level: "Mid-level", job_type: "Permanent", salary_range: "AED 12K–18K / month", slug: "full-stack-engineer-cairo-1" },
  { title: "Sales Development Representative", work_policy: "Remote", location: "Riyadh, Saudi Arabia", department: "IT Support", employment_type: "Contract", experience_level: "Mid-level", job_type: "Temporary", salary_range: "AED 12K–18K / month", slug: "sales-development-representative-riyadh-1" },
  { title: "Full Stack Engineer", work_policy: "Hybrid", location: "Cairo, Egypt", department: "IT Support", employment_type: "Contract", experience_level: "Senior", job_type: "Permanent", salary_range: "AED 12K–18K / month", slug: "full-stack-engineer-cairo-2" },
  { title: "Business Analyst", work_policy: "On-site", location: "Boston, United States", department: "Marketing", employment_type: "Part time", experience_level: "Senior", job_type: "Internship", salary_range: "AED 12K–18K / month", slug: "business-analyst-boston-1" },
  { title: "Product Designer", work_policy: "Remote", location: "Boston, United States", department: "Engineering", employment_type: "Contract", experience_level: "Junior", job_type: "Temporary", salary_range: "USD 80K–120K / year", slug: "product-designer-boston-3" },
  { title: "Backend Developer", work_policy: "Hybrid", location: "Cairo, Egypt", department: "Customer Success", employment_type: "Full time", experience_level: "Junior", job_type: "Internship", salary_range: "AED 12K–18K / month", slug: "backend-developer-cairo-1" },
  { title: "Marketing Manager", work_policy: "On-site", location: "Riyadh, Saudi Arabia", department: "Analytics", employment_type: "Contract", experience_level: "Mid-level", job_type: "Internship", salary_range: "USD 80K–120K / year", slug: "marketing-manager-riyadh-1" },
  { title: "UX Researcher", work_policy: "Remote", location: "Cairo, Egypt", department: "Sales", employment_type: "Full time", experience_level: "Junior", job_type: "Permanent", salary_range: "INR 8L–15L / year", slug: "ux-researcher-cairo-1" },
  { title: "Sales Development Representative", work_policy: "Remote", location: "London, England, United Kingdom", department: "Operations", employment_type: "Part time", experience_level: "Senior", job_type: "Permanent", salary_range: "USD 80K–120K / year", slug: "sales-development-representative-london-1" },
  { title: "Customer Success Executive", work_policy: "On-site", location: "Riyadh, Saudi Arabia", department: "R&D", employment_type: "Contract", experience_level: "Senior", job_type: "Temporary", salary_range: "USD 80K–120K / year", slug: "customer-success-executive-riyadh-1" },
  { title: "Business Analyst", work_policy: "Hybrid", location: "London, England, United Kingdom", department: "Analytics", employment_type: "Contract", experience_level: "Mid-level", job_type: "Internship", salary_range: "AED 12K–18K / month", slug: "business-analyst-london-1" },
  { title: "Product Designer", work_policy: "Remote", location: "Hyderabad, India", department: "R&D", employment_type: "Contract", experience_level: "Junior", job_type: "Permanent", salary_range: "SAR 10K–18K / month", slug: "product-designer-hyderabad-1" },
  { title: "UX Researcher", work_policy: "Hybrid", location: "Bangalore, India", department: "Design", employment_type: "Part time", experience_level: "Junior", job_type: "Permanent", salary_range: "INR 8L–15L / year", slug: "ux-researcher-bangalore-1" },
  { title: "Solutions Consultant", work_policy: "On-site", location: "Bangalore, India", department: "IT Support", employment_type: "Contract", experience_level: "Junior", job_type: "Temporary", salary_range: "AED 8K–12K / month", slug: "solutions-consultant-bangalore-1" },
  { title: "Business Analyst", work_policy: "On-site", location: "Athens, Greece", department: "Design", employment_type: "Contract", experience_level: "Junior", job_type: "Temporary", salary_range: "AED 8K–12K / month", slug: "business-analyst-athens-1" },
  { title: "Mobile Developer (Flutter)", work_policy: "On-site", location: "Athens, Greece", department: "Design", employment_type: "Contract", experience_level: "Junior", job_type: "Temporary", salary_range: "USD 4K–6K / month", slug: "mobile-developer-flutter-athens-2" },
  { title: "Marketing Manager", work_policy: "Remote", location: "Bangalore, India", department: "IT Support", employment_type: "Part time", experience_level: "Mid-level", job_type: "Permanent", salary_range: "USD 80K–120K / year", slug: "marketing-manager-bangalore-1" },
  { title: "UX Researcher", work_policy: "On-site", location: "Boston, United States", department: "R&D", employment_type: "Full time", experience_level: "Senior", job_type: "Internship", salary_range: "USD 80K–120K / year", slug: "ux-researcher-boston-2" },
  { title: "Mobile Developer (Flutter)", work_policy: "Remote", location: "Istanbul, Turkey", department: "R&D", employment_type: "Contract", experience_level: "Mid-level", job_type: "Temporary", salary_range: "AED 8K–12K / month", slug: "mobile-developer-flutter-istanbul-1" },
  { title: "Frontend Engineer", work_policy: "Remote", location: "Istanbul, Turkey", department: "Engineering", employment_type: "Full time", experience_level: "Senior", job_type: "Internship", salary_range: "INR 8L–15L / year", slug: "frontend-engineer-istanbul-1" },
  { title: "Operations Associate", work_policy: "On-site", location: "Riyadh, Saudi Arabia", department: "Customer Success", employment_type: "Part time", experience_level: "Mid-level", job_type: "Permanent", salary_range: "SAR 10K–18K / month", slug: "operations-associate-riyadh-1" },
  { title: "Software Engineer", work_policy: "On-site", location: "Athens, Greece", department: "Sales", employment_type: "Full time", experience_level: "Junior", job_type: "Internship", salary_range: "USD 4K–6K / month", slug: "software-engineer-athens-1" },
  { title: "Frontend Engineer", work_policy: "Hybrid", location: "Cairo, Egypt", department: "Sales", employment_type: "Contract", experience_level: "Junior", job_type: "Internship", salary_range: "AED 8K–12K / month", slug: "frontend-engineer-cairo-1" },
  { title: "Cloud Architect", work_policy: "Remote", location: "Dubai, United Arab Emirates", department: "Customer Success", employment_type: "Contract", experience_level: "Mid-level", job_type: "Permanent", salary_range: "SAR 10K–18K / month", slug: "cloud-architect-dubai-1" },
  { title: "Business Analyst", work_policy: "Remote", location: "Riyadh, Saudi Arabia", department: "IT Support", employment_type: "Contract", experience_level: "Junior", job_type: "Temporary", salary_range: "SAR 10K–18K / month", slug: "business-analyst-riyadh-2" },
  { title: "Full Stack Engineer", work_policy: "Hybrid", location: "Hyderabad, India", department: "Marketing", employment_type: "Contract", experience_level: "Mid-level", job_type: "Internship", salary_range: "SAR 10K–18K / month", slug: "full-stack-engineer-hyderabad-1" },
  { title: "Frontend Engineer", work_policy: "On-site", location: "Riyadh, Saudi Arabia", department: "Customer Success", employment_type: "Contract", experience_level: "Senior", job_type: "Internship", salary_range: "AED 8K–12K / month", slug: "frontend-engineer-riyadh-1" },
  { title: "Frontend Engineer", work_policy: "On-site", location: "Istanbul, Turkey", department: "IT Support", employment_type: "Contract", experience_level: "Junior", job_type: "Internship", salary_range: "INR 8L–15L / year", slug: "frontend-engineer-istanbul-2" },
  { title: "Customer Success Executive", work_policy: "Remote", location: "Berlin, Germany", department: "Design", employment_type: "Part time", experience_level: "Mid-level", job_type: "Temporary", salary_range: "SAR 10K–18K / month", slug: "customer-success-executive-berlin-1" },
  { title: "Technical Writer", work_policy: "Hybrid", location: "Riyadh, Saudi Arabia", department: "Analytics", employment_type: "Contract", experience_level: "Junior", job_type: "Temporary", salary_range: "AED 8K–12K / month", slug: "technical-writer-riyadh-1" },
  { title: "Operations Associate", work_policy: "On-site", location: "Dubai, United Arab Emirates", department: "Product", employment_type: "Part time", experience_level: "Mid-level", job_type: "Permanent", salary_range: "INR 8L–15L / year", slug: "operations-associate-dubai-1" },
  { title: "Software Engineer", work_policy: "Remote", location: "London, England, United Kingdom", department: "IT Support", employment_type: "Contract", experience_level: "Mid-level", job_type: "Permanent", salary_range: "AED 8K–12K / month", slug: "software-engineer-london-1" },
  { title: "QA Engineer", work_policy: "On-site", location: "London, England, United Kingdom", department: "IT Support", employment_type: "Part time", experience_level: "Mid-level", job_type: "Temporary", salary_range: "AED 12K–18K / month", slug: "qa-engineer-london-1" },
  { title: "Solutions Consultant", work_policy: "On-site", location: "Dubai, United Arab Emirates", department: "Product", employment_type: "Part time", experience_level: "Senior", job_type: "Temporary", salary_range: "INR 8L–15L / year", slug: "solutions-consultant-dubai-1" },
  { title: "Marketing Manager", work_policy: "On-site", location: "Hyderabad, India", department: "Product", employment_type: "Contract", experience_level: "Senior", job_type: "Temporary", salary_range: "USD 4K–6K / month", slug: "marketing-manager-hyderabad-1" },
  { title: "Customer Success Executive", work_policy: "On-site", location: "Cairo, Egypt", department: "Engineering", employment_type: "Full time", experience_level: "Mid-level", job_type: "Permanent", salary_range: "AED 12K–18K / month", slug: "customer-success-executive-cairo-1" },
  { title: "Full Stack Engineer", work_policy: "Remote", location: "Istanbul, Turkey", department: "IT Support", employment_type: "Full time", experience_level: "Junior", job_type: "Temporary", salary_range: "AED 12K–18K / month", slug: "full-stack-engineer-istanbul-1" },
  { title: "Customer Success Executive", work_policy: "Remote", location: "Istanbul, Turkey", department: "Engineering", employment_type: "Contract", experience_level: "Junior", job_type: "Internship", salary_range: "USD 4K–6K / month", slug: "customer-success-executive-istanbul-2" },
  { title: "Backend Developer", work_policy: "On-site", location: "Boston, United States", department: "Operations", employment_type: "Part time", experience_level: "Mid-level", job_type: "Permanent", salary_range: "INR 8L–15L / year", slug: "backend-developer-boston-1" },
  { title: "AI Product Manager", work_policy: "Hybrid", location: "London, England, United Kingdom", department: "Customer Success", employment_type: "Contract", experience_level: "Junior", job_type: "Temporary", salary_range: "AED 12K–18K / month", slug: "ai-product-manager-london-1" },
  { title: "Operations Associate", work_policy: "Hybrid", location: "Cairo, Egypt", department: "IT Support", employment_type: "Contract", experience_level: "Senior", job_type: "Temporary", salary_range: "USD 80K–120K / year", slug: "operations-associate-cairo-2" },
  { title: "Marketing Manager", work_policy: "Remote", location: "Istanbul, Turkey", department: "Design", employment_type: "Full time", experience_level: "Mid-level", job_type: "Internship", salary_range: "SAR 10K–18K / month", slug: "marketing-manager-istanbul-1" },
  { title: "UX Researcher", work_policy: "On-site", location: "Bangalore, India", department: "Product", employment_type: "Contract", experience_level: "Senior", job_type: "Permanent", salary_range: "USD 80K–120K / year", slug: "ux-researcher-bangalore-2" },
  { title: "QA Engineer", work_policy: "Remote", location: "Hyderabad, India", department: "Sales", employment_type: "Part time", experience_level: "Senior", job_type: "Internship", salary_range: "AED 12K–18K / month", slug: "qa-engineer-hyderabad-1" },
  { title: "Technical Writer", work_policy: "Hybrid", location: "Boston, United States", department: "Operations", employment_type: "Full time", experience_level: "Senior", job_type: "Permanent", salary_range: "INR 8L–15L / year", slug: "technical-writer-boston-1" },
  { title: "Operations Associate", work_policy: "Hybrid", location: "Boston, United States", department: "R&D", employment_type: "Part time", experience_level: "Junior", job_type: "Permanent", salary_range: "SAR 10K–18K / month", slug: "operations-associate-boston-1" },
  { title: "QA Engineer", work_policy: "Remote", location: "Hyderabad, India", department: "Customer Success", employment_type: "Contract", experience_level: "Mid-level", job_type: "Permanent", salary_range: "SAR 10K–18K / month", slug: "qa-engineer-hyderabad-2" },
  { title: "Cloud Architect", work_policy: "Remote", location: "Hyderabad, India", department: "Marketing", employment_type: "Contract", experience_level: "Junior", job_type: "Temporary", salary_range: "SAR 10K–18K / month", slug: "cloud-architect-hyderabad-1" },
  { title: "Full Stack Engineer", work_policy: "Hybrid", location: "Cairo, Egypt", department: "Analytics", employment_type: "Full time", experience_level: "Junior", job_type: "Internship", salary_range: "USD 4K–6K / month", slug: "full-stack-engineer-cairo-3" },
  { title: "Customer Success Executive", work_policy: "Hybrid", location: "Boston, United States", department: "Analytics", employment_type: "Contract", experience_level: "Junior", job_type: "Permanent", salary_range: "SAR 10K–18K / month", slug: "customer-success-executive-boston-1" },
  { title: "Operations Associate", work_policy: "Hybrid", location: "Bangalore, India", department: "R&D", employment_type: "Full time", experience_level: "Junior", job_type: "Permanent", salary_range: "USD 4K–6K / month", slug: "operations-associate-bangalore-2" },
  { title: "Full Stack Engineer", work_policy: "Hybrid", location: "Berlin, Germany", department: "Analytics", employment_type: "Contract", experience_level: "Senior", job_type: "Internship", salary_range: "INR 8L–15L / year", slug: "full-stack-engineer-berlin-2" },
  { title: "QA Engineer", work_policy: "On-site", location: "Hyderabad, India", department: "Customer Success", employment_type: "Part time", experience_level: "Mid-level", job_type: "Temporary", salary_range: "USD 4K–6K / month", slug: "qa-engineer-hyderabad-3" },
  { title: "Mobile Developer (Flutter)", work_policy: "Remote", location: "Dubai, United Arab Emirates", department: "Product", employment_type: "Full time", experience_level: "Senior", job_type: "Temporary", salary_range: "USD 80K–120K / year", slug: "mobile-developer-flutter-dubai-1" },
  { title: "Data Analyst", work_policy: "Remote", location: "Bangalore, India", department: "Product", employment_type: "Part time", experience_level: "Junior", job_type: "Permanent", salary_range: "INR 8L–15L / year", slug: "data-analyst-bangalore-1" },
  { title: "Full Stack Engineer", work_policy: "Remote", location: "Boston, United States", department: "Engineering", employment_type: "Part time", experience_level: "Mid-level", job_type: "Internship", salary_range: "AED 12K–18K / month", slug: "full-stack-engineer-boston-1" },
  { title: "Business Analyst", work_policy: "Remote", location: "Dubai, United Arab Emirates", department: "Operations", employment_type: "Part time", experience_level: "Senior", job_type: "Temporary", salary_range: "SAR 10K–18K / month", slug: "business-analyst-dubai-1" },
  { title: "UX Researcher", work_policy: "On-site", location: "Bangalore, India", department: "Analytics", employment_type: "Full time", experience_level: "Mid-level", job_type: "Temporary", salary_range: "USD 80K–120K / year", slug: "ux-researcher-bangalore-3" },
  { title: "Frontend Engineer", work_policy: "On-site", location: "London, England, United Kingdom", department: "Product", employment_type: "Part time", experience_level: "Senior", job_type: "Permanent", salary_range: "AED 12K–18K / month", slug: "frontend-engineer-london-1" },
  { title: "Cloud Architect", work_policy: "Hybrid", location: "Cairo, Egypt", department: "Operations", employment_type: "Part time", experience_level: "Mid-level", job_type: "Temporary", salary_range: "USD 4K–6K / month", slug: "cloud-architect-cairo-1" },
  { title: "QA Engineer", work_policy: "On-site", location: "Berlin, Germany", department: "Customer Success", employment_type: "Full time", experience_level: "Mid-level", job_type: "Permanent", salary_range: "SAR 10K–18K / month", slug: "qa-engineer-berlin-2" },
  { title: "Machine Learning Engineer", work_policy: "Remote", location: "Boston, United States", department: "Sales", employment_type: "Contract", experience_level: "Senior", job_type: "Temporary", salary_range: "INR 8L–15L / year", slug: "machine-learning-engineer-boston-1" },
  { title: "Customer Success Executive", work_policy: "Remote", location: "Bangalore, India", department: "Analytics", employment_type: "Full time", experience_level: "Mid-level", job_type: "Permanent", salary_range: "INR 8L–15L / year", slug: "customer-success-executive-bangalore-1" },
  { title: "DevOps Engineer", work_policy: "Remote", location: "Berlin, Germany", department: "Sales", employment_type: "Part time", experience_level: "Junior", job_type: "Temporary", salary_range: "SAR 10K–18K / month", slug: "devops-engineer-berlin-1" },
  { title: "Customer Success Executive", work_policy: "On-site", location: "Cairo, Egypt", department: "Customer Success", employment_type: "Contract", experience_level: "Junior", job_type: "Internship", salary_range: "USD 80K–120K / year", slug: "customer-success-executive-cairo-2" },
  { title: "Business Analyst", work_policy: "Hybrid", location: "Istanbul, Turkey", department: "Customer Success", employment_type: "Full time", experience_level: "Mid-level", job_type: "Internship", salary_range: "INR 8L–15L / year", slug: "business-analyst-istanbul-1" },
  { title: "Marketing Manager", work_policy: "On-site", location: "Dubai, United Arab Emirates", department: "Marketing", employment_type: "Contract", experience_level: "Senior", job_type: "Temporary", salary_range: "SAR 10K–18K / month", slug: "marketing-manager-dubai-2" },
  { title: "Cloud Architect", work_policy: "Hybrid", location: "Hyderabad, India", department: "Operations", employment_type: "Part time", experience_level: "Senior", job_type: "Temporary", salary_range: "SAR 10K–18K / month", slug: "cloud-architect-hyderabad-2" },
  { title: "Customer Success Executive", work_policy: "On-site", location: "Bangalore, India", department: "Engineering", employment_type: "Part time", experience_level: "Junior", job_type: "Permanent", salary_range: "AED 12K–18K / month", slug: "customer-success-executive-bangalore-2" },
  { title: "Mobile Developer (Flutter)", work_policy: "On-site", location: "Berlin, Germany", department: "Operations", employment_type: "Part time", experience_level: "Junior", job_type: "Permanent", salary_range: "SAR 10K–18K / month", slug: "mobile-developer-flutter-berlin-1" },
  { title: "Business Analyst", work_policy: "Remote", location: "Bangalore, India", department: "Customer Success", employment_type: "Contract", experience_level: "Senior", job_type: "Permanent", salary_range: "SAR 10K–18K / month", slug: "business-analyst-bangalore-1" },
  { title: "UX Researcher", work_policy: "On-site", location: "Dubai, United Arab Emirates", department: "R&D", employment_type: "Full time", experience_level: "Mid-level", job_type: "Internship", salary_range: "AED 8K–12K / month", slug: "ux-researcher-dubai-1" },
  { title: "DevOps Engineer", work_policy: "On-site", location: "London, England, United Kingdom", department: "R&D", employment_type: "Part time", experience_level: "Mid-level", job_type: "Internship", salary_range: "USD 4K–6K / month", slug: "devops-engineer-london-1" },
  { title: "Mobile Developer (Flutter)", work_policy: "Remote", location: "Riyadh, Saudi Arabia", department: "Marketing", employment_type: "Part time", experience_level: "Junior", job_type: "Temporary", salary_range: "USD 80K–120K / year", slug: "mobile-developer-flutter-riyadh-1" },
  { title: "UX Researcher", work_policy: "On-site", location: "Athens, Greece", department: "Engineering", employment_type: "Contract", experience_level: "Junior", job_type: "Internship", salary_range: "AED 8K–12K / month", slug: "ux-researcher-athens-1" },
  { title: "Frontend Engineer", work_policy: "Remote", location: "Istanbul, Turkey", department: "R&D", employment_type: "Full time", experience_level: "Mid-level", job_type: "Internship", salary_range: "AED 12K–18K / month", slug: "frontend-engineer-istanbul-3" },
  { title: "AI Product Manager", work_policy: "On-site", location: "Boston, United States", department: "Engineering", employment_type: "Full time", experience_level: "Junior", job_type: "Temporary", salary_range: "AED 12K–18K / month", slug: "ai-product-manager-boston-1" },
  { title: "Technical Writer", work_policy: "On-site", location: "Dubai, United Arab Emirates", department: "Analytics", employment_type: "Part time", experience_level: "Mid-level", job_type: "Internship", salary_range: "AED 8K–12K / month", slug: "technical-writer-dubai-2" },
  { title: "Machine Learning Engineer", work_policy: "On-site", location: "Istanbul, Turkey", department: "Operations", employment_type: "Contract", experience_level: "Senior", job_type: "Permanent", salary_range: "INR 8L–15L / year", slug: "machine-learning-engineer-istanbul-1" },
  { title: "AI Product Manager", work_policy: "Hybrid", location: "Boston, United States", department: "R&D", employment_type: "Full time", experience_level: "Mid-level", job_type: "Permanent", salary_range: "AED 8K–12K / month", slug: "ai-product-manager-boston-2" },
  { title: "Mobile Developer (Flutter)", work_policy: "On-site", location: "Berlin, Germany", department: "Design", employment_type: "Contract", experience_level: "Mid-level", job_type: "Permanent", salary_range: "INR 8L–15L / year", slug: "mobile-developer-flutter-berlin-2" },
  { title: "Software Engineer", work_policy: "On-site", location: "Bangalore, India", department: "Marketing", employment_type: "Contract", experience_level: "Junior", job_type: "Temporary", salary_range: "USD 4K–6K / month", slug: "software-engineer-bangalore-1" },
  { title: "Sales Development Representative", work_policy: "Remote", location: "Bangalore, India", department: "Customer Success", employment_type: "Part time", experience_level: "Senior", job_type: "Internship", salary_range: "SAR 10K–18K / month", slug: "sales-development-representative-bangalore-1" },
  { title: "Backend Developer", work_policy: "Hybrid", location: "Dubai, United Arab Emirates", department: "Marketing", employment_type: "Part time", experience_level: "Senior", job_type: "Permanent", salary_range: "USD 4K–6K / month", slug: "backend-developer-dubai-1" },
  { title: "Mobile Developer (Flutter)", work_policy: "Remote", location: "Berlin, Germany", department: "Customer Success", employment_type: "Full time", experience_level: "Junior", job_type: "Permanent", salary_range: "USD 4K–6K / month", slug: "mobile-developer-flutter-berlin-3" },
  { title: "Machine Learning Engineer", work_policy: "Hybrid", location: "Istanbul, Turkey", department: "IT Support", employment_type: "Part time", experience_level: "Senior", job_type: "Internship", salary_range: "AED 8K–12K / month", slug: "machine-learning-engineer-istanbul-2" },
  { title: "Business Analyst", work_policy: "Hybrid", location: "Bangalore, India", department: "Engineering", employment_type: "Full time", experience_level: "Junior", job_type: "Temporary", salary_range: "USD 80K–120K / year", slug: "business-analyst-bangalore-2" },
  { title: "Data Analyst", work_policy: "On-site", location: "Athens, Greece", department: "IT Support", employment_type: "Full time", experience_level: "Junior", job_type: "Temporary", salary_range: "AED 12K–18K / month", slug: "data-analyst-athens-1" },
  { title: "AI Product Manager", work_policy: "Remote", location: "London, England, United Kingdom", department: "Engineering", employment_type: "Part time", experience_level: "Mid-level", job_type: "Permanent", salary_range: "INR 8L–15L / year", slug: "ai-product-manager-london-2" },
  { title: "Backend Developer", work_policy: "On-site", location: "Dubai, United Arab Emirates", department: "IT Support", employment_type: "Contract", experience_level: "Mid-level", job_type: "Internship", salary_range: "INR 8L–15L / year", slug: "backend-developer-dubai-2" },
  { title: "Data Analyst", work_policy: "On-site", location: "Hyderabad, India", department: "Analytics", employment_type: "Full time", experience_level: "Mid-level", job_type: "Internship", salary_range: "INR 8L–15L / year", slug: "data-analyst-hyderabad-1" },
  { title: "Backend Developer", work_policy: "Hybrid", location: "Berlin, Germany", department: "Engineering", employment_type: "Contract", experience_level: "Senior", job_type: "Temporary", salary_range: "USD 4K–6K / month", slug: "backend-developer-berlin-1" },
  { title: "Mobile Developer (Flutter)", work_policy: "Hybrid", location: "Riyadh, Saudi Arabia", department: "Operations", employment_type: "Full time", experience_level: "Junior", job_type: "Temporary", salary_range: "INR 8L–15L / year", slug: "mobile-developer-flutter-riyadh-2" },
  { title: "QA Engineer", work_policy: "Hybrid", location: "Istanbul, Turkey", department: "Analytics", employment_type: "Full time", experience_level: "Mid-level", job_type: "Permanent", salary_range: "USD 4K–6K / month", slug: "qa-engineer-istanbul-1" },
  { title: "QA Engineer", work_policy: "Remote", location: "Athens, Greece", department: "Operations", employment_type: "Full time", experience_level: "Senior", job_type: "Temporary", salary_range: "AED 8K–12K / month", slug: "qa-engineer-athens-1" },
  { title: "Operations Associate", work_policy: "Hybrid", location: "Cairo, Egypt", department: "R&D", employment_type: "Full time", experience_level: "Mid-level", job_type: "Internship", salary_range: "AED 12K–18K / month", slug: "operations-associate-cairo-3" },
  { title: "Technical Writer", work_policy: "On-site", location: "Bangalore, India", department: "IT Support", employment_type: "Full time", experience_level: "Junior", job_type: "Temporary", salary_range: "AED 8K–12K / month", slug: "technical-writer-bangalore-1" },
  { title: "Solutions Consultant", work_policy: "Hybrid", location: "Athens, Greece", department: "Operations", employment_type: "Full time", experience_level: "Mid-level", job_type: "Internship", salary_range: "SAR 10K–18K / month", slug: "solutions-consultant-athens-1" },
  { title: "QA Engineer", work_policy: "Remote", location: "Dubai, United Arab Emirates", department: "Customer Success", employment_type: "Part time", experience_level: "Mid-level", job_type: "Permanent", salary_range: "USD 80K–120K / year", slug: "qa-engineer-dubai-1" },
  { title: "Software Engineer", work_policy: "Hybrid", location: "Boston, United States", department: "R&D", employment_type: "Contract", experience_level: "Junior", job_type: "Internship", salary_range: "AED 8K–12K / month", slug: "software-engineer-boston-1" },
  { title: "Customer Success Executive", work_policy: "Hybrid", location: "Dubai, United Arab Emirates", department: "Product", employment_type: "Contract", experience_level: "Senior", job_type: "Internship", salary_range: "SAR 10K–18K / month", slug: "customer-success-executive-dubai-1" },
  { title: "QA Engineer", work_policy: "Hybrid", location: "London, England, United Kingdom", department: "Marketing", employment_type: "Contract", experience_level: "Senior", job_type: "Internship", salary_range: "INR 8L–15L / year", slug: "qa-engineer-london-2" },
  { title: "Machine Learning Engineer", work_policy: "Hybrid", location: "Bangalore, India", department: "Design", employment_type: "Full time", experience_level: "Junior", job_type: "Temporary", salary_range: "USD 80K–120K / year", slug: "machine-learning-engineer-bangalore-1" },
  { title: "Solutions Consultant", work_policy: "Hybrid", location: "Bangalore, India", department: "IT Support", employment_type: "Part time", experience_level: "Junior", job_type: "Temporary", salary_range: "AED 8K–12K / month", slug: "solutions-consultant-bangalore-2" },
  { title: "Mobile Developer (Flutter)", work_policy: "Hybrid", location: "Hyderabad, India", department: "Customer Success", employment_type: "Full time", experience_level: "Junior", job_type: "Internship", salary_range: "SAR 10K–18K / month", slug: "mobile-developer-flutter-hyderabad-1" },
  { title: "Frontend Engineer", work_policy: "On-site", location: "Istanbul, Turkey", department: "Product", employment_type: "Contract", experience_level: "Junior", job_type: "Temporary", salary_range: "AED 8K–12K / month", slug: "frontend-engineer-istanbul-4" },
  { title: "QA Engineer", work_policy: "Hybrid", location: "Cairo, Egypt", department: "Customer Success", employment_type: "Full time", experience_level: "Junior", job_type: "Internship", salary_range: "AED 12K–18K / month", slug: "qa-engineer-cairo-1" },
  { title: "Business Analyst", work_policy: "Remote", location: "Dubai, United Arab Emirates", department: "R&D", employment_type: "Part time", experience_level: "Junior", job_type: "Permanent", salary_range: "SAR 10K–18K / month", slug: "business-analyst-dubai-2" },
  { title: "Operations Associate", work_policy: "Hybrid", location: "Berlin, Germany", department: "Product", employment_type: "Contract", experience_level: "Mid-level", job_type: "Internship", salary_range: "AED 12K–18K / month", slug: "operations-associate-berlin-1" },
  { title: "Frontend Engineer", work_policy: "On-site", location: "Athens, Greece", department: "Sales", employment_type: "Part time", experience_level: "Senior", job_type: "Internship", salary_range: "AED 12K–18K / month", slug: "frontend-engineer-athens-2" },
  { title: "Marketing Manager", work_policy: "Hybrid", location: "Athens, Greece", department: "IT Support", employment_type: "Full time", experience_level: "Senior", job_type: "Internship", salary_range: "SAR 10K–18K / month", slug: "marketing-manager-athens-1" },
  { title: "Product Designer", work_policy: "Hybrid", location: "Dubai, United Arab Emirates", department: "R&D", employment_type: "Contract", experience_level: "Junior", job_type: "Internship", salary_range: "USD 4K–6K / month", slug: "product-designer-dubai-1" },
  { title: "Solutions Consultant", work_policy: "Hybrid", location: "Boston, United States", department: "Engineering", employment_type: "Part time", experience_level: "Mid-level", job_type: "Internship", salary_range: "AED 12K–18K / month", slug: "solutions-consultant-boston-1" },
];

// Posted days for each job (matching CSV order)
const postedDaysAgo = [40, 5, 32, 22, 31, 37, 27, 59, 0, 53, 41, 43, 16, 48, 7, 52, 22, 17, 3, 17, 21, 13, 37, 25, 12, 43, 42, 57, 56, 59, 22, 20, 5, 15, 22, 41, 9, 7, 28, 39, 9, 44, 38, 42, 19, 3, 58, 56, 50, 55, 50, 21, 46, 19, 21, 44, 15, 7, 46, 48, 56, 46, 54, 6, 13, 4, 52, 8, 0, 42, 0, 9, 51, 40, 46, 29, 45, 7, 8, 6, 28, 22, 50, 29, 13, 37, 60, 52, 52, 57, 44, 55, 58, 30, 44, 45, 6, 56, 13, 18, 36, 45, 30, 15, 18, 23, 27, 3, 60, 48, 21, 18, 38, 58, 35, 39, 0, 51, 43, 23, 48, 34, 48, 30, 14, 53, 60, 29, 56, 28, 20, 5, 7, 55, 16, 5, 8, 19, 55, 16, 60, 7, 15, 6, 50, 6, 16, 15];

// Transform to Job type with proper dates (OPTIMIZED - lazy description loading)
export function getAllJobs(companyId: string = 'demo-company', includeDescriptions: boolean = false): Job[] {
  const now = new Date();

  return allJobsData.map((job, index) => {
    const daysAgo = postedDaysAgo[index] || 0;
    const postedDate = new Date(now);
    postedDate.setDate(postedDate.getDate() - daysAgo);

    return {
      ...job,
      id: `job-${index + 1}`,
      company_id: companyId,
      // Only generate description when explicitly requested (for individual job pages)
      description: includeDescriptions ? generateJobDescription(job.title, job.department) : '',
      is_active: true,
      posted_at: postedDate.toISOString(),
      updated_at: postedDate.toISOString(),
    } as Job;
  });
}

// Get single job with full description
export function getJobBySlug(slug: string, companyId: string = 'demo-company'): Job | null {
  const jobs = getAllJobs(companyId, true); // Include descriptions only for single job
  return jobs.find(job => job.slug === slug) || null;
}

// Generate job descriptions
function generateJobDescription(title: string, department: string): string {
  return `
    <h3>About the Role</h3>
    <p>We are looking for a talented ${title} to join our ${department} team. This is an exciting opportunity to work on challenging projects and make a real impact.</p>
    
    <h3>Responsibilities</h3>
    <ul>
      <li>Collaborate with cross-functional teams to deliver high-quality solutions</li>
      <li>Participate in code reviews and knowledge sharing sessions</li>
      <li>Contribute to the continuous improvement of our processes and tools</li>
      <li>Stay up-to-date with industry trends and best practices</li>
    </ul>
    
    <h3>Requirements</h3>
    <ul>
      <li>Proven experience in a similar role</li>
      <li>Strong problem-solving and analytical skills</li>
      <li>Excellent communication and teamwork abilities</li>
      <li>Passion for learning and professional growth</li>
    </ul>
  `;
}

// Demo company data
export const demoCompany: Company = {
  id: 'demo-company',
  user_id: 'demo-user',
  name: 'TechCorp',
  slug: 'techcorp',
  logo_url: '/techcorp-logo.png',
  banner_url: '/images/hero-bg.png',
  website: 'https://techcorp.example.com',
  tagline: 'Building the future of technology, together. Join our global team of innovators and problem-solvers.',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const demoSettings: CompanySettings = {
  id: 'demo-settings',
  company_id: 'demo-company',
  primary_color: '#6366F1',
  secondary_color: '#4F46E5',
  accent_color: '#10B981',
  dark_mode_enabled: false, // Default to light mode for "clean white" feel
  culture_video_url: null,
  meta_tags: {
    'og:title': 'Careers at TechCorp',
    'og:description': 'Join our team of innovators',
  },
  updated_at: new Date().toISOString(),
};

export const demoSections: ContentSection[] = [
  {
    id: '1',
    company_id: 'demo-company',
    type: 'about',
    title: 'About TechCorp',
    content: `
      <div class="flex flex-col md:flex-row items-center gap-12 py-10">
        <div class="flex-1">
          <h3 class="text-3xl font-bold mb-6 text-gray-900">Empowering the Future</h3>
          <p class="text-lg leading-relaxed mb-6 text-gray-600">We are a forward-thinking technology company dedicated to solving complex problems with innovative solutions. Our mission is to empower businesses and individuals through cutting-edge technology.</p>
          <p class="text-lg leading-relaxed text-gray-600">Founded in 2015 with a vision to make technology accessible and impactful, we've grown into a global team of <strong>500+ professionals</strong> across 12 countries, united by shared values and a passion for excellence.</p>
        </div>
        <div class="flex-1">
          <img src="/images/about-team.png" alt="Our Team Collaboration" class="rounded-2xl shadow-2xl w-full object-cover" />
        </div>
      </div>
    `,
    display_order: 1,
    is_visible: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    company_id: 'demo-company',
    type: 'culture',
    title: 'Life at TechCorp',
    content: `
      <div class="flex flex-col md:flex-row-reverse items-center gap-12 py-10">
        <div class="flex-1">
          <h3 class="text-3xl font-bold mb-6 text-gray-900">A Culture of Innovation</h3>
          <p class="text-lg leading-relaxed mb-6 text-gray-600">At TechCorp, we believe that great work comes from great environments. We foster a culture of innovation, collaboration, and continuous learning.</p>
          <div class="grid grid-cols-2 gap-4">
            <div class="p-4 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors">
              <strong class="text-primary-700 block mb-1">🚀 Innovation First</strong>
              <p class="text-xs text-primary-600">We encourage creative thinking and bold experimentation</p>
            </div>
            <div class="p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
              <strong class="text-green-700 block mb-1">⚖️ Balance</strong>
              <p class="text-xs text-green-600">Flexible schedules and a remote-first culture</p>
            </div>
            <div class="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
              <strong class="text-blue-700 block mb-1">📈 Growth</strong>
              <p class="text-xs text-blue-600">Continuous learning budget and development paths</p>
            </div>
            <div class="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
              <strong class="text-purple-700 block mb-1">🌍 Community</strong>
              <p class="text-xs text-purple-600">Diverse perspectives that make us stronger</p>
            </div>
          </div>
        </div>
        <div class="flex-1">
          <img src="/images/culture-office.png" alt="Our Workspace" class="rounded-2xl shadow-xl w-full object-cover" />
        </div>
      </div>
    `,
    display_order: 2,
    is_visible: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    company_id: 'demo-company',
    type: 'benefits',
    title: 'Benefits & Perks',
    content: `
      <div class="flex flex-col md:flex-row items-center gap-12 py-10">
        <div class="flex-1">
          <h3 class="text-3xl font-bold mb-6 text-gray-900">Your Wellbeing Matters</h3>
          <p class="text-lg leading-relaxed mb-8 text-gray-600">We take care of our team with comprehensive benefits designed to support your wellbeing and professional growth.</p>
          <div class="grid grid-cols-2 gap-y-4 gap-x-6">
            <div class="flex items-center gap-3">
              <span class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-indigo-50 text-indigo-600 font-bold">✓</span>
              <span class="text-gray-700">Health & Vision</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-indigo-50 text-indigo-600 font-bold">✓</span>
              <span class="text-gray-700">Remote Work</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-indigo-50 text-indigo-600 font-bold">✓</span>
              <span class="text-gray-700">Equity Options</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-indigo-50 text-indigo-600 font-bold">✓</span>
              <span class="text-gray-700">Learning Budget</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-indigo-50 text-indigo-600 font-bold">✓</span>
              <span class="text-gray-700">Unlimited PTO</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-indigo-50 text-indigo-600 font-bold">✓</span>
              <span class="text-gray-700">Parental Leave</span>
            </div>
          </div>
        </div>
        <div class="flex-1">
          <img src="/images/benefits.png" alt="Benefits Illustration" class="w-full h-auto p-4" />
        </div>
      </div>
    `,
    display_order: 3,
    is_visible: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '4',
    company_id: 'demo-company',
    type: 'custom',
    title: 'Career Growth',
    content: `
      <div class="flex flex-col md:flex-row-reverse items-center gap-12 py-10">
        <div class="flex-1">
          <h3 class="text-3xl font-bold mb-6 text-gray-900">Grow with Us</h3>
          <p class="text-lg leading-relaxed mb-6 text-gray-600">We don't just offer jobs; we offer career paths. At TechCorp, you'll have the mentorship, tools, and opportunities to reach your full potential.</p>
          <ul class="space-y-4">
            <li class="flex gap-4">
              <div class="mt-1 text-primary-500">•</div>
              <p class="text-gray-600"><strong class="text-gray-900">Mentorship Programs:</strong> Learn from industry veterans through our structured mentorship sessions.</p>
            </li>
            <li class="flex gap-4">
              <div class="mt-1 text-primary-500">•</div>
              <p class="text-gray-600"><strong class="text-gray-900">Annual Growth Reviews:</strong> Clarity on your progress and direct support for your next career milestone.</p>
            </li>
            <li class="flex gap-4">
              <div class="mt-1 text-primary-500">•</div>
              <p class="text-gray-600"><strong class="text-gray-900">Internal Mobility:</strong> We prioritize internal candidates for new opportunities and leadership roles.</p>
            </li>
          </ul>
        </div>
        <div class="flex-1">
          <img src="/images/growth.png" alt="Career Growth illustration" class="w-full h-auto p-8" />
        </div>
      </div>
    `,
    display_order: 4,
    is_visible: true,
    created_at: new Date().toISOString(),
  },
];

// Get unique filter values
export function getFilterOptions(jobs: Job[]) {
  const locations = Array.from(new Set(jobs.map(j => j.location))).sort();
  const departments = Array.from(new Set(jobs.map(j => j.department))).sort();
  const workPolicies = Array.from(new Set(jobs.map(j => j.work_policy))).sort();
  const employmentTypes = Array.from(new Set(jobs.map(j => j.employment_type))).sort();
  const experienceLevels = Array.from(new Set(jobs.map(j => j.experience_level))).sort();

  return { locations, departments, workPolicies, employmentTypes, experienceLevels };
}
