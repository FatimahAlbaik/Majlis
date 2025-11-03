import { User, Post, Feedback, Role, PostType, FeedbackStatus } from '../types.ts';

// --- USERS ---
const users: User[] = [
  {
    id: 'user-1',
    name: 'Alex Johnson',
    email: 'admin@majlis.local',
    password: 'Password123!',
    role: Role.Admin,
    avatarUrl: '',
    bio: 'Majlis coordinator and learning event organizer.',
    loginAttempts: 0,
    lockoutUntil: null,
  },
  {
    id: 'user-2',
    name: 'Maria Garcia',
    email: 'maria@majlis.local',
    password: 'Password123!',
    role: Role.Member,
    avatarUrl: '',
    bio: 'Cloud track mentor with a focus on serverless architecture.',
    loginAttempts: 0,
    lockoutUntil: null,
  },
  {
    id: 'user-3',
    name: 'Chen Wei',
    email: 'chen@majlis.local',
    password: 'Password123!',
    role: Role.Member,
    avatarUrl: '',
    bio: 'Frontend mentor specializing in modern UI/UX and accessibility.',
    loginAttempts: 0,
    lockoutUntil: null,
  },
   {
    id: 'user-4',
    name: 'David Miller',
    email: 'david@majlis.local',
    password: 'Password123!',
    role: Role.Member,
    avatarUrl: '',
    bio: 'Data Science mentor, helping with Python and machine learning.',
    loginAttempts: 0,
    lockoutUntil: null,
  },
  {
    id: 'user-5',
    name: 'Aisha Bello',
    email: 'aisha@majlis.local',
    password: 'Password123!',
    role: Role.Member,
    avatarUrl: '',
    bio: 'Project Management professional and agile coach.',
    loginAttempts: 0,
    lockoutUntil: null,
  },
  {
    id: 'user-6',
    name: 'Fatimah Al-Baik',
    email: 'fatimah@student.majlis.local',
    password: 'Password123!',
    role: Role.Student,
    avatarUrl: '',
    bio: 'Eager to learn about cloud technologies and DevOps.',
    cvUrl: '/sample-cv.pdf',
    loginAttempts: 0,
    lockoutUntil: null,
  },
  {
    id: 'user-7',
    name: 'Omar Khan',
    email: 'omar@student.majlis.local',
    password: 'Password123!',
    role: Role.Student,
    avatarUrl: '',
    bio: 'Aspiring full-stack developer.',
    cvUrl: '/sample-cv.pdf',
    loginAttempts: 0,
    lockoutUntil: null,
  },
    {
    id: 'user-8',
    name: 'Lina Haddad',
    email: 'lina@student.majlis.local',
    password: 'Password123!',
    role: Role.Student,
    avatarUrl: '',
    bio: 'Focusing on UI design and user experience research.',
    cvUrl: '/sample-cv.pdf',
    loginAttempts: 0,
    lockoutUntil: null,
  },
  {
    id: 'user-9',
    name: 'Yusuf Saleh',
    email: 'yusuf@student.majlis.local',
    password: 'Password123!',
    role: Role.Student,
    avatarUrl: '',
    bio: 'Learning data analysis with Python and SQL.',
    cvUrl: '/sample-cv.pdf',
    loginAttempts: 0,
    lockoutUntil: null,
  },
    {
    id: 'user-10',
    name: 'Sara Rahman',
    email: 'sara@student.majlis.local',
    password: 'Password123!',
    role: Role.Student,
    avatarUrl: '',
    bio: 'Interested in cybersecurity and network infrastructure.',
    cvUrl: '',
    loginAttempts: 0,
    lockoutUntil: null,
  },
];

