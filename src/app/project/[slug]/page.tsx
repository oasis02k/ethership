import { notFound } from 'next/navigation';
import { client } from '@/sanity/client';
import { PROJECT_BY_SLUG_QUERY, PROJECT_ORDER_QUERY } from '@/sanity/queries';
import ProjectDetailView from './ProjectDetailView';

const options = { next: { revalidate: 60 } };

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [project, order] = await Promise.all([
    client.fetch(PROJECT_BY_SLUG_QUERY, { slug }, options),
    client.fetch(PROJECT_ORDER_QUERY, {}, options),
  ]);

  if (!project) return notFound();

  const currentIndex = order.findIndex((p: { slug: string }) => p.slug === slug);
  const nextSlug = order[(currentIndex + 1) % order.length]?.slug ?? slug;
  const prevSlug = order[(currentIndex - 1 + order.length) % order.length]?.slug ?? slug;

  return <ProjectDetailView project={project} prevSlug={prevSlug} nextSlug={nextSlug} />;
}
