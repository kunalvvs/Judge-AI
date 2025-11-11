/**
 * CaseView Component
 * Main case interface with ChatBoxes, JudgePanel, and Timeline
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Scale, AlertCircle } from 'lucide-react';
import ChatBox from '../components/ChatBox';
import JudgePanel from '../components/JudgePanel';
import VerdictTimeline from '../components/VerdictTimeline';
import { getCase, submitArgument, uploadFile, parseDocument, indexDocument, requestVerdict } from '../services/api';

const CaseView = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  
  const [caseData, setCaseData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCase();
  }, [caseId]);

  const loadCase = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getCase(caseId);
      setCaseData(response.data);
    } catch (err) {
      console.error('Failed to load case:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitArgument = async (argumentData) => {
    try {
      await submitArgument(caseId, argumentData);
      await loadCase(); // Reload case data
    } catch (error) {
      throw error;
    }
  };

  const handleUploadFile = async (file, side) => {
    try {
      // Upload file
      const uploadResponse = await uploadFile(file, caseId, side);
      const { fileId, path: filePath } = uploadResponse.data;

      // Parse document
      const parseResponse = await parseDocument(fileId, filePath);
      const { text } = parseResponse.data;

      // Index in vector DB
      await indexDocument(text, {
        id: fileId,
        caseId,
        side,
        fileName: file.name,
        fileType: file.type
      });

      return uploadResponse;
    } catch (error) {
      throw error;
    }
  };

  const handleRequestVerdict = async () => {
    try {
      await requestVerdict(caseId);
      await loadCase(); // Reload case data
    } catch (error) {
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin mx-auto mb-4 w-16 h-16 border-4 border-gray-300 border-t-blue-600 rounded-full" />
          <p className="text-gray-600">Loading case...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="card max-w-md text-center">
          <AlertCircle className="mx-auto mb-4 text-red-600" size={48} />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Case</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const currentVerdict = caseData?.verdicts?.[caseData.verdicts.length - 1] || null;
  const remainingReevaluations = caseData?.maxReevaluations - caseData?.reevaluationCount;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{caseData?.title}</h1>
                <p className="text-sm text-gray-600">{caseData?.description || 'No description'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-gray-500">Status</p>
                <p className="text-sm font-semibold text-green-600 capitalize">{caseData?.status}</p>
              </div>
              <div className="w-10 h-10 bg-judge-DEFAULT rounded-full flex items-center justify-center">
                <Scale size={20} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          {/* Side A */}
          <div className="lg:col-span-3 h-[600px]">
            <ChatBox
              side="A"
              sideName={caseData?.sideA?.name || 'Side A'}
              argumentsList={caseData?.sideA?.arguments || []}
              onSubmitArgument={handleSubmitArgument}
              onUploadFile={(file) => handleUploadFile(file, 'A')}
              disabled={remainingReevaluations <= 0}
            />
          </div>

          {/* Judge Panel */}
          <div className="lg:col-span-6 h-[600px]">
            <JudgePanel
              currentVerdict={currentVerdict}
              remainingReevaluations={remainingReevaluations}
              maxReevaluations={caseData?.maxReevaluations || 5}
              onRequestVerdict={handleRequestVerdict}
              disabled={false}
            />
          </div>

          {/* Side B */}
          <div className="lg:col-span-3 h-[600px]">
            <ChatBox
              side="B"
              sideName={caseData?.sideB?.name || 'Side B'}
              argumentsList={caseData?.sideB?.arguments || []}
              onSubmitArgument={handleSubmitArgument}
              onUploadFile={(file) => handleUploadFile(file, 'B')}
              disabled={remainingReevaluations <= 0}
            />
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-6">
          <VerdictTimeline caseData={caseData} />
        </div>

        {/* Case Info */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card text-center">
            <p className="text-sm text-gray-600 mb-1">Total Arguments</p>
            <p className="text-3xl font-bold text-blue-600">
              {(caseData?.sideA?.arguments?.length || 0) + (caseData?.sideB?.arguments?.length || 0)}
            </p>
          </div>

          <div className="card text-center">
            <p className="text-sm text-gray-600 mb-1">Verdicts Issued</p>
            <p className="text-3xl font-bold text-judge-DEFAULT">
              {caseData?.verdicts?.length || 0}
            </p>
          </div>

          <div className="card text-center">
            <p className="text-sm text-gray-600 mb-1">Re-evaluations Left</p>
            <p className="text-3xl font-bold text-green-600">
              {remainingReevaluations}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CaseView;
