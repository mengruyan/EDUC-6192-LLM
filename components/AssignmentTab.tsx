
import React from 'react';
import { Assignment } from '../types';

interface AssignmentTabProps {
  assignment: Assignment;
}

const AssignmentTab: React.FC<AssignmentTabProps> = ({ assignment }) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{assignment.title}</h3>
        <p className="text-gray-600 whitespace-pre-wrap">{assignment.instructions}</p>
      </div>

      <div>
        <h4 className="text-xl font-semibold text-gray-700 mb-3">Grading Rubric</h4>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2">
          {assignment.rubric.map((criterion) => (
            <div key={criterion.id} className="flex justify-between items-center text-sm">
              <span className="text-gray-800">{criterion.name}</span>
              <span className="font-semibold bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                {criterion.maxPoints} pts
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xl font-semibold text-gray-700 mb-3">Example Submissions</h4>
        <div className="space-y-3">
          {assignment.examples.map((example) => (
            <div key={example.id} className="p-3 border-l-4 rounded-r-md bg-gray-50 flex items-center space-x-3
              ${example.type === 'high' ? 'border-green-500' : ''}
              ${example.type === 'medium' ? 'border-yellow-500' : ''}
              ${example.type === 'low' ? 'border-red-500' : ''}
            ">
              <span className={`capitalize font-semibold text-sm w-16 text-center px-2 py-1 rounded-full
                ${example.type === 'high' ? 'bg-green-100 text-green-800' : ''}
                ${example.type === 'medium' ? 'bg-yellow-100 text-yellow-800' : ''}
                ${example.type === 'low' ? 'bg-red-100 text-red-800' : ''}
              `}>{example.type}</span>
              <p className="text-gray-600 text-sm">{example.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssignmentTab;
