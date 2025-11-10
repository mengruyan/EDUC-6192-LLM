
export enum UserRole {
  Teacher = 'Teacher',
  Student = 'Student',
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // This is for simulation only. NEVER store plaintext passwords.
  role: UserRole;
}

export interface RubricCriterion {
  id: string;
  name:string;
  maxPoints: number;
}

export interface ExampleSubmission {
  id: string;
  type: 'high' | 'medium' | 'low';
  description: string;
}

export interface Assignment {
  id: string;
  title: string;
  instructions: string;
  rubric: RubricCriterion[];
  examples: ExampleSubmission[];
  requirements: {
    text: boolean;
    audio: boolean;
    image: boolean;
  };
}

export interface FeedbackScore {
 criterionId: string;
 score: number;
 justification: string;
}

export interface Feedback {
  strengths: string[];
  suggestions: string[];
  scores: FeedbackScore[];
  overallComment: string;
  textAnalysis: {
    feedback: string;
  };
  imageAnalysis: {
    relevanceAndSupport: string;
    contextualFeedback: string;
  };
  audioAnalysis: {
    contentAccuracy: string;
    deliveryAndPronunciation: string;
  };
}

export interface Submission {
  assignmentId: string;
  studentId: string;
  studentName: string;
  timestamp: number;
  text: string;
  audioUrl?: string;
  imageUrls?: string[];
  status: 'draft' | 'submitted' | 'graded';
  feedback?: Feedback;
}