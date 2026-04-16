import { useState } from 'react';
import { useChecklistStore } from '../store/checklistStore';

export function WeightModal() {
  const { weightModalOpen, setWeight, setIsAdult, isAdult, closeWeightModal } = useChecklistStore();
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  if (!weightModalOpen) return null;

  const handleSubmit = () => {
    const val = parseFloat(input);
    if (isNaN(val) || val <= 0 || val > 300) {
      setError('הכנס משקל תקין (1-300 ק"ג)');
      return;
    }
    setWeight(val);
    closeWeightModal();
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 w-full max-w-sm mx-4 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
            🏥
          </div>
          <h1 className="text-2xl font-bold text-white">רשימת תיוג - אינטובציה</h1>
          <p className="text-slate-400 text-sm mt-1">הדסה | {new Date().toLocaleDateString('he-IL')}</p>
        </div>

        {/* Patient type toggle */}
        <div className="flex bg-slate-800 rounded-2xl p-1 mb-6">
          <button
            onClick={() => setIsAdult(true)}
            className={`flex-1 py-3 rounded-xl text-base font-semibold transition-all ${
              isAdult ? 'bg-blue-600 text-white shadow' : 'text-slate-400'
            }`}
          >
            מבוגר
          </button>
          <button
            onClick={() => setIsAdult(false)}
            className={`flex-1 py-3 rounded-xl text-base font-semibold transition-all ${
              !isAdult ? 'bg-purple-600 text-white shadow' : 'text-slate-400'
            }`}
          >
            ילד
          </button>
        </div>

        {/* Weight input */}
        <label className="block text-slate-300 text-sm font-medium mb-2">משקל מטופל (ק"ג)</label>
        <input
          type="number"
          inputMode="decimal"
          placeholder='הכנס משקל...'
          value={input}
          onChange={e => { setInput(e.target.value); setError(''); }}
          onKeyDown={handleKey}
          autoFocus
          className="w-full bg-slate-800 border border-slate-600 text-white text-2xl font-bold text-center rounded-2xl px-4 py-4 outline-none focus:border-blue-500 transition placeholder:text-slate-600"
        />
        {error && <p className="text-rose-400 text-sm mt-2 text-center">{error}</p>}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xl font-bold py-4 rounded-2xl transition-all"
        >
          התחל צ'קליסט
        </button>
      </div>
    </div>
  );
}
