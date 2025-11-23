import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, Calendar, FileText, 
  Phone, Mail, MapPin, Download, 
  ChevronRight, Clock, Send, CheckCircle, ArrowRight,
  Sparkles, Brain, Globe, Music, 
  MessageSquare, AlertTriangle, ShieldCheck, Loader2,
  Menu, X, File, Users, Camera
} from 'lucide-react';

// ==========================================
// 1. UTILIDADES VISUALES
// ==========================================

const useOnScreen = (ref: React.RefObject<HTMLElement | null>, threshold = 0.1) => {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIntersecting(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    const currentElement = ref.current;

    if (currentElement) {
      observer.observe(currentElement);
    }

    // CORRECCIÓN: Usamos una función de limpieza explícita
    // en lugar de devolver el resultado de una expresión &&
    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [threshold, ref]);

  return isIntersecting;
};

const Reveal = ({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(ref);
  return (
    <div 
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      } ${className}`}
    >
      {children}
    </div>
  );
};

const SectionTitle = ({ title, subtitle, centered = true, light = false }: { title: string, subtitle: string, centered?: boolean, light?: boolean }) => (
  <div className={`mb-16 ${centered ? 'text-center flex flex-col items-center' : 'text-left'}`}>
    <span className={`font-bold tracking-[0.2em] text-xs md:text-sm uppercase block mb-3 animate-pulse ${light ? 'text-orange-300' : 'text-orange-600'}`}>
      {subtitle}
    </span>
    <h2 className={`text-3xl md:text-5xl font-serif font-bold relative inline-block pb-4 ${light ? 'text-white' : 'text-emerald-950'}`}>
      {title}
      {centered && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1.5 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"></div>
      )}
      {!centered && (
        <div className="absolute bottom-0 left-0 w-24 h-1.5 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"></div>
      )}
    </h2>
  </div>
);

// ==========================================
// 2. CONFIGURACIÓN
// ==========================================
type Section = 'home' | 'institution' | 'academic' | 'facilities' | 'teachers' | 'council' | 'notices' | 'downloads' | 'calendar' | 'contact' | 'suggestions';

const NAV_ITEMS = [
  { id: 'home', label: 'Inicio' },
  { id: 'institution', label: 'Nosotros' },
  { id: 'academic', label: 'Académico' },
  { id: 'facilities', label: 'Instalaciones' },
  { id: 'teachers', label: 'Docentes' },
  { id: 'council', label: 'Consejo' },
  { id: 'notices', label: 'Avisos' },
  { id: 'downloads', label: 'Descargas' },
  { id: 'calendar', label: 'Agenda' },
  { id: 'suggestions', label: 'Buzón' },
  { id: 'contact', label: 'Contacto' },
];

// ==========================================
// 3. APP PRINCIPAL
// ==========================================
export default function App() {
  const [activeSection, setActiveSection] = useState<Section>('home');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateTo = (section: Section) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-orange-200 selection:text-orange-900">
      
      {/* --- NAVBAR --- */}
      <header 
        className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${
          scrolled || mobileMenuOpen
            ? 'bg-emerald-950/95 backdrop-blur-md py-2 shadow-xl border-emerald-900' 
            : 'bg-emerald-950 py-4 border-transparent'
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-center">
            
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer group shrink-0" onClick={() => navigateTo('home')}>
              <div className="bg-orange-500 p-2 rounded-lg text-white shadow-lg group-hover:scale-105 transition-transform">
                <BookOpen size={24} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold tracking-widest text-emerald-300 uppercase">Primaria</span>
                <h1 className="text-lg md:text-xl font-serif font-bold leading-none text-white tracking-wide">
                  Mariano Escobedo
                </h1>
              </div>
            </div>

            {/* Menú Desktop */}
            <nav className="hidden xl:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-sm">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id as Section)}
                  className={`text-[10px] lg:text-xs font-bold uppercase tracking-wide transition-all px-3 py-2 rounded-full whitespace-nowrap ${
                    activeSection === item.id 
                      ? 'bg-orange-500 text-white shadow-md' 
                      : 'text-emerald-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Botón Hamburguesa (Móvil) */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Menú Móvil Desplegable */}
        {mobileMenuOpen && (
          <div className="xl:hidden absolute top-full left-0 w-full bg-emerald-950 border-t border-white/10 shadow-2xl animate-in slide-in-from-top-5 h-[calc(100vh-80px)] overflow-y-auto">
            <div className="flex flex-col p-4 gap-2 pb-20">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id as Section)}
                  className={`text-left text-sm font-bold uppercase p-4 rounded-xl transition-all flex justify-between items-center ${
                    activeSection === item.id 
                      ? 'bg-orange-500 text-white' 
                      : 'text-emerald-100 hover:bg-white/5'
                  }`}
                >
                  {item.label}
                  {activeSection === item.id && <ChevronRight size={16} />}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Espaciador */}
      <div className="h-24 lg:h-24 bg-emerald-950"></div>

      <main className="flex-grow">
        <div id="home"><HomeSection navigateTo={navigateTo} /></div>
        <div id="institution"><InstitutionSection /></div>
        <div id="academic"><AcademicSection /></div>
        <div id="facilities"><FacilitiesSection /></div>
        <div id="teachers"><TeachersSection /></div>
        <div id="council"><ParentsCouncilSection /></div>
        <div id="notices"><NoticesSection /></div>
        <div id="downloads"><DownloadsSection /></div>
        <div id="calendar"><CalendarSection /></div>
        <div id="suggestions" className="scroll-mt-24"><SuggestionSection /></div>
        <div id="contact"><ContactSection /></div>
      </main>

      <footer className="bg-emerald-950 text-white py-12 border-t-4 border-orange-500">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center items-center gap-3 mb-6">
             <BookOpen className="text-orange-500" size={32} />
             <h2 className="text-2xl font-serif font-bold">Mariano Escobedo</h2>
          </div>
          <p className="text-emerald-200 text-sm mb-8 max-w-md mx-auto">
            "Educación de excelencia para formar el futuro de México."
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm font-bold text-emerald-400">
            <a href="#" className="hover:text-white transition-colors">Aviso de Privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Reglamento Escolar</a>
            <a href="https://www.gob.mx/sep" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Portal SEP</a>
          </div>
          <p className="text-emerald-600 text-xs mt-8">&copy; 2025 Escuela Primaria Mariano Escobedo.</p>
        </div>
      </footer>
    </div>
  );
}

