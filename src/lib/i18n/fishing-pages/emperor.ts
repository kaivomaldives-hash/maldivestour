import { getFishingContentUpdate } from "@/lib/i18n/fishing-content";
import type { Locale } from "@/lib/i18n/locales";

/** Translated copy for the Emperor charter page (src/components/fishing/emperor-page.tsx).
 * `features`, `techniqueLabels`, `faqs` and `relatedLabels` line up with the English page's lists. */
export interface EmperorStrings {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  heroDescription: string;
  requestAvailability: string;
  whatsappUs: string;
  meetTitle: string;
  meetP1: string;
  meetP2Strong: string;
  meetP2: string;
  features: string[];
  whereTitle: string;
  whereText: string;
  homeBaseSuffix: string;
  elsewhereBefore: string;
  elsewhereLink: string;
  elsewhereAfter: string;
  techniquesTitle: string;
  techniquesBefore: string;
  seasonsLink: string;
  techniquesAfter: string;
  techniqueLabels: string[];
  ratesTitle: string;
  ratesIntro: string;
  preferWhatsappBefore: string;
  preferWhatsappLink: string;
  faqs: Array<{ question: string; answer: string }>;
  exploreMoreTitle: string;
  relatedLabels: string[];
  from: string;
  perBoat: string;
  waMessage: string;
  /** "What to expect" and "What's included" sections (optional until translated). */
  dayTitle?: string;
  dayParagraphs?: string[];
  includedTitle?: string;
  includedHeading?: string;
  notIncludedHeading?: string;
  included?: string[];
  notIncluded?: string[];
  packageBefore?: string;
  packageLink?: string;
  packageAfter?: string;
}

