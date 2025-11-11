/**
 * ChatBox Component
 * Handles text input and file uploads for each side
 */

import { useState, useRef } from 'react';
import { Upload, Send, FileText, X } from 'lucide-react';

const ChatBox = ({ 
  side, 
  sideName, 
  onSubmitArgument, 
  onUploadFile,
  disabled = false,
  argumentsList = []
}) => {
  const [text, setText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert('Only PDF and DOCX files are allowed');
        return;
      }

      // Validate file size (10MB max)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('File size must be less than 10MB');
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!text.trim() && !selectedFile) {
      alert('Please enter text or select a file');
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload file first if selected
      let documentIds = [];
      if (selectedFile) {
        const uploadResult = await onUploadFile(selectedFile);
        documentIds = [uploadResult.data.fileId];
      }

      // Submit argument
      await onSubmitArgument({
        side,
        text: text.trim(),
        documentIds
      });

      // Clear form
      setText('');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to submit argument: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sideColor = side === 'A' ? 'blue' : 'green';

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={`bg-${sideColor}-600 text-white px-4 py-3 rounded-t-lg`}>
        <h2 className="text-xl font-bold">{sideName}</h2>
        <p className="text-sm opacity-90">Side {side}</p>
      </div>

      {/* Arguments History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
        {argumentsList.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <p>No arguments yet</p>
            <p className="text-sm">Submit your first argument below</p>
          </div>
        ) : (
          argumentsList.map((arg, index) => (
            <div
              key={arg.id}
              className="bg-gray-50 rounded-lg p-3 border border-gray-200 animate-slideIn"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500">
                  Round {arg.round}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(arg.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{arg.text}</p>
              {arg.documentIds && arg.documentIds.length > 0 && (
                <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                  <FileText size={14} />
                  <span>{arg.documentIds.length} document(s) attached</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white p-4 space-y-3">
        {/* File Upload */}
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileSelect}
            className="hidden"
            disabled={disabled || isSubmitting}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isSubmitting}
            className="btn-secondary flex items-center gap-2"
          >
            <Upload size={18} />
            <span>Upload File</span>
          </button>
          
          {selectedFile && (
            <div className="flex-1 flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
              <FileText size={16} className="text-gray-600" />
              <span className="text-sm flex-1 truncate">{selectedFile.name}</span>
              <button
                onClick={handleRemoveFile}
                className="text-gray-500 hover:text-red-600"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Text Input */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Enter ${sideName}'s argument...`}
          className="textarea-field"
          rows="4"
          disabled={disabled || isSubmitting}
          maxLength={5000}
        />

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {text.length} / 5000 characters
          </span>
          <button
            onClick={handleSubmit}
            disabled={disabled || isSubmitting || (!text.trim() && !selectedFile)}
            className={`btn-primary flex items-center gap-2 bg-${sideColor}-600 hover:bg-${sideColor}-700`}
          >
            <Send size={18} />
            <span>{isSubmitting ? 'Submitting...' : 'Submit Argument'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
