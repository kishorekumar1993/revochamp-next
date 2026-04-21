'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Poppins } from 'next/font/google';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600'] });

interface HistoryEntry {
  timestamp: Date;
  heightCm: number;
  weightKg: number;
  waistCm: number;
  age: number;
  gender: string;
  bmi: number;
  category: string;
}

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
}

export default function HistoryPanel({ isOpen, onClose, history, onSelect }: HistoryPanelProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 max-h-[70vh] bg-white rounded-t-3xl shadow-xl z-50 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-xl font-bold text-gray-800 ${poppins.className}`}>📜 History</h3>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">✕</button>
              </div>
              <div className="overflow-y-auto max-h-[60vh]">
                {history.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No history yet. Calculate to save entries.</p>
                ) : (
                  <div className="space-y-2">
                    {history.map((entry, idx) => (
                      <button
                        key={idx}
                        onClick={() => onSelect(entry)}
                        className="w-full text-left p-4 rounded-xl border border-gray-100 hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-gray-800">{formatDate(entry.timestamp)}</p>
                            <p className="text-sm text-gray-500">
                              BMI {entry.bmi.toFixed(1)} • {entry.category} • {entry.weightKg.toFixed(1)} kg
                            </p>
                          </div>
                          <span className="text-blue-600">↻</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}