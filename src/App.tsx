import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, CheckCircle2, Clock, AlertTriangle, Search, Filter, Plus, 
  Download, ShieldCheck, Layers, Eye, Edit3, Trash2, UserCheck, RefreshCw, 
  Moon, Sun, BookOpen, Tag, ChevronRight, ChevronDown, Database, Code, 
  GitPullRequest, Lock, Bell, ExternalLink, X, MessageSquare, Award, 
  Check, FileSpreadsheet, Activity, Building, ShieldAlert, Cpu, ArrowUpRight,
  UploadCloud, File, CheckCircle, AlertCircle, Calendar, ArrowRight, LayoutGrid, CheckSquare
} from 'lucide-react';

const IATF_CLAUSES = [
  { code: '4.1', name: 'Memahami Organisasi & Konteksnya' },
  { code: '5.1', name: 'Kepemimpinan dan Komitmen' },
  { code: '6.1', name: 'Tindakan Menangani Risiko & Peluang' },
  { code: '7.5', name: 'Informasi Terdokumentasi (Documented Information)' },
  { code: '8.5', name: 'Produksi dan Penyediaan Jasa' },
  { code: '9.2', name: 'Audit Internal (System & Layered Process Audit)' },
  { code: '10.2', name: 'Ketidaksesuaian dan Tindakan Korektif (8D Report)' }
];

