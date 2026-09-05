/**
 * Main Application Controller (app.js)
 * Advanced Spoken English Level 1 Tracking System
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Element References ---
  const landingView = document.getElementById('landingView');
  const authView = document.getElementById('authView');
  const studentDashboardView = document.getElementById('studentDashboardView');
  const adminDashboardView = document.getElementById('adminDashboardView');
  
  const brandLogo = document.getElementById('brandLogo');
  const unauthHeaderSection = document.getElementById('unauthHeaderSection');
  const userHeaderSection = document.getElementById('userHeaderSection');
  const headerUserName = document.getElementById('headerUserName');
  const headerRoleBadge = document.getElementById('headerRoleBadge');
  const btnNavLogin = document.getElementById('btnNavLogin');
  const btnLogout = document.getElementById('btnLogout');
  const mobileNav = document.getElementById('mobileNav');

  // Landing Page Buttons
  const btnLandingStudent = document.getElementById('btnLandingStudent');
  const btnLandingAdmin = document.getElementById('btnLandingAdmin');

  // Auth Form Elements
  const loginForm = document.getElementById('loginForm');
  const loginEmail = document.getElementById('loginEmail');
  const loginPassword = document.getElementById('loginPassword');
  const btnRoleStudent = document.getElementById('btnRoleStudent');
  const btnRoleAdmin = document.getElementById('btnRoleAdmin');
  const authErrorMessage = document.getElementById('authErrorMessage');
  let selectedLoginRole = 'student';

  // Student Dashboard Elements
  const todayDateLabel = document.getElementById('todayDateLabel');
  const studentStreakCount = document.getElementById('studentStreakCount');
  const studentTotalSpeaking = document.getElementById('studentTotalSpeaking');
  const studentTotalListening = document.getElementById('studentTotalListening');
  
  const speakingBadge = document.getElementById('speakingBadge');
  const speakingTopicText = document.getElementById('speakingTopicText');
  const chatgptPromptText = document.getElementById('chatgptPromptText');
  const btnCopyPrompt = document.getElementById('btnCopyPrompt');
  const btnToggleSpeaking = document.getElementById('btnToggleSpeaking');

  const listeningBadge = document.getElementById('listeningBadge');
  const listeningTitleText = document.getElementById('listeningTitleText');
  const listeningInstructionText = document.getElementById('listeningInstructionText');
  const listeningIframe = document.getElementById('listeningIframe');
  const listeningDirectLink = document.getElementById('listeningDirectLink');
  const btnToggleListening = document.getElementById('btnToggleListening');
  const weeklyHistoryTableBody = document.getElementById('weeklyHistoryTableBody');

  // Admin Dashboard Elements
  const adminStatTotalStudents = document.getElementById('adminStatTotalStudents');
  const adminStatSpeakingToday = document.getElementById('adminStatSpeakingToday');
  const adminStatListeningToday = document.getElementById('adminStatListeningToday');
  const adminStatInactiveToday = document.getElementById('adminStatInactiveToday');

  const tabAdminStudents = document.getElementById('tabAdminStudents');
  const tabAdminContent = document.getElementById('tabAdminContent');
  const adminStudentMonitorSection = document.getElementById('adminStudentMonitorSection');
  const adminContentSection = document.getElementById('adminContentSection');
  const adminStudentTableBody = document.getElementById('adminStudentTableBody');
  const filterBtns = document.querySelectorAll('.filter-bar .filter-btn');

  // Daily Content Form
  const dailyContentForm = document.getElementById('dailyContentForm');
  const contentDate = document.getElementById('contentDate');
  const speakingTopicInput = document.getElementById('speakingTopicInput');
  const chatgptPromptInput = document.getElementById('chatgptPromptInput');
  const listeningTitleInput = document.getElementById('listeningTitleInput');
  const listeningInstructionInput = document.getElementById('listeningInstructionInput');
  const listeningUrlInput = document.getElementById('listeningUrlInput');

  // Student Account Modal
  const studentModal = document.getElementById('studentModal');
  const studentModalTitle = document.getElementById('studentModalTitle');
  const btnOpenAddStudentModal = document.getElementById('btnOpenAddStudentModal');
  const btnCloseStudentModal = document.getElementById('btnCloseStudentModal');
  const studentAccountForm = document.getElementById('studentAccountForm');
  const modalStudentId = document.getElementById('modalStudentId');
  const modalStudentName = document.getElementById('modalStudentName');
  const modalStudentEmail = document.getElementById('modalStudentEmail');
  const modalStudentPassword = document.getElementById('modalStudentPassword');
  const modalErrorMessage = document.getElementById('modalErrorMessage');

  // State Variables
  let currentUser = db.getCurrentUser();
  let currentAdminFilter = 'all';

  // --- Initial Setup ---
  initApp();

  function initApp() {
    setupEventListeners();
    if (currentUser) {
      showAuthenticatedView(currentUser);
    } else {
      showLandingView();
    }
  }

  // --- View Routing ---
  function showLandingView() {
    landingView.style.display = 'block';
    authView.style.display = 'none';
    studentDashboardView.style.display = 'none';
    adminDashboardView.style.display = 'none';
    unauthHeaderSection.style.display = 'block';
    userHeaderSection.style.display = 'none';
    mobileNav.style.display = 'none';
  }

  function showAuthView() {
    landingView.style.display = 'none';
    authView.style.display = 'block';
    studentDashboardView.style.display = 'none';
    adminDashboardView.style.display = 'none';
    unauthHeaderSection.style.display = 'block';
    userHeaderSection.style.display = 'none';
    mobileNav.style.display = 'none';

    // Clear inputs so fields start completely empty
    loginEmail.value = '';
    loginPassword.value = '';
    authErrorMessage.style.display = 'none';
    loginEmail.focus();
  }

  function showAuthenticatedView(user) {
    landingView.style.display = 'none';
    authView.style.display = 'none';
    unauthHeaderSection.style.display = 'none';
    userHeaderSection.style.display = 'flex';

    headerUserName.textContent = user.name;
    headerRoleBadge.textContent = user.role.toUpperCase();
    headerRoleBadge.className = `role-badge ${user.role}`;

    if (user.role === 'admin') {
      studentDashboardView.style.display = 'none';
      adminDashboardView.style.display = 'block';
      mobileNav.style.display = 'none';
      renderAdminDashboard();
    } else {
      studentDashboardView.style.display = 'block';
      adminDashboardView.style.display = 'none';
      if (window.innerWidth <= 768) mobileNav.style.display = 'flex';
      renderStudentDashboard();
    }
  }

  // --- Event Listeners Setup ---
  function setupEventListeners() {
    brandLogo.addEventListener('click', () => {
      if (currentUser) {
        showAuthenticatedView(currentUser);
      } else {
        showLandingView();
      }
    });

    btnNavLogin.addEventListener('click', () => {
      showAuthView('student');
    });

    btnLandingStudent.addEventListener('click', () => {
      showAuthView('student');
    });

    btnLandingAdmin.addEventListener('click', () => {
      showAuthView('admin');
    });

    if (btnRoleStudent) {
      btnRoleStudent.addEventListener('click', () => {
        selectedLoginRole = 'student';
        btnRoleStudent.classList.add('active');
        if (btnRoleAdmin) btnRoleAdmin.classList.remove('active');
        loginEmail.placeholder = "Enter your student username";
      });
    }

    if (btnRoleAdmin) {
      btnRoleAdmin.addEventListener('click', () => {
        selectedLoginRole = 'admin';
        btnRoleAdmin.classList.add('active');
        if (btnRoleStudent) btnRoleStudent.classList.remove('active');
        loginEmail.placeholder = "Enter your username";
      });
    }

    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      authErrorMessage.style.display = 'none';
      try {
        const user = await db.authenticateAsync(loginEmail.value, loginPassword.value);
        currentUser = user;
        showToast(`Welcome back, ${user.name}!`, 'success');
        showAuthenticatedView(user);
      } catch (err) {
        authErrorMessage.textContent = err.message;
        authErrorMessage.style.display = 'block';
      }
    });

    btnLogout.addEventListener('click', () => {
      db.logout();
      currentUser = null;
      showToast('Logged out successfully.', 'info');
      showLandingView();
    });

    btnCopyPrompt.addEventListener('click', () => {
      const promptText = chatgptPromptText.textContent.trim();
      navigator.clipboard.writeText(promptText).then(() => {
        showToast('ChatGPT prompt copied to clipboard!', 'success');
      }).catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = promptText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('ChatGPT prompt copied to clipboard!', 'success');
      });
    });

    btnToggleSpeaking.addEventListener('click', () => {
      if (!currentUser) return;
      const todayStr = getTodayDateString();
      const log = db.togglePracticeCompletion(currentUser.id, todayStr, 'speaking');
      renderStudentDashboard();
      showToast(
        log.speakingCompleted 
          ? 'Great job! Speaking practice marked as completed.' 
          : 'Speaking practice status updated.', 
        'success'
      );
    });

    btnToggleListening.addEventListener('click', () => {
      if (!currentUser) return;
      const todayStr = getTodayDateString();
      const log = db.togglePracticeCompletion(currentUser.id, todayStr, 'listening');
      renderStudentDashboard();
      showToast(
        log.listeningCompleted 
          ? 'Awesome! Listening practice marked as completed.' 
          : 'Listening practice status updated.', 
        'success'
      );
    });

    tabAdminStudents.addEventListener('click', () => {
      tabAdminStudents.classList.add('active');
      tabAdminContent.classList.remove('active');
      adminStudentMonitorSection.style.display = 'block';
      adminContentSection.style.display = 'none';
    });

    tabAdminContent.addEventListener('click', () => {
      tabAdminContent.classList.add('active');
      tabAdminStudents.classList.remove('active');
      adminContentSection.style.display = 'block';
      adminStudentMonitorSection.style.display = 'none';
      contentDate.value = getTodayDateString();
      loadContentFormForDate(getTodayDateString());
    });

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentAdminFilter = btn.dataset.filter;
        renderAdminStudentTable();
      });
    });

    dailyContentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const practiceData = {
        date: contentDate.value,
        speakingTopic: speakingTopicInput.value.trim(),
        chatgptPrompt: chatgptPromptInput.value.trim(),
        listeningTitle: listeningTitleInput.value.trim(),
        listeningInstruction: listeningInstructionInput.value.trim(),
        listeningUrl: formatYoutubeEmbedUrl(listeningUrlInput.value.trim())
      };

      db.savePractice(practiceData);
      showToast(`Daily practice published for ${contentDate.value}!`, 'success');
    });

    contentDate.addEventListener('change', () => {
      loadContentFormForDate(contentDate.value);
    });

    btnOpenAddStudentModal.addEventListener('click', () => {
      openStudentModal();
    });

    btnCloseStudentModal.addEventListener('click', () => {
      closeStudentModal();
    });

    studentAccountForm.addEventListener('submit', (e) => {
      e.preventDefault();
      modalErrorMessage.style.display = 'none';
      try {
        const id = modalStudentId.value;
        if (id) {
          db.updateStudent(id, {
            name: modalStudentName.value.trim(),
            email: modalStudentEmail.value.trim(),
            password: modalStudentPassword.value
          });
          showToast('Student information updated.', 'success');
        } else {
          db.addStudent(
            modalStudentName.value.trim(),
            modalStudentEmail.value.trim(),
            modalStudentPassword.value
          );
          showToast('New student added successfully.', 'success');
        }
        closeStudentModal();
        renderAdminDashboard();
      } catch (err) {
        modalErrorMessage.textContent = err.message;
        modalErrorMessage.style.display = 'block';
      }
    });
  }

  // --- Student Dashboard Render Function ---
  function renderStudentDashboard() {
    if (!currentUser) return;
    const todayStr = getTodayDateString();

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    todayDateLabel.textContent = new Date().toLocaleDateString('en-US', options);

    const stats = db.getStudentStats(currentUser.id);
    studentStreakCount.textContent = stats.currentStreak;
    studentTotalSpeaking.textContent = stats.speakingDays;
    studentTotalListening.textContent = stats.listeningDays;

    let practice = db.getPracticeByDate(todayStr);
    if (!practice) {
      practice = {
        speakingTopic: "Practice speaking in English for 20 minutes about your daily routine and personal hobbies.",
        chatgptPrompt: `"I am practicing spoken English. Please have a conversation with me about my daily routine and hobbies. Ask me clear questions, help me expand my vocabulary, and correct my errors."`,
        listeningTitle: "Daily English Conversation & Listening Practice",
        listeningInstruction: "Watch the video clip and note key vocabulary words.",
        listeningUrl: "https://www.youtube.com/embed/5qap5aO4i9A"
      };
    }

    speakingTopicText.textContent = practice.speakingTopic;
    chatgptPromptText.textContent = practice.chatgptPrompt;

    listeningTitleText.textContent = practice.listeningTitle;
    listeningInstructionText.textContent = practice.listeningInstruction || "Watch the resource carefully to practice listening comprehension.";
    
    const embedUrl = formatYoutubeEmbedUrl(practice.listeningUrl);
    listeningIframe.src = embedUrl;
    listeningDirectLink.href = embedUrl.replace('/embed/', '/watch?v=');

    const todayLog = db.getStudentLogForDate(currentUser.id, todayStr);
    const isSpeakingDone = todayLog ? todayLog.speakingCompleted : false;
    const isListeningDone = todayLog ? todayLog.listeningCompleted : false;

    if (isSpeakingDone) {
      speakingBadge.className = "status-badge completed";
      speakingBadge.innerHTML = `<iconify-icon icon="lucide:check-circle-2"></iconify-icon> Completed`;
      btnToggleSpeaking.className = "btn-complete is-done";
      btnToggleSpeaking.innerHTML = `<iconify-icon icon="lucide:check-circle-2" style="font-size: 18px;"></iconify-icon> Speaking Completed! (Click to undo)`;
    } else {
      speakingBadge.className = "status-badge pending";
      speakingBadge.innerHTML = `<iconify-icon icon="lucide:clock"></iconify-icon> Pending`;
      btnToggleSpeaking.className = "btn-complete btn-complete-speaking";
      btnToggleSpeaking.innerHTML = `<iconify-icon icon="lucide:check-circle-2" style="font-size: 18px;"></iconify-icon> Mark Speaking Practice as Completed`;
    }

    if (isListeningDone) {
      listeningBadge.className = "status-badge completed";
      listeningBadge.innerHTML = `<iconify-icon icon="lucide:check-circle-2"></iconify-icon> Completed`;
      btnToggleListening.className = "btn-complete is-done";
      btnToggleListening.innerHTML = `<iconify-icon icon="lucide:check-circle-2" style="font-size: 18px;"></iconify-icon> Listening Completed! (Click to undo)`;
    } else {
      listeningBadge.className = "status-badge pending";
      listeningBadge.innerHTML = `<iconify-icon icon="lucide:clock"></iconify-icon> Pending`;
      btnToggleListening.className = "btn-complete btn-complete-listening";
      btnToggleListening.innerHTML = `<iconify-icon icon="lucide:check-circle-2" style="font-size: 18px;"></iconify-icon> Mark Listening Practice as Completed`;
    }

    renderWeeklyHistoryTable();
  }

  function renderWeeklyHistoryTable() {
    weeklyHistoryTableBody.innerHTML = '';
    const logs = db.getStudentLogs(currentUser.id);
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

      const log = logs.find(l => l.date === dateStr);
      const spkDone = log ? log.speakingCompleted : false;
      const lisDone = log ? log.listeningCompleted : false;

      let dayStatusBadge = `<span class="status-badge pending">Incomplete</span>`;
      if (spkDone && lisDone) {
        dayStatusBadge = `<span class="status-badge completed"><iconify-icon icon="lucide:star"></iconify-icon> Fully Complete</span>`;
      } else if (spkDone || lisDone) {
        dayStatusBadge = `<span class="status-badge pending"><iconify-icon icon="lucide:pie-chart"></iconify-icon> Partial (1/2)</span>`;
      }

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight: 600;">${dayName} ${i === 0 ? '<span style="color: var(--accent-primary); font-size: 11px;">(Today)</span>' : ''}</td>
        <td>
          ${spkDone 
            ? '<span style="color: var(--accent-success); font-weight: 600;"><iconify-icon icon="lucide:check"></iconify-icon> Completed</span>' 
            : '<span style="color: var(--text-subtle);"><iconify-icon icon="lucide:minus"></iconify-icon> Not Completed</span>'}
        </td>
        <td>
          ${lisDone 
            ? '<span style="color: var(--accent-listening); font-weight: 600;"><iconify-icon icon="lucide:check"></iconify-icon> Completed</span>' 
            : '<span style="color: var(--text-subtle);"><iconify-icon icon="lucide:minus"></iconify-icon> Not Completed</span>'}
        </td>
        <td>${dayStatusBadge}</td>
      `;
      weeklyHistoryTableBody.appendChild(tr);
    }
  }

  // --- Admin Dashboard Render Functions ---
  function renderAdminDashboard() {
    const overview = db.getAdminOverviewStats();
    adminStatTotalStudents.textContent = overview.totalStudents;
    adminStatSpeakingToday.textContent = overview.speakingCompletedToday;
    adminStatListeningToday.textContent = overview.listeningCompletedToday;
    adminStatInactiveToday.textContent = overview.inactiveToday;

    renderAdminStudentTable();
  }

  function renderAdminStudentTable() {
    adminStudentTableBody.innerHTML = '';
    const students = db.getUsers().filter(u => u.role === 'student');
    const todayStr = getTodayDateString();

    const filteredStudents = students.filter(student => {
      const log = db.getStudentLogForDate(student.id, todayStr);
      const spkDone = log ? log.speakingCompleted : false;
      const lisDone = log ? log.listeningCompleted : false;

      if (currentAdminFilter === 'speaking-done') return spkDone;
      if (currentAdminFilter === 'listening-done') return lisDone;
      if (currentAdminFilter === 'inactive') return (!spkDone && !lisDone);
      return true;
    });

    if (filteredStudents.length === 0) {
      adminStudentTableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 24px;">
            No students match the selected filter.
          </td>
        </tr>
      `;
      return;
    }

    filteredStudents.forEach(student => {
      const log = db.getStudentLogForDate(student.id, todayStr);
      const spkDone = log ? log.speakingCompleted : false;
      const lisDone = log ? log.listeningCompleted : false;
      const stats = db.getStudentStats(student.id);

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div style="font-weight: 600; color: var(--text-main);">${escapeHtml(student.name)}</div>
          <div style="font-size: 12px; color: var(--text-muted);">${escapeHtml(student.email)}</div>
        </td>
        <td>
          ${spkDone 
            ? '<span class="status-badge completed"><iconify-icon icon="lucide:check"></iconify-icon> Completed</span>' 
            : '<span class="status-badge pending"><iconify-icon icon="lucide:clock"></iconify-icon> Pending</span>'}
        </td>
        <td>
          ${lisDone 
            ? '<span class="status-badge completed"><iconify-icon icon="lucide:check"></iconify-icon> Completed</span>' 
            : '<span class="status-badge pending"><iconify-icon icon="lucide:clock"></iconify-icon> Pending</span>'}
        </td>
        <td>
          <span style="font-weight: 700; color: var(--accent-warning); display: flex; align-items: center; gap: 4px;">
            <iconify-icon icon="ph:fire-fill" style="font-size: 16px;"></iconify-icon> ${stats.currentStreak} days
          </span>
        </td>
        <td>
          <span class="role-badge ${student.status === 'active' ? 'student' : 'admin'}" style="text-transform: capitalize;">
            ${student.status}
          </span>
        </td>
        <td>
          <div style="display: flex; gap: 6px;">
            <button class="btn-table-action" onclick="editStudentModal('${student.id}')" title="Edit Student">
              <iconify-icon icon="lucide:file-edit"></iconify-icon> Edit
            </button>
            <button class="btn-table-action" onclick="toggleStudentStatus('${student.id}')" title="Toggle Status">
              <iconify-icon icon="lucide:power"></iconify-icon> ${student.status === 'active' ? 'Deactivate' : 'Activate'}
            </button>
            <button class="btn-table-action btn-table-danger" onclick="deleteStudentAccount('${student.id}')" title="Delete Student">
              <iconify-icon icon="lucide:trash-2"></iconify-icon>
            </button>
          </div>
        </td>
      `;
      adminStudentTableBody.appendChild(tr);
    });
  }

  function loadContentFormForDate(dateStr) {
    const practice = db.getPracticeByDate(dateStr);
    if (practice) {
      speakingTopicInput.value = practice.speakingTopic || '';
      chatgptPromptInput.value = practice.chatgptPrompt || '';
      listeningTitleInput.value = practice.listeningTitle || '';
      listeningInstructionInput.value = practice.listeningInstruction || '';
      listeningUrlInput.value = practice.listeningUrl || '';
    } else {
      speakingTopicInput.value = '';
      chatgptPromptInput.value = '';
      listeningTitleInput.value = '';
      listeningInstructionInput.value = '';
      listeningUrlInput.value = '';
    }
  }

  // --- Student Account Modal Functions ---
  function openStudentModal(studentId = null) {
    studentModal.classList.add('open');
    modalErrorMessage.style.display = 'none';

    if (studentId) {
      studentModalTitle.textContent = "Edit Student Account";
      const users = db.getUsers();
      const student = users.find(u => u.id === studentId);
      if (student) {
        modalStudentId.value = student.id;
        modalStudentName.value = student.name;
        modalStudentEmail.value = student.email;
        modalStudentPassword.value = student.password;
      }
    } else {
      studentModalTitle.textContent = "Add New Student";
      modalStudentId.value = "";
      modalStudentName.value = "";
      modalStudentEmail.value = "";
      modalStudentPassword.value = "student123";
    }
  }

  function closeStudentModal() {
    studentModal.classList.remove('open');
  }

  // --- Global Window Helpers ---
  window.editStudentModal = function(id) {
    openStudentModal(id);
  };

  window.toggleStudentStatus = function(id) {
    try {
      const student = db.toggleStudentStatus(id);
      showToast(`Student ${student.name} is now ${student.status}.`, 'info');
      renderAdminDashboard();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  window.deleteStudentAccount = function(id) {
    if (confirm("Are you sure you want to delete this student account? This action cannot be undone.")) {
      db.deleteStudent(id);
      showToast('Student account deleted.', 'info');
      renderAdminDashboard();
    }
  };

  window.fillDemoCredentials = function(email, password, role) {
    loginEmail.value = email;
    loginPassword.value = password;
    if (role === 'admin') {
      if (btnRoleAdmin) btnRoleAdmin.click();
    } else {
      if (btnRoleStudent) btnRoleStudent.click();
    }
  };

  window.quickLoginDemo = function(email, password, role) {
    showAuthView(role);
    fillDemoCredentials(email, password, role);
    loginForm.dispatchEvent(new Event('submit'));
  };

  // --- Utility Functions ---
  function formatYoutubeEmbedUrl(url) {
    if (!url) return "https://www.youtube.com/embed/5qap5aO4i9A";
    if (url.includes('/embed/')) return url;
    
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11)
      ? `https://www.youtube.com/embed/${match[2]}`
      : url;
  }

  function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    let iconName = 'lucide:info';
    if (type === 'success') iconName = 'lucide:check-circle-2';
    if (type === 'error') iconName = 'lucide:alert-triangle';

    toast.innerHTML = `<iconify-icon icon="${iconName}" style="font-size: 18px;"></iconify-icon> <span>${escapeHtml(message)}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
});
