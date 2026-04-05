const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// 현재 폴더의 파일들을 정적 파일로 서빙
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
