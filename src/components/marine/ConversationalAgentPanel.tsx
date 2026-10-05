import React, { useState, useEffect, useRef } from 'react';
import {
  ConversationalMessage,
  LanguageCode,
  AgentExecutionTrace,
  AgentThought
} from '@/types/marine';
import {
  SUPPORTED_LANGUAGES,
  detectIndianLanguage,
  UI_TRANSLATIONS,
  playTextToSpeech
} from '@/services/languageService';
import {
  executeAgenticWorkflow,
  PREDEFINED_SCENARIOS
} from '@/services/agentEngine';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Bot,
  User,
  Send,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Download,
  Terminal,
  FileText,
  Key,
  ChevronDown,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface ConversationalAgentPanelProps {
  currentLanguage: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  onTraceGenerated?: (trace: AgentExecutionTrace) => void;
  onOpenMapSettings?: () => void;
}

export const ConversationalAgentPanel: React.FC<ConversationalAgentPanelProps> = ({
  currentLanguage,
  onLanguageChange,
  onTraceGenerated,
  onOpenMapSettings
}) => {
  const [messages, setMessages] = useState<ConversationalMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTrace, setActiveTrace] = useState<AgentExecutionTrace | null>(null);
  const [showTraceInspector, setShowTraceInspector] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedAgentTab, setSelectedAgentTab] = useState<string>('all');
  const [expandedThoughtId, setExpandedThoughtId] = useState<string | null>(null);

  const stopAudioRef = useRef<(() => void) | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const t = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.en;

  // Initialize with welcoming regional advisory
  useEffect(() => {
    const initialTextMap: Record<LanguageCode, string> = {
      en: "Greetings. I am SagarAI, your Agentic Marine Intelligence Officer. I continuously monitor satellite Earth Observation data, INCOIS ocean forecasts, IMD cyclones, and International Maritime Boundary Lines (IMBL). Ask me any question in English or any Indian regional language.",
      hi: "नमस्ते। मैं सागरAI, आपका स्वायत्त समुद्री सलाहकार हूँ। मैं उपग्रह अवलोकन, मौसम, चक्रवात वरुण एवं समुद्री सीमाओं की 24x7 निगरानी करता हूँ। अपनी भाषा में कोई भी प्रश्न पूछें।",
      ta: "வணக்கம்! நான் சாகர்AI கடல் நுண்ணறிவு முகவர். செயற்கைக்கோள் தரவுகள், வானிலை, புயல் மற்றும் சர்வதேச கடல் எல்லைகளை (IMBL) தொடர்ந்து கண்காணிக்கிறேன். தமிழில் உங்கள் கேள்விகளைக் கேளுங்கள்.",
      te: "నమస్కారం! నేను సాగర్AI సముద్ర మేధో ఏజెంట్‌ని. ఉపగ్రహ డేటా, ఇన్కోయిస్ సూచనలు మరియు సరిహద్దు హెచ్చరికలను పర్యవేక్షిస్తాను. మీ ప్రశ్నను అడగండి.",
      ml: "നമസ്കാരം! ഞാൻ സാഗർAI സമുദ്ര ഇന്റലിജൻസ് ഓഫീസറാണ്. ഉപഗ്രഹ വിവരങ്ങളും സമുദ്ര സുരക്ഷാ മുന്നറിയിപ്പുകളും നൽകുന്നു. മലയാളത്തിൽ ചോദിക്കൂ.",
      bn: "নমস্কার! আমি সাগরAI সামুদ্রিক বুদ্ধিমত্তা কর্মকর্তা। বঙ্গোপসাগরের ঘূর্ণিঝড়, ঢেউ এবং সীমান্ত পরিস্থিতি জানতে যেকোনো প্রশ্ন করুন।",
      gu: "નમસ્તે! હું સાગરAI મરીન ઇન્ટેલિજન્સ એજન્ટ છું. ઉપગ્રહ ડેટા અને સર ક્રીક સીમા સંબંધિત માહિતી માટે ગુજરાતીમાં પૂછો.",
      mr: "नमस्कार! मी सागरAI सागरी बुद्धिमत्ता सल्लागार आहे. उपग्रह डेटा व हवामान माहितीसाठी विचारा.",
      kn: "ನಮಸ್ಕಾರ! ನಾನು ಸಾಗರ್AI ಸಾಗರ ಗುಪ್ತಚರ ಅಧಿಕಾರಿ. ಸಮುದ್ರ ಸ್ಥಿತಿ ಹಾಗೂ ಗಡಿ ಎಚ್ಚರಿಕೆಗಳ ಬಗ್ಗೆ ಕನ್ನಡದಲ್ಲಿ ಕೇಳಿ."
    };

    setMessages([
      {
        id: 'msg-welcome',
        sender: 'agent',
        language: currentLanguage,
        text: initialTextMap[currentLanguage] || initialTextMap.en,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [currentLanguage]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text || text.trim().length === 0 || isProcessing) return;

    // Check if user is asking to configure CARTO key or basemap
    if (text.toLowerCase().includes('carto') || text.toLowerCase().includes('api key') || text.toLowerCase().includes('basemap')) {
      onOpenMapSettings?.();
    }
    // Detect language automatically
    const detected = detectIndianLanguage(text);
    if (detected !== currentLanguage) {
      onLanguageChange(detected);
    }

    const userMessage: ConversationalMessage = {
      id: 'msg-user-' + Date.now(),
      sender: 'user',
      language: detected,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);

    try {
      const trace = await executeAgenticWorkflow(text, detected);
      setActiveTrace(trace);
      onTraceGenerated?.(trace);

      const agentMessage: ConversationalMessage = {
        id: 'msg-agent-' + Date.now(),
        sender: 'agent',
        language: detected,
        text: trace.synthesisAdvisory,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        trace
      };

      setMessages(prev => [...prev, agentMessage]);
    } catch (err) {
      console.error('Agent execution failed', err);
      setMessages(prev => [
        ...prev,
        {
          id: 'msg-err-' + Date.now(),
          sender: 'system',
          language: currentLanguage,
          text: 'Error in agent collaboration pipeline. Falling back to local emergency telemetry.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAudioPlayback = (text: string, lang: LanguageCode) => {
    if (isPlayingAudio) {
      stopAudioRef.current?.();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    const stopFn = playTextToSpeech(text, lang, () => {
      setIsPlayingAudio(false);
    });
    stopAudioRef.current = stopFn;
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      // Simulate voice input for testing
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        const sampleVoiceQueries: Record<LanguageCode, string> = {
          en: 'Is it safe to sail from Rameswaram? Show cyclone track.',
          hi: 'क्या रामेश्वरम से मछली पकड़ने जाना सुरक्षित है? चक्रवात देखें।',
          ta: 'ராமேஸ்வரத்திலிருந்து கடலுக்கு மீன்பிடிக்க செல்லலாமா?',
          te: 'విశాఖపట్నం తీరంలో ప్రస్తుత సముద్ర పరిస్థితి ఏమిటి?',
          ml: 'കൊച്ചി തീരത്ത് ഉയർന്ന തിരമാല മുന്നറിയിപ്പ് ഉണ്ടോ?',
          bn: 'দিঘা উপকূলে আবহাওয়া কেমন? সমুদ্রে যাওয়া কি নিরাপদ?',
          gu: 'વેરાવળથી નીકળતી બોટ માટે દરિયો કેવો છે?',
          mr: 'मुंबई किनारपट्टीवर हवामान कसे आहे?',
          kn: 'ಮಂಗಳೂರು ಕರಾವಳಿಯಲ್ಲಿ ಅಲೆಗಳ ಎತ್ತರ ಎಷ್ಟು?'
        };
        const simulatedText = sampleVoiceQueries[currentLanguage] || sampleVoiceQueries.en;
        handleSendMessage(simulatedText);
      }, 2000);
      return;
    }

    // Native Web Speech Recognition
    // @ts-expect-error browser prefix
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = currentLanguage === 'en' ? 'en-IN' : currentLanguage + '-IN';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        handleSendMessage(transcript);
      }
    };

    recognition.start();
  };

  // Export current advisory as printable text report
  const handleExportAdvisory = () => {
    if (!activeTrace) return;
    const report = `====================================================
SAGAR AI | AGENTIC MARINE INTELLIGENCE ADVISORY REPORT
Generated: ${new Date().toLocaleString()} (IST)
Detected Language: ${activeTrace.detectedLanguage.toUpperCase()}
Overall Confidence: ${activeTrace.overallConfidence}%
Composite Safety Index: ${activeTrace.safetyScore}/100
Recommended Action: ${activeTrace.recommendedAction.toUpperCase()}
====================================================

[USER QUERY]:
${activeTrace.userQuery}

[MULTI-AGENT SYNTHESIZED ADVISORY]:
${activeTrace.synthesisAdvisory}

[AGENT REASONING PIPELINE]:
${activeTrace.thoughts.map(t => `- [${t.agentName}] [Confidence: ${t.confidence}%]: ${t.thought}`).join('\n')}

[AUTHORITATIVE SATELLITE & AGENCY CITATIONS]:
${activeTrace.citations.map(c => `- ${c.source}: ${c.dataset} (${c.timestamp})`).join('\n')}

====================================================
Issued under Indian Ocean Maritime Safety Protocols
====================================================`;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SagarAI_Marine_Advisory_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-border rounded-lg overflow-hidden shadow-2xl">
      {/* Header with Language Selector & Multi-Agent status indicator */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 bg-slate-950/80 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-primary/20 border border-primary/50 flex items-center justify-center text-primary">
            <Bot className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white text-sm">SagarAI Agentic Core</span>
              <Badge variant="outline" className="text-[10px] bg-emerald-950/80 text-emerald-400 border-emerald-800">
                8 Agents Synced
              </Badge>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* Indian Regional Language Selector */}
        <div className="flex items-center gap-1.5">
          <label htmlFor="language-select" className="text-[11px] text-slate-400 font-mono hidden md:inline">Language:</label>
          <select
            id="language-select"
            value={currentLanguage}
            onChange={e => onLanguageChange(e.target.value as LanguageCode)}
            className="text-xs bg-slate-800 border border-slate-700 text-slate-200 rounded px-2 py-1 font-medium focus:ring-1 focus:ring-primary focus:outline-none"
          >
            {SUPPORTED_LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.nativeName} ({lang.name})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Scenario Buttons for Fishermen in Regional Languages */}
      <div className="px-3 py-1.5 bg-slate-950/40 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap text-xs">
        <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1 shrink-0">
          <Sparkles className="w-3 h-3 text-amber-400" /> Quick Inquiries:
        </span>
        <button
          onClick={() => {
            onOpenMapSettings?.();
            handleSendMessage('How do I configure and paste my CARTO API key?');
          }}
          disabled={isProcessing}
          className="px-2 py-0.5 rounded bg-amber-950/70 hover:bg-amber-900 text-amber-300 hover:text-white border border-amber-600/70 text-[11px] transition-colors shrink-0 flex items-center gap-1 font-semibold"
        >
          <Key className="w-3 h-3" /> CARTO Key Setup
        </button>
        {PREDEFINED_SCENARIOS.map(scen => (
          <button
            key={scen.id}
            onClick={() => handleSendMessage(scen.query)}
            disabled={isProcessing}
            className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 text-[11px] transition-colors shrink-0"
          >
            {scen.title}
          </button>
        ))}
      </div>

      {/* Main Chat History Area */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3.5 min-h-[280px]">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-1 px-1">
              {msg.sender === 'user' ? (
                <>
                  <User className="w-3 h-3" />
                  <span>Navigator</span>
                </>
              ) : (
                <>
                  <Bot className="w-3 h-3 text-primary" />
                  <span>SagarAI Autonomous Agent</span>
                  <span className="text-emerald-400 uppercase font-mono">[{msg.language}]</span>
                </>
              )}
              <span>•</span>
              <span>{msg.timestamp}</span>
            </div>

            <div
              className={`max-w-[92%] sm:max-w-[85%] rounded-lg p-3 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-primary text-primary-foreground font-medium rounded-tr-none shadow-md'
                  : 'bg-slate-800/90 border border-slate-700/80 text-slate-100 rounded-tl-none shadow-lg'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {/* Action bar for Agent responses: TTS voice playback, trace inspector toggle */}
              {msg.sender === 'agent' && (
                <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleAudioPlayback(msg.text, msg.language)}
                      className="h-6 px-2 text-[10px] text-sky-400 hover:text-sky-300 hover:bg-sky-950/40"
                    >
                      {isPlayingAudio ? (
                        <>
                          <VolumeX className="w-3 h-3 mr-1 text-rose-400 animate-pulse" />
                          {t.stopAudio}
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3 h-3 mr-1" />
                          {t.playAudio}
                        </>
                      )}
                    </Button>

                    {msg.trace && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setActiveTrace(msg.trace!);
                          setShowTraceInspector(prev => !prev);
                        }}
                        className="h-6 px-2 text-[10px] text-amber-400 hover:text-amber-300 hover:bg-amber-950/40 font-mono"
                      >
                        <Terminal className="w-3 h-3 mr-1" />
                        {showTraceInspector ? 'Hide Agent Trace' : 'View Agent Trace (8 Steps)'}
                      </Button>
                    )}
                  </div>

                  {msg.trace && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-400">
                        Confidence: <span className="text-emerald-400 font-bold">{msg.trace.overallConfidence}%</span>
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-[9px] uppercase font-mono ${
                          msg.trace.recommendedAction === 'proceed'
                            ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                            : msg.trace.recommendedAction === 'caution'
                            ? 'bg-amber-950 text-amber-400 border-amber-800'
                            : 'bg-rose-950 text-rose-400 border-rose-800'
                        }`}
                      >
                        {msg.trace.recommendedAction}
                      </Badge>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Real-time Agent Execution Stream Indicator */}
        {isProcessing && (
          <div className="flex items-start gap-2 max-w-[85%] bg-slate-800/60 border border-primary/40 rounded-lg p-3 text-xs text-slate-300 animate-pulse">
            <Cpu className="w-4 h-4 text-primary animate-spin shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-semibold text-primary font-mono text-xs">
                {t.agentsRunning}...
              </div>
              <div className="text-[11px] text-slate-400">
                Orchestrator decomposing intent → Querying Oceansat-3 SST/Chlorophyll → Checking IMBL boundaries → Synthesizing regional advisory...
              </div>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Collapsible Multi-Agent Execution Trace Inspector */}
      {showTraceInspector && activeTrace && (
        <div className="max-h-64 border-t border-slate-700 bg-slate-950 p-3 overflow-y-auto text-xs space-y-2">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
            <div className="flex items-center gap-1.5 text-amber-400 font-mono font-semibold">
              <Terminal className="w-4 h-4" />
              <span>Multi-Agent Thought Process & Execution Trace</span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleExportAdvisory}
                className="h-6 px-2 text-[10px] text-slate-300 hover:text-white"
              >
                <Download className="w-3 h-3 mr-1" />
                Export Report
              </Button>
              <button
                onClick={() => setShowTraceInspector(false)}
                className="text-slate-400 hover:text-white px-1 text-xs"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Trace steps accordion */}
          <div className="space-y-1.5">
            {activeTrace.thoughts.map((thought, idx) => {
              const isExpanded = expandedThoughtId === thought.id || expandedThoughtId === null;
              return (
                <div
                  key={thought.id}
                  className="rounded border border-slate-800 bg-slate-900/80 p-2 text-[11px] space-y-1"
                >
                  <div
                    onClick={() => setExpandedThoughtId(expandedThoughtId === thought.id ? null : thought.id)}
                    className="flex items-center justify-between cursor-pointer font-mono"
                  >
                    <div className="flex items-center gap-1.5">
                      {isExpanded ? <ChevronDown className="w-3 h-3 text-slate-400" /> : <ChevronRight className="w-3 h-3 text-slate-400" />}
                      <span className="text-slate-400 text-[10px]">#{idx + 1}</span>
                      <span className="font-bold text-sky-400">{thought.agentName}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400">{thought.timestamp}</span>
                      <span className="px-1 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[9px] font-bold">
                        {thought.confidence}%
                      </span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="pt-1 pl-4 space-y-1 border-t border-slate-800/80 text-slate-300">
                      <p>{thought.thought}</p>
                      {thought.toolCall && (
                        <div className="p-1.5 rounded bg-slate-950/80 border border-slate-800 font-mono text-[10px] text-slate-400">
                          <div className="text-amber-400 font-bold">Tool: {thought.toolCall.toolName}</div>
                          <div>Result: {thought.toolCall.resultSummary}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Agency citations */}
          <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400">
            <span className="font-bold text-slate-300">Verified Citations:</span> INCOIS (OSF/PFZ), IMD Cyclone RSMC, NASA/NOAA GHRSST, Copernicus Sentinel-1 SAR, ISRO MOSDAC.
          </div>
        </div>
      )}

      {/* Input Composer with Voice Mic & Regional Send */}
      <div className="p-2.5 bg-slate-950 border-t border-border">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-1.5"
        >
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={handleVoiceInput}
            className={`h-9 w-9 shrink-0 ${isListening ? 'bg-rose-600 text-white animate-pulse' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            title={t.voiceInput}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>

          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder={isListening ? t.listening : t.queryPlaceholder}
            disabled={isProcessing}
            className="flex-1 min-w-0 bg-slate-800 border border-slate-700 text-slate-100 placeholder:text-slate-500 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
          />

          <Button
            type="submit"
            disabled={isProcessing || !inputValue.trim()}
            className="h-9 px-3 text-xs bg-primary hover:bg-primary/90 text-white shrink-0 font-medium"
          >
            <Send className="w-3.5 h-3.5 mr-1" />
            <span className="hidden sm:inline">{t.send}</span>
          </Button>
        </form>
      </div>
    </div>
  );
};
