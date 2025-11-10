import React, { useState } from 'react';
import { Assignment, Submission } from '../types';
import SetupTab from './SetupTab';
import GradingTab from './GradingTab';
import DashboardTab from './DashboardTab';
import { SetupIcon, GradingIcon, DashboardIcon, PlusIcon, DuplicateIcon, TrashIcon } from './Icons';

type TeacherTab = 'Setup' | 'Grading' | 'Dashboard';

interface TeacherViewProps {
  assignments: Assignment[];
  activeAssignment: Assignment | null;
  setActiveAssignmentId: (id: string | null) => void;
  submissions: Submission[];
  updateAssignment: (assignment: Assignment) => void;
  addAssignment: (assignment: Omit<Assignment, 'id'>) => void;
  duplicateAssignment: (id: string) => void;
  deleteAssignment: (id: string) => void;
  updateSubmissions: (submissions: Submission[]) => void;
}

const TeacherView: React.FC<TeacherViewProps> = ({ 
    assignments,
    activeAssignment,
    setActiveAssignmentId,
    submissions, 
    updateAssignment, 
    addAssignment,
    duplicateAssignment,
    deleteAssignment,
    updateSubmissions 
}) => {
  const [activeTab, setActiveTab] = useState<TeacherTab>('Setup');

  const handleSaveSetup = (assignmentData: Assignment | Omit<Assignment, 'id'>) => {
    if ('id' in assignmentData && assignmentData.id) {
        updateAssignment(assignmentData as Assignment);
    } else {
        addAssignment(assignmentData);
    }
  }

  const renderTabContent = () => {
    if (!activeAssignment && activeTab !== 'Setup') {
        return <div className="text-center text-gray-500 py-10">Please select an assignment to view its {activeTab.toLowerCase()}.</div>;
    }

    switch (activeTab) {
      case 'Setup':
        return <SetupTab assignment={activeAssignment} onSave={handleSaveSetup} />;
      case 'Grading':
        return <GradingTab submissions={submissions} assignment={activeAssignment!} updateSubmissions={updateSubmissions} />;
      case 'Dashboard':
        return <DashboardTab submissions={submissions} assignment={activeAssignment!} />;
      default:
        return null;
    }
  };
  
  const tabs: { name: TeacherTab; icon: React.ReactElement }[] = [
    { name: 'Setup', icon: <SetupIcon /> },
    { name: 'Grading', icon: <GradingIcon /> },
    { name: 'Dashboard', icon: <DashboardIcon /> },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
            <h2 className="text-3xl font-bold text-gray-800">Teacher Portal</h2>
            <div className="flex items-center gap-2">
                <select 
                    value={activeAssignment?.id || ''} 
                    onChange={(e) => setActiveAssignmentId(e.target.value)}
                    className="block w-full max-w-xs pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
                >
                    <option value="" disabled>Select an assignment...</option>
                    {assignments.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
                </select>
                <button 
                    onClick={() => setActiveAssignmentId(null)}
                    className="flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    title="Create New Assignment"
                >
                    <PlusIcon/>
                    <span className="ml-2 hidden sm:inline">New</span>
                </button>
                <button
                    onClick={() => activeAssignment && duplicateAssignment(activeAssignment.id)}
                    disabled={!activeAssignment}
                    className="p-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Duplicate selected assignment"
                >
                    <DuplicateIcon />
                </button>
                <button
                    onClick={() => activeAssignment && deleteAssignment(activeAssignment.id)}
                    disabled={!activeAssignment}
                    className="p-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete selected assignment"
                >
                    <TrashIcon />
                </button>
            </div>
        </div>

        <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                {tabs.map((tab) => (
                <button
                    key={tab.name}
                    onClick={() => setActiveTab(tab.name)}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${
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

export default TeacherView;