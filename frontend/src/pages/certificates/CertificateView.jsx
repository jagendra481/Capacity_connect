import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import certificateService from '../../services/certificateService';
import CertificateTemplate from '../../components/certificates/CertificateTemplate';
import Loader from '../../components/common/Loader';

export const CertificateView = () => {
  const { hash } = useParams();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    certificateService.verifyCertificate(hash)
      .then(res => {
        if (res.data?.verified) setCert(res.data.certificate);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [hash]);

  if (loading) return <Loader size="large" message="Verifying certificate cryptography..." />;
  if (!cert) return <div className="p-8 text-center text-slate-400">Certificate not found or hash invalid</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <CertificateTemplate certificate={cert} />
    </div>
  );
};

export default CertificateView;
