var Complex = function(real, imag) {
	if (!(this instanceof Complex)) {
		return new Complex (real, imag);
	}
	this.real = Number(real) || 0;
	this.imag = Number(imag) || 0;
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
    
    mod: function() {
	return Math.sqrt(this.real * this.real + this.imag * this.imag);
    }
};
