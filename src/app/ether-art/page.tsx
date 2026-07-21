import type { Metadata } from 'next';
import EtherArtClient from './EtherArtClient';

export const metadata: Metadata = {
  title: 'Ether Art — Ether Ship',
  description: 'Works that survive the collision between architectural ideas and what reality can contain.',
};

export default function EtherArtPage() {
  return <EtherArtClient />;
}
