var gameObject = (function(){
    var game = {
        containerId: 'gameContainer',
        canvasId: 'gameCanvas',
        canvas: null,
        ctx: null,
        frameRate: 15,
        speedInitial: { // all speeds in pixels per millisecond, so, 0.01 means 10px per second
            x: 0.1,
            y: 0.1,
        },
        collisionScore: 10,
        score: 0,
        description: 'Hit the ball by racket to do not allow it hit the left wall. Each racket hit increments your score, each left wall hit treats as a missed goal and decrements score. Take as much score as possible, but remember that missed goal on zero score makes game over.',
        ball: {
            posX: 10,
            posY: 10,
            radius: 10,
            speedX: 0.001,
            speedY: 0.001,
            fillStyle: 'rgb(0,0,0)',
        },
        racket: {
            posX: 50,
            posY: 0,
            width: 5,
            height: 50,
            fillStyle: 'rgb(255,0,0)',
        },
        target: {
            width: 2,
            fillStyle: 'rgb(255,0,0)',
        },
    };
    game.init = function() {
        this.container = document.getElementById(this.containerId);
        if(!this.container){
            this.container = document.createElement('div');
            this.container.setAttribute('id', this.containerId);
            document.body.appendChild(this.container);
        }
        this.canvas = document.getElementById(this.canvasId);
        if(!this.canvas){
            this.canvas = document.createElement('canvas');
            this.canvas.setAttribute('id', this.canvasId);
            this.container.appendChild(this.canvas);
        }
        this.canvas.width = this.container.clientWidth;
        this.canvas.height = this.container.clientHeight;
        this.ctx = this.canvas.getContext('2d');
        this.renderFrequency = 1000/this.frameRate; // delay between render() calls in milliseconds
        this.canvas.addEventListener('mousemove', this.dragHandler.bind(gameObject));
        this.buildToolbar();
        this.drawTarget();
    };
    game.dragHandler = function(event) {
        this.moveRacket(event);
    }
    game.buildToolbar = function() {
        this.toolbar = document.createElement('div');
        this.toolbar.setAttribute('id', 'gameToolbar');

        this.saveButton = document.createElement('a');
        this.saveButton.setAttribute('id', 'gameSaveButton');
        this.saveButton.appendChild(document.createTextNode('Save'));

        this.startButton = document.createElement('a');
        this.startButton.setAttribute('id', 'gameStartButton');
        this.startButton.appendChild(document.createTextNode('Start'));

        this.stopButton = document.createElement('a');
        this.stopButton.setAttribute('id', 'gameStopButton');
        this.stopButton.appendChild(document.createTextNode('Stop'));

        this.toolbar.score = document.createElement('div');
        this.toolbar.score.setAttribute('id', 'gameToolbarScore');
        this.toolbar.score.appendChild(document.createTextNode('Score: 0'));

        this.toolbar.hint = document.createElement('div');
        this.toolbar.hint.setAttribute('id', 'gameToolbarHint');
        this.toolbar.hint.appendChild(document.createTextNode('?'));

        this.toolbar.appendChild(this.startButton);
        this.toolbar.appendChild(this.stopButton);
        this.toolbar.appendChild(this.saveButton);
        this.toolbar.appendChild(this.toolbar.score);
        this.toolbar.appendChild(this.toolbar.hint);
        this.container.insertBefore(this.toolbar, this.canvas);
        this.startButton.addEventListener('click', function(event) {
            this.createBall();
            this.drawTarget();
            this.gameInterval = setInterval(this.render.bind(gameObject), this.renderFrequency);
        }.bind(this));
        this.stopButton.addEventListener('click', function(event) {
            clearInterval(this.gameInterval);
        }.bind(this));
        this.saveButton.addEventListener('click', function(event) {
            this.saveButton.setAttribute('href', this.canvas.toDataURL());
        }.bind(this));
        this.toolbar.hint.addEventListener('click', function(event) {
            if(!this.toolbar.hintContents){
                this.toolbar.hintContents = document.createElement('div');
                this.toolbar.hintContents.setAttribute('id', 'gameToolbarHintContents');
                this.toolbar.hintContents.style.position = 'absolute';
                this.toolbar.hintContents.style.top = this.toolbar.hint.offsetTop + this.toolbar.hint.clientHeight;
                this.toolbar.hintContents.style.left = this.toolbar.hint.offsetLeft;
                this.toolbar.hintContents.style.display = 'block';
                this.toolbar.hintContents.appendChild(document.createTextNode(this.description));
                this.toolbar.insertBefore(this.toolbar.hintContents, this.toolbar.hint);
            }
            else{
                this.toolbar.hintContents.style.display = (this.toolbar.hintContents.style.display !== 'none') ? 'none' : 'block';
            }
        }.bind(this));
    }
    game.drawTarget = function() {
        this.ctx.beginPath();
        this.ctx.fillStyle = this.target.fillStyle;
        this.ctx.fillRect(0, 0, this.target.width, this.canvas.height);
        this.ctx.closePath();
    }
    game.createBall = function() {
        this.ball.posY = Math.random(0,1) * this.canvas.height;
        this.ball.posX = 11;
        this.ball.speedX = this.speedInitial.x;
        this.ball.speedY = this.speedInitial.y;
    }
    game.moveBall = function() {
        this.goalFixed();
        if((this.ball.posX > this.canvas.width - this.ball.radius)
            || (this.ball. posX < this.ball.radius)
            || (this.collisionFixed())
        ){
            this.ball.speedX = this.ball.speedX * (-1);
        }
        if((this.ball.posY > this.canvas.height - this.ball.radius) || (this.ball. posY < this.ball.radius)){
            this.ball.speedY = this.ball.speedY * (-1);
        }
        this.ball.posX = this.ball.posX += this.ball.speedX * this.renderFrequency;
        this.ball.posY = this.ball.posY += this.ball.speedY * this.renderFrequency;
    }
    game.moveRacket = function(event) {
        this.racket.posY = event.offsetY;// - event.target.OffsetTop;
    }
    game.collisionFixed = function() {
        var res = false;
        res = ((Math.abs(this.ball.posX - this.racket.posX) < this.ball.radius) && (this.ball.posY > this.racket.posY) && (this.ball.posY < (this.racket.posY + this.racket.height)));
        if (res) {
            this.score += this.collisionScore;
            this.ball.speedX = this.ball.speedX * 1.1;
            this.ball.speedY = this.ball.speedY * 1.1;
            this.renderScore();
        }
        return res;
    }
    game.goalFixed = function() {
        res = (this.ball. posX < this.ball.radius);
        if (res) {
            this.score -= this.collisionScore;
            if(this.score < 0){
                this.gameOver();
                return res;
            }
            this.renderScore();
        }
        return res;
    }
    game.gameOver = function() {
        clearInterval(this.gameInterval);
        this.ctx.clearRect(this.target.width,0,this.canvas.width,this.canvas.height);
        this.toolbar.score.removeChild(this.toolbar.score.childNodes[0]);
        this.toolbar.score.appendChild(document.createTextNode('Game over!'));
    }
    game.renderScore = function() {
        this.toolbar.score.removeChild(this.toolbar.score.childNodes[0]);
        this.toolbar.score.appendChild(document.createTextNode('Score: ' + this.score));
    }
    game.preRender = function() {
        this.moveBall();
    }
    game.drawBall = function(ball) {
        this.ctx.beginPath();
        this.ctx.arc(ball.posX, ball.posY, ball.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = ball.fillStyle;
        this.ctx.fill();
        this.ctx.closePath();
    }
    game.drawRacket = function(racket) {
        this.ctx.beginPath();
        this.ctx.fillStyle = racket.fillStyle;
        this.ctx.fillRect(racket.posX, racket.posY, racket.width, racket.height);
        this.ctx.closePath();
    }
    game.render = function() {
        this.preRender();
        this.ctx.clearRect(this.target.width,0,this.canvas.width,this.canvas.height);
        this.drawRacket(this.racket);
        this.drawBall(this.ball);
    }
    return game;
})();
