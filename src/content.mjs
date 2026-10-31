// All site copy and facts in one place. Course text is taken from the current ridesafe.net,
// tidied for reading; the CBT price and booking notes come from the school's own booking system.

export const site = {
  name: 'Ridesafe',
  fullName: 'Ridesafe Motorcycle School',
  url: 'https://www.ridesafe.net',
  tagline: 'Yorkshire’s most loved motorcycle school',
  phone: '01274 686886',
  phoneHref: 'tel:01274686886',
  whatsapp: '07760 624531',
  whatsappHref: 'https://wa.me/447760624531',
  email: 'info@ridesafe.net',
  address: { street: '148 Broadstone Way', town: 'Bradford', postcode: 'BD4 9BU', region: 'West Yorkshire' },
  geo: { lat: 53.7766797, lng: -1.7105842 },
  areas: ['Bradford', 'Leeds', 'Halifax', 'Keighley'],
  // Tuesday to Sunday, 8am to 5pm. Days use JS numbering (0 = Sunday).
  hours: { days: [2, 3, 4, 5, 6, 0], open: 8, close: 17, label: 'Tuesday to Sunday, 8am–5pm', short: 'Tue–Sun 8am–5pm' },
  appointmentNote: 'Visits are by appointment only.',
  instagram: 'https://www.instagram.com/ridesafe01274686886',
  facebook: 'https://www.facebook.com/motorcycletrainingbradford',
  maps: {
    google: 'https://www.google.com/maps?q=Ridesafe+Motorcycle+School,+148+Broadstone+Way,+Bradford+BD4+9BU',
    embed: 'https://www.google.com/maps?q=Ridesafe+Motorcycle+School,+148+Broadstone+Way,+Bradford+BD4+9BU&output=embed',
    apple: 'https://maps.apple.com/place?place-id=IBAAC087611F2372D&address=148+Broadstone+Way%2C+Bradford%2C+BD4+9BU%2C+England&coordinate=53.7766797%2C-1.7105842&name=Ridesafe+Motorcycle+School&_provider=9902',
    waze: 'https://www.waze.com/en/live-map/directions/gb/england/ridesafe-motorcycle-school?navigate=yes&place=ChIJnQ-Pqwfhe0gRsjeXd4yn6wc',
  },
  booking: {
    cbt: 'https://www.bookcbtnow.com/incontact/public/gateway.aspx?func_id=79A2A98E7C95DA57&obc_id=A950C0D230F6A8F7AADDD56ACE4264B6',
    roadRide: 'https://www.bookcbtnow.com/incontact/public/gateway.aspx?func_id=79A2A98E7C95DA57&obc_id=CD2CDF36B1D2875CABE79BC5C7C7FC9D',
  },
  // Shown by the online booking system on 2026-10-31; change here when the price changes.
  cbtPrice: '£174.99',
  cbtPriceNote: 'Standard day. Bank holidays cost more.',
  about: [
    'We are a DVSA approved motorcycle school with 30 years’ experience, offering professional motorcycle training for all experience levels across the north of England.',
    'We provide a fun, supportive environment with both male and female instructors.',
  ],
};

export const waLink = (text) => `${site.whatsappHref}?text=${encodeURIComponent(text)}`;

export const trust = [
  { icon: 'shield', title: 'DVSA approved', text: 'Fully certified instructors with years of experience.' },
  { icon: 'bike', title: 'Modern bikes', text: 'Learn on well-maintained motorcycles suited to every rider.' },
  { icon: 'calendar', title: 'Flexible scheduling', text: 'Courses that fit your week, weekdays or weekends.' },
  { icon: 'pin', title: 'Local coverage', text: 'Training across Bradford, Leeds, Halifax and Keighley.' },
];

