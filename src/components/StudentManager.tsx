import React, { useState } from 'react';
import { 
  UserPlus, 
  Search, 
  Filter, 
  Phone, 
  Edit, 
  Trash2, 
  Eye, 
  CheckCircle, 
  AlertCircle, 
  X, 
  BookOpen, 
  ExternalLink,
  MessageCircle,
  FileText
} from 'lucide-react';
import { Student, ClassSession, PaymentRecord, AttendanceRecord, GradeRecord, CenterSettings } from '../types';
import { formatWhatsAppNumber } from '../utils/whatsapp';

interface StudentManagerProps {
  students: Student[];
  classes: ClassSession[];
  payments: PaymentRecord[];
  attendance: AttendanceRecord[];
  grades: GradeRecord[];
  settings: CenterSettings;
  onAddStudent: (newStudent: Omit<Student, 'id'>) => void;
  onUpdateStudent: (updatedStudent: Student) => void;
  onDeleteStudent: (id: string) => void;
}

export const StudentManager: React.FC<StudentManagerProps> = ({
  students,
  classes,
  payments,
  attendance,
  grades,
  settings,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<Student | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    icOrMyKid: '',
    level: 'Tingkatan 5 (SPM)',
    school: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    registeredClassIds: [] as string[],
    monthlyFee: 0,
    registrationDate: new Date().toISOString().split('T')[0],
    status: 'active' as Student['status'],
    notes: ''
  });

  const availableLevels = [
    'Tahun 4', 'Tahun 5', 'Tahun 6 (UPSR/KSSR)',
    'Tingkatan 1', 'Tingkatan 2', 'Tingkatan 3',
    'Tingkatan 4', 'Tingkatan 5 (SPM)', 'Tingkatan 6 (STPM)'
  ];

  // Auto-calculate suggested monthly fee based on selected classes
  const handleClassSelectionToggle = (classId: string) => {
    const isSelected = formData.registeredClassIds.includes(classId);
    let updatedClassIds: string[];
    if (isSelected) {
      updatedClassIds = formData.registeredClassIds.filter(id => id !== classId);
    } else {
      updatedClassIds = [...formData.registeredClassIds, classId];
    }

    const calculatedFee = updatedClassIds.reduce((sum, cId) => {
      const cls = classes.find(c => c.id === cId);
      return sum + (cls ? cls.feePerMonth : 0);
    }, 0);

    setFormData(prev => ({
      ...prev,
      registeredClassIds: updatedClassIds,
      monthlyFee: calculatedFee
    }));
  };

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      icOrMyKid: '',
      level: 'Tingkatan 5 (SPM)',
      school: '',
      parentName: '',
      parentPhone: '',
      parentEmail: '',
      registeredClassIds: [],
      monthlyFee: 0,
      registrationDate: new Date().toISOString().split('T')[0],
      status: 'active',
      notes: ''
    });
    setEditingStudent(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      icOrMyKid: student.icOrMyKid,
      level: student.level,
      school: student.school,
      parentName: student.parentName,
      parentPhone: student.parentPhone,
      parentEmail: student.parentEmail || '',
      registeredClassIds: student.registeredClassIds,
      monthlyFee: student.monthlyFee,
      registrationDate: student.registrationDate,
      status: student.status,
      notes: student.notes || ''
    });
    setIsAddModalOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.parentPhone.trim()) {
      alert('Sila isikan sekurang-kurangnya Nama Pelajar dan Nombor Telefon Penjaga.');
      return;
    }

    if (editingStudent) {
      onUpdateStudent({
        ...editingStudent,
        ...formData
      });
    } else {
      onAddStudent(formData);
    }

    setIsAddModalOpen(false);
  };

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.icOrMyKid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.school.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLevel = levelFilter === 'all' || student.level === levelFilter;
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;

    return matchesSearch && matchesLevel && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Pengurusan & Pendaftaran Pelajar
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Mengurus maklumat peribadi, nombor telefon penjaga, dan pendaftaran subjek tuisyen.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          Daftar Pelajar Baharu
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama pelajar, no kad pengenalan, sekolah, atau nama penjaga..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-2 bg-white text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">Semua Tingkatan/Tahun</option>
            {availableLevels.map(lvl => (
              <option key={lvl} value={lvl}>{lvl}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-2 bg-white text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="suspended">Cuti Sementara</option>
            <option value="inactive">Tidak Aktif</option>
          </select>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Nama Pelajar</th>
                <th className="py-3 px-4">Tingkatan & Sekolah</th>
                <th className="py-3 px-4">Ibu Bapa / WhatsApp</th>
                <th className="py-3 px-4">Subjek Berdaftar</th>
                <th className="py-3 px-4 text-right">Yuran Bulanan</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => {
                  const studentClasses = classes.filter(c => student.registeredClassIds.includes(c.id));
                  const waNumber = formatWhatsAppNumber(student.parentPhone);

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 text-sm">
                          {student.name}
                        </div>
                        <div className="text-slate-400 font-mono text-[11px] mt-0.5">
                          {student.icOrMyKid || 'Tiada No K/P'}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800">
                          {student.level}
                        </div>
                        <div className="text-slate-500 text-[11px] truncate max-w-[150px]">
                          {student.school || '-'}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-slate-900 font-medium">
                          {student.parentName}
                        </div>
                        <a
                          href={`https://wa.me/${waNumber}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-mono text-[11px] mt-0.5 hover:underline"
                        >
                          <MessageCircle className="w-3 h-3" />
                          {student.parentPhone}
                        </a>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {studentClasses.map(cls => (
                            <span
                              key={cls.id}
                              className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-medium"
                            >
                              {cls.subject}
                            </span>
                          ))}
                          {studentClasses.length === 0 && (
                            <span className="text-slate-400 italic">Belum daftar kelas</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 text-xs">
                        RM {student.monthlyFee.toFixed(2)}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {student.status === 'active' && (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-medium text-[11px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            Aktif
                          </span>
                        )}
                        {student.status === 'suspended' && (
                          <span className="inline-flex items-center gap-1 text-amber-700 font-medium text-[11px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            Cuti
                          </span>
                        )}
                        {student.status === 'inactive' && (
                          <span className="inline-flex items-center gap-1 text-rose-700 font-medium text-[11px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            Berhenti
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedStudentDetail(student)}
                            title="Lihat Profil Lengkap"
                            className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-slate-100 rounded-md transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(student)}
                            title="Sunting Maklumat"
                            className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-slate-100 rounded-md transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Adakah anda pasti ingin memadam rekod pelajar ${student.name}?`)) {
                                onDeleteStudent(student.id);
                              }
                            }}
                            title="Padam Pelajar"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-md transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-medium">Tiada pelajar dijumpai mengikut tapisan anda.</p>
                    <p className="text-xs mt-1">Sila ubah carian atau daftar pelajar baharu sekarang.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
          <span>Menunjukkan {filteredStudents.length} daripada {students.length} pelajar</span>
          <span className="font-mono">Jumlah Yuran Ditapis: RM {filteredStudents.reduce((sum, s) => sum + s.monthlyFee, 0).toFixed(2)}</span>
        </div>
      </div>

      {/* Modal: Daftar / Sunting Pelajar */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden my-8">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">
                {editingStudent ? 'Sunting Maklumat Pelajar' : 'Pendaftaran Pelajar Baharu'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 space-y-4 text-xs">
              
              {/* Bahagian 1: Maklumat Pelajar */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  1. Butiran Pelajar
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-medium mb-1">
                      Nama Penuh Pelajar <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Danial Haziq bin Rosli"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      No. Kad Pengenalan / MyKid
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: 090314-10-1123"
                      value={formData.icOrMyKid}
                      onChange={(e) => setFormData({ ...formData, icOrMyKid: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-mono bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      Tingkatan / Tahun <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 bg-white"
                    >
                      {availableLevels.map(lvl => (
                        <option key={lvl} value={lvl}>{lvl}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-medium mb-1">
                      Sekolah Asal
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: SMK Bandar Baru Bangi"
                      value={formData.school}
                      onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Bahagian 2: Maklumat Penjaga */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  2. Butiran Penjaga / Ibu Bapa
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      Nama Ibu Bapa / Penjaga <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Puan Roslina binti Osman"
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      No. WhatsApp Penjaga <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: 0123891044 atau 60123891044"
                      value={formData.parentPhone}
                      onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-mono bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-700 font-medium mb-1">
                      Emel Penjaga (Pilihan)
                    </label>
                    <input
                      type="email"
                      placeholder="Contoh: penjaga@gmail.com"
                      value={formData.parentEmail}
                      onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Bahagian 3: Pakej Kelas & Yuran */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  3. Pakej Kelas & Penetapan Yuran
                </span>
                <p className="text-[11px] text-slate-500 mb-2">
                  Pilih subjek kelas yang ingin didaftarkan. Yuran bulanan akan dikira secara automatik.
                </p>

                <div className="space-y-2 max-h-36 overflow-y-auto p-2 border border-slate-200 rounded-lg bg-slate-50/50">
                  {classes.map(cls => (
                    <label
                      key={cls.id}
                      className="flex items-center justify-between p-2 rounded bg-white border border-slate-200 hover:border-blue-400 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.registeredClassIds.includes(cls.id)}
                          onChange={() => handleClassSelectionToggle(cls.id)}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                          <span className="font-semibold text-slate-800">{cls.subject}</span>
                          <span className="text-slate-500 text-[11px]"> · {cls.level} ({cls.dayOfWeek} {cls.startTime})</span>
                        </div>
                      </div>
                      <span className="font-mono font-medium text-slate-700">
                        RM {cls.feePerMonth}/bln
                      </span>
                    </label>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      Jumlah Yuran Bulanan (RM)
                    </label>
                    <input
                      type="number"
                      step="5"
                      min="0"
                      value={formData.monthlyFee}
                      onChange={(e) => setFormData({ ...formData, monthlyFee: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-mono font-bold text-slate-900 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      Status Pendaftaran
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as Student['status'] })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 bg-white"
                    >
                      <option value="active">Aktif</option>
                      <option value="suspended">Cuti Sementara</option>
                      <option value="inactive">Berhenti / Tamat</option>
                    </select>
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-slate-700 font-medium mb-1">
                    Catatan Guru / Sasaran Akademik
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Contoh: Sasaran SPM A+, kelemahan pada tajuk kalkulus..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 bg-white"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors font-semibold shadow-sm"
                >
                  {editingStudent ? 'Simpan Perubahan' : 'Daftar Pelajar'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Drawer / Modal: Profil Terperinci Pelajar */}
      {selectedStudentDetail && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-8">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Profil Pelajar & Sejarah Rekod
                </h3>
                <p className="text-xs text-slate-500">ID: {selectedStudentDetail.id}</p>
              </div>
              <button
                onClick={() => setSelectedStudentDetail(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 text-xs max-h-[80vh] overflow-y-auto">
              
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-blue-50/60 p-4 rounded-xl border border-blue-100 gap-4">
                <div>
                  <h4 className="text-base font-bold text-blue-950">
                    {selectedStudentDetail.name}
                  </h4>
                  <p className="text-slate-600 mt-0.5">
                    {selectedStudentDetail.level} · {selectedStudentDetail.school || 'Tiada maklumat sekolah'}
                  </p>
                  <p className="text-slate-500 font-mono text-[11px] mt-1">
                    No. IC: {selectedStudentDetail.icOrMyKid || '-'} · Daftar: {selectedStudentDetail.registrationDate}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[11px] text-slate-500 block">Kadar Yuran Bulanan</span>
                  <span className="text-base font-mono font-bold text-blue-900 block">
                    RM {selectedStudentDetail.monthlyFee.toFixed(2)}
                  </span>
                  <a
                    href={`https://wa.me/${formatWhatsAppNumber(selectedStudentDetail.parentPhone)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold mt-2 shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    WhatsApp Penjaga
                  </a>
                </div>
              </div>

              {/* Subjek Kelas Berdaftar */}
              <div>
                <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">
                  Subjek Berdaftar ({selectedStudentDetail.registeredClassIds.length})
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {classes.filter(c => selectedStudentDetail.registeredClassIds.includes(c.id)).map(cls => (
                    <div key={cls.id} className="p-3 border border-slate-200 rounded-lg bg-slate-50/50">
                      <div className="font-semibold text-slate-900">{cls.subject}</div>
                      <div className="text-slate-500 text-[11px] mt-0.5">
                        Tutor: {cls.tutorName} · {cls.dayOfWeek} ({cls.startTime} - {cls.endTime})
                      </div>
                      <div className="text-slate-600 font-mono text-[11px] mt-1">
                        Bilik: {cls.room} · RM {cls.feePerMonth}/bln
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sejarah Yuran Pelajar Ini */}
              <div>
                <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">
                  Rekod Pembayaran Yuran
                </h5>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                        <th className="py-2 px-3">Bulan</th>
                        <th className="py-2 px-3">No. Resit</th>
                        <th className="py-2 px-3 text-right">Amaun</th>
                        <th className="py-2 px-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {payments.filter(p => p.studentId === selectedStudentDetail.id).map(pay => (
                        <tr key={pay.id}>
                          <td className="py-2 px-3 font-medium text-slate-800">{pay.month}</td>
                          <td className="py-2 px-3 font-mono text-slate-600">{pay.receiptNumber}</td>
                          <td className="py-2 px-3 text-right font-mono font-medium">
                            RM {pay.amountPaid.toFixed(2)} / RM {pay.amountDue.toFixed(2)}
                          </td>
                          <td className="py-2 px-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              pay.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                              pay.status === 'partial' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {pay.status === 'paid' ? 'Lunas' : pay.status === 'partial' ? 'Separa' : 'Tertunggak'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Catatan / Nota */}
              {selectedStudentDetail.notes && (
                <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-lg text-amber-900">
                  <span className="font-semibold block mb-0.5">Catatan Perkembangan:</span>
                  <p className="text-xs leading-relaxed">{selectedStudentDetail.notes}</p>
                </div>
              )}

            </div>

            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedStudentDetail(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
