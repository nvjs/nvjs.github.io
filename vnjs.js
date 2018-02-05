class vnjs {
    constructor(canvas_x, canvas_y) {
        // Reset Styles
        document.body.style.cssText = 'margin: 0; padding: 0;';

        // Create Canvas
        var canvas = document.createElement('canvas');
        canvas_x != undefined ? canvas_x : canvas_x = 1280;
        canvas_y != undefined ? canvas_y : canvas_y = 720;
        canvas.width = canvas_x;
        canvas.height = canvas_y;
        canvas.style.cssText = 'margin: 0 auto; display: block; cursor: pointer;';
        document.body.appendChild(canvas);

        // Initialize Object
        this.canvas_x = canvas_x;
        this.canvas_y = canvas_y;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.ctx.fillStyle = "#000000";
        this.ctx.fillRect(0, 0, canvas_x, canvas_y);
        this.frames = [];
        this.curr_bgm = null;
        this.resources = {
            sprites: {},
            bg: {},
            bgm: {}
        };
        this.frame_tmp = {};
        this.frame = 0;
        let l = this;
        this.canvas.onclick = function () {
            if (l.frame == l.frames.length - 1) return;
            l.frame++;
            l.render();
        }
    }

    // Methods

    start(cb) {
        this.textbox = new Image();
        this.namebox = new Image();
        let l = this;
        this.textbox.src = 'res/textbox.png';
        this.textbox.onload = function () {
            l.namebox.src = 'res/namebox.png';
            l.namebox.onload = function () {
                l.lRes(cb);
            }
        }
    }

    lRes(cb) {
        let sprites = this.resources.sprites;
        let bg = this.resources.bg;
        let bgm = this.resources.bgm;
        let links = [];

        if (bgm != undefined) {
            for (let s in bgm) {
                links.push({'name': s, 'src': bgm[s].src, 'type': 'bgm'});
            }
        }

        if (sprites != undefined) {
            for (let s in sprites) {
                links.push({'name': s, 'src': sprites[s].src, 'type': 'sprites'});
            }
        }

        if (bg != undefined) {
            for (let s in bg) {
                links.push({'name': s, 'src': bg[s].src, 'type': 'bg'});
            }
        }

        if (bgm != undefined || sprites != undefined || bg != undefined) {
            this.loadResource(links, cb, 0);
        }
    }

    loadResource(links, cb, i) {
        if (links[i] == undefined) {
            return cb();
        }
        let cont;
        if (links[i].type == 'bgm') {
            cont = new Audio();
            cont.loop = true;
        } else {
            cont = new Image();
        }
        let l = this;   
        cont.src = links[i].src;
        this.resources[links[i].type][links[i].name].obj = cont;

        if (links[i].type == 'bgm') {
            l.loadResource(links, cb, ++i);
        } else {
            cont.onload = function () {
                l.loadResource(links, cb, ++i);
            }
        }
    }

    text(name, text) {
        this.frame_tmp.text = text;
        this.frame_tmp.name = name;
        if (this.frame_tmp.bg == undefined) {
            this.frame_tmp.bg = this.frames[this.frame].bg;
        }
        if (this.frame_tmp.sprite == undefined) {
            this.frame_tmp.sprite = this.frames[this.frame].sprite;
        }
        this.frames.push(this.frame_tmp);
        this.frame_tmp = {};
    }

    sprite(resource_name) {
        this.frame_tmp.sprite = {
            "name": resource_name,
            "obj": this.resources.sprites[resource_name].obj
        }
    }

    bg(resource_name) {
        this.frame_tmp.bg = {
            "name": resource_name,
            "obj": this.resources.bg[resource_name].obj
        }
    }

    bgm(resource_name) {
        this.frame_tmp.bgm = {
            "name": resource_name,
            "obj": this.resources.bgm[resource_name].obj
        }
    }

    setResource(resource_obj) {
        this.resources[resource_obj.type][resource_obj.name] = {
            src: resource_obj.src
        };
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let frame = this.frames[this.frame];
        if (frame.bgm != undefined) {
            if (this.curr_bgm != null)
                this.curr_bgm.pause();
            this.curr_bgm = frame.bgm.obj;
            this.curr_bgm.play();
        }

        if (frame.bg != undefined) {
            this.ctx.drawImage(this.resources.bg[frame.bg.name].obj, 0, 0);
        }

        if (frame.sprite != undefined) {
            this.ctx.drawImage(this.resources.sprites[frame.sprite.name].obj, 0, 0, 720, 720);
        }

        this.ctx.drawImage(this.namebox, 240, 515);
        this.ctx.drawImage(this.textbox, 232, 550);

        this.ctx.font = "20px sans-serif"; 
        this.ctx.textAlign = "center";
        this.ctx.fillStyle = "red";        
        this.ctx.fillText(frame.name, 320, 540);

        this.ctx.font = "20px sans-serif"; 
        this.ctx.textAlign = "left";
        this.ctx.fillStyle = "white";        
        this.ctx.fillText(frame.text, 260, 600);
    }
}