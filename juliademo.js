var JuliaDemo = function(canvas) {
    this.canvas = canvas;
    this.w = canvas.width;
    this.h = canvas.height;
    this.ctx = canvas.getContext('2d');
    this.initPalette();
}
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
          };
})();

window.performance = window.performance || {};
performance.now = (function() {
  return performance.now       ||
         performance.mozNow    ||
         performance.msNow     ||
         performance.oNow      ||
         performance.webkitNow ||
         function() { return new Date().getTime(); };
})();

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
    render: function() {
        var timing = performance.now(),
            r = 0.7 + Math.sin(timing/9347)*0.4,
            c = new Complex(r*Math.sin(timing/2000)-0.2, r*Math.cos(timing/2000));
        
        var imgData = this.ctx.getImageData(0,0,this.w,this.h),
        buf = new ArrayBuffer(imgData.data.length),
        buf8 = new Uint8ClampedArray(buf),
        data = new Uint32Array(buf);
        
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
                            data[i0++] = v;
                        }
                    }
                }
            }
        }
        imgData.data.set(buf8);
        this.ctx.putImageData(imgData, 0,0);
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
            requestAnimFrame(function() {demo.render()})
        }
    }
}
