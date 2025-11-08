import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Mail, Github, Linkedin, Twitter, Square, CheckSquare, Palette, Type, Layout, Smartphone, Tablet, Monitor,
  LayoutGrid, Wind, Brush, Wand2, Star, Save, Upload, Trash2, PlusCircle, Briefcase, Code, User, Settings,
  Copy, Download, Box,
  Award, FileText, Badge, Tags,
  Send,
  Link as LinkIcon, Image as ImageIcon,
  Plug,
  Triangle,
  Image, 
  Layers, 
  UploadCloud,
  MessageCircle, // <-- Ikon Baru
  Bot, // <-- Ikon Baru
  X, // <-- Ikon Baru
  Loader2 // <-- Ikon Baru
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- CUSTOM HOOK UNTUK SCRIPT (THREE.JS) ---
const useScript = (url, id) => {
  useEffect(() => {
    const scriptId = `script-${id || url}`;
    if (document.getElementById(scriptId)) {
      window[scriptId] = true;
      return;
    }
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.id = scriptId;
    script.onload = () => {
      window[scriptId] = true;
    };
    document.body.appendChild(script);
  }, [url, id]);
};

// --- DATA KONSTAN & TEMPLATES ---

const DEFAULT_LOGO_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hAgMCCwAp8wF+xYxG9wAAAABJRU5ErkJggg==';

const THEMES = [
  { id: 'minimalist', name: 'Minimalist', bg: 'bg-white', bgValue: '#ffffff', text: 'text-gray-800', card: 'bg-gray-50 border border-gray-200' },
  { 
    id: 'dark', 
    name: 'Dark Tech', 
    bg: 'bg-gradient-to-b from-[#0f0c29] via-[#1a1a3c] to-[#111122]', 
    bgValue: '#0f0c29',
    text: 'text-gray-100', 
    card: 'bg-gray-900/50 border border-gray-700/50' 
  },
  { id: 'glassmorphism', name: 'Glassmorphism', bg: 'bg-gradient-to-br from-purple-500 to-blue-600', bgValue: '#c084fc', text: 'text-white', card: 'bg-white/20 backdrop-blur-lg border border-white/30' },
  { id: 'gradient', name: 'Gradient', bg: 'bg-gradient-to-br from-pink-500 to-orange-400', bgValue: '#f9a8d4', text: 'text-white', card: 'bg-white/20 backdrop-blur-lg' },
];
const FONTS = ['Inter', 'Roboto', 'Lato', 'Montserrat', 'Oswald', 'Source Code Pro', 'Poppins', 'Playfair Display'];
const LAYOUTS = ['one-page', 'split-grid', 'card-style'];
const ANIMATIONS = ['none', 'fade-in', 'slide-up'];

const SHAPES_3D_LOGO = [
  { id: 'sphere', name: 'Sphere (Bola)' },
  { id: 'plane', name: 'Plane (Kartu Datar)' },
  { id: 'box', name: 'Box (Kubus)' },
  { id: 'torus', name: 'Torus (Donat)' },
  { id: 'cone', name: 'Cone (Kerucut)' },
  { id: 'cylinder', name: 'Cylinder (Silinder)' },
  { id: 'octahedron', name: 'Octahedron (Kristal 8-sisi)' },
  { id: 'dodecahedron', name: 'Dodecahedron (12-sisi)' },
  { id: 'icosahedron', name: 'Icosahedron (20-sisi)' },
  { id: 'ring', name: 'Ring (Cincin)' },
];


// --- TEMPLATES ---
const TEMPLATES = [
  {
    id: 'dev', name: 'Creative Developer', icon: Code,
    data: {
      name: 'Jane Doe', title: 'Frontend Developer',
      description: 'I build beautiful and functional web experiences.',
      profilePic: 'https://placehold.co/150x150/9CA3AF/FFFFFF?text=JD',
      socials: { github: 'janedoe', linkedin: 'janedoe', twitter: 'janedoe' },
      projects: [{ id: 1, title: 'E-Commerce Dashboard', description: 'React and D3.', url: '#', imageUrl: 'https://placehold.co/600x400/9CA3AF/FFF?text=Project+1' }],
      experience: [{ id: 1, role: 'Senior Developer', company: 'TechCorp', years: '2022 - Present', url: '#', imageUrl: 'https://placehold.co/600x400/9CA3AF/FFF?text=TechCorp' }],
      skills: [], certifications: [], publications: [], achievements: [],
      contactConfig: {
        method: 'endpoint',
        value: 'https://api.web3forms.com/submit/YOUR-KEY-HERE',
        introText: 'Or send me a message:'
      },
      // --- PERBARUI TEMPLATE ---
      chatConfig: {
        enable: true,
        aiName: 'PortoBot',
        introMessage: 'Halo! Saya asisten AI. Tanyakan apa saja tentang portofolio ini.',
        placeholder: 'Tanyakan tentang proyek...'
      },
      theme: THEMES[0], primaryColor: '#3b82f6', font: 'Inter', layout: 'one-page', animation: 'slide-up', 
      enable3DBackground: true,
      logo3DBase64: DEFAULT_LOGO_BASE64, 
      shape3D: 'plane',
      experienceLayout: 'list'
    }
  },
  {
    id: 'minimalist', name: 'Elegant Minimalist', icon: Layout,
    data: {
      name: 'Alex Smith', title: 'Graphic Designer',
      description: 'Clean, minimalist approach.',
      profilePic: 'https://placehold.co/150x150/A1A1AA/FFFFFF?text=AS',
      socials: { github: '', linkedin: 'alexsmith', twitter: '' },
      projects: [],
      experience: [{ id: 1, role: 'Lead Designer', company: 'Studio M', years: '2021 - Present', url: '', imageUrl: '' }],
      skills: [], certifications: [], publications: [], achievements: [],
      contactConfig: { method: 'mailto', value: 'alex@example.com', introText: 'Get In Touch' },
      chatConfig: {
        enable: false,
        aiName: 'AlexBot',
        introMessage: 'Halo! Saya asisten AI Alex. Tanyakan apa saja padaku.',
        placeholder: 'Tanyakan tentang skill...'
      },
      theme: THEMES[0], primaryColor: '#10B981', font: 'Lato', layout: 'one-page', animation: 'fade-in', 
      enable3DBackground: false,
      logo3DBase64: DEFAULT_LOGO_BASE64, 
      shape3D: 'sphere',
      experienceLayout: 'list'
    }
  },
  {
    id: 'dark-timeline', name: 'Dark Timeline', icon: Briefcase,
    data: {
      name: 'Muhammad Ibrohim', title: 'Merging Mathematics, Technology, and Creativity',
      description: 'Mahasiswa Matematika dengan fokus pada persimpangan antara analisis data, AI, dan web development. Aktif sebagai Google Student Ambassador.',
      profilePic: 'https://placehold.co/150x150/C026D3/FFFFFF?text=MI',
      socials: { github: 'ibrohim', linkedin: 'muh-ibrohim', twitter: 'ibrohim_dev' },
      projects: [
        { id: 1, title: 'Drawtik (Batik Fraktal)', description: 'Aplikasi web untuk menghasilkan desain batik menggunakan konsep matematika fraktal.', url: '#', imageUrl: 'https://placehold.co/600x400/c026d3/FFF?text=Drawtik' },
        { id: 2, title: 'AgriDecide Pro (SPK)', description: 'Sistem Pendukung Keputusan (SPK) web untuk agribisnis.', url: '#', imageUrl: 'https://placehold.co/600x400/c026d3/FFF?text=AgriDecide' },
      ],
      experience: [
        { id: 1, role: 'Google Student Ambassador', company: 'Google', years: 'Sep 2025 - Sekarang', url: '#', imageUrl: 'https://placehold.co/600x400/c026d3/FFF?text=GSA' },
        { id: 2, role: 'Duta Literasi Keuangan', company: 'Bank Syariah Indonesia', years: 'Okt 2025 - Sekarang', url: '#', imageUrl: 'https://placehold.co/600x400/c026d3/FFF?text=BSI' },
      ],
      skills: [
        { id: 1, category: 'Data & AI', tags: 'Python, SQL, Excel, Machine Learning' },
        { id: 2, category: 'Web Development', tags: 'HTML, CSS, JavaScript, TailwindCSS, React' },
      ],
      certifications: [
        { id: 1, issuer: 'Google', title: 'Gemini Certified Educator', url: '#', imageUrl: 'https://placehold.co/600x400/c026d3/FFF?text=Google+Cert' },
        { id: 2, issuer: 'DQ LAB', title: 'Data Analyst Bootcamp', url: '#', imageUrl: 'https://placehold.co/600x400/c026d3/FFF?text=DQ+Lab' },
      ],
      publications: [
        { id: 1, title: 'Transformasi Seni Tradisional ke Era Digital', journal: 'Jurnal Transformasi, 2024', url: '#' }
      ],
      achievements: [
        { id: 1, title: 'Beasiswa Bank Syariah' },
        { id: 2, title: 'Medali Perunggu OSN' },
      ],
      contactConfig: {
        method: 'endpoint',
        value: 'https://api.web3forms.com/submit/YOUR-KEY-HERE',
        introText: 'Get In Touch'
      },
      chatConfig: {
        enable: true,
        aiName: 'IbrohimAI',
        introMessage: 'Halo! Saya asisten AI Ibrohim. Tanyakan tentang skill data saya.',
        placeholder: 'Contoh: "Jelaskan proyek fraktal-nya"'
      },
      theme: THEMES[1], primaryColor: '#c026d3', font: 'Poppins', layout: 'one-page', animation: 'slide-up', 
      enable3DBackground: true,
      logo3DBase64: DEFAULT_LOGO_BASE64, 
      shape3D: 'icosahedron',
      experienceLayout: 'timeline'
    }
  }
];


