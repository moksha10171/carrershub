export interface BlogPost {
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    date: string;
    category: string;
    author: string;
    readTime: string;
    imageUrl?: string;
}

export const blogPosts: BlogPost[] = [
    {
        title: 'Building Better Careers Pages',
        excerpt: 'Learn how to create careers pages that attract top talent and showcase your company culture.',
        date: 'Dec 15, 2025',
        category: 'Product',
        slug: 'building-better-careers-pages',
        author: 'Sarah Chen',
        readTime: '5 min read',
        content: `
            <p>Your careers page is often the first impression a candidate has of your company. It's more than just a list of open positions; it's an opportunity to showcase your brand, culture, and values.</p>
            
            <h2>Why Your Careers Page Matters</h2>
            <p>In today's competitive job market, candidates are evaluating you just as much as you are evaluating them. A well-designed careers page can:</p>
            <ul>
                <li>Reduce time-to-hire by attracting better-qualified candidates</li>
                <li>Showcase your company culture and values</li>
                <li>Improve the candidate experience</li>
            </ul>

            <h2>Key Elements of a Great Careers Page</h2>
            <p>To create a compelling careers page, focus on transparency, visual storytelling, and ease of use. Include employee testimonials, behind-the-scenes photos, and clear descriptions of your hiring process.</p>
        `
    },
    {
        title: 'The Future of Hiring',
        excerpt: 'Insights into how technology is transforming the recruitment landscape.',
        date: 'Dec 1, 2025',
        category: 'Industry',
        slug: 'future-of-hiring',
        author: 'Mike Ross',
        readTime: '4 min read',
        content: `
            <p>Technology is rapidly changing how we find, evaluate, and hire talent. From AI-driven resume screening to virtual reality office tours, the recruitment landscape is evolving.</p>

            <h2>AI in Recruitment</h2>
            <p>Artificial Intelligence is playing a bigger role in removing bias from job descriptions and helping recruiters identify the best matches for open roles.</p>
        `
    },
    {
        title: 'Remote Work Best Practices',
        excerpt: 'Tips for building and managing distributed teams effectively.',
        date: 'Nov 20, 2025',
        category: 'Culture',
        slug: 'remote-work-best-practices',
        author: 'Alex Rivera',
        readTime: '6 min read',
        content: `
            <p>Remote work is no longer just a perk; for many companies, it's the standard. Building a successful remote culture requires intention and the right tools.</p>

            <h2>Communication is Key</h2>
            <p>In a distributed team, over-communication is better than under-communication. Use asynchronous tools effectively and document everything.</p>
        `
    },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
    return blogPosts.find(post => post.slug === slug);
}
