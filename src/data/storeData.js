// Store Locations Data

export const stores = [
  {
    id: 'travertine-film-nagar',
    name: 'Travertine',
    location: 'Film Nagar',
    address: 'Road Number 82, Film Nagar, Hyderabad',
    city: 'Hyderabad',
    distance: '2.89 KM AWAY',
    hours: {
      open: '8:00 AM',
      close: '11:00 PM',
    },
    coordinates: {
      latitude: 17.4239,
      longitude: 78.4738,
    },
    phone: '+91 98765 43210',
    available: true,
  },
  {
    id: 'burnt-earth-kokapet',
    name: 'Burnt Earth',
    location: 'Kokapet',
    address: 'Financial District, Kokapet, Hyderabad',
    city: 'Hyderabad',
    distance: '4.5 KM AWAY',
    hours: {
      open: '8:00 AM',
      close: '11:00 PM',
    },
    coordinates: {
      latitude: 17.4142,
      longitude: 78.3462,
    },
    phone: '+91 98765 43211',
    available: true,
  },
  {
    id: 'lumere-hitech-city',
    name: 'Lumere',
    location: 'Hitech City',
    address: 'HITEC City, Madhapur, Hyderabad',
    city: 'Hyderabad',
    distance: '5.2 KM AWAY',
    hours: {
      open: '8:00 AM',
      close: '11:00 PM',
    },
    coordinates: {
      latitude: 17.4485,
      longitude: 78.3908,
    },
    phone: '+91 98765 43212',
    available: true,
  },
];

export const getStoreById = (id) => {
  return stores.find(store => store.id === id);
};

export const getStoreByName = (name) => {
  return stores.find(store => 
    store.name.toLowerCase() === name.toLowerCase() ||
    store.location.toLowerCase() === name.toLowerCase()
  );
};

export const getAvailableStores = () => {
  return stores.filter(store => store.available);
};

export default stores;
