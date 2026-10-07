import { Reveal } from "@/components/motion/reveal";
import { LinkedWidgets } from "@/components/showcase/widgets/linked";
import { linkedModelBySlug } from "@/components/showcase/widgets/models";
import { hasInteractiveVersion, Widget } from "@/components/showcase/widgets/widgets";
import { useFinWall, type FinWidget } from "@/content/fin-wall";
import { useSite } from "@/content/site";
import { cn } from "@/lib/cn";

/** Widgets largos que cabem no celular sem passar de 2 linhas (com o zoom de 70%). */
const maxWideOnMobile = 2;

/**
 * Ids dos widgets escondidos no celular: além dos pequenos, ficam no máximo
 * `maxWideOnMobile` largos, priorizando os interativos e depois a ordem do card.
 */
function hiddenOnMobile(widgets: readonly FinWidget[]) {
  const wide = widgets.filter((widget) => widget.size !== "s");
  const kept = [...wide.filter(hasInteractiveVersion), ...wide.filter((widget) => !hasInteractiveVersion(widget))].slice(
    0,
    maxWideOnMobile,
  );
  return new Set(wide.filter((widget) => !kept.includes(widget)).map((widget) => widget.id));
}

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
            const widgets = service.finWidgets.flatMap((widgetId) => finWall.filter((w) => w.id === widgetId));
            const hidden = hiddenOnMobile(widgets);
            const modelId = linkedModelBySlug[service.slug];
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
                    {site.ui.includes}{" "}
                    {service.includes.join(", ")}
                  </p>

                  {/* Widgets ilustrativos do Fin 24/7, em preto sólido. Os decorativos
                      ficam fora da árvore de acessibilidade; os interativos não. */}
                  {/* No celular, zoom (que também encolhe o espaço ocupado, ao contrário
                      de scale) deixa os widgets menores e cabendo em até 2 linhas. */}
                  <div className="mt-6 flex flex-wrap gap-3 max-md:[zoom:0.7]">
                    {modelId ? (
                      // Card com cálculo: os widgets "controle" recalculam os demais.
                      <LinkedWidgets
                        modelId={modelId}
                        widgets={widgets}
                        hiddenOnMobile={[...hidden]}
                        labels={{ adjust: site.ui.widgetAdjust, cycle: site.ui.widgetCycle }}
                      />
                    ) : (
                      widgets.map((widget) => {
                      const interactive = hasInteractiveVersion(widget);
                      return (
                        <div
                          key={widget.id}
                          aria-hidden={!interactive || undefined}
                          className={cn("contents", hidden.has(widget.id) && "max-md:hidden")}
                        >
                          <Widget widget={widget} solid interactive={interactive} />
                        </div>
                      );
                    })
                    )}
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
