/**
 * MINDFORGE - Offline Demo Fallback Data
 * Provides 100% full offline functionality for lessons, Hinglish podcasts,
 * Mermaid flowcharts, Hinglish visual dictionary, and oral vivas.
 */

(function (window) {
  'use strict';

  const DEMO_DATA = {
    // -------------------------------------------------------------
    // CURRICULUM DEMO LESSONS
    // -------------------------------------------------------------
    lessons: {
      photosynthesis: {
        id: 'photosynthesis',
        category: 'Science & Nature',
        title: 'Photosynthesis: The Green Leaf Factory',
        summary: 'How green leaves capture sunlight to brew food and release fresh oxygen.',
        readingTime: '3 min read',
        content: `Have you ever wondered how giant trees grow without eating food like animals do?

The secret lies inside their leaves. Every green leaf is like a miniature solar factory. Inside the plant cells are microscopic green discs called chloroplasts. These chloroplasts contain a special pigment named chlorophyll.

Chlorophyll works like a solar panel. When sunlight strikes the leaf, chlorophyll absorbs the radiant energy. Meanwhile, the roots suck up water and minerals from deep inside the moist soil. Tiny microscopic pores under each leaf, known as stomata, breathe in carbon dioxide from the surrounding air.

Using the trapped energy of sunlight, the leaf splits water molecules and combines them with carbon dioxide. This chemical reaction creates glucose, a sweet sugary syrup that powers the plant and helps it build new branches and flowers.

As a bonus, the leaf releases fresh oxygen gas into the air. This oxygen is the exact breath of life that humans and animals need every single second. Without photosynthesis, life on Earth would simply cease to exist.`,
        podcast: [
          {
            speaker: 'Aarav',
            avatar: '👦',
            text: 'Riya didi! Yeh btao ped-paudhe itne bade ho jaate hain, par hum unhe roti-sabzi khilate to dekhte nahi. Unka khana aata kahan se hai?'
          },
          {
            speaker: 'Riya',
            avatar: '👩‍🏫',
            text: 'Arre Aarav, yeh to nature ka sabse bada magic hai! Har hari patti ke andar ek mini solar kitchen hota hai jiska head-chef hai Chlorophyll.'
          },
          {
            speaker: 'Aarav',
            avatar: '👦',
            text: 'Acha! Toh chef Chlorophyll cooking ke liye market se kya kya samaan mangwata hai?'
          },
          {
            speaker: 'Riya',
            avatar: '👩‍🏫',
            text: 'Sirf 3 natural cheezein! Suraj ki dhoop (Sunlight), zameen se jado (roots) dwara paani, aur hawa se Carbon Dioxide jo patti ke chote holes yaani Stomata se andar aati hai.'
          },
          {
            speaker: 'Aarav',
            avatar: '👦',
            text: 'Aur jab yeh teeno ingredients mix hote hain dhoop mein, toh banta kya hai dish?'
          },
          {
            speaker: 'Riya',
            avatar: '👩‍🏫',
            text: 'Patti banati hai Glucose—ek mitha sugary food jo ped ko energy deta hai. Aur sabse kamaal ki baat: cooking ke dauran fresh Oxygen gas hawa mein chhodti hai!'
          },
          {
            speaker: 'Aarav',
            avatar: '👦',
            text: 'Arey waah! Matlab ped ka by-product humare saans lene ke liye sabse zaroori oxygen hai! Yeh process sach mein magical hai.'
          },
          {
            speaker: 'Riya',
            avatar: '👩‍🏫',
            text: 'Bilkul! Isi life-giving process ko Science mein hum Photosynthesis kehte hain. Photo matlab light, synthesis matlab jod kar banana!'
          }
        ],
        mermaid: `graph TD
    A["☀️ Sunlight Energy"] --> D["🌿 Chloroplast & Chlorophyll"]
    B["💧 Water (H2O from Roots)"] --> D
    C["💨 Carbon Dioxide (CO2 from Air)"] --> D
    D --> E["🍬 Glucose (Plant Energy)"]
    D --> F["🫧 Pure Oxygen (O2 for Us)"]
    classDef sun fill:#FEF3C7,stroke:#D97706,stroke-width:2px,color:#78350F;
    classDef input fill:#DBEAFE,stroke:#2563EB,stroke-width:2px,color:#1E3A8A;
    classDef plant fill:#D1FAE5,stroke:#059669,stroke-width:2px,color:#064E3B;
    classDef product fill:#EDE9FE,stroke:#7C3AED,stroke-width:2px,color:#4C1D95;
    class A sun;
    class B,C input;
    class D plant;
    class E,F product;`,
        keyPoints: [
          '☀️ Sunlight provides radiant energy absorbed by green chlorophyll pigment.',
          '💧 Water from roots + 💨 CO2 from air combine inside chloroplasts.',
          '🍬 Plant makes Glucose for energy and donates fresh Oxygen to living creatures.'
        ]
      },

      indus_valley: {
        id: 'indus_valley',
        category: 'History & Civilization',
        title: 'Indus Valley: The World’s First Civil Planners',
        summary: 'How an ancient 4,500-year-old civilization built sophisticated brick cities, grid streets, and covered drainage.',
        readingTime: '3 min read',
        content: `More than four thousand five hundred years ago, long before modern machinery existed, people built the world’s most advanced planned cities along the banks of the mighty Indus River.

Unlike other ancient cities that grew in haphazard confusion, Harappa and Mohenjo-Daro were engineered with master mathematical precision. The architects laid out wide avenues in a strict north-to-south and east-to-west grid pattern, like the chessboard streets of modern New York.

Every home was built with baked clay bricks of standardized identical proportions. Houses had private bathrooms, courtyards, and vertical waste pipes that connected seamlessly to covered municipal drains running beneath the public streets.

Inspection holes with stone lids allowed municipal sanitation workers to clear blockages easily. The cities also featured the Great Bath, an enormous waterproof public pool sealed with natural bitumen asphalt.

These ancient engineers were not obsessed with building giant marble palaces or military monuments. Instead, they focused entirely on clean water, peaceful commerce, and public health.`,
        podcast: [
          {
            speaker: 'Aarav',
            avatar: '👦',
            text: 'Didi, kya 4500 saal pehle sach mein log modern apartments aur drainage system mein rehte the?'
          },
          {
            speaker: 'Riya',
            avatar: '👩‍🏫',
            text: 'Haan Aarav! Indus Valley Civilization ke Harappa aur Mohenjo-Daro shehar aaj ke kai modern cities se zyada organized the.'
          },
          {
            speaker: 'Aarav',
            avatar: '👦',
            text: 'Kaise? Unke paas na koi computers the, na JCB machines!'
          },
          {
            speaker: 'Riya',
            avatar: '👩‍🏫',
            text: 'Unhone grid planning use ki—jaise graph paper ya chess board hota hai na? Saari sadkein ek dusre ko 90 degree par kaat-ti thi taaki hawa naturally sadkon ko saaf kar sake.'
          },
          {
            speaker: 'Aarav',
            avatar: '👦',
            text: 'Aur gande paani ka kya hota tha? Tab to septic tanks nahi the.'
          },
          {
            speaker: 'Riya',
            avatar: '👩‍🏫',
            text: 'Har ghar ka bathroom ek underground naali se juda tha jiske upar pakki eentein dhaki hoti thi. Inspection manholes bhi the cleaning ke liye. Sabse badi baat: unka focus yuddh par nahi, hygiene aur public health par tha!'
          }
        ],
        mermaid: `graph TD
    A["🏛️ Indus Valley Town Plan"] --> B["♟️ Chessboard Grid Streets"]
    A --> C["🧱 Standardized Baked Bricks"]
    A --> D["🚰 Underground Covered Drainage"]
    A --> E["🏊 The Great Bath (Waterproof Pool)"]
    D --> F["🧹 Manholes for Sanitation Cleaners"]
    classDef main fill:#FEF3C7,stroke:#D97706,stroke-width:2px,color:#78350F;
    classDef sub fill:#DBEAFE,stroke:#2563EB,stroke-width:2px,color:#1E3A8A;
    class A main;
    class B,C,D,E,F sub;`,
        keyPoints: [
          '♟️ Grid Streets: Wide roads intersected at 90-degree right angles.',
          '🚰 Underground Drainage: Covered brick sewers kept cities hygienic and clean.',
          '🧱 Uniform Bricks: All buildings used precisely measured 4:2:1 ratio baked bricks.'
        ]
      },

      gravity_orbits: {
        id: 'gravity_orbits',
        category: 'Physics & Cosmos',
        title: 'Gravity & Orbits: The Cosmic Invisible Glue',
        summary: 'Why planets stay in eternal loops and why we never fly off into outer space.',
        readingTime: '3 min read',
        content: `Why do you land back on the ground whenever you jump into the air? Why does the Moon orbit Earth without drifting away into deep dark space?

The answer is gravity, the invisible pulling force that every object with mass exerts on everything else. The more mass an object has, the stronger its gravitational pull.

Because planet Earth is extraordinarily massive, its gravity pulls your feet, ocean water, and our atmosphere gently toward its center. When Sir Isaac Newton watched an apple tumble from a tree branch, he realized that the exact same force pulling the apple also loops the Moon around our globe.

Think of an orbit like an endless fall. The Moon is traveling sideways at tremendous speed while Earth’s gravity pulls it inward. This delicate balance between sideways velocity and downward gravitational tug curves its path into an unbroken circular loop.`,
        podcast: [
          {
            speaker: 'Aarav',
            avatar: '👦',
            text: 'Didi, agar Earth itni tezi se spin kar rahi hai, toh hum space mein ud kar bahar kyun nahi girte?'
          },
          {
            speaker: 'Riya',
            avatar: '👩‍🏫',
            text: 'Kyunki Earth ke paas ek invisible superpower magnet hai jiska naam hai Gravity! Har cheez jisme mass hota hai, woh doosri cheez ko apni taraf kheenchti hai.'
          },
          {
            speaker: 'Aarav',
            avatar: '👦',
            text: 'Toh Moon Earth ke upar gir kyun nahi jata jaise apple girta hai?'
          },
          {
            speaker: 'Riya',
            avatar: '👩‍🏫',
            text: 'Bahut zabardast sawal! Socho tum ek rassi par patthar baandh kar gol-gol ghuma rahe ho. Moon sideways bahut tez bhag raha hai, aur Earth use kheench rahi hai. Dono ke perfect balance ki wajah se Moon kabhi girta nahi, bas continuous orbit mein ghoomta rehta hai!'
          }
        ],
        mermaid: `graph TD
    A["🌍 Earth's Massive Core"] --> B["🧲 Inward Gravitational Pull"]
    C["🚀 Moon's Sideways Velocity"] --> D["⚖️ Dynamic Balance"]
    B --> D
    D --> E["🪐 Eternal Stable Orbit"]
    classDef center fill:#DBEAFE,stroke:#2563EB,stroke-width:2px,color:#1E3A8A;
    classDef pull fill:#EDE9FE,stroke:#7C3AED,stroke-width:2px,color:#4C1D95;
    classDef result fill:#D1FAE5,stroke:#059669,stroke-width:2px,color:#064E3B;
    class A,C center;
    class B pull;
    class D,E result;`,
        keyPoints: [
          '🌍 Mass attracts mass: Greater mass produces stronger gravitational pull.',
          '⚖️ Orbiting is a balance: Sideways speed perfectly matches gravitational downward fall.',
          '🛡️ Life protector: Earth’s gravity holds our atmosphere and air blankets safely in place.'
        ]
      },

      ohms_law: {
        id: 'ohms_law',
        category: 'Practical Physics & Electricity',
        title: "Ohm's Law: The Water Pipe Secret",
        summary: 'How Voltage pushes Electric Current through Resistance, explained through an everyday water pipe analogy.',
        readingTime: '3 min read',
        content: `Have you ever wondered how electricity flows through wires to turn on lamps, run fans, and charge your phone?

Think of electricity like water flowing through a garden pipe. Voltage is the water pressure pushing from an overhead tank. Current is the actual amount of water flowing past each second. Resistance is a narrow squeeze in the pipe that tries to slow the water down.

In 1827, German physicist Georg Ohm discovered that electric current is directly proportional to voltage and inversely proportional to resistance. This gives us the famous formula: Voltage = Current × Resistance, or V = I × R.

When you turn the volume dial on a music player or use a dimmer switch for bedroom lights, you are simply turning a variable resistor to safely control the amount of flowing current!`,
        podcast: [
          {
            speaker: 'Aarav',
            avatar: '👦',
            text: 'Didi, yeh Voltage aur Current mein difference kya hai? Log dono ko bijli hi bolte hain!'
          },
          {
            speaker: 'Riya',
            avatar: '👩‍🏫',
            text: 'Arre Aarav, sabse easy example paani ki pipe ka hai! Voltage matlab tanki ka paani ka pressure, jo dhakka maarta hai.'
          },
          {
            speaker: 'Aarav',
            avatar: '👦',
            text: 'Aur Current kya hai?'
          },
          {
            speaker: 'Riya',
            avatar: '👩‍🏫',
            text: 'Current hai pipe se nikalne wala actual paani ka flow rate! Zyada pressure (Voltage) hoga, toh zyada paani (Current) daudega.'
          },
          {
            speaker: 'Aarav',
            avatar: '👦',
            text: 'Aur agar pipe ke beech mein kankad ya narrow blockage ho?'
          },
          {
            speaker: 'Riya',
            avatar: '👩‍🏫',
            text: 'Wahi toh hai Resistance! Jo flow ko rokti hai. Isi relation ko hum Ohm\'s Law kehte hain: V = I × R!'
          }
        ],
        mermaid: `graph TD
    A["🔋 Voltage (Water Pressure Push)"] --> C["⚡ Electric Current (Flow Rate)"]
    B["🛑 Resistance (Pipe Friction Squeeze)"] --> C
    C --> D["💡 Useful Work (Light & Motor Output)"]
    classDef volt fill:#DBEAFE,stroke:#2563EB,stroke-width:2px,color:#1E3A8A;
    classDef res fill:#FEE2E2,stroke:#DC2626,stroke-width:2px,color:#991B1B;
    classDef flow fill:#FEF3C7,stroke:#D97706,stroke-width:2px,color:#78350F;
    classDef work fill:#D1FAE5,stroke:#059669,stroke-width:2px,color:#064E3B;
    class A volt;
    class B res;
    class C flow;
    class D work;`,
        keyPoints: [
          '💧 Water Pipe Analogy: Voltage is water pressure, Current is flow volume, Resistance is narrow friction.',
          '📐 The Ohm Formula: V = I × R connects electrical push, flow rate, and opposition.',
          '🎛️ Real-World Use: Volume dials and fan regulators work by adjusting internal resistance.'
        ]
      },

      ram_memory: {
        id: 'ram_memory',
        category: 'Computer Science & Technology',
        title: 'RAM: The Computer’s Fast Scratchpad',
        summary: 'How Random Access Memory acts as a superfast study desk where your computer runs active apps and games.',
        readingTime: '3 min read',
        content: `Have you ever wondered what happens inside your laptop or phone when you launch apps, open multiple browser tabs, or switch between games?

The secret hardware hero is RAM, which stands for Random Access Memory. Think of your computer like a busy study office. Your hard drive or SSD is like a huge library bookshelf in the corner. It safely stores all your files, photos, and apps for years, but walking over to pull a heavy book takes time.

RAM, on the other hand, is your active study desk right in front of you. When you open a program, the processor quickly pulls that file from the bookshelf and lays it wide open on your RAM desk so it can work at lightning speed.

Because RAM is electronic silicon memory, it can read and write data in mere nanoseconds. However, RAM is temporary or volatile memory. This means it only remembers information while electrical power is running. When you restart or turn off your computer, the RAM desk is wiped completely clean.

Modern computers use high-speed DDR memory sticks called DIMMs, or Dual Inline Memory Modules, that snap into slots on the motherboard. The more RAM capacity your system has—such as 8, 16, or 32 Gigabytes—the larger your study desk is, letting you multitask effortlessly without frustrating slowdowns!`,
        podcast: [
          {
            speaker: 'Aarav',
            avatar: '👦',
            text: 'Riya didi, naya phone ya laptop lete time sab bolte hain ki zyada RAM wala lo. Yeh RAM aakhir karta kya hai?'
          },
          {
            speaker: 'Riya',
            avatar: '👩‍🏫',
            text: 'Arre Aarav, sabse easy example humari study table ka hai! Maan lo tumhara SSD ya Hard Drive ek badi bookshelf hai jisme hazaron kitabein rakhi hain.'
          },
          {
            speaker: 'Aarav',
            avatar: '👦',
            text: 'Theek hai, bookshelf mein sab store rehta hai. Aur RAM?'
          },
          {
            speaker: 'Riya',
            avatar: '👩‍🏫',
            text: 'RAM hai tumhari working table! Jab tum padhai karte ho, toh sari kitabein bookshelf se nikal kar table par kholte ho taaki fatafat padh sako. Yehi kaam RAM karti hai active apps ke sath!'
          },
          {
            speaker: 'Aarav',
            avatar: '👦',
            text: 'Aur agar computer ka switch off ho jaye toh kya RAM mein data rehta hai?'
          },
          {
            speaker: 'Riya',
            avatar: '👩‍🏫',
            text: 'Nahi! RAM volatile memory hoti hai. Power off hote hi table bilkul saaf ho jati hai. Isiliye hum permanent kaam ko SSD ya Hard Drive mein save karte hain!'
          }
        ],
        mermaid: `graph TD
    A["🗄️ SSD / Hard Drive (Big Bookshelf)"] -->|"Load Active Program"| B["⚡ RAM (Fast Working Desk)"]
    B <-->|"Nanosecond Speed"| C["🧠 CPU Processor"]
    B -.->|"Power Off"| D["🧹 Cleared (Volatile Memory)"]
    classDef storage fill:#FEF3C7,stroke:#D97706,stroke-width:2px,color:#78350F;
    classDef ram fill:#D1FAE5,stroke:#059669,stroke-width:2px,color:#064E3B;
    classDef cpu fill:#DBEAFE,stroke:#2563EB,stroke-width:2px,color:#1E3A8A;
    classDef clear fill:#FEE2E2,stroke:#DC2626,stroke-width:2px,color:#991B1B;
    class A storage;
    class B ram;
    class C cpu;
    class D clear;`,
        keyPoints: [
          '⚡ High-Speed Desk: RAM (Random Access Memory) holds active apps so the CPU works instantly.',
          '🔌 Volatile Memory: Data in RAM vanishes immediately when power is turned off or restarted.',
          '📈 Multitasking Power: More RAM capacity (GB) allows running multiple heavy apps smoothly together.'
        ]
      }
    },

    // -------------------------------------------------------------
    // TAP-TO-HINGLISH VISUAL DICTIONARY
    // -------------------------------------------------------------
    dictionary: {
      photosynthesis: {
        word: 'Photosynthesis',
        syllables: 'Pho · to · syn · the · sis',
        phonetic: 'foh-toh-sin-thuh-sis',
        emoji: '🌿☀️',
        hinglish: 'Suraj ki dhoop, paani aur hawa ki madad se patton dwara apna mitha khana banane ka process.',
        simpleEnglish: 'The process green plants use to convert sunlight, water, and CO2 into food and oxygen.',
        exampleSentence: 'Photosynthesis keeps our atmosphere rich with breathable oxygen.'
      },
      chloroplast: {
        word: 'Chloroplast',
        syllables: 'Chlo · ro · plast',
        phonetic: 'klor-oh-plast',
        emoji: '🟢🔬',
        hinglish: 'Plant cell ke andar maujood choti kitchen jahan khana cook hota hai.',
        simpleEnglish: 'Microscopic green structures inside plant cells where food is manufactured.',
        exampleSentence: 'Chloroplasts absorb radiant light energy efficiently.'
      },
      chlorophyll: {
        word: 'Chlorophyll',
        syllables: 'Chlo · ro · phyll',
        phonetic: 'klor-oh-fil',
        emoji: '🍃🧪',
        hinglish: 'Patton mein paya jane wala natural hara rang (pigment) jo suraj ki roshni ko pakadta hai.',
        simpleEnglish: 'The green pigment in plants that traps sunlight energy.',
        exampleSentence: 'Without chlorophyll, a plant leaf cannot absorb sunlight.'
      },
      stomata: {
        word: 'Stomata',
        syllables: 'Sto · ma · ta',
        phonetic: 'stoh-mah-tuh',
        emoji: '🔬💨',
        hinglish: 'Patti ki neeche wali satah par bane chote-chote chhed jinse gas andar-bahar aati hai.',
        simpleEnglish: 'Tiny pores underneath leaves that breathe in carbon dioxide and release oxygen.',
        exampleSentence: 'Stomata open during daylight hours to take in CO2.'
      },
      glucose: {
        word: 'Glucose',
        syllables: 'Glu · cose',
        phonetic: 'gloo-kose',
        emoji: '🍯⚡',
        hinglish: 'Ek mitha sugary food jo plant banata hai taaki use badhne ki energy mile.',
        simpleEnglish: 'A simple sugar molecule that stores energy for plants and animals.',
        exampleSentence: 'Plants store extra glucose inside roots, fruits, and seeds.'
      },
      civilization: {
        word: 'Civilization',
        syllables: 'Civ · i · li · za · tion',
        phonetic: 'siv-ih-lih-zay-shun',
        emoji: '🏛️📜',
        hinglish: 'Ek aisi tarakki-yafta society jahan shehar, shasan-vyavastha, vigyan aur kala hoti hai.',
        simpleEnglish: 'An advanced stage of human society with cities, culture, and governance.',
        exampleSentence: 'The Indus civilization flourished over 4,500 years ago.'
      },
      drainage: {
        word: 'Drainage',
        syllables: 'Drain · age',
        phonetic: 'dray-nij',
        emoji: '🚰🌊',
        hinglish: 'Shehar ya gharon ke gande paani ko zameen ke neeche pipe se safe nikaalne ka system.',
        simpleEnglish: 'A network of pipes or canals that removes wastewater safely.',
        exampleSentence: 'Harappa had the first underground covered drainage in history.'
      },
      gravity: {
        word: 'Gravity',
        syllables: 'Grav · i · ty',
        phonetic: 'grav-ih-tee',
        emoji: '🍎🌍',
        hinglish: 'Kudrat ki invisible taakat jo sabhi cheezon ko zameen ki taraf khench kar rakhti hai.',
        simpleEnglish: 'The natural force that attracts any two objects with mass toward each other.',
        exampleSentence: 'Gravity keeps our oceans firmly anchored on Earth.'
      },
      orbit: {
        word: 'Orbit',
        syllables: 'Or · bit',
        phonetic: 'or-bit',
        emoji: '🪐🔄',
        hinglish: 'Space mein kisi ek planet ya moon ka doosre bado object ke ird-gird ghoomne ka rasta.',
        simpleEnglish: 'The curved path a celestial body follows around another object in space.',
        exampleSentence: 'The Moon completes one orbit around Earth every 27 days.'
      },
      mitochondria: {
        word: 'Mitochondria',
        syllables: 'Mi · to · chon · dria',
        phonetic: 'my-toh-kon-dree-uh',
        emoji: '⚡🔋',
        hinglish: 'Living cell ka powerhouse jo khane ko usable battery power (energy) mein badalta hai.',
        simpleEnglish: 'The powerhouse organelles within cells that generate biological energy.',
        exampleSentence: 'Muscles have thousands of mitochondria to support active movement.'
      },
      voltage: {
        word: 'Voltage',
        syllables: 'Volt · age',
        phonetic: 'vohl-tij',
        emoji: '🔋⚡',
        hinglish: 'Electrical pressure ya dhakka jo electrons ko wire ke andar aage daudne par majboor karta hai.',
        simpleEnglish: 'The electrical force or pressure that causes electrons to flow through a conductor.',
        exampleSentence: 'Higher voltage pushes more current through a circuit.'
      },
      current: {
        word: 'Current',
        syllables: 'Cur · rent',
        phonetic: 'kur-uhnt',
        emoji: '🌊⚡',
        hinglish: 'Wire ke andar se behne wale electrons ka actual flow rate, jaise pipe mein paani ka bahav.',
        simpleEnglish: 'The rate at which electric charge flows past a point in a circuit.',
        exampleSentence: 'Current is measured in amperes using an ammeter.'
      },
      resistance: {
        word: 'Resistance',
        syllables: 'Re · sis · tance',
        phonetic: 'rih-zis-tuhns',
        emoji: '🛑🧱',
        hinglish: 'Kisi wire ya device ki woh taakat jo electric current ke bahav ko rokti ya slow karti hai.',
        simpleEnglish: 'The opposition that a substance offers to the flow of electric current.',
        exampleSentence: 'Thin wires have higher electrical resistance than thick wires.'
      },
      electricity: {
        word: 'Electricity',
        syllables: 'E · lec · tric · i · ty',
        phonetic: 'ih-lek-tris-ih-tee',
        emoji: '⚡💡',
        hinglish: 'Electrons ke flow se paida hone wali energy jo bulbs jalati hai aur machines chalati hai.',
        simpleEnglish: 'A form of energy resulting from the movement of charged particles.',
        exampleSentence: 'Electricity powers modern computers, lights, and appliances.'
      },
      ram: {
        word: 'RAM',
        syllables: 'R · A · M (Random Access Memory)',
        phonetic: 'ram / ar-ay-em',
        emoji: '⚡💻',
        hinglish: 'Computer ki super-fast working table jahan active programs aur apps run hote hain.',
        simpleEnglish: 'High-speed electronic memory where the computer holds currently open apps and data.',
        exampleSentence: 'More RAM lets you run multiple heavy applications smoothly without lag.'
      },
      volatile: {
        word: 'Volatile',
        syllables: 'Vol · a · tile',
        phonetic: 'vol-uh-tl',
        emoji: '🔌💨',
        hinglish: 'Bijli ya power off hote hi data kho jaane wali temporary memory.',
        simpleEnglish: 'Memory that loses its stored information immediately when power is turned off.',
        exampleSentence: 'RAM is volatile memory, while an SSD keeps your files safe permanently.'
      },
      memory: {
        word: 'Memory',
        syllables: 'Mem · o · ry',
        phonetic: 'mem-er-ee',
        emoji: '🧠💾',
        hinglish: 'Data, files aur instructions ko store karne ka electronic storage space.',
        simpleEnglish: 'The physical device or space used to store information and data in a computing system.',
        exampleSentence: 'Both RAM and storage drives are essential types of computer memory.'
      },
      dimm: {
        word: 'DIMM',
        syllables: 'D · I · M · M (Dual In-line Memory Module)',
        phonetic: 'dim',
        emoji: '🟩🔌',
        hinglish: 'Motherboard ke slot mein lagne wali RAM ki electronic chip stick.',
        simpleEnglish: 'A circuit board containing RAM chips that plugs directly into a motherboard socket.',
        exampleSentence: 'We installed two 8GB DIMM modules on the computer motherboard.'
      }
    },

    // -------------------------------------------------------------
    // "TEACH THE AI" ORAL VIVA PROMPTS & MOCK EVALUATIONS
    // -------------------------------------------------------------
    vivaTopics: [
      {
        id: 'viva-photosynthesis',
        title: '🌱 Explain Photosynthesis to a 10-Year-Old',
        category: 'Science',
        prompt: 'Imagine you are explaining Photosynthesis to a curious younger kid. Focus on how a leaf acts like a kitchen and how sunlight acts as fuel! Hinglish or English are both welcome.',
        demoStudentSpeech: 'Photosynthesis ek aisi cooking process hai jisme patta ek mini kitchen ki tarah kaam karta hai. Usme green pigment chlorophyll hota hai jo suraj ki dhoop absorb karta hai. Zameen se paani aur hawa se carbon dioxide lekar woh glucose banata hai aur humare saans lene ke liye oxygen release karta hai.',
        evaluation: {
          score: 10,
          strengths: [
            'Superb use of the "mini-kitchen" analogy for the leaf.',
            'Correctly identified all three critical ingredients: sunlight, water, and carbon dioxide.',
            'Highlighted the vital byproduct (Oxygen) for living beings.'
          ],
          missingPiece: 'You could also mention "Stomata" as the microscopic breathing pores on the underside of the leaf!',
          audioFeedback: 'Shaabaash! Aapne concept ko bilkul crystal clear samjhaya. 10 mein se 10 marks for conceptual understanding!'
        }
      },
      {
        id: 'viva-indus',
        title: '🏛️ Harappan City Planning & Hygiene',
        category: 'History',
        prompt: 'Tell the AI why Harappan city planners were considered 4,000 years ahead of their time. Mention their roads or covered drains!',
        demoStudentSpeech: 'Indus Valley ke shehar jaise Harappa grid system par banaye gaye the, jaise chessboard hota hai. Sadkein 90 degree par milti thi aur har ghar ka bathroom underground covered nali se juda tha. Safai ke liye manholes bhi the.',
        evaluation: {
          score: 10,
          strengths: [
            'Brilliant spatial analogy comparing grid streets to a chessboard.',
            'Emphasized underground drainage and sanitation hygiene.',
            'Mentioned the 90-degree right angle streets layout.'
          ],
          missingPiece: 'Add a tiny mention of standardized baked clay bricks used across every house!',
          audioFeedback: 'Zabardast! Aapka history ka spatial visualization aur concept bohot strong hai.'
        }
      },
      {
        id: 'viva-gravity',
        title: '🌍 Gravity vs Why the Moon Doesn’t Crash',
        category: 'Physics',
        prompt: 'Explain why gravity keeps us on the ground, yet the Moon keeps orbiting without crashing into Earth.',
        demoStudentSpeech: 'Gravity ek invisible force hai jo mass ki wajah se hoti hai. Earth massive hai isliye hume kheenchti hai. Moon isliye nahi girta kyunki woh sideways bahut tez travel kar raha hai. Yeh speed aur inward pull ek stable circular orbit banate hain.',
        evaluation: {
          score: 9.5,
          strengths: [
            'Understood that gravity arises from mass.',
            'Clear mechanical intuition of orbital sideways momentum balancing inward gravity.'
          ],
          missingPiece: 'Think of the classic bowling ball on a rubber sheet analogy for Einstein’s curved spacetime!',
          audioFeedback: 'Outstanding! Physics ke difficult balance of forces ko aapne simple words mein express kiya.'
        }
      }
    ],

    // -------------------------------------------------------------
    // LATERAL THINKING & SPATIAL INGENUITY CHALLENGES
    // -------------------------------------------------------------
    lateralChallenges: [
      {
        id: 'monsoon-drain',
        title: '🍂 The Blocked School Courtyard Drain',
        scenario: 'Every monsoon, heavy rain floods a school playground because swirling dry leaves and twigs plug the ground drain mesh within 5 minutes. Teachers have to wade into knee-deep muddy water to poke the drain with sticks.',
        challenge: 'Without buying expensive electric pumps or hiring workers, design a clever mechanical passive fix using everyday objects (like plastic mesh, bicycle rims, or bamboo) so leaves never clog the water flow!',
        demoSolution: 'A raised inverted wire cone or 3D dome cage over the drain. Even if leaves pile up at the base, water continues flowing smoothly through the top and sides!',
        badgeAwarded: '3D Spatial Architect 🏆'
      },
      {
        id: 'desert-cooler',
        title: '💧 The Leaking Desert Cooler Eco-Shield',
        scenario: 'In North India summers, desert coolers splash water outside and waste gallons while water drips unevenly across dried grass pads.',
        challenge: 'Design a simple zero-electricity baffle or water collector using discarded plastic bottles that distributes water evenly with zero splatter.',
        demoSolution: 'Perforated horizontal PVC tube or recycled plastic bottles cut into interconnected troughs that drip micro-droplets evenly using gravity capillary action.',
        badgeAwarded: 'Jugaad Systems Innovator 🛠️'
      },
      {
        id: 'heavy-bag-climber',
        title: '🎒 The Heavy Backpack Staircase Glider',
        scenario: 'Students carry heavy school bags up 3 flights of narrow stairs every morning. Standard trolley wheels get stuck on step edges, forcing kids to awkwardly drag heavy loads.',
        challenge: 'Design a simple passive mechanical wheel or runner attachment using everyday materials so a bag glides smoothly over stair edges without heavy lifting!',
        demoSolution: 'A tri-star 3-wheel cluster or curved bamboo runners on the bag frame. When pulled, the wheels pivot over each stair lip sequentially with zero mechanical jam!',
        badgeAwarded: 'Mechanical Systems Genius ⚙️'
      }
    ],

    // -------------------------------------------------------------
    // MULTISENSORY SAND & GLOW LETTER TRACER DATA
    // -------------------------------------------------------------
    tracerLetters: {
      b: {
        letter: 'b',
        pair: 'd',
        sound: '/b/',
        word: 'bat',
        emoji: '🦇',
        color: '#2563EB',
        strokeRhyme: 'Line down from sky to grass, bounce up and loop around to the right for bat!',
        phoneticAudio: 'b... /b/... Bat! Remember: left hand thumb up is b (the head of the bed).',
        guideSteps: [
          '1. Start at the top sky line. Draw a tall straight line down to the grass line.',
          '2. Bounce back up without lifting your finger to the middle dotted line.',
          '3. Curve around to the right, touching the grass line to close your round belly loop!'
        ]
      },
      d: {
        letter: 'd',
        pair: 'b',
        sound: '/d/',
        word: 'door',
        emoji: '🚪',
        color: '#059669',
        strokeRhyme: 'Curve around first like letter c, then tall line down from sky to grass for door!',
        phoneticAudio: 'd... /d/... Door! Remember: right hand thumb up is d (the foot of the bed).',
        guideSteps: [
          '1. Start at the middle dotted line. Curve around to the left like a "c".',
          '2. Go straight all the way up to the top sky line.',
          '3. Draw straight down to the grass line with a gentle resting touch.'
        ]
      },
      p: {
        letter: 'p',
        pair: 'q',
        sound: '/p/',
        word: 'pan',
        emoji: '🍳',
        color: '#D97706',
        strokeRhyme: 'Dive down deep under the water, swim back up and loop around to the right for pan!',
        phoneticAudio: 'p... /p/... Pan! Remember: left hand thumb pointing down is p.',
        guideSteps: [
          '1. Start at the middle line. Draw straight down deep past the grass line into the water.',
          '2. Trace back up the same stem to the middle line.',
          '3. Curve around to the right and close neatly at the grass line.'
        ]
      },
      q: {
        letter: 'q',
        pair: 'p',
        sound: '/q/',
        word: 'queen',
        emoji: '👑',
        color: '#7C3AED',
        strokeRhyme: 'Curve around like a circle, dive down deep and flick your tail to the right for queen!',
        phoneticAudio: 'kw... /kw/... Queen! Remember: right hand thumb pointing down is q.',
        guideSteps: [
          '1. Start at the middle line. Curve around to the left to form a complete clean loop.',
          '2. Draw straight down deep into the water below the grass line.',
          '3. Give a sharp, stylish tail flick up to the right!'
        ]
      }
    },

    bedTrickGuide: {
      bd: {
        title: 'The "b - e - d" Bed Thumbs Trick',
        subtitle: 'Never confuse b and d again!',
        rule: 'Make two fists with thumbs up in front of your chest. Your left hand is b (the headboard). Your body is e (the mattress). Your right hand is d (the footboard). They spell b - e - d from left to right!',
        speech: 'Make two fists and put your thumbs up. Your left hand makes the letter b, like the head of a bed. Your right hand makes the letter d, like the foot of a bed. Together they spell b-e-d, bed! In English we read left to right, so b comes first, and d comes last.'
      },
      pq: {
        title: 'The "p - q" Thumbs Down Trick',
        subtitle: 'Master the descending twins p and q!',
        rule: 'Point both thumbs down in front of you. Your left hand thumb down forms p (loop on the right). Your right hand thumb down forms q (loop on the left, tail flick to the right)!',
        speech: 'Point both thumbs down. Left hand pointing down is p, with its belly facing right. Right hand pointing down is q, with its belly facing left and tail flicking right!'
      }
    },

    // -------------------------------------------------------------
    // PRE-CACHED SPEAK & SKETCH DEMO DATA
    // -------------------------------------------------------------
    demoSketchMasterpiece: {
      title: 'Smart Rooftop Rainwater & Solar Micro-Harvester',
      studentVoicePrompt: 'Yahan upar ek curved solar panel roof hai jo rainwater ko collect karke ek sand-gravel filter pipe mein bhejta hai. Solar battery se ek automatic 12V pump chalta hai jo filtered paani ko terrace kitchen garden mein bhejta hai.',
      generatedReport: `### Project Blueprint: Integrated Solar-Powered Rainwater Filtration System

#### 1. Executive Summary
This student-designed green architecture innovation integrates photovoltaic solar energy with passive rooftop rainwater harvesting. By combining angled solar panels as both energy generators and water catchment canopies, the system eliminates reliance on external municipal electricity while conserving thousands of liters of rainwater every monsoon.

#### 2. Functional Engineering Components
- **Catchment Surface:** Angled hydrophobic solar panels dual-functioning as water diverters.
- **Sediment Pre-Filter:** Multilayer chamber utilizing coarse sand, crushed charcoal, and gravel to filter physical contaminants before storage.
- **Solar DC Pumping Circuit:** 12-Volt submersible pump driven directly by stored solar battery reserves, automatically irrigating terrace vegetation.

#### 3. Environmental Impact
Reduces municipal water dependence by up to 45% during monsoon months while maintaining zero net carbon footprint.`,
      bulletSummary: [
        'Dual-purpose canopy: Solar capture + rainwater deflection in a single surface.',
        'Passive sand-charcoal filtration cleans water before entering reservoir.',
        'Zero grid reliance: 12V direct-current pump powered entirely by stored sunshine.'
      ],
      upgradeIdeas: [
        'Add a simple float switch so the pump automatically rests when the water tank reaches minimum threshold.',
        'Implement an Arduino moisture sensor in the garden soil to prevent overwatering on humid days.'
      ]
    }
  };

  // Expose globally
  window.DemoData = DEMO_DATA;

})(window);
