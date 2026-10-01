-- First Spanish content (phase 2 of the "all six languages" rollout):
-- homepage and /maldives hub page_translations rows, mirroring exactly
-- what 20250211000100 did for German -- same two page_key rows, same
-- fields, original Spanish copy (not a literal machine translation of the
-- English strings) written to the same section structure the [locale]
-- homepage/hub pages already render via ui-strings.ts's new ES block.
insert into page_translations
  (page_key, locale, slug, title, meta_title, meta_description, hero_heading, hero_intro, sections, translation_status, translated_by)
values
  (
    'homepage',
    'es',
    '',
    'Guía de Viaje a Maldivas',
    'Guía de Viaje a Maldivas: Viajes, Resorts y Actividades | MTG',
    'Tu guía independiente de Maldivas: guías de islas, resorts, buceo, pesca y traslados — con información real y verificada, no textos publicitarios.',
    'Tu guía independiente de viaje a Maldivas',
    'Planifica tus vacaciones en Maldivas con información verificada sobre islas, resorts, cruceros de buceo, pesca de altura y traslados — investigado de forma independiente, no pagado por hoteles.',
    '{}'::jsonb,
    'published',
    'claude'
  ),
  (
    'maldives-hub',
    'es',
    'maldivas',
    'Maldivas',
    'Viajes a Maldivas: Atolones, Islas y Actividades | MTG',
    'Descubre los atolones e islas de Maldivas — con guías independientes sobre resorts, buceo, pesca, surf y traslados para planificar tu viaje.',
    'Descubre Maldivas',
    'Desde los atolones del norte hasta el sur: aquí encontrarás guías independientes sobre islas, actividades y traslados en Maldivas.',
    '{}'::jsonb,
    'published',
    'claude'
  )
on conflict (page_key, locale) do update set
  slug = excluded.slug, title = excluded.title, meta_title = excluded.meta_title, meta_description = excluded.meta_description,
  hero_heading = excluded.hero_heading, hero_intro = excluded.hero_intro, translation_status = excluded.translation_status,
  translated_by = excluded.translated_by, updated_at = now();
