// src/data/wordlist.js
// 30 words — 5 per grade, grades 3–8. No word repeats across any grade.

export const WORDS = [
  // ─── Grade 3 ───────────────────────────────────────────────────────────────
  {
    id: 'g3_actually',
    grade: 3,
    word: 'actually',
    partOfSpeech: 'adverb',
    definition: 'used to say what is really true, especially when it differs from what was expected',
    sentenceA: 'I thought the test would be hard, but it was actually pretty easy.',
    sentenceB: 'She actually walked to school every single day that week.',
    correct: 'A',
    explanation:
      '"Actually" signals a contrast with a prior expectation; B uses it as a filler with no contrast implied.',
  },
  {
    id: 'g3_appear',
    grade: 3,
    word: 'appear',
    partOfSpeech: 'verb',
    definition: 'to come into view; to become visible',
    sentenceA: 'Tiny green buds began to appear on the branches as spring arrived.',
    sentenceB: 'She appeared her new sketchbook to show her friends at lunch.',
    correct: 'A',
    explanation:
      '"Appear" is intransitive and means to come into view on its own; it cannot take a direct object as B incorrectly uses it.',
  },
  {
    id: 'g3_brave',
    grade: 3,
    word: 'brave',
    partOfSpeech: 'adjective',
    definition: 'ready to face danger or difficulty without showing fear',
    sentenceA: 'The brave firefighter ran into the burning building to rescue the trapped child.',
    sentenceB: 'She was brave enough to eat all of her vegetables at dinner that evening.',
    correct: 'A',
    explanation:
      '"Brave" means showing courage in the face of real danger; choosing to eat vegetables involves preference, not the courage required to face genuine risk.',
  },
  {
    id: 'g3_gentle',
    grade: 3,
    word: 'gentle',
    partOfSpeech: 'adjective',
    definition: 'soft and careful, not rough or violent',
    sentenceA: 'The nurse had a gentle touch as she carefully cleaned and bandaged the wound.',
    sentenceB: 'He gave the door a gentle slam so it would close all the way.',
    correct: 'A',
    explanation:
      '"Gentle" means soft and careful; a "slam" is by definition forceful, making "gentle slam" a direct contradiction.',
  },
  {
    id: 'g3_kind',
    grade: 3,
    word: 'kind',
    partOfSpeech: 'adjective',
    definition: 'considerate and generous toward others',
    sentenceA: 'It was kind of Maya to share her lunch with a student who had forgotten theirs.',
    sentenceB: 'He was kind enough to finish all of his homework before going out to play.',
    correct: 'A',
    explanation:
      '"Kind" means considerate or generous toward others; finishing your own homework is responsible behaviour, not an act of kindness toward someone.',
  },

  // ─── Grade 4 ───────────────────────────────────────────────────────────────
  {
    id: 'g4_significant',
    grade: 4,
    word: 'significant',
    partOfSpeech: 'adjective',
    definition: 'important or meaningful enough to be worth noting',
    sentenceA: "Winning the championship was a significant moment in the school's history.",
    sentenceB: 'She wore a significant coat to the winter carnival to stay warm.',
    correct: 'A',
    explanation:
      '"Significant" means having great importance or meaning; a coat can be warm or stylish, but "significant" describes impact and importance, not physical objects like clothing.',
  },
  {
    id: 'g4_immediate',
    grade: 4,
    word: 'immediate',
    partOfSpeech: 'adjective',
    definition: 'happening or needed at once, without delay',
    sentenceA: 'The deep cut required immediate attention from the school nurse.',
    sentenceB: 'She gave an immediate glance at the board before writing down the answer.',
    correct: 'A',
    explanation:
      '"Immediate" means requiring urgent action without any delay; glancing at a board is a quick action but carries no sense of urgency.',
  },
  {
    id: 'g4_abundant',
    grade: 4,
    word: 'abundant',
    partOfSpeech: 'adjective',
    definition: 'existing in large quantities; more than enough',
    sentenceA: 'After weeks of spring rain, wildflowers were abundant along the hillside.',
    sentenceB: 'She was abundant with her time, arriving at every event exactly on schedule.',
    correct: 'A',
    explanation:
      '"Abundant" means existing in large quantities; being punctual is being "prompt" — "abundant with time" is not a valid expression because the word describes quantities, not behaviour.',
  },
  {
    id: 'g4_capable',
    grade: 4,
    word: 'capable',
    partOfSpeech: 'adjective',
    definition: 'having the ability or skill to do something',
    sentenceA: 'She proved she was capable of leading the group when the teacher stepped out.',
    sentenceB: 'The storage box was capable enough to hold all the books on the shelf.',
    correct: 'A',
    explanation:
      '"Capable" describes a person\'s ability to perform a task requiring skill; for objects you say "large enough" or "sturdy enough" — "capable" implies intentional human agency.',
  },
  {
    id: 'g4_essential',
    grade: 4,
    word: 'essential',
    partOfSpeech: 'adjective',
    definition: 'absolutely necessary; something that cannot be done without',
    sentenceA: 'Water is essential for all living things to survive.',
    sentenceB: 'She packed her essential suitcase the night before the school trip.',
    correct: 'A',
    explanation:
      '"Essential" means absolutely necessary; a suitcase can be "packed" or "ready," but the suitcase itself is not what is essential — it is a container, not a necessity.',
  },

  // ─── Grade 5 ───────────────────────────────────────────────────────────────
  {
    id: 'g5_benefit',
    grade: 5,
    word: 'benefit',
    partOfSpeech: 'noun',
    definition: 'an advantage or positive result gained from something',
    sentenceA: 'One benefit of reading daily is that it gradually builds your vocabulary.',
    sentenceB: 'She gave her friend a benefit for helping carry the boxes to the classroom.',
    correct: 'A',
    explanation:
      'A "benefit" is an advantage that comes from something; giving something in return for help is a "reward" or "gift," not a benefit.',
  },
  {
    id: 'g5_conflict',
    grade: 5,
    word: 'conflict',
    partOfSpeech: 'noun',
    definition: 'a serious disagreement or struggle between opposing forces or people',
    sentenceA: 'The conflict between the two characters made the story more tense and compelling.',
    sentenceB: 'She solved the conflict puzzle in record time during the maths competition.',
    correct: 'A',
    explanation:
      '"Conflict" means a struggle between opposing forces; a puzzle is a challenge, not a conflict, which requires opposing parties.',
  },
  {
    id: 'g5_evident',
    grade: 5,
    word: 'evident',
    partOfSpeech: 'adjective',
    definition: 'clearly seen or understood from the available information',
    sentenceA: 'It was evident from her expression that she had not expected the surprise party.',
    sentenceB: 'She wore an evident badge so that the judges could clearly see her name.',
    correct: 'A',
    explanation:
      '"Evident" means clearly understood from observation or evidence; a badge is "visible" or "legible" — "evident" describes conclusions drawn from context, not physical objects.',
  },
  {
    id: 'g5_authentic',
    grade: 5,
    word: 'authentic',
    partOfSpeech: 'adjective',
    definition: 'genuinely original and not a copy or imitation',
    sentenceA: 'The museum displayed an authentic letter written by Abraham Lincoln in 1863.',
    sentenceB: 'She gave an authentic try at winning the spelling bee by practising each evening.',
    correct: 'A',
    explanation:
      '"Authentic" means genuinely original and not a copy; it applies to objects or sources — an effort is better described as "genuine" or "sincere."',
  },
  {
    id: 'g5_elaborate',
    grade: 5,
    word: 'elaborate',
    partOfSpeech: 'adjective',
    definition: 'detailed and complicated; involving many carefully arranged parts',
    sentenceA: 'The birthday cake had an elaborate design with dozens of hand-crafted sugar flowers.',
    sentenceB: 'She gave an elaborate answer to the question: "Yes, I completely agree with you."',
    correct: 'A',
    explanation:
      '"Elaborate" means highly detailed and complex; a brief one-phrase reply is the direct opposite of elaborate.',
  },

  // ─── Grade 6 ───────────────────────────────────────────────────────────────
  {
    id: 'g6_advocate',
    grade: 6,
    word: 'advocate',
    partOfSpeech: 'verb',
    definition: 'to publicly support or recommend a particular cause or policy',
    sentenceA: 'The organisation advocates for stricter pollution controls to protect public health.',
    sentenceB: 'She advocated her way through the crowded hallway to reach her next class on time.',
    correct: 'A',
    explanation:
      '"Advocate" means to publicly support a cause; moving through a crowd is "pushing" or "making your way" — advocacy is about speaking up, not physical movement.',
  },
  {
    id: 'g6_credible',
    grade: 6,
    word: 'credible',
    partOfSpeech: 'adjective',
    definition: 'able to be believed and trusted; convincing',
    sentenceA: 'The witness gave a credible account of the events, supported by consistent details.',
    sentenceB: 'She wore a credible outfit to the interview to make a strong first impression.',
    correct: 'A',
    explanation:
      '"Credible" means able to be believed and trusted; clothing can be "appropriate" or "professional" — "credible" applies to claims, sources, and testimony, not appearance.',
  },
  {
    id: 'g6_ethical',
    grade: 6,
    word: 'ethical',
    partOfSpeech: 'adjective',
    definition: 'relating to moral principles; following rules of right conduct',
    sentenceA: "A doctor who shares a patient's private records without consent is not acting ethically.",
    sentenceB: 'She wrote an ethical essay with a strong introduction, clear arguments, and a solid conclusion.',
    correct: 'A',
    explanation:
      '"Ethical" relates to moral principles and right conduct; essay structure is "well-organised" or "coherent" — structure has nothing to do with ethics.',
  },
  {
    id: 'g6_eloquent',
    grade: 6,
    word: 'eloquent',
    partOfSpeech: 'adjective',
    definition: 'able to express ideas clearly and persuasively in speech or writing',
    sentenceA: 'His eloquent speech moved the audience with its precise and carefully chosen words.',
    sentenceB: 'She was eloquent enough to complete the 10-kilometre race without stopping once.',
    correct: 'A',
    explanation:
      '"Eloquent" describes the ability to express ideas fluently and persuasively; completing a race requires physical endurance, not verbal skill.',
  },
  {
    id: 'g6_feasible',
    grade: 6,
    word: 'feasible',
    partOfSpeech: 'adjective',
    definition: 'possible to do easily or conveniently; practical',
    sentenceA: 'Building a rooftop garden is feasible if the budget and structural support allow it.',
    sentenceB: 'She was feasible about completing her project on time despite the heavy workload.',
    correct: 'A',
    explanation:
      '"Feasible" means practically possible and achievable; people can be "confident" or "optimistic" — "feasible" applies to plans and ideas, not to people\'s attitudes.',
  },

  // ─── Grade 7 ───────────────────────────────────────────────────────────────
  {
    id: 'g7_abstract',
    grade: 7,
    word: 'abstract',
    partOfSpeech: 'adjective',
    definition: 'existing as an idea rather than as a physical or concrete thing',
    sentenceA: 'Justice is an abstract concept — you can sense its absence but cannot hold it in your hand.',
    sentenceB: 'She drew an abstract line beneath the most important sentence in her revision notes.',
    correct: 'A',
    explanation:
      '"Abstract" means existing as an idea rather than a concrete thing; underlining is a physical act and the line would be "straight" or "neat," not abstract.',
  },
  {
    id: 'g7_arbitrary',
    grade: 7,
    word: 'arbitrary',
    partOfSpeech: 'adjective',
    definition: 'based on random choice or personal whim rather than any reason or system',
    sentenceA: 'The penalty seemed arbitrary — no clear rule had been broken and no explanation was given.',
    sentenceB: 'She applied an arbitrary level of effort to ensure she won the regional science competition.',
    correct: 'A',
    explanation:
      '"Arbitrary" means based on random whim rather than reason; deliberately working to win a competition is purposeful, the opposite of arbitrary.',
  },
  {
    id: 'g7_coherent',
    grade: 7,
    word: 'coherent',
    partOfSpeech: 'adjective',
    definition: 'logically consistent and easy to follow; forming a unified whole',
    sentenceA: 'Her argument was coherent — each point followed logically from the one before it.',
    sentenceB: 'He gave a coherent shake of his head to signal that he strongly disagreed.',
    correct: 'A',
    explanation:
      '"Coherent" means logically consistent and easy to follow; it applies to language and reasoning — a physical gesture is "clear" or "firm," not coherent.',
  },
  {
    id: 'g7_dormant',
    grade: 7,
    word: 'dormant',
    partOfSpeech: 'adjective',
    definition: 'temporarily inactive or in a resting state; not currently active',
    sentenceA: 'The volcano had been dormant for over two centuries, showing no signs of activity.',
    sentenceB: 'She gave a dormant reply, full of energy and enthusiasm for the new proposal.',
    correct: 'A',
    explanation:
      '"Dormant" means temporarily inactive or in a resting state; a reply described as full of energy and enthusiasm is the direct opposite of dormant.',
  },
  {
    id: 'g7_ephemeral',
    grade: 7,
    word: 'ephemeral',
    partOfSpeech: 'adjective',
    definition: 'lasting for a very short time; short-lived',
    sentenceA: 'The ephemeral beauty of cherry blossoms lasts only a few days each spring.',
    sentenceB: 'She delivered an ephemeral performance that critics are still discussing twenty years later.',
    correct: 'A',
    explanation:
      '"Ephemeral" means lasting for a very short time; a performance still discussed two decades later has had lasting impact — the opposite of ephemeral.',
  },

  // ─── Grade 8 ───────────────────────────────────────────────────────────────
  {
    id: 'g8_ambiguous',
    grade: 8,
    word: 'ambiguous',
    partOfSpeech: 'adjective',
    definition: 'open to more than one interpretation; not having one obvious meaning',
    sentenceA: 'The wording of the contract clause was ambiguous, open to two very different interpretations.',
    sentenceB: 'She gave an ambiguous answer that left absolutely no room for doubt or misunderstanding.',
    correct: 'A',
    explanation:
      '"Ambiguous" means open to more than one interpretation; an answer that leaves no room for doubt is clear and unambiguous — the direct opposite.',
  },
  {
    id: 'g8_apathy',
    grade: 8,
    word: 'apathy',
    partOfSpeech: 'noun',
    definition: 'a lack of interest, enthusiasm, or concern',
    sentenceA: 'Widespread apathy among voters meant that fewer than thirty percent turned out on election day.',
    sentenceB: 'Her apathy for the subject drove her to spend every evening reading every book she could find on it.',
    correct: 'A',
    explanation:
      '"Apathy" means a lack of interest or concern; spending every evening studying a subject shows deep engagement, the direct opposite of apathy.',
  },
  {
    id: 'g8_audacious',
    grade: 8,
    word: 'audacious',
    partOfSpeech: 'adjective',
    definition: 'showing a willingness to take bold risks; daring and fearless',
    sentenceA: "It was audacious of the young architect to publicly challenge the city's entire planning committee.",
    sentenceB: 'She wore an audacious expression of quiet concentration through the three-hour final examination.',
    correct: 'A',
    explanation:
      '"Audacious" means showing bold, daring confidence in the face of risk; quiet concentration during an exam is focused and careful — not bold or daring.',
  },
  {
    id: 'g8_austere',
    grade: 8,
    word: 'austere',
    partOfSpeech: 'adjective',
    definition: 'severely simple and plain; without comfort or luxury',
    sentenceA: 'The reformer lived an austere life — a single bare room, plain food, and no comforts whatsoever.',
    sentenceB: 'She maintained an austere diet of her favourite foods to stay energised during the athletics season.',
    correct: 'A',
    explanation:
      '"Austere" means severely plain and self-denying; a diet consisting of one\'s favourite foods is indulgent, the direct opposite of austere.',
  },
  {
    id: 'g8_benevolent',
    grade: 8,
    word: 'benevolent',
    partOfSpeech: 'adjective',
    definition: 'well-meaning and generous; showing kindness and goodwill toward others',
    sentenceA: 'The benevolent donor quietly funded university scholarships for dozens of students each year.',
    sentenceB: 'He had a benevolent rivalry with his classmate, determined to outperform her at every opportunity.',
    correct: 'A',
    explanation:
      '"Benevolent" means generously kind and well-meaning toward others; a rivalry driven by wanting to outperform someone is competitive, not benevolent.',
  },
];

export function getWordsForGrade(grade) {
  return WORDS.filter((w) => w.grade === grade);
}
