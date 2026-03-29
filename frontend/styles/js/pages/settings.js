// Settings Page Module

async function renderSettingsContent(params) {
    const app = document.getElementById('app');
    const user = Auth.getCurrentUser();

    if (!user) {
        app.innerHTML = `
            <div class="container">
                <div class="empty-state" style="min-height: 400px;">
                    <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="1"></circle><path d="M12 1v6m0 6v6"></path><path d="M4.22 4.22l4.24 4.24m-4.24 8.08l4.24 4.24M19.78 4.22l-4.24 4.24m4.24 8.08l-4.24 4.24"></path></svg>
                    <div class="empty-state-title">Please sign in</div>
                    <p class="empty-state-message">Sign in to manage your settings</p>
                    <button class="btn btn-primary" onclick="document.getElementById('authModal').style.display = 'flex'">Sign In</button>
                </div>
            </div>
        `;
        return;
    }

    app.innerHTML = `
        <div class="container" style="padding-top: 2rem; padding-bottom: 2rem;">
            <h1 style="font-size: 2rem; font-weight: 700; color: var(--color-forest); margin-bottom: 2rem;">Account Settings</h1>

            <div style="max-width: 800px;">
                <!-- Profile Section -->
                <div style="background: white; border: 1px solid #E5E7EB; border-radius: 1rem; padding: 2rem; margin-bottom: 1.5rem;">
                    <h2 style="font-weight: 600; font-size: 1.125rem; color: var(--color-forest); margin-bottom: 1.5rem;">Profile Information</h2>
                    
                    <form id="profileForm">
                        <div class="form-group">
                            <label>Full Name</label>
                            <input type="text" id="settingsFullName" value="${user.full_name || ''}" required>
                        </div>

                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" id="settingsEmail" value="${user.email || ''}" disabled style="background: #F3F4F6; cursor: not-allowed;">
                        </div>

                        <div class="form-group">
                            <label>Phone</label>
                            <input type="tel" id="settingsPhone" value="${user.phone || ''}" placeholder="+91 0000000000">
                        </div>

                        <div class="form-group">
                            <label>Address</label>
                            <input type="text" id="settingsAddress" value="${user.address || ''}" placeholder="Your address">
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div class="form-group">
                                <label>City</label>
                                <input type="text" id="settingsCity" value="${user.city || ''}" placeholder="City">
                            </div>

                            <div class="form-group">
                                <label>Country</label>
                                <input type="text" id="settingsCountry" value="${user.country || ''}" placeholder="Country">
                            </div>
                        </div>

                        <button type="submit" class="btn btn-primary" style="width: 100%;">
                            Save Changes
                        </button>
                    </form>
                </div>

                
                <!-- Security -->
                <div style="background: white; border: 1px solid #E5E7EB; border-radius: 1rem; padding: 2rem; margin-bottom: 1.5rem;">
                    <h2 style="font-weight: 600; font-size: 1.125rem; color: var(--color-forest); margin-bottom: 1.5rem;">Security</h2>
                    
                    <button onclick="changePassword()" class="btn" style="width: 100%; padding: 0.75rem; background: white; color: var(--color-forest); border: 1px solid var(--color-forest); border-radius: 0.5rem; font-weight: 600; cursor: pointer;">
                        Change Password
                    </button>
                </div>

                
                <!-- Danger Zone -->
                <div style="background: #FEF2F2; border: 1px solid #FECACA; border-radius: 1rem; padding: 2rem;">
                    <h2 style="font-weight: 600; font-size: 1.125rem; color: #DC2626; margin-bottom: 1rem;">Danger Zone</h2>
                    <p style="color: #6B7280; font-size: 0.875rem; margin-bottom: 1rem;">
                        Account deletion is permanent and cannot be undone.
                    </p>
                    <button onclick="deleteAccount()" class="btn" style="padding: 0.75rem 1.5rem; background: #DC2626; color: white; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer;">
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    `;

    // Setup form submission
    document.getElementById('profileForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const updateData = {
            full_name: document.getElementById('settingsFullName').value,
            phone: document.getElementById('settingsPhone').value,
            address: document.getElementById('settingsAddress').value,
            city: document.getElementById('settingsCity').value,
            country: document.getElementById('settingsCountry').value
        };

        try {
            await API.updateProfile(user.id, updateData);
            // Update local storage
            updateData.id = user.id;
            updateData.email = user.email;
            Auth.login(updateData);
            showToast('Profile updated successfully!', 'success');
        } catch (error) {
            showToast(error.message, 'error');
        }
    });
}

function changePassword() {
    const newPassword = prompt('Enter your new password (min 6 characters):');
    if (!newPassword || newPassword.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }
    showToast('Password change feature coming soon', 'info');
}

function upgradeSeller() {
    showToast('Seller upgrade feature coming soon', 'info');
}

function deleteAccount() {
    const confirmed = confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.');
    if (confirmed) {
        const doubleConfirm = prompt('Type "DELETE" to confirm account deletion:');
        if (doubleConfirm === 'DELETE') {
            showToast('Account deletion feature coming soon', 'info');
        }
    }
}
