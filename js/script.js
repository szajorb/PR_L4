setTimeout(function(){
    console.log('poczatek');
},0);

let preQuestions = null;

fetch('https://quiztai.herokuapp.com/api/quiz')
    	.then(resp => resp.json())
    	.then(resp => {
        	   preQuestions = resp;
                setQuestion(index);
    	});

let next = document.querySelector('.next');
let previous = document.querySelector('.previous')

let question = document.querySelector('.question');
let answers = document.querySelectorAll('.list-group-item');

let pointsElem = document.querySelector('.score');
let restart = document.querySelector('.restart');
let index = 0;
let points = 0;
localStorage.setItem("klucz", 0);
localStorage.setItem("liczba", 0);

index = 0;

function setQuestion(index) {
	question.innerHTML = preQuestions[index].question;

    answers[0].innerHTML = preQuestions[index].answers[0];
	answers[1].innerHTML = preQuestions[index].answers[1];
	answers[2].innerHTML = preQuestions[index].answers[2];
	answers[3].innerHTML = preQuestions[index].answers[3];

   if (preQuestions[index].answers.length === 2) {
       answers[2].style.display = 'none';
       answers[3].style.display = 'none';
   } else {
       answers[2].style.display = 'block';
       answers[3].style.display = 'block';
   }

	activateAnswers();
    cleanAnswers();
}

function doAction(event) {
    //event.target - Zwraca referencjê do elementu, do którego zdarzenie zosta³o pierwotnie wys³ane.
    if (event.target.innerHTML === preQuestions[index].correct_answer) {
        points++;
        pointsElem.innerText = points;
        markCorrect(event.target);
    }
    else {
        markInCorrect(event.target);
    }
    disableAnswers();
}

function activateAnswers(){
	for (let i=0; i<answers.length; i++){
		answers[i].addEventListener('click', doAction);
	}
}

function disableAnswers(){
	for (let i=0; i<answers.length; i++){
		answers[i].removeEventListener('click', doAction);
	}
}

function cleanAnswers(){
	for (let i=0; i<answers.length; i++){
		answers[i].classList.remove('correct');
		answers[i].classList.remove('incorrect');
	}
}

function markCorrect(elem){
	elem.classList.add('correct');
}

function markInCorrect(elem){
	elem.classList.add('incorrect')
}


restart.addEventListener('click', function (event) {
	console.log('RESTART button clicked');

    event.preventDefault();

    index = 0;
    points = 0;
    let userScorePoint = document.querySelector('.score');
    userScorePoint.innerHTML = points;
    setQuestion(index);
    activateAnswers();


	list.style.display = 'block';
    results.style.display = 'none';
});

next.addEventListener('click', function () {
	index++;
	if (index >= preQuestions.length-1){
		list.style.display = 'none';
		results.style.display = 'block';
		userScorePoint.innerHTML = points;
		let game = localStorage.getItem('game');
		let average;

		if (game != null){
			average = localStorage.getItem('average');
			average = (average * game + points) / ++game;
		}else{
			game = 1;
			average = points;
		}
		localStorage.setItem('games', game);
		localStorage.setItem('average', average);
		averageScore.innerHTML = average;
	} else{
		setQuestion(index);
		activateAnswers();
	}
});

previous.addEventListener('click', function () {
   index--;
   if (index >= preQuestions.length) {
       list.style.display = 'none';
       results.style.display = 'block';
       userScorePoint.innerHTML = points;
   } else {
       setQuestion(index);
       activateAnswers();
   }
});