import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { EventItem } from '../types';
import { 
  Lock, LayoutDashboard, Plus, Trash2, Edit2, 
  ArrowUp, ArrowDown, LogOut, Check, X, Calendar, 
  Image as ImageIcon, Eye, EyeOff
} from 'lucide-react';

export const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Auth State
  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  return <AdminDashboard onLogout={() => setIsAuthenticated(false)} />;
};

// --- Sub Components ---

const AdminLogin: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock authentication as per prompt
    if (password === 'admin' || password === '1234') {
      onLogin();
    } else {
      setError('Senha incorreta.');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-primary-dark flex items-center justify-center p-4">
      <div className="bg-secondary-dark p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/5">
        <div className="text-center mb-8">
           <div className="bg-beige/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-beige">
             <Lock className="w-8 h-8" />
           </div>
           <h2 className="text-2xl font-bold text-white">Acesso Restrito</h2>
           <p className="text-gray-400 text-sm mt-2">Painel Administrativo Verbo da Vida</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input 
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              className="w-full bg-black/20 border border-white/10 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-beige transition-colors"
              placeholder="Digite a senha..."
              autoFocus
            />
            <button 
              type="button" 
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm flex items-center gap-2">
              <X className="w-4 h-4" /> {error}
            </div>
          )}

          <div className="flex gap-4">
             <Link to="/" className="flex-1 py-3 text-center text-gray-400 hover:text-white transition-colors text-sm">
               Voltar ao site
             </Link>
             <button 
               type="submit" 
               className="flex-1 bg-beige hover:bg-beige-light text-primary-dark font-bold py-3 rounded-lg shadow-lg transition-transform active:scale-95"
             >
               Acessar
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  // Stats
  const activeCount = events.filter(e => e.active).length;
  const expiredCount = events.filter(e => e.endDate && e.endDate < new Date().toISOString().split('T')[0]).length;

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    // Sort by order
    const data = storageService.getEvents().sort((a, b) => a.order - b.order);
    setEvents(data);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este evento?')) {
      storageService.deleteEvent(id);
      loadEvents();
    }
  };

  const handleToggle = (id: string, current: boolean) => {
    storageService.toggleActive(id, current);
    loadEvents();
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === events.length - 1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    storageService.reorder(index, newIndex);
    loadEvents();
  };

  const openAddModal = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const openEditModal = (event: EventItem) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
      {/* Sidebar / Nav */}
      <div className="bg-primary-dark text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
           <div className="flex items-center gap-3">
             <LayoutDashboard className="w-6 h-6 text-beige" />
             <h1 className="text-xl font-bold tracking-tight">Painel Admin</h1>
           </div>
           <div className="flex items-center gap-4">
             <Link to="/" className="text-sm text-gray-300 hover:text-white" target="_blank">
               Ver Site
             </Link>
             <button onClick={onLogout} className="flex items-center gap-2 text-red-300 hover:text-red-400 text-sm font-medium">
               <LogOut className="w-4 h-4" /> Sair
             </button>
           </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
           <StatCard label="Total Eventos" value={events.length} color="bg-blue-500" />
           <StatCard label="Ativos" value={activeCount} color="bg-green-500" />
           <StatCard label="Expirados" value={expiredCount} color="bg-red-500" />
           <StatCard label="Views (Simulado)" value={1240} color="bg-purple-500" />
        </div>

        {/* Actions Bar */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Gerenciar Eventos</h2>
          <button 
            onClick={openAddModal}
            className="flex items-center gap-2 bg-primary hover:bg-primary-light text-white px-5 py-2.5 rounded-lg shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" /> Novo Evento
          </button>
        </div>

        {/* Events List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
           {events.length === 0 ? (
             <div className="p-12 text-center text-gray-500">
               Nenhum evento cadastrado. Clique em "Novo Evento" para começar.
             </div>
           ) : (
             <div className="divide-y divide-gray-100">
               {events.map((event, index) => (
                 <EventRow 
                    key={event.id} 
                    event={event} 
                    index={index}
                    isLast={index === events.length - 1}
                    onMove={handleMove}
                    onToggle={handleToggle}
                    onEdit={openEditModal}
                    onDelete={handleDelete}
                 />
               ))}
             </div>
           )}
        </div>
      </div>

      {isModalOpen && (
        <EventModal 
          event={editingEvent} 
          onClose={() => setIsModalOpen(false)} 
          onSave={() => { setIsModalOpen(false); loadEvents(); }} 
        />
      )}
    </div>
  );
};

// --- Helper Components for Dashboard ---

const StatCard: React.FC<{ label: string, value: number, color: string }> = ({ label, value, color }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
    <div className={`w-2 h-12 rounded-full ${color}`}></div>
    <div>
      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const EventRow: React.FC<any> = ({ event, index, isLast, onMove, onToggle, onEdit, onDelete }) => {
  const isExpired = event.endDate && event.endDate < new Date().toISOString().split('T')[0];

  return (
    <div className={`p-4 flex flex-col md:flex-row items-center gap-4 md:gap-6 hover:bg-gray-50 transition-colors ${!event.active ? 'opacity-75 bg-gray-50' : ''}`}>
      {/* Drag Controls */}
      <div className="flex md:flex-col gap-2">
        <button 
          onClick={() => onMove(index, 'up')} 
          disabled={index === 0}
          className="p-1 rounded hover:bg-gray-200 text-gray-500 disabled:opacity-30"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
        <button 
          onClick={() => onMove(index, 'down')} 
          disabled={isLast}
          className="p-1 rounded hover:bg-gray-200 text-gray-500 disabled:opacity-30"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
      </div>

      {/* Image */}
      <div className="w-full md:w-32 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0 relative">
        <img src={event.coverImage} alt="" className="w-full h-full object-cover" />
        {!event.active && (
          <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center text-white text-xs font-bold uppercase">Inativo</div>
        )}
      </div>

      {/* Content */}
      <div className="flex-grow min-w-0 w-full text-center md:text-left">
        <h3 className="font-bold text-lg text-gray-900 truncate">{event.name}</h3>
        <p className="text-sm text-gray-500 truncate mb-2">{event.link}</p>
        
        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
          {event.startDate && (
             <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100">
               <Calendar className="w-3 h-3" /> Início: {event.startDate}
             </span>
          )}
          {event.endDate && (
             <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded border ${isExpired ? 'bg-red-50 text-red-700 border-red-100' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
               <Calendar className="w-3 h-3" /> Fim: {event.endDate} {isExpired && '(Expirado)'}
             </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-end border-t md:border-0 pt-4 md:pt-0 mt-2 md:mt-0">
         <label className="flex items-center cursor-pointer select-none">
            <div className="relative">
               <input 
                 type="checkbox" 
                 checked={event.active} 
                 onChange={() => onToggle(event.id, event.active)} 
                 className="sr-only" 
               />
               <div className={`block w-14 h-8 rounded-full transition-colors ${event.active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
               <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${event.active ? 'transform translate-x-6' : ''}`}></div>
            </div>
            <span className="ml-3 text-sm font-medium text-gray-700 hidden md:block">
              {event.active ? 'Visível' : 'Oculto'}
            </span>
         </label>

         <div className="h-8 w-px bg-gray-300 mx-2 hidden md:block"></div>

         <button 
           onClick={() => onEdit(event)}
           className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
           title="Editar"
         >
           <Edit2 className="w-5 h-5" />
         </button>
         <button 
           onClick={() => onDelete(event.id)}
           className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
           title="Excluir"
         >
           <Trash2 className="w-5 h-5" />
         </button>
      </div>
    </div>
  );
};

const EventModal: React.FC<{ event: EventItem | null, onClose: () => void, onSave: () => void }> = ({ event, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<EventItem>>({
    name: '',
    link: '',
    coverImage: '',
    active: true,
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    if (event) {
      setFormData(event);
    } else {
      // Default image for new events
      setFormData(prev => ({ ...prev, coverImage: 'https://picsum.photos/800/450' }));
    }
  }, [event]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (event) {
      storageService.updateEvent({ ...event, ...formData } as EventItem);
    } else {
      storageService.addEvent({ 
        id: Date.now().toString(),
        ...formData 
      } as EventItem);
    }
    onSave();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
        <div className="bg-primary px-6 py-4 flex justify-between items-center text-white">
          <h3 className="text-lg font-bold">{event ? 'Editar Evento' : 'Novo Evento'}</h3>
          <button onClick={onClose} className="hover:bg-white/10 p-1 rounded transition-colors"><X className="w-6 h-6" /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título do Evento</label>
            <input 
              type="text" 
              name="name" 
              required
              value={formData.name} 
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              placeholder="Ex: Culto de Jovens"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Link de Destino</label>
            <input 
              type="url" 
              name="link" 
              required
              value={formData.link} 
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem</label>
            <div className="flex gap-2">
               <div className="relative flex-grow">
                 <ImageIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                 <input 
                   type="text" 
                   name="coverImage" 
                   value={formData.coverImage} 
                   onChange={handleChange}
                   className="w-full border border-gray-300 rounded-lg p-2.5 pl-10 focus:ring-2 focus:ring-primary outline-none"
                 />
               </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">Recomendado: 16:9 (Ex: 800x450)</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Início (Opcional)</label>
              <input 
                type="date" 
                name="startDate" 
                value={formData.startDate} 
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Fim (Opcional)</label>
              <input 
                type="date" 
                name="endDate" 
                value={formData.endDate} 
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
            <input 
              type="checkbox" 
              id="activeCheck"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              className="w-5 h-5 text-primary rounded focus:ring-primary"
            />
            <label htmlFor="activeCheck" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
              Evento Ativo (Visível no site)
            </label>
          </div>

          <div className="pt-4 flex gap-3">
             <button 
               type="button" 
               onClick={onClose}
               className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2.5 rounded-lg transition-colors"
             >
               Cancelar
             </button>
             <button 
               type="submit" 
               className="flex-1 bg-primary hover:bg-primary-light text-white font-medium py-2.5 rounded-lg shadow-md transition-colors flex justify-center items-center gap-2"
             >
               <Check className="w-5 h-5" /> Salvar
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};
