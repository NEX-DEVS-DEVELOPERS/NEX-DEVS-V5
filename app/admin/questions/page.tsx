'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface UserQuestion {
  id: string;
  name: string;
  email: string;
  question: string;
  answer?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<UserQuestion[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<UserQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const router = useRouter();
  
  // Simple admin protection
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  
  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    // Simple password protection - in a real app, use proper authentication
    if (password === 'nex-devs.org889123') {
      setAuthenticated(true);
      localStorage.setItem('admin-authenticated', 'true');
    } else {
      setError('Incorrect password');
    }
  };
  
  useEffect(() => {
    // Check if already authenticated
    if (localStorage.getItem('admin-authenticated') === 'true') {
      setAuthenticated(true);
    }
    
    if (authenticated) {
      fetchQuestions();
    }
  }, [authenticated]);
  
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/get-user-questions?admin=true', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      
      const data = await response.json();
      setQuestions(data);
      
      // Initialize answers state with existing answers
      const initialAnswers: Record<string, string> = {};
      data.forEach((q: UserQuestion) => {
        if (q.answer) {
          initialAnswers[q.id] = q.answer;
        } else {
          initialAnswers[q.id] = '';
        }
      });
      
      setAnswers(initialAnswers);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError('Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAnswerChange = (id: string, e: ChangeEvent<HTMLTextAreaElement>) => {
    setAnswers({
      ...answers,
      [id]: e.target.value
    });
  };
  
  const updateQuestionStatus = async (id: string, status: 'approved' | 'rejected', answer?: string) => {
    try {
      setSaving({...saving, [id]: true});
      
      const response = await fetch('/api/admin/update-question-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          status,
          answer: answer || answers[id],
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update question status');
      }
      
      // Refresh questions after update
      fetchQuestions();
    } catch (err) {
      console.error('Error updating question:', err);
      setError('Failed to update question');
    } finally {
      setSaving({...saving, [id]: false});
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] pt-32 p-6">
        <div className="max-w-md mx-auto bg-gray-900/50 border border-purple-500/20 rounded-xl p-8">
          <h1 className="text-2xl font-bold text-white mb-6">Admin Login</h1>
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="password" className="block text-white mb-2">Password</label>
              <input 
                type="password" 
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-black text-white border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 text-red-400 text-center rounded-lg">
                {error}
              </div>
            )}
            
            <button 
              type="submit"
              className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-32 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-purple-400 to-blue-500 bg-clip-text text-transparent">
              Questions Admin
            </h1>
            <p className="text-gray-400 mt-2">Review and respond to user questions</p>
          </div>
          
          <div className="flex gap-4">
            <Link 
              href="/admin/projects" 
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Projects Admin
            </Link>
            
            <Link 
              href="/" 
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              View Site
            </Link>
            
          <button 
            onClick={() => {
              localStorage.removeItem('admin-authenticated');
              setAuthenticated(false);
            }}
              className="px-4 py-2 bg-red-900/30 text-red-300 rounded-lg hover:bg-red-900/50 transition-colors"
          >
            Logout
          </button>
          </div>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            <p className="mt-4 text-white">Loading questions...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="bg-gray-900/50 rounded-lg p-4 border border-purple-500/20">
                <h2 className="text-xl font-semibold text-white mb-4">All Questions</h2>
                {questions.length === 0 ? (
                  <p className="text-gray-400">No questions found</p>
                ) : (
                  <div className="space-y-4">
                    {questions.map((question) => (
                      <div 
                        key={question.id} 
                        className={`p-4 rounded-lg border ${
                          selectedQuestion?.id === question.id 
                            ? 'bg-purple-900/20 border-purple-500/40' 
                            : 'bg-gray-800/50 border-gray-700/50 hover:border-purple-500/30'
                        } cursor-pointer transition-colors`}
                        onClick={() => setSelectedQuestion(question)}
                      >
                        <div className="flex justify-between mb-2">
                          <h3 className="font-medium text-white">{question.name}</h3>
                          <span className="text-sm text-gray-400">{formatDate(question.createdAt)}</span>
                        </div>
                        <p className="text-gray-300 text-sm mb-2">{question.email}</p>
                        <p className="text-gray-400 line-clamp-2">{question.question}</p>
                        <div className="mt-2 flex items-center">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            question.status === 'approved' 
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                              : question.status === 'rejected'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          }`}>
                            {question.status.charAt(0).toUpperCase() + question.status.slice(1)}
                          </span>
                      </div>
                    </div>
                  ))}
              </div>
                )}
                        </div>
                      </div>
                      
            <div>
              <div className="bg-gray-900/50 rounded-lg p-4 border border-purple-500/20 sticky top-24">
                <h2 className="text-xl font-semibold text-white mb-4">Question Details</h2>
                {selectedQuestion ? (
                  <div>
                    <div className="mb-4 pb-4 border-b border-gray-700/50">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium text-white">{selectedQuestion.name}</h3>
                        <span className="text-sm text-gray-400">{formatDate(selectedQuestion.createdAt)}</span>
                      </div>
                      <p className="text-gray-300 text-sm mb-2">{selectedQuestion.email}</p>
                      <div className="bg-black/40 p-3 rounded border border-gray-700/50 text-gray-300 mt-2">
                        {selectedQuestion.question}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Answer
                      </label>
                      <textarea
                        value={answers[selectedQuestion.id] || ''}
                        onChange={(e) => handleAnswerChange(selectedQuestion.id, e)}
                        rows={4}
                        className="w-full px-3 py-2 bg-black/50 border border-gray-700 rounded-md text-white resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Type your answer here..."
                      ></textarea>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => updateQuestionStatus(selectedQuestion.id, 'approved')}
                        disabled={saving[selectedQuestion.id]}
                        className="flex-1 py-2 px-4 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-md transition-colors disabled:opacity-50"
                      >
                        {saving[selectedQuestion.id] ? 'Saving...' : 'Approve & Save'}
                      </button>
                      <button
                        onClick={() => updateQuestionStatus(selectedQuestion.id, 'rejected')}
                        disabled={saving[selectedQuestion.id]}
                        className="flex-1 py-2 px-4 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-md transition-colors disabled:opacity-50"
                      >
                        {saving[selectedQuestion.id] ? 'Saving...' : 'Reject'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400">Select a question to view details</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 