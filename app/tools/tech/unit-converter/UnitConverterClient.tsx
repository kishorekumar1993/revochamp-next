// app/tools/unit-converter/UnitConverterClient.tsx
"use client";

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Playfair_Display, Poppins } from 'next/font/google';
import Link from 'next/link';
import {
  Ruler,
  ArrowLeftRight,
  Copy,
  RotateCcw,
  CheckCircle2,
  Weight,
  Thermometer,
  Droplets,
  Maximize2,
  Gauge,
  Clock,
  HardDrive,
} from 'lucide-react';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700', '800'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600'] });

// ----------------------------------------------------------------------------
// Unit Definitions
// ----------------------------------------------------------------------------
interface Unit {
  name: string;
  symbol: string;
  factor: number;    // Conversion factor to base unit
  offset?: number;   // For temperature scales
}

interface Category {
  name: string;
  icon: React.ReactNode;
  baseUnit: string;
  units: Unit[];
}

const categories: Category[] = [
  {
    name: 'Length',
    icon: <Ruler size={18} />,
    baseUnit: 'meter',
    units: [
      { name: 'Millimeter', symbol: 'mm', factor: 0.001 },
      { name: 'Centimeter', symbol: 'cm', factor: 0.01 },
      { name: 'Meter', symbol: 'm', factor: 1 },
      { name: 'Kilometer', symbol: 'km', factor: 1000 },
      { name: 'Inch', symbol: 'in', factor: 0.0254 },
      { name: 'Foot', symbol: 'ft', factor: 0.3048 },
      { name: 'Yard', symbol: 'yd', factor: 0.9144 },
      { name: 'Mile', symbol: 'mi', factor: 1609.344 },
    ],
  },
  {
    name: 'Mass',
    icon: <Weight size={18} />,
    baseUnit: 'gram',
    units: [
      { name: 'Milligram', symbol: 'mg', factor: 0.001 },
      { name: 'Gram', symbol: 'g', factor: 1 },
      { name: 'Kilogram', symbol: 'kg', factor: 1000 },
      { name: 'Ounce', symbol: 'oz', factor: 28.3495 },
      { name: 'Pound', symbol: 'lb', factor: 453.592 },
      { name: 'Stone', symbol: 'st', factor: 6350.29 },
      { name: 'Ton (metric)', symbol: 't', factor: 1_000_000 },
    ],
  },
  {
    name: 'Temperature',
    icon: <Thermometer size={18} />,
    baseUnit: 'celsius',
    units: [
      { name: 'Celsius', symbol: '°C', factor: 1, offset: 0 },
      { name: 'Fahrenheit', symbol: '°F', factor: 5 / 9, offset: -32 },
      { name: 'Kelvin', symbol: 'K', factor: 1, offset: -273.15 },
    ],
  },
  {
    name: 'Volume',
    icon: <Droplets size={18} />,
    baseUnit: 'liter',
    units: [
      { name: 'Milliliter', symbol: 'mL', factor: 0.001 },
      { name: 'Liter', symbol: 'L', factor: 1 },
      { name: 'Cubic Meter', symbol: 'm³', factor: 1000 },
      { name: 'Gallon (US)', symbol: 'gal', factor: 3.78541 },
      { name: 'Quart (US)', symbol: 'qt', factor: 0.946353 },
      { name: 'Pint (US)', symbol: 'pt', factor: 0.473176 },
      { name: 'Cup (US)', symbol: 'cup', factor: 0.236588 },
      { name: 'Fluid Ounce (US)', symbol: 'fl oz', factor: 0.0295735 },
    ],
  },
  {
    name: 'Area',
    icon: <Maximize2 size={18} />,
    baseUnit: 'sqmeter',
    units: [
      { name: 'Square Millimeter', symbol: 'mm²', factor: 0.000001 },
      { name: 'Square Centimeter', symbol: 'cm²', factor: 0.0001 },
      { name: 'Square Meter', symbol: 'm²', factor: 1 },
      { name: 'Hectare', symbol: 'ha', factor: 10000 },
      { name: 'Square Kilometer', symbol: 'km²', factor: 1_000_000 },
      { name: 'Square Inch', symbol: 'in²', factor: 0.00064516 },
      { name: 'Square Foot', symbol: 'ft²', factor: 0.092903 },
      { name: 'Acre', symbol: 'ac', factor: 4046.86 },
      { name: 'Square Mile', symbol: 'mi²', factor: 2_589_988.11 },
    ],
  },
  {
    name: 'Speed',
    icon: <Gauge size={18} />,
    baseUnit: 'mps',
    units: [
      { name: 'Meters per second', symbol: 'm/s', factor: 1 },
      { name: 'Kilometers per hour', symbol: 'km/h', factor: 0.277778 },
      { name: 'Miles per hour', symbol: 'mph', factor: 0.44704 },
      { name: 'Knot', symbol: 'kn', factor: 0.514444 },
      { name: 'Feet per second', symbol: 'ft/s', factor: 0.3048 },
    ],
  },
  {
    name: 'Time',
    icon: <Clock size={18} />,
    baseUnit: 'second',
    units: [
      { name: 'Millisecond', symbol: 'ms', factor: 0.001 },
      { name: 'Second', symbol: 's', factor: 1 },
      { name: 'Minute', symbol: 'min', factor: 60 },
      { name: 'Hour', symbol: 'h', factor: 3600 },
      { name: 'Day', symbol: 'd', factor: 86400 },
      { name: 'Week', symbol: 'wk', factor: 604800 },
      { name: 'Year (365 days)', symbol: 'yr', factor: 31536000 },
    ],
  },
  {
    name: 'Digital Storage',
    icon: <HardDrive size={18} />,
    baseUnit: 'byte',
    units: [
      { name: 'Bit', symbol: 'b', factor: 0.125 },
      { name: 'Byte', symbol: 'B', factor: 1 },
      { name: 'Kilobyte', symbol: 'KB', factor: 1024 },
      { name: 'Megabyte', symbol: 'MB', factor: 1_048_576 },
      { name: 'Gigabyte', symbol: 'GB', factor: 1_073_741_824 },
      { name: 'Terabyte', symbol: 'TB', factor: 1_099_511_627_776 },
      { name: 'Petabyte', symbol: 'PB', factor: 1.125899906842624e15 },
    ],
  },
];

