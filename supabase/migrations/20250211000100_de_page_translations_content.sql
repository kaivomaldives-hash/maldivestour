-- Task 19: first real, published German content.
--
-- The [locale] route tree and page_translations schema already exist
-- (20250210000100) but carried zero actual content rows -- every /de/
-- URL 404'd. This migration publishes exactly two pages: the homepage
-- and the /maldives hub. Per the task's explicit scope ("10 strong
-- German pages better than 10,000 thin ones"), no other page_key gets a
-- German row here -- everything else stays translation_status='draft'
-- or simply absent, which the [locale] routes already treat as 404
-- rather than serving thin/fallback English content under a German URL.
--
-- Copy is original German writing built around the real, web-researched
-- terms in data/maldives/i18n/keyword-research.json (see SOURCES.md for
-- the two dated queries behind them) -- not a machine translation of the
-- English homepage strings.

insert into page_translations
  (page_key, locale, slug, title, meta_title, meta_description, hero_heading, hero_intro, sections, translation_status, translated_by)
values
  (
    'homepage',
    'de',
    '',
    'Malediven Reiseführer',
    'Malediven Reiseführer: Reisen, Resorts & Aktivitäten | MTG',
    'Ihr unabhängiger Malediven Reiseführer: Inselführer, Resorts, Tauchen, Angeln und Transfers -- mit echten, geprüften Informationen statt Werbetexten.',
    'Ihr unabhängiger Reiseführer für die Malediven',
    'Planen Sie Ihren Malediven Urlaub mit geprüften Informationen zu Inseln, Resorts, Tauchsafaris, Hochseeangeln und Transfers -- unabhängig recherchiert, nicht von Hotels bezahlt.',
    '{}'::jsonb,
    'published',
    'staff'
  ),
  (
    'maldives-hub',
    'de',
    'malediven',
    'Malediven',
    'Malediven Reisen: Atolle, Inseln & Aktivitäten | MTG',
    'Entdecken Sie die Atolle und Inseln der Malediven -- mit unabhängigen Guides zu Resorts, Tauchen, Angeln, Surfen und Transfers für Ihre Reiseplanung.',
    'Die Malediven entdecken',
    'Von den Nordatollen bis zum Süden: Hier finden Sie unabhängige Guides zu Inseln, Aktivitäten und Transfers auf den Malediven.',
    '{}'::jsonb,
    'published',
    'staff'
  );
