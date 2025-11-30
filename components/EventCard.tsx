import React from 'react';
import { EventItem } from '../types';
import { Calendar, ExternalLink } from 'lucide-react';

interface EventCardProps {
  event: EventItem;
  delay: number;
}

export const EventCard: React.FC<EventCardProps> = ({ event, delay }) => {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return null;
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  const start = formatDate(event.startDate || '');
  
  return (
    <div 
      className="group relative flex flex-col h-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="h-48 overflow-hidden relative">
        <img 
          src={event.coverImage} 
          alt={event.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/80 to-transparent opacity-60"></div>
      </div>
      
      <div className="flex flex-col flex-grow p-5 text-center">
        <h3 className="text-xl font-bold text-white mb-2 leading-tight drop-shadow-sm">
          {event.name}
        </h3>
        
        {start && (
          <div className="flex items-center justify-center gap-2 text-beige-light text-sm mb-4 font-medium">
            <Calendar className="w-4 h-4" />
            <span>{start}</span>
          </div>
        )}
        
        <div className="mt-auto">
          <a 
            href={event.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-6 rounded-full bg-gradient-to-r from-primary-dark to-secondary-dark hover:from-beige hover:to-beige-light text-white font-semibold shadow-lg transition-all duration-300 hover:shadow-beige/30 group-hover:scale-105 relative overflow-hidden"
          >
            <span>Fazer Inscrição</span>
            <ExternalLink className="w-4 h-4" />
            
            {/* Shine effect overlay */}
            <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shine" />
          </a>
        </div>
      </div>

      {/* Top border gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-beige via-beige-light to-beige opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
};
