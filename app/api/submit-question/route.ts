import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
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

// Function to save user question
async function saveUserQuestion(question: Omit<UserQuestion, 'id' | 'createdAt' | 'status'>) {
  try {
    // Create data directory if it doesn't exist
    try {
      await fs.mkdir(path.join(process.cwd(), 'data'), { recursive: true });
    } catch (error) {
      // Directory already exists, ignore
    }
    
    // Get existing questions or initialize with empty array
    let userQuestions: UserQuestion[] = [];
    try {
      const data = await fs.readFile(USER_QUESTIONS_PATH, 'utf-8');
      userQuestions = JSON.parse(data);
    } catch (error) {
      // File doesn't exist yet, use empty array
    }
    
    // Add new question with generated ID and timestamp
    const newQuestion: UserQuestion = {
      id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      ...question,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    userQuestions.push(newQuestion);
    
    // Save updated questions to file
    await fs.writeFile(USER_QUESTIONS_PATH, JSON.stringify(userQuestions, null, 2));
    
    return newQuestion;
  } catch (error) {
    console.error('Error saving user question:', error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, question, recipient, subject } = await req.json();

    // Validate required fields
    if (!name || !email || !question || !recipient) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save the question for display in the FAQ page
    await saveUserQuestion({ name, email, question });

    // Configure email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'nexwebs.org@gmail.com',
        // Use an app password or environment variable in production
        // We'll use environment variables in production
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Setup email data
    const mailOptions = {
      from: `"NEXDEVS Question Form" <nexwebs.org@gmail.com>`,
      to: recipient,
      subject: subject || 'New Question from NEXDEVS FAQ Page',
      replyTo: email,
      text: `
Name: ${name}
Email: ${email}
Question: ${question}
      `,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
  <h2 style="color: #6b21a8; margin-bottom: 20px;">New Question from NEXDEVS FAQ Page</h2>
  
  <div style="margin-bottom: 15px;">
    <strong>Name:</strong> ${name}
  </div>
  
  <div style="margin-bottom: 15px;">
    <strong>Email:</strong> <a href="mailto:${email}">${email}</a>
  </div>
  
  <div style="margin-bottom: 20px;">
    <strong>Question:</strong>
    <p style="background-color: #f9f9f9; padding: 15px; border-radius: 4px; margin-top: 5px;">${question}</p>
  </div>
  
  <div style="color: #666; font-size: 12px; margin-top: 30px; padding-top: 10px; border-top: 1px solid #e0e0e0;">
    This message was sent from the NEXDEVS FAQ page.
  </div>
</div>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Return a successful response
    return NextResponse.json(
      { success: true, message: 'Question submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
} 