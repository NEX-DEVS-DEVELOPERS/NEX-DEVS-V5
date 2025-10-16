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

export async function POST(req: NextRequest) {
  try {
    const { id, status, answer } = await req.json();

    // Validate required fields
    if (!id || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // For approved questions, answer is required
    if (status === 'approved' && !answer) {
      return NextResponse.json(
        { error: 'Answer is required for approved questions' },
        { status: 400 }
      );
    }

    // Read existing questions
    let userQuestions: UserQuestion[] = [];
    try {
      const data = await fs.readFile(USER_QUESTIONS_PATH, 'utf-8');
      userQuestions = JSON.parse(data);
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to read questions file' },
        { status: 500 }
      );
    }

    // Find the question by ID
    const questionIndex = userQuestions.findIndex(q => q.id === id);
    if (questionIndex === -1) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    // Update the question status
    userQuestions[questionIndex].status = status;
    if (answer) {
      userQuestions[questionIndex].answer = answer;
    }

    // Save updated questions
    await fs.writeFile(USER_QUESTIONS_PATH, JSON.stringify(userQuestions, null, 2));

    return NextResponse.json(
      { success: true, message: 'Question updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating question:', error);
    return NextResponse.json(
      { error: 'Failed to update question' },
      { status: 500 }
    );
  }
} 
