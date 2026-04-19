// Test the regex patterns used in the Medication model

// Test cases
const testCases = [
  '08:30 AM',     // Should pass (12-hour)
  '2:15 PM',      // Should pass (12-hour)
  '08:30',        // Should pass (24-hour)
  '14:15',        // Should pass (24-hour)
  '8:30 AM',      // Should pass (12-hour, single digit hour)
  '12:00 PM',     // Should pass (12-hour)
  '00:00',        // Should pass (24-hour, midnight)
  '23:59',        // Should pass (24-hour, last minute)
  '25:00',        // Should fail (invalid hour)
  '12:60 AM',     // Should fail (invalid minute)
  '8:30XM',       // Should fail (invalid period)
];

console.log('Testing regex patterns:');

console.log('\nTest cases:');
testCases.forEach(testCase => {
  const originalResult = /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i.test(testCase);
  const updatedResult = /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i.test(testCase) || 
                        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(testCase);
  
  console.log(`${testCase}: Original=${originalResult}, Updated=${updatedResult}`);
});