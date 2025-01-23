// 游戏配置
const config = {
    gridSize: 20,
    initialSpeed: 200,
    speedIncrease: 2
};

// 游戏状态
let snake = [];
let food = null;
let direction = 'right';
let nextDirection = 'right';
let score = 0;
let gameLoop = null;
let currentSpeed = config.initialSpeed;

// 获取Canvas上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = config.gridSize;
const gridWidth = canvas.width / gridSize;
const gridHeight = canvas.height / gridSize;

// 初始化游戏
function initGame() {
    // 初始化蛇
    snake = [
        {x: 3, y: 1},
        {x: 2, y: 1},
        {x: 1, y: 1}
    ];
    
    // 生成第一个食物
    generateFood();
    
    // 重置分数
    score = 0;
    document.getElementById('score').textContent = score;
    
    // 重置方向
    direction = 'right';
    nextDirection = 'right';
    
    // 重置速度
    currentSpeed = config.initialSpeed;
    
    // 隐藏游戏结束界面
    document.getElementById('gameOver').style.display = 'none';
}

// 生成食物
function generateFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * gridWidth),
            y: Math.floor(Math.random() * gridHeight)
        };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    food = newFood;
}

// 绘制游戏
function draw() {
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制蛇
    ctx.fillStyle = '#4CAF50';
    snake.forEach((segment, index) => {
        if (index === 0) {
            // 蛇头
            ctx.fillStyle = '#388E3C';
        } else {
            ctx.fillStyle = '#4CAF50';
        }
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
    });
    
    // 绘制食物
    ctx.fillStyle = '#FF5722';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 1, gridSize - 1);
}

// 移动蛇
function moveSnake() {
    // 更新方向
    direction = nextDirection;
    
    // 获取蛇头
    const head = {...snake[0]};
    
    // 根据方向移动蛇头
    switch(direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }
    
    // 检查碰撞
    if (checkCollision(head)) {
        gameOver();
        return;
    }
    
    // 将新头部添加到蛇身数组
    snake.unshift(head);
    
    // 检查是否吃到食物
    if (head.x === food.x && head.y === food.y) {
        // 增加分数
        score += 10;
        document.getElementById('score').textContent = score;
        
        // 生成新食物
        generateFood();
        
        // 加快游戏速度
        currentSpeed = Math.max(50, currentSpeed - config.speedIncrease);
        clearInterval(gameLoop);
        gameLoop = setInterval(gameStep, currentSpeed);
    } else {
        // 如果没有吃到食物，移除尾部
        snake.pop();
    }
}

// 检查碰撞
function checkCollision(head) {
    // 检查是否撞墙
    if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight) {
        return true;
    }
    
    // 检查是否撞到自己
    return snake.some(segment => segment.x === head.x && segment.y === head.y);
}

// 游戏步骤
function gameStep() {
    moveSnake();
    draw();
}

// 游戏结束
function gameOver() {
    clearInterval(gameLoop);
    document.getElementById('gameOver').style.display = 'block';
    document.getElementById('finalScore').textContent = score;
}

// 重启游戏
function restartGame() {
    clearInterval(gameLoop);
    initGame();
    gameLoop = setInterval(gameStep, currentSpeed);
}

// 触摸控制
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (event) => {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
});

document.addEventListener('touchmove', (event) => {
    event.preventDefault();
});

document.addEventListener('touchend', (event) => {
    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // 判断滑动方向
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // 水平滑动
        if (deltaX > 0 && direction !== 'left') {
            nextDirection = 'right';
        } else if (deltaX < 0 && direction !== 'right') {
            nextDirection = 'left';
        }
    } else {
        // 垂直滑动
        if (deltaY > 0 && direction !== 'up') {
            nextDirection = 'down';
        } else if (deltaY < 0 && direction !== 'down') {
            nextDirection = 'up';
        }
    }
});

// 键盘控制
document.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'ArrowUp':
            if (direction !== 'down') nextDirection = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') nextDirection = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') nextDirection = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') nextDirection = 'right';
            break;
    }
});

// 开始游戏
initGame();
gameLoop = setInterval(gameStep, currentSpeed);