const DE: EmperorStrings = {
  metaTitle: "Emperor – privates Angelcharter auf den Malediven | Gaafu-Atoll",
  metaDescription: "Emperor, ein 32-Fuß-Angelboot mit zwei 200-PS-Motoren für bis zu 5 Angler, beheimatet im Gaafu-Atoll — derselbe Preis, wo immer wir Ihr Charter auf den Malediven organisieren.",
  eyebrow: "Privates Angelcharter",
  title: "Emperor – privates Angelcharter auf den ganzen Malediven",
  heroDescription: "32 ft · Zwei 200-PS-Motoren · Bis zu 5 Angler. Beheimatet im Gaafu-Atoll — derselbe Preis, wo immer wir Ihr Charter auf den Malediven organisieren.",
  requestAvailability: "Verfügbarkeit anfragen",
  whatsappUs: "WhatsApp schreiben",
  meetTitle: "Die Emperor",
  meetP1: "Die Emperor ist ein 32 Fuß langes privates Angelboot mit zwei 200-PS-Außenbordmotoren für bis zu 5 Angler. Boot und Crew sind in Maamendhoo im Gaafu-Alifu-Atoll zu Hause — echte, abgelegene Fanggründe mit weniger Angeldruck als in den Resort-Atollen, an die die meisten Besucher zuerst denken.",
  meetP2Strong: "Sie wählen den Ort. Wir helfen, das Angeln zu organisieren.",
  meetP2: "Nennen Sie uns Ihre Unterkunft, Reisedaten, die Zahl der Angler und Ihren Wunschfisch, und unser Team bestätigt die passendste Abfahrt — ob in den eigenen Gründen der Emperor im Gaafu-Atoll oder in einer anderen Region. Der Preis ist überall gleich; je nach Ort variiert nur die Verfügbarkeit, die von der Position des Boots, dem Wetter, dem Seegang und dem Dienstplan der Crew abhängt. Deshalb bestätigen wir Ihren Termin vor der Buchung mit Ihnen.",
  features: [
    "Privates Boot für Ihre Gruppe — nicht mit anderen Anglern geteilt",
    "Bis zu 5 Angler",
    "32-Fuß-Angelboot, zwei 200-PS-Außenbordmotoren",
    "Professioneller Kapitän und Crew",
    "Basis-Angelausrüstung inklusive",
    "Halbtages- und Ganztagescharter",
    "Derselbe Preis, wo immer wir Ihr Charter auf den Malediven organisieren",
  ],
  whereTitle: "Wo können Sie angeln?",
  whereText: "Die Heimatgewässer der Emperor liegen im Gaafu-Atoll im äußersten Süden der Malediven. Charter können zum selben Preis auch von anderen Regionen aus organisiert werden — Abfahrtsort und Datum hängen davon ab, wo Sie wohnen und wo das Boot gerade liegt.",
  homeBaseSuffix: " — unser Heimathafen",
  elsewhereBefore: "Sie wohnen woanders?",
  elsewhereLink: "Fragen Sie uns auf WhatsApp",
  elsewhereAfter: " — wir sagen Ihnen ehrlich, ob die Emperor Sie erreichen kann.",
  techniquesTitle: "Angeltechniken",
  techniquesBefore: "Was gut läuft, hängt von Ort und Saison ab — allgemeine Hinweise finden Sie unter ",
  seasonsLink: "Angelsaisons auf den Malediven",
  techniquesAfter: ".",
  techniqueLabels: ["Popping (GT)", "Jigging (GT, Dogtooth-Thun)", "Schleppangeln / Big-Game-Fishing (Thun, Wahoo)", "Riffangeln"],
  ratesTitle: "Preise für das Emperor-Charter",
  ratesIntro: "Ein Preis pro Boot, wo immer wir Ihr Charter auf den Malediven organisieren — ohne Aufpreis für Transfer oder Positionierung.",
  preferWhatsappBefore: "Lieber per WhatsApp?",
  preferWhatsappLink: "Schreiben Sie direkt einem Angelexperten",
  faqs: [
    { question: "Fährt die Emperor nur ab Maamendhoo?", answer: "Maamendhoo im Gaafu-Alifu-Atoll ist der Heimathafen der Emperor, wo Boot und Crew normalerweise liegen. Charter lassen sich zum selben Preis auch von anderen Orten auf den Malediven organisieren — abhängig von Ihren Daten, der Position des Boots und dem Seegang. Sagen Sie uns, wo Sie wohnen, und wir bestätigen, was möglich ist." },
    { question: "Was kostet ein Emperor-Charter?", answer: "1.380 USD für einen ganzen Tag oder 980 USD für einen halben Tag, pro Boot (bis zu 5 Angler) — derselbe Preis, wo immer wir Ihr Charter auf den Malediven organisieren; siehe die Preise unten." },
    { question: "Was ist inklusive?", answer: "Professioneller Kapitän und Crew, Treibstoff, Softdrinks und Snacks sowie Basis-Angelausrüstung sind bei jedem Emperor-Charter inklusive." },
    { question: "Worauf kann ich mit der Emperor angeln?", answer: "Popping und Jigging über äußeren Riff- und Kanalkanten auf Giant Trevally und Dogtooth-Thun, Schleppangeln weiter draußen auf Gelbflossen-Thun, Wahoo und andere pelagische Arten sowie ruhigeres Riffangeln näher an der Küste — die richtige Mischung hängt von Ort und Saison ab." },
    { question: "Brauche ich eigene Angelausrüstung?", answer: "Nein — Basis-Angelausrüstung ist inklusive. Wenn Sie Ihre eigene Rute, Rolle oder Fliegen bevorzugen, bringen Sie sie gern mit." },
  ],
  exploreMoreTitle: "Mehr entdecken",
  relatedLabels: ["Angeln auf den Malediven", "Angelurlaub-Pakete", "Maamendhoo, Gaafu Alifu"],
  from: "Ab",
  perBoat: "pro Boot",
  waMessage: "Hallo, ich möchte das private Angelcharter Emperor buchen.\nMein Standort:\nDatum:\nAnzahl der Angler:\nZielfisch:\nHalber oder ganzer Tag:",
};

