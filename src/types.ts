export interface WheelSegment {
  id: string;
  text: string;
  color: string;
  imageUrl?: string;
}

export interface WheelConfig {
  segments: WheelSegment[];
  pointerStyle: 'classic' | 'arrow' | 'triangle';
  spinDuration: number;
  backgroundImage?: string;
}

export interface SpinResult {
  segmentIndex: number;
  segment: WheelSegment;
}

export interface SlotSymbol {
  id: string;
  text: string;
  imageUrl?: string;
}

export interface SlotConfig {
  reels: SlotSymbol[][];
  numReels: number;
  spinDuration: number;
  backgroundImage?: string;
}

export interface SlotResult {
  combination: SlotSymbol[];
  isWin: boolean;
}