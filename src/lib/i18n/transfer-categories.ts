import type { Locale } from "@/lib/i18n/locales";

export const TRANSFER_CATEGORY_SLUGS = ["airport-transfers", "resort-transfers", "hotel-transfers", "island-transfers", "speedboat-transfers"] as const;

export type TransferCategorySlug = (typeof TRANSFER_CATEGORY_SLUGS)[number];

/** One transfer-category landing page's translated copy -- mirrors the
 * English page's TransferCategoryConfig (src/app/maldives/{slug}/page.tsx). */
export interface TransferCategoryTranslation {
  /** Short label for the "other transfer types" chips. */
  label: string;
  eyebrow: string;
  h1: string;
  intro: string;
  metaTitle: string;
  metaDescription: string;
  faqs: Array<{ question: string; answer: string }>;
  emptyMessage: string;
}

export interface TransferCategoryLocaleStrings {
  otherTypes: string;
  allTransfers: string;
  /** Link to the English page, which has search and filters. */
  filtersInEnglish: string;
  categories: Record<TransferCategorySlug, TransferCategoryTranslation>;
}

const DE: TransferCategoryLocaleStrings = {
  otherTypes: "Weitere Transferarten",
  allTransfers: "Alle Transfers auf den Malediven",
  filtersInEnglish: "Suche und Filter (Englisch)",
  categories: {
    "airport-transfers": {
      label: "Flughafentransfers",
      eyebrow: "Velana International Airport",
      h1: "Flughafentransfers auf den Malediven",
      intro:
        "Jeder Aufenthalt auf den Malediven beginnt und endet am Velana International Airport (MLE) auf der Insel Hulhulé neben Malé. Von dort finden Sie echte Transferrouten und Preise — per Speedboot, Fähre, Wasserflugzeug oder Inlandsflug — zu Resorts, Hotels und Einheimischeninseln im ganzen Land.",
      metaTitle: "Flughafentransfers auf den Malediven | Velana Airport zu Resorts & Inseln",
      metaDescription: "Echte Transferrouten und Preise vom Velana International Airport (MLE) zu Resorts, Hotels und Einheimischeninseln der Malediven — Speedboot, Fähre, Wasserflugzeug und Inlandsflug.",
      faqs: [
        { question: "Wie komme ich vom Velana International Airport zu meinem Resort?", answer: "Die meisten Resorts organisieren einen geteilten oder privaten Speedboot-Transfer direkt ab dem Flughafen, der für nahe Atolle meist deutlich unter einer Stunde dauert. Weiter entfernte Resorts nutzen ein Wasserflugzeug oder einen Inlandsflug plus kürzeren Bootstransfer — siehe die konkrete Route zu Ihrem Ziel unten." },
        { question: "Wie erreiche ich eine Einheimischeninsel?", answer: "Einheimischeninseln nahe Malé wie Maafushi erreichen Sie mit der staatlichen Fähre oder einem schnelleren privaten Speedboot. Echte, einzeln bepreiste Routen finden Sie unter Insel-Transfers." },
        { question: "Wie lange dauert die Fahrt?", answer: "Das hängt ganz vom Ziel ab — nahe Inseln erreichen Sie in deutlich unter einer Stunde, abgelegene Atolle brauchen länger oder einen Anschluss per Wasserflugzeug oder Inlandsflug." },
        { question: "Was kostet der Transfer?", answer: "Die Preise variieren je nach Ziel und Anbieter — jede Routenseite unten zeigt den echten, aus der Quelle geprüften Preis für genau diesen Transfer." },
      ],
      emptyMessage: "Noch keine Flughafentransfer-Routen erfasst.",
    },
    "resort-transfers": {
      label: "Resort-Transfers",
      eyebrow: "Private Resortinseln",
      h1: "Resort-Transfers auf den Malediven",
      intro:
        "Fast jedes Resort auf den Malediven liegt auf einer eigenen Privatinsel und wird vom Velana International Airport per Speedboot oder Wasserflugzeug erreicht. Unten finden Sie echte, resortspezifische Transferrouten und Preise.",
      metaTitle: "Resort-Transfers auf den Malediven | Vom Flughafen zum Resort",
      metaDescription: "Echte Resort-Transferrouten auf den Malediven ab dem Velana International Airport, nach Resortinsel — Preise für Speedboot und Wasserflugzeug.",
      faqs: [
        { question: "Wie komme ich vom Flughafen zu meinem Resort?", answer: "Die meisten Resorts betreiben einen eigenen Speedboot- oder Wasserflugzeugtransfer ab dem Velana International Airport, abgestimmt auf Ihren Flug — den echten Preis und die übliche Fahrtzeit sehen Sie auf der Route Ihres Resorts unten." },
        { question: "Ist der Resort-Transfer im Aufenthalt enthalten?", answer: "Das hängt von Resort und Tarif ab — der Preis auf jeder Route ist der erfasste Preis des Transfers selbst, unabhängig von einer Unterkunftsbuchung." },
      ],
      emptyMessage: "Noch keine Resort-Transferrouten erfasst.",
    },
    "hotel-transfers": {
      label: "Hotel-Transfers",
      eyebrow: "Budget- & Mittelklasse-Unterkünfte",
      h1: "Hotel-Transfers auf den Malediven",
      intro:
        "Hotels und Gästehäuser liegen auf den Malediven auf bewohnten Einheimischeninseln statt auf privaten Resortinseln — ein Hotel-Transfer ist also eigentlich ein Transfer zu einer Einheimischeninsel. Unten finden Sie echte Routen zu den Inseln mit erfassten Hotels und Gästehäusern.",
      metaTitle: "Hotel-Transfers auf den Malediven | Vom Flughafen zu Hotels & Inseln",
      metaDescription: "Hotel- und Gästehaus-Transfers auf den Malediven — echte Transferrouten und Preise vom Flughafen zu Einheimischeninseln mit Hotelunterkünften.",
      faqs: [
        { question: "Unterscheidet sich ein Hotel-Transfer von einem Resort-Transfer?", answer: "Ja — Hotels und Gästehäuser liegen auf bewohnten Einheimischeninseln (wie Maafushi) und werden wie jede Einheimischeninsel erreicht: mit der öffentlichen Fähre oder einem privaten Speedboot statt mit dem eigenen Boot eines Resorts." },
        { question: "Wie buche ich einen Transfer zur Insel meines Hotels?", answer: "Suchen Sie unten die Insel Ihres Hotels — jede Route zeigt die erfassten Transferoptionen und Preise. Ihr Hotel kann die Abholung auch direkt organisieren; fragen Sie dort zuerst nach." },
      ],
      emptyMessage: "Noch keine Transferrouten zu Hotelinseln erfasst.",
    },
    "island-transfers": {
      label: "Insel-Transfers",
      eyebrow: "Einheimischeninseln",
      h1: "Insel-Transfers auf den Malediven",
      intro:
        "Einheimischeninseln wie Malé und Maafushi erreichen Sie vom Velana International Airport mit der öffentlichen Fähre oder einem schnelleren privaten Speedboot — eine günstige Art, die Malediven jenseits eines privaten Resorts zu erleben.",
      metaTitle: "Insel-Transfers auf den Malediven | Vom Flughafen zu Einheimischeninseln",
      metaDescription: "Echte Transferrouten zu Einheimischeninseln der Malediven ab dem Velana International Airport — öffentliche Fähre und Speedboot mit Preisen.",
      faqs: [
        { question: "Wie komme ich vom Flughafen zu einer Einheimischeninsel?", answer: "Einheimischeninseln nahe Malé erreichen Sie mit der staatlichen Fähre (am günstigsten) oder einem privaten Speedboot-Anbieter — echte Routen und Preise für jede Insel finden Sie unten." },
        { question: "Sind Transfers zu Einheimischeninseln günstiger als Resort-Transfers?", answer: "In der Regel ja — Fährpreise zu nahen Einheimischeninseln liegen meist weit unter dem privaten Speedboot-Transfer eines Resorts, die Fahrt dauert aber meist länger." },
      ],
      emptyMessage: "Noch keine Transferrouten zu Einheimischeninseln erfasst.",
    },
    "speedboat-transfers": {
      label: "Speedboot-Transfers",
      eyebrow: "Auf dem Wasserweg",
      h1: "Speedboot-Transfers auf den Malediven",
      intro:
        "Das Speedboot ist der häufigste Weg vom Velana International Airport zu einem Resort oder einer nahen Einheimischeninsel — schnell, landschaftlich schön und für Atolle nahe Malé meist unter einer Stunde. Unten finden Sie echte Speedboot-Routen und Preise.",
      metaTitle: "Speedboot-Transfers auf den Malediven | Flughafen- & Insel-Transfers",
      metaDescription: "Echte Speedboot-Transferrouten auf den Malediven ab dem Velana International Airport — Preise und Fahrtzeiten nach Ziel.",
      faqs: [
        { question: "Welche Ziele erreicht man per Speedboot?", answer: "Resorts und Einheimischeninseln in Atollen nahe Malé werden meist per Speedboot erreicht — genaue Ziele und Fahrtzeiten sehen Sie in den echten Routen unten." },
        { question: "Was kosten Speedboot-Transfers?", answer: "Die Preise variieren je nach Resort bzw. Insel und Anbieter, meist zwischen einigen zehn und wenigen hundert US-Dollar pro Person — jede Route unten zeigt den tatsächlich erfassten Preis." },
        { question: "Wie lange dauern Speedboot-Fahrten?", answer: "Die meisten Speedboot-Transfers vom Flughafen dauern deutlich unter einer Stunde; die genaue Dauer hängt vom Ziel ab und steht, soweit bekannt, bei jeder Route unten." },
        { question: "Wo legen die Speedboote ab?", answer: "Speedboot-Transfers starten am Steg des Velana International Airport, wenige Gehminuten von der Ankunftshalle — Resortmitarbeiter oder der Anbieter empfangen die Gäste meist dort." },
      ],
      emptyMessage: "Noch keine Speedboot-Transferrouten erfasst.",
    },
  },
};

