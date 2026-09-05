/**
 * Data Access Layer (db.js)
 * Advanced Spoken English Level 1 Tracking System
 * Integrated with Firebase (v10 SDK) & Local Storage Fallback
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

const INITIAL_LOGS = [];

class StorageService {
  constructor() {
    this.STORAGE_KEYS = {
      STUDENTS: 'ase_students_fb_v2',
      PRACTICES: 'ase_practices_fb_v2',
      LOGS: 'ase_logs_fb_v2',
      CURRENT_USER: 'ase_current_user_fb_v2'
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

    // Background sync from Firebase Firestore if available
    this.syncFromFirebase();
  }

  async syncFromFirebase() {
    if (typeof firebaseDb !== 'undefined' && firebaseDb) {
      try {
        // 1. Sync or Seed Users
        const usersSnap = await firebaseDb.collection('users').get();
        if (!usersSnap.empty) {
          const fbUsers = [];
          usersSnap.forEach(doc => fbUsers.push(doc.data()));
          if (fbUsers.length > 0) {
            this.saveUsers(fbUsers);
          }
        } else {
          // Seed initial users into Firestore
          const initialUsers = this.getUsers();
          for (const u of initialUsers) {
            await firebaseDb.collection('users').doc(u.id).set(u);
          }
          console.log("Seeded initial users into Firestore.");
        }

        // 2. Sync or Seed Practices
        const practicesSnap = await firebaseDb.collection('practices').get();
        if (!practicesSnap.empty) {
          const fbPractices = {};
          practicesSnap.forEach(doc => {
            fbPractices[doc.id] = doc.data();
          });
          localStorage.setItem(this.STORAGE_KEYS.PRACTICES, JSON.stringify(fbPractices));
        } else {
          // Seed initial practices into Firestore
          const initialPractices = this.getPractices();
          for (const dateStr in initialPractices) {
            await firebaseDb.collection('practices').doc(dateStr).set(initialPractices[dateStr]);
          }
          console.log("Seeded initial practices into Firestore.");
        }

        // 3. Sync or Seed Logs
        const logsSnap = await firebaseDb.collection('logs').get();
        if (!logsSnap.empty) {
          const fbLogs = [];
          logsSnap.forEach(doc => fbLogs.push(doc.data()));
          localStorage.setItem(this.STORAGE_KEYS.LOGS, JSON.stringify(fbLogs));
        } else {
          // Seed initial logs into Firestore
          const initialLogs = this.getLogs();
          for (const log of initialLogs) {
            await firebaseDb.collection('logs').doc(log.id).set(log);
          }
          console.log("Seeded initial logs into Firestore.");
        }

        // Setup real-time Firestore listeners
        this.setupRealtimeListeners();
      } catch (err) {
        console.warn("Firestore sync error:", err);
      }
    }
  }

  setupRealtimeListeners() {
    if (this._listenersAttached || typeof firebaseDb === 'undefined' || !firebaseDb) return;
    this._listenersAttached = true;

    firebaseDb.collection('users').onSnapshot(snapshot => {
      const fbUsers = [];
      if (snapshot && !snapshot.empty) {
        snapshot.forEach(doc => fbUsers.push(doc.data()));
      }
      this.saveUsers(fbUsers);
      if (typeof window.refreshCurrentView === 'function') {
        window.refreshCurrentView();
      }
    }, err => console.warn("Firestore users listener warning:", err));

    firebaseDb.collection('practices').onSnapshot(snapshot => {
      const fbPractices = {};
      if (snapshot && !snapshot.empty) {
        snapshot.forEach(doc => {
          fbPractices[doc.id] = doc.data();
        });
      }
      localStorage.setItem(this.STORAGE_KEYS.PRACTICES, JSON.stringify(fbPractices));
      if (typeof window.refreshCurrentView === 'function') {
        window.refreshCurrentView();
      }
    }, err => console.warn("Firestore practices listener warning:", err));

    firebaseDb.collection('logs').onSnapshot(snapshot => {
      const fbLogs = [];
      if (snapshot && !snapshot.empty) {
        snapshot.forEach(doc => fbLogs.push(doc.data()));
      }
      localStorage.setItem(this.STORAGE_KEYS.LOGS, JSON.stringify(fbLogs));
      if (typeof window.refreshCurrentView === 'function') {
        window.refreshCurrentView();
      }
    }, err => console.warn("Firestore logs listener warning:", err));
  }

  async resetAndSeedFirestore() {
    if (typeof firebaseDb !== 'undefined' && firebaseDb) {
      console.log("Resetting Firestore collections and seeding fresh data...");
      try {
        const usersSnap = await firebaseDb.collection('users').get();
        for (const doc of usersSnap.docs) {
          await firebaseDb.collection('users').doc(doc.id).delete();
        }
        for (const user of INITIAL_STUDENTS) {
          await firebaseDb.collection('users').doc(user.id).set(user);
        }

        const practicesSnap = await firebaseDb.collection('practices').get();
        for (const doc of practicesSnap.docs) {
          await firebaseDb.collection('practices').doc(doc.id).delete();
        }
        for (const dateStr in INITIAL_PRACTICES) {
          await firebaseDb.collection('practices').doc(dateStr).set(INITIAL_PRACTICES[dateStr]);
        }

        const logsSnap = await firebaseDb.collection('logs').get();
        for (const doc of logsSnap.docs) {
          await firebaseDb.collection('logs').doc(doc.id).delete();
        }
        for (const log of INITIAL_LOGS) {
          await firebaseDb.collection('logs').doc(log.id).set(log);
        }

        this.saveUsers(INITIAL_STUDENTS);
        localStorage.setItem(this.STORAGE_KEYS.PRACTICES, JSON.stringify(INITIAL_PRACTICES));
        localStorage.setItem(this.STORAGE_KEYS.LOGS, JSON.stringify(INITIAL_LOGS));

        console.log("Firestore reset & seeded successfully!");
        return true;
      } catch (err) {
        console.error("Firestore reset error:", err);
        throw err;
      }
    }
  }

  // --- Auth & User Methods ---
  getUsers() {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEYS.STUDENTS)) || [];
  }

  saveUsers(users) {
    localStorage.setItem(this.STORAGE_KEYS.STUDENTS, JSON.stringify(users));
  }

  async getUsersAsync() {
    if (typeof firebaseDb !== 'undefined' && firebaseDb) {
      try {
        const usersSnap = await firebaseDb.collection('users').get();
        if (!usersSnap.empty) {
          const fbUsers = [];
          usersSnap.forEach(doc => fbUsers.push(doc.data()));
          this.saveUsers(fbUsers);
          return fbUsers;
        }
      } catch (err) {
        console.warn("Firestore getUsersAsync error:", err);
      }
    }
    return this.getUsers();
  }

  async authenticateAsync(emailOrUsername, password) {
    if (typeof firebaseDb !== 'undefined' && firebaseDb) {
      try {
        const usersSnap = await firebaseDb.collection('users').get();
        if (!usersSnap.empty) {
          const fbUsers = [];
          usersSnap.forEach(doc => fbUsers.push(doc.data()));
          this.saveUsers(fbUsers);
        }
      } catch (err) {
        console.warn("Firestore pre-auth fetch error:", err);
      }
    }
    return this.authenticateLocal(emailOrUsername, password);
  }

  authenticateLocal(emailOrUsername, password) {
    const users = this.getUsers();
    const cleanInput = emailOrUsername.trim().toLowerCase();
    const user = users.find(u => 
      (u.email.toLowerCase() === cleanInput || u.email.toLowerCase().split('@')[0] === cleanInput) && 
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
    if (typeof firebaseAuth !== 'undefined' && firebaseAuth) {
      firebaseAuth.signOut().catch(() => {});
    }
    localStorage.removeItem(this.STORAGE_KEYS.CURRENT_USER);
  }

  addStudent(name, emailOrUsername, password, role = "student") {
    const users = this.getUsers();
    const cleanInput = emailOrUsername.trim().toLowerCase();
    if (!cleanInput) {
      throw new Error("Username or email is required.");
    }
    if (users.some(u => u.email.toLowerCase() === cleanInput || u.email.toLowerCase().split('@')[0] === cleanInput)) {
      throw new Error("An account with this username or email address already exists.");
    }

    let email = cleanInput;
    if (!email.includes('@')) {
      email = `${cleanInput.replace(/[^a-z0-9]/g, '')}@englishlevel1.com`;
    }

    const newStudent = {
      id: "std-" + Date.now(),
      name: name.trim(),
      email: email,
      username: cleanInput.split('@')[0],
      password: password,
      role: role,
      status: "active",
      createdAt: getTodayDateString()
    };
    users.push(newStudent);
    this.saveUsers(users);

    // Sync to Firebase Firestore
    if (typeof firebaseDb !== 'undefined' && firebaseDb) {
      firebaseDb.collection('users').doc(newStudent.id).set(newStudent)
        .then(() => console.log("User synced to Firebase Firestore:", newStudent.id))
        .catch(err => console.error("Firebase Firestore user creation error:", err));
    }

    return newStudent;
  }

  async registerStudentAndLogin(name, emailOrUsername, password) {
    const newStudent = this.addStudent(name, emailOrUsername, password);
    this.setCurrentUser(newStudent);
    return newStudent;
  }

  updateStudent(studentId, updatedData) {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === studentId);
    if (index !== -1) {
      users[index] = { ...users[index], ...updatedData };
      this.saveUsers(users);

      if (typeof firebaseDb !== 'undefined' && firebaseDb) {
        firebaseDb.collection('users').doc(studentId).update(updatedData)
          .catch(err => console.error("Firebase update user error:", err));
      }

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

      if (typeof firebaseDb !== 'undefined' && firebaseDb) {
        firebaseDb.collection('users').doc(studentId).update({ status: user.status })
          .catch(err => console.error("Firebase toggle user status error:", err));
      }

      return user;
    }
    throw new Error("Student not found.");
  }

  deleteStudent(studentId) {
    let users = this.getUsers();
    users = users.filter(u => u.id !== studentId);
    this.saveUsers(users);

    if (typeof firebaseDb !== 'undefined' && firebaseDb) {
      firebaseDb.collection('users').doc(studentId).delete()
        .catch(err => console.error("Firebase delete user error:", err));
    }
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

    // Sync to Firebase Firestore
    if (typeof firebaseDb !== 'undefined' && firebaseDb) {
      firebaseDb.collection('practices').doc(dateStr).set(practices[dateStr])
        .then(() => console.log("Practice synced to Firebase Firestore:", dateStr))
        .catch(err => console.error("Firebase practice sync error:", err));
    }

    return practices[dateStr];
  }

  deletePractice(dateStr) {
    const practices = this.getPractices();
    delete practices[dateStr];
    localStorage.setItem(this.STORAGE_KEYS.PRACTICES, JSON.stringify(practices));

    if (typeof firebaseDb !== 'undefined' && firebaseDb) {
      firebaseDb.collection('practices').doc(dateStr).delete()
        .catch(err => console.error("Firebase delete practice error:", err));
    }
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

    // Sync to Firebase Firestore
    if (typeof firebaseDb !== 'undefined' && firebaseDb) {
      firebaseDb.collection('logs').doc(log.id).set(log)
        .then(() => console.log("Log synced to Firebase Firestore:", log.id))
        .catch(err => console.error("Firebase log sync error:", err));
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

// Global instance handle
const db = new StorageService();
window.resetAndSeedFirestore = () => db.resetAndSeedFirestore();
