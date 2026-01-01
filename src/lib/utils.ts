import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return "Posted today";
    } else if (diffDays === 1) {
        return "Posted yesterday";
    } else if (diffDays < 7) {
        return `Posted ${diffDays} days ago`;
    } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `Posted ${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
    } else {
        const months = Math.floor(diffDays / 30);
        return `Posted ${months} ${months === 1 ? "month" : "months"} ago`;
    }
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
}

export function getUniqueValues<T, K extends keyof T>(items: T[], key: K): T[K][] {
    const values = items.map(item => item[key]);
    return Array.from(new Set(values)) as T[K][];
}

export function generateCSSVariables(
    primaryColor: string,
    secondaryColor: string,
    accentColor: string
): string {
    // Generate shades from a base color (simplified)
    return `
    --primary-500: ${primaryColor};
    --primary-600: ${secondaryColor};
    --accent-500: ${accentColor};
  `;
}