const ES: EmperorStrings = {
  metaTitle: "Emperor, chárter privado de pesca en Maldivas | Atolón de Gaafu",
  metaDescription: "Emperor, un barco de pesca de 32 pies con dos motores de 200 CV para hasta 5 pescadores, con base en el atolón de Gaafu: misma tarifa dondequiera que organicemos tu chárter en Maldivas.",
  eyebrow: "Chárter privado de pesca",
  title: "Emperor: chárter privado de pesca por todo Maldivas",
  heroDescription: "32 pies · Dos motores de 200 CV · Hasta 5 pescadores. Con base en el atolón de Gaafu: misma tarifa dondequiera que organicemos tu chárter en Maldivas.",
  requestAvailability: "Consultar disponibilidad",
  whatsappUs: "Escríbenos por WhatsApp",
  meetTitle: "Conoce el Emperor",
  meetP1: "El Emperor es un barco de pesca privado de 32 pies con dos motores fueraborda de 200 CV y capacidad para 5 pescadores. El barco y la tripulación tienen su base en Maamendhoo, en el atolón de Gaafu Alifu: zonas de pesca reales y remotas, con menos presión que los atolones de resorts en los que piensa primero la mayoría de los visitantes.",
  meetP2Strong: "Tú eliges el lugar. Nosotros te ayudamos a organizar la pesca.",
  meetP2: "Dinos dónde te alojas, tus fechas, el número de pescadores y qué te gustaría pescar, y nuestro equipo confirmará la salida más adecuada, ya sea en las zonas del Emperor en Gaafu o en otra región. La tarifa es la misma dondequiera que organicemos tu chárter; lo único que varía según el lugar es la disponibilidad, que depende de la posición del barco, el tiempo, el estado del mar y el horario de la tripulación, así que confirmamos la fecha contigo antes de reservar.",
  features: [
    "Barco privado para tu grupo, no compartido con otros pescadores",
    "Hasta 5 pescadores",
    "Barco de pesca de 32 pies, dos motores fueraborda de 200 CV",
    "Capitán y tripulación profesionales",
    "Equipo de pesca básico incluido",
    "Chárteres de medio día y día completo",
    "Misma tarifa dondequiera que organicemos tu chárter en Maldivas",
  ],
  whereTitle: "¿Dónde puedes pescar?",
  whereText: "Las aguas de origen del Emperor están en el atolón de Gaafu, en el extremo sur de Maldivas. Los chárteres también se pueden organizar desde otras regiones con la misma tarifa; el lugar y la fecha exactos de salida dependen de dónde te alojes y de la posición del barco en ese momento.",
  homeBaseSuffix: ": nuestra base",
  elsewhereBefore: "¿Te alojas en otro sitio?",
  elsewhereLink: "Pregúntanos por WhatsApp",
  elsewhereAfter: " y te diremos con sinceridad si el Emperor puede llegar hasta ti.",
  techniquesTitle: "Técnicas de pesca",
  techniquesBefore: "Lo que funciona depende del lugar y la temporada; consulta ",
  seasonsLink: "las temporadas de pesca en Maldivas",
  techniquesAfter: " para una orientación general.",
  techniqueLabels: ["Popping (GT)", "Jigging (GT, atún diente de perro)", "Curricán / Pesca de altura (atún, peto)", "Pesca de arrecife"],
  ratesTitle: "Tarifas del chárter Emperor",
  ratesIntro: "Una tarifa por barco dondequiera que organicemos tu chárter en Maldivas, sin recargos por traslado ni posicionamiento.",
  preferWhatsappBefore: "¿Prefieres WhatsApp?",
  preferWhatsappLink: "Escribe directamente a un experto en pesca",
  faqs: [
    { question: "¿El Emperor solo sale de Maamendhoo?", answer: "Maamendhoo, en el atolón de Gaafu Alifu, es la base del Emperor, donde suelen estar el barco y la tripulación. También se pueden organizar chárteres desde otros lugares de Maldivas con la misma tarifa, según tus fechas, la posición del barco y el estado del mar: dinos dónde te alojas y confirmaremos qué es posible." },
    { question: "¿Cuánto cuesta un chárter del Emperor?", answer: "1.380 USD el día completo o 980 USD el medio día, por barco (hasta 5 pescadores): la misma tarifa dondequiera que organicemos tu chárter en Maldivas; consulta las tarifas abajo." },
    { question: "¿Qué incluye?", answer: "Capitán y tripulación profesionales, combustible, refrescos y aperitivos, y equipo de pesca básico en todos los chárteres del Emperor." },
    { question: "¿Qué puedo pescar con el Emperor?", answer: "Popping y jigging en bordes exteriores de arrecife y canales para jurel gigante y atún diente de perro, curricán más mar adentro para atún de aleta amarilla, peto y otros pelágicos, y pesca de arrecife más tranquila cerca de la costa; la combinación ideal depende del lugar y la temporada." },
    { question: "¿Necesito mi propio equipo de pesca?", answer: "No; el equipo básico está incluido. Si prefieres tu propia caña, carrete o moscas, puedes traerlos." },
  ],
  exploreMoreTitle: "Descubre más",
  relatedLabels: ["Pesca en Maldivas", "Paquetes de pesca", "Maamendhoo, Gaafu Alifu"],
  from: "Desde",
  perBoat: "por barco",
  waMessage: "Hola, me gustaría reservar el chárter privado de pesca Emperor.\nMi ubicación:\nFecha:\nNúmero de pescadores:\nEspecie objetivo:\n¿Medio día o día completo?:",
};

