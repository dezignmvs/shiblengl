/**
 * Data Access Layer (db.js)
 * Advanced Spoken English Level 1 Tracking System
 * Integrated with PocketBase (https://pocketbase.io) & Local Storage Fallback
 */

function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const INITIAL_STUDENTS = [
  {
    id: "std-101",
    name: "Sarah Jenkins",
    email: "sarah@englishlevel1.com",
    password: "student123",
    role: "student",
    status: "active",
    createdAt: "2026-08-01"
  },
  {
    id: "std-102",
    name: "Alex Rivera",
    email: "alex@englishlevel1.com",
    password: "student123",
    role: "student",
    status: "active",
    createdAt: "2026-08-05"
  },
  {
    id: "std-103",
    name: "Michael Chen",
    email: "michael@englishlevel1.com",
    password: "student123",
    role: "student",
    status: "inactive",
    createdAt: "2026-08-10"
  },
  {
    id: "admin-01",
    name: "Shibl KP (Instructor)",
    email: "shiblkp",
    password: "340340",
    role: "admin",
    status: "active",
    createdAt: "2026-08-01"
  }
];

const TODAY = getTodayDateString();

const INITIAL_PRACTICES = {};
INITIAL_PRACTICES[TODAY] = {
  date: TODAY,
  speakingTopic: "Practice speaking in English for 20 minutes about your childhood memories, your hometown, and your school life.",
  chatgptPrompt: `"I am practicing spoken English for Advanced Level 1. Please have a friendly conversation with me about my childhood and school life. Ask me open-ended questions, encourage me to expand on my answers, and point out any major grammar or vocabulary mistakes."`,
  listeningTitle: "Mastering Fluent English Expression & Daily Vocabulary",
  listeningInstruction: "Listen to the speaker's pronunciation, pause after key sentences, and practice shadowing the dialogue out loud.",
  listeningUrl: "https://www.youtube.com/embed/5qap5aO4i9A",
  publishedAt: new Date().toISOString()
};

const INITIAL_LOGS = [
  {
    id: "log-001",
    studentId: "std-101",
    date: TODAY,
    speakingCompleted: true,
    speakingTimestamp: new Date().toISOString(),
    listeningCompleted: true,
    listeningTimestamp: new Date().toISOString()
  },
  {
    id: "log-002",
    studentId: "std-102",
    date: TODAY,
    speakingCompleted: true,
    speakingTimestamp: new Date().toISOString(),
    listeningCompleted: false,
    listeningTimestamp: null
  }
];

class StorageService {
  constructor() {
    this.STORAGE_KEYS = {
      STUDENTS: 'ase_students_pb_v1',
      PRACTICES: 'ase_practices_pb_v1',
      LOGS: 'ase_logs_pb_v1',
      CURRENT_USER: 'ase_current_user_pb_v1'
    };
    this.initStorage();
  }

