import { ResumeData } from './types';
import { v4 as uuidv4 } from 'uuid';

export const initialDbData: ResumeData = {
  personalInfo: {
    fullName: "Alex Rivera",
    jobTitle: "Senior Frontend Engineer",
    email: "alex.rivera@example.com",
    phone: "+1 (555) 123-4567",
    bio: "Passionate and detail-oriented Frontend Engineer with over 5 years of experience specialized in building scalable React applications and design systems. Adept at turning complex problems into elegant, user-centric solutions.",
    photoUrl: ""
  },
  experience: [
    {
      id: "1",
      company: "TechNova Solutions",
      position: "Senior Frontend Developer",
      startDate: "2021-03",
      endDate: "Present",
      description: "Spearheaded the migration of a legacy monolithic application to a modern React SPA, improving load times by 40%. Led a team of 3 junior developers and established code review guidelines."
    },
    {
      id: "2",
      company: "Creative Digital Agency",
      position: "Web Developer",
      startDate: "2018-06",
      endDate: "2021-02",
      description: "Developed and maintained 15+ client websites using React, Next.js, and Tailwind CSS. Collaborated directly with UI/UX designers to translate Figma mockups into pixel-perfect interfaces."
    }
  ],
  education: [
    {
      id: "1",
      institution: "State University",
      degree: "B.S. Computer Science",
      startDate: "2014",
      endDate: "2018",
      description: "Graduated with Honors. Minor in Digital Design."
    }
  ],
  skills: [
    { id: "1", name: "React / React Native" },
    { id: "2", name: "TypeScript" },
    { id: "3", name: "Tailwind CSS" },
    { id: "4", name: "Node.js" },
    { id: "5", name: "Figma" },
    { id: "6", name: "System Architecture" },
  ],
  projects: [
    {
      id: "1",
      name: "ResumeAI Builder",
      link: "https://resumeai.demo",
      description: "An AI-powered resume builder allowing users to generate and export customized ATS-friendly resumes."
    }
  ]
};

export const emptyResumeData: ResumeData = {
  personalInfo: {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    bio: "",
    photoUrl: ""
  },
  experience: [],
  education: [],
  skills: [],
  projects: []
};
