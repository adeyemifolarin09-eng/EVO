// App State
let currentUser = null;
let users = JSON.parse(localStorage.getItem('evo_users')) || [];
let chats = JSON.parse(localStorage.getItem('evo_chats')) || [];
let messages = JSON.parse(localStorage.getItem('evo_messages')) || [];
let groups = JSON.parse(localStorage.getItem('evo_groups')) || [];
let calls = JSON.parse(localStorage.getItem('evo_calls')) || [];
let statuses = JSON.parse(localStorage.getItem('evo_statuses')) || [];
let currentChatPartner = null;
let currentStatusIndex = 0;
let userStatuses = [];
let callTimer = null;
let callSeconds = 0;
let isMuted = false;
let isSpeakerOn = false;
let selectedStatusColor = '#ff6b6b';
let emojis = {
    smileys: ['😊', '😂', '🥰', '😍', '😒', '😎', '😢', '😡', '👍', '👎', '👏', '🙏'],
    people: ['👋', '🖐️', '✋', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈'],
    animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐸', '🐒', '🐔'],
    food: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑'],
    activities: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎯', '🏏', '🏑']
};

// Initialize with demo data
function initializeDemoData() {
    if (users.length === 0) {
        // Create demo users
        const demoUsers = [
            {
                id: 'demo1',
                fullName: 'John Doe',
                email: 'john@example.com',
                phone: '+1234567890',
                password: 'password123',
                about: 'Living life to the fullest!',
                profilePic: 'https://randomuser.me/api/portraits/men/1.jpg',
                status: 'online',
                lastSeen: new Date().toISOString(),
                friends: ['demo2', 'demo3']
            },
            {
                id: 'demo2',
                fullName: 'Jane Smith',
                email: 'jane@example.com',
                phone: '+1234567891',
                password: 'password123',
                about: 'Travel enthusiast ✈️',
                profilePic: 'https://randomuser.me/api/portraits/women/1.jpg',
                status: 'online',
                lastSeen: new Date().toISOString(),
                friends: ['demo1', 'demo3']
            },
            {
                id: 'demo3',
                fullName: 'Mike Johnson',
                email: 'mike@example.com',
                phone: '+1234567892',
                password: 'password123',
                about: 'Music lover 🎵',
                profilePic: 'https://randomuser.me/api/portraits/men/2.jpg',
                status: 'offline',
                lastSeen: new Date().toISOString(),
                friends: ['demo1', 'demo2']
            }
        ];
        
        users.push(...demoUsers);
        saveUsers();

        // Create demo messages
        const demoMessages = [
            {
                id: generateId(),
                senderId: 'demo1',
                receiverId: 'demo2',
                content: 'Hey Jane! How are you?',
                timestamp: new Date(Date.now() - 3600000).toISOString(),
                read: true,
                status: 'read'
            },
            {
                id: generateId(),
                senderId: 'demo2',
                receiverId: 'demo1',
                content: 'Hi John! I\'m good, thanks! How about you?',
                timestamp: new Date(Date.now() - 3500000).toISOString(),
                read: true,
                status: 'read'
            },
            {
                id: generateId(),
                senderId: 'demo1',
                receiverId: 'demo2',
                content: 'Doing great! Want to grab coffee later?',
                timestamp: new Date(Date.now() - 3400000).toISOString(),
                read: false,
                status: 'sent'
            }
        ];
        
        messages.push(...demoMessages);
        saveMessages();

        // Create demo groups
        const demoGroups = [
            {
                id: generateId(),
                name: 'Friends Forever',
                pic: 'https://via.placeholder.com/100',
                createdBy: 'demo1',
                members: ['demo1', 'demo2', 'demo3'],
                createdAt: new Date().toISOString()
            }
        ];
        
        groups.push(...demoGroups);
        saveGroups();

        // Create demo statuses
        const demoStatuses = [
            {
                id: generateId(),
                userId: 'demo1',
                content: 'Enjoying the weekend! 🌞',
                type: 'text',
                color: '#ff6b6b',
                timestamp: new Date(Date.now() - 7200000).toISOString(),
                views: ['demo2']
            },
            {
                id: generateId(),
                userId: 'demo2',
                content: 'At the beach 🏖️',
                type: 'text',
                color: '#4ecdc4',
                timestamp: new Date(Date.now() - 3600000).toISOString(),
                views: ['demo1', 'demo3']
            }
        ];
        
        statuses.push(...demoStatuses);
        saveStatuses();
    }
}

// Call initialization
initializeDemoData();

// Utility Functions
function saveUsers() {
    localStorage.setItem('evo_users', JSON.stringify(users));
}

function saveChats() {
    localStorage.setItem('evo_chats', JSON.stringify(chats));
}

function saveMessages() {
    localStorage.setItem('evo_messages', JSON.stringify(messages));
}

function saveGroups() {
    localStorage.setItem('evo_groups', JSON.stringify(groups));
}

function saveCalls() {
    localStorage.setItem('evo_calls', JSON.stringify(calls));
}

function saveStatuses() {
    localStorage.setItem('evo_statuses', JSON.stringify(statuses));
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 10px;
        background: ${type === 'success' ? '#4caf50' : '#f44336'};
        color: white;
        font-weight: 500;
        z-index: 9999;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
}

// Auth Functions
function showRegister() {
    document.getElementById('loginForm').classList.remove('active');
    document.getElementById('registerForm').classList.add('active');
    document.getElementById('forgotForm').classList.remove('active');
}

function showLogin() {
    document.getElementById('registerForm').classList.remove('active');
    document.getElementById('loginForm').classList.add('active');
    document.getElementById('forgotForm').classList.remove('active');
}

function showForgotPassword() {
    document.getElementById('loginForm').classList.remove('active');
    document.getElementById('registerForm').classList.remove('active');
    document.getElementById('forgotForm').classList.add('active');
}

function handleRegister(event) {
    event.preventDefault();
    
    const fullName = document.getElementById('regFullName').value;
    const email = document.getElementById('regEmail').value;
    const phone = document.getElementById('regPhone').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    const profilePicFile = document.getElementById('regProfilePic').files[0];
    
    // Validation
    if (password !== confirmPassword) {
        showAlert('Passwords do not match!', 'error');
        return;
    }
    
    if (users.find(u => u.email === email)) {
        showAlert('Email already registered!', 'error');
        return;
    }
    
    if (users.find(u => u.phone === phone)) {
        showAlert('Phone number already registered!', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        id: generateId(),
        fullName,
        email,
        phone,
        password,
        about: 'Hey there! I am using EVO',
        profilePic: profilePicFile ? URL.createObjectURL(profilePicFile) : 'https://via.placeholder.com/150',
        status: 'offline',
        lastSeen: new Date().toISOString(),
        friends: []
    };
    
    users.push(newUser);
    saveUsers();
    
    showAlert('Registration successful! Please login.', 'success');
    showLogin();
}

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        currentUser.status = 'online';
        currentUser.lastSeen = new Date().toISOString();
        saveUsers();
        
        // Hide splash screen
        setTimeout(() => {
            document.getElementById('splashScreen').style.display = 'none';
        }, 2000);
        
        document.getElementById('authContainer').style.display = 'none';
        document.getElementById('mainContainer').style.display = 'flex';
        
        updateUserProfile();
        loadChats();
        loadGroups();
        loadCalls();
        loadStatuses();
        
        showAlert(`Welcome back, ${currentUser.fullName}!`, 'success');
    } else {
        showAlert('Invalid email or password!', 'error');
    }
}

