// Bilingual page content for the public website.
// Every value is { ur: '...', en: '...' } unless it is language-neutral.

export const instituteName = {
  ur: 'جامعہ اسلامیہ لاڑکانہ',
  en: 'Jamia Islamia Larkana',
}

export const instituteFullName = {
  ur: 'جامعہ اسلامائی اشاعت القرآن والحدیث',
  en: 'Jamia Islamai Ishat ul Quarn Wal Hadith',
}

export const founderName = {
  ur: 'شہید ڈاکٹر خالد محمود سومرو',
  en: 'Shaheed Dr. Khalid Mahmood Soomro',
}

// ─── Home ──────────────────────────────────────────────────────────────────

export const home = {
  heroTitle: {
    ur: 'جامعہ اسلامیہ لاڑکانہ',
    en: 'Jamia Islamia Larkana',
  },
  heroSubtitle: {
    ur: 'قرآن و حدیث کی روشنی میں علم، تربیت اور خدمت',
    en: 'Learning, Character, and Service in the Light of Quran and Hadith',
  },
  heroBody: {
    ur: 'جامعہ اسلامائی اشاعت القرآن والحدیث ایک ایسا ادارہ ہے جو دینی تعلیم، اخلاقی تربیت، علمی سنجیدگی، اور اسلامی خدمت کے جذبے کو ایک جامع اور باوقار ماحول میں آگے بڑھاتا ہے۔',
    en: 'Jamia Islamai Ishat ul Quarn Wal Hadith is envisioned as a place of sacred learning, disciplined character, and institutional service, rooted in the transmission of Quran and Hadith.',
  },
  founderHeading: {
    ur: 'بانی جامعہ',
    en: 'Founder of the Institute',
  },
  founderBody: {
    ur: 'جامعہ اسلامیہ لاڑکانہ کی شناخت اس کے علمی نصب العین، دینی خدمت، اور اجتماعی بصیرت سے وابستہ ہے۔ اس فکری اور روحانی سمت میں شہید ڈاکٹر خالد محمود سومرو کا کردار مرکزی حیثیت رکھتا ہے۔',
    en: 'The identity of Jamia Islamia Larkana is closely tied to scholarship, public service, and religious leadership. Shaheed Dr. Khalid Mahmood Soomro stands as the central guiding figure whose legacy gives the institution its moral and intellectual direction.',
  },
  educationOverview: {
    ur: 'جامعہ کا نظامِ تعلیم دینی علوم، قرآنی تعلیم، فقہی بصیرت، اور تربیتی نظم پر قائم ہے۔',
    en: 'The educational system of the Jamia is structured around Quranic learning, Islamic sciences, jurisprudential understanding, and disciplined training.',
  },
  deptsOverview: {
    ur: 'جامعہ کے انتظامی اور خدماتی شعبے اس کے داخلی نظم اور تعلیمی ماحول کے استحکام میں بنیادی کردار ادا کرتے ہیں۔',
    en: "The Jamia's departments and offices support its internal order, student welfare, educational structure, and institutional continuity.",
  },
  portalCtaHeading: {
    ur: 'ادارہ جاتی پورٹل',
    en: 'Institutional Portal',
  },
  portalCtaBody: {
    ur: 'طلبہ، اساتذہ، اور والدین کے لیے محفوظ رسائی',
    en: 'Secure access for students, teachers, and parents',
  },
}

// ─── Educational System ────────────────────────────────────────────────────

export const educationalSystem = {
  title: { ur: 'نظامِ تعلیم', en: 'Educational System' },
  overview: {
    ur: 'جامعہ کا نظامِ تعلیم دینی علوم، قرآنی تعلیم، فقہی بصیرت، اور تربیتی نظم پر قائم ہے۔ مختلف درجات اور تخصصات کے ذریعے طلبہ کو مرحلہ وار علمی پختگی، فکری رہنمائی، اور عملی ذمہ داری کے لیے تیار کیا جاتا ہے۔',
    en: 'The educational system of the Jamia is structured around Quranic learning, Islamic sciences, jurisprudential understanding, and disciplined training. Through graded stages and specialized tracks, students are prepared for intellectual growth, religious service, and practical responsibility.',
  },
}

