import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import api from '../../services/api';
import { Bell, Search, AlertCircle, Loader, Calendar } from 'lucide-react';

const StudentNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.get('/student/notices');
        if (res.data.success) {
          setNotices(res.data.notices);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch notice board');
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  const filteredNotices = notices.filter(not =>
    not.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    not.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-8 font-sans max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-100">Notice Board</h1>
          <p className="text-gray-400 text-sm mt-1">Review official bulletins, exam alerts, and announcements from professors</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Search */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search bulletins..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-905 border border-slate-800 text-gray-100 text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Notices list */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : filteredNotices.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl text-gray-500 text-sm">
            No notices match your search criteria.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotices.map((not) => (
              <div
                key={not._id}
                className="p-5 rounded-2xl border border-slate-850 bg-slate-900/10 hover:border-slate-800/80 transition-colors space-y-3.5"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-bold text-gray-200 text-base">{not.title}</h3>
                    <span className="text-[10px] text-gray-500 block mt-0.5">
                      Published by: <span className="text-blue-400 font-semibold">{not.createdBy?.name || 'Faculty'}</span>
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] text-gray-500 bg-slate-850 px-2.5 py-1 rounded-lg">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(not.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-gray-400 text-xs whitespace-pre-wrap leading-relaxed">
                  {not.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentNotices;