const ES: TransferCategoryLocaleStrings = {
  otherTypes: "Otros tipos de traslado",
  allTransfers: "Todos los traslados en Maldivas",
  filtersInEnglish: "Búsqueda y filtros (en inglés)",
  categories: {
    "airport-transfers": {
      label: "Traslados desde el aeropuerto",
      eyebrow: "Aeropuerto Internacional de Velana",
      h1: "Traslados desde el aeropuerto en Maldivas",
      intro:
        "Toda estancia en Maldivas empieza y termina en el Aeropuerto Internacional de Velana (MLE), en la isla de Hulhulé junto a Malé. Desde allí, rutas y precios reales de traslado —en lancha rápida, ferry, hidroavión o vuelo doméstico— a resorts, hoteles e islas locales de todo el país.",
      metaTitle: "Traslados desde el aeropuerto en Maldivas | De Velana a resorts e islas",
      metaDescription: "Rutas y precios reales de traslado desde el Aeropuerto Internacional de Velana (MLE) a resorts, hoteles e islas locales de Maldivas: lancha rápida, ferry, hidroavión y vuelo doméstico.",
      faqs: [
        { question: "¿Cómo llego del Aeropuerto Internacional de Velana a mi resort?", answer: "La mayoría de los resorts organizan un traslado compartido o privado en lancha rápida directamente desde el aeropuerto, normalmente de bastante menos de una hora para los atolones cercanos. Los resorts más lejanos usan hidroavión o un vuelo doméstico más una lancha más corta; consulta abajo la ruta concreta a tu destino." },
        { question: "¿Cómo llego a una isla local?", answer: "Las islas locales cerca de Malé, como Maafushi, se alcanzan en el ferry público o en una lancha rápida privada más rápida. Consulta Traslados entre islas para ver rutas reales con su precio." },
        { question: "¿Cuánto dura el trayecto?", answer: "Depende por completo del destino: a las islas cercanas se llega en bastante menos de una hora, mientras que los atolones remotos tardan más o requieren conexión en hidroavión o vuelo doméstico." },
        { question: "¿Cuánto cuesta el traslado?", answer: "Los precios varían según el destino y el operador; cada página de ruta de abajo muestra el precio real y verificado de ese traslado concreto." },
      ],
      emptyMessage: "Aún no hay rutas de traslado desde el aeropuerto registradas.",
    },
    "resort-transfers": {
      label: "Traslados a resorts",
      eyebrow: "Islas resort privadas",
      h1: "Traslados a resorts en Maldivas",
      intro:
        "Casi todos los resorts de Maldivas ocupan su propia isla privada, a la que se llega desde el Aeropuerto Internacional de Velana en lancha rápida o hidroavión. Abajo, rutas y precios reales de traslado para cada resort.",
      metaTitle: "Traslados a resorts en Maldivas | Del aeropuerto al resort",
      metaDescription: "Rutas reales de traslado a resorts de Maldivas desde el Aeropuerto Internacional de Velana, por isla resort: precios en lancha rápida e hidroavión.",
      faqs: [
        { question: "¿Cómo llego del aeropuerto a mi resort?", answer: "La mayoría de los resorts tienen su propio traslado en lancha rápida o hidroavión desde el Aeropuerto Internacional de Velana, coordinado con tu vuelo; consulta abajo la ruta de tu resort para ver su precio real y la duración habitual." },
        { question: "¿Está incluido el traslado en mi estancia?", answer: "Depende del resort y la tarifa; el precio de cada ruta es el del propio traslado tal como está registrado, independiente de cualquier reserva de alojamiento." },
      ],
      emptyMessage: "Aún no hay rutas de traslado a resorts registradas.",
    },
    "hotel-transfers": {
      label: "Traslados a hoteles",
      eyebrow: "Alojamiento económico y de gama media",
      h1: "Traslados a hoteles en Maldivas",
      intro:
        "En Maldivas, los hoteles y casas de huéspedes están en islas locales habitadas y no en islas resort privadas, así que un traslado al hotel es en realidad un traslado a una isla local. Abajo, rutas reales a las islas con hoteles o casas de huéspedes registrados.",
      metaTitle: "Traslados a hoteles en Maldivas | Del aeropuerto a hoteles e islas",
      metaDescription: "Traslados a hoteles y casas de huéspedes en Maldivas: rutas y precios reales del aeropuerto a islas locales con alojamiento hotelero.",
      faqs: [
        { question: "¿Es distinto un traslado al hotel de un traslado al resort?", answer: "Sí: los hoteles y casas de huéspedes están en islas locales habitadas (como Maafushi) y se llega como a cualquier isla local, en ferry público o lancha rápida privada, no en la embarcación propia de un resort." },
        { question: "¿Cómo reservo un traslado a la isla de mi hotel?", answer: "Busca abajo la isla de tu hotel; cada ruta muestra las opciones y precios de traslado registrados. Tu hotel también puede organizar la recogida; consúltalo primero." },
      ],
      emptyMessage: "Aún no hay rutas de traslado a islas con hoteles registradas.",
    },
    "island-transfers": {
      label: "Traslados entre islas",
      eyebrow: "Islas locales",
      h1: "Traslados a islas locales en Maldivas",
      intro:
        "A las islas locales de Maldivas, como Malé y Maafushi, se llega desde el Aeropuerto Internacional de Velana en ferry público o en una lancha rápida privada más rápida: una forma económica de conocer Maldivas fuera de un resort privado.",
      metaTitle: "Traslados entre islas en Maldivas | Del aeropuerto a islas locales",
      metaDescription: "Rutas reales de traslado a islas locales de Maldivas desde el Aeropuerto Internacional de Velana: ferry público y lancha rápida con precios.",
      faqs: [
        { question: "¿Cómo llego del aeropuerto a una isla local?", answer: "A las islas locales cerca de Malé se llega en ferry público (la opción más barata) o con un operador privado de lancha rápida; consulta abajo las rutas y precios reales de cada isla." },
        { question: "¿Son más baratos los traslados a islas locales que a resorts?", answer: "Por lo general sí: el billete de ferry a las islas locales cercanas suele ser mucho más bajo que el traslado privado en lancha de un resort, aunque el trayecto suele ser más largo." },
      ],
      emptyMessage: "Aún no hay rutas de traslado a islas locales registradas.",
    },
    "speedboat-transfers": {
      label: "Traslados en lancha rápida",
      eyebrow: "Por mar",
      h1: "Traslados en lancha rápida en Maldivas",
      intro:
        "La lancha rápida es la forma más habitual de llegar desde el Aeropuerto Internacional de Velana a un resort o a una isla local cercana: rápida, con vistas y normalmente de menos de una hora para los atolones próximos a Malé. Abajo, rutas y precios reales en lancha rápida.",
      metaTitle: "Traslados en lancha rápida en Maldivas | Aeropuerto e islas",
      metaDescription: "Rutas reales de traslado en lancha rápida en Maldivas desde el Aeropuerto Internacional de Velana: precios y duración por destino.",
      faqs: [
        { question: "¿A qué destinos se llega en lancha rápida?", answer: "A los resorts e islas locales de los atolones cercanos a Malé se llega normalmente en lancha rápida; consulta abajo las rutas reales con destinos y duraciones exactas." },
        { question: "¿Cuánto cuestan los traslados en lancha rápida?", answer: "Los precios varían según el resort o la isla y el operador, en general de unas decenas a unos pocos cientos de dólares por persona; cada ruta de abajo muestra el precio real registrado." },
        { question: "¿Cuánto dura el trayecto en lancha rápida?", answer: "La mayoría de los traslados en lancha desde el aeropuerto duran bastante menos de una hora; la duración exacta depende del destino y se indica en cada ruta cuando se conoce." },
        { question: "¿Desde dónde salen las lanchas rápidas?", answer: "Salen del muelle del Aeropuerto Internacional de Velana, a pocos pasos de la sala de llegadas; el personal del resort o el operador suele recibir allí a los viajeros." },
      ],
      emptyMessage: "Aún no hay rutas de traslado en lancha rápida registradas.",
    },
  },
};

