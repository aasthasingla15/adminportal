const mockFallbackEvents = [
  {
    _id: 'mock-1',
    title: 'Azure Cloud Dev Summit',
    description: 'Deep dive into cloud native architectures, serverless computing, and hands-on deployment with Microsoft Azure.',
    date: '2026-09-18',
    time: '10:00 AM',
    venue: 'Auditorium 1, IGDTUW',
    category: 'Workshop',
    bannerImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
    registrationLink: 'https://mscigdtuw.vercel.app/',
    status: 'Upcoming',
    featured: true
  },
  {
    _id: 'mock-2',
    title: 'Imagine Cup Hackathon',
    description: 'The premier student technology competition. Build prototypes, solve global challenges, and win mentorship from Microsoft experts.',
    date: '2026-09-22',
    time: '09:00 AM',
    venue: 'Tech Hall, IGDTUW',
    category: 'Hackathon',
    bannerImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
    registrationLink: 'https://mscigdtuw.vercel.app/',
    status: 'Upcoming',
    featured: false
  },
  {
    _id: 'mock-3',
    title: 'AI/ML Innovation Bootcamp',
    description: 'Comprehensive bootcamp on modern machine learning techniques, neural networks, and model deployment.',
    date: '2026-09-28',
    time: '11:00 AM',
    venue: 'Lab 3, IGDTUW',
    category: 'Bootcamp',
    bannerImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    registrationLink: 'https://mscigdtuw.vercel.app/',
    status: 'Upcoming',
    featured: false
  },
  {
    _id: 'mock-4',
    title: 'Algorithmic Coding Showdown',
    description: 'Showcase your competitive programming skills in this intense multi-round algorithm sprint.',
    date: '2026-10-05',
    time: '02:00 PM',
    venue: 'CS Department, IGDTUW',
    category: 'Competition',
    bannerImage: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&auto=format&fit=crop&q=80',
    registrationLink: 'https://mscigdtuw.vercel.app/',
    status: 'Upcoming',
    featured: false
  }
];

export function getLocalEvents() {
  if (typeof window === 'undefined') return mockFallbackEvents;
  
  const saved = localStorage.getItem('msc_events');
  if (!saved) {
    localStorage.setItem('msc_events', JSON.stringify(mockFallbackEvents));
    return mockFallbackEvents;
  }
  
  try {
    return JSON.parse(saved);
  } catch (err) {
    console.error('Error parsing local storage events:', err);
    return mockFallbackEvents;
  }
}

export function getLocalEventById(id) {
  const events = getLocalEvents();
  return events.find(e => e._id === id) || null;
}

export function saveLocalEvent(eventData) {
  if (typeof window === 'undefined') return eventData;
  
  const events = getLocalEvents();
  const today = new Date().toISOString();
  
  let targetEvent = { ...eventData };
  
  // Single-featured logic
  if (targetEvent.featured) {
    events.forEach(e => {
      if (e._id !== targetEvent._id) e.featured = false;
    });
  }
  
  const existingIndex = events.findIndex(e => e._id === targetEvent._id);
  
  if (existingIndex > -1) {
    // Update existing event
    events[existingIndex] = {
      ...events[existingIndex],
      ...targetEvent,
      updatedAt: today
    };
    targetEvent = events[existingIndex];
  } else {
    // Create new event
    targetEvent._id = targetEvent._id || `local-${Date.now()}`;
    targetEvent.createdAt = today;
    targetEvent.updatedAt = today;
    events.push(targetEvent);
  }
  
  localStorage.setItem('msc_events', JSON.stringify(events));
  return targetEvent;
}

export function deleteLocalEvent(id) {
  if (typeof window === 'undefined') return false;
  
  const events = getLocalEvents();
  const filtered = events.filter(e => e._id !== id);
  
  if (filtered.length !== events.length) {
    localStorage.setItem('msc_events', JSON.stringify(filtered));
    return true;
  }
  
  return false;
}
