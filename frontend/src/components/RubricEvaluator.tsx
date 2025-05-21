import React, { useState, useEffect } from 'react';
import { FiPlus, FiX, FiCheck } from 'react-icons/fi';

export type RubricCriterion = {
  id: string;
  criterion: string;
  maxMarks: number;
  levels: RubricLevel[];
}

export type RubricLevel = {
  id: string;
  level: string;
  description: string;
  marks: number;
}

export type Rubric = {
  id: string;
  name: string;
  description: string;
  criteria: RubricCriterion[];
}

type RubricEvaluatorProps = {
  rubrics: Rubric[];
  selectedRubricId?: string;
  onRubricSelect: (rubricId: string) => void;
  onRubricEvaluation: (evaluations: Record<string, { levelId: string, marks: number }>) => void;
  initialEvaluations?: Record<string, { levelId: string, marks: number }>;
  disabled?: boolean;
}

const RubricEvaluator: React.FC<RubricEvaluatorProps> = ({
  rubrics,
  selectedRubricId,
  onRubricSelect,
  onRubricEvaluation,
  initialEvaluations = {},
  disabled = false
}) => {
  const [evaluations, setEvaluations] = useState<Record<string, { levelId: string, marks: number }>>(initialEvaluations);
  const [selectedRubric, setSelectedRubric] = useState<Rubric | null>(null);
  const [totalMarks, setTotalMarks] = useState<number>(0);
  const [maxPossibleMarks, setMaxPossibleMarks] = useState<number>(0);

  useEffect(() => {
    if (selectedRubricId) {
      const rubric = rubrics.find(r => r.id === selectedRubricId);
      setSelectedRubric(rubric || null);
      
      if (rubric) {
        const maxMarks = rubric.criteria.reduce((total, criterion) => total + criterion.maxMarks, 0);
        setMaxPossibleMarks(maxMarks);
      }
    } else {
      setSelectedRubric(null);
      setMaxPossibleMarks(0);
    }
  }, [selectedRubricId, rubrics]);

  useEffect(() => {
    if (Object.keys(initialEvaluations).length) {
      setEvaluations(initialEvaluations);
      calculateTotalMarks(initialEvaluations);
    }
  }, [initialEvaluations]);

  const calculateTotalMarks = (evals = evaluations) => {
    if (!selectedRubric) return;
    
    let total = 0;
    
    for (const criterionId in evals) {
      total += evals[criterionId].marks;
    }
    
    setTotalMarks(total);
  };

  const handleRubricChange = (rubricId: string) => {
    onRubricSelect(rubricId);
    setEvaluations({});
    setTotalMarks(0);
  };

  const handleLevelSelect = (criterionId: string, levelId: string, marks: number) => {
    if (disabled) return;
    
    const newEvaluations = {
      ...evaluations,
      [criterionId]: { levelId, marks }
    };
    
    setEvaluations(newEvaluations);
    calculateTotalMarks(newEvaluations);
    onRubricEvaluation(newEvaluations);
  };

  return (
    <div className="border border-gray-200 rounded-md overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-200 p-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Grading Rubric</label>
        <select
          className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={selectedRubricId || ''}
          onChange={(e) => handleRubricChange(e.target.value)}
          disabled={disabled}
        >
          <option value="">None</option>
          {rubrics.map(rubric => (
            <option key={rubric.id} value={rubric.id}>{rubric.name}</option>
          ))}
        </select>
      </div>
      
      {selectedRubric ? (
        <div className="p-3">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{selectedRubric.name}</h3>
              <p className="text-sm text-gray-500">{selectedRubric.description}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                Score: {totalMarks} / {maxPossibleMarks}
              </p>
              <p className="text-xs text-gray-500">
                {Object.keys(evaluations).length} of {selectedRubric.criteria.length} criteria evaluated
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            {selectedRubric.criteria.map(criterion => {
              const selectedLevel = evaluations[criterion.id]?.levelId;
              
              return (
                <div key={criterion.id} className="border border-gray-200 rounded-md overflow-hidden">
                  <div className="bg-gray-50 p-3 flex justify-between items-center">
                    <h4 className="text-sm font-medium text-gray-700">{criterion.criterion}</h4>
                    <span className="text-xs text-gray-500">{criterion.maxMarks} points</span>
                  </div>
                  
                  <div className="p-0">
                    {criterion.levels.map(level => {
                      const isSelected = selectedLevel === level.id;
                      
                      return (
                        <div 
                          key={level.id}
                          className={`p-3 border-b border-gray-200 last:border-b-0 cursor-pointer hover:bg-gray-50 ${
                            isSelected ? 'bg-indigo-50' : ''
                          }`}
                          onClick={() => handleLevelSelect(criterion.id, level.id, level.marks)}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center">
                              <div className={`w-4 h-4 border border-gray-300 rounded-full mr-2 flex items-center justify-center ${
                                isSelected ? 'border-indigo-600 bg-indigo-600' : ''
                              }`}>
                                {isSelected && <FiCheck className="text-white" size={12} />}
                              </div>
                              <h5 className={`text-sm font-medium ${
                                isSelected ? 'text-indigo-700' : 'text-gray-700'
                              }`}>
                                {level.level}
                              </h5>
                            </div>
                            <span className={`text-xs ${
                              isSelected ? 'text-indigo-700 font-medium' : 'text-gray-500'
                            }`}>
                              {level.marks} points
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 pl-6">
                            {level.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center">
          <p className="text-gray-500 text-sm">
            {rubrics.length > 0 
              ? 'Select a rubric to evaluate the student\'s work'
              : 'No rubrics available'}
          </p>
        </div>
      )}
    </div>
  );
};

export default RubricEvaluator; 