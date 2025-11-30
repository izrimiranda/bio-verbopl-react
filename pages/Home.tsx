import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Settings, Users, ArrowUp, Loader2 } from 'lucide-react';
import { EventItem } from '../types';
import { storageService } from '../services/storageService';
import { EventCard } from '../components/EventCard';
import { MosaicBackground } from '../components/MosaicBackground';

export const Home: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      const allEvents = storageService.getEvents();
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
      setLoading(false);
    }, 800);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen relative font-sans text-gray-100 pb-20">
      <MosaicBackground />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col items-center justify-center mb-12 animate-fade-in relative">
          <div className="absolute top-0 right-0">
             <Link to="/admin" className="p-2 text-white/50 hover:text-beige transition-colors" title="Painel Administrativo">
               <Settings className="w-5 h-5" />
             </Link>
          </div>
          
          <img 
            src="https://picsum.photos/id/400/100/100" // Placeholder for Church Logo
            alt="Logo Igreja Verbo da Vida"
            className="w-24 h-24 mb-4 rounded-full border-4 border-white/20 shadow-2xl"
          />
          <h1 className="text-3xl md:text-4xl font-bold text-center text-white drop-shadow-lg">
            Programação
          </h1>
          <p className="text-beige-light font-medium mt-2 tracking-wide uppercase text-sm">
            Igreja Verbo da Vida Pedro Leopoldo
          </p>
        </div>

        {/* Fixed Top Cards / Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 max-w-3xl mx-auto">
           <Link 
             to="/groups" 
             className="flex items-center justify-between p-5 bg-gradient-to-r from-primary to-secondary rounded-xl border border-white/10 shadow-lg hover:shadow-beige/20 hover:-translate-y-1 transition-all group"
           >
             <div className="flex items-center gap-4">
               <div className="bg-beige/20 p-3 rounded-full text-beige group-hover:bg-beige group-hover:text-primary-dark transition-colors">
                 <Users className="w-6 h-6" />
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

           <a 
             href="#" 
             className="flex items-center justify-between p-5 bg-gradient-to-r from-secondary to-primary rounded-xl border border-white/10 shadow-lg hover:shadow-beige/20 hover:-translate-y-1 transition-all group"
           >
             <div className="flex items-center gap-4">
               <div className="bg-white/10 p-3 rounded-full text-white group-hover:bg-white group-hover:text-secondary transition-colors">
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
               </div>
               <div>
                 <h3 className="font-bold text-lg">Nossas Ministrações</h3>
                 <p className="text-xs text-gray-400">Assista aos cultos online</p>
               </div>
             </div>
             <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
               →
             </div>
           </a>
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
          className="bg-beige text-primary-dark p-3 rounded-full shadow-lg hover:bg-white transition-all hover:scale-110 active:scale-95"
          aria-label="Voltar ao topo"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      </div>
      
      <footer className="relative z-10 text-center text-white/30 text-xs py-8 mt-12">
        <p>© {new Date().getFullYear()} Igreja Verbo da Vida Pedro Leopoldo.</p>
        <p className="mt-1">Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};
