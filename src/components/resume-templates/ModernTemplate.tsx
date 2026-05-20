import React from 'react';
import { ResumeData } from '../../types';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

interface ModernTemplateProps {
  data: ResumeData;
  themeColor?: string;
}

export function ModernTemplate({ data, themeColor = '#4F46E5' }: ModernTemplateProps) {
  const { personalInfo, experience, education, skills } = data;

  const rootStyle = {
    '--accent': themeColor,
    '--accent-light': `${themeColor}20`, // 12% ~ 20% opacity in hex for background
  } as React.CSSProperties;

  return (
    <div className="w-[210mm] min-h-[297mm] bg-[#ffffff] text-[#333333] flex flex-col font-sans shrink-0 print:w-full print:h-full p-[40px] leading-[1.6] box-border mx-auto" style={rootStyle}>
      {/* Header Section */}
      <div className="text-center border-b-2 pb-[20px] mb-[25px]" style={{ borderColor: 'var(--accent)' }}>
        {personalInfo.photoUrl && (
          <img 
            src={personalInfo.photoUrl} 
            alt="Profile" 
            className="w-[100px] h-[100px] rounded-full object-cover mb-[15px] mx-auto border-[3px] print:border-[3px] print:-webkit-print-color-adjust:exact print:color-adjust:exact" 
            style={{ borderColor: 'var(--accent)' }} 
          />
        )}
        <h1 className="text-[2.2rem] font-bold m-0 text-[#111] tracking-[-0.5px]">
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <h2 className="text-[1.2rem] font-medium my-[5px] mx-0" style={{ color: 'var(--accent)' }}>
          {personalInfo.jobTitle || 'Your Job Title'}
        </h2>
        
        <div className="text-[0.9rem] text-[#555] flex justify-center gap-[15px] flex-wrap mt-2">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.yearsOfExperience && <span>Exp: {personalInfo.yearsOfExperience}</span>}
        </div>
        
        {personalInfo.bio && (
          <div className="text-[0.95rem] mt-[15px] text-[#444] max-w-[90%] mx-auto">
            {personalInfo.bio}
          </div>
        )}
      </div>

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-[25px]">
          <h3 className="text-[1.1rem] font-bold border-b border-[#eee] pb-[5px] mb-[15px] uppercase tracking-[1px]" style={{ color: 'var(--accent)' }}>
            Experience
          </h3>
          {experience.map(exp => (
            <div key={exp.id} className="mb-[18px] break-inside-avoid print:break-inside-avoid">
              <div className="flex justify-between items-baseline mb-[4px]">
                <div className="font-bold text-[1.05rem] text-[#222]">{exp.position}</div>
                <div className="text-[0.9rem] font-semibold" style={{ color: 'var(--accent)' }}>
                  {exp.startDate} - {exp.endDate}
                </div>
              </div>
              <div className="text-[0.95rem] text-[#555] italic mb-[6px]">{exp.company}</div>
              <div className="text-[0.95rem] text-[#444] whitespace-pre-line leading-[1.6]">
                {exp.description}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-[25px]">
          <h3 className="text-[1.1rem] font-bold border-b border-[#eee] pb-[5px] mb-[15px] uppercase tracking-[1px]" style={{ color: 'var(--accent)' }}>
            Education
          </h3>
          {education.map(edu => (
            <div key={edu.id} className="mb-[18px] break-inside-avoid print:break-inside-avoid">
              <div className="flex justify-between items-baseline mb-[4px]">
                <div className="font-bold text-[1.05rem] text-[#222]">{edu.degree}</div>
                <div className="text-[0.9rem] font-semibold" style={{ color: 'var(--accent)' }}>
                  {edu.startDate} - {edu.endDate}
                </div>
              </div>
              <div className="text-[0.95rem] text-[#555] italic mb-[6px]">{edu.institution}</div>
              {edu.description && (
                <div className="text-[0.95rem] text-[#444] whitespace-pre-line leading-[1.6]">
                  {edu.description}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <div className="mb-[25px]">
          <h3 className="text-[1.1rem] font-bold border-b border-[#eee] pb-[5px] mb-[15px] uppercase tracking-[1px]" style={{ color: 'var(--accent)' }}>
            Projects
          </h3>
          {data.projects.map(proj => (
            <div key={proj.id} className="mb-[18px] break-inside-avoid print:break-inside-avoid">
              <div className="flex justify-between items-baseline mb-[4px]">
                <div className="font-bold text-[1.05rem] text-[#222]">{proj.name}</div>
                {proj.link && (
                  <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-[0.9rem] font-semibold hover:underline" style={{ color: 'var(--accent)' }}>
                    {proj.link}
                  </a>
                )}
              </div>
              <div className="text-[0.95rem] text-[#444] whitespace-pre-line mt-[4px] leading-[1.6]">
                {proj.description}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-[25px] break-inside-avoid print:break-inside-avoid">
          <h3 className="text-[1.1rem] font-bold border-b border-[#eee] pb-[5px] mb-[15px] uppercase tracking-[1px]" style={{ color: 'var(--accent)' }}>
            Skills & Expertise
          </h3>
          <div className="flex flex-wrap gap-[8px]">
            {skills.map(skill => (
              <span key={skill.id} className="bg-[#f3f4f6] text-[#333] px-[12px] py-[4px] rounded-[20px] text-[0.85rem] font-medium border border-[#e5e7eb] print:-webkit-print-color-adjust:exact print:color-adjust:exact">
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
