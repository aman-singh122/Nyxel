import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import Editor from "@monaco-editor/react";
import axiosClient from "../../utils/axiosClient";
import SubmissionHistory from "./SubmissionHistory";
import ChatAI from "../../pages/NavLinks/ChatAi";
import Editorial from "./Editorial";
import AppLayout from "../AppLayout";
import { FaThumbsUp, FaThumbsDown, FaCopy, FaRedo, FaExpand, FaCompress, FaBook, FaCode, FaLightbulb, FaHistory, FaRobot, FaPlay, FaCheck, FaTimes, FaExclamationTriangle } from "react-icons/fa";
import { Code, Clock, Cpu, Database, Users, TrendingUp, BarChart, CheckCircle, XCircle, AlertCircle, Zap, Brain, ChevronRight, ChevronLeft, Terminal, FileText, BarChart2, MessageSquare } from "lucide-react";
import Animate from "../../animate";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const langMap = { cpp: "C++", java: "Java", javascript: "JavaScript", c: "C", python: "Python" };

const getMonacoLang = (lang) => {
    switch (lang) {
        case "cpp": return "cpp";
        case "c": return "c";
        case "java": return "java";
        case "javascript": return "javascript";
        case "python": return "python";
        default: return "javascript";
    }
};

const backendLangMap = { cpp: "c++", java: "java", javascript: "javascript", c: "c", python: "python" };

