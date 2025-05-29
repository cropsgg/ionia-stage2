import React, { useState, useEffect, useCallback } from 'react';
import { 
  FiClock, FiChevronLeft, FiChevronRight, FiSave, FiSend, 
  FiAlertTriangle, FiCheckCircle, FiFlag, FiRotateCcw,
  FiPlay, FiPause, FiSkipForward
} from 'react-icons/fi';
import Card from './card';

export interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay' | 'fill_blank';
  question: string;
  options?: string[];
  correctAnswer?: any;
  points: number;
  explanation?: string;
  image?: string;
  required?: boolean;
  timeLimit?: number; // in seconds for individual questions
}

export interface QuizConfig {
  id: string;
  title: string;
  instructions: string;
  timeLimit?: number; // in minutes
  shuffleQuestions?: boolean;
  shuffleOptions?: boolean;
  allowReview?: boolean;
  showProgressBar?: boolean;
  showQuestionNumbers?: boolean;
  maxAttempts?: number;
  passingScore?: number;
}

interface QuizInterfaceProps {
  quiz: QuizConfig;
  questions: QuizQuestion[];
  onSubmit: (answers: { [questionId: string]: any }, timeSpent: number) => void;
  onSave?: (answers: { [questionId: string]: any }) => void;
  autoSaveInterval?: number; // in seconds
  className?: string;
}

