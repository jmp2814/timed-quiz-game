
// Quiz questions stored in an array
var questions = [
    {
        questionText: 'What month was I born?',
        options: ['A. January', 'B. March', 'C. July', 'D. October'],
        answer: 'A. January',
    },

    {
        questionText: 'How many siblings do I have?',
        options: ['A. 0', 'B. 1', 'C. 2', 'D. 3'],
        answer: 'C. 2',
    },
    {
        questionText: 'What is my favoite color?',
        options: ['A. Black', 'B. Red', 'C. Green', 'D. Blue'],
        answer: 'C. Green',
    },
    {
        questionText: 'What is my favorite type of beer?',
        options: ['A. Stout', 'B. IPA', 'C. Lager', 'D. Sour'],
        answer: 'B. IPA',
    },
    {
        questionText: 'What is my favorite Hot Sauce?',
        options: ['A. Sriracha', 'B. Franks', 'C. Cholula', 'D. Tobasco'],
        answer: 'A. Sriracha',
    },
    {
        questionText: 'What is my favorite baked good?',
        options: ['A. Cake', 'B. Brownie', 'C. Cookie', 'D. Cupcake'],
        answer: 'C. Cookie',
    },
    {
        questionText: 'If I could have any super power, what would I want?',
        options: ['A. Super-strength', 'B. Invincibility', 'C. Invisibility', 'D. Flight'],
        answer: 'D. Flight'
    },
    {
        questionText: 'What is my favorite seasoning to add on top of my pizza?',
        options: ['A. Chili Flakes', 'B. Oregano', 'C. Garlic Powder', 'D. Parmesean Cheese'],
        answer: 'A. Chili Flakes'
    },
    {
        questionText: 'Which European country do I most want to visit?',
        options: ['A. Italy', 'B. Norway', 'C. Spain', 'D. France'],
        answer: 'B. Norway',
    },
    {
        questionText: 'Was it difficult for me to come up with 10 questions?',
        options: ['A. Yes', 'B. No', 'C. Maybe', 'D. I seriously cannot believe how difficult it was for me. Like I am mildly concerned with how difficult such a mundane task was for me'],
        answer: 'D. I seriously cannot believe how difficult it was for me. Like I am mildly concerned with how difficult such a mundane task was for me',
    }
]

// Variables to select each card
var questionCard = document.querySelector("#question-card");
var scoreCard = document.querySelector("#score-card");
var highscoreCard = document.querySelector("#highscore-card");
var submitButton = document.querySelector("#submit-button");
var inputElement = document.querySelector("#name");
var resultDiv = document.querySelector("#result-div");
var resultText = document.querySelector("#result-text");
var startButton = document.querySelector("#start-button");
// function to hide all cards

function hideCards() {
    questionCard.setAttribute("hidden", true);
    scoreCard.setAttribute("hidden", true);
    highscoreCard.setAttribute("hidden", true);
    
}

// hide result div
function hideResultText() {
    resultDiv.style.display = "none";
}

// global variables
var intervalID;
var time;
var currentQuestion;

startButton.addEventListener('click', startQuiz);

function startQuiz() {
    hideCards();
    startButton.setAttribute("hidden", true);
    questionCard.removeAttribute('hidden');

    currentQuestion = 0;
    displayQuestion();

    //total time = 10s per question 
    time = questions.length * 10;

    intervalID = setInterval(countdown, 1000);

    displayTime();
}

// reduces time by 1 and ends quiz if time runs out
function countdown() {
    time--;
    displayTime();
    if (time < 1) {
        endQuiz();
    }
}

// displays time on page
function displayTime() {
    document.querySelector("#time").textContent = time;
}

// display the question and answer options for current question
function displayQuestion() {
    let question = questions[currentQuestion];
    let options = question.options;

    let h2QuestionElement = document.querySelector("#question-text");
    h2QuestionElement.textContent = question.questionText;

    for (let i = 0; i < options.length; i++) {
        let option = options[i];
        let optionButton = document.querySelector("#option" + i);
        optionButton.textContent = option;
    }
}

