import { LanguageCode, LanguageOption } from '@/types/marine';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🌐' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
];

/**
 * Intelligent Language Detector using character Unicode script heuristics
 */
export function detectIndianLanguage(text: string): LanguageCode {
  if (!text || text.trim().length === 0) return 'en';

  const tamilCount = (text.match(/[\u0B80-\u0BFF]/g) || []).length;
  const teluguCount = (text.match(/[\u0C00-\u0C7F]/g) || []).length;
  const malayalamCount = (text.match(/[\u0D00-\u0D7F]/g) || []).length;
  const kannadaCount = (text.match(/[\u0C80-\u0CFF]/g) || []).length;
  const bengaliCount = (text.match(/[\u0980-\u09FF]/g) || []).length;
  const gujaratiCount = (text.match(/[\u0A80-\u0AFF]/g) || []).length;
  const devanagariCount = (text.match(/[\u0900-\u097F]/g) || []).length;

  // Keyword check for Marathi vs Hindi inside Devanagari script
  if (devanagariCount > 2) {
    if (/(आहे|नाही|मासेमारी|किनारा|हवामान|वादळ|बोट|समुद्र)/i.test(text)) {
      return 'mr';
    }
    return 'hi';
  }

  if (tamilCount > 2) return 'ta';
  if (teluguCount > 2) return 'te';
  if (malayalamCount > 2) return 'ml';
  if (kannadaCount > 2) return 'kn';
  if (bengaliCount > 2) return 'bn';
  if (gujaratiCount > 2) return 'gu';

  // Check Romanized keywords for regional languages
  const lower = text.toLowerCase();
  if (/\b(meen|kadal|meenavar|thoothukudi|rameshwaram|tamil|valai|sura)\b/i.test(lower)) return 'ta';
  if (/\b(matsya|samundar|machli|mausam|toofan|hindi|suraksha|kinara)\b/i.test(lower)) return 'hi';
  if (/\b(chapa|samudra|tofan|bengali|digha|sundarban)\b/i.test(lower)) return 'bn';
  if (/\b(machli|dariyo|gujarat|porbandar|veraval)\b/i.test(lower)) return 'gu';
  if (/\b(kadal|meen|vanchi|kerala|kochi|alappuzha)\b/i.test(lower)) return 'ml';

  return 'en';
}

/**
 * Multilingual Translations for common UI terms and system headers
 */
export const UI_TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    appTitle: 'SagarAI Marine Intelligence',
    subtitle: 'Agentic Autonomous Ocean Decision Support Platform',
    queryPlaceholder: 'Ask in any Indian language (e.g., Is it safe to sail from Rameswaram? Show cyclone track...)',
    send: 'Send Query',
    listening: 'Listening to your voice...',
    voiceInput: 'Voice Input',
    playAudio: 'Play Advisory Audio',
    stopAudio: 'Stop Audio',
    agentsRunning: 'Autonomous Agents Collaborating',
    geofenceStatus: 'Geofencing & IMBL Status',
    hazardAlerts: 'Marine Hazard Advisories',
    pfzTitle: 'Potential Fishing Zones (PFZ)',
    sosTrigger: 'EMERGENCY SOS',
    safeHeading: 'Safe Return Vector',
    confidenceScore: 'Confidence',
    safetyIndex: 'Vessel Safety Index',
    citations: 'Satellite & Agency Citations',
    layers: 'Satellite & Ocean Layers',
    routePlanner: 'Safe Weather Route Planner',
    vesselTracker: 'Live Vessel Telemetry',
  },
  hi: {
    appTitle: 'सागरAI समुद्री बुद्धिमत्ता',
    subtitle: 'एजेंटिक स्वायत्त महासागरीय निर्णय सहायता प्रणाली',
    queryPlaceholder: 'अपनी भाषा में पूछें (उदा. क्या रामेश्वरम से मछली पकड़ने जाना सुरक्षित है? चक्रवात देखें...)',
    send: 'पूछें',
    listening: 'आपकी आवाज़ सुन रहे हैं...',
    voiceInput: 'वॉइस इनपुट',
    playAudio: 'सलाह सुनें',
    stopAudio: 'ऑडियो रोकें',
    agentsRunning: 'स्वायत्त एजेंट सक्रिय हैं',
    geofenceStatus: 'जियोफेंसिंग एवं अंतरराष्ट्रीय समुद्री सीमा',
    hazardAlerts: 'समुद्री आपदा चेतावनी',
    pfzTitle: 'संभावित मत्स्य पालन क्षेत्र (PFZ)',
    sosTrigger: 'आपातकालीन संकट SOS',
    safeHeading: 'सुरक्षित वापसी दिशा',
    confidenceScore: 'विश्वास स्तर',
    safetyIndex: 'पोत सुरक्षा सूचकांक',
    citations: 'उपग्रह व संस्थागत साक्ष्य',
    layers: 'उपग्रह और महासागरीय परतें',
    routePlanner: 'सुरक्षित मौसम मार्ग योजना',
    vesselTracker: 'नाव वास्तविक समय स्थिति',
  },
  ta: {
    appTitle: 'சாகர்AI கடல் நுண்ணறிவு தளம்',
    subtitle: 'தன்னாட்சி முகவர் கடல்சார் முடிவெடுக்கும் உதவி தளம்',
    queryPlaceholder: 'தமிழில் கேளுங்கள் (எ.கா: ராமேஸ்வரத்திலிருந்து கடலுக்குச் செல்லலாமா? புயல் நிலை என்ன?)',
    send: 'கேளுங்கள்',
    listening: 'உங்கள் குரலைக் கேட்கிறது...',
    voiceInput: 'குரல் உள்ளீடு',
    playAudio: 'ஆடியோவைக் கேள்',
    stopAudio: 'ஆடியோவை நிறுத்து',
    agentsRunning: 'செயற்கை நுண்ணறிவு முகவர்கள் இயங்குகின்றன',
    geofenceStatus: 'சர்வதேச கடல் எல்லை (IMBL) எச்சரிக்கை',
    hazardAlerts: 'கடல் அபாய எச்சரிக்கைகள்',
    pfzTitle: 'மீன்பிடி சாதகமான பகுதிகள் (PFZ)',
    sosTrigger: 'அவசர உதவி SOS',
    safeHeading: 'பாதுகாப்பான திரும்பும் திசை',
    confidenceScore: 'நம்பகத்தன்மை',
    safetyIndex: 'படகின் பாதுகாப்பு குறியீடு',
    citations: 'செயற்கைக்கோள் ஆதாரங்கள்',
    layers: 'செயற்கைக்கோள் மற்றும் கடல் அடுக்குகள்',
    routePlanner: 'வானிலைக்கேற்ற பாதுகாப்பான வழித்தடம்',
    vesselTracker: 'படகு நேரடி கண்காணிப்பு',
  },
  te: {
    appTitle: 'సాగర్AI సముద్ర మేధో వేదిక',
    subtitle: 'ఏజెంటిక్ అటానమస్ సముద్ర నిర్ణయ మద్దతు వ్యవస్థ',
    queryPlaceholder: 'తెలుగులో అడగండి (ఉదా: రామేశ్వరం నుండి వేటకు వెళ్లవచ్చా? తుఫాను హెచ్చరికలు...)',
    send: 'పంపు',
    listening: 'మీ స్వరాన్ని వింటున్నాము...',
    voiceInput: 'వాయిస్ ఇన్‌పుట్',
    playAudio: 'ఆడియో వినండి',
    stopAudio: 'ఆపు',
    agentsRunning: 'స్వయంప్రతిపత్తి ఏజెంట్లు విశ్లేషిస్తున్నాయి',
    geofenceStatus: 'జియోఫెన్సింగ్ & సముద్ర సరిహద్దు స్థితి',
    hazardAlerts: 'సముద్ర ప్రమాద హెచ్చరికలు',
    pfzTitle: 'చేపల లభ్యత మండలాలు (PFZ)',
    sosTrigger: 'అత్యవసర SOS',
    safeHeading: 'సురక్షిత తిరుగు ప్రయాణ దిశ',
    confidenceScore: 'విశ్వసనీయత స్కోరు',
    safetyIndex: 'పడవ భద్రతా సూచిక',
    citations: 'ఉపగ్రహ మరియు ఏజెన్సీ ఆధారాలు',
    layers: 'శాటిలైట్ మరియు సముద్ర పొరలు',
    routePlanner: 'వాతావరణ సురక్షిత మార్గ ప్రణాళిక',
    vesselTracker: 'పడవ ప్రత్యక్ష ట్రాకింగ్',
  },
  ml: {
    appTitle: 'സാഗർAI സമുദ്ര ഇന്റലിജൻസ് പ്ലാറ്റ്‌ഫോം',
    subtitle: 'സ്വയംഭരണ ഏജന്റ് അധിഷ്ഠിത സമുദ്ര തീരുമാന പിന്തുണ പ്ലാറ്റ്‌ഫോം',
    queryPlaceholder: 'മലയാളത്തിൽ ചോദിക്കൂ (ഉദാ: കൊച്ചി തീരത്ത് ഉയർന്ന തിരമാലയുണ്ടോ? കടലിൽ പോകാമോ?)',
    send: 'ചോദിക്കുക',
    listening: 'ശബ്ദം ശ്രവിക്കുന്നു...',
    voiceInput: 'ശബ്ദ ഇൻപുട്ട്',
    playAudio: 'ശബ്ദം കേൾക്കുക',
    stopAudio: 'നിർത്തുക',
    agentsRunning: 'ഏജന്റുകൾ വിശകലനം ചെയ്യുന്നു',
    geofenceStatus: 'ജിയോഫെൻസിങ് & അന്താരാഷ്ട്ര സമുദ്ര അതിർത്തി',
    hazardAlerts: 'സമുദ്ര ദുരന്ത മുന്നറിയിപ്പുകൾ',
    pfzTitle: 'മത്സ്യ ലഭ്യത മേഖലകൾ (PFZ)',
    sosTrigger: 'അടിയന്തര SOS',
    safeHeading: 'സുരക്ഷിത തിരിച്ചുവരവ് ദിശ',
    confidenceScore: 'വിശ്വാസ്യത',
    safetyIndex: 'ബോട്ട് സുരക്ഷാ സൂചിക',
    citations: 'ഉപഗ്രഹ ഡാറ്റ സ്രോതസ്സുകൾ',
    layers: 'ഉപഗ്രഹവും സമുദ്ര പാളികളും',
    routePlanner: 'സുരക്ഷിത കാലാവസ്ഥാ റൂട്ട് പ്ലാനർ',
    vesselTracker: 'ബോട്ട് തത്സമയ നിരീക്ഷണം',
  },
  bn: {
    appTitle: 'সাগরAI সামুদ্রিক বুদ্ধিমত্তা প্ল্যাটফর্ম',
    subtitle: 'স্বায়ত্তশাসিত এজেন্টিক সামুদ্রিক সিদ্ধান্ত সহায়তা প্ল্যাটফর্ম',
    queryPlaceholder: 'বাংলায় অনুসন্ধান করুন (যেমন: দিঘা উপকূলে ঢেউ কেমন? সমুদ্রে যাওয়া কি নিরাপদ?)',
    send: 'অনুসন্ধান',
    listening: 'আপনার কথা শুনছি...',
    voiceInput: 'ভয়েস ইনপুট',
    playAudio: 'পরামর্শ শুনুন',
    stopAudio: 'অডিও বন্ধ করুন',
    agentsRunning: 'স্বায়ত্তশাসিত এজেন্ট কাজ করছে',
    geofenceStatus: 'জিওফেন্সিং ও আন্তর্জাতিক সামুদ্রিক সীমানা',
    hazardAlerts: 'সামুদ্রিক বিপদের সতর্কতা',
    pfzTitle: 'সম্ভাব্য মৎস্য শিকার অঞ্চল (PFZ)',
    sosTrigger: 'জরুরি বিপদকালীন SOS',
    safeHeading: 'নিরাপদ প্রত্যাবর্তনের দিক',
    confidenceScore: 'নির্ভরযোগ্যতা',
    safetyIndex: 'নৌকার নিরাপত্তা সূচক',
    citations: 'উপগ্রহ ও ইনকোইসের প্রমাণাদি',
    layers: 'স্যাটেলাইট এবং সমুদ্রের স্তর',
    routePlanner: 'আবহাওয়া ভিত্তিক নিরাপদ রুট',
    vesselTracker: 'নৌকার লাইভ ট্র্যাকিং',
  },
  gu: {
    appTitle: 'સાગરAI દરિયાઈ ગુપ્તચર પ્લેટફોર્મ',
    subtitle: 'એજન્ટિક સ્વાયત્ત દરિયાઈ નિર્ણય સહાય પ્લેટફોર્મ',
    queryPlaceholder: 'ગુજરાતીમાં પૂછો (દા.ત. વેરાવળથી દરિયામાં જવું સલામત છે? વાવાઝોડું ક્યાં છે?)',
    send: 'મોકલો',
    listening: 'સાંભળી રહ્યા છીએ...',
    voiceInput: 'વોઇસ ઇનપુટ',
    playAudio: 'સલાહ સાંભળો',
    stopAudio: 'ઓડિયો રોકો',
    agentsRunning: 'સ્વાયત્ત એજન્ટ્સ સક્રિય છે',
    geofenceStatus: 'જિયોફેન્સિંગ અને દરિયાઈ સરહદ ચેતવણી',
    hazardAlerts: 'દરિયાઈ જોખમ ચેતવણી',
    pfzTitle: 'સંભવિત મત્સ્યઉદ્યોગ ઝોન (PFZ)',
    sosTrigger: 'ઇમરજન્સી SOS',
    safeHeading: 'સલામત પાછા ફરવાની દિશા',
    confidenceScore: 'વિશ્વાસ સ્તર',
    safetyIndex: 'બોટ સુરક્ષા સૂચકાંક',
    citations: 'સેટેલાઇટ અને એજન્સી પુરાવા',
    layers: 'સેટેલાઇટ અને સમુદ્ર સ્તરો',
    routePlanner: 'સલામત નેવિગેશન રૂટ પ્લાનર',
    vesselTracker: 'બોટ લાઇવ ટ્રેકિંગ',
  },
  mr: {
    appTitle: 'सागरAI सागरी बुद्धिमत्ता प्लॅटफॉर्म',
    subtitle: 'स्वायत्त एजंट सागरी निर्णय समर्थन प्रणाली',
    queryPlaceholder: 'मराठीत विचारा (उदा. मुंबई किनारपट्टीवर हवामान कसे आहे? मासेमारीस जाऊ शकतो का?)',
    send: 'विचारा',
    listening: 'ऐकत आहे...',
    voiceInput: 'आवाज इनपुट',
    playAudio: 'सल्ला ऐका',
    stopAudio: 'ऑडिओ थांबवा',
    agentsRunning: 'स्वायत्त एजंट कार्यरत आहेत',
    geofenceStatus: 'जिओफेन्सिंग आणि सागरी सीमा इशारा',
    hazardAlerts: 'सागरी धोका इशारे',
    pfzTitle: 'संभाव्य मत्स्य क्षेत्र (PFZ)',
    sosTrigger: 'आपत्कालीन SOS',
    safeHeading: 'सुरक्षित परतीची दिशा',
    confidenceScore: 'विश्वसनीयता स्तर',
    safetyIndex: 'बोट सुरक्षा निर्देशांक',
    citations: 'उपग्रह व आयएमडी पुरावे',
    layers: 'उपग्रह आणि समुद्र स्तर',
    routePlanner: 'हवामान सुरक्षित मार्ग नियोजन',
    vesselTracker: 'बोट थेट ट्रॅकिंग',
  },
  kn: {
    appTitle: 'ಸಾಗರ್AI ಸಾಗರ ಗುಪ್ತಚರ ವೇದಿಕೆ',
    subtitle: 'ಸ್ವಾಯತ್ತ ಏಜೆಂಟ್ ಸಮುದ್ರ ನಿರ್ಧಾರ ಬೆಂಬಲ ವ್ಯವಸ್ಥೆ',
    queryPlaceholder: 'ಕನ್ನಡದಲ್ಲಿ ಕೇಳಿ (ಉದಾ: ಮಂಗಳೂರು ಕರಾವಳಿಯಲ್ಲಿ ಅಲೆಗಳ ಎತ್ತರ ಎಷ್ಟು? ಮೀನುಗಾರಿಕೆಗೆ ಹೋಗಬಹುದೇ?)',
    send: 'ಕಳುಹಿಸಿ',
    listening: 'ಧ್ವನಿ ಆಲಿಸಲಾಗುತ್ತಿದೆ...',
    voiceInput: 'ಧ್ವನಿ ಇನ್ಪುಟ್',
    playAudio: 'ಆಡಿಯೋ ಆಲಿಸಿ',
    stopAudio: 'ನಿಲ್ಲಿಸಿ',
    agentsRunning: 'ಸ್ವಾಯತ್ತ ಏಜೆಂಟ್‌ಗಳು ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತಿವೆ',
    geofenceStatus: 'ಜಿಯೋಫೆನ್ಸಿಂಗ್ & ಅಂತರರಾಷ್ಟ್ರೀಯ ಸಮುದ್ರ ಗಡಿ',
    hazardAlerts: 'ಸಮುದ್ರ ಅಪಾಯ ಎಚ್ಚರಿಕೆಗಳು',
    pfzTitle: 'ಸಂಭಾವ್ಯ ಮೀನುಗಾರಿಕೆ ವಲಯಗಳು (PFZ)',
    sosTrigger: 'ತುರ್ತು SOS',
    safeHeading: 'ಸುರಕ್ಷಿತ ಮರಳುವ ದಿಕ್ಕು',
    confidenceScore: 'ವಿಶ್ವಾಸಾರ್ಹತೆ',
    safetyIndex: 'ದೋಣಿ ಸುರಕ್ಷತಾ ಸೂಚ್ಯಂಕ',
    citations: 'ಉಪಗ್ರಹ ಮತ್ತು ಇನ್ಕೋಯಿಸ್ ಪುರಾವೆ',
    layers: 'ಉಪಗ್ರಹ ಮತ್ತು ಸಮುದ್ರ ಪದರಗಳು',
    routePlanner: 'ಹವಾಮಾನ ಸುರಕ್ಷಿತ ಮಾರ್ಗ ಯೋಜನೆ',
    vesselTracker: 'ದೋಣಿ ಲೈವ್ ಟ್ರ್ಯಾಕಿಂಗ್',
  },
};

/**
 * Text-to-Speech audio synthesizer using standard browser SpeechSynthesis
 */
export function playTextToSpeech(text: string, lang: LanguageCode, onEnd?: () => void): () => void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported');
    onEnd?.();
    return () => {};
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Map our language code to standard BCP 47 tags
  const bcpMap: Record<LanguageCode, string> = {
    en: 'en-IN',
    hi: 'hi-IN',
    ta: 'ta-IN',
    te: 'te-IN',
    ml: 'ml-IN',
    bn: 'bn-IN',
    gu: 'gu-IN',
    mr: 'mr-IN',
    kn: 'kn-IN',
  };

  utterance.lang = bcpMap[lang] || 'en-IN';
  utterance.rate = 0.95; // Slightly slower for clear nautical advisories
  utterance.pitch = 1.0;

  // Try to find a regional voice
  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find(v => v.lang.startsWith(utterance.lang) || v.lang.includes(lang));
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  utterance.onend = () => {
    onEnd?.();
  };
  utterance.onerror = () => {
    onEnd?.();
  };

  window.speechSynthesis.speak(utterance);

  return () => {
    window.speechSynthesis.cancel();
  };
}
