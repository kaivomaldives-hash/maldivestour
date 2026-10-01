"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { CategoryPicker } from "@/components/admin/category-picker";
import { DeleteNodeButton } from "@/components/admin/delete-node-button";
import { NodeMediaManager } from "@/components/admin/node-media-manager";
import { Button } from "@/components/ui/button";
import { createArticle, updateArticle } from "@/lib/admin/articles-actions";
import type { ArticleFieldsAdmin } from "@/lib/admin/articles-repository";
import type { NodeCoreInput, NodeStatus } from "@/lib/admin/node-actions";
import { NODE_STATUSES } from "@/lib/admin/node-status";
import { setNodeCategories } from "@/lib/admin/node-relations-actions";
import type { CategoryOption } from "@/lib/admin/node-relations-repository";
import type { NodeMediaItem } from "@/lib/media/types";

export interface ArticleFormInitial {
  id: string;
  core: NodeCoreInput;
  fields: ArticleFieldsAdmin;
  categoryId: string | null;
  media: NodeMediaItem[];
}

const EMPTY_CORE: NodeCoreInput = { title: "", slug: "", summary: null, status: "draft", metaTitle: null, metaDescription: null };
const EMPTY_FIELDS: ArticleFieldsAdmin = { body: "", readingTimeMinutes: null, videoYoutubeId: null };

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ArticleForm({ initial, categoryOptions }: { initial?: ArticleFormInitial; categoryOptions: CategoryOption[] }) {
  const router = useRouter();
  const [core, setCore] = useState<NodeCoreInput>(initial?.core ?? EMPTY_CORE);
  const [fields, setFields] = useState<ArticleFieldsAdmin>(initial?.fields ?? EMPTY_FIELDS);
  const [categoryId, setCategoryId] = useState<string | null>(initial?.categoryId ?? null);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const wasPublished = initial?.core.status === "published";
  const slugChanged = initial ? core.slug !== initial.core.slug : false;

  function save() {
    setError(null);
    startTransition(async () => {
      const result = initial ? await updateArticle(initial.id, core, fields) : await createArticle(core, fields);
      if (!result.ok) {
        setError(result.error ?? "Something went wrong.");
        return;
      }
      const id = initial?.id ?? (result as { id?: string }).id;
      if (id && categoryId) {
        await setNodeCategories(id, [categoryId], `/admin/articles/${id}`);
      }
      if (initial) {
        router.push("/admin/articles");
      } else {
        router.push(id ? `/admin/articles/${id}` : "/admin/articles");
      }
      router.refresh();
    });
  }

  return (
    <div className="max-w-2xl space-y-6">
      <section className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Basics</h2>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Title *</span>
          <input
            value={core.title}
            onChange={(e) => {
              const title = e.target.value;
              setCore((c) => ({ ...c, title, slug: slugTouched ? c.slug : slugify(title) }));
            }}
            className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Slug *</span>
          <input
            value={core.slug}
            onChange={(e) => {
              setSlugTouched(true);
              setCore((c) => ({ ...c, slug: e.target.value }));
            }}
            className="w-full rounded-xl border border-neutral-300 px-3 py-2 font-mono text-sm focus:border-maldives-500 focus:outline-none"
          />
          {wasPublished && slugChanged && (
            <p className="mt-1 text-xs text-amber-600">
              This is published — changing the slug will break its current URL for anyone who already linked to it. No redirect is created
              automatically; add one in Redirects if needed.
            </p>
          )}
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Summary</span>
          <textarea
            value={core.summary ?? ""}
            onChange={(e) => setCore((c) => ({ ...c, summary: e.target.value }))}
            rows={3}
            className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm focus:border-maldives-500 focus:outline-none"
          />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Status</span>
          <select
            value={core.status}
            onChange={(e) => setCore((c) => ({ ...c, status: e.target.value as NodeStatus }))}
            className="rounded-xl border border-neutral-300 px-3 py-2 text-sm"
          >
            {NODE_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <CategoryPicker
          label="Category"
          options={categoryOptions}
          selectedIds={categoryId ? [categoryId] : []}
          onChange={(ids) => setCategoryId(ids.length > 0 ? ids[ids.length - 1] : null)}
        />
      </section>

      <section className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Content</h2>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Body (HTML) *</span>
          <textarea
            value={fields.body}
            onChange={(e) => setFields((f) => ({ ...f, body: e.target.value }))}
            rows={20}
            className="w-full rounded-xl border border-neutral-300 px-3 py-2 font-mono text-xs focus:border-maldives-500 focus:outline-none"
          />
          <p className="mt-1 text-xs text-neutral-500">
            Raw HTML, rendered as-is on the public page. Image <code>src</code> values that are storage paths (not full URLs) are resolved to public Storage
            URLs automatically at render time.
          </p>
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Reading time (minutes)</span>
          <input
            type="number"
            min={0}
            value={fields.readingTimeMinutes ?? ""}
            onChange={(e) => setFields((f) => ({ ...f, readingTimeMinutes: e.target.value ? Number(e.target.value) : null }))}
            className="w-32 rounded-xl border border-neutral-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">YouTube video ID</span>
          <input
            value={fields.videoYoutubeId ?? ""}
            onChange={(e) => setFields((f) => ({ ...f, videoYoutubeId: e.target.value || null }))}
            placeholder="e.g. CZGxcfCXJz0"
            className="w-full max-w-xs rounded-xl border border-neutral-300 px-3 py-2 text-sm"
          />
        </label>
      </section>

      <section className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">SEO</h2>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Meta title</span>
          <input
            value={core.metaTitle ?? ""}
            onChange={(e) => setCore((c) => ({ ...c, metaTitle: e.target.value }))}
            className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Meta description</span>
          <textarea
            value={core.metaDescription ?? ""}
            onChange={(e) => setCore((c) => ({ ...c, metaDescription: e.target.value }))}
            rows={2}
            className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
          />
        </label>
      </section>

      {initial && <NodeMediaManager nodeId={initial.id} items={initial.media} revalidatePath={`/admin/articles/${initial.id}`} />}

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button onClick={save} disabled={isPending}>
          {isPending ? "Saving…" : initial ? "Save changes" : "Create article"}
        </Button>
        {initial && <DeleteNodeButton nodeId={initial.id} redirectTo="/admin/articles" />}
      </div>
    </div>
  );
}
