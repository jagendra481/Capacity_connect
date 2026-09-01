import React, { useState, useEffect } from 'react';
import certificateService from '../../services/certificateService';
import CertificateCard from '../../components/certificates/CertificateCard';
import Loader from '../../components/common/Loader';
import { Award, ShieldCheck } from 'lucide-react';

export const Certificates = () => {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    certificateService.getUserCertificates()
      .then(res => {
        if (res.data) setCerts(res.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader size="large" message="Loading digital certificates gallery..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center space-x-2">
            <Award className="w-6 h-6 text-amber-400" />
            <span>Digital Certificates Gallery</span>
          </h1>
          <p className="text-sm text-slate-400">
            Verified credentials earned upon course completion and skill evaluations
          </p>
        </div>
      </div>

      {certs.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
          No certificates earned yet. Complete courses and assessments to generate verified credentials.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certs.map((c) => (
            <CertificateCard key={c.id} certificate={c} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Certificates;
