const canvas = document.getElementById('staffCanvas');
const ctx = canvas.getContext('2d');
const input = document.getElementById('answerInput');
const resultDisplay = document.getElementById('resultMessage');

let totalQuestions = 0;
let correctCount = 0;
let wrongCount = 0;
let currentAnswer = "";
let isQuestionActive = true;
let hasAttempted = false;

const noteNames = ["도", "레", "미", "파", "솔", "라", "시", "도", "레", "미", "파", "솔", "라", "시", "도"];
const accTypes = ["", "#", "b"];

function updateStats() {
    let statsDiv = document.getElementById('statsDisplay');
    if (!statsDiv) {
        statsDiv = document.createElement('div');
        statsDiv.id = 'statsDisplay';
        statsDiv.style.marginTop = '20px';
        statsDiv.style.fontWeight = 'bold';
        statsDiv.style.fontSize = '18px';
        document.querySelector('.container').appendChild(statsDiv);
    }
    statsDiv.innerText = `총 문제수 : ${totalQuestions} / 맞힌 횟수 : ${correctCount} / 틀린 횟수 : ${wrongCount}`;
}

function getBaseSemitone(idx) {
    let distance = 0;
    for (let i = 0; i < idx; i++) {
        let step = i % 7;
        distance += (step === 2 || step === 6) ? 1 : 2;
    }
    return distance;
}

function getIntervalName(degree, semitones) {
    const intervalMap = {
        1: { 0: "완전1도" },
        2: { 1: "단2도", 2: "장2도", 3: "증2도" },
        3: { 2: "감3도", 3: "단3도", 4: "장3도", 5: "증3도" },
        4: { 4: "감4도", 5: "완전4도", 6: "증4도" },
        5: { 6: "감5도", 7: "완전5도", 8: "증5도" },
        6: { 7: "감6도", 8: "단6도", 9: "장6도", 10: "증6도" },
        7: { 9: "감7도", 10: "단7도", 11: "장7도", 12: "증7도" },
        8: { 11: "감8도", 12: "완전8도", 13: "증8도" }
    };
    return (intervalMap[degree] && intervalMap[degree][semitones]) || null;
}

function drawStaff() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
        let y = 80 + (i * 10);
        ctx.beginPath(); ctx.moveTo(50, y); ctx.lineTo(450, y); ctx.stroke();
    }
    ctx.font = '50px serif'; ctx.fillStyle = "black";
    ctx.fillText('𝄞', 55, 122);
}

function drawNote(x, y, acc) {
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.ellipse(x, y, 6, 4.5, Math.PI / -4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath(); ctx.moveTo(x + 5, y); ctx.lineTo(x + 5, y - 35); ctx.stroke();
    if (acc !== "") {
        ctx.font = '24px Arial';
        ctx.fillText(acc, x - 25, y + 8);
    }
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
    hasAttempted = false;
    totalQuestions++;
    updateStats();

    drawStaff();
    resultDisplay.innerText = "";
    input.value = ""; input.focus();

    let n1, n2, low, high, degree, semitones, ans;
    let isValid = false;

    while (!isValid) {
        n1 = { idx: Math.floor(Math.random() * noteNames.length), acc: accTypes[Math.floor(Math.random() * 3)] };
        n2 = { idx: Math.floor(Math.random() * noteNames.length), acc: accTypes[Math.floor(Math.random() * 3)] };

        // 1. 도수 1도(같은 음 이름)는 무조건 제외 (증1도 차단)
        if (n1.idx === n2.idx) continue;

        // 물리적으로 낮은 쪽을 low로 설정 (idx가 작을수록 낮은 음)
        low = n1.idx < n2.idx ? n1 : n2;
        high = n1.idx < n2.idx ? n2 : n1;

        degree = high.idx - low.idx + 1;
        
        // 2. 8도(옥타브)까지 포함 (8도 초과는 제외)
        if (degree > 8) continue;

        semitones = getBaseSemitone(high.idx) - getBaseSemitone(low.idx);
        if (low.acc === "#") semitones -= 1;
        if (low.acc === "b") semitones += 1;
        if (high.acc === "#") semitones += 1;
        if (high.acc === "b") semitones -= 1;

        ans = getIntervalName(degree, semitones);

        // 3. 이명동음 쓰레기 조합 (0반음 2도 등) 필터링
        if (semitones === 0 && degree > 1) continue;
        
        if (ans !== null) isValid = true;
    }

    currentAnswer = ans;

    // 시각적 위치 유지: n1은 왼쪽(180), n2는 오른쪽(280)
    // 인덱스 높이에 맞게 y좌표 계산 (idx가 높을수록 오선 위쪽)
    drawNote(180, 150 - (n1.idx * 5), n1.acc);
    drawNote(280, 150 - (n2.idx * 5), n2.acc);
    
    console.log(`[로그] 정답: ${currentAnswer}`);
}

function checkAnswer() {
    const userAns = input.value.trim();
    if (userAns === currentAnswer) {
        if (!hasAttempted) correctCount++;
        resultDisplay.innerText = "정답입니다! 🎉";
        resultDisplay.style.color = "#2ecc71";
        isQuestionActive = false;
        updateStats();
        setTimeout(nextQuestion, 800);
    } else {
        if (!hasAttempted) {
            wrongCount++;
            hasAttempted = true;
        }
        resultDisplay.innerText = `틀렸습니다. 정답: ${currentAnswer} (엔터로 다음)`;
        resultDisplay.style.color = "#e74c3c";
        isQuestionActive = false;
        updateStats();
    }
}

input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && input.value.trim() !== "") {
        if (isQuestionActive) checkAnswer();
        else nextQuestion();
    }
});

nextQuestion();
