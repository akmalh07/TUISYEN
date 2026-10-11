import { CenterSettings, ClassSession, Student, PaymentRecord, AttendanceRecord, GradeRecord } from '../types';

export const initialSettings: CenterSettings = {
  centerName: 'Pusat Tuisyen Intelek Gemilang',
  tagline: 'Membimbing Generasi Celik & Berjaya Sejak 2018',
  registrationNumber: '002938472-A (KPM/JPS)',
  phone: '013-8829102',
  email: 'intelekgemilang@gmail.com',
  address: 'No. 12A, Jalan Dagang 4, Pusat Perniagaan Bandar Baru Bangi, 43650 Selangor',
  bankName: 'Maybank Berhad',
  accountNumber: '5628 3491 8820',
  accountHolder: 'Pusat Tuisyen Intelek Gemilang',
  receiptPrefix: 'RCP-2026',
  currency: 'RM',
  principalName: 'Cikgu Azman bin Kassim'
};

export const initialClasses: ClassSession[] = [
  {
    id: 'cls-1',
    subject: 'Matematik',
    level: 'Tingkatan 5 (SPM)',
    dayOfWeek: 'Isnin',
    startTime: '20:00',
    endTime: '21:30',
    tutorName: 'Cikgu Azman Kassim',
    room: 'Bilik Al-Khawarizmi',
    feePerMonth: 65,
    maxCapacity: 15
  },
  {
    id: 'cls-2',
    subject: 'Fizik',
    level: 'Tingkatan 5 (SPM)',
    dayOfWeek: 'Selasa',
    startTime: '20:00',
    endTime: '21:30',
    tutorName: 'Dr. Radzi Mansor',
    room: 'Makmal Fizik Einstein',
    feePerMonth: 70,
    maxCapacity: 12
  },
  {
    id: 'cls-3',
    subject: 'Kimia',
    level: 'Tingkatan 5 (SPM)',
    dayOfWeek: 'Rabu',
    startTime: '20:00',
    endTime: '21:30',
    tutorName: 'Cikgu Sarah Nadirah',
    room: 'Makmal Kimia Curie',
    feePerMonth: 70,
    maxCapacity: 12
  },
  {
    id: 'cls-4',
    subject: 'Bahasa Melayu',
    level: 'Tingkatan 5 (SPM)',
    dayOfWeek: 'Khamis',
    startTime: '19:45',
    endTime: '21:15',
    tutorName: 'Cikgu Noraini binti Sulaiman',
    room: 'Bilik Za\'aba',
    feePerMonth: 60,
    maxCapacity: 18
  },
  {
    id: 'cls-5',
    subject: 'Bahasa Inggeris',
    level: 'Tingkatan 4 & 5',
    dayOfWeek: 'Jumaat',
    startTime: '20:00',
    endTime: '21:30',
    tutorName: 'Sir William / Teacher Aina',
    room: 'Bilik Shakespeare',
    feePerMonth: 65,
    maxCapacity: 15
  },
  {
    id: 'cls-6',
    subject: 'Matematik Tambahan (Add Math)',
    level: 'Tingkatan 4',
    dayOfWeek: 'Sabtu',
    startTime: '10:00',
    endTime: '11:45',
    tutorName: 'Cikgu Azman Kassim',
    room: 'Bilik Al-Khawarizmi',
    feePerMonth: 75,
    maxCapacity: 12
  },
  {
    id: 'cls-7',
    subject: 'Sains & Matematik',
    level: 'Tahun 6 (UPSR/KSSR)',
    dayOfWeek: 'Sabtu',
    startTime: '14:00',
    endTime: '16:00',
    tutorName: 'Cikgu Farhan Aziz',
    room: 'Bilik Ibnu Sina',
    feePerMonth: 80,
    maxCapacity: 16
  }
];

