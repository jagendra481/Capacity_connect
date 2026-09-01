import React, { useState } from 'react';
import { Calculator, DollarSign, TrendingUp } from 'lucide-react';
import capacityRadarService from '../../services/capacityRadarService';

export const ROICalculator = () => {
  const [trainees, setTrainees] = useState(25);
  const [cost, setCost] = useState(6000);
  const [rate, setRate] = useState(50);
  const [hours, setHours] = useState(15);

  const [roiResult, setRoiResult] = useState({
    annualProductivityGain: 225000,
    netReturn: 219000,
    roiPercentage: 3650,
    paybackPeriodMonths: '0.3',
  });

  const handleCalculate = async (e) => {
    e.preventDefault();
    const res = await capacityRadarService.calculateROI({
      traineesCount: parseInt(trainees),
      trainingCost: parseInt(cost),
      avgHourlyRate: parseInt(rate),
      hoursSavedPerMonth: parseInt(hours),
    });
    if (res.data) setRoiResult(res.data);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
          <Calculator className="w-5 h-5 text-emerald-400" />
          <span>Training Impact & Financial ROI Calculator</span>
        </h3>
      </div>

      <form onSubmit={handleCalculate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-400">Trainees Enrolled</label>
          <input
            type="number"
            value={trainees}
            onChange={(e) => setTrainees(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-400">Training Program Cost ($)</label>
          <input
            type="number"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-400">Avg Hourly Rate ($)</label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-slate-400">Hours Saved / Trainee / Mo</label>
          <input
            type="number"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100"
          />
        </div>

        <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center space-x-1.5"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Recalculate Financial ROI</span>
          </button>
        </div>
      </form>

      {/* Results Box */}
      <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-semibold text-slate-400">Est Annual Value Gain</span>
          <p className="text-2xl font-extrabold text-emerald-400">${roiResult.annualProductivityGain?.toLocaleString()}</p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] uppercase font-semibold text-slate-400">Net Financial Return</span>
          <p className="text-2xl font-extrabold text-brand-400">${roiResult.netReturn?.toLocaleString()}</p>
        </div>

        <div className="space-y-1">
          <span className="text-[10px] uppercase font-semibold text-slate-400">ROI Percentage</span>
          <p className="text-2xl font-extrabold text-purple-400">{roiResult.roiPercentage}%</p>
        </div>
      </div>
    </div>
  );
};

export default ROICalculator;
