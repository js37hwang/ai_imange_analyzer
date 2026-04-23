----
🚀 AI Image Analyzer (feat. 바이브 코딩)
이 프로젝트는 **Gemini(Google AI)** 와 함께 **'바이브 코딩'** 으로 진행된 AI 기반 이미지 분석 및 OCR 웹 어플리케이션입니다. 로컬 LLM(Ollama)과 클라우드 모델(Gemini), 그리고 전용 OCR 모델을 결합하여 강력한 이미지 분석 기능을 제공합니다.
----

## 🛠 주요 기능
1. Multi-Model Image Analysis:

- Local Model (Ollama): 로컬에 설치된 모델(gemma4 등)을 이용한 보안 중심 분석.
- Cloud Model (Gemini): 최신 Gemini-1.5-flash 모델을 이용한 고성능 이미지 분석.

2. Dedicated OCR: Chandra 모델을 로컬로 불러와 이미지 내 텍스트를 정밀하게 추출합니다.

3. History Management: 모든 분석 요청과 답변, 사용 모델 정보는 사용자의 로컬 MySQL 데이터베이스에 자동으로 기록됩니다.

----

## 📂 프로젝트 구조

```
AI_IMAGE_ANALYZER/
├── BE/
│   ├── codeset/
│   │   ├── services/
│   │   │   ├── analyze_gemini.ipynb  # Gemini 분석 서버 (8001)
│   │   │   └── ocr_chandra.ipynb     # OCR 전용 서버 (8002)
│   │   ├── database.py               # MySQL 연결 및 저장 로직
│   │   └── main.ipynb                # 메인 게이트웨이 서버 (3000)
│   ├── config/
│   │   └── .env                      # API Key 및 DB 설정
│   └── dataset/                      # 테스트 이미지 및 업로드 경로
├── FE/                               # 프론트엔드 (HTML, JS, CSS)
└── requirements.txt                  # 필요 라이브러리 목록
```

----

## 🏃‍♂️ 실행 방법

1. 가상환경 활성화 및 라이브러리 설치

``` pwershell
# 프로젝트 루트 이동
cd AI_IMAGE_ANALYZER

# 가상환경 활성화
(Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned) ; (& .\.venv\Scripts\Activate.ps1)

# 라이브러리 설치
pip install -r requirements.txt
```

2. 서버 실행 순서 (Jupyter Notebook)

- `analyze_gemini.ipynb` 실행 (Port: 8001)
- `ocr_chandra.ipynb` 실행 (Port: 8002)
- `main.ipynb 실행` (Port: 3000)

3. 프론트엔드 접속

- `FE/index.html`을 라이브 서버 등으로 실행하여 접속합니다.

----

## 🔍 트러블슈팅 (Troubleshooting)

⚠️ "갑자기 CORS 에러가 나요!"
분명 코드는 맞는데 브라우저에서 CORS 에러가 발생한다면, 이전 서버 프로세스가 제대로 종료되지 않아 포트가 충돌했을 가능성이 매우 높습니다. 서버가 정상 응답을 주지 못하면 브라우저는 이를 보안 오류(CORS)로 표시합니다.

이럴 땐 당황하지 말고 아래 명령어로 점유된 포트를 강제 종료한 뒤 서버를 재시작하세요.

1. 포트를 점유한 범인(PID) 찾기

``` powershell
netstat -ano | findstr :3000
netstat -ano | findstr :8001
netstat -ano | findstr :8002
```

2. 프로세스 죽이기

``` powershell
# 위에서 찾은 PID 번호를 입력 (예: 12345)
taskkill /f /pid 12345
```
-----

## ✍️ 비고
본 프로젝트는 Gemini와 함께 실시간 질의응답을 통해 문제를 해결하며 완성한 **'바이브 코딩'**의 결과물입니다.

모든 데이터는 로컬 DB에 안전하게 보관됩니다.

-----