const IT: EmperorStrings = {
  metaTitle: "Emperor, charter di pesca privato alle Maldive | Atollo di Gaafu",
  metaDescription: "Emperor, barca da pesca di 32 piedi con due motori da 200 CV per un massimo di 5 pescatori, con base nell'atollo di Gaafu: stessa tariffa ovunque organizziamo il tuo charter alle Maldive.",
  eyebrow: "Charter di pesca privato",
  title: "Emperor: charter di pesca privato in tutte le Maldive",
  heroDescription: "32 piedi · Due motori da 200 CV · Fino a 5 pescatori. Base nell'atollo di Gaafu: stessa tariffa ovunque organizziamo il tuo charter alle Maldive.",
  requestAvailability: "Verifica disponibilità",
  whatsappUs: "Scrivici su WhatsApp",
  meetTitle: "Ecco Emperor",
  meetP1: "Emperor è una barca da pesca privata di 32 piedi con due motori fuoribordo da 200 CV e posto per 5 pescatori. Barca ed equipaggio hanno base a Maamendhoo, nell'atollo di Gaafu Alifu: zone di pesca reali e remote, meno battute degli atolli dei resort a cui pensano per primi quasi tutti i visitatori.",
  meetP2Strong: "Tu scegli il luogo. Noi ti aiutiamo a organizzare la pesca.",
  meetP2: "Dicci dove alloggi, le date del viaggio, il numero di pescatori e cosa vorresti catturare, e il nostro team confermerà la partenza più adatta, che sia nelle acque di Emperor a Gaafu o in un'altra regione. La tariffa è la stessa ovunque organizziamo il charter; a cambiare in base al luogo è solo la disponibilità, che dipende dalla posizione della barca, dal meteo, dalle condizioni del mare e dai turni dell'equipaggio, per questo confermiamo la data con te prima della prenotazione.",
  features: [
    "Barca privata per il tuo gruppo, non condivisa con altri pescatori",
    "Fino a 5 pescatori",
    "Barca da pesca di 32 piedi, due fuoribordo da 200 CV",
    "Capitano ed equipaggio professionisti",
    "Attrezzatura da pesca di base inclusa",
    "Charter di mezza giornata e giornata intera",
    "Stessa tariffa ovunque organizziamo il tuo charter alle Maldive",
  ],
  whereTitle: "Dove puoi pescare?",
  whereText: "Le acque di casa di Emperor sono nell'atollo di Gaafu, nell'estremo sud delle Maldive. I charter si possono organizzare anche da altre regioni alla stessa tariffa: luogo e data di partenza dipendono da dove alloggi e da dove si trova la barca in quel momento.",
  homeBaseSuffix: ": la nostra base",
  elsewhereBefore: "Alloggi altrove?",
  elsewhereLink: "Chiedici su WhatsApp",
  elsewhereAfter: ": ti diremo onestamente se Emperor può raggiungerti.",
  techniquesTitle: "Tecniche di pesca",
  techniquesBefore: "Cosa rende di più dipende dal luogo e dalla stagione: vedi ",
  seasonsLink: "le stagioni di pesca alle Maldive",
  techniquesAfter: " per indicazioni generali.",
  techniqueLabels: ["Popping (GT)", "Jigging (GT, tonno dente di cane)", "Traina / Pesca d'altura (tonno, wahoo)", "Pesca sul reef"],
  ratesTitle: "Tariffe del charter Emperor",
  ratesIntro: "Una tariffa a barca ovunque organizziamo il tuo charter alle Maldive, senza supplementi per trasferimento o posizionamento.",
  preferWhatsappBefore: "Preferisci WhatsApp?",
  preferWhatsappLink: "Scrivi direttamente a un esperto di pesca",
  faqs: [
    { question: "Emperor parte solo da Maamendhoo?", answer: "Maamendhoo, nell'atollo di Gaafu Alifu, è la base di Emperor, dove di norma si trovano barca ed equipaggio. I charter si possono organizzare anche da altri luoghi delle Maldive alla stessa tariffa, a seconda delle date, della posizione della barca e delle condizioni del mare: dicci dove alloggi e ti confermeremo cosa è possibile." },
    { question: "Quanto costa un charter con Emperor?", answer: "1.380 USD per una giornata intera o 980 USD per mezza giornata, a barca (fino a 5 pescatori): la stessa tariffa ovunque organizziamo il charter alle Maldive; vedi le tariffe qui sotto." },
    { question: "Cosa è incluso?", answer: "Capitano ed equipaggio professionisti, carburante, bibite e snack e attrezzatura da pesca di base sono inclusi in ogni charter Emperor." },
    { question: "Cosa posso insidiare con Emperor?", answer: "Popping e jigging sui bordi esterni del reef e dei canali per carango gigante e tonno dente di cane, traina più al largo per tonno pinna gialla, wahoo e altri pelagici, e una pesca sul reef più tranquilla vicino alla costa: il mix giusto dipende dal luogo e dalla stagione." },
    { question: "Mi serve la mia attrezzatura da pesca?", answer: "No: l'attrezzatura di base è inclusa. Se preferisci la tua canna, il tuo mulinello o le tue mosche, puoi portarli." },
  ],
  exploreMoreTitle: "Scopri di più",
  relatedLabels: ["Pesca alle Maldive", "Pacchetti pesca", "Maamendhoo, Gaafu Alifu"],
  from: "Da",
  perBoat: "a barca",
  waMessage: "Ciao, vorrei prenotare il charter di pesca privato Emperor.\nLa mia posizione:\nData:\nNumero di pescatori:\nSpecie bersaglio:\nMezza giornata o giornata intera:",
};