const QuizInterface: React.FC<QuizInterfaceProps> = ({
  quiz,
  questions,
  onSubmit,
  onSave,
  autoSaveInterval = 30,
  className = ''
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: string]: any }>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
  const [visitedQuestions, setVisitedQuestions] = useState<Set<number>>(new Set([0]));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Initialize timer
  useEffect(() => {
    if (quiz.timeLimit && isStarted && !isPaused) {
      setTimeRemaining(quiz.timeLimit * 60);
    }
  }, [quiz.timeLimit, isStarted, isPaused]);

  // Main timer effect
  useEffect(() => {
    if (isStarted && !isPaused) {
      const timer = setInterval(() => {
        setTimeSpent(prev => prev + 1);
        
        if (timeRemaining !== null) {
          setTimeRemaining(prev => {
            if (prev && prev <= 1) {
              handleAutoSubmit();
              return 0;
            }
            return prev ? prev - 1 : null;
          });
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isStarted, isPaused, timeRemaining]);

  // Auto-save effect
  useEffect(() => {
    if (isStarted && onSave && autoSaveInterval > 0) {
      const autoSaveTimer = setInterval(() => {
        onSave(answers);
        setLastSaved(new Date());
      }, autoSaveInterval * 1000);

      return () => clearInterval(autoSaveTimer);
    }
  }, [isStarted, answers, onSave, autoSaveInterval]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getCurrentQuestion = () => questions[currentQuestionIndex];

  const getAnsweredQuestionsCount = () => {
    return questions.filter(q => answers[q.id] !== undefined && answers[q.id] !== null && answers[q.id] !== '').length;
  };

  const isQuestionAnswered = (questionId: string) => {
    const answer = answers[questionId];
    return answer !== undefined && answer !== null && answer !== '';
  };

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setVisitedQuestions(prev => new Set([...prev, nextIndex]));
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleQuestionJump = (index: number) => {
    setCurrentQuestionIndex(index);
    setVisitedQuestions(prev => new Set([...prev, index]));
  };

  const toggleFlag = (questionId: string) => {
    setFlaggedQuestions(prev => {
      const newFlags = new Set(prev);
      if (newFlags.has(questionId)) {
        newFlags.delete(questionId);
      } else {
        newFlags.add(questionId);
      }
      return newFlags;
    });
  };

  const startQuiz = () => {
    setIsStarted(true);
    setVisitedQuestions(new Set([0]));
  };

  const pauseQuiz = () => {
    setIsPaused(!isPaused);
  };

  const handleManualSave = () => {
    if (onSave) {
      onSave(answers);
      setLastSaved(new Date());
    }
  };

  const handleAutoSubmit = useCallback(() => {
    setIsSubmitting(true);
    onSubmit(answers, timeSpent);
  }, [answers, timeSpent, onSubmit]);

  const handleManualSubmit = () => {
    if (window.confirm('Are you sure you want to submit your quiz? This action cannot be undone.')) {
      setIsSubmitting(true);
      onSubmit(answers, timeSpent);
    }
  };

  const renderQuestion = (question: QuizQuestion) => {
    const userAnswer = answers[question.id];

    switch (question.type) {
      case 'multiple_choice':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <label
                key={index}
                className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={userAnswer === option}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="mt-1 text-blue-600"
                />
                <span className="flex-1">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'true_false':
        return (
          <div className="space-y-3">
            <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name={question.id}
                value="true"
                checked={userAnswer === true || userAnswer === 'true'}
                onChange={() => handleAnswerChange(question.id, true)}
                className="text-blue-600"
              />
              <span>True</span>
            </label>
            <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name={question.id}
                value="false"
                checked={userAnswer === false || userAnswer === 'false'}
                onChange={() => handleAnswerChange(question.id, false)}
                className="text-blue-600"
              />
              <span>False</span>
            </label>
          </div>
        );

      case 'short_answer':
        return (
          <textarea
            value={userAnswer || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="Type your answer here..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
          />
        );

      case 'essay':
        return (
          <textarea
            value={userAnswer || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="Write your essay here..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={8}
          />
        );

      case 'fill_blank':
        return (
          <input
            type="text"
            value={userAnswer || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="Fill in the blank"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );

      default:
        return <div>Unsupported question type</div>;
    }
  };

  if (!isStarted) {
    return (
      <div className={`max-w-2xl mx-auto ${className}`}>
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{quiz.title}</h1>
          
          <div className="space-y-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg text-left">
              <h3 className="font-medium text-blue-900 mb-2">Instructions:</h3>
              <p className="text-blue-800 text-sm whitespace-pre-line">{quiz.instructions}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-900">Questions</div>
                <div className="text-gray-600">{questions.length}</div>
              </div>
              
              {quiz.timeLimit && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-gray-900">Time Limit</div>
                  <div className="text-gray-600">{quiz.timeLimit} minutes</div>
                </div>
              )}
              
              {quiz.maxAttempts && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-gray-900">Max Attempts</div>
                  <div className="text-gray-600">{quiz.maxAttempts}</div>
                </div>
              )}
              
              {quiz.passingScore && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-gray-900">Passing Score</div>
                  <div className="text-gray-600">{quiz.passingScore}%</div>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={startQuiz}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
          >
            <FiPlay className="h-5 w-5" />
            Start Quiz
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
          
          <div className="flex items-center gap-4">
            {/* Timer */}
            <div className="flex items-center gap-2">
              <FiClock className="h-5 w-5 text-gray-500" />
              <div className="text-sm">
                <div className="font-medium">
                  {timeRemaining !== null ? (
                    <span className={timeRemaining < 300 ? 'text-red-600' : 'text-gray-900'}>
                      {formatTime(timeRemaining)}
                    </span>
                  ) : (
                    <span className="text-gray-600">No limit</span>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  Elapsed: {formatTime(timeSpent)}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-2">
              {quiz.timeLimit && (
                <button
                  onClick={pauseQuiz}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  title={isPaused ? 'Resume' : 'Pause'}
                >
                  {isPaused ? <FiPlay className="h-4 w-4" /> : <FiPause className="h-4 w-4" />}
                </button>
              )}
              
              {onSave && (
                <button
                  onClick={handleManualSave}
                  className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                >
                  <FiSave className="h-4 w-4" />
                  Save
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {quiz.showProgressBar && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{getAnsweredQuestionsCount()} of {questions.length} answered</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-300" 
                style={{ width: `${(getAnsweredQuestionsCount() / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {isPaused && (
        <Card className="p-6 text-center mb-6 bg-yellow-50 border-yellow-200">
          <FiPause className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
          <h3 className="font-medium text-yellow-900 mb-1">Quiz Paused</h3>
          <p className="text-yellow-800 text-sm">Click the play button to resume</p>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Question Navigation Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-4 sticky top-4">
            <h3 className="font-medium text-gray-900 mb-3">Questions</h3>
            <div className="grid grid-cols-5 lg:grid-cols-4 gap-2">
              {questions.map((question, index) => {
                const isAnswered = isQuestionAnswered(question.id);
                const isFlagged = flaggedQuestions.has(question.id);
                const isCurrent = index === currentQuestionIndex;
                const isVisited = visitedQuestions.has(index);

                return (
                  <button
                    key={question.id}
                    onClick={() => handleQuestionJump(index)}
                    className={`relative p-2 text-sm font-medium rounded transition-colors ${
                      isCurrent
                        ? 'bg-blue-600 text-white'
                        : isAnswered
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : isVisited
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {index + 1}
                    {isFlagged && (
                      <FiFlag className="absolute -top-1 -right-1 h-3 w-3 text-red-500" />
                    )}
                  </button>
                );
              })}
            </div>
            
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded"></div>
                <span>Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded"></div>
                <span>Visited</span>
              </div>
              <div className="flex items-center gap-2">
                <FiFlag className="w-3 h-3 text-red-500" />
                <span>Flagged</span>
              </div>
            </div>

            {lastSaved && (
              <div className="mt-4 p-2 bg-green-50 rounded text-xs text-green-700">
                <FiCheckCircle className="inline h-3 w-3 mr-1" />
                Last saved: {lastSaved.toLocaleTimeString()}
              </div>
            )}
          </Card>
        </div>

        {/* Main Question Area */}
        <div className="lg:col-span-3">
          <Card className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                {quiz.showQuestionNumbers && (
                  <div className="text-sm text-gray-500 mb-2">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </div>
                )}
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  {getCurrentQuestion().question}
                </h2>
              </div>
              
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => toggleFlag(getCurrentQuestion().id)}
                  className={`p-2 rounded transition-colors ${
                    flaggedQuestions.has(getCurrentQuestion().id)
                      ? 'bg-red-100 text-red-600 hover:bg-red-200'
                      : 'border border-gray-300 text-gray-500 hover:bg-gray-50'
                  }`}
                  title="Flag for review"
                >
                  <FiFlag className="h-4 w-4" />
                </button>
              </div>
            </div>

            {getCurrentQuestion().image && (
              <div className="mb-6">
                <img
                  src={getCurrentQuestion().image}
                  alt="Question illustration"
                  className="max-w-full h-auto rounded-lg"
                />
              </div>
            )}

            <div className="mb-6">
              {renderQuestion(getCurrentQuestion())}
            </div>

            <div className="flex justify-between items-center">
              <div className="flex gap-3">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiChevronLeft className="h-4 w-4" />
                  Previous
                </button>
                
                <button
                  onClick={handleNext}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <FiChevronRight className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={handleManualSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <FiSend className="h-4 w-4" />
                    Submit Quiz
                  </>
                )}
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuizInterface; 