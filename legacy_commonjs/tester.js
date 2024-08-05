//my bootleg tester

let startTime = Date.now();
let maxTests = 0;
const isTestPassed = {
	total: 0,
	failed: 0,
	passed: 0
};// format: test message: true/false (if test failed or not)

const describe = (describeMessage, describeCb) => {
	
	describeCb(function testHandler(message, cb) {
		test(`${describeMessage} > ${message}`, cb);
	});
	
};

const test = (message, cb) => {
	isTestPassed[message] = Symbol("pending");
	incrementTests();
	cb(function expectHandler(value) {
		return expect(value, message);
	});
	
};

const incrementTests = () => isTestPassed.tests++;
const incrementPassed = () => isTestPassed.passed++;
const incrementFailed = () => isTestPassed.failed++;

const assertions = numberOfTests => {
	if(isNaN(numberOfTests))
		throw new Error("the number of tests given was not a type of number ");
	maxTests = numberOfTests;
};

const it = test;

const startTest = () => startTime = Date.now();
const endTest = () => {
	const time = Date.now() - startTime;
	console.log(`\n\n\x1b[1m${"\x1b[1mTests:\x1b[0m".padEnd(" ",10)}\x1b[31m${isTestPassed.failed} failed\x1b[0m, \x1b[32m${isTestPassed.passed} passed\x1b[0m, ${isTestPassed} total\n${"\x1b[1mTime:\x1b[0m".padEnd(" ",10)}`);
};

const expect = (value, message) => {
	return {
		toEqual: toCompare => toEqual(value, toCompare, message),
		toStrictEqual: toCompare => toStrictEqual(value, toCompare, message),
		toTypeEqual: toCompare => toTypeEqual(value, toCompare, message),
		toStrictTypeEqual: toCompare => toTypeEqual(value, toCompare, message),
		toBe: toCompare => toBe(value, toCompare, message),
	
		toNotEqual: toCompare => toEqual(value, toCompare, message),
		toStrictNotEqual: toCompare => toStrictEqual(value, toCompare, message),
		toTypeNotEqual: toCompare => toTypeEqual(value, toCompare, message),
		toStrictTypeNotEqual: toCompare => toTypeEqual(value, toCompare, message),
		toNotBe: toCompare => toBe(value, toCompare, message),
	
		not: {
			toNotEqual: toCompare => toEqual(value, toCompare, message),
			toStrictNotEqual: toCompare => toStrictEqual(value, toCompare, message),
			toTypeNotEqual: toCompare => toTypeEqual(value, toCompare, message),
			toStrictTypeNotEqual: toCompare => toTypeEqual(value, toCompare, message),
			toNotBe: toCompare => toBe(value, toCompare, message),
		}
	};
};

const printFailed = message => {
	console.log(`\x1b[31m✕\x1b[0m \x1b[90m${message}\x1b[0m`);
	checkIfLastTest();
};

const printReturned = value => {
	console.log("\x1b[1mReturned:\x1b[0m "+value);
};

const printPassed = message => {
	console.log(`\x1b[32m✓\x1b[0m \x1b[90m${message}\x1b[0m`);
	checkIfLastTest();
};

const checkIfLastTest = () => {
	if(isTestPassed >= maxTests)endTest();
};

const toBe = (value, toCompare, message) => {
	if(Object.is(value, toCompare)) {
		printPassed(message);
		isTestPassed[message] = true;
		incrementPassed();
	} else {
		printFailed(message);
		printReturned(value);
		isTestPassed[message] = false;
		incrementFailed();
	}
};

const toTypeEqual = (value, toCompare, message) => {
	if(typeof value == toCompare) {
		printPassed(message);
		isTestPassed[message] = true;
		incrementPassed();
	} else {
		printFailed(message);
		printReturned(value);
		isTestPassed[message] = false;
		incrementFailed();
	}
};

const toStrictTypeEqual = (value, toCompare, message) => {
	if(typeof value === toCompare) {
		printPassed(message);
		isTestPassed[message] = true;
		incrementPassed();
	} else {
		printFailed(message);
		printReturned(value);
		isTestPassed[message] = false;
		incrementFailed();
	}
};

const toEqual = (value, toCompare, message) => {
	if(value == toCompare) {
		printPassed(message);
		isTestPassed[message] = true;
		incrementPassed();
	} else {
		printFailed(message);
		printReturned(value);
		isTestPassed[message] = false;
		incrementFailed();
	}
};

const toStrictEqual = (value, toCompare, message) => {
	if(value === toCompare) {
		printPassed(message);
		isTestPassed[message] = true;
		incrementPassed();
	} else {
		printFailed(message);
		printReturned(value);
		isTestPassed[message] = false;
		incrementFailed();
	}
};

//inverted, aka 'not'

const toNotBe = (value, toCompare, message) => {
	if(!Object.is(value, toCompare)) {
		printPassed(message);
		isTestPassed[message] = true;
		incrementPassed();
	} else {
		printFailed(message);
		printReturned(value);
		isTestPassed[message] = false;
		incrementFailed();
	}
};

const toTypeNotEqual = (value, toCompare, message) => {
	if(typeof value != toCompare) {
		printPassed(message);
		isTestPassed[message] = true;
		incrementPassed();
	} else {
		printFailed(message);
		printReturned(value);
		isTestPassed[message] = false;
		incrementFailed();
	}
};

const toStrictTypeNotEqual = (value, toCompare, message) => {
	if(typeof value !== toCompare) {
		printPassed(message);
		isTestPassed[message] = true;
		incrementPassed();
	} else {
		printFailed(message);
		printReturned(value);
		isTestPassed[message] = false;
		incrementFailed();
	}
};

const toNotEqual = (value, toCompare, message) => {
	if(value != toCompare) {
		printPassed(message);
		isTestPassed[message] = true;
		incrementPassed();
	} else {
		printFailed(message);
		printReturned(value);
		isTestPassed[message] = false;
		incrementFailed();
	}
};

const toStrictNotEqual = (value, toCompare, message) => {
	if(value !== toCompare) {
		printPassed(message);
		isTestPassed[message] = true;
		incrementPassed();
	} else {
		printFailed(message);
		printReturned(value);
		isTestPassed[message] = false;
		incrementFailed();
	}
};

/*
//test usage:
test("10 + 5 = 15", expect => {
	expect(10 + 5).toStrictEqual(10)
})

describe("hello world", test => {
	test("is 'true' a bool type", expect => {
		expect(true).toStrictTypeEqual("boolean")
	})
})
*/

//✕
//✓

module.exports = {
	test,
	describe,
	it,
	startTest,
	endTest,
	assertions
};