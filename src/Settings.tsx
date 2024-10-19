import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { storage } from './utils/chromeApi';

function Settings() {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let parsedValue = parseInt(value, 10);
    if (name === 'shareInterval' && parsedValue < 3600) {
      parsedValue = 3600; // Enforce minimum 1 hour interval
    }
    setSettings((prev) => ({ ...prev, [name]: parsedValue }));
  };

  const saveSettings = () => {
    storage.set({ settings, hasAcknowledged }, () => {
      alert('Settings saved successfully!');
    });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center text-indigo-600">Poshmark Pro Settings</h1>
      <div className="mb-4">
        <label htmlFor="shareInterval" className="block text-sm font-medium text-gray-700 mb-1">
          Share Interval (seconds, minimum 3600)
        </label>
        <input
          type="number"
          id="shareInterval"
          name="shareInterval"
          value={settings.shareInterval}
          onChange={handleChange}
          min="3600"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="itemsToShare" className="block text-sm font-medium text-gray-700 mb-1">
          Items to Share
        </label>
        <input
          type="number"
          id="itemsToShare"
          name="itemsToShare"
          value={settings.itemsToShare}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={hasAcknowledged}
            onChange={(e) => setHasAcknowledged(e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">
            I acknowledge that I will use this extension responsibly and in compliance with Poshmark's Terms of Service.
          </span>
        </label>
      </div>
      <button
        onClick={saveSettings}
        className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-full font-semibold text-white"
      >
        <Save className="inline-block mr-2" size={16} />
        Save Settings
      </button>
    </div>
  );
}

export default Settings;