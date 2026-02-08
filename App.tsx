
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Cloud, 
  Droplets, 
  Wind, 
  Thermometer, 
  Gauge, 
  Navigation, 
  HelpCircle, 
  Send, 
  X,
  MapPin,
  Mountain,
  Zap,
  Leaf,
  AlertTriangle,
  RefreshCw,
  Clock,
  Languages,
  ChevronDown
} from 'lucide-react';
import { TimeOfDay, WeatherData, ForecastDay, HourlyForecast, ChatMessage, ThemeConfig, AppLanguage } from './types';
import { askWeatherAI, getRealtimeWeather, get20DayForecast, getHourlyForecast } from './services/geminiService';
import { SunnyAnimation, CloudyAnimation, RainyAnimation, ThunderAnimation } from './components/CartoonAnimations';
import { MetricCard } from './components/MetricCard';

const THEMES: Record<TimeOfDay, ThemeConfig> = {
  morning: {
    bgGradient: 'from-orange-200 via-pink-200 to-blue-200',
    accentColor: 'text-orange-500',
    cardBg: 'bg-white/70',
    textColor: 'text-orange-900',
  },
  noon: {
    bgGradient: 'from-sky-400 to-blue-300',
    accentColor: 'text-blue-600',
    cardBg: 'bg-white/80',
    textColor: 'text-blue-900',
  },
  afternoon: {
    bgGradient: 'from-orange-400 via-purple-400 to-indigo-500',
    accentColor: 'text-purple-600',
    cardBg: 'bg-white/70',
    textColor: 'text-purple-900',
  },
  night: {
    bgGradient: 'from-indigo-900 via-blue-900 to-slate-900',
    accentColor: 'text-blue-300',
    cardBg: 'bg-indigo-950/40',
    textColor: 'text-indigo-100',
  }
};