// facts: rows for the "At a glance" table and the course comparison.
export const courses = [
  {
    slug: 'cbt',
    name: 'CBT',
    long: 'Compulsory Basic Training',
    menu: 'CBT',
    age: '16+',
    ageNote: '16 for a 50cc moped, 17 for a 125cc',
    summary: 'Start riding a 50cc or 125cc bike with L-plates in just one day.',
    lede: 'Compulsory Basic Training is your first step towards motorcycling freedom: one day, no test, and you leave able to ride on L-plates.',
    focus: '50% 62%',
    book: 'online',
    facts: {
      age: '16 (moped) or 17 (up to 125cc)',
      ride: 'Moped up to 50cc, or 125cc from 17',
      lPlates: 'Yes',
      passenger: 'No',
      motorways: 'No',
      theory: 'Not needed',
      length: 'One day, plus extra practice if you need it',
    },
    keywords: 'cbt compulsory basic training moped scooter 50cc 125cc learner l plates first beginner new rider dl196 certificate one day start learn to ride element e road ride price cost',
    sections: [
      {
        id: 'what', title: 'What is CBT?',
        body: [
          'CBT is a legal requirement for anyone who wants to ride a moped, scooter or motorbike on UK roads. It isn’t a test. It’s a one-day course that makes sure you can ride safely and confidently.',
          'When you complete it you get a certificate (DL196). It lets you ride a moped up to 50cc from age 16, or a motorbike or scooter up to 125cc from age 17, with L-plates.',
        ],
      },
      {
        id: 'who', title: 'Who needs a CBT?',
        list: [
          'Anyone 16 or over who wants to ride a moped (up to 50cc).',
          'Anyone 17 or over who wants to ride a motorbike or scooter up to 125cc.',
          'Anyone riding on a provisional licence who hasn’t passed a full motorcycle test yet.',
          'Car drivers who passed after February 2001 and want to ride a moped.',
        ],
      },
      {
        id: 'day', title: 'What happens on the day',
        intro: 'The day is split into five parts:',
        steps: [
          ['Introduction and eyesight check', ''],
          ['On-site training', 'Controls, basic handling and safety checks.'],
          ['On-site riding', 'Practice in a safe, off-road area.'],
          ['On-road training', 'Getting ready for the road and hazard awareness.'],
          ['On-road riding', 'At least two hours supervised on local roads.'],
        ],
        after: 'Our instructors support you every step of the way. If you need extra practice, we’ll make sure you get it.',
      },
      {
        id: 'bring', title: 'What to bring',
        checklist: [
          'Your UK provisional or full driving licence',
          'Sturdy boots and jeans (protective clothing if you have it)',
          'Gloves (we can lend you some)',
          'Glasses or contact lenses if you need them to read a number plate',
        ],
        after: 'We provide helmets, jackets and bikes if you don’t have your own.',
      },
      {
        id: 'before', title: 'Before you book',
        list: [
          'Use the email address of the person doing the training. Confirmations go there.',
          'You’ll need to speak and understand English well and know the Highway Code. It makes a real difference on the day.',
          `Started a CBT with us but still need the road ride (Element E)? <a href="${site.booking.roadRide}">Book just the road ride</a> instead of a full day.`,
        ],
      },
      {
        id: 'after', title: 'After your CBT',
        body: [
          'Your CBT certificate lasts for two years. In that time you can ride with L-plates, but you can’t carry passengers or use motorways.',
          'When you’re ready to go further, we train for the full licences too: A1, A2 and Direct Access.',
        ],
      },
    ],
    next: ['a1', 'a2', 'das'],
  },
  {
    slug: 'a1',
    name: 'A1 licence',
    long: 'A1 motorcycle licence',
    menu: 'A1 licence',
    age: '17+',
    ageNote: 'From age 17',
    summary: 'Ride a 125cc motorcycle with no L-plates and carry a passenger.',
    lede: 'Get your first full motorcycle licence on a 125cc. No L-plates, a passenger on the back, and real road confidence.',
    focus: '50% 58%',
    book: 'enquire',
    facts: {
      age: '17',
      ride: 'Up to 125cc and 11 kW (14.6 bhp)',
      lPlates: 'No',
      passenger: 'Yes',
      motorways: 'Yes',
      theory: 'Yes, before your practical tests',
      length: 'Mod 1 and Mod 2 tests',
    },
    keywords: 'a1 licence 125cc 11kw 14.6 bhp full licence no l plates passenger pillion motorway 17 commuter mod 1 mod 2 module test theory',
    sections: [
      {
        id: 'what', title: 'What is the A1 licence?',
        body: ['The A1 licence is a full licence on a 125cc bike. Once you pass you can ride up to 125cc and 11 kW (14.6 bhp) with no L-plates, carry a passenger and use motorways. It’s the natural next step after CBT if you want the freedom of a full licence on a smaller bike.'],
        list: [
          '<strong>Engine:</strong> up to 125cc',
          '<strong>Power:</strong> up to 11 kW (0.1 kW/kg power-to-weight)',
          '<strong>Age:</strong> 17 and over',
          '<strong>Perks:</strong> no L-plates, carry a pillion, motorway legal',
        ],
      },
      {
        id: 'who', title: 'Who is A1 for?',
        list: [
          'Riders aged 17 and over who have done, or will do, their CBT.',
          'Commuters who want a full licence on a light, cheap-to-run 125.',
          'New riders building experience before stepping up to A2.',
        ],
      },
      {
        id: 'learn', title: 'What you’ll learn',
        list: [
          'Confident slow control: U-turns, figure of eight, clutch and throttle balance.',
          'Progressive braking, emergency stops and hazard perception in real traffic.',
          'Cornering lines, road positioning and observation (“lifesavers”).',
          'Town and faster roads, roundabouts and junction planning.',
          'Test strategy and structured feedback, so you know exactly what to expect.',
        ],
      },
      {
        id: 'test', title: 'How the A1 test works',
        steps: [
          ['CBT and theory test', 'You need a valid CBT and a pass in the DVSA motorcycle theory and hazard perception test before booking practical tests.'],
          ['Module 1 (off-road)', 'Manoeuvres on a test pad: slalom and figure of eight, slow ride, U-turn, cornering and controlled stop, emergency stop and avoidance.'],
          ['Module 2 (on-road)', 'A road ride with the examiner following by radio: town and faster roads, independent riding and safety questions.'],
        ],
        after: 'Your A1 test bike must be 120–125cc, up to 11 kW, and able to reach at least 90 km/h.',
      },
      {
        id: 'included', title: 'What’s included',
        checklist: [
          'Friendly, DVSA-qualified instructors and structured lesson plans',
          'A 125cc training bike, or train on your own if it’s eligible',
          'Helmet, jacket and gloves if you need them',
          'Radio-equipped road sessions with calm, clear coaching',
          'Mock tests for Mod 1 and Mod 2, so there are no surprises on the day',
        ],
      },
      {
        id: 'bring', title: 'What to bring',
        checklist: [
          'Your UK provisional or full driving licence',
          'Your CBT certificate (DL196) and theory test pass number',
          'Sturdy boots and legwear, and your own kit if you have it',
          'Your own bike? It must be road legal, taxed, insured, MOT’d if needed, with L-plates for training',
        ],
      },
      {
        id: 'after', title: 'After you pass',
        list: [
          'Ride any 125cc, 11 kW bike with no L-plates, carry a passenger and use motorways.',
          'Move up to A2 from 19, either directly or by progressive access after two years on A1.',
          'We’ll help plan your route to A2 and the full A licence when you’re ready.',
        ],
      },
    ],
    next: ['a2', 'progressive-access'],
  },
  {
    slug: 'a2',
    name: 'A2 licence',
    long: 'A2 motorcycle licence',
    menu: 'A2 licence',
    age: '19+',
    ageNote: 'From age 19',
    summary: 'Ride a motorcycle up to 35 kW (47 bhp) or a restricted larger bike.',
    lede: 'Step up from 125s to bigger bikes. A2 lets you ride up to 35 kW (47 bhp) with proper power and confidence.',
    focus: '50% 42%',
    book: 'enquire',
    facts: {
      age: '19',
      ride: 'Up to 35 kW (47 bhp), or a bigger bike restricted to 35 kW',
      lPlates: 'No',
      passenger: 'Yes',
      motorways: 'Yes',
      theory: 'Yes, before your practical tests',
      length: 'Mod 1 and Mod 2 tests',
    },
    keywords: 'a2 licence 35kw 47bhp restricted bigger bike medium 19 full licence passenger pillion motorway mod 1 mod 2 module test theory 395cc',
    sections: [
      {
        id: 'what', title: 'What is the A2 licence?',
        body: ['A2 is a full motorcycle licence for riders aged 19 and over. You can ride any bike up to 35 kW (47 bhp), or a bigger bike restricted to 35 kW as long as its full power isn’t more than double that. You can lift the restriction later when you move on to a full A licence.'],
        list: [
          '<strong>Age:</strong> 19 and over',
          '<strong>Power:</strong> up to 35 kW (47 bhp), about 0.2 kW/kg',
          '<strong>Perks:</strong> no L-plates, carry a passenger, motorway legal',
        ],
      },
      {
        id: 'who', title: 'Who is A2 for?',
        list: [
          'Riders aged 19 and over who want a full licence and a bigger bike than a 125.',
          'Anyone coming from A1 or CBT who wants more power with sensible running costs.',
          'Commuters and new riders who want flexibility now and a path to the full A licence later.',
        ],
      },
      {
        id: 'learn', title: 'What you’ll learn',
        list: [
          'Slow control, clutch balance, U-turns and figure of eight.',
          'Progressive braking, emergency stops and hazard planning.',
          'Cornering lines, lifesavers and clear road positioning.',
          'Town work, faster roads, roundabouts, overtaking, and filtering where it’s safe.',
          'Mod 1 and Mod 2 preparation, practice and feedback, plus support on test day.',
        ],
      },
      {
        id: 'test', title: 'How the A2 test works',
        steps: [
          ['CBT and theory test', 'You need a valid CBT and a pass in the motorcycle theory and hazard perception test.'],
          ['Module 1 (off-road)', 'Slalom, figure of eight, slow ride, U-turn, cornering and controlled stop, emergency stop and avoidance.'],
          ['Module 2 (on-road)', 'A road ride with the examiner by radio, independent riding and safety questions.'],
        ],
        after: 'A2 test bikes are usually 395cc or more and between 20 kW and 35 kW. We’ll supply a suitable training and test bike.',
      },
      {
        id: 'included', title: 'What’s included',
        checklist: [
          'DVSA-qualified instructors with friendly, calm coaching',
          'An A2 training bike, or train on your own if it’s eligible',
          'Helmet, jacket and gloves if you need them',
          'Radio-equipped road sessions, structured lessons and mock tests',
          'Clear next steps towards the full A licence when you’re ready',
        ],
      },
      {
        id: 'bring', title: 'What to bring',
        checklist: [
          'Your UK provisional or full driving licence',
          'Your CBT certificate (DL196) and theory test pass number',
          'Sturdy boots and legwear, and your own kit if you have it',
          'Your own bike? It must be road legal, taxed, insured, MOT’d if needed, with L-plates for training',
        ],
      },
      {
        id: 'after', title: 'After you pass',
        list: [
          'Ride up to 35 kW with no L-plates, carry a passenger and use motorways.',
          'Hold A2 for two years and upgrade to the full A licence by progressive access, or go for DAS at 24.',
          'We’ll help plan the smoothest route for your goals and budget.',
        ],
      },
    ],
    next: ['progressive-access', 'das'],
  },
  {
    slug: 'das',
    name: 'DAS (Direct Access)',
    long: 'Direct Access Scheme: full A licence',
    menu: 'DAS (Direct Access)',
    age: '24+',
    ageNote: '24, or 21 after two years on A2',
    summary: 'Ride any size motorcycle with no restrictions via Direct Access.',
    lede: 'Train on a bigger bike, pass your tests, and ride any size motorcycle. No power limits, no L-plates.',
    focus: '50% 40%',
    book: 'enquire',
    facts: {
      age: '24 (or 21 after two years on A2)',
      ride: 'Any motorcycle, no power limit',
      lPlates: 'No',
      passenger: 'Yes',
      motorways: 'Yes',
      theory: 'Yes, before your practical tests',
      length: 'Mod 1 and Mod 2 tests',
    },
    keywords: 'das direct access scheme full a licence unrestricted any bike big bike large 24 full licence passenger pillion motorway touring mod 1 mod 2 module test theory',
    sections: [
      {
        id: 'what', title: 'What is DAS?',
        body: ['The Direct Access Scheme is the route to the full A motorcycle licence for riders aged 24 and over. You train and test on a larger motorcycle, and once you pass you can ride any size bike: no power limits, no L-plates, passengers and motorways allowed.'],
        list: [
          '<strong>Age:</strong> 24 and over, or upgrade from A2 after two years by progressive access',
          '<strong>Bike:</strong> train and test on a larger machine that meets category A standards',
          '<strong>Perks:</strong> unrestricted bikes, carry a passenger, motorway legal',
        ],
      },
      {
        id: 'who', title: 'Who is DAS for?',
        list: [
          'Riders aged 24 and over who want to go straight to an unrestricted licence.',
          'Riders who’ve held A2 for two years and are ready for the full A licence.',
          'Touring riders and commuters who want full flexibility and a bigger choice of bikes.',
        ],
      },
      {
        id: 'learn', title: 'What you’ll learn',
        list: [
          'Confident handling of larger bikes: slow balance, tight turns and U-turns.',
          'Progressive braking, emergency stops, hazard planning, smooth throttle and clutch.',
          'Cornering lines and vision, positioning for bends, roundabouts and safe overtakes.',
          'Town work and faster roads, joining and leaving dual carriageways, motorway awareness.',
          'Mod 1 and Mod 2 preparation, realistic mock tests, clear feedback and test-day support.',
        ],
      },
      {
        id: 'test', title: 'How the DAS tests work',
        steps: [
          ['CBT and theory test', 'You need a valid CBT and a pass in the motorcycle theory and hazard perception test.'],
          ['Module 1 (off-road)', 'Slalom, figure of eight, slow ride, U-turn, cornering and controlled stop, emergency stop and avoidance.'],
          ['Module 2 (on-road)', 'A road ride with the examiner by radio on town and faster roads, independent riding and safety questions.'],
        ],
        after: 'We supply a suitable category A training and test bike and brief you on current DVSA requirements.',
      },
      {
        id: 'included', title: 'What’s included',
        checklist: [
          'Friendly, DVSA-qualified instructors with calm coaching and radio support',
          'A larger training bike for DAS, or train on your own if it’s eligible',
          'Helmet, jacket and gloves if you need them',
          'Structured lessons that build confidence, mock tests and support on test day',
        ],
      },
      {
        id: 'bring', title: 'What to bring',
        checklist: [
          'Your UK provisional or full driving licence',
          'Your CBT certificate (DL196) and theory test pass number',
          'Sturdy boots and legwear, and your own kit if you have it',
          'Your own bike? It must be road legal, taxed, insured, MOT’d if needed, and meet DAS standards',
        ],
      },
      {
        id: 'after', title: 'After you pass',
        list: [
          'Ride any size bike with no power limits and no L-plates.',
          'Carry a passenger and use motorways: ideal for commuting and touring.',
          'We can help with bike choices, advanced training and refresher sessions.',
        ],
      },
    ],
    next: ['refresher'],
  },
  {
    slug: 'progressive-access',
    name: 'Progressive access',
    long: 'Progressive access licence upgrade',
    menu: 'Progressive access',
    age: '2 yrs',
    ageNote: 'After two years on A1 or A2',
    summary: 'Upgrade your licence without repeating the theory test.',
    lede: 'Move up your licence step by step and keep your skills growing, with no theory test to sit again.',
    focus: '50% 50%',
    book: 'enquire',
    facts: {
      age: 'Two years on A1 (to A2) or A2 (to A, from 21)',
      ride: 'The next category up',
      lPlates: 'No',
      passenger: 'Yes',
      motorways: 'Yes',
      theory: 'Not needed again',
      length: 'Mod 1 and Mod 2 tests',
    },
    keywords: 'progressive access upgrade step up a1 to a2 a2 to a full licence no theory test two years 2 years bigger bike mod 1 mod 2',
    sections: [
      {
        id: 'what', title: 'What is progressive access?',
        body: ['Progressive access lets you upgrade your motorcycle licence once you’ve held the previous category for two years. There’s no theory test to sit again: you take the practical tests on a bigger bike for the higher category.'],
        list: [
          'Hold A1 for two years, then upgrade to A2.',
          'Hold A2 for two years, then upgrade to the full A licence.',
          'No theory retest. You take Module 1 and Module 2 again on the right bike.',
        ],
      },
      {
        id: 'who', title: 'Who is it for?',
        list: [
          'Riders who have held A1 for two years and are ready for A2.',
          'Riders who have held A2 for two years and are ready for the full A licence.',
          'Anyone who wants steady steps, more experience and lower running costs as they progress.',
        ],
      },
      {
        id: 'test', title: 'How the upgrade works',
        steps: [
          ['We check your entitlement', 'A1 held for two years to move to A2, or A2 held for two years to move to A.'],
          ['Training on the right bike', 'Slow control, braking, roadcraft, Mod 1 practice and Mod 2 routes.'],
          ['Practical tests only', 'Module 1 on the test pad, then Module 2 on the road with the examiner by radio.'],
        ],
        after: 'Test bikes must meet DVSA requirements for the category you’re upgrading to. We’ll supply a suitable bike and explain the standards.',
      },
      {
        id: 'learn', title: 'What you’ll learn',
        list: [
          'Confident slow speed work, clutch and throttle balance, tight turns, figure of eight.',
          'Stronger braking on larger bikes, emergency stops, hazard planning and observation.',
          'Cornering lines and vision, positioning for bends, junction planning and roundabouts.',
          'Town and faster roads, safe overtakes, filtering judgement, motorway awareness for full A.',
          'Test preparation: Mod 1 routines, Mod 2 ride structure, feedback and mock tests.',
        ],
      },
      {
        id: 'included', title: 'What’s included',
        checklist: [
          'Friendly, DVSA-qualified instructors with clear coaching and radio support',
          'An A2 or A training bike, or train on your own if it’s eligible',
          'Helmet, jacket and gloves if you need them',
          'Structured lessons, mock tests and support on test day',
        ],
      },
      {
        id: 'bring', title: 'What to bring',
        checklist: [
          'Your UK driving licence',
          'Your current A1 or A2 motorcycle licence',
          'Your CBT certificate if it’s still valid and your training setup needs it',
          'Sturdy boots and legwear, and your own kit if you have it',
          'Your own bike? It must be road legal, taxed, insured, MOT’d if needed, and suit the test category',
        ],
      },
      {
        id: 'after', title: 'After you upgrade',
        list: [
          'A1 to A2: ride up to 35 kW (47 bhp) with no L-plates, carry a passenger, use motorways.',
          'A2 to full A: ride any size bike with no restrictions.',
          'We can help plan bikes, kit and routes that suit your goals and budget.',
        ],
      },
    ],
    next: ['das', 'refresher'],
  },
  {
    slug: 'refresher',
    name: 'Refresher course',
    long: 'Refresher training for licence holders',
    menu: 'Refresher course',
    age: 'Licence',
    ageNote: 'For riders who already hold a licence',
    summary: 'Had a break from motorcycling and want to get back into it.',
    lede: 'Get your skills sharp again and ride with confidence. Every session is built around exactly what you need.',
    focus: '50% 55%',
    book: 'enquire',
    facts: {
      age: 'Any licence holder',
      ride: 'Your own bike, or one of ours',
      lPlates: '—',
      passenger: '—',
      motorways: '—',
      theory: 'Not needed',
      length: '1-to-1, half day or full day',
    },
    keywords: 'refresher returning rider confidence back on the bike break near miss nervous coaching 1 to 1 one to one half day full day advanced skills cornering commuting touring',
    sections: [
      {
        id: 'what', title: 'What is a refresher course?',
        body: ['A refresher is for riders who already hold a licence and want to rebuild confidence, sharpen their skills or update their habits. Whether you’re coming back after a break, had a scare, or just want to polish your technique, the session is tailored to you.'],
      },
      {
        id: 'who', title: 'Who is it for?',
        list: [
          'Riders coming back after a break who want confidence before riding every day again.',
          'New full licence holders who want extra roadcraft coaching.',
          'Commuters who want smoother town riding: junctions, roundabouts and filtering.',
          'Tourers who want better cornering, planning and comfort over long distances.',
          'Anyone who had a near miss and wants to rebuild trust and good habits.',
        ],
      },
      {
        id: 'formats', title: 'Session formats',
        cards: [
          ['1-to-1 coaching', 'Focused attention on your goals.'],
          ['Half day', 'Ideal for targeted skills like slow control or cornering.'],
          ['Full day', 'A complete reset: town work, faster roads and feedback.'],
          ['Your bike or ours', 'We can provide a bike if you need one.'],
        ],
      },
      {
        id: 'learn', title: 'What we’ll work on',
        list: [
          'Slow speed balance, clutch and throttle control, U-turns and tight turns.',
          'Braking technique, progressive braking, emergency stops and hazard planning.',
          'Observation, lifesavers and road positioning that gets you seen.',
          'Cornering lines, vision and entry speed for smooth, safe bends.',
          'Town riding: junctions, roundabouts, lane choice and filtering judgement.',
          'Faster roads, overtakes, and joining and leaving dual carriageways with confidence.',
        ],
      },
      {
        id: 'session', title: 'How a session runs',
        steps: [
          ['A quick chat', 'Your goals, any worries, and what you want from the day.'],
          ['Bike and kit check', 'Controls, plus a slow-control warm-up if it’s useful.'],
          ['Coached road ride', 'With radio, on town and faster roads as needed.'],
          ['Stops to debrief', 'Clear actions to try on the next stretch.'],
          ['Wrap-up', 'A simple plan: what to practise, and next steps if you want more.'],
        ],
      },
      {
        id: 'included', title: 'What’s included',
        checklist: [
          'A DVSA-qualified instructor with a friendly, calm coaching style',
          'A school bike if you need one, or ride your own if it’s road legal',
          'Helmet, jacket and gloves if you need them',
          'Radio coaching on the road, clear feedback and simple takeaways',
        ],
      },
      {
        id: 'bring', title: 'What to bring',
        checklist: [
          'Your UK driving licence',
          'Sturdy boots and legwear, and your own kit if you have it',
          'Your own bike? It must be road legal, taxed, insured and MOT’d if needed',
          'Any questions or goals you want to focus on',
        ],
      },
      {
        id: 'after', title: 'After your refresher',
        list: [
          'Clear actions and simple practice routines to keep your confidence growing.',
          'The option to book a follow-up half day or full day whenever you want.',
          'Advice on kit, bike setup and next training steps if you want to progress.',
        ],
      },
    ],
    next: ['das', 'progressive-access'],
  },
];

