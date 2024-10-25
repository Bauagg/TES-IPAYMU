function isValid(s) {
    let stack = [];
    let mapping = {
        ')': '(',
        '}': '{',
        ']': '[',
        '>': '<'
    };

    for (let i = 0; i < s.length; i++) {
        let char = s[i];

        if (mapping[char]) {
            let topElement = stack.length === 0 ? '#' : stack.pop();
            if (topElement !== mapping[char]) {
                return false;
            }
        } else {
            stack.push(char);
        }
    }

    return stack.length === 0;
}

// Test cases
console.log(isValid("([{}])")); // Output: true
console.log(isValid("(]"));     // Output: false
