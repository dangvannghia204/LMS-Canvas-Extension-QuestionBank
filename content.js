// ==========================================
// PHẦN 1: GIAO DIỆN NỔI THÔNG MINH (NEW FAB UI) & TOAST / MODAL SYSTEM
// ==========================================
function injectUI() {
    if (!window.location.pathname.match(/\/courses\/\d+/)) return;
    if (document.getElementById('ext-tool-wrapper')) return;

    const style = document.createElement('style');
    style.textContent = `
        /* Khối UI điều khiển chính (New UI) */
        #ext-tool-wrapper { position: fixed; bottom: 25px; right: 25px; z-index: 9999; display: flex; flex-direction: column; align-items: flex-end; gap: 12px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
        #ext-fab-btn { background-color: #008EE2; color: white; border-radius: 30px; padding: 12px 20px; cursor: pointer; box-shadow: 0 4px 15px rgba(0,142,226,0.35); font-weight: 600; font-size: 14px; display: flex; align-items: center; gap: 8px; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); user-select: none; border: none; }
        #ext-fab-btn:hover { background-color: #0077c0; transform: translateY(-3px); box-shadow: 0 6px 20px rgba(0,142,226,0.45); }
        #canvas-csv-importer { display: none; background: #fff; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.2); width: 320px; padding: 20px; border: 1px solid #e2e8f0; transform-origin: bottom right; animation: extFadeIn 0.2s ease-out; }
        @keyframes extFadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        
        .ext-file-upload { display: block; border: 2px dashed #cbd5e0; border-radius: 8px; padding: 18px 10px; text-align: center; background: #f8fafc; cursor: pointer; transition: all 0.2s; margin-bottom: 15px; }
        .ext-file-upload:hover { border-color: #008EE2; background: #ebf8ff; }
        .ext-file-upload input { display: none; }
        .ext-file-name { font-size: 12px; color: #718096; margin-top: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding: 0 10px; }
        
        .ext-main-btn { width: 100%; padding: 12px; border-radius: 8px; font-weight: 600; font-size: 13.5px; border: none; cursor: pointer; color: #fff; transition: background 0.2s, transform 0.1s; box-sizing: border-box; margin-bottom: 10px; }
        .ext-main-btn:active { transform: scale(0.98); }
        .btn-blue { background: #008EE2; } .btn-blue:hover { background: #0077c0; }
        .btn-green { background: #28a745; } .btn-green:hover { background: #218838; }
        .btn-gray { background: #4a5568; } .btn-gray:hover { background: #2d3748; margin-bottom: 0;}

        /* Table & Nút cho Manager */
        .qb-mgr-btn { padding: 6px 12px; border-radius: 4px; border: 1px solid #ccc; background: #f5f5f5; cursor: pointer; font-size: 13px; }
        .qb-mgr-btn:hover { background: #e0e0e0; }
        .qb-mgr-btn-primary { background: #008EE2; color: white; border: none; }
        .qb-mgr-btn-primary:hover { background: #0077c0; }
        .qb-mgr-btn-danger { background: #ee0612; color: white; border: none; }
        .qb-mgr-btn-danger:hover { background: #c4040e; }
        .qb-bank-item { padding: 10px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
        .qb-bank-item:hover { background: #f0f8ff; }
        .qb-bank-active { background: #e6f2ff; border-left: 4px solid #008EE2; }
        .qb-question-item { padding: 10px; border-bottom: 1px solid #eee; display: flex; gap: 10px; align-items: flex-start; }
        .qb-question-text { font-size: 13px; color: #333; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; margin-top: 2px;}
        .quiz-table { width: 100%; border-collapse: collapse; text-align: left; }
        .quiz-table th { padding: 12px; background: #f5f5f5; border-bottom: 2px solid #ddd; color: #333; font-weight: bold; }
        .quiz-table td { padding: 12px; border-bottom: 1px solid #eee; vertical-align: middle; }
        .quiz-table tr:hover { background: #f9f9f9; }

        /* Hệ thống UI Toast Notifications & Modal */
        #ext-toast-container { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 100000; display: flex; flex-direction: column; gap: 10px; pointer-events: none; }
        .ext-toast { padding: 12px 24px; border-radius: 6px; color: white; font-size: 14px; font-weight: bold; box-shadow: 0 4px 12px rgba(0,0,0,0.15); opacity: 0; transition: opacity 0.3s, transform 0.3s; transform: translateY(-20px); text-align: center; min-width: 250px; }
        .ext-toast.show { opacity: 1; transform: translateY(0); }
        .ext-toast-success { background: #28a745; }
        .ext-toast-error { background: #dc3545; }
        .ext-toast-warning { background: #ffc107; color: #333; }
        
        #ext-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 99999; display: none; align-items: center; justify-content: center; }
        .ext-modal { background: #fff; padding: 24px; border-radius: 8px; width: 400px; box-shadow: 0 4px 20px rgba(0,0,0,0.2); font-family: inherit; }
        .ext-modal-title { font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #2D3B45; border-bottom: 1px solid #eee; padding-bottom: 10px; }
        .ext-modal-body { margin-bottom: 20px; font-size: 14px; color: #333; line-height: 1.5; }
        .ext-modal-input { width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; font-size: 14px; outline: none; }
        .ext-modal-input:focus { border-color: #008EE2; }
        .ext-modal-actions { display: flex; justify-content: flex-end; gap: 10px; }
    `;
    document.head.appendChild(style);

    const wrapper = document.createElement('div');
    wrapper.id = 'ext-tool-wrapper';
    wrapper.innerHTML = `
        <div id="canvas-csv-importer">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #edf2f7; padding-bottom: 12px; margin-bottom: 16px;">
                <h3 style="margin:0; font-size:16px; color:#2d3748; font-weight:bold;">Công cụ Canvas LMS</h3>
                <span id="ext-close-panel" style="cursor:pointer; color:#a0aec0; font-size:22px; font-weight:bold; line-height:1;">&times;</span>
            </div>
            
            <label class="ext-file-upload" for="csvFileInput">
                <div style="font-size:28px; margin-bottom:6px;">📁</div>
                <div style="font-size:14px; font-weight:bold; color:#4a5568;">Click để chọn file CSV</div>
                <div id="ext-file-name" class="ext-file-name">Chưa chọn file nào</div>
                <input type="file" id="csvFileInput" accept=".csv">
            </label>

            <button id="btnSync" class="ext-main-btn btn-blue">1. Đồng bộ CSV lên Ngân hàng</button>
            <button id="btnQuiz" class="ext-main-btn btn-green">2. Tạo Quiz rút trích (Full UI)</button>
            <button id="btnOpenManager" class="ext-main-btn btn-gray" style="margin-bottom: 0;">3. Quản lý NH Câu hỏi (Full UI)</button>
            
            <div id="statusMsg" style="margin-top: 12px; font-size: 13px; font-weight: bold; color: #666; text-align:center; min-height: 15px;"></div>
        </div>
        
        <button id="ext-fab-btn">
            <span style="font-size: 18px;">🛠️</span> Công cụ Canvas
        </button>
    `;
    document.body.appendChild(wrapper);

    document.getElementById('ext-fab-btn').addEventListener('click', () => {
        const panel = document.getElementById('canvas-csv-importer');
        panel.style.display = panel.style.display === 'none' || panel.style.display === '' ? 'block' : 'none';
    });

    document.getElementById('ext-close-panel').addEventListener('click', () => {
        document.getElementById('canvas-csv-importer').style.display = 'none';
    });

    document.getElementById('csvFileInput').addEventListener('change', function() {
        const fileNameEl = document.getElementById('ext-file-name');
        if (this.files[0]) {
            fileNameEl.textContent = this.files[0].name;
            fileNameEl.style.color = '#3182ce';
            fileNameEl.style.fontWeight = 'bold';
        } else {
            fileNameEl.textContent = 'Chưa chọn file nào';
            fileNameEl.style.color = '#718096';
            fileNameEl.style.fontWeight = 'normal';
        }
    });

    document.getElementById('btnSync').addEventListener('click', handleSync);
    document.getElementById('btnQuiz').addEventListener('click', openFullQuizUI);
    document.getElementById('btnOpenManager').addEventListener('click', openFullManagerUI);
}

