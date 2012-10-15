/**
 * pxw - width in pixels
 * pxh - height in pixels
 * z0 - target complex for center of window
 * s - target distance from center to horiz edge of window
 */
var Transform = function(pxw, pxh, z0, s) {
    this.w = pxw;
    this.h = pxh;
    this.scale = 2*s/this.w;
    this.x0 = this.w/2 - z0.real/this.scale - 0.5;
    this.y0 = this.h/2 - z0.imag/this.scale;
}


Transform.prototype = {
    z2px: function(z) {
        return { x: Math.round(z.real/this.scale + this.x0),
                 y: Math.round(z.imag/this.scale + this.y0) }
    },
    px2z: function(x, y) {
        return new Complex(this.scale*(x-this.x0),
                           this.scale*(y-this.y0));
    },
}

var JuliaDemo = function(canvas, marker) {
    this.canvas = canvas;
    this.w = canvas.width;
    this.h = canvas.height;
    this.ctx = canvas.getContext('2d');
    this.initPalette();
    this.marker = {
        init: function(marker) {
            this.xform = new Transform(marker.width, marker.height,
                                       new Complex(-0.6,0), 1.5);
            this.ctx = marker.getContext('2d');
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            this.ctx.lineWidth = '1px';
        },
        
        mark: function(z) {
            var px = this.xform.z2px(z);
            this.ctx.clearRect(px.x - 10, px.y - 10, 21, 21);
            this.ctx.strokeRect(px.x -1, px.y - 1, 3, 3);
        }
    }
    this.marker.init(marker);
}

JuliaDemo.prototype = {
    step: 10,
    maxiter: 100,
    running: true,
    
    v: function(z, c) {
        var it = 0;
        while (++it < this.maxiter && z.sqmod() < 2.89) {
            //z = z.sqr().add(c);
            var tmp = z.real*z.real - z.imag*z.imag + c.real;
            z.imag = 2*z.real*z.imag + c.imag;
            z.real = tmp;
        }
        return it;
    },
    color: function(i) {
        if (i >= this.maxiter) {
            return 0xff000000;
        } else {
            var x = Math.pow(i / this.maxiter, 1/3),
            r = 0xff & Math.round(240-240*x),
            g = 0xff & Math.round(180*x)
            b = 0xff & Math.round(210-420*Math.abs(x-.5))
            return (0xff << 24) | (b << 16) | (g << 8) | r;
        }
    },
    initPalette: function() {
        this.palette = []
        for (var i = 0; i <= this.maxiter; ++i) {
            this.palette.push(this.color(i));
        }
    },
    render: function(c) {
        var ws = this.w-this.step,
            x0 = this.w/2 - this.step/2,
            y0 = this.h/2 - this.step/2
            scale = 3/this.w;
        for (var x = 0; x <= this.w - this.step; x += this.step) {
            for (var y = 0; y <= this.h - this.step; y += this.step) {
                var z = new Complex(scale*(x-x0), scale*(y-y0));
                var n = this.v(z,c)
                if (n < this.maxiter) {
                    var v = this.palette[n];
                    for (var yy = this.step, i0 = y * this.w + x;
                         yy > 0;
                         --yy, i0 += ws) {
                        for (var xx = this.step; xx > 0; --xx) {
                            this.data[i0++] = v;
                        }
                    }
                }
            }
        }
        this.imgData.data.set(this.buf8);
        this.ctx.putImageData(this.imgData, 0,0);
    },
    animate: function() {
        var timing = performance.now(),
            r = 0.7 + Math.sin(timing/9347)*0.4,
            c = new Complex(r*Math.sin(timing/2000)-0.2, r*Math.cos(timing/2000));
        
        this.imgData = this.ctx.getImageData(0,0,this.w,this.h);
        this.buf = new ArrayBuffer(this.imgData.data.length);
        this.buf8 = new Uint8ClampedArray(this.buf);
        this.data = new Uint32Array(this.buf);

        this.render(c);
        this.marker.mark(c);
        
        var elapsed = performance.now() - timing;
        var info = document.getElementById('info');
        if (info) {
            info.innerHTML = 'c: ' + c + '<br>step: ' + this.step +
                '<br>elapsed: ' + elapsed.toFixed() + 'ms';
        }
	if (elapsed < 30 /* ms */ && this.step > 1) {
            this.step = this.step - 1;
	} else if(elapsed > 80) {
            this.step = this.step + 1;
	}
        if (this.running) {
            var demo = this;
            requestAnimFrame(function() {demo.animate()})
        }
    }
}

function mandelbrot(canvas, xform) {

    var canvas = canvas,
        w = canvas.width,
        h = canvas.height,
        maxiter = 100,
        ctx = canvas.getContext('2d'),
        imgData = ctx.getImageData(0,0, w, h),
        buf = new ArrayBuffer(imgData.data.length),
        buf8 = new Uint8ClampedArray(buf),
        data = new Uint32Array(buf),
        y = 0;

    function color(i) {
        if (i >= maxiter) {
            return 0xff000000;
        } else {
            var x = Math.pow(i / maxiter, 1/3),
            r = 0xff & Math.round(240-240*x),
            g = 0xff & Math.round(180*x)
            b = 0xff & Math.round(210-420*Math.abs(x-.5))
            return (0xff << 24) | (b << 16) | (g << 8) | r;
        }
    }

    var palette = []
    for (var i = 0; i <= maxiter; ++i) {
        palette.push(color(i));
    }

    function mandel_iter(c) {
        var it = 0;
        var z = new Complex(0,0);
        while (++it < maxiter && z.sqmod() < 4) {
            //z = z.sqr().add(c);
            var tmp = z.real*z.real - z.imag*z.imag + c.real;
            z.imag = 2*z.real*z.imag + c.imag;
            z.real = tmp;
        }
        //console.log(c + " -> " + it);
        return it;
    }
    
    function renderSome() {
        if(y < h) {
            for (var x = 0; x < w; ++x) {
                var n = mandel_iter(xform.px2z(x, y));
                data[y * w + x] = palette[n];
            }
            imgData.data.set(buf8);
            ctx.putImageData(imgData, 0,0);
            ++y;
            setTimeout(renderSome, 0);
        }
    }
    renderSome();
}
