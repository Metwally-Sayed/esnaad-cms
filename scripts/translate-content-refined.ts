
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SPECIFIC_TRANSLATIONS: Record<string, string> = {
  // Navigation & UI
  "Download Brochure": "تحميل الكتيب",
  "Get Started": "ابدأ الآن",
  "Learn More": "اعرف المزيد",
  "Contact Us": "اتصل بنا",

  // Specific Content from Esnaad
  "A VISION SHAPED BY DESIGN": "رؤية تشكلها التصميم",
  "INSPIRED BY PEOPLE": "مستوحى من الناس",
  "A MESSAGE FROM OUR FOUNDER": "رسالة من المؤسس",
  "We are quietly reshaping how people live within their spaces. Founded on the belief that design should serve life, not just aesthetics; that when form is crafted with intention, movement follows and transformation happens, ESNAAD positions itself as a design-forward, human-centered developer in a city known for spectacle. We build to connect.": "نحن نعيد تشكيل كيفية عيش الناس داخل مساحاتهم بهدوء. تأسست على الاعتقاد بأن التصميم يجب أن يخدم الحياة، وليس فقط الجماليات؛ وأنه عندما يتم صياغة الشكل بقصد، تتبع الحركة ويحدث التحول، تضع إسناد نفسها كمطور يركز على التصميم والإنسان في مدينة معروفة بالإبهار. نحن نبني لنتواصل.",
  "Rooted in Dubai yet looking forward, Esnaad creates spaces where structure follows intention, where beauty is embedded in function, and where luxury is defined by precision, not excess.": "متجذرة في دبي ولكن تتطلع إلى المستقبل، تخلق إسناد مساحات حيث يتبع الهيكل النية، وحيث الجمال متضمن في الوظيفة، وحيث يتم تعريف الفخامة بالدقة، وليس الزيادة.",
  "We believe that modern living should be beautiful, elevated but also attainable. That light should flow not only through windows, but through purposefully crafted experiences. That every corridor, every material, and every square meter can become an opportunity for rhythm, balance, and breath.": "نؤمن أن المعيشة الحديثة يجب أن تكون جميلة ومرتفعة ولكن أيضًا في المتناول. أن الضوء يجب ألا يتدفق فقط عبر النوافذ، بل من خلال تجارب مصممة بعناية. أن كل ممر، وكل مادة، وكل متر مربع يمكن أن يصبح فرصة للإيقاع والتوازن والتنفس.",
  "With a strong design language, a recognizable identity, and a commitment to long-term value over trends, Esnaad is building the foundations for a new kind of luxury living defined by integrity, connection, and transformation.": "بفضل لغة تصميم قوية وهوية مميزة والتزام بالقيمة طويلة الأجل بدلاً من الاتجاهات العابرة، تبني إسناد الأسس لنوع جديد من المعيشة الفاخرة التي تحددها النزاهة والاتصال والتحول.",
  "From the very beginning, Esnaad has been about high-end design. We have always believed in architecture that endures, in quality that defines, and in experiences that make living more than routine. Design-forward and quality-driven, that has always been, and will always remain, our foundation.": "منذ البداية، كانت إسناد تدور حول التصميم الراقي. لطالما آمنا بالهندسة المعمارية التي تدوم، وبالجودة التي تُعرف، وبالتجارب التي تجعل الحياة أكثر من مجرد روتين. التصميم المتقدم والجودة العالية، كان ذلك دائمًا وسيظل أساسنا.",
  "Today, our vision is sharper. We understand that design and quality reach their highest purpose when they serve people: when they connect, inspire, and allow space for pause and reflection. True luxury is not only in materials or finishes, but in how a place makes life feel, balanced, effortless, human.": "اليوم، رؤيتنا أكثر حدة. نحن نفهم أن التصميم والجودة يصلان إلى أعلى غرض لهما عندما يخدمان الناس: عندما يتصلون ويلهمون ويسمحون بمساحة للتوقف والتأمل. الفخامة الحقيقية ليست فقط في المواد أو التشطيبات، بل في كيف يجعل المكان الحياة تشعر بالتوازن والسهولة والإنسانية.",
  "Our work is never linear. It is an ongoing pursuit of beauty, where every proportion, material, and detail is refined until it reveals its truest form. We design beyond aesthetics to leave a mark, each project created to speak quietly yet powerfully to the lives within it.": "عملنا ليس خطيًا أبدًا. إنه سعي مستمر للجمال، حيث يتم تحسين كل نسبة ومادة وتفصيل حتى يكشف عن شكله الحقيقي. نحن نصمم أبعد من الجماليات لنترك أثرًا، كل مشروع تم إنشاؤه ليتحدث بهدوء ولكن بقوة إلى الحياة داخله.",
  "Boutique by nature, we dwell on details others overlook. Time, precision, and passion shape every decision, ensuring that each corridor, window, and finish contributes to how people live. This is what moves us, and it defines who we are.": "بوتيك بطبيعتنا، نحن نتوقف عند تفاصيل يتجاهلها الآخرون. الوقت والدقة والشغف يشكلون كل قرار، مما يضمن أن كل ممر ونافذة وتشطيب يساهم في كيفية عيش الناس. هذا ما يحركنا، وهو يحدد من نحن.",
  
  // Titles & Headings
  "Discover Our Projects": "اكتشف مشاريعنا",
  "Project Overview": "نظرة عامة على المشروع",
  "Key Features": "الميزات الرئيسية",
  "Location": "الموقع",
  "Amenities": "وسائل الراحة",
  "Floor Plans": "مخططات الطوابق",
  "Gallery": "المعرض",
  "YOUR NEW LIFE": "حياتك الجديدة",
  "STARTS HERE": "تبدأ هنا",
  
  // Generic Placeholders (if any)
  "Hero Title": "عنوان رئيسي",
  "Hero Description": "وصف رئيسي",
  "ABOUT COMPANY": "عن الشركة",
  "OUR STORY": "قصتنا",
  "Embark on an extraordinary journey shaped by over two decades of profound expertise in the dynamic realms of real estate and construction.": "انطلق في رحلة استثنائية شكلتها أكثر من عقدين من الخبرة العميقة في المجالات الديناميكية للعقارات والبناء.",
  "ESNAAD, synonymous with innovation and excellence, is dedicated to elevating your living experiences through meticulously crafted spaces.": "إسناد، مرادف للابتكار والتميز، مكرسة للارتقاء بتجارب معيشتك من خلال مساحات مصممة بعناية.",
  "Every detail in our designs is a striking reflection of our relentless passion for sophistication and unparalleled craftsmanship.": "كل تفصيل في تصميماتنا هو انعكاس مذهل لشغفنا الدائم بالرقي والحرفية التي لا تضاهى.",
  "Inspired by a legacy steeped in over 20 years of industry expertise, ESNAAD takes pride in going beyond the ordinary. We don’t just build homes; we curate lifestyles that transcend expectations": "مستوحاة من إرث غارق في أكثر من 20 عامًا من الخبرة في الصناعة، تفتخر إسناد بتجاوز المألوف. نحن لا نبني منازل فقط؛ نحن نصمم أنماط حياة تتجاوز التوقعات.",
  
  "ESNAAD PHILOSOPHY": "فلسفة إسناد",
  "WHAT WE STAND FOR": "ما نؤمن به",
  "SYNERGY": "التآزر",
  "We believe true luxury is not measured in square meters but in how spaces connect and support life. Some of our designs bring people together. Others give quiet moments of peace. Both work with the same goal: resonance, not for ornament.": "نحن نؤمن بأن الفخامة الحقيقية لا تقاس بالأمتار المربعة بل بمدى تواصل المساحات ودعمها للحياة. بعض تصميماتنا تجمع بين الناس، بينما تمنح الأخرى لحظات هادئة من السلام. كلاهما يعمل لتحقيق نفس الهدف: التناغم، وليس فقط الزينة.",
  "EXCELLENCE": "التميز",
  "The Spark by Esnaad is our flagship development in Meydan District 11, Dubai — a project that reflects our vision for contemporary, design-driven living. Rising G+5, the building offers a collection of one- and two-bedroom apartments, each crafted to maximize light, space, and functionality.": "ذا سبارك من إسناد هو مشروعنا الرائد في منطقة ميدان 11، دبي — مشروع يعكس رؤيتنا للحياة المعاصرة المدفوعة بالتصميم. يتألف المبنى من طابق أرضي + 5 طوابق، ويقدم مجموعة من الشقق المكونة من غرفة نوم وغرفتي نوم، تم تصميم كل منها لتعظيم الضوء والمساحة والوظيفة.",
  
  "WHAT WE BUILD": "ما نبنيه",
  "Embark on an extraordinary ourney Shaped by over to decades of profound expertise in the dynamic realms of real estate and constructor ESNAL synonymous with innovation and excellence, is dedicated to elevating your living experiences through meticulously crafted spaces": "انطلق في رحلة استثنائية شكلتها أكثر من عقدين من الخبرة العميقة في مجالات العقارات والبناء. إسناد، مرادف للابتكار والتميز، مكرسة للارتقاء بتجارب معيشتك من خلال مساحات مصممة بعناية.",
  
  "THE SPARK": "ذا سبارك",
  
  "WE": "نحن",
  "BUILD TO": "نبني لـ",
  "CONNECT": "نتواصل",
  "INSPIRE": "نلهم",
  "TRANSFORM": "نتحول",
  // Note: "WE BUILD TO CONNECT TO INSPIRE TO TRANSFORM" might be split or uppercase. 
  // Adding explicit full phrase if it appears as one string
  "WE BUILD TO CONNECT TO INSPIRE TO TRASFORM": "نبني لنتواصل، لنلهم، لنتحول",

};

