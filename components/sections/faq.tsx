import { Plus } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { site } from "@/content/site";

function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: site.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function FAQ({ id }: { id?: string }) {
  return (
    <section id={id} aria-labelledby="faq-heading" className="bg-bg py-24 md:py-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }}
      />

      <div className="mx-auto max-w-4xl px-6">
        <Reveal>
          <h2
            id="faq-heading"
            className="text-balance text-center text-3xl font-bold tracking-tight text-fg md:text-5xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            Perguntas frequentes
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {site.faq.map((item, index) => (
            <Reveal key={item.question} delay={index * 0.05}>
              <details className="group rounded-3xl bg-surface p-6 open:sm:col-span-2">
                <summary className="flex cursor-pointer list-none items-start gap-4 text-left text-base font-semibold text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
                  <Plus
                    className="mt-0.5 h-5 w-5 shrink-0 text-brand-dark transition-transform group-open:rotate-45"
                    aria-hidden
                  />
                  {item.question}
                </summary>
                <p className="mt-3 pl-9 text-sm leading-relaxed text-fg-muted">{item.answer}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
