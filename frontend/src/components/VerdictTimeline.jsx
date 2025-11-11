/**
 * VerdictTimeline Component
 * Shows the complete history of arguments and verdicts
 */

import { MessageSquare, Scale, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const VerdictTimeline = ({ caseData }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!caseData) return null;

  // Combine and sort all events (arguments and verdicts) chronologically
  const events = [];

  // Add Side A arguments
  caseData.sideA?.arguments?.forEach(arg => {
    events.push({
      type: 'argument',
      side: 'A',
      sideName: caseData.sideA.name,
      timestamp: arg.timestamp,
      data: arg
    });
  });

  // Add Side B arguments
  caseData.sideB?.arguments?.forEach(arg => {
    events.push({
      type: 'argument',
      side: 'B',
      sideName: caseData.sideB.name,
      timestamp: arg.timestamp,
      data: arg
    });
  });

  // Add verdicts
  caseData.verdicts?.forEach(verdict => {
    events.push({
      type: 'verdict',
      timestamp: verdict.timestamp,
      data: verdict
    });
  });

  // Sort by timestamp
  events.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  return (
    <div className="card">
      {/* Header */}
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-xl font-bold text-gray-800">Case Timeline</h3>
        <button className="text-gray-600 hover:text-gray-800">
          {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </button>
      </div>

      {/* Timeline */}
      {isExpanded && (
        <div className="mt-6 space-y-6">
          {events.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>No events yet</p>
              <p className="text-sm">Arguments and verdicts will appear here</p>
            </div>
          ) : (
            events.map((event, index) => (
              <div key={index} className="relative pl-8 pb-6 border-l-2 border-gray-300 last:border-l-0 last:pb-0">
                {/* Timeline dot */}
                <div className={`absolute -left-3 top-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  event.type === 'verdict' 
                    ? 'bg-judge-DEFAULT border-judge-dark' 
                    : event.side === 'A' 
                      ? 'bg-blue-500 border-blue-700' 
                      : 'bg-green-500 border-green-700'
                }`}>
                  {event.type === 'verdict' ? (
                    <Scale size={14} className="text-white" />
                  ) : (
                    <MessageSquare size={14} className="text-white" />
                  )}
                </div>

                {/* Event content */}
                {event.type === 'argument' ? (
                  <div className={`bg-gradient-to-r ${
                    event.side === 'A' 
                      ? 'from-blue-50 to-white' 
                      : 'from-green-50 to-white'
                  } rounded-lg p-4 shadow-sm`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-semibold ${
                        event.side === 'A' ? 'text-blue-700' : 'text-green-700'
                      }`}>
                        {event.sideName} • Round {event.data.round}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(event.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {event.data.text}
                    </p>
                    {event.data.documentIds && event.data.documentIds.length > 0 && (
                      <div className="mt-2 text-xs text-gray-500">
                        📎 {event.data.documentIds.length} document(s) attached
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-yellow-50 to-white rounded-lg p-4 shadow-md border-2 border-judge-DEFAULT">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-lg text-judge-dark">
                        🏛️ Verdict - Round {event.data.round}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(event.timestamp).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div className="bg-white rounded p-3 text-center">
                        <p className="text-xs text-gray-600 mb-1">Decision</p>
                        <p className="font-bold text-gray-900">{event.data.decision}</p>
                      </div>
                      <div className="bg-white rounded p-3 text-center">
                        <p className="text-xs text-gray-600 mb-1">Confidence</p>
                        <p className="font-bold text-gray-900">{event.data.confidence}%</p>
                      </div>
                    </div>

                    <div className="bg-white rounded p-3">
                      <p className="text-xs font-semibold text-gray-700 mb-1">Reasoning:</p>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {event.data.reasoning}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Case Summary */}
      {events.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {caseData.sideA?.arguments?.length || 0}
              </p>
              <p className="text-xs text-gray-600">Side A Arguments</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-judge-DEFAULT">
                {caseData.verdicts?.length || 0}
              </p>
              <p className="text-xs text-gray-600">Verdicts</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {caseData.sideB?.arguments?.length || 0}
              </p>
              <p className="text-xs text-gray-600">Side B Arguments</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerdictTimeline;
