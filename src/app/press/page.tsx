import type { Metadata } from 'next';
import { client } from '@/sanity/client';
import { NEWS_ITEMS_QUERY } from '@/sanity/queries';
import type { NewsItem } from '@/sanity/types';
import PressClient from './PressClient';

export const metadata: Metadata = {
  title: 'Press — Ether Ship',
  description: 'News and updates from Ether Ship — competition wins and recognition.',
};

const options = { next: { revalidate: 60 } };

export default async function PressPage() {
  const items = await client.fetch<NewsItem[]>(NEWS_ITEMS_QUERY, {}, options);

  return <PressClient items={items} />;
}
