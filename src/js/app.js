// Data Storage
class RestaurantDB {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('restaurant_users')) || [];
        this.bookings = JSON.parse(localStorage.getItem('restaurant_bookings')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('current_user')) || null;
    }

    saveUsers() {
        localStorage.setItem('restaurant_users', JSON.stringify(this.users));
    }

    saveBookings() {
        localStorage.setItem('restaurant_bookings', JSON.stringify(this.bookings));
    }

    saveCurrentUser() {
        localStorage.setItem('current_user', JSON.stringify(this.currentUser));
    }

    registerUser(name, email, password, isAdmin = false) {
        const userExists = this.users.find(u => u.email === email);
        if (userExists) {
            return { success: false, message: 'User already exists with this email' };
        }

        const user = {
            id: Date.now().toString(),
            name,
            email,
            password, // In real app, this should be hashed
            isAdmin,
            createdAt: new Date().toISOString()
        };

        this.users.push(user);
        this.saveUsers();
        return { success: true, message: 'Registration successful!' };
    }

    loginUser(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        if (!user) {
            return { success: false, message: 'Invalid email or password' };
        }

        this.currentUser = user;
        this.saveCurrentUser();
        return { success: true, message: 'Login successful!' };
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('current_user');
    }

    createBooking(bookingData) {
        const booking = {
            id: Date.now().toString(),
            userId: this.currentUser ? this.currentUser.id : 'guest',
            userName: this.currentUser ? this.currentUser.name : 'Guest',
            ...bookingData,
            status: 'confirmed',
            createdAt: new Date().toISOString()
        };

        this.bookings.push(booking);
        this.saveBookings();
        return { success: true, message: 'Booking confirmed successfully!' };
    }

    getAllBookings() {
        return this.bookings.sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time));
    }

    getTodaysBookings() {
        const today = new Date().toISOString().split('T')[0];
        return this.bookings.filter(b => b.date === today);
    }

    updateBookingStatus(bookingId, status) {
        const booking = this.bookings.find(b => b.id === bookingId);
        if (booking) {
            booking.status = status;
            this.saveBookings();
            return true;
        }
        return false;
    }

    deleteBooking(bookingId) {
        const index = this.bookings.findIndex(b => b.id === bookingId);
        if (index !== -1) {
            this.bookings.splice(index, 1);
            this.saveBookings();
            return true;
        }
        return false;
    }

    clearOldBookings() {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        this.bookings = this.bookings.filter(b => {
            const bookingDate = new Date(b.date + 'T' + b.time);
            return bookingDate >= oneWeekAgo;
        });

        this.saveBookings();
        return this.bookings.length;
    }
}

// App Initialization
const db = new RestaurantDB();

// DOM Elements
const elements = {
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toast-message'),
    userWelcome: document.getElementById('user-welcome'),
    homeBtn: document.getElementById('home-btn'),
    loginBtn: document.getElementById('login-btn'),
    registerBtn: document.getElementById('register-btn'),
    reservationBtn: document.getElementById('reservation-btn'),
    logoutBtn: document.getElementById('logout-btn'),
    adminBtn: document.getElementById('admin-btn'),
    bookingsTableBody: document.getElementById('bookings-table-body')
};

// Show Toast Notification
function showToast(message, type = 'success') {
    elements.toast.className = `fixed top-4 right-4 p-4 ${type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white rounded-lg shadow-lg z-50 success-toast flex items-center`;
    elements.toastMessage.textContent = message;
    elements.toast.classList.remove('hidden');

    setTimeout(() => {
        elements.toast.classList.add('hidden');
    }, 3000);
}

// Show Page Function
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active-page');
    });

    // Show selected page
    document.getElementById(`${pageId}-page`).classList.add('active-page');

    // Special handling for specific pages
    if (pageId === 'admin' && db.currentUser && db.currentUser.isAdmin) {
        renderAdminDashboard();
    } else if (pageId === 'reservation') {
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('booking-date').min = today;
    }
}

// Update UI based on authentication state
function updateAuthUI() {
    if (db.currentUser) {
        elements.userWelcome.textContent = `Welcome, ${db.currentUser.name}`;
        elements.userWelcome.classList.remove('hidden');
        elements.loginBtn.classList.add('hidden');
        elements.registerBtn.classList.add('hidden');
        elements.reservationBtn.classList.remove('hidden');
        elements.logoutBtn.classList.remove('hidden');

        if (db.currentUser.isAdmin) {
            elements.adminBtn.classList.remove('hidden');
        } else {
            elements.adminBtn.classList.add('hidden');
        }
    } else {
        elements.userWelcome.classList.add('hidden');
        elements.loginBtn.classList.remove('hidden');
        elements.registerBtn.classList.remove('hidden');
        elements.reservationBtn.classList.add('hidden');
        elements.logoutBtn.classList.add('hidden');
        elements.adminBtn.classList.add('hidden');
    }
}

