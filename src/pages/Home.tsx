import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Settings, Users, ArrowUp, Loader2 } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { EventItem } from '../types';
import { storageService } from '../services/storageService';
import { EventCard } from '../components/EventCard';
import { MosaicBackground } from '../components/MosaicBackground';

export const Home: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentHandIndex, setCurrentHandIndex] = useState<number>(-1);

  useEffect(() => {
    // Load events from database
    const loadEvents = async () => {
      setLoading(true);
      try {
        const allEvents = await storageService.getEvents();
        const today = new Date().toISOString().split('T')[0];
        
        // Filter logic:
        // 1. Must be Active
        // 2. StartDate is null OR StartDate <= today
        // 3. EndDate is null OR EndDate >= today
        const visibleEvents = allEvents.filter(e => {
          if (!e.active) return false;
          if (e.startDate && e.startDate > today) return false;
          if (e.endDate && e.endDate < today) return false;
          return true;
        }).sort((a, b) => a.order - b.order);

        setEvents(visibleEvents);
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
    
    // Track page view
    storageService.trackPageView();
  }, []);

  // Show hand cursor animation sequentially on top buttons with loop
  useEffect(() => {
    const runAnimation = async () => {
      // Wait 1.5 seconds after page load
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Loop the animation
      while (true) {
        // Show hand on first button (Grupos de Crescimento) - index 0
        setCurrentHandIndex(0);
        await new Promise(resolve => setTimeout(resolve, 3500));
        
        // Show hand on second button (Ministrações) - index 1
        setCurrentHandIndex(1);
        await new Promise(resolve => setTimeout(resolve, 3500));
        
        // Hide hand before next loop
        setCurrentHandIndex(-1);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    };

    runAnimation();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleButtonClick = (buttonName: string) => {
    storageService.trackButtonClick(buttonName);
  };

  return (
    <div className="min-h-screen relative font-sans text-gray-100 pb-20">
      <MosaicBackground />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-12 animate-fade-in relative">
          <div className="absolute top-0 right-0">
             <Link to="/admin" className="p-2 text-white/50 hover:text-beige transition-colors" title="Painel Administrativo">
               <Settings className="w-7 h-7" />
             </Link>
          </div>
          
          <img 
            src="/images/logo-verbo.png"
            alt="Logo Igreja Verbo da Vida"
            className="w-30 h-30 mb-4 object-contain drop-shadow-2xl"
          />
          <h1 className="text-2xl md:text-4xl font-bold text-center text-white drop-shadow-lg">
            Acontecendo...
          </h1>
          <p className="text-beige-light font-medium mt-2 tracking-wide uppercase text-sm">
            Igreja Verbo da Vida - Pedro Leopoldo
          </p>
        </div>

        {/* Fixed Top Cards / Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 max-w-3xl mx-auto">
           <div className="relative">
             <Link 
               to="/groups"
               onClick={() => handleButtonClick('grupos_de_crescimento')}
               className="flex items-center justify-between p-5 bg-gradient-to-r from-primary to-secondary rounded-xl border border-white/10 shadow-lg hover:shadow-beige/20 hover:-translate-y-1 transition-all group"
             >
               <div className="flex items-center gap-4">
                 <div className="bg-beige/20 p-2 rounded-lg group-hover:bg-beige transition-colors overflow-hidden flex items-center justify-center">
                   <img 
                     src="/images/icone-gc.png" 
                     alt="Grupo de Crescimento" 
                     className="w-10 h-10 object-contain"
                   />
                 </div>
                 <div>
                   <h3 className="font-bold text-lg">Grupos de Crescimento</h3>
                   <p className="text-xs text-gray-400">Encontre um grupo perto de você</p>
                 </div>
               </div>
               <div className="text-beige opacity-0 group-hover:opacity-100 transition-opacity">
                 →
               </div>
             </Link>
             {currentHandIndex === 0 && (
               <div className="absolute top-1/2 -right-2 -translate-y-1/2 pointer-events-none z-50 w-32 h-32 opacity-0 animate-fade-in-out">
                 <DotLottieReact
                   src="https://lottie.host/fd33208a-8ba5-4a35-b724-7f028780adca/1soIvPDo07.lottie"
                   loop
                   autoplay
                 />
               </div>
             )}
           </div>

           <div className="relative">
             <Link 
               to="/ministrations"
               onClick={() => handleButtonClick('nossas_ministracoes')}
               className="flex items-center justify-between p-5 bg-gradient-to-r from-secondary to-primary rounded-xl border border-white/10 shadow-lg hover:shadow-beige/20 hover:-translate-y-1 transition-all group"
             >
               <div className="flex items-center gap-4">
                 <div className="bg-white/10 p-3 rounded-full text-white group-hover:bg-white group-hover:text-secondary transition-colors">
                   <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>
                 </div>
                 <div>
                   <h3 className="font-bold text-lg">Nossas Ministrações</h3>
                   <p className="text-xs text-gray-400">Ouça e compartilhe com amigos e familiares</p>
                 </div>
               </div>
               <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                 →
               </div>
             </Link>
             {currentHandIndex === 1 && (
               <div className="absolute top-1/2 -right-2 -translate-y-1/2 pointer-events-none z-50 w-32 h-32 opacity-0 animate-fade-in-out">
                 <DotLottieReact
                   src="https://lottie.host/fd33208a-8ba5-4a35-b724-7f028780adca/1soIvPDo07.lottie"
                   loop
                   autoplay
                 />
               </div>
             )}
           </div>
        </div>

        {/* Content Feed */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-beige animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.length > 0 ? (
              events.map((event, index) => (
                <EventCard key={event.id} event={event} delay={index * 100} />
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                <p className="text-gray-300 text-lg">Nenhum evento programado no momento.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer / Back to Top */}
      <div className="fixed bottom-6 right-6 z-40">
        <button 
          onClick={scrollToTop}
          className="bg-white text-primary-dark p-3 rounded-full shadow-lg hover:bg-beige transition-all hover:scale-110 active:scale-95 cursor-pointer"
          aria-label="Voltar ao topo"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      </div>
      
      {/* Footer */}
      <footer className="relative z-10 bg-primary text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-6">
            {/* Logo */}
            <img 
              src="https://i.imgur.com/HGjl2U8.png" 
              alt="Igreja Verbo da Vida - Pedro Leopoldo" 
              className="h-16 w-auto opacity-90"
            />
            
            {/* Info */}
            <div className="text-center">
              <p className="text-sm opacity-80">
                © {new Date().getFullYear()} Igreja Verbo da Vida Pedro Leopoldo
              </p>
              <p className="text-xs opacity-70 mt-1">
                Todos os direitos reservados
              </p>
            </div>
            
            {/* Tech Credit */}
            <div className="text-center border-t border-white/20 pt-4 w-full max-w-md">
              <p className="text-xs opacity-70">
                Departamento de Tecnologia
              </p>
              <p className="text-xs opacity-60 mt-1">
                Desenvolvido com ❤️
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
