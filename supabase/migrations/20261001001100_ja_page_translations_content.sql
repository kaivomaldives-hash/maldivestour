-- Japanese homepage/maldives-hub page_translations (phase 5 of the "all
-- six languages" rollout) -- same two page_key rows and fields as the
-- German/Spanish/Italian/Russian versions, original Japanese copy written
-- to the same section structure ui-strings.ts's new JA block already renders.
insert into page_translations
  (page_key, locale, slug, title, meta_title, meta_description, hero_heading, hero_intro, sections, translation_status, translated_by)
values
  (
    'homepage',
    'ja',
    '',
    'モルディブ旅行ガイド',
    'モルディブ旅行ガイド：旅行、リゾート、アクティビティ | MTG',
    'モルディブの独立系旅行ガイド――島、リゾート、ダイビング、フィッシング、送迎について、宣伝文句ではなく本物の検証済み情報をお届けします。',
    'あなたのための独立系モルディブ旅行ガイド',
    '島、リゾート、ダイブサファリ、深海フィッシング、送迎について検証済みの情報でモルディブ旅行を計画しましょう――ホテルから報酬を受け取らず独立して調査しています。',
    '{}'::jsonb,
    'published',
    'claude'
  ),
  (
    'maldives-hub',
    'ja',
    'maldives-ja',
    'モルディブ',
    'モルディブ旅行：環礁、島、アクティビティ | MTG',
    'モルディブの環礁と島を発見しましょう――旅行計画に役立つ、リゾート、ダイビング、フィッシング、サーフィン、送迎の独立系ガイド付き。',
    'モルディブを発見する',
    '北部の環礁から南部まで――モルディブの島、アクティビティ、送迎に関する独立系ガイドがここにあります。',
    '{}'::jsonb,
    'published',
    'claude'
  )
on conflict (page_key, locale) do update set
  slug = excluded.slug, title = excluded.title, meta_title = excluded.meta_title, meta_description = excluded.meta_description,
  hero_heading = excluded.hero_heading, hero_intro = excluded.hero_intro, translation_status = excluded.translation_status,
  translated_by = excluded.translated_by, updated_at = now();
