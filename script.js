const canvas = document.getElementById('staffCanvas');
const ctx = canvas.getContext('2d');
const input = document.getElementById('answerInput');
const resultDisplay = document.getElementById('resultMessage');

let currentAnswer = "";
let isQuestionActive = true;

const noteNames = ["도", "레", "미", "파", "솔", "라", "시", "도", "레", "미", "파", "솔", "라", "시", "도"];
const startY = 150; 

function getSemitoneDistance(lowIdx, highIdx) {
    let distance = 0;
    for (let i = lowIdx; i < highIdx; i++) {
        let step = i % 7;
        if (step === 2 || step === 6) distance += 1;
        else distance += 2;
    }
    return distance;
}

function getIntervalName(lowIdx, highIdx, semitones) {
    const degree = highIdx - lowIdx + 1;
    const intervalMap = {
        1: { 0: "완전1도" },
        2: { 1: "단2도", 2: "장2도" },
        3: { 3: "단3도", 4: "장3도" },
        4: { 5: "완전4도", 6: "증4도" },
        5: { 6: "감5도", 7: "완전5도" },
        6: { 8: "단6도", 9: "장6도" },
        7: { 10: "단7도", 11: "장7도" },
        8: { 12: "완전8도" },
        9: { 13: "단9도", 14: "장9도" },
        10: { 15: "단10도", 16: "장10도" },
        11: { 17: "완전11도", 18: "증11도" },
        12: { 18: "감12도", 19: "완전12도" },
        13: { 20: "단13도", 21: "장13도" },
        14: { 22: "단14도", 23: "장14도" },
        15: { 24: "완전15도" }
    };
    return (intervalMap[degree] && intervalMap[degree][semitones]) || `${degree}도`;
}

input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const val = input.value.trim();
        if (isQuestionActive) { if (val !== "") checkAnswer(); }
        else { nextQuestion(); }
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

function drawNote(x, y, idx) {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.ellipse(x, y, 6, 4.5, Math.PI / -4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + 5, y);
    ctx.lineTo(x + 5, y - 35);
    ctx.stroke();
    if (y >= 130) {
        for (let j = 130; j <= y; j += 10) {
            ctx.beginPath(); ctx.moveTo(x - 12, j); ctx.lineTo(x + 12, j); ctx.stroke();
        }
    }
    if (y <= 70) {
        for (let j = 70; j >= y; j -= 10) {
            ctx.beginPath(); ctx.moveTo(x - 12, j); ctx.lineTo(x + 12, j); ctx.stroke();
        }
    }
}

function nextQuestion() {
    isQuestionActive = true;
    drawStaff();
    resultDisplay.innerText = "";
    input.value = "";
    input.focus();

    let idx1 = Math.floor(Math.random() * noteNames.length);
    let idx2 = Math.floor(Math.random() * noteNames.length);
    while (Math.abs(idx1 - idx2) < 1) idx2 = Math.floor(Math.random() * noteNames.length);

    let lowIdx = Math.min(idx1, idx2);
    let highIdx = Math.max(idx1, idx2);
    let lowY = startY - (lowIdx * 5);
    let highY = startY - (highIdx * 5);

    drawNote(180, lowY, lowIdx);
    drawNote(260, highY, highIdx);

    let semitones = getSemitoneDistance(lowIdx, highIdx);
    currentAnswer = getIntervalName(lowIdx, highIdx, semitones);
}

function checkAnswer() {
    const userAns = input.value.trim();
    isQuestionActive = false;
    if (userAns === currentAnswer) {
        resultDisplay.innerText = "정답입니다! 🎉";
        resultDisplay.style.color = "#2ecc71";
        setTimeout(nextQuestion, 800);
    } else {
        resultDisplay.innerText = `틀렸습니다. 정답: ${currentAnswer} (엔터로 다음)`;
        resultDisplay.style.color = "#e74c3c";
    }
}

nextQuestion();
