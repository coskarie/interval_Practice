const canvas = document.getElementById('staffCanvas');
const ctx = canvas.getContext('2d');
const input = document.getElementById('answerInput');
const resultDisplay = document.getElementById('resultMessage');

let currentAnswer = "";

const notes = [
    { name: "도", y: 130, semitone: 0, ledger: true },
    { name: "레", y: 120, semitone: 2, ledger: false },
    { name: "미", y: 110, semitone: 4, ledger: false },
    { name: "파", y: 100, semitone: 5, ledger: false },
    { name: "솔", y: 90, semitone: 7, ledger: false },
    { name: "라", y: 80, semitone: 9, ledger: false },
    { name: "시", y: 70, semitone: 11, ledger: false },
    { name: "도", y: 60, semitone: 12, ledger: false }
];

const intervals = {
    0: "완전1도", 1: "단2도", 2: "장2도", 3: "단3도", 4: "장3도",
    5: "완전4도", 6: "증4도", 7: "완전5도", 8: "단6도", 9: "장6도",
    10: "단7도", 11: "장7도", 12: "완전8도"
};

// 엔터키 이벤트 리스너 추가
input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});

function drawStaff() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;

    // 1. 오선 그리기 (70, 80, 90, 100, 110px 위치)
    for (let i = 0; i < 5; i++) {
        let y = 70 + (i * 10);
        ctx.beginPath(); 
        ctx.moveTo(50, y); 
        ctx.lineTo(450, y); 
        ctx.stroke();
    }

    // 2. 높은음자리표 위치 정밀 조정
    // 폰트 크기를 50으로 키우고, Y좌표를 112 정도로 잡으면 
    // 높은음자리표의 '배 부분'이 두 번째 줄(100px)에 예쁘게 걸립니다.
    ctx.font = '50px serif'; 
    ctx.fillStyle = "black";
    ctx.fillText('𝄞', 55, 112); 
}

function drawNote(x, y, hasLedger) {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.ellipse(x, y, 6, 4.5, Math.PI / -4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath(); ctx.moveTo(x + 5, y); ctx.lineTo(x + 5, y - 35); ctx.stroke();
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

    let idx1 = Math.floor(Math.random() * notes.length);
    let idx2 = Math.floor(Math.random() * notes.length);
    if (idx1 === idx2) idx2 = (idx1 + 2) % notes.length;

    let low = notes[Math.min(idx1, idx2)];
    let high = notes[Math.max(idx1, idx2)];

    drawNote(180, low.y, low.ledger);
    drawNote(260, high.y, high.ledger);

    let diff = high.semitone - low.semitone;
    currentAnswer = intervals[diff];
}

function checkAnswer() {
    const userAns = input.value.trim();
    if (userAns === currentAnswer) {
        resultDisplay.innerText = "정답입니다! 🎉";
        resultDisplay.className = "correct";
        // 정답이면 0.8초 후 자동으로 다음 문제로 이동
        setTimeout(nextQuestion, 800);
    } else {
        resultDisplay.innerText = "틀렸습니다.";
        resultDisplay.className = "wrong";
        input.select(); // 틀렸을 때 바로 다시 입력할 수 있게 텍스트 선택
    }
}

nextQuestion();
