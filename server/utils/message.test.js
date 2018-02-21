var expect = require("expect");

var {generateMessage} = require('./message');

describe("generateMessage()", () => {
    it("Should generate correct message object", () => {
        var from = 'Jen';
        var text = 'Some Message';
        var message = generateMessage(from, text);

        //expect(message.createdAt).toBe('number')
        expect(message).toHaveProperty({from, text});

    });
});