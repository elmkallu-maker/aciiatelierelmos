// HELPER: show notification
function showNotification(message) {
    const box = document.getElementById('notification');
    box.textContent = message;
    box.classList.add('show');
    setTimeout(() => box.classList.remove('show'), 2500);
}

// ASCII generator core
function generateAscii(text, style, options = {}) {
    const clean = text.trim();
    if (!clean) return '';

    if (style === 'terminal') {
        let header = '';
        if (options.timestamp) {
            const now = new Date();
            const iso = now.toISOString().replace('T', ' ').slice(0, 19);
            header = `> ${iso}\n`;
        }
        return `${header}> ${clean}\n> DIGITAL HEIST MODE_`;
    }

    if (style === 'frame') {
        const len = clean.length + 4;
        const border = '#'.repeat(len);
        return `${border}\n# ${clean} #\n${border}`;
    }

    if (style === 'glitch') {
        const glitched = clean
            .toUpperCase()
            .split('')
            .map((ch, i) => (i % 2 === 0 ? ch : ch + ' '))
            .join('');
        return `:: ${glitched} ::\n~~ SIGNAL NOISE ~~`;
    }

    return clean;
}

// DOM wiring
window.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    const styleSelect = document.getElementById('styleSelect');
    const outputAscii = document.getElementById('outputAscii');

    const generateBtn = document.getElementById('generateBtn');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const clearBtn = document.getElementById('clearBtn');

    const emailInput = document.getElementById('emailInput');
    const saveEmailBtn = document.getElementById('saveEmailBtn');
    const timestampCheckbox = document.getElementById('timestampCheckbox');

    // Load saved email if exists
    const savedEmail = localStorage.getItem('elmo_ascii_email');
    if (savedEmail) {
        emailInput.value = savedEmail;
    }

    generateBtn.addEventListener('click', () => {
        const text = inputText.value;
        const style = styleSelect.value;
        const useTimestamp = timestampCheckbox && timestampCheckbox.checked;
        const ascii = generateAscii(text, style, { timestamp: useTimestamp });
        outputAscii.textContent = ascii || '[ no output yet – type something above ]';
    });

    copyBtn.addEventListener('click', async () => {
        const content = outputAscii.textContent.trim();
        if (!content) {
            showNotification('Nothing to copy.');
            return;
        }
        try {
            await navigator.clipboard.writeText(content);
            showNotification('ASCII copied to clipboard.');
        } catch (e) {
            showNotification('Clipboard failed – copy manually.');
        }
    });

    downloadBtn.addEventListener('click', () => {
        const content = outputAscii.textContent.trim();
        if (!content) {
            showNotification('Nothing to download.');
            return;
        }
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const ts = new Date().toISOString().split('T')[0];
        a.href = url;
        a.download = `elmos_ascii_${ts}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showNotification('ASCII .txt downloaded.');
    });

    clearBtn.addEventListener('click', () => {
        inputText.value = '';
        outputAscii.textContent = '';
    });

    saveEmailBtn.addEventListener('click', () => {
        const email = emailInput.value.trim();
        if (!email) {
            showNotification('Empty email not saved.');
            return;
        }
        localStorage.setItem('elmo_ascii_email', email);
        showNotification('Email saved locally.');
    });
});
