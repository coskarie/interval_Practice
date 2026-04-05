const canvas = document.getElementById('staffCanvas');
const ctx = canvas.getContext('2d');
const input = document.getElementById('answerInput');
const resultDisplay = document.getElementById('resultMessage');

let currentAnswer = "";

// 5px 단위로 정밀 조정한 음표 데이터
// y값이 110, 100, 90, 80, 70이면 '줄', 그 사이(105, 95...)면 '칸'입니다.
const notes = [
    { name: "도(C4)", y: 130, semitone: 0, ledger: true },  // 가온 도 (덧줄)
    { name: "레(D4)", y: 125, semitone: 2, ledger: false }, // 칸
    { name: "미(E4)", y: 120, semitone: 4, ledger: false }, // 줄 (가장 아래)
    { name: "파(F4)", y: 115, semitone: 5, ledger: false }, // 칸
    { name: "솔(G4)", y: 110, semitone: 7, ledger: false }, // 줄
    { name: "라(A4)", y: 105, semitone: 9, ledger: false }, // 칸
    { name: "시(B4)", y: 100, semitone: 11, ledger: false },// 줄
    { name: "도(C5)", y: 95,  semitone: 12, ledger: false },// 칸
    { name: "레(D5)", y: 90,  semitone: 14, ledger: false },// 줄
    { name: "미(E5)", y: 85,  semitone: 16, ledger: false },// 칸
    { name: "파(F5)", y: 80,  semitone: 17, ledger: false } // 줄 (가장 위)
];

const intervals = {
    0: "완전1도", 1: "단2도", 2: "장2도", 3: "단3도", 4: "장3도",
    5: "완전4도", 6: "증4도", 7: "완전5도", 8: "단6도", 9: "장6도",
    10: "단7도", 11: "장7도", 12: "완전8도"
};

input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});

function drawStaff() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;

    // 오선 그리기 (높이 80~120 범위로 조정)
    for (let i = 0; i < 5; i++) {
        let y = 80 + (i * 10); 
        ctx.beginPath(); ctx.moveTo(50, y); ctx.lineTo(450, y); ctx.stroke();
    }

    // 높은음자리표 위치 (오선 위치 변경에 따른 y좌표 조정)
    ctx.font = '50px serif';
    ctx.fillStyle = "black";
    ctx.fillText('𝄞', 55, 122); 
}

function drawNote(x, y, hasLedger) {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.ellipse(x, y, 6, 4.5, Math.PI / -4, 0, Math.PI * 2);
    ctx.fill();

    // 기둥 그리기 (보통 3옥타브 시(B4) 이상은 기둥을 아래로 그리지만, 우선 위로 통일)
    ctx.beginPath();
    ctx.moveTo(x + 5, y);
    ctx.lineTo(x + 5, y - 35);
    ctx.stroke();

    // 덧줄 그리기 (y값이 130인 '도'에 해당)
    if (hasLedger) {
        ctx.beginPath(); ctx.moveTo(x - 12, y); ctx.lineTo(x + 12, y); ctx.stroke();
    }
}

function nextQuestion() {
    drawStaff();
    resultDisplay.innerText = "";
    resultDisplay.className = "";
    input.value = "";
    input.focus();

    // 랜덤 음표 2개 추출
    let idx1 = Math.floor(Math.random() * notes.length);
    let idx2 = Math.floor(Math.random() * notes.length);
    
    // 두 음 정렬
    let low = notes[Math.min(idx1, idx2)];
    let high = notes[Math.max(idx1, idx2)];

    drawNote(180, low.y, low.ledger);
    drawNote(260, high.y, high.ledger);

    // 반음 차 계산
    let diff = high.semitone - low.semitone;
    
    // 옥타브를 넘어가면(12 초과) 우선 완전8도 처리하거나 범위 제한
    if (diff > 12) diff = 12; 
    currentAnswer = intervals[diff];

    // 로그 표시
    console.log(`--- 새 문제 생성 ---`);
    console.log(`첫 번째 음: ${low.name} (Y: ${low.y})`);
    console.log(`두 번째 음: ${high.name} (Y: ${high.y})`);
    console.log(`반음 차이: ${diff}`);
    console.log(`정답: ${currentAnswer}`);
}

function checkAnswer() {
    const userAns = input.value.trim();
    if (userAns === currentAnswer) {
        resultDisplay.innerText = "정답입니다! 🎉";
        resultDisplay.className = "correct";
        setTimeout(nextQuestion, 800);
    } else {
        resultDisplay.innerText = "틀렸습니다.";
        resultDisplay.className = "wrong";
        input.select();
    }
}

// 초기 실행
nextQuestion();