const IT: TransferCategoryLocaleStrings = {
  otherTypes: "Altri tipi di trasferimento",
  allTransfers: "Tutti i trasferimenti alle Maldive",
  filtersInEnglish: "Ricerca e filtri (in inglese)",
  categories: {
    "airport-transfers": {
      label: "Trasferimenti dall'aeroporto",
      eyebrow: "Aeroporto Internazionale di Velana",
      h1: "Trasferimenti dall'aeroporto alle Maldive",
      intro:
        "Ogni soggiorno alle Maldive inizia e finisce all'Aeroporto Internazionale di Velana (MLE), sull'isola di Hulhulé accanto a Malé. Da lì, percorsi e prezzi reali di trasferimento, in motoscafo, traghetto, idrovolante o volo interno, verso resort, hotel e isole locali di tutto il Paese.",
      metaTitle: "Trasferimenti dall'aeroporto alle Maldive | Da Velana a resort e isole",
      metaDescription: "Percorsi e prezzi reali di trasferimento dall'Aeroporto Internazionale di Velana (MLE) a resort, hotel e isole locali delle Maldive: motoscafo, traghetto, idrovolante e volo interno.",
      faqs: [
        { question: "Come arrivo dall'Aeroporto Internazionale di Velana al mio resort?", answer: "La maggior parte dei resort organizza un trasferimento in motoscafo condiviso o privato direttamente dall'aeroporto, di solito ben sotto l'ora per gli atolli vicini. I resort più lontani usano l'idrovolante o un volo interno più un breve tratto in barca: vedi qui sotto il percorso verso la tua destinazione." },
        { question: "Come raggiungo un'isola locale?", answer: "Le isole locali vicino a Malé, come Maafushi, si raggiungono con il traghetto pubblico o con un motoscafo privato più veloce. Vedi Trasferimenti tra isole per percorsi reali con i relativi prezzi." },
        { question: "Quanto dura il viaggio?", answer: "Dipende interamente dalla destinazione: le isole vicine si raggiungono in molto meno di un'ora, mentre gli atolli remoti richiedono più tempo o un collegamento in idrovolante o volo interno." },
        { question: "Quanto costa il trasferimento?", answer: "I prezzi variano in base alla destinazione e all'operatore; ogni pagina di percorso qui sotto mostra il prezzo reale e verificato di quel trasferimento." },
      ],
      emptyMessage: "Nessun percorso di trasferimento dall'aeroporto ancora registrato.",
    },
    "resort-transfers": {
      label: "Trasferimenti ai resort",
      eyebrow: "Isole resort private",
      h1: "Trasferimenti ai resort alle Maldive",
      intro:
        "Quasi ogni resort delle Maldive occupa un'isola privata, raggiungibile dall'Aeroporto Internazionale di Velana in motoscafo o idrovolante. Qui sotto percorsi e prezzi reali di trasferimento per ciascun resort.",
      metaTitle: "Trasferimenti ai resort alle Maldive | Dall'aeroporto al resort",
      metaDescription: "Percorsi reali di trasferimento ai resort delle Maldive dall'Aeroporto Internazionale di Velana, per isola resort: prezzi in motoscafo e idrovolante.",
      faqs: [
        { question: "Come arrivo dall'aeroporto al mio resort?", answer: "La maggior parte dei resort gestisce un proprio trasferimento in motoscafo o idrovolante dall'Aeroporto Internazionale di Velana, coordinato con il tuo volo: vedi qui sotto il percorso del tuo resort con prezzo reale e durata tipica." },
        { question: "Il trasferimento al resort è incluso nel soggiorno?", answer: "Dipende dal resort e dalla tariffa; il prezzo di ogni percorso è quello del trasferimento stesso, separato da qualsiasi prenotazione dell'alloggio." },
      ],
      emptyMessage: "Nessun percorso di trasferimento ai resort ancora registrato.",
    },
    "hotel-transfers": {
      label: "Trasferimenti agli hotel",
      eyebrow: "Alloggi economici e di fascia media",
      h1: "Trasferimenti agli hotel alle Maldive",
      intro:
        "Alle Maldive hotel e guesthouse si trovano su isole locali abitate e non su isole resort private, quindi un trasferimento in hotel è in realtà un trasferimento verso un'isola locale. Qui sotto percorsi reali verso le isole con hotel o guesthouse registrati.",
      metaTitle: "Trasferimenti agli hotel alle Maldive | Dall'aeroporto a hotel e isole",
      metaDescription: "Trasferimenti verso hotel e guesthouse alle Maldive: percorsi e prezzi reali dall'aeroporto alle isole locali con strutture alberghiere.",
      faqs: [
        { question: "Un trasferimento in hotel è diverso da uno verso un resort?", answer: "Sì: hotel e guesthouse si trovano su isole locali abitate (come Maafushi) e si raggiungono come qualsiasi isola locale, con il traghetto pubblico o un motoscafo privato, non con la barca di un resort." },
        { question: "Come prenoto un trasferimento verso l'isola del mio hotel?", answer: "Cerca qui sotto l'isola del tuo hotel: ogni percorso mostra le opzioni e i prezzi registrati. Anche il tuo hotel può organizzare il ritiro: chiedi prima a loro." },
      ],
      emptyMessage: "Nessun percorso verso isole con hotel ancora registrato.",
    },
    "island-transfers": {
      label: "Trasferimenti tra isole",
      eyebrow: "Isole locali",
      h1: "Trasferimenti alle isole locali delle Maldive",
      intro:
        "Le isole locali maldiviane, come Malé e Maafushi, si raggiungono dall'Aeroporto Internazionale di Velana con il traghetto pubblico o un motoscafo privato più veloce: un modo economico per vivere le Maldive fuori da un resort privato.",
      metaTitle: "Trasferimenti tra isole alle Maldive | Dall'aeroporto alle isole locali",
      metaDescription: "Percorsi reali di trasferimento verso le isole locali delle Maldive dall'Aeroporto Internazionale di Velana: traghetto pubblico e motoscafo con prezzi.",
      faqs: [
        { question: "Come arrivo dall'aeroporto a un'isola locale?", answer: "Le isole locali vicino a Malé si raggiungono con il traghetto governativo (la soluzione più economica) o con un operatore privato in motoscafo: vedi qui sotto percorsi e prezzi reali per ogni isola." },
        { question: "I trasferimenti alle isole locali costano meno di quelli ai resort?", answer: "In genere sì: il biglietto del traghetto verso le isole locali vicine costa di solito molto meno del motoscafo privato di un resort, anche se il viaggio dura di più." },
      ],
      emptyMessage: "Nessun percorso verso isole locali ancora registrato.",
    },
    "speedboat-transfers": {
      label: "Trasferimenti in motoscafo",
      eyebrow: "Via mare",
      h1: "Trasferimenti in motoscafo alle Maldive",
      intro:
        "Il motoscafo è il modo più comune per raggiungere un resort o un'isola locale vicina dall'Aeroporto Internazionale di Velana: veloce, panoramico e di solito sotto l'ora per gli atolli vicini a Malé. Qui sotto percorsi e prezzi reali in motoscafo.",
      metaTitle: "Trasferimenti in motoscafo alle Maldive | Aeroporto e isole",
      metaDescription: "Percorsi reali di trasferimento in motoscafo alle Maldive dall'Aeroporto Internazionale di Velana: prezzi e tempi di viaggio per destinazione.",
      faqs: [
        { question: "Quali destinazioni si raggiungono in motoscafo?", answer: "I resort e le isole locali degli atolli vicini a Malé si raggiungono di solito in motoscafo: vedi qui sotto i percorsi reali con destinazioni e durate esatte." },
        { question: "Quanto costano i trasferimenti in motoscafo?", answer: "I prezzi variano in base a resort o isola e operatore, in genere da qualche decina a poche centinaia di dollari a persona; ogni percorso qui sotto mostra il prezzo effettivamente registrato." },
        { question: "Quanto dura il viaggio in motoscafo?", answer: "La maggior parte dei trasferimenti in motoscafo dall'aeroporto dura ben meno di un'ora; la durata esatta dipende dalla destinazione ed è indicata in ogni percorso, quando nota." },
        { question: "Da dove partono i motoscafi?", answer: "I trasferimenti in motoscafo partono dal pontile dell'Aeroporto Internazionale di Velana, a pochi passi dalla sala arrivi; il personale del resort o l'operatore accoglie lì gli ospiti." },
      ],
      emptyMessage: "Nessun percorso in motoscafo ancora registrato.",
    },
  },
};