// ==========================================
// 4. SECCIONES
// ==========================================

// --- HOME ---
const HomeSection = ({ navigateTo }: { navigateTo: (s: Section) => void }) => (
  <section className="relative min-h-[600px] md:h-[85vh] flex items-center overflow-hidden bg-emerald-900">
    <div className="absolute inset-0 z-0">
      <img 
        src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
        alt="Escuela Fachada" 
        className="w-full h-full object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-950/80 to-emerald-950/40"></div>
    </div>

    <div className="container mx-auto px-6 relative z-20 pt-10 text-center md:text-left">
      <Reveal>
        <div className="inline-flex items-center gap-2 bg-orange-500/90 backdrop-blur-sm text-white text-xs font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest shadow-lg border border-orange-400 mx-auto md:mx-0">
          <Sparkles size={14} /> Ciclo Escolar 2025-2026
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white font-serif leading-tight mb-6 max-w-4xl drop-shadow-lg mx-auto md:mx-0">
          Educación con <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-orange-500">
            Valores y Excelencia
          </span>
        </h1>
        <p className="text-lg md:text-xl text-emerald-100 font-light mb-10 max-w-2xl leading-relaxed drop-shadow-md mx-auto md:mx-0">
          Formamos líderes del mañana en un ambiente seguro, inclusivo y tecnológicamente avanzado, listos para enfrentar los retos del futuro.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center md:justify-start">
          <button 
            onClick={() => navigateTo('contact')} 
            className="bg-white text-emerald-950 hover:bg-emerald-50 font-bold py-4 px-8 rounded-xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2"
          >
            Solicitar Informes <ArrowRight size={20} className="text-orange-500" />
          </button>
          <button 
            onClick={() => navigateTo('institution')} 
            className="group border-2 border-emerald-400/30 bg-emerald-900/30 backdrop-blur-sm text-emerald-100 hover:bg-emerald-900/50 hover:border-emerald-400 font-bold py-4 px-8 rounded-xl transition-all flex items-center justify-center"
          >
            Conoce Nuestra Historia
          </button>
        </div>
      </Reveal>
    </div>
  </section>
);

