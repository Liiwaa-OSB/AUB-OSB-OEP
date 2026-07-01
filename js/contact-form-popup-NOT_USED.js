// ------------------------------------------------------------------
// FULL POPUP SCRIPT (standalone, no external dependencies)
// Includes all required fields + hidden inputs + timezone country detection
// ------------------------------------------------------------------
(function () {
    // ----- CONFIGURATION (edit with your Salesforce Org ID if needed) -----
    // For demo, we use a dummy endpoint to avoid actual submission.
    // Replace 'salesforceOrgId' with your real 15/18 char Org ID and actionUrl with actual Web-to-Lead URL.
    const DEFAULT_ACTION = "https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8";
    const DEMO_ACTION = "https://httpbin.org/post";  // dummy test endpoint (prints submitted data)

    let config = {
        salesforceOrgId: "",   //  <-- put your Salesforce Org ID here for real submissions
        actionUrl: DEMO_ACTION,   // change to DEFAULT_ACTION + provide Org ID for production
        returnUrl: "./Executive-education-contact-form-thank-you.html"
    };

    // Allow overriding via window.PopupFormConfig (useful for real integration)
    if (typeof window.PopupFormConfig !== 'undefined') {
        config = { ...config, ...window.PopupFormConfig };
    }

    // ----- UTILITY: detect country code from timezone -----
    function detectCountryCode() {
        try {
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if (!timezone) return "NA";
            const tzMap = {
                "America/New_York": "US", "America/Chicago": "US", "America/Denver": "US", "America/Phoenix": "US", "America/Los_Angeles": "US",
                "America/Toronto": "CA", "America/Vancouver": "CA", "America/Mexico_City": "MX", "America/Bogota": "CO", "America/Lima": "PE",
                "America/Santiago": "CL", "America/Buenos_Aires": "AR", "America/Sao_Paulo": "BR", "Europe/London": "GB", "Europe/Paris": "FR",
                "Europe/Berlin": "DE", "Europe/Rome": "IT", "Europe/Madrid": "ES", "Europe/Amsterdam": "NL", "Europe/Stockholm": "SE",
                "Europe/Oslo": "NO", "Europe/Copenhagen": "DK", "Europe/Helsinki": "FI", "Europe/Warsaw": "PL", "Europe/Istanbul": "TR",
                "Europe/Moscow": "RU", "Asia/Dubai": "AE", "Asia/Riyadh": "SA", "Asia/Doha": "QA", "Asia/Kuwait": "KW", "Asia/Jerusalem": "IL",
                "Asia/Tehran": "IR", "Asia/Karachi": "PK", "Asia/Kolkata": "IN", "Asia/Dhaka": "BD", "Asia/Bangkok": "TH", "Asia/Singapore": "SG",
                "Asia/Hong_Kong": "HK", "Asia/Shanghai": "CN", "Asia/Tokyo": "JP", "Asia/Seoul": "KR", "Asia/Jakarta": "ID", "Asia/Manila": "PH",
                "Asia/Taipei": "TW", "Africa/Cairo": "EG", "Africa/Johannesburg": "ZA", "Africa/Lagos": "NG", "Africa/Nairobi": "KE",
                "Africa/Casablanca": "MA", "Australia/Sydney": "AU", "Australia/Melbourne": "AU", "Australia/Perth": "AU", "Australia/Brisbane": "AU",
                "Australia/Adelaide": "AU", "Pacific/Auckland": "NZ", "Pacific/Fiji": "FJ"
            };
            if (tzMap[timezone]) return tzMap[timezone];
            const region = timezone.split('/')[0];
            if (region === "America") return "US";
            if (region === "Europe") return "GB";
            if (region === "Asia") return "IN";
            if (region === "Australia") return "AU";
            if (region === "Africa") return "ZA";
            return "NA";
        } catch (e) { return "NA"; }
    }

    // ----- Popup HTML structure (fully styled) -----
    const popupHTML = `
            <div id="popup-form-overlay" class="popup-overlay" style="display: none;">
                <div class="popup-container">
                    <button class="popup-close" aria-label="Close">&times;</button>
                    <div class="popup-header">
                        <h2>Request Information</h2>
                        <p>Fill out the form below and we'll get back to you shortly.</p>
                    </div>
                    <form id="popup-lead-form" method="POST" class="popup-form">
                        <!-- Hidden Salesforce fields (including all required from spec) -->
                        <input type="hidden" id="oid" name="oid" value="">
                        <input type="hidden" id="recordType" name="recordType" value="0120Y000000ymGb">
                        <input type="hidden" id="Campaign_ID" name="Campaign_ID" value="[Lii-campaign id on sales force]">
                        <input type="hidden" id="member_status" name="member_status" value="Interested">
                        <input type="hidden" name="lead_source" id="lead_source" value="Website">
                        <input type="hidden" name="00N0Y00000QGkma" id="00N0Y00000QGkma" value="Apply MBA">
                        <input type="hidden" name="00N0Y00000QGku0" id="employer" value="N/A">
                        <input type="hidden" name="rating" id="rating" value="Cold">
                        <input type="hidden" id="00N0Y00000RODiR" name="00N0Y00000RODiR" value="Work Email">
                        <input type="hidden" id="00N0Y00000RODr9" name="00N0Y00000RODr9" value="Work Phone">
                        <input type="hidden" name="retURL" id="retURL" value="">
                        <input type="hidden" name="country_code" id="country_code" value="">
                        
                        <!-- Visible fields -->
                        <div class="form-row">
                            <div class="form-group">
                                <label for="first_name">First Name *</label>
                                <input type="text" id="first_name" name="first_name" required>
                            </div>
                            <div class="form-group">
                                <label for="last_name">Last Name *</label>
                                <input type="text" id="last_name" name="last_name" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="title">Title</label>
                                <input type="text" id="title" name="title">
                            </div>
                            <div class="form-group">
                                <label for="company">Company Name</label>
                                <input type="text" id="company" name="company">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="00N0Y00000QGl8W">Email *</label>
                                <input type="email" id="00N0Y00000QGl8W" name="00N0Y00000QGl8W" required>
                            </div>
                            <div class="form-group">
                                <label for="intphone">Phone Number</label>
                                <input type="tel" id="intphone" name="intphone">
                            </div>
                        </div>
                        <div class="form-group full-width">
                            <label for="description">What would you like to know?</label>
                            <textarea id="description" name="description" rows="4" placeholder="Please share any questions or details about your interests..."></textarea>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn-cancel">Cancel</button>
                            <button type="submit" class="btn-submit">Submit Inquiry</button>
                        </div>
                        <p class="form-disclaimer">* Required fields. Your information will be kept confidential.</p>
                    </form>
                </div>
            </div>
        `;

    const popupStyles = `
    .popup-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.75);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: var(--font-family-base, 'Roboto', sans-serif);
    }
    .popup-container {
        position: relative;
        background: #ffffff;
        width: 90%;
        max-width: 680px;
        max-height: 90vh;
        border-radius: var(--border-radius, 20px);
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3);
        overflow-y: auto;
        animation: popupFadeIn 0.25s ease-out;
    }
    @keyframes popupFadeIn {
        from { opacity: 0; transform: scale(0.96); }
        to { opacity: 1; transform: scale(1); }
    }
    .popup-close {
        position: absolute;
        top: 14px;
        right: 20px;
        background: none;
        border: none;
        font-size: 28px;
        font-weight: 300;
        cursor: pointer;
        color: #ccc;
        transition: color 0.2s;
        z-index: 20;
        line-height: 1;
    }
    .popup-close:hover {
        color: #FFFFFF;
    }
    .popup-header {
        background: var(--color-primary, #840132);
        color: white;
        padding: 1.5rem 2rem;
    }
    .popup-header h2 {
        margin: 0 0 0.25rem;
        font-size: 1.8rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    .popup-header p {
        margin: 0;
        opacity: 0.85;
        font-size: 0.95rem;
    }
    .popup-form {
        padding: 1.8rem 2rem 2rem;
    }
    .form-row {
        display: flex;
        gap: 1.2rem;
        margin-bottom: 1rem;
        flex-wrap: wrap;
    }
    .form-group {
        flex: 1;
        min-width: 140px;
        margin-bottom: 0.5rem;
    }
    .form-group.full-width {
        width: 100%;
        flex: 0 0 100%;
    }
    .form-group label {
        display: block;
        font-size: 0.8rem;
        font-weight: 700;
        margin-bottom: 0.4rem;
        color: #1e293b;
        text-transform: uppercase;
        letter-spacing: 0.4px;
    }
    .form-group input,
    .form-group textarea {
        width: 100%;
        padding: 0.7rem 0.9rem;
        border: 1px solid #cbd5e1;
        border-radius: var(--border-radius, 12px);
        font-size: 0.95rem;
        font-family: inherit;
        transition: all 0.2s;
        background: #fff;
    }
    .form-group input:focus,
    .form-group textarea:focus {
        outline: none;
        border-color: var(--color-primary, #840132);
        box-shadow: 0 0 0 3px rgba(132, 1, 50, 0.1);
    }
    .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 1.8rem;
    }
    .btn-cancel,
    .btn-submit {
        padding: 0.7rem 1.8rem;
        font-weight: 600;
        font-size: 0.9rem;
        cursor: pointer;
        transition: 0.2s;
        border: none;
    }
    .btn-cancel {
    border: 2px solid #6a132c;
        background: #f1f5f9;
        color: #334155;
    }
    .btn-cancel:hover {
        background: #e2e8f0;
    }
    .btn-submit {
        background: var(--color-primary, #840132);
        color: white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }
    .btn-submit:hover {
        background: var(--color-primary-dark, #6a132c);
        transform: translateY(-1px);
        box-shadow: 0 8px 16px rgba(132,1,50,0.2);
    }
    .form-disclaimer {
        font-size: 0.7rem;
        color: #64748b;
        text-align: center;
        margin-top: 1.5rem;
    }
    @media (max-width: 560px) {
        .popup-container { width: 95%; }
        .popup-header h2 { font-size: 1.4rem; }
        .popup-form { padding: 1.2rem; }
        .form-row { flex-direction: column; gap: 0; }
        .form-actions { flex-direction: column-reverse; }
        .btn-cancel, .btn-submit { width: 100%; text-align: center; }
    }
`;

    // ----- DOM elements references -----
    let popupElement = null;
    let formElement = null;

    function injectStyles() {
        if (document.getElementById('popup-form-styles')) return;
        const styleTag = document.createElement('style');
        styleTag.id = 'popup-form-styles';
        styleTag.textContent = popupStyles;
        document.head.appendChild(styleTag);
    }

    function buildPopup() {
        if (document.getElementById('popup-form-overlay')) return;
        const div = document.createElement('div');
        div.innerHTML = popupHTML.trim();
        document.body.appendChild(div.firstChild);
        popupElement = document.getElementById('popup-form-overlay');
        formElement = document.getElementById('popup-lead-form');

        // Set dynamic values
        const oidField = document.getElementById('oid');
        if (oidField && config.salesforceOrgId) oidField.value = config.salesforceOrgId;
        const retUrlField = document.getElementById('retURL');
        if (retUrlField) retUrlField.value = config.returnUrl;
        const countryField = document.getElementById('country_code');
        if (countryField) countryField.value = detectCountryCode();
        if (formElement) formElement.action = config.actionUrl;

        // Close events
        const closeBtn = popupElement.querySelector('.popup-close');
        const cancelBtn = popupElement.querySelector('.btn-cancel');
        const closeHandler = () => closePopup();
        if (closeBtn) closeBtn.addEventListener('click', closeHandler);
        if (cancelBtn) cancelBtn.addEventListener('click', closeHandler);
        popupElement.addEventListener('click', (e) => { if (e.target === popupElement) closePopup(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && popupElement && popupElement.style.display === 'flex') closePopup(); });

        if (formElement) formElement.addEventListener('submit', handleFormSubmit);
    }

    function handleFormSubmit(event) {
        event.preventDefault();
        // simple validation
        const firstName = document.getElementById('first_name')?.value.trim();
        const lastName = document.getElementById('last_name')?.value.trim();
        const email = document.getElementById('00N0Y00000QGl8W')?.value.trim();
        if (!firstName) { alert('Please enter your first name.'); document.getElementById('first_name')?.focus(); return; }
        if (!lastName) { alert('Please enter your last name.'); document.getElementById('last_name')?.focus(); return; }
        if (!email) { alert('Please enter your email address.'); document.getElementById('00N0Y00000QGl8W')?.focus(); return; }
        const emailRe = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
        if (!emailRe.test(email)) { alert('Please enter a valid email address.'); document.getElementById('00N0Y00000QGl8W')?.focus(); return; }

        const submitBtn = formElement.querySelector('.btn-submit');
        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Submitting...'; }

        // If using dummy endpoint (httpbin) we just simulate and show success message
        // Real Salesforce submission would just call formElement.submit().
        // For demo with demo action (httpbin), we perform fetch to not redirect but show confirmation.
        if (config.actionUrl === DEMO_ACTION) {
            const formData = new FormData(formElement);
            fetch(config.actionUrl, { method: 'POST', body: formData })
                .then(response => response.json())
                .then(data => {
                    alert("✅ Demo submission successful! (No actual lead created)\n\nYour inquiry has been recorded. In production, this would redirect to thank-you page.");
                    closePopup();
                    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Submit Inquiry'; }
                    if (formElement) formElement.reset();
                })
                .catch(err => {
                    alert("Demo error: " + err.message);
                    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Submit Inquiry'; }
                });
        } else {
            // Real Salesforce Web-to-Lead submission
            formElement.submit();
        }
    }

    function openPopup() {
        if (!popupElement) {
            injectStyles();
            buildPopup();
        }
        if (popupElement) {
            // refresh dynamic values in case timezone changed
            const countryField = document.getElementById('country_code');
            if (countryField) countryField.value = detectCountryCode();
            const oidField = document.getElementById('oid');
            if (oidField && config.salesforceOrgId) oidField.value = config.salesforceOrgId;
            popupElement.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        } else {
            console.error('Popup not initialized');
        }
    }

    function closePopup() {
        if (popupElement) {
            popupElement.style.display = 'none';
            document.body.style.overflow = '';
            if (formElement) {
                const btn = formElement.querySelector('.btn-submit');
                if (btn) { btn.disabled = false; btn.textContent = 'Submit Inquiry'; }
            }
        }
    }

    // Global API
    window.PopupForm = { open: openPopup, close: closePopup, refreshConfig: (cfg) => { config = { ...config, ...cfg }; } };

    // Auto-attach to elements with class 'js-open-popup'
    function bindTriggers() {
        const triggers = document.querySelectorAll('.js-open-popup');
        triggers.forEach(el => {
            el.removeEventListener('click', window._popupTriggerHandler);
            const handler = (e) => { e.preventDefault(); openPopup(); };
            el.addEventListener('click', handler);
            el._popupTriggerHandler = handler;
        });
    }

    // Init when DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            injectStyles();
            buildPopup();
            bindTriggers();
        });
    } else {
        injectStyles();
        buildPopup();
        bindTriggers();
    }
})();