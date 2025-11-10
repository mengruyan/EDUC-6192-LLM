import React, { useState, useEffect } from 'react';
import { UserRole, Assignment, Submission } from './types';
import TeacherView from './components/TeacherView';
import StudentView from './components/StudentView';
import { saveData, loadData } from './services/storageService';

const FIRST_ASSIGNMENT_ID = 'default-assignment-1';

const DEFAULT_ASSIGNMENTS: Assignment[] = [{
  id: FIRST_ASSIGNMENT_ID,
  title: '中秋节文化介绍 (Mid-Autumn Festival Cultural Introduction)',
  instructions: 'Please provide a detailed introduction to the Mid-Autumn Festival. Your submission should cover its origins, traditions (like eating mooncakes and family gatherings), and one famous legend associated with it (e.g., Chang\'e). Please submit your answer in written Chinese, record a short audio summary of your text, and upload an image related to the festival.',
  rubric: [
    { id: 'criterion-1', name: 'Historical Accuracy & Origins', maxPoints: 10 },
    { id: 'criterion-2', name: 'Description of Traditions', maxPoints: 10 },
    { id: 'criterion-3', name: 'Legend Recounting', maxPoints: 10 },
    { id: 'criterion-4', name: 'Language & Clarity (Chinese)', maxPoints: 5 },
  ],
  examples: [
    { id: 'ex-1', type: 'high', description: 'A well-structured text with clear details and a relevant image.' },
    { id: 'ex-2', type: 'medium', description: 'Good description of traditions but lacks detail on the origins.' },
    { id: 'ex-3', type: 'low', description: 'Brief text with several inaccuracies and a missing legend.' },
  ],
  requirements: {
    text: true,
    audio: true,
    image: true,
  },
}];

const DEFAULT_SUBMISSIONS: Submission[] = [];

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole>(UserRole.Teacher);
  const [assignments, setAssignments] = useState<Assignment[]>(DEFAULT_ASSIGNMENTS);
  const [activeAssignmentId, setActiveAssignmentId] = useState<string | null>(FIRST_ASSIGNMENT_ID);
  const [submissions, setSubmissions] = useState<Submission[]>(DEFAULT_SUBMISSIONS);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    const data = loadData();
    if (data && data.assignments && data.assignments.length > 0) {
      setAssignments(data.assignments);
      setSubmissions(data.submissions || []);
      setActiveAssignmentId(data.assignments[0].id);
    } else {
        setActiveAssignmentId(assignments.length > 0 ? assignments[0].id : null)
    }
    setIsDataLoaded(true);
  }, []);

  useEffect(() => {
    if (isDataLoaded) {
      saveData({ assignments, submissions });
    }
  }, [assignments, submissions, isDataLoaded]);
  
  const updateAssignment = (updatedAssignment: Assignment) => {
    setAssignments(assignments.map(a => a.id === updatedAssignment.id ? updatedAssignment : a));
  };

  const addAssignment = (newAssignment: Omit<Assignment, 'id'>) => {
    const assignmentWithId = { ...newAssignment, id: `asgn-${Date.now()}`};
    const newAssignments = [...assignments, assignmentWithId];
    setAssignments(newAssignments);
    setActiveAssignmentId(assignmentWithId.id);
  }

  const duplicateAssignment = (idToDuplicate: string) => {
    const originalAssignment = assignments.find(a => a.id === idToDuplicate);
    if (!originalAssignment) return;

    const newAssignment = {
      ...JSON.parse(JSON.stringify(originalAssignment)), // Deep copy to avoid nested reference issues
      id: `asgn-${Date.now()}`,
      title: `Copy of ${originalAssignment.title}`,
    };

    const newAssignments = [...assignments, newAssignment];
    setAssignments(newAssignments);
    setActiveAssignmentId(newAssignment.id);
  };

  const deleteAssignment = (idToDelete: string) => {
    if (!window.confirm("Are you sure you want to delete this assignment and all its submissions? This action cannot be undone.")) {
      return;
    }

    const newAssignments = assignments.filter(a => a.id !== idToDelete);
    const newSubmissions = submissions.filter(s => s.assignmentId !== idToDelete);

    setAssignments(newAssignments);
    setSubmissions(newSubmissions);

    if (activeAssignmentId === idToDelete) {
      setActiveAssignmentId(newAssignments.length > 0 ? newAssignments[0].id : null);
    }
  };

  const updateSubmissions = (newSubmissions: Submission[]) => {
    setSubmissions(newSubmissions);
  };

  const activeAssignment = assignments.find(a => a.id === activeAssignmentId) ?? null;

  if (!isDataLoaded) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">
            中华文化 | AI Grader
          </h1>
          <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setUserRole(UserRole.Teacher)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                userRole === UserRole.Teacher ? 'bg-indigo-600 text-white shadow' : 'text-gray-600 hover:bg-slate-200'
              }`}
            >
              Teacher
            </button>
            <button
              onClick={() => setUserRole(UserRole.Student)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                userRole === UserRole.Student ? 'bg-indigo-600 text-white shadow' : 'text-gray-600 hover:bg-slate-200'
              }`}
            >
              Student
            </button>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8">
        {userRole === UserRole.Teacher ? (
          <TeacherView 
            assignments={assignments}
            activeAssignment={activeAssignment}
            setActiveAssignmentId={setActiveAssignmentId}
            submissions={submissions} 
            updateAssignment={updateAssignment} 
            addAssignment={addAssignment}
            duplicateAssignment={duplicateAssignment}
            deleteAssignment={deleteAssignment}
            updateSubmissions={updateSubmissions}
          />
        ) : (
          <StudentView assignments={assignments} submissions={submissions} updateSubmissions={updateSubmissions}/>
        )}
      </main>
    </div>
  );
};

export default App;