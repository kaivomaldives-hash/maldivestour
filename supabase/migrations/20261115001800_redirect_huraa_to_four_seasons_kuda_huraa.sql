-- /maldives/transfers/velana-international-airport-to-huraa now 301s to the
-- Four Seasons Kuda Huraa route. The old-site .html URL that pointed at the
-- retired Huraa URL is repointed straight at the new one, so it stays a
-- single hop (the chain-prevention trigger would reject a chain anyway).
-- Already applied directly against the live DB.
update url_redirects set target_path = '/maldives/transfers/velana-international-airport-to-four-seasons-kuda-huraa/'
where source_path = '/transfer/Fourseason-kuda-huraa-Maldives-Transfer.html';

insert into url_redirects (source_path, target_type, target_path, status_code, is_active, notes)
values ('/maldives/transfers/velana-international-airport-to-huraa', 'path', '/maldives/transfers/velana-international-airport-to-four-seasons-kuda-huraa/', 301, true, 'Retired Huraa route URL -> Four Seasons Kuda Huraa route')
on conflict (source_path) do update set target_type = excluded.target_type, target_path = excluded.target_path,
  status_code = excluded.status_code, is_active = excluded.is_active, notes = excluded.notes;
