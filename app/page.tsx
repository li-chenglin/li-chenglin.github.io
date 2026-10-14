'use client';

import Image from 'next/image';
import { useState } from 'react';

const navItems = [
  { id: 'home', label: 'About' },
  { id: 'research', label: 'Research' },
  { id: 'teaching', label: 'Teaching' },
  { id: 'cv', label: 'CV' },
] as const;

type PageId = (typeof navItems)[number]['id'];

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const researchInterests = [
  {
    title: 'Fossil Fuel Phase-Out & Energy Transition',
    description: 'Socioeconomic analysis of coal phase-out, just transition.',
  },
  {
    title: 'AI and Energy',
    description: 'Power and AI infrastructure, social challenges and solutions under data center expansion.',
  },
  {
    title: 'Climate Change Economics',
    description: 'Public attitudes under extreme weather.',
  },
  {
    title: 'Public & Development Economics',
    description: 'Governmental fiscal behavior, public investment and procurement.',
  },
];

const workingPapers = [
  {
    title: 'Shine on Small Mines: Size-Based Economic Effects of Coal Mine Closure',
    authors: 'With Y. Lu',
    status: 'Under Peer Review',
    year: '2025',
  },
  {
    title: 'Data Center Exposure and Coal Plant Retirement Timelines',
    authors: 'With Y. Zhang et al.',
    status: 'Accepted',
    year: '2025',
  },
  {
    title: 'Geopolitical Alliances Shape Foreign Direct Investment Patterns in Energy Transition Minerals',
    authors: 'With Y. Xu et al.',
    status: 'Submitted',
    year: '2025',
  },
  {
    title: 'Public Toilets, Rural Health and Family Income: Evidence from China',
    authors: 'With Y. Guo and P. Liang',
    status: 'Under Peer Review',
    year: '2025',
  },
  {
    title: 'Why is There so much Surveillance in China: An Explanation from a Fiscal Perspective',
    authors: 'With Y. Guo and P. Liang',
    status: 'R&R',
    year: '2025',
  },
];

const publications = [
  {
    title: 'Fossil fuel occupations show high transferability across the wider economy',
    authors: 'Q. Huang, C. Li, and Y. Lu',
    venue: 'Communications Sustainability 1, 125',
    year: '2026',
    url: 'https://doi.org/10.1038/s44458-026-00131-w',
  },
  {
    title: 'Fiscal Pressure and Local Government Fines Revenue',
    authors: 'P. Liang, Y. Guo, and C. Li',
    venue: 'Economic Theory and Business Management, 45(5), 55-74',
    year: '2025',
    reprintUrl: 'http://en.rdfybk.com/',
  },
];

const teachingSessions = [
  {
    code: 'UCUG 1800',
    title: 'Technology and Innovation: Social and Business Perspectives',
    role: 'Teaching Assistant',
    level: 'Undergraduate course',
    term: 'HKUST(GZ) Spring 2026',
  },
  {
    code: 'SOCH 6780',
    title: 'Professional Development in Innovation, Technology, and Social Responsibility',
    role: 'Teaching Assistant',
    level: 'Graduate course',
    term: 'HKUST(GZ) Spring 2025',
  },
];

function MailIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M4.75 6.75h14.5v10.5H4.75z" />
      <path d="m5.25 7.25 6.75 5.5 6.75-5.5" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M18.25 10.25c0 4.5-6.25 9-6.25 9s-6.25-4.5-6.25-9a6.25 6.25 0 1 1 12.5 0Z" />
      <path d="M12 12.5a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M8.75 6.75h8.5v8.5" />
      <path d="m17 7-10.25 10.25" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M12 4.75v10" />
      <path d="m7.75 10.75 4.25 4.25 4.25-4.25" />
      <path d="M5.75 18.75h12.5" />
    </svg>
  );
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="section-header flex items-end justify-between">
      <h2>{eyebrow}</h2>
      {title ? <p className="hidden text-sm text-[var(--muted)] sm:block">{title}</p> : null}
    </div>
  );
}

