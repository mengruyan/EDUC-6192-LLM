
import React from 'react';
import { Submission, Assignment } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DashboardTabProps {
  submissions: Submission[];
  assignment: Assignment;
}

const DashboardTab: React.FC<DashboardTabProps> = ({ submissions, assignment }) => {
  const relevantSubmissions = submissions.filter(s => s.assignmentId === assignment.id);
  const gradedSubmissions = relevantSubmissions.filter(s => s.status === 'graded' && s.feedback);
  const maxScore = assignment.rubric.reduce((acc, c) => acc + c.maxPoints, 0);

  // Note: For a real app with multiple students, total submissions would be based on class size.
  // Here we use the number of submissions made for this assignment.
  const submissionCount = relevantSubmissions.length; 
  
  const averageScore = gradedSubmissions.length > 0
    ? gradedSubmissions.reduce((acc, sub) => {
        const totalScore = sub.feedback!.scores.reduce((sAcc, s) => sAcc + s.score, 0);
        return acc + totalScore;
      }, 0) / gradedSubmissions.length
    : 0;

  const scoreDistribution = gradedSubmissions.map(sub => {
    const totalScore = sub.feedback!.scores.reduce((sAcc, s) => sAcc + s.score, 0);
    return { name: sub.studentName.split(' ')[0], score: totalScore };
  });

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Class Performance for: <span className="font-normal">{assignment.title}</span></h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-sm font-medium text-gray-500">Total Submissions</h4>
          <p className="mt-1 text-3xl font-semibold text-gray-900">{submissionCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-sm font-medium text-gray-500">Average Score</h4>
          <p className="mt-1 text-3xl font-semibold text-gray-900">
            {gradedSubmissions.length > 0 ? `${averageScore.toFixed(1)} / ${maxScore}` : 'N/A'}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-sm font-medium text-gray-500">Graded Submissions</h4>
          <p className="mt-1 text-3xl font-semibold text-gray-900">{gradedSubmissions.length}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Score Distribution</h4>
        {gradedSubmissions.length > 0 ? (
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart
                data={scoreDistribution}
                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, maxScore]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-10">
            No graded submissions to display for this assignment.
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardTab;