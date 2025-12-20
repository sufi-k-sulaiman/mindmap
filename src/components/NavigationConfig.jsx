
import { Brain } from 'lucide-react';
import { createPageUrl } from '@/utils';

export const LOGO_URL = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69325f9b1a79b292450161dc/95cb67cdb_mindmap-AppIcon11.png';

export const menuItems = [
    { label: 'MindMap', icon: Brain, href: createPageUrl('MindMap') },
];

export const NAVIGATION_ITEMS = menuItems.map(item => ({
    name: item.label,
    page: item.label,
}));

export const footerLinks = [];
