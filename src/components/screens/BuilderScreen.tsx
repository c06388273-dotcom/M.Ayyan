import React, { useState } from 'react';
import { ResumeData, Experience, Education } from '../../types';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { User, Briefcase, GraduationCap, Code, Plus, Trash2, Wand2, GripVertical } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface BuilderScreenProps {
  data: ResumeData;
  updateData: (data: ResumeData) => void;
  onGenerateAI: (bioContext: string) => Promise<string>;
}

export function BuilderScreen({ data, updateData, onGenerateAI }: BuilderScreenProps) {
  const [activeTab, setActiveTab] = useState<'personal' | 'experience' | 'education' | 'skills'>('personal');
  const [isGenerating, setIsGenerating] = useState(false);

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateData({
      ...data,
      personalInfo: { ...data.personalInfo, [e.target.name]: e.target.value }
    });
  };

  const handleAIGenerate = async () => {
    const context = `${data.personalInfo.fullName}, a ${data.personalInfo.jobTitle} with experience in ${data.skills.map(s => s.name).join(', ')}`;
    setIsGenerating(true);
    try {
      const result = await onGenerateAI(context);
      if (result) {
        updateData({
          ...data,
          personalInfo: { ...data.personalInfo, bio: result }
        });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const addExperience = () => {
    updateData({
      ...data,
      experience: [
        ...data.experience,
        { id: uuidv4(), company: '', position: '', startDate: '', endDate: '', description: '' }
      ]
    });
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    updateData({
      ...data,
      experience: data.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    });
  };

  const removeExperience = (id: string) => {
    updateData({
      ...data,
      experience: data.experience.filter(exp => exp.id !== id)
    });
  };

  const addEducation = () => {
    updateData({
      ...data,
      education: [
        ...data.education,
        { id: uuidv4(), institution: '', degree: '', startDate: '', endDate: '', description: '' }
      ]
    });
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    updateData({
      ...data,
      education: data.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
    });
  };

  const removeEducation = (id: string) => {
    updateData({
      ...data,
      education: data.education.filter(edu => edu.id !== id)
    });
  };
  
  const [newSkill, setNewSkill] = useState('');
  const addSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    updateData({
      ...data,
      skills: [...data.skills, { id: uuidv4(), name: newSkill.trim() }]
    });
    setNewSkill('');
  };

  const removeSkill = (id: string) => {
    updateData({
      ...data,
      skills: data.skills.filter(s => s.id !== id)
    });
  };

  const addProject = () => {
    updateData({
      ...data,
      projects: [
        ...(data.projects || []),
        { id: uuidv4(), name: '', link: '', description: '' }
      ]
    });
  };

  const updateProject = (id: string, field: keyof import('../../types').Project, value: string) => {
    updateData({
      ...data,
      projects: (data.projects || []).map(p => p.id === id ? { ...p, [field]: value } : p)
    });
  };

  const removeProject = (id: string) => {
    updateData({
      ...data,
      projects: (data.projects || []).filter(p => p.id !== id)
    });
  };

  const tabs = [
    { id: 'personal', icon: User, label: 'Personal' },
    { id: 'experience', icon: Briefcase, label: 'Experience' },
    { id: 'education', icon: GraduationCap, label: 'Education' },
    { id: 'skills', icon: Code, label: 'Skills' },
  ] as const;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto w-full p-4 sm:p-6 pb-24"
    >
      <div className="glass-card overflow-hidden">
        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-slate-200 dark:border-slate-800 scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-colors relative ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800/50 h-1.5 flex">
          <motion.div 
            className="h-full bg-indigo-500 dark:bg-indigo-400"
            initial={{ width: '25%' }}
            animate={{ 
              width: activeTab === 'personal' ? '25%' : 
                     activeTab === 'experience' ? '50%' : 
                     activeTab === 'education' ? '75%' : '100%' 
            }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-8 min-h-[500px]">
          <AnimatePresence mode="wait">
            {activeTab === 'personal' && (
              <motion.div 
                key="personal"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                <div className="flex flex-col items-center sm:items-start mb-6">
                  <div className="relative group/avatar cursor-pointer">
                    <img 
                      src={data.personalInfo.photoUrl || "https://ui-avatars.com/api/?name=" + encodeURIComponent(data.personalInfo.fullName || "User") + "&background=F3F4F6&color=4F46E5&size=128"} 
                      alt="Profile" 
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-white dark:border-slate-800 shadow-md transition-shadow group-hover/avatar:shadow-lg"
                    />
                    <label htmlFor="profile-img" className="absolute -bottom-3 -right-3 bg-indigo-600 text-white p-2.5 rounded-full shadow-lg cursor-pointer hover:bg-indigo-700 transition-colors hover:scale-105 active:scale-95">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    </label>
                    <input 
                      type="file" 
                      id="profile-img" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              updateData({
                                ...data,
                                personalInfo: { ...data.personalInfo, photoUrl: event.target.result as string }
                              });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative group/input">
                    <input type="text" id="fullName" name="fullName" value={data.personalInfo.fullName} onChange={handlePersonalInfoChange} className="peer w-full px-4 pt-6 pb-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 dark:text-white" placeholder=" " />
                    <label htmlFor="fullName" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-base transition-all peer-focus:top-4 peer-focus:text-xs peer-focus:text-indigo-600 dark:peer-focus:text-indigo-400 peer-[&:not(:placeholder-shown)]:top-4 peer-[&:not(:placeholder-shown)]:text-xs pointer-events-none">Full Name</label>
                  </div>
                  <div className="relative group/input">
                    <input type="text" id="jobTitle" name="jobTitle" value={data.personalInfo.jobTitle} onChange={handlePersonalInfoChange} className="peer w-full px-4 pt-6 pb-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 dark:text-white" placeholder=" " />
                    <label htmlFor="jobTitle" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-base transition-all peer-focus:top-4 peer-focus:text-xs peer-focus:text-indigo-600 dark:peer-focus:text-indigo-400 peer-[&:not(:placeholder-shown)]:top-4 peer-[&:not(:placeholder-shown)]:text-xs pointer-events-none">Target Job Title</label>
                  </div>
                  <div className="relative group/input">
                    <input type="email" id="email" name="email" value={data.personalInfo.email} onChange={handlePersonalInfoChange} className="peer w-full px-4 pt-6 pb-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 dark:text-white" placeholder=" " />
                    <label htmlFor="email" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-base transition-all peer-focus:top-4 peer-focus:text-xs peer-focus:text-indigo-600 dark:peer-focus:text-indigo-400 peer-[&:not(:placeholder-shown)]:top-4 peer-[&:not(:placeholder-shown)]:text-xs pointer-events-none">Email Address</label>
                  </div>
                  <div className="relative group/input">
                    <input type="tel" id="phone" name="phone" value={data.personalInfo.phone} onChange={handlePersonalInfoChange} className="peer w-full px-4 pt-6 pb-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 dark:text-white" placeholder=" " />
                    <label htmlFor="phone" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-base transition-all peer-focus:top-4 peer-focus:text-xs peer-focus:text-indigo-600 dark:peer-focus:text-indigo-400 peer-[&:not(:placeholder-shown)]:top-4 peer-[&:not(:placeholder-shown)]:text-xs pointer-events-none">Phone Number</label>
                  </div>
                  <div className="relative group/input">
                    <input type="text" id="yearsOfExperience" name="yearsOfExperience" value={data.personalInfo.yearsOfExperience || ''} onChange={handlePersonalInfoChange} className="peer w-full px-4 pt-6 pb-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 dark:text-white" placeholder=" " />
                    <label htmlFor="yearsOfExperience" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-base transition-all peer-focus:top-4 peer-focus:text-xs peer-focus:text-indigo-600 dark:peer-focus:text-indigo-400 peer-[&:not(:placeholder-shown)]:top-4 peer-[&:not(:placeholder-shown)]:text-xs pointer-events-none">Years of Experience</label>
                  </div>
                </div>
                
                <div className="relative group/input mt-6">
                  <textarea 
                    id="bio"
                    name="bio" 
                    value={data.personalInfo.bio} 
                    onChange={handlePersonalInfoChange} 
                    rows={4} 
                    className="peer w-full px-4 pt-8 pb-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none text-slate-900 dark:text-white" 
                    placeholder=" "
                  />
                  <label htmlFor="bio" className="absolute left-4 top-6 -translate-y-1/2 text-slate-500 text-base transition-all peer-focus:top-4 peer-focus:text-xs peer-focus:text-indigo-600 dark:peer-focus:text-indigo-400 peer-[&:not(:placeholder-shown)]:top-4 peer-[&:not(:placeholder-shown)]:text-xs pointer-events-none">Professional Bio / Objective</label>
                  <button 
                    onClick={handleAIGenerate}
                    disabled={isGenerating}
                    className="absolute top-2 right-2 text-xs font-medium text-white flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 shadow-sm"
                  >
                    <Wand2 size={14} className={isGenerating ? "animate-pulse" : ""} /> 
                    {isGenerating ? "Generating..." : "AI Write"}
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'experience' && (
              <motion.div 
                key="experience"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                <Reorder.Group axis="y" values={data.experience} onReorder={(newOrder) => updateData({ ...data, experience: newOrder })} className="space-y-6">
                  {data.experience.length === 0 && (
                    <div className="text-center py-10 px-4 text-slate-500 font-medium">
                      No entries added yet. Start by adding your professional experience.
                    </div>
                  )}
                  {data.experience.map((exp, index) => (
                    <Reorder.Item key={exp.id} value={exp} className="relative group bg-slate-50/50 dark:bg-slate-800/30 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50 pt-10">
                      <div className="absolute top-3 left-4 text-slate-400 cursor-grab active:cursor-grabbing hover:text-slate-600 dark:hover:text-slate-300">
                        <GripVertical size={16} />
                      </div>
                      <button onClick={() => removeExperience(exp.id)} className="absolute top-3 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 size={18} />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-500">Company</label>
                          <input type="text" value={exp.company} onChange={e => updateExperience(exp.id, 'company', e.target.value)} className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 pb-1 focus:border-indigo-500 outline-none text-slate-900 dark:text-gray-100" placeholder="Company Name" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-500">Position</label>
                          <input type="text" value={exp.position} onChange={e => updateExperience(exp.id, 'position', e.target.value)} className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 pb-1 focus:border-indigo-500 outline-none text-slate-900 dark:text-gray-100" placeholder="Job Title" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-500">Start Date</label>
                          <input type="text" value={exp.startDate} onChange={e => updateExperience(exp.id, 'startDate', e.target.value)} className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 pb-1 focus:border-indigo-500 outline-none text-slate-900 dark:text-gray-100" placeholder="MM/YYYY" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-500">End Date</label>
                          <input type="text" value={exp.endDate} onChange={e => updateExperience(exp.id, 'endDate', e.target.value)} className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 pb-1 focus:border-indigo-500 outline-none text-slate-900 dark:text-gray-100" placeholder="Present or MM/YYYY" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">Description</label>
                        <textarea value={exp.description} onChange={e => updateExperience(exp.id, 'description', e.target.value)} rows={3} className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 pb-1 focus:border-indigo-500 outline-none resize-none pt-2 text-slate-900 dark:text-gray-100" placeholder="Describe your achievements and responsibilities..." />
                      </div>
                    </Reorder.Item>
                  ))}
                  
                  <button onClick={addExperience} className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:text-indigo-600 hover:border-indigo-300 dark:hover:border-indigo-700 flex items-center justify-center gap-2 transition-colors">
                    <Plus size={18} /> Add Experience
                  </button>
                </Reorder.Group>
              </motion.div>
            )}

            {activeTab === 'education' && (
              <motion.div 
                key="education"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
              >
                <Reorder.Group axis="y" values={data.education} onReorder={(newOrder) => updateData({ ...data, education: newOrder })} className="space-y-6">
                  {data.education.length === 0 && (
                    <div className="text-center py-10 px-4 text-slate-500 font-medium">
                      No entries added yet. Tell us about your educational background.
                    </div>
                  )}
                  {data.education.map((edu) => (
                    <Reorder.Item key={edu.id} value={edu} className="relative group bg-slate-50/50 dark:bg-slate-800/30 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50 pt-10">
                      <div className="absolute top-3 left-4 text-slate-400 cursor-grab active:cursor-grabbing hover:text-slate-600 dark:hover:text-slate-300">
                        <GripVertical size={16} />
                      </div>
                      <button onClick={() => removeEducation(edu.id)} className="absolute top-3 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 size={18} />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-500">Institution</label>
                          <input type="text" value={edu.institution} onChange={e => updateEducation(edu.id, 'institution', e.target.value)} className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 pb-1 focus:border-indigo-500 outline-none text-slate-900 dark:text-gray-100" placeholder="University / School Name" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-500">Degree</label>
                          <input type="text" value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 pb-1 focus:border-indigo-500 outline-none text-slate-900 dark:text-gray-100" placeholder="B.S. Computer Science" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-500">Start Date</label>
                          <input type="text" value={edu.startDate} onChange={e => updateEducation(edu.id, 'startDate', e.target.value)} className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 pb-1 focus:border-indigo-500 outline-none text-slate-900 dark:text-gray-100" placeholder="YYYY" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-500">End Date</label>
                          <input type="text" value={edu.endDate} onChange={e => updateEducation(edu.id, 'endDate', e.target.value)} className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 pb-1 focus:border-indigo-500 outline-none text-slate-900 dark:text-gray-100" placeholder="YYYY" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">Additional Details</label>
                        <input type="text" value={edu.description} onChange={e => updateEducation(edu.id, 'description', e.target.value)} className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 pb-1 focus:border-indigo-500 outline-none text-slate-900 dark:text-gray-100" placeholder="Honors, relevant coursework, etc." />
                      </div>
                    </Reorder.Item>
                  ))}
                  
                  <button onClick={addEducation} className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:text-indigo-600 hover:border-indigo-300 dark:hover:border-indigo-700 flex items-center justify-center gap-2 transition-colors">
                    <Plus size={18} /> Add Education
                  </button>
                </Reorder.Group>
              </motion.div>
            )}

            {activeTab === 'skills' && (
              <motion.div 
                key="skills-projects"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-8"
              >
                <div>
                  <h3 className="text-lg font-display font-semibold mb-4 text-slate-800 dark:text-slate-200">Technical & Soft Skills</h3>
                  <form onSubmit={addSkill} className="flex gap-2 mb-4">
                    <input 
                      type="text" 
                      value={newSkill} 
                      onChange={e => setNewSkill(e.target.value)}
                      placeholder="e.g. JavaScript, UI/UX (Enter to add)"
                      className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <button type="submit" disabled={!newSkill.trim()} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center gap-2">
                       Add
                    </button>
                  </form>

                  <div className="flex flex-wrap gap-2">
                    <AnimatePresence>
                      {data.skills.map(_skill => (
                        <motion.div
                          key={_skill.id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg shadow-sm"
                        >
                          <GripVertical size={14} className="text-slate-400 hidden sm:block" />
                          <span className="text-sm font-medium">{_skill.name}</span>
                          <button onClick={() => removeSkill(_skill.id)} className="text-slate-400 hover:text-red-500 ml-1">
                            <Trash2 size={14} />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
                  <h3 className="text-lg font-display font-semibold mb-4 text-slate-800 dark:text-slate-200">Projects</h3>
                  <Reorder.Group axis="y" values={data.projects || []} onReorder={(newOrder) => updateData({ ...data, projects: newOrder })} className="space-y-4">
                    {(!data.projects || data.projects.length === 0) && (
                      <div className="text-center py-6 px-4 text-slate-500 font-medium text-sm">
                        No projects added yet.
                      </div>
                    )}
                    {(data.projects || []).map((proj) => (
                      <Reorder.Item key={proj.id} value={proj} className="relative group bg-slate-50/50 dark:bg-slate-800/30 p-5 rounded-xl border border-slate-100 dark:border-slate-700/50 pt-10">
                        <div className="absolute top-3 left-4 text-slate-400 cursor-grab active:cursor-grabbing hover:text-slate-600 dark:hover:text-slate-300">
                          <GripVertical size={16} />
                        </div>
                        <button onClick={() => removeProject(proj.id)} className="absolute top-3 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 size={18} />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-500">Project Name</label>
                            <input type="text" value={proj.name} onChange={e => updateProject(proj.id, 'name', e.target.value)} className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 pb-1 focus:border-indigo-500 outline-none text-slate-900 dark:text-gray-100" placeholder="e.g. Portfolio Website" />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-500">Link</label>
                            <input type="text" value={proj.link} onChange={e => updateProject(proj.id, 'link', e.target.value)} className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 pb-1 focus:border-indigo-500 outline-none text-slate-900 dark:text-gray-100" placeholder="e.g. https://github.com/..." />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-slate-500">Description</label>
                          <textarea value={proj.description} onChange={e => updateProject(proj.id, 'description', e.target.value)} rows={2} className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 pb-1 focus:border-indigo-500 outline-none resize-none pt-2 text-slate-900 dark:text-gray-100" placeholder="Briefly describe the project..." />
                        </div>
                      </Reorder.Item>
                    ))}
                    <button onClick={addProject} className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:text-indigo-600 hover:border-indigo-300 dark:hover:border-indigo-700 flex items-center justify-center gap-2 transition-colors">
                      <Plus size={18} /> Add Project
                    </button>
                  </Reorder.Group>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Actions */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center rounded-b-2xl">
          <button 
            onClick={() => setActiveTab(tabs[Math.max(0, tabs.findIndex(t => t.id === activeTab) - 1)].id)}
            disabled={activeTab === 'personal'}
            className="px-5 py-2 text-slate-600 dark:text-slate-300 font-medium hover:text-slate-900 dark:hover:text-white transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            Back
          </button>
          
          <button 
            onClick={() => {
              const currIdx = tabs.findIndex(t => t.id === activeTab);
              if (currIdx < tabs.length - 1) {
                setActiveTab(tabs[currIdx + 1].id);
              }
            }}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-sm disabled:opacity-50"
            style={{ display: activeTab === 'skills' ? 'none' : 'block' }}
          >
            Next Step
          </button>
        </div>
      </div>
    </motion.div>
  );
}
