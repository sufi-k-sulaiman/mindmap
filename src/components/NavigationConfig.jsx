
import { Brain } from 'lucide-react';
import { createPageUrl } from '@/utils';

export const LOGO_URL = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692729a5f5180fbd43f297e9/a1a505225_1cPublishing-logo.png';

export const menuItems = [
    { label: 'MindMap', icon: Brain, href: createPageUrl('MindMap') },
];

export const NAVIGATION_ITEMS = menuItems.map(item => ({
    name: item.label,
    page: item.label,
}));

export const footerLinks = [];
