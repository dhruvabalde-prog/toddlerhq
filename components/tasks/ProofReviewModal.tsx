'use client';

import React, { useState } from 'react';
import { useToddlerHQ } from '@/lib/store';
import { Task } from '@/types/toddlerhq';
import { X, CheckCircle2, RotateCcw, ShieldAlert, Upload, FileText, Check } from 'lucide-react';

interface ProofReviewModalProps {
  task: Task | null;
  onClose: () => void;
}

export const ProofReviewModal: React.FC<ProofReviewModalProps> = ({ task, onClose }) => {
  const { currentUser, verifyTask, transitionTaskStatus, attachProofToTask } = useToddlerHQ();
  const [newProofUrl, setNewProofUrl] = useState('');
  const [proofNote, setProofNote] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; error?: boolean } | null>(null);

  if (!task) return null;

  const canVerify = ['founder', 'center_head', 'academic_lead'].includes(currentUser.role);

  const handleVerify = () => {
    const res = verifyTask(task.id);
    if (res.success) {
      setFeedbackMsg({ text: 'Task successfully verified and closed!' });
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setFeedbackMsg({ text: res.error || 'Verification failed', error: true });
    }
  };

  const handleRework = () => {
    const res = transitionTaskStatus(task.id, 'in_progress');
    if (res.success) {
      setFeedbackMsg({ text: 'Task returned to In-Progress for rework.' });
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setFeedbackMsg({ text: res.error || 'Could not send back for rework', error: true });
    }
  };

  const handleUploadSampleProof = (sampleType: 'eva' | 'grill' | 'police' | 'fire') => {
    setIsUploading(true);
    let sampleUrl = 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=600&auto=format&fit=crop&q=80';
    let note = 'Photo of completed childproof installation with measurement tape verifying compliance.';

    if (sampleType === 'grill') {
      sampleUrl = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80';
      note = 'Window grill gaps checked at 8.5cm (<10cm limit) and nylon safety netting anchored.';
    } else if (sampleType === 'police') {
      sampleUrl = 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80';
      note = 'Indiranagar ACP jurisdiction stamped background clearance letters.';
    } else if (sampleType === 'fire') {
      sampleUrl = 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?w=600&auto=format&fit=crop&q=80';
      note = 'Fire Extinguisher ABC 4kg mounted with pressure gauge in green zone.';
    }

    setTimeout(() => {
      attachProofToTask(task.id, sampleUrl, note);
      setIsUploading(false);
      setFeedbackMsg({ text: 'Proof image attached and archived to Google Drive!' });
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-amber-100 text-amber-800 text-[10px] font-bold uppercase">
                {task.department}
              </span>
              <h3 className="text-base font-bold text-slate-900 truncate max-w-md">
                Safety Proof &amp; Verification Review
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Task: {task.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Proof Evidence Display */}
          <div>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-2">
              Photographic / Document Evidence
            </span>

            {task.proof_image_url ? (
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-sm relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={task.proof_image_url}
                  alt="Proof of completion"
                  className="w-full h-64 object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                  <p className="text-xs font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Archived in Google Drive: /PreschoolOS/Indiranagar/Compliance/
                  </p>
                  {task.proof_notes && (
                    <p className="text-xs text-slate-300 mt-1">{task.proof_notes}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-amber-300 rounded-xl p-6 text-center bg-amber-50/50">
                <ShieldAlert className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-800">No Proof Attached Yet</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  This task requires photographic proof before leadership can sign off. Upload or attach a simulated site proof below:
                </p>

                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => handleUploadSampleProof('eva')}
                    disabled={isUploading}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
                  >
                    Attach Foam Flooring Proof
                  </button>
                  <button
                    onClick={() => handleUploadSampleProof('grill')}
                    disabled={isUploading}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
                  >
                    Attach Window Grill Proof
                  </button>
                  <button
                    onClick={() => handleUploadSampleProof('police')}
                    disabled={isUploading}
                    className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
                  >
                    Attach Police Clearance Doc
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick upload alternative if already attached */}
          {task.proof_image_url && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-600 font-medium">Want to replace with another proof file?</span>
              <button
                onClick={() => handleUploadSampleProof('grill')}
                disabled={isUploading}
                className="text-xs font-bold text-slate-700 hover:text-slate-900 inline-flex items-center gap-1"
              >
                <Upload className="w-3.5 h-3.5" /> Replace File
              </button>
            </div>
          )}

          {/* SOP Steps Review */}
          {task.sop_steps && task.sop_steps.length > 0 && (
            <div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-2">
                Prescribed SOP Checklist Compliance
              </span>
              <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                {task.sop_steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Feedback message */}
          {feedbackMsg && (
            <div
              className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                feedbackMsg.error
                  ? 'bg-rose-50 text-rose-800 border border-rose-200'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{feedbackMsg.text}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {canVerify ? (
              <span className="font-medium text-emerald-700">
                You have leadership sign-off authority as {currentUser.designation}.
              </span>
            ) : (
              <span className="text-amber-700">
                View-only: Only Founder, Center Head, or Academic Lead can sign off.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRework}
              className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Request Rework</span>
            </button>

            {canVerify && (
              <button
                onClick={handleVerify}
                disabled={!task.proof_image_url}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify &amp; Close Task</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