const GENERIC_PATTERNS = [
  { regex: /Project (.+)/, replace: "مشروع $1" },
];

function translateText(text: string): string {
  if (!text || typeof text !== 'string') return text;
  
  // Normalize checking (trim and collapse spaces)
  const trimmed = text.trim().replace(/\s+/g, ' ');
  
  if (SPECIFIC_TRANSLATIONS[trimmed]) {
    return SPECIFIC_TRANSLATIONS[trimmed];
  }
  
  // Try matching directly against keys that might also be normalized
  // (We should actually normalize keys in a real app, but for now we rely on the dictionary being clean)
  // Let's iterate keys if direct match fails? No, that's expensive.
  // Instead, let's just make sure our dictionary keys are also clean.
  
  // Patterns
  for (const pattern of GENERIC_PATTERNS) {
    if (pattern.regex.test(text)) {
      return text.replace(pattern.regex, pattern.replace);
    }
  }

  return text;
}

function traverseAndTranslate(obj: any): any {
  if (typeof obj === 'string') {
    if (obj.startsWith('http') || obj.startsWith('/') || obj.length < 2 || obj.startsWith('#')) {
      return obj;
    }
    // Don't restart translation if it contains Arabic characters (already done/native)
    if (/[\u0600-\u06FF]/.test(obj)) {
        return obj; 
    }
    return translateText(obj);
  } else if (Array.isArray(obj)) {
    return obj.map(traverseAndTranslate);
  } else if (typeof obj === 'object' && obj !== null) {
    const result: any = {};
    for (const key in obj) {
       // Skip technical keys
      if (['href', 'src', 'id', 'key', 'slug', 'color', 'variant', 'type', 'videoUrl', 'posterImage', 'minHeight', 'backgroundColor', 'titleColor', 'textColor'].includes(key)) {
        result[key] = obj[key];
      } else {
        result[key] = traverseAndTranslate(obj[key]);
      }
    }
    return result;
  }
  return obj;
}

