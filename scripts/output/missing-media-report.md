# Missing media files

Image assets whose file no longer exists in the public `media` Storage bucket (found by
`scripts/optimize-media-variants.mjs`, which writes the raw list to `missing-media-assets.json`).
These render as no image at all on the live site. Fix by re-uploading the photo in the admin,
or detaching it from the page.

- 146 asset rows point at a missing file; **95** of them are attached to a published page (listed below).
- Also hardcoded in code and missing: `legacy/images/activities/new-folder/manta-ray-snorkeling-in-the-maldives.webp` (manta ray species card, `src/lib/fishing/fish-species.ts`).
- 1 more asset (`legacy/resorts/bookingphp/img/background.jpg`) exists but is a corrupt JPEG that couldn't be re-encoded; it still serves as before.

| Used on | Missing file |
|---|---|
| location “Tsunami Monument” (`tsunami-monument-male`, hero) | `legacy/images/tsunami-monument-in-mal.webp` |
| transfer_route “Male to Hulhumale” (`male-to-hulhumale`, gallery) | `transfers/all-routes-gallery/11.webp` |
| transfer_route “Male to Hulhumale” (`male-to-hulhumale`, gallery) | `transfers/all-routes-gallery/9.webp` |
| transfer_route “Male to Hulhumale” (`male-to-hulhumale`, gallery) | `transfers/all-routes-gallery/3.webp` |
| transfer_route “Male to Hulhumale” (`male-to-hulhumale`, gallery) | `transfers/all-routes-gallery/4.webp` |
| transfer_route “Male to Hulhumale” (`male-to-hulhumale`, gallery) | `transfers/all-routes-gallery/2.webp` |
| transfer_route “Male to Hulhumale” (`male-to-hulhumale`, gallery) | `transfers/all-routes-gallery/10.webp` |
| transfer_route “Male to Hulhumale” (`male-to-hulhumale`, gallery) | `transfers/all-routes-gallery/5.webp` |
| transfer_route “Male to Hulhumale” (`male-to-hulhumale`, gallery) | `transfers/all-routes-gallery/8.webp` |
| transfer_route “Male to Hulhumale” (`male-to-hulhumale`, gallery) | `transfers/all-routes-gallery/6.webp` |
| transfer_route “Male to Hulhumale” (`male-to-hulhumale`, gallery) | `transfers/all-routes-gallery/7.webp` |
| transfer_route “Male to Hulhumale” (`male-to-hulhumale`, hero) | `transfers/all-routes-gallery/1.webp` |
| transfer_route “Male to Maafushi” (`male-to-maafushi`, gallery) | `transfers/all-routes-gallery/4.webp` |
| transfer_route “Male to Maafushi” (`male-to-maafushi`, gallery) | `transfers/all-routes-gallery/9.webp` |
| transfer_route “Male to Maafushi” (`male-to-maafushi`, gallery) | `transfers/all-routes-gallery/10.webp` |
| transfer_route “Male to Maafushi” (`male-to-maafushi`, gallery) | `transfers/all-routes-gallery/2.webp` |
| transfer_route “Male to Maafushi” (`male-to-maafushi`, gallery) | `transfers/all-routes-gallery/7.webp` |
| transfer_route “Male to Maafushi” (`male-to-maafushi`, gallery) | `transfers/all-routes-gallery/8.webp` |
| transfer_route “Male to Maafushi” (`male-to-maafushi`, gallery) | `transfers/all-routes-gallery/5.webp` |
| transfer_route “Male to Maafushi” (`male-to-maafushi`, gallery) | `transfers/all-routes-gallery/3.webp` |
| transfer_route “Male to Maafushi” (`male-to-maafushi`, gallery) | `transfers/all-routes-gallery/11.webp` |
| transfer_route “Male to Maafushi” (`male-to-maafushi`, gallery) | `transfers/all-routes-gallery/6.webp` |
| transfer_route “Male to Maafushi” (`male-to-maafushi`, hero) | `transfers/all-routes-gallery/1.webp` |
| transfer_route “Velana International Airport to JW Marriott Maldives Resort & Spa” (`velana-international-airport-to-jw-marriott-maldives-resort-spa`, gallery) | `transfers/jw-marriot-maldives/3.webp` |
| transfer_route “Velana International Airport to JW Marriott Maldives Resort & Spa” (`velana-international-airport-to-jw-marriott-maldives-resort-spa`, gallery) | `transfers/jw-marriot-maldives/2.webp` |
| transfer_route “Velana International Airport to JW Marriott Maldives Resort & Spa” (`velana-international-airport-to-jw-marriott-maldives-resort-spa`, gallery) | `transfers/jw-marriot-maldives/4.webp` |
| transfer_route “Velana International Airport to JW Marriott Maldives Resort & Spa” (`velana-international-airport-to-jw-marriott-maldives-resort-spa`, hero) | `transfers/jw-marriot-maldives/1.webp` |
| transfer_route “Velana International Airport to Kunfunadhoo” (`velana-international-airport-to-kunfunadhoo`, gallery) | `transfers/all-routes-gallery/3.webp` |
| transfer_route “Velana International Airport to Kunfunadhoo” (`velana-international-airport-to-kunfunadhoo`, gallery) | `transfers/all-routes-gallery/10.webp` |
| transfer_route “Velana International Airport to Kunfunadhoo” (`velana-international-airport-to-kunfunadhoo`, gallery) | `transfers/all-routes-gallery/6.webp` |
| transfer_route “Velana International Airport to Kunfunadhoo” (`velana-international-airport-to-kunfunadhoo`, gallery) | `transfers/all-routes-gallery/5.webp` |
| transfer_route “Velana International Airport to Kunfunadhoo” (`velana-international-airport-to-kunfunadhoo`, gallery) | `transfers/all-routes-gallery/7.webp` |
| transfer_route “Velana International Airport to Kunfunadhoo” (`velana-international-airport-to-kunfunadhoo`, gallery) | `transfers/all-routes-gallery/11.webp` |
| transfer_route “Velana International Airport to Kunfunadhoo” (`velana-international-airport-to-kunfunadhoo`, gallery) | `transfers/all-routes-gallery/8.webp` |
| transfer_route “Velana International Airport to Kunfunadhoo” (`velana-international-airport-to-kunfunadhoo`, gallery) | `transfers/all-routes-gallery/9.webp` |
| transfer_route “Velana International Airport to Kunfunadhoo” (`velana-international-airport-to-kunfunadhoo`, gallery) | `transfers/all-routes-gallery/2.webp` |
| transfer_route “Velana International Airport to Kunfunadhoo” (`velana-international-airport-to-kunfunadhoo`, gallery) | `transfers/all-routes-gallery/4.webp` |
| transfer_route “Velana International Airport to Kunfunadhoo” (`velana-international-airport-to-kunfunadhoo`, hero) | `transfers/all-routes-gallery/1.webp` |
| transfer_route “Velana International Airport to Maafushi” (`velana-international-airport-to-maafushi`, gallery) | `transfers/all-routes-gallery/4.webp` |
| transfer_route “Velana International Airport to Maafushi” (`velana-international-airport-to-maafushi`, gallery) | `transfers/all-routes-gallery/7.webp` |
| transfer_route “Velana International Airport to Maafushi” (`velana-international-airport-to-maafushi`, gallery) | `transfers/all-routes-gallery/6.webp` |
| transfer_route “Velana International Airport to Maafushi” (`velana-international-airport-to-maafushi`, gallery) | `transfers/all-routes-gallery/8.webp` |
| transfer_route “Velana International Airport to Maafushi” (`velana-international-airport-to-maafushi`, gallery) | `transfers/all-routes-gallery/11.webp` |
| transfer_route “Velana International Airport to Maafushi” (`velana-international-airport-to-maafushi`, gallery) | `transfers/all-routes-gallery/5.webp` |
| transfer_route “Velana International Airport to Maafushi” (`velana-international-airport-to-maafushi`, gallery) | `transfers/all-routes-gallery/3.webp` |
| transfer_route “Velana International Airport to Maafushi” (`velana-international-airport-to-maafushi`, gallery) | `transfers/all-routes-gallery/2.webp` |
| transfer_route “Velana International Airport to Maafushi” (`velana-international-airport-to-maafushi`, gallery) | `transfers/all-routes-gallery/10.webp` |
| transfer_route “Velana International Airport to Maafushi” (`velana-international-airport-to-maafushi`, gallery) | `transfers/all-routes-gallery/9.webp` |
| transfer_route “Velana International Airport to Maafushi” (`velana-international-airport-to-maafushi`, hero) | `transfers/all-routes-gallery/1.webp` |
| transfer_route “Velana International Airport to Makunudu Island” (`velana-international-airport-to-makunudu-island`, gallery) | `transfers/makunudu-island/3.webp` |
| transfer_route “Velana International Airport to Makunudu Island” (`velana-international-airport-to-makunudu-island`, gallery) | `transfers/makunudu-island/2.webp` |
| transfer_route “Velana International Airport to Makunudu Island” (`velana-international-airport-to-makunudu-island`, gallery) | `transfers/makunudu-island/4.webp` |
| transfer_route “Velana International Airport to Makunudu Island” (`velana-international-airport-to-makunudu-island`, hero) | `transfers/makunudu-island/1.webp` |
| transfer_route “Velana International Airport to Male” (`velana-international-airport-to-male`, gallery) | `transfers/all-routes-gallery/2.webp` |
| transfer_route “Velana International Airport to Male” (`velana-international-airport-to-male`, gallery) | `transfers/all-routes-gallery/4.webp` |
| transfer_route “Velana International Airport to Male” (`velana-international-airport-to-male`, gallery) | `transfers/all-routes-gallery/7.webp` |
| transfer_route “Velana International Airport to Male” (`velana-international-airport-to-male`, gallery) | `transfers/all-routes-gallery/11.webp` |
| transfer_route “Velana International Airport to Male” (`velana-international-airport-to-male`, gallery) | `transfers/all-routes-gallery/6.webp` |
| transfer_route “Velana International Airport to Male” (`velana-international-airport-to-male`, gallery) | `transfers/all-routes-gallery/3.webp` |
| transfer_route “Velana International Airport to Male” (`velana-international-airport-to-male`, gallery) | `transfers/all-routes-gallery/5.webp` |
| transfer_route “Velana International Airport to Male” (`velana-international-airport-to-male`, gallery) | `transfers/all-routes-gallery/8.webp` |
| transfer_route “Velana International Airport to Male” (`velana-international-airport-to-male`, gallery) | `transfers/all-routes-gallery/10.webp` |
| transfer_route “Velana International Airport to Male” (`velana-international-airport-to-male`, gallery) | `transfers/all-routes-gallery/9.webp` |
| transfer_route “Velana International Airport to Male” (`velana-international-airport-to-male`, hero) | `transfers/all-routes-gallery/1.webp` |
| transfer_route “Velana International Airport to OBLU SELECT Sangeli” (`velana-international-airport-to-oblu-select-sangeli`, gallery) | `transfers/oblu-select-sangeli/3.webp` |
| transfer_route “Velana International Airport to OBLU SELECT Sangeli” (`velana-international-airport-to-oblu-select-sangeli`, gallery) | `transfers/oblu-select-sangeli/2.webp` |
| transfer_route “Velana International Airport to OBLU SELECT Sangeli” (`velana-international-airport-to-oblu-select-sangeli`, gallery) | `transfers/oblu-select-sangeli/4.webp` |
| transfer_route “Velana International Airport to OBLU SELECT Sangeli” (`velana-international-airport-to-oblu-select-sangeli`, hero) | `transfers/oblu-select-sangeli/1.webp` |
| transfer_route “Velana International Airport to OBLU XPERIENCE Ailafushi” (`velana-international-airport-to-oblu-xperience-ailafushi`, gallery) | `transfers/oblu-XPERIENCE-Ailafushi/3.webp` |
| transfer_route “Velana International Airport to OBLU XPERIENCE Ailafushi” (`velana-international-airport-to-oblu-xperience-ailafushi`, gallery) | `transfers/oblu-XPERIENCE-Ailafushi/2.webp` |
| transfer_route “Velana International Airport to OBLU XPERIENCE Ailafushi” (`velana-international-airport-to-oblu-xperience-ailafushi`, gallery) | `transfers/oblu-XPERIENCE-Ailafushi/4.webp` |
| transfer_route “Velana International Airport to OBLU XPERIENCE Ailafushi” (`velana-international-airport-to-oblu-xperience-ailafushi`, hero) | `transfers/oblu-XPERIENCE-Ailafushi/1.webp` |
| transfer_route “Velana International Airport to One&Only Reethi Rah” (`velana-international-airport-to-one-only-reethi-rah`, gallery) | `transfers/one-and-only-reethi-rah/4.webp` |
| transfer_route “Velana International Airport to One&Only Reethi Rah” (`velana-international-airport-to-one-only-reethi-rah`, gallery) | `transfers/one-and-only-reethi-rah/2.webp` |
| transfer_route “Velana International Airport to One&Only Reethi Rah” (`velana-international-airport-to-one-only-reethi-rah`, gallery) | `transfers/one-and-only-reethi-rah/3.webp` |
| transfer_route “Velana International Airport to One&Only Reethi Rah” (`velana-international-airport-to-one-only-reethi-rah`, hero) | `transfers/one-and-only-reethi-rah/1.webp` |
| transfer_route “Velana International Airport to The Marina at CROSSROADS Maldives” (`velana-international-airport-to-the-marina-at-crossroads-maldives`, gallery) | `transfers/crossroad-maldives/4.webp` |
| transfer_route “Velana International Airport to The Marina at CROSSROADS Maldives” (`velana-international-airport-to-the-marina-at-crossroads-maldives`, gallery) | `transfers/crossroad-maldives/2.webp` |
| transfer_route “Velana International Airport to The Marina at CROSSROADS Maldives” (`velana-international-airport-to-the-marina-at-crossroads-maldives`, gallery) | `transfers/crossroad-maldives/3.webp` |
| transfer_route “Velana International Airport to The Marina at CROSSROADS Maldives” (`velana-international-airport-to-the-marina-at-crossroads-maldives`, hero) | `transfers/crossroad-maldives/1.webp` |
| transfer_route “Velana International Airport to The Ritz-Carlton Maldives, Fari Islands” (`velana-international-airport-to-the-ritz-carlton-maldives-fari-islands`, gallery) | `transfers/ritz-carlton-maldives/2.webp` |
| transfer_route “Velana International Airport to The Ritz-Carlton Maldives, Fari Islands” (`velana-international-airport-to-the-ritz-carlton-maldives-fari-islands`, gallery) | `transfers/ritz-carlton-maldives/4.webp` |
| transfer_route “Velana International Airport to The Ritz-Carlton Maldives, Fari Islands” (`velana-international-airport-to-the-ritz-carlton-maldives-fari-islands`, gallery) | `transfers/ritz-carlton-maldives/3.webp` |
| transfer_route “Velana International Airport to The Ritz-Carlton Maldives, Fari Islands” (`velana-international-airport-to-the-ritz-carlton-maldives-fari-islands`, hero) | `transfers/ritz-carlton-maldives/1.webp` |
| transfer_route “Velana International Airport to Vihamanaafushi” (`velana-international-airport-to-vihamanaafushi`, gallery) | `transfers/all-routes-gallery/11.webp` |
| transfer_route “Velana International Airport to Vihamanaafushi” (`velana-international-airport-to-vihamanaafushi`, gallery) | `transfers/all-routes-gallery/3.webp` |
| transfer_route “Velana International Airport to Vihamanaafushi” (`velana-international-airport-to-vihamanaafushi`, gallery) | `transfers/all-routes-gallery/5.webp` |
| transfer_route “Velana International Airport to Vihamanaafushi” (`velana-international-airport-to-vihamanaafushi`, gallery) | `transfers/all-routes-gallery/4.webp` |
| transfer_route “Velana International Airport to Vihamanaafushi” (`velana-international-airport-to-vihamanaafushi`, gallery) | `transfers/all-routes-gallery/10.webp` |
| transfer_route “Velana International Airport to Vihamanaafushi” (`velana-international-airport-to-vihamanaafushi`, gallery) | `transfers/all-routes-gallery/8.webp` |
| transfer_route “Velana International Airport to Vihamanaafushi” (`velana-international-airport-to-vihamanaafushi`, gallery) | `transfers/all-routes-gallery/9.webp` |
| transfer_route “Velana International Airport to Vihamanaafushi” (`velana-international-airport-to-vihamanaafushi`, gallery) | `transfers/all-routes-gallery/7.webp` |
| transfer_route “Velana International Airport to Vihamanaafushi” (`velana-international-airport-to-vihamanaafushi`, gallery) | `transfers/all-routes-gallery/6.webp` |
| transfer_route “Velana International Airport to Vihamanaafushi” (`velana-international-airport-to-vihamanaafushi`, gallery) | `transfers/all-routes-gallery/2.webp` |
| transfer_route “Velana International Airport to Vihamanaafushi” (`velana-international-airport-to-vihamanaafushi`, hero) | `transfers/all-routes-gallery/1.webp` |