export const educationSubpages = {
  curriculum: {
    slug: 'nisab-e-taleem',
    title: { ur: 'نصابِ تعلیم', en: 'Curriculum' },
    summary: {
      ur: 'نصابِ تعلیم کو مرحلہ وار اس انداز میں ترتیب دیا جاتا ہے کہ طالب علم بنیادی دینی مہارتوں سے آغاز کرے اور تدریج کے ساتھ اعلیٰ علمی درجات تک پہنچے۔ اس میں حفظ، قراءت، عربی، فقہ، حدیث، تفسیر، اور متعلقہ علوم کے لیے مضبوط بنیاد فراہم کی جاتی ہے۔',
      en: 'The curriculum is structured as a path that begins with foundational religious literacy and develops gradually toward advanced Islamic scholarship, with strong grounding in Quran, Arabic, fiqh, hadith, tafsir, and related disciplines.',
    },
    stages: [
      { label: { ur: 'ابتدائیہ', en: 'Primary Stage' }, body: { ur: 'ابتدائی دینی تعلیم، ناظرہ، بنیادی دعاؤں، اور ابتدائی تربیت', en: 'Early religious formation, Nazra, daily duas, and moral discipline' } },
      { label: { ur: 'متوسطہ', en: 'Middle Stage' }, body: { ur: 'عربی و دینی مضامین کا ابتدائی تعارف اور علمی بنیاد کی مضبوطی', en: 'Introductory Arabic and core religious subjects, strengthening the academic foundation' } },
      { label: { ur: 'عامہ', en: 'Secondary Stage' }, body: { ur: 'درسِ نظامی کے باقاعدہ تعلیمی مرحلے میں داخلہ', en: 'Formal transition into the core study track of Dars-e-Nizami' } },
      { label: { ur: 'خاصہ', en: 'Intermediate Stage' }, body: { ur: 'فقہ، عربی، اصول، اور دیگر مرکزی علوم میں گہرائی', en: 'Deeper work in fiqh, Arabic, principles of jurisprudence, and related disciplines' } },
      { label: { ur: 'عالیہ', en: 'Graduation Stage' }, body: { ur: 'اعلیٰ درجے کی علمی تیاری اور تخصص کے لیے بنیاد', en: 'Advanced scholarly preparation and foundation for specialization' } },
      { label: { ur: 'عالمیہ', en: 'Post-Graduation Stage' }, body: { ur: 'حدیث، فقہ، اور اعلیٰ دینی تحقیق کے مرحلے کی تکمیل', en: 'Completion of higher studies in hadith, fiqh, and advanced Islamic research' } },
    ],
  },
  ifta: {
    slug: 'takhassus-fil-ifta',
    title: { ur: 'تخصص فی الافتاء', en: 'Specialization in Ifta' },
    summary: {
      ur: 'یہ شعبہ ایسے فضلاء کی تربیت کے لیے ہے جو فقہی تحقیق، استنباط، اور عوام کی شرعی رہنمائی کی ذمہ داری سنبھال سکیں۔ یہاں طلبہ کو فتاویٰ نویسی، جدید مسائل کے فقہی مطالعہ، اور تحقیقی طرزِ فکر کی مشق کرائی جاتی ہے۔',
      en: 'This specialization prepares advanced graduates for juristic research, legal reasoning, and responsible religious guidance. Training covers fatwa writing, contemporary fiqh issues, and disciplined legal analysis.',
    },
  },
  dawah: {
    slug: 'takhassus-fil-dawah',
    title: { ur: 'تخصص فی الدعوۃ و الارشاد', en: 'Specialization in Dawah & Guidance' },
    summary: {
      ur: 'یہ شعبہ دعوت، اصلاح، خطابت، اور اجتماعی رہنمائی کے لیے ایسی تیاری فراہم کرتا ہے جس سے طالب علم دین کی مؤثر ترجمانی اور معاشرتی خدمت انجام دے سکے۔',
      en: 'This specialization provides training in preaching, community guidance, religious communication, and practical reform, enabling students to serve society with clarity and wisdom.',
    },
  },
  nazraHifz: {
    slug: 'nazra-wa-tahfiz',
    title: { ur: 'ناظرہ و تحفیظ القرآن الکریم', en: 'Nazra & Quran Memorization' },
    summary: {
      ur: 'جامعہ میں قرآن مجید ناظرہ، تجوید، اور حفظ کے لیے منظم تعلیم دی جاتی ہے تاکہ طلبہ درست تلاوت، حسنِ اداء، اور حفظِ قرآن کی مضبوط بنیاد حاصل کریں۔',
      en: 'The Jamia provides structured learning in correct recitation, tajweed, and memorization of the Quran, with emphasis on disciplined daily practice and a firm foundation in Quranic study.',
    },
  },
  darseNizamiBoys: {
    slug: 'dars-e-nizami-banin',
    title: { ur: 'درس نظامی بنین', en: 'Dars-e-Nizami for Boys' },
    summary: {
      ur: 'درسِ نظامی بنین ایک مرحلہ وار آٹھ سالہ علمی ترتیب ہے جس میں عامہ، خاصہ، عالیہ، اور عالمیہ کے درجات کے ذریعے عربی و دینی علوم میں پختگی حاصل کی جاتی ہے۔',
      en: 'Dars-e-Nizami for boys is a multi-stage scholarly path moving through Secondary, Intermediate, Graduation, and Post-Graduation stages in the traditional Islamic sciences, spanning approximately eight years.',
    },
  },
  girlsMadrasa: {
    slug: 'madrasa-tul-banat',
    title: { ur: 'مدرسۃ البنات', en: "Girls' Madrasa" },
    summary: {
      ur: 'مدرسۃ البنات خواتین کی دینی تعلیم، فکری تربیت، اور علمی رشد کے ایک باوقار شعبہ کے طور پر ہے جہاں تفسیر، حدیث، فقہ، عربی، اور اخلاقی تربیت کا اہتمام ہو۔',
      en: "The Girls' Madrasa is a dedicated wing for female religious education, offering serious study of tafsir, hadith, fiqh, Arabic, and character formation in an appropriate academic environment.",
    },
  },
  religiousStudiesBoys: {
    slug: 'dirasaat-e-diniya-banin',
    title: { ur: 'دراساتِ دینیہ بنین', en: 'Religious Studies for Boys' },
    summary: {
      ur: 'یہ شعبہ ایسے طلبہ کے لیے ہے جو مکمل درسِ نظامی کے بجائے منتخب دینی مضامین اور فکری تربیت کے ساتھ ایک منظم تعلیمی راستہ اختیار کریں۔',
      en: 'This stream offers a structured religious studies path for students seeking organized religious education and intellectual formation without following the full advanced Dars-e-Nizami track.',
    },
  },
  hadithEncyclopedia: {
    slug: 'mawsuat-al-hadith',
    title: { ur: 'موسوعۃ الحدیث', en: 'Hadith Encyclopedia' },
    summary: {
      ur: 'یہ شعبہ علومِ حدیث، حدیثی ذخیرے کی خدمت، اور علمی ترتیب و تحقیق سے وابستہ ایک خاص علمی منصوبہ ہے۔',
      en: 'A specialized scholarly project connected to the study, documentation, organization, and research-oriented service of the hadith tradition.',
    },
  },
  darulIfta: {
    slug: 'darul-ifta',
    title: { ur: 'دارالافتاء', en: 'Darul Ifta' },
    summary: {
      ur: 'دارالافتاء عوام کی شرعی رہنمائی، فقہی سوالات کے جوابات، اور تحقیقِ مسائل کا ایک معتبر شعبہ ہے۔',
      en: 'Darul Ifta is a trusted department for religious legal guidance, responsible answers to questions, and research into contemporary issues in the light of Islamic law.',
    },
  },
}

