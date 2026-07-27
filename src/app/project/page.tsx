import type { Metadata } from 'next';
import { client } from '@/sanity/client';
import { PROJECT_CARDS_QUERY } from '@/sanity/queries';
import type { ProjectCard } from '@/sanity/types';
import ProjectListClient, { type Project } from './ProjectListClient';

export const metadata: Metadata = {
  title: 'Projects — Ether Ship',
  description: 'Buildings, objects, and competition entries by Ether Ship.',
};

const options = { next: { revalidate: 60 } };

export default async function ProjectListPage() {
  const cards = await client.fetch<ProjectCard[]>(PROJECT_CARDS_QUERY, {}, options);

  const projects: Project[] = cards
    .filter((p) => p.cover?.asset?.url)
    .map((p) => {
      const dimensions = p.cover!.asset!.metadata?.dimensions;
      return {
        slug: p.slug,
        title: p.title,
        year: String(p.year),
        type: p.type,
        location: p.location ?? '',
        result: p.result ?? '',
        src: p.cover!.asset!.url,
        ratio: dimensions ? `${dimensions.width}/${dimensions.height}` : '1/1',
      };
    });

  return <ProjectListClient projects={projects} />;
}