// ----------------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------------
export default function UnitConverterClient() {
  const [selectedCategory, setSelectedCategory] = useState<Category>(categories[0]);
  const [fromUnit, setFromUnit] = useState<Unit>(categories[0].units[2]); // Default: Meter
  const [toUnit, setToUnit] = useState<Unit>(categories[0].units[5]);     // Default: Foot
  const [fromValue, setFromValue] = useState<string>('1');
  const [toValue, setToValue] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState(false);

  // Reset units when category changes
  const handleCategoryChange = (category: Category) => {
    setSelectedCategory(category);
    setFromUnit(category.units[0]);
    setToUnit(category.units[1] || category.units[0]);
  };

  // Conversion logic
  const convert = useCallback((value: number, from: Unit, to: Unit): number => {
    // Handle temperature specially due to offsets
    if (selectedCategory.name === 'Temperature') {
      // Convert from source to Celsius first
      let celsius: number;
      if (from.symbol === '°C') celsius = value;
      else if (from.symbol === '°F') celsius = (value - 32) * (5 / 9);
      else if (from.symbol === 'K') celsius = value - 273.15;
      else celsius = value;

      // Convert from Celsius to target
      if (to.symbol === '°C') return celsius;
      if (to.symbol === '°F') return (celsius * 9 / 5) + 32;
      if (to.symbol === 'K') return celsius + 273.15;
      return celsius;
    }

    // Standard linear conversion
    const baseValue = value * from.factor;
    return baseValue / to.factor;
  }, [selectedCategory]);

  // Update result when inputs change
  useEffect(() => {
    if (fromValue === '' || isNaN(parseFloat(fromValue))) {
      setToValue('');
      return;
    }
    const val = parseFloat(fromValue);
    const result = convert(val, fromUnit, toUnit);
    // Format result nicely
    if (Math.abs(result) < 0.000001 && result !== 0) {
      setToValue(result.toExponential(6));
    } else {
      setToValue(result.toPrecision(10).replace(/\.?0+$/, ''));
    }
  }, [fromValue, fromUnit, toUnit, convert]);

  // Swap units
  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    if (toValue) {
      setFromValue(toValue);
    }
  };

  // Copy result
  const handleCopy = async () => {
    if (!toValue) return;
    try {
      await navigator.clipboard.writeText(toValue);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Reset to defaults for current category
  const handleReset = () => {
    setFromUnit(selectedCategory.units[0]);
    setToUnit(selectedCategory.units[1] || selectedCategory.units[0]);
    setFromValue('1');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/20 via-white to-blue-50/20 text-slate-800">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className={`${playfair.className} text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent`}>
            DevTools
          </Link>
          <span className={`${poppins.className} text-xs text-slate-500`}>Unit Converter</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Ruler size={16} /> Free Utility Tool
          </div>
          <h1 className={`${playfair.className} text-3xl sm:text-5xl font-extrabold text-slate-800 mb-3`}>
            Unit <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Converter</span>
          </h1>
          <p className={`${poppins.className} text-base sm:text-lg text-slate-600 max-w-2xl mx-auto`}>
            Convert between metric and imperial units for length, mass, temperature, volume, and more.
          </p>
        </motion.div>

        {/* Category Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">Select Category</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => handleCategoryChange(cat)}
                className={`p-3 rounded-xl border text-sm font-medium transition-all flex flex-col items-center gap-1 ${
                  selectedCategory.name === cat.name
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {cat.icon}
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Converter Panel */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-center">
            {/* From Unit */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-600">From</label>
              <input
                type="number"
                value={fromValue}
                onChange={(e) => setFromValue(e.target.value)}
                placeholder="Enter value"
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl font-mono text-lg focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={fromUnit.symbol}
                onChange={(e) => {
                  const unit = selectedCategory.units.find(u => u.symbol === e.target.value);
                  if (unit) setFromUnit(unit);
                }}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-700 focus:ring-2 focus:ring-blue-500"
              >
                {selectedCategory.units.map((unit) => (
                  <option key={unit.symbol} value={unit.symbol}>
                    {unit.name} ({unit.symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <button
              onClick={handleSwap}
              className="w-12 h-12 mx-auto rounded-full bg-slate-100 hover:bg-blue-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-blue-600 transition-colors"
              title="Swap units"
            >
              <ArrowLeftRight size={20} />
            </button>

            {/* To Unit */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-600">To</label>
              <div className="relative">
                <input
                  type="text"
                  value={toValue}
                  readOnly
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl font-mono text-lg text-slate-800"
                />
                <button
                  onClick={handleCopy}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-blue-600 transition-colors"
                  title="Copy result"
                >
                  {copySuccess ? <CheckCircle2 size={18} className="text-green-500" /> : <Copy size={18} />}
                </button>
              </div>
              <select
                value={toUnit.symbol}
                onChange={(e) => {
                  const unit = selectedCategory.units.find(u => u.symbol === e.target.value);
                  if (unit) setToUnit(unit);
                }}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-700 focus:ring-2 focus:ring-blue-500"
              >
                {selectedCategory.units.map((unit) => (
                  <option key={unit.symbol} value={unit.symbol}>
                    {unit.name} ({unit.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center mt-6">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm flex items-center gap-2"
            >
              <RotateCcw size={14} /> Reset
            </button>
          </div>
        </div>

        {/* Common Conversions Table */}
        <div className="mt-8 p-5 bg-slate-50 rounded-2xl border border-slate-200">
          <h3 className={`${poppins.className} font-semibold text-slate-800 mb-3`}>Common Conversions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            {selectedCategory.name === 'Length' && (
              <>
                <ConversionItem from="1 inch" to="2.54 cm" />
                <ConversionItem from="1 foot" to="30.48 cm" />
                <ConversionItem from="1 mile" to="1.609 km" />
              </>
            )}
            {selectedCategory.name === 'Mass' && (
              <>
                <ConversionItem from="1 ounce" to="28.35 g" />
                <ConversionItem from="1 pound" to="0.4536 kg" />
                <ConversionItem from="1 stone" to="6.35 kg" />
              </>
            )}
            {selectedCategory.name === 'Temperature' && (
              <>
                <ConversionItem from="0°C" to="32°F" />
                <ConversionItem from="100°C" to="212°F" />
                <ConversionItem from="0 K" to="-273.15°C" />
              </>
            )}
            {selectedCategory.name === 'Volume' && (
              <>
                <ConversionItem from="1 gallon (US)" to="3.785 L" />
                <ConversionItem from="1 cup (US)" to="236.6 mL" />
                <ConversionItem from="1 fl oz (US)" to="29.57 mL" />
              </>
            )}
            {selectedCategory.name === 'Area' && (
              <>
                <ConversionItem from="1 sq foot" to="0.0929 m²" />
                <ConversionItem from="1 acre" to="4047 m²" />
                <ConversionItem from="1 hectare" to="2.471 acres" />
              </>
            )}
            {selectedCategory.name === 'Speed' && (
              <>
                <ConversionItem from="1 mph" to="1.609 km/h" />
                <ConversionItem from="1 m/s" to="3.6 km/h" />
                <ConversionItem from="1 knot" to="1.852 km/h" />
              </>
            )}
            {selectedCategory.name === 'Time' && (
              <>
                <ConversionItem from="1 minute" to="60 seconds" />
                <ConversionItem from="1 hour" to="3600 seconds" />
                <ConversionItem from="1 day" to="86400 seconds" />
              </>
            )}
            {selectedCategory.name === 'Digital Storage' && (
              <>
                <ConversionItem from="1 byte" to="8 bits" />
                <ConversionItem from="1 KB" to="1024 bytes" />
                <ConversionItem from="1 MB" to="1024 KB" />
              </>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 p-5 bg-slate-50 rounded-2xl border border-slate-200">
          <h3 className={`${poppins.className} font-semibold text-slate-800 mb-3`}>Features</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600">
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> 8 measurement categories</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Real‑time conversion</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Swap units with one click</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Copy result to clipboard</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Common conversions reference</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500" /> Works offline (client‑side)</li>
          </ul>
        </div>
      </main>

      <footer className="border-t border-slate-200 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} DevTools. Built for developers.
        </div>
      </footer>
    </div>
  );
}

// Helper component for common conversion items
function ConversionItem({ from, to }: { from: string; to: string }) {
  return (
    <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200">
      <span className="font-mono text-slate-700">{from}</span>
      <span className="text-slate-400">=</span>
      <span className="font-mono text-slate-700">{to}</span>
    </div>
  );
}