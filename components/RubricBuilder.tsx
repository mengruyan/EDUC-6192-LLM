
import React from 'react';
import { RubricCriterion } from '../types';
import { PlusIcon, TrashIcon } from './Icons';

interface RubricBuilderProps {
  rubric: RubricCriterion[];
  onRubricChange: (rubric: RubricCriterion[]) => void;
}

const RubricBuilder: React.FC<RubricBuilderProps> = ({ rubric, onRubricChange }) => {
  const addCriterion = () => {
    onRubricChange([...rubric, { id: `criterion-${Date.now()}`, name: '', maxPoints: 10 }]);
  };

  const updateCriterion = (index: number, field: keyof RubricCriterion, value: string | number) => {
    const newRubric = [...rubric];
    if (field === 'maxPoints') {
        const points = Number(value);
        if(!isNaN(points) && points >= 0) {
            newRubric[index] = { ...newRubric[index], [field]: points };
        }
    } else {
        newRubric[index] = { ...newRubric[index], [field]: value };
    }
    onRubricChange(newRubric);
  };

  const removeCriterion = (index: number) => {
    const newRubric = rubric.filter((_, i) => i !== index);
    onRubricChange(newRubric);
  };

  return (
    <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
      {rubric.map((criterion, index) => (
        <div key={criterion.id} className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Criterion Name"
            value={criterion.name}
            onChange={(e) => updateCriterion(index, 'name', e.target.value)}
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <input
            type="number"
            placeholder="Points"
            value={criterion.maxPoints}
            onChange={(e) => updateCriterion(index, 'maxPoints', parseInt(e.target.value, 10))}
            className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <button
            onClick={() => removeCriterion(index)}
            className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors"
            aria-label="Remove criterion"
          >
            <TrashIcon />
          </button>
        </div>
      ))}
      <button
        onClick={addCriterion}
        className="flex items-center px-4 py-2 border border-dashed border-gray-400 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <PlusIcon />
        <span className="ml-2">Add Criterion</span>
      </button>
    </div>
  );
};

export default RubricBuilder;
