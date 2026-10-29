import type { FishingContentUpdate } from "@/lib/i18n/fishing-content/types";

const REEF_PKG_HEADERS = ["Paket (ganztägiges Riffangeln)", "Angeltage", "Pro Person, 2 Angler", "Pro Person, 5 Angler"];
const TUNA_PKG_HEADERS = ["Paket (ganztägiges Thunfischangeln)", "Angeltage", "Pro Person, 2 Angler", "Pro Person, 5 Angler"];

const PKG_TABLE6 = ["Paket", "Angeltage", "1 Gast", "2 Gäste", "3 Gäste", "4 Gäste", "5 Gäste", "6 Gäste"];

export const DE: FishingContentUpdate = {
  species: {
    "gt-fishing": {
      metaDescription: "GT-Angeln auf den Malediven: Popping und Jigging auf Giant Trevally an Außenriffen und Kanälen an Bord der Emperor, Privatcharter ab 980 USD pro Boot.",
      extraSections: [
        {
          heading: "Wo man auf den Malediven GT angelt",
          paragraphs: [
            "Giant Trevally jagen dort, wo Riff und Strömung aufeinandertreffen. Auf den Malediven sind das die Außenriffkanten, an denen die Korallen ins tiefe Blau abfallen, und die Kanäle (Kandu), die den Atollring durchschneiden. Bei laufender Tide werden Köderfische durch diese Kanäle zwischen Lagune und offenem Ozean gedrückt, und die GT sammeln sich an den Kanalmündungen und entlang der Kanten, um ihnen aufzulauern.",
            "Je weniger ein Riff befischt wird, desto besser die Chancen. Deshalb zieht es GT-Angler in die abgelegenen Atolle im tiefen Süden statt in die belebten Resort-Atolle rund um Malé. Unser Privatcharterboot Emperor kann je nach Termin und Position des Boots zum selben Preis auch in anderen Atollen organisiert werden, zu Hause ist es aber im Gaafu-Alifu-Atoll.",
          ],
        },
        {
          heading: "GT-Angeln im Gaafu-Alifu-Atoll",
          paragraphs: [
            "Gaafu Alifu ist die nördliche Hälfte des Huvadhu-Atolls im tiefen Süden der Malediven, eines der größten Atolle der Welt. Sein langes Außenriff wird von vielen Kanälen unterbrochen, und da hier nur wenige Resorts und wenige Angelboote unterwegs sind, stehen die Riffe unter deutlich geringerem Angeldruck als die zentralen Atolle. Genau diese Mischung aus Kanälen, tiefen Abbrüchen und ruhigem Wasser braucht das GT-Angeln.",
            "Die Emperor und ihre Crew sind auf Maamendhoo zu Hause, einer Einheimischeninsel in Gaafu Alifu, bei der Maldives Fishing and Holidays Lodge. In der Lodge wohnen Sie nah an den Fanggründen und können am Riff sein, wenn die Tide zu laufen beginnt. Die Anreise erfolgt per Inlandsflug ab Malé (365 USD pro Person) und kurzem Boottransfer, beides in unseren Angelpaketen inklusive.",
            "Gaafu Alifu eignet sich auch für gemischte Angeltage. Wenn die GT ruhig sind, kann dasselbe Boot offshore auf Gelbflossenthun, Wahoo und Mahi-Mahi schleppen oder die tiefen Riffhänge auf Dogtooth-Thun und Zackenbarsche abjiggen, sodass jeder Tag auf dem Wasser ein Ziel hat, unabhängig von Tide und Saison.",
          ],
          linkLabels: ["Maldives Fishing and Holidays Lodge", "Maamendhoo, Gaafu Alifu", "Angelführer Gaafu-Atoll"],
        },
        {
          heading: "GT-Popping und Jigging auf den Malediven",
          paragraphs: [
            "Popping ist die klassische Methode, um GT zu fangen. Man wirft einen großen Oberflächenköder, einen Popper oder Stickbait, an die Riffkante oder quer über einen Kanal und führt ihn mit kräftigen Rutenschlägen zurück, sodass er spritzt und Wasser wirft. Ein GT, der zuschlägt, attackiert meist hart und dicht unter der Oberfläche und flüchtet dann direkt ins Riff, sodass die ersten Sekunden über den Fang entscheiden. Popping ist körperlich anstrengend: Rechnen Sie mit vielen Würfen mit schwerer Rute.",
            "Jigging befischt tieferes Wasser. Ein schwerer Metall-Jig wird den Riffhang hinabgelassen und mit Rute und Rolle wieder nach oben geführt. Das ist weniger anstrengend als Popping, fängt GT, die nicht an der Oberfläche fressen, und bringt auch Dogtooth-Thun, Zackenbarsche und andere Rifffische. Viele Angler kombinieren beides an einem Tag: Popping bei laufender Tide, wenn die Fische oben aktiv sind, Jigging, wenn sie tiefer stehen.",
          ],
          linkLabels: ["GT-Popping auf den Malediven", "Jigging auf den Malediven"],
        },
        {
          heading: "GT-Popping-Tackle und Angelausrüstung",
          paragraphs: [
            "GT-Tackle muss einen kräftigen Fisch in den ersten Sekunden des Drills vom Riff fernhalten. Das heißt: eine schwere Spinnrute zum Werfen großer Köder, eine große Salzwasser-Stationärrolle mit starker Bremse, schwere geflochtene Hauptschnur und ein dickes Monofil- oder Fluorocarbon-Vorfach, das dem Riff standhält. Popper und Stickbaits werden mit starken Einzelhaken oder schweren Drillingen und Sprengringen bestückt.",
            "Basis-Angelausrüstung ist bei jedem Emperor-Charter inklusive. Wenn Sie keine eigene Popping- und Jigging-Ausrüstung mitbringen, können Sie ein professionelles Ruten-und-Rollen-Set für 80 USD pro Set dazubuchen. Packen Sie polarisierte Sonnenbrille, Hut, Handschuhe für Vorfach und Fisch sowie riffschonende Sonnencreme ein.",
          ],
        },
        {
          heading: "GT-Angelcharter: Ablauf und Kosten",
          paragraphs: [
            "Ein Halbtagescharter dauert etwa 4 Stunden auf dem Wasser, ein Ganztagescharter etwa 8 Stunden. Die Crew plant den Tag nach der Tide, denn bewegtes Wasser macht die GT aktiv: Das Boot befischt Kanalmündungen und Riffkanten bei laufender Tide, und Stillwasser ist ein guter Moment, um tiefer zu jiggen oder zum nächsten Spot zu fahren.",
            "Die Emperor nimmt bis zu 5 Angler mit, und der Preis gilt pro Boot: 980 USD für einen halben Tag oder 1.380 USD für einen ganzen Tag, inklusive Kapitän und Crew, Treibstoff, Softdrinks und Snacks sowie Basis-Ausrüstung. Geteilt durch fünf Angler kostet ein ganzer Tag GT-Angeln 276 USD pro Person. Ein ganzer Tag bietet mehr Tiden und mehr Spots.",
          ],
          linkLabels: ["Emperor Privatcharter", "Kosten einer Angelreise auf den Malediven", "Die besten GT-Angelziele"],
        },
        {
          heading: "GT-Angelurlaub und Pakete auf den Malediven",
          paragraphs: [
            "Für einen reinen GT-Angelurlaub umfassen unsere Pakete in der Lodge auf Maamendhoo Vollpension, den Inlandsflug hin und zurück, den Boottransfer und ein privates Emperor-Charter an jedem Angeltag. Der Preis gilt pro Person und sinkt, je mehr Angler sich das Boot teilen. Dies sind die Pakete mit ganztägigem Riffangeln:",
          ],
          table: { headers: REEF_PKG_HEADERS },
          linkLabels: ["Alle Angelpakete auf den Malediven", "Pakete mit Halbtagesangeln"],
        },
        {
          heading: "Wie groß werden Giant Trevally?",
          paragraphs: [
            "Giant Trevally (Caranx ignobilis) sind die größten Vertreter der Stachelmakrelen und werden bis zu etwa 170 cm lang und 80 kg schwer. Egal wie groß: Ein GT zieht kräftiger als fast alles andere am Riff. Kleinere GT jagen oft in Gruppen, die größten Fische patrouillieren meist allein an der Riffkante.",
          ],
        },
        {
          heading: "Catch and Release beim Giant Trevally",
          paragraphs: [
            "Giant Trevally wachsen langsam, und die meisten GT-Angler setzen ihre Fische zurück. Gute Praxis erhöht die Überlebenschancen: Einzel- oder widerhakenlose Haken verwenden, den Drill kurz halten, den Fisch für ein schnelles Foto waagerecht unter dem Bauch stützen statt ihn am Maul hochzuhalten und ihn so kurz wie möglich aus dem Wasser nehmen. Vor dem Loslassen den Fisch mit dem Kopf gegen die Strömung im Wasser halten, bis er selbstständig davonschwimmt.",
          ],
        },
      ],
      extraFaqs: [
        { question: "Was kostet ein GT-Angeltrip?", answer: "Ein Privatcharter auf der Emperor kostet 980 USD für einen halben Tag oder 1.380 USD für einen ganzen Tag, pro Boot für bis zu 5 Angler. Ein professionelles Ruten-und-Rollen-Set für schwereres GT-Tackle kostet 80 USD pro Set." },
        { question: "Wo gibt es das beste GT-Angeln auf den Malediven?", answer: "In den abgelegenen südlichen Atollen, wo Kanäle und Außenriffkanten kaum befischt werden. Unser Boot Emperor ist genau deshalb im Gaafu-Alifu-Atoll im tiefen Süden stationiert." },
        { question: "Brauche ich Erfahrung für das GT-Popping?", answer: "Nein, aber eine gewisse Fitness hilft: Popping bedeutet viele Würfe mit schwerer Rute. Jigging ist ein leichterer Einstieg, und die Crew hilft gern beim Werfen und Führen des Köders." },
        { question: "Kann ich ein GT-Angelpaket buchen?", answer: "Ja. Unsere Pakete in der Maldives Fishing and Holidays Lodge auf Maamendhoo, Gaafu Alifu, dauern 2 bis 8 Nächte und umfassen Lodge, Mahlzeiten, Inlandsflug, Boottransfer und ein Privatcharter an jedem Angeltag." },
        { question: "Wird beim GT-Angeln zurückgesetzt?", answer: "Die meisten GT-Angler setzen ihre Fische zurück. Einzel- oder widerhakenlose Haken, ein kurzer Drill und ein schnelles Foto mit waagerecht gestütztem Fisch geben ihm die besten Chancen." },
      ],
    },
    "tuna-fishing": {
      metaTitle: "Gelbflossenthun angeln Malediven | Thunfisch-Charter",
      metaDescription: "Gelbflossenthun angeln auf den Malediven: wo und wie man Yellowfin fängt, beste Saison, Tackle und Preise für ein privates Thunfisch-Charter in Gaafu Alifu.",
      h1: "Gelbflossenthun angeln auf den Malediven",
      extraSections: [
        {
          heading: "Gelbflossenthun auf den Malediven",
          paragraphs: [
            "Der Gelbflossenthun gehört zu den begehrtesten Sportfischen der Malediven. Er ist auf Tempo gebaut: torpedoförmiger Körper, dunkelblauer Rücken, gelber Seitenstreifen und lange, leuchtend gelbe zweite Rücken- und Afterflossen. Er wird bis zu etwa 200 cm lang und 200 kg schwer, und selbst ein mittelgroßer Yellowfin zieht hart und tief und kämpft bis zum Boot.",
            "Gelbflossenthune jagen in Schwärmen im offenen Ozean und fressen fliegende Fische, Tintenfische und kleinere Thune. Man findet sie oft unter fressenden Seevögeln, an Treibgut und Fischsammlern (FADs) und zusammen mit Delfinen. Auf den Malediven werden sie auch von einheimischen Fischern mit Handleinen und Ruten gefangen und sind ein Grundpfeiler der maledivischen Küche.",
          ],
        },
        {
          heading: "Wo man auf den Malediven Gelbflossenthun fängt",
          paragraphs: [
            "Gelbflossenthune leben im tiefen Blau jenseits der Atolle, daher geht es zum Yellowfin-Angeln hinaus über das Riff. Die Crew hält Ausschau nach Vögeln, die auf Köderfische stoßen, nach Thunen, die die Oberfläche aufbrechen, nach Treibholz und nach den vor der Küste verankerten FADs, die Köderfische und damit Thune anziehen.",
            "Auf den Malediven liegt der tiefe Ozean nah an jedem Atoll. In Gaafu Alifu im äußersten Süden fällt das lange Außenriff direkt ins tiefe Wasser ab, sodass die Emperor kurz nach dem Ablegen von Maamendhoo auf Yellowfin schleppen und später am Tag zum Riff auf GT oder Dogtooth-Thun wechseln kann.",
          ],
        },
        {
          heading: "Wie man Gelbflossenthun fängt",
          paragraphs: [
            "Schleppangeln ist die Hauptmethode. Das Boot zieht offshore eine Auswahl an Oktopusködern, Wobblern oder montierten Ködern, und wenn ein Yellowfin beißt, kreischt die Rolle und der Angler übernimmt die Rute. Beim Schleppen beißen auch Wahoo, Mahi-Mahi und Echter Bonito, gelegentlich Segelfisch und Marlin.",
            "Wenn ein Gelbflossenthun-Schwarm an der Oberfläche frisst, ist das Werfen von Poppern und Stickbaits mitten hinein eine der aufregendsten Fangmethoden und erfordert schweres Spinngerät. Schleppausrüstung ist an Bord; Basis-Ausrüstung ist inklusive, ein professionelles Popping-Set kostet 80 USD pro Set.",
          ],
          linkLabels: ["Schleppangeln auf den Malediven", "Hochsee- und Big-Game-Angeln"],
        },
        {
          heading: "Gelbflossenthun-Charter und Preise",
          paragraphs: [
            "Die Emperor, unser privates Angelboot, ist 32 Fuß lang, hat zwei 200-PS-Motoren, nimmt bis zu 5 Angler mit und liegt auf Maamendhoo im Gaafu-Alifu-Atoll. Für Yellowfin empfehlen wir einen ganzen Tag, um hinauszufahren und die Schwärme zu finden: 1.380 USD pro Boot oder 276 USD pro Person bei fünf Anglern. Ein halber Tag kostet 980 USD pro Boot. Beides inklusive Kapitän und Crew, Treibstoff, Softdrinks und Snacks sowie Basis-Ausrüstung.",
            "Für mehrere Tage Thunfischangeln umfassen unsere Pakete in der Maldives Fishing and Holidays Lodge Lodge, Vollpension, Inlandsflug, Boottransfer und ein Privatcharter an jedem Angeltag:",
          ],
          table: { headers: TUNA_PKG_HEADERS },
          linkLabels: ["Emperor Privatcharter", "Alle Angelpakete", "Thunfischangeln auf den Malediven: alle Arten"],
        },
        {
          heading: "Gelbflossenthun und andere Thune der Malediven",
          paragraphs: [
            "Der Yellowfin ist einer von drei Thunen, die Angler auf den Malediven fangen. Echte Bonitos sind kleinere Fische mit gestreiftem Bauch, die das ganze Jahr in riesigen Schwärmen ziehen und das Rückgrat der traditionellen Pole-and-Line-Fischerei bilden. Dogtooth-Thune sind Riffräuber an den tiefen Riffwänden und werden vor allem von November bis April per Jigging gefangen. Ein ganzer Tag auf der Emperor kann alle drei abdecken.",
          ],
          linkLabels: ["Dogtooth-Thun angeln", "Traditionelles Fischen auf den Malediven"],
        },
        {
          heading: "Tipps zum Gelbflossenthun-Angeln",
          paragraphs: [
            "Fahren Sie früh hinaus, wenn Thune oft am stärksten fressen. Achten Sie auf stoßende Vögel, das beste Zeichen für Thune darunter. Buchen Sie in der Saison von Dezember bis März einen ganzen Tag. Behalten Sie nur den Thun, den Sie essen, und setzen Sie den Rest zurück: Ein frischer Yellowfin ist eines der besten Essen auf den Malediven, ob als Sashimi, gegrilltes Steak oder maledivisches Thunfisch-Curry.",
          ],
        },
      ],
      extraFaqs: [
        { question: "Wie groß werden Gelbflossenthune auf den Malediven?", answer: "Gelbflossenthune werden bis zu etwa 200 cm lang und 200 kg schwer, die meisten auf Tagesausfahrten gefangenen sind deutlich kleiner und kämpfen trotzdem hart." },
        { question: "Was kostet ein Thunfisch-Angeltrip auf den Malediven?", answer: "Ein privates Ganztagescharter auf der Emperor kostet 1.380 USD pro Boot für bis zu 5 Angler, inklusive Crew, Treibstoff, Getränken, Snacks und Basis-Ausrüstung. Ein halber Tag kostet 980 USD." },
        { question: "Darf ich den gefangenen Thun behalten?", answer: "Fragen Sie die Crew. Behaltener Thun wird oft frisch zubereitet; setzen Sie zurück, was Sie nicht essen." },
      ],
    },
    "dogtooth-tuna": {
      metaDescription: "Dogtooth-Thun angeln auf den Malediven: Lebensraum, Jigging-Technik, Tackle, beste Saison und Preise für ein privates Jigging-Charter in Gaafu Alifu.",
      extraSections: [
        {
          heading: "Dogtooth-Thun: der härteste Kämpfer am Riff",
          paragraphs: [
            "Dogtooth-Thune (Gymnosarda unicolor) sind nach ihren scharfen, kegelförmigen Zähnen benannt, ungewöhnlich für einen Thun. Anders als Yellowfin und Bonito, die in Schwärmen den offenen Ozean durchstreifen, sind Dogtooth-Thune Riffräuber an tiefen Riffwänden und Abbrüchen, meist allein oder in kleinen Gruppen. Sie werden bis zu etwa 130 cm lang und 70 kg schwer.",
            "Dogtooth-Thune sind für ihre Kraft berühmt. Gehakt, dreht ein Dogtooth und taucht direkt ins Riff, und wenn er es erreicht, wird die Schnur meist an den Korallen gekappt. Wer einen landen will, braucht schweres Gerät, eine feste Bremse und schnelles, entschlossenes Kurbeln in den ersten Sekunden des Drills.",
          ],
        },
        {
          heading: "Wo man auf den Malediven Dogtooth-Thun findet",
          paragraphs: [
            "Dogtooth-Thune stehen an den steilen Außenriffwänden, wo die Korallen ins tiefe Wasser abfallen, an den Abbrüchen der Kanalmündungen und um tiefe Riffspitzen. Sie fressen dort, wo die Strömung Köderfische an der Wand entlangdrückt, daher liegen die besten Spots auf der strömungszugewandten Seite des Riffs bei laufender Tide.",
            "Die abgelegenen südlichen Atolle gehören zu den besten Orten der Malediven für Dogtooth-Thun, weil ihre Außenwände kaum befischt werden. Gaafu Alifu, wo unser Boot Emperor liegt, hat ein langes Außenriff mit tiefen Wänden und Kanalabbrüchen nahe der Insel Maamendhoo.",
          ],
          linkLabels: ["Die besten Angelplätze der Malediven"],
        },
        {
          heading: "Wie man Dogtooth-Thun fängt: Jigging",
          paragraphs: [
            "Jigging ist die wichtigste Methode für Dogtooth-Thun. Ein schwerer Metall-Jig wird an der Riffwand bis zur Tiefe der Fische hinabgelassen und mit kräftigen Rutenschlägen und schnellen Kurbelumdrehungen nach oben geführt. Der Biss kommt oft, wenn der Jig absinkt oder bei den ersten Zügen vom Grund, also seien Sie bereit, sobald der Jig die Tiefe erreicht.",
            "Speed-Jigging mit schnellen, aggressiven Zügen und langen, schlanken Jigs ist die klassische Dogtooth-Technik. Slow-Pitch-Jigging mit kürzeren Zügen und flacheren, flatternd absinkenden Jigs fängt ebenfalls Dogtooth und bringt dazu Zackenbarsche, Schnapper und Amberjacks. Gelegentlich nehmen Dogtooth-Thune auch Popper an der Oberfläche oder lebenden Köder.",
          ],
          linkLabels: ["Jigging auf den Malediven", "GT-Popping- und Jigging-Ratgeber"],
        },
        {
          heading: "Jigging-Tackle für Dogtooth-Thun",
          paragraphs: [
            "Dogtooth-Tackle muss einen kräftigen Fisch wenige Meter vor dem Riff stoppen. Angler nutzen eine starke Jigging-Rute und eine Stationär- oder Multirolle mit großer Kapazität und kräftiger Bremse, geflochtene Hauptschnur für direkten Kontakt und ein dickes Fluorocarbon-Vorfach gegen Zähne und Korallen. Je nach Tiefe und Strömung reichen die Jigs von etwa 100 g bis 300 g und mehr, mit starken Assist-Haken.",
            "Auf der Emperor ist Basis-Ausrüstung bei jedem Charter inklusive, und Sie können ein professionelles Jigging-Set für 80 USD pro Set dazubuchen, wenn Sie kein eigenes mitbringen.",
          ],
        },
        {
          heading: "Wie man einen Dogtooth-Thun drillt",
          paragraphs: [
            "Stellen Sie die Bremse fest ein, bevor der Jig hinuntergeht. Beißt ein Dogtooth, geben Sie keine Schnur: Rute an den Körper, anheben und kräftig kurbeln, um den Fisch in den ersten Sekunden nach oben und weg vom Riff zu ziehen. Ist er frei von der Wand, halten Sie gleichmäßigen Druck und pumpen Sie ihn zur Oberfläche. Ein fahrendes Boot hilft: Der Kapitän fährt oft vom Riff weg, um den Fisch ins freie Wasser zu ziehen.",
          ],
        },
        {
          heading: "Dogtooth-Thun-Charter und Preise",
          paragraphs: [
            "Die Emperor ist ein 32-Fuß-Boot mit zwei 200-PS-Motoren für bis zu 5 Angler. Ein Ganztagescharter kostet 1.380 USD pro Boot, ein halber Tag 980 USD, inklusive Kapitän und Crew, Treibstoff, Softdrinks und Snacks sowie Basis-Ausrüstung. Die Crew plant Jigging an den Riffwänden nach der Tide und kann Popping auf GT und Schleppangeln auf Thun und Wahoo einbauen.",
            "Für mehrere Tage Jigging umfassen unsere Pakete in der Maldives Fishing and Holidays Lodge auf Maamendhoo Lodge, Vollpension, Inlandsflug, Boottransfer und ein Privatcharter an jedem Angeltag:",
          ],
          table: { headers: REEF_PKG_HEADERS },
          linkLabels: ["Emperor Privatcharter", "Alle Angelpakete", "Thunfischangeln auf den Malediven"],
        },
        {
          heading: "Weitere Fische beim Jigging auf Dogtooth-Thun",
          paragraphs: [
            "Das Jiggen an tiefen Riffwänden bringt selten nur Dogtooth-Thun. Dieselben Jigs fangen tief stehende Giant Trevally, Amberjacks, Zackenbarsche, Rote Schnapper, Jobfische und andere Rifffische, viele davon hervorragende Speisefische. Besonders Slow-Pitch-Jigging bringt eine große Artenvielfalt, sodass sich eine Jigging-Session auch an Tagen lohnt, an denen die Dogtooth nicht beißen.",
            "Da die Riffwände direkt neben den Kanalmündungen liegen, kann die Crew bei laufender Tide auch zum Popping auf GT wechseln oder offshore auf Gelbflossenthun und Wahoo schleppen.",
          ],
          linkLabels: ["GT-Angeln auf den Malediven", "Die besten Popping- und Jigging-Ziele"],
        },
        {
          heading: "Catch and Release beim Dogtooth-Thun",
          paragraphs: [
            "Dogtooth-Thune sind langsam wachsende Riffräuber, und viele Angler setzen sie zurück. Halten Sie den Drill mit starkem Gerät kurz, fassen Sie den Fisch vorsichtig und abseits der Zähne, stützen Sie sein Gewicht für ein schnelles Foto und lassen Sie ihn im Wasser zu Kräften kommen, bevor Sie ihn freigeben. Wer einen behält: Dogtooth ist ein ausgezeichneter Speisefisch.",
          ],
        },
      ],
      extraFaqs: [
        { question: "Wie groß werden Dogtooth-Thune?", answer: "Dogtooth-Thune werden bis zu etwa 130 cm lang und 70 kg schwer. Schon mittelgroße Fische sind sehr stark und flüchten gehakt direkt ins Riff." },
        { question: "Welches Jig-Gewicht ist für Dogtooth-Thun am besten?", answer: "Das hängt von Tiefe und Strömung ab; viele Angler haben Jigs von etwa 100 g bis 300 g und mehr dabei und nehmen die schwereren bei tiefem Wasser und starker Strömung." },
        { question: "Wo gibt es das beste Dogtooth-Angeln auf den Malediven?", answer: "An den steilen Außenriffwänden und Kanalabbrüchen der abgelegenen südlichen Atolle wie Gaafu Alifu, wo unser Boot Emperor liegt." },
        { question: "Was kostet ein Dogtooth-Angeltrip?", answer: "Ein privates Ganztagescharter auf der Emperor kostet 1.380 USD pro Boot für bis zu 5 Angler oder 980 USD für einen halben Tag. Ein professionelles Jigging-Set kostet 80 USD pro Set." },
      ],
    },
  },
  techniques: {
    "big-game-fishing": {
      metaTitle: "Hochseeangeln Malediven | Big-Game-Fishing-Charter",
      metaDescription: "Hochsee- und Big-Game-Angeln auf den Malediven: Schleppangeln auf Gelbflossenthun, Wahoo, Segelfisch und Marlin, beste Saison, Preise und Privatcharter.",
      h1: "Hochsee- und Big-Game-Angeln auf den Malediven",
      heroDescription: "Schleppangeln offshore auf Gelbflossenthun, Wahoo, Mahi-Mahi, Segelfisch und Marlin im tiefen Blau jenseits der Atolle.",
      extraSections: [
        {
          heading: "Hochseeangeln auf den Malediven",
          paragraphs: [
            "Hochseeangeln, auch Big-Game- oder Offshore-Angeln genannt, heißt: hinaus über den Atollring ins tiefe Blau des Indischen Ozeans, um auf große Hochseefische zu angeln. Auf den Malediven beginnt das tiefe Wasser direkt hinter dem Riff jedes Atolls, sodass eine Hochseetour keine lange Anfahrt braucht: Das Boot kann wenige Minuten nach dem Ablegen an der Riffkante schleppen.",
            "Hauptziele sind Gelbflossenthun, Wahoo und Mahi-Mahi, weiter draußen Segelfisch und Marlin. Echte Bonitos ziehen oft in großen Schwärmen, und Dogtooth-Thun und Giant Trevally leben an den Riffwänden, daher kombinieren viele Hochseetouren auf den Malediven Schleppangeln offshore mit einer Popping- oder Jigging-Session am Riff.",
          ],
        },
        {
          heading: "Hochseefische auf den Malediven",
          paragraphs: ["Dies sind die wichtigsten Fische einer Hochseetour auf den Malediven mit den Saisons aus unseren Artendaten. Die Saisons variieren je nach Atoll und Jahr, verstehen Sie sie als Richtwert."],
          table: {
            headers: ["Art", "Wo", "Saison", "Hauptmethode"],
            cells: [
              ["Gelbflossenthun", "Offshore, unter Vögeln, an FADs", "Dezember bis März", "Schleppen, Werfen auf Schwärme"],
              ["Wahoo", "Außenriffkanten und offshore", "Dezember bis März", "Schnelles Schleppen"],
              ["Mahi-Mahi", "Treibgut, FADs", "Dezember bis April", "Schleppen, Werfen"],
              ["Echter Bonito", "Schwärme offshore", "Ganzjährig", "Schleppen mit kleinen Ködern"],
              ["Segelfisch", "Tiefes Wasser, oft nahe am Riff", "Nach aktuellen Fängen fragen", "Schleppen, lebender Köder"],
              ["Marlin", "Tiefes Blau offshore", "Nach aktuellen Fängen fragen", "Schleppen"],
            ],
          },
        },
        {
          heading: "Hochseeangeln oder Riffangeln?",
          paragraphs: [
            "Beim Hochseeangeln geht es darum, offshore Strecke zu machen und auf den Biss eines schnellen Hochseefischs zu warten: lange Fahrten, viele Köder im Wasser und die Chance auf Thun, Wahoo oder Billfish. Riffangeln, Popping und Jigging befischen Riffkanten, Kanäle und Wände auf Giant Trevally, Dogtooth-Thun, Zackenbarsche und Schnapper. Auf den Malediven müssen Sie sich nicht entscheiden: Das tiefe Wasser liegt direkt vor dem Riff, sodass ein ganzer Tag auf der Emperor einige Stunden Schleppangeln und auf dem Rückweg eine Popping- oder Jigging-Session umfassen kann.",
          ],
          linkLabels: ["GT-Angeln", "Popping- und Jigging-Ratgeber"],
        },
        {
          heading: "Techniken beim Hochseeangeln",
          paragraphs: [
            "Schleppangeln ist die Haupttechnik. Die Crew setzt mehrere Ruten mit Oktopusködern, Wobblern oder montierten Ködern in verschiedenen Abständen hinter dem Boot und fährt mit Schleppgeschwindigkeit an der Außenriffkante auf Wahoo oder offshore auf Thun, Mahi-Mahi und Billfish, immer auf der Suche nach stoßenden Vögeln, Treibgut und springenden Fischen. Beißt ein Fisch, übernimmt ein Angler die Rute und drillt ihn vom Boot aus.",
            "Frisst Gelbflossenthun an der Oberfläche, werfen Angler auch Popper und Stickbaits in den Schwarm, und für Segelfische und Marline, die hinter dem Boot auftauchen, wird lebender Köder verwendet. Schleppausrüstung ist an Bord.",
          ],
          linkLabels: ["Schleppangeln auf den Malediven", "Big-Game-Angeln im Indischen Ozean"],
        },
        {
          heading: "Beste Zeit zum Hochseeangeln auf den Malediven",
          paragraphs: [
            "Der ruhigere Nordost-Monsun von Dezember bis April ist die beste Zeit zum Hochseeangeln auf den Malediven. Die See ist glatter, lange Schleppstrecken sind angenehmer, und es ist Hauptsaison für Gelbflossenthun und Wahoo (Dezember bis März) sowie Mahi-Mahi (Dezember bis April). Segelfische und Marline werden zu verschiedenen Jahreszeiten offshore gefangen; fragen Sie uns bei der Planung nach aktuellen Fängen.",
            "Auch im Südwest-Monsun von Mai bis November finden Ausfahrten an ruhigeren Tagen statt, und dies ist die am häufigsten genannte Saison für Giant Trevally am Riff.",
          ],
          linkLabels: ["Beste Zeit zum Angeln auf den Malediven"],
        },
        {
          heading: "Preise für Hochseeangeltouren",
          paragraphs: [
            "Unser Privatboot Emperor ist ein 32-Fuß-Angelboot mit zwei 200-PS-Motoren für bis zu 5 Angler und liegt auf Maamendhoo im Gaafu-Alifu-Atoll, wo der tiefe Ozean direkt hinter dem langen Außenriff beginnt. Für Offshore-Angeln empfehlen wir einen ganzen Tag: 1.380 USD pro Boot oder 276 USD pro Person bei fünf Anglern. Ein halber Tag kostet 980 USD pro Boot. Beides inklusive Kapitän und Crew, Treibstoff, Softdrinks und Snacks sowie Basis-Ausrüstung.",
            "Nahe Malé führt die Website auch Big-Game-Touren von Resorts und unabhängigen Anbietern; siehe die Charter unten. Für mehrere Angeltage umfassen unsere Pakete in der Maldives Fishing and Holidays Lodge Lodge, Mahlzeiten, Inlandsflug, Transfer und ein Privatcharter an jedem Angeltag.",
          ],
          table: { headers: TUNA_PKG_HEADERS },
          linkLabels: ["Emperor Privatcharter", "Alle Angelpakete", "Kosten einer Angelreise auf den Malediven"],
        },
        {
          heading: "Marlin- und Segelfischangeln",
          paragraphs: [
            "Billfische sind die Krönung des Hochseeangelns. Segelfische mit ihrer riesigen Rückenflosse und akrobatischen Sprüngen werden oft näher am Riff gefangen als Marline; Marline sind ein Ziel für weite Fahrten ins tiefe Blau, daher bietet ein ganzer Tag die besten Chancen. Billfische werden normalerweise zurückgesetzt: Fisch im Wasser lassen, längsseits mit dem Kopf gegen die Strömung halten und davonschwimmen lassen.",
          ],
          linkLabels: ["Marlinangeln", "Segelfischangeln"],
        },
        {
          heading: "Tipps für Ihre Hochseeangeltour",
          paragraphs: [
            "Buchen Sie für Hochseefische einen ganzen Tag, denn sie zu finden braucht Zeit. Nehmen Sie bei Bedarf Mittel gegen Seekrankheit, offshore kann es kabbelig sein. Packen Sie Hut, polarisierte Sonnenbrille, ein langärmeliges Hemd und riffschonende Sonnencreme ein. Sprechen Sie mit der Crew ab, welche Fische Sie behalten und welche Sie zurücksetzen möchten, und überlassen Sie ihr das Montieren des Schleppgeräts.",
          ],
          linkLabels: ["Packliste für den Angelurlaub"],
        },
      ],
      extraFaqs: [
        { question: "Was ist der Unterschied zwischen Hochseeangeln und Big-Game-Angeln?", answer: "Beides meint im Wesentlichen dasselbe: Angeln offshore in tiefem Wasser auf große Hochseefische wie Thun, Wahoo, Segelfisch und Marlin, vor allem per Schleppangeln." },
        { question: "Was kostet Hochseeangeln auf den Malediven?", answer: "Ein privates Ganztagescharter auf der Emperor kostet 1.380 USD pro Boot für bis zu 5 Angler oder 980 USD für einen halben Tag, inklusive Crew, Treibstoff, Getränken, Snacks und Basis-Ausrüstung." },
        { question: "Wann ist die beste Zeit zum Hochseeangeln auf den Malediven?", answer: "Dezember bis April, im ruhigeren Nordost-Monsun, wenn Gelbflossenthun, Wahoo und Mahi-Mahi Saison haben." },
        { question: "Können Anfänger Hochseeangeln?", answer: "Ja. Die Crew setzt die Köder und beobachtet die Ruten, reicht Ihnen die Rute beim Biss und begleitet Sie durch den Drill." },
      ],
    },
  },
  emperor: {
    dayTitle: "Was Sie bei einem privaten Angelcharter erwartet",
    dayParagraphs: [
      "Ein Halbtagescharter dauert etwa 4 Stunden auf dem Wasser, ein Ganztagescharter etwa 8 Stunden. Am Heimathafen der Emperor legt das Boot in Maamendhoo im Gaafu-Alifu-Atoll ab; organisieren wir Ihr Charter anderswo, bestätigen wir den Abfahrtsort zusammen mit dem Termin.",
      "Sagen Sie dem Kapitän, was Ihre Gruppe fangen möchte und wie viel Angelerfahrung alle haben, und die Crew plant den Tag nach Tide, Wetter und Saison: Popping und Jigging an Außenriffkanten und Kanälen auf Giant Trevally und Dogtooth-Thun, Schleppangeln auf den Fahrten zwischen den Spots auf Thun, Wahoo und Mahi-Mahi oder ruhigeres Riffangeln näher an der Insel. Ein ganzer Tag bietet Zeit für mehreres davon, ein halber Tag konzentriert sich meist auf ein oder zwei.",
      "Softdrinks, Snacks und Basis-Angelausrüstung sind an Bord.",
    ],
    includedTitle: "Was in einem privaten Angelcharter inklusive ist",
    includedHeading: "Bei jedem Charter inklusive",
    notIncludedHeading: "Nicht inklusive",
    included: ["Professioneller Kapitän und Crew", "Treibstoff", "Softdrinks und Snacks", "Basis-Angelausrüstung"],
    notIncluded: [
      "Inlandsflug ins Gaafu-Atoll (365 USD pro Person), wenn Sie zum Heimathafen der Emperor anreisen",
      "Unterkunft und Mahlzeiten (unsere Lodge auf Maamendhoo: 150 USD pro Zimmer, Vollpension)",
      "Professionelles Ruten-und-Rollen-Set für schwereres Popping- und Jigging-Tackle (80 USD pro Set)",
    ],
    packageBefore: "Mehrere Nächte? Ein ",
    packageLink: "Angelpaket",
    packageAfter: " kombiniert die Charter mit Lodge, Mahlzeiten, Inlandsflug und Boottransfer.",
  },
  packagesFishing: {
    metaTitle: "Angelpakete und Angelurlaub auf den Malediven | MTG",
    metaDescription: "Angelpakete im Gaafu-Alifu-Atoll: 3 bis 8 Nächte Riff-, Thunfisch- oder Fliegenfischen mit Lodge, Mahlzeiten, Inlandsflug, Transfer und privatem Boot.",
    intro:
      "Angelurlaub-Pakete in der Maldives Fishing and Holidays Lodge auf Maamendhoo im Gaafu-Alifu-Atoll: Vollpension im Doppelzimmer, Inlandsflug hin und zurück, Boottransfer und ein privates Boot für Ihre Gruppe an jedem Angeltag. 3 bis 8 Nächte Riff-, Thunfisch- oder Fliegenfischen, ganz- oder halbtags, Preis pro Person — oder stellen Sie mit dem Angelpaket-Rechner Ihr eigenes Paket zusammen.",
    faqs: [
      { question: "Was ist in einem Angelpaket auf den Malediven inklusive?", answer: "Vollpension im Doppelzimmer in der Maldives Fishing and Holidays Lodge auf Maamendhoo, Inlandsflug ab Malé hin und zurück, Boottransfer zur Insel und ein privates Boot für Ihre Gruppe an jedem Angeltag (Kapitän und Crew, Treibstoff, Softdrinks und Snacks, Basis-Angelausrüstung)." },
      { question: "Wie viele Angeltage bekomme ich?", answer: "Einen weniger als Nächte: Ein Paket mit 3 Nächten hat 2 Angeltage, eines mit 5 Nächten 4 und eines mit 8 Nächten 7." },
      { question: "Warum hängt der Preis von der Zahl der Gäste ab?", answer: "Das Boot kostet gleich viel, egal wie viele Angler an Bord sind; je mehr es sich teilen, desto niedriger der Preis pro Person. 6 Gäste sind der günstigste Tarif." },
      { question: "Was ist der Unterschied zwischen Ganz- und Halbtagespaketen?", answer: "Ganztagespakete umfassen etwa 8 Stunden auf dem Boot pro Angeltag, Halbtagespakete etwa 4 Stunden, was günstiger ist und die Nachmittage freilässt." },
      { question: "Was ist der Unterschied zwischen Riff-, Thunfisch- und Fliegenfischpaketen?", answer: "Riffangelpakete befischen Riffkanten und Kanäle — Popping, Jigging und Grundangeln auf Giant Trevally, Zackenbarsche und Schnapper. Thunfischpakete fahren offshore zum Schleppangeln und Jigging auf Gelbflossen-, Bonito- und Dogtooth-Thun. Fliegenfischpakete fischen mit der Fliegenrute auf den Flats und an den Riffkanten." },
      { question: "Sind internationale Flüge inklusive?", answer: "Nein. Die Pakete umfassen den Inlandsflug ab Malé hin und zurück und den Boottransfer; den internationalen Flug nach Malé buchen Sie selbst." },
      { question: "Brauche ich eigene Angelausrüstung?", answer: "Nein. Basis-Ausrüstung ist an jedem Angeltag inklusive. Ein professionelles Popping- oder Jigging-Set gibt es für 80 USD pro Set, oder Sie bringen Ihr eigenes mit." },
      { question: "Können Nicht-Angler mitkommen?", answer: "Fragen Sie bei der Anfrage. Die Lodge liegt auf einer Einheimischeninsel, Nicht-Angler können entspannen, schwimmen und schnorcheln, während die anderen angeln." },
    ],
    relatedLabels: ["Angeln auf den Malediven", "Emperor Privatcharter", "Maldives Fishing and Holidays Lodge", "Kosten einer Angelreise", "Reiseplan für den Angelurlaub"],
    sections: [
      {
        heading: "Angelurlaub auf den Malediven im Gaafu-Alifu-Atoll",
        paragraphs: [
          "Unsere Angelpakete führen in eines der ruhigsten Fanggebiete der Malediven. Gaafu Alifu ist die nördliche Hälfte des Huvadhu-Atolls im tiefen Süden, eines der größten Atolle der Welt. Sein langes Außenriff wird von vielen Kanälen unterbrochen und fällt direkt in den tiefen Ozean ab, und nur sehr wenige Angelboote sind hier unterwegs. Ideal für GT-Popping und Jigging, Dogtooth-Thun an den Riffwänden und Schleppangeln offshore auf Gelbflossenthun, Wahoo und Mahi-Mahi.",
          "Sie wohnen in der Maldives Fishing and Holidays Lodge auf Maamendhoo, einer Einheimischeninsel in Gaafu Alifu, betrieben von derselben Firma wie unser Angelboot Emperor. Zimmer, Mahlzeiten, Transfers und Angeln kommen aus einer Hand, und die Fanggründe liegen nah an der Insel, sodass Sie Ihre Tage mit Angeln statt mit Anreise verbringen.",
        ],
        linkLabels: ["Angelführer Gaafu-Atoll", "Die besten Angelplätze der Malediven"],
      },
      {
        heading: "Was in jedem Angelpaket inklusive ist",
        paragraphs: [
          "Jedes Paket umfasst Vollpension in der Lodge im Doppelzimmer (ein Zimmer für je zwei Gäste), den Inlandsflug ab Malé hin und zurück, den Boottransfer nach Maamendhoo und ein privates Boot für Ihre Gruppe an jedem Angeltag: die Emperor, ein 32-Fuß-Boot mit zwei 200-PS-Motoren für bis zu 5 Angler, oder die Bluefin, ein 36-Fuß-Boot für bis zu 6. Jedes Charter umfasst Kapitän und Crew, Treibstoff, Softdrinks und Snacks sowie Basis-Angelausrüstung.",
          "Nicht inklusive: Ihr internationaler Flug nach Malé und, falls gewünscht, ein professionelles Popping- oder Jigging-Set (80 USD pro Set). Die Zahl der Angeltage ist eins weniger als die der Nächte; An- und Abreisetag sind Reisetage.",
        ],
      },
      {
        heading: "Preise für Pakete mit ganztägigem Riffangeln",
        paragraphs: ["Pakete mit ganztägigem Riffangeln umfassen an jedem Angeltag etwa 8 Stunden auf dem Boot an Riffkanten und Kanälen, die beste Wahl für GT-Popping und Jigging. Preise pro Person, abhängig davon, wie viele Gäste sich das Boot teilen; 6 Gäste sind der günstigste Tarif."],
        table: { headers: PKG_TABLE6 },
      },
      {
        heading: "Preise für Pakete mit halbtägigem Riffangeln",
        paragraphs: ["Pakete mit halbtägigem Riffangeln umfassen an jedem Angeltag etwa 4 Stunden auf dem Boot und lassen die Nachmittage frei zum Ausruhen, Schwimmen oder Schnorcheln. Sie sind günstiger als Ganztagespakete und passen zu gemischten Gruppen, Familien und Anglern, die es ruhiger angehen wollen."],
        table: { headers: PKG_TABLE6 },
      },
      {
        heading: "Preise für Pakete mit ganztägigem Thunfischangeln",
        paragraphs: ["Pakete mit ganztägigem Thunfischangeln fahren an jedem Angeltag etwa 8 Stunden offshore zum Schleppangeln und Jigging auf Gelbflossen-, Bonito- und Dogtooth-Thun, oft mit Wahoo und Mahi-Mahi als Beifang."],
        table: { headers: PKG_TABLE6 },
      },
      {
        heading: "Preise für Pakete mit halbtägigem Thunfischangeln",
        paragraphs: ["Pakete mit halbtägigem Thunfischangeln bieten an jedem Angeltag etwa 4 Stunden offshore — genug für eine Schleppangel-Session am Morgen, der Nachmittag bleibt frei."],
        table: { headers: PKG_TABLE6 },
      },
      {
        heading: "Preise für Pakete mit ganztägigem Fliegenfischen",
        paragraphs: ["Fliegenfischpakete befischen die Flats und Riffkanten von Gaafu Alifu mit der Fliegenrute, zu unseren veröffentlichten Fliegenfisch-Tarifen pro Person. Wählen Sie ganztägiges Fliegenfischen für die meiste Zeit auf dem Wasser."],
        table: { headers: PKG_TABLE6 },
      },
      {
        heading: "Preise für Pakete mit halbtägigem Fliegenfischen",
        paragraphs: ["Pakete mit halbtägigem Fliegenfischen umfassen an jedem Angeltag etwa 4 Stunden Fliegenfischen — ideal, wenn Sie die beste Tide nutzen und den Rest des Tages freihaben möchten."],
        table: { headers: PKG_TABLE6 },
      },
      {
        heading: "Wie man das richtige Angelpaket wählt",
        paragraphs: [
          "Wie viele Nächte? Ein Paket mit 3 Nächten (2 Angeltage) ist eine gute Kurzreise. Ein Paket mit 5 Nächten (4 Angeltage) ist am beliebtesten: genug, um Popping, Jigging und Schleppangeln auszuprobieren und einen windigen Tag zu überbrücken. Passionierte Angler wählen 7 oder 8 Nächte.",
          "Riff, Thunfisch oder Fliege? Riffangeln ist die klassische Wahl für GT-Popping und Jigging, Thunfischangeln für Schleppangeln offshore, Fliegenfischen für Angler, die die Herausforderung der Flats suchen. Ganz- oder Halbtage? Ganztage für ernsthaftes Angeln und Offshore-Touren, Halbtage, wenn Sie die Nachmittage freihaben möchten oder mit Nicht-Anglern reisen.",
          "Wie viele Angler? Da das Boot gleich viel kostet, egal wie viele an Bord sind, sinkt der Preis pro Person deutlich mit der Gruppengröße. Bei einem Paket mit 5 Nächten und ganztägigem Riffangeln zahlen 6 Angler jeweils etwa ein Viertel des Einzelpreises. Eine andere Länge, ein anderes Atoll oder eine Mischung? Nutzen Sie den Angelpaket-Rechner.",
        ],
        linkLabels: ["Angelpaket-Rechner", "Beispiel-Reiseplan", "Kosten einer Angelreise auf den Malediven"],
      },
      {
        heading: "Was man im Angelurlaub auf den Malediven fängt",
        paragraphs: [
          "Die Crew plant jeden Angeltag nach Tide, Wetter und Saison. Popping und Jigging an Riffkanten und Kanälen zielen auf Giant Trevally, Blauflossen-Makrele, Dogtooth-Thun, Zackenbarsche und Schnapper. Schleppangeln offshore zielt auf Gelbflossenthun, Wahoo und Mahi-Mahi, mit Chancen auf Segelfisch und Marlin.",
          "Die am häufigsten genannte GT-Saison ist April bis Oktober, während Dezember bis April ruhigere See und Hauptsaison für Gelbflossenthun, Wahoo und Mahi-Mahi bringt. Geangelt wird das ganze Jahr.",
        ],
        linkLabels: ["GT-Angeln auf den Malediven", "Beste Zeit zum Angeln auf den Malediven", "Thunfischangeln auf den Malediven"],
      },
      {
        heading: "Anreise zu Ihrem Angelurlaub",
        paragraphs: [
          "Fliegen Sie international nach Malé. Von dort sind Inlandsflug nach Süden und Boottransfer nach Maamendhoo in jedem Paket inklusive. Planen Sie genug Zeit zwischen internationalem und Inlandsflug ein und prüfen Sie das Freigepäck des Inlandsflugs, wenn Sie Rutenrohre mitnehmen.",
          "Nur ein oder zwei Tage Angeln? Sie können die Emperor auch tageweise buchen: 1.380 USD pro Boot für einen ganzen Tag oder 980 USD für einen halben Tag, für bis zu 5 Angler. Für ein anderes Paket probieren Sie den Angelpaket-Rechner.",
        ],
        linkLabels: ["Emperor Privatcharter", "Packliste für den Angelurlaub"],
      },
    ],
  },
};
