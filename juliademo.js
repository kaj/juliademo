var JuliaDemo = function(canvas) {
    if (!(this instanceof JuliaDemo)) {
	return new JuliaDemo(canvas);
    }
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
}

JuliaDemo.prototype = {
    step: 10,
    maxiter: 20,
    
    v: function(z, c) {
        var it = 0;
        while (it < this.maxiter && z.mod() < 1.7) {
            z = z.multiply(z).add(c);
            it = it + 1;
        }
        return it;
    },
    color: function(i) {
        if (i >= this.maxiter) {
            return 'black';
        } else {
            var x = i / this.maxiter;
            return "rgb(" + (255-250*x).toFixed() + "," + (180*x).toFixed() + "," + (210-420*Math.abs(x-.5)).toFixed() + ")";
        }
    },
    render: function(c) {
	var timing = performance.now()
        var x, y;
        for (x = 0; x < 500; x += this.step) {
            for (y = 0; y < 400; y += this.step) {
	        var z = Complex((x-250)/220, (y-200)/180);
	        this.ctx.fillStyle = this.color(this.v(z,c));
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
    }
}
