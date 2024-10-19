import React, { useState, useEffect } from 'react';
import { Share2, Settings, Play, Pause } from 'lucide-react';
import { storage, tabs } from './utils/chromeApi';

function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [settings, setSettings] = useState({
    shareInterval: 3600,
    itemsToShare: 50,
  });
  const [hasAcknowledged, setHasAcknowledged] = useState(false);

  useEffect(() => {
    storage.get(['settings', 'hasAcknowledged'], (result) => {
      if (result.settings) {
        setSettings(result.settings);
      }
      setHasAcknowledged(result.hasAcknowledged || false);
    });
  }, []);

  const toggleAutomation = () => {
    if (!hasAcknowledged) {
      alert("Please acknowledge the terms of use in the settings before using this extension.");
      return;
    }
    setIsRunning(!isRunning);
    tabs.sendMessage(/* tabId */ 0, { action: isRunning ? 'stop' : 'start', settings });
  };

  const openSettings = () => {
    tabs.create({ url: 'settings.html' });
  };

  return (
    <div className="w-64 p-4 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center text-indigo-600">Poshmark Pro</h1>
      <div className="flex justify-center mb-4">
        <Share2 className="w-12 h-12 text-indigo-500" />
      </div>
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Status: {isRunning ? 'Running' : 'Stopped'}</p>
        <button
          onClick={toggleAutomation}
          className={`w-full py-2 px-4 rounded-full font-semibold text-white ${
            isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="inline-block mr-2" size={16} />
              Stop
            </>
          ) : (
            <>
              <Play className="inline-block mr-2" size={16} />
              Start
            </>
          )}
        </button>
      </div>
      <button
        onClick={openSettings}
        className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-full font-semibold text-gray-700"
      >
        <Settings className="inline-block mr-2" size={16} />
        Settings
      </button>
      <p className="mt-4 text-xs text-gray-500 text-center">
        Use responsibly and in compliance with Poshmark's Terms of Service.
      </p>
    </div>
  );
}

export default App;