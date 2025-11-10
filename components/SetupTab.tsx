
import React, { useState, useEffect } from 'react';
import { Assignment, RubricCriterion } from '../types';
import RubricBuilder from './RubricBuilder';

interface SetupTabProps {
  assignment: Assignment | null;
  onSave: (assignment: Assignment | Omit<Assignment, 'id'>) => void;
}

const createNewAssignmentTemplate = (): Omit<Assignment, 'id'> => ({
  title: '',
  instructions: '',
  rubric: [{ id: 'criterion-1', name: 'Content Accuracy', maxPoints: 10 }],
  examples: [],
  requirements: {
    text: true,
    audio: false,
    image: false,
  },
});

const SetupTab: React.FC<SetupTabProps> = ({ assignment, onSave }) => {
  const [localAssignment, setLocalAssignment] = useState<Assignment | Omit<Assignment, 'id'>>(
    assignment || createNewAssignmentTemplate()
  );
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setLocalAssignment(assignment || createNewAssignmentTemplate());
  }, [assignment]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLocalAssignment({ ...localAssignment, [e.target.name]: e.target.value });
  };

  const handleRequirementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalAssignment({
      ...localAssignment,
      requirements: {
        ...localAssignment.requirements,
        [e.target.name]: e.target.checked,
      },
    });
  };

  const handleRubricChange = (newRubric: RubricCriterion[]) => {
    setLocalAssignment({ ...localAssignment, rubric: newRubric });
  };

  const handleSave = () => {
    onSave(localAssignment);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };
  
  const isNewAssignment = !('id' in localAssignment);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          {isNewAssignment ? 'Create New Assignment' : 'Edit Assignment Details'}
        </h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Assignment Title</label>
            <input
              type="text"
              name="title"
              id="title"
              value={localAssignment.title}
              onChange={handleChange}
              placeholder="e.g., Chinese New Year Traditions"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">Instructions</label>
            <textarea
              name="instructions"
              id="instructions"
              rows={5}
              value={localAssignment.instructions}
              onChange={handleChange}
              placeholder="Enter detailed instructions for the student..."
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Submission Requirements</h3>
        <div className="flex items-center space-x-6">
          {Object.keys(localAssignment.requirements).map((key) => (
            <div key={key} className="flex items-center">
              <input
                id={key}
                name={key}
                type="checkbox"
                checked={localAssignment.requirements[key as keyof typeof localAssignment.requirements]}
                onChange={handleRequirementChange}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor={key} className="ml-2 block text-sm text-gray-900 capitalize">{key}</label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Grading Rubric</h3>
        <RubricBuilder rubric={localAssignment.rubric} onRubricChange={handleRubricChange} />
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={!localAssignment.title}
          className={`px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${isSaved ? 'bg-green-600' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:bg-gray-400`}
        >
          {isSaved ? 'Saved!' : (isNewAssignment ? 'Create Assignment' : 'Save Changes')}
        </button>
      </div>
    </div>
  );
};

export default SetupTab;