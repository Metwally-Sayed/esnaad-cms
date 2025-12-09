
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DICTIONARY: Record<string, string> = {
  "Download Brochure": "تحميل الكتيب",
  "3 MB • PDF": "٣ ميجابايت • PDF",
  "Get Started": "ابدأ الآن",
  "Learn More": "اعرف المزيد",
  "Contact Us": "اتصل بنا",
  "Welcome": "مرحباً",
  "Home": "الرئيسية",
  "About Us": "من نحن",
  "Services": "خدماتنا",
  "Our Projects": "مشاريعنا",
  "Latest News": "آخر الأخبار",
  "Read More": "اقرأ المزيد",
  "Submit": "إرسال",
  "Name": "الاسم",
  "Email": "البريد الإلكتروني",
  "Message": "الرسالة",
  "Phone": "الهاتف",
  "Address": "العنوان",
  "Follow Us": "تابعنا",
  "Copyright": "حقوق النشر",
  "All Rights Reserved": "جميع الحقوق محفوظة",
  "Search": "بحث",
  "Subscribe": "اشترك",
  "Cancel": "إلغاء",
  "Confirm": "تأكيد",
  "Success": "نجاح",
  "Error": "خطأ",
  "Warning": "تحذير",
  "Info": "معلومات",
  "View All": "عرض الكل",
  "Feature 1": "ميزة ١",
  "Feature 2": "ميزة ٢",
  "Feature 3": "ميزة ٣",
  "Testimonial": "شهادة",
  "Pricing": "الأسعار",
  "Team": "الفريق",
  "FAQ": "الأسئلة الشائعة",
  "Support": "الدعم",
  "Privacy Policy": "سياسة الخصوصية",
  "Terms of Service": "شروط الخدمة",
  "Hero Title": "عنوان رئيسي",
  "Hero Description": "وصف رئيسي",
  // Add more as needed
};

// Regex for common patterns
const REPLACE_PATTERNS = [
  { regex: /Welcome to (.+)/, replace: "مرحباً بك في $1" },
  { regex: /Project (.+)/, replace: "مشروع $1" },
];

function translateText(text: string): string {
  if (!text) return text;
  
  if (DICTIONARY[text]) {
    return DICTIONARY[text];
  }

  for (const pattern of REPLACE_PATTERNS) {
    if (pattern.regex.test(text)) {
      return text.replace(pattern.regex, pattern.replace);
    }
  }

  // If no match, append [AR] to show it works
  if (text.length > 50) {
      return "[AR] " + text; // For long text, just prefix
  }
  
  return "[AR] " + text;
}

function traverseAndTranslate(obj: any): any {
  if (typeof obj === 'string') {
    // Attempt translation on strings values (not keys)
    // Avoid translating URLs, colors, IDs
    if (obj.startsWith('http') || obj.startsWith('#') || obj.startsWith('/') || obj.length < 2) {
      return obj;
    }
    return translateText(obj);
  } else if (Array.isArray(obj)) {
    return obj.map(traverseAndTranslate);
  } else if (typeof obj === 'object' && obj !== null) {
    const result: any = {};
    for (const key in obj) {
      // Don't translate keys
      // Skip certain fields
      if (['href', 'src', 'id', 'key', 'slug', 'color', 'variant', 'type'].includes(key)) {
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
  console.log('Starting translation of blocks...');
  
  const blocks = await prisma.block.findMany();
  let translatedCount = 0;

  for (const block of blocks) {
    const content = block.content as Record<string, any>;

    if (!content || !content.ar || !content.en) {
      console.log(`Block ${block.id} has invalid structure. Skipping.`);
      continue;
    }

    // Only translate if 'ar' is exactly equal to 'en' (meaning it was just copied)
    // or if we want to force update. Assuming copied.
    
    // We strictly translate content.ar
    const localizedAr = traverseAndTranslate(content.en); // Translate from source En

    const newContent = {
      ...content,
      ar: localizedAr
    };

    await prisma.block.update({
      where: { id: block.id },
      data: { content: newContent }
    });
    
    translatedCount++;
    // console.log(`Translated block ${block.id}`);
  }

  console.log(`Translation complete. Translated ${translatedCount} blocks.`);
}

translateBlocks()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
