-- Fixes a cross-article internal link inside the translated "Fishing
-- Seasons" article (all 6 languages) that still pointed at the plain
-- English /maldives/travel-guide/... URL for the Gaafu Atoll fishing
-- guide, even though that guide is itself translated in every one of
-- these locales. Per the "localize internal links between translated
-- pages" convention: a link from one translated article to another
-- should point at the target's own translated URL when one is
-- published, never fall back to the English page just because the
-- source article was written before the target's translation existed.
-- Already applied directly against the live DB; this migration exists so
-- a future from-scratch replay lands on the same content, idempotent by
-- construction (plain field overwrite, no conflict possible).

update translations set body_html = replace(
  body_html,
  'href="/maldives/travel-guide/gaafu-atoll-fishing-guide-mfh-maamendhoo/"',
  'href="/de/maldives/travel-guide/angeln-gaafu-atoll-leitfaden-lodge-charter-maamendhoo/"'
)
where entity_type = 'article' and locale = 'de' and slug = 'malediven-angelsaisons-monat-fuer-monat-leitfaden';

update translations set body_html = replace(
  body_html,
  'href="/maldives/travel-guide/gaafu-atoll-fishing-guide-mfh-maamendhoo/"',
  'href="/es/maldives/travel-guide/pesca-atolon-gaafu-guia-lodge-charter-maamendhoo/"'
)
where entity_type = 'article' and locale = 'es' and slug = 'temporadas-pesca-maldivas-guia-mes-a-mes';

update translations set body_html = replace(
  body_html,
  'href="/maldives/travel-guide/gaafu-atoll-fishing-guide-mfh-maamendhoo/"',
  'href="/it/maldives/travel-guide/pesca-atollo-gaafu-guida-lodge-charter-maamendhoo/"'
)
where entity_type = 'article' and locale = 'it' and slug = 'stagioni-pesca-maldive-guida-mese-per-mese';

update translations set body_html = replace(
  body_html,
  'href="/maldives/travel-guide/gaafu-atoll-fishing-guide-mfh-maamendhoo/"',
  'href="/ru/maldives/travel-guide/rybalka-atoll-gaafu-guide-lodzh-charter-maamendhoo/"'
)
where entity_type = 'article' and locale = 'ru' and slug = 'sezony-rybalki-maldivy-guide-po-mesyatsam';

update translations set body_html = replace(
  body_html,
  'href="/maldives/travel-guide/gaafu-atoll-fishing-guide-mfh-maamendhoo/"',
  'href="/ja/maldives/travel-guide/gaafu-atoll-fishing-lodge-charter-maamendhoo/"'
)
where entity_type = 'article' and locale = 'ja' and slug = 'maldives-fishing-seasons-month-by-month-guide';

update translations set body_html = replace(
  body_html,
  'href="/maldives/travel-guide/gaafu-atoll-fishing-guide-mfh-maamendhoo/"',
  'href="/zh/maldives/travel-guide/gafu-huanjiao-diaoyu-mamenduo-zhuangzuo-baoyou-zhinan/"'
)
where entity_type = 'article' and locale = 'zh' and slug = 'maldives-diaoyu-jijie-zhuyue-zhinan';
