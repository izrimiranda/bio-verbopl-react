import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { EventItem } from '../types';
import { 
  Lock, LayoutDashboard, Plus, Trash2, Edit2, 
  ArrowUp, ArrowDown, LogOut, Check, X, Calendar, 
  Image as ImageIcon, Eye, EyeOff, TrendingUp, Users, MousePointerClick, BarChart3
} from 'lucide-react';
import { AnalyticsCard } from '../components/AnalyticsCard';

// Helper function to format dates from YYYY-MM-DD to DD/MM/YYYY
const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const authenticated = await storageService.authenticate(password);
      
      if (authenticated) {
        onLogin();
      } else {
        setError('Senha incorreta.');
        setPassword('');
      }
    } catch (error) {
      setError('Erro ao autenticar. Tente novamente.');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-dark flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200">
        <div className="text-center mb-8">
           <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-700">
             <Lock className="w-8 h-8" />
           </div>
           <h2 className="text-2xl font-bold text-gray-800">Acesso Restrito</h2>
           <p className="text-gray-600 text-sm mt-2">Painel Administrativo Verbo da Vida</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input 
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-beige focus:ring-2 focus:ring-beige/20 transition-colors"
              placeholder="Digite a senha..."
              autoFocus
            />
            <button 
              type="button" 
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
             <Link to="/" className="flex-1 py-3 text-center text-gray-500 hover:text-gray-800 transition-colors text-sm">
               Voltar ao site
             </Link>
             <button 
               type="submit" 
               disabled={loading || !password.trim()}
               className="flex-1 bg-beige hover:bg-beige-light text-primary-dark font-bold py-3 rounded-lg shadow-lg transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
             >
               {loading ? 'Autenticando...' : 'Acessar'}
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
  const [analytics, setAnalytics] = useState<any>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [analyticsPeriod, setAnalyticsPeriod] = useState<number>(30);
  const [activeTab, setActiveTab] = useState<'events' | 'analytics'>('events');

  // Stats
  const activeCount = events.filter(e => e.active).length;
  const expiredCount = events.filter(e => e.endDate && e.endDate < new Date().toISOString().split('T')[0]).length;

  useEffect(() => {
    loadEvents();
    loadAnalytics();
  }, []);

  useEffect(() => {
    loadAnalytics();
  }, [analyticsPeriod]);

  const loadEvents = async () => {
    try {
      const data = await storageService.getEvents();
      // Sort by order
      const sorted = data.sort((a, b) => a.order - b.order);
      setEvents(sorted);
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const loadAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const data = await storageService.getAnalytics({ type: 'all', period: analyticsPeriod });
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const getPeriodLabel = () => {
    switch(analyticsPeriod) {
      case 1: return 'Hoje';
      case 7: return 'Últimos 7 dias';
      case 30: return 'Últimos 30 dias';
      case 365: return 'Todo período';
      default: return `Últimos ${analyticsPeriod} dias`;
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este evento?')) {
      try {
        await storageService.deleteEvent(id);
        await loadEvents();
      } catch (error) {
        alert('Erro ao deletar evento');
      }
    }
  };

  const handleToggle = async (id: string, current: boolean) => {
    try {
      await storageService.toggleActive(id, current);
      await loadEvents();
    } catch (error) {
      alert('Erro ao alternar status');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === events.length - 1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    try {
      await storageService.reorder(index, newIndex);
      await loadEvents();
    } catch (error) {
      alert('Erro ao reordenar eventos');
    }
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

      {/* Tabs Navigation */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('events')}
              className={`px-6 py-3 font-semibold text-sm transition-colors relative ${
                activeTab === 'events'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Gerenciar Eventos
              </div>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-3 font-semibold text-sm transition-colors relative ${
                activeTab === 'analytics'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Tab: Gerenciar Eventos */}
        {activeTab === 'events' && (
          <>
            {/* Header with Add Button */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Eventos</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {events.length} evento(s) cadastrado(s) • {activeCount} ativo(s)
                  {expiredCount > 0 && ` • ${expiredCount} expirado(s)`}
                </p>
              </div>
              <button 
                onClick={openAddModal}
                className="flex items-center gap-2 bg-primary-dark hover:bg-primary text-white font-semibold px-5 py-2.5 rounded-lg shadow-lg transition-all hover:shadow-xl"
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
                      analytics={analytics}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Tab: Analytics */}
        {activeTab === 'analytics' && (
          <>
            {/* Analytics Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-beige" />
              <h2 className="text-2xl font-bold text-gray-800">Analytics</h2>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded whitespace-nowrap">{getPeriodLabel()}</span>
            </div>
            
            {/* Period Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setAnalyticsPeriod(1)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  analyticsPeriod === 1
                    ? 'bg-beige text-primary-dark shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Hoje
              </button>
              <button
                onClick={() => setAnalyticsPeriod(7)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  analyticsPeriod === 7
                    ? 'bg-beige text-primary-dark shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                7 dias
              </button>
              <button
                onClick={() => setAnalyticsPeriod(30)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  analyticsPeriod === 30
                    ? 'bg-beige text-primary-dark shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                30 dias
              </button>
              <button
                onClick={() => setAnalyticsPeriod(365)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  analyticsPeriod === 365
                    ? 'bg-beige text-primary-dark shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Todo período
              </button>
            </div>
          </div>
          
          {loadingAnalytics ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 animate-pulse">
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <AnalyticsCard
                title="Visitas Total"
                value={analytics?.page_views?.total_views || 0}
                subtitle="Todas as visualizações da página"
                icon={Users}
                color="purple"
              />
              <AnalyticsCard
                title="Visitas Únicas"
                value={analytics?.page_views?.unique_views || 0}
                subtitle={`Visitantes únicos (${getPeriodLabel().toLowerCase()})`}
                icon={TrendingUp}
                color="blue"
              />
              <AnalyticsCard
                title="Cliques Total"
                value={analytics?.event_clicks_by_event?.reduce((sum: number, e: any) => sum + parseInt(e.total_clicks), 0) || 0}
                subtitle="Todos os cliques em eventos"
                icon={MousePointerClick}
                color="green"
              />
              <AnalyticsCard
                title="Cliques Únicos"
                value={analytics?.event_clicks_by_event?.reduce((sum: number, e: any) => sum + parseInt(e.unique_clicks), 0) || 0}
                subtitle={`Cliques únicos (${getPeriodLabel().toLowerCase()})`}
                icon={Eye}
                color="orange"
              />
            </div>
          )}
          
          {/* Button Clicks Stats */}
          {!loadingAnalytics && analytics?.button_clicks?.length > 0 && (
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MousePointerClick className="w-5 h-5 text-beige" />
                  <h3 className="font-bold text-gray-700">Cliques nos Botões de Navegação</h3>
                </div>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">{getPeriodLabel()}</span>
              </div>
              <div className="divide-y divide-gray-100">
                {analytics.button_clicks.map((item: any) => {
                  const buttonLabels: Record<string, { label: string, icon: string, color: string }> = {
                    'grupos_de_crescimento': { 
                      label: 'Grupos de Crescimento', 
                      icon: '👥',
                      color: 'from-blue-500 to-purple-600'
                    },
                    'nossas_ministracoes': { 
                      label: 'Nossas Ministrações', 
                      icon: '🎤',
                      color: 'from-purple-600 to-blue-500'
                    }
                  };
                  
                  const buttonInfo = buttonLabels[item.button_name] || { 
                    label: item.button_name, 
                    icon: '🔘',
                    color: 'from-gray-400 to-gray-500'
                  };
                  
                  return (
                    <div key={item.button_name} className="p-4 flex items-center justify-between hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 bg-gradient-to-br ${buttonInfo.color} rounded-lg flex items-center justify-center text-2xl shadow-md`}>
                          {buttonInfo.icon}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{buttonInfo.label}</p>
                          <p className="text-xs text-gray-400">Botão de navegação superior</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-right">
                          <p className="font-bold text-gray-800">{item.total_clicks}</p>
                          <p className="text-xs text-gray-400">Total</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">{item.unique_clicks}</p>
                          <p className="text-xs text-gray-400">Únicos</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Event Clicks Breakdown */}
          {!loadingAnalytics && analytics?.event_clicks_by_event?.length > 0 && (
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-beige" />
                  <h3 className="font-bold text-gray-700">Cliques por Evento</h3>
                </div>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">{getPeriodLabel()}</span>
              </div>
              <div className="divide-y divide-gray-100">
                {analytics.event_clicks_by_event.map((item: any) => {
                  const event = events.find(e => e.id === item.event_id.toString());
                  const isDeleted = !event;
                  return (
                    <div key={item.event_id} className={`p-4 flex items-center justify-between hover:bg-gray-50 ${
                      isDeleted ? 'opacity-60' : ''
                    }`}>
                      <div className="flex items-center gap-3">
                        {event?.coverImage ? (
                          <img src={event.coverImage} alt="" className="w-10 h-10 object-cover rounded" />
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-800">
                              {event?.name || `Evento #${item.event_id}`}
                            </p>
                            {isDeleted && (
                              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">Excluído</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400">ID: {item.event_id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-right">
                          <p className="font-bold text-gray-800">{item.total_clicks}</p>
                          <p className="text-xs text-gray-400">Total</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">{item.unique_clicks}</p>
                          <p className="text-xs text-gray-400">Únicos</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        </>
      )}
      </div>

      <footer className="text-center text-gray-400 text-xs py-8 mt-12">
        <p>© {new Date().getFullYear()} Igreja Verbo da Vida Pedro Leopoldo.</p>
        <p className="mt-1">Todos os direitos reservados.</p>
        <p className="mt-2 text-gray-500">Departamento de Tecnologia - Desenvolvido com ❤️</p>
      </footer>

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

const EventRow: React.FC<any> = ({ event, index, isLast, onMove, onToggle, onEdit, onDelete, analytics }) => {
  const isExpired = event.endDate && event.endDate < new Date().toISOString().split('T')[0];
  
  // Buscar analytics deste evento específico
  const eventStats = analytics?.events?.find((item: any) => item.event_id === event.id);

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
               <Calendar className="w-3 h-3" /> Início: {formatDate(event.startDate)}
             </span>
          )}
          {event.endDate && (
             <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded border ${isExpired ? 'bg-red-50 text-red-700 border-red-100' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
               <Calendar className="w-3 h-3" /> Fim: {formatDate(event.endDate)} {isExpired && '(Expirado)'}
             </span>
          )}
          
          {/* Analytics do Evento */}
          {eventStats && (
            <>
              <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-1 rounded border border-green-100 font-semibold">
                <MousePointerClick className="w-3 h-3" /> {eventStats.total_clicks} cliques
              </span>
              <span className="inline-flex items-center gap-1 text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded border border-purple-100 font-semibold">
                <Users className="w-3 h-3" /> {eventStats.unique_clicks} únicos
              </span>
            </>
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
  const [uploading, setUploading] = useState(false);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas imagens.');
      return;
    }

    // Validar tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB.');
      return;
    }

    setUploading(true);

    try {
      // Criar FormData para enviar arquivo
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);

      // Enviar para API de upload
      const response = await fetch('/api/upload.php', {
        method: 'POST',
        body: formDataUpload
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Erro ao fazer upload');
      }

      // Atualizar formData com o caminho da imagem
      setFormData(prev => ({ ...prev, coverImage: result.path }));
      
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro ao fazer upload da imagem');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (event) {
        await storageService.updateEvent({ ...event, ...formData } as EventItem);
      } else {
        await storageService.addEvent({ 
          id: Date.now().toString(),
          ...formData 
        } as EventItem);
      }
      onSave();
    } catch (error) {
      alert('Erro ao salvar evento');
    }
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Imagem de Capa</label>
            
            {/* Preview da Imagem */}
            {formData.coverImage && (
              <div className="mb-3 relative group">
                <img 
                  src={formData.coverImage} 
                  alt="Preview" 
                  className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/800x450?text=Erro+ao+carregar';
                  }}
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <p className="text-white text-sm font-medium">Clique abaixo para trocar</p>
                </div>
              </div>
            )}
            
            {/* Upload de Imagem */}
            <div>
              <label className="block cursor-pointer">
                <div className="flex items-center justify-center gap-2 w-full border-2 border-dashed border-gray-300 hover:border-beige rounded-lg p-6 transition-colors bg-gray-50 hover:bg-beige/5">
                  {uploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-beige border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm text-gray-600 font-medium">Fazendo upload...</span>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-6 h-6 text-gray-400" />
                      <span className="text-sm text-gray-700 font-medium">
                        {formData.coverImage ? 'Trocar imagem' : 'Clique para fazer upload'}
                      </span>
                    </>
                  )}
                </div>
                <input 
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              <p className="text-xs text-gray-400 mt-2">
                Formatos aceitos: JPG, PNG, WEBP, GIF • Máx: 5MB • Recomendado: 1600x900
              </p>
            </div>
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
               className="flex-1 bg-beige hover:bg-beige-light text-primary-dark font-semibold py-2.5 rounded-lg shadow-md transition-colors flex justify-center items-center gap-2"
             >
               <Check className="w-5 h-5" /> Salvar
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};
