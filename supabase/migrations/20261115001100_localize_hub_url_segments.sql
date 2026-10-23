-- Task 22 (localized hub URL segments): fixes two gaps in
-- page_translations.slug now that these words are actually read for
-- routing (via src/lib/i18n/hub-paths.ts / next.config.ts rewrites),
-- not just stored for documentation as before.
--
-- 1. maldives-hub's ja/zh rows were seeded with placeholder slugs
--    ("maldives-ja"/"maldives-zh") rather than real localized words --
--    harmless while the column was unused, a real bug now that it
--    (well, the hardcoded mirror of it) drives the live URL.
-- 2. travel-guide-hub never got page_translations rows at all (that
--    page is UI-strings-only, no DB read) -- added here so the column
--    documents the real URL segment, same as every other hub.
--
-- Already applied directly against the live DB; this migration keeps
-- a from-scratch replay in sync.
update page_translations set slug = 'morudibu', updated_at = now() where page_key = 'maldives-hub' and locale = 'ja';
update page_translations set slug = 'maerdaifu', updated_at = now() where page_key = 'maldives-hub' and locale = 'zh';

insert into page_translations (page_key, locale, slug, title, meta_title, meta_description, hero_heading, hero_intro, sections, translation_status, translated_by) values
('travel-guide-hub', 'de', 'reisefuehrer', 'Malediven Reiseführer', 'Malediven Reiseführer | MTG', 'Echte, ausführliche Guides zu den Inseln, Atollen, dem Tauchen, dem Wetter und der Kultur der Malediven.', 'Malediven Reiseführer', 'Echte, ausführliche Guides zu den Inseln, Atollen, dem Tauchen, dem Wetter und der Kultur der Malediven.', '{}'::jsonb, 'published', 'claude'),
('travel-guide-hub', 'es', 'guia-de-viaje', 'Guía de Viaje a Maldivas', 'Guía de Viaje a Maldivas | MTG', 'Guías reales y detalladas sobre las islas, atolones, buceo, clima y cultura de Maldivas.', 'Guía de Viaje a Maldivas', 'Guías reales y detalladas sobre las islas, atolones, buceo, clima y cultura de Maldivas.', '{}'::jsonb, 'published', 'claude'),
('travel-guide-hub', 'it', 'guida-di-viaggio', 'Guida di Viaggio alle Maldive', 'Guida di Viaggio alle Maldive | MTG', 'Guide reali e approfondite sulle isole, gli atolli, le immersioni, il clima e la cultura delle Maldive.', 'Guida di Viaggio alle Maldive', 'Guide reali e approfondite sulle isole, gli atolli, le immersioni, il clima e la cultura delle Maldive.', '{}'::jsonb, 'published', 'claude'),
('travel-guide-hub', 'ru', 'putevoditel', 'Путеводитель по Мальдивам', 'Путеводитель по Мальдивам | MTG', 'Настоящие, подробные материалы об островах, атоллах, дайвинге, погоде и культуре Мальдив.', 'Путеводитель по Мальдивам', 'Настоящие, подробные материалы об островах, атоллах, дайвинге, погоде и культуре Мальдив.', '{}'::jsonb, 'published', 'claude'),
('travel-guide-hub', 'ja', 'ryokou-gaido', 'モルディブ旅行ガイド', 'モルディブ旅行ガイド | MTG', 'モルディブの島、環礁、ダイビング、気候、文化についての本物の詳細な記事。', 'モルディブ旅行ガイド', 'モルディブの島、環礁、ダイビング、気候、文化についての本物の詳細な記事。', '{}'::jsonb, 'published', 'claude'),
('travel-guide-hub', 'zh', 'lvyou-zhinan', '马尔代夫旅行指南', '马尔代夫旅行指南 | MTG', '关于马尔代夫岛屿、环礁、潜水、天气和文化的真实深度指南。', '马尔代夫旅行指南', '关于马尔代夫岛屿、环礁、潜水、天气和文化的真实深度指南。', '{}'::jsonb, 'published', 'claude')
on conflict (page_key, locale) do update set
  slug = excluded.slug, title = excluded.title, meta_title = excluded.meta_title, meta_description = excluded.meta_description,
  hero_heading = excluded.hero_heading, hero_intro = excluded.hero_intro, translation_status = excluded.translation_status,
  translated_by = excluded.translated_by, updated_at = now();
