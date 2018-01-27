var expect = require('expect');

var { isRealString } = require('./validator');

describe('isRealString function', () => {
    it('should reject non-string values', () => {
        var res = isRealString(98);
        expect(res).toBe(false);
    });
    it('should reject string with only spaces', () => {
        var res = isRealString('     ');
        expect(res).toBe(false);
    });
    it('should allow string with non-space characters', () => {
        var res = isRealString('  SAngeet Parashar ');
        expect(res).toBe(true);
    });

});