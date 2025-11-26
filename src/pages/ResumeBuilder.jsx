import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { 
    Upload, FileText, Sparkles, Download, Eye, Plus, Trash2, 
    User, Mail, Phone, MapPin, Linkedin, Globe, Briefcase, 
    GraduationCap, Award, Loader2, Check, ChevronLeft, Menu
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { LOGO_URL, menuItems, footerLinks } from '../components/NavigationConfig';
import GlobalSearchBar from '../components/GlobalSearchBar';

const TEMPLATES = [
    { id: 'modern-pro', name: 'Modern Professional', category: 'Modern', color: '#6B4EE6' },
    { id: 'clean-minimal', name: 'Clean Minimal', category: 'Modern', color: '#3B82F6' },
    { id: 'bold-impact', name: 'Bold Impact', category: 'Modern', color: '#EC4899' },
    { id: 'tech-forward', name: 'Tech Forward', category: 'Modern', color: '#10B981' },
    { id: 'executive', name: 'Executive Classic', category: 'Classic', color: '#1F2937' },
    { id: 'traditional', name: 'Traditional Pro', category: 'Classic', color: '#374151' },
    { id: 'creative', name: 'Creative Canvas', category: 'Creative', color: '#F59E0B' },
    { id: 'designer', name: 'Designer Portfolio', category: 'Creative', color: '#8B5CF6' },
];

export default function ResumeBuilder() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('builder');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedResume, setGeneratedResume] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState('modern-pro');
    const fileInputRef = useRef(null);

    // Form state
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        portfolio: '',
        careerWriteup: '',
        jobPostingUrl: '',
        pageLength: '2',
        toneLevel: 'mid-level',
        generateCoverLetter: false,
        talkingPoints: []
    });

    const [newTalkingPoint, setNewTalkingPoint] = useState('');

    // Responsive sidebar
    React.useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setSidebarOpen(true);
            } else {
                setSidebarOpen(false);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const addTalkingPoint = () => {
        if (newTalkingPoint.trim()) {
            setFormData(prev => ({
                ...prev,
                talkingPoints: [...prev.talkingPoints, newTalkingPoint.trim()]
            }));
            setNewTalkingPoint('');
        }
    };

    const removeTalkingPoint = (index) => {
        setFormData(prev => ({
            ...prev,
            talkingPoints: prev.talkingPoints.filter((_, i) => i !== index)
        }));
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const { file_url } = await base44.integrations.Core.UploadFile({ file });
            const extracted = await base44.integrations.Core.ExtractDataFromUploadedFile({
                file_url,
                json_schema: {
                    type: "object",
                    properties: {
                        fullName: { type: "string" },
                        email: { type: "string" },
                        phone: { type: "string" },
                        location: { type: "string" },
                        experience: { type: "string" },
                        education: { type: "string" },
                        skills: { type: "string" }
                    }
                }
            });

            if (extracted?.output) {
                setFormData(prev => ({
                    ...prev,
                    fullName: extracted.output.fullName || prev.fullName,
                    email: extracted.output.email || prev.email,
                    phone: extracted.output.phone || prev.phone,
                    location: extracted.output.location || prev.location,
                    careerWriteup: [extracted.output.experience, extracted.output.education, extracted.output.skills].filter(Boolean).join('\n\n') || prev.careerWriteup
                }));
            }
        } catch (error) {
            console.error('File upload error:', error);
        }
    };

    const generateResume = async () => {
        setIsGenerating(true);
        try {
            const prompt = `Generate a professional ${formData.toneLevel} resume for:
Name: ${formData.fullName}
Email: ${formData.email}
Phone: ${formData.phone}
Location: ${formData.location}
LinkedIn: ${formData.linkedin}
Portfolio: ${formData.portfolio}

Career Background:
${formData.careerWriteup}

${formData.jobPostingUrl ? `Target Job Posting: ${formData.jobPostingUrl}` : ''}
${formData.talkingPoints.length > 0 ? `Key Points to Emphasize:\n${formData.talkingPoints.join('\n')}` : ''}

Generate a ${formData.pageLength} page resume with:
- Professional summary
- Work experience with achievements
- Education
- Skills section
- ${formData.generateCoverLetter ? 'Also generate a cover letter' : ''}`;

            const response = await base44.integrations.Core.InvokeLLM({
                prompt,
                add_context_from_internet: !!formData.jobPostingUrl,
                response_json_schema: {
                    type: "object",
                    properties: {
                        summary: { type: "string" },
                        experience: { type: "array", items: { type: "object", properties: { title: { type: "string" }, company: { type: "string" }, duration: { type: "string" }, achievements: { type: "array", items: { type: "string" } } } } },
                        education: { type: "array", items: { type: "object", properties: { degree: { type: "string" }, school: { type: "string" }, year: { type: "string" } } } },
                        skills: { type: "array", items: { type: "string" } },
                        coverLetter: { type: "string" }
                    }
                }
            });

            setGeneratedResume(response);
            setActiveTab('resume');
        } catch (error) {
            console.error('Resume generation error:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const template = TEMPLATES.find(t => t.id === selectedTemplate);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <header className="bg-white sticky top-0 z-40 border-b border-gray-200 shadow-sm h-[72px]">
                <div className="flex items-center justify-between px-4 h-full">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="hover:bg-gray-100 md:hidden">
                            <Menu className="w-5 h-5 text-purple-600" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="hover:bg-gray-100 hidden md:flex">
                            {sidebarOpen ? <ChevronLeft className="w-5 h-5 text-purple-600" /> : <Menu className="w-5 h-5 text-purple-600" />}
                        </Button>
                        <Link to={createPageUrl('Home')} className="flex items-center gap-3 hover:opacity-80">
                            <img src={LOGO_URL} alt="1cPublishing" className="h-10 w-10 object-contain" />
                            <div className="hidden sm:block">
                                <span className="text-xl font-bold text-gray-900">1cPublishing</span>
                                <p className="text-xs font-medium text-purple-600">AI Powered</p>
                            </div>
                        </Link>
                    </div>

                    <GlobalSearchBar placeholder="Search templates, tips..." className="flex-1 max-w-xl mx-4 md:mx-8" />

                    <div className="w-10 md:w-20" />
                </div>
            </header>

            <div className="flex flex-1">
                {/* Mobile Overlay */}
                {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

                {/* Sidebar */}
                <aside className={`${sidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full md:translate-x-0'} transition-all duration-300 overflow-hidden bg-white border-r border-gray-200 flex-shrink-0 fixed md:relative z-50 md:z-auto h-[calc(100vh-72px)] md:h-auto`}>
                    <nav className="p-4 space-y-2">
                        {menuItems.map((item, index) => (
                            <Link key={index} to={item.href} onClick={() => window.innerWidth < 768 && setSidebarOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${item.label === 'Resume Builder' ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'}`}>
                                <item.icon className="w-5 h-5 text-purple-600" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-auto">
                    <div className="p-4 md:p-6">
                        {/* Tabs */}
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                                        <FileText className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">Resume Builder</h1>
                                        <p className="text-gray-500 text-sm">AI-powered professional resumes</p>
                                    </div>
                                </div>
                                <TabsList className="bg-gray-100">
                                    <TabsTrigger value="builder" className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> Builder</TabsTrigger>
                                    <TabsTrigger value="resume" className="flex items-center gap-2"><FileText className="w-4 h-4" /> Resume</TabsTrigger>
                                    <TabsTrigger value="export" className="flex items-center gap-2"><Download className="w-4 h-4" /> Export</TabsTrigger>
                                </TabsList>
                            </div>

                            {/* Builder Tab */}
                            <TabsContent value="builder">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Left Column - Career Info */}
                                    <div className="lg:col-span-1 space-y-6">
                                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                            <h2 className="font-semibold text-gray-900 mb-4">Career Information</h2>
                                            
                                            {/* Upload */}
                                            <div 
                                                onClick={() => fileInputRef.current?.click()}
                                                className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-colors mb-4"
                                            >
                                                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                                <p className="text-sm text-gray-600">Upload existing resume</p>
                                                <p className="text-xs text-gray-400">PDF, DOC, TXT</p>
                                            </div>
                                            <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleFileUpload} className="hidden" />

                                            {/* Job URL */}
                                            <div className="mb-4">
                                                <Input
                                                    placeholder="Paste job posting URL..."
                                                    value={formData.jobPostingUrl}
                                                    onChange={(e) => handleInputChange('jobPostingUrl', e.target.value)}
                                                    className="h-12"
                                                />
                                            </div>

                                            {/* Career Writeup */}
                                            <div>
                                                <label className="text-sm font-medium text-gray-700 mb-2 block">Career Write-up</label>
                                                <Textarea
                                                    placeholder="Paste your career history, achievements, skills..."
                                                    value={formData.careerWriteup}
                                                    onChange={(e) => handleInputChange('careerWriteup', e.target.value)}
                                                    className="min-h-[150px]"
                                                />
                                            </div>
                                        </div>

                                        {/* Contact Info */}
                                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                            <h2 className="font-semibold text-gray-900 mb-4">Contact Information</h2>
                                            <div className="grid grid-cols-2 gap-3">
                                                <Input placeholder="Full Name" value={formData.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)} />
                                                <Input placeholder="Email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} />
                                                <Input placeholder="Phone" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} />
                                                <Input placeholder="Location" value={formData.location} onChange={(e) => handleInputChange('location', e.target.value)} />
                                                <Input placeholder="LinkedIn" value={formData.linkedin} onChange={(e) => handleInputChange('linkedin', e.target.value)} />
                                                <Input placeholder="Portfolio" value={formData.portfolio} onChange={(e) => handleInputChange('portfolio', e.target.value)} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Middle Column - Settings */}
                                    <div className="lg:col-span-1 space-y-6">
                                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                            <h2 className="font-semibold text-gray-900 mb-4">Resume Settings</h2>
                                            
                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <label className="text-sm text-gray-600 mb-1 block">Page Length</label>
                                                    <Select value={formData.pageLength} onValueChange={(v) => handleInputChange('pageLength', v)}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="1">1 Page</SelectItem>
                                                            <SelectItem value="2">2 Pages</SelectItem>
                                                            <SelectItem value="3">3 Pages</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <label className="text-sm text-gray-600 mb-1 block">Tone Level</label>
                                                    <Select value={formData.toneLevel} onValueChange={(v) => handleInputChange('toneLevel', v)}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="entry-level">Entry Level</SelectItem>
                                                            <SelectItem value="mid-level">Mid Level</SelectItem>
                                                            <SelectItem value="senior">Senior</SelectItem>
                                                            <SelectItem value="executive">Executive</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 mb-6">
                                                <Checkbox id="coverLetter" checked={formData.generateCoverLetter} onCheckedChange={(c) => handleInputChange('generateCoverLetter', c)} />
                                                <label htmlFor="coverLetter" className="text-sm text-gray-700">Generate Cover Letter</label>
                                            </div>

                                            {/* Talking Points */}
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <label className="text-sm font-medium text-gray-700">Talking Points</label>
                                                    <button onClick={addTalkingPoint} className="text-purple-600 text-sm flex items-center gap-1 hover:text-purple-700">
                                                        <Plus className="w-4 h-4" /> Add
                                                    </button>
                                                </div>
                                                <p className="text-xs text-gray-500 mb-3">Add achievements or details to emphasize</p>
                                                <Input
                                                    placeholder="e.g., Led a team of 12 to deliver $2M project"
                                                    value={newTalkingPoint}
                                                    onChange={(e) => setNewTalkingPoint(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && addTalkingPoint()}
                                                    className="mb-3"
                                                />
                                                <div className="space-y-2">
                                                    {formData.talkingPoints.map((point, i) => (
                                                        <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                            <span className="text-sm text-gray-700 flex-1">{point}</span>
                                                            <button onClick={() => removeTalkingPoint(i)} className="text-gray-400 hover:text-red-500">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Generate Button */}
                                            <Button
                                                onClick={generateResume}
                                                disabled={isGenerating || !formData.fullName}
                                                className="w-full mt-6 h-12 bg-purple-600 hover:bg-purple-700 text-white"
                                            >
                                                {isGenerating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
                                                Generate AI Resume
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Right Column - Templates */}
                                    <div className="lg:col-span-1">
                                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                            <h2 className="font-semibold text-gray-900 mb-4">Choose Template ({TEMPLATES.length} designs)</h2>
                                            
                                            {['Modern', 'Classic', 'Creative'].map(category => (
                                                <div key={category} className="mb-6">
                                                    <h3 className="text-sm font-medium text-gray-600 mb-3">{category}</h3>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {TEMPLATES.filter(t => t.category === category).map(t => (
                                                            <div
                                                                key={t.id}
                                                                onClick={() => setSelectedTemplate(t.id)}
                                                                className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${selectedTemplate === t.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'}`}
                                                            >
                                                                <div className="aspect-[3/4] rounded-lg mb-2 flex items-center justify-center" style={{ backgroundColor: `${t.color}15` }}>
                                                                    <div className="w-full px-2">
                                                                        <div className="h-2 rounded mb-1" style={{ backgroundColor: t.color, width: '60%' }} />
                                                                        <div className="h-1 bg-gray-200 rounded mb-1" />
                                                                        <div className="h-1 bg-gray-200 rounded mb-1 w-3/4" />
                                                                        <div className="h-1 bg-gray-200 rounded w-1/2" />
                                                                    </div>
                                                                </div>
                                                                <p className="text-xs font-medium text-gray-700 truncate">{t.name}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Resume Tab */}
                            <TabsContent value="resume">
                                {generatedResume ? (
                                    <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 max-w-3xl mx-auto">
                                        <div className="flex justify-end mb-4">
                                            <Button variant="outline" onClick={() => setShowPreview(true)}>
                                                <Eye className="w-4 h-4 mr-2" /> Preview
                                            </Button>
                                        </div>

                                        {/* Resume Content */}
                                        <div className="border-l-4 pl-6" style={{ borderColor: template?.color }}>
                                            <h1 className="text-3xl font-bold text-gray-900 mb-1">{formData.fullName}</h1>
                                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                                                {formData.email && <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {formData.email}</span>}
                                                {formData.phone && <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {formData.phone}</span>}
                                                {formData.location && <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {formData.location}</span>}
                                            </div>

                                            {generatedResume.summary && (
                                                <div className="mb-6">
                                                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Professional Summary</h2>
                                                    <p className="text-gray-700">{generatedResume.summary}</p>
                                                </div>
                                            )}

                                            {generatedResume.experience?.length > 0 && (
                                                <div className="mb-6">
                                                    <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                                        <Briefcase className="w-5 h-5" style={{ color: template?.color }} /> Experience
                                                    </h2>
                                                    {generatedResume.experience.map((exp, i) => (
                                                        <div key={i} className="mb-4">
                                                            <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                                                            <p className="text-sm text-gray-600">{exp.company} • {exp.duration}</p>
                                                            <ul className="mt-2 space-y-1">
                                                                {exp.achievements?.map((a, j) => (
                                                                    <li key={j} className="text-sm text-gray-700 flex items-start gap-2">
                                                                        <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: template?.color }} />
                                                                        {a}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {generatedResume.education?.length > 0 && (
                                                <div className="mb-6">
                                                    <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                                        <GraduationCap className="w-5 h-5" style={{ color: template?.color }} /> Education
                                                    </h2>
                                                    {generatedResume.education.map((edu, i) => (
                                                        <div key={i} className="mb-2">
                                                            <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                                                            <p className="text-sm text-gray-600">{edu.school} • {edu.year}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {generatedResume.skills?.length > 0 && (
                                                <div>
                                                    <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                                        <Award className="w-5 h-5" style={{ color: template?.color }} /> Skills
                                                    </h2>
                                                    <div className="flex flex-wrap gap-2">
                                                        {generatedResume.skills.map((skill, i) => (
                                                            <span key={i} className="px-3 py-1 rounded-full text-sm" style={{ backgroundColor: `${template?.color}15`, color: template?.color }}>
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center max-w-xl mx-auto">
                                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <h2 className="text-xl font-semibold text-gray-800 mb-2">No Resume Generated</h2>
                                        <p className="text-gray-500 mb-4">Fill in your information and click Generate to create your resume</p>
                                        <Button onClick={() => setActiveTab('builder')} className="bg-purple-600 hover:bg-purple-700">
                                            Go to Builder
                                        </Button>
                                    </div>
                                )}
                            </TabsContent>

                            {/* Export Tab */}
                            <TabsContent value="export">
                                <div className="bg-white rounded-2xl border border-gray-200 p-6 max-w-xl mx-auto text-center">
                                    <Download className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Export Your Resume</h2>
                                    <p className="text-gray-500 mb-6">Download your resume in various formats</p>
                                    <div className="space-y-3">
                                        <Button variant="outline" className="w-full justify-start" disabled={!generatedResume}>
                                            <FileText className="w-5 h-5 mr-3" /> Download as PDF
                                        </Button>
                                        <Button variant="outline" className="w-full justify-start" disabled={!generatedResume}>
                                            <FileText className="w-5 h-5 mr-3" /> Download as DOCX
                                        </Button>
                                        <Button variant="outline" className="w-full justify-start" disabled={!generatedResume}>
                                            <Globe className="w-5 h-5 mr-3" /> Share Online Link
                                        </Button>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </main>
            </div>

            {/* Footer */}
            <footer className="py-6 bg-white border-t border-gray-200">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <img src={LOGO_URL} alt="1cPublishing" className="h-8 w-8 object-contain grayscale" />
                        <nav className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm">
                            {footerLinks.map((link, i) => (
                                <a key={i} href={link.href} className="text-gray-600 hover:text-purple-600">{link.label}</a>
                            ))}
                        </nav>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">© 2025 1cPublishing.com</div>
                </div>
            </footer>

            {/* Preview Dialog */}
            <Dialog open={showPreview} onOpenChange={setShowPreview}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <div className="p-8 bg-white">
                        <p className="text-center text-gray-500">Full preview coming soon...</p>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}