export const initialStudents: Student[] = [
  {
    id: 'std-1',
    name: 'Danial Haziq bin Rosli',
    icOrMyKid: '090314-10-1123',
    level: 'Tingkatan 5 (SPM)',
    school: 'SMK Bandar Baru Bangi',
    parentName: 'Puan Roslina binti Osman',
    parentPhone: '0123891044',
    parentEmail: 'roslina.osman@gmail.com',
    registeredClassIds: ['cls-1', 'cls-2', 'cls-4'],
    monthlyFee: 195, // RM65 + RM70 + RM60
    registrationDate: '2026-01-10',
    status: 'active',
    notes: 'Sasaran SPM Straight A. Kelemahan pada soalan Kertas 2 Fizik.'
  },
  {
    id: 'std-2',
    name: 'Nur Alya Maisarah binti Ahmad',
    icOrMyKid: '090822-10-5420',
    level: 'Tingkatan 5 (SPM)',
    school: 'SMK Jalan Empat',
    parentName: 'Encik Ahmad Fauzi',
    parentPhone: '0192345678',
    parentEmail: 'fauzi.ahmad@yahoo.com',
    registeredClassIds: ['cls-1', 'cls-3', 'cls-5'],
    monthlyFee: 200,
    registrationDate: '2026-01-15',
    status: 'active',
    notes: 'Pelajar rajin dan komited. Menunjukkan kemajuan dalam Kimia.'
  },
  {
    id: 'std-3',
    name: 'Chong Wei Lun',
    icOrMyKid: '091105-14-3329',
    level: 'Tingkatan 5 (SPM)',
    school: 'SMJK Yu Hua Kajang',
    parentName: 'Mr. Chong Kai Wen',
    parentPhone: '0173456789',
    parentEmail: 'kaiwen_chong@hotmail.com',
    registeredClassIds: ['cls-1', 'cls-2', 'cls-3'],
    monthlyFee: 205,
    registrationDate: '2026-02-01',
    status: 'active',
    notes: 'Sangat kuat dalam Fizik dan Matematik.'
  },
  {
    id: 'std-4',
    name: 'Thivagar a/l Murugan',
    icOrMyKid: '090518-10-8871',
    level: 'Tingkatan 5 (SPM)',
    school: 'SMK Tinggi Kajang',
    parentName: 'Mr. Murugan a/l Gopal',
    parentPhone: '0168765432',
    registeredClassIds: ['cls-4', 'cls-5'],
    monthlyFee: 125,
    registrationDate: '2026-03-05',
    status: 'active',
    notes: 'Perlu bimbingan tatabahasa dan penulisan karangan BM.'
  },
  {
    id: 'std-5',
    name: 'Siti Zulaikha binti Zamri',
    icOrMyKid: '100412-10-6754',
    level: 'Tingkatan 4',
    school: 'SMK Bandar Baru Bangi',
    parentName: 'Puan Siti Aminah',
    parentPhone: '0139988771',
    parentEmail: 'aminah_zamri@gmail.com',
    registeredClassIds: ['cls-5', 'cls-6'],
    monthlyFee: 140,
    registrationDate: '2026-01-18',
    status: 'active',
    notes: 'Mengambil Add Math buat kali pertama, perlukan latihan asas kalkulus.'
  },
  {
    id: 'std-6',
    name: 'Muhammad Harith bin Faizal',
    icOrMyKid: '140620-10-2189',
    level: 'Tahun 6 (UPSR/KSSR)',
    school: 'SK Seksyen 7 Bangi',
    parentName: 'Encik Faizal bin Rahman',
    parentPhone: '01123489012',
    registeredClassIds: ['cls-7'],
    monthlyFee: 80,
    registrationDate: '2026-02-12',
    status: 'active',
    notes: 'Sangat aktif bertanya soalan dalam kelas sains.'
  },
  {
    id: 'std-7',
    name: 'Adam Luqman bin Kamarul',
    icOrMyKid: '090909-10-4433',
    level: 'Tingkatan 5 (SPM)',
    school: 'SMK Jalan Reko',
    parentName: 'Puan Noraini Hashim',
    parentPhone: '0183344556',
    registeredClassIds: ['cls-1', 'cls-4'],
    monthlyFee: 125,
    registrationDate: '2026-04-01',
    status: 'suspended',
    notes: 'Cuti sementara 2 minggu kerana mewakili sekolah dalam sukan olahraga.'
  }
];

export const initialPayments: PaymentRecord[] = [
  {
    id: 'pay-1',
    receiptNumber: 'RCP-2026-0041',
    studentId: 'std-1',
    month: '2026-10',
    amountDue: 195,
    amountPaid: 195,
    paymentMethod: 'DuitNow / Bank Transfer',
    paymentDate: '2026-10-02',
    status: 'paid',
    referenceNo: 'MBB-983274610',
    receivedBy: 'Cikgu Azman'
  },
  {
    id: 'pay-2',
    receiptNumber: 'RCP-2026-0042',
    studentId: 'std-2',
    month: '2026-10',
    amountDue: 200,
    amountPaid: 200,
    paymentMethod: 'DuitNow / Bank Transfer',
    paymentDate: '2026-10-04',
    status: 'paid',
    referenceNo: 'CIMB-55449120',
    receivedBy: 'Puan Sarah'
  },
  {
    id: 'pay-3',
    receiptNumber: 'RCP-2026-0043',
    studentId: 'std-3',
    month: '2026-10',
    amountDue: 205,
    amountPaid: 100,
    paymentMethod: 'Tunai',
    paymentDate: '2026-10-05',
    status: 'partial',
    referenceNo: 'CASH-0021',
    receivedBy: 'Cikgu Azman',
    notes: 'Baki RM105 akan dibayar pada minggu ke-3'
  },
  {
    id: 'pay-4',
    receiptNumber: 'RCP-2026-0044',
    studentId: 'std-4',
    month: '2026-10',
    amountDue: 125,
    amountPaid: 0,
    paymentMethod: 'DuitNow / Bank Transfer',
    status: 'unpaid',
    receivedBy: 'Pengurusan Tuisyen'
  },
  {
    id: 'pay-5',
    receiptNumber: 'RCP-2026-0045',
    studentId: 'std-5',
    month: '2026-10',
    amountDue: 140,
    amountPaid: 140,
    paymentMethod: 'DuitNow / Bank Transfer',
    paymentDate: '2026-10-03',
    status: 'paid',
    referenceNo: 'RHB-88392019',
    receivedBy: 'Cikgu Azman'
  },
  {
    id: 'pay-6',
    receiptNumber: 'RCP-2026-0046',
    studentId: 'std-6',
    month: '2026-10',
    amountDue: 80,
    amountPaid: 0,
    paymentMethod: 'Tunai',
    status: 'unpaid',
    receivedBy: 'Pengurusan Tuisyen'
  },
  {
    id: 'pay-7',
    receiptNumber: 'RCP-2026-0038',
    studentId: 'std-4',
    month: '2026-09',
    amountDue: 125,
    amountPaid: 125,
    paymentMethod: 'Tunai',
    paymentDate: '2026-09-06',
    status: 'paid',
    referenceNo: 'CASH-0019',
    receivedBy: 'Cikgu Azman'
  }
];

