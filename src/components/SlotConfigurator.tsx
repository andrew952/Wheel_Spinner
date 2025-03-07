import React from 'react';
import { SlotConfig, SlotSymbol } from '../types';
import { Plus, Trash2, Image, Type } from 'lucide-react';

interface SlotConfiguratorProps {
  config: SlotConfig;
  onChange: (config: SlotConfig) => void;
}

export function SlotConfigurator({ config, onChange }: SlotConfiguratorProps) {
  const addSymbol = (reelIndex: number) => {
    const newSymbol: SlotSymbol = {
      id: Math.random().toString(36).substr(2, 9),
      text: '🎰',
    };

    const newReels = [...config.reels];
    newReels[reelIndex] = [...newReels[reelIndex], newSymbol];

    onChange({
      ...config,
      reels: newReels,
    });
  };

  const removeSymbol = (reelIndex: number, symbolId: string) => {
    const newReels = [...config.reels];
    newReels[reelIndex] = newReels[reelIndex].filter(symbol => symbol.id !== symbolId);

    onChange({
      ...config,
      reels: newReels,
    });
  };

  const updateSymbol = (reelIndex: number, symbolId: string, updates: Partial<SlotSymbol>) => {
    const newReels = [...config.reels];
    newReels[reelIndex] = newReels[reelIndex].map(symbol =>
      symbol.id === symbolId ? { ...symbol, ...updates } : symbol
    );

    onChange({
      ...config,
      reels: newReels,
    });
  };

  const handleImageUpload = (reelIndex: number, symbolId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateSymbol(reelIndex, symbolId, { imageUrl: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (reelIndex: number, symbolId: string) => {
    updateSymbol(reelIndex, symbolId, { imageUrl: undefined });
  };

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange({
          ...config,
          backgroundImage: event.target?.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Slot Machine Configuration</h3>
        <div>
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer">
            <Image className="w-4 h-4" />
            Set Background
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleBackgroundUpload}
            />
          </label>
        </div>
      </div>

      <div className="space-y-4">
        {config.reels.map((reel, reelIndex) => (
          <div key={reelIndex} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium">Reel {reelIndex + 1}</h4>
              <button
                onClick={() => addSymbol(reelIndex)}
                className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Plus className="w-4 h-4" />
                Add Symbol
              </button>
            </div>

            <div className="space-y-2">
              {reel.map((symbol) => (
                <div
                  key={symbol.id}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={symbol.text}
                      onChange={(e) => updateSymbol(reelIndex, symbol.id, { text: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Symbol text or emoji"
                    />
                    {symbol.imageUrl && (
                      <div className="relative w-20 h-20">
                        <img
                          src={symbol.imageUrl}
                          alt={symbol.text}
                          className="w-full h-full object-contain rounded-lg"
                        />
                        <button
                          onClick={() => removeImage(reelIndex, symbol.id)}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <label className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                      <Image className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(reelIndex, symbol.id, e)}
                      />
                    </label>
                    <button
                      onClick={() => removeSymbol(reelIndex, symbol.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Spin Duration (ms)
        </label>
        <input
          type="number"
          value={config.spinDuration}
          onChange={(e) => onChange({ ...config, spinDuration: Number(e.target.value) })}
          min={1000}
          max={10000}
          step={100}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}