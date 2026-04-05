const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('.')); // HTML, JS 파일을 서빙

// 문제 데이터 예시 API
app.get('/api/question', (req, res) => {
    const questions = [
        { note: 'C4', name: '도' },
        { note: 'E4', name: '미' },
        { note: 'G4', name: '솔' }
    ];
    const random = questions[Math.floor(Math.random() * questions.length)];
    res.json(random);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