// what happens when an answer is selected
document.querySelector('#quiz-options').addEventListener('click', checkAnswer);


// If answer is incorrect, time penalty occurs
function checkAnswer(eventObject) {
    let optionButton = eventObject.target;
    resultDiv.style.display = 'block';
    if (optionButton.textContent === questions[currentQuestion].answer) {
        resultText.textContent = 'Correct!';
        setTimeout(hideResultText, 1000);
    } else {
        resultText.textContent = 'Wrong!';
        setTimeout(hideResultText, 1000);
        if (time >= 5) {
            time = time - 5;
            displayTime();
        } else {
            // if time is less than 5, display time goes to 0 and quiz ends 
            time = 0;
            displayTime();
            endQuiz();
        }
    }
    // increment question by 1
    currentQuestion++;
    // if there are still questions then display the next one, if not, end the quiz
    if (currentQuestion < questions.length) {
        displayQuestion();
    } else {
        endQuiz();
    }
}




// when quiz is over, clear timer, hide cards, and display score.
function endQuiz() {
    clearInterval(intervalID);
    hideCards();
    scoreCard.removeAttribute("hidden");
    document.querySelector("#score").textContent = time;
}



// store users name and score when submit button is clicked
submitButton.addEventListener("click", storeScore);

function storeScore(event) {
    event.preventDefault();

    // if no name is given for score submission
    if (!inputElement.value) {
        alert("Please enter a name!");
        return;
    }

    // store score and name
    let leaderboardItem = {
        name: inputElement.value,
        score: time,
    };

    updateStoredLeaderboard(leaderboardItem);

    // hide question card and display leaderboard
    hideCards();
    highscoreCard.removeAttribute("hidden");

    renderLeaderboard();
}

// updates the leaderboard in local storage
function updateStoredLeaderboard(leaderboardItem) {
    let leaderboardArray = getLeaderboard();
    // append new item to leaderboard array
    leaderboardArray.push(leaderboardItem);
    localStorage.setItem("leaderboardArray", JSON.stringify(leaderboardArray));
}

// get leaderboardArray from local storage and JSON into object
function getLeaderboard() {
    let storedLeaderboard = localStorage.getItem("leaderboardArray");
    if (storedLeaderboard !== null) {
        let leaderboardArray = JSON.parse(storedLeaderboard);
        return leaderboardArray;
    } else {
        leaderboardArray = [];
    }
    return leaderboardArray;
}

// display leaderboard on card
function renderLeaderboard() {
    let sortedLeaderboardArray = sortLeaderboard();
    var highscoreList = document.querySelector("#highscore-list");
    highscoreList.innerHTML = "";
    for (let i = 0; i < sortedLeaderboardArray.length; i++) {
        let leaderboardEntry = sortedLeaderboardArray[i];
        let newListItem = document.createElement("li");
        newListItem.textContent = leaderboardEntry.name + " - " + leaderboardEntry.score;
        highscoreList.append(newListItem);
    }
}

// show leaderboard from highest to lowest
function sortLeaderboard() {
    let leaderboardArray = getLeaderboard();
    if (!leaderboardArray) {
        return;
    }

    leaderboardArray.sort(function (a, b) {
        return b.score - a.score;
    });
    return leaderboardArray;
}

var clearButton = document.querySelector("#clear-button");
clearButton.addEventListener("click", clearHighsocres);

// clears local storage and displays empty leaderboard
function clearHighsocres() {
    localStorage.clear();
    renderLeaderboard();
}

var backButton = document.querySelector("#back-button");
backButton.addEventListener("click", returnToStart);

// hide leaderboard and show start card
function returnToStart() {
    hideCards();
    startButton.removeAttribute("hidden");
}

// link to view highscores at any point
var leaderboardLink = document.querySelector("#highscores-link");
leaderboardLink.addEventListener("click", showLeaderboard);

function showLeaderboard() {
    hideCards();
    highscoreCard.removeAttribute("hidden");
    startButton.setAttribute("hidden", true);

    // stop countdown
    clearInterval(intervalID);

    // stop time from appear on page
    time = undefined;
    displayTime();

    renderLeaderboard();
}