// --- POSTS ---
const posts: Post[] = [
  {
    id: 'post-1',
    type: PostType.Announcement,
    title: 'Q3 Learning Summit Schedule',
    content: 'The schedule for our Q3 Learning Summit is now live! Please review the session list and register for the workshops you plan to attend. All sessions will be recorded.',
    author: users[0], // Admin
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    stars: 28,
    starredBy: [],
  },
  {
    id: 'post-2',
    type: PostType.Activity,
    title: 'Cloud Practitioner Study Group',
    content: 'Our weekly study group for the Cloud Practitioner certification meets on Tuesdays and Thursdays at 4 PM. All are welcome to join and prepare together.',
    author: users[1], // Member
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    stars: 42,
    starredBy: [],
    ratings: [
        { userId: 'user-6', rating: 5 }, { userId: 'user-7', rating: 5 }, { userId: 'user-8', rating: 4 },
        { userId: 'user-9', rating: 5 }, { userId: 'user-10', rating: 4 }, { userId: 'user-3', rating: 5 },
    ],
    averageRating: 4.67,
    ratingCount: 6,
    media: { url: 'https://images.unsplash.com/photo-1516542076529-1ea3854896f2?q=80&w=800', type: 'image' },
  },
  {
    id: 'post-3',
    type: PostType.Post,
    title: 'Great Resource for Learning TypeScript',
    content: 'I found this excellent tutorial series on advanced TypeScript patterns. It has really helped clarify concepts like generics and decorators. Highly recommend for frontend developers!',
    author: users[6], // Student
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    stars: 76,
    starredBy: [],
  },
  {
    id: 'post-4',
    type: PostType.Post,
    title: 'Thanks to the Mentors!',
    content: 'Just wanted to give a huge thank you to the mentors for their time and guidance over the past few weeks. The mock interview sessions were incredibly helpful.',
    author: users[7], // Student
    createdAt: new Date().toISOString(),
    stars: 9,
    starredBy: [],

  },
  {
    id: 'post-5',
    type: PostType.Activity,
    title: 'Data Visualization Workshop Recap',
    content: 'For those who missed it, here is a summary of our workshop on data visualization with D3.js. You can find the code examples and presentation slides attached.',
    author: users[4], // Member
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    stars: 17,
    starredBy: [],
    ratings: [
        { userId: 'user-6', rating: 4 }, { userId: 'user-7', rating: 5 }, { userId: 'user-8', rating: 5 },
    ],
    averageRating: 4.67,
    ratingCount: 3,
  },
    {
    id: 'post-6',
    type: PostType.Activity,
    title: 'Mock Interview Circle',
    content: 'We are starting a new mock interview circle for students preparing for technical interviews. This is a great opportunity to practice and get constructive feedback.',
    author: users[2], // Member
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    stars: 55,
    starredBy: [],
    ratings: [
        { userId: 'user-6', rating: 5 }, { userId: 'user-7', rating: 5 }, { userId: 'user-8', rating: 5 },
        { userId: 'user-9', rating: 5 }, { userId: 'user-10', rating: 5 },
    ],
    averageRating: 5,
    ratingCount: 5,
    media: { url: 'https://videos.pexels.com/video-files/3209828/3209828-sd_640_360_25fps.mp4', type: 'video' },
  },
];

// --- FEEDBACK ---
const feedback: Feedback[] = [
  {
    id: 'feedback-1',
    author: users[6], // Student
    title: 'Improve onboarding checklist',
    content: 'The initial onboarding checklist for new members could be more detailed. Specifically, adding a step about setting up local development environments would be helpful.',
    status: FeedbackStatus.Pending,
    isAnonymous: false,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'feedback-2',
    author: users[7], // Student
    title: 'Clarify role upgrade process',
    content: 'It would be beneficial to have a clear document outlining the criteria and process for a Student to be promoted to a Member role.',
    status: FeedbackStatus.Pending,
    isAnonymous: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'feedback-3',
    author: users[2], // Member
    title: 'Add keyboard shortcuts',
    content: 'For power users, adding keyboard shortcuts for common actions like creating a post or submitting feedback would improve efficiency.',
    status: FeedbackStatus.Opened,
    isAnonymous: false,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    reply: 'Thank you for the suggestion! We have added this to our development backlog for the next release cycle. We appreciate your input on improving the platform experience.',
  },
];

export const mockData = {
  users,
  posts,
  feedback,
};