// Render Admin Dashboard
function renderAdminDashboard() {
    const bookings = db.getAllBookings();
    const todayBookings = db.getTodaysBookings();

    // Update stats
    document.getElementById('total-users').textContent = db.users.length;
    document.getElementById('total-bookings').textContent = bookings.length;
    document.getElementById('today-total').textContent = todayBookings.length;
    document.getElementById('today-confirmed').textContent = todayBookings.filter(b => b.status === 'confirmed').length;
    document.getElementById('today-pending').textContent = todayBookings.filter(b => b.status === 'pending').length;
    document.getElementById('active-today').textContent = todayBookings.length;
    document.getElementById('last-updated').textContent = new Date().toLocaleTimeString();

    // Render bookings table
    elements.bookingsTableBody.innerHTML = '';

    if (bookings.length === 0) {
        elements.bookingsTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="px-6 py-4 text-center text-gray-500">
                    No bookings found
                </td>
            </tr>
        `;
        return;
    }

    bookings.forEach(booking => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${booking.userName}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${new Date(booking.date).toLocaleDateString()}</div>
                <div class="text-sm text-gray-500">${booking.time}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    ${booking.guests} ${booking.guests === 1 ? 'Guest' : 'Guests'}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">${booking.table}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div>${booking.email}</div>
                <div class="text-gray-500">${booking.phone}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'} text-sm font-medium rounded-full capitalize">
                    ${booking.status}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onclick="updateBookingStatus('${booking.id}', 'confirmed')" class="text-green-600 hover:text-green-900 mr-2">Confirm</button>
                <button onclick="updateBookingStatus('${booking.id}', 'cancelled')" class="text-red-600 hover:text-red-900 mr-2">Cancel</button>
                <button onclick="deleteBooking('${booking.id}')" class="text-gray-600 hover:text-gray-900">Delete</button>
            </td>
        `;
        elements.bookingsTableBody.appendChild(row);
    });
}

// Update Booking Status
function updateBookingStatus(bookingId, status) {
    if (db.updateBookingStatus(bookingId, status)) {
        showToast(`Booking ${status} successfully!`);
        renderAdminDashboard();
    } else {
        showToast('Failed to update booking', 'error');
    }
}

// Delete Booking
function deleteBooking(bookingId) {
    if (confirm('Are you sure you want to delete this booking?')) {
        if (db.deleteBooking(bookingId)) {
            showToast('Booking deleted successfully!');
            renderAdminDashboard();
        } else {
            showToast('Failed to delete booking', 'error');
        }
    }
}

// Admin Functions
function refreshBookings() {
    renderAdminDashboard();
    showToast('Bookings refreshed!');
}

function exportBookings() {
    const bookings = db.getAllBookings();
    const csvContent = "data:text/csv;charset=utf-8,"
        + "Date,Time,Guests,Table Type,Contact Email,Phone,Status,User\n"
        + bookings.map(b =>
            `${b.date},${b.time},${b.guests},${b.table},${b.email},${b.phone},${b.status},${b.userName}`
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "restaurant_bookings.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Bookings exported successfully!');
}

function clearOldBookings() {
    const remaining = db.clearOldBookings();
    showToast(`Cleared old bookings. ${remaining} bookings remain.`);
    renderAdminDashboard();
}

function generateReport() {
    showToast('Report generation feature coming soon!', 'error');
}

// Event Listeners
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const result = db.loginUser(email, password);
    if (result.success) {
        showToast(result.message);
        updateAuthUI();
        showPage('home');
    } else {
        showToast(result.message, 'error');
    }
});

document.getElementById('register-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirm = document.getElementById('register-confirm').value;
    const isAdmin = document.getElementById('register-admin').checked;

    if (password !== confirm) {
        showToast('Passwords do not match', 'error');
        return;
    }

    const result = db.registerUser(name, email, password, isAdmin);
    if (result.success) {
        showToast(result.message);
        showPage('login');
    } else {
        showToast(result.message, 'error');
    }
});

document.getElementById('booking-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const bookingData = {
        date: document.getElementById('booking-date').value,
        time: document.getElementById('booking-time').value,
        guests: document.getElementById('booking-guests').value,
        table: document.getElementById('booking-table').value,
        requests: document.getElementById('booking-requests').value,
        email: document.getElementById('booking-email').value,
        phone: document.getElementById('booking-phone').value
    };

    const result = db.createBooking(bookingData);
    if (result.success) {
        showToast(result.message);
        document.getElementById('booking-form').reset();

        // If user is admin, offer to go to admin dashboard
        if (db.currentUser && db.currentUser.isAdmin) {
            if (confirm('Booking created! Would you like to view all bookings?')) {
                showPage('admin');
            }
        }
    } else {
        showToast(result.message, 'error');
    }
});

elements.logoutBtn.addEventListener('click', () => {
    db.logout();
    updateAuthUI();
    showToast('Logged out successfully!');
    showPage('home');
});

elements.adminBtn.addEventListener('click', () => {
    if (db.currentUser && db.currentUser.isAdmin) {
        showPage('admin');
    }
});

elements.homeBtn.addEventListener('click', () => {
    showPage('home');
});

elements.loginBtn.addEventListener('click', () => {
    showPage('login');
});

elements.registerBtn.addEventListener('click', () => {
    showPage('register');
});

elements.reservationBtn.addEventListener('click', () => {
    showPage('reservation');
});

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    showPage('home');

    // Set minimum date to today for reservation form
    const today = new Date().toISOString().split('T')[0];
    if (document.getElementById('booking-date')) {
        document.getElementById('booking-date').min = today;
    }
});

// Allow global access to functions needed in onclick handlers
window.showPage = showPage;
window.updateBookingStatus = updateBookingStatus;
window.deleteBooking = deleteBooking;
window.exportBookings = exportBookings;
window.refreshBookings = refreshBookings;
window.clearOldBookings = clearOldBookings;
window.generateReport = generateReport;
