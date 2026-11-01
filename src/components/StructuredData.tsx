import { siteConfig } from '@/config/site';
import { featuredProjects } from '@/data/projects';
import { skillGroups } from '@/data/skills';

/**
 * Serialize JSON-LD safely for embedding in HTML.
 * Escapes `<` to prevent `</script>` breakouts inside the payload.
 */
function toJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

/**
 * JSON-LD structured data for SEO.
 * Server component — no 'use client' needed since it only emits static script tags.
 */
const StructuredData = () => {
  const { url } = siteConfig;

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.name,
    jobTitle: siteConfig.role,
    description: `${siteConfig.role} | AWS Academy Graduate | Cybersecurity Expert | Full-Stack Developer`,
    url,
    image: `${url}/personal.jpg`,
    sameAs: [siteConfig.github.url, siteConfig.linkedin],
    email: siteConfig.contact.email,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'South Africa',
      addressRegion: 'Johannesburg Metropolitan Area',
    },
    worksFor: {
      '@type': 'Organization',
      name: 'Self-employed',
    },
    alumniOf: [
      { '@type': 'EducationalOrganization', name: 'Richfield Graduate Institute of Technology' },
      { '@type': 'EducationalOrganization', name: 'AWS Academy' },
    ],
    knowsAbout: skillGroups.flatMap((group) => group.skills).slice(0, 16),
    hasCredential: [
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'AWS Academy Graduate - Cloud Architecting',
        credentialCategory: 'certification',
        recognizedBy: { '@type': 'Organization', name: 'Amazon Web Services (AWS)' },
        dateIssued: '2024-04-01',
      },
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'AWS Academy Graduate - Cloud Foundations',
        credentialCategory: 'certification',
        recognizedBy: { '@type': 'Organization', name: 'Amazon Web Services (AWS)' },
        dateIssued: '2024-03-01',
      },
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'Microsoft Cybersecurity Analyst',
        credentialCategory: 'certification',
        recognizedBy: { '@type': 'Organization', name: 'Microsoft' },
        dateIssued: '2025-03-01',
      },
      {
        '@type': 'EducationalOccupationalCredential',
        name: 'Google Cybersecurity',
        credentialCategory: 'certification',
        recognizedBy: { '@type': 'Organization', name: 'Google' },
        dateIssued: '2025-03-01',
      },
    ],
    hasOccupation: [
      {
        '@type': 'Occupation',
        name: 'Independent Security Researcher',
        occupationLocation: { '@type': 'City', name: 'Johannesburg' },
      },
      {
        '@type': 'Occupation',
        name: 'Information Technology Manager',
        occupationLocation: { '@type': 'Country', name: 'South Africa' },
        hiringOrganization: { '@type': 'Organization', name: 'Midostransport' },
      },
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: `${siteConfig.name} Portfolio`,
    url,
    description:
      'Professional portfolio showcasing cybersecurity expertise, cloud computing skills, and web development projects.',
    author: { '@type': 'Person', name: siteConfig.name },
    inLanguage: 'en-US',
  };

  const projectsSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Featured Projects',
    itemListElement: featuredProjects.map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: project.name,
      description: project.description,
      url: project.liveUrl || project.githubUrl || `${url}#projects`,
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: url },
      { '@type': 'ListItem', position: 2, name: 'Experience', item: `${url}#experience` },
      { '@type': 'ListItem', position: 3, name: 'Projects', item: `${url}#projects` },
      { '@type': 'ListItem', position: 4, name: 'Skills', item: `${url}#skills` },
      { '@type': 'ListItem', position: 5, name: 'Contact', item: `${url}#contact` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(projectsSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbSchema) }}
      />
    </>
  );
};

export default StructuredData;
