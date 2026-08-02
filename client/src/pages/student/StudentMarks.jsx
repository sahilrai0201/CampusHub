import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';
import { 
  GraduationCap, 
  Award, 
  BookOpen, 
  TrendingUp, 
  Search, 
  FileText, 
  Loader, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';

const StudentMarks = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Dropdown filter state for selecting a specific subject
  const [selectedSubject, setSelectedSubject] = useState('All');

  const fetchGradesData = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log("Fetching student assignments/marks from API...");
      const res = await api.get('/student/assignments');
      console.log("Student marks fetch raw response:", res.data);

      if (res.data.success) {
        setAssignments(res.data.assignments);
      } else {
        setError('Failed to fetch assignments list.');
      }
    } catch (err) {
      console.error("Error fetching grades data:", err);
      setError(err.message || 'Something went wrong fetching your scores.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGradesData();
  }, []);

  // Get list of unique subjects for the filter dropdown
  const uniqueSubjects = ['All'];
  assignments.forEach((item) => {
    const sName = item.subject?.name;
    if (sName && !uniqueSubjects.includes(sName)) {
      uniqueSubjects.push(sName);
    }
  });

  // Filter list based on selected subject dropdown
  const filteredAssignments = assignments.filter((asn) => {
    if (selectedSubject === 'All') return true;
    return asn.subject?.name === selectedSubject;
  });

  // Calculate statistics (Average, High Score, Low Score, Graded count)
  // We only count submissions that actually have a number score assigned
  const gradedSubmissions = assignments.filter(
    (asn) => asn.submission && asn.submission.marks !== null
  );

  const totalGraded = gradedSubmissions.length;
  
  let averageScore = 0;
  let highestScore = 0;
  let lowestScore = 0;

  if (totalGraded > 0) {
    const scores = gradedSubmissions.map((asn) => asn.submission.marks);
    const sum = scores.reduce((acc, curr) => acc + curr, 0);
    averageScore = (sum / totalGraded).toFixed(1);
    highestScore = Math.max(...scores);
    lowestScore = Math.min(...scores);
  }

  // Count how many solutions are waiting for the professor to grade them
  const pendingReview = assignments.filter(
    (asn) => asn.submission && asn.submission.marks === null
  ).length;

  return (
    <DashboardLayout>
      <div className="space-y-8 font-sans">
        
        {/* Title Block */}
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-100 flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-indigo-400" />
            My Grades & Academic Performance
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Track your scored homework, review feedback, and monitor your current course average.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader className="w-8 h-8 animate-spin text-indigo-500" />
            <span className="ml-2 text-gray-400 text-sm">Calculating stats and loading scores...</span>
          </div>
        ) : (
          <>
            {/* Stats Dashboard Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Average Mark Card */}
              <div className="glassmorphism p-6 rounded-2xl border border-slate-850 shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Average Grade</span>
                  <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-100 font-display">
                  {totalGraded > 0 ? `${averageScore}%` : 'N/A'}
                </h3>
                <span className="text-[10px] text-gray-500 block mt-1">
                  {totalGraded > 0 ? `Based on ${totalGraded} graded tasks` : 'No assignments graded yet'}
                </span>
              </div>

              {/* Graded Tasks Card */}
              <div className="glassmorphism p-6 rounded-2xl border border-slate-850 shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Graded Work</span>
                  <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
                    <Award className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-100 font-display">
                  {totalGraded}
                </h3>
                <span className="text-[10px] text-gray-500 block mt-1">
                  Out of {assignments.length} total tasks published
                </span>
              </div>

              {/* Highest / Lowest Scores */}
              <div className="glassmorphism p-6 rounded-2xl border border-slate-850 shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Score Range</span>
                  <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
                    <BookOpen className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold text-gray-100 font-display">
                    {totalGraded > 0 ? `${highestScore}` : 'N/A'}
                  </h3>
                  {totalGraded > 0 && (
                    <span className="text-xs text-gray-500 font-semibold">
                      (Low: {lowestScore})
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-gray-500 block mt-1">
                  Marks scored out of 100 max
                </span>
              </div>

              {/* Pending Grade Reviews */}
              <div className="glassmorphism p-6 rounded-2xl border border-slate-850 shadow-md">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pending Grade</span>
                  <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-100 font-display">
                  {pendingReview}
                </h3>
                <span className="text-[10px] text-gray-500 block mt-1">
                  Submitted papers awaiting review
                </span>
              </div>

            </div>

            {/* Filter controls & Grade Table container */}
            <div className="glassmorphism rounded-2xl border border-slate-850 p-6 shadow-xl space-y-6">
              
              {/* Filter controls */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h3 className="text-base font-bold text-gray-200 font-display">Coursework Breakdown</h3>
                
                <div className="flex items-center gap-2">
                  <label htmlFor="subjectFilter" className="text-xs text-gray-400 font-medium">
                    Filter Course:
                  </label>
                  <select
                    id="subjectFilter"
                    value={selectedSubject}
                    onChange={(e) => {
                      console.log("Subject filter changed to:", e.target.value);
                      setSelectedSubject(e.target.value);
                    }}
                    className="bg-slate-900 border border-slate-800 text-gray-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    {uniqueSubjects.map((sub, idx) => (
                      <option key={idx} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Grades Table */}
              {filteredAssignments.length === 0 ? (
                <div className="text-center py-12 text-gray-500 text-sm border-t border-slate-850">
                  No assignments found matching this subject filter.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-850 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                        <th className="pb-3 pr-4">Subject</th>
                        <th className="pb-3 px-4">Assignment Name</th>
                        <th className="pb-3 px-4">Submit Date</th>
                        <th className="pb-3 px-4">Status</th>
                        <th className="pb-3 pl-4 text-right">Marks / Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850/50">
                      {filteredAssignments.map((asn) => {
                        const isSubmitted = asn.submission !== null;
                        const hasScore = isSubmitted && asn.submission.marks !== null;

                        return (
                          <tr key={asn._id} className="hover:bg-slate-900/10 transition-colors">
                            {/* Subject */}
                            <td className="py-4 pr-4 font-semibold text-gray-300">
                              {asn.subject?.name || 'Unknown'}
                            </td>

                            {/* Title */}
                            <td className="py-4 px-4 text-gray-100 font-medium max-w-xs truncate" title={asn.title}>
                              {asn.title}
                            </td>

                            {/* Date */}
                            <td className="py-4 px-4 text-gray-400 text-xs">
                              {isSubmitted 
                                ? new Date(asn.submission.submittedAt).toLocaleDateString()
                                : '-'
                              }
                            </td>

                            {/* Status badge */}
                            <td className="py-4 px-4">
                              {!isSubmitted ? (
                                <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                                  Not Submitted
                                </span>
                              ) : !hasScore ? (
                                <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                                  Under Review
                                </span>
                              ) : (
                                <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                                  Graded
                                </span>
                              )}
                            </td>

                            {/* Marks column */}
                            <td className="py-4 pl-4 text-right">
                              {hasScore ? (
                                <div className="flex items-center justify-end gap-1.5">
                                  <span className={`text-base font-bold font-display ${
                                    asn.submission.marks >= 80 ? 'text-emerald-400' :
                                    asn.submission.marks >= 50 ? 'text-indigo-400' : 'text-rose-400'
                                  }`}>
                                    {asn.submission.marks}
                                  </span>
                                  <span className="text-xs text-gray-500">/100</span>
                                  {asn.submission.file && (
                                    <a
                                      href={`http://localhost:5000${asn.submission.file}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="ml-2 text-indigo-400 hover:text-indigo-300"
                                      title="View marked paper"
                                    >
                                      <FileText className="w-4 h-4 inline" />
                                    </a>
                                  )}
                                </div>
                              ) : (
                                <span className="text-gray-500 text-xs">-</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

            </div>
          </>
        )}
        
      </div>
    </DashboardLayout>
  );
};

export default StudentMarks;
