import { useState, useEffect } from "react";
import { NavLink } from "react-router";
import { useSelector } from "react-redux";
import axiosClient from "../../utils/axiosClient";
import { CheckCircle, ChevronRight, Search, Filter, ArrowUpRight, XCircle } from "lucide-react";
import AppLayout from "../../Components/AppLayout";
import Animate from "../../animate";
import StatsSection from "./StateSection";

const ProblemsPage = () => {
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filters, setFilters] = useState({
    difficulty: "all",
    tag: "all",
    status: "all",
    company: "all",
  });
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dailyProblem, setDailyProblem] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);

  const difficulties = [
    { value: "easy", label: "Easy", color: "emerald" },
    { value: "medium", label: "Medium", color: "yellow" },
    { value: "hard", label: "Hard", color: "red" }
  ];
  
  const allTags = [
    "array", "string", "linkedList", "stack", "queue", "hashing",
    "twoPointers", "slidingWindow", "binarySearch", "recursion",
    "backtracking", "greedy", "dynamicProgramming", "tree", "binaryTree",
    "bst", "graph", "heap", "trie", "bitManipulation", "math", "sorting",
  ];
  
  const allCompanies = ["Google", "Facebook", "Amazon", "Microsoft", "Apple", "Netflix"];

  const fetchProblems = async (page = 1) => {
    setLoading(true);
    try {
      let params = { page, limit: 10 };
      if (filters.status === "solved") {
        params.page = 1;
        params.limit = 1000;
      }
      if (filters.difficulty !== "all") params.difficulty = filters.difficulty;
      if (filters.tag !== "all") params.tags = filters.tag;
      if (filters.company !== "all") params.companies = filters.company;

      const query = new URLSearchParams(params).toString();
      const res = await axiosClient.get(`/problem/getAllProblem?${query}`);

      setProblems(res.data.problems);
      setCurrentPage(res.data.currentPage);
      setTotalPages(res.data.totalPages);
      setNextPage(res.data.nextPage);
      setPrevPage(res.data.prevPage);

      if (res.data.problems.length > 0) {
        const randomIndex = Math.floor(Math.random() * res.data.problems.length);
        setDailyProblem(res.data.problems[randomIndex]);
      }
    } catch (err) {
      console.error(err);
      setProblems([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSolvedProblems = async () => {
    if (!user) return;
    try {
      const res = await axiosClient.get("/problem/problemSolvedByUser");
      setSolvedProblems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProblems(currentPage);
    fetchSolvedProblems();
  }, [filters, currentPage, user]);

  useEffect(() => {
    // Update active filters display
    const newActiveFilters = [];
    if (filters.difficulty !== "all") newActiveFilters.push(`Difficulty: ${filters.difficulty}`);
    if (filters.status !== "all") newActiveFilters.push(`Status: ${filters.status}`);
    if (filters.tag !== "all") newActiveFilters.push(`Tag: ${filters.tag}`);
    if (filters.company !== "all") newActiveFilters.push(`Company: ${filters.company}`);
    setActiveFilters(newActiveFilters);
  }, [filters]);

  const solvedIds = solvedProblems.map((p) => p._id);
  const filteredProblems = problems
    .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    .filter(
      (p) =>
        filters.status === "all" ||
        (filters.status === "solved" && solvedIds.includes(p._id))
    );

  const getBadgeTheme = (name) => {
    const themes = {
      array: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800",
      string: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300 border-pink-200 dark:border-pink-800",
      easy: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
      medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
      hard: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800",
      google: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800",
      facebook: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
      amazon: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
      microsoft: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800",
      solved: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    };
    return themes[name.toLowerCase()] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700";
  };

  const handleStatusClick = () => {
    // Toggle between "all" and "solved"
    const newStatus = filters.status === "all" ? "solved" : "all";
    setFilters(prev => ({ ...prev, status: newStatus }));
  };

  const clearFilters = () => {
    setFilters({
      difficulty: "all",
      tag: "all",
      status: "all",
      company: "all",
    });
  };

  const removeFilter = (filterText) => {
    const filterType = filterText.split(": ")[0].toLowerCase();
    const filterValue = filterText.split(": ")[1].toLowerCase();
    
    if (filterType === "difficulty") {
      setFilters(prev => ({ ...prev, difficulty: "all" }));
    } else if (filterType === "status") {
      setFilters(prev => ({ ...prev, status: "all" }));
    } else if (filterType === "tag") {
      setFilters(prev => ({ ...prev, tag: "all" }));
    } else if (filterType === "company") {
      setFilters(prev => ({ ...prev, company: "all" }));
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-white dark:bg-gray-950">
          <div className="hidden dark:block">
            <Animate />
          </div>
          <div className="relative z-10 flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading problems...</p>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <div className="hidden dark:block fixed inset-0">
          <Animate />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12">
                <div>
                  <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                    Problem Set
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                    Master data structures and algorithms through curated challenges from top tech companies
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {problems.length}+ Problems
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Updated daily
                    </div>
                  </div>
                </div>
              </div>

              {/* Daily Problem */}
              {dailyProblem && (
                <div className="bg-gradient-to-r from-gray-900 to-emerald-900 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 mb-12 border border-gray-200 dark:border-gray-800">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-white">
                          Problem of the Day
                        </div>
                        <div className="px-3 py-1 bg-yellow-500/20 backdrop-blur-sm rounded-full text-sm font-medium text-yellow-500">
                          +{dailyProblem.points || 100} Coins
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">
                        {dailyProblem.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 mb-6">
                        <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getBadgeTheme(dailyProblem.difficulty)}`}>
                          {dailyProblem.difficulty.charAt(0).toUpperCase() + dailyProblem.difficulty.slice(1)}
                        </span>
                        {dailyProblem.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-lg text-sm text-white/90">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-white/80">
                        <span>🔥 {dailyProblem.solvedToday || 0} solved today</span>
                        <span>•</span>
                        <span>⏱️ 30 min avg solve time</span>
                      </div>
                    </div>
                    <NavLink
                      to={`/problem/${dailyProblem._id}`}
                      className="group flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-xl transition-all hover:scale-105 cursor-pointer"
                    >
                      Solve Now
                      <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </NavLink>
                  </div>
                </div>
              )}

              {/* Search and Filters */}
              <div className="mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 cursor-pointer" />
                    <input
                      type="text"
                      placeholder="Search problems by title, topic, or company..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all cursor-text"
                    />
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer"
                  >
                    <Filter className="w-5 h-5" />
                    Filters
                    {showFilters && <ChevronRight className="w-5 h-5 rotate-90" />}
                  </button>
                </div>

                {/* Active Filters Display */}
                {activeFilters.length > 0 && (
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
                    {activeFilters.map((filter, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 rounded-lg cursor-pointer"
                        onClick={() => removeFilter(filter)}
                      >
                        <span className="text-sm">{filter}</span>
                        <XCircle className="w-4 h-4" />
                      </div>
                    ))}
                    <button
                      onClick={clearFilters}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                    >
                      Clear all
                    </button>
                  </div>
                )}

                {showFilters && (
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Difficulty
                      </label>
                      <select
                        className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none cursor-pointer"
                        value={filters.difficulty}
                        onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                      >
                        <option value="all">All Difficulties</option>
                        {difficulties.map((d) => (
                          <option key={d.value} value={d.value}>{d.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Status
                      </label>
                      <div className="relative">
                        <select
                          className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none cursor-pointer"
                          value={filters.status}
                          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        >
                          <option value="all">All Problems</option>
                          <option value="solved">Solved Only</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category
                      </label>
                      <select
                        className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none cursor-pointer"
                        value={filters.tag}
                        onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
                      >
                        <option value="all">All Categories</option>
                        {allTags.map((tag) => (
                          <option key={tag} value={tag}>{tag}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Company
                      </label>
                      <select
                        className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none cursor-pointer"
                        value={filters.company}
                        onChange={(e) => setFilters({ ...filters, company: e.target.value })}
                      >
                        <option value="all">All Companies</option>
                        {allCompanies.map((company) => (
                          <option key={company} value={company}>{company}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Problems Count */}
              <div className="flex items-center justify-between mb-6">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {filteredProblems.length} {filteredProblems.length === 1 ? 'problem' : 'problems'} found
                </div>
                <div className="flex items-center gap-4">
                  {/* Status Filter Button - Clickable */}
                  <button
                    onClick={handleStatusClick}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                      filters.status === "solved" 
                        ? "bg-emerald-600 text-white" 
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    {filters.status === "solved" ? "Show All" : "Show Solved"}
                  </button>
                </div>
              </div>

              {/* Problems List */}
              <div className="mb-12">
                <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
                  <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                    <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                      <div className="col-span-1">Status</div>
                      <div className="col-span-5">Problem</div>
                      <div className="col-span-2">Difficulty</div>
                      <div className="col-span-2">Tags</div>
                      <div className="col-span-2">Action</div>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-200 dark:divide-gray-800">
                    {filteredProblems.length === 0 ? (
                      <div className="px-6 py-16 text-center">
                        <div className="text-gray-400 dark:text-gray-600 mb-4">No problems found</div>
                        <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters or search term</p>
                      </div>
                    ) : (
                      filteredProblems.map((p) => {
                        const solved = solvedIds.includes(p._id);
                        return (
                          <div 
                            key={p._id} 
                            className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors group cursor-pointer"
                          >
                            <div className="grid grid-cols-12 gap-4 items-center">
                              {/* Status - Clickable to mark solved/unsolved */}
                              <div className="col-span-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // You can add toggle solved logic here
                                  }}
                                  className="cursor-pointer hover:scale-110 transition-transform"
                                >
                                  {solved ? (
                                    <CheckCircle className="w-6 h-6 text-emerald-500" />
                                  ) : (
                                    <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-700 group-hover:border-emerald-500 transition-colors"></div>
                                  )}
                                </button>
                              </div>
                              
                              {/* Title */}
                              <div className="col-span-5">
                                <div className="flex items-center gap-3">
                                  <NavLink
                                    to={`/problem/${p._id}`}
                                    className="font-medium text-gray-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                                  >
                                    {p.title}
                                  </NavLink>
                                  <div className="flex gap-2">
                                    {p.companies.slice(0, 2).map((c) => (
                                      <span key={c} className={`px-2 py-1 text-xs rounded cursor-default ${getBadgeTheme(c)}`}>
                                        {c}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              
                              {/* Difficulty */}
                              <div className="col-span-2">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium cursor-default ${getBadgeTheme(p.difficulty)}`}>
                                  {p.difficulty.charAt(0).toUpperCase() + p.difficulty.slice(1)}
                                </span>
                              </div>
                              
                              {/* Tags */}
                              <div className="col-span-2">
                                <div className="flex flex-wrap gap-1">
                                  {p.tags.slice(0, 2).map((tag) => (
                                    <span key={tag} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded cursor-default">
                                      {tag}
                                    </span>
                                  ))}
                                  {p.tags.length > 2 && (
                                    <span className="px-2 py-1 text-xs text-gray-400 cursor-default">+{p.tags.length - 2}</span>
                                  )}
                                </div>
                              </div>
                              
                              {/* Solve Button */}
                              <div className="col-span-2">
                                <NavLink
                                  to={`/problem/${p._id}`}
                                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors hover:scale-105 cursor-pointer"
                                >
                                  Solve
                                  <ArrowUpRight className="w-4 h-4" />
                                </NavLink>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mb-16">
                  <button
                    onClick={() => prevPage && setCurrentPage(prevPage)}
                    disabled={!prevPage}
                    className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5 rotate-180" />
                    Previous
                  </button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                            currentPage === pageNum
                              ? 'bg-emerald-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => nextPage && setCurrentPage(nextPage)}
                    disabled={!nextPage}
                    className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    Next
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Stats Section */}
              <div className="mb-16">
                <StatsSection />
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-r from-gray-900 to-emerald-900 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-800">
                <h2 className="text-3xl font-bold text-white mb-6">
                  Ready to Master Algorithms?
                </h2>
                <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                  Join thousands of developers who have improved their skills with our curated problem sets
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <NavLink
                    to="/problems"
                    className="px-8 py-4 bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-xl transition-all hover:scale-105 cursor-pointer"
                  >
                    Start Practicing Now
                  </NavLink>
                  <button className="px-8 py-4 border-2 border-white/30 hover:border-white text-white font-semibold rounded-xl transition-all hover:bg-white/10 cursor-pointer">
                    View Learning Paths
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProblemsPage;