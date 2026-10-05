import {
  AgentExecutionTrace,
  AgentThought,
  LanguageCode
} from '@/types/marine';
import { detectIndianLanguage } from './languageService';
import {
  ACTIVE_CYCLONE_VARUNA,
  DATA_CITATIONS,
  HAZARD_ALERTS,
  MARITIME_BOUNDARIES,
  POTENTIAL_FISHING_ZONES
} from './marineData';

export interface PredefinedScenario {
  id: string;
  title: string;
  query: string;
  language: LanguageCode;
  category: 'fishing' | 'boundary' | 'cyclone' | 'routing' | 'safety';
}

export const PREDEFINED_SCENARIOS: PredefinedScenario[] = [
  {
    id: 'scen-rameshwaram-tamil',
    title: 'Palk Strait Fishing & IMBL Check (Tamil)',
    query: 'ராமேஸ்வரத்திலிருந்து கடலுக்கு மீன்பிடிக்க செல்லலாமா? இலங்கை எல்லை மற்றும் வானிலை நிலவரம் என்ன?',
    language: 'ta',
    category: 'boundary'
  },
  {
    id: 'scen-cyclone-hindi',
    title: 'Cyclone Varuna Trajectory & Safety (Hindi)',
    query: 'बंगाल की खाड़ी में चक्रवात वरुण की स्थिति क्या है? क्या ओडिशा और आंध्र तट पर मछली पकड़ने जा सकते हैं?',
    language: 'hi',
    category: 'cyclone'
  },
  {
    id: 'scen-kochi-malayalam',
    title: 'Kochi High Swell & Kallakkadal (Malayalam)',
    query: 'കൊച്ചി തീരത്ത് ഉയർന്ന തിരമാല മുന്നറിയിപ്പ് (കള്ളക്കടൽ) നിലവിലുണ്ടോ? സുരക്ഷിത മീൻപിടുത്ത മേഖലകൾ എവിടെ?',
    language: 'ml',
    category: 'safety'
  },
  {
    id: 'scen-veraval-gujarati',
    title: 'Veraval PFZ & Border Clearance (Gujarati)',
    query: 'વેરાવળથી નીકળતી બોટ માટે પોટેન્શિયલ ફિશિંગ ઝોન ક્યાં છે? સર ક્રીક સીમાથી કેટલું અંતર રાખવું?',
    language: 'gu',
    category: 'fishing'
  },
  {
    id: 'scen-chennai-routing-en',
    title: 'Chennai to Port Blair Route Optimization',
    query: 'Plan an optimized safe navigational route from Chennai Port to Port Blair avoiding Cyclone Varuna gale winds.',
    language: 'en',
    category: 'routing'
  },
  {
    id: 'scen-vizag-telugu',
    title: 'Visakhapatnam Sea State & Warnings (Telugu)',
    query: 'విశాఖపట్నం తీరంలో ప్రస్తుత సముద్ర పరిస్థితి మరియు ఓడరేవు హెచ్చరిక సంకేతాలు ఏమిటి?',
    language: 'te',
    category: 'safety'
  },
  {
    id: 'scen-digha-bengali',
    title: 'Digha / Sundarbans Sea State (Bengali)',
    query: 'দিঘা এবং সুন্দরবন উপকূলে আবহাওয়া কেমন? ট্রলার নিয়ে সমুদ্রে যাওয়া কি নিরাপদ?',
    language: 'bn',
    category: 'fishing'
  }
];

