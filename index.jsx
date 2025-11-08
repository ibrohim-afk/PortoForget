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
                    onAdd={() => addItem(setExperience, { role: 'New Role