  initStorage() {
    if (!localStorage.getItem(this.STORAGE_KEYS.STUDENTS)) {
      localStorage.setItem(this.STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
    } else {
      const users = this.getUsers();
      const adminUser = users.find(u => u.role === 'admin' || u.id === 'admin-01');
      if (adminUser) {
        adminUser.email = 'shiblkp';
        adminUser.password = '340340';
        adminUser.name = 'Shibl KP (Instructor)';
        this.saveUsers(users);
      }
    }
    if (!localStorage.getItem(this.STORAGE_KEYS.PRACTICES)) {
      localStorage.setItem(this.STORAGE_KEYS.PRACTICES, JSON.stringify(INITIAL_PRACTICES));
    }
    if (!localStorage.getItem(this.STORAGE_KEYS.LOGS)) {
      localStorage.setItem(this.STORAGE_KEYS.LOGS, JSON.stringify(INITIAL_LOGS));
    }
  }

  // --- Auth & User Methods ---
  getUsers() {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.STUDENTS)) || [];
  }

  saveUsers(users) {
    localStorage.setItem(this.STORAGE_KEYS.STUDENTS, JSON.stringify(users));
  }

  async authenticateAsync(email, password) {
    // If PocketBase server is connected, attempt PocketBase Auth first
    if (isPocketBaseAvailable && pb) {
      try {
        const authData = await pb.collection('users').authWithPassword(email, password);
        const pbUser = {
          id: authData.record.id,
          name: authData.record.name || authData.record.email.split('@')[0],
          email: authData.record.email,
          role: authData.record.role || 'student',
          status: 'active'
        };
        this.setCurrentUser(pbUser);
        return pbUser;
      } catch (err) {
        console.warn("PocketBase remote auth attempt failed, checking local credentials:", err);
      }
    }

    // Local / Offline authentication fallback
    return this.authenticateLocal(email, password);
  }

  authenticate(email, password) {
    return this.authenticateLocal(email, password);
  }

  authenticateLocal(email, password) {
    const users = this.getUsers();
    const cleanEmail = email.trim().toLowerCase();
    const user = users.find(u => 
      (u.email.toLowerCase() === cleanEmail || u.email.toLowerCase().split('@')[0] === cleanEmail) && 
      u.password === password
    );
    if (user) {
      if (user.status === 'inactive') {
        throw new Error("This account is currently deactivated. Please contact your instructor.");
      }
      this.setCurrentUser(user);
      return user;
    }
    throw new Error("Invalid username/email or password.");
  }

  setCurrentUser(user) {
    localStorage.setItem(this.STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  }

  getCurrentUser() {
    const data = localStorage.getItem(this.STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  }

  logout() {
    if (pb && pb.authStore) {
      pb.authStore.clear();
    }
    localStorage.removeItem(this.STORAGE_KEYS.CURRENT_USER);
  }

  addStudent(name, email, password) {
    const users = this.getUsers();
    if (users.some(u => u.email.toLowerCase() === email.trim().toLowerCase())) {
      throw new Error("A student with this email address already exists.");
    }
    const newStudent = {
      id: "std-" + Date.now(),
      name,
      email: email.trim(),
      password,
      role: "student",
      status: "active",
      createdAt: getTodayDateString()
    };
    users.push(newStudent);
    this.saveUsers(users);

    // Sync to PocketBase in background if available
    if (isPocketBaseAvailable && pb) {
      pb.collection('users').create({
        name,
        email: email.trim(),
        password,
        passwordConfirm: password,
        role: "student"
      }).catch(err => console.error("PocketBase async sync error:", err));
    }

    return newStudent;
  }

  updateStudent(studentId, updatedData) {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === studentId);
    if (index !== -1) {
      users[index] = { ...users[index], ...updatedData };
      this.saveUsers(users);
      return users[index];
    }
    throw new Error("Student not found.");
  }

  toggleStudentStatus(studentId) {
    const users = this.getUsers();
    const user = users.find(u => u.id === studentId);
    if (user) {
      user.status = user.status === 'active' ? 'inactive' : 'active';
      this.saveUsers(users);
      return user;
    }
    throw new Error("Student not found.");
  }

  deleteStudent(studentId) {
    let users = this.getUsers();
    users = users.filter(u => u.id !== studentId);
    this.saveUsers(users);
  }

  // --- Daily Practice Content Methods ---
  getPractices() {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.PRACTICES)) || {};
  }

  getPracticeByDate(dateStr) {
    const practices = this.getPractices();
    return practices[dateStr] || null;
  }

  savePractice(practiceData) {
    const practices = this.getPractices();
    const dateStr = practiceData.date || getTodayDateString();
    
    practices[dateStr] = {
      ...practiceData,
      date: dateStr,
      publishedAt: new Date().toISOString()
    };
    localStorage.setItem(this.STORAGE_KEYS.PRACTICES, JSON.stringify(practices));

    // Sync to PocketBase if connected
    if (isPocketBaseAvailable && pb) {
      pb.collection('practices').create(practiceData).catch(err => console.error("PocketBase save practice sync error:", err));
    }

    return practices[dateStr];
  }

  deletePractice(dateStr) {
    const practices = this.getPractices();
    delete practices[dateStr];
    localStorage.setItem(this.STORAGE_KEYS.PRACTICES, JSON.stringify(practices));
  }

  // --- Practice Completion Log Methods ---
  getLogs() {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.LOGS)) || [];
  }

  getStudentLogs(studentId) {
    const logs = this.getLogs();
    return logs.filter(l => l.studentId === studentId);
  }

  getStudentLogForDate(studentId, dateStr) {
    const logs = this.getLogs();
    return logs.find(l => l.studentId === studentId && l.date === dateStr) || null;
  }

  togglePracticeCompletion(studentId, dateStr, practiceType) {
    const logs = this.getLogs();
    let log = logs.find(l => l.studentId === studentId && l.date === dateStr);
    
    if (!log) {
      log = {
        id: "log-" + Date.now(),
        studentId,
        date: dateStr,
        speakingCompleted: false,
        speakingTimestamp: null,
        listeningCompleted: false,
        listeningTimestamp: null
      };
      logs.push(log);
    }

    const nowIso = new Date().toISOString();
    if (practiceType === 'speaking') {
      log.speakingCompleted = !log.speakingCompleted;
      log.speakingTimestamp = log.speakingCompleted ? nowIso : null;
    } else if (practiceType === 'listening') {
      log.listeningCompleted = !log.listeningCompleted;
      log.listeningTimestamp = log.listeningCompleted ? nowIso : null;
    }

    localStorage.setItem(this.STORAGE_KEYS.LOGS, JSON.stringify(logs));

    // Sync to PocketBase
    if (isPocketBaseAvailable && pb) {
      pb.collection('logs').create(log).catch(err => console.error("PocketBase log sync error:", err));
    }

    return log;
  }

  // --- Progress & Analytics Calculation Methods ---
  getStudentStats(studentId) {
    const logs = this.getStudentLogs(studentId);
    let speakingDays = 0;
    let listeningDays = 0;
    
    logs.forEach(log => {
      if (log.speakingCompleted) speakingDays++;
      if (log.listeningCompleted) listeningDays++;
    });

    let currentStreak = 0;
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      
      const dayLog = logs.find(l => l.date === dateStr);
      if (dayLog && (dayLog.speakingCompleted || dayLog.listeningCompleted)) {
        currentStreak++;
      } else {
        if (i === 0) continue; 
        break;
      }
    }

    return {
      speakingDays,
      listeningDays,
      totalCompleted: speakingDays + listeningDays,
      currentStreak
    };
  }

  getAdminOverviewStats() {
    const users = this.getUsers().filter(u => u.role === 'student');
    const logs = this.getLogs();
    const todayStr = getTodayDateString();
    
    let speakingCompletedToday = 0;
    let listeningCompletedToday = 0;
    let inactiveToday = 0;

    users.forEach(student => {
      const log = logs.find(l => l.studentId === student.id && l.date === todayStr);
      if (log) {
        if (log.speakingCompleted) speakingCompletedToday++;
        if (log.listeningCompleted) listeningCompletedToday++;
        if (!log.speakingCompleted && !log.listeningCompleted) inactiveToday++;
      } else {
        inactiveToday++;
      }
    });

    return {
      totalStudents: users.length,
      speakingCompletedToday,
      listeningCompletedToday,
      inactiveToday
    };
  }
}

// Global DB instance
const db = new StorageService();