// ─── Departments ───────────────────────────────────────────────────────────

export const departments = {
  title: { ur: 'شعبہ جات و دفاتر', en: 'Departments & Offices' },
  overview: {
    ur: 'جامعہ کے انتظامی اور خدماتی شعبے اس کے داخلی نظم، طلبہ کی سہولت، اور تعلیمی ماحول کے استحکام میں بنیادی کردار ادا کرتے ہیں۔',
    en: 'The departments and offices of the Jamia support its internal order, student welfare, educational structure, and institutional continuity.',
  },
}

export const departmentSubpages = {
  adminOffice: {
    slug: 'daftar-e-ihtimam',
    title: { ur: 'دفترِ اہتمام', en: 'Administration Office' },
    summary: {
      ur: 'دفترِ اہتمام جامعہ کے مرکزی انتظامی نقطہ کے طور پر کام کرتا ہے۔ یہی شعبہ عمومی نظم و نسق، اہم فیصلوں کے نفاذ، اندرونی نگرانی، اور بیرونی تعلقات کی بنیادی ذمہ داری سنبھالتا ہے۔',
      en: 'The Administration Office is the central administrative hub of the institution, overseeing governance, implementation of key decisions, internal coordination, and official institutional relations.',
    },
  },
  academicOffice: {
    slug: 'daftar-e-taleemat',
    title: { ur: 'دفتر تعلیمات', en: 'Academic Office' },
    summary: {
      ur: 'دفترِ تعلیمات تمام تعلیمی شعبوں کی نگرانی، تقسیمِ اسباق، امتحانات، داخلہ امور، حاضری، اسناد، اور طلبہ کے تعلیمی ریکارڈ کی حفاظت کا ذمہ دار ہے۔',
      en: 'The Academic Office oversees educational supervision, class schedules, examinations, admissions, attendance records, certificates, and student academic files.',
    },
  },
  publications: {
    slug: 'darul-tasnif',
    title: { ur: 'دارالتصنیف', en: 'Publications Department' },
    summary: {
      ur: 'دارالتصنیف علمی، تحقیقی، ادبی، اور دینی مواد کی تیاری اور اشاعت کا شعبہ ہے۔',
      en: 'A scholarly unit dedicated to producing and publishing religious, research-based, literary, and educational material.',
    },
  },
  bookshop: {
    slug: 'maktaba-jamia',
    title: { ur: 'مکتبہ جامعہ اسلامیہ', en: 'Jamia Bookshop' },
    summary: {
      ur: 'مکتبہ جامعہ اسلامیہ درسی، دینی، اور تحقیقی کتب کی فراہمی کا ایک خدمت گزار ادارہ ہے۔',
      en: 'A service-oriented outlet for religious texts, academic books, and study material connected to the institute\'s mission.',
    },
  },
  library: {
    slug: 'kutub-khana',
    title: { ur: 'کتب خانہ', en: 'Library' },
    summary: {
      ur: 'کتب خانہ طلبہ اور اساتذہ کے مطالعہ، تحقیق، اور علمی استفادہ کے لیے ایک بنیادی سہولت ہے۔',
      en: 'A core academic resource supporting reading, study, and research for students and teachers.',
    },
  },
  accounts: {
    slug: 'shoba-hisabat',
    title: { ur: 'شعبہ حسابات', en: 'Accounts Department' },
    summary: {
      ur: 'شعبہ حسابات مالی نظم، حسابی شفافیت، ادارہ جاتی اخراجات، اور تعاون و عطیات کے انتظام کا ذمہ دار ہے۔',
      en: 'Responsible for financial management, accounting transparency, institutional expenditure, and support-related financial coordination.',
    },
  },
  hostel: {
    slug: 'darul-iqama',
    title: { ur: 'دارالاقامہ', en: 'Hostel & Residence' },
    summary: {
      ur: 'دارالاقامہ طلبہ کی رہائش، نظم، صفائی، سہولت، اور علمی یکسوئی کے لیے ایک منظم ماحول فراہم کرتا ہے۔',
      en: 'A structured residential environment supporting student discipline, comfort, supervision, cleanliness, and academic concentration.',
    },
  },
  mosque: {
    slug: 'jamia-masjid',
    title: { ur: 'جامعہ اسلامیہ مسجد', en: 'Jamia Mosque' },
    summary: {
      ur: 'جامعہ کی مسجد عبادت، روحانی تربیت، دروس، اور اجتماعی دینی ماحول کا مرکز ہے۔',
      en: 'The spiritual center of the campus, supporting worship, gatherings, lessons, and a shared religious atmosphere.',
    },
  },
  reception: {
    slug: 'istiqbaliya',
    title: { ur: 'استقبالیہ', en: 'Reception' },
    summary: {
      ur: 'استقبالیہ زائرین، مہمانوں، اور رابطہ کاروں کے لیے ابتدائی رہنمائی کا مرکز ہے۔',
      en: 'The first point of guidance and assistance for visitors, guests, and general institutional inquiries.',
    },
  },
  security: {
    slug: 'shoba-muhafizeen',
    title: { ur: 'شعبہ محافظین', en: 'Security Department' },
    summary: {
      ur: 'شعبہ محافظین ادارے کے نظم، حفاظت، اور عمومی نگرانی کے فرائض انجام دیتا ہے۔',
      en: 'Supporting order, safety, and day-to-day institutional monitoring and security.',
    },
  },
  clinic: {
    slug: 'shifa-khana',
    title: { ur: 'شفاخانہ', en: 'Clinic' },
    summary: {
      ur: 'شفاخانہ طلبہ اور ادارے سے وابستہ افراد کی بنیادی صحت کی ضروریات، ابتدائی علاج، اور عمومی طبی خدمت کے لیے ہے۔',
      en: 'A basic healthcare support unit for students and campus-related health needs and first aid.',
    },
  },
  kitchen: {
    slug: 'matbakh',
    title: { ur: 'مطبخ', en: 'Kitchen' },
    summary: {
      ur: 'مطبخ طلبہ کی اجتماعی خوراک، منظم تیاری، ذخیرہ، صفائی، اور خدمت کا ایک بڑا انتظامی شعبہ ہے۔',
      en: 'A large service department responsible for the preparation, organization, storage, and collective provision of meals for students.',
    },
  },
}

