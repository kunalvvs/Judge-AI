/**
 * JudgePanel Component
 * Central panel displaying AI judge and verdict information
 */

import { useState } from 'react';
import { Scale, RefreshCw, AlertCircle, CheckCircle, MinusCircle } from 'lucide-react';

const JudgePanel = ({
  currentVerdict,
  onRequestVerdict,
  remainingReevaluations,
  maxReevaluations,
  isLoading = false,
  disabled = false
}) => {
  const [isRequesting, setIsRequesting] = useState(false);

  const handleRequestVerdict = async () => {
    setIsRequesting(true);
    try {
      await onRequestVerdict();
    } catch (error) {
      console.error('Verdict request error:', error);
      alert('Failed to request verdict: ' + error.message);
    } finally {
      setIsRequesting(false);
    }
  };

  const getDecisionIcon = (decision) => {
    switch (decision) {
      case 'Side A':
        return <CheckCircle className="text-blue-600" size={24} />;
      case 'Side B':
        return <CheckCircle className="text-green-600" size={24} />;
      case 'Neutral':
        return <MinusCircle className="text-yellow-600" size={24} />;
      default:
        return <AlertCircle className="text-gray-600" size={24} />;
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'bg-green-500';
    if (confidence >= 60) return 'bg-yellow-500';
    if (confidence >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const canReevaluate = remainingReevaluations > 0 && !disabled;

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-judge-light to-white rounded-lg shadow-lg">
      {/* Judge Avatar */}
      <div className="flex flex-col items-center justify-center p-6 border-b border-judge-DEFAULT">
        <div className="relative">
          <div className="w-32 h-32 bg-judge-DEFAULT rounded-full flex items-center justify-center shadow-xl animate-pulse-slow">
            <Scale size={64} className="text-white" />
          </div>
          {isRequesting && (
            <div className="absolute inset-0 flex items-center justify-center">
              <RefreshCw className="animate-spin text-white" size={32} />
            </div>
          )}
        </div>
        <h2 className="mt-4 text-2xl font-bold text-gray-800">AI Judge</h2>
        <p className="text-sm text-gray-600">Impartial Decision Maker</p>
      </div>

      {/* Verdict Display */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {!currentVerdict ? (
          <div className="text-center py-12">
            <Scale className="mx-auto mb-4 text-gray-300" size={48} />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No Verdict Yet
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Both sides should present their arguments before requesting a verdict
            </p>
          </div>
        ) : (
          <div className="space-y-4 animate-slideIn">
            {/* Decision Card */}
            <div className="card border-2 border-judge-DEFAULT">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-800">Current Verdict</h3>
                {getDecisionIcon(currentVerdict.decision)}
              </div>
              
              <div className="text-center py-4 bg-gray-50 rounded-lg mb-4">
                <p className="text-sm text-gray-600 mb-1">Decision</p>
                <p className="text-2xl font-bold text-gray-900">
                  {currentVerdict.decision}
                </p>
              </div>

              {/* Confidence Score */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">
                    Confidence
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {currentVerdict.confidence}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${getConfidenceColor(currentVerdict.confidence)}`}
                    style={{ width: `${currentVerdict.confidence}%` }}
                  />
                </div>
              </div>

              {/* Round Info */}
              <div className="text-xs text-gray-500 text-right">
                Round {currentVerdict.round} • {new Date(currentVerdict.timestamp).toLocaleString()}
              </div>
            </div>

            {/* Reasoning */}
            <div className="card">
              <h4 className="text-md font-semibold text-gray-800 mb-2">
                Reasoning
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {currentVerdict.reasoning}
              </p>
            </div>

            {/* Key Points */}
            {currentVerdict.keyPoints && currentVerdict.keyPoints.length > 0 && (
              <div className="card">
                <h4 className="text-md font-semibold text-gray-800 mb-3">
                  Key Points
                </h4>
                <ul className="space-y-2">
                  {currentVerdict.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-judge-DEFAULT mt-1">•</span>
                      <span className="text-sm text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggestions */}
            {currentVerdict.suggestions && (
              <div className="card bg-blue-50 border-blue-200">
                <h4 className="text-md font-semibold text-blue-900 mb-2">
                  Suggestions
                </h4>
                <p className="text-sm text-blue-800">
                  {currentVerdict.suggestions}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Re-evaluation Section */}
      <div className="border-t border-gray-200 p-6 bg-white rounded-b-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-gray-700">
              Re-evaluations Remaining
            </p>
            <p className="text-xs text-gray-500">
              {remainingReevaluations} of {maxReevaluations} available
            </p>
          </div>
          <div className="text-2xl font-bold text-judge-DEFAULT">
            {remainingReevaluations}
          </div>
        </div>

        <button
          onClick={handleRequestVerdict}
          disabled={!canReevaluate || isRequesting}
          className="w-full btn-primary bg-judge-DEFAULT hover:bg-judge-dark flex items-center justify-center gap-2"
        >
          <RefreshCw size={18} className={isRequesting ? 'animate-spin' : ''} />
          <span>
            {isRequesting 
              ? 'Evaluating...' 
              : currentVerdict 
                ? 'Re-evaluate Case' 
                : 'Request Verdict'}
          </span>
        </button>

        {!canReevaluate && remainingReevaluations === 0 && (
          <p className="text-xs text-red-600 text-center mt-2">
            Maximum re-evaluations reached
          </p>
        )}
      </div>
    </div>
  );
};

export default JudgePanel;
