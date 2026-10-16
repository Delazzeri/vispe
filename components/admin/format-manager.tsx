"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { fetchMaterialFormats, type MaterialFormat } from "@/lib/materials/formats";
import { slugify } from "@/lib/slugify";
import { getSupabase } from "@/lib/supabase/client";
import { adminInput, adminPrimary, adminSecondary } from "./admin-shell";

type FormatDraft = { name: string; nameEn: string; sortOrder: number };

const emptyNew: FormatDraft = { name: "", nameEn: "", sortOrder: 100 };

/** Cadastro dos formatos dos materiais: o seletor do editor e o filtro do catálogo leem daqui. */
export function FormatManager() {
  const [formats, setFormats] = useState<MaterialFormat[]>();
  const [drafts, setDrafts] = useState<Record<string, FormatDraft>>({});
  const [usage, setUsage] = useState<Record<string, number>>({});
  const [created, setCreated] = useState<FormatDraft>(emptyNew);
  const [error, setError] = useState<string>();
  const [notice, setNotice] = useState<string>();
  const [busy, setBusy] = useState<string>();

  useEffect(() => {
    let active = true;
    Promise.all([fetchMaterialFormats(), getSupabase()?.from("materials").select("format")]).then(([result, materials]) => {
      if (!active) return;
      setFormats(result.formats);
      setDrafts(Object.fromEntries(result.formats.map((f) => [f.slug, { name: f.name, nameEn: f.name_en, sortOrder: f.sort_order }])));
      const counts: Record<string, number> = {};
      for (const row of materials?.data ?? []) if (row.format) counts[row.format] = (counts[row.format] ?? 0) + 1;
      setUsage(counts);
      setError(result.error);
    });
    return () => {
      active = false;
    };
  }, []);

  const sorted = (list: MaterialFormat[]) =>
    [...list].sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name, "pt-BR"));

  async function save(slug: string) {
    const draft = drafts[slug];
    if (!draft?.name.trim()) return setError("O nome em português não pode ficar vazio.");
    setBusy(slug);
    setError(undefined);
    const record = { name: draft.name.trim(), name_en: draft.nameEn.trim(), sort_order: draft.sortOrder };
    const { error: saveError } = await getSupabase()!.from("material_formats").update(record).eq("slug", slug);
    setBusy(undefined);
    if (saveError) return setError(`Não foi possível salvar: ${saveError.message}`);
    // O nome em português também fica na coluna type dos materiais (espelho usado no admin).
    await getSupabase()!.from("materials").update({ type: record.name }).eq("format", slug);
    setFormats((list) => sorted((list ?? []).map((f) => (f.slug === slug ? { ...f, ...record } : f))));
    setNotice(`"${record.name}" salvo.`);
  }

  async function remove(format: MaterialFormat) {
    if (usage[format.slug]) return;
    if (!window.confirm(`Excluir o formato "${format.name}"?`)) return;
    setBusy(format.slug);
    const { error: deleteError } = await getSupabase()!.from("material_formats").delete().eq("slug", format.slug);
    setBusy(undefined);
    if (deleteError) {
      const inUse = deleteError.code === "23503";
      return setError(inUse ? "Há materiais usando esse formato: troque o formato deles antes." : deleteError.message);
    }
    setFormats((list) => list?.filter((f) => f.slug !== format.slug));
    setNotice(`"${format.name}" excluído.`);
  }

  async function add(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = created.name.trim();
    const slug = slugify(name, 40);
    if (!name || !slug) return setError("Preencha o nome do formato.");
    if (formats?.some((f) => f.slug === slug)) return setError(`Já existe um formato parecido ("${slug}").`);
    setBusy("new");
    setError(undefined);
    const record = { slug, name, name_en: created.nameEn.trim(), sort_order: created.sortOrder };
    const { error: insertError } = await getSupabase()!.from("material_formats").insert(record);
    setBusy(undefined);
    if (insertError) return setError(`Não foi possível criar: ${insertError.message}`);
    setFormats((list) => sorted([...(list ?? []), record]));
    setDrafts((current) => ({ ...current, [slug]: { name, nameEn: record.name_en, sortOrder: record.sort_order } }));
    setCreated(emptyNew);
    setNotice(`"${name}" criado: já aparece no seletor dos materiais.`);
  }

  const patch = (slug: string, change: Partial<FormatDraft>) =>
    setDrafts((current) => ({ ...current, [slug]: { ...current[slug], ...change } }));

  return (
    <section aria-labelledby="admin-formats">
      <Link href="/admin/materiais/" className="text-sm font-medium text-fg-muted hover:text-fg">
        ← Materiais
      </Link>
      <h1 id="admin-formats" className="mt-3 text-3xl font-bold tracking-tight text-ink">
        Formatos dos materiais
      </h1>
      <p className="mt-1 max-w-2xl text-sm text-fg-muted">
        Aparecem no seletor do editor e viram o filtro do catálogo no site (em inglês, com o nome em inglês). Um formato
        novo entra no filtro do site assim que algum material publicado usar ele.
      </p>

      {error && (
        <p role="alert" className="mt-6 text-sm font-medium text-brand-dark">
          {error}
        </p>
      )}
      {notice && !error && (
        <p role="status" className="mt-6 text-sm font-medium text-fg">
          {notice}
        </p>
      )}

      {!formats ? (
        <p className="mt-8 text-sm text-fg-muted">Carregando…</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-3xl border border-border bg-surface">
          <table className="w-full min-w-2xl text-left text-sm">
            <thead>
              <tr className="border-b border-border text-fg-muted">
                <th scope="col" className="px-5 py-3 font-semibold">Nome (português)</th>
                <th scope="col" className="px-5 py-3 font-semibold">Nome (inglês)</th>
                <th scope="col" className="px-5 py-3 font-semibold">Ordem</th>
                <th scope="col" className="px-5 py-3 font-semibold">Materiais</th>
                <th scope="col" className="px-5 py-3 font-semibold">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {formats.map((format) => {
                const draft = drafts[format.slug];
                if (!draft) return null;
                const changed =
                  draft.name !== format.name || draft.nameEn !== format.name_en || draft.sortOrder !== format.sort_order;
                return (
                  <tr key={format.slug}>
                    <td className="px-5 py-3">
                      <input
                        aria-label={`Nome em português de ${format.name}`}
                        value={draft.name}
                        onChange={(e) => patch(format.slug, { name: e.target.value })}
                        className={adminInput}
                      />
                      <span className="mt-1 block text-xs text-fg-muted">?formato={format.slug}</span>
                    </td>
                    <td className="px-5 py-3">
                      <input
                        aria-label={`Nome em inglês de ${format.name}`}
                        value={draft.nameEn}
                        placeholder={format.name}
                        onChange={(e) => patch(format.slug, { nameEn: e.target.value })}
                        className={adminInput}
                      />
                    </td>
                    <td className="w-28 px-5 py-3">
                      <input
                        type="number"
                        aria-label={`Ordem de ${format.name}`}
                        value={draft.sortOrder}
                        onChange={(e) => patch(format.slug, { sortOrder: Number(e.target.value) || 0 })}
                        className={adminInput}
                      />
                    </td>
                    <td className="px-5 py-3 text-fg-muted">{usage[format.slug] ?? 0}</td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => save(format.slug)}
                          disabled={!changed || busy === format.slug}
                          className={adminSecondary}
                        >
                          Salvar
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(format)}
                          disabled={Boolean(usage[format.slug]) || busy === format.slug}
                          title={usage[format.slug] ? "Em uso: troque o formato dos materiais antes" : undefined}
                          className={adminSecondary}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <form onSubmit={add} className="mt-8 rounded-3xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold text-ink">Novo formato</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_1fr_8rem_auto] sm:items-end">
          <label className="block text-sm font-medium text-fg">
            Nome (português)
            <input
              value={created.name}
              onChange={(e) => setCreated({ ...created, name: e.target.value })}
              placeholder="Ex.: Vídeo"
              className={adminInput}
            />
          </label>
          <label className="block text-sm font-medium text-fg">
            Nome (inglês)
            <input
              value={created.nameEn}
              onChange={(e) => setCreated({ ...created, nameEn: e.target.value })}
              placeholder="Ex.: Video"
              className={adminInput}
            />
          </label>
          <label className="block text-sm font-medium text-fg">
            Ordem
            <input
              type="number"
              value={created.sortOrder}
              onChange={(e) => setCreated({ ...created, sortOrder: Number(e.target.value) || 0 })}
              className={adminInput}
            />
          </label>
          <button type="submit" disabled={busy === "new"} className={adminPrimary}>
            Adicionar
          </button>
        </div>
      </form>
    </section>
  );
}