// ─── Speeches & Lessons ────────────────────────────────────────────────────

export const speechesLessons = {
  title: { ur: 'بیانات و دروس', en: 'Speeches & Lessons' },
  overview: {
    ur: 'اس صفحہ پر بانیِ جامعہ، اکابر علماء، اور ادارے سے وابستہ علمی شخصیات کے بیانات، دروس، اصلاحی مجالس، اور خصوصی تقاریب کی جھلک پیش کی جاتی ہے۔',
    en: 'This section presents lectures, talks, lessons, and special educational gatherings connected to the founder, visiting scholars, and institute-affiliated teachers.',
  },
}

// ─── Projects ──────────────────────────────────────────────────────────────

export const projectsContent = {
  title: { ur: 'منصوبے', en: 'Projects' },
  overview: {
    ur: 'جامعہ کے منصوبے علمی، تعمیری، اور رفاہی ضروریات کو پورا کرنے کے لیے ترتیب دیے جاتے ہیں تاکہ ادارہ اپنی تعلیمی اور سماجی خدمت کے دائرہ کو مضبوط بنا سکے۔',
    en: "The institute's projects address developmental, educational, and welfare needs, strengthening the institution's scope of service and social responsibility.",
  },
  alMahmood: {
    title: { ur: 'ال محمود سوشل ویلفیئر', en: 'Al Mahmood Social Welfare' },
    summary: {
      ur: 'ال محمود سوشل ویلفیئر ایک رفاہی اور خدمت خلق کا منصوبہ ہے جس کا مقصد ضرورت مند افراد، متاثرہ خاندانوں، یا سماجی معاونت کے مستحق طبقات کی خدمت ہے۔',
      en: 'Al Mahmood Social Welfare is a welfare initiative focused on service, relief, and support for those in need, including vulnerable families and communities.',
    },
  },
}

// ─── Contact ───────────────────────────────────────────────────────────────

export const contactContent = {
  title: { ur: 'رابطہ', en: 'Contact' },
  address: {
    ur: 'لاڑکانہ، سندھ، پاکستان',
    en: 'Larkana, Sindh, Pakistan',
  },
  phone: '+92-300-0000000',
  email: 'info@jamiaislamilarkana.edu.pk',
  departments: [
    { label: { ur: 'دفترِ اہتمام', en: 'Administration Office' } },
    { label: { ur: 'دفتر تعلیمات', en: 'Academic Office' } },
    { label: { ur: 'شعبہ حسابات', en: 'Accounts Department' } },
    { label: { ur: 'مکتبہ', en: 'Bookshop & Library' } },
  ],
}
