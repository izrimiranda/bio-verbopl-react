import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Search, Filter, Phone, MessageCircle, Home, User } from 'lucide-react';
import { GROUPS_DATA, CITIES, NEIGHBORHOODS } from '../constants';
import { GroupItem } from '../types';
import { MosaicBackground } from '../components/MosaicBackground';

export const Groups: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('');

  // Reset neighborhood when city changes
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(e.target.value);
    setSelectedNeighborhood('');
  };

  const filteredGroups = useMemo(() => {
    return GROUPS_DATA.filter(group => {
      const cityMatch = selectedCity ? group.city === selectedCity : true;
      const hoodMatch = selectedNeighborhood ? group.neighborhood === selectedNeighborhood : true;
      return cityMatch && hoodMatch;
    });
  }, [selectedCity, selectedNeighborhood]);

  const availableNeighborhoods = selectedCity ? NEIGHBORHOODS[selectedCity] : [];

  return (
    <div className="min-h-screen relative font-sans text-gray-100 pb-20">
      <MosaicBackground />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-beige hover:text-white transition-colors mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
          </Link>
          <h1 className="text-3xl font-bold text-white drop-shadow-md flex items-center gap-3">
            <UsersIcon /> Grupos de Crescimento
          </h1>
        </div>

        {/* Filters Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-8 shadow-xl">
          <div className="flex items-center gap-2 mb-4 text-beige">
             <Filter className="w-5 h-5" />
             <h2 className="font-semibold text-lg">Filtrar por localização</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="relative">
               <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
               <select 
                 value={selectedCity} 
                 onChange={handleCityChange}
                 className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-beige appearance-none"
               >
                 <option value="">Todas as Cidades</option>
                 {Object.entries(CITIES).map(([key, label]) => (
                   <option key={key} value={key}>{label}</option>
                 ))}
               </select>
             </div>

             <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
               <select 
                 value={selectedNeighborhood}
                 onChange={(e) => setSelectedNeighborhood(e.target.value)}
                 disabled={!selectedCity}
                 className={`w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-beige appearance-none ${!selectedCity ? 'opacity-50 cursor-not-allowed' : ''}`}
               >
                 <option value="">{selectedCity ? 'Todos os Bairros' : 'Selecione uma cidade'}</option>
                 {availableNeighborhoods?.map((hood) => (
                   <option key={hood.value} value={hood.value}>{hood.label}</option>
                 ))}
               </select>
             </div>

             <button 
               onClick={() => { setSelectedCity(''); setSelectedNeighborhood(''); }}
               className="bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium py-3 rounded-lg transition-colors"
             >
               Limpar Filtros
             </button>
          </div>
          
          <div className="mt-4 text-sm text-gray-400 text-right">
             <span className="text-white font-bold">{filteredGroups.length}</span> grupos encontrados
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {filteredGroups.length > 0 ? (
             filteredGroups.map(group => (
               <GroupCard key={group.id} group={group} />
             ))
           ) : (
             <div className="col-span-full text-center py-16 bg-white/5 rounded-2xl border border-dashed border-white/20">
               <p className="text-gray-300">Nenhum grupo encontrado com estes filtros.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

const GroupCard: React.FC<{ group: GroupItem }> = ({ group }) => (
  <div className="bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-6 transition-all hover:-translate-y-1 shadow-lg group">
    <div className="flex items-start justify-between mb-4">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-beige block mb-1">
          {CITIES[group.city]}
        </span>
        <h3 className="text-xl font-bold text-white leading-tight">
          {group.neighborhood.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
        </h3>
      </div>
      <div className="p-2 bg-beige/10 rounded-full text-beige">
        <UsersIcon className="w-5 h-5" />
      </div>
    </div>

    <div className="space-y-3 mb-6">
       <div className="flex items-start gap-3 text-sm text-gray-300">
         <Home className="w-4 h-4 mt-1 text-gray-500" />
         <span>{group.address}</span>
       </div>
       <div className="flex items-center gap-3 text-sm text-gray-300">
         <User className="w-4 h-4 text-gray-500" />
         <span>Líderes: <strong className="text-white">{group.leaders}</strong></span>
       </div>
       <div className="flex items-center gap-3 text-sm text-gray-300">
         <Phone className="w-4 h-4 text-gray-500" />
         <span>{group.phone}</span>
       </div>
    </div>

    <a 
      href={group.contactLink}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold transition-colors shadow-lg shadow-green-900/20"
    >
      <MessageCircle className="w-5 h-5" />
      Entrar em Contato
    </a>
  </div>
);

const UsersIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg className={className || "w-6 h-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);