function PaperItem({
  title,
  authors,
  meta,
  url,
  reprintUrl,
}: {
  title: string;
  authors: string;
  meta: string;
  url?: string;
  reprintUrl?: string;
}) {
  return (
    <article className="paper-item">
      <p className="paper-meta">
        {meta}
        {reprintUrl ? (
          <>
            <span className="normal-case">. In Chinese, Reprinted by </span>
            <a
              href={reprintUrl}
              target="_blank"
              rel="noreferrer"
              className="normal-case transition-colors hover:text-[var(--accent)]"
            >
              China Social Science Excellence
            </a>
            <span className="normal-case">.</span>
          </>
        ) : null}
      </p>
      <h3 className="paper-title">{title}</h3>
      <p className="paper-authors">{authors}</p>
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] transition-colors hover:text-[var(--accent-dark)]"
        >
          DOI
          <ExternalIcon />
        </a>
      ) : null}
    </article>
  );
}

function TeachingItem({
  code,
  title,
  role,
  level,
  term,
}: {
  code: string;
  title: string;
  role: string;
  level: string;
  term: string;
}) {
  return (
    <article className="teaching-item">
      <p className="paper-meta">{term}</p>
      <div>
        <h3 className="teaching-title text-[1.12rem] sm:text-[1.22rem]">
          {code}: {title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          {role} / {level}
        </p>
      </div>
    </article>
  );
}

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageId>('home');

  const selectPage = (page: PageId) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0 });
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div>
            <section className="site-container profile-section">
              <div className="profile-layout">
                <div className="profile-copy">
                    <h1 className="profile-label">
                    Academic Profile
                  </h1>
                  <p className="profile-lead">
                    I am a Ph.D. candidate in Innovation, Policy and Entrepreneurship at{' '}
                    <a
                      href="https://www.hkust-gz.edu.cn/"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-[var(--accent)] transition-colors hover:text-[var(--ink)]"
                    >
                      The Hong Kong University of Science and Technology (Guangzhou)
                      </a>
                      .

                  </p>
                  <p className="profile-paragraph">
                    My interdisciplinary research examines the socioeconomic impacts of the global energy
                    transition, with a special focus on how societies can strategically manage the
                    consequences of fossil fuel phase-out and reconcile ambitious climate targets with
                    the rising electricity loads powering the digital economy. I also work broadly in
                    development economics and political economy, using quantitative economic methods to
                    evaluate policy effectiveness and the consequences of social change.
                  </p>
                  <p className="profile-paragraph">
                    Before my Ph.D. research, I obtained a Master&apos;s degree in Public Administration from{' '}
                    <a
                      href="https://www.sysu.edu.cn/sysuen/"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-[var(--accent)] transition-colors hover:text-[var(--ink)]"
                    >
                      Sun Yat-sen University
                    </a>{' '}
                    and a Bachelor&apos;s degree in Management from{' '}
                    <a
                      href="https://global.lzu.edu.cn/"
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-[var(--accent)] transition-colors hover:text-[var(--ink)]"
                    >
                      Lanzhou University
                    </a>
                    .
                  </p>
                  <div className="profile-contact">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs leading-6 text-[var(--muted)]">
                      <a
                        href="mailto:chenglin.li@connect.hkust-gz.edu.cn"
                        className="inline-flex items-center gap-2 transition-colors hover:text-[var(--accent)]"
                      >
                        <MailIcon />
                        <span className="min-w-0 break-all">chenglin.li@connect.hkust-gz.edu.cn</span>
                      </a>
                      <div className="inline-flex items-center gap-2">
                        <PinIcon />
                        <span>606 E3 Bldg., HKUST(GZ), Guangzhou, CN</span>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-5">
                      <a
                        href="https://www.linkedin.com/in/chenglin-li-hkustgz"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-9 items-center gap-2 border-b border-[var(--line)] px-1 text-sm font-semibold text-[var(--ink)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                      >
                        LinkedIn
                        <ExternalIcon />
                      </a>
                      <a
                        href="https://orcid.org/0009-0001-3061-1641"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-9 items-center gap-2 border-b border-[var(--line)] px-1 text-sm font-semibold text-[var(--ink)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                      >
                        ORCID
                        <ExternalIcon />
                      </a>
                    </div>
                  </div>

                </div>

                <div className="profile-portrait">
                  <Image
                    src={`${basePath}/photo.jpg`}
                    alt="Chenglin Li"
                    width={720}
                    height={720}
                    priority
                    className="aspect-[4/5] w-full object-cover object-[50%_32%]"
                  />
                  <h2 className="profile-name font-section">
                    <span className="profile-name-en">Chenglin Li</span>
                    <span lang="zh" className="profile-name-zh">(李成林)</span>
                  </h2>
                </div>
              </div>
            </section>

            <section className="interests-band">
              <div className="site-container interests-layout">
              <SectionHeader eyebrow="Research Interests" title="" />
              <div className="interest-list">
                {researchInterests.map((interest, index) => (
                  <article key={interest.title} className="interest-item">
                    <span aria-hidden="true" className="interest-index">{String(index + 1).padStart(2, '0')}</span>
                    <div className="interest-copy">
                      <h3 className="interest-title text-[1.02rem] sm:text-[1.08rem]">{interest.title}</h3>
                      <p className="mt-2 text-[0.92rem] leading-7 text-[var(--muted)]">{interest.description}</p>
                    </div>
                  </article>
                ))}
              </div>
              </div>
            </section>

          </div>
        );

      case 'teaching':
        return (
          <div className="site-container archive-page">
            <section className="editorial-section">
              <SectionHeader eyebrow="Teaching" title="" />
              <div>
                {teachingSessions.map((session) => (
                  <TeachingItem
                    key={session.code}
                    code={session.code}
                    title={session.title}
                    role={session.role}
                    level={session.level}
                    term={session.term}
                  />
                ))}
              </div>
            </section>
          </div>
        );

      case 'research':
        return (
          <div className="site-container archive-page">
            <section className="editorial-section">
              <SectionHeader eyebrow="Working Papers" title="" />
              <div>
                {workingPapers.map((paper) => (
                  <PaperItem
                    key={paper.title}
                    title={paper.title}
                    authors={paper.authors}
                    meta={paper.status}
                  />
                ))}
              </div>
            </section>

            <section className="editorial-section">
              <SectionHeader eyebrow="Publications" title="" />
              <div>
                {publications.map((paper) => (
                  <PaperItem
                    key={paper.title}
                    title={paper.title}
                    authors={paper.authors}
                    meta={`${paper.venue} / ${paper.year}`}
                    url={paper.url}
                    reprintUrl={paper.reprintUrl}
                  />
                ))}
              </div>
            </section>
          </div>
        );

      case 'cv':
        return (
          <div className="site-container archive-page">
            <div className="mb-5 flex items-center justify-between gap-4 border-b border-[var(--line)] pb-5">
              <div>
                <p className="font-section text-[0.72rem] font-semibold uppercase text-[var(--accent-dark)]">Curriculum Vitae</p>
              </div>
              <a
                href={`${basePath}/cv.pdf`}
                download
                className="download-link inline-flex h-10 items-center gap-2 px-4 text-sm font-semibold"
              >
                <DownloadIcon />
                PDF
              </a>
            </div>

            <div className="border border-[var(--line)] p-2">
              <iframe src={`${basePath}/cv.pdf`} className="h-[78vh] w-full border-0" title="Chenglin Li CV" />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="site-shell min-h-screen bg-[var(--background)] text-[var(--ink)]">
      <nav className="site-nav sticky top-0 z-50" aria-label="Main navigation">
        <div className="site-container nav-inner">
          <p className="site-slogan">I am pretty dope!</p>
          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
            <button
                key={item.id}
                type="button"
                onClick={() => selectPage(item.id)}
                aria-current={currentPage === item.id ? 'page' : undefined}
                className={`nav-link h-10 px-4 text-[0.9rem] ${currentPage === item.id ? 'nav-link-active' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="menu-toggle grid h-10 w-10 place-items-center md:hidden"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label="Toggle navigation"
            aria-expanded={isMenuOpen}
          >
            <span className="relative h-4 w-5">
              <span
                className={`absolute left-0 top-1 h-px w-5 bg-current transition-transform ${
                  isMenuOpen ? 'translate-y-1.5 rotate-45' : ''
                }`}
              />
              <span
                className={`absolute left-0 top-3 h-px w-5 bg-current transition-transform ${
                  isMenuOpen ? '-translate-y-1.5 -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        </div>

        {isMenuOpen && (
          <div className="mobile-menu px-5 py-4 md:hidden">
            <div className="mx-auto grid max-w-6xl gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectPage(item.id)}
                  aria-current={currentPage === item.id ? 'page' : undefined}
                  className={`mobile-nav-link h-11 text-left text-base font-medium ${currentPage === item.id ? 'mobile-nav-active' : ''}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      <main key={currentPage} className="page-content">{renderContent()}</main>

      <footer className="border-t border-[var(--line)] bg-[var(--paper)]">
        <div className="site-container flex flex-col gap-3 py-8 text-[0.78rem] text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Chenglin Li. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
