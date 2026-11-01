import { siteConfig } from '@/config/site';
import { featuredProjects } from '@/data/projects';
import { experiences } from '@/data/experience';
import { skillGroups } from '@/data/skills';
import { education } from '@/data/education';
import { certificationGroups } from '@/data/certifications';
import { navItems } from '@/config/navigation';

/**
 * Visually hidden, server-rendered portfolio summary for crawlers and
 * assistive tech when the interactive desktop shell is JS-driven.
 */
export default function PortfolioSummary() {
  const certCount = certificationGroups.reduce(
    (sum, group) => sum + group.certifications.length,
    0
  );

  return (
    <section
      id="portfolio-summary"
      className="sr-only"
      aria-label={`${siteConfig.name} portfolio summary`}
    >
      <h1>{siteConfig.name}</h1>
      <p>{siteConfig.role}</p>
      <p>{siteConfig.tagline}</p>
      <p>
        Based in {siteConfig.location}. Contact:{' '}
        <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>
        {' · '}
        <a href={siteConfig.github.url}>GitHub</a>
        {' · '}
        <a href={siteConfig.linkedin}>LinkedIn</a>
        {' · '}
        {siteConfig.contact.phoneDisplay}
      </p>

      <nav aria-label="Portfolio sections">
        <ul>
          {navItems.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`}>{item.name}</a>
            </li>
          ))}
        </ul>
      </nav>

      <section id="home">
        <h2>About</h2>
        <p>
          {siteConfig.name} is an independent security researcher and full-stack developer
          focused on vulnerability research, secure systems, and mentoring early-career
          engineers. {certCount}+ verified certifications. BSc in Computer Science and
          Information Technology in progress.
        </p>
      </section>

      <section id="experience">
        <h2>Experience</h2>
        <ul>
          {experiences.map((exp) => (
            <li key={exp.id}>
              <strong>
                {exp.title} at {exp.company}
              </strong>{' '}
              ({exp.duration.replace(/\u2014/g, '-')}). {exp.description}
              {exp.achievements.length > 0
                ? ` Achievements: ${exp.achievements.join('; ')}.`
                : ''}
            </li>
          ))}
        </ul>
      </section>

      <section id="projects">
        <h2>Projects</h2>
        <ul>
          {featuredProjects.map((project) => (
            <li key={project.id}>
              <strong>{project.name}</strong> ({project.type}, {project.year}):{' '}
              {project.description} Tech: {project.tech.join(', ')}.
              {project.liveUrl ? (
                <>
                  {' '}
                  <a href={project.liveUrl}>Live demo</a>.
                </>
              ) : null}
              {project.githubUrl ? (
                <>
                  {' '}
                  <a href={project.githubUrl}>Source</a>.
                </>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section id="skills">
        <h2>Skills</h2>
        <ul>
          {skillGroups.map((group) => (
            <li key={group.title}>
              <strong>{group.title}</strong>: {group.skills.join(', ')}
            </li>
          ))}
        </ul>
      </section>

      <section id="certifications">
        <h2>Certifications</h2>
        <ul>
          {certificationGroups.flatMap((group) =>
            group.certifications.map((cert) => (
              <li key={`${group.title}-${cert.name}`}>
                <a href={cert.link}>
                  {cert.name} ({cert.issuer}, {cert.issued.split(' |')[0]})
                </a>
              </li>
            ))
          )}
        </ul>
      </section>

      <section id="education">
        <h2>Education</h2>
        <ul>
          {education.map((edu) => (
            <li key={edu.institution}>
              {edu.degree} at {edu.institution}
              {edu.duration ? ` (${edu.duration.replace(/\u2014/g, '-')})` : ''}
            </li>
          ))}
        </ul>
      </section>

      <section id="contact">
        <h2>Contact</h2>
        <p>
          Email{' '}
          <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>
          , WhatsApp {siteConfig.contact.phoneDisplay}, or connect on{' '}
          <a href={siteConfig.linkedin}>LinkedIn</a>.
        </p>
      </section>

      <p>
        Desktop-inspired portfolio interface. Not affiliated with Microsoft. Windows is a
        trademark of Microsoft Corporation.
      </p>
    </section>
  );
}
