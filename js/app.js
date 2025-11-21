//  選択を保存する変数
var pitcherChoice = '';
var batterChoice = '';

// 選択肢のラベル
var choiceLabels = {
    'inside': 'インコース',
    'center': 'ど真ん中',
    'outside': 'アウトコース'
};

// 画像のURL
var resultImages = {
    'ホームラン': 'bannzai.jpg',
    'ファール': 'ootani4.jpg',
    '三振': 'yamamoto.jpg',
    '死球': 'sugiya.jpg' , // 死球用の画像を追加,
    '盗塁': 'ellysteel.jpg',
    'ファインプレー': 'fineplay.jpg',

};

console.log('game.jsが読み込まれました'); // デバッグ用

// 選択ボタンにイベントリスナーを追加
document.querySelectorAll('.choice-btn').forEach(function(button) {
    button.addEventListener('click', function() {
        console.log('ボタンがクリックされました'); // デバッグ用
        var choice = this.getAttribute('data-choice');
        var player = this.getAttribute('data-player');
        console.log('選択:', choice, 'プレイヤー:', player); // デバッグ用

        // 同じプレイヤーの他のボタンの選択を解除
        var selector = '.choice-btn[data-player="' + player + '"]';
        document.querySelectorAll(selector).forEach(function(btn) {
            btn.classList.remove('selected');
        });

        // このボタンを選択状態にする
        this.classList.add('selected');

        // 選択を保存
        if (player === 'pitcher') {
            pitcherChoice = choice;
        } else {
            batterChoice = choice;
        }
        console.log('投手:', pitcherChoice, '打者:', batterChoice); // デバッグ用
    });
});

// ゲームを開始する関数
function playGame() {
    console.log('ゲーム開始'); // デバッグ用
    if (!pitcherChoice || !batterChoice) {
        alert('投手と打者の選択をしてください！');
        return;
    }

    // 結果を非表示にする
    var resultArea = document.getElementById('result');
    resultArea.classList.remove('show', 'homerun', 'strikeout', 'foulball');
    resultArea.style.display = 'none';

    // 少し遅延させてから結果を表示
    setTimeout(function() {
        var result = calculateResult(pitcherChoice, batterChoice);
        console.log('結果:', result); // デバッグ用
        displayResult(result);
    }, 300);
}

// 結果を計算する関数
function calculateResult(pitcher, batter) {
    if (pitcher === batter) {
        // ど真ん中 vs ど真ん中 → ファインプレー
        if (pitcher === 'center') {
            return 'ファインプレー';
        }
        // それ以外の同じ選択 → ホームラン
        return 'ホームラン';
    
    }
    
    // 投手①（インコース）の場合
    if (pitcher === 'inside') {
        if (batter === 'center') return '盗塁';
        if (batter === 'outside') return '死球';
    }
    
    // 投手②（ど真ん中）の場合
    if (pitcher === 'center') {
        if (batter === 'inside') return 'ファール';
        if (batter === 'outside') return '三振';
        if (batter === 'center') return 'ファインプレー'
    }

    
    // 投手③（アウトコース）の場合
    if (pitcher === 'outside') {
        if (batter === 'inside') return '三振';
        if (batter === 'center') return 'ファール';
    }
    
    return 'ファール';
}

// 結果を表示する関数
function displayResult(result) {
    var resultArea = document.getElementById('result');
    var resultImage = document.getElementById('resultImage');
    var resultIcon = document.getElementById('resultIcon');
    var resultText = document.getElementById('resultText');
    var resultDetail = document.getElementById('resultDetail');

    // まず全てのクラスをクリア
    resultArea.className = 'result-area';
    
    // 画像の表示をリセット
    resultImage.style.display = 'none';
    resultIcon.style.display = 'block';

    // 画像を設定
    var imgSrc = resultImages[result];
    if (imgSrc) {
        var img = new Image();
        img.onload = function() {
            resultImage.src = imgSrc;
            resultImage.style.display = 'block';
            resultIcon.style.display = 'none';
        };
        img.onerror = function() {
            showIcon(result);
        };
        img.src = imgSrc;
    } else {
        showIcon(result);
    }

    function showIcon(result) {
        resultImage.style.display = 'none';
        resultIcon.style.display = 'block';
        
        if (result === 'ホームラン') {
            resultIcon.textContent = '🏆';
        } else if (result === '三振') {
            resultIcon.textContent = '⚡';
        } else if (result === 'ファール') {
            resultIcon.textContent = '⚠️';
        }
    }

    // スタイルを追加
    if (result === 'ホームラン') {
        resultArea.classList.add('homerun');
    } else if (result === '三振') {
        resultArea.classList.add('strikeout');
    } else if (result === 'ファール') {
        resultArea.classList.add('foulball');
    }

    resultText.textContent = result + '！';
    resultDetail.textContent = '投手: ' + choiceLabels[pitcherChoice] + ' vs 打者: ' + choiceLabels[batterChoice];

    // フェードインで表示
    resultArea.style.display = 'block';
    setTimeout(function() {
        resultArea.classList.add('show');
    }, 50);
}

// ゲームをリセットする関数
function resetGame() {
    console.log('リセット'); // デバッグ用
    pitcherChoice = '';
    batterChoice = '';

    // すべての選択を解除
    document.querySelectorAll('.choice-btn').forEach(function(btn) {
        btn.classList.remove('selected');
    });

    // 結果を非表示
    var resultArea = document.getElementById('result');
    resultArea.classList.remove('show', 'homerun', 'strikeout', 'foulball');
    
    setTimeout(function() {
        resultArea.style.display = 'none';
    }, 300);
}

// ボタンにイベントリスナーを追加
document.getElementById('playBtn').addEventListener('click', playGame);
document.getElementById('resetBtn').addEventListener('click', resetGame);