const canvas = document.getElementById('staffCanvas');
const ctx = canvas.getContext('2d');

function drawStaff() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;

    // 1. 오선 그리기 (5줄)
    // 간격은 10px 정도로 설정
    const startY = 80;
    const spacing = 10;

    for (let i = 0; i < 5; i++) {
        const y = startY + (i * spacing);
        ctx.beginPath();
        ctx.moveTo(50, y);
        ctx.lineTo(450, y);
        ctx.stroke();
    }

    // 2. 높은음자리표(Clef) 표시
    // 실제 구현시에는 이미지를 사용하거나 폰트(Bravura 등)를 쓰는 게 예쁘지만,
    // 우선 텍스트로 위치를 잡아둡니다.
    ctx.font = '40px serif';
    ctx.fillText('𝄞', 50, 125); 
}

// 음표 그리기 예시 (도 - C4)
function drawNote() {
    drawStaff(); // 선부터 다시 그리고
    
    const x = 150; // 음표 가로 위치
    const y = 130; // '도' 위치 (오선 아래 첫 번째 덧줄 필요)

    // 덧줄 그리기
    ctx.beginPath();
    ctx.moveTo(x - 10, y);
    ctx.lineTo(x + 10, y);
    ctx.stroke();

    // 음표 머리
    ctx.beginPath();
    ctx.ellipse(x, y, 6, 4, Math.PI / -4, 0, Math.PI * 2);
    ctx.fill();

    // 음표 기둥
    ctx.beginPath();
    ctx.moveTo(x + 5, y);
    ctx.lineTo(x + 5, y - 35);
    ctx.stroke();
}

// 초기 실행
drawStaff();
