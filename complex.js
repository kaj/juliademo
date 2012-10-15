var Complex = function(real, imag) {
    this.real = Number(real) || 0;
    this.imag = Number(imag) || 0;
};

function PolarComplex(r, phi) {
    return new Complex(r * Math.sin(phi), r * Math.cos(phi));
};

Complex.prototype = {
    real: 0,
    imag: 0,

    add: function(operand) {
	return new Complex(this.real + operand.real, this.imag + operand.imag);
    },

    subtract: function(operand) {
	return new Complex(this.real - operand.real, this.imag - operand.imag);
    },

    multiply: function(operand) {
	return new Complex(
	    this.real * operand.real - this.imag * operand.imag,
	    this.real * operand.imag + this.imag * operand.real);
    },

    sqr: function() {
	return new Complex(
	    this.real*this.real - this.imag*this.imag,
	    2*this.real*this.imag);
    },

    mod: function() {
	return Math.sqrt(this.real * this.real + this.imag * this.imag);
    },

    sqmod: function() {
	return this.real*this.real + this.imag*this.imag;
    },

    toString: function() {
	if (this.imag >= 0) {
	    return this.real.toFixed(4) + '+' + this.imag.toFixed(4) + 'i';
	} else {
	    return this.real.toFixed(4) + '' + this.imag.toFixed(4) + 'i';
	}
    },
};
