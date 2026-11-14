export function getInitialSeedData() {
  const data = {
  "users": [
    {
      "id": "usr-admin-1",
      "username": "admin",
      "email": "admin@gamekad.ir",
      "displayName": "مدیر کل گیم‌کاد",
      "passwordHash": "$2a$10$3u3sPgJ6J63GJglzZ9neuOAgG2sKgezztK8T.lJ1lLDDLfHkebv.e",
      "gender": "boy",
      "avatar": "/profiles/Game Club.jpg",
      "phone": "09151112233",
      "bio": "مدیر فنی و اجرایی باشگاه بازی‌های فکری و کنسولی گیم‌کاد مشهد.",
      "role": "admin",
      "membership": "ROKAD",
      "godGameAllowed": true,
      "isSuspended": false,
      "walletBalance": 5000000,
      "createdAt": "2026-09-01T10:00:00.000Z",
      "updatedAt": "2026-11-14T08:00:00.000Z"
    },
    {
      "id": "usr-host-1",
      "username": "host",
      "email": "behzad@gamekad.ir",
      "displayName": "بهزاد مهدوی (خدای بازی)",
      "passwordHash": "$2a$10$tTu9T/cXSuWbd6VPrTtT2eelhiULaxSsk9h37dLZu75eocgnZgnDW",
      "gender": "boy",
      "avatar": "/profiles/Boy.png",
      "phone": "09152223344",
      "bio": "گرداننده رسمی لیگ مافیا و داور ارشد سناریوهای پدرخوانده و ارتش سری با سابقه +۵۰۰ بازی.",
      "role": "host",
      "membership": "ROKAD",
      "godGameAllowed": true,
      "isSuspended": false,
      "walletBalance": 1250000,
      "createdAt": "2026-09-05T12:00:00.000Z",
      "updatedAt": "2026-11-14T08:00:00.000Z"
    },
    {
      "id": "usr-player-1",
      "username": "player",
      "email": "mahdiyar@gamekad.ir",
      "displayName": "مهدیار شریفی",
      "passwordHash": "$2a$10$tTu9T/cXSuWbd6VPrTtT2eelhiULaxSsk9h37dLZu75eocgnZgnDW",
      "gender": "boy",
      "avatar": "/profiles/Studio.jpg",
      "phone": "09153334455",
      "bio": "کاپیتان تیم مافیا مشهد، عاشق نقش‌های استدلالی و سناریو پدرخوانده. دارنده مدال الماس ذهن برتر مسابقات.",
      "role": "user",
      "membership": "VIP",
      "godGameAllowed": false,
      "isSuspended": false,
      "walletBalance": 680000,
      "createdAt": "2026-09-10T14:30:00.000Z",
      "updatedAt": "2026-11-14T08:00:00.000Z"
    },
    {
      "id": "usr-player-2",
      "username": "sara_art",
      "email": "sara.rezaei@gamekad.ir",
      "displayName": "سارا رضایی",
      "passwordHash": "$2a$10$tTu9T/cXSuWbd6VPrTtT2eelhiULaxSsk9h37dLZu75eocgnZgnDW",
      "gender": "girl",
      "avatar": "/profiles/Girl.jpg",
      "phone": "09154445566",
      "bio": "استراتژیست ارشد کلاب و تحلیلگر زبان بدن؛ متخصص نجات شهر با نقش دکتر لکتر و کارآگاه.",
      "role": "user",
      "membership": "ROKAD",
      "godGameAllowed": false,
      "isSuspended": false,
      "walletBalance": 490000,
      "createdAt": "2026-09-12T16:00:00.000Z",
      "updatedAt": "2026-11-14T08:00:00.000Z"
    },
    {
      "id": "usr-player-3",
      "username": "ali_k",
      "email": "ali.kazemi@gamekad.ir",
      "displayName": "علی کاظمی",
      "passwordHash": "$2a$10$tTu9T/cXSuWbd6VPrTtT2eelhiULaxSsk9h37dLZu75eocgnZgnDW",
      "gender": "boy",
      "avatar": "/profiles/Academy.jpg",
      "phone": "09155556677",
      "bio": "تک‌تیرانداز سرعتی و نترس مسابقات؛ شلیک‌های بی‌خطا در فاز شب بدون فکت سوخته.",
      "role": "user",
      "membership": "EXTERNAL",
      "godGameAllowed": false,
      "isSuspended": false,
      "walletBalance": 240000,
      "createdAt": "2026-09-15T18:20:00.000Z",
      "updatedAt": "2026-11-14T08:00:00.000Z"
    },
    {
      "id": "usr-player-4",
      "username": "yasaman_m",
      "email": "yasaman.mousavi@gamekad.ir",
      "displayName": "یاسمن موسوی",
      "passwordHash": "$2a$10$tTu9T/cXSuWbd6VPrTtT2eelhiULaxSsk9h37dLZu75eocgnZgnDW",
      "gender": "girl",
      "avatar": "/profiles/School.jpg",
      "phone": "09156667788",
      "bio": "تارگت‌های دقیق بر پایه فکت و منطق ریاضی؛ بدون حدس و گمان، تا کشف مافیا کوتاه نمیام!",
      "role": "user",
      "membership": "VIP",
      "godGameAllowed": false,
      "isSuspended": false,
      "walletBalance": 380000,
      "createdAt": "2026-09-18T11:15:00.000Z",
      "updatedAt": "2026-11-14T08:00:00.000Z"
    },
    {
      "id": "usr-player-5",
      "username": "arash_r",
      "email": "arash.rostami@gamekad.ir",
      "displayName": "آرش رستمی",
      "passwordHash": "$2a$10$tTu9T/cXSuWbd6VPrTtT2eelhiULaxSsk9h37dLZu75eocgnZgnDW",
      "gender": "boy",
      "avatar": "/profiles/Institute.jpg",
      "phone": "09157778899",
      "bio": "نینجای بازی‌های رومیزی و استراتژیک؛ قهرمان تورنمنت کاتان و بازیکن حرفه‌ای سکرت هیتلر.",
      "role": "user",
      "membership": "VIP",
      "godGameAllowed": false,
      "isSuspended": false,
      "walletBalance": 520000,
      "createdAt": "2026-09-20T09:40:00.000Z",
      "updatedAt": "2026-11-14T08:00:00.000Z"
    },
    {
      "id": "usr-player-6",
      "username": "niloofar_p",
      "email": "niloofar.pakzad@gamekad.ir",
      "displayName": "نیلوفر پاکزاد",
      "passwordHash": "$2a$10$tTu9T/cXSuWbd6VPrTtT2eelhiULaxSsk9h37dLZu75eocgnZgnDW",
      "gender": "girl",
      "avatar": "/profiles/Girl.jpg",
      "phone": "09331112244",
      "bio": "کارآگاه نخبه تورنمنت پاییزه؛ استعلام‌های مثبت شب اول و مدیریت آرام میز در بحران.",
      "role": "user",
      "membership": "ROKAD",
      "godGameAllowed": false,
      "isSuspended": false,
      "walletBalance": 310000,
      "createdAt": "2026-09-22T13:50:00.000Z",
      "updatedAt": "2026-11-14T08:00:00.000Z"
    },
    {
      "id": "usr-player-7",
      "username": "amir_tehrani",
      "email": "amir.tehrani@gamekad.ir",
      "displayName": "امیرحسین تهرانی",
      "passwordHash": "$2a$10$tTu9T/cXSuWbd6VPrTtT2eelhiULaxSsk9h37dLZu75eocgnZgnDW",
      "gender": "boy",
      "avatar": "/profiles/Boy.png",
      "phone": "09332223355",
      "bio": "گادفادر خونسرد و استاد بلف؛ دفاعیه‌های قوی که اجماع شهر رو کاملاً برمی‌گردونه.",
      "role": "user",
      "membership": "EXTERNAL",
      "godGameAllowed": false,
      "isSuspended": false,
      "walletBalance": 175000,
      "createdAt": "2026-09-25T15:10:00.000Z",
      "updatedAt": "2026-11-14T08:00:00.000Z"
    },
    {
      "id": "usr-player-8",
      "username": "rojan_afshar",
      "email": "rojan.afshar@gamekad.ir",
      "displayName": "روژان افشار",
      "passwordHash": "$2a$10$tTu9T/cXSuWbd6VPrTtT2eelhiULaxSsk9h37dLZu75eocgnZgnDW",
      "gender": "girl",
      "avatar": "/profiles/Studio.jpg",
      "phone": "09333334466",
      "bio": "پزشک معتمد باشگاه؛ نجات‌های سرنوشت‌ساز در راندهای حساس فینال.",
      "role": "user",
      "membership": "VIP",
      "godGameAllowed": false,
      "isSuspended": false,
      "walletBalance": 420000,
      "createdAt": "2026-09-28T17:30:00.000Z",
      "updatedAt": "2026-11-14T08:00:00.000Z"
    },
    {
      "id": "usr-player-9",
      "username": "kian_bahrami",
      "email": "kian.bahrami@gamekad.ir",
      "displayName": "کیان بهرامی",
      "passwordHash": "$2a$10$tTu9T/cXSuWbd6VPrTtT2eelhiULaxSsk9h37dLZu75eocgnZgnDW",
      "gender": "boy",
      "avatar": "/profiles/Academy.jpg",
      "phone": "09334445577",
      "bio": "تک‌تیرانداز شب و مسابقه‌دهنده فیفا و کنسول؛ تمرکز بالا و واکنش‌های سریع.",
      "role": "user",
      "membership": "EXTERNAL",
      "godGameAllowed": false,
      "isSuspended": false,
      "walletBalance": 95000,
      "createdAt": "2026-10-01T19:00:00.000Z",
      "updatedAt": "2026-11-14T08:00:00.000Z"
    },
    {
      "id": "usr-player-10",
      "username": "mahsa_yazdani",
      "email": "mahsa.yazdani@gamekad.ir",
      "displayName": "مهسا یزدانی",
      "passwordHash": "$2a$10$tTu9T/cXSuWbd6VPrTtT2eelhiULaxSsk9h37dLZu75eocgnZgnDW",
      "gender": "girl",
      "avatar": "/profiles/School.jpg",
      "phone": "09335556688",
      "bio": "روانشناس و تحلیلگر رفتار؛ تشخیص استرس و لرزش صدا در فاز تارگت‌زنی.",
      "role": "user",
      "membership": "ROKAD",
      "godGameAllowed": false,
      "isSuspended": false,
      "walletBalance": 290000,
      "createdAt": "2026-10-04T12:00:00.000Z",
      "updatedAt": "2026-11-14T08:00:00.000Z"
    }
  ],
  "categories": [
    {
      "id": "cat-mafia",
      "name": "مافیا و استدلالی",
      "slug": "mafia",
      "description": "رویدادهای حضوری بازی مافیا با سناریوهای استاندارد پدرخوانده، شب‌های مافیا و ارتش سری.",
      "icon": "Skull",
      "sortOrder": 1,
      "isActive": true
    },
    {
      "id": "cat-boardgame",
      "name": "بازی‌های رومیزی (Board Games)",
      "slug": "boardgame",
      "description": "دورهمی بوردگیم‌های استراتژیک، اقتصادی و خانوادگی کاتان، کودتا، سکرت هیتلر و اولون.",
      "icon": "Dices",
      "sortOrder": 2,
      "isActive": true
    },
    {
      "id": "cat-console",
      "name": "کنسول و رقابت‌های ویدیویی (PS5)",
      "slug": "console",
      "description": "تورنمنت‌های هیجان‌انگیز فوتبال EA FC 25، مورتال کامبت و مسابقات سرعتی کلاب.",
      "icon": "Gamepad2",
      "sortOrder": 3,
      "isActive": true
    }
  ],
  "scenarios": [
    {
      "id": "sc-godfather",
      "categoryId": "cat-mafia",
      "title": "پدرخوانده (سناریوی جک و ساسل)",
      "slug": "godfather",
      "description": "سناریوی پیشرفته مسابقاتی شامل پدرخوانده، ماتادور، ساول گودمن، دکتر واتسون، کنستانتین، لئون و شهروندان نخبه.",
      "minPlayers": 11,
      "maxPlayers": 11,
      "estimatedMinutes": 90,
      "difficulty": "پیشرفته و مسابقاتی",
      "coverImage": "/profiles/Game Club.jpg"
    },
    {
      "id": "sc-mafia-nights",
      "categoryId": "cat-mafia",
      "title": "شب‌های مافیا (فیلیمو استاندارد)",
      "slug": "mafia-nights",
      "description": "سناریوی جذاب و سرعتی با کارت‌های معروف شهردار، پزشک، روانپزشک، کارآگاه، اسنایپر و جوکر.",
      "minPlayers": 12,
      "maxPlayers": 12,
      "estimatedMinutes": 75,
      "difficulty": "متوسط و سرعتی",
      "coverImage": "/profiles/Studio.jpg"
    },
    {
      "id": "sc-secret-army",
      "categoryId": "cat-mafia",
      "title": "ارتش سری (گشتاپو و اتاق بازجویی)",
      "slug": "secret-army",
      "description": "نبرد مخفی بین گشتاپو، خلبان نجات‌یافته، مشتری و نجات‌دهندگان در کافه کندور با استدلال سنگین.",
      "minPlayers": 10,
      "maxPlayers": 10,
      "estimatedMinutes": 80,
      "difficulty": "پیشرفته و مسابقاتی",
      "coverImage": "/profiles/Academy.jpg"
    },
    {
      "id": "sc-russian-mafia",
      "categoryId": "cat-mafia",
      "title": "مافیا کلاسیک روسی",
      "slug": "russian-mafia",
      "description": "سناریوی بنیادین مافیا با تمرکز ۱۰۰٪ بر استدلال کلامی، فکت روز و بدون ابزارهای فانتزی شب.",
      "minPlayers": 10,
      "maxPlayers": 10,
      "estimatedMinutes": 60,
      "difficulty": "مبتدی و استاندارد",
      "coverImage": "/profiles/Institute.jpg"
    },
    {
      "id": "sc-boardgame-party",
      "categoryId": "cat-boardgame",
      "title": "بوردگیم کودتا و سکرت هیتلر",
      "slug": "boardgame-party",
      "description": "بازی بلف و مذاکره سریع؛ مدیریت توکن‌ها و اقناع سایر بازیکنان در فضای گرم باشگاه.",
      "minPlayers": 6,
      "maxPlayers": 10,
      "estimatedMinutes": 45,
      "difficulty": "مبتدی و استاندارد",
      "coverImage": "/profiles/School.jpg"
    }
  ],
  "roles": [
    {
      "id": "r-1",
      "scenarioId": "sc-godfather",
      "name": "پدرخوانده",
      "side": "MAFIA",
      "description": "رئیس خانواده مافیا؛ مصون از شلیک شب تک‌تیرانداز و استعلام کارآگاه منفی است."
    },
    {
      "id": "r-2",
      "scenarioId": "sc-godfather",
      "name": "ماتادور",
      "side": "MAFIA",
      "description": "در فاز شب توانایی بستن قابلیت شب یکی از شهروندان را دارد."
    },
    {
      "id": "r-3",
      "scenarioId": "sc-godfather",
      "name": "ساول گودمن",
      "side": "MAFIA",
      "description": "خریدن یک شهروند ساده و تبدیل آن به مافیای جدید."
    },
    {
      "id": "r-4",
      "scenarioId": "sc-godfather",
      "name": "لئون (تک‌تیرانداز)",
      "side": "CITIZEN",
      "description": "شلیک شبانه به سمت مافیا؛ در صورت شلیک اشتباه به شهروند، خودش از بازی خارج می‌شود."
    },
    {
      "id": "r-5",
      "scenarioId": "sc-godfather",
      "name": "کنستانتین",
      "side": "CITIZEN",
      "description": "توانایی برگرداندن یک بازیکن از دست رفته به بازی برای یک مرتبه."
    },
    {
      "id": "r-6",
      "scenarioId": "sc-godfather",
      "name": "دکتر واتسون",
      "side": "CITIZEN",
      "description": "نجات جان شهروندان از حمله شبانه مافیا."
    },
    {
      "id": "r-7",
      "scenarioId": "sc-godfather",
      "name": "نوستراداموس",
      "side": "INDEPENDENT",
      "description": "پیش‌بینی ساید برنده بازی در شب اول."
    },
    {
      "id": "r-8",
      "scenarioId": "sc-godfather",
      "name": "همشهری کین",
      "side": "CITIZEN",
      "description": "کسب فکت روز و افشای تارگت‌های مشکوک با نطق ویژه."
    },
    {
      "id": "r-9",
      "scenarioId": "sc-godfather",
      "name": "شهروند ساده",
      "side": "CITIZEN",
      "description": "استدلال در فاز روز و هدایت اجماع علیه مافیا."
    }
  ],
  "electronicGames": [
    {
      "id": "eg-1",
      "title": "EA Sports FC 25",
      "platform": "PS5",
      "description": "مسابقات فوتبال شبیه‌ساز با دسته‌های دوال‌سنس روی تلویزیون‌های 4K گیم‌کاد.",
      "coverImage": "/profiles/Game Club.jpg"
    },
    {
      "id": "eg-2",
      "title": "Mortal Kombat 1",
      "platform": "PS5",
      "description": "رقابت دونفره فایتینگ و تورنمنت حذفی کلاب.",
      "coverImage": "/profiles/Studio.jpg"
    }
  ],
  "events": [
    {
      "id": "ev-spotlight-1",
      "categoryId": "cat-mafia",
      "scenarioId": "sc-godfather",
      "hostId": "usr-host-1",
      "title": "میز داغ امشب: فینال لیگ مافیا (پدرخوانده سناریو جک)",
      "description": "رقابت حساس قهرمانان و بازیکنان برتر با داوری و نقد زنده توسط بهزاد مهدوی همراه با تصویربرداری و ثبت رسمی امتیازات در لیدربورد کشوری.",
      "price": 95000,
      "capacity": 11,
      "reservedCount": 9,
      "gender": "mixed",
      "status": "open",
      "startTime": "2026-11-14T17:00:00.000Z",
      "endTime": "2026-11-14T19:30:00.000Z",
      "address": "مشهد، بلوار سجاد، بزرگمهر شمالی ۱، پلاک ۴۲، سالن مسابقات کلاب گیم‌کاد",
      "coverImage": "/profiles/Game Club.jpg",
      "targetGender": "mixed"
    },
    {
      "id": "ev-table-2",
      "categoryId": "cat-mafia",
      "scenarioId": "sc-mafia-nights",
      "hostId": "usr-host-1",
      "title": "شب‌های مافیا (کلاسیک و سرعتی - مبتدی تا متوسط)",
      "description": "میز مهیج برای علاقه‌مندان به نقش‌های متنوع، شهردار و روانپزشک. همراه با آموزش ۵ دقیقه‌ای قبل از شروع بازی.",
      "price": 75000,
      "capacity": 12,
      "reservedCount": 7,
      "gender": "mixed",
      "status": "open",
      "startTime": "2026-11-15T14:30:00.000Z",
      "endTime": "2026-11-15T16:30:00.000Z",
      "address": "مشهد، بلوار وکیل‌آباد، مجتمع فرهنگی رکاد، طبقه ۲، اتاق کنفرانس شماره ۳",
      "coverImage": "/profiles/Studio.jpg",
      "targetGender": "mixed"
    },
    {
      "id": "ev-table-3",
      "categoryId": "cat-mafia",
      "scenarioId": "sc-secret-army",
      "hostId": "usr-host-1",
      "title": "مسابقه ارتش سری: اتاق بازجویی گشتاپو",
      "description": "فضایی تاریک، بازجویی‌های استدلالی و نجات جان خلبان متفقین. بدون شانس و کاملاً مبتنی بر فکت کلامی.",
      "price": 85000,
      "capacity": 10,
      "reservedCount": 8,
      "gender": "mixed",
      "status": "open",
      "startTime": "2026-11-16T16:00:00.000Z",
      "endTime": "2026-11-16T18:00:00.000Z",
      "address": "مشهد، بلوار سجاد، بزرگمهر شمالی ۱، سالن VIP گیم‌کاد",
      "coverImage": "/profiles/Academy.jpg",
      "targetGender": "mixed"
    },
    {
      "id": "ev-table-4",
      "categoryId": "cat-boardgame",
      "scenarioId": "sc-boardgame-party",
      "hostId": "usr-player-5",
      "title": "دورهمی بوردگیم: کاتان، کودتا و سکرت هیتلر",
      "description": "شب خانوادگی و دوستانه بازی‌های رومیزی؛ تجارت، بلف و خنده در محیط دوستانه کافه باشگاه گیم‌کاد.",
      "price": 60000,
      "capacity": 8,
      "reservedCount": 5,
      "gender": "mixed",
      "status": "open",
      "startTime": "2026-11-17T13:30:00.000Z",
      "endTime": "2026-11-17T16:00:00.000Z",
      "address": "مشهد، بلوار وکیل‌آباد، نبش وکیل‌آباد ۳۵، کافه بردگیم گیم‌کاد",
      "coverImage": "/profiles/School.jpg",
      "targetGender": "mixed"
    },
    {
      "id": "ev-table-5",
      "categoryId": "cat-mafia",
      "scenarioId": "sc-russian-mafia",
      "hostId": "usr-host-1",
      "title": "مافیا روسی (سناریو نوستالژی - پیشرفته)",
      "description": "مافیای ۱۰ نفره کلاسیک بدون یار کمکی شب؛ خالص‌ترین تجربه منطق و استدلال استنتاجی.",
      "price": 80000,
      "capacity": 10,
      "reservedCount": 6,
      "gender": "mixed",
      "status": "open",
      "startTime": "2026-11-18T12:30:00.000Z",
      "endTime": "2026-11-18T14:30:00.000Z",
      "address": "مشهد، بلوار سجاد، بزرگمهر شمالی ۱، پلاک ۴۲، سالن مسابقات گیم‌کاد",
      "coverImage": "/profiles/Institute.jpg",
      "targetGender": "mixed"
    },
    {
      "id": "ev-table-6",
      "categoryId": "cat-console",
      "scenarioId": null,
      "hostId": "usr-player-3",
      "title": "تورنمنت مینی فوتبال PS5 (EA Sports FC 25)",
      "description": "جام حذفی ۱۶ نفره با جوایز نقدی برای نفرات اول تا سوم و ثبت امتیاز لیدربرد کنسولی.",
      "price": 110000,
      "capacity": 16,
      "reservedCount": 12,
      "gender": "mixed",
      "status": "open",
      "startTime": "2026-11-19T15:30:00.000Z",
      "endTime": "2026-11-19T19:00:00.000Z",
      "address": "مشهد، بلوار سجاد، کلاب اختصاصی PS5 گیم‌کاد",
      "coverImage": "/profiles/Girl.jpg",
      "targetGender": "mixed"
    },
    {
      "id": "ev-table-7",
      "categoryId": "cat-mafia",
      "scenarioId": "sc-godfather",
      "hostId": "usr-host-1",
      "title": "مافیا ویژه بانوان (سناریو پدرخوانده)",
      "description": "میز اختصاصی بانوان گیم‌کاد با گردانندگی حرفه‌ای و محیط امن و دوستانه.",
      "price": 75000,
      "capacity": 11,
      "reservedCount": 4,
      "gender": "girls",
      "status": "open",
      "startTime": "2026-11-20T16:30:00.000Z",
      "endTime": "2026-11-20T19:00:00.000Z",
      "address": "مشهد، بلوار وکیل‌آباد، مجتمع فرهنگی رکاد، سالن آفتاب",
      "coverImage": "/profiles/Boy.png",
      "targetGender": "girls"
    }
  ],
  "reservations": [
    {
      "id": "res-1",
      "eventId": "ev-spotlight-1",
      "userId": "usr-player-1",
      "seatNumber": 1,
      "status": "paid",
      "amount": 95000,
      "paidAt": "2026-11-13T10:00:00.000Z",
      "createdAt": "2026-11-13T09:55:00.000Z"
    },
    {
      "id": "res-2",
      "eventId": "ev-spotlight-1",
      "userId": "usr-player-2",
      "seatNumber": 2,
      "status": "paid",
      "amount": 95000,
      "paidAt": "2026-11-13T10:10:00.000Z",
      "createdAt": "2026-11-13T10:05:00.000Z"
    },
    {
      "id": "res-3",
      "eventId": "ev-spotlight-1",
      "userId": "usr-player-3",
      "seatNumber": 3,
      "status": "paid",
      "amount": 95000,
      "paidAt": "2026-11-13T10:30:00.000Z",
      "createdAt": "2026-11-13T10:25:00.000Z"
    },
    {
      "id": "res-4",
      "eventId": "ev-spotlight-1",
      "userId": "usr-player-4",
      "seatNumber": 4,
      "status": "paid",
      "amount": 95000,
      "paidAt": "2026-11-13T11:00:00.000Z",
      "createdAt": "2026-11-13T10:55:00.000Z"
    },
    {
      "id": "res-5",
      "eventId": "ev-spotlight-1",
      "userId": "usr-player-5",
      "seatNumber": 5,
      "status": "paid",
      "amount": 95000,
      "paidAt": "2026-11-13T11:20:00.000Z",
      "createdAt": "2026-11-13T11:15:00.000Z"
    },
    {
      "id": "res-6",
      "eventId": "ev-table-2",
      "userId": "usr-player-6",
      "seatNumber": 1,
      "status": "paid",
      "amount": 75000,
      "paidAt": "2026-11-14T08:00:00.000Z",
      "createdAt": "2026-11-14T07:50:00.000Z"
    },
    {
      "id": "res-7",
      "eventId": "ev-table-2",
      "userId": "usr-player-7",
      "seatNumber": 2,
      "status": "paid",
      "amount": 75000,
      "paidAt": "2026-11-14T08:15:00.000Z",
      "createdAt": "2026-11-14T08:10:00.000Z"
    }
  ],
  "medals": [
    {
      "id": "med-diamond-1",
      "title": "ذهن برتر مسابقاتی",
      "slug": "mastermind",
      "tier": "DIAMOND",
      "description": "کسب بالاترین امتیاز استدلال و تشخیص ۱۰۰٪ اعضای ساید مقابل در فینال مسابقات رسمی باشگاه.",
      "icon": "Sparkles",
      "xpReward": 500
    },
    {
      "id": "med-diamond-2",
      "title": "MVP سوپرجام کلاب",
      "slug": "supercup-mvp",
      "tier": "DIAMOND",
      "description": "درخشش در تورنمنت فصلی گیم‌کاد و انتخاب به عنوان باارزش‌ترین بازیکن با رای داوران و تماشاگران.",
      "icon": "Trophy",
      "xpReward": 600
    },
    {
      "id": "med-gold-1",
      "title": "تک‌تیرانداز طلایی",
      "slug": "golden-sniper",
      "tier": "GOLD",
      "description": "شلیک ۳ تیر موفق مافیایی در یک مسابقه بدون حتی یک شات اشتباه به شهروندان.",
      "icon": "Target",
      "xpReward": 350
    },
    {
      "id": "med-gold-2",
      "title": "استاد فریب و بازیگری",
      "slug": "bluff-master",
      "tier": "GOLD",
      "description": "برد قاطع با ساید مافیا بدون اینکه حتی یک بار در فاز روز به عنوان مافیا تارگت خورده باشید.",
      "icon": "Flame",
      "xpReward": 350
    },
    {
      "id": "med-silver-1",
      "title": "ناجی شهر (پزشک معتمد)",
      "slug": "city-savior",
      "tier": "SILVER",
      "description": "نجات موفق شهروندان کلیدی (کارآگاه یا تک‌تیرانداز) در شب‌های حساس ۲ و ۳ بازی.",
      "icon": "Shield",
      "xpReward": 200
    },
    {
      "id": "med-silver-2",
      "title": "رهبر ارکستر شهر",
      "slug": "city-leader",
      "tier": "SILVER",
      "description": "متحد کردن آرای شهروندان پراکنده و اجماع موفق برای خروج سرتیم مافیا در دفاعیه.",
      "icon": "Users",
      "xpReward": 200
    },
    {
      "id": "med-bronze-1",
      "title": "کارآگاه تیزبین",
      "slug": "sharp-detective",
      "tier": "BRONZE",
      "description": "استعلام مثبت مافیا در شب اول بازی و رساندن هوشمندانه سرنخ به تیم شهروندی.",
      "icon": "Eye",
      "xpReward": 100
    },
    {
      "id": "med-bronze-2",
      "title": "کهنه‌سرباز وفادار",
      "slug": "loyal-veteran",
      "tier": "BRONZE",
      "description": "حضور فعال و مستمر در بیش از ۳۰ رقابت رسمی باشگاه بازی گیم‌کاد.",
      "icon": "Medal",
      "xpReward": 150
    }
  ],
  "userMedals": [
    {
      "id": "um-1",
      "userId": "usr-player-1",
      "medalId": "med-diamond-1",
      "note": "تحلیل بی‌نقص فکت‌محور در شب فینال تورنمنت - داور: بهزاد مهدوی",
      "awardedAt": "2026-10-15T20:00:00.000Z"
    },
    {
      "id": "um-2",
      "userId": "usr-player-1",
      "medalId": "med-gold-1",
      "note": "۳ شات بی‌خطای مافیا در بازی برابر تیم دانشگاه فردوسی - داور: مهدوی",
      "awardedAt": "2026-10-22T19:30:00.000Z"
    },
    {
      "id": "um-3",
      "userId": "usr-player-1",
      "medalId": "med-silver-2",
      "note": "مدیریت بحران و اتحاد آرا در دفاعیه ۳ نفره - داور: علیرضا حسینی",
      "awardedAt": "2026-11-01T18:00:00.000Z"
    },
    {
      "id": "um-4",
      "userId": "usr-player-1",
      "medalId": "med-bronze-2",
      "note": "حضور در ۶۸ رقابت رسمی باشگاه با عملکرد فنی مثال‌زدنی",
      "awardedAt": "2026-11-05T12:00:00.000Z"
    },
    {
      "id": "um-5",
      "userId": "usr-player-2",
      "medalId": "med-diamond-2",
      "note": "کسب عنوان ارزشمندترین بازیکن (MVP) دوره آبان ماه کلاب گیم‌کاد",
      "awardedAt": "2026-11-02T21:00:00.000Z"
    },
    {
      "id": "um-6",
      "userId": "usr-player-2",
      "medalId": "med-silver-1",
      "note": "دو سیو پی‌درپی و نجات لئون در برابر حمله گادفادر - داور: مهدوی",
      "awardedAt": "2026-10-28T19:00:00.000Z"
    },
    {
      "id": "um-7",
      "userId": "usr-player-2",
      "medalId": "med-bronze-1",
      "note": "کشف اولین مافیا در روز اول با تحلیل خطای کلامی - داور: حسینی",
      "awardedAt": "2026-10-18T18:30:00.000Z"
    },
    {
      "id": "um-8",
      "userId": "usr-player-2",
      "medalId": "med-bronze-2",
      "note": "بیش از ۵۰ بازی رسمی با نرخ پیروزی بالای ۷۳٪",
      "awardedAt": "2026-11-06T15:00:00.000Z"
    },
    {
      "id": "um-9",
      "userId": "usr-player-3",
      "medalId": "med-gold-1",
      "note": "حذف تک‌تیرانداز مافیا در شب دوم بدون تردید - داور: مهدوی",
      "awardedAt": "2026-10-25T20:00:00.000Z"
    },
    {
      "id": "um-10",
      "userId": "usr-player-3",
      "medalId": "med-bronze-2",
      "note": "حضور مستمر در لیگ هفتگی مسابقات",
      "awardedAt": "2026-11-08T17:00:00.000Z"
    },
    {
      "id": "um-11",
      "userId": "usr-player-4",
      "medalId": "med-diamond-1",
      "note": "استدلال‌های ریاضی و اثبات شهروندی بدون شکاف منطقی - داور: حسینی",
      "awardedAt": "2026-10-30T19:00:00.000Z"
    },
    {
      "id": "um-12",
      "userId": "usr-player-4",
      "medalId": "med-silver-2",
      "note": "هدایت میز و پیروزی شهر در روز چهارم - داور: مهدوی",
      "awardedAt": "2026-11-04T18:30:00.000Z"
    },
    {
      "id": "um-13",
      "userId": "usr-player-5",
      "medalId": "med-gold-2",
      "note": "بازیگری بی‌نظیر با نقش ساول گودمن و برگرداندن شهروند - داور: مهدوی",
      "awardedAt": "2026-10-27T20:30:00.000Z"
    },
    {
      "id": "um-14",
      "userId": "usr-player-5",
      "medalId": "med-bronze-1",
      "note": "استعلام کارآگاهی دقیق در ثانیه‌های پایانی فاز شب",
      "awardedAt": "2026-11-03T19:00:00.000Z"
    },
    {
      "id": "um-15",
      "userId": "usr-player-6",
      "medalId": "med-bronze-1",
      "note": "کشف ساول گودمن در راند اول با استعلام هوشمندانه - داور: حسینی",
      "awardedAt": "2026-10-29T18:00:00.000Z"
    },
    {
      "id": "um-16",
      "userId": "usr-player-6",
      "medalId": "med-silver-1",
      "note": "پزشک فداکار؛ نجات اعضای شورا در سه دست متوالی",
      "awardedAt": "2026-11-07T16:30:00.000Z"
    },
    {
      "id": "um-17",
      "userId": "usr-player-7",
      "medalId": "med-gold-2",
      "note": "بلف تاریخی در فینال مسابقات و خروج کارآگاه با اجماع شهر - داور: مهدوی",
      "awardedAt": "2026-11-01T20:00:00.000Z"
    },
    {
      "id": "um-18",
      "userId": "usr-player-8",
      "medalId": "med-silver-1",
      "note": "سیو طلایی کارآگاه در فاز شب سوم و بازگرداندن امید به شهر",
      "awardedAt": "2026-11-06T19:30:00.000Z"
    },
    {
      "id": "um-19",
      "userId": "usr-player-9",
      "medalId": "med-gold-1",
      "note": "شلیک شجاعانه به سمت پدرخوانده با تکیه بر تارگت دقیق شهروندی",
      "awardedAt": "2026-11-08T20:00:00.000Z"
    },
    {
      "id": "um-20",
      "userId": "usr-player-10",
      "medalId": "med-silver-2",
      "note": "تحلیل دقیق چهره و نطق دفاعیه بازیکنان در روز نهایی مسابقه",
      "awardedAt": "2026-11-09T18:00:00.000Z"
    }
  ],
  "playerStats": [
    {
      "id": "ps-1",
      "userId": "usr-player-1",
      "categoryId": "cat-mafia",
      "score": 2150,
      "matches": 68,
      "wins": 49,
      "losses": 19,
      "reasoning": 95,
      "bluff": 86,
      "negotiation": 92,
      "leadership": 90,
      "shooting": 89,
      "teamwork": 94
    },
    {
      "id": "ps-2",
      "userId": "usr-player-2",
      "categoryId": "cat-mafia",
      "score": 1980,
      "matches": 52,
      "wins": 38,
      "losses": 14,
      "reasoning": 92,
      "bluff": 88,
      "negotiation": 94,
      "leadership": 88,
      "shooting": 75,
      "teamwork": 96
    },
    {
      "id": "ps-3",
      "userId": "usr-player-3",
      "categoryId": "cat-mafia",
      "score": 1840,
      "matches": 44,
      "wins": 30,
      "losses": 14,
      "reasoning": 85,
      "bluff": 82,
      "negotiation": 80,
      "leadership": 84,
      "shooting": 96,
      "teamwork": 86
    },
    {
      "id": "ps-4",
      "userId": "usr-player-4",
      "categoryId": "cat-mafia",
      "score": 1790,
      "matches": 40,
      "wins": 28,
      "losses": 12,
      "reasoning": 96,
      "bluff": 72,
      "negotiation": 88,
      "leadership": 89,
      "shooting": 78,
      "teamwork": 92
    },
    {
      "id": "ps-5",
      "userId": "usr-player-5",
      "categoryId": "cat-mafia",
      "score": 1720,
      "matches": 38,
      "wins": 26,
      "losses": 12,
      "reasoning": 88,
      "bluff": 94,
      "negotiation": 90,
      "leadership": 82,
      "shooting": 80,
      "teamwork": 88
    },
    {
      "id": "ps-6",
      "userId": "usr-player-6",
      "categoryId": "cat-mafia",
      "score": 1680,
      "matches": 34,
      "wins": 23,
      "losses": 11,
      "reasoning": 93,
      "bluff": 76,
      "negotiation": 86,
      "leadership": 85,
      "shooting": 82,
      "teamwork": 90
    },
    {
      "id": "ps-7",
      "userId": "usr-player-7",
      "categoryId": "cat-mafia",
      "score": 1610,
      "matches": 31,
      "wins": 20,
      "losses": 11,
      "reasoning": 82,
      "bluff": 96,
      "negotiation": 91,
      "leadership": 89,
      "shooting": 80,
      "teamwork": 82
    },
    {
      "id": "ps-8",
      "userId": "usr-player-8",
      "categoryId": "cat-mafia",
      "score": 1540,
      "matches": 28,
      "wins": 18,
      "losses": 10,
      "reasoning": 84,
      "bluff": 74,
      "negotiation": 87,
      "leadership": 80,
      "shooting": 72,
      "teamwork": 95
    },
    {
      "id": "ps-9",
      "userId": "usr-player-9",
      "categoryId": "cat-mafia",
      "score": 1490,
      "matches": 26,
      "wins": 16,
      "losses": 10,
      "reasoning": 80,
      "bluff": 81,
      "negotiation": 76,
      "leadership": 79,
      "shooting": 93,
      "teamwork": 84
    },
    {
      "id": "ps-10",
      "userId": "usr-player-10",
      "categoryId": "cat-mafia",
      "score": 1420,
      "matches": 23,
      "wins": 14,
      "losses": 9,
      "reasoning": 91,
      "bluff": 78,
      "negotiation": 89,
      "leadership": 82,
      "shooting": 70,
      "teamwork": 91
    },
    {
      "id": "ps-admin",
      "userId": "usr-admin-1",
      "categoryId": "cat-mafia",
      "score": 1950,
      "matches": 55,
      "wins": 39,
      "losses": 16,
      "reasoning": 90,
      "bluff": 85,
      "negotiation": 92,
      "leadership": 95,
      "shooting": 84,
      "teamwork": 93
    },
    {
      "id": "ps-host",
      "userId": "usr-host-1",
      "categoryId": "cat-mafia",
      "score": 2050,
      "matches": 60,
      "wins": 44,
      "losses": 16,
      "reasoning": 96,
      "bluff": 90,
      "negotiation": 94,
      "leadership": 97,
      "shooting": 90,
      "teamwork": 95
    }
  ],
  "mvpAwards": [
    {
      "id": "mvp-1",
      "userId": "usr-player-1",
      "categoryId": "cat-mafia",
      "period": "آبان ۱۴۰۵",
      "title": "کاپیتان برتر ماه (MVP اول)",
      "reason": "بالاترین امتیاز لیدربرد و رهبری بی‌نقص تیم شهروندی در فینال سوپرجام کلاب گیم‌کاد مشهد.",
      "avatar": "/profiles/Studio.jpg"
    },
    {
      "id": "mvp-2",
      "userId": "usr-player-2",
      "categoryId": "cat-mafia",
      "period": "آبان ۱۴۰۵",
      "title": "استراتژیست ماه (MVP دوم)",
      "reason": "ثبت بالاترین نرخ نجات موفق و کشف هویت با ساید مافیا و شهروندی.",
      "avatar": "/profiles/Girl.jpg"
    },
    {
      "id": "mvp-3",
      "userId": "usr-player-3",
      "categoryId": "cat-mafia",
      "period": "آبان ۱۴۰۵",
      "title": "شکارچی شب و شلیک طلایی (MVP سوم)",
      "reason": "پدیده مسابقات هفتگی و شلیک‌های بی‌خطا در سه بازی متوالی.",
      "avatar": "/profiles/Academy.jpg"
    }
  ],
  "articles": [
    {
      "id": "art-1",
      "title": "اصول استدلال در سناریوی پدرخوانده: چگونه بدون حدس بازی کنیم؟",
      "slug": "godfather-reasoning-guide",
      "excerpt": "بررسی تاکتیک‌های کلیدی فاز روز، روش ثبت تارگت‌ها و نحوه جلوگیری از فکت‌های احساسی در سناریوی جک و ساسل.",
      "content": "در بازی پدرخوانده، هر کلمه ارزش تحلیلی دارد. بازیکنان موفق کسانی هستند که واکنش‌های ناخودآگاه و استدلال‌های سست را به سرعت یادداشت کرده و در نطق‌های رسمی به چالش می‌کشند...",
      "coverImage": "/profiles/Game Club.jpg",
      "authorName": "بهزاد مهدوی",
      "readingMinutes": 6,
      "isPublished": true,
      "publishedAt": "2026-11-01T10:00:00.000Z"
    },
    {
      "id": "art-2",
      "title": "راهنمای نقش‌های مستقل: نوستراداموس و راهبرد پیروزی",
      "slug": "nostradamus-strategy",
      "excerpt": "چگونه ساید برنده را در شب اول هوشمندانه پیش‌بینی کنیم و تعادل بازی را حفظ نماییم؟",
      "content": "نوستراداموس حساس‌ترین نقش مستقل بازی است. تصمیم‌گیری اولیه می‌تواند سرنوشت کل میز را دگرگون کند...",
      "coverImage": "/profiles/Studio.jpg",
      "authorName": "مهدیار شریفی",
      "readingMinutes": 4,
      "isPublished": true,
      "publishedAt": "2026-11-04T14:30:00.000Z"
    }
  ],
  "homepageBlocks": [
    {
      "id": "b-1",
      "blockKey": "hero",
      "title": "سرصفحه اصلی",
      "isVisible": true,
      "sortOrder": 1
    },
    {
      "id": "b-2",
      "blockKey": "spotlight",
      "title": "رویداد ویژه نزدیک",
      "isVisible": true,
      "sortOrder": 2
    },
    {
      "id": "b-3",
      "blockKey": "events",
      "title": "میزهای پیش‌رو",
      "isVisible": true,
      "sortOrder": 3
    },
    {
      "id": "b-4",
      "blockKey": "games",
      "title": "بازی‌ها (رومیزی و کنسول)",
      "isVisible": true,
      "sortOrder": 4
    },
    {
      "id": "b-5",
      "blockKey": "guide",
      "title": "آموزش سناریوها",
      "isVisible": true,
      "sortOrder": 5
    },
    {
      "id": "b-6",
      "blockKey": "leaderboard",
      "title": "لیدربورد و رتبه‌بندی",
      "isVisible": true,
      "sortOrder": 6
    },
    {
      "id": "b-7",
      "blockKey": "mvp",
      "title": "منتخبان دوره (MVP)",
      "isVisible": true,
      "sortOrder": 7
    },
    {
      "id": "b-8",
      "blockKey": "articles",
      "title": "مقالات و آموزش",
      "isVisible": true,
      "sortOrder": 8
    },
    {
      "id": "b-9",
      "blockKey": "about",
      "title": "درباره و آدرس باشگاه",
      "isVisible": true,
      "sortOrder": 9
    }
  ],
  "siteSettings": [
    {
      "id": "st-1",
      "key": "site_title",
      "value": "باشگاه بازی گیم‌کاد"
    },
    {
      "id": "st-2",
      "key": "phone",
      "value": "09332881180"
    },
    {
      "id": "st-3",
      "key": "address",
      "value": "مشهد، بلوار سجاد، بزرگمهر شمالی ۱، پلاک ۴۲"
    }
  ],
  "godGameSessions": [
    {
      "id": "sess-1",
      "title": "فینال لیگ پاییزه پدرخوانده",
      "scenarioId": "sc-godfather",
      "hostId": "usr-host-1",
      "winnerSide": "CITIZEN",
      "status": "COMPLETED",
      "createdAt": "2026-11-12T18:00:00.000Z"
    },
    {
      "id": "sess-2",
      "title": "نبرد شب‌های مافیا - دور هفتم",
      "scenarioId": "sc-mafia-nights",
      "hostId": "usr-host-1",
      "winnerSide": "MAFIA",
      "status": "COMPLETED",
      "createdAt": "2026-11-10T19:30:00.000Z"
    },
    {
      "id": "sess-3",
      "title": "اتاق بازجویی ارتش سری",
      "scenarioId": "sc-secret-army",
      "hostId": "usr-host-1",
      "winnerSide": "CITIZEN",
      "status": "COMPLETED",
      "createdAt": "2026-11-08T17:00:00.000Z"
    },
    {
      "id": "sess-4",
      "title": "مافیا کلاسیک روسی - بازی دوستانه",
      "scenarioId": "sc-russian-mafia",
      "hostId": "usr-host-1",
      "winnerSide": "CITIZEN",
      "status": "COMPLETED",
      "createdAt": "2026-11-05T18:30:00.000Z"
    },
    {
      "id": "sess-5",
      "title": "جام حذفی آخر هفته پدرخوانده",
      "scenarioId": "sc-godfather",
      "hostId": "usr-host-1",
      "winnerSide": "MAFIA",
      "status": "COMPLETED",
      "createdAt": "2026-11-03T19:00:00.000Z"
    }
  ],
  "godGameSeats": [
    {
      "id": "seat-1-1",
      "sessionId": "sess-1",
      "seatNumber": 1,
      "playerId": "usr-player-1",
      "roleName": "لئون (تک‌تیرانداز)",
      "roleSide": "CITIZEN"
    },
    {
      "id": "seat-1-2",
      "sessionId": "sess-1",
      "seatNumber": 2,
      "playerId": "usr-player-2",
      "roleName": "دکتر واتسون",
      "roleSide": "CITIZEN"
    },
    {
      "id": "seat-1-3",
      "sessionId": "sess-1",
      "seatNumber": 3,
      "playerId": "usr-player-7",
      "roleName": "پدرخوانده",
      "roleSide": "MAFIA"
    },
    {
      "id": "seat-1-4",
      "sessionId": "sess-1",
      "seatNumber": 4,
      "playerId": "usr-player-4",
      "roleName": "کنستانتین",
      "roleSide": "CITIZEN"
    },
    {
      "id": "seat-1-5",
      "sessionId": "sess-1",
      "seatNumber": 5,
      "playerId": "usr-player-5",
      "roleName": "ماتادور",
      "roleSide": "MAFIA"
    },
    {
      "id": "seat-1-6",
      "sessionId": "sess-1",
      "seatNumber": 6,
      "playerId": "usr-player-6",
      "roleName": "همشهری کین",
      "roleSide": "CITIZEN"
    },
    {
      "id": "seat-1-7",
      "sessionId": "sess-1",
      "seatNumber": 7,
      "playerId": "usr-player-3",
      "roleName": "شهروند ساده",
      "roleSide": "CITIZEN"
    },
    {
      "id": "seat-1-8",
      "sessionId": "sess-1",
      "seatNumber": 8,
      "playerId": "usr-player-8",
      "roleName": "شهروند ساده",
      "roleSide": "CITIZEN"
    },
    {
      "id": "seat-1-9",
      "sessionId": "sess-1",
      "seatNumber": 9,
      "playerId": "usr-player-9",
      "roleName": "ساول گودمن",
      "roleSide": "MAFIA"
    },
    {
      "id": "seat-1-10",
      "sessionId": "sess-1",
      "seatNumber": 10,
      "playerId": "usr-player-10",
      "roleName": "نوستراداموس",
      "roleSide": "INDEPENDENT"
    },
    {
      "id": "seat-2-1",
      "sessionId": "sess-2",
      "seatNumber": 1,
      "playerId": "usr-player-7",
      "roleName": "پدرخوانده",
      "roleSide": "MAFIA"
    },
    {
      "id": "seat-2-2",
      "sessionId": "sess-2",
      "seatNumber": 2,
      "playerId": "usr-player-5",
      "roleName": "مافیا ساده",
      "roleSide": "MAFIA"
    },
    {
      "id": "seat-2-3",
      "sessionId": "sess-2",
      "seatNumber": 3,
      "playerId": "usr-player-1",
      "roleName": "کارآگاه",
      "roleSide": "CITIZEN"
    },
    {
      "id": "seat-2-4",
      "sessionId": "sess-2",
      "seatNumber": 4,
      "playerId": "usr-player-2",
      "roleName": "پزشک",
      "roleSide": "CITIZEN"
    },
    {
      "id": "seat-2-5",
      "sessionId": "sess-2",
      "seatNumber": 5,
      "playerId": "usr-player-3",
      "roleName": "اسنایپر",
      "roleSide": "CITIZEN"
    },
    {
      "id": "seat-2-6",
      "sessionId": "sess-2",
      "seatNumber": 6,
      "playerId": "usr-player-6",
      "roleName": "شهردار",
      "roleSide": "CITIZEN"
    },
    {
      "id": "seat-3-1",
      "sessionId": "sess-3",
      "seatNumber": 1,
      "playerId": "usr-player-1",
      "roleName": "خلبان نجات‌یافته",
      "roleSide": "CITIZEN"
    },
    {
      "id": "seat-3-2",
      "sessionId": "sess-3",
      "seatNumber": 2,
      "playerId": "usr-player-6",
      "roleName": "کارآگاه گشتاپو",
      "roleSide": "MAFIA"
    },
    {
      "id": "seat-3-3",
      "sessionId": "sess-3",
      "seatNumber": 3,
      "playerId": "usr-player-4",
      "roleName": "نجات‌دهنده",
      "roleSide": "CITIZEN"
    },
    {
      "id": "seat-3-4",
      "sessionId": "sess-3",
      "seatNumber": 4,
      "playerId": "usr-player-8",
      "roleName": "مشتری کافه",
      "roleSide": "CITIZEN"
    },
    {
      "id": "seat-4-1",
      "sessionId": "sess-4",
      "seatNumber": 1,
      "playerId": "usr-player-2",
      "roleName": "دکتر شهر",
      "roleSide": "CITIZEN"
    },
    {
      "id": "seat-4-2",
      "sessionId": "sess-4",
      "seatNumber": 2,
      "playerId": "usr-player-3",
      "roleName": "کلانتر شهر",
      "roleSide": "CITIZEN"
    },
    {
      "id": "seat-4-3",
      "sessionId": "sess-4",
      "seatNumber": 3,
      "playerId": "usr-player-9",
      "roleName": "دون مافیا",
      "roleSide": "MAFIA"
    },
    {
      "id": "seat-4-4",
      "sessionId": "sess-4",
      "seatNumber": 4,
      "playerId": "usr-player-10",
      "roleName": "شهروند آگاه",
      "roleSide": "CITIZEN"
    },
    {
      "id": "seat-5-1",
      "sessionId": "sess-5",
      "seatNumber": 1,
      "playerId": "usr-player-1",
      "roleName": "دن مافیا",
      "roleSide": "MAFIA"
    },
    {
      "id": "seat-5-2",
      "sessionId": "sess-5",
      "seatNumber": 2,
      "playerId": "usr-player-5",
      "roleName": "ماتادور",
      "roleSide": "MAFIA"
    },
    {
      "id": "seat-5-3",
      "sessionId": "sess-5",
      "seatNumber": 3,
      "playerId": "usr-player-4",
      "roleName": "کارآگاه",
      "roleSide": "CITIZEN"
    },
    {
      "id": "seat-5-4",
      "sessionId": "sess-5",
      "seatNumber": 4,
      "playerId": "usr-player-8",
      "roleName": "دکتر واتسون",
      "roleSide": "CITIZEN"
    }
  ],
  "godGameLogs": [],
  "walletTxs": [],
  "auditLogs": []
};
  return data;
}