const RU: TransferCategoryLocaleStrings = {
  otherTypes: "Другие виды трансферов",
  allTransfers: "Все трансферы на Мальдивах",
  filtersInEnglish: "Поиск и фильтры (на английском)",
  categories: {
    "airport-transfers": {
      label: "Трансферы из аэропорта",
      eyebrow: "Международный аэропорт Велана",
      h1: "Трансферы из аэропорта на Мальдивах",
      intro:
        "Любая поездка на Мальдивы начинается и заканчивается в международном аэропорту Велана (MLE) на острове Хулхуле рядом с Мале. Отсюда — реальные маршруты и цены трансферов на скоростном катере, пароме, гидросамолёте или внутреннем рейсе до курортов, отелей и местных островов по всей стране.",
      metaTitle: "Трансферы из аэропорта на Мальдивах | Из Веланы на курорты и острова",
      metaDescription: "Реальные маршруты и цены трансферов из международного аэропорта Велана (MLE) на курорты, в отели и на местные острова Мальдив — катер, паром, гидросамолёт и внутренний рейс.",
      faqs: [
        { question: "Как добраться из аэропорта Велана до курорта?", answer: "Большинство курортов организуют групповой или индивидуальный трансфер на скоростном катере прямо из аэропорта — до ближних атоллов обычно гораздо меньше часа. До дальних курортов летят гидросамолётом или внутренним рейсом с коротким участком на лодке — смотрите конкретный маршрут ниже." },
        { question: "Как добраться до местного острова?", answer: "До местных островов рядом с Мале, например Маафуши, ходят государственный паром и более быстрые частные катера. Реальные маршруты с ценами — на странице «Трансферы между островами»." },
        { question: "Сколько длится дорога?", answer: "Полностью зависит от направления: до ближних островов — заметно меньше часа, до удалённых атоллов дольше или с пересадкой на гидросамолёт или внутренний рейс." },
        { question: "Сколько стоит трансфер?", answer: "Цены зависят от направления и оператора — на странице каждого маршрута ниже указана реальная проверенная цена именно этого трансфера." },
      ],
      emptyMessage: "Маршрутов трансфера из аэропорта пока нет.",
    },
    "resort-transfers": {
      label: "Трансферы на курорты",
      eyebrow: "Частные курортные острова",
      h1: "Трансферы на курорты Мальдив",
      intro:
        "Почти каждый курорт Мальдив занимает собственный частный остров, куда из международного аэропорта Велана добираются на скоростном катере или гидросамолёте. Ниже — реальные маршруты и цены трансферов для каждого курорта.",
      metaTitle: "Трансферы на курорты Мальдив | Из аэропорта на курорт",
      metaDescription: "Реальные маршруты трансферов на курорты Мальдив из международного аэропорта Велана по курортным островам — цены на катер и гидросамолёт.",
      faqs: [
        { question: "Как добраться из аэропорта до курорта?", answer: "У большинства курортов есть собственный трансфер на катере или гидросамолёте из аэропорта Велана, подстроенный под ваш рейс — реальную цену и обычное время в пути смотрите на маршруте вашего курорта ниже." },
        { question: "Входит ли трансфер в стоимость проживания?", answer: "Зависит от курорта и тарифа — на каждом маршруте указана цена самого трансфера, отдельно от бронирования проживания." },
      ],
      emptyMessage: "Маршрутов трансфера на курорты пока нет.",
    },
    "hotel-transfers": {
      label: "Трансферы в отели",
      eyebrow: "Бюджетное и среднее жильё",
      h1: "Трансферы в отели на Мальдивах",
      intro:
        "Отели и гостевые дома на Мальдивах находятся на обитаемых местных островах, а не на частных курортных, поэтому трансфер в отель — это по сути трансфер на местный остров. Ниже — реальные маршруты на острова с отелями и гостевыми домами из нашего каталога.",
      metaTitle: "Трансферы в отели на Мальдивах | Из аэропорта в отели и на острова",
      metaDescription: "Трансферы в отели и гостевые дома Мальдив — реальные маршруты и цены из аэропорта на местные острова с отелями.",
      faqs: [
        { question: "Отличается ли трансфер в отель от трансфера на курорт?", answer: "Да — отели и гостевые дома стоят на обитаемых местных островах (например, Маафуши), и добираются до них как до любого местного острова: на общественном пароме или частном катере, а не на собственной лодке курорта." },
        { question: "Как заказать трансфер на остров с моим отелем?", answer: "Найдите остров вашего отеля ниже — на каждом маршруте указаны варианты и цены. Отель может организовать встречу и сам — сначала уточните у него." },
      ],
      emptyMessage: "Маршрутов на острова с отелями пока нет.",
    },
    "island-transfers": {
      label: "Трансферы между островами",
      eyebrow: "Местные острова",
      h1: "Трансферы на местные острова Мальдив",
      intro:
        "До местных мальдивских островов, таких как Мале и Маафуши, из международного аэропорта Велана ходят общественный паром и более быстрые частные катера — бюджетный способ увидеть Мальдивы за пределами частного курорта.",
      metaTitle: "Трансферы на острова Мальдив | Из аэропорта на местные острова",
      metaDescription: "Реальные маршруты трансферов на местные острова Мальдив из международного аэропорта Велана — общественный паром и катер с ценами.",
      faqs: [
        { question: "Как добраться из аэропорта до местного острова?", answer: "До местных островов рядом с Мале ходят государственный паром (самый дешёвый вариант) и частные катера — реальные маршруты и цены для каждого острова смотрите ниже." },
        { question: "Трансферы на местные острова дешевле, чем на курорты?", answer: "Как правило, да — паром до ближних местных островов обычно намного дешевле частного катера курорта, хотя и идёт дольше." },
      ],
      emptyMessage: "Маршрутов на местные острова пока нет.",
    },
    "speedboat-transfers": {
      label: "Трансферы на катере",
      eyebrow: "По морю",
      h1: "Трансферы на скоростном катере по Мальдивам",
      intro:
        "Скоростной катер — самый распространённый способ добраться из международного аэропорта Велана до курорта или ближнего местного острова: быстро, красиво и обычно меньше часа до атоллов рядом с Мале. Ниже — реальные маршруты и цены на катере.",
      metaTitle: "Трансферы на катере по Мальдивам | Из аэропорта и между островами",
      metaDescription: "Реальные маршруты трансферов на скоростном катере из международного аэропорта Велана — цены и время в пути по направлениям.",
      faqs: [
        { question: "Куда можно добраться на катере?", answer: "До курортов и местных островов в атоллах рядом с Мале обычно добираются на скоростном катере — точные направления и время в пути смотрите в реальных маршрутах ниже." },
        { question: "Сколько стоит трансфер на катере?", answer: "Цены зависят от курорта или острова и оператора — обычно от нескольких десятков до нескольких сотен долларов США с человека; на каждом маршруте ниже указана фактическая цена." },
        { question: "Сколько длится поездка на катере?", answer: "Большинство трансферов на катере из аэропорта занимают заметно меньше часа; точное время зависит от направления и указано на каждом маршруте, если известно." },
        { question: "Откуда отправляются катера?", answer: "Катера отходят от причала международного аэропорта Велана, в нескольких минутах ходьбы от зала прилёта — обычно там гостей встречают сотрудники курорта или оператора." },
      ],
      emptyMessage: "Маршрутов на катере пока нет.",
    },
  },
};