// ----------------- CÁC HÀM UI THÔNG BÁO TÙY CHỈNH -----------------
function showToast(msg, type = 'success') {
    let container = document.getElementById('ext-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'ext-toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `ext-toast ext-toast-${type}`;
    toast.innerText = msg;
    container.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function showCustomPrompt(message, defaultValue) {
    return new Promise((resolve) => {
        let overlay = document.getElementById('ext-modal-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'ext-modal-overlay';
            document.body.appendChild(overlay);
        }
        
        overlay.innerHTML = `
            <div class="ext-modal">
                <div class="ext-modal-title">${message}</div>
                <div class="ext-modal-body">
                    <input type="text" class="ext-modal-input" id="ext-modal-input-val" value="${defaultValue}">
                </div>
                <div class="ext-modal-actions">
                    <button class="qb-mgr-btn" id="ext-modal-cancel">Hủy</button>
                    <button class="qb-mgr-btn qb-mgr-btn-primary" id="ext-modal-ok">Xác nhận</button>
                </div>
            </div>
        `;
        overlay.style.display = 'flex';
        
        const input = document.getElementById('ext-modal-input-val');
        input.focus();
        
        document.getElementById('ext-modal-cancel').onclick = () => { overlay.style.display = 'none'; resolve(null); };
        document.getElementById('ext-modal-ok').onclick = () => { overlay.style.display = 'none'; resolve(input.value); };
    });
}

function showCustomQuestionEditPrompt(qData) {
    return new Promise((resolve) => {
        let overlay = document.getElementById('ext-modal-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'ext-modal-overlay';
            document.body.appendChild(overlay);
        }
        
        const safeText = escapeHtmlAttr(qData.text);
        let answersHtml = '';
        const labels = ['A', 'B', 'C', 'D'];
        
        for(let i = 0; i < 4; i++) {
            let ans = qData.answers[i] || {text: '', isCorrect: false};
            let checked = ans.isCorrect ? 'checked' : '';
            answersHtml += `
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                    <input type="radio" name="edit_q_correct" value="${i}" ${checked} style="cursor:pointer; width:16px; height:16px;">
                    <strong style="width: 20px; font-size:14px;">${labels[i]}:</strong>
                    <input type="text" class="ext-modal-input edit-q-ans" data-idx="${i}" value="${escapeHtmlAttr(ans.text)}" style="flex:1; padding: 6px;">
                </div>
            `;
        }

        overlay.innerHTML = `
            <div class="ext-modal" style="width: 650px; max-width: 95vw;">
                <div class="ext-modal-title">Chỉnh sửa Câu hỏi & Đáp án</div>
                <div class="ext-modal-body">
                    <label style="font-weight:bold; display:block; margin-bottom:5px; color:#2D3B45;">Nội dung câu hỏi:</label>
                    <textarea class="ext-modal-input" id="edit_q_text" style="height: 120px; resize: vertical; margin-bottom: 15px;">${safeText}</textarea>
                    
                    <label style="font-weight:bold; display:block; margin-bottom:5px; color:#2D3B45;">Các đáp án (Chọn Radio cho đáp án ĐÚNG):</label>
                    <div style="background: #f8fafc; padding: 15px; border-radius: 6px; border: 1px solid #e2e8f0;">
                        ${answersHtml}
                    </div>
                </div>
                <div class="ext-modal-actions">
                    <button class="qb-mgr-btn" id="ext-modal-cancel">Hủy</button>
                    <button class="qb-mgr-btn qb-mgr-btn-primary" id="ext-modal-ok">Lưu thay đổi</button>
                </div>
            </div>
        `;
        overlay.style.display = 'flex';
        
        document.getElementById('ext-modal-cancel').onclick = () => { overlay.style.display = 'none'; resolve(null); };
        document.getElementById('ext-modal-ok').onclick = () => { 
            const newText = document.getElementById('edit_q_text').value.trim();
            const correctIdx = parseInt(document.querySelector('input[name="edit_q_correct"]:checked')?.value || '0');
            const ansInputs = document.querySelectorAll('.edit-q-ans');
            
            let newAnswers = [];
            ansInputs.forEach(inp => {
                newAnswers.push({
                    text: inp.value.trim(),
                    isCorrect: parseInt(inp.getAttribute('data-idx')) === correctIdx
                });
            });
            
            overlay.style.display = 'none'; 
            resolve({ text: newText, answers: newAnswers }); 
        };
    });
}

function showCustomConfirm(message) {
    return new Promise((resolve) => {
        let overlay = document.getElementById('ext-modal-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'ext-modal-overlay';
            document.body.appendChild(overlay);
        }
        
        overlay.innerHTML = `
            <div class="ext-modal">
                <div class="ext-modal-title" style="color: #dc3545;">⚠ Xác nhận hành động</div>
                <div class="ext-modal-body">${message}</div>
                <div class="ext-modal-actions">
                    <button class="qb-mgr-btn" id="ext-modal-cancel">Hủy</button>
                    <button class="qb-mgr-btn qb-mgr-btn-danger" id="ext-modal-ok">Đồng ý</button>
                </div>
            </div>
        `;
        overlay.style.display = 'flex';
        
        document.getElementById('ext-modal-cancel').onclick = () => { overlay.style.display = 'none'; resolve(false); };
        document.getElementById('ext-modal-ok').onclick = () => { overlay.style.display = 'none'; resolve(true); };
    });
}

// ==========================================
// PHẦN 2: CÁC HÀM TIỆN ÍCH & API CỐT LÕI
// ==========================================
const getCourseId = () => window.location.pathname.match(/\/courses\/(\d+)/)?.[1];
const getCsrfToken = () => {
    const match = document.cookie.match(/(^|;)\s*_csrf_token=([^;]+)/);
    if (match) return decodeURIComponent(match[2]);
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
};

const setStatus = (msg, color = '#666') => {
    const el = document.getElementById('statusMsg');
    if(el) { el.textContent = msg; el.style.color = color; }
};

function extractBanks(apiResponse) {
    let list = [];
    if (Array.isArray(apiResponse)) list = apiResponse;
    else if (apiResponse && Array.isArray(apiResponse.question_banks)) list = apiResponse.question_banks;
    return list.map(item => item.assessment_question_bank || item.question_bank || item).filter(Boolean);
}

function escapeHtmlAttr(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

async function canvasAPI(endpoint, method = 'GET', data = null) {
    const csrfToken = getCsrfToken();
    const options = { method, headers: { 'Accept': 'application/json', 'X-CSRF-Token': csrfToken } };
    
    if (data && method !== 'GET') {
        const params = new URLSearchParams();
        if (method === 'PUT' || method === 'DELETE') params.append('_method', method);
        for (const key in data) params.append(key, data[key]);
        
        options.body = params.toString();
        options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        
        if (method === 'PUT' || method === 'DELETE') options.method = 'POST'; 
    }
    
    const res = await fetch(endpoint, options);
    const resText = await res.text();
    if (!res.ok) throw new Error(`Lỗi ${res.status}: ${resText.substring(0, 100)}`);
    if (!resText) return null;
    try { return JSON.parse(resText); } catch(e) { return resText; }
}

function parseCSV(text) {
    const lines = text.split(/\r?\n/).filter(l => l.trim() !== '');
    if (lines.length === 0) return [];
    
    function parseCSVLine(line) {
        let result = [];
        let cur = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            let char = line[i];
            if (char === '"') {
                if (inQuotes && line[i + 1] === '"') {
                    cur += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                result.push(cur.trim());
                cur = '';
            } else {
                cur += char;
            }
        }
        result.push(cur.trim());
        return result;
    }

    const headers = parseCSVLine(lines[0]);
    return lines.slice(1).map(line => {
        const values = parseCSVLine(line);
        let obj = {};
        headers.forEach((h, i) => {
            let val = values[i] || '';
            if (val.startsWith('"') && val.endsWith('"')) {
                val = val.substring(1, val.length - 1);
            }
            obj[h] = val;
        });
        return obj;
    });
}

// ==========================================
// PHẦN 3: LOGIC ĐỒNG BỘ CSV
// ==========================================
async function handleSync() {
    const file = document.getElementById('csvFileInput').files[0];
    if (!file) return setStatus('Vui lòng chọn file CSV!', 'red');
    const courseId = getCourseId();
    try {
        setStatus('Đang đồng bộ, vui lòng đợi...', '#008EE2');
        const data = parseCSV(await file.text());
        const grouped = data.reduce((acc, row) => {
            if (!row.Chapter) return acc; 
            if (!acc[row.Chapter]) acc[row.Chapter] = [];
            acc[row.Chapter].push(row);
            return acc;
        }, {});

        const rawBanks = await canvasAPI(`/courses/${courseId}/question_banks`);
        const existingBanks = extractBanks(rawBanks);
        const bankMap = {};
        existingBanks.forEach(b => { if (b.title) bankMap[b.title] = b.id; });

        for (const [chapter, questions] of Object.entries(grouped)) {
            let bankId = bankMap[chapter];
            if (!bankId) {
                const res = await canvasAPI(`/courses/${courseId}/question_banks`, 'POST', {'assessment_question_bank[title]': chapter});
                bankId = res.assessment_question_bank?.id || res.id;
            } else {
                const bankHtml = await (await fetch(`/courses/${courseId}/question_banks/${bankId}`)).text();
                const doc = new DOMParser().parseFromString(bankHtml, "text/html");
                const qIds = Array.from(doc.querySelectorAll('.question')).map(d => d.id.match(/^question_(\d+)$/)?.[1]).filter(Boolean);
                for (const qId of qIds) await canvasAPI(`/courses/${courseId}/question_banks/${bankId}/assessment_questions/${qId}`, 'DELETE');
            }

            for (const row of questions) {
                const options = [{ t: row.OptionA, k: 'A' }, { t: row.OptionB, k: 'B' }, { t: row.OptionC, k: 'C' }, { t: row.OptionD, k: 'D' }];
                let payload = { 'question[question_name]': 'Auto Q', 'question[question_type]': 'multiple_choice_question', 'question[question_text]': row.QuestionText };
                options.forEach((opt, idx) => {
                    if(opt.t) { 
                        payload[`question[answers][${idx}][answer_text]`] = opt.t;
                        payload[`question[answers][${idx}][answer_weight]`] = (row.CorrectOption && opt.k === row.CorrectOption.toUpperCase()) ? 100 : 0;
                    }
                });
                await canvasAPI(`/courses/${courseId}/question_banks/${bankId}/assessment_questions`, 'POST', payload);
            }
        }
        setStatus('✅ Đồng bộ thành công!', '#28a745');
        showToast('Đồng bộ CSV lên Ngân hàng thành công!', 'success');
        
        setTimeout(() => {
            document.getElementById('canvas-csv-importer').style.display = 'none';
            setStatus('', '#666');
        }, 2000);
    } catch (e) { 
        setStatus(`❌ Lỗi: ${e.message}`, 'red'); 
        showToast(`Lỗi đồng bộ: ${e.message}`, 'error');
    }
}

// ==========================================
// PHẦN 4: FULL UI TẠO QUIZ (ĐÃ KHẮC PHỤC LỖI HIỂN THỊ SAI SỐ LƯỢNG)
// ==========================================
async function openFullQuizUI() {
    const canvasContent = document.getElementById('content');
    if (canvasContent) canvasContent.style.display = 'none';

    let quizContainer = document.getElementById('ext-quiz-manager');
    if (!quizContainer) {
        quizContainer = document.createElement('div');
        quizContainer.id = 'ext-quiz-manager';
        quizContainer.style.cssText = 'padding: 24px; background: #fff; min-height: 80vh; margin-top: 10px; border: 1px solid #c7cdd1; border-radius: 4px;';
        const wrapper = document.getElementById('content-wrapper') || document.getElementById('main');
        if (wrapper) wrapper.appendChild(quizContainer);
        
        quizContainer.addEventListener('click', (e) => {
            const target = e.target.closest('[data-action]');
            if (!target) return;
            const action = target.getAttribute('data-action');
            if (action === 'close-quiz') closeFullQuizUI();
            if (action === 'submit-quiz') executeCreateQuiz(target);
        });
    }
    
    quizContainer.style.display = 'block';
    
    quizContainer.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #eee; padding-bottom: 15px; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #2D3B45;">Tạo Bài Kiểm Tra (Quiz) Rút Trích</h2>
            <button data-action="close-quiz" class="qb-mgr-btn">✖ Đóng giao diện này</button>
        </div>
        <div style="background: #fafafa; padding: 15px; border: 1px solid #c7cdd1; border-radius: 6px; margin-bottom: 20px;">
            <label style="font-weight: bold; display: block; margin-bottom: 8px;">Tên bài Quiz:</label>
            <input type="text" id="ext-quiz-title" class="ext-modal-input" placeholder="Ví dụ: Bài Kiểm Tra Giữa Kỳ" value="Bài Kiểm Tra Tổng Hợp">
        </div>
        <div style="border: 1px solid #c7cdd1; border-radius: 6px; background: #fff; padding: 15px;">
            <h4 style="margin-top: 0; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px;">Chọn Ngân hàng câu hỏi để rút trích:</h4>
            <div id="ext-quiz-banks-list" style="max-height: 50vh; overflow-y: auto; text-align: center; color: #666;">Đang quét số lượng câu hỏi thực tế từ hệ thống...</div>
            
            <div style="margin-top: 20px; text-align: right; border-top: 1px solid #eee; padding-top: 15px;">
                <button data-action="close-quiz" class="qb-mgr-btn" style="margin-right: 10px; padding: 8px 16px;">Hủy / Quay lại</button>
                <button data-action="submit-quiz" class="qb-mgr-btn qb-mgr-btn-primary" style="padding: 8px 16px; font-weight: bold;">✔ Xác nhận tạo Quiz</button>
            </div>
        </div>
    `;

    const courseId = getCourseId();
    try {
        const rawBanks = await canvasAPI(`/courses/${courseId}/question_banks`);
        const banks = extractBanks(rawBanks);

        const listEl = document.getElementById('ext-quiz-banks-list');
        if (!banks || banks.length === 0) {
            listEl.innerHTML = '<div style="color: #dc3545; padding: 20px;">Chưa có Ngân hàng câu hỏi nào trong hệ thống!</div>';
            return;
        }

        let bankDetails = [];
        for (const bank of banks) {
            let realCount = bank.assessment_question_count || bank.assessment_questions_count || bank.question_count || 0;
            try {
                const res = await fetch(`/courses/${courseId}/question_banks/${bank.id}`);
                const htmlContent = await res.text();
                const doc = new DOMParser().parseFromString(htmlContent, "text/html");
                // BỘ LỌC CHÍNH XÁC: Loại bỏ các thẻ rác/template của Canvas
                const validQuestions = Array.from(doc.querySelectorAll('.question')).filter(q => q.id && q.id.match(/^question_(\d+)$/));
                realCount = validQuestions.length;
            } catch(err){}
            bankDetails.push({ id: bank.id, title: bank.title || 'Ngân hàng không tên', count: realCount });
        }

        let html = `<table class="quiz-table">
            <thead>
                <tr>
                    <th style="width: 50px; text-align: center;"><input type="checkbox" id="ext-quiz-select-all"></th>
                    <th>Tên Ngân Hàng (Chương)</th>
                    <th style="width: 130px; text-align: center;">Số lượng rút</th>
                    <th style="width: 120px; text-align: center;">Điểm / câu</th>
                </tr>
            </thead>
            <tbody>`;

        bankDetails.forEach(b => {
            const safeTitle = b.title.replace(/"/g, '&quot;');
            
            // Xử lý thông minh cho các Ngân hàng 0 câu hỏi
            const maxCount = b.count;
            const defaultPick = maxCount > 0 ? Math.min(5, maxCount) : 0;
            const minPick = maxCount > 0 ? 1 : 0;
            const disabledAttr = maxCount === 0 ? 'disabled' : '';
            const opacityStyle = maxCount === 0 ? 'opacity: 0.5; pointer-events: none;' : '';
            
            html += `
            <tr style="${opacityStyle}">
                <td style="text-align: center;">
                    <input type="checkbox" class="quiz-bank-checkbox" value="${b.id}" data-title="${safeTitle}" data-max="${maxCount}" ${disabledAttr}>
                </td>
                <td style="font-weight: bold;">
                    ${b.title} <span style="color: #888; font-size: 12px; font-weight: normal; margin-left: 5px;">(Tổng: ${maxCount} câu)</span>
                </td>
                <td style="text-align: center;">
                    <input type="number" id="quiz_pick_${b.id}" value="${defaultPick}" min="${minPick}" max="${maxCount}" class="ext-modal-input" style="width: 75px; padding: 6px; text-align: center;" title="Tối đa: ${maxCount} câu" ${disabledAttr}>
                </td>
                <td style="text-align: center;">
                    <input type="number" id="quiz_pts_${b.id}" value="1" min="0.1" step="0.1" class="ext-modal-input" style="width: 70px; padding: 6px; text-align: center;" ${disabledAttr}>
                </td>
            </tr>`;
        });
        html += `</tbody></table>`;
        listEl.innerHTML = html;

        document.getElementById('ext-quiz-select-all').addEventListener('change', function() {
            const cbs = document.querySelectorAll('.quiz-bank-checkbox:not([disabled])');
            cbs.forEach(cb => cb.checked = this.checked);
        });

    } catch (e) {
        document.getElementById('ext-quiz-banks-list').innerHTML = `<div style="color: red;">Lỗi tải: ${e.message}</div>`;
        showToast(`Lỗi: ${e.message}`, 'error');
    }
}

function closeFullQuizUI() {
    const quizContainer = document.getElementById('ext-quiz-manager');
    if (quizContainer) quizContainer.style.display = 'none';
    const canvasContent = document.getElementById('content');
    if (canvasContent) canvasContent.style.display = 'block';
}

async function executeCreateQuiz(btnElement) {
    const courseId = getCourseId();
    const cbs = document.querySelectorAll('.quiz-bank-checkbox:checked');
    if (cbs.length === 0) return showToast('❌ Vui lòng tích chọn ít nhất 1 Ngân hàng!', 'warning');
    
    // VALIDATION TRƯỚC KHI TẠO QUIZ
    for (const cb of cbs) {
        const bankId = cb.value;
        const bankTitle = cb.getAttribute('data-title');
        const maxLimit = parseInt(cb.getAttribute('data-max') || '9999');
        const pickInput = document.getElementById(`quiz_pick_${bankId}`);
        const pickCount = parseInt(pickInput.value);

        if (isNaN(pickCount) || pickCount <= 0) {
            pickInput.focus();
            return showToast(`❌ Số lượng rút tại "${bankTitle}" phải lớn hơn 0!`, 'warning');
        }
        if (pickCount > maxLimit) {
            pickInput.focus();
            return showToast(`❌ Số lượng rút (${pickCount}) vượt quá tổng số câu thực tế (${maxLimit}) của "${bankTitle}"!`, 'warning');
        }
    }

    const titleInput = document.getElementById('ext-quiz-title').value.trim() || 'Bài Kiểm Tra Tổng Hợp';

    btnElement.innerText = "Đang tạo Quiz...";
    btnElement.disabled = true;

    try {
        showToast('Đang tạo Quiz mới trên Canvas...', 'success');
        
        const quizRes = await fetch(`/api/v1/courses/${courseId}/quizzes`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRF-Token': getCsrfToken()
            },
            body: JSON.stringify({
                quiz: { title: titleInput, quiz_type: 'assignment', published: false }
            })
        });
        
        if (!quizRes.ok) throw new Error("Khởi tạo vỏ bài kiểm tra thất bại.");
        const quiz = await quizRes.json();
        
        for (const cb of cbs) {
            const bankId = parseInt(cb.value); 
            const bankTitle = cb.getAttribute('data-title');
            const pickCount = parseInt(document.getElementById(`quiz_pick_${cb.value}`).value); 
            const pts = parseFloat(document.getElementById(`quiz_pts_${cb.value}`).value); 

            let groupRes = await fetch(`/api/v1/courses/${courseId}/quizzes/${quiz.id}/groups`, {
                method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'X-CSRF-Token': getCsrfToken() },
                body: JSON.stringify({
                    quiz_groups: [{
                        name: `Rút từ ${bankTitle}`, 
                        assessment_question_bank_id: bankId, 
                        pick_count: pickCount, 
                        question_points: pts
                    }]
                })
            });

            if (!groupRes.ok) {
                groupRes = await fetch(`/api/v1/courses/${courseId}/quizzes/${quiz.id}/groups`, {
                    method: 'POST',
                    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'X-CSRF-Token': getCsrfToken() },
                    body: JSON.stringify({
                        quiz_groups: {
                            name: `Rút từ ${bankTitle}`, 
                            assessment_question_bank_id: bankId, 
                            pick_count: pickCount, 
                            question_points: pts
                        }
                    })
                });
            }
            if (!groupRes.ok) throw new Error(`Lỗi liên kết tại Ngân hàng: ${bankTitle}`);
        }
        
        showToast('✅ Tạo Quiz thành công! Đang chuyển hướng...', 'success');
        setTimeout(() => { closeFullQuizUI(); }, 1500);
        
    } catch (e) { 
        showToast(`❌ Lỗi tạo Quiz: ${e.message}`, 'error'); 
    } finally {
        btnElement.innerText = "✔ Xác nhận tạo Quiz";
        btnElement.disabled = false;
    }
}

// ==========================================
// PHẦN 5: FULL UI QUẢN LÝ QUESTION BANKS 
// ==========================================
let mgrBanks = [];
let mgrCurrentBankId = null;

function openFullManagerUI() {
    const canvasContent = document.getElementById('content');
    if (canvasContent) canvasContent.style.display = 'none';

    let mgrContainer = document.getElementById('ext-qb-manager');
    if (!mgrContainer) {
        mgrContainer = document.createElement('div');
        mgrContainer.id = 'ext-qb-manager';
        mgrContainer.style.cssText = 'padding: 24px; background: #fff; min-height: 80vh; margin-top: 10px; border: 1px solid #c7cdd1; border-radius: 4px;';
        const wrapper = document.getElementById('content-wrapper') || document.getElementById('main');
        if (wrapper) wrapper.appendChild(mgrContainer);
        
        mgrContainer.addEventListener('click', handleManagerClicks);
        mgrContainer.addEventListener('change', handleManagerChanges);
    }
    
    mgrContainer.style.display = 'block';
    renderManagerLayout(mgrContainer);
    loadMgrBanks();
}

function handleManagerClicks(e) {
    const target = e.target.closest('[data-action]');
    if (!target) return;

    const action = target.getAttribute('data-action');
    const bankId = target.getAttribute('data-id');
    const title = target.getAttribute('data-title');

    if (action === 'close') closeFullManagerUI();
    if (action === 'create-bank') mgrCreateBank();
    if (action === 'select-bank') mgrSelectBank(bankId, title);
    if (action === 'edit-bank') { e.stopPropagation(); mgrEditBank(bankId, title); }
    if (action === 'delete-bank') { e.stopPropagation(); mgrDeleteBank(bankId); }
    if (action === 'move-questions') mgrMoveQuestions(target);
    
    if (action === 'edit-question') { 
        e.stopPropagation(); 
        const qId = target.getAttribute('data-qid');
        let qData = { text: '', answers: [] };
        try {
            qData = JSON.parse(target.getAttribute('data-qdata') || '{}');
        } catch(err){}
        mgrEditQuestion(qId, qData); 
    }
    if (action === 'delete-question') { e.stopPropagation(); mgrDeleteQuestion(target.getAttribute('data-qid')); }
}

function handleManagerChanges(e) {
    if (e.target.id === 'mgrSelectAll') {
        const cbs = document.querySelectorAll('.mgr-q-checkbox');
        cbs.forEach(cb => cb.checked = e.target.checked);
    }
}

function closeFullManagerUI() {
    document.getElementById('ext-qb-manager').style.display = 'none';
    const canvasContent = document.getElementById('content');
    if (canvasContent) canvasContent.style.display = 'block'; 
}

function renderManagerLayout(container) {
    container.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #eee; padding-bottom: 15px; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #2D3B45;">Quản lý Ngân hàng Câu hỏi (Advanced)</h2>
            <button data-action="close" class="qb-mgr-btn">✖ Đóng giao diện này</button>
        </div>
        <div style="display: flex; gap: 20px;">
            <div style="flex: 1; border: 1px solid #c7cdd1; border-radius: 6px; background: #fafafa; overflow: hidden;">
                <div style="padding: 12px; background: #f5f5f5; border-bottom: 1px solid #c7cdd1; font-weight: bold;">Danh sách Chương / Banks</div>
                <div style="padding: 12px; border-bottom: 1px solid #eee;">
                    <input type="text" id="mgrNewBankName" placeholder="Tên chương mới..." style="width: 65%; padding: 6px;">
                    <button data-action="create-bank" class="qb-mgr-btn qb-mgr-btn-primary">+ Thêm</button>
                </div>
                <div id="mgrBankList" style="max-height: 60vh; overflow-y: auto;">
                    <div style="padding: 15px; text-align: center; color: #666;">Đang tải dữ liệu...</div>
                </div>
            </div>
            <div style="flex: 2; border: 1px solid #c7cdd1; border-radius: 6px; background: #fff; display: flex; flex-direction: column;">
                <div style="padding: 12px; background: #f5f5f5; border-bottom: 1px solid #c7cdd1; font-weight: bold; display: flex; justify-content: space-between;">
                    <span id="mgrSelectedBankTitle">Chưa chọn chương nào</span>
                    <span id="mgrQuestionCount" style="color: #008EE2;"></span>
                </div>
                <div id="mgrActionToolbar" style="padding: 10px; background: #eef7ff; border-bottom: 1px solid #c7cdd1; display: none;">
                    <input type="checkbox" id="mgrSelectAll"> <b>Chọn tất cả</b>
                    <span style="margin-left: 20px;">Di chuyển đến: </span>
                    <select id="mgrMoveTargetBank" style="padding: 4px; width: 200px;"></select>
                    <button data-action="move-questions" class="qb-mgr-btn qb-mgr-btn-primary">Thực hiện chuyển</button>
                </div>
                <div id="mgrQuestionList" style="flex: 1; overflow-y: auto; max-height: 60vh; padding: 10px;">
                    <div style="text-align: center; color: #999; margin-top: 40px;">Hãy chọn một chương bên trái để xem câu hỏi.</div>
                </div>
            </div>
        </div>
    `;
}

async function scanAccurateCountsBackground() {
    const courseId = getCourseId();
    for (const bank of mgrBanks) {
        if (document.getElementById('ext-qb-manager').style.display !== 'block') break; 
        try {
            const res = await fetch(`/courses/${courseId}/question_banks/${bank.id}`);
            const html = await res.text();
            const doc = new DOMParser().parseFromString(html, "text/html");
            // BỘ LỌC CHÍNH XÁC: Loại bỏ các thẻ rác/template của Canvas
            const validQuestions = Array.from(doc.querySelectorAll('.question')).filter(q => q.id && q.id.match(/^question_(\d+)$/));
            const realCount = validQuestions.length;
            
            if (bank.accurate_count !== realCount) {
                bank.accurate_count = realCount;
                renderMgrBankList(); 
            }
        } catch(e) {}
    }
}

async function loadMgrBanks() {
    const courseId = getCourseId();
    try {
        const res = await canvasAPI(`/courses/${courseId}/question_banks`);
        const newBanks = extractBanks(res); 
        newBanks.forEach(nb => {
            const oldBank = mgrBanks.find(ob => ob.id == nb.id);
            if (oldBank && oldBank.accurate_count !== undefined) nb.accurate_count = oldBank.accurate_count;
        });
        
        mgrBanks = newBanks;
        renderMgrBankList();
        scanAccurateCountsBackground();
    } catch (e) { showToast("Lỗi tải danh sách: " + e.message, "error"); }
}

function renderMgrBankList() {
    const listEl = document.getElementById('mgrBankList');
    listEl.innerHTML = '';
    
    if (mgrBanks.length === 0) {
        listEl.innerHTML = '<div style="padding: 15px; text-align: center; color: #888;">Chưa có Ngân hàng câu hỏi nào.</div>';
        return;
    }
    
    const moveTargetEl = document.getElementById('mgrMoveTargetBank');
    if(moveTargetEl) {
        moveTargetEl.innerHTML = mgrBanks.map(b => {
            const t = b.title || 'Ngân hàng không tên';
            return `<option value="${b.id}">${t}</option>`;
        }).join('');
    }

    mgrBanks.forEach(bank => {
        const count = bank.accurate_count !== undefined ? bank.accurate_count : (bank.assessment_question_count || bank.assessment_questions_count || bank.question_count || 0);
        const bankTitle = bank.title || 'Ngân hàng không tên';
        const safeTitle = bankTitle.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        
        const item = document.createElement('div');
        item.className = `qb-bank-item ${mgrCurrentBankId == bank.id ? 'qb-bank-active' : ''}`;
        
        item.innerHTML = `
            <div style="flex: 1;" data-action="select-bank" data-id="${bank.id}" data-title="${safeTitle}">
                <b>${bankTitle}</b> <span style="color:#888; font-size:12px;">(${count} câu)</span>
            </div>
            <div>
                <button class="qb-mgr-btn" style="padding: 3px 8px;" data-action="edit-bank" data-id="${bank.id}" data-title="${safeTitle}">Sửa</button>
                <button class="qb-mgr-btn qb-mgr-btn-danger" style="padding: 3px 8px;" data-action="delete-bank" data-id="${bank.id}">Xóa</button>
            </div>
        `;
        listEl.appendChild(item);
    });
}

async function mgrCreateBank() {
    const title = document.getElementById('mgrNewBankName').value.trim();
    if (!title) return showToast('Vui lòng nhập tên chương!', 'warning');
    try {
        await canvasAPI(`/courses/${getCourseId()}/question_banks`, 'POST', {'assessment_question_bank[title]': title});
        document.getElementById('mgrNewBankName').value = '';
        await loadMgrBanks();
        showToast('Đã thêm chương thành công!', 'success');
    } catch (e) { showToast("Lỗi tạo chương: " + e.message, 'error'); }
}

async function mgrEditBank(bankId, oldTitle) {
    if (!bankId || bankId === 'undefined') return showToast("Lỗi: Không lấy được ID", 'error');
    const decodedOldTitle = oldTitle.replace(/&quot;/g, '"').replace(/\\'/g, "'");
    
    const newTitle = await showCustomPrompt("Nhập tên mới cho chương:", decodedOldTitle);
    
    if (!newTitle || newTitle === decodedOldTitle) return; 
    try {
        await canvasAPI(`/courses/${getCourseId()}/question_banks/${bankId}`, 'PUT', {'assessment_question_bank[title]': newTitle});
        await loadMgrBanks();
        if(mgrCurrentBankId == bankId) document.getElementById('mgrSelectedBankTitle').innerText = `Chương: ${newTitle}`;
        showToast('Đã sửa tên chương thành công!', 'success');
    } catch (e) { showToast("Lỗi sửa: " + e.message, 'error'); }
}

async function mgrDeleteBank(bankId) {
    if (!bankId || bankId === 'undefined') return showToast("Lỗi: Không lấy được ID", 'error');
    
    const isConfirmed = await showCustomConfirm("CẢNH BÁO: Bạn có chắc muốn xóa vĩnh viễn chương này và toàn bộ câu hỏi bên trong?");
    if (!isConfirmed) return;

    try {
        await canvasAPI(`/courses/${getCourseId()}/question_banks/${bankId}`, 'DELETE');
        if (mgrCurrentBankId == bankId) {
            mgrCurrentBankId = null;
            document.getElementById('mgrQuestionList').innerHTML = '<div style="text-align: center; color: #999; margin-top: 40px;">Hãy chọn một chương bên trái để xem câu hỏi.</div>';
            document.getElementById('mgrActionToolbar').style.display = 'none';
            document.getElementById('mgrSelectedBankTitle').innerText = 'Chưa chọn chương nào';
            document.getElementById('mgrQuestionCount').innerText = '';
        }
        await loadMgrBanks();
        showToast('Đã xóa chương thành công!', 'success');
    } catch (e) { showToast("Lỗi xóa: " + e.message, 'error'); }
}

async function mgrSelectBank(bankId, safeTitle) {
    if (!bankId || bankId === 'undefined') return;
    mgrCurrentBankId = bankId;
    renderMgrBankList(); 
    
    const displayTitle = safeTitle.replace(/&quot;/g, '"').replace(/\\'/g, "'");
    document.getElementById('mgrSelectedBankTitle').innerText = `Chương: ${displayTitle}`;
    const listEl = document.getElementById('mgrQuestionList');
    listEl.innerHTML = '<div style="text-align:center; margin-top:20px;">Đang tải câu hỏi...</div>';
    document.getElementById('mgrActionToolbar').style.display = 'none';

    try {
        const htmlRes = await fetch(`/courses/${getCourseId()}/question_banks/${bankId}`);
        const html = await htmlRes.text();
        const doc = new DOMParser().parseFromString(html, "text/html");
        
        const questions = Array.from(doc.querySelectorAll('.question')).map(q => {
            const idMatch = q.id.match(/^question_(\d+)$/);
            if (!idMatch) return null;
            let text = q.querySelector('.question_text')?.innerText.trim() || '(Không có nội dung)';
            
            let answers = [];
            const answerNodes = q.querySelectorAll('.answer');
            answerNodes.forEach(a => {
                let ansText = a.querySelector('.answer_text')?.innerText.trim() || '';
                if (!ansText) ansText = a.querySelector('.answer_html')?.innerText.trim() || '';
                if (!ansText) ansText = a.innerText.replace(/Correct Answer|You Answered/g, '').trim();
                
                let isCorrect = a.classList.contains('correct_answer') || a.classList.contains('correct');
                answers.push({text: ansText, isCorrect: isCorrect});
            });
            
            while(answers.length < 4) {
                answers.push({text: '', isCorrect: answers.length === 0 && !answers.some(x => x.isCorrect)});
            }
            answers = answers.slice(0, 4);

            return { id: idMatch[1], text: text, answers: answers };
        }).filter(Boolean);

        const bank = mgrBanks.find(b => b.id == bankId);
        if (bank) {
            bank.accurate_count = questions.length;
            renderMgrBankList();
        }

        document.getElementById('mgrQuestionCount').innerText = `Tổng: ${questions.length} câu`;

        if (questions.length === 0) {
            listEl.innerHTML = '<div style="text-align:center; color:#888; margin-top:20px;">Chương này hiện chưa có câu hỏi nào.</div>';
            return;
        }

        listEl.innerHTML = '';
        questions.forEach(q => {
            const safeDataAttr = escapeHtmlAttr(JSON.stringify({text: q.text, answers: q.answers}));
            listEl.innerHTML += `
                <div class="qb-question-item">
                    <div style="padding-top:2px;">
                        <input type="checkbox" class="mgr-q-checkbox" value="${q.id}">
                    </div>
                    <div style="flex: 1;">
                        <div style="color: #888; font-size: 11px;">ID: ${q.id}</div>
                        <div class="qb-question-text">${q.text}</div>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:5px; margin-left: 10px;">
                        <button class="qb-mgr-btn" style="padding: 4px 8px; font-size:11px;" data-action="edit-question" data-qid="${q.id}" data-qdata="${safeDataAttr}">Sửa</button>
                        <button class="qb-mgr-btn qb-mgr-btn-danger" style="padding: 4px 8px; font-size:11px;" data-action="delete-question" data-qid="${q.id}">Xóa</button>
                    </div>
                </div>
            `;
        });
        
        document.getElementById('mgrSelectAll').checked = false;
        document.getElementById('mgrActionToolbar').style.display = 'block';

        const targetDropdown = document.getElementById('mgrMoveTargetBank');
        Array.from(targetDropdown.options).forEach(opt => {
            opt.style.display = (opt.value == bankId) ? 'none' : 'block';
        });
        if(targetDropdown.value == bankId) targetDropdown.selectedIndex = targetDropdown.options.length > 1 ? (targetDropdown.selectedIndex === 0 ? 1 : 0) : -1;

    } catch (e) { listEl.innerHTML = `<div style="color:red; text-align:center;">Lỗi tải: ${e.message}</div>`; }
}

async function mgrMoveQuestions(btnElement) {
    const checked = Array.from(document.querySelectorAll('.mgr-q-checkbox:checked')).map(cb => cb.value);
    if (checked.length === 0) return showToast("Vui lòng chọn ít nhất 1 câu hỏi!", "warning");
    
    const targetBankId = document.getElementById('mgrMoveTargetBank').value;
    if (!targetBankId || targetBankId == mgrCurrentBankId) return showToast("Vui lòng chọn một chương đích hợp lệ!", "warning");

    btnElement.innerText = "Đang chuyển...";
    btnElement.disabled = true;

    try {
        let payload = { 'assessment_question_bank_id': targetBankId, 'multiple_questions': '1', 'move': '1' };
        checked.forEach(id => { payload[`questions[${id}]`] = '1'; });

        await canvasAPI(`/courses/${getCourseId()}/question_banks/${mgrCurrentBankId}/move_questions`, 'POST', payload);
        
        showToast(`Đã di chuyển thành công ${checked.length} câu hỏi!`, "success");
        
        const sourceBank = mgrBanks.find(b => b.id == mgrCurrentBankId);
        const destBank = mgrBanks.find(b => b.id == targetBankId);
        if (sourceBank && sourceBank.accurate_count !== undefined) sourceBank.accurate_count = Math.max(0, sourceBank.accurate_count - checked.length);
        if (destBank) destBank.accurate_count = (destBank.accurate_count !== undefined ? destBank.accurate_count : (destBank.assessment_question_count || 0)) + checked.length;

        await loadMgrBanks(); 
        const currentBankTitleStr = document.getElementById('mgrSelectedBankTitle').innerText.replace('Chương: ', '');
        const safeTitleToReload = currentBankTitleStr.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        mgrSelectBank(mgrCurrentBankId, safeTitleToReload); 
        
    } catch (e) {
        showToast("Lỗi khi di chuyển: " + e.message, "error");
    } finally {
        btnElement.innerText = "Thực hiện chuyển";
        btnElement.disabled = false;
    }
}

async function mgrDeleteQuestion(qId) {
    if (!qId) return;
    const isConfirmed = await showCustomConfirm("Bạn có chắc muốn xóa vĩnh viễn câu hỏi này khỏi hệ thống?");
    if (!isConfirmed) return;

    try {
        await canvasAPI(`/courses/${getCourseId()}/question_banks/${mgrCurrentBankId}/assessment_questions/${qId}`, 'DELETE');
        showToast('Đã xóa câu hỏi thành công!', 'success');
        
        const bank = mgrBanks.find(b => b.id == mgrCurrentBankId);
        if (bank && bank.accurate_count !== undefined && bank.accurate_count > 0) {
            bank.accurate_count--;
        }
        
        const currentBankTitleStr = document.getElementById('mgrSelectedBankTitle').innerText.replace('Chương: ', '');
        const safeTitleToReload = currentBankTitleStr.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        mgrSelectBank(mgrCurrentBankId, safeTitleToReload);
        
    } catch (e) {
        showToast("Lỗi xóa câu hỏi: " + e.message, 'error');
    }
}

async function mgrEditQuestion(qId, qData) {
    if (!qId || !qData) return;
    
    const newData = await showCustomQuestionEditPrompt(qData);
    if (!newData) return; 
    
    try {
        let payload = {
            'question[question_text]': newData.text,
            'question[question_type]': 'multiple_choice_question'
        };
        
        newData.answers.forEach((ans, idx) => {
            if (ans.text) { 
                payload[`question[answers][${idx}][answer_text]`] = ans.text;
                payload[`question[answers][${idx}][answer_weight]`] = ans.isCorrect ? 100 : 0;
            }
        });

        await canvasAPI(`/courses/${getCourseId()}/question_banks/${mgrCurrentBankId}/assessment_questions/${qId}`, 'PUT', payload);
        showToast('Đã cập nhật câu hỏi và đáp án!', 'success');
        
        const currentBankTitleStr = document.getElementById('mgrSelectedBankTitle').innerText.replace('Chương: ', '');
        const safeTitleToReload = currentBankTitleStr.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        mgrSelectBank(mgrCurrentBankId, safeTitleToReload);
    } catch (e) {
        showToast("Lỗi cập nhật câu hỏi: " + e.message, 'error');
    }
}

setInterval(injectUI, 2000);
injectUI();