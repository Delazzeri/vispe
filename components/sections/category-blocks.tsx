import { Reveal } from "@/components/motion/reveal";
import { Widget } from "@/components/showcase/widgets/widgets";
import { useFinWall } from "@/content/fin-wall";
import { useSite } from "@/content/site";

export function CategoryBlocks({ id }: { id?: string }) {
  const site = useSite();
  const finWall = useFinWall();
  const { title, description } = site.categoryBlocks;

  return (
    <section id={id} aria-labelledby="category-blocks-heading" className="bg-bg pt-24 pb-12 md:pt-32 md:pb-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <h2
              id="category-blocks-heading"
              className="text-balance text-3xl font-bold tracking-tight text-ink md:text-[48px] md:leading-[48px]"
              style={{ letterSpacing: "-0.05em" }}
            >
              {title}
            </h2>
          </Reveal>

          <Reveal delay={0.05}>
            <p className="mt-5 text-balance text-lg text-fg-muted">{description}</p>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {site.services.map((service, index) => {
            return (
              <Reveal key={service.slug} delay={index * 0.06}>
                <article className="h-full rounded-3xl bg-surface p-8 shadow-[0_1px_2px_rgba(38,38,38,0.04),0_4px_12px_-4px_rgba(38,38,38,0.1)]">
                  {/* Tipografia medida no título/resumo das categorias da referência: 24/24 e 16/22.4, preto. */}
                  <h3 className="text-2xl leading-6 font-bold text-ink" style={{ letterSpacing: "-0.05em" }}>
                    {service.name}
                  </h3>
                  <p className="mt-3 text-base text-ink" style={{ lineHeight: 1.4 }}>
                    {service.description}
                  </p>
                  <p className="mt-3 text-base text-ink" style={{ lineHeight: 1.4 }}>
                    <span className="font-semibold">{site.ui.includes} </span>
                    {service.includes.join(", ")}
                  </p>

                  {/* Widgets ilustrativos da 24 Fin (decorativos), em preto sólido. */}
                  <div aria-hidden className="mt-6 flex flex-wrap gap-3">
                    {service.finWidgets.map((widgetId) => {
                      const widget = finWall.find((w) => w.id === widgetId);
                      return widget ? <Widget key={widgetId} widget={widget} solid /> : null;
                    })}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