export const initialAttendance: AttendanceRecord[] = [
  {
    id: 'att-1',
    date: '2026-10-05', // Isnin
    classId: 'cls-1',
    studentId: 'std-1',
    status: 'present',
    timestamp: '2026-10-05T20:02:00.000Z'
  },
  {
    id: 'att-2',
    date: '2026-10-05',
    classId: 'cls-1',
    studentId: 'std-2',
    status: 'present',
    timestamp: '2026-10-05T19:58:00.000Z'
  },
  {
    id: 'att-3',
    date: '2026-10-05',
    classId: 'cls-1',
    studentId: 'std-3',
    status: 'present',
    timestamp: '2026-10-05T20:05:00.000Z'
  },
  {
    id: 'att-4',
    date: '2026-10-06', // Selasa
    classId: 'cls-2',
    studentId: 'std-1',
    status: 'present',
    timestamp: '2026-10-06T20:01:00.000Z'
  },
  {
    id: 'att-5',
    date: '2026-10-06',
    classId: 'cls-2',
    studentId: 'std-3',
    status: 'present',
    timestamp: '2026-10-06T19:55:00.000Z'
  },
  {
    id: 'att-6',
    date: '2026-10-08', // Khamis
    classId: 'cls-4',
    studentId: 'std-1',
    status: 'present',
    timestamp: '2026-10-08T19:50:00.000Z'
  },
  {
    id: 'att-7',
    date: '2026-10-08',
    classId: 'cls-4',
    studentId: 'std-4',
    status: 'absent',
    notes: 'Demam panas, ibu bapa telah maklumkan',
    timestamp: '2026-10-08T19:40:00.000Z'
  }
];

export const initialGrades: GradeRecord[] = [
  {
    id: 'grd-1',
    studentId: 'std-1',
    subject: 'Matematik SPM',
    examName: 'Ujian Percubaan 1',
    marks: 88,
    maxMarks: 100,
    grade: 'A',
    tutorFeedback: 'Penguasaan konsep fungsi dan kalkulus sangat mantap. Tingkatkan ketelitian pada soalan kebarangkalian.',
    date: '2026-09-24'
  },
  {
    id: 'grd-2',
    studentId: 'std-1',
    subject: 'Fizik SPM',
    examName: 'Ujian Bulanan September',
    marks: 74,
    maxMarks: 100,
    grade: 'B+',
    tutorFeedback: 'Kefahaman hukum Newton baik. Perlu lebih banyak latihan soalan Kertas 2 bahagian esei.',
    date: '2026-09-28'
  },
  {
    id: 'grd-3',
    studentId: 'std-2',
    subject: 'Kimia SPM',
    examName: 'Ujian Topikal Asid & Bes',
    marks: 92,
    maxMarks: 100,
    grade: 'A+',
    tutorFeedback: 'Cemerlang! Pengiraan stoikiometri dan persamaan kimia dibuat dengan sangat kemas.',
    date: '2026-09-27'
  },
  {
    id: 'grd-4',
    studentId: 'std-3',
    subject: 'Matematik SPM',
    examName: 'Ujian Percubaan 1',
    marks: 95,
    maxMarks: 100,
    grade: 'A+',
    tutorFeedback: 'Prestasi cemerlang berterusan. Boleh membimbing rakan sekelas yang lain.',
    date: '2026-09-24'
  },
  {
    id: 'grd-5',
    studentId: 'std-4',
    subject: 'Bahasa Melayu SPM',
    examName: 'Ujian Bulanan Karangan',
    marks: 68,
    maxMarks: 100,
    grade: 'B',
    tutorFeedback: 'Ada peningkatan dalam kosa kata. Perlu mantapkan perenggan kesimpulan dan huraian isi tersirat.',
    date: '2026-09-25'
  },
  {
    id: 'grd-6',
    studentId: 'std-6',
    subject: 'Sains & Matematik UPSR',
    examName: 'Kuiz Bulanan September',
    marks: 85,
    maxMarks: 100,
    grade: 'A',
    tutorFeedback: 'Harith sangat cerdas dalam memahami konsep sains fizikal dan logik nombor.',
    date: '2026-09-29'
  }
];
