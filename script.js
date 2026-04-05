const canvas = document.getElementById('staffCanvas');
const ctx = canvas.getContext('2d');
const input = document.getElementById('answerInput');
const resultDisplay = document.getElementById('resultMessage');

let currentAnswer = "";
let isQuestionActive = true; // 현재 문제가 진행 중인지 상태 확인

const noteNames = ["도", "레", "미", "파", "솔", "라", "시", "도", "레", "미", "파"];
const startY = 130; 

function getSemitoneDistance(lowIdx, highIdx) {
    let distance = 0;
    for (let i = lowIdx; i < highIdx; i++) {
        let currentStep = i % 7; 
        if (currentStep === 2 || currentStep === 6) { // 미-파, 시-도
            distance += 1;
        } else {
            distance += 2;
        }
    }
    return distance;
}

const intervals = {
    0: "완전1도", 1: "단2도", 2: "장2도", 3: "단3도", 4: "장3도",
    5: "완전4도", 6: "증4도", 7: "완전5도", 8: "단6도", 9: "장6도",
    10: "단7도", 11: "장7도", 12: "완전8도"
};

// 엔터키 제어 로직 수정
input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        if (isQuestionActive) {
            checkAnswer(); // 문제 풀기
        } else {
            nextQuestion(); // 정답 확인 후 다음 문제로
        }
    }
});

function drawStaff() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
        let y = 80 + (i * 10); 
        ctx.beginPath(); ctx.moveTo(50, y); ctx.lineTo(450, y); ctx.stroke();
    }
    ctx.font = '50px serif';
    ctx.fillStyle = "black";
    ctx.fillText('𝄞', 55, 122); 
}

function drawNote(x, y, isDo) {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.ellipse(x, y, 6, 4.5, Math.PI / -4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + 5, y);
    ctx.lineTo(x + 5, y - 35);
    ctx.stroke();
    if (isDo && y === 130) {
        ctx.beginPath(); ctx.moveTo(x - 12, y); ctx.lineTo(x + 12, y); ctx.stroke();
    }
}

function nextQuestion() {
    isQuestionActive = true;
    drawStaff();
    resultDisplay.innerText = "";
    resultDisplay.className = "";
    input.value = "";
    input.focus();

    let idx1 = Math.floor(Math.random() * noteNames.length);
    let idx2 = Math.floor(Math.random() * noteNames.length);
    while(idx1 === idx2) idx2 = (idx1 + 2) % noteNames.length;

    let lowIdx = Math.min(idx1, idx2);
    let highIdx = Math.max(idx1, idx2);

    let lowY = startY - (lowIdx * 5);
    let highY = startY - (highIdx * 5);

    drawNote(180, lowY, lowIdx === 0);
    drawNote(260, highY, highIdx === 0);

    let semitones = getSemitoneDistance(lowIdx, highIdx);
    currentAnswer = intervals[semitones] || "범위 초과";

    console.log(`[문제] ${noteNames[lowIdx]}-${noteNames[highIdx]} | 정답: ${currentAnswer}`);
}

function checkAnswer() {
    const userAns = input.value.trim();
    isQuestionActive = false; // 정답 확인 절차에 들어갔으므로 상태 변경

    if (userAns === currentAnswer) {
        resultDisplay.innerText = "정답입니다! 🎉";
        resultDisplay.className = "correct";
        resultDisplay.style.color = "#2ecc71";
        setTimeout(nextQuestion, 800);
    } else {
        resultDisplay.innerText = `틀렸습니다. 정답은 '${currentAnswer}'입니다. (엔터를 누르면 다음 문제)`;
        resultDisplay.className = "wrong";
        resultDisplay.style.color = "#e74c3c";
        input.value = ""; // 다음 입력을 위해 비워줌
    }
}

nextQuestion();
