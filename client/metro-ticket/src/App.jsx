import React, { useState, useEffect } from 'react';

// API Service (inline for this example)
const API_BASE_URL = process.env.BACKEND_URI;

const api = {
  get: (url) => fetch(`${API_BASE_URL}${url}`).then(res => res.json()).then(data => {
    return data;
  }),
  post: (url, data) => fetch(`${API_BASE_URL}${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json())
};

const stationService = {
  getAllStations: () => api.get('/stations'),
  getStation: (name) => api.get(`/stations/${name}`),
};

const ticketService = {
  calculatePrice: (fromStation, toStation) => 
    api.post('/tickets/calculate-price', { fromStation, toStation }),
  
  bookTicket: (fromStation, toStation) => 
    api.post('/tickets/book', { fromStation, toStation }),
  
  enterStation: (ticketId, stationName) => 
    api.post('/tickets/enter-station', { ticketId, stationName }),
  
  exitStation: (ticketId, stationName) => 
    api.post('/tickets/exit-station', { ticketId, stationName }),
  
  getTicketDetails: (ticketId) => 
    api.get(`/tickets/${ticketId}`),
};

// Ticket Booking Component
const TicketBooking = () => {
  const [stations, setStations] = useState([]);
  const [fromStation, setFromStation] = useState('');
  const [toStation, setToStation] = useState('');
  const [price, setPrice] = useState(null);
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStations();
  }, []);

  const loadStations = async () => {
    try {
      const response = await stationService.getAllStations();
      setStations(response);
    } catch (error) {
      console.error('Error loading stations:', error);
      setError('Failed to load stations');
    }
  };

  const calculatePrice = async () => {
    if (!fromStation || !toStation) {
      setError('Please select both stations');
      return;
    }

    if (fromStation === toStation) {
      setError('Please select different stations');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await ticketService.calculatePrice(fromStation, toStation);
      setPrice(response.price);
    } catch (error) {
      console.error('Error calculating price:', error);
      setError('Error calculating price: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const bookTicket = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await ticketService.bookTicket(fromStation, toStation);
      setTicket(response);
    } catch (error) {
      console.error('Error booking ticket:', error);
      setError('Error booking ticket: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFromStation('');
    setToStation('');
    setPrice(null);
    setTicket(null);
    setError('');
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Book Your Ticket</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-700">From Station</label>
        <select
          value={fromStation}
          onChange={(e) => setFromStation(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={loading}
        >
          <option value="">Select From Station</option>
          {stations.map(station => (
            <option key={station.name} value={station.name}>
              {station.name} - ₹{station.price}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-700">To Station</label>
        <select
          value={toStation}
          onChange={(e) => setToStation(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={loading}
        >
          <option value="">Select To Station</option>
          {stations.map(station => (
            <option key={station.name} value={station.name}>
              {station.name} - ₹{station.price}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={calculatePrice}
        disabled={loading || !fromStation || !toStation}
        className="w-full bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed mb-4 font-medium"
      >
        {loading ? 'Calculating...' : 'Calculate Price'}
      </button>

      {price !== null && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-lg font-semibold text-blue-800">
            Price: ₹{price}
          </p>
          <p className="text-sm text-blue-600">
            From {fromStation} to {toStation}
          </p>
        </div>
      )}

      <button
        onClick={bookTicket}
        disabled={loading || price === null}
        className="w-full bg-green-500 text-white py-3 px-4 rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed mb-4 font-medium"
      >
        {loading ? 'Booking...' : 'Book Ticket'}
      </button>

      {ticket && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <h1 className='mb-2 p-2 rounded-xl text-center bg-red-400'>Please Note Down The Ticket ID</h1>
          <h3 className="font-semibold mb-2 text-green-800">Ticket Booked Successfully!</h3>
          <div className="space-y-1 text-sm">
            <p><strong>Ticket ID:</strong> {ticket.ticketId}</p>
            <p><strong>From:</strong> {ticket.fromStation}</p>
            <p><strong>To:</strong> {ticket.toStation}</p>
            <p><strong>Price:</strong> ₹{ticket.price}</p>
            <p><strong>Status:</strong> {ticket.status}</p>
            <p><strong>Expires At:</strong> {new Date(ticket.isValid).toLocaleString()}</p>
          </div>
          <button
            onClick={resetForm}
            className="mt-3 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
          >
            Book Another Ticket
          </button>
        </div>
      )}
    </div>
  );
};

// Station Entry Component
const StationEntry = () => {
  const [ticketId, setTicketId] = useState('');
  const [stationName, setStationName] = useState('');
  const [stations, setStations] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStations();
  }, []);

  const loadStations = async () => {
    try {
      const response = await stationService.getAllStations();
      setStations(response);
    } catch (error) {
      console.error('Error loading stations:', error);
    }
  };

  const handleEntry = async () => {
    if (!ticketId || !stationName) {
      setError('Please enter ticket ID and select station');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await ticketService.enterStation(ticketId, stationName);
      if (response.error) {
        setError(response.error);
        setResult(null);
      } else {
        setResult(response);
      }
    } catch (error) {
      console.error('Error entering station:', error);
      setError('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTicketId('');
    setStationName('');
    setResult(null);
    setError('');
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Enter Station</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-700">Ticket ID</label>
        <input
          type="text"
          value={ticketId}
          onChange={(e) => setTicketId(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your ticket ID"
          disabled={loading}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-700">Station</label>
        <select
          value={stationName}
          onChange={(e) => setStationName(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={loading}
        >
          <option value="">Select Station</option>
          {stations.map(station => (
            <option key={station.name} value={station.name}>
              {station.name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleEntry}
        disabled={loading || !ticketId || !stationName}
        className="w-full bg-orange-500 text-white py-3 px-4 rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed mb-4 font-medium"
      >
        {loading ? 'Processing...' : 'Enter Station'}
      </button>

      {result && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <h3 className="font-semibold mb-2 text-green-800">Entry Successful!</h3>
          <div className="space-y-1 text-sm">
            <p><strong>Ticket ID:</strong> {result.ticket.ticketId}</p>
            <p><strong>Status:</strong> {result.status}</p>
            <p><strong>Entry Time:</strong> {new Date(result.ticket.entryTime).toLocaleString()}</p>
            <p><strong>Valid Until:</strong> {new Date(result.ticket.isValid).toLocaleString()}</p>
          </div>
          <button
            onClick={resetForm}
            className="mt-3 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
};

// Station Exit Component
const StationExit = () => {
  const [ticketId, setTicketId] = useState('');
  const [stationName, setStationName] = useState('');
  const [stations, setStations] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStations();
  }, []);

  const loadStations = async () => {
    try {
      const response = await stationService.getAllStations();
      setStations(response);
    } catch (error) {
      console.error('Error loading stations:', error);
    }
  };

  const handleExit = async () => {
    if (!ticketId || !stationName) {
      setError('Please enter ticket ID and select station');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await ticketService.exitStation(ticketId, stationName);
      if (response.error) {
        setError(response.error);
        setResult(null);
      } else {
        setResult(response);
      }
    } catch (error) {
      console.error('Error exiting station:', error);
      setError('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTicketId('');
    setStationName('');
    setResult(null);
    setError('');
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Exit Station</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-700">Ticket ID</label>
        <input
          type="text"
          value={ticketId}
          onChange={(e) => setTicketId(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your ticket ID"
          disabled={loading}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-700">Station</label>
        <select
          value={stationName}
          onChange={(e) => setStationName(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={loading}
        >
          <option value="">Select Station</option>
          {stations.map(station => (
            <option key={station.name} value={station.name}>
              {station.name}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleExit}
        disabled={loading || !ticketId || !stationName}
        className="w-full bg-red-500 text-white py-3 px-4 rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed mb-4 font-medium"
      >
        {loading ? 'Processing...' : 'Exit Station'}
      </button>

      {result && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <h3 className="font-semibold mb-2 text-green-800">Exit Successful!</h3>
          <div className="space-y-1 text-sm">
            <p><strong>Ticket ID:</strong> {result.ticket.ticketId}</p>
            <p><strong>Status:</strong> {result.ticket.status}</p>
            <p><strong>Exit Time:</strong> {new Date(result.ticket.exitTime).toLocaleString()}</p>
            <p><strong>Journey Completed:</strong> {result.ticket.fromStation} → {result.ticket.toStation}</p>
          </div>
          <button
            onClick={resetForm}
            className="mt-3 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
};

// Main App Component
const App = () => {
  const [activeTab, setActiveTab] = useState('booking');

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Metro Ticket Booking System
        </h1>
        
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-md p-1">
            <button
              onClick={() => setActiveTab('booking')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'booking'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Book Ticket
            </button>
            <button
              onClick={() => setActiveTab('entry')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'entry'
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Enter Station
            </button>
            <button
              onClick={() => setActiveTab('exit')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'exit'
                  ? 'bg-red-500 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Exit Station
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-4xl mx-auto">
          {activeTab === 'booking' && <TicketBooking />}
          {activeTab === 'entry' && <StationEntry />}
          {activeTab === 'exit' && <StationExit />}
        </div>
      </div>
    </div>
  );
};

export default App;