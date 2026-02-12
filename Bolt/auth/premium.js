// ArcadeX Premium Module
// Simple freemium state manager — backend bridge via localStorage
const Premium = {
    // Check premium status
    isPremium() {
        return localStorage.getItem('arcadex_premium') === 'true';
    },

    // Set premium status (for backend bridge)
    setPremium(status) {
        localStorage.setItem('arcadex_premium', status ? 'true' : 'false');
    },

    // Show upgrade modal overlay
    showUpgradeModal(featureName) {
        // Remove existing modal if any
        const existing = document.getElementById('upgrade-modal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'upgrade-modal';
        modal.className = 'upgrade-modal';
        modal.innerHTML = `
            <div class="upgrade-modal-backdrop" onclick="Premium.closeModal()"></div>
            <div class="upgrade-modal-content pop-in">
                <div class="upgrade-modal-icon">
                    <i data-lucide="crown" style="width:40px;height:40px;color:#fbbf24"></i>
                </div>
                <h2 style="font-size:1.8rem;margin-bottom:8px;font-family:'Outfit',sans-serif">Upgrade to <span class="gradient-text">Pro</span></h2>
                <p style="color:var(--text-secondary);margin-bottom:24px;max-width:320px;line-height:1.6">
                    ${featureName ? `<strong>${featureName}</strong> is a Pro feature. ` : ''}Unlock all premium features and take your server to the next level.
                </p>
                <div style="display:flex;gap:16px;margin-bottom:24px;width:100%">
                    <div class="upgrade-plan-option" style="flex:1">
                        <div style="font-size:0.75rem;text-transform:uppercase;letter-spacing:1px;color:var(--text-secondary);margin-bottom:4px">Monthly</div>
                        <div style="font-size:2rem;font-weight:800;font-family:'Outfit',sans-serif">$2.99<span style="font-size:0.9rem;font-weight:400;color:var(--text-secondary)">/mo</span></div>
                    </div>
                    <div class="upgrade-plan-option featured" style="flex:1">
                        <div style="font-size:0.65rem;text-transform:uppercase;letter-spacing:1px;color:#fbbf24;margin-bottom:4px;font-weight:700">Best Value</div>
                        <div style="font-size:2rem;font-weight:800;font-family:'Outfit',sans-serif">$19.99<span style="font-size:0.9rem;font-weight:400;color:var(--text-secondary)"> once</span></div>
                    </div>
                </div>
                <div style="display:flex;flex-direction:column;gap:8px;width:100%;margin-bottom:24px;text-align:left">
                    <div style="display:flex;align-items:center;gap:8px;font-size:0.9rem;color:var(--text-secondary)">
                        <i data-lucide="check" style="width:16px;height:16px;color:var(--success)"></i> Remove ArcadeX branding & watermarks
                    </div>
                    <div style="display:flex;align-items:center;gap:8px;font-size:0.9rem;color:var(--text-secondary)">
                        <i data-lucide="check" style="width:16px;height:16px;color:var(--success)"></i> Custom embed footers
                    </div>
                    <div style="display:flex;align-items:center;gap:8px;font-size:0.9rem;color:var(--text-secondary)">
                        <i data-lucide="check" style="width:16px;height:16px;color:var(--success)"></i> AI-powered automoderation
                    </div>
                    <div style="display:flex;align-items:center;gap:8px;font-size:0.9rem;color:var(--text-secondary)">
                        <i data-lucide="check" style="width:16px;height:16px;color:var(--success)"></i> Custom welcome card backgrounds
                    </div>
                    <div style="display:flex;align-items:center;gap:8px;font-size:0.9rem;color:var(--text-secondary)">
                        <i data-lucide="check" style="width:16px;height:16px;color:var(--success)"></i> High quality music playback
                    </div>
                </div>
                <button class="btn btn-primary w-full" style="padding:14px;font-size:1rem;box-shadow:0 0 30px var(--accent-glow)" onclick="alert('Checkout coming soon!'); Premium.closeModal();">
                    <i data-lucide="sparkles" style="width:18px;height:18px"></i> Upgrade Now
                </button>
                <button style="background:none;border:none;color:var(--text-secondary);margin-top:12px;cursor:pointer;font-size:0.85rem" onclick="Premium.closeModal()">Maybe later</button>
            </div>
        `;
        document.body.appendChild(modal);
        if (typeof lucide !== 'undefined') lucide.createIcons();
        // Prevent scroll
        document.body.style.overflow = 'hidden';
    },

    closeModal() {
        const modal = document.getElementById('upgrade-modal');
        if (modal) {
            modal.querySelector('.upgrade-modal-content').style.animation = 'modalOut 0.2s ease forwards';
            setTimeout(() => {
                modal.remove();
                document.body.style.overflow = '';
            }, 200);
        }
    },

    // Create a PRO badge element
    createBadge() {
        const badge = document.createElement('span');
        badge.className = 'pro-badge';
        badge.innerHTML = '<i data-lucide="crown" style="width:10px;height:10px"></i> PRO';
        return badge;
    },

    // Lock a field with overlay
    lockField(elementId, featureName) {
        const el = document.getElementById(elementId);
        if (!el || this.isPremium()) return;

        el.style.position = 'relative';
        const overlay = document.createElement('div');
        overlay.className = 'premium-lock-overlay';
        overlay.innerHTML = `
            <div class="premium-lock-content">
                <i data-lucide="lock" style="width:16px;height:16px;color:var(--accent-light)"></i>
                <span>Pro Feature</span>
            </div>
        `;
        overlay.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            Premium.showUpgradeModal(featureName);
        };
        el.appendChild(overlay);
        if (typeof lucide !== 'undefined') lucide.createIcons();
    },

    // Add PRO badge next to a label
    addBadgeToLabel(labelElement) {
        if (!labelElement || this.isPremium()) return;
        const badge = this.createBadge();
        labelElement.appendChild(badge);
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
};
