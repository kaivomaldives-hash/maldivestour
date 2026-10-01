-- Chinese homepage/maldives-hub page_translations (phase 6, final phase of the
-- "all six languages" rollout) -- same two page_key rows and fields as the
-- German/Spanish/Italian/Russian/Japanese versions, original Chinese copy
-- written to the same section structure ui-strings.ts's new ZH block renders.
insert into page_translations
  (page_key, locale, slug, title, meta_title, meta_description, hero_heading, hero_intro, sections, translation_status, translated_by)
values
  (
    'homepage',
    'zh',
    '',
    '马尔代夫旅行指南',
    '马尔代夫旅行指南：旅行、度假村和活动 | MTG',
    '您的独立马尔代夫旅行指南——岛屿、度假村、潜水、钓鱼和接送服务指南，提供真实、经过核实的信息，而非宣传文案。',
    '您的独立马尔代夫旅行指南',
    '借助经过核实的岛屿、度假村、潜水游艇、深海钓鱼和接送服务信息，规划您的马尔代夫假期——独立调查，不接受酒店付费推广。',
    '{}'::jsonb,
    'published',
    'claude'
  ),
  (
    'maldives-hub',
    'zh',
    'maldives-zh',
    '马尔代夫',
    '马尔代夫旅行：环礁、岛屿和活动 | MTG',
    '探索马尔代夫的环礁和岛屿——独立的度假村、潜水、钓鱼、冲浪和接送服务指南，助您规划行程。',
    '探索马尔代夫',
    '从北部环礁到南部——这里有关于马尔代夫岛屿、活动和接送服务的独立指南。',
    '{}'::jsonb,
    'published',
    'claude'
  )
on conflict (page_key, locale) do update set
  slug = excluded.slug, title = excluded.title, meta_title = excluded.meta_title, meta_description = excluded.meta_description,
  hero_heading = excluded.hero_heading, hero_intro = excluded.hero_intro, translation_status = excluded.translation_status,
  translated_by = excluded.translated_by, updated_at = now();
