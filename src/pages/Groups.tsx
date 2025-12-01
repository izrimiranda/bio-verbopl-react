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

      {/* Header */}
      <header className="relative z-10 bg-primary shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img 
              src="https://i.imgur.com/HGjl2U8.png" 
              alt="Igreja Verbo da Vida - Pedro Leopoldo" 
              className="h-12 w-auto"
            />
          </Link>
          <Link 
            to="/" 
            className="text-white hover:text-beige transition-colors text-sm font-medium"
          >
            ← Voltar
          </Link>
        </div>
      </header>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white drop-shadow-md flex items-center gap-3">
            <img src="/images/icone-gc.png" alt="Grupos de Crescimento" className="w-8 h-8 object-contain" />
            Grupos de Crescimento
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
      <div className="p-2 bg-beige/10 rounded-full flex items-center justify-center">
        <img src="/images/icone-gc.png" alt="GC" className="w-5 h-5 object-contain" />
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
      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold transition-colors shadow-lg shadow-green-900/20 cursor-pointer"
    >
      <MessageCircle className="w-5 h-5" />
      Entrar em Contato
    </a>
  </div>
);