function handleForgotPassword(event) {
    event.preventDefault();
    const email = document.getElementById('forgotEmail').value;
    
    const user = users.find(u => u.email === email);
    if (user) {
        showAlert(`Password reset link sent to ${email}`, 'success');
    } else {
        showAlert('Email not found!', 'error');
    }
}

function logout() {
    if (currentUser) {
        currentUser.status = 'offline';
        currentUser.lastSeen = new Date().toISOString();
        saveUsers();
    }
    
    currentUser = null;
    document.getElementById('authContainer').style.display = 'flex';
    document.getElementById('mainContainer').style.display = 'none';
    closeModal('settingsModal');
}

// Profile Functions
function updateUserProfile() {
    document.getElementById('currentUserPic').src = currentUser.profilePic;
    document.getElementById('currentUserName').textContent = currentUser.fullName;
}

function showSettings() {
    // Load current settings
    document.getElementById('settingsFullName').value = currentUser.fullName;
    document.getElementById('settingsAbout').value = currentUser.about || '';
    document.getElementById('settingsPhone').value = currentUser.phone;
    document.getElementById('settingsEmail').value = currentUser.email;
    document.getElementById('settingsProfilePic').src = currentUser.profilePic;
    
    // Load privacy settings
    const privacy = currentUser.privacy || {
        lastSeen: 'everyone',
        profilePic: 'everyone',
        about: 'everyone',
        status: 'everyone',
        readReceipts: true
    };
    
    document.getElementById('privacyLastSeen').value = privacy.lastSeen;
    document.getElementById('privacyProfilePic').value = privacy.profilePic;
    document.getElementById('privacyAbout').value = privacy.about;
    document.getElementById('privacyStatus').value = privacy.status;
    document.getElementById('readReceipts').checked = privacy.readReceipts;
    
    // Load notification settings
    const notifications = currentUser.notifications || {
        messages: true,
        groups: true,
        calls: true,
        tone: 'default'
    };
    
    document.getElementById('messageNotifications').checked = notifications.messages;
    document.getElementById('groupNotifications').checked = notifications.groups;
    document.getElementById('callNotifications').checked = notifications.calls;
    document.getElementById('notificationTone').value = notifications.tone;
    
    // Load appearance settings
    const appearance = currentUser.appearance || {
        theme: 'light',
        wallpaper: 'default',
        fontSize: 'medium',
        enterSends: true
    };
    
    document.getElementById('themeSelect').value = appearance.theme;
    document.getElementById('fontSize').value = appearance.fontSize;
    document.getElementById('enterSends').checked = appearance.enterSends;
    
    document.getElementById('settingsModal').style.display = 'flex';
}

