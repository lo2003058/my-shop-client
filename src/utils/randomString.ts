// get random string in array, and each string has Weighted probability
//  eg: [
//    { value: "Never Gonna Give You Up", weight: 0.166 },
//    { value: "Never gonna let you down", weight: 0.166 },
//    { value: "Never gonna run around and desert you", weight: 0.166 },
//    { value: "Never gonna make you cry", weight: 0.166 },
//    { value: "Never gonna say goodbye", weight: 0.166 },
//    { value: "Never gonna tell a lie and hurt you", weight: 0.166 },
//    { value: "Hi, Im Yin", weight: 0.003 },
//    { value: "OK, You found discount code: LOVE_VEDA", weight: 0.001 },
//  ]

const randomStringArray = [
  { value: "Never Gonna Give You Up.", weight: 0.166 },
  { value: "Never gonna let you down.", weight: 0.166 },
  { value: "Never gonna run around and desert you.", weight: 0.166 },
  { value: "Never gonna make you cry.", weight: 0.166 },
  { value: "Never gonna say goodbye.", weight: 0.166 },
  { value: "Never gonna tell a lie and hurt you.", weight: 0.166 },
  { value: "You only have 1% change get the code.", weight: 0.003 },
  { value: "OK, You found discount code: LOVE_VEDA", weight: 0.001 },
];

export const randomString = () => {
  const random = Math.random();
  let sum = 0;
  for (const item of randomStringArray) {
    sum += item.weight;
    if (random < sum) {
      return item.value;
    }
  }
  return randomStringArray[randomStringArray.length - 1].value;
};
