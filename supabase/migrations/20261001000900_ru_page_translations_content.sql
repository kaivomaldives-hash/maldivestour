-- First Russian content (phase 4 of the "all six languages" rollout):
-- homepage and /maldives hub page_translations rows, same shape and
-- fields as the German/Spanish/Italian versions, original Russian copy
-- written to the section structure ui-strings.ts's new RU block renders.
insert into page_translations
  (page_key, locale, slug, title, meta_title, meta_description, hero_heading, hero_intro, sections, translation_status, translated_by)
values
  (
    'homepage',
    'ru',
    '',
    'Путеводитель по Мальдивам',
    'Путеводитель по Мальдивам: путешествия, курорты и активности | MTG',
    'Ваш независимый путеводитель по Мальдивам: гиды по островам, курортам, дайвингу, рыбалке и трансферам — с реальной, проверенной информацией, а не рекламными текстами.',
    'Ваш независимый путеводитель по Мальдивам',
    'Планируйте отпуск на Мальдивах с проверенной информацией об островах, курортах, дайв-сафари, глубоководной рыбалке и трансферах — исследовано независимо, без оплаты со стороны отелей.',
    '{}'::jsonb,
    'published',
    'claude'
  ),
  (
    'maldives-hub',
    'ru',
    'maldivy',
    'Мальдивы',
    'Путешествие на Мальдивы: атоллы, острова и активности | MTG',
    'Откройте для себя атоллы и острова Мальдив — с независимыми гидами по курортам, дайвингу, рыбалке, сёрфингу и трансферам для планирования поездки.',
    'Откройте для себя Мальдивы',
    'От северных атоллов до южных: здесь вы найдёте независимые гиды по островам, активностям и трансферам на Мальдивах.',
    '{}'::jsonb,
    'published',
    'claude'
  )
on conflict (page_key, locale) do update set
  slug = excluded.slug, title = excluded.title, meta_title = excluded.meta_title, meta_description = excluded.meta_description,
  hero_heading = excluded.hero_heading, hero_intro = excluded.hero_intro, translation_status = excluded.translation_status,
  translated_by = excluded.translated_by, updated_at = now();
