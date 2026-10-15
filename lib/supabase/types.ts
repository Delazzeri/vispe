// Tipos do banco escritos à mão a partir de supabase/migrations (0001–0008).
// Depois de criar o projeto, regenerar com:
//   supabase gen types typescript --project-id <ref> > lib/supabase/types.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type ArticleStatus = "draft" | "scheduled" | "published";

type ArticleRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content_md: string;
  content_json: Json | null;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  category: string;
  author: string;
  meta_title: string | null;
  meta_description: string | null;
  status: ArticleStatus;
  published_at: string | null;
  tags: string[];
  faq: Json | null;
  /** Tradução para o inglês (0008); ver lib/blog/localize.ts. */
  en: Json | null;
  created_at: string;
  updated_at: string;
};

export type MaterialStatus = "draft" | "published";

type MaterialRow = {
  id: string;
  slug: string;
  type: string;
  title: string;
  tagline: string;
  headline: string | null;
  description_md: string;
  description_json: Json | null;
  cover_image_url: string | null;
  cover_image_alt: string | null;
  image_url: string | null;
  /** Caminho no bucket privado material-files (só staff e a Edge Function leem). */
  file_path: string | null;
  file_name: string | null;
  file_size: number | null;
  meta_title: string | null;
  meta_description: string | null;
  faq: Json | null;
  status: MaterialStatus;
  sort_order: number;
  published_at: string | null;
  /** Tradução para o inglês (0008); ver lib/materials/localize.ts. */
  en: Json | null;
  created_at: string;
  updated_at: string;
};

type ProfileRow = {
  id: string;
  full_name: string | null;
  role: "admin" | "editor";
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      articles: {
        Row: ArticleRow;
        Insert: Partial<Omit<ArticleRow, "slug" | "title">> & Pick<ArticleRow, "slug" | "title">;
        Update: Partial<ArticleRow>;
        Relationships: [];
      };
      materials: {
        Row: MaterialRow;
        Insert: Partial<Omit<MaterialRow, "slug" | "title">> & Pick<MaterialRow, "slug" | "title">;
        Update: Partial<MaterialRow>;
        Relationships: [];
      };
      profiles: {
        Row: ProfileRow;
        Insert: Partial<Omit<ProfileRow, "id">> & Pick<ProfileRow, "id">;
        Update: Partial<ProfileRow>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

export type ArticleRecord = ArticleRow;
export type MaterialRecord = MaterialRow;