// --- SECCIÓN: INSTALACIONES ---
const FacilitiesSection = () => (
  <section className="py-24 bg-white">
    <div className="container mx-auto px-6">
      <SectionTitle title="Nuestras Instalaciones" subtitle="Espacios Educativos" centered={true} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { name: "Cancha Deportiva", img: "https://images.unsplash.com/photo-1562771242-a02d9090c90c?auto=format&fit=crop&w=800&q=80" },
          { name: "Biblioteca Escolar", img: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80" },
          { name: "Aula de Cómputo", img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80" },
          { name: "Áreas Verdes", img: "https://images.unsplash.com/photo-1564410267841-915d8e4d71ea?auto=format&fit=crop&w=800&q=80" }
        ].map((item, i) => (
          <div key={i} className="relative group overflow-hidden rounded-2xl shadow-md cursor-pointer h-64 lg:h-80">
            <img 
              src={item.img} 
              alt={item.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-transparent to-transparent flex flex-col justify-end p-6 opacity-100 lg:opacity-90 lg:group-hover:opacity-100 transition-opacity">
               <div className="flex items-center gap-2 text-orange-400 mb-1 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                 <Camera size={16} /> <span className="text-xs font-bold uppercase tracking-wider">Ver Galería</span>
               </div>
               <h3 className="text-white font-bold text-lg">{item.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// --- SECCIÓN: CONSEJO DE PADRES ---
const ParentsCouncilSection = () => (
  <section className="py-24 bg-amber-50 relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute right-0 top-0 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute left-0 bottom-0 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
    </div>

    <div className="container mx-auto px-6 relative z-10">
      <SectionTitle title="Consejo de Padres" subtitle="Comunidad Escolar" centered={true} />
      
      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-amber-100 flex flex-col md:flex-row gap-12 items-center max-w-5xl mx-auto">
         <div className="w-full md:w-1/2 relative">
            <div className="absolute -inset-4 bg-orange-100 rounded-2xl rotate-2"></div>
            <img 
              src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Consejo de Padres" 
              className="relative rounded-2xl shadow-lg w-full h-64 object-cover"
            />
            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg border border-slate-100">
              <div className="flex items-center gap-2 text-emerald-950 font-bold">
                 <Users className="text-orange-500" />
                 <span>Ciclo 2025-2026</span>
              </div>
            </div>
         </div>
         
         <div className="w-full md:w-1/2 text-center md:text-left">
            <h3 className="text-2xl font-serif font-bold text-emerald-950 mb-4">Trabajando Juntos</h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              El Consejo de Padres de Familia es el corazón de nuestra comunidad, colaborando estrechamente con la dirección para mejorar las instalaciones y organizar eventos que enriquecen la vida estudiantil.
            </p>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border-l-4 border-orange-500">
                <p className="text-xs font-bold text-slate-400 uppercase">Presidenta</p>
                <p className="font-bold text-emerald-950">Sra. Laura González</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border-l-4 border-emerald-500">
                 <p className="text-xs font-bold text-slate-400 uppercase">Contacto</p>
                 <p className="font-bold text-emerald-950">consejo@marianoescobedo.edu.mx</p>
              </div>
            </div>
         </div>
      </div>
    </div>
  </section>
);

// --- SECCIÓN: DESCARGAS ---
const DownloadsSection = () => (
  <section className="py-24 bg-slate-50">
    <div className="container mx-auto px-6">
      <SectionTitle title="Documentos y Trámites" subtitle="Descargas" centered={true} />
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Reglamento Escolar", type: "PDF", size: "2.4 MB", icon: <FileText /> },
          { title: "Lista de Útiles 2025", type: "PDF", size: "1.1 MB", icon: <File /> },
          { title: "Calendario SEP", type: "PDF", size: "500 KB", icon: <Calendar /> },
          { title: "Ficha de Inscripción", type: "DOCX", size: "800 KB", icon: <FileText /> }
        ].map((doc, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-lg hover:border-orange-200 transition-all group cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-orange-500 group-hover:text-white transition-colors">
                {doc.icon}
              </div>
              <div className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded uppercase">{doc.type}</div>
            </div>
            <h3 className="font-bold text-emerald-950 mb-1 group-hover:text-orange-600 transition-colors">{doc.title}</h3>
            <p className="text-xs text-slate-500 mb-4">{doc.size}</p>
            <button className="w-full py-2 rounded-lg border border-emerald-100 text-emerald-700 font-bold text-sm hover:bg-emerald-50 flex items-center justify-center gap-2 transition-colors">
              <Download size={16} /> Descargar
            </button>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// --- SUGGESTIONS (Backend Conectado) ---
const SuggestionSection = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    setIsValidEmail(val.length === 0 || emailRegex.test(val));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (emailRegex.test(email) && message.trim().length > 10) {
      setStatus('sending');
      const formData = new FormData();
      formData.append('email', email);
      formData.append('message', message);

      try {
        // ============================================================
        // URL DE GOOGLE APPS SCRIPT
        // ============================================================
        const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxf1qWqB7TLfuJyw2rkZ0DwW5FKFShF8f_wPoHlXWhj0xW_WZaduSeFV3ceYbha50dOKw/exec";
        
        await fetch(SCRIPT_URL, { 
            method: 'POST', 
            body: formData 
        });
        
        setStatus('success');
        setTimeout(() => {
          setStatus('idle');
          setEmail('');
          setMessage('');
        }, 4000);
      } catch (error) {
        // Nota: A veces Google devuelve error de CORS aunque sí guarde los datos.
        // Podrías asumir éxito si no quieres mostrar error a menos que sea crítico.
        console.error("Error al enviar:", error);
        setStatus('error');
        setTimeout(() => setStatus('idle'), 3000);
      }
    } else {
      setIsValidEmail(false);
    }
  };

  return (
    <section className="py-24 bg-amber-50/50 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-200 rounded-full blur-3xl opacity-20"></div>

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <div className="text-center mb-12">
          <div className="bg-orange-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-orange-600 shadow-sm">
            <MessageSquare size={32} />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-emerald-950 mb-4">Buzón de Sugerencias</h2>
          <p className="text-slate-600 max-w-lg mx-auto">
            Su opinión es vital. Este canal es exclusivo para padres de familia. 
            <strong> Es obligatorio un correo válido.</strong>
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-amber-100 p-8 md:p-10 relative overflow-hidden">
          {status === 'success' ? (
            <div className="text-center py-10 animate-in zoom-in duration-300">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <CheckCircle size={40} />
              </div>
              <h3 className="text-2xl font-bold text-emerald-950 mb-2">¡Sugerencia Recibida!</h3>
              <p className="text-slate-500">Gracias por ayudarnos a mejorar nuestra escuela.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-bold text-emerald-900 mb-2">Su Correo Electrónico</label>
                  <div className="relative">
                    <div className="absolute left-3 top-3.5 text-slate-400"><Mail size={20} /></div>
                    <input 
                      type="email" value={email} onChange={handleEmailChange} disabled={status === 'sending'}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 outline-none transition-all ${
                        !isValidEmail ? 'border-red-300 bg-red-50' : 'border-slate-100 focus:border-orange-400'
                      }`}
                      placeholder="nombre@ejemplo.com"
                    />
                  </div>
                  {!isValidEmail && <p className="text-xs text-red-600 mt-2 font-bold ml-1">* Correo inválido.</p>}
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                  <ShieldCheck className="text-blue-600 shrink-0 mt-1" size={20} />
                  <div>
                    <h4 className="text-sm font-bold text-blue-900">Privacidad</h4>
                    <p className="text-xs text-blue-700 mt-1">Los datos son confidenciales.</p>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-emerald-900 mb-2">Mensaje</label>
                <textarea 
                  rows={4} value={message} disabled={status === 'sending'} onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-4 rounded-xl border-2 border-slate-100 focus:border-orange-400 outline-none resize-none"
                  placeholder="Escriba aquí..."
                ></textarea>
              </div>
              <button 
                type="submit" disabled={!isValidEmail || email.length === 0 || message.length < 10 || status === 'sending'}
                className="w-full bg-emerald-950 hover:bg-emerald-900 disabled:bg-slate-300 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {status === 'sending' ? <Loader2 size={20} className="animate-spin" /> : <><Send size={20} /> Enviar</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

// --- OTRAS SECCIONES ESTÁNDAR (Con mejoras de centrado) ---

const InstitutionSection = () => (
  <section className="py-24 bg-white">
    <div className="container mx-auto px-6">
      <SectionTitle title="Nuestra Institución" subtitle="Historia y Valores" />
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="prose text-slate-600 text-center md:text-left mx-auto">
          <p className="text-lg leading-relaxed mb-6">
            La Escuela Primaria "Mariano Escobedo" ha sido un faro de conocimiento desde su fundación en <strong>1965</strong>. 
          </p>
          <ul className="space-y-4 text-left inline-block">
            {[
              "Misión: Formar ciudadanos íntegros y competitivos.",
              "Visión: Ser líder en innovación educativa.",
              "Valores: Respeto, Responsabilidad y Honestidad."
            ].map((v, i) => (
              <li key={i} className="flex items-center gap-3 font-bold text-emerald-900 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                <CheckCircle size={20} className="text-orange-500 shrink-0" /> {v}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative mx-auto">
          <div className="absolute -inset-4 bg-orange-200 rounded-2xl rotate-3 opacity-30"></div>
          <img 
            src="https://images.unsplash.com/photo-1577896337627-501d40d3945b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
            alt="Campus Escolar" 
            className="relative rounded-2xl shadow-2xl transform hover:-translate-y-2 transition-transform duration-500 w-full max-w-md mx-auto"
          />
        </div>
      </div>
    </div>
  </section>
);

const AcademicSection = () => (
  <section className="py-24 bg-slate-50">
    <div className="container mx-auto px-6">
      <SectionTitle title="Modelo Académico" subtitle="Excelencia" />
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { t: "Ciencias", i: <Brain size={32} />, d: "Pensamiento crítico y método científico." },
          { t: "Tecnología", i: <Globe size={32} />, d: "Aula de medios y robótica básica." },
          { t: "Arte y Cultura", i: <Music size={32} />, d: "Creatividad y expresión artística." }
        ].map((item, i) => (
          <div key={i} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all border border-slate-100 group text-center md:text-left">
            <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors mx-auto md:mx-0">
              {item.i}
            </div>
            <h3 className="text-xl font-bold text-emerald-950 mb-3">{item.t}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{item.d}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const TeachersSection = () => (
  <section className="py-24 bg-white">
    <div className="container mx-auto px-6">
      <SectionTitle title="Nuestro Equipo" subtitle="Docentes" centered={true} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {[
            { role: "Directora", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=400" },
            { role: "Titular 1º Grado", img: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&h=400" },
            { role: "Titular 6º Grado", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&h=400" }
        ].map((t, i) => (
           <div key={i} className="group relative overflow-hidden rounded-2xl aspect-square shadow-lg">
             <img src={t.img} alt="Docente" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
             <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/20 to-transparent flex flex-col justify-end p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-white font-bold text-lg">Maestro Certificado</h3>
                <p className="text-orange-400 text-sm font-bold uppercase tracking-wider">{t.role}</p>
             </div>
           </div>
        ))}
      </div>
    </div>
  </section>
);

const NoticesSection = () => (
  <section className="py-24 bg-emerald-950 text-white relative overflow-hidden">
    <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '30px 30px'}}></div>
    <div className="container mx-auto px-6 relative z-10">
      <SectionTitle title="Avisos Oficiales" subtitle="Comunicados" light={true} />
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
              <AlertTriangle size={12} /> Urgente
            </span>
            <span className="text-emerald-400 text-xs font-mono">Hace 2 días</span>
          </div>
          <h3 className="text-2xl font-bold mb-3">Suspensión de Clases</h3>
          <p className="text-emerald-100/80 text-sm leading-relaxed">
            Se informa que este viernes no habrá labores por Consejo Técnico Escolar.
          </p>
        </div>
        <div className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
           <div className="flex justify-between items-start mb-4">
            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
              <Calendar size={12} /> Evento
            </span>
            <span className="text-emerald-400 text-xs font-mono">Próximamente</span>
          </div>
          <h3 className="text-2xl font-bold mb-3">Feria de Ciencias 2025</h3>
          <p className="text-emerald-100/80 text-sm leading-relaxed">
            Invitamos a todos los padres de familia a los proyectos finales el próximo lunes.
          </p>
        </div>
      </div>
    </div>
  </section>
);

const CalendarSection = () => (
  <section className="py-24 bg-white">
    <div className="container mx-auto px-6 max-w-3xl text-center">
      <SectionTitle title="Agenda Mensual" subtitle="Próximos Eventos" centered={true} />
      <div className="space-y-4">
        {[
          { d: "12", m: "DIC", t: "Festival Navideño", desc: "Auditorio principal, 10:00 AM" },
          { d: "15", m: "DIC", t: "Entrega de Boletas", desc: "En cada salón de clases" },
          { d: "08", m: "ENE", t: "Regreso a Clases", desc: "Horario normal" }
        ].map((e, i) => (
          <div key={i} className="flex items-center bg-slate-50 p-5 rounded-2xl border border-slate-100 hover:border-orange-200 hover:shadow-md transition-all group text-left">
            <div className="pr-6 border-r border-slate-200 group-hover:border-orange-200 transition-colors text-center min-w-[90px]">
              <div className="text-3xl font-black text-emerald-950">{e.d}</div>
              <div className="text-xs font-bold text-orange-500 tracking-widest">{e.m}</div>
            </div>
            <div className="pl-6 flex-grow">
              <div className="font-bold text-lg text-emerald-950 group-hover:text-orange-600 transition-colors">{e.t}</div>
              <div className="text-sm text-slate-500">{e.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ContactSection = () => (
  <section className="py-24 bg-slate-50 border-b border-slate-200">
    <div className="container mx-auto px-6">
      <SectionTitle title="Ubicación y Contacto" subtitle="Visítanos" centered={true} />
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
             <div className="flex items-start gap-4">
              <div className="bg-orange-100 p-3 rounded-lg text-orange-600 shrink-0"><MapPin size={24} /></div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Dirección</p>
                <p className="font-bold text-emerald-950">Av. Educación 123, Col. Centro<br/>Monterrey, NL, CP 64000</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-orange-100 p-3 rounded-lg text-orange-600 shrink-0"><Phone size={24} /></div>
               <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Teléfono</p>
                <p className="font-bold text-emerald-950 text-lg">(81) 8345-6789</p>
              </div>
            </div>
          </div>
          <div className="space-y-8 md:border-l md:pl-12 border-slate-100">
            <div className="flex items-start gap-4">
              <div className="bg-orange-100 p-3 rounded-lg text-orange-600 shrink-0"><Clock size={24} /></div>
               <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Horario</p>
                <p className="font-bold text-emerald-950">Lun - Vie: 7:30 AM - 2:00 PM</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-orange-100 p-3 rounded-lg text-orange-600 shrink-0"><Mail size={24} /></div>
               <div>
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Correo</p>
                <p className="font-bold text-emerald-950 break-all">direccion@marianoescobedo.edu.mx</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);