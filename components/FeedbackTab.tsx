
import React from 'react';
import { Submission, Assignment } from '../types';

interface FeedbackTabProps {
  submission?: Submission;
  assignment: Assignment;
}

const FeedbackTab: React.FC<FeedbackTabProps> = ({ submission, assignment }) => {

  if (!submission) {
    return <div className="text-center text-gray-500 py-10">You haven't submitted the assignment yet.</div>;
  }

  if (submission.status !== 'graded' || !submission.feedback) {
    return <div className="text-center text-gray-500 py-10">Your submission is awaiting feedback.</div>;
  }
  
  const { feedback } = submission;
  const totalScore = feedback.scores.reduce((acc, s) => acc + s.score, 0);
  const maxScore = assignment.rubric.reduce((acc, c) => acc + c.maxPoints, 0);

  const getCriterionName = (id: string) => assignment.rubric.find(c => c.id === id)?.name || 'Unknown Criterion';

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Your Feedback</h3>
              <p className="text-gray-600 mt-1 max-w-prose">{feedback.overallComment}</p>
            </div>
            <div className="text-left md:text-right bg-indigo-50 p-4 rounded-lg">
                <span className="text-4xl font-bold text-indigo-600">{totalScore}</span>
                <span className="text-xl text-gray-500"> / {maxScore}</span>
                <p className="text-sm text-indigo-700 font-semibold">Overall Score</p>
            </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
            <h4 className="text-lg font-semibold text-green-800 mb-3">What You Did Well</h4>
            <ul className="space-y-2 list-disc list-inside text-green-700">
                {feedback.strengths.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
        </div>
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-lg">
            <h4 className="text-lg font-semibold text-yellow-800 mb-3">Areas for Improvement</h4>
             <ul className="space-y-2 list-disc list-inside text-yellow-700">
                {feedback.suggestions.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Detailed Analysis</h3>
        <div className="space-y-6">
          {/* Text Analysis */}
          {assignment.requirements.text && feedback.textAnalysis && (
            <div className="bg-white border p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold text-gray-700 mb-2">Text Analysis</h4>
              <p className="text-sm text-gray-600">{feedback.textAnalysis.feedback}</p>
            </div>
          )}
          {/* Image Analysis */}
          {assignment.requirements.image && feedback.imageAnalysis && (
            <div className="bg-white border p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold text-gray-700 mb-3">Image Analysis</h4>
              <div className="space-y-3 text-sm">
                <div>
                  <h5 className="font-semibold text-gray-600">Relevance & Support</h5>
                  <p className="text-gray-600">{feedback.imageAnalysis.relevanceAndSupport}</p>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-600">Contextual Feedback</h5>
                  <p className="text-gray-600">{feedback.imageAnalysis.contextualFeedback}</p>
                </div>
              </div>
              {submission.imageUrls && submission.imageUrls.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <h5 className="text-sm font-semibold text-gray-600 mb-2">Your Images:</h5>
                  <div className="flex flex-wrap gap-2">
                    {submission.imageUrls.map((url, i) => <img key={i} src={url} alt={`submission img ${i}`} className="h-20 w-20 rounded-md border object-cover" />)}
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Audio Analysis */}
          {assignment.requirements.audio && feedback.audioAnalysis && (
            <div className="bg-white border p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold text-gray-700 mb-3">Audio Analysis</h4>
              <div className="space-y-3 text-sm">
                <div>
                  <h5 className="font-semibold text-gray-600">Content Accuracy</h5>
                  <p className="text-gray-600">{feedback.audioAnalysis.contentAccuracy}</p>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-600">Delivery & Pronunciation</h5>
                  <p className="text-gray-600">{feedback.audioAnalysis.deliveryAndPronunciation}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>


      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Score Breakdown</h3>
        <div className="space-y-4">
            {feedback.scores.map((score) => {
                const criterion = assignment.rubric.find(c => c.id === score.criterionId);
                return (
                    <div key={score.criterionId} className="bg-white border p-4 rounded-lg shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                            <h5 className="font-semibold text-gray-800">{getCriterionName(score.criterionId)}</h5>
                            <span className="font-bold text-lg text-indigo-700">{score.score}<span className="text-sm text-gray-500">/{criterion?.maxPoints}</span></span>
                        </div>
                        <p className="text-gray-600 italic border-l-2 border-gray-300 pl-3 text-sm">"{score.justification}"</p>
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};

export default FeedbackTab;