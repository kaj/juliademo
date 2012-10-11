var JuliaDemo = function(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.initPalette();
}

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
            return '#000';
        } else {
            var x = i / this.maxiter,
            rgb = (Math.round(240-240*x) << 16) | (Math.round(180*x) << 8) | (Math.round(210-420*Math.abs(x-.5)));
            return '#' + rgb.toString(16);
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
        for (var x = 0; x < 500; x += this.step) {
            for (var y = 0; y < 400; y += this.step) {
                var z = new Complex((x-250)/200, (y-200)/170);
                this.ctx.fillStyle = this.palette[this.v(z,c)];
                this.ctx.fillRect(x, y, this.step, this.step);
            }
        }
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
            setTimeout(function() {demo.render()}, 25)
        }
    }
}
