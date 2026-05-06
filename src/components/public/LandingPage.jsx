import { Link } from 'react-router-dom';
import {
  Microscope,
  ShieldCheck,
  FileCheck2,
  FileDown,
  ArrowRight,
  FlaskConical,
  UserPlus,
  TestTube2,
  BadgeCheck,
  Download,
  Mail,
  Phone,
} from 'lucide-react';
import NidanProBrand from '../common/NidanProBrand';

const features = [
  {
    title: 'Digital Report Management',
    description: 'Manage all reports in one place with clear status tracking.',
    icon: FileCheck2,
  },
  {
    title: 'Role-Based Workflow',
    description: 'Technician to doctor handoff with reliable verification flow.',
    icon: ShieldCheck,
  },
  {
    title: 'Secure Patient Access',
    description: 'OTP login and report code access for safe report retrieval.',
    icon: Microscope,
  },
  {
    title: 'Automated PDF Reports',
    description: 'Generate professional reports ready to download anytime.',
    icon: FileDown,
  },
];

const steps = [
  { title: 'Add Patient & Assign Tests', icon: UserPlus },
  { title: 'Enter Test Results', icon: TestTube2 },
  { title: 'Doctor Verifies Report', icon: BadgeCheck },
  { title: 'Patient Downloads Report', icon: Download },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      <header className="sticky top-0 z-40 h-16 border-b border-border bg-card/90 backdrop-blur">
        <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#home" className="flex items-center gap-2 font-semibold text-lg">
            <img src="/logo_NidanPro.png" alt="NidanPro Logo" className="h-9 w-9" />
            <NidanProBrand variant="text-only" />
          </a>

          <nav className="hidden items-center gap-6 text-sm font-medium text-text-secondary md:flex">
            <a href="#home" className="hover:text-primary transition-colors">Home</a>
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#about" className="hover:text-primary transition-colors">About</a>
            <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/patient-access"
              className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-primary-600 sm:px-4 sm:text-sm"
            >
              Check Results
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section
          id="home"
          className="relative overflow-hidden border-b border-border bg-gradient-to-b from-blue-50 to-background"
        >
          <div className="pointer-events-none absolute -top-20 right-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />

          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-2 lg:items-center lg:gap-10 lg:px-8">
            <div className="text-center lg:text-left">
              <p className="mb-3 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                Built for Modern Diagnostics
              </p>
              <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
                Smarter Labs. Better Care.
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-sm text-text-secondary sm:text-base lg:mx-0">
                <NidanProBrand variant="text-only" /> is a modern pathology lab management platform designed to simplify
                diagnostics, streamline workflows, and deliver accurate reports with speed and
                precision.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                {/* <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600"
                >
                  Staff Workspace
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link> */}
                <Link
                  to="/patient-access"
                  className="inline-flex items-center justify-center rounded-xl bg-secondary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-secondary-600"
                >
                  Open Patient Portal
                </Link>
              </div>
            </div>

            <div className="mx-auto w-full max-w-xl rounded-2xl border border-border bg-card p-4 shadow-md sm:p-6">
              <div className="mb-4 flex items-center justify-between rounded-xl bg-slate-50 p-3">
                <p className="text-sm font-semibold">Live Dashboard Preview</p>
                <span className="rounded-full bg-secondary/15 px-2 py-1 text-xs font-semibold text-secondary">
                  Backend Ready
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border p-3">
                  <p className="text-xs text-text-secondary">Total Reports</p>
                  <div className="mt-2 h-6 w-20 rounded bg-slate-100" />
                </div>
                <div className="rounded-xl border border-border p-3">
                  <p className="text-xs text-text-secondary">Pending Verify</p>
                  <div className="mt-2 h-6 w-16 rounded bg-slate-100" />
                </div>
                <div className="col-span-2 rounded-xl border border-border p-3">
                  <p className="text-xs text-text-secondary">Workflow Status</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-medium text-text-primary">
                    <span className="rounded-md bg-blue-50 px-2 py-1">Sample Collection</span>
                    <span>→</span>
                    <span className="rounded-md bg-blue-50 px-2 py-1">Report Entry</span>
                    <span>→</span>
                    <span className="rounded-md bg-green-50 px-2 py-1">Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">Core Features</h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-text-secondary sm:text-base">
              Everything your lab needs to move from manual operations to fast and reliable
              digital workflows.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.title}
                  className="rounded-xl border border-border bg-card p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5"
                >
                  <span className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-sm font-semibold sm:text-base">{feature.title}</h3>
                  <p className="mt-2 text-xs text-text-secondary sm:text-sm">{feature.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section id="about" className="border-y border-border bg-slate-50/70">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold sm:text-3xl">How It Works</h2>
              <p className="mx-auto mt-2 max-w-2xl text-sm text-text-secondary sm:text-base">
                A clear diagnostic pipeline from patient registration to verified report delivery.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.title}
                    className="relative rounded-xl border border-border bg-card p-5 shadow-sm"
                  >
                    <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <p className="text-sm font-semibold">
                      {idx + 1}. {step.title}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 to-secondary/10 p-7 text-center shadow-sm sm:p-10">
            <h2 className="text-2xl font-bold sm:text-3xl">Ready to Digitize Your Lab?</h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-text-secondary sm:text-base">
              Start using <NidanProBrand variant="text-only" /> to improve speed, consistency, and report delivery quality.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/patient-access"
                className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600"
              >
                Track My Lab Report
              </Link>
              <Link
                to="/patient-access"
                className="inline-flex items-center justify-center rounded-xl bg-secondary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-secondary-600"
              >
                Download Test Files
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer id="contact" className="border-t border-border bg-card">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <div className="mb-3 flex items-center gap-2 text-lg font-semibold">
              <img src="/logo_NidanPro.png" alt="NidanPro Logo" className="h-9 w-9" />
              <NidanProBrand variant="text-only" />
            </div>
            <p className="text-sm text-text-secondary">
              A trusted pathology lab management platform for faster diagnostics and better
              patient communication.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><a href="#home" className="hover:text-primary">Home</a></li>
              <li><a href="#features" className="hover:text-primary">Features</a></li>
              <li><a href="#contact" className="hover:text-primary">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">Contact</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                support@nidanpro.com
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                +91 98765 43210
              </li>
              <li><Link to="/staff/login" className="hover:text-primary font-medium text-primary">Staff Workspace</Link></li>
              <li><Link to="/staff/login?type=admin" className="hover:text-primary font-medium text-secondary">Admin</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border px-4 py-4 text-center text-xs text-text-secondary sm:px-6 lg:px-8">
          © 2026 <NidanProBrand variant="text-only" />. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
