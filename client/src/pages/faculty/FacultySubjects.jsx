import React from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';

const FacultySubjects = () => {
  return (
    <DashboardLayout>
      <div className="p-6 text-center border border-dashed border-slate-800 rounded-2xl">
        <h2 className="text-xl font-bold text-gray-200">My Subjects</h2>
        <p className="text-gray-400 text-sm mt-2">This module is coming in Phase 3.</p>
      </div>
    </DashboardLayout>
  );
};

export default FacultySubjects;
