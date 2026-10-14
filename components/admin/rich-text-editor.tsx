"use client";

import { EditorContent, useEditor, type Editor, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown, type MarkdownStorage } from "tiptap-markdown";
import { cn } from "@/lib/cn";

export type RichTextValue = { markdown: string; json: JSONContent };

type RichTextEditorProps = {
  /** Documento salvo do Tiptap (preferido) ou, sem ele, o Markdown. */
  initialJson?: JSONContent | null;
  initialMarkdown: string;
  onChange: (value: RichTextValue) => void;
};

const markdownOf = (editor: Editor) =>
  (editor.storage as unknown as { markdown: MarkdownStorage }).markdown.getMarkdown();

function ToolbarButton({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-lg px-2.5 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark",
        active ? "bg-ink text-paper" : "text-fg hover:bg-bg",
      )}
    >
      {children}
    </button>
  );
}

/**
 * Editor do corpo do artigo. Só o que o site sabe exibir: subtítulos (h2/h3),
 * negrito, itálico, listas, destaque (citação) e links. Salva o Markdown (o que
 * o site renderiza) e o JSON do Tiptap (para reabrir igual no editor).
 */
export function RichTextEditor({ initialJson, initialMarkdown, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        code: false,
        codeBlock: false,
        strike: false,
        underline: false,
        horizontalRule: false,
        link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
      }),
      Markdown.configure({ html: false, tightLists: true, transformPastedText: true, linkify: true }),
    ],
    content: initialJson ?? initialMarkdown,
    editorProps: {
      attributes: {
        class: "article-body min-h-96 px-5 py-4 focus-visible:outline-none",
        "aria-label": "Conteúdo do artigo",
      },
    },
    onUpdate: ({ editor: current }) => onChange({ markdown: markdownOf(current), json: current.getJSON() }),
  });

  if (!editor) return <div className="min-h-96 rounded-2xl border border-border bg-surface" />;

  function setLink() {
    const previous = editor?.getAttributes("link").href as string | undefined;
    const href = window.prompt("Endereço do link (interno: /contato, /#servicos, /blog/slug · externo: https://…). Vazio remove.", previous ?? "");
    if (href === null) return;
    const chain = editor!.chain().focus().extendMarkRange("link");
    if (href.trim() === "") chain.unsetLink().run();
    else chain.setLink({ href: href.trim() }).run();
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface focus-within:ring-2 focus-within:ring-brand-dark">
      <div role="toolbar" aria-label="Formatação" className="flex flex-wrap gap-1 border-b border-border bg-surface p-2">
        <ToolbarButton label="Parágrafo" active={editor.isActive("paragraph")} onClick={() => editor.chain().focus().setParagraph().run()}>
          P
        </ToolbarButton>
        <ToolbarButton label="Subtítulo (H2)" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </ToolbarButton>
        <ToolbarButton label="Subtítulo menor (H3)" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          H3
        </ToolbarButton>
        <span aria-hidden className="mx-1 w-px bg-border" />
        <ToolbarButton label="Negrito" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton label="Itálico" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton label="Link" active={editor.isActive("link")} onClick={setLink}>
          Link
        </ToolbarButton>
        <span aria-hidden className="mx-1 w-px bg-border" />
        <ToolbarButton label="Lista" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          • Lista
        </ToolbarButton>
        <ToolbarButton label="Lista numerada" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          1. Lista
        </ToolbarButton>
        <ToolbarButton label="Frase em destaque" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          Destaque
        </ToolbarButton>
        <span aria-hidden className="mx-1 w-px bg-border" />
        <ToolbarButton label="Desfazer" onClick={() => editor.chain().focus().undo().run()}>
          ↶
        </ToolbarButton>
        <ToolbarButton label="Refazer" onClick={() => editor.chain().focus().redo().run()}>
          ↷
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
