-- Transfer confirmation email: the site owner needs to send a detailed
-- boat/captain/meeting-point email when a transfer booking is confirmed,
-- with the quoted price editable at that moment (discounts). None of this
-- operational detail (which boat/captain is assigned) exists anywhere in
-- the schema today -- it varies booking to booking, so it's captured by
-- staff directly on the booking at confirm time, not pulled from a
-- separate boats/captains registry (deliberately simple for now; the site
-- owner said they'll add more fields/structure later).
--
-- Two sets (outbound/return) because a round-trip transfer may use a
-- different boat for the return leg; the return set is only ever shown
-- in the admin UI when the booking actually has a return date. One-way
-- bookings only ever fill in the outbound set.
alter table bookings
  add column transfer_outbound_boat_name          text,
  add column transfer_outbound_boat_size           text,
  add column transfer_outbound_boat_contact         text,
  add column transfer_outbound_captain_name          text,
  add column transfer_outbound_captain_license        text,
  add column transfer_outbound_registration_number     text,
  add column transfer_return_boat_name                  text,
  add column transfer_return_boat_size                   text,
  add column transfer_return_boat_contact                 text,
  add column transfer_return_captain_name                  text,
  add column transfer_return_captain_license                text,
  add column transfer_return_registration_number              text,
  -- Free-text, staff-editable payment paragraph (price/discount wording
  -- varies booking to booking -- e.g. MVR cash vs a discounted USD rate).
  -- Admin UI pre-fills a sensible default built from quoted_price/currency
  -- but this always wins once set.
  add column payment_note text;
