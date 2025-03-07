import React, { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { WheelSpinner } from './components/WheelSpinner';
import { WheelConfigurator } from './components/WheelConfigurator';
import { SlotMachine } from './components/SlotMachine';
import { SlotConfigurator } from './components/SlotConfigurator';
import { WheelConfig, SpinResult, SlotConfig, SlotResult } from './types';
import { Gift, Dices } from 'lucide-react';
import 'react-tabs/style/react-tabs.css';

const initialWheelConfig: WheelConfig = {
  segments: [
    { id: '1', text: 'Prize 1', color: '#FF6B6B' },
    { id: '2', text: 'Prize 2', color: '#4ECDC4' },
    { id: '3', text: 'Prize 3', color: '#45B7D1' },
    { id: '4', text: 'Prize 4', color: '#96CEB4' },
  ],
  pointerStyle: 'arrow',
  spinDuration: 3000,
};

const initialSlotConfig: SlotConfig = {
  reels: [
    [
      { id: '1', text: '🍎' },
      { id: '2', text: '🍋' },
      { id: '3', text: '🍇' },
    ],
    [
      { id: '4', text: '🍎' },
      { id: '5', text: '🍋' },
      { id: '6', text: '🍇' },
    ],
    [
      { id: '7', text: '🍎' },
      { id: '8', text: '🍋' },
      { id: '9', text: '🍇' },
    ],
  ],
  numReels: 3,
  spinDuration: 3000,
};

function App() {
  const [wheelConfig, setWheelConfig] = useState<WheelConfig>(initialWheelConfig);
  const [slotConfig, setSlotConfig] = useState<SlotConfig>(initialSlotConfig);
  const [wheelResult, setWheelResult] = useState<SpinResult | null>(null);
  const [slotResult, setSlotResult] = useState<SlotResult | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Lucky Games
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Tabs>
          <TabList className="flex gap-4 mb-8">
            <Tab className="flex items-center gap-2 px-6 py-3 bg-white rounded-lg shadow cursor-pointer ui-selected:bg-blue-600 ui-selected:text-white">
              <Gift className="w-5 h-5" />
              Wheel Spinner
            </Tab>
            <Tab className="flex items-center gap-2 px-6 py-3 bg-white rounded-lg shadow cursor-pointer ui-selected:bg-blue-600 ui-selected:text-white">
              <Dices className="w-5 h-5" />
              Slot Machine
            </Tab>
          </TabList>

          <TabPanel>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="flex flex-col items-center space-y-6">
                <WheelSpinner
                  config={wheelConfig}
                  onSpinComplete={setWheelResult}
                />
                {wheelResult && (
                  <div className="p-4 bg-white rounded-lg shadow text-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Result: {wheelResult.segment.text}
                    </h3>
                  </div>
                )}
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <WheelConfigurator
                  config={wheelConfig}
                  onChange={setWheelConfig}
                />
              </div>
            </div>
          </TabPanel>

          <TabPanel>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="flex flex-col items-center space-y-6">
                <SlotMachine
                  config={slotConfig}
                  onSpinComplete={setSlotResult}
                />
                {slotResult && (
                  <div className={`p-4 rounded-lg shadow text-center ${
                    slotResult.isWin ? 'bg-green-100 text-green-800' : 'bg-white text-gray-900'
                  }`}>
                    <h3 className="text-lg font-semibold">
                      {slotResult.isWin ? '🎉 Winner! 🎉' : 'Try Again!'}
                    </h3>
                    <p className="text-2xl mt-2">
                      {slotResult.combination.map(symbol => symbol.text).join(' ')}
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <SlotConfigurator
                  config={slotConfig}
                  onChange={setSlotConfig}
                />
              </div>
            </div>
          </TabPanel>
        </Tabs>
      </main>
    </div>
  );
}

export default App;