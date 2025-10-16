import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Path to the user questions JSON file
const USER_QUESTIONS_PATH = path.join(process.cwd(), 'data', 'user-questions.json');

// Interface for user questions
interface UserQuestion {
  id: string;
  name: string;
  email: string;
  question: string;
  answer?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export async function GET(req: NextRequest) {
  try {
    let userQuestions: UserQuestion[] = [];
    
    try {
      // Read the file if it exists
      const data = await fs.readFile(USER_QUESTIONS_PATH, 'utf-8');
      userQuestions = JSON.parse(data);
    } catch (error) {
      // File doesn't exist yet, use empty array
      console.log('No user questions file found, returning empty array');
    }
    
    // Check if requesting admin view (all questions)
    const url = new URL(req.url);
    const isAdmin = url.searchParams.get('admin') === 'true';
    
    if (isAdmin) {
      // Return all questions for admin view
      return NextResponse.json(userQuestions);
    }
    
    // For public view, filter out only approved questions that have answers
    const approvedQuestions = userQuestions.filter(
      q => q.status === 'approved' && q.answer
    );
    
    // Format for public consumption (remove emails and other private info)
    const publicQuestions = approvedQuestions.map(q => ({
      id: q.id,
      question: q.question,
      answer: q.answer,
      name: q.name.split(' ')[0], // Only use first name for privacy
      createdAt: q.createdAt
    }));
    
    return NextResponse.json(publicQuestions);
  } catch (error) {
    console.error('Error retrieving user questions:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve questions' },
      { status: 500 }
    );
  }
} 
