const API_BASE = 'http://localhost:3001';

document.addEventListener('DOMContentLoaded', () => {
    const uploadForm     = document.getElementById('upload-form');
    const playerIgn      = document.getElementById('player-ign');
    const musicFile      = document.getElementById('music-file');
    const dropZone       = document.getElementById('drop-zone');
    const fileNameDisplay = document.getElementById('file-name');
    const uploadStatus   = document.getElementById('upload-status');
    const btnUpload      = document.getElementById('btn-upload');
    const progressContainer = document.getElementById('progress-container');
    const progressBar       = document.getElementById('progress-bar');
    const progressText      = document.getElementById('progress-text');

    const musicList  = document.getElementById('music-list');
    const btnRefresh = document.getElementById('btn-refresh');
    
    const btnDeleteAll       = document.getElementById('btn-delete-all');
    const deleteModal        = document.getElementById('delete-modal');
    const deletePassword     = document.getElementById('delete-password');
    const btnDeleteConfirm   = document.getElementById('btn-delete-confirm');
    const btnDeleteCancel    = document.getElementById('btn-delete-cancel');
    const deleteError        = document.getElementById('delete-error');



    fetchMusicList();

    dropZone.addEventListener('click', () => musicFile.click());

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('active');
    });

    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('active'));

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('active');
        if (e.dataTransfer.files.length) {
            musicFile.files = e.dataTransfer.files;
            updateFileName();
        }
    });

    musicFile.addEventListener('change', updateFileName);

    function updateFileName() {
        if (musicFile.files.length) {
            fileNameDisplay.textContent = musicFile.files[0].name;
            fileNameDisplay.classList.add('text-primary');
        } else {
            fileNameDisplay.textContent = 'Click to browse or drag & drop MP3';
            fileNameDisplay.classList.remove('text-primary');
        }
    }

    uploadForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!musicFile.files.length) {
            return showStatus('Please select an MP3 file', 'error');
        }

        const formData = new FormData();
        formData.append('ign', playerIgn.value);
        formData.append('music', musicFile.files[0]);

        btnUpload.disabled = true;
        btnUpload.textContent = 'UPLOADING...';
        showStatus('Uploading...', 'success');
        
        progressContainer.classList.remove('hidden');
        progressBar.style.width = '0%';
        progressText.textContent = '0%';

        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${API_BASE}/api/upload-music`, true);
        xhr.timeout = 300000;

        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
                const percent = Math.round((e.loaded / e.total) * 100);
                progressBar.style.width = percent + '%';
                progressText.textContent = percent + '%';
            }
        };

        xhr.onload = () => {
            btnUpload.disabled = false;
            btnUpload.textContent = 'START UPLOAD';
            progressContainer.classList.add('hidden');

            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const data = JSON.parse(xhr.responseText);
                    if (data.ok) {
                        showStatus('Upload successful!', 'success');
                        uploadForm.reset();
                        updateFileName();
                        fetchMusicList();
                    } else {
                        showStatus(data.error || 'Upload failed', 'error');
                    }
                } catch (e) {
                    showStatus('Invalid response from server', 'error');
                }
            } else {
                showStatus('Upload failed with status: ' + xhr.status, 'error');
            }
        };

        xhr.onerror = () => {
            btnUpload.disabled = false;
            btnUpload.textContent = 'START UPLOAD';
            progressContainer.classList.add('hidden');
            showStatus('Connection error — is the server running?', 'error');
        };

        xhr.ontimeout = () => {
            btnUpload.disabled = false;
            btnUpload.textContent = 'START UPLOAD';
            progressContainer.classList.add('hidden');
            showStatus('Upload timed out', 'error');
        };

        xhr.send(formData);
    });

    async function fetchMusicList() {
        try {
            const response = await fetch(`${API_BASE}/api/music`);
            const data = await response.json();
            renderMusic(data);
        } catch (err) {
            musicList.innerHTML = '<p class="col-span-full text-center text-on-surface-variant">Failed to load music list. Is the server running?</p>';
        }
    }

    function renderMusic(items) {
        if (!items || items.length === 0) {
            musicList.innerHTML = '<p style="color:var(--muted);text-align:center;grid-column:1/-1;padding:3rem 0;">No music uploaded yet. Be the first!</p>';
            return;
        }

        const sortedItems = [...items].sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));

        musicList.innerHTML = sortedItems.map(item => `
            <div class="music-card">
                <div class="card-info">
                    <span class="player-tag">${escapeHtml(item.ign)}</span>
                    <h3 title="${escapeHtml(item.originalName)}">${escapeHtml(item.originalName.replace(/\.mp3$/i, ''))}</h3>
                </div>
                <div class="audio-controls">
                    <button class="btn-play" onclick="togglePlay('${API_BASE}${item.url}', this)" title="Play Preview">
                        <span class="material-symbols-outlined">play_arrow</span>
                    </button>
                    <button class="btn-download" onclick="requestDownload('${escapeHtml(item.filename)}', '${escapeHtml(item.originalName)}')" title="Download MP3">
                        <span class="material-symbols-outlined">download</span>
                    </button>
                    <span class="card-date">${new Date(item.uploadDate).toLocaleDateString()}</span>
                </div>
            </div>
        `).join('');
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    btnRefresh.addEventListener('click', fetchMusicList);

    btnDeleteAll.addEventListener('click', () => {
        deleteError.classList.add('hidden');
        deletePassword.value = '';
        deleteModal.classList.remove('hidden');
        setTimeout(() => deletePassword.focus(), 50);
    });

    btnDeleteCancel.addEventListener('click', closeDeleteModal);

    deleteModal.addEventListener('click', (e) => {
        if (e.target === deleteModal) closeDeleteModal();
    });

    deletePassword.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') btnDeleteConfirm.click();
    });

    btnDeleteConfirm.addEventListener('click', async () => {
        const password = deletePassword.value.trim();
        if (!password) {
            deleteError.textContent = 'Please enter the access code';
            deleteError.classList.remove('hidden');
            return;
        }

        btnDeleteConfirm.disabled = true;
        btnDeleteConfirm.textContent = 'DELETING...';

        try {
            const res = await fetch(`${API_BASE}/api/delete-all`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            const data = await res.json();

            if (data.ok) {
                closeDeleteModal();
                fetchMusicList();
            } else {
                deleteError.textContent = data.error || 'Invalid access code. Try again.';
                deleteError.classList.remove('hidden');
            }
        } catch (err) {
            deleteError.textContent = 'Server error — is the backend running?';
            deleteError.classList.remove('hidden');
        } finally {
            btnDeleteConfirm.disabled = false;
            btnDeleteConfirm.textContent = 'DELETE';
        }
    });

    function closeDeleteModal() {
        deleteModal.classList.add('hidden');
    }

    function showStatus(msg, type) {
        uploadStatus.textContent = msg;
        uploadStatus.className = `mb-4 p-4 text-sm font-headline uppercase tracking-wider ${type}`;
        uploadStatus.classList.remove('hidden');
        setTimeout(() => uploadStatus.classList.add('hidden'), 5000);
    }

    window.requestDownload = async (filename, originalName) => {
        try {
            const res = await fetch(`${API_BASE}/api/download/${encodeURIComponent(filename)}`);

            if (!res.ok) {
                alert('Download failed. File may have been removed.');
                return;
            }

            const blob = await res.blob();
            const url  = URL.createObjectURL(blob);
            const a    = document.createElement('a');
            a.href     = url;
            a.download = originalName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            alert('Download error — is the backend running?');
        }
    };
});

let currentAudio = null;
let currentBtn   = null;

window.togglePlay = (url, btn) => {
    const icon = btn.querySelector('.material-symbols-outlined');

    if (currentAudio && currentAudio.src === url) {
        if (currentAudio.paused) {
            currentAudio.play();
            icon.textContent = 'pause';
            btn.classList.add('playing');
        } else {
            currentAudio.pause();
            icon.textContent = 'play_arrow';
            btn.classList.remove('playing');
        }
    } else {
        if (currentAudio) {
            currentAudio.pause();
            if (currentBtn) {
                currentBtn.querySelector('.material-symbols-outlined').textContent = 'play_arrow';
                currentBtn.classList.remove('playing');
            }
        }

        currentAudio = new Audio(url);
        currentBtn   = btn;
        currentAudio.play();
        icon.textContent = 'pause';
        btn.classList.add('playing');

        currentAudio.onended = () => {
            icon.textContent = 'play_arrow';
            btn.classList.remove('playing');
        };
    }
};