const JA: TransferCategoryLocaleStrings = {
  otherTypes: "ほかの送迎の種類",
  allTransfers: "モルディブの送迎一覧",
  filtersInEnglish: "検索・絞り込み（英語）",
  categories: {
    "airport-transfers": {
      label: "空港送迎",
      eyebrow: "ヴェラナ国際空港",
      h1: "モルディブの空港送迎",
      intro:
        "モルディブの滞在はすべて、マレの隣のフルレ島にあるヴェラナ国際空港（MLE）で始まり、終わります。そこから国内各地のリゾート、ホテル、ローカル島へ、スピードボート・フェリー・水上飛行機・国内線による実際の送迎ルートと料金をご覧いただけます。",
      metaTitle: "モルディブの空港送迎 | ヴェラナ空港からリゾート・島へ",
      metaDescription: "ヴェラナ国際空港（MLE）からモルディブのリゾート、ホテル、ローカル島への実際の送迎ルートと料金。スピードボート、フェリー、水上飛行機、国内線。",
      faqs: [
        { question: "ヴェラナ国際空港からリゾートへはどう行きますか？", answer: "ほとんどのリゾートは空港から直接、乗り合いまたは専用のスピードボートで送迎しており、近い環礁なら通常1時間かかりません。遠いリゾートは水上飛行機、または国内線と短いボートを組み合わせます。目的地ごとのルートは以下をご覧ください。" },
        { question: "ローカル島へはどう行きますか？", answer: "マーフシなどマレに近いローカル島へは、公営フェリーかより速い専用スピードボートで行けます。料金付きの実際のルートは「島への送迎」をご覧ください。" },
        { question: "移動にはどのくらいかかりますか？", answer: "目的地次第です。近い島なら1時間かからず、遠い環礁は時間がかかるか、水上飛行機や国内線の乗り継ぎが必要です。" },
        { question: "送迎の料金は？", answer: "目的地や業者によって異なります。以下の各ルートのページに、その送迎の実際に確認した料金を掲載しています。" },
      ],
      emptyMessage: "空港送迎ルートはまだ登録されていません。",
    },
    "resort-transfers": {
      label: "リゾートへの送迎",
      eyebrow: "プライベートなリゾートアイランド",
      h1: "モルディブのリゾート送迎",
      intro:
        "モルディブのリゾートのほとんどは専用のプライベートアイランドにあり、ヴェラナ国際空港からスピードボートか水上飛行機で向かいます。以下はリゾートごとの実際の送迎ルートと料金です。",
      metaTitle: "モルディブのリゾート送迎 | 空港からリゾートへ",
      metaDescription: "ヴェラナ国際空港からモルディブのリゾートへの実際の送迎ルート（リゾートアイランド別）。スピードボートと水上飛行機の料金。",
      faqs: [
        { question: "空港からリゾートへはどう行きますか？", answer: "ほとんどのリゾートは、フライトに合わせてヴェラナ国際空港から独自のスピードボートまたは水上飛行機で送迎しています。実際の料金と所要時間は、以下のリゾートのルートをご覧ください。" },
        { question: "リゾートの送迎は宿泊料金に含まれますか？", answer: "リゾートや料金プランによって異なります。各ルートに表示している料金は、宿泊の予約とは別の送迎そのものの料金です。" },
      ],
      emptyMessage: "リゾート送迎ルートはまだ登録されていません。",
    },
    "hotel-transfers": {
      label: "ホテルへの送迎",
      eyebrow: "格安・中級の宿",
      h1: "モルディブのホテル送迎",
      intro:
        "モルディブのホテルやゲストハウスはプライベートなリゾートアイランドではなく、人が暮らすローカル島にあります。つまりホテルへの送迎は、実質的にローカル島への送迎です。以下は、ホテルやゲストハウスが登録されている島への実際のルートです。",
      metaTitle: "モルディブのホテル送迎 | 空港からホテル・島へ",
      metaDescription: "モルディブのホテル・ゲストハウスへの送迎。空港からホテルのあるローカル島への実際の送迎ルートと料金。",
      faqs: [
        { question: "ホテル送迎とリゾート送迎は違いますか？", answer: "はい。ホテルやゲストハウスはマーフシのような人が暮らすローカル島にあり、ほかのローカル島と同じく公営フェリーか専用スピードボートで向かいます。リゾート専用のボートではありません。" },
        { question: "ホテルのある島への送迎はどう予約しますか？", answer: "以下からホテルのある島を探してください。各ルートに登録済みの送迎方法と料金が表示されます。ホテルが直接お迎えを手配してくれる場合もあるので、まずはホテルにご確認ください。" },
      ],
      emptyMessage: "ホテルのある島への送迎ルートはまだ登録されていません。",
    },
    "island-transfers": {
      label: "島への送迎",
      eyebrow: "ローカル島",
      h1: "モルディブのローカル島への送迎",
      intro:
        "マレやマーフシなどのモルディブのローカル島へは、ヴェラナ国際空港から公営フェリーか、より速い専用スピードボートで行けます。プライベートリゾートの外でモルディブを体験できる、お手頃な方法です。",
      metaTitle: "モルディブの島への送迎 | 空港からローカル島へ",
      metaDescription: "ヴェラナ国際空港からモルディブのローカル島への実際の送迎ルート。公営フェリーとスピードボートの料金。",
      faqs: [
        { question: "空港からローカル島へはどう行きますか？", answer: "マレに近いローカル島へは、公営フェリー（最も安い）か専用スピードボートの業者で行けます。島ごとの実際のルートと料金は以下をご覧ください。" },
        { question: "ローカル島への送迎はリゾート送迎より安いですか？", answer: "一般的には安いです。近くのローカル島へのフェリー料金は、リゾートの専用スピードボートよりずっと安いことが多いですが、移動時間は長くなります。" },
      ],
      emptyMessage: "ローカル島への送迎ルートはまだ登録されていません。",
    },
    "speedboat-transfers": {
      label: "スピードボート送迎",
      eyebrow: "海路",
      h1: "モルディブのスピードボート送迎",
      intro:
        "スピードボートは、ヴェラナ国際空港からリゾートや近くのローカル島へ向かう最も一般的な手段です。速くて景色も良く、マレに近い環礁なら通常1時間かかりません。以下は実際のスピードボートのルートと料金です。",
      metaTitle: "モルディブのスピードボート送迎 | 空港・島への送迎",
      metaDescription: "ヴェラナ国際空港からのモルディブのスピードボート送迎ルート。目的地別の料金と所要時間。",
      faqs: [
        { question: "スピードボートで行ける目的地は？", answer: "マレに近い環礁のリゾートやローカル島へは、たいていスピードボートで行けます。正確な目的地と所要時間は以下の実際のルートをご覧ください。" },
        { question: "スピードボート送迎の料金は？", answer: "リゾートや島、業者によって異なり、一般的に1人あたり数十〜数百米ドルです。以下の各ルートに実際に登録されている料金を表示しています。" },
        { question: "スピードボートの所要時間は？", answer: "空港からのスピードボート送迎のほとんどは1時間かかりません。正確な時間は目的地によって異なり、わかっている場合は各ルートに表示しています。" },
        { question: "スピードボートはどこから出発しますか？", answer: "ヴェラナ国際空港の到着ロビーから歩いてすぐの桟橋から出発します。通常はリゾートのスタッフや業者がそこで出迎えてくれます。" },
      ],
      emptyMessage: "スピードボート送迎ルートはまだ登録されていません。",
    },
  },
};

