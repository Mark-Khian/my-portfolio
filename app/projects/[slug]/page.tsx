import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Globe, FileText } from "lucide-react";
import type { Metadata } from "next";

import { GitHubIcon } from "@/components/icons/github";
import { getPublishedProjectBySlug, getPublishedProjects } from "@/lib/projects-content";
import { FadeIn } from "@/components/motion/fade-in";
import { cn } from "@/lib/utils";
import { ProjectGallery } from "@/components/sections/project-gallery";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: project.title,
    description: project.description,
  };
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen pt-24 pb-16 px-6 sm:px-10 lg:px-16 max-w-3xl mx-auto">
      <FadeIn>
        <Link href="/#projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded">
          <ArrowLeft className="size-4" />
          Back to Projects
        </Link>
      </FadeIn>

      <FadeIn delay={0.1}>
        <header className="mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
              {project.category}
            </span>
            <span className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium",
              project.status === "live" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" :
              project.status === "completed" ? "border-blue-500/30 bg-blue-500/10 text-blue-400" :
              "border-amber-500/30 bg-amber-500/10 text-amber-400"
            )}>
              {project.status === 'live' ? 'Live' : project.status === 'completed' ? 'Completed' : 'In Progress'}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
            {project.title}
          </h1>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        </header>
      </FadeIn>

      {/* Hero / Cover */}
      {project.thumbnailUrl && (
        <FadeIn delay={0.15}>
          <div className="aspect-video w-full overflow-hidden rounded-xl bg-white/5 border border-white/10 mb-12">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={project.thumbnailUrl} alt={project.thumbnailAltText || `${project.title} cover`} className="h-full w-full object-cover" />
          </div>
        </FadeIn>
      )}

      {/* Case Study Content */}
      <div className="space-y-12 text-muted-foreground leading-relaxed">
        {project.overview && (
          <FadeIn delay={0.2}>
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">Overview</h2>
              <p>{project.overview}</p>
            </section>
          </FadeIn>
        )}

        {project.problem && (
          <FadeIn delay={0.25}>
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">The Problem</h2>
              <p>{project.problem}</p>
            </section>
          </FadeIn>
        )}

        {project.goal && (
          <FadeIn delay={0.3}>
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">Goal</h2>
              <p>{project.goal}</p>
            </section>
          </FadeIn>
        )}

        {project.myRole && (
          <FadeIn delay={0.35}>
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">My Role</h2>
              <p>{project.myRole}</p>
            </section>
          </FadeIn>
        )}

        {project.solution && (
          <FadeIn delay={0.4}>
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">Solution</h2>
              <p>{project.solution}</p>
            </section>
          </FadeIn>
        )}

        {project.keyFeatures && project.keyFeatures.length > 0 && (
          <FadeIn delay={0.45}>
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">Key Features</h2>
              <ul className="list-disc pl-5 space-y-2">
                {project.keyFeatures.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
            </section>
          </FadeIn>
        )}

        {/* Technical Details */}
        {(project.techStack || project.architecture) && (
          <FadeIn delay={0.5}>
            <section className="rounded-xl border border-white/10 bg-white/5 p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-foreground mb-6">Technical Details</h2>
              <div className="grid gap-8 sm:grid-cols-2">
                {project.techStack && (
                  <div>
                    <h3 className="text-sm font-medium text-foreground mb-3 uppercase tracking-wider">Tech Stack</h3>
                    <ul className="flex flex-wrap gap-2">
                      {project.techStack.map((tech) => (
                        <li key={tech} className="rounded border border-white/10 bg-white/5 px-2 py-1 text-xs">{tech}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {project.architecture && (
                  <div>
                    <h3 className="text-sm font-medium text-foreground mb-3 uppercase tracking-wider">Architecture</h3>
                    <p className="text-sm">{project.architecture}</p>
                  </div>
                )}
              </div>
            </section>
          </FadeIn>
        )}

        {/* Media Gallery */}
        {project.gallery && project.gallery.length > 0 && (
          <FadeIn delay={0.55}>
            <ProjectGallery gallery={project.gallery} />
          </FadeIn>
        )}

        {project.result && (
          <FadeIn delay={0.6}>
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">Result / Outcome</h2>
              <p>{project.result}</p>
            </section>
          </FadeIn>
        )}

        {project.lessonsLearned && (
          <FadeIn delay={0.65}>
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-4">Lessons Learned</h2>
              <p>{project.lessonsLearned}</p>
            </section>
          </FadeIn>
        )}

        {/* External Links */}
        {(project.liveUrl || project.repositoryUrl || project.documentationUrl) && (
          <FadeIn delay={0.7}>
            <section className="pt-8 border-t border-white/10 flex flex-wrap gap-4">
              {project.liveUrl && (
                <Link
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
                >
                  <Globe className="size-4" />
                  Live Demo
                  <ExternalLink className="size-3 opacity-50" />
                </Link>
              )}
              {project.repositoryUrl && (
                <Link
                  href={project.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
                >
                  <GitHubIcon className="size-4" />
                  GitHub
                  <ExternalLink className="size-3 opacity-50" />
                </Link>
              )}
              {project.documentationUrl && (
                <Link
                  href={project.documentationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50"
                >
                  <FileText className="size-4" />
                  Documentation
                  <ExternalLink className="size-3 opacity-50" />
                </Link>
              )}
            </section>
          </FadeIn>
        )}
      </div>
    </main>
  );
}
