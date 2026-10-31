(() => {
  'use strict';

  const STORAGE_KEY = 'field-found-language';
  const languageCodes = { en: 'en-IN', bn: 'bn-IN', hi: 'hi-IN' };
  const select = document.getElementById('siteLanguageSelect');
  const originalDocumentTitle = document.title;

  // Only storefront interface copy is translated. Seller-entered product data is
  // deliberately excluded from the translation pass.
  const entries = {
    "Skip to main content": ["মূল বিষয়বস্তুতে যান", "मुख्य सामग्री पर जाएँ"],
    "Thoughtfully selected goods, delivered to your door": ["যত্ন করে বাছাই করা পণ্য, পৌঁছে যাবে আপনার দরজায়", "सोच-समझकर चुने गए सामान, आपके दरवाज़े तक"],
    "Home": ["হোম", "होम"],
    "Shop all": ["সব পণ্য দেখুন", "सभी सामान देखें"],
    "Farm & garden": ["কৃষি ও বাগান", "खेती और बागवानी"],
    "Everyday goods": ["দৈনন্দিন পণ্য", "रोज़मर्रा के सामान"],
    "Everyday": ["দৈনন্দিন", "रोज़मर्रा के"],
    "draft": ["খসড়া", "मसौदा"],
    "archived": ["আর্কাইভ করা", "आर्काइव किया गया"],
    "customer": ["ক্রেতা", "ग्राहक"],
    "seller": ["বিক্রেতা", "विक्रेता"],
    "Account": ["অ্যাকাউন্ট", "खाता"],
    "Studio": ["স্টুডিও", "स्टूडियो"],
    "Cart": ["কার্ট", "कार्ट"],
    "Shop": ["দোকান", "दुकान"],
    "Farm": ["কৃষি", "खेती"],
    "Explore": ["ঘুরে দেখুন", "देखें"],
    "Help & policies": ["সহায়তা ও নীতিমালা", "सहायता और नीतियाँ"],
    "FAQs": ["সাধারণ প্রশ্ন", "अक्सर पूछे जाने वाले सवाल"],
    "Contact us": ["যোগাযোগ করুন", "संपर्क करें"],
    "My account": ["আমার অ্যাকাউন্ট", "मेरा खाता"],
    "Terms & conditions": ["শর্তাবলি", "नियम और शर्तें"],
    "Terms & Conditions": ["শর্তাবলি", "नियम और शर्तें"],
    "Privacy Policy": ["গোপনীয়তা নীতি", "गोपनीयता नीति"],
    "Data Privacy & Your Rights": ["তথ্যের গোপনীয়তা ও আপনার অধিকার", "डेटा गोपनीयता और आपके अधिकार"],
    "Seller dashboard": ["বিক্রেতার ড্যাশবোর্ড", "विक्रेता डैशबोर्ड"],
    "Privacy policy": ["গোপনীয়তা নীতি", "गोपनीयता नीति"],
    "Data privacy & rights": ["তথ্যের গোপনীয়তা ও অধিকার", "डेटा गोपनीयता और अधिकार"],
    "Good things, occasionally.": ["মাঝেমধ্যে ভালো কিছু খবর।", "कभी-कभी कुछ अच्छी ख़बरें।"],
    "Join our list for product news and seasonal updates.": ["পণ্যের খবর ও ঋতুভিত্তিক আপডেট পেতে আমাদের তালিকায় যোগ দিন।", "उत्पादों की खबरों और मौसमी अपडेट के लिए हमारी सूची से जुड़ें।"],
    "Your email address": ["আপনার ইমেল ঠিকানা", "आपका ईमेल पता"],
    "Subscribe": ["সাবস্ক্রাইব করুন", "सदस्यता लें"],
    "© Field & Found. Demo storefront.": ["© Field & Found। ডেমো অনলাইন স্টোর।", "© Field & Found। डेमो ऑनलाइन स्टोर।"],
    "Made for better everyday shopping.": ["প্রতিদিনের কেনাকাটাকে আরও ভালো করতে তৈরি।", "रोज़मर्रा की खरीदारी को बेहतर बनाने के लिए।"],
    "Done": ["সম্পন্ন", "हो गया"],
    "Toggle navigation": ["নেভিগেশন খুলুন বা বন্ধ করুন", "नेविगेशन खोलें या बंद करें"],
    "Shopping cart": ["কেনাকাটার কার্ট", "खरीदारी कार्ट"],
    "Primary mobile navigation": ["মোবাইলের প্রধান নেভিগেশন", "मोबाइल मुख्य नेविगेशन"],
    "Close": ["বন্ধ করুন", "बंद करें"],
    "Choose language": ["ভাষা নির্বাচন করুন", "भाषा चुनें"],

    "THE INDEPENDENT STORE": ["স্বতন্ত্র অনলাইন স্টোর", "स्वतंत्र ऑनलाइन स्टोर"],
    "Good things.": ["ভালো জিনিস।", "अच्छी चीज़ें।"],
    "Grown with care.": ["যত্নে ফলানো।", "देखभाल से उगाई गईं।"],
    "From the farm to your front door, discover useful essentials and things made to make everyday living a little better.": ["খামার থেকে আপনার দরজা পর্যন্ত—দৈনন্দিন জীবনকে আরও ভালো করতে বেছে নেওয়া দরকারি পণ্য ও প্রয়োজনীয় জিনিস আবিষ্কার করুন।", "खेत से आपके दरवाज़े तक—रोज़मर्रा की ज़िंदगी को बेहतर बनाने वाली उपयोगी और ज़रूरी चीज़ें खोजें।"],
    "Explore the shop": ["দোকান ঘুরে দেখুন", "दुकान देखें"],
    "Shop farm goods": ["কৃষিপণ্য কিনুন", "खेती के सामान देखें"],
    "Closer to": ["আরও কাছে", "और करीब"],
    "the source": ["উৎসের", "स्रोत के"],
    "Thoughtfully selected": ["যত্ন করে বাছাই করা", "सोच-समझकर चुने गए"],
    "Delivery to your door": ["আপনার দরজায় ডেলিভারি", "आपके दरवाज़े तक डिलीवरी"],
    "Secure shopping": ["নিরাপদ কেনাকাটা", "सुरक्षित खरीदारी"],
    "One independent seller": ["একজন স্বতন্ত্র বিক্রেতা", "एक स्वतंत्र विक्रेता"],
    "FIND YOUR SOMETHING": ["আপনার পছন্দের জিনিস খুঁজুন", "अपनी पसंद की चीज़ खोजें"],
    "Shop by": ["বিভাগ অনুযায়ী", "श्रेणी के अनुसार"],
    "category": ["বিভাগ", "श्रेणी"],
    "View everything": ["সবকিছু দেখুন", "सब कुछ देखें"],
    "Categories will appear here soon.": ["শিগগিরই এখানে বিভাগগুলো দেখা যাবে।", "श्रेणियाँ जल्द ही यहाँ दिखाई देंगी।"],
    "A FEW GOOD PICKS": ["বেছে নেওয়া কিছু ভালো পণ্য", "कुछ चुनिंदा अच्छे सामान"],
    "Featured": ["বিশেষভাবে বাছাই করা", "चुनिंदा"],
    "finds": ["পণ্য", "सामान"],
    "Shop featured": ["বিশেষ পণ্য দেখুন", "चुनिंदा सामान देखें"],
    "No featured products yet.": ["এখনও কোনো বিশেষ পণ্য যোগ করা হয়নি।", "अभी तक कोई चुनिंदा उत्पाद नहीं है।"],
    "A STORE WITH A POINT OF VIEW": ["নিজস্ব ভাবনার একটি স্টোর", "अपनी सोच वाली एक दुकान"],
    "Small details.": ["ছোট ছোট বিষয়।", "छोटी-छोटी बातें।"],
    "Meaningful choices.": ["অর্থবহ পছন্দ।", "मायने रखने वाले चुनाव।"],
    "We believe shopping should feel simple, honest and a little more personal. This independent store brings together carefully chosen farm products and everyday goods in one easy place.": ["আমরা বিশ্বাস করি কেনাকাটা হওয়া উচিত সহজ, স্বচ্ছ ও কিছুটা ব্যক্তিগত। এই স্বতন্ত্র স্টোরে যত্ন করে বাছাই করা কৃষিপণ্য ও দৈনন্দিন প্রয়োজনীয় জিনিস এক জায়গায় পাওয়া যায়।", "हमारा मानना है कि खरीदारी आसान, पारदर्शी और थोड़ी व्यक्तिगत होनी चाहिए। यह स्वतंत्र दुकान सोच-समझकर चुने गए कृषि उत्पादों और रोज़मर्रा के सामान को एक ही जगह लाती है।"],
    "Get to know the collection": ["আমাদের পণ্যের সংগ্রহ দেখুন", "हमारे उत्पादों का संग्रह देखें"],
    "JUST ARRIVED": ["একদম নতুন", "अभी-अभी आए"],
    "Fresh to the": ["স্টোরে নতুন", "दुकान में नए"],
    "store": ["পণ্য", "उत्पाद"],
    "Shop all products": ["সব পণ্য কিনুন", "सभी उत्पाद देखें"],
    "Products will appear here soon.": ["শিগগিরই এখানে পণ্য দেখা যাবে।", "उत्पाद जल्द ही यहाँ दिखाई देंगे।"],
    "BEHIND THE GOODS": ["পণ্যের পেছনের গল্প", "उत्पादों के पीछे की कहानी"],
    "Watch it from the": ["উৎস থেকে", "स्रोत से"],
    "source.": ["দেখুন।", "देखें।"],
    "Explore products": ["পণ্য ঘুরে দেখুন", "उत्पाद देखें"],
    "Product videos will appear here when the seller adds a YouTube link.": ["বিক্রেতা YouTube লিংক যোগ করলে এখানে পণ্যের ভিডিও দেখা যাবে।", "विक्रेता के YouTube लिंक जोड़ने पर उत्पादों के वीडियो यहाँ दिखाई देंगे।"],
    "A FEW ANSWERS": ["কিছু প্রশ্নের উত্তর", "कुछ सवालों के जवाब"],
    "Good to": ["জেনে", "जानना"],
    "know.": ["রাখুন।", "अच्छा है।"],
    "A few helpful things before you shop. Still curious? Get in touch with the store.": ["কেনাকাটার আগে কয়েকটি দরকারি তথ্য জেনে নিন। আরও কিছু জানতে চান? স্টোরের সঙ্গে যোগাযোগ করুন।", "खरीदारी से पहले कुछ उपयोगी बातें जान लें। कुछ और पूछना है? दुकान से संपर्क करें।"],
    "Ask us a question": ["আমাদের প্রশ্ন করুন", "हमसे सवाल पूछें"],
    "What kind of products can I shop here?": ["এখানে কী ধরনের পণ্য কিনতে পারি?", "मैं यहाँ किस तरह के उत्पाद खरीद सकता/सकती हूँ?"],
    "The store supports both agriculture and general merchandise, from farm produce and gardening supplies to everyday essentials.": ["এই স্টোরে কৃষিপণ্য ও সাধারণ পণ্য—খামারের ফসল, বাগানের সরঞ্জাম থেকে দৈনন্দিন প্রয়োজনীয় জিনিস—সবই পাওয়া যায়।", "इस दुकान में कृषि और सामान्य सामान दोनों मिलते हैं—खेत की उपज और बागवानी के सामान से लेकर रोज़मर्रा की ज़रूरतों तक।"],
    "How do I place an order?": ["কীভাবে অর্ডার করব?", "ऑर्डर कैसे दें?"],
    "Browse a product, choose the quantity and add it to your cart. Checkout and order placement will be enabled once the order backend is connected.": ["পণ্য দেখুন, পরিমাণ বেছে নিয়ে কার্টে যোগ করুন। অর্ডারের ব্যাকএন্ড যুক্ত হলে চেকআউট ও অর্ডার দেওয়ার সুবিধা চালু হবে।", "उत्पाद देखें, मात्रा चुनें और कार्ट में जोड़ें। ऑर्डर बैकएंड जुड़ने के बाद चेकआउट और ऑर्डर देने की सुविधा चालू होगी।"],
    "Can product images show different angles?": ["পণ্যের ছবিতে কি বিভিন্ন দিক দেখা যায়?", "क्या उत्पादों की तस्वीरों में अलग-अलग कोण दिखाए जा सकते हैं?"],
    "Yes. Product pages support multiple images with selectable thumbnails. Uploaded images are converted into optimized WebP sizes.": ["হ্যাঁ। পণ্যের পাতায় একাধিক ছবি ও সেগুলোর থাম্বনেইল বেছে দেখার সুবিধা আছে। আপলোড করা ছবি অপ্টিমাইজ করা WebP আকারে রূপান্তরিত হয়।", "हाँ। उत्पाद पेज पर कई तस्वीरें और चुनने योग्य थंबनेल उपलब्ध हैं। अपलोड की गई तस्वीरें अनुकूलित WebP आकारों में बदली जाती हैं।"],
    "How can I contact the seller?": ["বিক্রেতার সঙ্গে কীভাবে যোগাযোগ করব?", "विक्रेता से संपर्क कैसे करें?"],
    "Use the contact details published by the seller. The demo storefront currently uses a placeholder email which can be changed in the next settings milestone.": ["বিক্রেতার প্রকাশ করা যোগাযোগের তথ্য ব্যবহার করুন। ডেমো স্টোরে আপাতত একটি অস্থায়ী ইমেল ঠিকানা আছে, যা পরবর্তী সেটিংস আপডেটে বদলানো যাবে।", "विक्रेता द्वारा दी गई संपर्क जानकारी का उपयोग करें। डेमो दुकान में फिलहाल एक अस्थायी ईमेल पता है, जिसे अगले सेटिंग अपडेट में बदला जा सकता है।"],

    "THE COLLECTION": ["পণ্যের সংগ্রহ", "उत्पाद संग्रह"],
    "Find your": ["আপনার পছন্দের", "अपनी पसंद की"],
    "something.": ["জিনিস খুঁজুন।", "चीज़ खोजें।"],
    "Good things for the garden, the home and everything in between.": ["বাগান, ঘর ও দৈনন্দিন জীবনের জন্য ভালো ভালো জিনিস।", "बगीचे, घर और रोज़मर्रा की ज़िंदगी के लिए अच्छे सामान।"],
    "All product types": ["সব ধরনের পণ্য", "सभी प्रकार के उत्पाद"],
    "Newest first": ["নতুন পণ্য আগে", "नए उत्पाद पहले"],
    "Price: low to high": ["দাম: কম থেকে বেশি", "कीमत: कम से ज़्यादा"],
    "Price: high to low": ["দাম: বেশি থেকে কম", "कीमत: ज़्यादा से कम"],
    "Name: A to Z": ["নাম: বর্ণানুক্রমে", "नाम: वर्णक्रम में"],
    "Categories": ["বিভাগসমূহ", "श्रेणियाँ"],
    "All categories": ["সব বিভাগ", "सभी श्रेणियाँ"],
    "Quick links": ["দ্রুত লিংক", "त्वरित लिंक"],
    "All products": ["সব পণ্য", "सभी उत्पाद"],
    "No products match those filters. Try another search.": ["এই ফিল্টারগুলোর সঙ্গে মেলে এমন পণ্য নেই। অন্যভাবে খুঁজে দেখুন।", "इन फ़िल्टर से मेल खाने वाले उत्पाद नहीं मिले। कोई दूसरी खोज करें।"],
    "Search products": ["পণ্য খুঁজুন", "उत्पाद खोजें"],
    "breadcrumb": ["পথনির্দেশক নেভিগেশন", "ब्रेडक्रंब नेविगेशन"],
    "Product type": ["পণ্যের ধরন", "उत्पाद का प्रकार"],
    "Sort products": ["পণ্য সাজান", "उत्पाद क्रमबद्ध करें"],
    "Product pages": ["পণ্যের পৃষ্ঠা", "उत्पाद पृष्ठ"],

    "YOUR PICKS": ["আপনার বাছাই", "आपकी पसंद"],
    "Your": ["আপনার", "आपका"],
    "cart.": ["কার্ট।", "कार्ट।"],
    "A little collection of good things.": ["পছন্দের কিছু ভালো জিনিসের সংগ্রহ।", "अच्छी चीज़ों का एक छोटा-सा संग्रह।"],
    "Loading your cart…": ["আপনার কার্ট লোড হচ্ছে…", "आपका कार्ट लोड हो रहा है…"],
    "Order summary": ["অর্ডারের সারাংশ", "ऑर्डर का सारांश"],
    "Subtotal": ["উপমোট", "उप-योग"],
    "Delivery": ["ডেলিভারি", "डिलीवरी"],
    "Calculated at checkout": ["চেকআউটের সময় হিসাব হবে", "चेकआउट के समय गणना होगी"],
    "Total": ["মোট", "कुल"],
    "Continue to checkout": ["চেকআউটে এগিয়ে যান", "चेकआउट पर आगे बढ़ें"],
    "Checkout and order placement will be enabled in the next backend milestone.": ["পরবর্তী ব্যাকএন্ড আপডেটে চেকআউট ও অর্ডার দেওয়ার সুবিধা চালু হবে।", "अगले बैकएंड अपडेट में चेकआउट और ऑर्डर देने की सुविधा चालू होगी।"],
    "ALMOST THERE": ["আর মাত্র এক ধাপ", "बस एक कदम और"],
    "Checkout": ["চেকআউট", "चेकआउट"],
    "preview.": ["প্রিভিউ।", "प्रीव्यू।"],
    "Your delivery and payment details will be collected here.": ["আপনার ডেলিভারি ও পেমেন্টের তথ্য এখানে নেওয়া হবে।", "आपकी डिलीवरी और भुगतान की जानकारी यहाँ ली जाएगी।"],
    "Order placement is the next step.": ["পরবর্তী ধাপ হলো অর্ডার দেওয়া।", "अगला चरण ऑर्डर देना है।"],
    "The cart is working locally in your browser. We will connect address validation, delivery charges, Cash on Delivery, online payment and secure order creation after the order APIs are added.": ["কার্টটি আপাতত আপনার ব্রাউজারেই কাজ করছে। অর্ডার API যুক্ত হওয়ার পর ঠিকানা যাচাই, ডেলিভারি চার্জ, ক্যাশ অন ডেলিভারি, অনলাইন পেমেন্ট ও নিরাপদ অর্ডার তৈরির ব্যবস্থা যুক্ত হবে।", "फिलहाल कार्ट आपके ब्राउज़र में काम कर रहा है। ऑर्डर API जुड़ने के बाद पता सत्यापन, डिलीवरी शुल्क, कैश ऑन डिलीवरी, ऑनलाइन भुगतान और सुरक्षित ऑर्डर बनाने की सुविधा जोड़ी जाएगी।"],
    "Back to cart": ["কার্টে ফিরে যান", "कार्ट पर वापस जाएँ"],
    "Continue shopping": ["কেনাকাটা চালিয়ে যান", "खरीदारी जारी रखें"],

    "Video": ["ভিডিও", "वीडियो"],
    "Quantity": ["পরিমাণ", "मात्रा"],
    "Add to cart": ["কার্টে যোগ করুন", "कार्ट में जोड़ें"],
    "View cart": ["কার্ট দেখুন", "कार्ट देखें"],
    "Delivery details at checkout": ["চেকআউটে ডেলিভারির বিবরণ", "चेकआउट पर डिलीवरी का विवरण"],
    "Secure account and session": ["নিরাপদ অ্যাকাউন্ট ও সেশন", "सुरक्षित खाता और सेशन"],
    "Product description": ["পণ্যের বিবরণ", "उत्पाद विवरण"],
    "Available": ["পাওয়া যাচ্ছে", "उपलब्ध"],
    "Out of stock": ["স্টকে নেই", "स्टॉक में उपलब्ध नहीं"],
    "FARM & GARDEN": ["কৃষি ও বাগান", "खेती और बागवानी"],
    "EVERYDAY GOODS": ["দৈনন্দিন পণ্য", "रोज़मर्रा के सामान"],
    "View product image": ["পণ্যের ছবি দেখুন", "उत्पाद की तस्वीर देखें"],
    "Decrease quantity": ["পরিমাণ কমান", "मात्रा घटाएँ"],
    "Increase quantity": ["পরিমাণ বাড়ান", "मात्रा बढ़ाएँ"],
    "Watch video": ["ভিডিও দেখুন", "वीडियो देखें"],
    "Product unavailable": ["পণ্যটি পাওয়া যাচ্ছে না", "उत्पाद उपलब्ध नहीं है"],
    "Back to shop": ["দোকানে ফিরে যান", "दुकान पर वापस जाएँ"],
    "each": ["প্রতি পিস", "प्रति इकाई"],
    "Remove": ["সরিয়ে ফেলুন", "हटाएँ"],

    "WELCOME BACK": ["আবারও স্বাগতম", "वापसी पर स्वागत है"],
    "Good to see": ["আপনাকে দেখে", "आपको देखकर"],
    "you.": ["ভালো লাগছে।", "अच्छा लगा।"],
    "Sign in to manage your account and keep shopping.": ["আপনার অ্যাকাউন্ট পরিচালনা করতে ও কেনাকাটা চালিয়ে যেতে সাইন ইন করুন।", "अपना खाता संभालने और खरीदारी जारी रखने के लिए साइन इन करें।"],
    "Email address": ["ইমেল ঠিকানা", "ईमेल पता"],
    "Password": ["পাসওয়ার্ড", "पासवर्ड"],
    "Your secure session can remain active for up to 7 days on this device. Signing out ends it immediately.": ["এই ডিভাইসে আপনার নিরাপদ সেশন সর্বোচ্চ ৭ দিন সক্রিয় থাকতে পারে। সাইন আউট করলে সঙ্গে সঙ্গে সেশন শেষ হবে।", "इस डिवाइस पर आपका सुरक्षित सेशन अधिकतम 7 दिनों तक सक्रिय रह सकता है। साइन आउट करने पर यह तुरंत समाप्त हो जाएगा।"],
    "Sign in": ["সাইন ইন", "साइन इन करें"],
    "New around here?": ["এখানে নতুন?", "यहाँ नए हैं?"],
    "Create an account": ["অ্যাকাউন্ট তৈরি করুন", "खाता बनाएँ"],
    "Local demo seller": ["স্থানীয় ডেমো বিক্রেতা", "स्थानीय डेमो विक्रेता"],
    "For local testing only. Change these before sharing the app.": ["শুধু স্থানীয় পরীক্ষার জন্য। অ্যাপটি শেয়ার করার আগে এগুলো বদলে নিন।", "केवल स्थानीय परीक्षण के लिए। ऐप साझा करने से पहले इन्हें बदलें।"],
    "JOIN THE STORE": ["স্টোরে যোগ দিন", "दुकान से जुड़ें"],
    "Your good things": ["আপনার ভালো জিনিসের", "आपकी अच्छी चीज़ों की"],
    "start here.": ["শুরু এখানেই।", "शुरुआत यहाँ से।"],
    "Create an account to save your details and keep track of future orders.": ["আপনার তথ্য সংরক্ষণ ও ভবিষ্যতের অর্ডারের খবর রাখতে একটি অ্যাকাউন্ট তৈরি করুন।", "अपनी जानकारी सहेजने और भविष्य के ऑर्डर पर नज़र रखने के लिए खाता बनाएँ।"],
    "Full name": ["পুরো নাম", "पूरा नाम"],
    "Mobile number (optional)": ["মোবাইল নম্বর (ঐচ্ছিক)", "मोबाइल नंबर (वैकल्पिक)"],
    "At least 10 characters, including letters and numbers.": ["অক্ষর ও সংখ্যা মিলিয়ে অন্তত ১০টি অক্ষর দিন।", "अक्षरों और अंकों सहित कम से कम 10 वर्ण होने चाहिए।"],
    "Confirm password": ["পাসওয়ার্ড নিশ্চিত করুন", "पासवर्ड की पुष्टि करें"],
    "Already have an account?": ["আগে থেকেই অ্যাকাউন্ট আছে?", "पहले से खाता है?"],
    "Sign out": ["সাইন আউট", "साइन आउट करें"],

    "YOUR ACCOUNT": ["আপনার অ্যাকাউন্ট", "आपका खाता"],
    "Hello,": ["হ্যালো,", "नमस्ते,"],
    "there.": ["আপনাকে স্বাগতম।", "आपका स्वागत है।"],
    "Manage your profile and saved delivery address.": ["আপনার প্রোফাইল ও সংরক্ষিত ডেলিভারি ঠিকানা পরিচালনা করুন।", "अपनी प्रोफ़ाइल और सहेजा गया डिलीवरी पता संभालें।"],
    "Customer": ["ক্রেতা", "ग्राहक"],
    "PERSONAL DETAILS": ["ব্যক্তিগত তথ্য", "व्यक्तिगत जानकारी"],
    "My": ["আমার", "मेरा"],
    "profile.": ["প্রোফাইল।", "प्रोफ़ाइल।"],
    "Your details are private and can be changed whenever you need.": ["আপনার তথ্য গোপনীয়; প্রয়োজন অনুযায়ী যেকোনো সময় বদলাতে পারবেন।", "आपकी जानकारी निजी है और ज़रूरत पड़ने पर कभी भी बदली जा सकती है।"],
    "Your name": ["আপনার নাম", "आपका नाम"],
    "Mobile number": ["মোবাইল নম্বর", "मोबाइल नंबर"],
    "Email address is used for sign-in and is not changed here.": ["সাইন ইন করার জন্য ইমেল ঠিকানা ব্যবহার করা হয়; এখানে এটি পরিবর্তন করা যাবে না।", "साइन इन के लिए ईमेल पते का उपयोग होता है और इसे यहाँ बदला नहीं जा सकता।"],
    "INDIA DELIVERY ADDRESS": ["ভারতের ডেলিভারি ঠিকানা", "भारत का डिलीवरी पता"],
    "address.": ["ঠিকানা।", "पता।"],
    "Add the details you want to keep for future delivery. Every address field is optional.": ["ভবিষ্যতে ডেলিভারির জন্য যে তথ্য রাখতে চান তা যোগ করুন। ঠিকানার প্রতিটি ঘর ঐচ্ছিক।", "भविष्य की डिलीवरी के लिए जो जानकारी सहेजना चाहते हैं, वह जोड़ें। पते का हर फ़ील्ड वैकल्पिक है।"],
    "Address label": ["ঠিকানার পরিচিতি", "पते का लेबल"],
    "Choose a label (optional)": ["একটি পরিচিতি বেছে নিন (ঐচ্ছিক)", "एक लेबल चुनें (वैकल्पिक)"],
    "Work": ["কর্মস্থল", "ऑफिस"],
    "Other": ["অন্যান্য", "अन्य"],
    "Receiver's name": ["প্রাপকের নাম", "प्राप्तकर्ता का नाम"],
    "Receiver's mobile": ["প্রাপকের মোবাইল", "प्राप्तकर्ता का मोबाइल"],
    "House / Flat / Building": ["বাড়ি / ফ্ল্যাট / ভবন", "मकान / फ्लैट / इमारत"],
    "Street / Road / Area": ["রাস্তা / রোড / এলাকা", "गली / सड़क / इलाका"],
    "Landmark": ["পরিচিত স্থান", "पहचान का स्थान"],
    "Locality / Neighbourhood": ["পাড়া / মহল্লা", "इलाका / पड़ोस"],
    "City / Town / Village": ["শহর / মফস্বল / গ্রাম", "शहर / कस्बा / गाँव"],
    "District": ["জেলা", "ज़िला"],
    "State / Union Territory": ["রাজ্য / কেন্দ্রশাসিত অঞ্চল", "राज्य / केंद्र शासित प्रदेश"],
    "Choose state / UT (optional)": ["রাজ্য / কেন্দ্রশাসিত অঞ্চল বেছে নিন (ঐচ্ছিক)", "राज्य / केंद्र शासित प्रदेश चुनें (वैकल्पिक)"],
    "PIN Code": ["পিন কোড", "पिन कोड"],
    "For India, enter a 6-digit PIN code. This field is optional.": ["ভারতের জন্য ৬ সংখ্যার পিন কোড দিন। এই ঘরটি ঐচ্ছিক।", "भारत के लिए 6 अंकों का पिन कोड दर्ज करें। यह फ़ील्ड वैकल्पिक है।"],
    "Country": ["দেশ", "देश"],
    "Country (optional)": ["দেশ (ঐচ্ছিক)", "देश (वैकल्पिक)"],
    "Save profile & address": ["প্রোফাইল ও ঠিকানা সংরক্ষণ করুন", "प्रोफ़ाइल और पता सहेजें"],
    "My orders": ["আমার অর্ডার", "मेरे ऑर्डर"],
    "Order history and tracking will appear here when the order backend is connected.": ["অর্ডারের ব্যাকএন্ড যুক্ত হলে এখানে অর্ডারের ইতিহাস ও ট্র্যাকিং দেখা যাবে।", "ऑर्डर बैकएंड जुड़ने पर यहाँ ऑर्डर का इतिहास और ट्रैकिंग दिखाई देगी।"],
    "Coming in the next milestone": ["পরবর্তী আপডেটে আসছে", "अगले अपडेट में उपलब्ध होगा"],
    "Saved addresses": ["সংরক্ষিত ঠিকানা", "सहेजे गए पते"],
    "Your address details are saved privately with your account for future checkout use.": ["ভবিষ্যতে চেকআউটে ব্যবহারের জন্য আপনার ঠিকানার তথ্য অ্যাকাউন্টে ব্যক্তিগতভাবে সংরক্ষিত থাকে।", "भविष्य के चेकआउट के लिए आपके पते की जानकारी आपके खाते में निजी रूप से सहेजी जाती है।"],
    "One profile delivery address": ["প্রোফাইলে একটি ডেলিভারি ঠিকানা", "प्रोफ़ाइल में एक डिलीवरी पता"],
    "Optional phone number": ["ঐচ্ছিক ফোন নম্বর", "वैकल्पिक फ़ोन नंबर"],
    "Name on the parcel": ["পার্সেলে যে নাম থাকবে", "पार्सल पर लिखा जाने वाला नाम"],
    "Optional mobile number": ["ঐচ্ছিক মোবাইল নম্বর", "वैकल्पिक मोबाइल नंबर"],
    "Flat, house number, building": ["ফ্ল্যাট, বাড়ি নম্বর, ভবন", "फ्लैट, मकान नंबर, इमारत"],
    "Street, road or area": ["রাস্তা, রোড বা এলাকা", "गली, सड़क या इलाका"],
    "Nearby landmark (optional)": ["কাছাকাছি পরিচিত স্থান (ঐচ্ছিক)", "नज़दीकी पहचान का स्थान (वैकल्पिक)"],
    "Locality or neighbourhood": ["পাড়া বা মহল্লা", "इलाका या पड़ोस"],
    "City, town or village": ["শহর, মফস্বল বা গ্রাম", "शहर, कस्बा या गाँव"],
    "6-digit PIN code": ["৬ সংখ্যার পিন কোড", "6 अंकों का पिन कोड"],
    "সব ফিল্ড Optional। যতটুকু তথ্য দেবেন, ততটুকুই আপনার প্রোফাইলে সেভ হবে। পরে চাইলে পরিবর্তন করতে পারবেন।": ["All fields are optional. Only the information you provide will be saved to your profile. You can change it later.", "सभी फ़ील्ड वैकल्पिक हैं। आप जितनी जानकारी देंगे, उतनी ही आपकी प्रोफ़ाइल में सहेजी जाएगी। आप इसे बाद में बदल सकते हैं।"],

    "STORE MANAGEMENT": ["স্টোর পরিচালনা", "दुकान प्रबंधन"],
    "Seller": ["বিক্রেতা", "विक्रेता"],
    "studio.": ["স্টুডিও।", "स्टूडियो।"],
    "Manage your product catalogue from one place.": ["এক জায়গা থেকে আপনার পণ্যের তালিকা পরিচালনা করুন।", "एक ही जगह से अपनी उत्पाद सूची संभालें।"],
    "Seller access active": ["বিক্রেতার অ্যাক্সেস চালু", "विक्रेता एक्सेस सक्रिय"],
    "Total products": ["মোট পণ্য", "कुल उत्पाद"],
    "Published": ["প্রকাশিত", "प्रकाशित"],
    "YOUR CATALOGUE": ["আপনার পণ্যের তালিকা", "आपकी उत्पाद सूची"],
    "Products": ["পণ্যসমূহ", "उत्पाद"],
    "＋ Add a product": ["＋ পণ্য যোগ করুন", "＋ उत्पाद जोड़ें"],
    "Add a product": ["একটি পণ্য যোগ করুন", "एक उत्पाद जोड़ें"],
    "Add product details and up to 8 product images.": ["পণ্যের বিবরণ ও সর্বোচ্চ ৮টি ছবি যোগ করুন।", "उत्पाद का विवरण और अधिकतम 8 तस्वीरें जोड़ें।"],
    "New listing": ["নতুন তালিকা", "नई लिस्टिंग"],
    "Product name": ["পণ্যের নাম", "उत्पाद का नाम"],
    "Category": ["বিভাগ", "श्रेणी"],
    "Choose a category": ["একটি বিভাগ বেছে নিন", "एक श्रेणी चुनें"],
    "Price (₹)": ["দাম (₹)", "कीमत (₹)"],
    "Compare at (₹)": ["তুলনামূলক দাম (₹)", "तुलना मूल्य (₹)"],
    "Stock quantity": ["স্টকের পরিমাণ", "स्टॉक की मात्रा"],
    "Brand / farm name": ["ব্র্যান্ড / খামারের নাম", "ब्रांड / खेत का नाम"],
    "Short description": ["সংক্ষিপ্ত বিবরণ", "संक्षिप्त विवरण"],
    "Full description": ["সম্পূর্ণ বিবরণ", "पूरा विवरण"],
    "Product images (1–8)": ["পণ্যের ছবি (১–৮টি)", "उत्पाद की तस्वीरें (1–8)"],
    "Images are converted to WebP in 320px, 640px and 1200px sizes.": ["ছবিগুলো ৩২০px, ৬৪০px ও ১২০০px মাপে WebP-তে রূপান্তরিত হয়।", "तस्वीरें 320px, 640px और 1200px आकारों में WebP में बदली जाती हैं।"],
    "YouTube video URL (optional)": ["YouTube ভিডিও URL (ঐচ্ছিক)", "YouTube वीडियो URL (वैकल्पिक)"],
    "Paste a YouTube video, Shorts, youtu.be or embed link. Shorts are detected automatically.": ["YouTube ভিডিও, Shorts, youtu.be বা embed লিংক পেস্ট করুন। Shorts স্বয়ংক্রিয়ভাবে শনাক্ত হবে।", "YouTube वीडियो, Shorts, youtu.be या embed लिंक पेस्ट करें। Shorts अपने-आप पहचाने जाएँगे।"],
    "Video title (optional)": ["ভিডিওর শিরোনাম (ঐচ্ছিক)", "वीडियो का शीर्षक (वैकल्पिक)"],
    "Video layout": ["ভিডিওর বিন্যাস", "वीडियो का लेआउट"],
    "Automatic (detect Shorts)": ["স্বয়ংক্রিয় (Shorts শনাক্ত করুন)", "अपने-आप (Shorts पहचानें)"],
    "Vertical Shorts (9:16)": ["উল্লম্ব Shorts (9:16)", "वर्टिकल Shorts (9:16)"],
    "Landscape video (16:9)": ["আড়াআড়ি ভিডিও (16:9)", "लैंडस्केप वीडियो (16:9)"],
    "Or upload a video file": ["অথবা ভিডিও ফাইল আপলোড করুন", "या वीडियो फ़ाइल अपलोड करें"],
    "MP4/WebM, maximum 50 MB. Use either a YouTube link or an upload, not both.": ["MP4/WebM, সর্বোচ্চ ৫০ MB। YouTube লিংক অথবা আপলোড—যেকোনো একটি ব্যবহার করুন, দুটো একসঙ্গে নয়।", "MP4/WebM, अधिकतम 50 MB। YouTube लिंक या अपलोड में से कोई एक चुनें, दोनों नहीं।"],
    "Feature this product on the homepage": ["হোমপেজে এই পণ্যটি ফিচার করুন", "इस उत्पाद को होमपेज पर दिखाएँ"],
    "Clear": ["মুছে ফেলুন", "साफ़ करें"],
    "Publish product": ["পণ্য প্রকাশ করুন", "उत्पाद प्रकाशित करें"],
    "Product": ["পণ্য", "उत्पाद"],
    "Type": ["ধরন", "प्रकार"],
    "Price": ["দাম", "कीमत"],
    "Stock": ["স্টক", "स्टॉक"],
    "Status": ["অবস্থা", "स्थिति"],
    "Loading products…": ["পণ্য লোড হচ্ছে…", "उत्पाद लोड हो रहे हैं…"],
    "Archive": ["আর্কাইভ করুন", "आर्काइव करें"],
    "No products yet. Add your first product above.": ["এখনও কোনো পণ্য নেই। উপরে আপনার প্রথম পণ্য যোগ করুন।", "अभी कोई उत्पाद नहीं है। ऊपर अपना पहला उत्पाद जोड़ें।"],

    "THE IMPORTANT DETAILS": ["গুরুত্বপূর্ণ তথ্য", "महत्वपूर्ण जानकारी"],
    "Terms &": ["শর্তাবলি ও", "नियम और"],
    "conditions.": ["নিয়ম।", "शर्तें।"],
    "How this website may be used and what to know before shopping.": ["এই ওয়েবসাইট কীভাবে ব্যবহার করবেন এবং কেনাকাটার আগে কী জানা দরকার।", "इस वेबसाइट का उपयोग कैसे करें और खरीदारी से पहले क्या जानना ज़रूरी है।"],
    "Last updated: 31 October 2026": ["সর্বশেষ হালনাগাদ: ৩১ অক্টোবর ২০২৬", "अंतिम अपडेट: 31 अक्टूबर 2026"],
    "Pre-launch notice:": ["চালুর আগের বিজ্ঞপ্তি:", "लॉन्च से पहले की सूचना:"],
    "This website is currently a demonstration storefront. The checkout is a preview only; it does not create an order or accept payment. Do not submit payment details or rely on a product listing as an accepted order.": ["এই ওয়েবসাইটটি বর্তমানে একটি ডেমো অনলাইন স্টোর। চেকআউটটি শুধুমাত্র প্রিভিউ; এখানে কোনো অর্ডার তৈরি হয় না বা পেমেন্ট গ্রহণ করা হয় না। পেমেন্টের তথ্য দেবেন না এবং পণ্যের তালিকাকে নিশ্চিত অর্ডার বলে ধরে নেবেন না।", "यह वेबसाइट अभी एक डेमो ऑनलाइन दुकान है। चेकआउट केवल प्रीव्यू है; इससे कोई ऑर्डर नहीं बनता और भुगतान स्वीकार नहीं किया जाता। भुगतान की जानकारी न दें और उत्पाद सूची को पक्का ऑर्डर न समझें।"],
    "1. Who operates this website": ["১. এই ওয়েবসাইট কে পরিচালনা করে", "1. इस वेबसाइट का संचालन कौन करता है"],
    "Field & Found is the storefront name. The seller or legal entity operating the store must be identified before the website is opened for public transactions.": ["Field & Found হলো স্টোরের নাম। জনসাধারণের জন্য লেনদেন চালুর আগে স্টোর পরিচালনাকারী বিক্রেতা বা আইনি প্রতিষ্ঠানের পরিচয় উল্লেখ করতে হবে।", "Field & Found दुकान का नाम है। सार्वजनिक लेन-देन शुरू करने से पहले दुकान चलाने वाले विक्रेता या कानूनी संस्था की पहचान बताना ज़रूरी है।"],
    "Seller / legal business name": ["বিক্রেতা / আইনি ব্যবসার নাম", "विक्रेता / कानूनी व्यवसाय का नाम"],
    "Business address": ["ব্যবসার ঠিকানা", "व्यवसाय का पता"],
    "Customer support": ["ক্রেতা সহায়তা", "ग्राहक सहायता"],
    "Governing law and jurisdiction": ["প্রযোজ্য আইন ও বিচারক্ষেত্র", "लागू कानून और न्याय-क्षेत्र"],
    "2. Website use and accounts": ["২. ওয়েবসাইট ব্যবহার ও অ্যাকাউন্ট", "2. वेबसाइट का उपयोग और खाते"],
    "You must provide accurate account information, keep your password confidential and promptly notify the seller if you suspect unauthorised account use. You may not misuse the website, attempt to bypass security controls, interfere with its operation or upload unlawful or harmful content.": ["আপনাকে সঠিক অ্যাকাউন্টের তথ্য দিতে হবে, পাসওয়ার্ড গোপন রাখতে হবে এবং অ্যাকাউন্টের অননুমোদিত ব্যবহার সন্দেহ হলে দ্রুত বিক্রেতাকে জানাতে হবে। ওয়েবসাইটের অপব্যবহার, নিরাপত্তা ব্যবস্থা এড়ানোর চেষ্টা, কার্যক্রমে বাধা দেওয়া বা বেআইনি/ক্ষতিকর কনটেন্ট আপলোড করা যাবে না।", "आपको खाते की सही जानकारी देनी होगी, पासवर्ड गोपनीय रखना होगा और खाते के अनधिकृत उपयोग का संदेह होने पर विक्रेता को तुरंत सूचित करना होगा। वेबसाइट का दुरुपयोग करना, सुरक्षा उपायों को दरकिनार करना, इसके संचालन में बाधा डालना या गैर-कानूनी/हानिकारक सामग्री अपलोड करना मना है।"],
    "3. Product information, prices and availability": ["৩. পণ্যের তথ্য, দাম ও প্রাপ্যতা", "3. उत्पाद की जानकारी, कीमतें और उपलब्धता"],
    "Product names, descriptions, images, specifications, stock and prices are displayed for information. Demo content may be illustrative and must be replaced with verified seller information before launch. Product images may be representative; the seller should disclose material differences, measurements, ingredients, origin and other legally required details for each real product.": ["পণ্যের নাম, বিবরণ, ছবি, বৈশিষ্ট্য, স্টক ও দাম তথ্যের জন্য দেখানো হয়। ডেমো কনটেন্ট উদাহরণ হিসেবে থাকতে পারে এবং চালুর আগে যাচাই করা বিক্রেতার তথ্য দিয়ে বদলাতে হবে। পণ্যের ছবি প্রতিনিধিত্বমূলক হতে পারে; প্রতিটি আসল পণ্যের গুরুত্বপূর্ণ পার্থক্য, মাপ, উপাদান, উৎপত্তি ও আইনত প্রয়োজনীয় অন্যান্য তথ্য বিক্রেতাকে জানাতে হবে।", "उत्पादों के नाम, विवरण, तस्वीरें, विशेषताएँ, स्टॉक और कीमतें जानकारी के लिए दिखाई जाती हैं। डेमो सामग्री केवल उदाहरण हो सकती है और लॉन्च से पहले विक्रेता की सत्यापित जानकारी से बदली जानी चाहिए। तस्वीरें केवल प्रतिनिधि हो सकती हैं; विक्रेता को हर वास्तविक उत्पाद के महत्वपूर्ण अंतर, माप, सामग्री, उत्पत्ति और कानूनन आवश्यक अन्य विवरण बताने चाहिए।"],
    "Prices, applicable taxes, delivery charges, discounts and stock must be confirmed before any future order is accepted. A product displayed on this pre-launch website is not a promise that it is currently available for purchase.": ["ভবিষ্যতে কোনো অর্ডার গ্রহণের আগে দাম, প্রযোজ্য কর, ডেলিভারি চার্জ, ছাড় ও স্টকের অবস্থা নিশ্চিত করতে হবে। এই প্রি-লঞ্চ ওয়েবসাইটে কোনো পণ্য দেখানো মানেই সেটি বর্তমানে কেনার জন্য উপলভ্য—এমন প্রতিশ্রুতি নয়।", "भविष्य में कोई ऑर्डर स्वीकार करने से पहले कीमत, लागू कर, डिलीवरी शुल्क, छूट और स्टॉक की पुष्टि करनी होगी। इस प्री-लॉन्च वेबसाइट पर किसी उत्पाद का दिखना यह वादा नहीं है कि वह अभी खरीदने के लिए उपलब्ध है।"],
    "4. Orders, payment, shipping and returns": ["৪. অর্ডার, পেমেন্ট, শিপিং ও ফেরত", "4. ऑर्डर, भुगतान, शिपिंग और वापसी"],
    "Online order placement, payment processing, shipping calculations, cancellation and returns workflows are not yet connected. No purchase contract is formed through the current checkout preview. Before accepting real orders, the seller must publish accurate payment, delivery, cancellation, refund, replacement and return terms, including any product-specific or statutory exceptions.": ["অনলাইনে অর্ডার দেওয়া, পেমেন্ট প্রক্রিয়াকরণ, শিপিংয়ের হিসাব, অর্ডার বাতিল ও পণ্য ফেরতের ব্যবস্থা এখনও যুক্ত হয়নি। বর্তমান চেকআউট প্রিভিউয়ের মাধ্যমে কোনো ক্রয়চুক্তি তৈরি হয় না। আসল অর্ডার নেওয়ার আগে বিক্রেতাকে পেমেন্ট, ডেলিভারি, বাতিল, রিফান্ড, বদলি ও ফেরতের সঠিক শর্ত প্রকাশ করতে হবে; পণ্যভিত্তিক বা আইনগত ব্যতিক্রম থাকলে সেগুলিও জানাতে হবে।", "ऑनलाइन ऑर्डर देना, भुगतान प्रक्रिया, शिपिंग की गणना, रद्दीकरण और वापसी की सुविधाएँ अभी जुड़ी नहीं हैं। मौजूदा चेकआउट प्रीव्यू से कोई खरीद अनुबंध नहीं बनता। वास्तविक ऑर्डर स्वीकार करने से पहले विक्रेता को भुगतान, डिलीवरी, रद्दीकरण, रिफंड, बदलने और वापसी की सही शर्तें प्रकाशित करनी होंगी, जिनमें उत्पाद-विशेष या कानूनी अपवाद भी शामिल हों।"],
    "5. Intellectual property": ["৫. মেধাস্বত্ব", "5. बौद्धिक संपदा"],
    "Website design, branding, text and software are protected by applicable intellectual-property laws. Product names, marks and images may belong to their respective owners. You may not copy or commercially reuse content without permission from its rights holder.": ["ওয়েবসাইটের নকশা, ব্র্যান্ডিং, লেখা ও সফটওয়্যার প্রযোজ্য মেধাস্বত্ব আইনে সুরক্ষিত। পণ্যের নাম, ট্রেডমার্ক ও ছবি সংশ্লিষ্ট মালিকের হতে পারে। অধিকারীর অনুমতি ছাড়া কোনো কনটেন্ট কপি বা বাণিজ্যিকভাবে পুনর্ব্যবহার করা যাবে না।", "वेबसाइट का डिज़ाइन, ब्रांडिंग, पाठ और सॉफ़्टवेयर लागू बौद्धिक संपदा कानूनों से सुरक्षित हैं। उत्पादों के नाम, चिह्न और तस्वीरें उनके संबंधित मालिकों की हो सकती हैं। अधिकार-धारक की अनुमति के बिना सामग्री की नकल या व्यावसायिक पुनः उपयोग नहीं किया जा सकता।"],
    "6. Third-party services and availability": ["৬. তৃতীয় পক্ষের পরিষেবা ও প্রাপ্যতা", "6. तृतीय-पक्ष सेवाएँ और उपलब्धता"],
    "The website may rely on hosting, database, content-delivery and other service providers. The seller will take reasonable steps to maintain availability and security, but uninterrupted access cannot be guaranteed.": ["ওয়েবসাইটটি হোস্টিং, ডেটাবেস, কনটেন্ট ডেলিভারি ও অন্যান্য পরিষেবা প্রদানকারীর ওপর নির্ভর করতে পারে। প্রাপ্যতা ও নিরাপত্তা বজায় রাখতে বিক্রেতা যুক্তিসংগত পদক্ষেপ নেবেন, তবে নিরবচ্ছিন্ন প্রবেশাধিকার নিশ্চিত করা যায় না।", "वेबसाइट होस्टिंग, डेटाबेस, कंटेंट डिलीवरी और अन्य सेवा प्रदाताओं पर निर्भर हो सकती है। उपलब्धता और सुरक्षा बनाए रखने के लिए विक्रेता उचित कदम उठाएगा, लेकिन बिना रुकावट पहुँच की गारंटी नहीं दी जा सकती।"],
    "7. Liability and changes": ["৭. দায়বদ্ধতা ও পরিবর্তন", "7. दायित्व और बदलाव"],
    "Nothing in these terms excludes a right or remedy that cannot lawfully be excluded. To the extent permitted by applicable law, the seller is not responsible for indirect loss arising from use of a demonstration or temporarily unavailable website. These terms should be reviewed and adapted before public commerce begins.": ["এই শর্তাবলির কোনো কিছুই এমন অধিকার বা প্রতিকার বাতিল করে না, যা আইনত বাতিল করা যায় না। প্রযোজ্য আইনে যতটা অনুমোদিত, ডেমো বা সাময়িকভাবে অপ্রাপ্য ওয়েবসাইট ব্যবহারের ফলে হওয়া পরোক্ষ ক্ষতির জন্য বিক্রেতা দায়ী থাকবেন না। জনসাধারণের জন্য বাণিজ্য শুরুর আগে এই শর্তাবলি পর্যালোচনা ও সংশোধন করতে হবে।", "इन शर्तों की कोई बात ऐसे अधिकार या उपाय को समाप्त नहीं करती जिसे कानूनन समाप्त नहीं किया जा सकता। लागू कानून की अनुमति तक, डेमो या अस्थायी रूप से अनुपलब्ध वेबसाइट के उपयोग से होने वाले अप्रत्यक्ष नुकसान के लिए विक्रेता ज़िम्मेदार नहीं होगा। सार्वजनिक व्यापार शुरू होने से पहले इन शर्तों की समीक्षा और संशोधन किया जाना चाहिए।"],
    "8. Contact and complaints": ["৮. যোগাযোগ ও অভিযোগ", "8. संपर्क और शिकायतें"],
    "This starter text is general information, not legal advice or a declaration of legal compliance. The seller must adapt it to the actual business, products, sales process and applicable jurisdictions and obtain professional review.": ["এই প্রাথমিক লেখাটি সাধারণ তথ্য, আইনি পরামর্শ বা আইন মেনে চলার ঘোষণা নয়। বিক্রেতাকে প্রকৃত ব্যবসা, পণ্য, বিক্রয়প্রক্রিয়া ও প্রযোজ্য বিচারক্ষেত্র অনুযায়ী এটি মানিয়ে নিতে হবে এবং পেশাদার পর্যালোচনা নিতে হবে।", "यह प्रारंभिक पाठ सामान्य जानकारी है, कानूनी सलाह या कानूनी अनुपालन की घोषणा नहीं। विक्रेता को इसे वास्तविक व्यवसाय, उत्पादों, बिक्री प्रक्रिया और लागू न्याय-क्षेत्रों के अनुसार ढालना होगा और पेशेवर समीक्षा लेनी होगी।"],

    "YOUR INFORMATION": ["আপনার তথ্য", "आपकी जानकारी"],
    "Privacy": ["গোপনীয়তা", "गोपनीयता"],
    "policy.": ["নীতি।", "नीति।"],
    "How the current Field & Found website handles personal information.": ["Field & Found ওয়েবসাইট বর্তমানে ব্যক্তিগত তথ্য কীভাবে ব্যবহার করে।", "Field & Found की वेबसाइट अभी व्यक्तिगत जानकारी को कैसे संभालती है।"],
    "This policy describes the current pre-launch website implementation. It must be updated before enabling real orders, payments, analytics, advertising, newsletter subscriptions or additional third-party services.": ["এই নীতিতে ওয়েবসাইটের বর্তমান প্রি-লঞ্চ ব্যবস্থা বর্ণনা করা হয়েছে। আসল অর্ডার, পেমেন্ট, অ্যানালিটিক্স, বিজ্ঞাপন, নিউজলেটার সাবস্ক্রিপশন বা অতিরিক্ত তৃতীয় পক্ষের পরিষেবা চালুর আগে এটি হালনাগাদ করতে হবে।", "यह नीति वेबसाइट के मौजूदा प्री-लॉन्च सेटअप का वर्णन करती है। वास्तविक ऑर्डर, भुगतान, एनालिटिक्स, विज्ञापन, न्यूज़लेटर सदस्यता या अतिरिक्त तृतीय-पक्ष सेवाएँ शुरू करने से पहले इसे अपडेट करना होगा।"],
    "1. Who is responsible for your information": ["১. আপনার তথ্যের দায়িত্ব কার", "1. आपकी जानकारी के लिए कौन ज़िम्मेदार है"],
    "The storefront is operated under the name Field & Found. The seller or legal entity responsible for personal information must be identified as follows:": ["এই অনলাইন স্টোরটি Field & Found নামে পরিচালিত হয়। ব্যক্তিগত তথ্যের জন্য দায়ী বিক্রেতা বা আইনি প্রতিষ্ঠানের পরিচয় নিচের মতো উল্লেখ করতে হবে:", "यह ऑनलाइन दुकान Field & Found नाम से चलती है। व्यक्तिगत जानकारी के लिए ज़िम्मेदार विक्रेता या कानूनी संस्था की पहचान इस प्रकार बताई जानी चाहिए:"],
    "Seller / data controller contact": ["বিক্রেতা / ডেটা কন্ট্রোলারের যোগাযোগ", "विक्रेता / डेटा नियंत्रक का संपर्क"],
    "Privacy contact": ["গোপনীয়তা সংক্রান্ত যোগাযোগ", "गोपनीयता संपर्क"],
    "Grievance contact": ["অভিযোগ সংক্রান্ত যোগাযোগ", "शिकायत संपर्क"],
    "2. Information the current website handles": ["২. ওয়েবসাইট বর্তমানে যে তথ্য ব্যবহার করে", "2. वेबसाइट अभी कौन-सी जानकारी संभालती है"],
    "Account details:": ["অ্যাকাউন্টের তথ্য:", "खाते का विवरण:"],
    "name, email address and optional phone number supplied during registration or profile editing.": ["নিবন্ধন বা প্রোফাইল সম্পাদনার সময় দেওয়া নাম, ইমেল ঠিকানা ও ঐচ্ছিক ফোন নম্বর।", "पंजीकरण या प्रोफ़ाइल संपादन के समय दिया गया नाम, ईमेल पता और वैकल्पिक फ़ोन नंबर।"],
    "Saved delivery address:": ["সংরক্ষিত ডেলিভারি ঠিকানা:", "सहेजा गया डिलीवरी पता:"],
    "any optional recipient, house/flat, street/area, landmark, locality, city, district, state, PIN code and country details that you choose to save in your profile.": ["প্রোফাইলে সংরক্ষণ করতে বেছে নেওয়া প্রাপকের নাম, বাড়ি/ফ্ল্যাট, রাস্তা/এলাকা, পরিচিত স্থান, পাড়া, শহর, জেলা, রাজ্য, পিন কোড ও দেশের যেকোনো ঐচ্ছিক তথ্য।", "प्रोफ़ाइल में सहेजने के लिए चुनी गई प्राप्तकर्ता, मकान/फ्लैट, सड़क/इलाका, पहचान-चिह्न, क्षेत्र, शहर, ज़िला, राज्य, पिन कोड और देश की वैकल्पिक जानकारी।"],
    "Authentication and security:": ["প্রমাণীকরণ ও নিরাপত্তা:", "प्रमाणीकरण और सुरक्षा:"],
    "password hashes (not plain-text passwords), session identifiers, CSRF/security tokens and login activity needed to operate and protect accounts.": ["পাসওয়ার্ডের হ্যাশ (সাধারণ লেখা পাসওয়ার্ড নয়), সেশন আইডি, CSRF/নিরাপত্তা টোকেন এবং অ্যাকাউন্ট পরিচালনা ও সুরক্ষার জন্য প্রয়োজনীয় লগইন কার্যকলাপ।", "पासवर्ड हैश (साधारण टेक्स्ट पासवर्ड नहीं), सेशन पहचानकर्ता, CSRF/सुरक्षा टोकन और खातों को चलाने व सुरक्षित रखने के लिए आवश्यक लॉगिन गतिविधि।"],
    "Shopping cart:": ["কেনাকাটার কার্ট:", "खरीदारी कार्ट:"],
    "the current cart is stored in your browser's local storage. It is not currently submitted to a server as an order.": ["বর্তমান কার্ট আপনার ব্রাউজারের লোকাল স্টোরেজে থাকে। এটি এখনই অর্ডার হিসেবে সার্ভারে পাঠানো হয় না।", "मौजूदा कार्ट आपके ब्राउज़र के लोकल स्टोरेज में रहता है। इसे अभी ऑर्डर के रूप में सर्वर पर नहीं भेजा जाता।"],
    "Technical information:": ["প্রযুক্তিগত তথ্য:", "तकनीकी जानकारी:"],
    "the hosting platform or server may process standard request, device, diagnostic and security logs.": ["হোস্টিং প্ল্যাটফর্ম বা সার্ভার সাধারণ অনুরোধ, ডিভাইস, ডায়াগনস্টিক ও নিরাপত্তা লগ প্রক্রিয়া করতে পারে।", "होस्टिंग प्लेटफ़ॉर्म या सर्वर सामान्य अनुरोध, डिवाइस, डायग्नोस्टिक और सुरक्षा लॉग संसाधित कर सकता है।"],
    "3. Why information is used": ["৩. তথ্য কেন ব্যবহার করা হয়", "3. जानकारी का उपयोग क्यों किया जाता है"],
    "Information is used to create and authenticate accounts, maintain sessions, show account pages, retain the optional delivery address you choose to save for possible future checkout use, protect the service, respond to support requests and maintain the website. The current demo checkout does not take payment or create orders.": ["অ্যাকাউন্ট তৈরি ও যাচাই, সেশন চালু রাখা, অ্যাকাউন্টের পৃষ্ঠা দেখানো, ভবিষ্যতে চেকআউটে ব্যবহারের জন্য আপনার সংরক্ষণ করা ঐচ্ছিক ডেলিভারি ঠিকানা রাখা, পরিষেবা সুরক্ষা, সহায়তার অনুরোধের উত্তর এবং ওয়েবসাইট রক্ষণাবেক্ষণের জন্য তথ্য ব্যবহার করা হয়। বর্তমান ডেমো চেকআউট পেমেন্ট নেয় না বা অর্ডার তৈরি করে না।", "जानकारी का उपयोग खाते बनाने और प्रमाणित करने, सेशन बनाए रखने, खाता पेज दिखाने, भविष्य के चेकआउट के लिए आपके सहेजे गए वैकल्पिक डिलीवरी पते को रखने, सेवा की सुरक्षा, सहायता अनुरोधों का जवाब देने और वेबसाइट बनाए रखने के लिए किया जाता है। मौजूदा डेमो चेकआउट भुगतान नहीं लेता और ऑर्डर नहीं बनाता।"],
    "4. Cookies and local storage": ["৪. কুকি ও লোকাল স্টোরেজ", "4. कुकीज़ और लोकल स्टोरेज"],
    "The website uses a session cookie for authentication and security. The configured session inactivity lifetime is up to seven days, subject to logout, browser settings, server cleanup and security events. The shopping cart uses browser local storage until you clear it or browser data is removed. Essential session and security storage is not an advertising cookie.": ["ওয়েবসাইট প্রমাণীকরণ ও নিরাপত্তার জন্য সেশন কুকি ব্যবহার করে। সেটিং অনুযায়ী নিষ্ক্রিয় সেশনের মেয়াদ সর্বোচ্চ সাত দিন; তবে সাইন আউট, ব্রাউজার সেটিংস, সার্ভার পরিষ্কার বা নিরাপত্তাজনিত ঘটনার কারণে এটি বদলাতে পারে। আপনি মুছে না ফেলা বা ব্রাউজারের তথ্য পরিষ্কার না করা পর্যন্ত কেনাকাটার কার্ট ব্রাউজারের লোকাল স্টোরেজে থাকে। প্রয়োজনীয় সেশন ও নিরাপত্তা স্টোরেজ বিজ্ঞাপনের কুকি নয়।", "वेबसाइट प्रमाणीकरण और सुरक्षा के लिए सेशन कुकी का उपयोग करती है। तय सेशन निष्क्रियता अवधि अधिकतम सात दिन है, जो साइन आउट, ब्राउज़र सेटिंग, सर्वर की सफ़ाई और सुरक्षा घटनाओं पर निर्भर करती है। जब तक आप इसे साफ़ नहीं करते या ब्राउज़र डेटा नहीं हटता, खरीदारी कार्ट ब्राउज़र के लोकल स्टोरेज में रहता है। ज़रूरी सेशन और सुरक्षा स्टोरेज विज्ञापन कुकी नहीं है।"],
    "5. Sharing and service providers": ["৫. তথ্য ভাগাভাগি ও পরিষেবা প্রদানকারী", "5. जानकारी साझा करना और सेवा प्रदाता"],
    "Personal information may be processed by hosting, database, security and technical service providers strictly as needed to operate the website. Product pages and the homepage may contain YouTube video embeds; when a video frame loads or is played, YouTube may receive technical request and device information under its own privacy terms. The product gallery creates its player after a visitor selects the video, while homepage players use lazy loading. The current codebase does not include a payment gateway, behavioural analytics integration or an active newsletter mailing service. This statement must be revised if any such provider is added.": ["ওয়েবসাইট চালানোর জন্য যতটুকু প্রয়োজন, ততটুকুই ব্যক্তিগত তথ্য হোস্টিং, ডেটাবেস, নিরাপত্তা ও প্রযুক্তিগত পরিষেবা প্রদানকারীরা প্রক্রিয়া করতে পারে। পণ্যের পৃষ্ঠা ও হোমপেজে YouTube ভিডিও থাকতে পারে; ভিডিও ফ্রেম লোড বা চালু হলে YouTube তাদের নিজস্ব গোপনীয়তা শর্ত অনুযায়ী প্রযুক্তিগত অনুরোধ ও ডিভাইসের তথ্য পেতে পারে। দর্শক ভিডিও নির্বাচন করার পর পণ্যের গ্যালারি প্লেয়ার তৈরি করে, আর হোমপেজের প্লেয়ার ধাপে ধাপে লোড হয়। বর্তমান কোডে পেমেন্ট গেটওয়ে, আচরণভিত্তিক অ্যানালিটিক্স বা সক্রিয় নিউজলেটার মেইলিং পরিষেবা নেই। এমন কোনো পরিষেবা যোগ হলে এই বিবৃতি সংশোধন করতে হবে।", "वेबसाइट चलाने के लिए जितनी ज़रूरत हो, उतनी ही व्यक्तिगत जानकारी होस्टिंग, डेटाबेस, सुरक्षा और तकनीकी सेवा प्रदाताओं द्वारा संसाधित की जा सकती है। उत्पाद पेज और होमपेज में YouTube वीडियो एम्बेड हो सकते हैं; वीडियो फ़्रेम लोड या चलने पर YouTube अपनी गोपनीयता शर्तों के अनुसार तकनीकी अनुरोध और डिवाइस की जानकारी प्राप्त कर सकता है। उत्पाद गैलरी में दर्शक के वीडियो चुनने के बाद प्लेयर बनता है, जबकि होमपेज के प्लेयर धीरे-धीरे लोड होते हैं। मौजूदा कोड में भुगतान गेटवे, व्यवहार-आधारित एनालिटिक्स या सक्रिय न्यूज़लेटर मेल सेवा शामिल नहीं है। ऐसी कोई सेवा जुड़ने पर इस कथन को संशोधित करना होगा।"],
    "6. Retention and security": ["৬. তথ্য সংরক্ষণ ও নিরাপত্তা", "6. जानकारी का रखरखाव और सुरक्षा"],
    "Account data is retained while an account is active and as long as reasonably necessary for support, security and legal obligations. Session data is designed to expire after the configured session lifetime. Cart information remains in the browser until cleared. Reasonable technical and organisational safeguards should be maintained, but no internet service can promise absolute security.": ["অ্যাকাউন্ট সক্রিয় থাকা পর্যন্ত এবং সহায়তা, নিরাপত্তা ও আইনি দায়িত্ব পালনের জন্য যুক্তিসংগতভাবে যতদিন প্রয়োজন, অ্যাকাউন্টের তথ্য রাখা হয়। নির্ধারিত সেশনের মেয়াদ শেষে সেশন তথ্যের মেয়াদ শেষ হওয়ার কথা। কার্টের তথ্য ব্রাউজারে থাকে যতক্ষণ না তা মুছে ফেলা হয়। যুক্তিসংগত প্রযুক্তিগত ও সাংগঠনিক সুরক্ষা বজায় রাখা উচিত, তবে কোনো ইন্টারনেট পরিষেবাই সম্পূর্ণ নিরাপত্তার নিশ্চয়তা দিতে পারে না।", "खाता सक्रिय रहने तक और सहायता, सुरक्षा तथा कानूनी दायित्वों के लिए जितना उचित रूप से आवश्यक हो, खाता डेटा रखा जाता है। सेशन डेटा तय सेशन अवधि के बाद समाप्त होने के लिए बनाया गया है। कार्ट की जानकारी ब्राउज़र में तब तक रहती है जब तक उसे साफ़ न किया जाए। उचित तकनीकी और संगठनात्मक सुरक्षा उपाय बनाए रखने चाहिए, लेकिन कोई भी इंटरनेट सेवा पूर्ण सुरक्षा की गारंटी नहीं दे सकती।"],
    "7. Your choices and privacy requests": ["৭. আপনার পছন্দ ও গোপনীয়তার অনুরোধ", "7. आपके विकल्प और गोपनीयता अनुरोध"],
    "Contact": ["যোগাযোগ", "संपर्क"],
    "to ask about access to, correction of or deletion of account information, or to raise a privacy concern. Requests will be handled subject to identity verification, applicable law and any lawful retention requirement. The production store should implement a documented request-handling and grievance process before launch.": ["অ্যাকাউন্টের তথ্য দেখার, সংশোধন বা মুছে ফেলার বিষয়ে জানতে অথবা গোপনীয়তার উদ্বেগ জানাতে। পরিচয় যাচাই, প্রযোজ্য আইন ও আইনসম্মত তথ্য সংরক্ষণের শর্ত অনুযায়ী অনুরোধের ব্যবস্থা নেওয়া হবে। চালুর আগে প্রকৃত স্টোরে নথিভুক্ত অনুরোধ-পরিচালনা ও অভিযোগ নিষ্পত্তির প্রক্রিয়া চালু করা উচিত।", "खाते की जानकारी देखने, सुधारने या हटाने के बारे में पूछने या गोपनीयता संबंधी चिंता बताने के लिए संपर्क करें। अनुरोधों पर पहचान सत्यापन, लागू कानून और किसी भी वैध डेटा-रखरखाव की शर्त के अनुसार कार्रवाई होगी। लॉन्च से पहले वास्तविक दुकान में अनुरोध संभालने और शिकायत निवारण की लिखित प्रक्रिया लागू होनी चाहिए।"],
    "8. Children": ["৮. শিশু", "8. बच्चे"],
    "This storefront is not designed to knowingly collect personal information from children. A real seller must set and follow an appropriate age and parental-consent process where required by applicable law.": ["এই অনলাইন স্টোর শিশুদের কাছ থেকে জেনে-বুঝে ব্যক্তিগত তথ্য সংগ্রহের জন্য তৈরি নয়। প্রযোজ্য আইনে যেখানে প্রয়োজন, প্রকৃত বিক্রেতাকে উপযুক্ত বয়স যাচাই ও অভিভাবকের সম্মতির প্রক্রিয়া নির্ধারণ ও অনুসরণ করতে হবে।", "यह ऑनलाइन दुकान जानबूझकर बच्चों से व्यक्तिगत जानकारी एकत्र करने के लिए नहीं बनाई गई है। जहाँ लागू कानून की माँग हो, वास्तविक विक्रेता को उचित आयु-जाँच और माता-पिता की सहमति की प्रक्रिया तय करके उसका पालन करना चाहिए।"],
    "9. Changes and contact": ["৯. পরিবর্তন ও যোগাযোগ", "9. बदलाव और संपर्क"],
    "This notice may be updated as the website's functionality and legal obligations change. For privacy questions, contact": ["ওয়েবসাইটের কার্যকারিতা ও আইনি দায়িত্ব পরিবর্তিত হলে এই বিজ্ঞপ্তি হালনাগাদ হতে পারে। গোপনীয়তা সংক্রান্ত প্রশ্নের জন্য যোগাযোগ করুন", "वेबसाइट की सुविधाओं और कानूनी दायित्वों में बदलाव के अनुसार यह सूचना अपडेट की जा सकती है। गोपनीयता संबंधी सवालों के लिए संपर्क करें"],
    "This is a practical starter notice, not legal advice or a compliance certification. The seller must verify the applicable data-protection laws, processing purposes, lawful basis, retention periods, processors, transfer arrangements and contact details before public launch.": ["এটি ব্যবহারিক প্রাথমিক বিজ্ঞপ্তি, আইনি পরামর্শ বা কমপ্লায়েন্স সার্টিফিকেশন নয়। জনসাধারণের জন্য চালুর আগে বিক্রেতাকে প্রযোজ্য তথ্য-সুরক্ষা আইন, তথ্য প্রক্রিয়াকরণের উদ্দেশ্য, আইনি ভিত্তি, সংরক্ষণের মেয়াদ, প্রসেসর, তথ্য স্থানান্তরের ব্যবস্থা ও যোগাযোগের তথ্য যাচাই করতে হবে।", "यह एक व्यावहारिक प्रारंभिक सूचना है, कानूनी सलाह या अनुपालन प्रमाणपत्र नहीं। सार्वजनिक लॉन्च से पहले विक्रेता को लागू डेटा-सुरक्षा कानूनों, प्रसंस्करण के उद्देश्यों, कानूनी आधार, रखरखाव अवधि, प्रोसेसर, डेटा हस्तांतरण व्यवस्था और संपर्क विवरण की पुष्टि करनी होगी।"],

    "DATA PRIVACY": ["তথ্যের গোপনীয়তা", "डेटा गोपनीयता"],
    "Your data. Your": ["আপনার তথ্য। আপনার", "आपका डेटा। आपकी"],
    "choices.": ["পছন্দ।", "पसंद।"],
    "How to ask questions or make a privacy request.": ["কীভাবে প্রশ্ন করবেন বা গোপনীয়তার অনুরোধ জানাবেন।", "सवाल कैसे पूछें या गोपनीयता अनुरोध कैसे करें।"],
    "What the store currently uses": ["স্টোর বর্তমানে যা ব্যবহার করে", "दुकान अभी क्या उपयोग करती है"],
    "The current website uses account details (name, email and optional phone number), any optional delivery-address fields you choose to save (such as house/flat, street, locality, city, district, state and PIN code), encrypted session storage, security tokens and browser local storage for the shopping cart. Passwords are stored as hashes. The current checkout is a preview and does not submit orders or payment details.": ["বর্তমান ওয়েবসাইট অ্যাকাউন্টের তথ্য (নাম, ইমেল ও ঐচ্ছিক ফোন নম্বর), আপনার সংরক্ষণ করা ডেলিভারি ঠিকানার ঐচ্ছিক ঘরগুলো (যেমন বাড়ি/ফ্ল্যাট, রাস্তা, পাড়া, শহর, জেলা, রাজ্য ও পিন কোড), এনক্রিপ্ট করা সেশন স্টোরেজ, নিরাপত্তা টোকেন এবং কার্টের জন্য ব্রাউজারের লোকাল স্টোরেজ ব্যবহার করে। পাসওয়ার্ড হ্যাশ আকারে সংরক্ষিত হয়। বর্তমান চেকআউট প্রিভিউ মাত্র; এটি অর্ডার বা পেমেন্টের তথ্য পাঠায় না।", "मौजूदा वेबसाइट खाते का विवरण (नाम, ईमेल और वैकल्पिक फ़ोन नंबर), आपके द्वारा सहेजे गए वैकल्पिक डिलीवरी-पते के फ़ील्ड (जैसे मकान/फ्लैट, सड़क, इलाका, शहर, ज़िला, राज्य और पिन कोड), एन्क्रिप्टेड सेशन स्टोरेज, सुरक्षा टोकन और खरीदारी कार्ट के लिए ब्राउज़र लोकल स्टोरेज का उपयोग करती है। पासवर्ड हैश के रूप में रखे जाते हैं। मौजूदा चेकआउट केवल प्रीव्यू है और ऑर्डर या भुगतान विवरण जमा नहीं करता।"],
    "Your privacy requests": ["আপনার গোপনীয়তার অনুরোধ", "आपके गोपनीयता अनुरोध"],
    "You may contact the store to request information about personal data associated with your account, ask for inaccurate details to be corrected, request deletion where legally available, or raise a concern about how information is handled. The store may ask you to verify your identity before acting on a request.": ["আপনার অ্যাকাউন্টের সঙ্গে যুক্ত ব্যক্তিগত তথ্য সম্পর্কে জানতে, ভুল তথ্য সংশোধন করতে, আইনত সম্ভব হলে তথ্য মুছে ফেলার অনুরোধ জানাতে অথবা তথ্য কীভাবে ব্যবহৃত হচ্ছে সে বিষয়ে উদ্বেগ জানাতে স্টোরের সঙ্গে যোগাযোগ করতে পারেন। অনুরোধের ব্যবস্থা নেওয়ার আগে স্টোর আপনার পরিচয় যাচাই করতে বলতে পারে।", "आप अपने खाते से जुड़े व्यक्तिगत डेटा की जानकारी माँगने, गलत विवरण ठीक कराने, कानूनन उपलब्ध होने पर डेटा हटाने का अनुरोध करने या जानकारी के उपयोग के बारे में चिंता जताने के लिए दुकान से संपर्क कर सकते हैं। अनुरोध पर कार्रवाई से पहले दुकान आपसे पहचान सत्यापित करने को कह सकती है।"],
    "How to submit a request": ["কীভাবে অনুরোধ জমা দেবেন", "अनुरोध कैसे भेजें"],
    "Privacy / support contact": ["গোপনীয়তা / সহায়তার যোগাযোগ", "गोपनीयता / सहायता संपर्क"],
    "Business identity": ["ব্যবসার পরিচয়", "व्यवसाय की पहचान"],
    "Include the email address associated with your account, the request you are making and enough detail for the store to understand it. Do not email your password, full payment-card details or other unnecessary sensitive information.": ["আপনার অ্যাকাউন্টের সঙ্গে যুক্ত ইমেল ঠিকানা, কী অনুরোধ করছেন এবং স্টোরের বোঝার জন্য যথেষ্ট বিবরণ দিন। ইমেলে পাসওয়ার্ড, সম্পূর্ণ পেমেন্ট কার্ডের তথ্য বা অপ্রয়োজনীয় সংবেদনশীল তথ্য পাঠাবেন না।", "अपने खाते से जुड़ा ईमेल पता, आप कौन-सा अनुरोध कर रहे हैं और दुकान को समझने के लिए पर्याप्त विवरण दें। ईमेल में अपना पासवर्ड, पूरा भुगतान-कार्ड विवरण या अन्य अनावश्यक संवेदनशील जानकारी न भेजें।"],
    "Applicable data-protection law": ["প্রযোজ্য তথ্য-সুরক্ষা আইন", "लागू डेटा-सुरक्षा कानून"],
    "Requests will be handled under the data-protection and consumer laws that apply to the seller and the individual concerned. Where relevant, the Indian Digital Personal Data Protection Act, 2023 and the Digital Personal Data Protection Rules, 2025 have phased commencement dates; legal duties apply according to the provisions and dates notified by the Government. This page does not claim that the store has completed every statutory compliance requirement.": ["বিক্রেতা ও সংশ্লিষ্ট ব্যক্তির ক্ষেত্রে প্রযোজ্য তথ্য-সুরক্ষা ও ভোক্তা আইন অনুযায়ী অনুরোধের ব্যবস্থা নেওয়া হবে। যেখানে প্রাসঙ্গিক, ভারতের Digital Personal Data Protection Act, 2023 এবং Digital Personal Data Protection Rules, 2025 ধাপে ধাপে কার্যকর হওয়ার তারিখ নির্ধারণ করেছে; সরকার যে বিধান ও তারিখ বিজ্ঞপ্তি দিয়ে জানিয়েছে, সেই অনুযায়ী আইনি দায়িত্ব প্রযোজ্য হবে। স্টোর সব আইনি কমপ্লায়েন্সের শর্ত পূরণ করেছে—এই পৃষ্ঠা এমন দাবি করে না।", "विक्रेता और संबंधित व्यक्ति पर लागू डेटा-सुरक्षा तथा उपभोक्ता कानूनों के अनुसार अनुरोध संभाले जाएँगे। जहाँ प्रासंगिक हो, भारत के Digital Personal Data Protection Act, 2023 और Digital Personal Data Protection Rules, 2025 की लागू होने की तारीखें चरणबद्ध हैं; सरकारी अधिसूचना में बताई गई धाराओं और तारीखों के अनुसार कानूनी दायित्व लागू होंगे। यह पेज दावा नहीं करता कि दुकान ने सभी वैधानिक अनुपालन आवश्यकताएँ पूरी कर ली हैं।"],
    "What happens next": ["এরপর কী হবে", "इसके बाद क्या होगा"],
    "The store should acknowledge and assess requests, verify identity where appropriate, respond within the legally required time and explain any lawful reason for retaining information. A formal grievance process and monitored contact channel must be configured before public launch.": ["স্টোরের উচিত অনুরোধ পাওয়ার কথা জানানো ও তা মূল্যায়ন করা, প্রয়োজনমতো পরিচয় যাচাই করা, আইনত নির্ধারিত সময়ের মধ্যে উত্তর দেওয়া এবং তথ্য রেখে দেওয়ার কোনো আইনসম্মত কারণ থাকলে তা ব্যাখ্যা করা। জনসাধারণের জন্য চালুর আগে আনুষ্ঠানিক অভিযোগ প্রক্রিয়া ও পর্যবেক্ষণ করা হয় এমন যোগাযোগের মাধ্যম চালু করতে হবে।", "दुकान को अनुरोध प्राप्त होने की पुष्टि और उसका आकलन करना चाहिए, जहाँ उचित हो पहचान सत्यापित करनी चाहिए, कानूनी समय-सीमा में जवाब देना चाहिए और जानकारी रखने का कोई वैध कारण हो तो उसे समझाना चाहिए। सार्वजनिक लॉन्च से पहले औपचारिक शिकायत प्रक्रिया और निगरानी वाला संपर्क माध्यम तय करना होगा।"],
    "This page is a starter privacy notice. It is not legal advice. Replace all contact placeholders and have the seller's actual data flows and legal obligations reviewed before launch.": ["এই পৃষ্ঠাটি গোপনীয়তা সংক্রান্ত প্রাথমিক বিজ্ঞপ্তি, আইনি পরামর্শ নয়। চালুর আগে যোগাযোগের সব অস্থায়ী তথ্য বদলান এবং বিক্রেতার প্রকৃত তথ্যপ্রবাহ ও আইনি দায়িত্ব পর্যালোচনা করান।", "यह पेज गोपनीयता संबंधी प्रारंभिक सूचना है, कानूनी सलाह नहीं। लॉन्च से पहले सभी अस्थायी संपर्क विवरण बदलें और विक्रेता के वास्तविक डेटा प्रवाह तथा कानूनी दायित्वों की समीक्षा कराएँ।"],

    "Could not start a secure session. Refresh and try again.": ["নিরাপদ সেশন শুরু করা যায়নি। পৃষ্ঠা রিফ্রেশ করে আবার চেষ্টা করুন।", "सुरक्षित सेशन शुरू नहीं हो सका। पेज रीफ़्रेश करके फिर कोशिश करें।"],
    "Something went wrong. Please try again.": ["কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।", "कुछ गड़बड़ हुई। कृपया फिर कोशिश करें।"],
    "This product is currently out of stock.": ["এই পণ্যটি বর্তমানে স্টকে নেই।", "यह उत्पाद अभी स्टॉक में नहीं है।"],
    "Added to your cart.": ["আপনার কার্টে যোগ করা হয়েছে।", "आपके कार्ट में जोड़ दिया गया।"],
    "Could not load store data. Check PHP, Composer and MongoDB.": ["স্টোরের তথ্য লোড করা যায়নি। PHP, Composer ও MongoDB পরীক্ষা করুন।", "दुकान का डेटा लोड नहीं हो सका। PHP, Composer और MongoDB जाँचें।"],
    "Finding good things…": ["ভালো পণ্য খোঁজা হচ্ছে…", "अच्छे उत्पाद खोजे जा रहे हैं…"],
    "This product could not be found.": ["এই পণ্যটি খুঁজে পাওয়া যায়নি।", "यह उत्पाद नहीं मिला।"],
    "Your cart is taking a little rest.": ["আপনার কার্টটি আপাতত খালি।", "आपका कार्ट अभी खाली है।"],
    "Find something good to bring home.": ["বাড়িতে নিয়ে যাওয়ার মতো ভালো কিছু খুঁজুন।", "घर ले जाने के लिए कुछ अच्छा खोजें।"],
    "Archive this product? It will no longer appear in the public shop.": ["এই পণ্যটি আর্কাইভ করবেন? এরপর এটি পাবলিক স্টোরে দেখা যাবে না।", "क्या इस उत्पाद को आर्काइव करें? इसके बाद यह सार्वजनिक दुकान में दिखाई नहीं देगा।"],
    "Product archived.": ["পণ্যটি আর্কাইভ করা হয়েছে।", "उत्पाद आर्काइव कर दिया गया।"],
    "Choose between 1 and 8 images.": ["১ থেকে ৮টি ছবি বেছে নিন।", "1 से 8 तस्वीरें चुनें।"],
    "Choose either a YouTube URL or an uploaded video, not both.": ["YouTube URL অথবা আপলোড করা ভিডিও—যেকোনো একটি বেছে নিন, দুটো নয়।", "YouTube URL या अपलोड किया गया वीडियो—दोनों में से एक चुनें, दोनों नहीं।"],
    "Product published successfully.": ["পণ্য সফলভাবে প্রকাশিত হয়েছে।", "उत्पाद सफलतापूर्वक प्रकाशित हो गया।"],
    "Could not load seller data. Please sign in again.": ["বিক্রেতার তথ্য লোড করা যায়নি। আবার সাইন ইন করুন।", "विक्रेता का डेटा लोड नहीं हो सका। कृपया फिर से साइन इन करें।"],
    "Profile and address saved successfully.": ["প্রোফাইল ও ঠিকানা সফলভাবে সংরক্ষণ করা হয়েছে।", "प्रोफ़ाइल और पता सफलतापूर्वक सहेजे गए।"],
    "Profile details saved.": ["প্রোফাইলের তথ্য সংরক্ষণ করা হয়েছে।", "प्रोफ़ाइल का विवरण सहेजा गया।"],
    "Selected product preview": ["নির্বাচিত পণ্যের প্রিভিউ", "चुने गए उत्पाद का प्रीव्यू"],
    "No products yet. Add your first product above.": ["এখনও কোনো পণ্য নেই। উপরে আপনার প্রথম পণ্য যোগ করুন।", "अभी कोई उत्पाद नहीं है। ऊपर अपना पहला उत्पाद जोड़ें।"]
  };

  const stateNames = {
    "Andhra Pradesh": ["অন্ধ্রপ্রদেশ", "आंध्र प्रदेश"],
    "Arunachal Pradesh": ["অরুণাচল প্রদেশ", "अरुणाचल प्रदेश"],
    "Assam": ["অসম", "असम"],
    "Bihar": ["বিহার", "बिहार"],
    "Chhattisgarh": ["ছত্তিশগড়", "छत्तीसगढ़"],
    "Goa": ["গোয়া", "गोवा"],
    "Gujarat": ["গুজরাট", "गुजरात"],
    "Haryana": ["হরিয়ানা", "हरियाणा"],
    "Himachal Pradesh": ["হিমাচল প্রদেশ", "हिमाचल प्रदेश"],
    "Jharkhand": ["ঝাড়খণ্ড", "झारखंड"],
    "Karnataka": ["কর্ণাটক", "कर्नाटक"],
    "Kerala": ["কেরালা", "केरल"],
    "Madhya Pradesh": ["মধ্যপ্রদেশ", "मध्य प्रदेश"],
    "Maharashtra": ["মহারাষ্ট্র", "महाराष्ट्र"],
    "Manipur": ["মণিপুর", "मणिपुर"],
    "Meghalaya": ["মেঘালয়", "मेघालय"],
    "Mizoram": ["মিজোরাম", "मिज़ोरम"],
    "Nagaland": ["নাগাল্যান্ড", "नागालैंड"],
    "Odisha": ["ওড়িশা", "ओडिशा"],
    "Punjab": ["পাঞ্জাব", "पंजाब"],
    "Rajasthan": ["রাজস্থান", "राजस्थान"],
    "Sikkim": ["সিকিম", "सिक्किम"],
    "Tamil Nadu": ["তামিলনাড়ু", "तमिलनाडु"],
    "Telangana": ["তেলেঙ্গানা", "तेलंगाना"],
    "Tripura": ["ত্রিপুরা", "त्रिपुरा"],
    "Uttar Pradesh": ["উত্তরপ্রদেশ", "उत्तर प्रदेश"],
    "Uttarakhand": ["উত্তরাখণ্ড", "उत्तराखंड"],
    "West Bengal": ["পশ্চিমবঙ্গ", "पश्चिम बंगाल"],
    "Andaman and Nicobar Islands": ["আন্দামান ও নিকোবর দ্বীপপুঞ্জ", "अंडमान और निकोबार द्वीपसमूह"],
    "Chandigarh": ["চণ্ডীগড়", "चंडीगढ़"],
    "Dadra and Nagar Haveli and Daman and Diu": ["দাদরা ও নগর হাভেলি এবং দমন ও দিউ", "दादरा और नगर हवेली और दमन और दीव"],
    "Delhi": ["দিল্লি", "दिल्ली"],
    "Jammu and Kashmir": ["জম্মু ও কাশ্মীর", "जम्मू और कश्मीर"],
    "Ladakh": ["লাদাখ", "लद्दाख"],
    "Lakshadweep": ["লাক্ষাদ্বীপ", "लक्षद्वीप"],
    "Puducherry": ["পুদুচেরি", "पुदुचेरी"]
  };

  const ignoredSelector = [
    '[data-i18n-ignore]',
    '[data-product-name]',
    '[data-product-short]',
    '[data-product-description]',
    '[data-product-attributes]',
    '[data-account-name]',
    '[data-account-email]',
    '.brand-mark',
    '.product-card h3',
    '.product-card-type',
    '.category-card h3',
    '.category-filters [data-category]:not([data-category=""])',
    '.cart-row h5',
    '.cart-row img',
    '.seller-product-cell',
    'script',
    'style',
    'noscript',
    'svg',
    'input',
    'textarea'
  ].join(',');

  const textCache = new WeakMap();
  const attributeCache = new WeakMap();
  let currentLanguage = 'en';

  function safeLanguage(value) {
    return Object.prototype.hasOwnProperty.call(languageCodes, value) ? value : 'en';
  }

  function translateValue(source, language) {
    const lang = safeLanguage(language);
    if (lang === 'en' || !source) return source;
    const value = String(source);
    const trimmed = value.trim();
    const leading = value.match(/^\s*/)[0];
    const trailing = value.match(/\s*$/)[0];

    let translated = entries[trimmed] ? entries[trimmed][lang === 'bn' ? 0 : 1] : null;
    if (!translated && stateNames[trimmed]) {
      translated = stateNames[trimmed][lang === 'bn' ? 0 : 1];
    }

    if (!translated) {
      let match = trimmed.match(/^(\d[\d,]*) items?$/i);
      if (match) translated = lang === 'bn' ? match[1] + 'টি পণ্য' : match[1] + ' आइटम';
      if (!translated) {
        match = trimmed.match(/^(\d[\d,]*) in stock$/i);
        if (match) translated = lang === 'bn' ? match[1] + 'টি মজুত' : 'स्टॉक में ' + match[1];
      }
      if (!translated) {
        match = trimmed.match(/^(\d+)% off$/i);
        if (match) translated = lang === 'bn' ? match[1] + '% ছাড়' : match[1] + '% की छूट';
      }
      if (!translated) {
        match = trimmed.match(/^View product image (\d+)$/i);
        if (match) translated = (lang === 'bn' ? 'পণ্যের ছবি দেখুন ' : 'उत्पाद की तस्वीर देखें ') + match[1];
      }
      if (!translated) {
        match = trimmed.match(/^Play (.+)$/);
        if (match) translated = (lang === 'bn' ? 'চালান ' : 'चलाएँ ') + match[1];
      }
      if (!translated) {
        match = trimmed.match(/^(.+) each$/);
        if (match) translated = lang === 'bn' ? match[1] + ' প্রতি পিস' : match[1] + ' प्रति इकाई';
      }
      if (!translated) {
        match = trimmed.match(/^© (\d{4}) Field & Found\. Demo storefront\.$/);
        if (match) translated = lang === 'bn'
          ? '© ' + match[1] + ' Field & Found। ডেমো অনলাইন স্টোর।'
          : '© ' + match[1] + ' Field & Found। डेमो ऑनलाइन स्टोर।';
      }
      if (!translated) {
        match = trimmed.match(/^For questions about these terms, contact (.*?)\. Grievance contact: (.*?)\. Replace these configuration placeholders with monitored business contact details before launch\.$/);
        if (match) translated = lang === 'bn'
          ? 'এই শর্তাবলি সম্পর্কে প্রশ্ন থাকলে যোগাযোগ করুন ' + match[1] + '। অভিযোগের যোগাযোগ: ' + match[2] + '। চালুর আগে এই অস্থায়ী যোগাযোগের তথ্যের পরিবর্তে পর্যবেক্ষণ করা হয় এমন ব্যবসায়িক যোগাযোগের তথ্য দিন।'
          : 'इन शर्तों के बारे में सवालों के लिए ' + match[1] + ' पर संपर्क करें। शिकायत संपर्क: ' + match[2] + '। लॉन्च से पहले इन अस्थायी विवरणों की जगह निगरानी वाले व्यावसायिक संपर्क विवरण दें।';
      }
      if (!translated) {
        match = trimmed.match(/^Contact (.*?) to ask about access to, correction of or deletion of account information, or to raise a privacy concern\. Requests will be handled subject to identity verification, applicable law and any lawful retention requirement\. The production store should implement a documented request-handling and grievance process before launch\.$/);
        if (match) translated = lang === 'bn'
          ? 'অ্যাকাউন্টের তথ্য দেখা, সংশোধন বা মুছে ফেলার বিষয়ে জানতে অথবা গোপনীয়তার উদ্বেগ জানাতে ' + match[1] + ' যোগাযোগ করুন। পরিচয় যাচাই, প্রযোজ্য আইন ও আইনসম্মত তথ্য সংরক্ষণের শর্ত অনুযায়ী অনুরোধের ব্যবস্থা নেওয়া হবে। চালুর আগে প্রকৃত স্টোরে নথিভুক্ত অনুরোধ-পরিচালনা ও অভিযোগ নিষ্পত্তির প্রক্রিয়া চালু করা উচিত।'
          : 'खाते की जानकारी देखने, सुधारने या हटाने के बारे में पूछने या गोपनीयता संबंधी चिंता बताने के लिए ' + match[1] + ' पर संपर्क करें। अनुरोधों पर पहचान सत्यापन, लागू कानून और किसी भी वैध डेटा-रखरखाव की शर्त के अनुसार कार्रवाई होगी। लॉन्च से पहले वास्तविक दुकान में अनुरोध संभालने और शिकायत निवारण की लिखित प्रक्रिया लागू होनी चाहिए।';
      }
      if (!translated) {
        match = trimmed.match(/^This notice may be updated as the website's functionality and legal obligations change\. For privacy questions, contact (.*?)\. Grievance contact: (.*?)\.$/);
        if (match) translated = lang === 'bn'
          ? 'ওয়েবসাইটের কার্যকারিতা ও আইনি দায়িত্ব পরিবর্তিত হলে এই বিজ্ঞপ্তি হালনাগাদ হতে পারে। গোপনীয়তা সংক্রান্ত প্রশ্নের জন্য যোগাযোগ করুন ' + match[1] + '। অভিযোগের যোগাযোগ: ' + match[2] + '।'
          : 'वेबसाइट की सुविधाओं और कानूनी दायित्वों में बदलाव के अनुसार यह सूचना अपडेट की जा सकती है। गोपनीयता संबंधी सवालों के लिए ' + match[1] + ' पर संपर्क करें। शिकायत संपर्क: ' + match[2] + '।';
      }
      if (!translated) {
        match = trimmed.match(/^The (.+) field is required\.$/i);
        if (match) {
          const field = match[1];
          translated = lang === 'bn' ? field + ' ঘরটি পূরণ করা বাধ্যতামূলক।' : field + ' फ़ील्ड भरना आवश्यक है।';
        }
      }
    }

    return translated ? leading + translated + trailing : value;
  }

  function isIgnored(element) {
    return Boolean(element && element.closest && element.closest(ignoredSelector));
  }

  function processTextNode(node) {
    if (!node || !node.parentElement || isIgnored(node.parentElement)) return;
    const visibleText = node.data;
    if (!visibleText.trim()) return;

    let record = textCache.get(node);
    if (!record || visibleText !== record.applied) {
      record = { source: visibleText, applied: null };
    }
    const next = translateValue(record.source, currentLanguage);
    if (node.data !== next) node.data = next;
    record.applied = next;
    textCache.set(node, record);
  }

  const translatableAttributes = ['placeholder', 'aria-label', 'title', 'alt'];
  function processElement(element) {
    if (!element || element.nodeType !== 1 || isIgnored(element)) return;
    let records = attributeCache.get(element);
    if (!records) {
      records = {};
      attributeCache.set(element, records);
    }
    translatableAttributes.forEach((name) => {
      if (!element.hasAttribute(name)) return;
      const value = element.getAttribute(name);
      let record = records[name];
      if (!record || value !== record.applied) record = { source: value, applied: null };
      const next = translateValue(record.source, currentLanguage);
      if (value !== next) element.setAttribute(name, next);
      record.applied = next;
      records[name] = record;
    });
  }

  function translateTree(root) {
    if (!root) return;
    if (root.nodeType === 3) {
      processTextNode(root);
      return;
    }
    if (root.nodeType !== 1 && root !== document.body) return;
    if (root.nodeType === 1) processElement(root);

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) processTextNode(node);
    if (root.querySelectorAll) root.querySelectorAll('*').forEach(processElement);
  }

  function translateDocumentTitle() {
    const suffix = ' — Field & Found';
    const base = originalDocumentTitle.endsWith(suffix) ? originalDocumentTitle.slice(0, -suffix.length) : originalDocumentTitle;
    const translated = translateValue(base, currentLanguage);
    document.title = translated + (originalDocumentTitle.endsWith(suffix) ? suffix : '');
  }

  function applyLanguage(language) {
    currentLanguage = safeLanguage(language);
    document.documentElement.lang = languageCodes[currentLanguage];
    document.documentElement.dir = 'ltr';
    if (select && select.value !== currentLanguage) select.value = currentLanguage;
    translateTree(document.body);
    translateDocumentTitle();
    try {
      window.localStorage.setItem(STORAGE_KEY, currentLanguage);
    } catch (_) {
      // Language still applies for this page when storage is unavailable.
    }
    window.dispatchEvent(new CustomEvent('storefront:language-changed', { detail: { language: currentLanguage } }));
  }

  let savedLanguage = 'en';
  try {
    savedLanguage = safeLanguage(window.localStorage.getItem(STORAGE_KEY) || 'en');
  } catch (_) {
    savedLanguage = 'en';
  }

  if (select) {
    select.value = savedLanguage;
    select.addEventListener('change', () => applyLanguage(select.value));
  }

  applyLanguage(savedLanguage);

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'characterData') processTextNode(mutation.target);
      if (mutation.type === 'attributes') processElement(mutation.target);
      mutation.addedNodes && mutation.addedNodes.forEach((node) => translateTree(node));
    });
  });
  observer.observe(document.body, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: translatableAttributes
  });

  window.storefrontTranslate = (value) => translateValue(value, currentLanguage);
  window.storefrontLanguage = () => currentLanguage;
})();
