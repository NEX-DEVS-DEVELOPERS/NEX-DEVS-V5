import mongoose, { Schema } from 'mongoose';

// Define Project schema
export interface IProject {
  title: string;
  description: string;
  status: 'In Development' | 'Beta Testing' | 'Live';
  features: string[];
  technologies: string[];
  progressPercentage: number;
  liveUrl: string;
  sourceCodeUrl: string;
  updatedDays: number;
  isNewlyAdded: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { 
      type: String, 
      required: true,
      enum: ['In Development', 'Beta Testing', 'Live']
    },
    features: [{ type: String }],
    technologies: [{ type: String }],
    progressPercentage: { 
      type: Number, 
      required: true,
      min: 0,
      max: 100
    },
    liveUrl: { type: String, required: true },
    sourceCodeUrl: { type: String, required: true },
    updatedDays: { type: Number, default: 0 },
    isNewlyAdded: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Check if model already exists (for hot reloading in development)
export const Project = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema); 
