/**
 * HomePage Component
 * Landing page for creating new cases or viewing existing ones
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, Plus, ArrowRight, Clock } from 'lucide-react';
import { startCase, getAllCases } from '../services/api';

const HomePage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sideAName, setSideAName] = useState('Plaintiff');
  const [sideBName, setSideBName] = useState('Defendant');
  const [isCreating, setIsCreating] = useState(false);
  const [recentCases, setRecentCases] = useState([]);
  const [isLoadingCases, setIsLoadingCases] = useState(true);

  useEffect(() => {
    loadRecentCases();
  }, []);

  const loadRecentCases = async () => {
    try {
      const response = await getAllCases();
      setRecentCases(response.data || []);
    } catch (error) {
      console.error('Failed to load cases:', error);
    } finally {
      setIsLoadingCases(false);
    }
  };

  const handleCreateCase = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Please enter a case title');
      return;
    }

    setIsCreating(true);
    try {
      const response = await startCase({
        title: title.trim(),
        description: description.trim(),
        sideAName: sideAName.trim(),
        sideBName: sideBName.trim()
      });

      const caseId = response.data.id;
      navigate(`/case/${caseId}`);
    } catch (error) {
      console.error('Failed to create case:', error);
      alert('Failed to create case: ' + error.message);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-judge-DEFAULT rounded-full flex items-center justify-center">
              <Scale size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Judge</h1>
              <p className="text-sm text-gray-600">Intelligent Dispute Resolution System</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create New Case */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Plus size={24} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Create New Case</h2>
            </div>

            <form onSubmit={handleCreateCase} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Case Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Contract Dispute Between ABC Corp and XYZ Ltd"
                  className="input-field"
                  required
                  maxLength={200}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Case Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the case (optional)"
                  className="textarea-field"
                  rows="3"
                  maxLength={1000}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Side A Name
                  </label>
                  <input
                    type="text"
                    value={sideAName}
                    onChange={(e) => setSideAName(e.target.value)}
                    placeholder="Plaintiff"
                    className="input-field"
                    maxLength={50}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Side B Name
                  </label>
                  <input
                    type="text"
                    value={sideBName}
                    onChange={(e) => setSideBName(e.target.value)}
                    placeholder="Defendant"
                    className="input-field"
                    maxLength={50}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isCreating}
                className="w-full btn-primary bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                <span>{isCreating ? 'Creating...' : 'Create Case'}</span>
              </button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">How It Works</h3>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Create a new case with a descriptive title</li>
                <li>Both sides present arguments and upload evidence</li>
                <li>Request AI verdict based on presented arguments</li>
                <li>Re-evaluate up to 5 times with new arguments</li>
              </ol>
            </div>
          </div>

          {/* Recent Cases */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <Clock size={24} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Recent Cases</h2>
            </div>

            {isLoadingCases ? (
              <div className="text-center py-12 text-gray-400">
                <div className="animate-spin mx-auto mb-4 w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full" />
                <p>Loading cases...</p>
              </div>
            ) : recentCases.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Scale className="mx-auto mb-4" size={48} />
                <p>No cases yet</p>
                <p className="text-sm">Create your first case to get started</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {recentCases.map((caseItem) => (
                  <div
                    key={caseItem.id}
                    onClick={() => navigate(`/case/${caseItem.id}`)}
                    className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {caseItem.title}
                        </h3>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>
                            {new Date(caseItem.createdAt).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <span>
                            Round {caseItem.reevaluationCount}
                          </span>
                          {caseItem.latestVerdict && (
                            <>
                              <span>•</span>
                              <span className="font-semibold">
                                {caseItem.latestVerdict.decision}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="text-gray-400 group-hover:text-blue-600 transition-colors" size={20} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Scale size={32} className="text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">AI-Powered Analysis</h3>
            <p className="text-sm text-gray-600">
              Advanced LLM technology analyzes arguments from both sides to provide fair verdicts
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus size={32} className="text-green-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Document Support</h3>
            <p className="text-sm text-gray-600">
              Upload PDF and DOCX files as evidence. RAG technology ensures context is considered
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock size={32} className="text-yellow-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Re-evaluation System</h3>
            <p className="text-sm text-gray-600">
              Not satisfied? Request up to 5 re-evaluations with additional arguments
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-gray-200 bg-white">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>© 2025 AI Judge - Intelligent Dispute Resolution System</p>
          <p className="mt-1">Built with React, Node.js, and Gemini AI</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