const RU: EmperorStrings = {
  metaTitle: "Emperor — частный рыболовный чартер на Мальдивах | Атолл Гаафу",
  metaDescription: "Emperor — 32-футовая рыболовная лодка с двумя моторами по 200 л. с. для до 5 рыбаков, база в атолле Гаафу. Одна цена, где бы на Мальдивах мы ни организовали ваш чартер.",
  eyebrow: "Частный рыболовный чартер",
  title: "Emperor — частный рыболовный чартер по всем Мальдивам",
  heroDescription: "32 фута · Два мотора по 200 л. с. · До 5 рыбаков. База в атолле Гаафу — одна цена, где бы на Мальдивах мы ни организовали ваш чартер.",
  requestAvailability: "Узнать о наличии мест",
  whatsappUs: "Написать в WhatsApp",
  meetTitle: "Знакомьтесь: Emperor",
  meetP1: "Emperor — частная рыболовная лодка длиной 32 фута с двумя подвесными моторами по 200 л. с., вмещающая до 5 рыбаков. Лодка и команда базируются на острове Маамендху в атолле Гаафу Алифу — настоящие удалённые рыболовные угодья, где давление на рыбу ниже, чем в курортных атоллах, о которых большинство туристов думает в первую очередь.",
  meetP2Strong: "Вы выбираете место. Мы помогаем организовать рыбалку.",
  meetP2: "Сообщите, где вы остановились, даты поездки, количество рыбаков и что хотите поймать, и наша команда подтвердит самый удобный вариант выхода — в родных водах Emperor в атолле Гаафу или в другом регионе. Цена везде одинакова; от места зависит только наличие свободных дат — оно определяется положением лодки, погодой, состоянием моря и графиком команды, поэтому мы подтверждаем дату с вами до бронирования.",
  features: [
    "Частная лодка для вашей группы — без других рыбаков",
    "До 5 рыбаков",
    "32-футовая рыболовная лодка, два подвесных мотора по 200 л. с.",
    "Профессиональный капитан и команда",
    "Базовое снаряжение включено",
    "Чартеры на полдня и на полный день",
    "Одна цена, где бы на Мальдивах мы ни организовали ваш чартер",
  ],
  whereTitle: "Где можно рыбачить?",
  whereText: "Родные воды Emperor — атолл Гаафу на крайнем юге Мальдив. Чартер можно организовать и из других регионов по той же цене — точное место и дата выхода зависят от того, где вы живёте, и от того, где в это время находится лодка.",
  homeBaseSuffix: " — наша база",
  elsewhereBefore: "Остановились в другом месте?",
  elsewhereLink: "Спросите нас в WhatsApp",
  elsewhereAfter: " — мы честно скажем, сможет ли Emperor до вас добраться.",
  techniquesTitle: "Техники ловли",
  techniquesBefore: "Что сработает лучше, зависит от места и сезона — общие рекомендации смотрите в разделе ",
  seasonsLink: "«Сезоны рыбалки на Мальдивах»",
  techniquesAfter: ".",
  techniqueLabels: ["Поппинг (GT)", "Джиггинг (GT, собакозубый тунец)", "Троллинг / Глубоководная рыбалка (тунец, ваху)", "Рифовая рыбалка"],
  ratesTitle: "Цены на чартер Emperor",
  ratesIntro: "Одна цена за лодку, где бы на Мальдивах мы ни организовали ваш чартер, — без доплат за трансфер или перегон.",
  preferWhatsappBefore: "Удобнее WhatsApp?",
  preferWhatsappLink: "Напишите эксперту по рыбалке напрямую",
  faqs: [
    { question: "Emperor выходит только из Маамендху?", answer: "Маамендху в атолле Гаафу Алифу — база Emperor, где обычно находятся лодка и команда. Чартер можно организовать и из других мест Мальдив по той же цене — в зависимости от ваших дат, положения лодки и состояния моря. Скажите, где вы остановились, и мы подтвердим, что возможно." },
    { question: "Сколько стоит чартер Emperor?", answer: "1380 долларов США за полный день или 980 долларов США за полдня за лодку (до 5 рыбаков) — одна цена, где бы на Мальдивах мы ни организовали чартер; см. цены ниже." },
    { question: "Что входит в стоимость?", answer: "Профессиональный капитан и команда, топливо, безалкогольные напитки и закуски, а также базовое снаряжение входят в каждый чартер Emperor." },
    { question: "Кого можно ловить с Emperor?", answer: "Поппинг и джиггинг у внешних рифовых стен и каналов на гигантского каранкса и собакозубого тунца, троллинг подальше от берега на желтоперого тунца, ваху и других пелагических рыб, а также более спокойная рифовая рыбалка ближе к берегу — оптимальный вариант зависит от места и сезона." },
    { question: "Нужно ли своё снаряжение?", answer: "Нет — базовое снаряжение включено. Если вам привычнее своё удилище, катушка или мушки, можете взять их с собой." },
  ],
  exploreMoreTitle: "Ещё по теме",
  relatedLabels: ["Рыбалка на Мальдивах", "Рыболовные туры", "Маамендху, Гаафу Алифу"],
  from: "От",
  perBoat: "за лодку",
  waMessage: "Здравствуйте, я хочу забронировать частный рыболовный чартер Emperor.\nМоё местоположение:\nДата:\nКоличество рыбаков:\nЦелевой вид:\nПолдня или полный день:",
};

