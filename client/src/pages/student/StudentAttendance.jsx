import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';
import { ClipboardList, Calendar, CheckCircle2, XCircle, AlertCircle, Loader } from 'lucide-react';

const StudentAttendance = () => {
  const [logs, setLogs] = useState([]);
  const [subjectStats, setSubjectStats] = useState([]);
  const [overallPercentage, setOverallPercentage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.get('/student/attendance');
        if (res.data.success) {
          setLogs(res.data.logs);
          setSubjectStats(res.data.stats);
          
          // Calculate overall percentage
          const totalLogs = res.data.logs.length;
          const presentLogs = res.data.logs.filter(log => log.status === 'Present').length;
          const overall = totalLogs > 0 ? (presentLogs / totalLogs) * 100 : null;
          setOverallPercentage(overall);
        }
      } catch (err) {
        setError(err.message || 'Failed to retrieve attendance logs');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8 font-sans">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-100">Attendance Log</h1>
          <p className="text-gray-400 text-sm mt-1">Monitor your class presence ratios and verify roll-call records</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm max-w-5xl">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left panels: Statistics */}
            <div className="lg:col-span-1 space-y-6">
              {/* Overall Circular Summary Card */}
              <div className="glassmorphism p-6 rounded-2xl border border-slate-800/80 text-center flex flex-col items-center justify-center relative overflow-hidden">
                <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-4">Overall Presence Ratio</h3>
                
                <div className="relative w-36 h-36 flex items-center justify-center mb-2">
                  {/* SVG circular track */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="72"
                      cy="72"
                      r="60"
                      className="text-slate-800"
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    <circle
                      cx="72"
                      cy="72"
                      r="60"
                      className="text-blue-500 transition-all duration-1000 ease-out"
                      strokeWidth="8"
                      strokeDasharray={377}
                      strokeDashoffset={377 - (377 * (overallPercentage || 0)) / 100}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                    />
                  </svg>
                  
                  <div className="absolute text-center">
                    <span className="text-2xl font-bold font-display text-gray-100">
                      {overallPercentage !== null ? `${overallPercentage.toFixed(1)}%` : '0%'}
                    </span>
                    <span className="text-[10px] text-gray-500 block font-medium uppercase mt-0.5">Ratio</span>
                  </div>
                </div>

                <span className="text-[11px] text-gray-400 mt-2 block">
                  {logs.length > 0
                    ? `Present for ${logs.filter(l => l.status === 'Present').length} classes out of ${logs.length} total held.`
                    : 'No attendance records logged.'}
                </span>
              </div>

              {/* Subject Breakdown Card */}
              <div className="glassmorphism p-6 rounded-2xl border border-slate-800/80">
                <h3 className="text-base font-bold text-gray-200 mb-4 font-display">Subject Breakdown</h3>
                <div className="space-y-4">
                  {subjectStats.map((stat, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-gray-300 truncate w-3/4">{stat.subjectName}</span>
                        <span className="text-gray-400 shrink-0 font-medium">
                          {stat.percentage !== null ? `${stat.percentage.toFixed(0)}%` : '0%'}
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${stat.percentage || 0}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-500 block">
                        Attended: {stat.presentClasses} / {stat.totalClasses} classes
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right panel: Timeline log */}
            <div className="lg:col-span-2">
              <div className="glassmorphism p-6 rounded-2xl border border-slate-800/80">
                <h3 className="text-lg font-bold text-gray-100 mb-6 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-indigo-400" />
                  Detailed Roll Log
                </h3>

                {logs.length === 0 ? (
                  <div className="text-center py-16 border border-dashed border-slate-800 rounded-xl text-gray-500 text-sm">
                    No classes have been recorded in your timetable logs yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-300">
                      <thead>
                        <tr className="border-b border-slate-800/85 text-xs text-gray-400 uppercase tracking-wider">
                          <th className="pb-3 font-semibold">Date</th>
                          <th className="pb-3 font-semibold">Subject</th>
                          <th className="pb-3 font-semibold text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/40">
                        {logs.map((log) => (
                          <tr key={log._id} className="hover:bg-slate-900/10 transition-colors">
                            <td className="py-3.5 flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-200">{new Date(log.date).toLocaleDateString()}</span>
                            </td>
                            <td className="py-3.5 text-gray-400">{log.subject?.name}</td>
                            <td className="py-3.5 text-right">
                              {log.status === 'Present' ? (
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Present
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-400 bg-red-500/10 px-2.5 py-0.5 rounded-full">
                                  <XCircle className="w-3.5 h-3.5" />
                                  Absent
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentAttendance;
