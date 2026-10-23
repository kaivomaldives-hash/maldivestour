-- Adds the "transfers-hub" page_translations rows for all 6 rolled-out
-- languages, powering the new /{locale}/maldives/transfers/ page.
--
-- Unlike every other migration in this batch, the INSERT below has NOT
-- been applied directly against the live DB yet -- page_translations.page_key
-- has a check constraint fixed at table-creation time
-- (supabase/migrations/20250210000100_i18n_translations_schema.sql) that
-- doesn't include 'transfers-hub', and widening a check constraint is a
-- schema (DDL) change this session's REST/curl access to Supabase cannot
-- perform (only plain data INSERT/UPDATE against existing columns). This
-- migration must actually be RUN (via the Supabase SQL editor or the
-- project's migration pipeline) before the /{locale}/maldives/transfers/
-- hub page has any live content -- it will 404 until then.
alter table page_translations drop constraint page_translations_page_key_check;
alter table page_translations add constraint page_translations_page_key_check check (
  page_key in (
    'homepage', 'maldives-hub', 'activities-hub', 'fishing-hub',
    'diving-hub', 'surfing-hub', 'packages-hub', 'stays-hub',
    'travel-guide-hub', 'transfers-hub'
  )
);

insert into page_translations (page_key, locale, slug, title, meta_title, meta_description, hero_heading, hero_intro, sections, translation_status, translated_by) values
('transfers-hub', 'de', 'transfer', 'Malediven-Transfers', 'Malediven-Transfers | MTG', 'Echte Flughafen-, Resort-, Insel- und Speedboot-Transferrouten auf den Malediven — nach Ziel suchen oder eine private Charter anfragen.', 'Malediven-Transfers', 'Jede Route unten ist ein echter, einzeln geprüfter Transfer — keine generische Schätzung. Die vollständige englische Liste bietet Suche und Filter.', '{}'::jsonb, 'published', 'claude'),
('transfers-hub', 'es', 'traslados', 'Traslados en Maldivas', 'Traslados en Maldivas | MTG', 'Rutas reales de traslado en aeropuerto, resort, isla y lancha rápida por todas las Maldivas — busca por destino o solicita un chárter privado.', 'Traslados en Maldivas', 'Cada ruta de abajo es un traslado real, verificado individualmente — no una estimación genérica. Consulta el listado completo en inglés para buscar y filtrar.', '{}'::jsonb, 'published', 'claude'),
('transfers-hub', 'it', 'trasferimenti', 'Trasferimenti alle Maldive', 'Trasferimenti alle Maldive | MTG', 'Percorsi di trasferimento reali per aeroporto, resort, isola e motoscafo in tutte le Maldive — cerca per destinazione o richiedi un charter privato.', 'Trasferimenti alle Maldive', 'Ogni percorso qui sotto è un trasferimento reale, verificato individualmente — non una stima generica. Consulta l''elenco completo in inglese per ricerca e filtri.', '{}'::jsonb, 'published', 'claude'),
('transfers-hub', 'ru', 'transfery', 'Трансферы на Мальдивах', 'Трансферы на Мальдивах | MTG', 'Настоящие маршруты трансфера из аэропорта, в курорт, на остров и на скоростном катере по всем Мальдивам — ищите по направлению или запросите частный чартер.', 'Трансферы на Мальдивах', 'Каждый маршрут ниже — это настоящий, индивидуально проверенный трансфер, а не общая оценка. Полный список на английском языке с поиском и фильтрами доступен отдельно.', '{}'::jsonb, 'published', 'claude'),
('transfers-hub', 'ja', 'sogei', 'モルディブの送迎', 'モルディブの送迎 | MTG', 'モルディブ全土の空港、リゾート、島、スピードボートの実際の送迎ルート——目的地で検索するか、プライベートチャーターをリクエストできます。', 'モルディブの送迎', '以下の各ルートは実在し個別に確認された送迎です——一般的な推定ではありません。検索とフィルター機能付きの完全な英語版リストもご覧いただけます。', '{}'::jsonb, 'published', 'claude'),
('transfers-hub', 'zh', 'jiesong', '马尔代夫接送服务', '马尔代夫接送服务 | MTG', '马尔代夫各地真实的机场、度假村、岛屿和快艇接送路线——按目的地搜索,或申请私人租船服务。', '马尔代夫接送服务', '以下每条路线均为真实、经过单独核实的接送服务,而非笼统估算。完整的英文列表提供搜索和筛选功能。', '{}'::jsonb, 'published', 'claude')
on conflict (page_key, locale) do update set
  slug = excluded.slug, title = excluded.title, meta_title = excluded.meta_title, meta_description = excluded.meta_description,
  hero_heading = excluded.hero_heading, hero_intro = excluded.hero_intro, translation_status = excluded.translation_status,
  translated_by = excluded.translated_by, updated_at = now();