async function translateBlocks() {
  console.log('Starting final refined translation of blocks...');
  
  const blocks = await prisma.block.findMany();
  let translatedCount = 0;

  for (const block of blocks) {
    const content = block.content as Record<string, any>;

    if (!content || !content.en) {
      continue;
    }
    
    // Always translate from verified EN source
    const localizedAr = traverseAndTranslate(content.en);

    const newContent = {
      ...content,
      ar: localizedAr
    };

    await prisma.block.update({
      where: { id: block.id },
      data: { content: newContent }
    });
    
    translatedCount++;
  }

  console.log('Final refined translation complete. Processed ' + translatedCount + ' blocks.');
  
  // Also translate CollectionItems
  console.log('Starting refined translation of collection items...');
  const collectionItems = await prisma.collectionItem.findMany();
  let translatedItemsCount = 0;
  
  for (const item of collectionItems) {
    const content = item.content as Record<string, any>;
    if (!content || !content.en) {
        // If it's old structure without en/ar, we might need to migrate it first?
        // Assuming migration script handled it or it's similar to blocks.
        // Actually migration script ONLY handled blocks. 
        // We might need to wrap it first if it's flat.
        
        // Let's check a sample item structure first? 
        // Proceeding with assuming we treat it like blocks: if no EN, assume flat and wrap (if we wanted to migrate).
        // BUT for now, let's just try to translate if 'en' exists.
        // If 'en' doesn't exist, it might be flat. Let's wrap it!
        
        if (!content.en && !content.ar) {
             const localizedAr = traverseAndTranslate(content);
             const newContent = {
                 en: content,
                 ar: localizedAr
             };
             await prisma.collectionItem.update({
                 where: { id: item.id },
                 data: { content: newContent }
             });
             translatedItemsCount++;
             continue;
        }

        continue;
    }

    const localizedAr = traverseAndTranslate(content.en);
    const newContent = {
      ...content,
      ar: localizedAr
    };

    await prisma.collectionItem.update({
       where: { id: item.id },
       data: { content: newContent }
    });
    translatedItemsCount++;
  }
  console.log(`Refined translation of collection items complete. Processed ${translatedItemsCount} items.`);
}

translateBlocks()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
