
import React, { useState, useMemo, useEffect } from 'react';
import { Assignment, Submission, User } from '../types';
import AssignmentTab from './AssignmentTab';
import SubmissionTab from './SubmissionTab';
import FeedbackTab from './FeedbackTab';
import { AssignmentIcon, SubmissionIcon, FeedbackIcon } from './Icons';

type StudentTab = 'Assignment' | 'Submission' | 'Feedback';

interface StudentViewProps {
  currentUser: User;
  assignments: Assignment[];
  submissions: Submission[];
  updateSubmissions: (submissions: Submission[]) => void;
}

const StudentView: React.FC<StudentViewProps> = ({ currentUser, assignments, submissions, updateSubmissions }) => {
  const [activeTab, setActiveTab] = useState<StudentTab>('Assignment');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(assignments[0]?.id || null);

  useEffect(() => {
    if (!selectedAssignmentId && assignments.length > 0) {
      setSelectedAssignmentId(assignments[0].id);
    }
  }, [assignments, selectedAssignmentId]);

  const activeAssignment = useMemo(() => 
    assignments.find(a => a.id === selectedAssignmentId),
    [assignments, selectedAssignmentId]
  );

  const studentSubmission = useMemo(() => 
    submissions.find(sub => sub.studentId === currentUser.id && sub.assignmentId === selectedAssignmentId),
    [submissions, selectedAssignmentId, currentUser.id]
  );

  const handleNewSubmission = (submission: Submission) => {
    const otherSubmissions = submissions.filter(s => !(s.studentId === currentUser.id && s.assignmentId === selectedAssignmentId));
    const newSubmissions = [...otherSubmissions, submission];
    updateSubmissions(newSubmissions);
    setActiveTab('Feedback');
  }

  const renderTabContent = () => {
    if (!activeAssignment) {
      return <div className="text-center text-gray-500 py-10">No assignment selected or available.</div>;
    }
    switch (activeTab) {
      case 'Assignment':
        return <AssignmentTab assignment={activeAssignment} />;
      case 'Submission':
        return <SubmissionTab 
                    assignment={activeAssignment} 
                    existingSubmission={studentSubmission}
                    onNewSubmission={handleNewSubmission} 
                    studentId={currentUser.id}
                    studentName={currentUser.name}
                />;
      case 'Feedback':
        return <FeedbackTab submission={studentSubmission} assignment={activeAssignment}/>;
      default:
        return null;
    }
  };

  const tabs: { name: StudentTab; icon: React.ReactElement; disabled?: boolean }[] = [
    { name: 'Assignment', icon: <AssignmentIcon /> },
    { name: 'Submission', icon: <SubmissionIcon /> },
    { name: 'Feedback', icon: <FeedbackIcon />, disabled: !studentSubmission || studentSubmission.status !== 'graded' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
            <h2 className="text-3xl font-bold text-gray-800">Student Portal</h2>
            {assignments.length > 0 && (
                <select 
                    value={selectedAssignmentId || ''} 
                    onChange={(e) => setSelectedAssignmentId(e.target.value)}
                    className="block w-full max-w-xs pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
                    aria-label="Select Assignment"
                >
                    {assignments.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
                </select>
            )}
        </div>
        <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            {tabs.map((tab) => (
                <button
                    key={tab.name}
                    onClick={() => setActiveTab(tab.name)}
                    disabled={tab.disabled || !activeAssignment}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    activeTab === tab.name
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                    {tab.icon}
                    {tab.name}
                </button>
            ))}
            </nav>
        </div>
        <div>
            {renderTabContent()}
        </div>
    </div>
  );
};

export default StudentView;