const JA: EmperorStrings = {
  metaTitle: "エンペラー号 モルディブのプライベート釣りチャーター | ガーフ環礁",
  metaDescription: "エンペラー号は200馬力エンジン2基を備えた32フィートの釣り船で、最大5名まで。ガーフ環礁を拠点に、モルディブのどこで手配しても同じ料金です。",
  eyebrow: "プライベート釣りチャーター",
  title: "エンペラー号 — モルディブ全域のプライベート釣りチャーター",
  heroDescription: "32フィート・200馬力エンジン×2・最大5名。ガーフ環礁が拠点。モルディブのどこで手配しても同じ料金です。",
  requestAvailability: "空き状況を問い合わせる",
  whatsappUs: "WhatsAppで連絡",
  meetTitle: "エンペラー号について",
  meetP1: "エンペラー号は、200馬力の船外機2基を備えた全長32フィートのプライベート釣り船で、最大5名の釣り人が乗船できます。船とクルーはガーフ・アリフ環礁のマーメンドゥを拠点にしており、多くの旅行者が最初に思い浮かべるリゾートの集まる環礁よりも釣りのプレッシャーが少ない、本当に手つかずの遠い釣り場です。",
  meetP2Strong: "場所はお客様が選び、釣りの手配は私たちがお手伝いします。",
  meetP2: "滞在先、旅行日程、釣り人の人数、釣りたい魚をお知らせいただければ、エンペラー号の本拠地ガーフ環礁でもほかの地域でも、最適な出航方法をチームが確認します。料金はどこで手配しても同じで、場所によって変わるのは空き状況だけです。空き状況は船の位置、天候、海況、クルーのスケジュールによって決まるため、ご予約前に日程を確認させていただきます。",
  features: [
    "グループ専用のプライベートボート（ほかの釣り人とは相乗りなし）",
    "最大5名",
    "32フィートの釣り船、200馬力の船外機×2",
    "プロの船長とクルー",
    "基本的な釣り道具付き",
    "半日・1日チャーター",
    "モルディブのどこで手配しても同じ料金",
  ],
  whereTitle: "どこで釣りができますか？",
  whereText: "エンペラー号のホームはモルディブ最南部のガーフ環礁です。ほかの地域からも同じ料金でチャーターを手配できます。正確な出航場所と日程は、滞在先とその時点の船の位置によって決まります。",
  homeBaseSuffix: "（当社の拠点）",
  elsewhereBefore: "ほかの場所に滞在していますか？",
  elsewhereLink: "WhatsAppでお問い合わせください",
  elsewhereAfter: "。エンペラー号が伺えるかどうか、正直にお答えします。",
  techniquesTitle: "釣りのテクニック",
  techniquesBefore: "釣れるものは場所や季節によって異なります。一般的な目安は",
  seasonsLink: "モルディブの釣りシーズン",
  techniquesAfter: "をご覧ください。",
  techniqueLabels: ["ポッピング（GT）", "ジギング（GT、イソマグロ）", "トローリング／ビッグゲーム（マグロ、ワフー）", "リーフフィッシング"],
  ratesTitle: "エンペラー号のチャーター料金",
  ratesIntro: "モルディブのどこで手配しても、1隻あたりの料金は同じです。移動や回航の追加料金はかかりません。",
  preferWhatsappBefore: "WhatsAppのほうが便利ですか？",
  preferWhatsappLink: "釣りの専門家に直接メッセージを送る",
  faqs: [
    { question: "エンペラー号はマーメンドゥからしか出航しませんか？", answer: "ガーフ・アリフ環礁のマーメンドゥはエンペラー号の拠点で、通常は船とクルーがここにいます。日程、船の位置、海況によっては、モルディブのほかの場所からも同じ料金でチャーターを手配できます。滞在先をお知らせいただければ、可能かどうかを確認します。" },
    { question: "エンペラー号のチャーター料金はいくらですか？", answer: "1隻あたり（最大5名）1日1,380米ドル、半日980米ドルです。モルディブのどこで手配しても同じ料金です。下の料金をご覧ください。" },
    { question: "何が含まれますか？", answer: "すべてのエンペラー号のチャーターに、プロの船長とクルー、燃料、ソフトドリンクと軽食、基本的な釣り道具が含まれます。" },
    { question: "エンペラー号では何を狙えますか？", answer: "外洋側のリーフエッジやチャネルでのポッピングとジギングでロウニンアジやイソマグロ、沖合のトローリングでキハダマグロやカマスサワラなどの回遊魚、そして岸近くの穏やかなリーフフィッシングです。最適な組み合わせは場所と季節によって異なります。" },
    { question: "自分の釣り道具は必要ですか？", answer: "いいえ。基本的な釣り道具は含まれています。お気に入りのロッド、リール、フライがあればお持ちいただいてもかまいません。" },
  ],
  exploreMoreTitle: "関連ページ",
  relatedLabels: ["モルディブの釣り", "釣り旅行パッケージ", "マーメンドゥ（ガーフ・アリフ）"],
  from: "料金",
  perBoat: "（1隻あたり）",
  waMessage: "こんにちは。プライベート釣りチャーター「エンペラー号」を予約したいです。\n現在地：\n日付：\n釣り人の人数：\n狙いたい魚：\n半日または1日：",
};

