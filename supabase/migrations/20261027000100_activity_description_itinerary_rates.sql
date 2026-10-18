-- Standard activity-detail-page content: a long-form write-up separate
-- from nodes.summary's short card blurb, an ordered itinerary, and a
-- rates breakdown (distinct from the single price_from headline figure).
-- All three are nullable/empty-array-safe -- an activity with none of
-- them just skips those sections on the public page, same "never
-- fabricate" rule as everywhere else.

alter table activities add column if not exists description text;
alter table activities add column if not exists itinerary jsonb not null default '[]'::jsonb;
alter table activities add column if not exists rates jsonb not null default '[]'::jsonb;

comment on column activities.description is 'Long-form write-up for the detail page, separate from nodes.summary (short card/hero blurb). Plain text; paragraphs are rendered from blank-line breaks.';
comment on column activities.itinerary is 'Ordered array of {time, title, description} steps rendered as an "Itinerary" section. Empty array = no section shown.';
comment on column activities.rates is 'Ordered array of {label, price, currency, note} rendered as a "Rates" section, separate from the single price_from headline figure. Empty array = no section shown.';