function triggerProfilePicUpload() {
    document.getElementById('profilePicInput').click();
}

function updateProfilePic(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('settingsProfilePic').src = e.target.result;
            currentUser.profilePic = e.target.result;
            updateUserProfile();
            saveUsers();
        };
        reader.readAsDataURL(file);
    }
}

function saveSettings() {
    // Update profile
    currentUser.fullName = document.getElementById('settingsFullName').value;
    currentUser.about = document.getElementById('settingsAbout').value;
    
    // Save privacy settings
    currentUser.privacy = {
        lastSeen: document.getElementById('privacyLastSeen').value,
        profilePic: document.getElementById('privacyProfilePic').value,
        about: document.getElementById('privacyAbout').value,
        status: document.getElementById('privacyStatus').value,
        readReceipts: document.getElementById('readReceipts').checked
    };
    
    // Save notification settings
    currentUser.notifications = {
        messages: document.getElementById('messageNotifications').checked,
        groups: document.getElementById('groupNotifications').checked,
        calls: document.getElementById('callNotifications').checked,
        tone: document.getElementById('notificationTone').value
    };
    
    // Save appearance settings
    currentUser.appearance = {
        theme: document.getElementById('themeSelect').value,
        wallpaper: currentUser.appearance?.wallpaper || 'default',
        fontSize: document.getElementById('fontSize').value,
        enterSends: document.getElementById('enterSends').checked
    };
    
    saveUsers();
    updateUserProfile();
    closeModal('settingsModal');
    showAlert('Settings saved successfully!', 'success');
}

function switchSettingsTab(tabName) {
    // Update tab styles
    document.querySelectorAll('.settings-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Hide all panes
    document.getElementById('profileSettings').classList.remove('active');
    document.getElementById('privacySettings').classList.remove('active');
    document.getElementById('notificationsSettings').classList.remove('active');
    document.getElementById('appearanceSettings').classList.remove('active');
    
    // Show selected pane
    document.getElementById(`${tabName}Settings`).classList.add('active');
}

// Theme Functions
function changeTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (currentUser) {
        if (!currentUser.appearance) currentUser.appearance = {};
        currentUser.appearance.theme = theme;
        saveUsers();
    }
}

function changeWallpaper(type) {
    if (currentUser) {
        if (!currentUser.appearance) currentUser.appearance = {};
        currentUser.appearance.wallpaper = type;
        saveUsers();
        
        // Apply wallpaper
        const messagesContainer = document.getElementById('messagesContainer');
        if (type === 'default') {
            messagesContainer.style.backgroundImage = 'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="%23e0e0e0" stroke-width="1"/></svg>\')';
        } else if (type === 'solid') {
            messagesContainer.style.backgroundImage = 'none';
            messagesContainer.style.backgroundColor = '#0b141a';
        } else if (type === 'gradient') {
            messagesContainer.style.backgroundImage = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }
    }
}

// Chat Functions
function loadChats() {
    const chatsList = document.getElementById('chatsList');
    
    // Get all users except current user
    const otherUsers = users.filter(u => u.id !== currentUser.id);
    
    // Sort by last message time
    const chatUsers = otherUsers.map(user => {
        const lastMessage = messages
            .filter(m => (m.senderId === currentUser.id && m.receiverId === user.id) ||
                        (m.senderId === user.id && m.receiverId === currentUser.id))
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
        
        return {
            ...user,
            lastMessage,
            unreadCount: messages.filter(m => m.senderId === user.id && m.receiverId === currentUser.id && !m.read).length
        };
    }).sort((a, b) => {
        if (!a.lastMessage) return 1;
        if (!b.lastMessage) return -1;
        return new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp);
    });
    
    if (chatUsers.length === 0) {
        chatsList.innerHTML = '<div class="no-items">No chats yet. Start a new conversation!</div>';
        return;
    }
    
    chatsList.innerHTML = chatUsers.map(user => `
        <div class="chat-item ${currentChatPartner?.id === user.id ? 'selected' : ''}" onclick="openChat('${user.id}', '${user.fullName}', '${user.profilePic}')">
            <img src="${user.profilePic}" alt="${user.fullName}">
            <div class="chat-item-info">
                <div class="chat-item-name">${user.fullName}</div>
                <div class="chat-item-last">
                    ${user.lastMessage ? 
                        (user.lastMessage.senderId === currentUser.id ? 'You: ' : '') + 
                        user.lastMessage.content.substring(0, 30) + (user.lastMessage.content.length > 30 ? '...' : '') 
                        : 'No messages yet'}
                </div>
            </div>
            <div class="chat-item-meta">
                <div class="chat-item-time">
                    ${user.lastMessage ? formatTime(user.lastMessage.timestamp) : ''}
                </div>
                ${user.unreadCount > 0 ? `<div class="unread-badge">${user.unreadCount}</div>` : ''}
            </div>
        </div>
    `).join('');
}

