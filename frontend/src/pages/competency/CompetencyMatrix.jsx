import React, { useState, useEffect } from 'react';
import competencyService from '../../services/competencyService';
import CompetencyHeatmap from '../../components/competency/CompetencyHeatmap';
import CompetencyTable from '../../components/competency/CompetencyTable';
import CompetencyChart from '../../components/competency/CompetencyChart';
import Loader from '../../components/common/Loader';
import { BarChart3, Building, ShieldCheck } from 'lucide-react';

export const CompetencyMatrix = () => {
  const [matrixData, setMatrixData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    competencyService.getCompetencyMatrix()
      .then(res => {
        if (res.data) setMatrixData(res.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader size="large" message="Generating Departmental Competency Matrix..." />;

  const heatmap = matrixData?.heatmap || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-brand-400" />
            <span>Organizational Competency Matrix</span>
          </h1>
          <p className="text-sm text-slate-400">
            Compare required vs current skill competency levels across all organization departments
          </p>
        </div>
      </div>

      <CompetencyHeatmap matrix={heatmap} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CompetencyChart matrix={heatmap} />
        <CompetencyTable matrix={heatmap} />
      </div>
    </div>
  );
};

export default CompetencyMatrix;
