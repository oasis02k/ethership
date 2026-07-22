import { client } from '@/sanity/client';
import { HOME_PAGE_QUERY } from '@/sanity/queries';
import type { ProjectCard } from '@/sanity/types';
import HomeClient, { type TickerImage } from './HomeClient';

const options = { next: { revalidate: 60 } };

export default async function Home() {
  const projects = await client.fetch<(ProjectCard | null)[]>(HOME_PAGE_QUERY, {}, options);

  const images: TickerImage[] = projects
    .filter((p): p is ProjectCard => Boolean(p?.cover?.asset?.url))
    .map((p) => {
      const dimensions = p.cover!.asset!.metadata?.dimensions;
      return {
        slug: p.slug,
        title: `${p.title} ${p.year}`,
        src: p.cover!.asset!.url,
        ratio: dimensions ? `${dimensions.width}/${dimensions.height}` : '1/1',
      };
    });

  const col1 = images.filter((_, i) => i % 2 === 0);
  const col2 = images.filter((_, i) => i % 2 === 1);

  return <HomeClient col1={col1} col2={col2} />;
}
