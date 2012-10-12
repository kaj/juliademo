var JuliaDemo = function(canvas) {
    this.canvas = canvas;
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

JuliaDemo.prototype = {
    step: 10,
    maxiter: 20,
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
            var x = i / this.maxiter,
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
            r = 0.5 + Math.sin(timing/4000)*0.4,
            c = new Complex(r*Math.sin(timing/2000), r*Math.cos(timing/2000));
        
        var imgData = this.ctx.getImageData(0,0,500,400),
        buf = new ArrayBuffer(imgData.data.length),
        buf8 = new Uint8ClampedArray(buf),
        data = new Uint32Array(buf);
        
        for (var x = 0; x < 500; x += this.step) {
            for (var y = 0; y < 400; y += this.step) {
                var z = new Complex((x-250)/200, (y-200)/170);
                var v = this.palette[this.v(z,c)];
                if (this.step == 1) {
                    data[y * 500 + x] = v;
                } else {
                    for (var yy = y; yy < y+this.step; ++yy) {
                        var i0 = yy * 500 + x;
                        for (var i = i0; i < i0 + this.step; ++i) {
                            data[i] = v;
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
	if (elapsed < 100 /* ms */ && this.step > 1) {
            this.step = this.step - 1;
	} else if(elapsed > 250) {
            this.step = this.step + 1;
	}
        if (this.running) {
            var demo = this;
            requestAnimFrame(function() {demo.render()})
        }
    }
}
