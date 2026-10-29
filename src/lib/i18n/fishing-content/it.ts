import type { FishingContentUpdate } from "@/lib/i18n/fishing-content/types";

const REEF_PKG_HEADERS = ["Pacchetto (pesca sul reef a giornata intera)", "Giorni di pesca", "A persona, 2 pescatori", "A persona, 5 pescatori"];
const TUNA_PKG_HEADERS = ["Pacchetto (pesca al tonno a giornata intera)", "Giorni di pesca", "A persona, 2 pescatori", "A persona, 5 pescatori"];
const PKG_TABLE6 = ["Pacchetto", "Giorni di pesca", "1 ospite", "2 ospiti", "3 ospiti", "4 ospiti", "5 ospiti", "6 ospiti"];

export const IT: FishingContentUpdate = {
  species: {
    "gt-fishing": {
      metaDescription: "Pesca al GT alle Maldive: popping e jigging al carango gigante su reef esterni e canali a bordo di Emperor, charter privato da 980 USD a barca.",
      extraSections: [
        {
          heading: "Dove pescare il GT alle Maldive",
          paragraphs: [
            "Il carango gigante caccia dove il reef incontra l'acqua in movimento. Alle Maldive significa i bordi del reef esterno, dove il corallo precipita nel blu profondo, e i canali (kandu) che tagliano l'anello dell'atollo. Con la marea in corsa, i pesci foraggio vengono spinti attraverso questi canali tra laguna e oceano aperto, e i GT si radunano alle bocche dei canali e lungo i bordi per tendere agguati.",
            "Meno un reef viene pescato, migliori sono le possibilità: per questo chi pesca il GT va negli atolli remoti dell'estremo sud invece che negli affollati atolli turistici intorno a Malé. La nostra barca per charter privati, Emperor, può essere organizzata in altri atolli alla stessa tariffa a seconda delle date e della posizione della barca, ma la sua base è l'atollo di Gaafu Alifu.",
          ],
        },
        {
          heading: "Pesca al GT nell'atollo di Gaafu Alifu",
          paragraphs: [
            "Gaafu Alifu è la metà settentrionale dell'atollo di Huvadhu, nel profondo sud delle Maldive, uno degli atolli più grandi del mondo. Il suo lungo reef esterno è interrotto da molti canali e, con pochi resort e poche barche da pesca, i reef subiscono molta meno pressione di pesca degli atolli centrali. Proprio questa combinazione di canali, cadute profonde e acque tranquille è ciò che serve alla pesca al GT.",
            "Emperor e il suo equipaggio hanno base a Maamendhoo, un'isola locale di Gaafu Alifu, presso il Maldives Fishing and Holidays Lodge. Soggiornare al lodge ti tiene vicino alle zone di pesca, così puoi essere sul reef quando la marea comincia a correre. Si arriva con un volo interno da Malé (365 USD a persona) e un breve trasferimento in barca, entrambi inclusi nei nostri pacchetti di pesca.",
            "Gaafu Alifu è adatto anche a una giornata mista. Quando i GT sono tranquilli, la stessa barca può fare traina al largo per tonno pinna gialla, wahoo e lampuga, o jigging sulle pareti profonde per tonno dente di cane e cernie, così ogni giornata in acqua ha un obiettivo, qualunque siano marea e stagione.",
          ],
          linkLabels: ["Maldives Fishing and Holidays Lodge", "Maamendhoo, Gaafu Alifu", "Guida alla pesca nell'atollo di Gaafu"],
        },
        {
          heading: "Popping e jigging al GT alle Maldive",
          paragraphs: [
            "Il popping è il metodo classico per catturare il GT. Si lancia una grossa esca di superficie, un popper o uno stickbait, verso il bordo del reef o attraverso un canale e la si recupera con ampie strappate della canna perché schizzi e sollevi acqua. Un GT che attacca colpisce di solito con violenza vicino alla superficie e poi si getta verso il reef, quindi i primi secondi decidono il combattimento. Il popping è fisico: preparati a molti lanci con una canna pesante.",
            "Il jigging lavora acque più profonde. Un jig metallico pesante viene calato lungo la parete del reef e recuperato con canna e mulinello. È meno faticoso del popping, cattura GT che non mangiano in superficie e porta anche tonno dente di cane, cernie e altri pesci di reef. Molti pescatori combinano le due tecniche nella stessa giornata: popping con la marea che corre e i pesci attivi in alto, jigging quando stanno più in profondità.",
          ],
          linkLabels: ["Popping al GT alle Maldive", "Jigging alle Maldive"],
        },
        {
          heading: "Attrezzatura da popping per il GT",
          paragraphs: [
            "L'attrezzatura per il GT deve impedire a un pesce potentissimo di raggiungere il corallo nei primi secondi. Servono una canna da spinning pesante per lanciare esche grandi, un grosso mulinello da spinning per acqua salata con frizione potente, trecciato spesso e un terminale grosso in monofilo o fluorocarbon che resista al reef. Popper e stickbait si armano con ami singoli robusti o ancorette rinforzate e split ring resistenti.",
            "L'attrezzatura di base è inclusa in ogni charter con Emperor. Se non porti la tua attrezzatura da popping e jigging, puoi aggiungere un set professionale canna e mulinello a 80 USD a set. Porta occhiali polarizzati, cappello, guanti per maneggiare terminale e pesce e una crema solare rispettosa del reef.",
          ],
        },
        {
          heading: "Charter di pesca al GT: cosa aspettarsi e quanto costa",
          paragraphs: [
            "Un charter di mezza giornata dura circa 4 ore in acqua e uno di giornata intera circa 8 ore. L'equipaggio pianifica la giornata in base alla marea, perché l'acqua in movimento attiva i GT: la barca lavora le bocche dei canali e i bordi del reef con la marea che corre, e la stanca è un buon momento per fare jigging più in profondità o spostarsi.",
            "Emperor porta fino a 5 pescatori e il prezzo è a barca: 980 USD per mezza giornata o 1.380 USD per una giornata intera, con capitano ed equipaggio, carburante, bibite e snack e attrezzatura di base. Diviso tra cinque pescatori, una giornata intera di pesca al GT costa 276 USD a testa. Una giornata intera offre più maree e più spot.",
          ],
          linkLabels: ["Charter privato Emperor", "Costo di un viaggio di pesca alle Maldive", "Migliori destinazioni per la pesca al GT"],
        },
        {
          heading: "Vacanze e pacchetti di pesca al GT alle Maldive",
          paragraphs: [
            "Per una vacanza dedicata al GT, i nostri pacchetti al lodge di Maamendhoo includono pensione completa, volo interno andata e ritorno, trasferimento in barca e un charter privato con Emperor in ogni giorno di pesca. Il prezzo è a persona e scende quanti più pescatori condividono la barca. Questi sono i pacchetti di pesca sul reef a giornata intera:",
          ],
          table: { headers: REEF_PKG_HEADERS },
          linkLabels: ["Tutti i pacchetti di pesca alle Maldive", "Pacchetti con pesca a mezza giornata"],
        },
        {
          heading: "Quanto diventa grande il carango gigante?",
          paragraphs: [
            "Il carango gigante (Caranx ignobilis) è il più grande della sua famiglia e raggiunge circa 170 cm e 80 kg. Qualunque sia la taglia, un GT tira più forte di quasi ogni altro pesce del reef. I GT più piccoli cacciano spesso in gruppo, mentre i più grandi pattugliano da soli il bordo del reef.",
          ],
        },
        {
          heading: "Catch and release del carango gigante",
          paragraphs: [
            "Il carango gigante cresce lentamente e la maggior parte di chi lo pesca lo rilascia. Le buone pratiche aumentano le sue possibilità: usare ami singoli o senza ardiglione, accorciare il combattimento, sostenere il pesce in orizzontale sotto il ventre per una foto veloce invece di sollevarlo per la bocca e tenerlo fuori dall'acqua il meno possibile. Prima di lasciarlo, tienilo in acqua controcorrente finché non si allontana da solo.",
          ],
        },
      ],
      extraFaqs: [
        { question: "Quanto costa un'uscita di pesca al GT?", answer: "Un charter privato con Emperor costa 980 USD per mezza giornata o 1.380 USD per una giornata intera, a barca per fino a 5 pescatori. Un set professionale canna e mulinello per il GT costa 80 USD a set." },
        { question: "Dov'è la migliore pesca al GT alle Maldive?", answer: "Negli atolli remoti del sud, dove canali e bordi del reef esterno sono pochissimo pescati. La nostra barca, Emperor, ha base nell'atollo di Gaafu Alifu proprio per questo." },
        { question: "Serve esperienza per il popping al GT?", answer: "No, ma aiuta essere in forma: il popping significa molti lanci con una canna pesante. Il jigging è un modo più facile per iniziare e l'equipaggio può aiutarti con il lancio e il recupero dell'esca." },
        { question: "Posso prenotare un pacchetto di pesca al GT?", answer: "Sì. I nostri pacchetti al Maldives Fishing and Holidays Lodge di Maamendhoo, Gaafu Alifu, vanno da 2 a 8 notti e includono lodge, pasti, volo interno, trasferimento in barca e un charter privato in ogni giorno di pesca." },
        { question: "La pesca al GT è catch and release?", answer: "La maggior parte dei pescatori rilascia i GT. Ami singoli o senza ardiglione, un combattimento breve e una foto veloce con il pesce sostenuto in orizzontale gli danno le migliori possibilità." },
      ],
    },
    "tuna-fishing": {
      metaTitle: "Pesca al tonno pinna gialla alle Maldive | Charter",
      metaDescription: "Pesca al tonno pinna gialla alle Maldive: dove e come catturarlo, stagione migliore, attrezzatura e prezzi di un charter privato di pesca al tonno a Gaafu Alifu.",
      h1: "Pesca al tonno pinna gialla alle Maldive",
      extraSections: [
        {
          heading: "Il tonno pinna gialla alle Maldive",
          paragraphs: [
            "Il tonno pinna gialla è uno dei pesci sportivi più ricercati delle Maldive. È fatto per la velocità: corpo a siluro, dorso blu scuro, una fascia gialla sul fianco e lunghe pinne dorsale e anale di un giallo brillante. Raggiunge circa 200 cm e 200 kg, e anche un esemplare medio corre forte e profondo e combatte fino alla barca.",
            "Caccia in banchi in mare aperto, nutrendosi di pesci volanti, calamari e tonni più piccoli. Si trova spesso sotto uccelli marini in caccia, intorno a oggetti galleggianti e dispositivi di aggregazione (FAD) e insieme ai delfini. Alle Maldive lo pescano anche i pescatori locali con lenze a mano e canne, ed è un pilastro della cucina maldiviana.",
          ],
        },
        {
          heading: "Dove pescare il tonno pinna gialla alle Maldive",
          paragraphs: [
            "Il tonno pinna gialla vive nel blu profondo oltre gli atolli, quindi pescarlo significa uscire oltre il reef. L'equipaggio cerca uccelli che si tuffano sul foraggio, tonni che rompono la superficie, tronchi galleggianti e i FAD ancorati al largo, che attirano i pesci foraggio e i tonni che se ne nutrono.",
            "Alle Maldive l'oceano profondo è vicino a ogni atollo. A Gaafu Alifu, nell'estremo sud, il lungo reef esterno cade direttamente in acque profonde, così Emperor può fare traina al pinna gialla poco dopo aver lasciato Maamendhoo e passare al reef per GT o tonno dente di cane più tardi.",
          ],
        },
        {
          heading: "Come pescare il tonno pinna gialla",
          paragraphs: [
            "La traina è il metodo principale. La barca trascina al largo una serie di esche con gonnellino, minnow o esche armate e, quando un pinna gialla attacca, il mulinello urla e il pescatore prende la canna. La traina cattura anche wahoo, lampuga e tonnetto striato, e a volte pesce vela e marlin.",
            "Quando un banco di pinna gialla mangia in superficie, lanciare popper e stickbait nel mezzo dell'azione è uno dei modi più emozionanti per catturarlo e richiede attrezzatura da spinning pesante. L'attrezzatura da traina è a bordo; quella di base è inclusa e un set professionale da popping costa 80 USD a set.",
          ],
          linkLabels: ["Traina alle Maldive", "Pesca d'altura e big game"],
        },
        {
          heading: "Charter di pesca al tonno pinna gialla e prezzi",
          paragraphs: [
            "Emperor, la nostra barca da pesca privata, è lunga 32 piedi, ha due motori da 200 CV, porta fino a 5 pescatori e ha base a Maamendhoo, nell'atollo di Gaafu Alifu. Per il pinna gialla consigliamo una giornata intera, che dà il tempo di uscire al largo e trovare i banchi: 1.380 USD a barca, o 276 USD a testa con cinque pescatori. La mezza giornata costa 980 USD a barca. Entrambi includono capitano ed equipaggio, carburante, bibite e snack e attrezzatura di base.",
            "Per più giorni di pesca al tonno, i nostri pacchetti al Maldives Fishing and Holidays Lodge includono lodge, pensione completa, volo interno, trasferimento in barca e un charter privato in ogni giorno di pesca:",
          ],
          table: { headers: TUNA_PKG_HEADERS },
          linkLabels: ["Charter privato Emperor", "Tutti i pacchetti di pesca", "Pesca al tonno alle Maldive: tutte le specie"],
        },
        {
          heading: "Il pinna gialla e gli altri tonni delle Maldive",
          paragraphs: [
            "Il pinna gialla è uno dei tre tonni che si pescano alle Maldive. Il tonnetto striato è più piccolo, con il ventre a strisce, viaggia tutto l'anno in banchi enormi ed è la base della pesca tradizionale con canna e lenza. Il tonno dente di cane è un predatore di reef che vive sulle pareti profonde e si cattura a jigging, soprattutto da novembre ad aprile. Una giornata intera con Emperor può puntare a tutti e tre.",
          ],
          linkLabels: ["Pesca al tonno dente di cane", "Pesca tradizionale maldiviana"],
        },
        {
          heading: "Consigli per la pesca al tonno pinna gialla",
          paragraphs: [
            "Esci presto, quando il tonno spesso mangia con più foga. Cerca gli uccelli che si tuffano, il segnale migliore della presenza di tonni sotto. Prenota una giornata intera nella stagione da dicembre a marzo. Tieni solo il tonno che mangerai e rilascia il resto: un pinna gialla fresco è uno dei pasti migliori delle Maldive, crudo, alla griglia o in un curry maldiviano.",
          ],
        },
      ],
      extraFaqs: [
        { question: "Quanto diventa grande il tonno pinna gialla alle Maldive?", answer: "Raggiunge circa 200 cm e 200 kg, anche se la maggior parte di quelli catturati in un'uscita giornaliera è molto più piccola e combatte comunque con forza." },
        { question: "Quanto costa un'uscita di pesca al tonno alle Maldive?", answer: "Un charter privato di giornata intera con Emperor costa 1.380 USD a barca per fino a 5 pescatori, con equipaggio, carburante, bevande, snack e attrezzatura di base. La mezza giornata costa 980 USD." },
        { question: "Posso tenere il tonno che pesco?", answer: "Chiedi all'equipaggio. Il tonno tenuto per la tavola viene spesso preparato fresco; rilascia quello che non mangerai." },
      ],
    },
    "dogtooth-tuna": {
      metaDescription: "Pesca al tonno dente di cane alle Maldive: dove vive, come pescarlo a jigging, attrezzatura, stagione migliore e prezzi di un charter privato a Gaafu Alifu.",
      extraSections: [
        {
          heading: "Il tonno dente di cane: il combattente più duro del reef",
          paragraphs: [
            "Il tonno dente di cane (Gymnosarda unicolor) deve il nome ai denti affilati e conici, insoliti tra i tonni. A differenza del pinna gialla e del tonnetto, che percorrono l'oceano aperto in banchi, è un predatore di reef che vive su pareti profonde e cadute, di solito da solo o in piccoli gruppi. Raggiunge circa 130 cm e 70 kg.",
            "È famoso per la sua forza. Allamato, si gira e si getta dritto verso il reef, e se lo raggiunge la lenza di solito si taglia sul corallo. Portarne uno a bordo richiede attrezzatura pesante, frizione chiusa e un recupero rapido e deciso nei primi secondi del combattimento.",
          ],
        },
        {
          heading: "Dove trovare il tonno dente di cane alle Maldive",
          paragraphs: [
            "Il tonno dente di cane staziona sulle pareti ripide del reef esterno, dove il corallo cade in acqua profonda, sulle cadute alle bocche dei canali e intorno a pinnacoli profondi. Si nutre dove la corrente spinge il foraggio contro la parete, quindi i punti migliori sono sul lato della corrente con la marea che corre.",
            "Gli atolli remoti del sud sono tra i posti migliori delle Maldive per questo tonno, perché le loro pareti esterne sono pochissimo pescate. Gaafu Alifu, dove ha base la nostra barca Emperor, ha un lungo reef esterno con pareti profonde e cadute dei canali vicino a Maamendhoo.",
          ],
          linkLabels: ["Migliori spot di pesca alle Maldive"],
        },
        {
          heading: "Come pescare il tonno dente di cane: il jigging",
          paragraphs: [
            "Il jigging è il modo principale per catturarlo. Un jig metallico pesante viene calato lungo la parete fino alla profondità dei pesci e recuperato con strappate decise della canna e giri rapidi del mulinello. L'abboccata arriva spesso mentre il jig scende o nelle prime strappate dal fondo, quindi tieniti pronto appena il jig raggiunge la profondità.",
            "Lo speed jigging, con strappate aggressive e jig lunghi e sottili, è la tecnica classica. Lo slow pitch, con strappate brevi e jig più piatti che scendono sfarfallando, cattura anch'esso il dente di cane e in più cernie, lutjanidi e ricciole. A volte questo tonno sale sui popper in superficie o viene preso con esca viva.",
          ],
          linkLabels: ["Jigging alle Maldive", "Guida al popping e jigging al GT"],
        },
        {
          heading: "Attrezzatura da jigging per il tonno dente di cane",
          paragraphs: [
            "L'attrezzatura deve fermare un pesce potentissimo a pochi metri dal reef. Si usano una canna da jigging robusta e un mulinello da spinning o da jigging di grande capacità con frizione potente, trecciato per un contatto diretto con il jig e un terminale grosso in fluorocarbon che resista a denti e corallo. I jig vanno da circa 100 g a 300 g o più, a seconda di profondità e corrente, con assist hook robusti.",
            "Su Emperor l'attrezzatura di base è inclusa in ogni charter e puoi aggiungere un set professionale da jigging a 80 USD a set se non porti il tuo.",
          ],
        },
        {
          heading: "Come combattere un tonno dente di cane",
          paragraphs: [
            "Chiudi la frizione prima di calare il jig. Quando abbocca, non dargli filo: blocca la canna contro il corpo, solleva e recupera con forza per portarlo su e lontano dal reef nei primi secondi. Una volta lontano dalla parete, mantieni una pressione costante e pompa fino in superficie. Aiuta combattere da una barca in movimento: il capitano spesso si allontana dal reef per trascinare il pesce in acque libere.",
          ],
        },
        {
          heading: "Charter di pesca al tonno dente di cane e prezzi",
          paragraphs: [
            "Emperor è una barca di 32 piedi con due motori da 200 CV per fino a 5 pescatori. Un charter di giornata intera costa 1.380 USD a barca e uno di mezza giornata 980 USD, con capitano ed equipaggio, carburante, bibite e snack e attrezzatura di base. L'equipaggio pianifica il jigging sulle pareti in base alla marea e può aggiungere popping al GT e traina per tonno e wahoo.",
            "Per più giorni di jigging, i nostri pacchetti al Maldives Fishing and Holidays Lodge di Maamendhoo includono lodge, pensione completa, volo interno, trasferimento in barca e un charter privato in ogni giorno di pesca:",
          ],
          table: { headers: REEF_PKG_HEADERS },
          linkLabels: ["Charter privato Emperor", "Tutti i pacchetti di pesca", "Pesca al tonno alle Maldive"],
        },
        {
          heading: "Altri pesci che si catturano a jigging",
          paragraphs: [
            "Il jigging sulle pareti profonde raramente dà solo tonno dente di cane. Gli stessi jig catturano GT in profondità, ricciole, cernie, lutjanidi rossi, jobfish e altri pesci di reef, molti ottimi da mangiare. Lo slow pitch in particolare porta una grande varietà di specie di fondo, quindi una sessione di jigging vale la pena anche nei giorni in cui il dente di cane non abbocca.",
            "Poiché le pareti sono accanto alle bocche dei canali, l'equipaggio può anche passare al popping al GT con la marea che corre o uscire al largo a trainare pinna gialla e wahoo.",
          ],
          linkLabels: ["Pesca al GT alle Maldive", "Migliori destinazioni per popping e jigging"],
        },
        {
          heading: "Catch and release del tonno dente di cane",
          paragraphs: [
            "Il tonno dente di cane è un predatore di reef a crescita lenta e molti pescatori lo rilasciano. Accorcia il combattimento con attrezzatura robusta, maneggia il pesce con cura lontano dai denti, sostieni il suo peso per una foto veloce e rianimalo in acqua prima di lasciarlo. Se ne tieni uno, è un pesce eccellente.",
          ],
        },
      ],
      extraFaqs: [
        { question: "Quanto diventa grande il tonno dente di cane?", answer: "Raggiunge circa 130 cm e 70 kg. Anche gli esemplari medi sono fortissimi e si gettano verso il reef appena allamati." },
        { question: "Che peso di jig è meglio per il tonno dente di cane?", answer: "Dipende da profondità e corrente; molti pescatori portano jig da circa 100 g a 300 g o più e usano i più pesanti in acque profonde e con corrente forte." },
        { question: "Dov'è la migliore pesca al tonno dente di cane alle Maldive?", answer: "Sulle pareti ripide del reef esterno e sulle cadute dei canali degli atolli remoti del sud, come Gaafu Alifu, dove ha base Emperor." },
        { question: "Quanto costa un'uscita di pesca al tonno dente di cane?", answer: "Un charter privato di giornata intera con Emperor costa 1.380 USD a barca per fino a 5 pescatori, o 980 USD per mezza giornata. Un set professionale da jigging costa 80 USD a set." },
      ],
    },
  },
  techniques: {
    "big-game-fishing": {
      metaTitle: "Pesca d'altura alle Maldive | Charter big game",
      metaDescription: "Pesca d'altura e big game alle Maldive: traina a tonno pinna gialla, wahoo, pesce vela e marlin, stagione migliore, prezzi e charter privati.",
      h1: "Pesca d'altura e big game alle Maldive",
      heroDescription: "Traina al largo per tonno pinna gialla, wahoo, lampuga, pesce vela e marlin nel blu profondo oltre gli atolli.",
      extraSections: [
        {
          heading: "Pesca d'altura alle Maldive",
          paragraphs: [
            "La pesca d'altura, detta anche big game o pesca offshore, significa uscire oltre l'anello dell'atollo nel blu profondo dell'oceano Indiano per pescare grandi specie pelagiche. Alle Maldive l'acqua profonda comincia subito fuori dal reef di ogni atollo, quindi un'uscita d'altura non richiede una lunga navigazione: la barca può essere in traina lungo la caduta pochi minuti dopo aver lasciato l'isola.",
            "Gli obiettivi principali sono tonno pinna gialla, wahoo e lampuga, con pesce vela e marlin più al largo. Il tonnetto striato si trova spesso in grandi banchi, e tonno dente di cane e GT vivono sulle pareti del reef, per questo molte uscite d'altura alle Maldive uniscono la traina al largo a una sessione di popping o jigging sul reef.",
          ],
        },
        {
          heading: "Specie della pesca d'altura alle Maldive",
          paragraphs: ["Questi sono i principali pesci di un'uscita d'altura alle Maldive, con le stagioni dei nostri dati sulle specie. Variano per atollo e anno, quindi considerale indicative."],
          table: {
            headers: ["Specie", "Dove", "Stagione", "Tecnica principale"],
            cells: [
              ["Tonno pinna gialla", "Al largo, sotto gli uccelli, ai FAD", "Da dicembre a marzo", "Traina, lanci sui banchi"],
              ["Wahoo", "Bordi del reef esterno e al largo", "Da dicembre a marzo", "Traina veloce"],
              ["Lampuga", "Oggetti galleggianti, FAD", "Da dicembre ad aprile", "Traina, lanci"],
              ["Tonnetto striato", "Banchi al largo", "Tutto l'anno", "Traina con esche piccole"],
              ["Pesce vela", "Acque profonde, spesso vicino al reef", "Chiedi delle catture recenti", "Traina, esca viva"],
              ["Marlin", "Blu profondo al largo", "Chiedi delle catture recenti", "Traina"],
            ],
          },
        },
        {
          heading: "Pesca d'altura o pesca sul reef?",
          paragraphs: [
            "La pesca d'altura consiste nel coprire acqua al largo e aspettare l'abboccata di un pelagico veloce: lunghe navigazioni, molte esche in acqua e la possibilità di un tonno, un wahoo o un pesce con il rostro. La pesca sul reef, il popping e il jigging lavorano bordi, canali e pareti per GT, tonno dente di cane, cernie e lutjanidi. Alle Maldive non serve scegliere: l'acqua profonda è subito fuori dal reef, quindi una giornata intera su Emperor può includere qualche ora di traina e una sessione di popping o jigging al rientro.",
          ],
          linkLabels: ["Pesca al GT", "Guida al popping e jigging"],
        },
        {
          heading: "Tecniche di pesca d'altura",
          paragraphs: [
            "La traina è la tecnica principale. L'equipaggio mette in pesca diverse canne con esche con gonnellino, minnow o esche armate a distanze diverse dalla barca e naviga a velocità di traina lungo il bordo del reef esterno per il wahoo o al largo per tonno, lampuga e pesci con il rostro, cercando uccelli in caccia, oggetti galleggianti e pesci che rompono la superficie. Quando un pesce abbocca, un pescatore prende la canna e lo combatte dalla barca.",
            "Quando il pinna gialla mangia in superficie, si lanciano anche popper e stickbait nel banco, e si usa esca viva per pesci vela e marlin che salgono dietro la barca. L'attrezzatura da traina è a bordo.",
          ],
          linkLabels: ["Traina alle Maldive", "Big game nell'oceano Indiano"],
        },
        {
          heading: "Periodo migliore per la pesca d'altura alle Maldive",
          paragraphs: [
            "Il monsone di nord-est, più calmo, da dicembre ad aprile, è il periodo migliore per la pesca d'altura alle Maldive. Il mare è più piatto, le lunghe trainate sono più comode ed è alta stagione per tonno pinna gialla e wahoo (da dicembre a marzo) e lampuga (da dicembre ad aprile). Pesce vela e marlin si catturano al largo in periodi diversi; chiedici delle catture recenti quando pianifichi.",
            "Durante il monsone di sud-ovest, da maggio a novembre, le uscite continuano nei giorni più calmi, ed è la stagione più citata per il GT sul reef.",
          ],
          linkLabels: ["Periodo migliore per pescare alle Maldive"],
        },
        {
          heading: "Prezzi delle uscite di pesca d'altura",
          paragraphs: [
            "La nostra barca privata, Emperor, è una barca da pesca di 32 piedi con due motori da 200 CV per fino a 5 pescatori, con base a Maamendhoo nell'atollo di Gaafu Alifu, dove l'oceano profondo comincia subito dopo il lungo reef esterno. Per la pesca al largo consigliamo una giornata intera: 1.380 USD a barca, o 276 USD a testa con cinque pescatori. La mezza giornata costa 980 USD a barca. Entrambi includono capitano ed equipaggio, carburante, bibite e snack e attrezzatura di base.",
            "Vicino a Malé il sito elenca anche uscite big game di resort e operatori indipendenti; vedi i charter qui sotto. Per più giorni di pesca, i nostri pacchetti al Maldives Fishing and Holidays Lodge includono lodge, pasti, volo interno, trasferimento e un charter privato in ogni giorno di pesca.",
          ],
          table: { headers: TUNA_PKG_HEADERS },
          linkLabels: ["Charter privato Emperor", "Tutti i pacchetti di pesca", "Costo di un viaggio di pesca alle Maldive"],
        },
        {
          heading: "Pesca al marlin e al pesce vela",
          paragraphs: [
            "I pesci con il rostro sono il grande obiettivo della pesca d'altura. Il pesce vela, con l'enorme pinna dorsale e i salti acrobatici, si cattura spesso più vicino al reef del marlin; il marlin è un obiettivo a lungo raggio nel blu profondo, quindi una giornata intera dà più possibilità. I pesci con il rostro vengono normalmente rilasciati: lascia il pesce in acqua, tienilo accanto alla barca controcorrente e lascialo andare.",
          ],
          linkLabels: ["Pesca al marlin", "Pesca al pesce vela"],
        },
        {
          heading: "Consigli per la tua uscita di pesca d'altura",
          paragraphs: [
            "Prenota una giornata intera per le specie d'altura, che richiedono tempo per essere trovate. Prendi precauzioni contro il mal di mare se ne hai bisogno, perché al largo il mare può essere mosso. Porta cappello, occhiali polarizzati, una camicia a maniche lunghe e crema solare rispettosa del reef. Concorda con l'equipaggio quali pesci tenere per la tavola e quali rilasciare, e lascia che sia l'equipaggio a preparare l'attrezzatura da traina.",
          ],
          linkLabels: ["Cosa mettere in valigia per una vacanza di pesca"],
        },
      ],
      extraFaqs: [
        { question: "Che differenza c'è tra pesca d'altura e big game?", answer: "Indicano praticamente la stessa cosa: pescare al largo in acque profonde grandi pelagici come tonno, wahoo, pesce vela e marlin, soprattutto a traina." },
        { question: "Quanto costa la pesca d'altura alle Maldive?", answer: "Un charter privato di giornata intera con Emperor costa 1.380 USD a barca per fino a 5 pescatori, o 980 USD per mezza giornata, con equipaggio, carburante, bevande, snack e attrezzatura di base." },
        { question: "Qual è il periodo migliore per la pesca d'altura alle Maldive?", answer: "Da dicembre ad aprile, durante il monsone di nord-est più calmo, quando è stagione di tonno pinna gialla, wahoo e lampuga." },
        { question: "I principianti possono fare pesca d'altura?", answer: "Sì. L'equipaggio mette in pesca le esche e sorveglia le canne, ti passa la canna quando un pesce abbocca e ti guida nel combattimento." },
      ],
    },
  },
  emperor: {
    dayTitle: "Cosa aspettarsi da un charter di pesca privato",
    dayParagraphs: [
      "Un charter di mezza giornata dura circa 4 ore in acqua e uno di giornata intera circa 8 ore. Alla base di Emperor la barca parte da Maamendhoo, atollo di Gaafu Alifu; se organizziamo il tuo charter altrove, ti confermiamo il punto di partenza insieme alla data.",
      "Di' al capitano cosa vuole pescare il tuo gruppo e quanta esperienza ha ciascuno, e l'equipaggio pianifica la giornata in base a marea, meteo e stagione: popping e jigging sui bordi del reef esterno e nei canali per GT e tonno dente di cane, traina nei trasferimenti tra gli spot per tonno, wahoo e lampuga, o una pesca sul reef più tranquilla vicino all'isola. Una giornata intera lascia il tempo di combinarne diverse; mezza giornata di solito si concentra su una o due.",
      "A bordo ci sono bibite, snack e attrezzatura da pesca di base.",
    ],
    includedTitle: "Cosa è incluso in un charter di pesca privato",
    includedHeading: "Incluso in ogni charter",
    notIncludedHeading: "Non incluso",
    included: ["Capitano ed equipaggio professionisti", "Carburante", "Bibite e snack", "Attrezzatura da pesca di base"],
    notIncluded: [
      "Volo interno per l'atollo di Gaafu (365 USD a persona) se vieni alla base di Emperor",
      "Alloggio e pasti (il nostro lodge a Maamendhoo: 150 USD a camera, pensione completa)",
      "Set professionale canna e mulinello per popping e jigging più pesanti (80 USD a set)",
    ],
    packageBefore: "Più notti? Un ",
    packageLink: "pacchetto di pesca",
    packageAfter: " unisce i charter con lodge, pasti, volo interno e trasferimento in barca.",
  },
  packagesFishing: {
    metaTitle: "Pacchetti e vacanze di pesca alle Maldive | MTG",
    metaDescription: "Pacchetti di pesca nell'atollo di Gaafu Alifu: da 3 a 8 notti di pesca sul reef, al tonno o a mosca con lodge, pasti, volo domestico, transfer e barca privata.",
    intro:
      "Pacchetti vacanza di pesca al Maldives Fishing and Holidays Lodge di Maamendhoo, atollo di Gaafu Alifu: pensione completa in camera doppia, volo domestico andata e ritorno, trasferimento in barca e una barca privata per il vostro gruppo in ogni giorno di pesca. Da 3 a 8 notti di pesca sul reef, al tonno o a mosca, a giornata intera o mezza giornata, prezzo a persona — oppure create il vostro con il calcolatore dei pacchetti di pesca.",
    faqs: [
      { question: "Cosa include un pacchetto di pesca alle Maldive?", answer: "Pensione completa in camera doppia al Maldives Fishing and Holidays Lodge di Maamendhoo, volo domestico andata e ritorno da Malé, trasferimento in barca sull'isola e una barca privata per il vostro gruppo in ogni giorno di pesca (capitano ed equipaggio, carburante, bibite e snack, attrezzatura di base)." },
      { question: "Quanti giorni di pesca ho?", answer: "Uno in meno del numero di notti: un pacchetto di 3 notti ha 2 giorni di pesca, uno di 5 notti 4 e uno di 8 notti 7." },
      { question: "Perché il prezzo dipende dal numero di ospiti?", answer: "La barca costa lo stesso indipendentemente da quanti pescatori ci sono a bordo, quindi più persone la condividono, più basso è il prezzo a persona. 6 ospiti è la tariffa più conveniente." },
      { question: "Che differenza c'è tra pacchetti a giornata intera e a mezza giornata?", answer: "Quelli a giornata intera includono circa 8 ore in barca per giorno di pesca; quelli a mezza giornata circa 4 ore, costano meno e lasciano liberi i pomeriggi." },
      { question: "Che differenza c'è tra i pacchetti di pesca sul reef, al tonno e a mosca?", answer: "I pacchetti sul reef pescano lungo i bordi del reef e i canali: popping, jigging e pesca a fondo per GT, cernie e lutjanidi. I pacchetti al tonno escono al largo per traina e jigging al tonno pinna gialla, al tonnetto striato e al dogtooth. I pacchetti a mosca pescano sui flat e lungo i bordi del reef con la canna da mosca." },
      { question: "I voli internazionali sono inclusi?", answer: "No. I pacchetti includono il volo interno andata e ritorno da Malé e il trasferimento in barca; il volo internazionale per Malé lo prenoti tu." },
      { question: "Mi serve la mia attrezzatura da pesca?", answer: "No. L'attrezzatura di base è inclusa in ogni giorno di pesca. Un set professionale da popping o jigging costa 80 USD a set, oppure porta il tuo." },
      { question: "Possono venire anche i non pescatori?", answer: "Chiedicelo quando ci contatti. Il lodge è su un'isola locale, quindi chi non pesca può rilassarsi, nuotare e fare snorkeling mentre gli altri pescano." },
    ],
    relatedLabels: ["Pesca alle Maldive", "Charter privato Emperor", "Maldives Fishing and Holidays Lodge", "Costo di un viaggio di pesca", "Itinerario di un viaggio di pesca"],
    sections: [
      {
        heading: "Vacanze di pesca alle Maldive nell'atollo di Gaafu Alifu",
        paragraphs: [
          "I nostri pacchetti di pesca si basano su una delle zone di pesca più tranquille delle Maldive. Gaafu Alifu è la metà settentrionale dell'atollo di Huvadhu, nel profondo sud del paese, uno degli atolli più grandi del mondo. Il suo lungo reef esterno è interrotto da molti canali e cade direttamente nell'oceano profondo, e pochissime barche da pesca lo lavorano. È una base ideale per popping e jigging al GT, tonno dente di cane sulle pareti e traina al largo per tonno pinna gialla, wahoo e lampuga.",
          "Soggiorni al Maldives Fishing and Holidays Lodge di Maamendhoo, un'isola locale di Gaafu Alifu, gestito dalla stessa società della nostra barca Emperor. Camera, pasti, trasferimenti e pesca sono organizzati da un unico operatore e le zone di pesca sono vicine all'isola, così passi le giornate a pescare invece che a viaggiare.",
        ],
        linkLabels: ["Guida alla pesca nell'atollo di Gaafu", "Migliori spot di pesca alle Maldive"],
      },
      {
        heading: "Cosa include ogni pacchetto di pesca",
        paragraphs: [
          "Ogni pacchetto include pensione completa al lodge in camera doppia (una camera ogni due ospiti), il volo domestico andata e ritorno da Malé, il trasferimento in barca a Maamendhoo e una barca privata per il vostro gruppo in ogni giorno di pesca: Emperor, una barca di 32 piedi con due motori da 200 CV per un massimo di 5 pescatori, oppure Bluefin, una barca di 36 piedi per un massimo di 6. Ogni charter include capitano ed equipaggio, carburante, bibite e snack e attrezzatura di base.",
          "Non incluso: il tuo volo internazionale per Malé e, se lo desideri, un set professionale da popping o jigging (80 USD a set). I giorni di pesca sono uno in meno delle notti, quindi i giorni di arrivo e partenza sono di viaggio.",
        ],
      },
      {
        heading: "Prezzi dei pacchetti di pesca sul reef a giornata intera",
        paragraphs: ["I pacchetti di pesca sul reef a giornata intera includono circa 8 ore in barca in ogni giorno di pesca, lungo i bordi del reef e i canali: la scelta migliore per il popping e il jigging ai GT. I prezzi sono a persona e dipendono da quanti ospiti condividono la barca; 6 ospiti è la tariffa più conveniente."],
        table: { headers: PKG_TABLE6 },
      },
      {
        heading: "Prezzi dei pacchetti di pesca sul reef a mezza giornata",
        paragraphs: ["I pacchetti di pesca sul reef a mezza giornata includono circa 4 ore in barca in ogni giorno di pesca e lasciano i pomeriggi liberi per riposare, nuotare o fare snorkeling. Costano meno di quelli a giornata intera e sono adatti a gruppi misti, famiglie e pescatori che preferiscono un ritmo più rilassato."],
        table: { headers: PKG_TABLE6 },
      },
      {
        heading: "Prezzi dei pacchetti di pesca al tonno a giornata intera",
        paragraphs: ["I pacchetti di pesca al tonno a giornata intera escono al largo per circa 8 ore in ogni giorno di pesca, a traina e jigging per tonno pinna gialla, tonnetto striato e dogtooth, spesso con wahoo e lampuga."],
        table: { headers: PKG_TABLE6 },
      },
      {
        heading: "Prezzi dei pacchetti di pesca al tonno a mezza giornata",
        paragraphs: ["I pacchetti di pesca al tonno a mezza giornata offrono circa 4 ore al largo in ogni giorno di pesca: abbastanza per una sessione di traina al mattino, con il pomeriggio libero."],
        table: { headers: PKG_TABLE6 },
      },
      {
        heading: "Prezzi dei pacchetti di fly fishing a giornata intera",
        paragraphs: ["I pacchetti di fly fishing pescano sui flat e lungo i bordi del reef di Gaafu Alifu con la canna da mosca, alle nostre tariffe pubblicate a persona. Scegliete il fly fishing a giornata intera per passare più tempo in acqua."],
        table: { headers: PKG_TABLE6 },
      },
      {
        heading: "Prezzi dei pacchetti di fly fishing a mezza giornata",
        paragraphs: ["I pacchetti di fly fishing a mezza giornata includono circa 4 ore di pesca a mosca in ogni giorno di pesca: ideali se volete sfruttare la marea migliore e avere il resto della giornata libero."],
        table: { headers: PKG_TABLE6 },
      },
      {
        heading: "Come scegliere un pacchetto di pesca",
        paragraphs: [
          "Quante notti? Un pacchetto di 3 notti (2 giorni di pesca) è una buona breve fuga. Quello di 5 notti (4 giorni di pesca) è il più richiesto: abbastanza per provare popping, jigging e traina e per recuperare un giorno di vento. I pescatori più appassionati scelgono 7 o 8 notti.",
          "Reef, tonno o mosca? La pesca sul reef è la scelta classica per il popping e il jigging ai GT; quella al tonno per la traina d'altura; il fly fishing per chi cerca la sfida dei flat. Giornata intera o mezza giornata? Scegliete la giornata intera per la pesca seria e le uscite al largo, la mezza giornata se volete i pomeriggi liberi o viaggiate con chi non pesca.",
          "Quanti pescatori? Poiché la barca costa lo stesso indipendentemente da quante persone ci sono a bordo, il prezzo a persona scende molto con la crescita del gruppo. Con un pacchetto di 5 notti di pesca sul reef a giornata intera, 6 pescatori pagano ciascuno circa un quarto del prezzo individuale. Un'altra durata, un altro atollo o una combinazione? Usate il calcolatore dei pacchetti di pesca.",
        ],
        linkLabels: ["Calcolatore dei pacchetti di pesca", "Itinerario di esempio", "Costo di un viaggio di pesca alle Maldive"],
      },
      {
        heading: "Cosa si pesca in una vacanza di pesca alle Maldive",
        paragraphs: [
          "L'equipaggio pianifica ogni giorno di pesca in base a marea, meteo e stagione. Popping e jigging sui bordi del reef e nei canali puntano a GT, carango pinna blu, tonno dente di cane, cernie e lutjanidi. La traina al largo punta a tonno pinna gialla, wahoo e lampuga, con possibilità di pesce vela e marlin.",
          "La stagione più citata per il GT va da aprile a ottobre, mentre da dicembre ad aprile il mare è più calmo ed è alta stagione per tonno pinna gialla, wahoo e lampuga. Si pesca tutto l'anno.",
        ],
        linkLabels: ["Pesca al GT alle Maldive", "Periodo migliore per pescare alle Maldive", "Pesca al tonno alle Maldive"],
      },
      {
        heading: "Come raggiungere la tua vacanza di pesca",
        paragraphs: [
          "Arriva a Malé con il tuo volo internazionale. Da lì, il volo interno verso sud e il trasferimento in barca a Maamendhoo sono inclusi in ogni pacchetto. Lascia abbastanza tempo tra volo internazionale e volo interno e verifica il bagaglio consentito sul volo interno se porti tubi portacanne.",
          "Volete solo uno o due giorni di pesca? Potete prenotare Emperor anche a giornata: 1.380 USD a barca per una giornata intera o 980 USD per mezza giornata, per un massimo di 5 pescatori. Per calcolare un altro pacchetto, provate il calcolatore dei pacchetti di pesca.",
        ],
        linkLabels: ["Charter privato Emperor", "Cosa mettere in valigia per una vacanza di pesca"],
      },
    ],
  },
};