const ZH: TransferCategoryLocaleStrings = {
  otherTypes: "其他接送类型",
  allTransfers: "全部马尔代夫接送",
  filtersInEnglish: "搜索和筛选（英文）",
  categories: {
    "airport-transfers": {
      label: "机场接送",
      eyebrow: "维拉纳国际机场",
      h1: "马尔代夫机场接送",
      intro:
        "每一次马尔代夫之旅都在马累旁胡鲁莱岛上的维拉纳国际机场（MLE）开始和结束。从这里出发，查看前往全国各地度假村、酒店和本地岛屿的真实接送路线和价格——快艇、渡轮、水上飞机或内陆航班。",
      metaTitle: "马尔代夫机场接送 | 从维拉纳机场到度假村和岛屿",
      metaDescription: "从维拉纳国际机场（MLE）到马尔代夫度假村、酒店和本地岛屿的真实接送路线和价格——快艇、渡轮、水上飞机和内陆航班。",
      faqs: [
        { question: "从维拉纳国际机场怎么去度假村？", answer: "大多数度假村直接在机场安排拼船或私人快艇接送，前往附近环礁通常不到一小时。较远的度假村会用水上飞机，或内陆航班加短途快艇——请查看下方前往你目的地的具体路线。" },
        { question: "怎么去本地岛屿？", answer: "马富士岛等马累附近的本地岛屿可乘公共渡轮或更快的私人快艇抵达。带价格的真实路线请查看“岛屿接送”。" },
        { question: "路上需要多久？", answer: "完全取决于目的地——附近岛屿不到一小时即可抵达，偏远环礁需要更久，或需转乘水上飞机或内陆航班。" },
        { question: "接送费用是多少？", answer: "价格因目的地和经营者而异——下方每个路线页面都显示该接送经过核实的真实价格。" },
      ],
      emptyMessage: "暂未收录机场接送路线。",
    },
    "resort-transfers": {
      label: "度假村接送",
      eyebrow: "私人度假村岛屿",
      h1: "马尔代夫度假村接送",
      intro:
        "马尔代夫几乎每个度假村都独占一座私人岛屿，从维拉纳国际机场乘快艇或水上飞机前往。以下是各度假村真实的接送路线和价格。",
      metaTitle: "马尔代夫度假村接送 | 从机场到度假村",
      metaDescription: "从维拉纳国际机场前往马尔代夫各度假村岛屿的真实接送路线——快艇和水上飞机价格。",
      faqs: [
        { question: "从机场怎么去度假村？", answer: "大多数度假村都有自己的快艇或水上飞机接送，从维拉纳国际机场出发并配合你的航班——真实价格和通常用时请查看下方你所住度假村的路线。" },
        { question: "度假村接送包含在住宿里吗？", answer: "因度假村和房价而异——每条路线显示的是接送本身的记录价格，与住宿预订分开。" },
      ],
      emptyMessage: "暂未收录度假村接送路线。",
    },
    "hotel-transfers": {
      label: "酒店接送",
      eyebrow: "经济型和中档住宿",
      h1: "马尔代夫酒店接送",
      intro:
        "马尔代夫的酒店和民宿位于有人居住的本地岛屿，而不是私人度假村岛屿——所以酒店接送其实就是前往本地岛屿的接送。以下是前往有酒店或民宿的岛屿的真实路线。",
      metaTitle: "马尔代夫酒店接送 | 从机场到酒店和岛屿",
      metaDescription: "马尔代夫酒店和民宿接送——从机场到有酒店住宿的本地岛屿的真实路线和价格。",
      faqs: [
        { question: "酒店接送和度假村接送不一样吗？", answer: "不一样——酒店和民宿位于马富士岛等有人居住的本地岛屿，和前往任何本地岛屿一样乘公共渡轮或私人快艇，而不是度假村的专属船只。" },
        { question: "如何预订前往酒店所在岛屿的接送？", answer: "在下方找到你酒店所在的岛屿——每条路线都显示已记录的接送方式和价格。酒店也可能直接安排接机，请先向酒店确认。" },
      ],
      emptyMessage: "暂未收录前往酒店岛屿的接送路线。",
    },
    "island-transfers": {
      label: "岛屿接送",
      eyebrow: "本地岛屿",
      h1: "马尔代夫本地岛屿接送",
      intro:
        "马累、马富士岛等马尔代夫本地岛屿可从维拉纳国际机场乘公共渡轮或更快的私人快艇抵达——在私人度假村之外体验马尔代夫的实惠方式。",
      metaTitle: "马尔代夫岛屿接送 | 从机场到本地岛屿",
      metaDescription: "从维拉纳国际机场前往马尔代夫本地岛屿的真实接送路线——公共渡轮和快艇及价格。",
      faqs: [
        { question: "从机场怎么去本地岛屿？", answer: "马累附近的本地岛屿可乘政府渡轮（最便宜）或私人快艇经营者前往——各岛屿的真实路线和价格见下方。" },
        { question: "本地岛屿接送比度假村接送便宜吗？", answer: "通常便宜——前往附近本地岛屿的渡轮票价一般远低于度假村的私人快艇接送，不过路上通常更久。" },
      ],
      emptyMessage: "暂未收录本地岛屿接送路线。",
    },
    "speedboat-transfers": {
      label: "快艇接送",
      eyebrow: "海路",
      h1: "马尔代夫快艇接送",
      intro:
        "快艇是从维拉纳国际机场前往度假村或附近本地岛屿最常见的方式——快速、风景优美，前往马累附近的环礁通常不到一小时。以下是真实的快艇路线和价格。",
      metaTitle: "马尔代夫快艇接送 | 机场与岛屿接送",
      metaDescription: "从维拉纳国际机场出发的马尔代夫快艇接送真实路线——按目的地列出价格和用时。",
      faqs: [
        { question: "快艇能到哪些目的地？", answer: "马累附近环礁的度假村和本地岛屿通常乘快艇前往——具体目的地和用时请看下方真实路线。" },
        { question: "快艇接送多少钱？", answer: "价格因度假村或岛屿及经营者而异，一般每人几十到几百美元——下方每条路线显示实际记录的价格。" },
        { question: "快艇要坐多久？", answer: "从机场出发的快艇接送大多不到一小时；具体时长取决于目的地，如已知会在每条路线上显示。" },
        { question: "快艇从哪里出发？", answer: "快艇从维拉纳国际机场的码头出发，距到达大厅步行很近——度假村员工或经营者通常在那里迎接客人。" },
      ],
      emptyMessage: "暂未收录快艇接送路线。",
    },
  },
};

const STRINGS: Partial<Record<Locale, TransferCategoryLocaleStrings>> = { de: DE, es: ES, it: IT, ru: RU, ja: JA, zh: ZH };

/** Every locale the transfer-category landing pages are translated into (hreflang, sitemap). */
export const TRANSFER_CATEGORY_LOCALES = Object.keys(STRINGS) as Locale[];

export function getTransferCategoryStrings(locale: Locale): TransferCategoryLocaleStrings | null {
  return STRINGS[locale] ?? null;
}

export function isTransferCategorySlug(slug: string): slug is TransferCategorySlug {
  return (TRANSFER_CATEGORY_SLUGS as readonly string[]).includes(slug);
}
