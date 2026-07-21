'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Menu from '../Menu';
import Nav from '../Nav';
import CustomCursor from '../CustomCursor';

type ProjectType = 'building' | 'object' | 'ether-art';

export interface Project {
  slug: string;
  title: string;
  year: string;
  type: ProjectType;
  location: string;
  result: string;
  src: string;
  ratio: string;
}

const TYPE_LABEL: Record<ProjectType, string> = {
  building: 'Building',
  object: 'Object',
  'ether-art': 'Ether Art',
};

const TYPE_COLOR: Record<ProjectType, string> = {
  building: '#bb9a6d',
  object: '#4ac058',
  'ether-art': '#bb9a6d',
};

const FILTERS: { label: string; value: 'all' | ProjectType }[] = [
  { label: 'All', value: 'all' },
  { label: 'Buildings', value: 'building' },
  { label: 'Objects', value: 'object' },
  { label: 'Ether ART', value: 'ether-art' },
];

const PAGE_SIZE = 8;

function ProjectTypeTag({ type }: { type: ProjectType }) {
  return (
    <div className="flex gap-2 items-center shrink-0">
      <span className="size-[6px] rounded-full shrink-0" style={{ background: TYPE_COLOR[type] }} />
      <span className="text-[#0f100e] text-[14px] tracking-[-0.28px] uppercase whitespace-nowrap">
        {TYPE_LABEL[type]}
      </span>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/project/${project.slug}`}
      className="block break-inside-avoid mb-8 md:mb-12 cursor-none"
      data-cursor-target
    >
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: project.ratio.replace('/', ' / ') }}>
        <img src={project.src} alt={project.title} className="absolute inset-0 w-full h-full object-cover" />
      </div>
      <div className="bg-[#f6f4ee] flex items-center justify-between gap-3 p-4">
        <p className="font-bold text-[#0f100e] text-[16px] tracking-[-0.32px] uppercase whitespace-nowrap overflow-hidden text-ellipsis">
          {project.title} {project.year}
        </p>
        <ProjectTypeTag type={project.type} />
      </div>
    </Link>
  );
}

function SortArrow({ direction }: { direction: 'asc' | 'desc' }) {
  return (
    <svg
      width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden
      style={{ transform: direction === 'desc' ? 'rotate(180deg)' : undefined }}
    >
      <path d="M14 10.5L8 4.5L2 10.5" stroke="#0f100e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ProjectTable({ projects, sortDir, onToggleSort }: {
  projects: Project[];
  sortDir: 'asc' | 'desc';
  onToggleSort: () => void;
}) {
  const router = useRouter();
  const thBase = "font-[family-name:var(--font-ibm-plex-mono)] font-medium text-[#0f100e] text-[14px] tracking-[-0.42px] uppercase text-left p-4 border-b border-[rgba(15,16,14,0.12)]";
  const tdBase = "p-4 border-b border-[rgba(15,16,14,0.12)] align-middle";

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[800px] border-collapse">
        <thead>
          <tr>
            <th className={`${thBase} w-24`}>Image</th>
            <th className={thBase}>
              <button onClick={onToggleSort} className="flex items-center gap-1 cursor-pointer">
                Year
                <SortArrow direction={sortDir} />
              </button>
            </th>
            <th className={thBase}>Project Name</th>
            <th className={`${thBase} w-[150px]`}>Project Type</th>
            <th className={`${thBase} w-[189px]`}>Location</th>
            <th className={thBase}>Result</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, i) => (
            <tr
              key={`${project.title}-${project.year}-${i}`}
              onClick={() => router.push(`/project/${project.slug}`)}
              className="cursor-pointer hover:bg-[#f6f4ee]/60"
            >
              <td className="w-24 h-24 py-[6px] border-b border-[rgba(15,16,14,0.12)] align-middle">
                <div className="relative w-full h-full overflow-hidden">
                  <img src={project.src} alt={project.title} className="absolute inset-0 w-full h-full object-cover" />
                </div>
              </td>
              <td className={`${tdBase} font-medium text-[#0f100e] text-[18px] tracking-[-0.54px] uppercase whitespace-nowrap`}>
                {project.year}
              </td>
              <td className={`${tdBase} font-medium text-[#0f100e] text-[18px] tracking-[-0.54px] uppercase`}>
                {project.title} {project.year}
              </td>
              <td className={tdBase}>
                <ProjectTypeTag type={project.type} />
              </td>
              <td className={`${tdBase} text-[#0f100e] text-[16px] tracking-[-0.48px] whitespace-nowrap`}>
                {project.location}
              </td>
              <td className={`${tdBase} text-[#0f100e] text-[16px] tracking-[-0.48px] whitespace-nowrap`}>
                {project.result}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GridIcon({ color = '#0f100e' }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <rect x="1.33" y="1.33" width="5.33" height="5.33" rx="0.5" stroke={color} strokeWidth="1.333" />
      <rect x="9.33" y="1.33" width="5.33" height="5.33" rx="0.5" stroke={color} strokeWidth="1.333" />
      <rect x="1.33" y="9.33" width="5.33" height="5.33" rx="0.5" stroke={color} strokeWidth="1.333" />
      <rect x="9.33" y="9.33" width="5.33" height="5.33" rx="0.5" stroke={color} strokeWidth="1.333" />
    </svg>
  );
}

function ListIcon({ color = '#0f100e' }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      {[4, 8, 12].map((y) => (
        <g key={y}>
          <circle cx="2" cy={y} r="0.667" fill={color} />
          <path d={`M5.33 ${y}H14`} stroke={color} strokeWidth="1.333" strokeLinecap="round" />
        </g>
      ))}
    </svg>
  );
}

export default function ProjectListClient({ projects: PROJECTS }: { projects: Project[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | ProjectType>('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(
    () => (filter === 'all' ? PROJECTS : PROJECTS.filter((p) => p.type === filter)),
    [filter, PROJECTS],
  );

  const sorted = useMemo(() => {
    const list = [...filtered];
    list.sort((a, b) => (sortDir === 'asc' ? Number(a.year) - Number(b.year) : Number(b.year) - Number(a.year)));
    return list;
  }, [filtered, sortDir]);

  const handleFilterChange = (value: typeof filter) => {
    setFilter(value);
    setVisibleCount(PAGE_SIZE);
  };

  const visible = sorted.slice(0, visibleCount);
  const hasMore = visibleCount < sorted.length;

  return (
    <>
      <CustomCursor />
      <Nav onMenuClick={() => setMenuOpen(true)} />

      <div className="min-h-screen bg-white flex flex-col items-center pt-[104px] md:pt-[128px] pb-16 md:pb-24 px-4 md:px-6">
        <div className="w-full flex flex-col gap-6 md:gap-8">

          {/* Filters + view toggle */}
          <div className="flex items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-1 md:gap-2 overflow-x-auto">
              {FILTERS.map((f) => {
                const active = filter === f.value;
                return (
                  <button
                    key={f.value}
                    onClick={() => handleFilterChange(f.value)}
                    className={`shrink-0 px-3 md:px-4 py-2 rounded-[4px] text-[15px] md:text-[16px] font-medium tracking-[-0.32px] whitespace-nowrap transition-colors ${
                      active ? 'bg-[#0f100e] text-[#bb9a6d]' : 'text-[#0f100e] hover:text-[#bb9a6d]'
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setView('list')}
                aria-label="List view"
                className={`flex items-center justify-center rounded-[4px] size-6 ${view === 'list' ? 'bg-[#2e2e2b]' : ''}`}
              >
                <ListIcon color={view === 'list' ? '#f6f4ee' : '#0f100e'} />
              </button>
              <button
                onClick={() => setView('grid')}
                aria-label="Grid view"
                className={`flex items-center justify-center rounded-[4px] size-6 ${view === 'grid' ? 'bg-[#2e2e2b]' : ''}`}
              >
                <GridIcon color={view === 'grid' ? '#f6f4ee' : '#0f100e'} />
              </button>
            </div>
          </div>

          {/* Project list */}
          {view === 'grid' ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
              {visible.map((project, i) => (
                <ProjectCard key={`${project.title}-${project.year}-${i}`} project={project} />
              ))}
            </div>
          ) : (
            <ProjectTable
              projects={visible}
              sortDir={sortDir}
              onToggleSort={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
            />
          )}

          {hasMore && (
            <div className="flex justify-center w-full">
              <button
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="bg-[#f6f4ee] border border-[#c8c3b9] text-[#0f100e] font-medium text-[16px] tracking-[-0.32px] h-12 px-4 rounded-[4px] whitespace-nowrap"
              >
                Load More
              </button>
            </div>
          )}

        </div>
      </div>

      <Menu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
