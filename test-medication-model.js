// Simple test to check medication model validation
const timeTests = [
  '08:30 AM',
  '2:15 PM',
  '08:30',
  '14:15',
  'invalid time'
];

console.log('Testing time validation:');
timeTests.forEach(time => {
  const result1 = /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i.test(time);
  const result2 = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
  const combined = result1 || result2;
  
  console.log(`${time}: ${combined} (12-hour: ${result1}, 24-hour: ${result2})`);
});