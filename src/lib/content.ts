import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import type { ComponentType } from "react";
import type { MDXProps } from "mdx/types";
import type { Locale } from "@/i18n/routing";

type MdxContent = ComponentType<MDXProps>;

export type CaseFlowStep = {
  image: string;
  device: "desktop" | "mobile";
  caption: string;
};

export type CaseStatus = "inDevelopment";

export type CaseStudyMeta = {
  slug: string;
  title: string;
  name: string;
  kind: string;
  client: string;
  url: string;
  live?: boolean;
  listed?: boolean;
  status?: CaseStatus;
  year: number;
  summary: string;
  stack: string[];
  image: string;
  order: number;
  flow?: { title: string; caption: string; steps: CaseFlowStep[] };
};

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  updated?: string;
  summary: string;
  sources?: { title: string; url: string }[];
};

type MdxModule<Meta> = { default: MdxContent; metadata: Omit<Meta, "slug"> };

const CONTENT_ROOT = path.join(process.cwd(), "content");

async function listSlugs(dir: string, locale: Locale): Promise<string[]> {
  const suffix = `.${locale}.mdx`;
  const files = await readdir(path.join(CONTENT_ROOT, dir));
  return files
    .filter((file) => file.endsWith(suffix))
    .map((file) => file.slice(0, -suffix.length));
}

export async function getCaseStudy(slug: string, locale: Locale) {
  const mod: MdxModule<CaseStudyMeta> = await import(
    `../../content/realisations/${slug}.${locale}.mdx`
  );
  return { meta: { slug, ...mod.metadata }, Content: mod.default };
}

export async function getPost(slug: string, locale: Locale) {
  const mod: MdxModule<PostMeta> = await import(
    `../../content/blog/${slug}.${locale}.mdx`
  );
  return { meta: { slug, ...mod.metadata }, Content: mod.default };
}

const METADATA_EXPORT = /^export const metadata = \{[\s\S]*?^\};?$/m;
const MDX_COMMENT = /\{\/\*[\s\S]*?\*\/\}/g;

export async function getMdxBody(
  dir: "realisations" | "blog",
  slug: string,
  locale: Locale,
): Promise<string> {
  const source = await readFile(
    path.join(CONTENT_ROOT, dir, `${slug}.${locale}.mdx`),
    "utf8",
  );
  return source.replace(METADATA_EXPORT, "").replace(MDX_COMMENT, "").trim();
}

export async function getCaseStudies(locale: Locale): Promise<CaseStudyMeta[]> {
  const slugs = await listSlugs("realisations", locale);
  const studies = await Promise.all(
    slugs.map((slug) => getCaseStudy(slug, locale)),
  );
  return studies
    .map((s) => s.meta)
    .filter((meta) => meta.listed !== false)
    .sort((a, b) => a.order - b.order);
}

export async function getPosts(locale: Locale): Promise<PostMeta[]> {
  const slugs = await listSlugs("blog", locale);
  const posts = await Promise.all(slugs.map((slug) => getPost(slug, locale)));
  return posts.map((p) => p.meta).sort((a, b) => b.date.localeCompare(a.date));
}

const WORDS_PER_MINUTE = 200;

export function readingMinutes(body: string): number {
  const words = body.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