const ZH: EmperorStrings = {
  metaTitle: "Emperor 马尔代夫私人钓鱼包船 | 加夫环礁",
  metaDescription: "Emperor是一艘32英尺、配备两台200马力引擎的钓鱼船，最多可载5位钓手，以加夫环礁为基地——无论在马尔代夫哪里为你安排，价格都一样。",
  eyebrow: "私人钓鱼包船",
  title: "Emperor——覆盖马尔代夫全境的私人钓鱼包船",
  heroDescription: "32英尺 · 两台200马力引擎 · 最多5位钓手。以加夫环礁为基地——无论在马尔代夫哪里为你安排，价格都一样。",
  requestAvailability: "查询空档",
  whatsappUs: "WhatsApp联系我们",
  meetTitle: "认识Emperor",
  meetP1: "Emperor是一艘32英尺的私人钓鱼船，配备两台200马力舷外机，最多可载5位钓手。船只和船员以加夫阿里夫环礁的马门杜岛为基地——这是真正偏远的钓场，捕捞压力比大多数游客首先想到的度假村集中的环礁要小。",
  meetP2Strong: "地点由你选择，钓鱼由我们帮你安排。",
  meetP2: "告诉我们你的住处、出行日期、钓手人数以及想钓的鱼，我们的团队会确认最合适的出发安排——无论是在Emperor的加夫环礁钓场还是其他地区。无论在哪里安排，价格都一样；随地点变化的只有空档，它取决于船只位置、天气、海况和船员排班，所以我们会在预订前与你确认日期。",
  features: [
    "你的团队专属私人船只——不与其他钓手拼船",
    "最多5位钓手",
    "32英尺钓鱼船，两台200马力舷外机",
    "专业船长和船员",
    "含基本钓具",
    "半天和全天包船",
    "无论在马尔代夫哪里安排，价格都一样",
  ],
  whereTitle: "可以在哪里钓鱼？",
  whereText: "Emperor的主场位于马尔代夫最南端的加夫环礁。也可以按同样的价格从其他地区安排包船——具体的出发地点和日期取决于你的住处以及届时船只所在的位置。",
  homeBaseSuffix: "——我们的基地",
  elsewhereBefore: "住在别处？",
  elsewhereLink: "在WhatsApp上问我们",
  elsewhereAfter: "——我们会如实告诉你Emperor能否到达。",
  techniquesTitle: "钓法",
  techniquesBefore: "哪种钓法效果好取决于地点和季节——一般性参考请看",
  seasonsLink: "马尔代夫钓鱼季节",
  techniquesAfter: "。",
  techniqueLabels: ["波扒（GT）", "铁板钓（GT、犬齿金枪鱼）", "拖钓／大型游钓（金枪鱼、刺鲅）", "礁石钓"],
  ratesTitle: "Emperor包船价格",
  ratesIntro: "无论在马尔代夫哪里为你安排，每船一个价格——没有额外的接送或调船费用。",
  preferWhatsappBefore: "更喜欢用WhatsApp？",
  preferWhatsappLink: "直接联系钓鱼专家",
  faqs: [
    { question: "Emperor只从马门杜出发吗？", answer: "加夫阿里夫环礁的马门杜岛是Emperor的基地，船只和船员通常在那里。根据你的日期、船只位置和海况，也可以按同样的价格从马尔代夫其他地方安排包船——告诉我们你的住处，我们会确认是否可行。" },
    { question: "Emperor包船多少钱？", answer: "每船（最多5位钓手）全天1,380美元，半天980美元——无论在马尔代夫哪里安排，价格都一样，见下方价格。" },
    { question: "包含哪些内容？", answer: "每次Emperor包船都包含专业船长和船员、燃油、软饮和零食以及基本钓具。" },
    { question: "乘Emperor能钓什么？", answer: "在外礁和水道边缘用波扒和铁板钓钓浪人鲹和犬齿金枪鱼，到更远的海域拖钓黄鳍金枪鱼、刺鲅等大洋性鱼类，也可以在近岸进行较轻松的礁石钓——最佳组合取决于地点和季节。" },
    { question: "需要自带钓具吗？", answer: "不需要——包含基本钓具。如果你更喜欢自己的鱼竿、渔轮或飞蝇，也欢迎带来。" },
  ],
  exploreMoreTitle: "更多内容",
  relatedLabels: ["马尔代夫钓鱼", "钓鱼度假套餐", "马门杜岛（加夫阿里夫）"],
  from: "起价",
  perBoat: "每船",
  waMessage: "您好，我想预订Emperor私人钓鱼包船。\n我的位置：\n日期：\n钓手人数：\n目标鱼种：\n半天还是全天：",
};

const STRINGS: Partial<Record<Locale, EmperorStrings>> = { de: DE, es: ES, it: IT, ru: RU, ja: JA, zh: ZH };

export const EMPEROR_LOCALES = Object.keys(STRINGS) as Locale[];

export function getEmperorStrings(locale: Locale): EmperorStrings | null {
  const base = STRINGS[locale];
  if (!base) return null;
  const update = getFishingContentUpdate(locale);
  return update ? { ...base, ...update.emperor } : base;
}