const TRANSLATIONS: Record<AppLanguage, any> = {
  en: {
    detecting: "Detecting...",
    live: "Live",
    pressure: "Pressure",
    altitude: "Altitude",
    humidity: "Humidity",
    vocs: "VOCs",
    airQuality: "Air Quality",
    nextHours: "Next Hours",
    outlook: "20-Day Outlook",
    swipe: "Swipe for more →",
    askEnvAI: "Ask EnvAI",
    assistantSub: "Environmental Intelligence Assistant",
    chatPlaceholder: "Ask EnvAI about your surroundings...",
    thinking: "EnvAI is thinking",
    welcome: "Hi! I'm EnvAI, your personal eco-bot. How can I help you today?",
    faqTitle: "Help Center",
    faqSub: "EnvWrist Support",
    closeFaq: "Close FAQ",
    safetyAlert: "Safety Alert",
    liveInsight: "Live Insight",
    mappingHours: "Mapping the next hours...",
    gatheringData: "Gathering 20-day AI data...",
    faq: [
      { q: "What is EnvWrist?", a: "EnvWrist is an environmental platform helping you monitor air quality and weather precisely." },
      { q: "What are VOCs?", a: "VOCs are chemicals in the air. Lower is better for your health!" },
      { q: "How accurate is it?", a: "We use EnvAI and satellite grounding for high reliability." }
    ]
  },
  id: {
    detecting: "Mendeteksi...",
    live: "Langsung",
    pressure: "Tekanan",
    altitude: "Ketinggian",
    humidity: "Kelembaban",
    vocs: "VOC",
    airQuality: "Kualitas Udara",
    nextHours: "Beberapa Jam Mendatang",
    outlook: "Prakiraan 20 Hari",
    swipe: "Geser untuk lebih banyak →",
    askEnvAI: "Tanya EnvAI",
    assistantSub: "Asisten Kecerdasan Lingkungan",
    chatPlaceholder: "Tanya EnvAI tentang lingkunganmu...",
    thinking: "EnvAI sedang berpikir",
    welcome: "Halo! Aku EnvAI, robot eko pribadimu. Apa yang bisa kubantu hari ini?",
    faqTitle: "Pusat Bantuan",
    faqSub: "Dukungan EnvWrist",
    closeFaq: "Tutup FAQ",
    safetyAlert: "Peringatan Keamanan",
    liveInsight: "Wawasan Langsung",
    mappingHours: "Memetakan jam-jam berikutnya...",
    gatheringData: "Mengumpulkan data AI 20 hari...",
    faq: [
      { q: "Apa itu EnvWrist?", a: "EnvWrist adalah platform lingkungan yang membantu memantau kualitas udara dan cuaca dengan presisi." },
      { q: "Apa itu VOC?", a: "VOC adalah senyawa kimia di udara. Semakin rendah semakin baik untuk kesehatanmu!" },
      { q: "Seberapa akurat ini?", a: "Kami menggunakan EnvAI dan satelit untuk reliabilitas tinggi." }
    ]
  },
  zh: {
    detecting: "正在探测...",
    live: "实时",
    pressure: "气压",
    altitude: "海拔",
    humidity: "湿度",
    vocs: "VOCs",
    airQuality: "空气质量",
    nextHours: "未来几小时",
    outlook: "20天预测",
    swipe: "向右滑动查看更多 →",
    askEnvAI: "咨询 EnvAI",
    assistantSub: "环境智能助手",
    chatPlaceholder: "向 EnvAI 询问你的周围环境...",
    thinking: "EnvAI 正在思考",
    welcome: "你好！我是 EnvAI，你的私人环境机器人。今天有什么可以帮你的？",
    faqTitle: "帮助中心",
    faqSub: "EnvWrist 支持",
    closeFaq: "关闭常见问题",
    safetyAlert: "安全警报",
    liveInsight: "实时洞察",
    mappingHours: "正在规划接下来的几小时...",
    gatheringData: "正在收集20天AI数据...",
    faq: [
      { q: "什么是 EnvWrist？", a: "EnvWrist 是一个帮助你精确监测空气质量和天气的环境智能平台。" },
      { q: "什么是 VOCs？", a: "VOCs 是空气中的挥发性有机化合物。水平越低，对你的健康越好！" },
      { q: "准确度如何？", a: "我们结合了 EnvAI 和卫星地面站技术，确保数据的高度可靠性。" }
    ]
  },
  ja: {
    detecting: "検出中...",
    live: "ライブ",
    pressure: "気圧",
    altitude: "高度",
    humidity: "湿度",
    vocs: "VOCs",
    airQuality: "空気の質",
    nextHours: "数時間後の予報",
    outlook: "20日間の展望",
    swipe: "右にスワイプして表示 →",
    askEnvAI: "EnvAIに質問",
    assistantSub: "環境インテリジェンスアシスタント",
    chatPlaceholder: "周囲の環境についてEnvAIに聞いてみよう...",
    thinking: "EnvAIが考えています",
    welcome: "こんにちは！私はあなたのパーソナル・エコボット、EnvAIです。今日は何かお手伝いしましょうか？",
    faqTitle: "ヘルプセンター",
    faqSub: "EnvWristサポート",
    closeFaq: "FAQを閉じる",
    safetyAlert: "安全警告",
    liveInsight: "ライブインサイト",
    mappingHours: "数時間後のデータをマッピング中...",
    gatheringData: "20日間のAIデータを収集中...",
    faq: [
      { q: "EnvWristとは？", a: "EnvWristは、空気の質や天気を正確に監視する環境インテリジェンス・プラットフォームです。" },
      { q: "VOCsとは？", a: "VOCsは空気中の揮発性有機化合物です。値が低いほど健康に良いです！" },
      { q: "精度はどうですか？", a: "EnvAIと衛星データを活用し、高い信頼性を実現しています。" }
    ]
  },
  fr: {
    detecting: "Détection...",
    live: "En direct",
    pressure: "Pression",
    altitude: "Altitude",
    humidity: "Humidité",
    vocs: "COV",
    airQuality: "Qualité de l'air",
    nextHours: "Prochaines Heures",
    outlook: "Perspectives à 20 jours",
    swipe: "Glissez pour en savoir plus →",
    askEnvAI: "Demander à EnvAI",
    assistantSub: "Assistant d'Intelligence Environnementale",
    chatPlaceholder: "Interrogez EnvAI sur votre environnement...",
    thinking: "EnvAI réfléchit",
    welcome: "Salut ! Je suis EnvAI, ton éco-bot personnel. Comment puis-je t'aider aujourd'hui ?",
    faqTitle: "Centre d'Aide",
    faqSub: "Support EnvWrist",
    closeFaq: "Fermer la FAQ",
    safetyAlert: "Alerte de Sécurité",
    liveInsight: "Aperçu en Direct",
    mappingHours: "Cartographie des prochaines heures...",
    gatheringData: "Collecte des données AI sur 20 jours...",
    faq: [
      { q: "Qu'est-ce qu'EnvWrist ?", a: "EnvWrist est une plateforme d'intelligence environnementale pour surveiller la qualité de l'air et la météo." },
      { q: "Que sont les COV ?", a: "Les COV sont des composés organiques volatils. Plus le niveau est bas, mieux c'est pour votre santé !" },
      { q: "Est-ce précis ?", a: "Nous utilisons EnvAI et des données satellites pour une haute fiabilité." }
    ]
  }
};

