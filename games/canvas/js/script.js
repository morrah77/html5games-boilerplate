var gameObject = (function(){
    var game = {
        containerId: 'gameContainer',
        canvasId: 'gameCanvas',
        canvas: null,
        ctx: null,
        brush: {
            draw: false,
            fill: false,
            stroke: true,
            color: 'rgb(0,0,0)',
            cursor: 'pointer',
        },
        cursorDefault: 'pointer',
        colorsCount: 10,
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
        this.cursorDefault = this.canvas.style.cursor;
        this.canvas.addEventListener('click', this.clickHandler.bind(gameObject));
        this.canvas.addEventListener('touch', this.clickHandler.bind(gameObject));
        this.canvas.addEventListener('mousedown', this.tapHandler.bind(gameObject));
        this.canvas.addEventListener('mousemove', this.dragHandler.bind(gameObject));
        this.canvas.addEventListener('mouseup', this.dropHandler.bind(gameObject));
        this.buildPalette();
        this.buildToolbar();
    };
    game.clickHandler = function(event) {
        if((this.canvas.offsetTop - event.clientY) <= 75) {
            this.pickColor(event.offsetX, event.offsetY);
        }
    }
    game.tapHandler = function(event) {
        this.brush.draw = true;
        this.canvas.style.cursor = this.brush.cursor;
        this.ctx.strokeStyle = this.brush.color;
        this.ctx.moveTo(event.offsetX, event.offsetY);
        this.ctx.beginPath();
    }
    game.dragHandler = function(event) {
        if(this.brush.draw) {
            this.ctx.lineTo(event.offsetX, event.offsetY);
            this.ctx.stroke();
        }
    }
    game.dropHandler = function(event) {
        this.ctx.stroke();
        this.ctx.closePath();
        this.canvas.style.cursor = this.cursorDefault;
        this.brush.draw = false;
    }
    game.buildPalette = function() {
        for (var c = 1; c<=3; c++) {
            var posY = 5 * (c + 1) + 20 * (c - 1);
            for (var i = 0; i < this.colorsCount; i++){
                posX = 5 * (i + 1) + 20 * i;
                var subdivNum = i%(this.colorsCount/2);
                if(i===0) {
                    switch (c) {
                        case 1:
                        this.ctx.fillStyle = 'rgb(255,0,0)';
                        break;
                        case 2:
                        this.ctx.fillStyle = 'rgb(0,255,0)';
                        break;
                        case 3:
                        this.ctx.fillStyle = 'rgb(0,0,255)';
                        break;
                        default:
                        break;
                    }

                }
                else if(i>0 && i<(this.colorsCount/2)){
                    var channelLevelR = (c == 1) ? 255 : (Math.floor((subdivNum) * (510/this.colorsCount)));
                    var channelLevelG = (c == 2) ? 255 : (Math.floor((subdivNum) * (510/this.colorsCount)));
                    var channelLevelB = (c == 3) ? 255 : (Math.floor((subdivNum) * (510/this.colorsCount)));
                    this.ctx.fillStyle = 'rgb(' + channelLevelR+ ',' + channelLevelG + ',' + channelLevelB + ')';
                }
                else if(i===Math.ceil(this.colorsCount/2)) {
                    switch (c) {
                        case 1:
                        this.ctx.fillStyle = 'rgb(255,255,0)';
                        break;
                        case 2:
                        this.ctx.fillStyle = 'rgb(255,0,255)';
                        break;
                        case 3:
                        this.ctx.fillStyle = 'rgb(0,255,255)';
                        break;
                        default:
                        break;
                    }

                }
                else{
                    switch (c) {
                        case 1:
                        var channelLevelR = 255;
                        var channelLevelG = 255;
                        var channelLevelB = (Math.floor((subdivNum) * (510/this.colorsCount)));
                        break;
                        case 2:
                        var channelLevelR = 255;
                        var channelLevelG = (Math.floor((subdivNum) * (510/this.colorsCount)));
                        var channelLevelB = 255;
                        break;
                        case 3:
                        var channelLevelR = (Math.floor((subdivNum) * (510/this.colorsCount)));
                        var channelLevelG = 255;
                        var channelLevelB = 255;
                        break;
                        default:
                        break;
                    }

                    this.ctx.fillStyle = 'rgb(' + channelLevelR+ ',' + channelLevelG + ',' + channelLevelB + ')';
                }
                this.ctx.fillRect(posX, posY, 20, 20);
            }
        }
    }
    game.pickColor = function(posX, posY) {
        var imgPix = this.ctx.getImageData(posX, posY, 1, 1).data;
        var RgbString = 'rgb(' + imgPix[0] + ',' + imgPix[1] + ',' + imgPix[2] + ')';
        this.brush.color = RgbString;
    }
    game.buildToolbar = function() {
        this.toolbar = document.createElement('div');
        this.toolbar.setAttribute('id', 'gameToolbar');
        this.saveButton = document.createElement('a');
        this.saveButton.setAttribute('id', 'gameSaveButton');
        this.saveButton.setAttribute('download', 'image.png');
        this.saveButton.appendChild(document.createTextNode('Save'));
        this.toolbar.appendChild(this.saveButton);
        this.container.insertBefore(this.toolbar, this.canvas);
        this.saveButton.addEventListener('click', function(event) {
            this.saveButton.setAttribute('href', this.canvas.toDataURL('image/png'));
        }.bind(this));
    }
    return game;
})();
