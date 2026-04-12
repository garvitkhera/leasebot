import { useState, useRef } from 'react';
import { Upload, FileText, Trash2, Loader2, CheckCircle } from 'lucide-react';

export default function DocumentManager({ documents, onUpload, onDelete }) {
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setUploadResult(null);

    try {
      const result = await onUpload(file);
      setUploadResult(result);
      setTimeout(() => setUploadResult(null), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-surface-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-surface-200 flex items-center justify-between">
        <h3 className="font-semibold text-sm text-surface-900">Knowledge Base</h3>
        <label
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
            uploading
              ? 'bg-surface-100 text-surface-300'
              : 'bg-brand-600 text-white hover:bg-brand-700 active:scale-95'
          }`}
        >
          {uploading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Upload size={14} />
          )}
          {uploading ? 'Uploading...' : 'Upload'}
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.txt,.md,.docx"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {uploadResult && (
        <div className="mx-4 mt-3 flex items-center gap-2 text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          <CheckCircle size={14} />
          <span>
            Uploaded <strong>{uploadResult.filename}</strong> ({uploadResult.chunk_count} chunks)
          </span>
        </div>
      )}

      {error && (
        <div className="mx-4 mt-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <div className="p-4 space-y-2">
        {documents.length === 0 ? (
          <p className="text-center text-surface-300 text-sm py-4">
            No documents uploaded yet. Upload lease agreements, property rules, or FAQ docs.
          </p>
        ) : (
          documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-surface-50 hover:bg-surface-100 group transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600">
                <FileText size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-surface-900 truncate">
                  {doc.filename}
                </p>
                <p className="text-[11px] text-surface-300">
                  {doc.chunk_count} chunks · {doc.uploaded_at?.slice(0, 10) || 'just now'}
                </p>
              </div>
              <button
                onClick={() => onDelete(doc.id)}
                className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 text-surface-300 hover:text-red-500 transition-all"
                title="Remove document"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
