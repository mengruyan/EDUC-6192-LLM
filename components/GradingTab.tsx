
import React, { useState } from 'react';
import { Submission, Assignment } from '../types';

interface GradingTabProps {
  submissions: Submission[];
  assignment: Assignment;
}

const SubmissionDetailModal: React.FC<{ submission: Submission; assignment: Assignment; onClose: () => void }> = ({ submission, assignment, onClose }) => {
    const { feedback } = submission;
    const totalScore = feedback?.scores.reduce((acc, s) => acc + s.score, 0) || 0;
    const maxScore = assignment.rubric.reduce((acc, c) => acc + c.maxPoints, 0);

    const getCriterionName = (id: string) => assignment.rubric.find(c => c.id === id)?.name || 'Unknown Criterion';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 sticky top-0 bg-white border-b z-10">
                    <div className="flex justify-between items-start">
                        <h3 className="text-2xl font-bold text-gray-800">Grading: {submission.studentName}</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
                    </div>
                    <p className="text-sm text-gray-500">Submitted on: {new Date(submission.timestamp).toLocaleString()}</p>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column: Submission Content */}
                        <div className="space-y-6">
                            <h4 className="font-semibold text-xl text-gray-800">Student Submission</h4>
                            {assignment.requirements.text && (
                                <div>
                                    <h5 className="font-semibold text-gray-700 mb-2">Written Response</h5>
                                    <div className="p-4 border rounded-md bg-gray-50 max-h-60 overflow-y-auto">
                                        <p className="text-sm whitespace-pre-wrap">{submission.text}</p>
                                    </div>
                                </div>
                            )}
                            {assignment.requirements.audio && submission.audioUrl && (
                                <div>
                                    <h5 className="font-semibold text-gray-700 mb-2">Audio Recording</h5>
                                    <audio controls src={submission.audioUrl} className="w-full" />
                                </div>
                            )}
                            {assignment.requirements.image && submission.imageUrls && submission.imageUrls.length > 0 && (
                                <div>
                                    <h5 className="font-semibold text-gray-700 mb-2">Uploaded Images</h5>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {submission.imageUrls.map((url, i) => (
                                            <img key={i} src={url} alt={`Submission ${i+1}`} className="rounded-md border object-cover aspect-square" />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {/* Right Column: Feedback */}
                        {feedback ? (
                             <div className="space-y-6">
                                <div className="flex justify-between items-baseline bg-gray-50 p-4 rounded-lg border">
                                    <h4 className="font-semibold text-xl text-gray-800">AI Feedback</h4>
                                    <span className="text-3xl font-bold text-indigo-600">{totalScore} <span className="text-xl text-gray-500">/ {maxScore}</span></span>
                                </div>
                                
                                <div className="space-y-4">
                                    <p className="font-semibold text-indigo-800">Overall: <span className="font-normal">{feedback.overallComment}</span></p>
                                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                                        <h5 className="font-semibold text-green-800">Strengths:</h5>
                                        <ul className="list-disc list-inside text-sm text-green-700">
                                            {feedback.strengths.map((s, i) => <li key={i}>{s}</li>)}
                                        </ul>
                                    </div>
                                     <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                                        <h5 className="font-semibold text-amber-800">Suggestions:</h5>
                                        <ul className="list-disc list-inside text-sm text-amber-700">
                                            {feedback.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                                        </ul>
                                    </div>
                                </div>
                                <div>
                                    <h5 className="font-semibold mb-2 text-gray-700">Score Breakdown:</h5>
                                    <div className="space-y-2 text-sm">
                                        {feedback.scores.map(score => (
                                            <div key={score.criterionId} className="p-3 border bg-gray-50 rounded-md">
                                                <div className="flex justify-between items-center font-bold">{getCriterionName(score.criterionId)} <span>{score.score}/{assignment.rubric.find(c => c.id === score.criterionId)?.maxPoints}</span></div>
                                                <p className="text-gray-600 italic mt-1">"{score.justification}"</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-10">No feedback available for this submission.</p>
                        )}
                    </div>
                </div>
                 <div className="p-4 bg-gray-50 text-right sticky bottom-0 border-t">
                    <button onClick={onClose} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Close</button>
                </div>
            </div>
        </div>
    );
};


const GradingTab: React.FC<GradingTabProps> = ({ submissions, assignment }) => {
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
    
    const relevantSubmissions = submissions.filter(s => s.assignmentId === assignment.id);

    if (relevantSubmissions.length === 0) {
        return <div className="text-center text-gray-500 py-10">No submissions for this assignment yet.</div>;
    }

    return (
        <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Student Submissions for: <span className="font-normal">{assignment.title}</span></h3>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted At</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">View</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {relevantSubmissions.map((sub) => {
                            const totalScore = sub.feedback?.scores.reduce((acc, s) => acc + s.score, 0);
                            const maxScore = assignment.rubric.reduce((acc, c) => acc + c.maxPoints, 0);
                            
                            return (
                                <tr key={sub.studentId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sub.studentName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(sub.timestamp).toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            sub.status === 'graded' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}>{sub.status}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {totalScore !== undefined ? `${totalScore} / ${maxScore}` : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => setSelectedSubmission(sub)} className="text-indigo-600 hover:text-indigo-900">View</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {selectedSubmission && (
                <SubmissionDetailModal 
                    submission={selectedSubmission}
                    assignment={assignment} 
                    onClose={() => setSelectedSubmission(null)} 
                />
            )}
        </div>
    );
};

export default GradingTab;