export const courseBySlug = Object.fromEntries(courses.map((c) => [c.slug, c]));

export const factRows = [
  ['age', 'Minimum age'],
  ['ride', 'What you can ride'],
  ['lPlates', 'L-plates'],
  ['passenger', 'Passengers'],
  ['motorways', 'Motorways'],
  ['theory', 'Theory test'],
  ['length', 'Format'],
];

export const faqs = [
  { id: 'cbt-test', q: 'Is the CBT a test?', a: 'No. CBT is a one-day training course, not a test. Our instructors coach you through each part, and if you need extra practice we’ll make sure you get it.', k: 'pass fail exam' },
  { id: 'cbt-cost', q: 'How much does a CBT cost?', a: `A standard CBT day is ${site.cbtPrice} when you book online. Bank holidays cost more. You’ll see the exact price for your date before you pay.`, k: 'price cost fee how much money pay £ pounds' },
  { id: 'cbt-bring', q: 'What do I need to bring to my CBT?', a: 'Your UK provisional or full driving licence, sturdy boots and jeans, gloves if you have them, and glasses or contacts if you need them. We provide helmets, jackets and bikes.', k: 'bring licence boots jeans gloves glasses what to wear clothes' },
  { id: 'kit', q: 'Do you provide bikes and kit?', a: 'Yes. We have training bikes for every course, plus helmets, jackets and gloves if you need them. You’re welcome to use your own bike if it’s road legal.', k: 'helmet jacket gloves bike hire own bike equipment gear' },
  { id: 'road-ride', q: 'I didn’t finish the road ride on my CBT. Can I book just that?', a: 'Yes. Book the CBT road ride (Element E) online. It’s only for riders who have already done the rest of their CBT with us, not for a full CBT.', k: 'element e road ride finish complete incomplete second day return' },
  { id: 'cbt-valid', q: 'How long does a CBT certificate last?', a: 'Two years. In that time you can ride with L-plates, but you can’t carry passengers or use motorways.', k: 'dl196 certificate expire expiry valid renew two years 2 years' },
  { id: 'which', q: 'Which licence should I go for?', a: 'It depends on your age and what you already hold. Use the licence finder for a quick answer, or message us and we’ll talk it through.', k: 'which licence choose what course do i need age a1 a2 das' },
  { id: 'theory', q: 'Do I need a theory test?', a: 'Not for CBT. You need a motorcycle theory and hazard perception pass before your practical tests for A1, A2 and DAS. Progressive access upgrades don’t need a theory test again.', k: 'theory hazard perception test dvsa' },
  { id: 'own-bike', q: 'Can I train on my own bike?', a: 'Yes, as long as it’s road legal, taxed, insured, MOT’d if needed and suitable for the course. Bring L-plates for training on a provisional licence.', k: 'own bike my bike motorcycle scooter' },
  { id: 'area', q: 'Where do you train?', a: `We’re based at ${site.address.street}, ${site.address.town} ${site.address.postcode}, and train riders from Bradford, Leeds, Halifax and Keighley.`, k: 'location address where area cover leeds halifax keighley bradford directions' },
  { id: 'hours', q: 'When are you open?', a: `${site.hours.label}. ${site.appointmentNote}`, k: 'opening hours times open closed monday weekend sunday saturday when' },
];

