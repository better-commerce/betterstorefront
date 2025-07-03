import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { path } = req.query;

    if (typeof path !== 'string') {
        return res.status(400).json({ error: 'Invalid path parameter' });
    }

    try {
        // This DUMMY DB service, needs to be replaced with actual API call.
        const resolver = new SlugResolverService();
        const { rewriteType } = await resolver.resolve(path);

        if (rewriteType) {
            return res.status(200).json({ found: true, rewriteType, message: 'Matching handler found' });
        }

        return res.status(200).json({ found: false, message: 'No matching handler found' });
    } catch (error) {
        console.error('Database query failed:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// Types representing your database schema
type SlugType = | 'category' | 'subcategory' | 'brand' | 'product' | 'cms' | 'blog-home' | 'blog-category' | 'blog-article' | 'store-detail' | 'static';

interface SlugMapping {
    path: string;
    type: SlugType;
}

// MOCK DATABASE SERVICE (replace with your actual DB implementation)
class SlugResolverService {
    private slugMappings: SlugMapping[] = [];

    constructor() {
        // This would come from your database - added here for demonstration
        this.slugMappings = [
            // Categories
            { path: '/digital-cameras', type: 'category' },
            { path: '/used', type: 'category' },

            // Subcategories
            { path: '/digital-cameras/mirrorless-cameras', type: 'subcategory' },
            { path: '/used/cameras', type: 'subcategory' },

            // Brands
            { path: '/fujifilm-28159', type: 'brand' },

            // CMS Pages
            { path: '/about-us', type: 'cms' },
            { path: '/contact', type: 'cms' },

            // Blog
            { path: '/blog/tips-and-inspiration', type: 'blog-category' },
            { path: '/blog/tips-and-inspiration/article', type: 'blog-article' },

            // Stores
            { path: '/park-cameras-burgess-hill-store', type: 'store-detail' },
            { path: '/park-cameras-london-store', type: 'store-detail' },

            // Events
            { path: '/blog/events', type: 'cms' },
        ];
    }

    async resolve(path: string): Promise<{ rewriteType: SlugType | null }> {
        // 1. Check for exact matches first
        const exactMatch = this.slugMappings.find(m => m.path === path);
        if (exactMatch) {
            return {
                rewriteType: exactMatch.type
            };
        }

        // Example: Check for CMS page
        const cmsPages = ['/about-us', '/contact', '/terms'];
        if (cmsPages.includes(path)) {
            return {
                rewriteType: 'cms'
            };
        }

        // 3. Check for category/subcategory hierarchy
        const pathSegments = path.split('/').filter(Boolean);
        if (pathSegments.length >= 1) {
            // This would be a database lookup in production
            const isCategory = await this.isCategory(path);
            if (isCategory) {
                return {
                    rewriteType: pathSegments.length > 1 ? 'subcategory' : 'category'
                };
            }
        }

        return { rewriteType: null };
    }

    private async isCategory(path: string): Promise<boolean> {
        // This would be a database query in production
        return true; // Simplified for example
    }
}