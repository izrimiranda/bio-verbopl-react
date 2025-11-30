import { EventItem } from '../types';
import { INITIAL_EVENTS } from '../constants';

const STORAGE_KEY = 'vv_events_data';

export const storageService = {
  getEvents: (): EventItem[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EVENTS));
      return INITIAL_EVENTS;
    }
    return JSON.parse(stored);
  },

  saveEvents: (events: EventItem[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  },

  addEvent: (event: EventItem) => {
    const events = storageService.getEvents();
    // determine max order
    const maxOrder = events.length > 0 ? Math.max(...events.map(e => e.order)) : 0;
    const newEvent = { ...event, order: maxOrder + 1 };
    const updated = [...events, newEvent];
    storageService.saveEvents(updated);
    return updated;
  },

  updateEvent: (updatedEvent: EventItem) => {
    const events = storageService.getEvents();
    const updated = events.map(e => e.id === updatedEvent.id ? updatedEvent : e);
    storageService.saveEvents(updated);
    return updated;
  },

  deleteEvent: (id: string) => {
    const events = storageService.getEvents();
    const updated = events.filter(e => e.id !== id);
    storageService.saveEvents(updated);
    return updated;
  },

  toggleActive: (id: string, currentState: boolean) => {
    const events = storageService.getEvents();
    const updated = events.map(e => e.id === id ? { ...e, active: !currentState } : e);
    storageService.saveEvents(updated);
    return updated;
  },
  
  // Reorder helper
  reorder: (startIndex: number, endIndex: number) => {
    const events = storageService.getEvents();
    // Sort by order first to ensure array index matches visual order
    const sorted = [...events].sort((a, b) => a.order - b.order);
    const [removed] = sorted.splice(startIndex, 1);
    sorted.splice(endIndex, 0, removed);
    
    // Reassign order properties
    const reordered = sorted.map((e, index) => ({
      ...e,
      order: index + 1
    }));
    
    storageService.saveEvents(reordered);
    return reordered;
  }
};