const LANGUAGES: { code: AppLanguage; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'id', label: 'Bahasa', flag: '🇮🇩' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' }
];

const App: React.FC = () => {
  const [language, setLanguage] = useState<AppLanguage>('en');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('noon');
  const [weather, setWeather] = useState<WeatherData & { description?: string }>({
    temp: 30, // Updated to be within 28-32 range
    condition: 'Sunny',
    location: '...',
    pressure: 1013,
    altitude: 0,
    humidity: 50,
    voc: 0.1,
    airStatus: 'Good',
    description: "Hang tight! Fetching real-time data from the sky..."
  });
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>([]);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [isFAQOpen, setIsFAQOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const t = TRANSLATIONS[language];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isTyping]);

  const updateTimeTheme = useCallback(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) setTimeOfDay('morning');
    else if (hour >= 11 && hour < 16) setTimeOfDay('noon');
    else if (hour >= 16 && hour < 19) setTimeOfDay('afternoon');
    else setTimeOfDay('night');
  }, []);

  const fetchFullWeather = useCallback(async () => {
    setIsRefreshing(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const realData = await getRealtimeWeather(latitude, longitude, language);
        
        if (realData) {
          setWeather(realData);
          const [hourly, daily] = await Promise.all([
            getHourlyForecast(realData.location, language),
            get20DayForecast(realData.location, language)
          ]);
          setHourlyForecast(hourly);
          setForecast(daily);
        }
        setIsRefreshing(false);
      }, () => {
        setWeather(prev => ({ ...prev, location: 'Semarang (Default)' }));
        setIsRefreshing(false);
      });
    }
  }, [language]);

  useEffect(() => {
    updateTimeTheme();
    fetchFullWeather();
    
    const themeTimer = setInterval(updateTimeTheme, 60000);
    return () => clearInterval(themeTimer);
  }, [updateTimeTheme, fetchFullWeather]);

  // Handle outside clicks for language menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    
    const userMsg: ChatMessage = { role: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    const context = `Current Weather in ${weather.location}: ${weather.temp}°C, ${weather.condition}. Humidity: ${weather.humidity}%, Air: ${weather.airStatus}. Advice: ${weather.description}. App: EnvWrist. Current language: ${language}. Current strict temp range: 28-32°C.`;
    const aiResponse = await askWeatherAI(chatInput, context, language);
    
    setChatMessages(prev => [...prev, { role: 'model', text: aiResponse }]);
    setIsTyping(false);
  };

  const currentTheme = THEMES[timeOfDay];

  const renderWeatherAnimation = (condition: string, size: 'normal' | 'small' = 'normal') => {
    const scale = size === 'small' ? 'scale-[0.4]' : '';
    switch (condition) {
      case 'Rainy': return <div className={scale}><RainyAnimation /></div>;
      case 'Cloudy': return <div className={scale}><CloudyAnimation /></div>;
      case 'Thunder': return <div className={scale}><ThunderAnimation /></div>;
      default: return <div className={scale}><SunnyAnimation /></div>;
    }
  };

  const isBadWeather = weather.condition === 'Rainy' || weather.condition === 'Thunder' || weather.airStatus === 'Bad';

  return (
    <div className={`min-h-screen transition-all duration-1000 bg-gradient-to-b ${currentTheme.bgGradient} p-4 md:p-8 flex flex-col items-center`}>
      
      {/* Header */}
      <header className="w-full max-w-4xl flex justify-between items-center mb-8 relative z-50">
        <div className="flex flex-col">
          <h2 className={`text-3xl font-black ${currentTheme.textColor} tracking-tighter drop-shadow-sm`}>EnvWrist</h2>
          <div className="flex items-center space-x-2 bg-white/40 backdrop-blur-lg px-3 py-1 rounded-full shadow-sm mt-1 w-fit">
            <MapPin className={currentTheme.accentColor} size={14} />
            <span className={`font-bold text-xs ${currentTheme.textColor}`}>{weather.location || t.detecting} <span className="opacity-60 font-normal ml-1">{t.live}</span></span>
          </div>
        </div>

        <div className="flex space-x-2">
           {/* Language Selector */}
           <div className="relative" ref={langMenuRef}>
            <button 
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="bg-white/40 hover:bg-white/60 p-3 rounded-full shadow-lg transition-all flex items-center space-x-2"
            >
              <Languages className={currentTheme.accentColor} size={20} />
              <ChevronDown size={14} className={currentTheme.accentColor} />
            </button>
            {isLangMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 overflow-hidden animate-float">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsLangMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-white/50 transition-colors text-left font-bold text-sm ${language === lang.code ? 'text-blue-600 bg-blue-50/50' : 'text-gray-700'}`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button 
            onClick={fetchFullWeather}
            className={`bg-white/40 hover:bg-white/60 p-3 rounded-full shadow-lg transition-all ${isRefreshing ? 'animate-spin' : ''}`}
            title="Refresh Environment Data"
          >
            <RefreshCw className={currentTheme.accentColor} size={20} />
          </button>
          <button 
            onClick={() => setIsFAQOpen(true)}
            className="bg-white/40 hover:bg-white/60 p-3 rounded-full shadow-lg transition-all group"
          >
            <HelpCircle className={`${currentTheme.accentColor} group-hover:scale-110`} size={24} />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="w-full max-w-4xl flex flex-col items-center space-y-6">
        <div className="flex flex-col items-center animate-float">
          {renderWeatherAnimation(weather.condition)}
          <div className="text-center mt-4">
            <h1 className={`text-9xl font-black ${currentTheme.textColor} drop-shadow-lg leading-none`}>
              {weather.temp}°
            </h1>
            <p className={`text-3xl font-bold opacity-90 mt-2 ${currentTheme.textColor}`}>
              {weather.condition}
            </p>
            
            <div className={`mt-6 px-8 py-4 rounded-[2rem] max-w-lg mx-auto transition-all duration-700 shadow-xl border-2 ${isBadWeather ? 'bg-red-50 border-red-300 scale-105' : 'bg-white/60 border-white/50'}`}>
               <div className="flex items-start space-x-3 text-left">
                 {isBadWeather && <AlertTriangle className="text-red-500 flex-shrink-0 mt-1" size={24} />}
                 <div>
                   <p className={`text-xs uppercase font-black tracking-widest mb-1 ${isBadWeather ? 'text-red-500' : 'text-blue-500'}`}>
                     {isBadWeather ? t.safetyAlert : t.liveInsight}
                   </p>
                   <p className={`text-sm md:text-base font-semibold leading-snug ${isBadWeather ? 'text-red-900' : 'text-gray-800'}`}>
                     {weather.description}
                   </p>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-8">
          <MetricCard label={t.pressure} value={weather.pressure} unit="hPa" color="bg-indigo-400" icon={<Gauge size={28} />} />
          <MetricCard label={t.altitude} value={weather.altitude} unit="m" color="bg-teal-400" icon={<Mountain size={28} />} />
          <MetricCard label={t.humidity} value={weather.humidity} unit="%" color="bg-sky-400" icon={<Droplets size={28} />} />
          <MetricCard label={t.vocs} value={weather.voc} unit="ppm" color="bg-violet-400" icon={<Leaf size={28} />} />
          <MetricCard label={t.airQuality} value={weather.airStatus} unit="" color={weather.airStatus === 'Good' ? 'bg-green-400' : weather.airStatus === 'Moderate' ? 'bg-amber-400' : 'bg-rose-400'} icon={<Wind size={28} />} />
        </div>

        {/* Hourly Forecast */}
        <section className="w-full mt-10 px-2">
          <div className="flex items-center space-x-2 mb-4 ml-2">
            <Clock className={currentTheme.accentColor} size={20} />
            <h2 className={`text-xl font-black ${currentTheme.textColor}`}>{t.nextHours}</h2>
          </div>
          <div className="flex space-x-4 overflow-x-auto pb-6 custom-scrollbar px-2">
            {hourlyForecast.length > 0 ? hourlyForecast.map((h, i) => (
              <div key={i} className="flex-shrink-0 w-28 bg-white/40 backdrop-blur-md rounded-3xl p-4 flex flex-col items-center shadow-lg hover:bg-white/60 transition-all border border-white/20">
                <p className="font-bold text-gray-700 text-xs">{h.time}</p>
                <div className="h-16 flex items-center justify-center overflow-hidden">{renderWeatherAnimation(h.condition, 'small')}</div>
                <p className="text-xl font-black text-gray-800">{h.temp}°</p>
              </div>
            )) : <div className="w-full flex justify-center py-8"><div className="animate-pulse text-gray-500 font-bold text-sm">{t.mappingHours}</div></div>}
          </div>
        </section>

        {/* 20-Day Forecast */}
        <section className="w-full mt-8 px-2">
          <div className="flex justify-between items-end mb-6">
            <h2 className={`text-2xl font-black ${currentTheme.textColor}`}>{t.outlook}</h2>
            <span className={`text-xs font-bold opacity-60 uppercase tracking-widest ${currentTheme.textColor}`}>{t.swipe}</span>
          </div>
          <div className="flex space-x-4 overflow-x-auto pb-8 custom-scrollbar px-2">
            {forecast.length > 0 ? forecast.map((f, i) => (
              <div key={i} className="flex-shrink-0 w-36 bg-white/40 backdrop-blur-md rounded-[2.5rem] p-5 flex flex-col items-center shadow-lg hover:bg-white/70 transition-all hover:-translate-y-1 border border-white/40">
                <p className="font-bold text-gray-700 text-sm mb-1">{f.dayName}</p>
                <div className="my-2 h-24 flex items-center justify-center">{renderWeatherAnimation(f.condition, 'small')}</div>
                <p className="text-2xl font-black text-gray-800">{f.temp}°</p>
                <p className="text-[10px] mt-1 text-gray-500 uppercase font-black tracking-tighter">{f.condition}</p>
              </div>
            )) : <div className="w-full text-center py-10 text-gray-500 italic">{t.gatheringData}</div>}
          </div>
        </section>

        {/* EnvAI Chat Assistant */}
        <section className="w-full mt-12 bg-white/30 backdrop-blur-2xl rounded-t-[4rem] p-8 shadow-2xl border-t border-white/50">
          <div className="flex items-center mb-6">
             <div className="bg-yellow-400 p-2 rounded-xl mr-3 shadow-md animate-pulse">
                <Zap className="text-white" size={24} />
             </div>
             <div>
               <h2 className={`text-2xl font-black ${currentTheme.textColor}`}>{t.askEnvAI}</h2>
               <p className="text-xs font-bold opacity-60 uppercase tracking-wider">{t.assistantSub}</p>
             </div>
          </div>
          
          <div className="h-72 overflow-y-auto mb-6 space-y-4 px-3 custom-scrollbar">
            {chatMessages.length === 0 && (
              <div className="text-center text-gray-400 py-16">
                <p className="italic mb-2">"{t.welcome}"</p>
              </div>
            )}
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-5 py-3 rounded-3xl shadow-md ${
                  msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                }`}>
                  <p className="text-sm md:text-base leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/60 px-5 py-3 rounded-3xl animate-pulse text-gray-500 text-sm font-bold flex items-center">
                  <span className="mr-2">{t.thinking}</span>
                  <span className="flex space-x-1"><span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></span><span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span><span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="relative group">
            <input 
              type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={t.chatPlaceholder}
              className="w-full bg-white/95 border-2 border-transparent focus:border-blue-400 rounded-3xl px-6 py-4 shadow-xl focus:ring-0 outline-none transition-all pr-16"
            />
            <button 
              onClick={handleSendMessage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-2xl shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              <Send size={20} />
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-10 opacity-70 mt-auto">
        <p className={`text-sm font-bold ${currentTheme.textColor} tracking-tight`}>
          © 2026 EnvWrist • AISEEF Competition Deployment • Made with 💖 for Semarang
        </p>
      </footer>

      {/* FAQ Modal */}
      {isFAQOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl overflow-hidden animate-float border-4 border-white">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 flex justify-between items-center text-white">
              <div className="flex flex-col">
                <h3 className="text-3xl font-black flex items-center tracking-tighter">
                  <HelpCircle className="mr-3" /> {t.faqTitle}
                </h3>
                <p className="text-xs opacity-90 font-black uppercase tracking-widest mt-1">{t.faqSub}</p>
              </div>
              <button onClick={() => setIsFAQOpen(false)} className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors">
                <X size={28} />
              </button>
            </div>
            <div className="p-8 space-y-5 max-h-[60vh] overflow-y-auto custom-scrollbar bg-gray-50/50">
              {(t.faq as any[]).map((item, i) => (
                <div key={i} className="bg-white p-6 rounded-[2rem] border-2 border-gray-100 shadow-sm hover:border-blue-200 transition-colors">
                  <p className="font-black text-gray-900 mb-2 flex items-center text-lg">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>{item.q}
                  </p>
                  <p className="text-gray-600 text-base leading-relaxed font-medium">{item.a}</p>
                </div>
              ))}
            </div>
            <div className="p-8 bg-white border-t border-gray-100">
              <button onClick={() => setIsFAQOpen(false)} className="w-full bg-blue-600 text-white font-black py-4 rounded-3xl hover:bg-blue-700 shadow-xl transform active:scale-95 transition-all text-lg uppercase tracking-widest">
                {t.closeFaq}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
