import type { ProjectMedia } from "@/lib/projects-content"

export function ProjectGallery({ gallery }: { gallery: ProjectMedia[] }) {
  if (!gallery || gallery.length === 0) return null

  return (
    <div className="mt-16 space-y-6">
      <h3 className="text-xl font-bold tracking-tight text-white/90">Project Gallery</h3>
      <div className="grid gap-6">
        {gallery.map((media) => (
          <figure key={media.displayOrder} className="overflow-hidden rounded-lg border border-white/10 bg-white/5 p-2 transition-colors hover:border-white/20">
            <a 
              href={media.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block rounded outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-blue-500/50" 
              aria-label={`View full image: ${media.alt}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={media.url}
                alt={media.alt}
                className="w-full h-auto object-contain rounded"
              />
            </a>
            {media.caption && (
              <figcaption className="mt-3 px-2 pb-1 text-sm text-zinc-400">
                {media.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </div>
  )
}
