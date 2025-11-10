
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Assignment, Submission } from '../types';
import { generateFeedback } from '../services/geminiService';
import { TrashIcon } from './Icons';

interface SubmissionTabProps {
  assignment: Assignment;
  existingSubmission?: Submission;
  onNewSubmission: (submission: Submission) => void;
  studentId: string;
  studentName: string;
}

const SubmissionTab: React.FC<SubmissionTabProps> = ({ assignment, existingSubmission, onNewSubmission, studentId, studentName }) => {
  const [text, setText] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | undefined>();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    setText(existingSubmission?.text || '');
    setImageUrls(existingSubmission?.imageUrls || []);
    setAudioUrl(existingSubmission?.audioUrl);
  }, [existingSubmission])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImageUrls(prev => [...prev, event.target?.result as string]);
            };
            reader.readAsDataURL(file);
        })
    }
  };

  const deleteImage = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  }
  
  const deleteAudio = () => {
    setAudioUrl(undefined);
    if(audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      // The event from ondataavailable provides a blob of audio data.
      // We rely on type inference for the event parameter and check blob size to be robust.
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop()); // Release microphone
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = useCallback(async () => {
    setIsProcessing(true);
    setError(null);

    const newSubmission: Submission = {
      assignmentId: assignment.id,
      studentId,
      studentName,
      timestamp: Date.now(),
      text,
      audioUrl,
      imageUrls,
      status: 'submitted',
    };

    try {
      const feedback = await generateFeedback(assignment, newSubmission);
      newSubmission.feedback = feedback;
      newSubmission.status = 'graded';
      onNewSubmission(newSubmission);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred during grading.');
      newSubmission.status = 'submitted'; // Mark as submitted even if grading fails
      onNewSubmission(newSubmission); // Save submission without feedback
    } finally {
      setIsProcessing(false);
    }
  }, [assignment, studentId, studentName, text, audioUrl, imageUrls, onNewSubmission]);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">Your Submission for: <span className="font-normal">{assignment.title}</span></h3>
      
      {assignment.requirements.text && (
        <div>
          <label htmlFor="text-submission" className="block text-sm font-medium text-gray-700">Written Response (in Chinese)</label>
          <textarea
            id="text-submission"
            rows={10}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="请在此处输入您的书面答复..."
          />
        </div>
      )}

      {assignment.requirements.audio && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Audio Summary</label>
          <div className="mt-1 flex items-center space-x-4 p-4 border border-gray-300 rounded-md bg-gray-50">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`px-4 py-2 text-sm font-medium rounded-md text-white shadow-sm transition-colors ${
                isRecording ? 'bg-red-600 hover:bg-red-700 w-[140px]' : 'bg-indigo-600 hover:bg-indigo-700 w-[140px]'
              }`}
            >
              {isRecording ? (
                  <span className="flex items-center justify-center">
                      <span className="animate-pulse mr-2 h-2 w-2 bg-white rounded-full"></span>
                      Recording...
                  </span>
              ) : 'Start Recording'}
            </button>
            {audioUrl && (
              <div className="flex items-center gap-2 flex-grow">
                 <audio controls src={audioUrl} className="flex-grow"/>
                 <button onClick={deleteAudio} className="p-2 text-red-500 hover:bg-red-100 rounded-full" aria-label="Delete recording">
                   <TrashIcon/>
                 </button>
              </div>
            )}
          </div>
        </div>
      )}

      {assignment.requirements.image && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Image(s)</label>
          <div className="mt-1 p-4 border border-gray-300 rounded-md bg-gray-50">
            <input type="file" accept="image/*" onChange={handleImageUpload} multiple className="text-sm block w-full text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"/>
            {imageUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img src={url} alt={`Preview ${index+1}`} className="rounded-md border object-cover aspect-square" />
                    <button 
                      onClick={() => deleteImage(index)} 
                      className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label={`Delete image ${index+1}`}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {error && <div className="p-4 bg-red-100 text-red-800 rounded-md text-sm">{error}</div>}
      
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={isProcessing}
          className="px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-wait"
        >
          {isProcessing ? 'Grading...' : 'Submit for Feedback'}
        </button>
      </div>
    </div>
  );
};

export default SubmissionTab;
