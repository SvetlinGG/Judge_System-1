import React, { useState } from 'react';
import { Code2, Send } from 'lucide-react';

// Test cases for each task
const testCases = {
  fibonacci: [
    { input: 5, expected: 5 },
    { input: 6, expected: 8 },
    { input: 7, expected: 13 }
  ],
  palindrome: [
    { input: "racecar", expected: true },
    { input: "hello", expected: false },
    { input: "A man a plan a canal Panama", expected: true }
  ],
  sorting: [
    { input: [3, 1, 4, 1, 5], expected: [1, 1, 3, 4, 5] },
    { input: [9, 5, 2, 7], expected: [2, 5, 7, 9] }
  ],
  anagram: [
    { input: ["listen", "silent"], expected: true },
    { input: ["hello", "world"], expected: false }
  ]
};

function App() {
  const [code, setCode] = useState('');
  const [language] = useState('javascript');
  const [task, setTask] = useState('');
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = (userCode: string, task: string) => {
    try {
      // Create a function from the user's code
      const userFunction = new Function('return ' + userCode)();
      
      const cases = testCases[task as keyof typeof testCases];
      let passed = 0;
      
      for (const testCase of cases) {
        const output = userFunction(...(Array.isArray(testCase.input) ? testCase.input : [testCase.input]));
        if (JSON.stringify(output) === JSON.stringify(testCase.expected)) {
          passed++;
        }
      }

      return {
        success: passed === cases.length,
        message: `Passed ${passed}/${cases.length} test cases`
      };
    } catch (error) {
      return {
        success: false,
        message: `Error: ${(error as Error).message}`
      };
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRunning(true);
    setResult(null);

    // Simulate network delay
    setTimeout(() => {
      const testResult = runTests(code, task);
      setResult(testResult);
      setIsRunning(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Code2 className="w-8 h-8 text-blue-400" />
          <h1 className="text-3xl font-bold text-white">Code Judge</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 p-6 rounded-xl shadow-xl">
          {/* Task Selection */}
          <div>
            <label htmlFor="task" className="block text-sm font-medium text-gray-200 mb-2">
              Select Task
            </label>
            <select
              id="task"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            >
              <option value="">Choose a task...</option>
              <option value="fibonacci">Fibonacci Sequence</option>
              <option value="palindrome">Palindrome Check</option>
              <option value="sorting">Array Sorting</option>
              <option value="anagram">Anagram Detection</option>
            </select>
          </div>

          {/* Code Input */}
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-200 mb-2">
              Solution Code (JavaScript)
            </label>
            <div className="relative">
              <textarea
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-64 px-4 py-3 bg-gray-700 text-white font-mono text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="// Write your JavaScript solution here..."
                required
              />
            </div>
          </div>

          {/* Result Display */}
          {result && (
            <div className={`p-4 rounded-lg ${result.success ? 'bg-green-800' : 'bg-red-800'}`}>
              <p className="text-white">{result.message}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isRunning}
              className={`flex items-center gap-2 px-6 py-2 ${
                isRunning 
                  ? 'bg-gray-500 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white font-medium rounded-lg transition-colors duration-200`}
            >
              <Send className="w-4 h-4" />
              {isRunning ? 'Running...' : 'Submit Solution'}
            </button>
          </div>
        </form>

        {/* Language Badge */}
        <div className="mt-4 flex justify-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-200 text-yellow-800">
            JavaScript
          </span>
        </div>
      </div>
    </div>
  );
}

export default App;