function openChat(userId, userName, userPic) {
    document.getElementById('chatHeader').style.display = 'flex';
    document.getElementById('messageInputArea').style.display = 'block';
    
    document.getElementById('chatPartnerPic').src = userPic;
    document.getElementById('chatPartnerName').textContent = userName;
    
    const user = users.find(u => u.id === userId);
    const lastSeen = user.status === 'online' ? 'online' : `last seen ${timeAgo(user.lastSeen)}`;
    document.getElementById('chatPartnerStatus').textContent = lastSeen;
    
    // Store current chat partner
    currentChatPartner = { id: userId, name: userName, pic: userPic };
    
    // Mark messages as read
    messages.forEach(m => {
        if (m.senderId === userId && m.receiverId === currentUser.id && !m.read) {
            m.read = true;
            m.status = 'read';
        }
    });
    saveMessages();
    
    // Load messages
    loadMessages(userId);
    
    // Update chats list selection
    loadChats();
}

function loadMessages(partnerId) {
    const container = document.getElementById('messagesContainer');
    
    const chatMessages = messages
        .filter(m => (m.senderId === currentUser.id && m.receiverId === partnerId) ||
                    (m.senderId === partnerId && m.receiverId === currentUser.id))
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    if (chatMessages.length === 0) {
        container.innerHTML = `
            <div class="welcome-screen">
                <div class="welcome-logo">EVO</div>
                <h2>${currentChatPartner.name}</h2>
                <p>This is the beginning of your conversation</p>
                <p>Say hello! 👋</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = chatMessages.map(msg => `
        <div class="message ${msg.senderId === currentUser.id ? 'sent' : 'received'}">
            <div class="message-content">
                ${msg.content}
                <div class="message-time">
                    ${formatTime(msg.timestamp)}
                    ${msg.senderId === currentUser.id ? 
                        `<span class="message-status">
                            <i class="fas fa-check${msg.status === 'read' ? '-double' : ''}" 
                               style="color: ${msg.status === 'read' ? '#4caf50' : '#999'};"></i>
                        </span>` 
                        : ''}
                </div>
            </div>
        </div>
    `).join('');
    
    // Scroll to bottom
    container.scrollTop = container.scrollHeight;
}

function sendMessage() {
    const messageText = document.getElementById('messageText').value;
    if (!messageText.trim() || !currentChatPartner) return;
    
    const newMessage = {
        id: generateId(),
        senderId: currentUser.id,
        receiverId: currentChatPartner.id,
        content: messageText,
        timestamp: new Date().toISOString(),
        read: false,
        status: 'sent'
    };
    
    messages.push(newMessage);
    saveMessages();
    
    document.getElementById('messageText').value = '';
    loadMessages(currentChatPartner.id);
    loadChats();
    
    // Simulate delivery and read receipts
    setTimeout(() => {
        newMessage.status = 'delivered';
        saveMessages();
        loadMessages(currentChatPartner.id);
    }, 1000);
    
    setTimeout(() => {
        if (Math.random() > 0.5) { // Simulate random read
            newMessage.read = true;
            newMessage.status = 'read';
            saveMessages();
            loadMessages(currentChatPartner.id);
        }
    }, 3000);
}

function handleKeyPress(event) {
    const enterSends = currentUser.appearance?.enterSends !== false;
    if (enterSends && event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// Group Functions
function loadGroups() {
    const groupsList = document.getElementById('groupsList');
    
    groupsList.innerHTML = `
        <div class="chat-item" onclick="showCreateGroup()">
            <div style="background: var(--primary-color); width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                <i class="fas fa-plus" style="color: white; font-size: 24px;"></i>
            </div>
            <div class="chat-item-info">
                <div class="chat-item-name">Create New Group</div>
                <div class="chat-item-last">Add multiple people to chat</div>
            </div>
        </div>
    `;
    
    const userGroups = groups.filter(g => g.members.includes(currentUser.id));
    
    userGroups.forEach(group => {
        const lastMessage = messages
            .filter(m => m.groupId === group.id)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
        
        groupsList.innerHTML += `
            <div class="chat-item" onclick="openGroupChat('${group.id}', '${group.name}', '${group.pic}')">
                <img src="${group.pic}" alt="${group.name}">
                <div class="chat-item-info">
                    <div class="chat-item-name">${group.name}</div>
                    <div class="chat-item-last">
                        ${lastMessage ? 
                            `${getUserName(lastMessage.senderId)}: ${lastMessage.content.substring(0, 30)}` 
                            : 'Group created'}
                    </div>
                </div>
                <div class="chat-item-time">
                    ${lastMessage ? formatTime(lastMessage.timestamp) : ''}
                </div>
            </div>
        `;
    });
}

function showCreateGroup() {
    document.getElementById('createGroupModal').style.display = 'flex';
    loadGroupUsers();
}

function loadGroupUsers() {
    const usersList = document.getElementById('groupUsersList');
    const otherUsers = users.filter(u => u.id !== currentUser.id);
    
    usersList.innerHTML = otherUsers.map(user => `
        <div class="user-item" onclick="toggleGroupMember('${user.id}')" id="user-${user.id}">
            <img src="${user.profilePic}" alt="${user.fullName}">
            <div class="user-item-info">
                <div class="user-item-name">${user.fullName}</div>
                <div class="user-item-status">${user.status === 'online' ? '🟢 Online' : '⚪ Offline'}</div>
            </div>
            <i class="fas fa-check-circle" style="color: var(--primary-color); display: none;" id="check-${user.id}"></i>
        </div>
    `).join('');
}

let selectedGroupMembers = [];

function toggleGroupMember(userId) {
    const index = selectedGroupMembers.indexOf(userId);
    const checkIcon = document.getElementById(`check-${userId}`);
    const userItem = document.getElementById(`user-${userId}`);
    
    if (index === -1) {
        selectedGroupMembers.push(userId);
        checkIcon.style.display = 'block';
        userItem.style.background = 'var(--hover-bg)';
    } else {
        selectedGroupMembers.splice(index, 1);
        checkIcon.style.display = 'none';
        userItem.style.background = 'none';
    }
}

function previewGroupPic(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('groupPicPreview').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function triggerGroupPicUpload() {
    document.getElementById('groupPicInput').click();
}

function createGroup() {
    const groupName = document.getElementById('groupName').value;
    const groupPic = document.getElementById('groupPicPreview').src;
    
    if (!groupName) {
        showAlert('Please enter a group name!', 'error');
        return;
    }
    
    if (selectedGroupMembers.length < 1) {
        showAlert('Please add at least one member!', 'error');
        return;
    }
    
    const newGroup = {
        id: generateId(),
        name: groupName,
        pic: groupPic,
        createdBy: currentUser.id,
        members: [currentUser.id, ...selectedGroupMembers],
        createdAt: new Date().toISOString()
    };
    
    groups.push(newGroup);
    saveGroups();
    
    closeModal('createGroupModal');
    loadGroups();
    showAlert('Group created successfully!', 'success');
}

// Call Functions
function startAudioCall() {
    if (!currentChatPartner) {
        showAlert('Select a chat first!', 'error');
        return;
    }
    
    startCall('audio');
}

function startVideoCall() {
    if (!currentChatPartner) {
        showAlert('Select a chat first!', 'error');
        return;
    }
    
    startCall('video');
}

function startCall(type) {
    document.getElementById('callerPic').src = currentChatPartner.pic;
    document.getElementById('callerName').textContent = currentChatPartner.name;
    document.getElementById('callStatus').textContent = type === 'audio' ? '🔊 Audio Calling...' : '📹 Video Calling...';
    
    // Hide accept button initially (for outgoing call)
    document.getElementById('acceptCallBtn').style.display = 'none';
    document.getElementById('muteBtn').style.display = 'none';
    document.getElementById('speakerBtn').style.display = 'none';
    
    document.getElementById('callModal').style.display = 'flex';
    
    // Record call
    const call = {
        id: generateId(),
        type: type,
        with: currentChatPartner.id,
        direction: 'outgoing',
        status: 'missed',
        timestamp: new Date().toISOString()
    };
    calls.push(call);
    saveCalls();
    
    // Simulate ring for 10 seconds then show options
    setTimeout(() => {
        if (document.getElementById('callModal').style.display === 'flex') {
            document.getElementById('callStatus').textContent = 'No answer';
            document.getElementById('acceptCallBtn').style.display = 'none';
            setTimeout(() => closeModal('callModal'), 2000);
        }
    }, 10000);
}

function acceptCall() {
    document.getElementById('callStatus').textContent = 'Call in progress...';
    document.getElementById('acceptCallBtn').style.display = 'none';
    document.getElementById('muteBtn').style.display = 'inline-block';
    document.getElementById('speakerBtn').style.display = 'inline-block';
    
    // Update call record
    const lastCall = calls[calls.length - 1];
    if (lastCall) {
        lastCall.status = 'answered';
        lastCall.duration = 0;
        saveCalls();
    }
    
    // Start call timer
    callSeconds = 0;
    callTimer = setInterval(() => {
        callSeconds++;
        const minutes = Math.floor(callSeconds / 60);
        const seconds = callSeconds % 60;
        document.getElementById('callDuration').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function endCall() {
    clearInterval(callTimer);
    document.getElementById('callModal').style.display = 'none';
    
    // Update call duration
    const lastCall = calls[calls.length - 1];
    if (lastCall && lastCall.status === 'answered') {
        lastCall.duration = callSeconds;
        saveCalls();
    }
    
    // Reset
    callSeconds = 0;
    isMuted = false;
    isSpeakerOn = false;
}

function toggleMute() {
    isMuted = !isMuted;
    const muteBtn = document.getElementById('muteBtn');
    muteBtn.style.color = isMuted ? '#f44336' : '';
    showAlert(isMuted ? 'Microphone muted' : 'Microphone unmuted', 'success');
}

function toggleSpeaker() {
    isSpeakerOn = !isSpeakerOn;
    const speakerBtn = document.getElementById('speakerBtn');
    speakerBtn.style.color = isSpeakerOn ? 'var(--primary-color)' : '';
    showAlert(isSpeakerOn ? 'Speaker on' : 'Speaker off', 'success');
}

function loadCalls() {
    const callsList = document.getElementById('callsList');
    
    const userCalls = calls
        .filter(c => c.with === currentUser.id || c.with in currentUser.friends)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    if (userCalls.length === 0) {
        callsList.innerHTML = '<div class="no-items">No calls yet</div>';
        return;
    }
    
    callsList.innerHTML = userCalls.map(call => {
        const user = users.find(u => u.id === (call.with === currentUser.id ? call.from : call.with));
        if (!user) return '';
        
        return `
            <div class="chat-item" onclick="openChat('${user.id}', '${user.fullName}', '${user.profilePic}')">
                <img src="${user.profilePic}" alt="${user.fullName}">
                <div class="chat-item-info">
                    <div class="chat-item-name">${user.fullName}</div>
                    <div class="chat-item-last">
                        <i class="fas fa-${call.type === 'audio' ? 'phone' : 'video'}" 
                           style="color: ${call.status === 'answered' ? '#4caf50' : '#f44336'}; margin-right: 5px;"></i>
                        ${call.direction === 'incoming' ? 'Incoming' : 'Outgoing'} 
                        ${call.type} call · ${call.status}
                        ${call.duration ? ` (${Math.floor(call.duration / 60)}:${(call.duration % 60).toString().padStart(2, '0')})` : ''}
                    </div>
                </div>
                <div class="chat-item-time">${timeAgo(call.timestamp)}</div>
            </div>
        `;
    }).join('');
}

// Status Functions
function loadStatuses() {
    const statusList = document.getElementById('statusList');
    
    statusList.innerHTML = `
        <div class="status-item" onclick="showAddStatus()">
            <div style="position: relative;">
                <img src="${currentUser.profilePic}" alt="My Status">
                <div class="add-status-badge">
                    <i class="fas fa-plus"></i>
                </div>
            </div>
            <div class="status-info">
                <h4>My Status</h4>
                <p>Tap to add status update</p>
            </div>
        </div>
    `;
    
    // Group statuses by user
    const userStatusMap = {};
    statuses.forEach(status => {
        if (!userStatusMap[status.userId]) {
            userStatusMap[status.userId] = [];
        }
        userStatusMap[status.userId].push(status);
    });
    
    // Sort by most recent status
    const usersWithStatus = Object.keys(userStatusMap)
        .filter(userId => userId !== currentUser.id)
        .map(userId => {
            const userStatuses = userStatusMap[userId].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            const user = users.find(u => u.id === userId);
            return { user, statuses: userStatuses };
        })
        .sort((a, b) => new Date(b.statuses[0].timestamp) - new Date(a.statuses[0].timestamp));
    
    usersWithStatus.forEach(({ user, statuses }) => {
        const recentStatus = statuses[0];
        const isViewed = recentStatus.views?.includes(currentUser.id);
        
        statusList.innerHTML += `
            <div class="status-item ${!isViewed ? 'unviewed' : ''}" onclick="viewUserStatuses('${user.id}')">
                <div class="status-ring ${!isViewed ? 'active' : ''}">
                    <img src="${user.profilePic}" alt="${user.fullName}">
                </div>
                <div class="status-info">
                    <h4>${user.fullName}</h4>
                    <p>${timeAgo(recentStatus.timestamp)}</p>
                </div>
            </div>
        `;
    });
}

function showAddStatus() {
    document.getElementById('addStatusModal').style.display = 'flex';
    // Reset status input
    document.getElementById('textStatusInput').style.display = 'none';
    document.getElementById('mediaStatusInput').style.display = 'none';
}

function selectStatusType(type) {
    if (type === 'text') {
        document.getElementById('textStatusInput').style.display = 'block';
        document.getElementById('mediaStatusInput').style.display = 'none';
    } else {
        document.getElementById('textStatusInput').style.display = 'none';
        document.getElementById('mediaStatusInput').style.display = 'block';
    }
}

function selectStatusColor(color) {
    selectedStatusColor = color;
}

function postStatus() {
    const type = document.getElementById('textStatusInput').style.display === 'block' ? 'text' : 'media';
    let content = '';
    let media = null;
    
    if (type === 'text') {
        content = document.getElementById('statusText').value;
        if (!content) {
            showAlert('Please enter status text!', 'error');
            return;
        }
    } else {
        const file = document.getElementById('statusMedia').files[0];
        if (!file) {
            showAlert('Please select media!', 'error');
            return;
        }
        media = URL.createObjectURL(file);
        content = file.name;
    }
    
    const newStatus = {
        id: generateId(),
        userId: currentUser.id,
        type: type,
        content: content,
        media: media,
        color: selectedStatusColor,
        timestamp: new Date().toISOString(),
        views: []
    };
    
    statuses.push(newStatus);
    saveStatuses();
    
    closeModal('addStatusModal');
    loadStatuses();
    showAlert('Status posted successfully!', 'success');
}

function viewUserStatuses(userId) {
    userStatuses = statuses
        .filter(s => s.userId === userId)
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    if (userStatuses.length === 0) return;
    
    currentStatusIndex = 0;
    viewStatus(currentStatusIndex);
    
    // Mark as viewed
    userStatuses.forEach(status => {
        if (!status.views) status.views = [];
        if (!status.views.includes(currentUser.id)) {
            status.views.push(currentUser.id);
        }
    });
    saveStatuses();
    
    document.getElementById('statusViewerModal').style.display = 'flex';
    loadStatuses(); // Reload to update rings
}

function viewStatus(index) {
    const status = userStatuses[index];
    const user = users.find(u => u.id === status.userId);
    
    document.getElementById('statusUserPic').src = user.profilePic;
    document.getElementById('statusUserName').textContent = user.fullName;
    document.getElementById('statusTime').textContent = timeAgo(status.timestamp);
    
    const statusDisplay = document.getElementById('statusDisplay');
    const statusImage = document.getElementById('statusImage');
    const statusVideo = document.getElementById('statusVideo');
    const statusText = document.getElementById('statusText');
    
    statusImage.style.display = 'none';
    statusVideo.style.display = 'none';
    statusText.style.display = 'none';
    
    if (status.type === 'text') {
        statusText.style.display = 'block';
        statusText.textContent = status.content;
        statusText.style.background = status.color || '#ff6b6b';
    } else if (status.type === 'image') {
        statusImage.style.display = 'block';
        statusImage.src = status.media || status.content;
    } else if (status.type === 'video') {
        statusVideo.style.display = 'block';
        statusVideo.src = status.media || status.content;
    }
}

function previousStatus() {
    if (currentStatusIndex > 0) {
        currentStatusIndex--;
        viewStatus(currentStatusIndex);
    }
}

function nextStatus() {
    if (currentStatusIndex < userStatuses.length - 1) {
        currentStatusIndex++;
        viewStatus(currentStatusIndex);
    } else {
        closeModal('statusViewerModal');
    }
}

// Search Functions
function handleSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const chatsList = document.getElementById('chatsList');
    
    const filteredUsers = users.filter(u => 
        u.id !== currentUser.id && 
        (u.fullName.toLowerCase().includes(searchTerm) || 
         u.phone.includes(searchTerm))
    );
    
    if (filteredUsers.length === 0) {
        chatsList.innerHTML = '<div class="no-items">No users found</div>';
        return;
    }
    
    chatsList.innerHTML = filteredUsers.map(user => `
        <div class="chat-item" onclick="openChat('${user.id}', '${user.fullName}', '${user.profilePic}')">
            <img src="${user.profilePic}" alt="${user.fullName}">
            <div class="chat-item-info">
                <div class="chat-item-name">${user.fullName}</div>
                <div class="chat-item-last">${user.phone}</div>
            </div>
            <div class="chat-item-time">${user.status === 'online' ? '🟢 Online' : '⚪ Offline'}</div>
        </div>
    `).join('');
}

function showNewChat() {
    document.getElementById('newChatModal').style.display = 'flex';
    searchUsers();
}

function searchUsers() {
    const searchTerm = document.getElementById('searchUsers').value.toLowerCase();
    const usersList = document.getElementById('usersList');
    
    const otherUsers = users.filter(u => 
        u.id !== currentUser.id && 
        (u.fullName.toLowerCase().includes(searchTerm) || 
         u.phone.includes(searchTerm))
    );
    
    if (otherUsers.length === 0) {
        usersList.innerHTML = '<div class="no-items">No users found</div>';
        return;
    }
    
    usersList.innerHTML = otherUsers.map(user => `
        <div class="user-item" onclick="startNewChat('${user.id}', '${user.fullName}', '${user.profilePic}')">
            <img src="${user.profilePic}" alt="${user.fullName}">
            <div class="user-item-info">
                <div class="user-item-name">${user.fullName}</div>
                <div class="user-item-status">${user.status === 'online' ? '🟢 Online' : '⚪ Offline'}</div>
            </div>
        </div>
    `).join('');
}

function startNewChat(userId, userName, userPic) {
    closeModal('newChatModal');
    openChat(userId, userName, userPic);
}

// Emoji Functions
function showEmojiPicker() {
    document.getElementById('emojiPickerModal').style.display = 'flex';
    loadEmojis('smileys');
}

function selectEmojiCategory(category) {
    loadEmojis(category);
}

function loadEmojis(category) {
    const emojiGrid = document.getElementById('emojiGrid');
    emojiGrid.innerHTML = emojis[category].map(emoji => 
        `<span onclick="insertEmoji('${emoji}')">${emoji}</span>`
    ).join('');
}

function insertEmoji(emoji) {
    const input = document.getElementById('messageText');
    input.value += emoji;
    closeModal('emojiPickerModal');
}

// Tab Switching
function switchTab(tabName) {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    
    document.getElementById('chatsList').classList.remove('active');
    document.getElementById('groupsList').classList.remove('active');
    document.getElementById('callsList').classList.remove('active');
    document.getElementById('statusList').classList.remove('active');
    
    document.getElementById(`${tabName}List`).classList.add('active');
}

// Modal Functions
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    
    // Reset forms
    if (modalId === 'createGroupModal') {
        document.getElementById('groupName').value = '';
        document.getElementById('groupPicPreview').src = 'https://via.placeholder.com/100';
        selectedGroupMembers = [];
    } else if (modalId === 'addStatusModal') {
        document.getElementById('statusText').value = '';
        document.getElementById('statusMedia').value = '';
    }
}

// Utility Functions
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 86400000) { // Less than 24 hours
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diff < 604800000) { // Less than 7 days
        return date.toLocaleDateString([], { weekday: 'short' });
    } else {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
}

function timeAgo(timestamp) {
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    
    const intervals = [
        { label: 'year', seconds: 31536000 },
        { label: 'month', seconds: 2592000 },
        { label: 'week', seconds: 604800 },
        { label: 'day', seconds: 86400 },
        { label: 'hour', seconds: 3600 },
        { label: 'minute', seconds: 60 },
        { label: 'second', seconds: 1 }
    ];
    
    for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count >= 1) {
            return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
        }
    }
    
    return 'just now';
}

function getUserName(userId) {
    const user = users.find(u => u.id === userId);
    return user ? user.fullName.split(' ')[0] : 'Unknown';
}

// Initialize
window.onload = function() {
    // Check for saved theme
    const savedTheme = localStorage.getItem('evo_theme') || 'light';
    changeTheme(savedTheme);
    
    // Auto hide splash screen after 2 seconds
    setTimeout(() => {
        document.getElementById('splashScreen').style.display = 'none';
    }, 2000);
    
    // Check if user was previously logged in
    const onlineUser = users.find(u => u.status === 'online');
    if (onlineUser) {
        currentUser = onlineUser;
        document.getElementById('authContainer').style.display = 'none';
        document.getElementById('mainContainer').style.display = 'flex';
        document.getElementById('splashScreen').style.display = 'none';
        updateUserProfile();
        loadChats();
        loadGroups();
        loadCalls();
        loadStatuses();
    }
};

// Make functions globally available
window.showRegister = showRegister;
window.showLogin = showLogin;
window.showForgotPassword = showForgotPassword;
window.handleRegister = handleRegister;
window.handleLogin = handleLogin;
window.handleForgotPassword = handleForgotPassword;
window.logout = logout;
window.showSettings = showSettings;
window.triggerProfilePicUpload = triggerProfilePicUpload;
window.updateProfilePic = updateProfilePic;
window.saveSettings = saveSettings;
window.switchSettingsTab = switchSettingsTab;
window.changeTheme = changeTheme;
window.changeWallpaper = changeWallpaper;
window.openChat = openChat;
window.sendMessage = sendMessage;
window.handleKeyPress = handleKeyPress;
window.startAudioCall = startAudioCall;
window.startVideoCall = startVideoCall;
window.acceptCall = acceptCall;
window.endCall = endCall;
window.toggleMute = toggleMute;
window.toggleSpeaker = toggleSpeaker;
window.showNewChat = showNewChat;
window.searchUsers = searchUsers;
window.startNewChat = startNewChat;
window.showCreateGroup = showCreateGroup;
window.toggleGroupMember = toggleGroupMember;
window.triggerGroupPicUpload = triggerGroupPicUpload;
window.previewGroupPic = previewGroupPic;
window.createGroup = createGroup;
window.showAddStatus = showAddStatus;
window.selectStatusType = selectStatusType;
window.selectStatusColor = selectStatusColor;
window.postStatus = postStatus;
window.viewUserStatuses = viewUserStatuses;
window.previousStatus = previousStatus;
window.nextStatus = nextStatus;
window.showEmojiPicker = showEmojiPicker;
window.selectEmojiCategory = selectEmojiCategory;
window.insertEmoji = insertEmoji;
window.switchTab = switchTab;
window.closeModal = closeModal;