// --- FONT HELPER ---
const loadGoogleFont = (fontFamily) => {
  if (!fontFamily || fontFamily === 'Inter') return;
  const linkId = `google-font-${fontFamily.replace(' ', '-')}`;
  if (document.getElementById(linkId)) return;
  const link = document.createElement('link');
  link.id = linkId;
  link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(' ', '+')}:wght@400;700&display=swap`;
  link.rel = 'stylesheet';
  document.head.appendChild(link);
};

// --- KOMPONEN UTAMA: APP ---
export default function App() {
  // --- Memuat Skrip Three.js ---
  useScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'three-core');

  // --- STATE LENGKAP ---
  // Data State
  const [name, setName] = useState('Your Name');
  const [title, setTitle] = useState('Your Job Title');
  const [description, setDescription] = useState('A brief description about yourself.');
  const [profilePic, setProfilePic] = useState('https://placehold.co/150x150/E2E8F0/334155?text=:)');
  const [socials, setSocials] = useState({ github: '', linkedin: '', twitter: '' });
  const [projects, setProjects] = useState([]);
  const [experience, setExperience] = useState([]);
  const [skills, setSkills] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [publications, setPublications] = useState([]);
  const [achievements, setAchievements] = useState([]);
  
  const [contactConfig, setContactConfig] = useState({
    method: 'endpoint',
    value: '',
    introText: 'Get In Touch'
  });

  // --- STATE CHATBOT BARU ---
  const [chatConfig, setChatConfig] = useState({
    enable: false,
    aiName: 'PortoBot',
    introMessage: 'Halo! Saya asisten AI. Tanyakan apa saja tentang portofolio ini.',
    placeholder: 'Tanyakan tentang proyek...'
  });

  // Design State
  const [theme, setTheme] = useState(THEMES[0]);
  const [primaryColor, setPrimaryColor] = useState('#3b82f6');
  const [font, setFont] = useState('Inter');
  const [layout, setLayout] = useState('one-page');
  const [animation, setAnimation] = useState('fade-in');
  const [experienceLayout, setExperienceLayout] = useState('list'); 

  // --- STATE 3D BARU ---
  const [enable3DBackground, setEnable3DBackground] = useState(false);
  const [logo3DBase64, setLogo3DBase64] = useState(DEFAULT_LOGO_BASE64); 
  const [shape3D, setShape3D] = useState('sphere');
  const [isUploading, setIsUploading] = useState(false);


  // UI State
  const [editorTab, setEditorTab] = useState('content'); // 'content', 'design', 'templates', 'connect', 'chat'
  const [activeTabRight, setActiveTabRight] = useState('preview');
  const [viewport, setViewport] = useState('desktop');

  // Kumpulkan semua state
  const portfolioState = {
    name, title, description, profilePic, socials, projects, experience,
    skills, certifications, publications, achievements,
    contactConfig,
    chatConfig, // <-- Tambahkan chatConfig
    theme, primaryColor, font, layout, animation, 
    enable3DBackground, logo3DBase64, shape3D, 
    experienceLayout
  };
  
  // --- State Preview Chat ---
  const [showChat, setShowChat] = useState(false);


  useEffect(() => { loadGoogleFont(font); }, [font]);

  // --- HANDLER: STATE MANIPULATION ---
  const handleSocialChange = (key, value) => setSocials(prev => ({ ...prev, [key]: value }));
  const handleItemChange = (setState, id, key, value) => {
    setState(prev => prev.map(item => item.id === id ? { ...item, [key]: value } : item));
  };
  const addItem = (setState, newItem) => setState(prev => [...prev, { id: Date.now(), ...newItem }]);
  const removeItem = (setState, id) => setState(prev => prev.filter(item => item.id !== id));
  
  const handleContactChange = (key, value) => {
    setContactConfig(prev => ({ ...prev, [key]: value }));
  };
  
  // --- HANDLER CHATBOT BARU ---
  const handleChatConfigChange = (key, value) => {
    setChatConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true); 
      const reader = new FileReader();
      reader.onloadstart = () => setIsUploading(true);
      reader.onloadend = () => {
        setLogo3DBase64(reader.result);
        setIsUploading(false); 
      };
      reader.onerror = () => {
        console.error("Gagal membaca file");
        alert("Gagal membaca file. Pastikan file tidak rusak.");
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = null;
  };


  // --- HANDLER: SAVE, LOAD, TEMPLATE ---
  const applyTemplate = (templateData) => {
    setName(templateData.name);
    setTitle(templateData.title);
    setDescription(templateData.description);
    setProfilePic(templateData.profilePic);
    setSocials(templateData.socials);
    setProjects(templateData.projects.map(p => ({...p})));
    setExperience(templateData.experience.map(e => ({...e})));
    setSkills(templateData.skills ? templateData.skills.map(s => ({...s})) : []);
    setCertifications(templateData.certifications ? templateData.certifications.map(c => ({...c})) : []);
    setPublications(templateData.publications ? templateData.publications.map(p => ({...p})) : []);
    setAchievements(templateData.achievements ? templateData.achievements.map(a => ({...a})) : []);
    setContactConfig(templateData.contactConfig || { method: 'none', value: '', introText: 'Get In Touch' });
    setChatConfig(templateData.chatConfig || { enable: false, aiName: 'PortoBot', introMessage: 'Halo!', placeholder: 'Tanya saya...' });
    setTheme(templateData.theme);
    setPrimaryColor(templateData.primaryColor);
    setFont(templateData.font);
    setLayout(templateData.layout);
    setAnimation(templateData.animation);
    setEnable3DBackground(templateData.enable3DBackground || false);
    setLogo3DBase64(templateData.logo3DBase64 || DEFAULT_LOGO_BASE64); 
    setShape3D(templateData.shape3D || 'sphere');
    setExperienceLayout(templateData.experienceLayout || 'list');
  };

  const handleSave = () => {
      try {
       localStorage.setItem('portoForgeProject', JSON.stringify(portfolioState));
       alert('Project Saved! 🥳');
    } catch (e) { 
       console.error('Failed to save project:', e); 
       alert('Error: Could not save project.');
    }
  };
  
  const handleLoad = () => {
    try {
      const savedData = localStorage.getItem('portoForgeProject');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setName(parsedData.name || 'Your Name');
        setTitle(parsedData.title || 'Your Job Title');
        setDescription(parsedData.description || '');
        setProfilePic(parsedData.profilePic || 'https://placehold.co/150x150/E2E8F0/334155?text=:)');
        setSocials(parsedData.socials || { github: '', linkedin: '', twitter: '' });
        setProjects(parsedData.projects || []);
        setExperience(parsedData.experience || []);
        setSkills(parsedData.skills || []);
        setCertifications(parsedData.certifications || []);
        setPublications(parsedData.publications || []);
        setAchievements(parsedData.achievements || []);
        setContactConfig(parsedData.contactConfig || { method: 'none', value: '', introText: 'Get InTouch' });
        setChatConfig(parsedData.chatConfig || { enable: false, aiName: 'PortoBot', introMessage: 'Halo!', placeholder: 'Tanya saya...' });
        setTheme(parsedData.theme || THEMES[0]);
        setPrimaryColor(parsedData.primaryColor || '#3b82f6');
        setFont(parsedData.font || 'Inter');
        setLayout(parsedData.layout || 'one-page');
        setAnimation(parsedData.animation || 'fade-in');
        setEnable3DBackground(parsedData.enable3DBackground || false);
        setLogo3DBase64(parsedData.logo3DBase64 || DEFAULT_LOGO_BASE64); 
        setShape3D(parsedData.shape3D || 'sphere');
        setExperienceLayout(parsedData.experienceLayout || 'list');
        alert('Project Loaded! 🎉');
      } else { alert('No saved project found.'); }
    } catch (e) { 
      console.error('Failed to load project:', e); 
      alert('Error: Could not load project. Data may be corrupt.');
    }
  };


  return (
    <div className="flex h-screen w-full bg-gray-100 font-sans relative">
      
      {/* ------------------- */}
      {/* PANEL EDITOR (KIRI) */}
      {/* ------------------- */}
      <aside className="w-[500px] h-full bg-white shadow-lg flex flex-col z-10">
        {/* Header Editor */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg shadow-md">
                <LayoutGrid size={24} />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">PortoForge</h1>
            </div>
            <div className="flex gap-2">
              <IconButton title="Save Project" onClick={handleSave}><Save size={18} /></IconButton>
              <IconButton title="Load Project" onClick={handleLoad}><Upload size={18} /></IconButton>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">Where Creativity Meets Code.</p>
        </div>
        
        {/* Tab Editor (TAB BARU) */}
        <div className="border-b border-gray-200">
          <nav className="flex gap-1 p-2">
            <EditorTabButton icon={User} text="Content" active={editorTab === 'content'} onClick={() => setEditorTab('content')} />
            <EditorTabButton icon={Brush} text="Design" active={editorTab ==='design'} onClick={() => setEditorTab('design')} />
            <EditorTabButton icon={Star} text="Templates" active={editorTab === 'templates'} onClick={() => setEditorTab('templates')} />
            <EditorTabButton icon={Plug} text="Connect" active={editorTab === 'connect'} onClick={() => setEditorTab('connect')} />
            {/* --- TAB BARU: CHAT --- */}
            <EditorTabButton icon={Bot} text="Chat AI" active={editorTab === 'chat'} onClick={() => setEditorTab('chat')} />
          </nav>
        </div>

        {/* Konten Tab Editor */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {/* --- TAB KONTEN --- */}
            {editorTab === 'content' && (
              <motion.div key="content" {...fadeAnim} className="flex flex-col gap-6">
                <EditorSection title="Personal Info">
                  <Input label="Profile Picture URL" value={profilePic} onChange={(e) => setProfilePic(e.target.value)} />
                  <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
                  <Input label="Job Title / Subtitle" value={title} onChange={(e) => setTitle(e.target.value)} />
                  <TextArea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                </EditorSection>
                <EditorSection title="Social Media">
                  <Input icon={Github} label="GitHub Username" value={socials.github} onChange={(e) => handleSocialChange('github', e.target.value)} />
                  <Input icon={Linkedin} label="LinkedIn Username" value={socials.linkedin} onChange={(e) => handleSocialChange('linkedin', e.target.value)} />
                  <Input icon={Twitter} label="Twitter Username" value={socials.twitter} onChange={(e) => handleSocialChange('twitter', e.target.value)} />
                </EditorSection>
                <EditorSection title="Experience">
                  <ItemManager
                    items={experience}
                    onAdd={() => addItem(setExperience, { role: 'New Role', company: 'New Company', years: '202X', url: '', imageUrl: '' })}
                    onRemove={(id) => removeItem(setExperience, id)}
                    renderItem={(item) => (
                      <>
                        <Input placeholder="Role" value={item.role} onChange={(e) => handleItemChange(setExperience, item.id, 'role', e.target.value)} />
                        <Input placeholder="Company" value={item.company} onChange={(e) => handleItemChange(setExperience, item.id, 'company', e.target.value)} />
                        <Input placeholder="Years" value={item.years} onChange={(e) => handleItemChange(setExperience, item.id, 'years', e.target.value)} />
                        <Input icon={LinkIcon} placeholder="URL (Opsional)" value={item.url} onChange={(e) => handleItemChange(setExperience, item.id, 'url', e.target.value)} />
                        <Input icon={ImageIcon} placeholder="Image URL (Opsional)" value={item.imageUrl} onChange={(e) => handleItemChange(setExperience, item.id, 'imageUrl', e.target.value)} />
                      </>
                    )}
                  />
                </EditorSection>
                <EditorSection title="Projects">
                    <ItemManager
                      items={projects}
                      onAdd={() => addItem(setProjects, { title: 'New Project', description: 'A short description', url: '#', imageUrl: '' })}
                      onRemove={(id) => removeItem(setProjects, id)}
                      renderItem={(item) => (
                        <>
                          <Input placeholder="Project Title" value={item.title} onChange={(e) => handleItemChange(setProjects, item.id, 'title', e.target.value)} />
                          <Input icon={LinkIcon} placeholder="URL" value={item.url} onChange={(e) => handleItemChange(setProjects, item.id, 'url', e.target.value)} />
                          <Input icon={ImageIcon} placeholder="Image URL (Opsional)" value={item.imageUrl} onChange={(e) => handleItemChange(setProjects, item.id, 'imageUrl', e.target.value)} />
                          <TextArea placeholder="Description" value={item.description} onChange={(e) => handleItemChange(setProjects, item.id, 'description', e.target.value)} />
                        </>
                      )}
                    />
                </EditorSection>

                <EditorSection title="Skills" icon={Tags}>
                    <ItemManager
                      items={skills}
                      onAdd={() => addItem(setSkills, { category: 'New Category', tags: 'Tag 1, Tag 2' })}
                      onRemove={(id) => removeItem(setSkills, id)}
                      renderItem={(item) => (
                        <>
                          <Input placeholder="Category" value={item.category} onChange={(e) => handleItemChange(setSkills, item.id, 'category', e.target.value)} />
                          <Input placeholder="Tags (comma-separated)" value={item.tags} onChange={(e) => handleItemChange(setSkills, item.id, 'tags', e.target.value)} />
                        </>
                      )}
                    />
                </EditorSection>
                
                <EditorSection title="Licenses & Certifications" icon={Badge}>
                    <ItemManager
                      items={certifications}
                      onAdd={() => addItem(setCertifications, { issuer: 'Issuer', title: 'Certification Title', url: '#', imageUrl: '' })}
                      onRemove={(id) => removeItem(setCertifications, id)}
                      renderItem={(item) => (
                        <>
                          <Input placeholder="Issuer (e.g. Google)" value={item.issuer} onChange={(e) => handleItemChange(setCertifications, item.id, 'issuer', e.target.value)} />
                          <Input placeholder="Certification Title" value={item.title} onChange={(e) => handleItemChange(setCertifications, item.id, 'title', e.target.value)} />
                          <Input icon={LinkIcon} placeholder="URL" value={item.url} onChange={(e) => handleItemChange(setCertifications, item.id, 'url', e.target.value)} />
                          <Input icon={ImageIcon} placeholder="Image URL (Opsional)" value={item.imageUrl} onChange={(e) => handleItemChange(setCertifications, item.id, 'imageUrl', e.target.value)} />
                        </>
                      )}
                    />
                </EditorSection>
                
                <EditorSection title="Publications" icon={FileText}>
                    <ItemManager
                      items={publications}
                      onAdd={() => addItem(setPublications, { title: 'Paper Title', journal: 'Journal Name, 202X', url: '#' })}
                      onRemove={(id) => removeItem(setPublications, id)}
                      renderItem={(item) => (
                        <>
                          <Input placeholder="Paper Title" value={item.title} onChange={(e) => handleItemChange(setPublications, item.id, 'title', e.target.value)} />
                          <Input placeholder="Journal / Venue" value={item.journal} onChange={(e) => handleItemChange(setPublications, item.id, 'journal', e.target.value)} />
                          <Input icon={LinkIcon} placeholder="URL" value={item.url} onChange={(e) => handleItemChange(setPublications, item.id, 'url', e.target.value)} />
                        </>
                      )}
                    />
                </EditorSection>

                <EditorSection title="Achievements" icon={Award}>
                    <ItemManager
                      items={achievements}
                      onAdd={() => addItem(setAchievements, { title: 'Achievement Title' })}
                      onRemove={(id) => removeItem(setAchievements, id)}
                      renderItem={(item) => (
                        <>
                          <Input placeholder="Achievement Title" value={item.title} onChange={(e) => handleItemChange(setAchievements, item.id, 'title', e.target.value)} />
                        </>
                      )}
                    />
                </EditorSection>
              </motion.div>
            )}

            {/* --- TAB DESAIN --- */}
            {editorTab === 'design' && (
              <motion.div key="design" {...fadeAnim} className="flex flex-col gap-6">
                <EditorSection title="Theme">
                  <div className="grid grid-cols-4 gap-2">
                    {THEMES.map(t => (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t)}
                        className={`p-2 rounded-lg border-2 ${theme.id === t.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'}`}
                      >
                        <div className={`h-10 w-full rounded ${t.bg} border border-gray-300`}></div>
                        <span className="text-xs font-medium text-gray-700 mt-1 block">{t.name}</span>
                      </button>
                    ))}
                  </div>
                </EditorSection>
                <EditorSection title="Color & Font">
                  <div className="grid grid-cols-2 gap-4">
                    <ColorPicker value={primaryColor} onChange={setPrimaryColor} />
                    <FontSelector value={font} onChange={setFont} />
                  </div>
                </EditorSection>
                <EditorSection title="Layout & Animation">
                    <Select label="Page Layout" value={layout} onChange={(e) => setLayout(e.target.value)}>
                      {LAYOUTS.map(l => <option key={l} value={l}>{l.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>)}
                    </Select>
                    <Select label="Scroll Animation" value={animation} onChange={(e) => setAnimation(e.target.value)}>
                      {ANIMATIONS.map(a => <option key={a} value={a}>{a.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>)}
                    </Select>
                </EditorSection>
                
                <EditorSection title="Section Specific Design">
                  <Select 
                    label="Experience Layout" 
                    value={experienceLayout} 
                    onChange={(e) => setExperienceLayout(e.target.value)}
                  >
                    <option value="list">List</option>
                    <option value="timeline">Vertical Timeline</option>
                  </Select>
                </EditorSection>

                {/* --- BAGIAN "WOW FACTOR" YANG DIPERBARUI --- */}
                <EditorSection title="Wow Factor">
                  <div className="flex flex-col gap-4">
                    <Toggle
                      label="Enable 3D Rotating Background Logo"
                      icon={Layers}
                      checked={enable3DBackground}
                      onChange={() => setEnable3DBackground(!enable3DBackground)}
                    />
                    <AnimatePresence>
                      {enable3DBackground && (
                        <motion.div {...fadeAnim} className="flex flex-col gap-4 pl-6 pt-4 border-l-2 border-gray-200">
                          {/* --- INPUT FILE BARU (DENGAN FEEDBACK LOADING) --- */}
                          <label className="block w-full">
                            <span className="text-sm font-medium text-gray-700 mb-1 block">Upload Your Logo</span>
                            {isUploading ? (
                              <div className="text-sm text-gray-500 p-2">
                                Processing image...
                              </div>
                            ) : (
                              <div className="relative">
                                <input
                                  type="file"
                                  accept="image/png, image/jpeg"
                                  onChange={handleLogoUpload}
                                  className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100"
                                />
                              </div>
                            )}
                            <img src={logo3DBase64} alt="Logo Preview" className="w-16 h-16 mt-2 rounded-lg object-cover border border-gray-200" />
                          </label>
                          <Select
                            label="3D Shape"
                            value={shape3D}
                            onChange={(e) => setShape3D(e.target.value)}
                          >
                            {/* --- PERBAIKAN: List baru digunakan di sini --- */}
                            {SHAPES_3D_LOGO.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                          </Select>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </EditorSection>
              </motion.div>
            )}
            
            {/* --- TAB TEMPLATES --- */}
            {editorTab === 'templates' && (
              <motion.div key="templates" {...fadeAnim} className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-gray-900">Start with a Template</h2>
                <p className="text-sm text-gray-600">Warning: This will override your current settings.</p>
                {TEMPLATES.map(template => (
                  <button
                    key={template.id}
                    onClick={() => applyTemplate(template.data)}
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:shadow-md transition-all"
                  >
                    <template.icon size={24} className="text-blue-500" />
                    <div>
                      <h3 className="font-semibold text-gray-800">{template.name}</h3>
                      <p className="text-sm text-gray-500">{template.data.title}</p>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}

            {/* --- TAB BARU: CONNECT (DENGAN PERBAIKAN) --- */}
            {editorTab === 'connect' && (
              <motion.div key="connect" {...fadeAnim} className="flex flex-col gap-6">
                <EditorSection title="Contact Form Integration" icon={Plug}>
                  <Input 
                    label="Section Title"
                    value={contactConfig.introText}
                    onChange={(e) => handleContactChange('introText', e.target.value)}
                    placeholder="Get In Touch"
                  />
                  <Select
                    label="Metode Integrasi"
                    value={contactConfig.method}
                    onChange={(e) => handleContactChange('method', e.target.value)}
                  >
                    <option value="none">None (Sembunyikan Form)</option>
                    <option value="endpoint">Email Endpoint (Rekomendasi)</option>
                    <option value="whatsapp">WhatsApp (Buka Chat)</option>
                    <option value="google_sheets">Google Sheets (via Apps Script)</option>
                    <option value="mailto">Mailto Link (Kurang diandalkan)</option>
                  </Select>

                  {/* --- FIELD KONDISIONAL --- */}
                  <AnimatePresence>
                    {contactConfig.method === 'endpoint' && (
                      <motion.div {...fadeAnim}>
                        <Input
                          label="Form Endpoint URL"
                          icon={LinkIcon}
                          value={contactConfig.value}
                          onChange={(e) => handleContactChange('value', e.target.value)}
                          placeholder="https://api.web3forms.com/submit/..."
                        />
                         <p className="text-xs text-gray-500 mt-2">
                           Daftar di <a href="https://web3forms.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Web3Forms</a> atau <a href="https://formspree.io/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Formspree</a> untuk mendapatkan Endpoint URL gratis.
                         </p>
                      </motion.div>
                    )}
                    {contactConfig.method === 'whatsapp' && (
                      <motion.div {...fadeAnim}>
                        <Input
                          label="Nomor WhatsApp"
                          icon={Smartphone}
                          value={contactConfig.value}
                          onChange={(e) => handleContactChange('value', e.target.value)}
                          placeholder="628123456789"
                        />
                        <p className="text-xs text-gray-500 mt-2">Gunakan format internasional (cth: 62). Kode akan otomatis membuka chat WA dengan pesan dari formulir.</p>
                      </motion.div>
                    )}
                     {contactConfig.method === 'mailto' && (
                      <motion.div {...fadeAnim}>
                        <Input
                          label="Alamat Email Anda"
                          icon={Mail}
                          value={contactConfig.value}
                          onChange={(e) => handleContactChange('value', e.target.value)}
                          placeholder="namaanda@gmail.com"
                        />
                         <p className="text-xs text-gray-500 mt-2">Ini akan membuka email client default pengguna. Mungkin tidak berfungsi jika pengguna tidak punya email client.</p>
                      </motion.div>
                    )}
                    {contactConfig.method === 'google_sheets' && (
                      <motion.div {...fadeAnim} className="flex flex-col gap-3">
                        <Input
                          label="Google Apps Script Web App URL"
                          icon={LinkIcon}
                          value={contactConfig.value}
                          onChange={(e) => handleContactChange('value', e.target.value)}
                          placeholder="https://script.google.com/macros/s/..."
                        />
                        <details className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                          <summary className="text-sm font-medium text-gray-800 cursor-pointer">
                            Cara Mendapatkan URL Apps Script (Klik untuk buka)
                          </summary>
                          <div className="mt-3 flex flex-col gap-2 text-sm text-gray-700">
                            <p>1. Buat Google Sheet baru.</p>
                            <p>2. Klik `Extensions` &rarr; `Apps Script`.</p>
                            <p>3. Hapus kode yang ada dan tempel kode di bawah ini:</p>
                            <pre className="p-2 bg-gray-900 text-gray-200 rounded-md text-xs overflow-x-auto">
{`function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var newRow = sheet.getLastRow() + 1;
  var rowData = [];
  rowData.push(new Date()); 
  rowData.push(e.parameter.name);
  rowData.push(e.parameter.email);
  rowData.push(e.parameter.message);
  sheet.getRange(newRow, 1, 1, rowData.length).setValues([rowData]);
  return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
}`}
                            </pre>
                            <p>4. Klik `Deploy` &rarr; `New deployment`.</p>
                            <p>5. Pilih `Web app` (ikon roda gigi).</p>
                            <p>6. Di "Who has access", pilih **`Anyone`**.</p>
                            <p>7. Klik `Deploy`. Salin **"Web app URL"** dan tempel di atas.</p>
                          </div>
                        </details>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </EditorSection>
              </motion.div>
            )}
            
            {/* --- TAB BARU: CHATBOT AI --- */}
            {editorTab === 'chat' && (
              <motion.div key="chat" {...fadeAnim} className="flex flex-col gap-6">
                <EditorSection title="AI Assistant" icon={Bot}>
                  <Toggle
                    label="Enable AI Assistant"
                    icon={Bot}
                    checked={chatConfig.enable}
                    onChange={() => handleChatConfigChange('enable', !chatConfig.enable)}
                  />
                  <AnimatePresence>
                    {chatConfig.enable && (
                       <motion.div {...fadeAnim} className="flex flex-col gap-4 pl-6 pt-4 border-l-2 border-gray-200">
                         <Input 
                           label="AI Name"
                           value={chatConfig.aiName}
                           onChange={(e) => handleChatConfigChange('aiName', e.target.value)}
                           placeholder="PortoBot"
                         />
                         <TextArea 
                           label="AI Intro Message"
                           value={chatConfig.introMessage}
                           onChange={(e) => handleChatConfigChange('introMessage', e.target.value)}
                           placeholder="Halo! Tanyakan saya..."
                         />
                         <Input 
                           label="Input Placeholder"
                           value={chatConfig.placeholder}
                           onChange={(e) => handleChatConfigChange('placeholder', e.target.value)}
                           placeholder="Tanyakan tentang proyek..."
                         />
                       </motion.div>
                    )}
                  </AnimatePresence>
                </EditorSection>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </aside>

      {/* -------------------- */}
      {/* PANEL PREVIEW (KANAN)*/}
      {/* -------------------- */}
      <main className="flex-1 h-full flex flex-col bg-gray-200 z-10 relative">
        {/* Kontrol Atas (Tabs + Viewport) */}
        <div className="bg-white shadow-sm z-10 flex justify-between items-center px-4 py-2">
            <div className="flex gap-1 bg-gray-200 p-1 rounded-lg">
             <TabButton text="Live Preview" active={activeTabRight === 'preview'} onClick={() => setActiveTabRight('preview')} />
             <TabButton text="Get Code" active={activeTabRight === 'code'} onClick={() => setActiveTabRight('code')} />
           </div>
          {activeTabRight === 'preview' && (
            <div className="flex gap-1 bg-gray-200 p-1 rounded-lg">
              <ViewportButton icon={Smartphone} active={viewport === 'mobile'} onClick={() => setViewport('mobile')} />
              <ViewportButton icon={Tablet} active={viewport === 'tablet'} onClick={() => setViewport('tablet')} />
              <ViewportButton icon={Monitor} active={viewport === 'desktop'} onClick={() => setViewport('desktop')} />
            </div>
          )}
        </div>

        {/* Area Konten */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          {activeTabRight === 'preview' ? (
            <>
              <PreviewContainer 
                viewport={viewport}
                enable3DBackground={enable3DBackground}
                logo3DBase64={logo3DBase64}
                shape3D={shape3D}
              >
                <PortfolioPreview {...portfolioState} />
              </PreviewContainer>
              
              {/* --- Tombol & Jendela Chatbot (Hanya di Preview) --- */}
              <AnimatePresence>
                {chatConfig.enable && !showChat && (
                  <motion.button
                    initial={{ scale: 0, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0, y: 50 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowChat(true)}
                    className="fixed bottom-8 right-8 z-50 p-4 rounded-full shadow-lg"
                    style={{ backgroundColor: primaryColor, color: 'white' }}
                    title="Tanya AI Assistant"
                  >
                    <MessageCircle size={24} />
                  </motion.button>
                )}
              </AnimatePresence>
              
              <AnimatePresence>
                {chatConfig.enable && showChat && (
                  <AIChatbotWindow
                    portfolioState={portfolioState}
                    onClose={() => setShowChat(false)}
                  />
                )}
              </AnimatePresence>
            </>
          ) : (
            <GeneratedCode {...portfolioState} />
          )}
        </div>
      </main>
    </div>
  );
}

// --- Komponen Editor (Reusable) ---
const fadeAnim = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2 }
};

function EditorTabButton({ icon: Icon, text, active, ...props }) {
  return (
    <button
      {...props}
      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        active ? 'bg-white text-blue-600 shadow-sm' : 'bg-transparent text-gray-600 hover:text-gray-800'
      }`}
    >
      <Icon size={16} />
      <span>{text}</span>
    </button>
  );
}

function EditorSection({ title, icon: Icon, children }) {
  return (
    <div className="border-t border-gray-200 pt-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        {Icon && <Icon size={20} className="text-gray-500" />}
        {title}
      </h2>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

function Input({ label, icon: Icon, ...props }) {
  return (
    <label className="block w-full">
      {label && <span className="text-sm font-medium text-gray-700 mb-1 block">{label}</span>}
      <div className="relative">
        {Icon && <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />}
        <input
          {...props}
          className={`block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${Icon ? 'pl-10' : ''}`}
        />
      </div>
    </label>
  );
}

function TextArea({ label, ...props }) {
  return (
    <label className="block w-full">
      {label && <span className="text-sm font-medium text-gray-700 mb-1 block">{label}</span>}
      <textarea
        rows={3}
        {...props}
        className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </label>
  );
}

function Select({ label, children, ...props }) {
  return (
    <label className="block w-full">
      {label && <span className="text-sm font-medium text-gray-700 mb-1 block">{label}</span>}
      <select
        {...props}
        className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {children}
      </select>
    </label>
  );
}

function ColorPicker({ value, onChange }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700 mb-1 block">Primary Color</span>
      <div className="relative flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded-full cursor-pointer border-none p-0"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="ml-3 flex-1 border-none p-0 focus:outline-none focus:ring-0"
        />
      </div>
    </label>
  );
}

function FontSelector({ value, onChange }) {
  return (
    <Select label="Font Family" value={value} onChange={(e) => onChange(e.target.value)}>
      {FONTS.map(font => (
        <option key={font} value={font} style={{ fontFamily: font }}>
          {font}
        </option>
      ))}
    </Select>
  );
}

function ItemManager({ items, onAdd, onRemove, renderItem }) {
  return (
    <div className="flex flex-col gap-4">
      {items.map(item => (
        <div key={item.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50 relative">
          <button
            onClick={() => onRemove(item.id)}
            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-100 transition-colors"
          >
            <Trash2 size={16} />
          </button>
          <div className="flex flex-col gap-3 pr-8">
            {renderItem(item)}
          </div>
        </div>
      ))}
      <button
        onClick={onAdd}
        className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
      >
        <PlusCircle size={16} />
        Add Item
      </button>
    </div>
  );
}

function IconButton({ title, children, ...props }) {
  return (
    <button
      {...props}
      title={title}
      className="p-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 hover:text-gray-800 transition-colors"
    >
      {children}
    </button>
  );
}

function Toggle({ label, icon: Icon, checked, onChange }) {
  return (
    <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center gap-2">
        <Icon size={18} className="text-gray-600" />
        <span className="text-sm font-medium text-gray-800">{label}</span>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors ${
          checked ? 'bg-blue-500' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </label>
  );
}


// --- Komponen Panel Kanan (Preview, Code) ---
function TabButton({ text, active, ...props }) {
  return (
    <button
      {...props}
      className={`px-4 py-1.5 rounded-md text-sm font-medium ${
        active ? 'bg-white shadow-sm text-blue-600' : 'bg-transparent text-gray-600 hover:text-gray-800'
      }`}
    >
      {text}
    </button>
  );
}

function ViewportButton({ icon: Icon, active, ...props }) {
  return (
    <button
      {...props}
      className={`p-1.5 rounded-md ${
        active ? 'bg-white shadow-sm text-blue-600' : 'bg-transparent text-gray-600 hover:text-gray-800'
      }`}
    >
      <Icon size={18} />
    </button>
  );
}

const viewportClasses = {
  desktop: 'w-full',
  tablet: 'w-[768px] max-w-full',
  mobile: 'w-[375px] max-w-full',
};

// --- PERBAIKAN: PreviewContainer diubah total ---
function PreviewContainer({ viewport, children, enable3DBackground, logo3DBase64, shape3D }) {
  return (
    <div className={`mx-auto ${viewportClasses[viewport]} transition-all duration-300`}>
      {/* PERBAIKAN: 
        - 'relative' ditambahkan agar bisa menampung canvas 3D
        - 'bg-white' diganti menjadi dinamis
      */}
      <div className={`rounded-lg shadow-xl overflow-hidden relative ${enable3DBackground ? 'bg-transparent' : 'bg-white'}`}>
        
        {/* PERBAIKAN: Komponen 3D diletakkan DI DALAM container ini, DI BELAKANG konten */}
        {enable3DBackground && (
          <ThreeDBackground 
            logoBase64={logo3DBase64}
            shape={shape3D}
          />
        )}

        {/* PERBAIKAN: 
          - 'relative' dan 'z-10' ditambahkan agar konten ini berada DI ATAS canvas 3D
        */}
        <div className="h-[600px] overflow-y-auto relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}

// --- Komponen Portofolio (Live Preview) ---

const animVariants = {
  'fade-in': { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.5 } },
  'slide-up': { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } },
  'none': { initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: 0 }, }
};


function PortfolioPreview({ animation, layout, ...props }) {
  const fontStyle = { fontFamily: props.font, '--primary-color': props.primaryColor };
  const animProps = animVariants[animation] || animVariants['none'];
  
  const motionProps = (delay = 0) => ({
    initial: animProps.initial,
    animate: animProps.animate,
    transition: { ...animProps.transition, delay: delay * 0.1 }
  });
  
  return (
    <div 
      // Latar belakang di sini harus transparan agar 3D terlihat
      className={`w-full min-h-full ${props.theme.text} ${props.enable3DBackground ? 'bg-transparent' : props.theme.bg}`} 
      style={fontStyle}
    >
      <style>{`
        .primary-text { color: var(--primary-color); }
        .primary-bg { background-color: var(--primary-color); color: white; }
        .primary-border { border-color: var(--primary-color); }
        .primary-accent-bg { background-color: var(--primary-color); opacity: 0.1; }
        
        /* --- Gaya Timeline --- */
        .timeline-container {
          position: relative;
          padding-left: 3rem; 
        }
        .timeline-container::before {
          content: '';
          position: absolute;
          left: 1.25rem;
          top: 0.5rem;
          bottom: 0.5rem;
          width: 2px;
          background-color: ${props.theme.id.includes('dark') ? '#4b5563' : '#d1d5db'};
        }
        .timeline-item {
          position: relative;
        }
        .timeline-item:not(:last-child) {
          padding-bottom: 2rem;
        }
        .timeline-dot {
          position: absolute;
          left: -2.5rem;
          top: 0.5rem;
          width: 1.25rem;
          height: 1.25rem;
          border-radius: 9999px;
          background-color: var(--primary-color);
          /* Perlu bgValue, tapi jika transparan, fallback ke warna solid */
          border: 2px solid ${props.enable3DBackground ? (props.theme.id.includes('dark') ? '#0f0c29' : '#ffffff') : props.theme.bgValue};
        }

        /* --- Perbarui Kartu agar memiliki latar belakang solid saat 3D aktif --- */
        .card-bg {
          /* PERBAIKAN: Gunakan bgValue dari tema, atau fallback solid, dengan transparansi */
          background-color: ${
            props.theme.id === 'dark' ? 'rgba(15, 12, 41, 0.8)' : // Fallback solid untuk dark
            props.theme.id === 'minimalist' ? 'rgba(255, 255, 255, 0.8)' : // Fallback solid untuk light
            props.theme.bgValue ? `${props.theme.bgValue}CC` : // Gunakan bgValue + transparansi 80%
            'rgba(255, 255, 255, 0.8)' // Default fallback
          };
          ${props.theme.id.includes('glass') ? 'backdrop-filter: blur(10px);' : 'backdrop-filter: blur(4px);'}
          ${props.theme.card.includes('border') ? `border: 1px solid ${props.theme.id.includes('dark') ? '#374151' : '#e5e7eb'};` : ''}
        }
      `}</style>
      
      <div className="max-w-4xl mx-auto p-8 md:p-16 flex flex-col gap-12 md:gap-16">
        
        {/* --- Hero Section --- */}
        <motion.section {...motionProps(0)} className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={props.profilePic}
              alt="Profile"
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-lg border-4 primary-border z-10 transition-all"
              onError={(e) => { e.target.src = 'https://placehold.co/150x150/E2E8F0/334155?text=:)'; }}
            />
            <div className="absolute inset-0 rounded-full primary-bg opacity-25 blur-lg z-0 -translate-x-1 -translate-y-1" style={{backgroundColor: 'var(--primary-color)'}}></div>
          </motion.div>
          <div className="flex-1 flex flex-col gap-2">
            <h1
              className="text-4xl md:text-5xl font-bold transition-all"
            >
              {props.name}
            </h1>
            <h2 className="text-xl md:text-2xl font-semibold primary-text">{props.title}</h2>
            <p className="text-lg mt-2">{props.description}</p>
            <div className="flex gap-4 mt-4 justify-center md:justify-start">
              {props.socials.github && <SocialIcon href={`https://github.com/${props.socials.github}`} icon={Github} />}
              {props.socials.linkedin && <SocialIcon href={`https://linkedin.com/in/${props.socials.linkedin}`} icon={Linkedin} />}
              {props.socials.twitter && <SocialIcon href={`https://twitter.com/${props.socials.twitter}`} icon={Twitter} />}
            </div>
          </div>
        </motion.section>

        {/* --- Experience Section --- */}
        {props.experience.length > 0 && (
          <PortfolioSection title="Experience">
            {props.experienceLayout === 'timeline' ? (
              <div className="flex flex-col gap-0 timeline-container">
                {props.experience.map((item, i) => (
                  <motion.div key={item.id} {...motionProps(i + 2)} className="timeline-item">
                    <div className="timeline-dot"></div>
                    {/* --- Perbarui Kartu Latar Belakang --- */}
                    <div className={`p-0 rounded-lg ${props.enable3DBackground ? 'card-bg' : props.theme.card} overflow-hidden`}>
                      {item.imageUrl && (
                        <img 
                          src={item.imageUrl} 
                          alt={item.role} 
                          className="w-full h-48 object-cover" 
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      )}
                      <div className="p-6">
                        <p className="text-sm font-medium opacity-75 md:text-right">{item.years}</p>
                        <h3 className="text-lg font-semibold">{item.role}</h3>
                        <p className="primary-text">{item.company}</p>
                        {item.url && (
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm primary-text font-medium mt-2 inline-block hover:underline">
                            Info Selengkapnya &rarr;
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {props.experience.map((item, i) => (
                  <motion.div key={item.id} {...motionProps(i + 2)} className={`rounded-lg ${props.enable3DBackground ? 'card-bg' : props.theme.card} overflow-hidden`}>
                    {item.imageUrl && (
                      <img 
                        src={item.imageUrl} 
                        alt={item.role} 
                        className="w-full h-48 object-cover" 
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    )}
                    <div className="p-6 flex flex-col md:flex-row justify-between md:items-center gap-2">
                      <div>
                        <h3 className="text-lg font-semibold">{item.role}</h3>
                        <p className="primary-text">{item.company}</p>
                        {item.url && (
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm primary-text font-medium mt-2 inline-block hover:underline">
                            Info Selengkapnya &rarr;
                          </a>
                        )}
                      </div>
                      <p className="text-sm font-medium opacity-75 md:text-right flex-shrink-0 mt-2 md:mt-0">{item.years}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </PortfolioSection>
        )}
        
        {/* --- Projects Section --- */}
        {props.projects.length > 0 && (
          <PortfolioSection title="Projects">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {props.projects.map((item, i) => (
                <motion.a 
                  key={item.id}
                  href={item.url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  {...motionProps(i + 4)}
                  className={`rounded-lg ${props.enable3DBackground ? 'card-bg' : props.theme.card} flex flex-col gap-0 overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all`}
                >
                  {item.imageUrl && (
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-48 object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                  <div className="p-6 flex flex-col gap-2">
                    <h3 className="text-lg font-semibold primary-text">{item.title}</h3>
                    <p className="text-sm flex-grow">{item.description}</p>
                    <span className="text-sm primary-text font-medium mt-2 inline-block">
                      Lihat Proyek &rarr;
                    </span>
                  </div>
                </motion.a>
              ))}
            </div>
          </PortfolioSection>
        )}

        {/* --- BAGIAN BARU: SKILLS --- */}
        {props.skills.length > 0 && (
          <PortfolioSection title="Skills">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {props.skills.map((item, i) => (
                <motion.div
                  key={item.id}
                  {...motionProps(i + 6)}
                  className={`p-6 rounded-lg ${props.enable3DBackground ? 'card-bg' : props.theme.card}`}
                >
                  <h3 className="text-xl font-semibold mb-3">{item.category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.split(',').map(tag => tag.trim()).filter(Boolean).map(t => (
                      <span key={t} className="text-sm font-medium px-3 py-1 rounded-full primary-text" style={{backgroundColor: `var(--primary-color)1A` /* opacity 10% */}}>
                        {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </PortfolioSection>
        )}
        
        {/* --- Certifications Section --- */}
        {props.certifications.length > 0 && (
          <PortfolioSection title="Licenses & Certifications">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {props.certifications.map((item, i) => (
                <motion.a
                  key={item.id}
                  href={item.url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  {...motionProps(i + 8)}
                  className={`rounded-lg ${props.enable3DBackground ? 'card-bg' : props.theme.card} flex flex-col gap-0 overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all`}
                >
                  {item.imageUrl && (
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-48 object-cover" 
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold primary-text">{item.issuer}</h3>
                    <p className="text-sm">{item.title}</p>
                    <span className="text-sm primary-text font-medium mt-2 inline-block">
                      Lihat Sertifikat &rarr;
                    </span>
                  </div>
                </motion.a>
              ))}
            </div>
          </PortfolioSection>
        )}
        
        {/* --- BAGIAN BARU: PUBLICATIONS --- */}
        {props.publications.length > 0 && (
          <PortfolioSection title="Publications">
            <div className="flex flex-col gap-6">
              {props.publications.map((item, i) => (
                <motion.a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  {...motionProps(i + 10)}
                  className={`p-6 rounded-lg ${props.enable3DBackground ? 'card-bg' : props.theme.card} hover:shadow-xl transition-shadow`}
                >
                  <h3 className="text-lg font-semibold primary-text">{item.title}</h3>
                  <p className="text-sm italic opacity-75">{item.journal}</p>
                </motion.a>
              ))}
            </div>
          </PortfolioSection>
        )}

        {/* --- BAGIAN BARU: ACHIEVEMENTS --- */}
        {props.achievements.length > 0 && (
          <PortfolioSection title="Achievements">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {props.achievements.map((item, i) => (
                <motion.div
                  key={item.id}
                  {...motionProps(i + 12)}
                  className={`p-4 rounded-lg ${props.enable3DBackground ? 'card-bg' : props.theme.card} text-center`}
                >
                  <p className="text-sm font-medium">{item.title}</p>
                </motion.div>
              ))}
            </div>
          </PortfolioSection>
        )}

        {/* --- BAGIAN KONTAK --- */}
        {props.contactConfig.method !== 'none' && (
          <PortfolioSection title={props.contactConfig.introText || 'Get In Touch'}>
            <motion.form 
              {...motionProps(14)} 
              className={`p-6 md:p-8 rounded-lg ${props.enable3DBackground ? 'card-bg' : props.theme.card} flex flex-col gap-4`}
              onSubmit={(e) => e.preventDefault()} // Mencegah submit di preview
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Your Name" className="p-3 rounded-lg bg-gray-500/10 border border-gray-500/20 focus:outline-none focus:ring-2 primary-border" disabled />
                <input type="email" placeholder="Your Email" className="p-3 rounded-lg bg-gray-500/10 border border-gray-500/20 focus:outline-none focus:ring-2 primary-border" disabled />
              </div>
              <textarea rows="5" placeholder="Your Message" className="p-3 rounded-lg bg-gray-500/10 border border-gray-500/20 focus:outline-none focus:ring-2 primary-border" disabled />
              <button 
                type="submit"
                className="px-6 py-3 rounded-lg primary-bg text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                disabled
              >
                <Send size={18} />
                Send Message (Enabled in Generated Code)
              </button>
            </motion.form>
          </PortfolioSection>
        )}
        
      </div>
    </div>
  );
}
function PortfolioSection({ title, children }) {
  return (
    <motion.section {...animVariants['slide-up']} transition={{...animVariants['slide-up'].transition, delay: 0.3}} className="flex flex-col gap-6">
      <h2 className="text-3xl font-bold primary-text">{title}</h2>
      {children}
    </motion.section>
  );
}
function SocialIcon({ icon: Icon, href }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity hover:scale-110">
      <Icon size={28} />
    </a>
  );
}

// --- KOMPONEN BARU: ThreeDBackground ---
function ThreeDBackground({ logoBase64, shape }) {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null); // { scene, camera, renderer, mesh, parentEl, mouse }
  const animationFrameId = useRef(null);
  const [status, setStatus] = useState("Loading 3D assets...");

  useEffect(() => {
    // Cek dependensi
    if (!window['script-three-core']) {
      setStatus("Waiting for THREE.js...");
      const timer = setTimeout(() => setStatus("Still loading..."), 1000);
      return () => clearTimeout(timer);
    }
    
    const { THREE } = window;
    const currentCanvas = canvasRef.current;
    if (!currentCanvas) return;

    // --- PERBAIKAN: Dapatkan parent dari canvas, BUKAN parent dari canvas
    const parentEl = currentCanvas.parentElement;
    if (!parentEl) return;
    
    setStatus("Initializing scene...");

    // 1. Setup Adegan
    const scene = new THREE.Scene();
    // --- PERBAIKAN: Gunakan ukuran parentEl ---
    const camera = new THREE.PerspectiveCamera(75, parentEl.clientWidth / parentEl.clientHeight, 0.1, 1000);
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({
      canvas: currentCanvas,
      antialias: true,
      alpha: true, // Latar belakang transparan
    });
    renderer.setSize(parentEl.clientWidth, parentEl.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // 2. Setup Pencahayaan
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // 3. Setup Resize
    const handleResize = () => {
      if (!parentEl || !renderer || !camera) return;
      const width = parentEl.clientWidth;
      const height = parentEl.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(parentEl);

    // 4. Setup Interaksi Mouse
    const mouse = new THREE.Vector2(0.5, 0.5); // Mulai di tengah
    const handleMouseMove = (event) => {
      if (document.body.contains(currentCanvas)) {
        const rect = parentEl.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      }
    };
    parentEl.addEventListener('mousemove', handleMouseMove);
    parentEl.addEventListener('mouseout', () => {
        mouse.x = 0.5;
        mouse.y = 0.5;
    });

    // 5. Setup Scene Ref
    sceneRef.current = { scene, camera, renderer, mesh: null, parentEl, mouse };

    // 6. Loop Animasi
    const clock = new THREE.Clock();
    const animate = () => {
      if (animationFrameId.current === null) return; 

      const elapsedTime = clock.getElapsedTime();
      
      if (sceneRef.current?.mesh) {
        // Rotasi otomatis
        sceneRef.current.mesh.rotation.y = 0.3 * elapsedTime;
        
        // Rotasi mouse lebih halus
        const targetRotationX = mouse.y * 0.5;
        const targetRotationZ = mouse.x * 0.5;
        sceneRef.current.mesh.rotation.x += (targetRotationX - sceneRef.current.mesh.rotation.x) * 0.1;
        sceneRef.current.mesh.rotation.z += (targetRotationZ - sceneRef.current.mesh.rotation.z) * 0.1;
      }
      
      if (sceneRef.current) {
        renderer.render(scene, camera);
      }
      animationFrameId.current = requestAnimationFrame(animate);
    };
    animationFrameId.current = requestAnimationFrame(animate);

    // 7. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
      parentEl.removeEventListener('mousemove', handleMouseMove);
      parentEl.removeEventListener('mouseout', () => {
        mouse.x = 0.5;
        mouse.y = 0.5;
      });
      
      if (sceneRef.current) {
        if(sceneRef.current.parentEl) {
          resizeObserver.unobserve(sceneRef.current.parentEl);
        }
        if (sceneRef.current.mesh) {
          sceneRef.current.mesh.geometry?.dispose();
          if (sceneRef.current.mesh.material) {
            if (sceneRef.current.mesh.material.map) {
              sceneRef.current.mesh.material.map.dispose();
            }
            sceneRef.current.mesh.material.dispose();
          }
        }
        sceneRef.current.scene?.clear();
        sceneRef.current.renderer?.dispose();
      }
      sceneRef.current = null;
    };
  }, []); // Hanya berjalan sekali saat mount

  // --- Efek untuk MEMUAT/MEMPERBARUI Mesh ---
  useEffect(() => {
    if (!sceneRef.current || !window.THREE) {
      return;
    }
    if (!logoBase64) {
      if (sceneRef.current?.mesh) {
        sceneRef.current.scene.remove(sceneRef.current.mesh);
        sceneRef.current.mesh.geometry?.dispose();
        if (sceneRef.current.mesh.material) {
          if (sceneRef.current.mesh.material.map) {
            sceneRef.current.mesh.material.map.dispose();
          }
          sceneRef.current.mesh.material.dispose();
        }
        sceneRef.current.mesh = null;
      }
      return;
    }
    
    setStatus("Loading 3D texture...");
    const { THREE } = window;
    const { scene } = sceneRef.current;

    new THREE.TextureLoader().load(
      logoBase64, // src
      (texture) => { // onLoad callback
        try {
          setStatus("Creating 3D shape...");

          if (sceneRef.current.mesh) {
            scene.remove(sceneRef.current.mesh);
            sceneRef.current.mesh.geometry?.dispose();
            if (sceneRef.current.mesh.material) {
              if (sceneRef.current.mesh.material.map) {
                sceneRef.current.mesh.material.map.dispose();
              }
              sceneRef.current.mesh.material.dispose();
            }
          }

          // Buat geometri
          let geometry;
          const size = 1.5; // Ukuran dasar
          switch (shape) {
            case 'plane':
              geometry = new THREE.PlaneGeometry(size, size);
              break;
            case 'box':
              geometry = new THREE.BoxGeometry(size, size, size);
              break;
            case 'torus':
              geometry = new THREE.TorusGeometry(size / 2, size / 5, 16, 100);
              break;
            case 'cone':
              geometry = new THREE.ConeGeometry(size / 2, size, 32);
              break;
            case 'cylinder':
              geometry = new THREE.CylinderGeometry(size / 2, size / 2, size, 32);
              break;
            case 'octahedron':
              geometry = new THREE.OctahedronGeometry(size / 1.5);
              break;
            case 'dodecahedron':
              geometry = new THREE.DodecahedronGeometry(size / 1.5);
              break;
            case 'icosahedron':
              geometry = new THREE.IcosahedronGeometry(size / 1.5);
              break;
            case 'ring':
              geometry = new THREE.RingGeometry(size / 4, size / 2, 32);
              break;
            case 'sphere':
            default:
              geometry = new THREE.SphereGeometry(size / 1.5, 32, 32);
              break;
          }

          // Buat material
          const material = new THREE.MeshStandardMaterial({
            map: texture,
            color: 0xffffff, // Biarkan warna asli
            metalness: 0.2,
            roughness: 0.8,
          });

          if (shape === 'plane' || shape === 'ring') {
            material.transparent = true;
            material.alphaTest = 0.5; // Menghilangkan background transparan PNG
            material.side = THREE.DoubleSide; // Terlihat dari depan dan belakang
          }
          
          const newMesh = new THREE.Mesh(geometry, material);
          scene.add(newMesh);
          sceneRef.current.mesh = newMesh; // Simpan
          setStatus(""); // Selesai
          
        } catch (e) {
          console.error("Error creating 3D mesh:", e);
          setStatus("Error in 3D creation.");
        }
      },
      undefined, // onProgress callback
      (err) => { // onError callback
        console.error('Gagal memuat tekstur 3D dari Base64. Data gambar mungkin rusak atau tidak valid.', err);
        setStatus("Error: Gagal memuat gambar. Coba unggah file PNG/JPG yang valid.");
      }
    ); // --- Akhir dari TextureLoader ---

  }, [logoBase64, shape]); // Berjalan ulang jika data Base64 atau Bentuk berubah

  return (
    // --- PERBAIKAN: Canvas HARUS menjadi elemen anak dari div ini ---
    <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full" />
      {status && (
        <div className="absolute bottom-4 left-4 text-xs text-gray-500 opacity-50">
          {status}
        </div>
      )}
    </div>
  );
}


// --- KOMPONEN BARU: AIChatbotWindow ---
function AIChatbotWindow({ portfolioState, onClose }) {
  const { chatConfig, theme, primaryColor, name } = portfolioState;
  const [messages, setMessages] = useState([
    { sender: 'ai', text: chatConfig.introMessage || 'Halo! Ada yang bisa saya bantu?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll ke pesan terakhir
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Fungsi untuk membuat konteks dan prompt
  const createPromptContext = (query) => {
    // Salin state dan hapus data gambar yang besar
    const context = { ...portfolioState };
    delete context.logo3DBase64; // Hapus data gambar
    
    // Konversi state menjadi format teks yang mudah dibaca
    const contextString = `
      Nama Pemilik: ${context.name}
      Jabatan: ${context.title}
      Deskripsi: ${context.description}
      
      Pengalaman:
      ${context.experience.map(e => `- ${e.role} di ${e.company} (${e.years})`).join('\n')}
      
      Proyek:
      ${context.projects.map(p => `- ${p.title}: ${p.description}`).join('\n')}
      
      Skills:
      ${context.skills.map(s => `- ${s.category}: ${s.tags}`).join('\n')}
      
      Sertifikasi:
      ${context.certifications.map(c => `- ${c.title} dari ${c.issuer}`).join('\n')}
    `;
    
    return contextString;
  };

  // Fungsi untuk memanggil API Gemini
  const callGeminiAPI = async (query) => {
    setIsLoading(true);
    
    // 1. Buat System Prompt
    const systemPrompt = `You are ${chatConfig.aiName}, a professional AI assistant for the portfolio of ${name}.
Your task is to answer questions based *only* on the portfolio data provided.
Be friendly, concise, and helpful.
If the question is about topics outside the portfolio (like weather, news, or general knowledge), you MUST politely decline and redirect the conversation back to the portfolio.
The user's language is Indonesian. You MUST reply in Indonesian.

PORTFOLIO DATA CONTEXT:
---
${createPromptContext(query)}
---
`;

    // 2. Siapkan Payload
    const apiKey = ""; // Disediakan oleh environment
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    
    const payload = {
      contents: [{
        role: "user",
        parts: [{ text: query }]
      }],
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      generationConfig: {
        temperature: 0.7,
        topK: 1,
        topP: 1,
        maxOutputTokens: 256,
      }
    };
    
    // 3. Panggil API
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      const aiText = result.candidates?.[0]?.content?.parts?.[0]?.text;

      // --- PERBAIKAN: Penanganan respons yang lebih baik ---
      if (aiText) {
        setMessages(prev => [...prev, { sender: 'ai', text: aiText }]);
      } else {
        // Cek apakah ada safety blocking
        const blockReason = result.promptFeedback?.blockReason;
        if (blockReason) {
          console.warn(`Gemini API call blocked: ${blockReason}`, result);
          let userFriendlyMessage = 'Maaf, saya tidak bisa merespons pertanyaan itu karena alasan keamanan.';
          if (blockReason === 'SAFETY') {
             userFriendlyMessage = 'Maaf, pertanyaan Anda terdeteksi melanggar kebijakan keamanan saya. Bisakah Anda bertanya tentang portofolio ini saja?';
          }
          setMessages(prev => [...prev, { sender: 'ai', text: userFriendlyMessage }]);
        } else {
          // Jika tidak ada teks dan tidak ada block reason, berarti responsnya kosong/aneh
          console.warn("Invalid API response structure:", result);
          setMessages(prev => [...prev, { sender: 'ai', text: 'Maaf, saya tidak menemukan jawaban untuk itu di data portofolio ini.' }]);
        }
        // Jangan melempar error di sini, cukup kirim pesan ke pengguna
      }
      // --- AKHIR PERBAIKAN ---

    } catch (error) {
      console.error("Gemini API call failed:", error);
      setMessages(prev => [...prev, { sender: 'ai', text: 'Maaf, saya mengalami sedikit gangguan. Silakan coba lagi nanti.' }]);
    }
    
    setIsLoading(false);
  };

  // Handler saat form disubmit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    
    callGeminiAPI(input);
    
    setInput('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      className="fixed bottom-8 right-8 z-50 w-[350px] h-[450px] bg-white rounded-lg shadow-xl flex flex-col overflow-hidden border border-gray-200"
      style={{ fontFamily: 'Inter, sans-serif' }}
    >
      {/* Header */}
      <div
        className="flex justify-between items-center p-3 text-white"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="flex items-center gap-2">
          <Bot size={20} />
          <h3 className="font-semibold">{chatConfig.aiName}</h3>
        </div>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20">
          <X size={18} />
        </button>
      </div>
      
      {/* Message List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] p-3 rounded-lg text-sm ${
                msg.sender === 'user' 
                  ? 'bg-blue-100 text-gray-800 rounded-br-none' 
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="p-3 rounded-lg bg-gray-100 rounded-bl-none">
              <Loader2 size={16} className="animate-spin text-gray-500" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1"
            style={{ borderColor: primaryColor, ringColor: primaryColor }}
            placeholder={chatConfig.placeholder || 'Ketik pesan Anda...'}
          />
          <button
            type="submit"
            className="p-2 rounded-lg text-white"
            style={{ backgroundColor: primaryColor }}
            disabled={isLoading}
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </motion.div>
  );
}


// --- Komponen Generated Code (PERUBAHAN BESAR) ---
function GeneratedCode(props) {
  const [copied, setCopied] = useState(false);
  const code = useMemo(() => generateStaticHTML(props), [props]);

  const handleCopy = () => {
    const el = document.createElement('textarea');
    el.value = code;
    document.body.appendChild(el);
    el.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
    document.body.removeChild(el);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Your Generated Code</h2>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
            copied ? 'bg-green-500 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'
          } transition-all`}
        >
          {copied ? <CheckSquare size={16} /> : <Copy size={16} />}
          {copied ? 'Copied!' : 'Copy Code'}
        </button>
      </div>
      
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800 mb-2">✅ Kode Siap Pakai!</h3>
        <p className="text-sm text-green-700">
          Semua fitur Anda, termasuk **AI Chatbot** dan **Latar 3D**, telah disuntikkan ke dalam file HTML tunggal ini!
        </p>
      </div>

      <p className="text-sm text-gray-600">
        Ini adalah file HTML tunggal dengan CSS (Tailwind) dan JavaScript (untuk formulir, 3D, dan AI Chatbot).
      </p>
      <pre className="bg-gray-900 text-gray-200 p-4 rounded-lg overflow-x-auto text-sm">
        <code>
          {code}
        </code>
      </pre>
    </div>
  );
}

// --- FUNGSI GENERATOR KODE (PERUBAHAN BESAR) ---

// --- FUNGSI BARU UNTUK MEMBUAT SKRIP 3D LATAR BELAKANG ---
function generateThreeDBackgroundScript(props) {
  if (!props.enable3DBackground || !props.logo3DBase64) return '';

  return `
<!-- Skrip Three.js Diinjeksi -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script>
  window.addEventListener('load', () => {
    if (typeof THREE === 'undefined') {
      console.error('Skrip Three.js gagal dimuat.');
      return;
    }

    // Ambil data yang "dipanggang"
    const mountEl = document.getElementById('three-background-canvas');
    const logoDataBase64 = "${props.logo3DBase64}";
    const shape = "${props.shape3D}";

    if (!mountEl) return;
    
    const parentEl = mountEl.parentElement;
    if (!parentEl) return;

    // 1. Setup Adegan
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, parentEl.clientWidth / parentEl.clientHeight, 0.1, 1000);
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ 
      canvas: mountEl,
      antialias: true, 
      alpha: true // Transparan
    });
    renderer.setSize(parentEl.clientWidth, parentEl.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // 2. Setup Pencahayaan
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // 3. Setup Resize
    const resizeObserver = new ResizeObserver(() => {
      if (!parentEl || !renderer || !camera) return;
      const width = parentEl.clientWidth;
      const height = parentEl.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    });
    resizeObserver.observe(parentEl);

    // 4. Setup Interaksi Mouse
    const mouse = new THREE.Vector2(0.5, 0.5);
    parentEl.addEventListener('mousemove', (event) => {
      const rect = parentEl.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    });
    parentEl.addEventListener('mouseout', () => {
        mouse.x = 0.5;
        mouse.y = 0.5;
    });

    // 5. Variabel Mesh
    let currentMesh = null;

    // 6. Muat Tekstur dan Buat Mesh
    new THREE.TextureLoader().load(
      logoDataBase64, // src
      (texture) => { // onLoad
        try {
          let geometry;
          const size = 1.5;
          switch (shape) {
            case 'plane':
              geometry = new THREE.PlaneGeometry(size, size);
              break;
            case 'box':
              geometry = new THREE.BoxGeometry(size, size, size);
              break;
            case 'torus':
              geometry = new THREE.TorusGeometry(size / 2, size / 5, 16, 100);
              break;
            case 'cone':
              geometry = new THREE.ConeGeometry(size / 2, size, 32);
              break;
            case 'cylinder':
              geometry = new THREE.CylinderGeometry(size / 2, size / 2, size, 32);
              break;
            case 'octahedron':
              geometry = new THREE.OctahedronGeometry(size / 1.5);
              break;
            case 'dodecahedron':
              geometry = new THREE.DodecahedronGeometry(size / 1.5);
              break;
            case 'icosahedron':
              geometry = new THREE.IcosahedronGeometry(size / 1.5);
              break;
            case 'ring':
              geometry = new THREE.RingGeometry(size / 4, size / 2, 32);
              break;
            case 'sphere':
            default:
              geometry = new THREE.SphereGeometry(size / 1.5, 32, 32);
              break;
          }

          const material = new THREE.MeshStandardMaterial({
            map: texture,
            color: 0xffffff,
            metalness: 0.2,
            roughness: 0.8,
          });

          if (shape === 'plane' || shape === 'ring') {
            material.transparent = true;
            material.alphaTest = 0.5;
            material.side = THREE.DoubleSide;
          }
          
          currentMesh = new THREE.Mesh(geometry, material);
          scene.add(currentMesh);
        } catch (e) {
           console.error('Gagal membuat mesh 3D di HTML:', e);
        }
      },
      undefined, // onProgress
      (err) => { // onError
        console.error('Gagal memuat tekstur 3D dari Base64 di HTML. Data gambar mungkin rusak atau tidak valid.', err);
      }
    );

    // 7. Loop Animasi
    const clock = new THREE.Clock();
    const animate = () => {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      
      if (currentMesh) {
        currentMesh.rotation.y = 0.3 * elapsedTime;
        const targetRotationX = mouse.y * 0.5;
        const targetRotationZ = mouse.x * 0.5;
        currentMesh.rotation.x += (targetRotationX - currentMesh.rotation.x) * 0.1;
        currentMesh.rotation.z += (targetRotationZ - currentMesh.rotation.z) * 0.1;
      }
      
      renderer.render(scene, camera);
    };
    animate();
  });
</script>
`;
}

// --- FUNGSI BARU UNTUK MEMBUAT SKRIP CHATBOT ---
function generateChatbotScript(props) {
  if (!props.chatConfig.enable) return '';

  // Buat konteks data portofolio
  const context = { ...props };
  delete context.logo3DBase64; // Hapus data gambar
  
  const contextString = `
    Nama Pemilik: ${context.name}
    Jabatan: ${context.title}
    Deskripsi: ${context.description}
    Pengalaman:
    ${context.experience.map(e => `- ${e.role} di ${e.company} (${e.years})`).join('\n')}
    Proyek:
    ${context.projects.map(p => `- ${p.title}: ${p.description}`).join('\n')}
    Skills:
    ${context.skills.map(s => `- ${s.category}: ${s.tags}`).join('\n')}
    Sertifikasi:
    ${context.certifications.map(c => `- ${c.title} dari ${c.issuer}`).join('\n')}
  `;
  
  const systemPrompt = `You are ${props.chatConfig.aiName}, a professional AI assistant for the portfolio of ${props.name}.
Your task is to answer questions based *only* on the portfolio data provided.
Be friendly, concise, and helpful.
If the question is about topics outside the portfolio (like weather, news, or general knowledge), you MUST politely decline and redirect the conversation back to the portfolio.
The user's language is Indonesian. You MUST reply in Indonesian.

PORTFOLIO DATA CONTEXT:
---
${contextString}
---
`;

  return `
<!-- Skrip AI Chatbot Diinjeksi -->
<script>
  window.addEventListener('load', () => {
    // Referensi Elemen
    const chatFab = document.getElementById('chat-fab');
    const chatWindow = document.getElementById('chat-window');
    const chatClose = document.getElementById('chat-close');
    const chatMessages = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatLoading = document.getElementById('chat-loading');

    if (!chatFab) return; // Fitur dinonaktifkan

    // Data Konteks (Dipanggang)
    const systemPrompt = ${JSON.stringify(systemPrompt)}; // Gunakan JSON.stringify agar aman
    const primaryColor = "${props.primaryColor}";

    // Tampilkan/Sembunyikan Jendela
    chatFab.addEventListener('click', () => {
      chatWindow.classList.remove('hidden');
      chatFab.classList.add('hidden');
    });
    chatClose.addEventListener('click', () => {
      chatWindow.classList.add('hidden');
      chatFab.classList.remove('hidden');
    });

    // Fungsi untuk menambah pesan ke UI
    function addMessage(sender, text) {
      const msgDiv = document.createElement('div');
      msgDiv.className = 'flex ' + (sender === 'user' ? 'justify-end' : 'justify-start');
      
      const textDiv = document.createElement('div');
      textDiv.className = 'max-w-[80%] p-3 rounded-lg text-sm ' + (sender === 'user' 
        ? 'bg-blue-100 text-gray-800 rounded-br-none' 
        : 'bg-gray-100 text-gray-800 rounded-bl-none');
      textDiv.textContent = text;
      
      msgDiv.appendChild(textDiv);
      chatMessages.appendChild(msgDiv);
      // Auto-scroll
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Fungsi untuk memanggil API
    async function callGeminiAPI(query) {
      chatLoading.classList.remove('hidden');
      chatSend.disabled = true;

      const apiKey = ""; // Disediakan oleh environment
      const apiUrl = \`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=\${apiKey}\`;
      
      const payload = {
        contents: [{ role: "user", parts: [{ text: query }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
          temperature: 0.7,
          topK: 1,
          topP: 1,
          maxOutputTokens: 256,
        }
      };

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error('HTTP error ' + response.status);
        }
        
        const result = await response.json();
        
        const aiText = result.candidates?.[0]?.content?.parts?.[0]?.text;

        // --- PERBAIKAN: Penanganan respons yang lebih baik (HTML) ---
        if (aiText) {
          addMessage('ai', aiText);
        } else {
          // Cek apakah ada safety blocking
          const blockReason = result.promptFeedback?.blockReason;
          if (blockReason) {
            console.warn('Gemini API call blocked: ' + blockReason, result);
            let userFriendlyMessage = 'Maaf, saya tidak bisa merespons pertanyaan itu karena alasan keamanan.';
            if (blockReason === 'SAFETY') {
               userFriendlyMessage = 'Maaf, pertanyaan Anda terdeteksi melanggar kebijakan keamanan saya. Bisakah Anda bertanya tentang portofolio ini saja?';
            }
            addMessage('ai', userFriendlyMessage);
          } else {
            console.warn("Invalid API response structure:", result);
            addMessage('ai', 'Maaf, saya tidak menemukan jawaban untuk itu di data portofolio ini.');
          }
          // Jangan melempar error
        }
        // --- AKHIR PERBAIKAN (HTML) ---

      } catch (error) {
        console.error("Gemini API call failed:", error);
        addMessage('ai', 'Maaf, saya mengalami sedikit gangguan. Silakan coba lagi nanti.');
      }
      
      chatLoading.classList.add('hidden');
      chatSend.disabled = false;
      chatInput.focus();
    }

    // Event listener untuk form
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = chatInput.value.trim();
      if (!query) return;

      addMessage('user', query);
      callGeminiAPI(query);
      chatInput.value = '';
    });
  });
</script>
`;
}


function generateStaticHTML(props) {
  const { 
    name, title, description, profilePic, socials, projects, experience,
    skills, certifications, publications, achievements,
    contactConfig, 
    chatConfig, // <-- Ambil Chat Config
    theme, primaryColor, font, experienceLayout,
    enable3DBackground 
  } = props;

  const fontLink = font === 'Inter' 
    ? '' 
    : `<link href="https://fonts.googleapis.com/css2?family=${font.replace(' ', '+')}:wght@400;700&display=swap" rel="stylesheet">`;

  // --- Helper HTML Generators ---
  const socialsHTML = `
    <div class="flex gap-4 mt-4 justify-center md:justify-start">
      ${socials.github ? `<a href="https://github.com/${socials.github}" target="_blank" rel="noopener noreferrer" class="hover:opacity-70"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-4.3 1.4 -4.3-2.5 -6-3m12 5v-3.5c0-1 .1-1.4 -.5-2 2.8-.3 5.5-1.4 5.5-6c0-1.2-.5-2.3-1.3-3.1-.2-.8.1-1.6-.3-2.2 0 0-1.1-.3-3.5 1.3c-1-.3-2.1-.4-3.2-.4s-2.2.1-3.2.4C2 2.7 1 3 1 3c-.4.6-.2 1.4-.3 2.2C-.4 6.2 0 7.3 0 8.5c0 4.6 2.7 5.7 5.5 6-.6.5-.5 1.4-.5 2V22"></path></svg></a>` : ''}
      ${socials.linkedin ? `<a href="https://linkedin.com/in/${socials.linkedin}" target="_blank" rel="noopener noreferrer" class="hover:opacity-70"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>` : ''}
      ${socials.twitter ? `<a href="https://twitter.com/${socials.twitter}" target="_blank" rel="noopener noreferrer" class="hover:opacity-70"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg></a>` : ''}
    </div>
  `;
    
  const heroHTML = `
    <section class="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
        <img
            src="${profilePic}"
            alt="Profile"
            class="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-lg border-4 primary-border"
            onerror="this.src='https://placehold.co/150x150/E2E8F0/334155?text=:)';"
        />
        <div class="flex-1 flex flex-col gap-2">
            <h1 class="text-4xl md:text-5xl font-bold">${name}</h1>
            <h2 class="text-xl md:text-2xl font-semibold primary-text">${title}</h2>
            <p class="text-lg mt-2">${description}</p>
            ${socialsHTML}
        </div>
    </section>
  `;
  
  const mainContentBg = enable3DBackground ? 'bg-transparent' : theme.bg;
  
  // --- PERBAIKAN: Logika Card Class disederhanakan ---
  const cardClass = enable3DBackground 
    ? `shadow-lg ${
        theme.id === 'dark' ? 'bg-[rgba(15,12,41,0.8)]' : // Fallback solid untuk dark
        theme.id === 'minimalist' ? 'bg-[rgba(255,255,255,0.8)]' : // Fallback solid untuk light
        theme.bgValue ? `${theme.bgValue.replace(']', 'CC]')} ` : // Gunakan bgValue + transparansi 80%
        'bg-[rgba(255,255,255,0.8)]' // Default fallback
      } ${
        theme.id.includes('glass') ? 'backdrop-blur-sm' : 'backdrop-blur-sm' // Terapkan blur
      } ${
        theme.card.includes('border') ? (theme.id.includes('dark') ? 'border border-gray-700/50' : 'border border-gray-200/50') : ''
      }`
    : theme.card;


  const experienceHTML = experience.length > 0 ? `
    <section class="flex flex-col gap-6">
      <h2 class="text-3xl font-bold primary-text">Experience</h2>
      ${experienceLayout === 'timeline' ? `
      <div class="flex flex-col gap-0 timeline-container">
        ${experience.map(item => `
          <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="rounded-lg ${cardClass} overflow-hidden">
              ${item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.role}" class="w-full h-48 object-cover" onerror="this.style.display='none'" />` : ''}
              <div class="p-6">
                <p class="text-sm font-medium opacity-75 md:text-right">${item.years}</p>
                <h3 class="text-lg font-semibold">${item.role}</h3>
                <p class="primary-text">${item.company}</p>
                ${item.url ? `<a href="${item.url}" target="_blank" rel="noopener noreferrer" class="text-sm primary-text font-medium mt-2 inline-block hover:underline">Info Selengkapnya &rarr;</a>` : ''}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      ` : `
      <div class="flex flex-col gap-6">
        ${experience.map(item => `
          <div class="rounded-lg ${cardClass} overflow-hidden">
            ${item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.role}" class="w-full h-48 object-cover" onerror="this.style.display='none'" />` : ''}
            <div class="p-6 flex flex-col md:flex-row justify-between md:items-center gap-2">
              <div>
                <h3 class="text-lg font-semibold">${item.role}</h3>
                <p class="primary-text">${item.company}</p>
                ${item.url ? `<a href="${item.url}" target="_blank" rel="noopener noreferrer" class="text-sm primary-text font-medium mt-2 inline-block hover:underline">Info Selengkapnya &rarr;</a>` : ''}
              </div>
              <p class="text-sm font-medium opacity-75 md:text-right flex-shrink-0 mt-2 md:mt-0">${item.years}</p>
            </div>
          </div>
        `).join('')}
      </div>
      `}
    </section>
  ` : '';


  const projectsHTML = projects.length > 0 ? `
    <section class="flex flex-col gap-6">
      <h2 class="text-3xl font-bold primary-text">Projects</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${projects.map(item => `
          <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="rounded-lg ${cardClass} flex flex-col gap-0 overflow-hidden hover:shadow-xl transition-all">
            ${item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.title}" class="w-full h-48 object-cover" onerror="this.style.display='none'" />` : ''}
            <div class="p-6 flex flex-col gap-2 flex-grow">
              <h3 class="text-lg font-semibold primary-text">${item.title}</h3>
              <p class="text-sm flex-grow">${item.description}</p>
              <span class="text-sm primary-text font-medium mt-2 inline-block">Lihat Proyek &rarr;</span>
            </div>
          </a>
        `).join('')}
      </div>
    </section>
  ` : '';

  const certsHTML = certifications.length > 0 ? `
    <section class="flex flex-col gap-6">
      <h2 class="text-3xl font-bold primary-text">Licenses & Certifications</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${certifications.map(item => `
          <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="rounded-lg ${cardClass} flex flex-col gap-0 overflow-hidden hover:shadow-xl transition-all">
            ${item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.title}" class="w-full h-48 object-cover" onerror="this.style.display='none'" />` : ''}
            <div class="p-6 flex flex-col gap-2 flex-grow">
              <h3 class="text-lg font-semibold primary-text">${item.issuer}</h3>
              <p class="text-sm flex-grow">${item.title}</p>
              <span class="text-sm primary-text font-medium mt-2 inline-block">Lihat Sertifikat &rarr;</span>
            </div>
          </a>
        `).join('')}
      </div>
    </section>
  ` : '';

  const skillsHTML = skills.length > 0 ? `
    <section class="flex flex-col gap-6">
      <h2 class="text-3xl font-bold primary-text">Skills</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${skills.map(item => `
          <div class="p-6 rounded-lg ${cardClass}">
            <h3 class="text-xl font-semibold mb-3">${item.category}</h3>
            <div class="flex flex-wrap gap-2">
              ${item.tags.split(',').map(tag => tag.trim()).filter(Boolean).map(t => `
                <span class="text-sm font-medium px-3 py-1 rounded-full primary-text" style="background-color: ${primaryColor}1A">
                  ${t}
                </span>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  ` : '';
  
  const publicationsHTML = publications.length > 0 ? `
    <section class="flex flex-col gap-6">
      <h2 class="text-3xl font-bold primary-text">Publications</h2>
      <div class="flex flex-col gap-6">
        ${publications.map(item => `
          <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="p-6 rounded-lg ${cardClass} hover:shadow-xl transition-shadow">
            <h3 class="text-lg font-semibold primary-text">${item.title}</h3>
            <p class="text-sm italic opacity-75">${item.journal}</p>
          </a>
        `).join('')}
      </div>
    </section>
  ` : '';

  const achievementsHTML = achievements.length > 0 ? `
    <section class="flex flex-col gap-6">
      <h2 class="text-3xl font-bold primary-text">Achievements</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        ${achievements.map(item => `
          <div class="p-4 rounded-lg ${cardClass} text-center">
            <p className="text-sm font-medium">${item.title}</p>
          </div>
        `).join('')}
      </div>
    </section>
  ` : '';

  let contactHTML = '';
  let formScript = '';

  if (contactConfig.method !== 'none') {
    let formTag = `<form id="contact-form" class="p-6 md:p-8 rounded-lg ${cardClass} flex flex-col gap-4">`;
    
    switch(contactConfig.method) {
      case 'endpoint':
        formTag = `<form action="${contactConfig.value}" method="POST" class="p-6 md:p-8 rounded-lg ${cardClass} flex flex-col gap-4">`;
        if (contactConfig.value.includes('web3forms')) {
          formTag += `\n    <input type="hidden" name="access_key" value="${contactConfig.value.split('/').pop()}">`;
        }
        break;
      case 'mailto':
        formTag = `<form action="mailto:${contactConfig.value}" method="POST" enctype="text/plain" class="p-6 md:p-8 rounded-lg ${cardClass} flex flex-col gap-4">`;
        break;
      case 'whatsapp':
        formScript = `
<script>
  document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    var name = e.target.name.value;
    var email = e.target.email.value;
    var message = e.target.message.value;
    var waNumber = "${contactConfig.value}";
    var text = "Halo! Saya " + name + " (" + email + ").\\n\\n" + message;
    var url = "https://wa.me/" + waNumber + "?text=" + encodeURIComponent(text);
    window.open(url, '_blank');
  });
</script>
        `;
        break;
      case 'google_sheets':
        formScript = `
<script>
  document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    var form = e.target;
    var submitButton = form.querySelector('button[type="submit"]');
    var originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = 'Sending...';

    fetch("${contactConfig.value}", {
      method: 'POST',
      body: new FormData(form)
    })
    .then(response => response.text())
    .then(data => {
      if (data === "Success") {
        alert("Message sent successfully!");
        form.reset();
      } else {
        throw new Error("Submission failed");
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert("Error sending message. Please try again.");
    })
    .finally(() => {
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
    });
  });
</script>
        `;
        break;
      default:
        break;
    }

    contactHTML = `
    <section class="flex flex-col gap-6">
      <h2 class="text-3xl font-bold primary-text">${contactConfig.introText || 'Get In Touch'}</h2>
      ${formTag}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="name" placeholder="Your Name" required class="p-3 rounded-lg bg-gray-500/10 border border-gray-500/20 focus:outline-none focus:ring-2 primary-border" />
          <input type="email" name="email" placeholder="Your Email" required class="p-3 rounded-lg bg-gray-500/10 border border-gray-500/20 focus:outline-none focus:ring-2 primary-border" />
        </div>
        <textarea rows="5" name="message" placeholder="Your Message" required class="p-3 rounded-lg bg-gray-500/10 border border-gray-500/20 focus:outline-none focus:ring-2 primary-border"></textarea>
        <button 
          type="submit"
          class="px-6 py-3 rounded-lg primary-bg text-white font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          Send Message
        </button>
      </form>
    </section>
  `;
  }
  
  // --- INJEKSI HTML & SCRIPT UNTUK CHATBOT ---
  
  const chatbotHTML = chatConfig.enable ? `
    <!-- Tombol Chat FAB -->
    <button id="chat-fab" title="Tanya AI Assistant" class="fixed bottom-8 right-8 z-40 p-4 rounded-full shadow-lg text-white" style="background-color: ${primaryColor};">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    </button>
    
    <!-- Jendela Chat (Hidden by default) -->
    <div id="chat-window" class="hidden fixed bottom-8 right-8 z-50 w-[350px] h-[450px] bg-white rounded-lg shadow-xl flex flex-col overflow-hidden border border-gray-200" style="font-family: 'Inter', sans-serif;">
      <!-- Header -->
      <div class="flex justify-between items-center p-3 text-white" style="background-color: ${primaryColor};">
        <div class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8L4 8v4h4v4h4v-4h4V8z"></path><path d="M20 12h-4v4h4v-4z"></path><path d="M16 4h4v4h-4z"></path><path d="M12 14v-2h-2v2"></path><path d="M12 18v-2h-2v2"></path><path d="M16 14v-2h-2v2"></path></svg>
          <h3 class="font-semibold">${chatConfig.aiName}</h3>
        </div>
        <button id="chat-close" class="p-1 rounded-full hover:bg-white/20">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      
      <!-- Daftar Pesan -->
      <div id="chat-messages" class="flex-1 p-4 overflow-y-auto space-y-4">
        <!-- Pesan Intro -->
        <div class="flex justify-start">
          <div class="max-w-[80%] p-3 rounded-lg text-sm bg-gray-100 text-gray-800 rounded-bl-none">
            ${chatConfig.introMessage}
          </div>
        </div>
        <!-- Loading indicator (hidden by default) -->
        <div id="chat-loading" class="hidden flex justify-start">
          <div class="p-3 rounded-lg bg-gray-100 rounded-bl-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-spin text-gray-500">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
            </svg>
          </div>
        </div>
      </div>
      
      <!-- Form Input -->
      <form id="chat-form" class="p-3 border-t border-gray-200">
        <div class="flex items-center gap-2">
          <input
            id="chat-input"
            type="text"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1"
            style="border-color: ${primaryColor}; ring-color: ${primaryColor};"
            placeholder="${chatConfig.placeholder}"
          />
          <button
            id="chat-send"
            type="submit"
            class="p-2 rounded-lg text-white"
            style="background-color: ${primaryColor};"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </div>
      </form>
    </div>
  ` : '';
  
  const chatbotScript = generateChatbotScript(props);


  const timelineStyle = experienceLayout === 'timeline' ? `
      .timeline-container {
        position: relative;
        padding-left: 3rem;
      }
      .timeline-container::before {
        content: '';
        position: absolute;
        left: 1.25rem;
        top: 0.5rem;
        bottom: 0.5rem;
        width: 2px;
        background-color: ${theme.id.includes('dark') ? '#4b5563' : '#d1d5db'};
      }
      .timeline-item {
        position: relative;
      }
      .timeline-item:not(:last-child) {
        padding-bottom: 2rem;
      }
      .timeline-dot {
        position: absolute;
        left: -2.5rem;
        top: 0.5rem;
        width: 1.25rem;
        height: 1.25rem;
        border-radius: 9999px;
        background-color: var(--primary-color);
        border: 2px solid ${enable3DBackground ? (theme.id.includes('dark') ? '#0f0c29' : '#ffffff') : (theme.bgValue || (theme.id === 'dark' ? '#0f0c29' : '#ffffff'))};
      }
    ` : '';
    
  
  const threeJSScript = generateThreeDBackgroundScript(props);
  
  const threeDCanvasHTML = enable3DBackground 
    ? `<div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 0;">
         <canvas id="three-background-canvas"></canvas>
       </div>` 
    : '';

  // --- Main Template String ---
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name} - Portfolio</title>
    <script src="https://cdn.tailwindcss.com"></script>
    ${fontLink}
    <style>
        :root {
            --primary-color: ${primaryColor};
            --font-main: '${font}', sans-serif;
        }
        html { scroll-behavior: smooth; }
        body { 
          font-family: var(--font-main); 
          ${!enable3DBackground ? `background-color: ${theme.bgValue || '#ffffff'};` : ''}
        }
        .primary-text { color: var(--primary-color); }
        .primary-bg { background-color: var(--primary-color); color: white; }
        .primary-border { border-color: var(--primary-color); }
        
        ${timelineStyle}
    </style>
</head>
<body class="w-full min-h-full ${enable3DBackground ? 'bg-transparent' : theme.bg} ${theme.text}">
    
    <!-- Sisipkan Latar 3D Canvas di sini -->
    ${threeDCanvasHTML}

    <!-- Sisipkan HTML Chatbot di sini -->
    ${chatbotHTML}

    <!-- Konten Portofolio -->
    <div class="max-w-4xl mx-auto p-8 md:p-16 flex flex-col gap-12 md:gap-16 relative z-10 ${mainContentBg}">
        
        ${heroHTML}
        
        ${experienceHTML}
        ${projectsHTML}
        ${skillsHTML}
        ${certsHTML}
        ${publicationsHTML}
        ${achievementsHTML}
        
        <!-- Contact Section (Auto-configured) -->
        ${contactHTML}

    </div>

    <!-- Form Submission Script (Auto-injected if needed) -->
    ${formScript}
    
    <!-- Sisipkan Skrip 3D di sini -->
    ${threeJSScript}
    
    <!-- Sisipkan Skrip Chatbot di sini -->
    ${chatbotScript}
</body>
</html>`;
}
