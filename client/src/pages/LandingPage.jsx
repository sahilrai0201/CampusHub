import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import {
  GraduationCap,
  BookOpen,
  ClipboardList,
  Bell,
  ArrowRight,
  Shield,
  UploadCloud,
  CheckCircle,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const LandingPage = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setContactSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setContactSuccess(false), 5000);
    }
  };

  const faqs = [
    {
      q: 'What is CampusHub?',
      a: 'CampusHub is a full-featured College Management System designed to bridge the gap between administrators, faculty members, and students by providing automated workflows, assignments tracking, digital notice boards, and attendance logs.',
    },
    {
      q: 'How do I obtain login credentials?',
      a: 'Initially, a system administrator creates faculty and student profiles. Users are registered with their email address and can then log in and personalize their profile, upload a picture, and manage passwords.',
    },
    {
      q: 'Can students upload files in CampusHub?',
      a: 'Yes! Students can submit their assignments directly in the system by uploading PDF, document, or image files. Faculty can then review, grade, and feedback on submissions directly.',
    },
    {
      q: 'Is there a mobile version of CampusHub?',
      a: 'CampusHub is fully responsive. It works flawlessly across mobile phones, tablets, laptops, and desktop screens with custom layout adjustments for touch screens.',
    },
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28 md:pt-28 md:pb-36 bg-[#0b0f19]">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 mb-6 animate-pulse">
            <GraduationCap className="w-3.5 h-3.5" />
            Introducing CampusHub v1.0
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-display text-gradient mb-6 max-w-4xl mx-auto leading-tight">
            Simplify College Management and Academic Operations
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            An all-in-one system for student enrollments, assignment feedback, attendance logs, and digital note sharing. Empowering administrators, faculties, and students.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/login"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl shadow-blue-500/20 transition-all duration-300 hover:-translate-y-0.5"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold border border-slate-700/80 hover:bg-slate-800/40 text-gray-300 hover:text-white transition-all duration-300"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 border-t border-slate-900 bg-[#090d16]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-display text-gray-100">Key Platform Features</h2>
            <p className="text-gray-400 mt-2 max-w-lg mx-auto">
              Custom modules tailored specifically to satisfy different administrative, student, and educator workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl glassmorphism hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-100 mb-3">Role-Based Access (RBAC)</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Dedicated interfaces for Admin (manages metadata), Faculty (grades & attendance), and Students (submissions & files) ensuring secure operations.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl glassmorphism hover:border-indigo-500/40 transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-100 mb-3">File Upload & Sharing</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Seamless local upload of PDF notes, assignments files, and student homework submissions. Flexible design, ready for cloud storage backup.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl glassmorphism hover:border-pink-500/40 transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 mb-6">
                <ClipboardList className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-100 mb-3">Attendance & Marks</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Faculty can record daily attendance and enter assignment scores. Students get real-time graphs, logs, and grades calculations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 border-t border-slate-900 bg-[#0b0f19]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400 mb-4">
                About CampusHub
              </div>
              <h2 className="text-3xl font-bold font-display text-gray-100 mb-6">
                Engineered for Performance, Clarity, and Ease
              </h2>
              <p className="text-gray-400 mb-6 leading-relaxed">
                CampusHub brings standard web technology into the classroom environment. Built using React, Node.js, Express, and MongoDB, this software provides robust reliability, lightning-fast response times, and an intuitive user interface.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-200 text-sm">Consistent REST API</h4>
                    <p className="text-gray-400 text-xs mt-0.5">Reliable endpoints returning clean JSON responses with validation controls.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-200 text-sm">Responsive and Interactive UI</h4>
                    <p className="text-gray-400 text-xs mt-0.5">Styled with Tailwind CSS using micro-animations, loaders, and glassmorphic aesthetics.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-3xl blur-2xl opacity-10 pointer-events-none" />
              <div className="relative border border-slate-800/80 rounded-3xl p-6 md:p-8 bg-[#090d16]/90 shadow-2xl">
                <h3 className="font-bold text-gray-200 text-lg mb-6 border-b border-slate-800/80 pb-4">Our Technology Stack</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-slate-900/60 border border-slate-800/40 rounded-xl">
                    <span className="font-semibold text-blue-400">Frontend</span>
                    <p className="text-gray-400 text-xs mt-1">React, Vite, Tailwind CSS</p>
                  </div>
                  <div className="p-3 bg-slate-900/60 border border-slate-800/40 rounded-xl">
                    <span className="font-semibold text-indigo-400">Backend</span>
                    <p className="text-gray-400 text-xs mt-1">Node.js, Express.js</p>
                  </div>
                  <div className="p-3 bg-slate-900/60 border border-slate-800/40 rounded-xl">
                    <span className="font-semibold text-teal-400">Database</span>
                    <p className="text-gray-400 text-xs mt-1">MongoDB Atlas, Mongoose</p>
                  </div>
                  <div className="p-3 bg-slate-900/60 border border-slate-800/40 rounded-xl">
                    <span className="font-semibold text-pink-400">Security</span>
                    <p className="text-gray-400 text-xs mt-1">JWT tokens, bcrypt hashing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 border-t border-slate-900 bg-[#090d16]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-display text-gray-100">Simple 3-Step Process</h2>
            <p className="text-gray-400 mt-2 max-w-lg mx-auto">
              How the CampusHub ecosystem connects admins, faculty, and students.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="relative text-center p-6">
              <div className="w-12 h-12 rounded-full bg-blue-600/10 border-2 border-blue-500/20 flex items-center justify-center font-bold text-blue-400 text-lg mx-auto mb-6">
                1
              </div>
              <h3 className="font-bold text-gray-200 text-base mb-2">Admin Setup</h3>
              <p className="text-gray-400 text-sm">
                System admin seeds departments, subjects, and registers student/faculty accounts.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative text-center p-6">
              <div className="w-12 h-12 rounded-full bg-indigo-600/10 border-2 border-indigo-500/20 flex items-center justify-center font-bold text-indigo-400 text-lg mx-auto mb-6">
                2
              </div>
              <h3 className="font-bold text-gray-200 text-base mb-2">Faculty Input</h3>
              <p className="text-gray-400 text-sm">
                Faculty uploads lecture files, assigns tasks, records attendance, and grades work.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative text-center p-6">
              <div className="w-12 h-12 rounded-full bg-pink-600/10 border-2 border-pink-500/20 flex items-center justify-center font-bold text-pink-400 text-lg mx-auto mb-6">
                3
              </div>
              <h3 className="font-bold text-gray-200 text-base mb-2">Student Learns</h3>
              <p className="text-gray-400 text-sm">
                Students log in, retrieve study notes, check notifications, and submit papers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 border-t border-slate-900 bg-[#0b0f19]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display text-gray-100 font-sans">Frequently Asked Questions</h2>
            <p className="text-gray-400 mt-2">Find answers to common questions about using CampusHub.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-800/80 rounded-xl bg-slate-900/30 overflow-hidden transition-colors"
              >
                <button
                  className="w-full flex items-center justify-between p-5 text-left font-semibold text-gray-200 hover:text-white hover:bg-slate-800/20 transition-all"
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                >
                  <span>{faq.q}</span>
                  {activeFaq === idx ? <ChevronUp className="w-4 h-4 text-blue-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 pt-1 text-sm text-gray-400 leading-relaxed border-t border-slate-800/30 bg-slate-900/10">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 border-t border-slate-900 bg-[#090d16]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <h2 className="text-3xl font-bold font-display text-gray-100 mb-4">Get In Touch</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                Have questions or need assistance setting up CampusHub in your college department? Drop us a message, and our system support team will respond quickly.
              </p>
              
              <div className="space-y-4 text-sm text-gray-300">
                <div className="flex items-center gap-3">
                  <Mail className="w-4.5 h-4.5 text-blue-400" />
                  <span>support@campushub.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4.5 h-4.5 text-indigo-400" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4.5 h-4.5 text-pink-400" />
                  <span>Campus Main Admin Block, NY</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="glassmorphism p-8 rounded-2xl border border-slate-800/80">
                {contactSuccess ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl text-center font-medium">
                    Thank you! Your inquiry was submitted. Our team will contact you soon.
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Name</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-gray-100 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                          placeholder="Your Name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Email Address</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-gray-100 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                          placeholder="name@email.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Message</label>
                      <textarea
                        rows="4"
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-gray-100 text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"
                        placeholder="Type your question or query here..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/10 transition-colors"
                    >
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default LandingPage;
