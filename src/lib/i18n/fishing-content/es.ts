import type { FishingContentUpdate } from "@/lib/i18n/fishing-content/types";

const REEF_PKG_HEADERS = ["Paquete (pesca de arrecife de día completo)", "Días de pesca", "Por persona, 2 pescadores", "Por persona, 5 pescadores"];
const TUNA_PKG_HEADERS = ["Paquete (pesca de atún de día completo)", "Días de pesca", "Por persona, 2 pescadores", "Por persona, 5 pescadores"];
const PKG_TABLE6 = ["Paquete", "Días de pesca", "1 huésped", "2 huéspedes", "3 huéspedes", "4 huéspedes", "5 huéspedes", "6 huéspedes"];

export const ES: FishingContentUpdate = {
  species: {
    "gt-fishing": {
      metaDescription: "Pesca de GT en Maldivas: popping y jigging de carángido gigante en arrecifes exteriores y canales a bordo del Emperor, chárter privado desde 980 USD por barco.",
      extraSections: [
        {
          heading: "Dónde pescar GT en Maldivas",
          paragraphs: [
            "El carángido gigante caza donde el arrecife se encuentra con el agua en movimiento. En Maldivas eso significa los bordes del arrecife exterior, donde el coral cae al azul profundo, y los canales (kandu) que atraviesan el anillo del atolón. Con la marea en marcha, los peces pasto son empujados por estos canales entre la laguna y el océano abierto, y los GT se concentran en las bocas de los canales y a lo largo de los bordes para emboscarlos.",
            "Cuanto menos se pesca un arrecife, mejores son las posibilidades, por eso los pescadores de GT van a los atolones remotos del extremo sur en lugar de a los atolones turísticos alrededor de Malé. Nuestro barco de chárter privado, el Emperor, puede organizarse en otros atolones por la misma tarifa según las fechas y la posición del barco, pero su base es el atolón Gaafu Alifu.",
          ],
        },
        {
          heading: "Pesca de GT en el atolón Gaafu Alifu",
          paragraphs: [
            "Gaafu Alifu es la mitad norte del atolón Huvadhu, en el extremo sur de Maldivas, uno de los atolones más grandes del mundo. Su largo arrecife exterior está cortado por muchos canales y, con pocos resorts y pocos barcos de pesca, sus arrecifes soportan mucha menos presión que los atolones centrales. Esa combinación de canales, caídas profundas y aguas tranquilas es justo lo que necesita la pesca de GT.",
            "El Emperor y su tripulación tienen su base en Maamendhoo, una isla local de Gaafu Alifu, en el Maldives Fishing and Holidays Lodge. Alojarse en el lodge te mantiene cerca de los caladeros, para estar en el arrecife cuando empieza a correr la marea. Se llega con un vuelo doméstico desde Malé (365 USD por persona) y un breve traslado en barco, ambos incluidos en nuestros paquetes de pesca.",
            "Gaafu Alifu también es ideal para una salida mixta. Cuando los GT están tranquilos, el mismo barco puede curricanear mar adentro en busca de atún de aleta amarilla, wahoo y dorado, o hacer jigging en las paredes profundas para atún diente de perro y meros, de modo que cada día en el agua tiene un objetivo, sea cual sea la marea y la temporada.",
          ],
          linkLabels: ["Maldives Fishing and Holidays Lodge", "Maamendhoo, Gaafu Alifu", "Guía de pesca del atolón Gaafu"],
        },
        {
          heading: "Popping y jigging de GT en Maldivas",
          paragraphs: [
            "El popping es la forma clásica de pescar GT. Se lanza un gran señuelo de superficie, un popper o un stickbait, hacia el borde del arrecife o a través de un canal y se recoge con tirones amplios de la caña para que salpique y levante agua. Un GT que ataca suele hacerlo con violencia cerca de la superficie y luego corre directo al arrecife, así que los primeros segundos deciden la pelea. El popping es físico: cuenta con muchos lances con una caña pesada.",
            "El jigging trabaja aguas más profundas. Se deja caer un jig metálico pesado por la pared del arrecife y se recupera con la caña y el carrete. Es menos cansado que el popping, captura GT que no comen en superficie y también atún diente de perro, meros y otros peces de arrecife. Muchos pescadores combinan ambos en un día: popping con la marea corriendo y los peces activos arriba, jigging cuando están más profundos.",
          ],
          linkLabels: ["Popping de GT en Maldivas", "Jigging en Maldivas"],
        },
        {
          heading: "Equipo de popping para GT",
          paragraphs: [
            "El equipo para GT debe impedir que un pez muy fuerte llegue al coral en los primeros segundos. Eso significa una caña de spinning pesada para lanzar señuelos grandes, un carrete de spinning de agua salada grande con un freno potente, línea trenzada gruesa y un bajo de monofilamento o fluorocarbono grueso que resista el arrecife. Los poppers y stickbaits se montan con anzuelos simples fuertes o triples reforzados y anillas resistentes.",
            "El equipo básico de pesca está incluido en todos los chárteres del Emperor. Si no traes tu propio equipo de popping y jigging, puedes añadir un equipo profesional de caña y carrete por 80 USD por equipo. Lleva gafas polarizadas, sombrero, guantes para manipular el bajo y el pez, y protector solar respetuoso con el arrecife.",
          ],
        },
        {
          heading: "Chárter de pesca de GT: qué esperar y cuánto cuesta",
          paragraphs: [
            "Un chárter de medio día son unas 4 horas en el agua y uno de día completo unas 8 horas. La tripulación planifica el día según la marea, porque el agua en movimiento activa a los GT: el barco trabaja las bocas de los canales y los bordes del arrecife con la marea corriendo, y el repunte es buen momento para hacer jigging más profundo o cambiar de lugar.",
            "El Emperor admite hasta 5 pescadores y el precio es por barco: 980 USD el medio día o 1.380 USD el día completo, con capitán y tripulación, combustible, refrescos y snacks, y equipo básico. Entre cinco pescadores, un día completo de pesca de GT sale a 276 USD por persona. Un día completo da más mareas y más puntos.",
          ],
          linkLabels: ["Chárter privado Emperor", "Coste de un viaje de pesca en Maldivas", "Mejores destinos de pesca de GT"],
        },
        {
          heading: "Vacaciones y paquetes de pesca de GT en Maldivas",
          paragraphs: [
            "Para unas vacaciones dedicadas al GT, nuestros paquetes en el lodge de Maamendhoo incluyen pensión completa, el vuelo doméstico de ida y vuelta, el traslado en barco y un chárter privado en el Emperor cada día de pesca. El precio es por persona y baja cuantos más pescadores comparten el barco. Estos son los paquetes de pesca de arrecife de día completo:",
          ],
          table: { headers: REEF_PKG_HEADERS },
          linkLabels: ["Todos los paquetes de pesca en Maldivas", "Paquetes con pesca de medio día"],
        },
        {
          heading: "¿Qué tamaño alcanza el carángido gigante?",
          paragraphs: [
            "El carángido gigante (Caranx ignobilis) es el mayor de su familia y alcanza unos 170 cm y 80 kg. Sea cual sea su tamaño, un GT tira más fuerte que casi cualquier otro pez del arrecife. Los GT pequeños suelen cazar en grupo, mientras que los más grandes patrullan solos el borde del arrecife.",
          ],
        },
        {
          heading: "Captura y suelta del carángido gigante",
          paragraphs: [
            "El carángido gigante crece despacio y la mayoría de los pescadores de GT liberan sus peces. Las buenas prácticas aumentan sus posibilidades: usar anzuelos simples o sin muerte, acortar la pelea, sujetar el pez en horizontal bajo el vientre para una foto rápida en lugar de colgarlo de la boca y mantenerlo fuera del agua el menor tiempo posible. Antes de soltarlo, sujétalo en el agua de cara a la corriente hasta que se aleje por sí mismo.",
          ],
        },
      ],
      extraFaqs: [
        { question: "¿Cuánto cuesta una salida de pesca de GT?", answer: "Un chárter privado en el Emperor cuesta 980 USD el medio día o 1.380 USD el día completo, por barco para hasta 5 pescadores. Un equipo profesional de caña y carrete para GT cuesta 80 USD por equipo." },
        { question: "¿Dónde está la mejor pesca de GT en Maldivas?", answer: "En los atolones remotos del sur, donde los canales y los bordes del arrecife exterior apenas se pescan. Nuestro barco, el Emperor, tiene su base en el atolón Gaafu Alifu precisamente por eso." },
        { question: "¿Necesito experiencia para hacer popping de GT?", answer: "No, pero ayuda estar en buena forma: el popping implica muchos lances con una caña pesada. El jigging es una forma más fácil de empezar y la tripulación puede ayudarte con el lance y el manejo del señuelo." },
        { question: "¿Puedo reservar un paquete de pesca de GT?", answer: "Sí. Nuestros paquetes en el Maldives Fishing and Holidays Lodge de Maamendhoo, Gaafu Alifu, van de 2 a 8 noches e incluyen el lodge, las comidas, el vuelo doméstico, el traslado en barco y un chárter privado cada día de pesca." },
        { question: "¿La pesca de GT es de captura y suelta?", answer: "La mayoría de los pescadores de GT liberan sus peces. Anzuelos simples o sin muerte, una pelea corta y una foto rápida sujetando el pez en horizontal le dan la mejor oportunidad." },
      ],
    },
    "tuna-fishing": {
      metaTitle: "Pesca de atún de aleta amarilla en Maldivas | Chárter",
      metaDescription: "Pesca de atún de aleta amarilla en Maldivas: dónde y cómo pescarlo, mejor temporada, equipo y precios de un chárter privado de pesca de atún en Gaafu Alifu.",
      h1: "Pesca de atún de aleta amarilla en Maldivas",
      extraSections: [
        {
          heading: "El atún de aleta amarilla en Maldivas",
          paragraphs: [
            "El atún de aleta amarilla es uno de los peces deportivos más buscados de Maldivas. Está hecho para la velocidad: cuerpo en forma de torpedo, lomo azul oscuro, una franja amarilla en el costado y largas aletas dorsal y anal de un amarillo intenso. Alcanza unos 200 cm y 200 kg, e incluso un ejemplar mediano corre fuerte y profundo y pelea hasta el barco.",
            "Caza en bancos en mar abierto, alimentándose de peces voladores, calamares y atunes más pequeños. Suele encontrarse bajo aves marinas en caza, alrededor de objetos flotantes y dispositivos de concentración de peces (FAD) y junto a delfines. En Maldivas también lo pescan los pescadores locales con línea de mano y caña, y es un pilar de la cocina maldiva.",
          ],
        },
        {
          heading: "Dónde pescar atún de aleta amarilla en Maldivas",
          paragraphs: [
            "El atún de aleta amarilla vive en el azul profundo más allá de los atolones, así que pescarlo significa salir más allá del arrecife. La tripulación busca aves que se lanzan sobre el cebo, atunes rompiendo la superficie, troncos flotantes y los FAD fondeados mar adentro, que reúnen peces pasto y a los atunes que se alimentan de ellos.",
            "En Maldivas el océano profundo está cerca de todos los atolones. En Gaafu Alifu, en el extremo sur, el largo arrecife exterior cae directamente a aguas profundas, así que el Emperor puede estar curricaneando en busca de aleta amarilla poco después de salir de Maamendhoo y pasar al arrecife para GT o atún diente de perro más tarde.",
          ],
        },
        {
          heading: "Cómo pescar atún de aleta amarilla",
          paragraphs: [
            "El curricán es el método principal. El barco arrastra mar adentro una serie de señuelos de faldilla, peces artificiales o cebos montados y, cuando un aleta amarilla ataca, el carrete grita y el pescador toma la caña. El curricán también captura wahoo, dorado y listado, y a veces pez vela y marlín.",
            "Cuando un banco de aleta amarilla come en superficie, lanzar poppers y stickbaits en medio de la acción es una de las formas más emocionantes de pescarlo, y requiere equipo de spinning pesado. El equipo de curricán está a bordo; el equipo básico está incluido y un equipo profesional de popping cuesta 80 USD por equipo.",
          ],
          linkLabels: ["Curricán en Maldivas", "Pesca de altura y big game"],
        },
        {
          heading: "Chárter de pesca de atún de aleta amarilla y precios",
          paragraphs: [
            "El Emperor, nuestro barco de pesca privado, mide 32 pies, tiene dos motores de 200 CV, admite hasta 5 pescadores y tiene su base en Maamendhoo, atolón Gaafu Alifu. Para el aleta amarilla recomendamos un día completo, que da tiempo para salir mar adentro y encontrar los bancos: 1.380 USD por barco, o 276 USD por persona con cinco pescadores. El medio día cuesta 980 USD por barco. Ambos incluyen capitán y tripulación, combustible, refrescos y snacks, y equipo básico.",
            "Para varios días de pesca de atún, nuestros paquetes en el Maldives Fishing and Holidays Lodge incluyen el lodge, pensión completa, el vuelo doméstico, el traslado en barco y un chárter privado cada día de pesca:",
          ],
          table: { headers: TUNA_PKG_HEADERS },
          linkLabels: ["Chárter privado Emperor", "Todos los paquetes de pesca", "Pesca de atún en Maldivas: todas las especies"],
        },
        {
          heading: "El aleta amarilla y otros atunes de Maldivas",
          paragraphs: [
            "El aleta amarilla es uno de los tres atunes que se pescan en Maldivas. El listado es más pequeño, con rayas en el vientre, viaja todo el año en enormes bancos y es la base de la pesca tradicional con caña y línea. El atún diente de perro es un depredador de arrecife que vive en las paredes profundas y se pesca con jigging, sobre todo de noviembre a abril. Un día completo en el Emperor puede ir a por los tres.",
          ],
          linkLabels: ["Pesca de atún diente de perro", "Pesca tradicional maldiva"],
        },
        {
          heading: "Consejos para pescar atún de aleta amarilla",
          paragraphs: [
            "Sal temprano, cuando el atún suele comer con más fuerza. Busca aves lanzándose al agua, la mejor señal de atún debajo. Reserva un día completo en la temporada de diciembre a marzo. Quédate solo con el atún que vayas a comer y suelta el resto: un aleta amarilla fresco es una de las mejores comidas de Maldivas, en sashimi, a la parrilla o en un curry maldivo.",
          ],
        },
      ],
      extraFaqs: [
        { question: "¿Qué tamaño alcanza el atún de aleta amarilla en Maldivas?", answer: "Alcanza unos 200 cm y 200 kg, aunque la mayoría de los capturados en una salida de un día son mucho más pequeños y aun así pelean con fuerza." },
        { question: "¿Cuánto cuesta una salida de pesca de atún en Maldivas?", answer: "Un chárter privado de día completo en el Emperor cuesta 1.380 USD por barco para hasta 5 pescadores, con tripulación, combustible, bebidas, snacks y equipo básico. El medio día cuesta 980 USD." },
        { question: "¿Puedo quedarme con el atún que pesque?", answer: "Pregunta a la tripulación. El atún que se guarda para comer suele prepararse fresco; suelta lo que no vayas a comer." },
      ],
    },
    "dogtooth-tuna": {
      metaDescription: "Pesca de atún diente de perro en Maldivas: dónde vive, cómo pescarlo con jigging, equipo, mejor temporada y precios de un chárter privado en Gaafu Alifu.",
      extraSections: [
        {
          heading: "El atún diente de perro: el luchador más duro del arrecife",
          paragraphs: [
            "El atún diente de perro (Gymnosarda unicolor) debe su nombre a sus dientes afilados y cónicos, raros entre los atunes. A diferencia del aleta amarilla y el listado, que recorren el océano abierto en bancos, es un depredador de arrecife que vive en paredes profundas y caídas, normalmente solo o en grupos pequeños. Alcanza unos 130 cm y 70 kg.",
            "Es famoso por su fuerza. Al clavarse, se gira y se lanza directo al arrecife, y si llega, la línea suele cortarse en el coral. Sacar uno exige equipo pesado, el freno apretado y recoger con rapidez y decisión en los primeros segundos de la pelea.",
          ],
        },
        {
          heading: "Dónde encontrar atún diente de perro en Maldivas",
          paragraphs: [
            "El atún diente de perro se sitúa en las paredes empinadas del arrecife exterior, donde el coral cae al agua profunda, en las caídas de las bocas de los canales y alrededor de pináculos profundos. Come donde la corriente empuja el cebo contra la pared, así que los mejores puntos están en el lado de la corriente con la marea en marcha.",
            "Los atolones remotos del sur están entre los mejores lugares de Maldivas para este atún, porque sus paredes exteriores apenas se pescan. Gaafu Alifu, donde tiene su base nuestro barco Emperor, tiene un largo arrecife exterior con paredes profundas y caídas de canal cerca de Maamendhoo.",
          ],
          linkLabels: ["Mejores lugares de pesca en Maldivas"],
        },
        {
          heading: "Cómo pescar atún diente de perro: jigging",
          paragraphs: [
            "El jigging es la forma principal de pescarlo. Se baja un jig metálico pesado por la pared hasta la profundidad de los peces y se recupera con tirones secos de la caña y vueltas rápidas del carrete. La picada suele llegar mientras el jig cae o en los primeros tirones desde el fondo, así que hay que estar listo desde que el jig llega a la profundidad.",
            "El jigging rápido, con tirones agresivos y jigs largos y finos, es la técnica clásica. El slow pitch, con tirones cortos y jigs más planos que caen aleteando, también captura diente de perro y además meros, pargos y medregales. A veces este atún sube a por poppers en superficie o se pesca con cebo vivo.",
          ],
          linkLabels: ["Jigging en Maldivas", "Guía de popping y jigging de GT"],
        },
        {
          heading: "Equipo de jigging para atún diente de perro",
          paragraphs: [
            "El equipo debe frenar a un pez muy potente a pocos metros del arrecife. Se usa una caña de jigging fuerte y un carrete de spinning o de jigging con gran capacidad y freno potente, línea trenzada para contacto directo con el jig y un bajo grueso de fluorocarbono que resista los dientes y el coral. Los jigs van de unos 100 g a 300 g o más, según la profundidad y la corriente, con anzuelos asistentes fuertes.",
            "En el Emperor, el equipo básico está incluido en todos los chárteres y puedes añadir un equipo profesional de jigging por 80 USD por equipo si no traes el tuyo.",
          ],
        },
        {
          heading: "Cómo pelear un atún diente de perro",
          paragraphs: [
            "Aprieta el freno antes de bajar el jig. Cuando pique, no le des línea: bloquea la caña contra el cuerpo, levanta y recoge con fuerza para subirlo y alejarlo del arrecife en los primeros segundos. Una vez lejos de la pared, mantén presión constante y bombea hasta la superficie. Ayuda pelear desde un barco en marcha: el capitán suele alejarse del arrecife para arrastrar el pez a aguas abiertas.",
          ],
        },
        {
          heading: "Chárter de pesca de atún diente de perro y precios",
          paragraphs: [
            "El Emperor es un barco de 32 pies con dos motores de 200 CV para hasta 5 pescadores. Un chárter de día completo cuesta 1.380 USD por barco y uno de medio día 980 USD, con capitán y tripulación, combustible, refrescos y snacks, y equipo básico. La tripulación planifica el jigging en las paredes según la marea y puede añadir popping para GT y curricán para atún y wahoo.",
            "Para varios días de jigging, nuestros paquetes en el Maldives Fishing and Holidays Lodge de Maamendhoo incluyen el lodge, pensión completa, el vuelo doméstico, el traslado en barco y un chárter privado cada día de pesca:",
          ],
          table: { headers: REEF_PKG_HEADERS },
          linkLabels: ["Chárter privado Emperor", "Todos los paquetes de pesca", "Pesca de atún en Maldivas"],
        },
        {
          heading: "Otros peces que se capturan con jigging",
          paragraphs: [
            "El jigging en las paredes profundas rara vez da solo atún diente de perro. Los mismos jigs capturan GT que están profundos, medregales, meros, pargos rojos, jobfish y otros peces de arrecife, muchos excelentes para comer. El slow pitch en especial trae una gran variedad de especies de fondo, así que una sesión de jigging merece la pena incluso los días en que el diente de perro no pica.",
            "Como las paredes están junto a las bocas de los canales, la tripulación también puede pasar al popping de GT con la marea corriendo o salir mar adentro a curricanear aleta amarilla y wahoo.",
          ],
          linkLabels: ["Pesca de GT en Maldivas", "Mejores destinos de popping y jigging"],
        },
        {
          heading: "Captura y suelta del atún diente de perro",
          paragraphs: [
            "El atún diente de perro es un depredador de arrecife de crecimiento lento y muchos pescadores lo liberan. Acorta la pelea con equipo fuerte, manipula el pez con cuidado lejos de los dientes, sujeta su peso para una foto rápida y reanímalo en el agua antes de soltarlo. Si te quedas con uno, es un pescado excelente.",
          ],
        },
      ],
      extraFaqs: [
        { question: "¿Qué tamaño alcanza el atún diente de perro?", answer: "Alcanza unos 130 cm y 70 kg. Incluso los ejemplares medianos son muy fuertes y corren directo al arrecife al clavarse." },
        { question: "¿Qué peso de jig es mejor para el atún diente de perro?", answer: "Depende de la profundidad y la corriente; muchos pescadores llevan jigs de unos 100 g a 300 g o más y usan los más pesados en aguas profundas y con corriente fuerte." },
        { question: "¿Dónde está la mejor pesca de atún diente de perro en Maldivas?", answer: "En las paredes empinadas del arrecife exterior y las caídas de los canales de los atolones remotos del sur, como Gaafu Alifu, donde tiene su base el Emperor." },
        { question: "¿Cuánto cuesta una salida de pesca de atún diente de perro?", answer: "Un chárter privado de día completo en el Emperor cuesta 1.380 USD por barco para hasta 5 pescadores, o 980 USD el medio día. Un equipo profesional de jigging cuesta 80 USD por equipo." },
      ],
    },
  },
  techniques: {
    "big-game-fishing": {
      metaTitle: "Pesca de altura en Maldivas | Chárter de big game",
      metaDescription: "Pesca de altura y big game en Maldivas: curricán de atún de aleta amarilla, wahoo, pez vela y marlín, mejor temporada, precios y chárteres privados.",
      h1: "Pesca de altura y big game en Maldivas",
      heroDescription: "Curricán mar adentro de atún de aleta amarilla, wahoo, dorado, pez vela y marlín en el azul profundo más allá de los atolones.",
      extraSections: [
        {
          heading: "Pesca de altura en Maldivas",
          paragraphs: [
            "La pesca de altura, también llamada big game o pesca offshore, consiste en salir más allá del anillo del atolón al azul profundo del océano Índico para pescar grandes especies pelágicas. En Maldivas el agua profunda empieza justo fuera del arrecife de cada atolón, así que una salida de altura no requiere una larga travesía: el barco puede estar curricaneando a lo largo de la caída a los pocos minutos de salir de la isla.",
            "Los objetivos principales son el atún de aleta amarilla, el wahoo y el dorado, con pez vela y marlín más lejos. El listado suele aparecer en grandes bancos, y el atún diente de perro y el GT viven en las paredes del arrecife, por eso muchas salidas de altura en Maldivas combinan curricán mar adentro con una sesión de popping o jigging en el arrecife.",
          ],
        },
        {
          heading: "Especies de pesca de altura en Maldivas",
          paragraphs: ["Estos son los principales peces de una salida de altura en Maldivas, con las temporadas de nuestros registros de especies. Varían según el atolón y el año, así que tómalas como orientación."],
          table: {
            headers: ["Especie", "Dónde", "Temporada", "Técnica principal"],
            cells: [
              ["Atún de aleta amarilla", "Mar adentro, bajo aves, en FAD", "Diciembre a marzo", "Curricán, lances a bancos"],
              ["Wahoo", "Bordes del arrecife exterior y mar adentro", "Diciembre a marzo", "Curricán rápido"],
              ["Dorado", "Objetos flotantes, FAD", "Diciembre a abril", "Curricán, lances"],
              ["Listado", "Bancos mar adentro", "Todo el año", "Curricán con señuelos pequeños"],
              ["Pez vela", "Aguas profundas, a menudo cerca del arrecife", "Pregunta por capturas recientes", "Curricán, cebo vivo"],
              ["Marlín", "Azul profundo mar adentro", "Pregunta por capturas recientes", "Curricán"],
            ],
          },
        },
        {
          heading: "¿Pesca de altura o pesca de arrecife?",
          paragraphs: [
            "La pesca de altura consiste en recorrer agua mar adentro y esperar la picada de un pelágico rápido: largas travesías, muchos señuelos en el agua y la opción de un atún, un wahoo o un pez de pico. La pesca de arrecife, el popping y el jigging trabajan bordes, canales y paredes en busca de GT, atún diente de perro, meros y pargos. En Maldivas no hay que elegir: el agua profunda está justo fuera del arrecife, así que un día completo en el Emperor puede incluir unas horas de curricán y una sesión de popping o jigging a la vuelta.",
          ],
          linkLabels: ["Pesca de GT", "Guía de popping y jigging"],
        },
        {
          heading: "Técnicas de pesca de altura",
          paragraphs: [
            "El curricán es la técnica principal. La tripulación coloca varias cañas con señuelos de faldilla, peces artificiales o cebos montados a distintas distancias del barco y navega a velocidad de curricán por el borde del arrecife exterior en busca de wahoo o mar adentro en busca de atún, dorado y peces de pico, atenta a aves en caza, objetos flotantes y peces rompiendo la superficie. Cuando pica un pez, un pescador toma la caña y lo pelea desde el barco.",
            "Cuando el aleta amarilla come en superficie, también se lanzan poppers y stickbaits al banco, y se usa cebo vivo para peces vela y marlines que suben tras el barco. El equipo de curricán está a bordo.",
          ],
          linkLabels: ["Curricán en Maldivas", "Pesca big game en el océano Índico"],
        },
        {
          heading: "Mejor época para la pesca de altura en Maldivas",
          paragraphs: [
            "El monzón del noreste, más tranquilo, de diciembre a abril, es la mejor época para la pesca de altura en Maldivas. El mar está más llano, las largas travesías de curricán son más cómodas y es temporada alta de atún de aleta amarilla y wahoo (diciembre a marzo) y de dorado (diciembre a abril). El pez vela y el marlín se pescan mar adentro en distintas épocas; pregúntanos por capturas recientes al planificar.",
            "Durante el monzón del suroeste, de mayo a noviembre, las salidas continúan los días más tranquilos, y es la temporada más citada para el GT en el arrecife.",
          ],
          linkLabels: ["Mejor época para pescar en Maldivas"],
        },
        {
          heading: "Precios de las salidas de pesca de altura",
          paragraphs: [
            "Nuestro barco privado, el Emperor, es un barco de pesca de 32 pies con dos motores de 200 CV para hasta 5 pescadores, con base en Maamendhoo, atolón Gaafu Alifu, donde el océano profundo empieza justo tras el largo arrecife exterior. Para la pesca mar adentro recomendamos un día completo: 1.380 USD por barco, o 276 USD por persona con cinco pescadores. El medio día cuesta 980 USD por barco. Ambos incluyen capitán y tripulación, combustible, refrescos y snacks, y equipo básico.",
            "Cerca de Malé, la web también muestra salidas de big game de resorts y operadores independientes; consulta los chárteres más abajo. Para varios días de pesca, nuestros paquetes en el Maldives Fishing and Holidays Lodge incluyen el lodge, las comidas, el vuelo doméstico, el traslado y un chárter privado cada día de pesca.",
          ],
          table: { headers: TUNA_PKG_HEADERS },
          linkLabels: ["Chárter privado Emperor", "Todos los paquetes de pesca", "Coste de un viaje de pesca en Maldivas"],
        },
        {
          heading: "Pesca de marlín y pez vela",
          paragraphs: [
            "Los peces de pico son el gran objetivo de la pesca de altura. El pez vela, con su enorme aleta dorsal y sus saltos acrobáticos, suele pescarse más cerca del arrecife que el marlín; el marlín es un objetivo de largo alcance en el azul profundo, así que un día completo da más opciones. Los peces de pico normalmente se liberan: deja el pez en el agua, sujétalo junto al barco de cara a la corriente y deja que se aleje nadando.",
          ],
          linkLabels: ["Pesca de marlín", "Pesca de pez vela"],
        },
        {
          heading: "Consejos para tu salida de pesca de altura",
          paragraphs: [
            "Reserva un día completo para especies de altura, que llevan tiempo encontrar. Toma precauciones contra el mareo si las necesitas, porque mar adentro puede haber mar picada. Lleva sombrero, gafas polarizadas, camisa de manga larga y protector solar respetuoso con el arrecife. Acuerda con la tripulación qué peces quieres guardar para comer y cuáles soltar, y deja que la tripulación monte el equipo de curricán.",
          ],
          linkLabels: ["Lista de equipaje para vacaciones de pesca"],
        },
      ],
      extraFaqs: [
        { question: "¿Qué diferencia hay entre pesca de altura y big game?", answer: "Significan prácticamente lo mismo: pescar mar adentro en aguas profundas grandes peces pelágicos como atún, wahoo, pez vela y marlín, sobre todo al curricán." },
        { question: "¿Cuánto cuesta la pesca de altura en Maldivas?", answer: "Un chárter privado de día completo en el Emperor cuesta 1.380 USD por barco para hasta 5 pescadores, o 980 USD el medio día, con tripulación, combustible, bebidas, snacks y equipo básico." },
        { question: "¿Cuál es la mejor época para la pesca de altura en Maldivas?", answer: "De diciembre a abril, durante el monzón del noreste, más tranquilo, cuando es temporada de atún de aleta amarilla, wahoo y dorado." },
        { question: "¿Pueden los principiantes hacer pesca de altura?", answer: "Sí. La tripulación coloca los señuelos y vigila las cañas, te pasa la caña cuando pica un pez y te guía durante la pelea." },
      ],
    },
  },
  emperor: {
    dayTitle: "Qué esperar de un chárter de pesca privado",
    dayParagraphs: [
      "Un chárter de medio día son unas 4 horas en el agua y uno de día completo unas 8 horas. En la base del Emperor el barco sale de Maamendhoo, atolón Gaafu Alifu; si organizamos tu chárter en otro lugar, te confirmamos el punto de salida al confirmar la fecha.",
      "Dile al capitán qué quiere pescar tu grupo y cuánta experiencia tiene cada uno, y la tripulación planifica el día según la marea, el tiempo y la temporada: popping y jigging en los bordes del arrecife exterior y los canales para GT y atún diente de perro, curricán en los trayectos entre puntos para atún, wahoo y dorado, o una pesca de arrecife más tranquila cerca de la isla. Un día completo da tiempo para combinar varias; medio día suele centrarse en una o dos.",
      "A bordo hay refrescos, snacks y equipo básico de pesca.",
    ],
    includedTitle: "Qué incluye un chárter de pesca privado",
    includedHeading: "Incluido en cada chárter",
    notIncludedHeading: "No incluido",
    included: ["Capitán y tripulación profesionales", "Combustible", "Refrescos y snacks", "Equipo básico de pesca"],
    notIncluded: [
      "Vuelo doméstico al atolón Gaafu (365 USD por persona) si vienes a la base del Emperor",
      "Alojamiento y comidas (nuestro lodge en Maamendhoo: 150 USD por habitación, pensión completa)",
      "Equipo profesional de caña y carrete para popping y jigging más pesado (80 USD por equipo)",
    ],
    packageBefore: "¿Varias noches? Un ",
    packageLink: "paquete de pesca",
    packageAfter: " combina los chárteres con el lodge, las comidas, el vuelo doméstico y el traslado en barco.",
  },
  packagesFishing: {
    metaTitle: "Paquetes y vacaciones de pesca en Maldivas | MTG",
    metaDescription: "Paquetes de pesca en el atolón Gaafu Alifu: 3 a 8 noches de pesca de arrecife, atún o con mosca con lodge, comidas, vuelo doméstico, traslado y barco privado.",
    intro:
      "Paquetes de vacaciones de pesca en el Maldives Fishing and Holidays Lodge de Maamendhoo, atolón Gaafu Alifu: pensión completa en habitación doble, vuelo doméstico de ida y vuelta, traslado en barco y un barco privado para tu grupo cada día de pesca. De 3 a 8 noches de pesca de arrecife, de atún o con mosca, de día completo o medio día, con precio por persona — o crea el tuyo con la calculadora de paquetes de pesca.",
    faqs: [
      { question: "¿Qué incluye un paquete de pesca en Maldivas?", answer: "Pensión completa en habitación doble en el Maldives Fishing and Holidays Lodge de Maamendhoo, vuelo doméstico de ida y vuelta desde Malé, traslado en barco a la isla y un barco privado para tu grupo cada día de pesca (capitán y tripulación, combustible, refrescos y snacks, equipo básico de pesca)." },
      { question: "¿Cuántos días de pesca tengo?", answer: "Uno menos que el número de noches: un paquete de 3 noches tiene 2 días de pesca, uno de 5 noches 4 y uno de 8 noches 7." },
      { question: "¿Por qué el precio depende del número de huéspedes?", answer: "El barco cuesta lo mismo sin importar cuántos pescadores vayan a bordo, así que cuantos más lo compartan, menor es el precio por persona. 6 huéspedes es la tarifa más económica." },
      { question: "¿Qué diferencia hay entre paquetes de día completo y de medio día?", answer: "Los de día completo incluyen unas 8 horas en el barco cada día de pesca; los de medio día unas 4 horas, son más baratos y dejan las tardes libres." },
      { question: "¿Qué diferencia hay entre los paquetes de arrecife, de atún y de pesca con mosca?", answer: "Los paquetes de arrecife pescan en los bordes del arrecife y los canales: popping, jigging y pesca de fondo de GT, meros y pargos. Los de atún salen mar adentro a curricán y jigging de atún aleta amarilla, listado y atún diente de perro. Los de pesca con mosca recorren los bajos y los bordes del arrecife con caña de mosca." },
      { question: "¿Están incluidos los vuelos internacionales?", answer: "No. Los paquetes incluyen el vuelo doméstico de ida y vuelta desde Malé y el traslado en barco; el vuelo internacional a Malé lo reservas tú." },
      { question: "¿Necesito mi propio equipo de pesca?", answer: "No. El equipo básico está incluido cada día de pesca. Hay un equipo profesional de popping o jigging por 80 USD por equipo, o puedes traer el tuyo." },
      { question: "¿Pueden venir personas que no pescan?", answer: "Pregúntanos al hacer la consulta. El lodge está en una isla local, así que quienes no pescan pueden relajarse, nadar y hacer snorkel mientras los demás pescan." },
    ],
    relatedLabels: ["Pesca en Maldivas", "Chárter privado Emperor", "Maldives Fishing and Holidays Lodge", "Coste de un viaje de pesca", "Itinerario de viaje de pesca"],
    sections: [
      {
        heading: "Vacaciones de pesca en Maldivas en el atolón Gaafu Alifu",
        paragraphs: [
          "Nuestros paquetes de pesca se basan en uno de los caladeros más tranquilos de Maldivas. Gaafu Alifu es la mitad norte del atolón Huvadhu, en el extremo sur del país, uno de los atolones más grandes del mundo. Su largo arrecife exterior está cortado por muchos canales y cae directamente al océano profundo, y muy pocos barcos de pesca lo trabajan. Es una base ideal para el popping y jigging de GT, el atún diente de perro en las paredes y el curricán de atún de aleta amarilla, wahoo y dorado.",
          "Te alojas en el Maldives Fishing and Holidays Lodge de Maamendhoo, una isla local de Gaafu Alifu, gestionado por la misma empresa que nuestro barco Emperor. Habitación, comidas, traslados y pesca los organiza un único operador, y los caladeros están cerca de la isla, así que pasas los días pescando en lugar de viajando.",
        ],
        linkLabels: ["Guía de pesca del atolón Gaafu", "Mejores lugares de pesca en Maldivas"],
      },
      {
        heading: "Qué incluye cada paquete de pesca",
        paragraphs: [
          "Cada paquete incluye pensión completa en el lodge en habitación doble (una habitación por cada dos huéspedes), el vuelo doméstico de ida y vuelta desde Malé, el traslado en barco a Maamendhoo y un barco privado para tu grupo cada día de pesca: Emperor, un barco de 32 pies con dos motores de 200 CV para hasta 5 pescadores, o Bluefin, un barco de 36 pies para hasta 6. Cada chárter incluye capitán y tripulación, combustible, refrescos y snacks, y equipo básico de pesca.",
          "No incluido: tu vuelo internacional a Malé y, si lo quieres, un equipo profesional de popping o jigging (80 USD por equipo). El número de días de pesca es uno menos que el de noches, así que los días de llegada y salida son de viaje.",
        ],
      },
      {
        heading: "Precios de los paquetes de pesca de arrecife de día completo",
        paragraphs: ["Los paquetes de pesca de arrecife de día completo incluyen unas 8 horas en el barco cada día de pesca, en los bordes del arrecife y los canales: la mejor opción para el popping y el jigging de GT. Los precios son por persona y dependen de cuántos huéspedes compartan el barco; 6 huéspedes es la tarifa más económica."],
        table: { headers: PKG_TABLE6 },
      },
      {
        heading: "Precios de los paquetes de pesca de arrecife de medio día",
        paragraphs: ["Los paquetes de pesca de arrecife de medio día incluyen unas 4 horas en el barco cada día de pesca y dejan las tardes libres para descansar, nadar o hacer snorkel. Cuestan menos que los de día completo y son ideales para grupos mixtos, familias y pescadores que prefieren un ritmo más tranquilo."],
        table: { headers: PKG_TABLE6 },
      },
      {
        heading: "Precios de los paquetes de pesca de atún de día completo",
        paragraphs: ["Los paquetes de pesca de atún de día completo salen mar adentro unas 8 horas cada día de pesca, a curricán y jigging de atún aleta amarilla, listado y atún diente de perro, a menudo con peto y dorado."],
        table: { headers: PKG_TABLE6 },
      },
      {
        heading: "Precios de los paquetes de pesca de atún de medio día",
        paragraphs: ["Los paquetes de pesca de atún de medio día ofrecen unas 4 horas mar adentro cada día de pesca: suficiente para una sesión de curricán por la mañana, con la tarde libre."],
        table: { headers: PKG_TABLE6 },
      },
      {
        heading: "Precios de los paquetes de pesca con mosca de día completo",
        paragraphs: ["Los paquetes de pesca con mosca recorren los bajos y los bordes del arrecife de Gaafu Alifu con caña de mosca, según nuestras tarifas publicadas por persona. Elige la pesca con mosca de día completo para pasar más tiempo en el agua."],
        table: { headers: PKG_TABLE6 },
      },
      {
        heading: "Precios de los paquetes de pesca con mosca de medio día",
        paragraphs: ["Los paquetes de pesca con mosca de medio día incluyen unas 4 horas de pesca cada día: perfectos si quieres aprovechar la mejor marea y tener el resto del día libre."],
        table: { headers: PKG_TABLE6 },
      },
      {
        heading: "Cómo elegir un paquete de pesca",
        paragraphs: [
          "¿Cuántas noches? Un paquete de 3 noches (2 días de pesca) es una buena escapada. El de 5 noches (4 días de pesca) es el más popular: suficiente para probar popping, jigging y curricán y para compensar un día de viento. Los pescadores más dedicados eligen 7 u 8 noches.",
          "¿Arrecife, atún o mosca? La pesca de arrecife es la opción clásica para el popping y el jigging de GT; la de atún, para el curricán en alta mar; la pesca con mosca, para quienes buscan el reto de los bajos. ¿Día completo o medio día? Elige días completos para pescar en serio y salir mar adentro, y medios días si quieres las tardes libres o viajas con personas que no pescan.",
          "¿Cuántos pescadores? Como el barco cuesta lo mismo sin importar cuántos vayan a bordo, el precio por persona baja mucho a medida que crece el grupo. En un paquete de 5 noches de pesca de arrecife de día completo, 6 pescadores pagan cada uno alrededor de una cuarta parte del precio individual. ¿Otra duración, otro atolón o una combinación? Usa la calculadora de paquetes de pesca.",
        ],
        linkLabels: ["Calculadora de paquetes de pesca", "Itinerario de ejemplo", "Coste de un viaje de pesca en Maldivas"],
      },
      {
        heading: "Qué se pesca en unas vacaciones de pesca en Maldivas",
        paragraphs: [
          "La tripulación planifica cada día según la marea, el tiempo y la temporada. El popping y el jigging en los bordes del arrecife y los canales buscan GT, jurel de aleta azul, atún diente de perro, meros y pargos. El curricán mar adentro busca atún de aleta amarilla, wahoo y dorado, con opciones de pez vela y marlín.",
          "La temporada más citada para el GT es de abril a octubre, mientras que de diciembre a abril el mar está más tranquilo y es temporada alta de atún de aleta amarilla, wahoo y dorado. Se pesca todo el año.",
        ],
        linkLabels: ["Pesca de GT en Maldivas", "Mejor época para pescar en Maldivas", "Pesca de atún en Maldivas"],
      },
      {
        heading: "Cómo llegar a tus vacaciones de pesca",
        paragraphs: [
          "Vuela a Malé en tu vuelo internacional. Desde allí, el vuelo doméstico al sur y el traslado en barco a Maamendhoo están incluidos en todos los paquetes. Deja tiempo suficiente entre el vuelo internacional y el doméstico, y comprueba el equipaje permitido en el vuelo doméstico si llevas tubos de cañas.",
          "¿Solo quieres uno o dos días de pesca? También puedes reservar Emperor por días: 1.380 USD por barco el día completo o 980 USD el medio día, para hasta 5 pescadores. Para calcular otro paquete, prueba la calculadora de paquetes de pesca.",
        ],
        linkLabels: ["Chárter privado Emperor", "Lista de equipaje para vacaciones de pesca"],
      },
    ],
  },
};
