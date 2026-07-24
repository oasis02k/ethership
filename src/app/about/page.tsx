import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About — Ether Ship',
  description: 'Sung Goo Yang, founder of Ether Ship — education, experience, awards and recognition.',
};

export default function AboutPage() {
  return <AboutClient />;
}