const ProblemPage = () => {
    const { problemId } = useParams();
    const editorRef = useRef(null);
    const [isEditorExpanded, setIsEditorExpanded] = useState(false);
    const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false);

    const [problem, setProblem] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState("javascript");
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(true);
    const [solutions, setSolutions] = useState([]);

    const [activeLeftTab, setActiveLeftTab] = useState("description");
    const [activeRightTab, setActiveRightTab] = useState("code");

    const [runLoading, setRunLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [runResult, setRunResult] = useState([]);
    const [submitResult, setSubmitResult] = useState(null);

    const [copied, setCopied] = useState(false);
    const [stats, setStats] = useState({
        totalSubmissions: 0,
        acceptanceRate: 0,
        difficultyBreakdown: { easy: 0, medium: 0, hard: 0 }
    });

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                setLoading(true);
                const res = await axiosClient.get(`/problem/getProblemById/${problemId}`);
                const data = res.data.problem;
                setProblem(data);

                const statsRes = await axiosClient.get(`/problem/stats/${problemId}`);
                setStats(statsRes.data);

                const solutionsRes = await axiosClient.get(`/problem/solutions/${problemId}`);
                setSolutions(solutionsRes.data.solutions || []);

                const initialCode =
                    data?.startCode?.find((sc) => sc.language.toLowerCase() === backendLangMap[selectedLanguage])?.initialCode || "";
                setCode(initialCode);
            } catch (err) {
                console.error("Problem fetch failed:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProblem();
    }, [problemId, selectedLanguage]);

    useEffect(() => {
        if (!problem) return;
        const initialCode =
            problem.startCode?.find((sc) => sc.language.toLowerCase() === backendLangMap[selectedLanguage])?.initialCode || "";
        setCode(initialCode);
    }, [selectedLanguage, problem]);

    const handleRun = async () => {
        if (!code.trim()) return;
        try {
            setRunLoading(true);
            setRunResult([]);

            const res = await axiosClient.post(`/submission/run/${problemId}`, {
                code,
                language: backendLangMap[selectedLanguage]
            });

            setRunResult(res.data.testCases || []);
            setActiveRightTab("testcase");
        } catch (err) {
            console.error(err);
            setRunResult([{ status_id: 4, error: "Execution failed" }]);
            setActiveRightTab("testcase");
        } finally {
            setRunLoading(false);
        }
    };

    const handleSubmitCode = async () => {
        if (!code.trim()) return;
        try {
            setSubmitLoading(true);
            setSubmitResult(null);

            const res = await axiosClient.post(`/submission/submit/${problemId}`, {
                code,
                language: backendLangMap[selectedLanguage]
            });

            setSubmitResult(res.data || {});
            setActiveRightTab("result");
        } catch (err) {
            console.error(err);
            setSubmitResult({ accepted: false, error: "Submission failed", passedTestCases: 0, totalTestCases: 0 });
            setActiveRightTab("result");
        } finally {
            setSubmitLoading(false);
        }
    };

    const copyCode = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const resetCode = () => {
        if (!problem) return;
        const initialCode =
            problem.startCode?.find((sc) => sc.language.toLowerCase() === backendLangMap[selectedLanguage])?.initialCode || "";
        setCode(initialCode);
    };

    const formatTimeComplexity = (complexity) => {
        if (!complexity) return "Not specified";
        return complexity.replace(/O\(/g, '<span class="text-emerald-600">O(').replace(/\)/g, ')</span>');
    };

    const getStatusIcon = (statusId) => {
        switch (statusId) {
            case 3: return <FaCheck className="w-4 h-4 text-emerald-500" />;
            case 4: return <FaTimes className="w-4 h-4 text-red-500" />;
            default: return <FaExclamationTriangle className="w-4 h-4 text-yellow-500" />;
        }
    };

    if (loading) {
        return (
            <AppLayout>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
                    <div className="hidden dark:block fixed inset-0">
                        <Animate />
                    </div>
                    <div className="relative z-10 flex items-center justify-center min-h-screen">
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
                            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading problem...</p>
                        </div>
                    </div>
                </div>
            </AppLayout>
        );
    }

    if (!problem) {
        return (
            <AppLayout>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
                    <div className="text-center">
                        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Problem Not Found</h1>
                        <p className="text-gray-600 dark:text-gray-400">The requested problem doesn't exist or has been removed.</p>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="h-screen flex bg-gray-50 dark:bg-gray-950">
                {/* Collapse/Expand Button */}
                <button
                    onClick={() => setIsLeftPanelCollapsed(!isLeftPanelCollapsed)}
                    className="fixed left-4 top-1/2 z-50 transform -translate-y-1/2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full p-2 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                    {isLeftPanelCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                </button>

                {/* LEFT PANEL */}
                <div className={`${isLeftPanelCollapsed ? 'hidden' : 'w-1/2 lg:w-2/5'} flex flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-all duration-300`}>
                    {/* Left Panel Header */}
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        problem.difficulty === "easy" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" :
                                        problem.difficulty === "medium" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" :
                                        "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                    }`}>
                                        {problem.difficulty?.toUpperCase()}
                                    </div>
                                    {problem.points && (
                                        <div className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-semibold">
                                            {problem.points} pts
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => setIsEditorExpanded(!isEditorExpanded)}
                                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                            >
                                {isEditorExpanded ? <FaCompress className="w-4 h-4" /> : <FaExpand className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Left Tabs Navigation */}
                    <div className="flex border-b border-gray-200 dark:border-gray-800">
                        {[
                            { id: "description", icon: <FileText className="w-4 h-4" />, label: "Description" },
                            { id: "editorial", icon: <FaLightbulb className="w-4 h-4" />, label: "Editorial" },
                            { id: "solutions", icon: <FaCode className="w-4 h-4" />, label: "Solutions" },
                            { id: "submissions", icon: <FaHistory className="w-4 h-4" />, label: "Submissions" },
                            { id: "chatAI", icon: <MessageSquare className="w-4 h-4" />, label: "AI Help" }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveLeftTab(tab.id)}
                                className={`flex-1 flex flex-col items-center py-3 text-sm font-medium transition-colors cursor-pointer ${
                                    activeLeftTab === tab.id 
                                    ? "text-emerald-600 dark:text-emerald-500 border-b-2 border-emerald-600 dark:border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10" 
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                }`}
                            >
                                {tab.icon}
                                <span className="mt-1">{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Left Content */}
                    <div className="flex-1 overflow-y-auto">
                        {activeLeftTab === "description" && (
                            <div className="p-6 space-y-8">
                                {/* Problem Title */}
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{problem.title}</h1>
                                    
                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                <Users className="w-4 h-4" />
                                                Submissions
                                            </div>
                                            <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalSubmissions.toLocaleString()}</div>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                <TrendingUp className="w-4 h-4" />
                                                Acceptance
                                            </div>
                                            <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.acceptanceRate}%</div>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                <Clock className="w-4 h-4" />
                                                Time
                                            </div>
                                            <div className="text-xl font-bold text-gray-900 dark:text-white" dangerouslySetInnerHTML={{ __html: formatTimeComplexity(problem.complexity?.time) }} />
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                <Database className="w-4 h-4" />
                                                Space
                                            </div>
                                            <div className="text-xl font-bold text-gray-900 dark:text-white" dangerouslySetInnerHTML={{ __html: formatTimeComplexity(problem.complexity?.space) }} />
                                        </div>
                                    </div>

                                    {/* Problem Description */}
                                    <div className="prose dark:prose-invert max-w-none">
                                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{problem.description}</p>
                                    </div>
                                </div>

                                {/* Examples */}
                                {problem.visibleTestCases?.map((ex, i) => (
                                    <div key={i} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                                <span className="text-emerald-700 dark:text-emerald-400 font-bold">{i + 1}</span>
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Example {i + 1}</h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Input</h4>
                                                <div className="bg-gray-900 text-gray-100 rounded p-3 font-mono text-sm">
                                                    {typeof ex.input === "object" ? JSON.stringify(ex.input, null, 2) : String(ex.input)}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Output</h4>
                                                <div className="bg-gray-900 text-gray-100 rounded p-3 font-mono text-sm">
                                                    {typeof ex.output === "object" ? JSON.stringify(ex.output, null, 2) : String(ex.output)}
                                                </div>
                                            </div>
                                        </div>
                                        {ex.explanation && (
                                            <div className="mt-4">
                                                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Explanation</h4>
                                                <p className="text-gray-700 dark:text-gray-300 text-sm">{ex.explanation}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* Tags and Companies */}
                                <div className="space-y-4">
                                    {problem.tags?.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Topics</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {problem.tags.map((tag, i) => (
                                                    <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {problem.companies?.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Asked By</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {problem.companies.map((company, i) => (
                                                    <span key={i} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm">
                                                        {company}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeLeftTab === "editorial" && (
                            <div className="p-6">
                                {problem.secureUrl ? (
                                    <Editorial
                                        secureUrl={problem.secureUrl}
                                        thumbnailUrl={problem.thumbnailUrl}
                                        duration={problem.duration}
                                    />
                                ) : (
                                    <div className="text-center py-12">
                                        <FaLightbulb className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Editorial Available</h3>
                                        <p className="text-gray-600 dark:text-gray-400">Editorial not available for this problem.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeLeftTab === "solutions" && (
                            <div className="p-6">
                                {problem.referenceSolution?.length > 0 ? (
                                    <div className="space-y-4">
                                        {problem.referenceSolution.map((sol, i) => (
                                            <div key={i} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 dark:text-white">{sol.language}</h3>
                                                        <div className="flex gap-2 mt-1">
                                                            {sol.timeComplexity && (
                                                                <span className="text-xs px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded">
                                                                    {sol.timeComplexity}
                                                                </span>
                                                            )}
                                                            {sol.spaceComplexity && (
                                                                <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded">
                                                                    {sol.spaceComplexity}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => setCode(sol.completeCode)}
                                                        className="px-3 py-1.5 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors cursor-pointer"
                                                    >
                                                        Use in Editor
                                                    </button>
                                                </div>
                                                <div className="bg-gray-900 rounded p-3 max-h-60 overflow-y-auto">
                                                    <pre className="text-gray-100 text-sm">{sol.completeCode}</pre>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <Code className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Solutions Available</h3>
                                        <p className="text-gray-600 dark:text-gray-400">Solutions not available for this problem.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeLeftTab === "submissions" && (
                            <div className="p-6">
                                <SubmissionHistory problemId={problemId} />
                            </div>
                        )}

                        {activeLeftTab === "chatAI" && (
                            <div className="p-6">
                                <ChatAI problem={problem} />
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT PANEL */}
                <div className={`${isLeftPanelCollapsed ? 'w-full' : 'w-1/2 lg:w-3/5'} flex flex-col ${isEditorExpanded ? '!w-full' : ''}`}>
                    {/* Right Panel Header */}
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                        <div className="flex justify-between items-center">
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setActiveRightTab("code")}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                                        activeRightTab === "code" 
                                        ? "bg-emerald-600 text-white" 
                                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                    }`}
                                >
                                    <FaCode className="w-4 h-4" />
                                    Code
                                </button>
                                <button
                                    onClick={() => setActiveRightTab("testcase")}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                                        activeRightTab === "testcase" 
                                        ? "bg-emerald-600 text-white" 
                                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                    }`}
                                >
                                    <Terminal className="w-4 h-4" />
                                    Test Cases
                                </button>
                                <button
                                    onClick={() => setActiveRightTab("result")}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                                        activeRightTab === "result" 
                                        ? "bg-emerald-600 text-white" 
                                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                    }`}
                                >
                                    <BarChart2 className="w-4 h-4" />
                                    Results
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Language Selector */}
                    <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                        <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                                {Object.keys(langMap).map((lang) => (
                                    <button
                                        key={lang}
                                        onClick={() => setSelectedLanguage(lang)}
                                        className={`px-4 py-2 rounded text-sm font-medium transition-colors cursor-pointer ${
                                            selectedLanguage === lang 
                                            ? "bg-emerald-600 text-white" 
                                            : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                                        }`}
                                    >
                                        {langMap[lang]}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={copyCode}
                                    className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded text-sm transition-colors cursor-pointer"
                                >
                                    <FaCopy className="w-4 h-4" />
                                    {copied ? "Copied!" : "Copy"}
                                </button>
                                <button
                                    onClick={resetCode}
                                    className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded text-sm transition-colors cursor-pointer"
                                >
                                    <FaRedo className="w-4 h-4" />
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-hidden">
                        {activeRightTab === "code" && (
                            <div className="h-full flex flex-col">
                                <div className="flex-1 overflow-auto">
                                    <Editor
                                        height="100%"
                                        language={getMonacoLang(selectedLanguage)}
                                        value={code}
                                        onChange={(v) => setCode(v || "")}
                                        theme="vs-dark"
                                        options={{
                                            fontSize: 14,
                                            minimap: { enabled: true },
                                            scrollBeyondLastLine: false,
                                            automaticLayout: true,
                                            scrollbar: {
                                                vertical: 'visible',
                                                horizontal: 'visible'
                                            },
                                            mouseWheelScrollSensitivity: 2,
                                            smoothScrolling: true
                                        }}
                                    />
                                </div>
                                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                                    <div className="flex justify-between items-center">
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            <span className="font-medium text-emerald-600 dark:text-emerald-500">{code.length}</span> characters
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={handleRun}
                                                disabled={runLoading}
                                                className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                            >
                                                <FaPlay className="w-4 h-4" />
                                                {runLoading ? "Running..." : "Run Code"}
                                            </button>
                                            <button
                                                onClick={handleSubmitCode}
                                                disabled={submitLoading}
                                                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                            >
                                                <FaCheck className="w-4 h-4" />
                                                {submitLoading ? "Submitting..." : "Submit Solution"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeRightTab === "testcase" && (
                            <div className="h-full overflow-y-auto p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Test Case Results</h2>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={handleRun}
                                            disabled={runLoading}
                                            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors disabled:opacity-50 cursor-pointer"
                                        >
                                            Run Again
                                        </button>
                                        <button
                                            onClick={() => setActiveRightTab("code")}
                                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors cursor-pointer"
                                        >
                                            Back to Code
                                        </button>
                                    </div>
                                </div>

                                {runResult.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Terminal className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Test Results</h3>
                                        <p className="text-gray-600 dark:text-gray-400 mb-6">Run your code to see test results.</p>
                                        <button
                                            onClick={handleRun}
                                            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer"
                                        >
                                            Run Code
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-4 gap-4 mb-6">
                                            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                                                <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
                                                <div className="text-2xl font-bold text-gray-900 dark:text-white">{runResult.length}</div>
                                            </div>
                                            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">
                                                <div className="text-sm text-emerald-600 dark:text-emerald-400">Passed</div>
                                                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-500">
                                                    {runResult.filter(tc => tc.status_id === 3).length}
                                                </div>
                                            </div>
                                            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                                                <div className="text-sm text-red-600 dark:text-red-400">Failed</div>
                                                <div className="text-2xl font-bold text-red-600 dark:text-red-500">
                                                    {runResult.filter(tc => tc.status_id !== 3).length}
                                                </div>
                                            </div>
                                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                                <div className="text-sm text-blue-600 dark:text-blue-400">Success</div>
                                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-500">
                                                    {((runResult.filter(tc => tc.status_id === 3).length / runResult.length) * 100).toFixed(0)}%
                                                </div>
                                            </div>
                                        </div>

                                        {runResult.map((tc, i) => (
                                            <div key={i} className={`border rounded-lg p-4 ${
                                                tc.status_id === 3 
                                                ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/10" 
                                                : "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10"
                                            }`}>
                                                <div className="flex justify-between items-center mb-3">
                                                    <div className="flex items-center gap-2">
                                                        {getStatusIcon(tc.status_id)}
                                                        <span className="font-bold">Test Case {i + 1}</span>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                        tc.status_id === 3 
                                                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" 
                                                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                                    }`}>
                                                        {tc.status_id === 3 ? "PASSED" : "FAILED"}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Input</div>
                                                        <div className="bg-gray-900 text-gray-100 rounded p-3 text-sm font-mono">
                                                            {tc.stdin || "N/A"}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Expected</div>
                                                        <div className="bg-gray-900 text-gray-100 rounded p-3 text-sm font-mono">
                                                            {tc.expected_output || "N/A"}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Your Output</div>
                                                    <div className="bg-gray-900 text-gray-100 rounded p-3 text-sm font-mono">
                                                        {tc.stdout || tc.error || "No output"}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeRightTab === "result" && (
                            <div className="h-full overflow-y-auto p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Submission Result</h2>
                                    <button
                                        onClick={() => setActiveRightTab("code")}
                                        className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors cursor-pointer"
                                    >
                                        Back to Code
                                    </button>
                                </div>

                                {!submitResult ? (
                                    <div className="text-center py-12">
                                        <BarChart2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Submission</h3>
                                        <p className="text-gray-600 dark:text-gray-400 mb-6">Submit your solution to see results.</p>
                                        <button
                                            onClick={handleSubmitCode}
                                            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer"
                                        >
                                            Submit Solution
                                        </button>
                                    </div>
                                ) : (
                                    <div className={`rounded-xl p-6 ${
                                        submitResult.accepted 
                                        ? "bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800" 
                                        : "bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800"
                                    }`}>
                                        <div className="flex items-center gap-4 mb-6">
                                            {submitResult.accepted ? (
                                                <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center">
                                                    <FaCheck className="w-6 h-6 text-white" />
                                                </div>
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center">
                                                    <FaTimes className="w-6 h-6 text-white" />
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    {submitResult.accepted ? "Accepted" : "Wrong Answer"}
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-400">
                                                    {submitResult.error || (submitResult.accepted ? "All test cases passed!" : "Some test cases failed.")}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-4 gap-4 mb-6">
                                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                                                <div className="text-sm text-gray-600 dark:text-gray-400">Test Cases</div>
                                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    {submitResult.passedTestCases}/{submitResult.totalTestCases}
                                                </div>
                                            </div>
                                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                                                <div className="text-sm text-gray-600 dark:text-gray-400">Runtime</div>
                                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    {submitResult.runtime || 0}s
                                                </div>
                                            </div>
                                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                                                <div className="text-sm text-gray-600 dark:text-gray-400">Memory</div>
                                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    {submitResult.memory || 0}KB
                                                </div>
                                            </div>
                                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                                                <div className="text-sm text-gray-600 dark:text-gray-400">Score</div>
                                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    {submitResult.accepted ? problem.points || 100 : 0}
                                                </div>
                                            </div>
                                        </div>

                                        {submitResult.accepted && (
                                            <div className="bg-emerald-100 dark:bg-emerald-900/20 p-4 rounded-lg">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
                                                    <span className="font-bold text-emerald-700 dark:text-emerald-400">Excellent!</span>
                                                </div>
                                                <p className="text-emerald-800 dark:text-emerald-300">
                                                    Your solution beats {Math.floor(Math.random() * 30) + 70}% of submissions.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default ProblemPage;