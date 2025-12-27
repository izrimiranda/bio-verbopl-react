import { EventItem } from '../types';

// URL base da API
const API_BASE_URL = '/api';

export const storageService = {
  /**
   * Buscar todos os eventos do banco de dados
   */
  getEvents: async (): Promise<EventItem[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/events.php`);

      if (!response.ok) {
        throw new Error('Erro ao buscar eventos');
      }

      const events: EventItem[] = await response.json();
      return events;
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  },

  /**
   * Adicionar novo evento
   */
  addEvent: async (event: EventItem): Promise<EventItem[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/events.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao adicionar evento');
      }

      // Retornar lista atualizada
      return await storageService.getEvents();
    } catch (error) {
      console.error('Error adding event:', error);
      throw error;
    }
  },

  /**
   * Atualizar evento existente
   */
  updateEvent: async (updatedEvent: EventItem): Promise<EventItem[]> => {
    try {
      console.log('Sending PUT request to update event:', updatedEvent);

      const response = await fetch(`${API_BASE_URL}/events.php`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEvent)
      });

      console.log('Update response status:', response.status, response.statusText);

      const responseData = await response.json();
      console.log('Update response data:', responseData);

      if (!response.ok) {
        throw new Error(responseData.error || 'Erro ao atualizar evento');
      }

      // Retornar lista atualizada
      const updatedList = await storageService.getEvents();
      console.log('Updated events list:', updatedList);
      return updatedList;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  },

  /**
   * Deletar evento
   */
  deleteEvent: async (id: string): Promise<EventItem[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/events.php?id=${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao deletar evento');
      }

      // Retornar lista atualizada
      return await storageService.getEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  },

  /**
   * Alternar status ativo/inativo
   */
  toggleActive: async (id: string, currentActive: boolean): Promise<EventItem[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/events.php`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          active: !currentActive
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao alternar status');
      }

      // Retornar lista atualizada
      return await storageService.getEvents();
    } catch (error) {
      console.error('Error toggling active:', error);
      throw error;
    }
  },

  /**
   * Reordenar eventos
   */
  reorder: async (fromIndex: number, toIndex: number): Promise<EventItem[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/reorder.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromIndex,
          toIndex
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao reordenar eventos');
      }

      // Retornar lista atualizada
      return await storageService.getEvents();
    } catch (error) {
      console.error('Error reordering events:', error);
      throw error;
    }
  },

  /**
   * Autenticar admin
   */
  authenticate: async (password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password })
      });

      if (response.ok) {
        const data = await response.json();
        return data.authenticated === true;
      }

      return false;
    } catch (error) {
      console.error('Error authenticating:', error);
      return false;
    }
  },

  /**
   * Registrar visualização de página (page view)
   */
  trackPageView: async (): Promise<void> => {
    try {
      await fetch(`${API_BASE_URL}/analytics.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'page_view'
        })
      });
    } catch (error) {
      // Silent fail - analytics shouldn't break the app
      console.debug('Analytics tracking failed:', error);
    }
  },

  /**
   * Registrar clique em evento
   */
  trackEventClick: async (eventId: string): Promise<void> => {
    try {
      await fetch(`${API_BASE_URL}/analytics.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'event_click',
          event_id: eventId
        })
      });
    } catch (error) {
      // Silent fail - analytics shouldn't break the app
      console.debug('Analytics tracking failed:', error);
    }
  },

  /**
   * Registrar clique em botão (grupos ou ministrações)
   */
  trackButtonClick: async (buttonName: string): Promise<void> => {
    try {
      await fetch(`${API_BASE_URL}/analytics.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'button_click',
          button_name: buttonName
        })
      });
    } catch (error) {
      // Silent fail - analytics shouldn't break the app
      console.debug('Analytics tracking failed:', error);
    }
  },

  /**
   * Buscar estatísticas de analytics
   */
  getAnalytics: async (params?: {
    type?: 'all' | 'page_view' | 'event_click';
    event_id?: string;
    period?: number;
  }): Promise<any> => {
    try {
      const queryParams = new URLSearchParams();

      if (params?.type) queryParams.append('type', params.type);
      if (params?.event_id) queryParams.append('event_id', params.event_id);
      if (params?.period) queryParams.append('period', params.period.toString());

      const url = `${API_BASE_URL}/analytics.php${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Erro ao buscar analytics');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return null;
    }
  }
};
