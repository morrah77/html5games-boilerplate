var gameObject = (function(){
    var game = {
        containerId: 'gameContainer',
        canvasId: 'gameCanvas',
        canvas: null,
        ctx: null,
        description: 'Some description here...',
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
        this.buildToolbar();
    };
    game.clickHandler = function(event) {
        if((this.canvas.offsetTop - event.clientY) <= 75) {
            this.pickColor(event.layerX, event.layerY);
        }
    }
    game.tapHandler = function(event) {
        console.log('tapHandler');
        this.brush.draw = true;
        this.canvas.style.cursor = this.brush.cursor;
        this.ctx.strokeStyle = this.brush.color;
    }
    game.dragHandler = function(event) {
        console.log('dragHandler');
    }
    game.dropHandler = function(event) {
        console.log('dropHandler');
        this.canvas.style.cursor = this.cursorDefault;
        this.brush.draw = false;
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
        this.saveButton.appendChild(document.createTextNode('Save'));

        this.toolbar.appendChild(this.saveButton);

        this.toolbar.hint = document.createElement('div');
        this.toolbar.hint.setAttribute('id', 'gameToolbarHint');
        this.toolbar.hint.appendChild(document.createTextNode('?'));

        this.toolbar.appendChild(this.toolbar.hint);

        this.container.insertBefore(this.toolbar, this.canvas);

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
    return game;
})();
