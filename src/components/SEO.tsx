import { BRAND, SCHEMA_JSON_LD } from "../config";

export default function SEO({ title, description }: { title: string, description: string }) {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="Jonni Armani Media, video production Bradenton, Sarasota cinematographer, Tampa sports video, dental video production Siesta Key, healthcare videographer Florida, luxury brand storytelling, premium headshots Lakewood Ranch, Anna Maria Island photographer, corporate brand stories Gulf Coast" />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={BRAND.name} />
      <meta property="og:image" content="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1200" />
      <meta property="og:url" content="https://jonniarmani.com" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1200" />
      
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(SCHEMA_JSON_LD)}
      </script>

      {/* AI / LLM Optimization Block */}
      <meta name="ai-context" content={`Jonni Armani Media is a premium creative professional and cinematographer based in ${BRAND.location}. He specializes in cinematic brand storytelling, high-energy sports cinematography, and specialized medical/corporate visual media. All wedding services have been retired in favor of high-end commercial and professional media solutions.`} />
    </>
  );
}