// Reviews from the current site. `tags` drive the filter on the reviews page.
export const reviews = [
  ['Kaine M', 'Just passed my CBT today with Ride Safe and couldn’t be happier! The instructors were clear, patient, and really made the day enjoyable. Everything was well-organised and explained properly, which gave me loads of confidence. Highly recommend Ride Safe to anyone looking to get on two wheels!'],
  ['Matthew T', 'Excellent training school, everyone was so friendly and easy to talk too. Rick got me through my Mod 1 and Mod 2 on first attempts for both. I would highly recommend this school.'],
  ['Danielle M', 'Steve was my instructor, he’s so patient, supportive and funny. I’d highly recommend completing your motorcycle tests here. They’re all top lads. Thanks for everything!!'],
  ['Rebekah F', 'Passed my A2 with the help of the amazing team here, highly recommended'],
  ['Binesh M', 'Susie was an amazing teacher I was so nervous but she had an amazing calming nature she made the session fun and safe. She helped me improve my skills even when I felt I was struggling. They provide gear on the day when u may struggle to get it before the cbt day. Both her and stave made my experience an excellent one. Thank you guys for building my confidence in such a short space of time absolute gems both of you'],
  ['Alex W', 'Great place, down to earth, knowledgeable guys. Rick got me through my full licence first time with no issues or extra lessons which weren’t needed. Honest and straight to the point. Thanks to Steve also who made it a laugh and breeze through the cbt. Highly recommend.'],
  ['Taimoor Ali', 'Great experience, great staff and teachers. Had a great time they made me feel comfortable and what they said on how to ride made it so much easier. Would definitely recommend for people who want to start there riding journey or level up to get onto the bigger bikes.'],
  ['Howard B', 'I took my CBT with these guys on Sunday 22nd March. I must say, Steve and Sue are truly genuine down to earth people, I am so glad I booked my training with Ride Safe.'],
  ['Oliver C', 'Did my 50cc CBT was a great and enjoyable day'],
  ['Nathan L', 'Had a brilliant day out with BIG Steve. Very knowledgeable guy and great teacher. Would definitely recommend. Thanks Ride safe 😃'],
  ['Honer Z', 'I just passed my license with ridesafe they great guys very helpful Ive already got my bike 🏍️ ready for summer 😎'],
  ['Arran B', 'Great lads these lot. Did my CBT with them which was great. Then passed my mod 1 today for my A2 following a 2 hour mod 1 in depth lesson doing exactly what happens on the actual test on the Saturday before my test day Monday. Got my mod 2 booked and can’t wait. Got a mod 2 lesson booked a few days before my actual test day just like I did with my mod 1. Recommend these guys over anyone else'],
  ['Ernardo E', 'Had a good time learning and training with Suzie and Big Steve!! They take you from the basic and gradually work their way to everything needed to be CBT certified. They are fun, honest but never harsh. They take their time guiding you to success!!! Big Steve did a little 1-to-1 and calm the nerve and make minor corrections. Suzie, is a big ball of energy! She is fun and took us on the road and had a fun old time. Thank you. They are very forgiving when you make mistakes. Highly recommended 👌'],
  ['Jaswinder S', 'We had an amazing day over the Easter weekend on the CBT course. The instructors are very knowledgeable and experienced. The course is delivered in a very engaging way and helps you stay focused! Thanks to the guys who helped us pass our CBT. Hopefully see you guys again soon.'],
  ['Simon P', 'Such a brilliant training/learning experience. I recently passed my CBT with Ridesafe and found the whole day fun, informative and well paced. Big Steve and Susi really have a great way of teaching with a nice mix of challenge, calm presence and humour. Would really recommend Ridesafe to anyone looking to get started on their motorbike journey! Until next time! Thanks Steve and Susi'],
  ['Sam H', 'Great CBT experience. The instructors explained every detail extremely clearly and easily to understand. Having done my CBT before I felt my slow speed control of the bike is now much better because of Steve’s instruction. Definitely recommend!'],
  ['Saleem K', 'Excellent riding school. Very friendly. Especially Rick, Big Steve and Cliff. Amazing instructors. Very good experience with them. Would definitely recommend for CBTs and DAS.'],
  ['Ian Drew', 'Just to say a big thank you to all at Ridesafe. Patient, honest with their assessment and practical with their advice. I’ll be back for further lessons with them and the test for a full licence. Would recommend as they are down to earth and approachable.'],
  ['Beverley W', 'Second time doing my cbt previously going somewhere else, (I won’t mention who I went with) but they didn’t make me feel at ease first time around. Ride safe, Steve and Suzy made more sense and learnt me more. Relaxed and friendly. I was also with some other lovely people doing their cbt’s. I will defo go back to them in 2 years time. Thanks again guys. Bev xx'],
  ['Stewart E', 'Many thanks to Big Steve and Ridesafe. Took me 3 days to get there, Steve was extremely patient, and looked after each of us. His risqué sense of humour easing the tension and his stories of his history on and off a motorcycle keeping you entertained and helping us relax. You just get the immediate impression that he knows his stuff and you can trust him to lead you right. Would definitely recommend the school to anyone starting or advancing their two wheeled experience. The schools affiliation with the Bikers for Autism was a major point in selecting them, too. All the best guys, see you when I’ve got some miles under my belt to get the big boy licence.'],
  ['Jason C', 'Excellent team. Best prices around. Did my CBT with these guys. I was treated as an individual, rather than being held back with the slower learner’s. I highly recommend this riding school to new riders and experienced ones. Hope to see you guys again soon for a DAS course 😁'],
  ['Brett C', '10/10!!! An amazing team at Ridesafe School. Friendly, more than happy to help and will guide you through the process from CBT to MOD2. Couldn’t thank them enough for their support and advice. If you are looking to learn how to ride and get your self onto any kind of motorbike, these are the ones to contact without a doubt! Be respectful, patient and they will work hard and go above and beyond for you! A pleasure dudes! ✌🏽'],
  ['Zouhaier S', 'Wow, what an amazing experience with Ride Safe! From the moment I signed up, everything was hassle-free and enjoyable. The staff were super friendly and made the training feel exciting rather than stressful. I walked away feeling confident, skilled, and ready for the road. If you’re thinking of motorcycle training, trust me, this is the place to do it!'],
  ['Kenny L', 'Recently did my CBT course with Ride safe, and can not ask for more. The instructors, training & affordability is amazing. Already looking at using Ridesafe to do my a2 license!'],
  ['Thomas W', 'Every bit of training I’ve had at Ridesafe has been 100%, well structured and delivered in their own relaxed way. A massive thanks to Big Steve, Rick, Pete and Susi.'],
  ['Alex P', 'Big steve, susi and pete are amazing instructors. Comforting and patient with me. Took me 3 tries before i was out on the road and im so glad i stuck to it. If your doing your CBT do it here. :)'],
].map(([name, text], i) => {
  const t = text.toLowerCase();
  const tags = [];
  if (/\bcbt/.test(t) || /50cc/.test(t)) tags.push('cbt');
  if (/\ba2\b/.test(t)) tags.push('a2');
  if (/\bdas\b|full licen|mod ?[12]|big boy licence|licen[cs]e with/.test(t)) tags.push('full');
  return { id: `r${i + 1}`, name, text, tags };
});

export const reviewFilters = [
  ['all', 'All reviews'],
  ['cbt', 'CBT'],
  ['a2', 'A2'],
  ['full', 'Full licence & tests'],
];

// Fixed set for the home page so the page renders the same every time.
export const featuredReviews = ['Kaine M', 'Matthew T', 'Danielle M', 'Binesh M', 'Alex W', 'Rebekah F'];

export const friends = [
  { name: 'My Moto Leeds', url: 'https://www.mymoto-uk.com/', text: 'Motorbike sales, servicing and accessories in Leeds.', img: 'friend-mymoto-320', w: 320, h: 320 },
  { name: 'Super Good Bikers for Autism', url: 'https://www.supergoodbikersforautism.com/', text: 'A biker community raising awareness of, and support for, autism.', img: 'friend-sgb-186', w: 186, h: 186 },
  { name: 'Bundled Bytes', url: 'mailto:info@bundledbytes.com?subject=Development%20Work', text: 'Web and software development.', img: 'friend-bundledbytes-320', w: 320, h: 212 },
];
