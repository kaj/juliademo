var JuliaDemo = function(canvas) {
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
    render: function() {
        var timing = performance.now(),
            r = 0.5 + Math.sin(timing/4000)*0.4,
            c = new Complex(r*Math.sin(timing/2000), r*Math.cos(timing/2000));
        for (var x = 0; x < 500; x += this.step) {
            for (var y = 0; y < 400; y += this.step) {
                var z = new Complex((x-250)/200, (y-200)/170);
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
        var demo = this;
        setTimeout(function() {demo.render()}, 25)
    }
}
