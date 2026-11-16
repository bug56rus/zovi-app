// apps/web/app/components/PositionPicker.tsx
'use client';

import { playClick } from '../utils/sound';

const positions = [
  'top-left', 'top-center', 'top-right',
  'center-left', 'center', 'center-right',
  'bottom-left', 'bottom-center', 'bottom-right'
];

export default function PositionPicker({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="grid grid-cols-3 gap-1 w-24 h-24 p-2 bg-black/10 rounded-xl border border-white/20">
        {positions.map((pos) => (
          <button
            key={pos}
            type="button"
            onClick={() => { playClick(); onChange(pos); }}
            className={`rounded-md transition-all ${
              value === pos ? 'bg-indigo-500 scale-110 shadow-lg' : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
      <span className="text-xs opacity-60">Положение текста</span>
    </div>
  );
}