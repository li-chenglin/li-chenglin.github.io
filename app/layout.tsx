import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://li-chenglin.github.io"),
  title: {
    default: "Chenglin Li | Ph.D. Candidate at HKUST (Guangzhou)",
    template: "%s | Chenglin Li",
  },
  description:
    "Chenglin Li is a Ph.D. candidate in Innovation, Policy and Entrepreneurship at HKUST (Guangzhou). His research examines energy transition, climate policy, and political and development economics.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    title: "Chenglin Li | Ph.D. Candidate at HKUST (Guangzhou)",
    description:
      "Research on energy transition, climate policy, and political and development economics.",
    firstName: "Chenglin",
    lastName: "Li",
    username: "Chenglin Li",
    images: [{ url: "/photo.jpg", width: 720, height: 900, alt: "Chenglin Li" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chenglin Li | Ph.D. Candidate at HKUST (Guangzhou)",
    description:
      "Research on energy transition, climate policy, and political and development economics.",
    images: ["/photo.jpg"],
  },
  robots: { index: true, follow: true },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Chenglin Li",
  alternateName: "李成林",
  url: "https://li-chenglin.github.io/",
  image: "https://li-chenglin.github.io/photo.jpg",
  jobTitle: "Ph.D. Candidate in Innovation, Policy and Entrepreneurship",
  affiliation: {
    "@type": "CollegeOrUniversity",
    name: "The Hong Kong University of Science and Technology (Guangzhou)",
    url: "https://www.hkust-gz.edu.cn/",
  },
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "Sun Yat-sen University" },
    { "@type": "CollegeOrUniversity", name: "Lanzhou University" },
  ],
  sameAs: [
    "https://www.linkedin.com/in/chenglin-li-hkustgz",
    "https://orcid.org/0009-0001-3061-1641",
  ],
  knowsAbout: [
    "Energy transition",
    "Climate policy",
    "Environmental economics",
    "Development economics",
    "Political economy",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
