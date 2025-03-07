import React from 'react';
import { WheelConfig, WheelSegment } from '../types';
import { Plus, Trash2, Image, Type } from 'lucide-react';

interface WheelConfiguratorProps {
  config: WheelConfig;
  onChange: (config: WheelConfig) => void;
}

export function WheelConfigurator({ config, onChange }: WheelConfiguratorProps) {
  const addSegment = () => {
    const newSegment: WheelSegment = {
      id: Math.random().toString(36).substr(2, 9),
      text: `Option ${config.segments.length + 1}`,
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
    };
    
    onChange({
      ...config,
      segments: [...config.segments, newSegment],
    });
  };

  const removeSegment = (id: string) => {
    onChange({
      ...config,
      segments: config.segments.filter(segment => segment.id !== id),
    });
  };

  const updateSegment = (id: string, updates: Partial<WheelSegment>) => {
    onChange({
      ...config,
      segments: config.segments.map(segment =>
        segment.id === id ? { ...segment, ...updates } : segment
      ),
    });
  };

  const handleImageUpload = (segmentId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateSegment(segmentId, { imageUrl: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (segmentId: string) => {
    updateSegment(segmentId, { imageUrl: undefined });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Wheel Configuration</h3>
        <button
          onClick={addSegment}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Plus className="w-4 h-4" />
          Add Segment
        </button>
      </div>

      <div className="space-y-2">
        {config.segments.map((segment) => (
          <div
            key={segment.id}
            className="space-y-2 p-4 bg-white rounded-lg shadow"
          >
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={segment.color}
                onChange={(e) => updateSegment(segment.id, { color: e.target.value })}
                className="w-10 h-10 rounded cursor-pointer"
              />
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={segment.text}
                  onChange={(e) => updateSegment(segment.id, { text: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Segment text"
                />
                {segment.imageUrl && (
                  <div className="relative w-20 h-20">
                    <img
                      src={segment.imageUrl}
                      alt={segment.text}
                      className="w-full h-full object-contain rounded-lg"
                    />
                    <button
                      onClick={() => removeImage(segment.id)}
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
                    onChange={(e) => handleImageUpload(segment.id, e)}
                  />
                </label>
                <button
                  onClick={() => removeSegment(segment.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Pointer Style
        </label>
        <select
          value={config.pointerStyle}
          onChange={(e) => onChange({ ...config, pointerStyle: e.target.value as any })}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="classic">Classic</option>
          <option value="arrow">Arrow</option>
          <option value="triangle">Triangle</option>
        </select>
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