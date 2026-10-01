-- Italian homepage/maldives-hub page_translations (phase 3 of the "all
-- six languages" rollout) -- same two page_key rows and fields as the
-- German/Spanish versions, original Italian copy written to the same
-- section structure ui-strings.ts's new IT block already renders.
insert into page_translations
  (page_key, locale, slug, title, meta_title, meta_description, hero_heading, hero_intro, sections, translation_status, translated_by)
values
  (
    'homepage',
    'it',
    '',
    'Guida di Viaggio alle Maldive',
    'Guida di Viaggio alle Maldive: Viaggi, Resort e Attività | MTG',
    'La tua guida indipendente alle Maldive: guide sulle isole, resort, immersioni, pesca e trasferimenti — con informazioni reali e verificate, non testi pubblicitari.',
    'La tua guida di viaggio indipendente alle Maldive',
    'Pianifica la tua vacanza alle Maldive con informazioni verificate su isole, resort, crociere subacquee, pesca d''altura e trasferimenti — ricercate in modo indipendente, non pagate dagli hotel.',
    '{}'::jsonb,
    'published',
    'claude'
  ),
  (
    'maldives-hub',
    'it',
    'maldive',
    'Maldive',
    'Viaggi alle Maldive: Atolli, Isole e Attività | MTG',
    'Scopri gli atolli e le isole delle Maldive — con guide indipendenti su resort, immersioni, pesca, surf e trasferimenti per pianificare il tuo viaggio.',
    'Scopri le Maldive',
    'Dagli atolli settentrionali fino al sud: qui trovi guide indipendenti su isole, attività e trasferimenti alle Maldive.',
    '{}'::jsonb,
    'published',
    'claude'
  )
on conflict (page_key, locale) do update set
  slug = excluded.slug, title = excluded.title, meta_title = excluded.meta_title, meta_description = excluded.meta_description,
  hero_heading = excluded.hero_heading, hero_intro = excluded.hero_intro, translation_status = excluded.translation_status,
  translated_by = excluded.translated_by, updated_at = now();
