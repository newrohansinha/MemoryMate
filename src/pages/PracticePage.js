import React, { useState, useEffect } from 'react';

const generateRandomNames = () => {
  const firstNames = ['John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'Robert', 'Emma', 'William', 'Olivia'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  
  const names = [];
  for (let i = 0; i < 200; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    names.push(`${firstName} ${lastName}`);
  }
  return names;
};

const generateRandomFacts = () => {
  const facts = [
    "Your sister lives in Uganda and visits every summer.",
    "You once broke your arm climbing a tree when you were 10.",
    "Your parents met in a small café in Paris during a rainy afternoon.",
    "Your father was born in a tiny village in northern India.",
    "You have a cousin who is a professional skateboarder in California.",
    "Your grandmother taught you how to bake cookies every Sunday.",
    "You moved 6 times before the age of 18 due to your father's job in the military.",
    "Your family owns a small vineyard in Tuscany that has been passed down for generations.",
    "Your mother used to sing lullabies to you in Spanish when you couldn't sleep.",
    "You and your brother built a treehouse in the backyard that lasted for 10 years.",
    "Your aunt was once an extra in a Hollywood movie.",
    "You spent a summer living with your uncle who's a fisherman in Maine.",
    "Your great-grandfather served in World War II and received a Purple Heart.",
    "You once got lost in a shopping mall when you were 5 years old, and it was your sister who found you.",
    "Your father always wanted to be a pilot but became a teacher instead.",
    "You have a distant relative who is a well-known author in Ireland.",
    "You had a pet rabbit named Fluffy that lived for 8 years.",
    "Your family has an annual tradition of camping together every August.",
    "Your grandfather was a skilled woodworker and made all the furniture in your family's home.",
    "Your parents have been married for over 30 years."
  ];
  
  return facts;
};

const getRandomItems = (array, count) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const SetupPage = ({ onSubmit }) => {
  const [quizType, setQuizType] = useState('mix');
  const [numQuestions, setNumQuestions] = useState(10);
  const [errorMessage, setErrorMessage] = useState('');

  const validateItems = () => {
    const faces = JSON.parse(localStorage.getItem('faces')) || [];
    const factCategories = JSON.parse(localStorage.getItem('factCategories')) || [];
    const userFacts = factCategories.flatMap(category => category.facts);

    if (quizType === 'faces') {
      if (faces.length !== numQuestions) {
        return `Number of questions must equal the number of faces (${faces.length}).`;
      }
    } else if (quizType === 'facts') {
      if (userFacts.length < Math.ceil(numQuestions / 2)) {
        return `Not enough user-added facts. Need at least ${Math.ceil(numQuestions / 2)}.`;
      }
    } else if (quizType === 'mix') {
      if (faces.length === 0 || userFacts.length === 0) {
        return 'Mix mode requires at least one face and one fact.';
      }
      if (faces.length + userFacts.length < Math.ceil(numQuestions / 2)) {
        return `Not enough faces and facts. Need at least ${Math.ceil(numQuestions / 2)}.`;
      }
    }
    return '';
  };

  const handleSubmit = () => {
    const error = validateItems();
    if (error) {
      setErrorMessage(error);
    } else {
      setErrorMessage('');
      onSubmit({ quizType, numQuestions });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-md">
      <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">Customize Your Quiz</h2>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="mb-6">
          <label className="block text-xl font-bold mb-2">Quiz Type:</label>
          <div className="flex flex-col space-y-2">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="quizType"
                value="faces"
                checked={quizType === 'faces'}
                onChange={() => setQuizType('faces')}
                className="form-radio"
              />
              <span className="ml-2">Faces Only</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="quizType"
                value="facts"
                checked={quizType === 'facts'}
                onChange={() => setQuizType('facts')}
                className="form-radio"
              />
              <span className="ml-2">Facts Only</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="quizType"
                value="mix"
                checked={quizType === 'mix'}
                onChange={() => setQuizType('mix')}
                className="form-radio"
              />
              <span className="ml-2">Mix of Both</span>
            </label>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-xl font-bold mb-2">Number of Questions: {numQuestions}</label>
          <input
            type="range"
            min="5"
            max="50"
            value={numQuestions}
            onChange={(e) => setNumQuestions(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        {errorMessage && <p className="text-red-600 text-lg mb-4">{errorMessage}</p>}

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
};

const PracticePage = ({ quizType, numQuestions, onNewQuiz }) => {
  const [practiceItems, setPracticeItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  useEffect(() => {
    const faces = JSON.parse(localStorage.getItem('faces')) || [];
    const factCategories = JSON.parse(localStorage.getItem('factCategories')) || [];
    const userFacts = factCategories.flatMap(category => category.facts);
    
    const names = generateRandomNames();
    const predefinedFacts = generateRandomFacts();

    let items = [];

    if (quizType === 'faces') {
      items = getRandomItems(faces, numQuestions).map(face => ({
        type: 'face',
        question: face.image,
        correctAnswer: face.name,
        options: getRandomItems([face.name, ...getRandomItems(names.filter(n => n !== face.name), 3)], 4),
      }));
    } else if (quizType === 'facts') {
      const userFactsCount = Math.ceil(numQuestions / 2);
      const predefinedFactsCount = numQuestions - userFactsCount;

      const userFactItems = getRandomItems(userFacts, userFactsCount).map(fact => ({
        type: 'fact',
        question: fact.text,
        correctAnswer: true,
      }));

      const predefinedFactItems = getRandomItems(predefinedFacts, predefinedFactsCount).map(fact => ({
        type: 'fact',
        question: fact,
        correctAnswer: false,
      }));

      items = getRandomItems([...userFactItems, ...predefinedFactItems], numQuestions);
    } else { // mix
      const realItemsCount = Math.ceil(numQuestions / 2);
      const fakeItemsCount = numQuestions - realItemsCount;

      const totalRealItems = faces.length + userFacts.length;
      const faceRatio = faces.length / totalRealItems;

      let facesCount = Math.round(realItemsCount * faceRatio);
      let userFactsCount = realItemsCount - facesCount;

      // Adjust counts to ensure we have the correct total
      if (facesCount + userFactsCount < realItemsCount) {
        if (faces.length > facesCount) {
          facesCount += 1;
        } else if (userFacts.length > userFactsCount) {
          userFactsCount += 1;
        }
      } else if (facesCount + userFactsCount > realItemsCount) {
        if (facesCount > 0) {
          facesCount -= 1;
        } else if (userFactsCount > 0) {
          userFactsCount -= 1;
        }
      }

      const faceItems = getRandomItems(faces, facesCount).map(face => ({
        type: 'face',
        question: face.image,
        correctAnswer: face.name,
        options: getRandomItems([face.name, ...getRandomItems(names.filter(n => n !== face.name), 3)], 4),
      }));

      const userFactItems = getRandomItems(userFacts, userFactsCount).map(fact => ({
        type: 'fact',
        question: fact.text,
        correctAnswer: true,
      }));

      const fakeFactItems = getRandomItems(predefinedFacts, fakeItemsCount).map(fact => ({
        type: 'fact',
        question: fact,
        correctAnswer: false,
      }));

      items = [...faceItems, ...userFactItems, ...fakeFactItems];
    }

    // Ensure we have exactly the number of questions requested
    if (items.length > numQuestions) {
      items = items.slice(0, numQuestions);
    } else while (items.length < numQuestions) {
      // Add more items if we're short
      if (quizType === 'faces') {
        const face = getRandomItems(faces, 1)[0];
        items.push({
          type: 'face',
          question: face.image,
          correctAnswer: face.name,
          options: getRandomItems([face.name, ...getRandomItems(names.filter(n => n !== face.name), 3)], 4),
        });
      } else {
        const fakeFact = getRandomItems(predefinedFacts, 1)[0];
        items.push({
          type: 'fact',
          question: fakeFact,
          correctAnswer: false,
        });
      }
    }

    // Shuffle the items to ensure random order
    setPracticeItems(getRandomItems(items, items.length));
  }, [quizType, numQuestions]);

  const handleNextItem = () => {
    setShowAnswer(false);
    setIsCorrect(null);
    if (currentIndex < practiceItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleAnswer = (answer) => {
    const correct = answer === practiceItems[currentIndex].correctAnswer;
    setIsCorrect(correct);
    if (correct) {
      setScore(score + 1);
    }
    setShowAnswer(true);
  };

  if (practiceItems.length === 0) {
    return <div className="text-center mt-8">No practice items available. Add some faces or facts first!</div>;
  }

  if (quizCompleted) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-4xl font-bold text-blue-700 mb-6">Quiz Completed!</h2>
          <p className="text-3xl font-bold text-blue-600 mb-8">Your Score: {score} / {numQuestions}</p>
          <button
            onClick={onNewQuiz}
            className="bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600 transition duration-300 text-xl"
          >
            New Quiz
          </button>
        </div>
      </div>
    );
  }

  const currentItem = practiceItems[currentIndex];

  return (
    <div className="container mx-auto py-8 px-4 max-w-md">
      <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">Practice</h2>
      <div className="bg-white p-8 rounded-lg shadow-md relative">
        <div className="absolute top-2 left-2 text-blue-700 font-bold text-xl">
          Question {currentIndex + 1}/{numQuestions}
        </div>
        {currentItem.type === 'face' ? (
          <>
            <img src={currentItem.question} alt="Who is this?" className="w-full h-64 object-cover mb-4 rounded" />
            <div className="grid grid-cols-2 gap-2 mt-8">
              {currentItem.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                  disabled={showAnswer}
                >
                  {option}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="text-xl mb-4 mt-8">{currentItem.question}</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleAnswer(true)}
                className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300"
                disabled={showAnswer}
              >
                True
              </button>
              <button
                onClick={() => handleAnswer(false)}
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300"
                disabled={showAnswer}
              >
                False
              </button>
            </div>
          </>
        )}

      
{showAnswer && (
          <div className="mt-4">
            <p className={`text-2xl font-bold mb-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {isCorrect ? 'Correct!' : 'Incorrect!'}
            </p>
            <p className="text-xl font-bold mb-4">
              {currentItem.type === 'face'
                ? `Correct answer: ${currentItem.correctAnswer}`
                : `This fact is ${currentItem.correctAnswer ? 'True' : 'False'}`}
            </p>
            <button
              onClick={handleNextItem}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const QuizApp = () => {
  const [quizConfig, setQuizConfig] = useState(null);

  const handleSetupSubmit = (config) => {
    setQuizConfig(config);
  };

  const handleNewQuiz = () => {
    setQuizConfig(null);
  };

  return (
    <div>
      {!quizConfig ? (
        <SetupPage onSubmit={handleSetupSubmit} />
      ) : (
        <PracticePage quizType={quizConfig.quizType} numQuestions={quizConfig.numQuestions} onNewQuiz={handleNewQuiz} />
      )}
    </div>
  );
};

export default QuizApp;