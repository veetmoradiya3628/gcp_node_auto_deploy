const assert = require('assert');
const Calculator = require('./../calculator');

describe('Calculator Tests', function () {
    let calculator;

    beforeEach(function () {
        calculator = new Calculator();
    });

    it('should return the correct sum', function () {
        assert.strictEqual(calculator.add(2, 3), 5);
    });

    it('should return the correct difference', function () {
        assert.strictEqual(calculator.subtract(5, 3), 2);
    });

    it('should return the correct product', function () {
        assert.strictEqual(calculator.multiply(2, 3), 6);
    });

    it('should return the correct quotient', function () {
        assert.strictEqual(calculator.divide(6, 3), 2);
    });

    it('should throw an error when dividing by zero', function () {
        assert.throws(() => calculator.divide(6, 0), /Division by zero/);
    });
});
