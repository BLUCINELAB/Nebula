(function(){
  const questions = [
    "Qual è stato il momento più luminoso della tua giornata?",
    "Cosa ti ha fatto sorridere oggi?",
    "Quale sogno ti guida in questo momento?",
    "Qual è una piccola vittoria recente?",
    "Cosa vuoi ricordare di oggi?"
  ];

  const phrases = [
    "Le stelle cantano per chi sa ascoltare.",
    "Ogni respiro è un verso dell'universo.",
    "Nel silenzio nasce la luce interiore.",
    "La notte avvolge i sogni con manti d'argento.",
    "Tra le nebulose danzano speranze." 
  ];

  function getQuestionOfTheDay(){
    const today = new Date().toISOString().slice(0,10);
    const stored = JSON.parse(localStorage.getItem('nebula-question'));
    if(stored && stored.date === today){
      return stored.question;
    }
    const question = questions[Math.floor(Math.random()*questions.length)];
    localStorage.setItem('nebula-question', JSON.stringify({date: today, question}));
    return question;
  }

  function loadAnswer(key){
    return localStorage.getItem(key) || '';
  }

  function saveAnswer(key, value){
    localStorage.setItem(key, value);
  }

  const questionEl = document.getElementById('question');
  const answerEl = document.getElementById('answer');
  const phraseEl = document.getElementById('phrase');

  const question = getQuestionOfTheDay();
  questionEl.textContent = question;

  const today = new Date().toISOString().slice(0,10);
  const answerKey = 'nebula-answer-' + today;
  answerEl.value = loadAnswer(answerKey);
  answerEl.addEventListener('input', () => saveAnswer(answerKey, answerEl.value));

  const phrase = phrases[Math.floor(Math.random()*phrases.length)];
  phraseEl.textContent = phrase;
})();