const DOC_LEVELS = [
  { id: 'L1', code: 'L1', name: 'Level 1: Manual Mutu', color: 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-300' },
  { id: 'L2', code: 'L2', name: 'Level 2: Prosedur Terintegrasi', color: 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-300' },
  { id: 'L3', code: 'L3', name: 'Level 3: Instruksi Kerja (WI)', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300' },
  { id: 'L4', code: 'L4', name: 'Level 4: Form & Rekaman Mutu', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300' }
];

const CORE_TOOLS = [
  { id: 'NONE', name: 'Non Core Tool' },
  { id: 'APQP', name: 'APQP (Advanced Product Quality Planning)' },
  { id: 'FMEA', name: 'FMEA (PFMEA / DFMEA AIAG-VDA)' },
  { id: 'CONTROL_PLAN', name: 'Control Plan (Rencana Kontrol)' },
  { id: 'MSA', name: 'MSA (Measurement System Analysis)' },
  { id: 'SPC', name: 'SPC (Statistical Process Control)' },
  { id: 'PPAP', name: 'PPAP (Production Part Approval Process)' },
  { id: '8D', name: '8D Problem Solving Report' },
  { id: 'LPA', name: 'LPA (Layered Process Audit)' }
];

const CUSTOMERS_CSR = [
  'General Automotive',
  'Toyota Motor CSR',
  'Honda R&D CSR',
  'Hyundai Motor CSR',
  'Ford Q1 Requirements'
];

const INITIAL_DOCUMENTS = [
  {
    id: 'DOC-101',
    docNumber: 'IATF/QA/L1/001',
    title: 'Manual Mutu Otomotif IATF 16949:2016',
    level: 'L1',
    department: 'Quality Assurance',
    author: 'Ir. Ahmad Zarkasi',
    reviewer: 'Dewi Lestari',
    approver: 'Budi Santoso',
    version: 'Rev. 04',
    status: 'Approved',
    effectiveDate: '2024-01-15',
    reviewDueDate: '2025-01-15',
    clauses: ['4.1', '5.1', '7.5'],
    coreTool: 'APQP',
    csr: ['General Automotive', 'Toyota Motor CSR'],
    fileType: 'PDF',
    fileSize: '4.2 MB',
    securityLevel: 'Internal',
    history: [
      { revision: 'Rev. 04', date: '2024-01-15', author: 'Ir. Ahmad Zarkasi', changeLog: 'Pembaruan penyesuaian klausul 7.5.3 kontrol dokumen terdistribusi' },
      { revision: 'Rev. 03', date: '2023-01-10', author: 'Ir. Ahmad Zarkasi', changeLog: 'Integrasi persyaratan Tambahan Customer Specific Requirements (CSR)' }
    ],
    comments: []
  },
  {
    id: 'DOC-102',
    docNumber: 'IATF/QA/L2/005',
    title: 'Prosedur Kontrol Informasi Terdokumentasi (Klausul 7.5)',
    level: 'L2',
    department: 'Quality Assurance',
    author: 'Budi Santoso',
    reviewer: 'Dewi Lestari',
    approver: 'Ir. Ahmad Zarkasi',
    version: 'Rev. 02',
    status: 'Approved',
    effectiveDate: '2023-06-20',
    reviewDueDate: '2024-06-20',
    clauses: ['7.5'],
    coreTool: 'NONE',
    csr: ['General Automotive'],
    fileType: 'PDF',
    fileSize: '1.8 MB',
    securityLevel: 'Internal',
    history: [
      { revision: 'Rev. 02', date: '2023-06-20', author: 'Budi Santoso', changeLog: 'Penambahan mekanisme stempel watermark digital Uncontrolled Copy' }
    ],
    comments: []
  },
  {
    id: 'DOC-103',
    docNumber: 'IATF/PE/L2/012',
    title: 'Prosedur AIAG-VDA Process Failure Mode and Effects Analysis (PFMEA)',
    level: 'L2',
    department: 'Process Engineering',
    author: 'Rahmat Hidayat',
    reviewer: 'Budi Santoso',
    approver: 'Ir. Ahmad Zarkasi',
    version: 'Rev. 01 (Draft)',
    status: 'Review',
    effectiveDate: '2024-03-01',
    reviewDueDate: '2025-03-01',
    clauses: ['8.5', '6.1'],
    coreTool: 'FMEA',
    csr: ['Toyota Motor CSR', 'Honda R&D CSR'],
    fileType: 'DOCX',
    fileSize: '2.5 MB',
    securityLevel: 'Restricted - Automotive IP',
    history: [
      { revision: 'Rev. 01 (Draft)', date: '2024-03-01', author: 'Rahmat Hidayat', changeLog: 'Migrasi format RPN lama ke AP (Action Priority) AIAG-VDA 1st Edition' }
    ],
    comments: []
  },
  {
    id: 'DOC-104',
    docNumber: 'IATF/QC/L3/088',
    title: 'Instruksi Kerja Pengujian R&R Gage dengan Minitab (MSA)',
    level: 'L3',
    department: 'Quality Control',
    author: 'Siti Rahma',
    reviewer: 'Budi Santoso',
    approver: 'Ir. Ahmad Zarkasi',
    version: 'Rev. 01 (Draft)',
    status: 'Draft',
    effectiveDate: '2024-04-10',
    reviewDueDate: '2025-04-10',
    clauses: ['7.5', '8.5'],
    coreTool: 'MSA',
    csr: ['Hyundai Motor CSR'],
    fileType: 'PDF',
    fileSize: '3.1 MB',
    securityLevel: 'Internal',
    history: [
      { revision: 'Rev. 01 (Draft)', date: '2024-04-10', author: 'Siti Rahma', changeLog: 'Penyusunan awal IK MSA untuk alat ukur Caliper & Micrometer digital' }
    ],
    comments: []
  }
];

const INITIAL_AUDIT_LOGS = [
  {
    id: 'LOG-8801',
    timestamp: '2024-03-01 09:15:22',
    user: 'Rahmat Hidayat (Process Engineering)',
    action: 'SUBMIT_REVIEW',
    docNum: 'IATF/PE/L2/012',
    details: 'Mengajukan Prosedur PFMEA ke QA Manager untuk peninjauan Kepatuhan Klausul 8.5'
  },
  {
    id: 'LOG-8802',
    timestamp: '2024-01-15 14:30:00',
    user: 'Ir. Ahmad Zarkasi (Management Representative)',
    action: 'APPROVED_DOC',
    docNum: 'IATF/QA/L1/001',
    details: 'Pengesahan Manual Mutu Otomotif Rev. 04 untuk disebar luas ke seluruh departemen'
  }
];

const STORAGE_KEYS = {
  documents: 'iatf-doc-control:documents',
  auditLogs: 'iatf-doc-control:auditLogs',
  darkMode: 'iatf-doc-control:darkMode',
  role: 'iatf-doc-control:role'
};

const loadStoredValue = (key, fallback) => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 m-6 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl shadow-sm space-y-3">
          <h2 className="font-bold text-base flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            Terjadi Kesalahan Aplikasi
          </h2>
          <p className="text-xs font-mono bg-white p-3 rounded-lg border border-rose-200 text-rose-900">
            {this.state.error?.toString()}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition"
          >
            Muat Ulang Halaman
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function DocumentControlApp() {
  const [documents, setDocuments] = useState(() => loadStoredValue(STORAGE_KEYS.documents, INITIAL_DOCUMENTS));
  const [auditLogs, setAuditLogs] = useState(() => loadStoredValue(STORAGE_KEYS.auditLogs, INITIAL_AUDIT_LOGS));
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(() => loadStoredValue(STORAGE_KEYS.darkMode, false));
  
  // Current User Role Simulation
  const [currentRole, setCurrentRole] = useState(() => loadStoredValue(STORAGE_KEYS.role, 'QA_MANAGER'));
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterCoreTool, setFilterCoreTool] = useState('ALL');
  const [filterClause, setFilterClause] = useState('ALL');

  // Selected Doc state
  const [selectedDoc, setSelectedDoc] = useState(() => documents[0] || INITIAL_DOCUMENTS[0]);
  const [notificationToast, setNotificationToast] = useState(null);

  // Drag & Drop Upload state
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // New Document Form State
  const [newDocForm, setNewDocForm] = useState({
    title: '',
    level: 'L2',
    department: 'Quality Assurance',
    author: 'Budi Santoso',
    reviewer: 'Dewi Lestari',
    approver: 'Ir. Ahmad Zarkasi',
    clauses: ['7.5'],
    coreTool: 'NONE',
    csr: ['General Automotive'],
    fileType: 'PDF',
    securityLevel: 'Internal',
    changeSummary: 'Penerbitan perdana dokumen IATF 16949'
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.documents, JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.auditLogs, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.darkMode, JSON.stringify(darkMode));
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.role, JSON.stringify(currentRole));
  }, [currentRole]);

  useEffect(() => {
    setSelectedDoc(prev => documents.find(doc => doc.id === prev?.id) || documents[0] || null);
  }, [documents]);

  // Auto notification toast banner duration handler
  const showToast = (message, type = 'info') => {
    setNotificationToast({ message, type });
    setTimeout(() => setNotificationToast(null), 4000);
  };

  // Auto numbering helper format: IATF/DEPT_CODE/TYPE_CODE/SEQ
  const generateDocNumber = (dept, level) => {
    const deptMap = {
      'Quality Assurance': 'QA',
      'Quality Control': 'QC',
      'Process Engineering': 'PE',
      'Production': 'PR',
      'Management Representative': 'MR'
    };
    const levelObj = DOC_LEVELS.find(l => l.id === level) || DOC_LEVELS[1];
    const deptCode = deptMap[dept] || 'GEN';
    const randomSeq = Math.floor(100 + Math.random() * 900);
    return `IATF/${deptCode}/${levelObj.code}/${randomSeq}`;
  };

  // File Drop Handler Simulation
  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setUploadedFile({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        type: file.name.split('.').pop().toUpperCase()
      });
      // Simulate upload progress
      setUploadProgress(0);
      let p = 0;
      const interval = setInterval(() => {
        p += 25;
        setUploadProgress(p);
        if (p >= 100) clearInterval(interval);
      }, 150);

      // Auto fill title if empty
      if (!newDocForm.title) {
        const titleWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        setNewDocForm(prev => ({ ...prev, title: titleWithoutExt, fileType: file.name.split('.').pop().toUpperCase() }));
      }
    }
  };

  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      const matchesSearch = 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.docNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.author.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesLevel = filterLevel === 'ALL' || doc.level === filterLevel;
      const matchesStatus = filterStatus === 'ALL' || doc.status === filterStatus;
      const matchesCoreTool = filterCoreTool === 'ALL' || doc.coreTool === filterCoreTool;
      const matchesClause = filterClause === 'ALL' || doc.clauses.some(c => c.startsWith(filterClause));

      return matchesSearch && matchesLevel && matchesStatus && matchesCoreTool && matchesClause;
    });
  }, [documents, searchQuery, filterLevel, filterStatus, filterCoreTool, filterClause]);

  const stats = useMemo(() => {
    const total = documents.length;
    const approved = documents.filter(d => d.status === 'Approved').length;
    const review = documents.filter(d => d.status === 'Review').length;
    const draft = documents.filter(d => d.status === 'Draft').length;
    const obsolete = documents.filter(d => d.status === 'Obsolete').length;
    return { total, approved, review, draft, obsolete, expiring7: 1, stale6Months: 1 };
  }, [documents]);

  const handleCreateDocument = (e) => {
    e.preventDefault();
    const docNum = generateDocNumber(newDocForm.department, newDocForm.level);
    const newEntry = {
      id: `DOC-${Date.now()}`,
      docNumber: docNum,
      title: newDocForm.title || 'Dokumen Tanpa Judul',
      level: newDocForm.level,
      department: newDocForm.department,
      author: newDocForm.author,
      reviewer: newDocForm.reviewer,
      approver: newDocForm.approver,
      version: 'Rev. 01 (Draft)',
      status: 'Draft',
      effectiveDate: new Date().toISOString().split('T')[0],
      reviewDueDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      clauses: newDocForm.clauses,
      coreTool: newDocForm.coreTool,
      csr: newDocForm.csr,
      fileType: uploadedFile ? uploadedFile.type : newDocForm.fileType,
      fileSize: uploadedFile ? uploadedFile.size : '1.8 MB',
      securityLevel: newDocForm.securityLevel,
      history: [
        { revision: 'Rev. 01 (Draft)', date: new Date().toISOString().split('T')[0], author: newDocForm.author, changeLog: newDocForm.changeSummary }
      ],
      comments: []
    };

    setDocuments([newEntry, ...documents]);
    setSelectedDoc(newEntry);
    
    // Add Audit Log
    const newLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: `${newDocForm.author} (${currentRole})`,
      action: 'CREATE_DOCUMENT',
      docNum: docNum,
      details: `Upload dokumen baru dalam status Draft: ${newDocForm.title}`
    };
    setAuditLogs([newLog, ...auditLogs]);

    setUploadedFile(null);
    setUploadProgress(0);
    setNewDocForm(prev => ({
      ...prev,
      title: '',
      changeSummary: 'Penerbitan perdana dokumen IATF 16949'
    }));
    setActiveTab('detail');
    showToast(`Dokumen ${docNum} berhasil diunggah dan masuk ke alur Draft!`, 'success');
  };

  const handleStatusChange = (docId, newStatus, logMessage) => {
    setDocuments(prevDocs => prevDocs.map(d => {
      if (d.id === docId) {
        let updatedVer = d.version;
        if (newStatus === 'Approved') {
          updatedVer = d.version.replace(' (Draft)', '');
        }
        return { ...d, status: newStatus, version: updatedVer };
      }
      return d;
    }));

    const targetDoc = documents.find(d => d.id === docId);
    
    const newLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: `${currentRole}`,
      action: newStatus === 'Approved' ? 'APPROVED_DOC' : (newStatus === 'Review' ? 'SUBMIT_REVIEW' : 'REJECT_DOC'),
      docNum: targetDoc?.docNumber || docId,
      details: logMessage || `Status dokumen diubah menjadi ${newStatus}`
    };
    setAuditLogs([newLog, ...auditLogs]);

    if (selectedDoc && selectedDoc.id === docId) {
      setSelectedDoc(prev => ({ ...prev, status: newStatus }));
    }

    showToast(`Status Dokumen ${targetDoc?.docNumber} diperbarui ke ${newStatus}!`, 'success');
  };

  const handleDownloadWatermarked = (doc) => {
    const fileName = `${doc.docNumber.replaceAll('/', '-')}-${doc.version.replace(/[^\w.-]+/g, '-')}.txt`;
    const content = [
      'CONTROLLED DOCUMENT COPY',
      'Watermark: IATF 16949 Document Control System',
      '',
      `Nomor Dokumen : ${doc.docNumber}`,
      `Judul         : ${doc.title}`,
      `Versi         : ${doc.version}`,
      `Status        : ${doc.status}`,
      `Departemen    : ${doc.department}`,
      `Tanggal Efektif: ${doc.effectiveDate}`,
      `Review Berikut: ${doc.reviewDueDate}`,
      `Security      : ${doc.securityLevel}`,
      '',
      'Catatan: Prototype ini menyimpan metadata dokumen di browser. File asli perlu backend storage untuk produksi.'
    ].join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
    showToast(`Metadata watermarked ${doc.docNumber} diunduh.`, 'success');
  };

  return (
    <div className={`min-h-screen font-sans ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* Toast Notification */}
      {notificationToast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl bg-indigo-600 text-white animate-bounce">
          <Bell className="w-5 h-5" />
          <span className="text-sm font-medium">{notificationToast.message}</span>
        </div>
      )}

      {/* Top Header / Brand Nav */}
      <header className={`sticky top-0 z-30 border-b backdrop-blur-md ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    IATF 16949 QMS
                  </h1>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono font-medium border border-slate-200 dark:border-slate-700">
                    Klausul 7.5
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">Automotive Quality Document Control System</p>
              </div>
            </div>

            {/* Role Switcher & Dark Mode Toggle */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 px-2">Role:</span>
                {[
                  { id: 'ADMIN', name: 'Admin' },
                  { id: 'QA_MANAGER', name: 'QA Manager' },
                  { id: 'DOC_CONTROLLER', name: 'Doc Controller' },
                  { id: 'AUDITOR', name: 'Auditor' }
                ].map(r => (
                  <button
                    key={r.id}
                    onClick={() => setCurrentRole(r.id)}
                    className={`px-2.5 py-1 rounded-md transition-all ${
                      currentRole === r.id 
                        ? 'bg-indigo-600 text-white shadow-sm' 
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {r.name}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                title="Toggle Theme"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setActiveTab('upload')}
                className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium shadow-md shadow-indigo-600/20 transition"
              >
                <UploadCloud className="w-4 h-4" />
                <span className="hidden sm:inline">Upload Dokumen</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <nav className="flex space-x-1 sm:space-x-3 overflow-x-auto pb-2 scrollbar-none text-sm font-medium border-t border-slate-100 dark:border-slate-800/80 pt-2">
            {[
              { id: 'dashboard', label: '1. Dashboard', icon: Activity },
              { id: 'repository', label: '2. Daftar Dokumen', icon: BookOpen },
              { id: 'detail', label: '3. Detail & Histori', icon: Eye },
              { id: 'upload', label: '4. Upload Drag & Drop', icon: UploadCloud },
              { id: 'approval', label: '5. Workflow Approval', icon: UserCheck, count: stats.review },
              { id: 'clauses', label: '6. Mapping Klausul', icon: Layers },
              { id: 'wireframe', label: '7. Wireframe Layout', icon: LayoutGrid }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap transition-all ${
                    isActive 
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold shadow-sm' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-xs bg-amber-500 text-white font-bold">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* 1. HALAMAN DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Dashboard Header Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-mono font-semibold border border-indigo-400/30">
                  IATF 16949:2016 Compliant
                </span>
                <h2 className="text-2xl font-bold mt-2">Dashboard Kontrol Dokumen Mutu Otomotif</h2>
                <p className="text-xs text-indigo-200 mt-1 max-w-2xl">
                  Pemantauan siklus hidup dokumen Level 1 - 4, kesesuaian Core Tools (APQP, FMEA, MSA, SPC, PPAP), dan jadwal peninjauan tahunan Klausul 7.5.
                </p>
              </div>
              <button 
                onClick={() => setActiveTab('upload')}
                className="px-4 py-2.5 bg-white text-indigo-900 font-bold rounded-xl text-xs hover:bg-indigo-50 shadow-md transition flex items-center gap-2 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" /> Upload Dokumen Baru
              </button>
            </div>

            {/* Top KPI Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm hover:shadow-md transition`}>
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-semibold">Total Dokumen</span>
                  <FileText className="w-4 h-4 text-indigo-500" />
                </div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-[11px] text-slate-400 mt-1">Level 1 s/d Level 4</p>
              </div>

              <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm hover:shadow-md transition`}>
                <div className="flex items-center justify-between text-emerald-500 mb-2">
                  <span className="text-xs font-semibold">Disetujui (Approved)</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.approved}</div>
                <p className="text-[11px] text-emerald-500 mt-1">Siap untuk Audit</p>
              </div>

              <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm hover:shadow-md transition`}>
                <div className="flex items-center justify-between text-amber-500 mb-2">
                  <span className="text-xs font-semibold">In Approval (Review)</span>
                  <Clock className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.review}</div>
                <p className="text-[11px] text-amber-500 mt-1">Memerlukan Aksinya</p>
              </div>

              <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm hover:shadow-md transition`}>
                <div className="flex items-center justify-between text-blue-500 mb-2">
                  <span className="text-xs font-semibold">Status Draft</span>
                  <Edit3 className="w-4 h-4 text-blue-500" />
                </div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.draft}</div>
                <p className="text-[11px] text-slate-400 mt-1">Dalam Penyusunan</p>
              </div>

              <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm hover:shadow-md transition`}>
                <div className="flex items-center justify-between text-rose-500 mb-2">
                  <span className="text-xs font-semibold">Expiring (&lt;30 Hari)</span>
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                </div>
                <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">{stats.expiring7}</div>
                <p className="text-[11px] text-rose-500 mt-1">Review Tahunan</p>
              </div>

              <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm hover:shadow-md transition`}>
                <div className="flex items-center justify-between text-purple-500 mb-2">
                  <span className="text-xs font-semibold">Stale (&gt;6 Bulan)</span>
                  <RefreshCw className="w-4 h-4 text-purple-500" />
                </div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.stale6Months}</div>
                <p className="text-[11px] text-slate-400 mt-1">Evaluasi Rutin</p>
              </div>
            </div>

            {/* Document Levels Distribution & Core Tools Checklist */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm lg:col-span-2`}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-base">Hierarki Dokumentasi Mutu Otomotif</h3>
                    <p className="text-xs text-slate-500">Distribusi dokumen berdasarkan tingkatan IATF 16949</p>
                  </div>
                  <span className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 text-xs font-mono font-medium">
                    Klausul 7.5.1
                  </span>
                </div>

                <div className="space-y-4">
                  {DOC_LEVELS.map(level => {
                    const count = documents.filter(d => d.level === level.id).length;
                    const pct = Math.round((count / (documents.length || 1)) * 100);
                    return (
                      <div key={level.id} className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${level.color}`}>
                              {level.code}
                            </span>
                            <span className="font-medium text-slate-800 dark:text-slate-200">{level.name}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-500">{count} Dokumen</span>
                            <span className="font-mono text-xs font-bold">{pct}%</span>
                          </div>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500" 
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-base">Automotive Core Tools Hub</h3>
                  <Award className="w-5 h-5 text-indigo-500" />
                </div>
                <p className="text-xs text-slate-500 mb-4">Kelengkapan dokumen Core Tools untuk audit PPAP & Customer</p>

                <div className="space-y-2.5">
                  {[
                    { name: 'APQP Checklist & Plan', code: 'APQP', status: 'OK' },
                    { name: 'FMEA (PFMEA / DFMEA)', code: 'FMEA', status: 'OK' },
                    { name: 'Control Plan (CP)', code: 'CONTROL_PLAN', status: 'REVIEW' },
                    { name: 'MSA Gauge R&R', code: 'MSA', status: 'DRAFT' },
                    { name: 'SPC Control Charts', code: 'SPC', status: 'OK' },
                    { name: '8D Corrective Action Reports', code: '8D', status: 'OK' }
                  ].map((ct, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/60 text-xs">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-3.5 h-3.5 text-indigo-500" />
                        <span className="font-medium">{ct.name}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full font-semibold ${
                        ct.status === 'OK' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' :
                        ct.status === 'REVIEW' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400' :
                        'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                      }`}>
                        {ct.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 2. HALAMAN DAFTAR DOKUMEN (TABLE & FILTER) */}
        {activeTab === 'repository' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Daftar Dokumen Master QMS</h2>
                <p className="text-xs text-slate-500">Pencarian dan penyaringan terpusat dokumen IATF 16949</p>
              </div>
              <button
                onClick={() => setActiveTab('upload')}
                className="flex items-center gap-2 px-3.5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 shadow-sm"
              >
                <Plus className="w-4 h-4" /> Tambah Dokumen
              </button>
            </div>

            {/* Filter Controls Bar */}
            <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari berdasarkan nomor dokumen, judul, penulis, atau departemen..."
                    className={`w-full pl-10 pr-4 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                <select
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                  className={`px-3 py-2 text-sm rounded-xl border focus:outline-none ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <option value="ALL">Semua Level Dokumen</option>
                  {DOC_LEVELS.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className={`px-3 py-2 text-sm rounded-xl border focus:outline-none ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <option value="ALL">Semua Status</option>
                  <option value="Approved">Approved</option>
                  <option value="Review">In Review</option>
                  <option value="Draft">Draft</option>
                  <option value="Obsolete">Obsolete</option>
                </select>

                <select
                  value={filterCoreTool}
                  onChange={(e) => setFilterCoreTool(e.target.value)}
                  className={`px-3 py-2 text-sm rounded-xl border focus:outline-none ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <option value="ALL">Semua Core Tools</option>
                  {CORE_TOOLS.map(ct => <option key={ct.id} value={ct.id}>{ct.name}</option>)}
                </select>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Menampilkan <strong>{filteredDocuments.length}</strong> dari <strong>{documents.length}</strong> Dokumen</span>
                <button
                  onClick={() => { setSearchQuery(''); setFilterLevel('ALL'); setFilterStatus('ALL'); setFilterCoreTool('ALL'); setFilterClause('ALL'); }}
                  className="text-indigo-600 hover:underline flex items-center gap-1 font-medium"
                >
                  <RefreshCw className="w-3 h-3" /> Reset Filter
                </button>
              </div>
            </div>

            {/* Document Data Table */}
            <div className={`rounded-2xl border overflow-hidden ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className={`text-xs uppercase font-semibold border-b ${darkMode ? 'bg-slate-800/80 text-slate-400 border-slate-700' : 'bg-slate-100/80 text-slate-500 border-slate-200'}`}>
                    <tr>
                      <th className="px-4 py-3.5">Nomor & Judul Dokumen</th>
                      <th className="px-4 py-3.5">Level</th>
                      <th className="px-4 py-3.5">Versi</th>
                      <th className="px-4 py-3.5">Klausul IATF</th>
                      <th className="px-4 py-3.5">Core Tool / CSR</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-4 py-3.5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredDocuments.map(doc => {
                      const levelInfo = DOC_LEVELS.find(l => l.id === doc.level);
                      return (
                        <tr key={doc.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                          <td className="px-4 py-3.5">
                            <div className="flex items-start gap-3">
                              <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 mt-0.5">
                                <FileText className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                                  {doc.docNumber}
                                </div>
                                <div className="font-semibold text-slate-800 dark:text-slate-200 max-w-md line-clamp-1">
                                  {doc.title}
                                </div>
                                <div className="text-[11px] text-slate-400">
                                  Dept: {doc.department} | Penulis: {doc.author}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${levelInfo?.color}`}>
                              {levelInfo?.code}
                            </span>
                          </td>

                          <td className="px-4 py-3.5 whitespace-nowrap font-mono text-xs font-semibold">
                            {doc.version}
                          </td>

                          <td className="px-4 py-3.5">
                            <div className="flex flex-wrap gap-1">
                              {doc.clauses.map(c => (
                                <span key={c} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-mono border border-slate-200 dark:border-slate-700">
                                  {c}
                                </span>
                              ))}
                            </div>
                          </td>

                          <td className="px-4 py-3.5">
                            <div className="text-xs">
                              {doc.coreTool !== 'NONE' && (
                                <span className="inline-block px-2 py-0.5 rounded bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 font-bold text-[10px] mr-1">
                                  {doc.coreTool}
                                </span>
                              )}
                              <span className="text-[11px] text-slate-500 line-clamp-1">
                                {doc.csr.join(', ')}
                              </span>
                            </div>
                          </td>

                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 w-fit ${
                              doc.status === 'Approved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' :
                              doc.status === 'Review' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300' :
                              doc.status === 'Draft' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300' :
                              'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                doc.status === 'Approved' ? 'bg-emerald-500' :
                                doc.status === 'Review' ? 'bg-amber-500' :
                                doc.status === 'Draft' ? 'bg-blue-500' : 'bg-slate-500'
                              }`} />
                              {doc.status}
                            </span>
                          </td>

                          <td className="px-4 py-3.5 text-right whitespace-nowrap">
                            <button
                              onClick={() => { setSelectedDoc(doc); setActiveTab('detail'); }}
                              className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/80 dark:hover:bg-indigo-900 text-indigo-600 dark:text-indigo-400 text-xs font-medium transition flex items-center gap-1 ml-auto"
                            >
                              <Eye className="w-3.5 h-3.5" /> Detail & Histori
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. HALAMAN DETAIL DOKUMEN DENGAN HISTORI REVISI TIMELINE */}
        {activeTab === 'detail' && selectedDoc && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Header / Back Bar */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveTab('repository')}
                className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1"
              >
                &larr; Kembali ke Daftar Dokumen
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadWatermarked(selectedDoc)}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow"
                >
                  <Download className="w-4 h-4" /> Download File Watermarked
                </button>
              </div>
            </div>

            {/* Document Details Card */}
            <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-6`}>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                      {selectedDoc.docNumber}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      selectedDoc.status === 'Approved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {selectedDoc.status}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedDoc.title}</h2>
                </div>

                <div className="flex items-center gap-4 text-xs">
                  <div className="text-right">
                    <span className="text-slate-400 block">Tingkat Keamanan</span>
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">{selectedDoc.securityLevel}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block">Tgl Review Berikutnya</span>
                    <span className="font-mono font-bold text-rose-500">{selectedDoc.reviewDueDate}</span>
                  </div>
                </div>
              </div>

              {/* Grid Metadata Specs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs">
                <div>
                  <span className="text-slate-400 block">Departemen Pemilik</span>
                  <span className="font-semibold">{selectedDoc.department}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Versi Saat Ini</span>
                  <span className="font-mono font-bold text-indigo-600">{selectedDoc.version}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Automotive Core Tool</span>
                  <span className="font-bold text-purple-600">{selectedDoc.coreTool}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Format & Ukuran File</span>
                  <span className="font-mono">{selectedDoc.fileType} ({selectedDoc.fileSize})</span>
                </div>
              </div>

              {/* IATF Clause & CSR Mapping */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div>
                  <h4 className="font-bold text-xs mb-2 text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-indigo-500" /> Mapping Klausul IATF 16949
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedDoc.clauses.map(c => (
                      <span key={c} className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-mono text-xs font-semibold border border-indigo-200 dark:border-indigo-800">
                        Klausul {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-xs mb-2 text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-indigo-500" /> Customer Specific Requirements (CSR)
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedDoc.csr.map(c => (
                      <span key={c} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Signatories & Approvers */}
              <div>
                <h4 className="font-bold text-xs mb-3 text-slate-700 dark:text-slate-300">Otorisasi & Penandatangan Dokumen</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Pembuat (Author)</span>
                    <span className="font-semibold block mt-1">{selectedDoc.author}</span>
                  </div>
                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Pemeriksa (QA Mgr)</span>
                    <span className="font-semibold block mt-1">{selectedDoc.reviewer}</span>
                  </div>
                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Pengesah (Management Rep)</span>
                    <span className="font-semibold block mt-1">{selectedDoc.approver}</span>
                  </div>
                </div>
              </div>

              {/* VERTICAL REVISION HISTORY TIMELINE */}
              <div className="border-t pt-6 border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-sm">Histori Revisi & Timeline Perubahan Dokumen</h3>
                    <p className="text-xs text-slate-500">Persyaratan Klausul 7.5.3.2 - Pelacakan riwayat perubahan dokumen secara menyeluruh</p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 font-mono text-xs font-bold">
                    Immutable Revision Log
                  </span>
                </div>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-indigo-200 dark:before:bg-indigo-900">
                  {selectedDoc.history.map((h, i) => (
                    <div key={i} className="relative flex items-start gap-4 text-xs">
                      {/* Timeline Node Icon */}
                      <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-indigo-600 border-2 border-white dark:border-slate-900 shadow-sm flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>

                      <div className="flex-1 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-xs">
                            {h.revision}
                          </span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                            <Calendar className="w-3 h-3" /> {h.date}
                          </span>
                        </div>
                        <p className="font-medium text-slate-800 dark:text-slate-200 text-xs mt-1">
                          {h.changeLog}
                        </p>
                        <div className="mt-2 text-[11px] text-slate-400">
                          Oleh: <span className="font-semibold text-slate-600 dark:text-slate-300">{h.author}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 4. HALAMAN UPLOAD DOKUMEN DENGAN DRAG & DROP */}
        {activeTab === 'upload' && (
          <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Upload & Registrasi Dokumen Baru</h2>
                <p className="text-xs text-slate-500">Unggah berkas PDF, Word, atau Excel ke sistem kontrol IATF 16949</p>
              </div>
              <button
                onClick={() => setActiveTab('repository')}
                className="text-xs font-semibold text-slate-500 hover:text-indigo-600"
              >
                &larr; Batal & Kembali
              </button>
            </div>

            <form onSubmit={handleCreateDocument} className="space-y-6">
              
              {/* Drag & Drop Zone Component */}
              <div className={`p-8 rounded-2xl border-2 border-dashed transition text-center cursor-pointer ${
                isDragging 
                  ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/50 scale-[1.01]' 
                  : 'border-slate-300 dark:border-slate-700 hover:border-indigo-500 bg-slate-50/50 dark:bg-slate-900'
              }`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleFileDrop}
              >
                <input 
                  type="file" 
                  id="fileInput" 
                  className="hidden" 
                  onChange={handleFileDrop}
                  accept=".pdf,.docx,.xlsx,.pptx"
                />

                {!uploadedFile ? (
                  <label htmlFor="fileInput" className="cursor-pointer space-y-3 block">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center shadow-inner">
                      <UploadCloud className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-800 dark:text-slate-200">
                        Tarik & Lepas (Drag & Drop) berkas di sini
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        atau klik untuk memilih berkas dari komputer (PDF, DOCX, XLSX max 20MB)
                      </p>
                    </div>
                  </label>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-3 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 max-w-md mx-auto border border-indigo-200 dark:border-indigo-800 text-xs">
                      <FileText className="w-6 h-6 text-indigo-600" />
                      <div className="text-left flex-1">
                        <p className="font-bold text-slate-800 dark:text-slate-200 truncate">{uploadedFile.name}</p>
                        <p className="text-slate-400 text-[11px]">{uploadedFile.size} • Format: {uploadedFile.type}</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setUploadedFile(null); }}
                        className="p-1 rounded hover:bg-rose-100 text-rose-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {uploadProgress < 100 ? (
                      <div className="max-w-md mx-auto space-y-1">
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div className="bg-indigo-600 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                        </div>
                        <p className="text-[11px] text-slate-500">Mengunggah... {uploadProgress}%</p>
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                        <CheckCircle className="w-3.5 h-3.5" /> Berkas Terverifikasi (SHA-256 Valid)
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Form Metadata Dokumen */}
              <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4 text-xs`}>
                <h3 className="font-bold text-sm border-b pb-3 border-slate-100 dark:border-slate-800">
                  Atribut Metadata Dokumen IATF
                </h3>

                <div>
                  <label className="block font-semibold mb-1">Judul Dokumen *</label>
                  <input
                    type="text"
                    required
                    value={newDocForm.title}
                    onChange={e => setNewDocForm({ ...newDocForm, title: e.target.value })}
                    placeholder="Contoh: Prosedur Audit Proses Berlapis (Layered Process Audit)"
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-1">Level Dokumen *</label>
                    <select
                      value={newDocForm.level}
                      onChange={e => setNewDocForm({ ...newDocForm, level: e.target.value })}
                      className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                        darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      {DOC_LEVELS.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Departemen *</label>
                    <select
                      value={newDocForm.department}
                      onChange={e => setNewDocForm({ ...newDocForm, department: e.target.value })}
                      className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                        darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <option value="Quality Assurance">Quality Assurance</option>
                      <option value="Quality Control">Quality Control</option>
                      <option value="Process Engineering">Process Engineering</option>
                      <option value="Production">Production</option>
                      <option value="Management Representative">Management Representative</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold mb-1">Automotive Core Tool</label>
                    <select
                      value={newDocForm.coreTool}
                      onChange={e => setNewDocForm({ ...newDocForm, coreTool: e.target.value })}
                      className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                        darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      {CORE_TOOLS.map(ct => <option key={ct.id} value={ct.id}>{ct.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Tingkat Keamanan Dokumen</label>
                    <select
                      value={newDocForm.securityLevel}
                      onChange={e => setNewDocForm({ ...newDocForm, securityLevel: e.target.value })}
                      className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                        darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <option value="Internal">Internal Use Only</option>
                      <option value="Confidential">Confidential (QA / Mgmt)</option>
                      <option value="Restricted - Automotive IP">Restricted - Automotive IP</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Nomor Dokumen Otomatis (Preview)</label>
                  <div className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono font-bold text-indigo-600 border border-slate-200 dark:border-slate-700">
                    {generateDocNumber(newDocForm.department, newDocForm.level)}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Catatan Perubahan / Tujuan Penerbitan *</label>
                  <textarea
                    rows="2"
                    required
                    value={newDocForm.changeSummary}
                    onChange={e => setNewDocForm({ ...newDocForm, changeSummary: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none ${
                      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
                    }`}
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('repository')}
                    className="px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl font-medium"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-md flex items-center gap-2"
                  >
                    <UploadCloud className="w-4 h-4" /> Simpan Dokumen (Masuk Status Draft)
                  </button>
                </div>

              </div>

            </form>
          </div>
        )}

        {/* 5. HALAMAN APPROVAL DENGAN TIMELINE */}
        {activeTab === 'approval' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Halaman Approval & Persetujuan Dokumen</h2>
                <p className="text-xs text-slate-500">Alur pengesahan bertingkat sesuai klausul 7.5.2 IATF 16949</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-xs">
                {stats.review} Menunggu Action
              </span>
            </div>

            {/* Approval Pipeline Diagram Timeline */}
            <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-6`}>
              <h3 className="font-bold text-sm">Alur Tahapan Persetujuan Dokumen (Signoff Pipeline)</h3>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20 text-xs relative">
                  <span className="text-[10px] font-bold text-blue-600 block">TAHAP 1</span>
                  <h4 className="font-bold mt-1">Draft & Penyusunan</h4>
                  <p className="text-slate-500 text-[11px] mt-1">Dibuat oleh Process Owner / Engineering</p>
                </div>

                <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20 text-xs relative">
                  <span className="text-[10px] font-bold text-amber-600 block">TAHAP 2</span>
                  <h4 className="font-bold mt-1">Review QA Manager</h4>
                  <p className="text-slate-500 text-[11px] mt-1">Pemeriksaan kepatuhan klausul IATF & CSR</p>
                </div>

                <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/20 text-xs relative">
                  <span className="text-[10px] font-bold text-indigo-600 block">TAHAP 3</span>
                  <h4 className="font-bold mt-1">Approval Management Rep</h4>
                  <p className="text-slate-500 text-[11px] mt-1">Pengesahan akhir & stempel digital</p>
                </div>

                <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/20 text-xs relative">
                  <span className="text-[10px] font-bold text-emerald-600 block">TAHAP 4</span>
                  <h4 className="font-bold mt-1">Approved & Distributed</h4>
                  <p className="text-slate-500 text-[11px] mt-1">Publikasi otomatis ke seluruh dept</p>
                </div>
              </div>

              {/* Pending Approvals List */}
              <div className="border-t pt-6 border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-sm mb-4">Dokumen yang Memerlukan Tindakan Anda</h3>

                <div className="space-y-4">
                  {documents.filter(d => d.status === 'Review' || d.status === 'Draft').map(doc => (
                    <div key={doc.id} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-indigo-600">{doc.docNumber}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            Status: {doc.status}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-200 dark:bg-slate-700">
                            Core Tool: {doc.coreTool}
                          </span>
                        </div>

                        <h4 className="font-bold text-base">{doc.title}</h4>
                        <p className="text-xs text-slate-500">
                          Penulis: <strong>{doc.author}</strong> | Reviewer: <strong>{doc.reviewer}</strong> | Approver: <strong>{doc.approver}</strong>
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-200 dark:border-slate-700">
                        {doc.status === 'Draft' && (
                          <button
                            onClick={() => handleStatusChange(doc.id, 'Review', 'Mengajukan dokumen ke alur Review QA Manager')}
                            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow transition"
                          >
                            Ajukan Review QA
                          </button>
                        )}

                        {doc.status === 'Review' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(doc.id, 'Draft', 'Dikembalikan ke penulis untuk perbaikan')}
                              className="px-3.5 py-2 border border-rose-300 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold transition"
                            >
                              Tolak & Minta Perbaikan
                            </button>
                            <button
                              onClick={() => handleStatusChange(doc.id, 'Approved', 'Disetujui secara resmi oleh QA Manager & MR')}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow transition"
                            >
                              Setujui (Approve)
                            </button>
                          </>
                        )}
                      </div>

                    </div>
                  ))}

                  {documents.filter(d => d.status === 'Review' || d.status === 'Draft').length === 0 && (
                    <div className="text-center py-12 text-slate-400 text-xs">
                      Tidak ada dokumen pending approval saat ini.
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 6. MAPPING KLAUSUL IATF & CORE TOOLS */}
        {activeTab === 'clauses' && (
          <div className="space-y-6 animate-fade-in">
            <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-base">Matriks Pemetaan Klausul IATF 16949:2016</h3>
                  <p className="text-xs text-slate-500">Kesesuaian dokumen terdaftar dengan klausul standar (4.1 - 10.3.1)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {IATF_CLAUSES.map(clause => {
                  const mappedDocs = documents.filter(d => d.clauses.some(c => c.startsWith(clause.code)));
                  return (
                    <div 
                      key={clause.code} 
                      className={`p-4 rounded-xl border transition ${
                        mappedDocs.length > 0 
                          ? 'border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/30 dark:bg-indigo-950/20' 
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-600 text-white">
                          Klausul {clause.code}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {mappedDocs.length} Dokumen
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-3 min-h-[32px]">
                        {clause.name}
                      </h4>

                      <div className="space-y-1.5 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                        {mappedDocs.map(d => (
                          <button
                            key={d.id}
                            onClick={() => { setSelectedDoc(d); setActiveTab('detail'); }}
                            className="w-full text-left p-1.5 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-[11px] font-mono text-indigo-600 dark:text-indigo-400 flex items-center justify-between"
                          >
                            <span className="truncate">{d.docNumber}</span>
                            <span className="text-[9px] px-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">{d.status}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 7. WIREFRAME & DESAIN LAYOUT DESKRIPSI */}
        {activeTab === 'wireframe' && (
          <div className="space-y-6 animate-fade-in">
            <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-6`}>
              <div>
                <h2 className="text-lg font-bold">Rancangan Layout Wireframe Aplikasi Kontrol Dokumen IATF</h2>
                <p className="text-xs text-slate-500">Spesifikasi hirarki layout UI/UX untuk setiap halaman utama</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                
                {/* Dashboard Layout */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 space-y-2">
                  <h3 className="font-bold text-sm text-indigo-600">Layout Halaman Dashboard</h3>
                  <div className="space-y-1 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                    <div className="p-2 border rounded bg-white dark:bg-slate-900">[Top Header] Logo | Role Switcher | Theme Toggle | Quick Upload</div>
                    <div className="p-2 border rounded bg-white dark:bg-slate-900">[Stats Cards Grid] Total | Approved | Review | Draft | Expiring | Stale</div>
                    <div className="grid grid-cols-3 gap-1">
                      <div className="p-2 border rounded bg-white dark:bg-slate-900 col-span-2">[Chart] Hierarki Level Dokumen (L1-L4)</div>
                      <div className="p-2 border rounded bg-white dark:bg-slate-900">[Widget] Core Tools Readiness</div>
                    </div>
                  </div>
                </div>

                {/* Master List Layout */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 space-y-2">
                  <h3 className="font-bold text-sm text-indigo-600">Layout Halaman Daftar Dokumen</h3>
                  <div className="space-y-1 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                    <div className="p-2 border rounded bg-white dark:bg-slate-900">[Filter Bar] Input Search | Dropdown Level | Status | Core Tool</div>
                    <div className="p-2 border rounded bg-white dark:bg-slate-900">
                      [Data Table] Nom. Dokumen | Judul | Level | Versi | Klausul | Status | Action Button
                    </div>
                  </div>
                </div>

                {/* Upload Layout */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 space-y-2">
                  <h3 className="font-bold text-sm text-indigo-600">Layout Halaman Upload (Drag & Drop)</h3>
                  <div className="space-y-1 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                    <div className="p-4 border border-dashed rounded bg-white dark:bg-slate-900 text-center">[Drag & Drop Zone] Drop File Here</div>
                    <div className="p-2 border rounded bg-white dark:bg-slate-900">[Form Attributes] Judul | Level | Dept | CoreTool | Auto Doc Number Preview</div>
                  </div>
                </div>

                {/* Approval & Timeline Layout */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 space-y-2">
                  <h3 className="font-bold text-sm text-indigo-600">Layout Halaman Approval & Timeline</h3>
                  <div className="space-y-1 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                    <div className="p-2 border rounded bg-white dark:bg-slate-900">[Pipeline Timeline] Step 1 Draft &rarr; Step 2 QA &rarr; Step 3 MR &rarr; Step 4 Distributed</div>
                    <div className="p-2 border rounded bg-white dark:bg-slate-900">[Action List] Document Info | Reject Button | Approve Button</div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <DocumentControlApp />
    </ErrorBoundary>
  );
}
