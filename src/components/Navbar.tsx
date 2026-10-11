import React, { useState } from 'react';
import { 
  GraduationCap, 
  LayoutDashboard, 
  Users, 
  CalendarDays, 
  CheckSquare, 
  Receipt, 
  Award, 
  Settings, 
  Menu, 
  X,
  FileDown
} from 'lucide-react';

export type NavTab = 'dashboard' | 'students' | 'schedule' | 'attendance' | 'fees' | 'grades';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  openSettingsModal: () => void;
  centerName: string;
  onExportBackup: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openSettingsModal,
  centerName,
  onExportBackup
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Papan Pemuka', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'students', label: 'Pelajar', icon: <Users className="w-4 h-4" /> },
    { id: 'schedule', label: 'Jadual Kelas', icon: <CalendarDays className="w-4 h-4" /> },
    { id: 'attendance', label: 'Kehadiran', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'fees', label: 'Yuran & Resit', icon: <Receipt className="w-4 h-4" /> },
    { id: 'grades', label: 'Rekod Prestasi', icon: <Award className="w-4 h-4" /> },
  ];

  const handleTabClick = (tab: NavTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-blue-700 text-white flex items-center justify-center shadow-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="leading-tight">
              <span className="text-base font-bold text-slate-900 tracking-tight block">
                e-Tuisyen Pintar
              </span>
              <span className="text-xs text-slate-500 font-medium truncate max-w-[180px] sm:max-w-[240px] block">
                {centerName}
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-50 text-blue-800'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span className={isActive ? 'text-blue-700' : 'text-slate-500'}>
                    {item.icon}
                  </span>
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action & Tools */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              onClick={onExportBackup}
              title="Muat Turun Sandaran JSON"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <FileDown className="w-3.5 h-3.5 text-slate-500" />
              <span>Sandaran</span>
            </button>
            <button
              onClick={openSettingsModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Tetapan Pusat</span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={openSettingsModal}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              title="Tetapan"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              aria-label="Buka Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1 shadow-md">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-left transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className={isActive ? 'text-blue-700' : 'text-slate-400'}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-100 flex gap-2">
            <button
              onClick={() => {
                onExportBackup();
                setMobileMenuOpen(false);
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg"
            >
              <FileDown className="w-4 h-4 text-slate-500" />
              Muat Turun Sandaran
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
