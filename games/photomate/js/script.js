var gameObject = (function(){
    var game = {
        containerId: 'gameContainer',
        canvasId: 'gameCanvas',
        canvas: null,
        ctx: null,
        description: 'Permit the browser access to your camera, click on the video to make your photo and save it using Save button. If you already denied your camera access and want to make your photo just reload this page.',
        videoElement: {
            id: 'videoElement',
            autoplay: true
        },
        video: null
    };
    game.init = function() {
        this.container = document.getElementById(this.containerId);
        if(!this.container){
            this.container = document.createElement('div');
            this.container.setAttribute('id', this.containerId);
            document.body.appendChild(this.container);
        }

        this.buildToolbar();

        this.video = document.getElementById(this.videoElement.id);
        if(!this.video){
            this.video = document.createElement('video');
            this.video.setAttribute('id', this.videoElement.id);
            this.video.setAttribute('autoplay', this.videoElement.autoplay);
            this.container.appendChild(this.video);
        }

        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

        if (navigator.getUserMedia) {
        	navigator.getUserMedia({video: true}, handleVideo.bind(gameObject), videoError.bind(gameObject));
        }

        function handleVideo(stream) {
            if ("srcObject" in this.video) {
                this.video.srcObject = stream;
            } else {
                this.video.src = window.URL.createObjectURL(stream);
            }
            this.video.onloadedmetadata=function(e){
                this.video.play();
                this.canvas.width = this.video.clientWidth;
                this.canvas.height = this.video.clientHeight;
            }.bind(this);
        }

        function videoError() {
        	console.log('videoError');
        }

        this.canvas = document.getElementById(this.canvasId);
        if(!this.canvas){
            this.canvas = document.createElement('canvas');
            this.canvas.setAttribute('id', this.canvasId);
            this.container.appendChild(this.canvas);
        }

        this.addDelimiter();

        this.ctx = this.canvas.getContext('2d');

        this.video.addEventListener('click', this.clickHandlerVideo.bind(gameObject));


    };
    game.clickHandlerVideo = function(event) {
        this.ctx.drawImage(this.video, 0, 0, this.video.clientWidth, this.video.clientHeight);
    }
    game.addDelimiter = function() {
        var delimiter = document.createElement('div');
        delimiter.setAttribute('class', 'clear');
        this.container.appendChild(delimiter);
    }
    game.buildToolbar = function() {
        this.toolbar = document.createElement('div');
        this.toolbar.setAttribute('id', 'gameToolbar');

        this.saveButton = document.createElement('a');
        this.saveButton.setAttribute('id', 'gameSaveButton');
        this.saveButton.setAttribute('download', 'photo.png');
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