export async function executeAgenticWorkflow(
  query: string,
  userSelectedLanguage?: LanguageCode,
  onStepUpdate?: (thought: AgentThought) => void
): Promise<AgentExecutionTrace> {
  const detectedLang = userSelectedLanguage || detectIndianLanguage(query);
  const queryId = 'exec-' + Date.now();
  const thoughts: AgentThought[] = [];

  const emitThought = (thought: AgentThought) => {
    thoughts.push(thought);
    onStepUpdate?.(thought);
  };

  const isRameswaram = /rameshwaram|rameswaram|palk|sri lanka|ராமேஸ்வர|இலங்கை|கச்சத்தீவு/i.test(query);
  const isCyclone = /cyclone|varuna|toofan|storm|புயல்|चक्रवात|తుఫాను|വാവാഴോડું|తుపాను/i.test(query);
  const isKochi = /kochi|kerala|swell|kallakkadal|തിരമാല|കൊച്ചി/i.test(query);
  const isGujarat = /gujarat|veraval|porbandar|sir creek|વેરાવળ|સર ક્રીક/i.test(query);
  const isRouting = /route|routing|waypoint|navigation|port blair|chennai|मार्ग|வழித்தடம்/i.test(query);

  // STAGE 1: Orchestrator / Planner Agent
  emitThought({
    id: 'step-1',
    agentId: 'agent-orchestrator',
    agentName: 'Orchestrator & Mission Planner Agent',
    timestamp: new Date().toLocaleTimeString(),
    stage: 'planning',
    thought: `Deconstructed natural language query into 5 sub-intents: (1) Spatial domain identification, (2) Multi-satellite Earth Observation retrieval, (3) Boundary & Geofence clearance check, (4) Marine hazard & cyclone risk synthesis, (5) Multilingual explainable advisory generation in ${detectedLang.toUpperCase()}.`,
    toolCall: {
      toolName: 'mission_planner.decompose_intent',
      params: { query, language: detectedLang, targetEezSector: isRameswaram ? 'Palk Bay / Mannar' : isCyclone ? 'Bay of Bengal' : 'Arabian Sea' },
      resultSummary: 'Plan formulated: 7 specialized agents queued with synchronous dependency graph.'
    },
    confidence: 98,
    status: 'completed'
  });

  // STAGE 2: Marine Earth Observation Discovery Agent
  emitThought({
    id: 'step-2',
    agentId: 'agent-eo-discovery',
    agentName: 'Marine Earth Observation Discovery Agent',
    timestamp: new Date().toLocaleTimeString(),
    stage: 'discovery',
    thought: `Queried ISRO Oceansat-3 OCM and NASA GHRSST Level-4 datasets. Detected Sea Surface Temperature (SST) ranging between 28.2°C and 29.8°C with marked coastal thermal fronts and Chlorophyll-a peak of 1.92 mg/m³.`,
    toolCall: {
      toolName: 'earth_observation.query_satellite_catalog',
      params: {
        sensors: ['Oceansat-3 (OCM-3)', 'NOAA-20 VIIRS', 'Sentinel-1 SAR C-band'],
        temporalWindow: 'Latest 12 hours composite',
        bbox: [8.0, 75.0, 22.0, 90.0]
      },
      resultSummary: `Discovered 4 active satellite datasets. SST front verified at [9.32°N, 79.42°E]. SAR wind vectors indicate moderate 14-18 knot surface stress.`
    },
    confidence: 96,
    status: 'completed'
  });

  // STAGE 3: Weather & Cyclone Intelligence Agent
  emitThought({
    id: 'step-3',
    agentId: 'agent-weather-cyclone',
    agentName: 'Weather & Cyclone Intelligence Agent',
    timestamp: new Date().toLocaleTimeString(),
    stage: 'analysis',
    thought: isCyclone
      ? `Active Very Severe Cyclonic Storm 'VARUNA' located at 15.4°N, 86.8°E with central pressure 968 hPa and max sustained winds of 145 km/h. Cone of uncertainty projects northwestward movement towards Gopalpur-Kalingapatnam coast.`
      : `Evaluated atmospheric models: INSAT-3DR indicates scattered convective thunderclouds over Gulf of Mannar with localized wind squalls (28 kt). Westcentral Bay of Bengal under IMD Great Danger Signal 9.`,
    toolCall: {
      toolName: 'meteorology.fetch_cyclone_and_wind_telemetry',
      params: { source: 'IMD RSMC New Delhi', radarStations: ['Karaikal', 'Chennai', 'Visakhapatnam', 'Kochi'] },
      resultSummary: `Atmospheric risk flagged: ${isCyclone ? 'CRITICAL - Cyclone Varuna within 250 NM' : 'MODERATE - Squall alert with intermittent lightning'}.`
    },
    confidence: 97,
    status: 'completed'
  });

  // STAGE 4: Ocean Analytics Agent (Waves, Currents, PFZ)
  emitThought({
    id: 'step-4',
    agentId: 'agent-ocean-analytics',
    agentName: 'Ocean Dynamics & Fisheries Analytics Agent',
    timestamp: new Date().toLocaleTimeString(),
    stage: 'analysis',
    thought: `Correlated INCOIS Ocean State Forecast: Significant wave height currently 1.4m to 1.8m in Palk Bay; however, SW coast (Kerala) experiencing 3.8m high swell surges (Kallakkadal alert). Potential Fishing Zone (PFZ) hotspot verified off Dhanushkodi with high pelagic mackerel probability.`,
    toolCall: {
      toolName: 'oceanography.compute_pfz_and_swell_vectors',
      params: { incoisGridId: 'INCOIS-PFZ-SE-04', waveModel: 'WAVEWATCH III' },
      resultSummary: `PFZ confirmed: Zone centered at 9.32°N, 79.42°E. High wave alert active for Kerala/Kanyakumari.`
    },
    confidence: 94,
    status: 'completed'
  });

  // STAGE 5: Geospatial Reasoning & Geofencing Agent
  emitThought({
    id: 'step-5',
    agentId: 'agent-geofence',
    agentName: 'Geospatial Reasoning & Geofencing Agent',
    timestamp: new Date().toLocaleTimeString(),
    stage: 'geospatial',
    thought: isRameswaram
      ? `CRITICAL GEOFENCE PROXIMITY CHECK: Monitored vessel IND-TN-09-MM-4421 is currently at coordinates [9.362°N, 79.435°E], only 2.8 Nautical Miles from the India - Sri Lanka International Maritime Boundary Line (IMBL). Buffer threshold is 5.0 NM. Computed safe return bearing: 255° WSW towards Mandapam/Rameswaram.`
      : isGujarat
      ? `Sir Creek border buffer analysis: Monitored vessels are currently 14.5 NM from Pakistani territorial waters. Safe margin maintained, but vigilance advised against strong ebb currents.`
      : `Geospatial boundary scan completed across 3 international maritime agreements and 3 Marine Protected Areas (Gulf of Mannar, Sundarbans, Gahirmatha). All active vessels checked against restricted conservation zones.`,
    toolCall: {
      toolName: 'geospatial.evaluate_boundary_proximity',
      params: {
        boundaryId: 'imbl-palk-strait',
        vesselCoords: [9.362, 79.435],
        warningBufferNm: 5.0
      },
      resultSummary: isRameswaram ? 'PROXIMITY WARNING TRIGGERED: Distance 2.8 NM to IMBL. Safe return vector generated: 255°.' : 'Boundaries safe.'
    },
    confidence: 99,
    status: isRameswaram ? 'warning' : 'completed'
  });

  // STAGE 6: Risk Assessment & Safety Agent
  const calculatedSafetyScore = isCyclone ? 18 : isRameswaram ? 64 : isKochi ? 58 : 88;
  const recommendedAction = isCyclone ? 'prohibited' : isRameswaram ? 'caution' : isKochi ? 'caution' : 'proceed';

  emitThought({
    id: 'step-6',
    agentId: 'agent-risk-assessment',
    agentName: 'Maritime Risk Assessment & Safety Agent',
    timestamp: new Date().toLocaleTimeString(),
    stage: 'risk',
    thought: `Composite Safety Index calculated at ${calculatedSafetyScore}/100. Key risk drivers: ${
      isCyclone
        ? 'Active cyclone gale winds (>140 km/h) & phenomenal 8m seas. Total prohibition.'
        : isRameswaram
        ? 'IMBL proximity warning (2.8 NM) + scattered lightning squalls. Caution required.'
        : isKochi
        ? 'Kallakkadal swell surge (3.8m waves). Small craft stay inshore.'
        : 'Favorable sea conditions, moderate wind and good visibility.'
    }`,
    toolCall: {
      toolName: 'risk_engine.evaluate_vessel_safety_index',
      params: { vesselClass: 'Mechanized Trawler (12-15m)', weatherScore: isCyclone ? 10 : 75, boundaryScore: isRameswaram ? 45 : 95 },
      resultSummary: `Safety Index: ${calculatedSafetyScore}/100. Status: ${recommendedAction.toUpperCase()}.`
    },
    confidence: 95,
    status: calculatedSafetyScore < 50 ? 'warning' : 'completed'
  });

  // STAGE 7: Route Optimization & Navigation Agent
  emitThought({
    id: 'step-7',
    agentId: 'agent-route-planner',
    agentName: 'Route Optimization & Navigation Agent',
    timestamp: new Date().toLocaleTimeString(),
    stage: 'routing',
    thought: isRouting || isCyclone
      ? `Computed dynamic waypoint path. Automatically routed navigation corridor 220 NM south of Cyclone Varuna's gale radius, avoiding bathymetric shallow shoals and maintaining 12 NM clearance from foreign EEZ lines. Estimated fuel savings: 14% vs unoptimized detour.`
      : `Local navigation corridors validated. Recommended track maintains minimum 4.5 NM distance inside Indian sovereign waters, ensuring full access to Dhanushkodi PFZ without boundary breach risk.`,
    toolCall: {
      toolName: 'navigation.generate_weather_routing',
      params: { departure: 'Rameswaram / Chennai', avoidPolygons: ['imbl-palk-strait-buffer', 'cyclone-varuna-cone'] },
      resultSummary: 'Optimized 5-waypoint safe track plotted with zero boundary violations.'
    },
    confidence: 96,
    status: 'completed'
  });

  // STAGE 8: Explainable Synthesis & Advisory Agent (Multilingual)
  const synthesisMap: Record<LanguageCode, string> = {
    en: isCyclone
      ? `CRITICAL ADVISORY (IMD / INCOIS): Severe Cyclone VARUNA is active in Westcentral Bay of Bengal moving towards Odisha-Andhra coast with 145 km/h winds and 8m waves. ALL FISHING OPERATIONS PROHIBITED. Vessels at sea must immediately steer for nearest safe port.`
      : isRameswaram
      ? `CAUTIONARY ADVISORY (Palk Strait / Rameswaram): Potential Fishing Zone (PFZ) is active 6 NM East of Dhanushkodi with high mackerel yield. WARNING: You are 2.8 NM from the Sri Lanka IMBL boundary. DO NOT cross 79° 32' E longitude. If drifting East, steer immediately along Safe Return Vector 255° WSW towards Mandapam. Lower antennas during current lightning squalls.`
      : isKochi
      ? `INCOIS KALLAKKADAL ALERT: Swell waves reaching 3.8m along Kerala coast. Small crafts and motorized boats should avoid nearshore surf zones. High tide alert at 11:20 IST. PFZ active 18 NM offshore Kochi shelf.`
      : `MARINE ADVISORY: Ocean conditions are generally favorable. SST fronts at 28.6°C indicate prime fishing grounds at Dhanushkodi shelf. Maintain 5 NM buffer from maritime boundaries.`,
    hi: isCyclone
      ? `गंभीर समुद्री चेतावनी (IMD / INCOIS): बंगाल की खाड़ी में भीषण चक्रवाती तूफान 'वरुण' सक्रिय है। हवा की गति 145 किमी/घंटा और 8 मीटर ऊंची लहरें हैं। समुद्र में जाना पूरी तरह प्रतिबंधित है। सभी नावें तुरंत नजदीकी बंदरगाह पर लौटें।`
      : isRameswaram
      ? `सतर्कता सलाह (रामेश्वरम / पाक जलडमरूमध्य): धनुषकोडी के पास 6 नॉटिकल मील पूर्व में मछली पकड़ने का अनुकूल क्षेत्र (PFZ) सक्रिय है। चेतावनी: आपकी नाव श्रीलंका समुद्री सीमा (IMBL) से केवल 2.8 मील दूर है! सीमा पार न करें। सुरक्षित वापसी के लिए तुरंत 255° WSW दिशा में नाव मोड़ें। बिजली कड़कने के दौरान एंटीना नीचे रखें।`
      : isKochi
      ? `केरल तट चेतावनी (INCOIS): कल्लाक्कदल (ऊंची समुद्री लहरें) 3.8 मीटर तक उठ रही हैं। छोटी नौकाएं समुद्र में न जाएं। उच्च ज्वार के दौरान तट से दूरी बनाए रखें।`
      : `समुद्री मौसम सलाह: समुद्र की स्थिति सामान्य है। धनुषकोडी और वेरावल तट पर मछली की अच्छी संभावना है। सीमा नियमों का पालन करें।`,
    ta: isCyclone
      ? `தீவிர புயல் எச்சரிக்கை (IMD / INCOIS): வங்கக்கடலில் 'வருணா' புயல் மிக தீவிரமடைந்துள்ளது (காற்று 145 கி.மீ/மணி, அலைகள் 8 மீட்டர்). மீனவர்கள் கடலுக்குச் செல்ல வேண்டாம் என முற்றிலுமாக தடை விதிக்கப்பட்டுள்ளது. கடலில் உள்ள படகுகள் உடனே கரை திரும்பவும்.`
      : isRameswaram
      ? `ராமேஸ்வரம் மீனவர்களுக்கான எச்சரிக்கை & வழிகாட்டுதல்: தனுஷ்கோடிக்கு கிழக்கே 6 கடல் மைல் தொலைவில் நல்ல மீன்பிடி மண்டலம் (PFZ) உள்ளது. முக்கிய எச்சரிக்கை: நீங்கள் இலங்கை சர்வதேச எல்லைக்கு (IMBL) மிக அருகில் (2.8 மைல்) உள்ளீர்கள்! எக்காரணம் கொண்டும் எல்லையைத் தாண்டாதீர்கள். கிழக்கு நோக்கி இழுத்துச் செல்லப்பட்டால், உடனடியாக 255° WSW திசையில் மண்டபம் நோக்கி திரும்பவும். மின்னல் எச்சரிக்கை உள்ளதால் ஆண்டெனாவை தாழ்த்தவும்.`
      : isKochi
      ? `கேரளா மற்றும் குமரி கடல் எச்சரிக்கை (INCOIS): கள்ளக்கடல் பேரலைகள் 3.8 மீட்டர் வரை எழக்கூடும். நாட்டுப்படகுகள் மற்றும் விசைப்படகுகள் எச்சரிக்கையுடன் இருக்கவும்.`
      : `கடல்சார் வழிகாட்டுதல்: தனுஷ்கோடி கடல் பகுதியில் மத்தி மற்றும் கானாங்கெளுத்தி மீன்கள் கிடைக்க வாய்ப்புள்ளது. இலங்கை எல்லையில் 5 மைல் தூரம் தள்ளி இருக்கவும்.`,
    te: isCyclone
      ? `తీవ్ర తుఫాను హెచ్చరిక (IMD): బంగాళాఖాతంలో 'వరుణ' తుఫాను తీవ్ర రూపం దాల్చింది. గంటకు 145 కి.మీ వేగంతో గాలులు, 8 మీటర్ల ఎత్తున అలలు ఎగసిపడుతున్నాయి. మత్స్యకారులు సముద్రంలోకి వేటకు వెళ్లరాదు.`
      : isRameswaram
      ? `రామేశ్వరం సముద్ర హెచ్చరిక: ధనుష్కోడి సమీపంలో మంచి చేపల లభ్యత మండలం (PFZ) ఉంది. హెచ్చరిక: మీరు శ్రీలంక సముద్ర సరిహద్దుకు (IMBL) కేవలం 2.8 మైళ్ల దూరంలో ఉన్నారు. తూర్పు సరిహద్దు దాటవద్దు, వెంటనే 255° దిశలో సురక్షిత తీరానికి తిరగండి.`
      : `సముద్ర వాతావరణ సలహా: సముద్ర పరిస్థితులు సాధారణంగా ఉన్నాయి. సరిహద్దు నిబంధనలను పాటించండి.`,
    ml: isCyclone
      ? `അതീവ ജാഗ്രതാ നിർദ്ദേശം: ബംഗാൾ ഉൾക്കടലിൽ 'വരുണ' ചുഴലിക്കാറ്റ് അതിശക്തമായി തുടരുന്നു. മത്സ്യത്തൊഴിലാളികൾ കടലിൽ പോകരുതെന്ന് കർശന വിലക്ക്.`
      : isKochi
      ? `ഇൻകോയിസ് കള്ളക്കടൽ മുന്നറിയിപ്പ്: കേരള തീരത്ത് 3.8 മീറ്റർ വരെ ഉയർന്ന തിരമാലകൾക്ക് സാധ്യത. ചെറിയ വള്ളങ്ങളും ബോട്ടുകളും കടലിൽ ഇറങ്ങരുത്. രാമേശ്വരം ഭാഗത്ത് ശ്രീലങ്കൻ അതിർത്തിയിൽ 2.8 മൈൽ മാത്രം അകലത്തിൽ ബോട്ട് ഉള്ളതിനാൽ 255° ദിശയിൽ തിരിച്ചുവരിക.`
      : `സമുദ്ര വിവരണം: കൊച്ചി, വിഴിഞ്ഞം തീരങ്ങളിൽ ഉയർന്ന തിരമാല ജാഗ്രത. ധനുഷ്കോടിയിൽ മത്സ്യ ലഭ്യത അനുകൂലം.`,
    bn: isCyclone
      ? `ঘূর্ণিঝড় সতর্কতা (IMD): বঙ্গোপসাগরে অতি তীব্র ঘূর্ণিঝড় 'বরুণ' আছড়ে পড়ার সম্ভাবনা। বাতাসের গতিবেগ ১৪৫ কিমি/ঘণ্টা। সমুদ্রে মাছ ধরতে যাওয়া সম্পূর্ণ নিষিদ্ধ। সকল ট্রলার অবিলম্বে বন্দরে ফিরুন।`
      : `সামুদ্রিক পরামর্শ: দিঘা উপকূলে ঢেউ স্বাভাবিক। তবে সুন্দরবন ও গভীর সমুদ্রে সীমান্ত এবং আবহাওয়া সংক্রান্ত সতর্কতা বজায় রাখুন।`,
    gu: isCyclone
      ? `વાવાઝોડાની ગંભીર ચેતવણી: બંગાળની ખાડીમાં 'વરુણ' વાવાઝોડું તીવ્ર બન્યું છે. માછીમારોને દરિયો ન ખેડવા કડક આદેશ.`
      : isGujarat
      ? `વેરાવળ અને પોરબંદર માછીમારો માટે સલાહ: સર ક્રીક આંતરરાષ્ટ્રીય દરિયાઈ સરહદથી તમારી બોટ 14.5 નોટિકલ માઈલ દૂર સલામત છે. વેરાવળ સમુદ્રમાં સારી માછલી મળવાની શક્યતા (PFZ) છે.`
      : `દરિયાઈ સલાહ: દરિયાની સ્થિતિ સામાન્ય છે. સરહદ વિસ્તારમાં યોગ્ય અંતર જાળવી રાખો.`,
    mr: isCyclone
      ? `तीव्र चक्रीवादळ इशारा (IMD): बंगालच्या उपसागरात 'वरुण' चक्रीवादळ सक्रिय आहे. मच्छिमारांनी समुद्रात जाऊ नये. सर्व बोटी तात्काळ बंदरात आणाव्यात.`
      : `सागरी सल्ला: मुंबई व कोकण किनारपट्टीवर हवामान मध्यम आहे. रामेश्वरम भागात आंतरराष्ट्रीय सीमेजवळ दक्षता बाळगा.`,
    kn: isCyclone
      ? `ತೀವ್ರ ಚಂಡಮಾರುತ ಎಚ್ಚರಿಕೆ: ಬಂಗಾಳಕೊಲ್ಲಿಯಲ್ಲಿ 'ವರುಣ' ಚಂಡಮಾರುತ ತೀವ್ರಗೊಂಡಿದೆ. ಮೀನುಗಾರರು ಸಮುದ್ರಕ್ಕೆ ಇಳಿಯದಂತೆ ಕಟ್ಟುನಿಟ್ಟಿನ ಸೂಚನೆ.`
      : `ಸಾಗರ ಸಲಹೆ: ಕರಾವಳಿಯಲ್ಲಿ ಅಲೆಗಳ ಏರಿಳಿತವಿದೆ. ರಾಮೇಶ್ವರಂ ಸಮೀಪ ಅಂತಾರಾಷ್ಟ್ರೀಯ ಗಡಿಯಿಂದ ಸುರಕ್ಷಿತ ಅಂತರ ಕಾಪಾಡಿಕೊಳ್ಳಿ.`
  };

  const finalAdvisory = synthesisMap[detectedLang] || synthesisMap.en;

  emitThought({
    id: 'step-8',
    agentId: 'agent-synthesis',
    agentName: 'Explainable Synthesis & Regional Advisory Agent',
    timestamp: new Date().toLocaleTimeString(),
    stage: 'synthesis',
    thought: `Synthesized cross-domain inputs from 5 authoritative agencies (INCOIS, IMD, NASA, Copernicus, ISRO). Generated plain-language tactical advisory with verified citations, confidence score 96%, and full regional language localization.`,
    toolCall: {
      toolName: 'synthesis.generate_multilingual_advisory',
      params: { outputLanguage: detectedLang, confidenceThreshold: 0.9, verifiedSourcesCount: 5 },
      resultSummary: `Final advisory synthesized in ${detectedLang.toUpperCase()} with 5 verified agency citations.`
    },
    confidence: 96,
    status: 'completed'
  });

  return {
    queryId,
    userQuery: query,
    detectedLanguage: detectedLang,
    plan: [
      'Deconstruct natural language query and identify geographic bounding box',
      'Harvest satellite Earth Observation data (SST fronts, Chlorophyll PFZ, SAR surface winds)',
      'Assess meteorological hazards and track Cyclone Varuna trajectory',
      'Model wave heights, currents, and ocean swell conditions via INCOIS OSF',
      'Perform precision geofencing analysis against IMBL and Marine Protected Areas',
      'Compute vessel safety score (0-100) and actionable navigation vectors',
      'Generate explainable, evidence-backed advisory in user regional language'
    ],
    thoughts,
    citations: DATA_CITATIONS,
    synthesisAdvisory: finalAdvisory,
    overallConfidence: 96,
    safetyScore: calculatedSafetyScore,
    recommendedAction
  };
}
