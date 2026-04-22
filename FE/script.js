// 탭 전환 로직
function switchTab(name, btn) {
    document.querySelectorAll('.tab-panel').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    
    document.getElementById('panel-' + name).classList.add('active');
    btn.classList.add('active');

    const titleSpan = document.querySelector('h1 span');
    titleSpan.className = (name === 'analyze') ? 'theme-analyze' : 'theme-ocr';
}

/**
 * UI 이미지 업로드 및 미리보기 처리용 공통 모듈
 * 드래그 앤 드롭, 클릭 업로드, 파일 정보 표시 및 미리보기 기능
 * 
 * @param {string} zoneId - 파일을 드롭하거나 클릭할 영역의 HTML ID (Drop Zone)
 * @param {string} inputId - 실제 파일 선택을 담당하는 hidden input의 HTML ID
 * @param {string} previewImgId - 선택된 이미지를 보여줄 <img> 태그의 HTML ID
 * @param {string} previewNameId - 파일 이름과 크기를 표시할 요소의 HTML ID
 * @param {string} previewWrapId - 미리보기 영역 전체를 감싸는 컨테이너의 HTML ID (파일 선택 시 display 처리)
 * 
 * @returns {function(): File|null} 현재 선택된 File 객체를 반환하는 getter 함수 반환
 */
function setupUpload(zoneId, inputId, previewImgId, previewNameId, previewWrapId) {
    const zone = document.getElementById(zoneId);
    const input = document.getElementById(inputId);
    let selectedFile = null;

    zone.addEventListener('click', () => input.click());
    
    const handleFile = (file) => {
        if (!file) return;
        selectedFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById(previewImgId).src = e.target.result;
            document.getElementById(previewNameId).textContent = `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
            document.getElementById(previewWrapId).style.display = 'block';
            zone.classList.add('compact');
        };
        reader.readAsDataURL(file);
    };

    input.addEventListener('change', (e) => handleFile(e.target.files[0]));
    
    zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.style.borderColor = "var(--accent-orange)"; });
    zone.addEventListener('dragleave', () => { zone.style.borderColor = ""; });
    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.style.borderColor = "";
        handleFile(e.dataTransfer.files[0]);
    });

    return () => selectedFile;
}

const getAnalyzeFile = setupUpload('analyzeUploadZone', 'analyzeFileInput', 'analyzePreviewImg', 'analyzePreviewName', 'analyzePreviewWrap');
const getOcrFile = setupUpload('ocrUploadZone', 'ocrFileInput', 'ocrPreviewImg', 'ocrPreviewName', 'ocrPreviewWrap');

// UI 초기화 및 로딩 제어
function toggleLoading(prefix, isLoading) {
    const loadingBox = document.getElementById(`${prefix}Loading`);
    const resultContent = document.getElementById(`${prefix}ResultContent`);
    const btn = document.getElementById(`${prefix}Btn`);
    const errorBox = document.getElementById(`${prefix}Error`);

    if (isLoading) {
        loadingBox.style.display = 'flex';
        resultContent.style.display = 'none';
        errorBox.style.display = 'none';
        btn.disabled = true;
    } else {
        loadingBox.style.display = 'none';
        btn.disabled = false;
    }
}

async function runAnalyze() {
    const file = getAnalyzeFile();
    const question = document.getElementById('analyzeQuestion').value.trim();

    if (!file) return alert('이미지를 선택해주세요.');
    
    toggleLoading('analyze', true);
    
    const formData = new FormData();
    formData.append('image', file);
    formData.append('question', question);

    try {
        const res = await fetch('http://localhost:3000/api/analyze', { method: 'POST', body: formData });
        const data = await res.json();

        if (data.success) {
            document.getElementById('analyzeResultMeta').innerHTML = `<span class="badge">Model: ${data.model}</span>`;
            document.getElementById('analyzeResultQuestion').textContent = data.question;
            document.getElementById('analyzeResultAnswer').textContent = data.answer;
            document.getElementById('analyzeResultContent').style.display = 'block';
        } else {
            throw new Error(data.message);
        }
    } catch (err) {
        showError('analyzeError', err.message);
    } finally {
        toggleLoading('analyze', false);
    }
}

async function runOcr() {
    const file = getOcrFile();
    if (!file) return alert('이미지를 선택해주세요.');

    toggleLoading('ocr', true);

    const formData = new FormData();
    formData.append('image', file);

    try {
        const res = await fetch('http://localhost:3000/api/ocr', { method: 'POST', body: formData });
        const data = await res.json();

        if (data.success) {
            document.getElementById('ocrResultMeta').innerHTML = `<span class="badge">Model: ${data.model}</span>`;
            document.getElementById('ocrResultText').textContent = data.extracted_text;
            document.getElementById('ocrResultContent').style.display = 'block';
        } else {
            throw new Error(data.message);
        }
    } catch (err) {
        showError('ocrError', err.message);
    } finally {
        toggleLoading('ocr', false);
    }
}

function showError(id, msg) {
    const el = document.getElementById(id);
    el.textContent = `❌ 오류: ${msg}`;
    el.style.display = 'block';
}