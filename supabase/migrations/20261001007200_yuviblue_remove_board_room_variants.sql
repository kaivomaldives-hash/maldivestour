-- Yuvi Blue Maldives (Himmafushi): the detail page now shows a single
-- room card per room type rather than one card per meal plan, so the
-- Half Board / Full Board variants of each room are no longer separate
-- listings here (meal plan remains selectable in the Custom Holiday
-- Builder's own pricing config, which is unaffected by this). Keeps
-- just "Deluxe Double/Twin Room - Bed & Breakfast" and "Deluxe Family
-- Room - Bed & Breakfast". accommodation_room_media rows for the
-- deleted rooms cascade-delete automatically (room_id references
-- accommodation_rooms(id) on delete cascade).
delete from accommodation_rooms
where accommodation_id = (select id from nodes where node_type = 'accommodation' and slug = 'yuvi-blue-maldives-himmafushi')
  and name in (
    'Deluxe Double/Twin Room - Half Board',
    'Deluxe Double/Twin Room - Full Board',
    'Deluxe Family Room - Half Board',
    'Deluxe Family Room - Full Board'
  );
