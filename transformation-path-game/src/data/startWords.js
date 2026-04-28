// Starting words for each round — 3 or 4 letters, common enough to have many neighbours
export const START_WORDS = [
  'cat','dog','hat','run','big','hot','cup','map','sun','red',
  'top','bat','sit','lip','fog','mud','wax','beg','zip','fan',
  'pit','log','jot','hem','vat','cob','wig','nip','dug','pew',
  'rot','sag','tin','ore','rap','cod','lad','yak','jab','gag',
  'core','mate','sale','pile','bone','tide','lane','rope','cake','pine',
  'mole','rate','hive','lone','bane','fame','dote','lame','vine','kite',
];

export function randomStartWord() {
  return START_WORDS[Math.floor(Math.random() * START_WORDS.length)];
}
