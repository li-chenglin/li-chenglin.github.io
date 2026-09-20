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

const researchInterests = [
  {
    title: 'Fossil Fuel Phase-out',
    description: 'Socioeconomic impacts of coal phase-out, stranded assets, and local transition costs.',
  },
  {
    title: 'Climate & Environmental Economics',
    description: 'Extreme natural disasters, climate adaptation, public health, and policy resilience.',
  },
  {
    title: 'Public Economy',
    description: 'Governmental fiscal behavior, procurement, and government-citizen relationships.',
  },
  {
    title: 'Policy Analysis & Applied Economics',
    description: 'Causal inference, macro- and microeconomic data analysis, and institutional design.',
  },
];

const workingPapers = [
  {
    title: 'Shine on Small Mines: Size-Based Economic Effects of Coal Mine Closure',
    authors: 'C. Li and Y. Lu',
    status: 'Under Peer Review',
    year: '2025',
  },
  {
    title: 'Data Center Exposure and Coal Plant Retirement Timelines',
    authors: 'C. Li, Y. Zhang, Y. Xu, and Y. Lu',
    status: 'Accepted',
    year: '2025',
  },
  {
    title: 'Geopolitical Alliances Shape Foreign Direct Investment Patterns in Energy Transition Minerals',
    authors: 'Y. Xu, C. Li, J. Xiong, Y. Lu, and Y. Geng',
    status: 'Submitted',
    year: '2025',
  },
  {
    title: 'Public Toilets, Rural Health and Family Income: Evidence from China',
    authors: 'C. Li, Y. Guo, and P. Liang',
    status: 'Under Peer Review',
    year: '2025',
  },
  {
    title: 'Why is There so much Surveillance in China: An Explanation from a Fiscal Perspective',
    authors: 'Y. Guo, C. Li, and P. Liang',
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
    <div className="mb-9 flex items-end justify-between pb-4">
      <h2 className="font-section relative text-[0.78rem] font-semibold uppercase text-[var(--accent)] after:absolute after:-bottom-4 after:left-0 after:h-0.5 after:w-16 after:bg-[var(--gold)]">
        {eyebrow}
      </h2>
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
    <article className="border-b border-[var(--line)] py-5">
      <p className="mb-3 text-[0.7rem] font-semibold uppercase leading-5 tracking-[0.12em] text-[var(--gold-dark)]">
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
      <h3 className="font-paper max-w-4xl text-[1rem] leading-snug text-[var(--ink)] sm:text-[1.1rem]">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{authors}</p>
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
    <article className="grid gap-3 border-b border-[var(--line)] py-5 sm:grid-cols-[7.5rem_1fr]">
      <p className="text-[0.7rem] font-semibold uppercase leading-5 tracking-[0.12em] text-[var(--gold-dark)]">{term}</p>
      <div>
        <h3 className="font-paper text-[1.08rem] leading-snug text-[var(--ink)] sm:text-[1.22rem]">
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
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
            <section className="border-b border-[var(--line)] pb-10">
              <div className="grid gap-10 lg:grid-cols-[1fr_23rem] lg:items-start">
                <div className="pt-2">
                  <p className="font-section mb-4 text-[0.72rem] font-semibold uppercase text-[var(--accent)]">
                    Academic Profile
                  </p>
                  <p className="mt-6 max-w-2xl text-[1.02rem] leading-8 text-[var(--ink)]">
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
                  <p className="mt-4 max-w-2xl text-[1.02rem] leading-8 text-[var(--muted)]">
                    My interdisciplinary research examines the socioeconomic impacts of the global energy
                    transition, with a special focus on how societies can strategically manage the
                    consequences of fossil fuel phase-out and reconcile ambitious climate targets with
                    the rising electricity loads powering the digital economy. I also work broadly in
                    development economics and political economy, using quantitative economic methods to
                    evaluate policy effectiveness and the consequences of social change.
                  </p>
                  <p className="mt-4 max-w-2xl text-[1.02rem] leading-8 text-[var(--muted)]">
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
                  <div className="mt-9 border-t border-[var(--line)] pt-5">
                    <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm leading-6 text-[var(--ink)]">
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

                <div>
                  <Image
                    src="/photo.jpg"
                    alt="Chenglin Li"
                    width={720}
                    height={720}
                    priority
                    className="aspect-[4/5] w-full object-cover object-[50%_32%]"
                  />
                </div>
              </div>
            </section>

            <section className="mt-12">
              <SectionHeader eyebrow="Research Interests" title="" />
              <div className="grid gap-x-10 md:grid-cols-2">
                {researchInterests.map((interest) => (
                  <article key={interest.title} className="border-b border-[var(--line)] py-4">
                    <h3 className="font-paper text-[1rem] tracking-normal text-[var(--ink)] sm:text-[1.06rem]">{interest.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{interest.description}</p>
                  </article>
                ))}
              </div>
            </section>

          </div>
        );

      case 'teaching':
        return (
          <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
            <section>
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
          <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
            <section>
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

            <section className="mt-12">
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
          <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
            <div className="mb-5 flex items-center justify-between gap-4 border-b border-[var(--line)] pb-5">
              <div>
                <p className="font-section text-[0.72rem] font-semibold uppercase text-[var(--accent-dark)]">Curriculum Vitae</p>
                <h2 className="mt-2 font-serif text-3xl font-normal text-[var(--ink)]">Chenglin Li</h2>
              </div>
              <a
                href="/cv.pdf"
                download
                className="inline-flex h-10 items-center gap-2 border border-[var(--accent)] px-4 text-sm font-semibold text-[var(--accent)] transition-colors hover:border-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--ink)]"
              >
                <DownloadIcon />
                PDF
              </a>
            </div>

            <div className="border border-[var(--line)] p-2">
              <iframe src="/cv.pdf" className="h-[78vh] w-full border-0" title="Chenglin Li CV" />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--ink)]">
      <nav className="sticky top-0 z-50 border-b border-[var(--accent-dark)] bg-[var(--accent)] backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <button
            type="button"
            onClick={() => selectPage('home')}
            className="font-name text-lg font-semibold leading-none text-white transition-colors hover:text-[var(--gold)]"
          >
            Chenglin Li
          </button>

          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => selectPage(item.id)}
                className={`h-9 px-4 text-sm transition-colors ${
                  currentPage === item.id
                    ? 'text-white underline decoration-[var(--gold)] decoration-2 underline-offset-8'
                    : 'text-white/78 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="grid h-10 w-10 place-items-center border border-white/30 text-white md:hidden"
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
          <div className="border-t border-white/20 bg-[var(--accent)] px-5 py-4 md:hidden">
            <div className="mx-auto grid max-w-6xl gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectPage(item.id)}
                  className={`h-11 text-left text-base font-medium ${
                    currentPage === item.id ? 'text-white underline decoration-[var(--gold)] underline-offset-4' : 'text-white/78'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      <main>{renderContent()}</main>

      <footer className="border-t border-[var(--line)] bg-[var(--paper)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© 2026 Chenglin Li. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
