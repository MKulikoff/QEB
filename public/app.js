const btn = document.querySelector(".quizStart_btn")
const quiz = document.querySelector('.quiz')
const quizContainer = document.querySelector(".quiz_container")
const startQuizContainer = document.querySelector(".start_quiz_container")

const answerEls = document.querySelectorAll('.quiz_input')
const questionEl = document.querySelector('.quiz_question')
const a_answer = document.getElementById('a_answer')
const b_answer = document.getElementById('b_answer')
const c_answer = document.getElementById('c_answer')
const d_answer = document.getElementById('d_answer')
const submitBtn = document.getElementById('submit')
const hiddenAnswer = document.querySelector('hidden_answer')

let rounds = 0
let score = 0
let numberOfQuestion = 1;
let QuizData
let answerList = []
let candidateAnswerList = []


btn.addEventListener('click', req, { "once": true })

btn.addEventListener('click', () => {
    quiz.classList.remove("hidden")
    btn.classList.add("hidden")
    startQuizContainer.classList.add("hidden")
})

function req() {

    fetch("http://localhost:5000/quizData")
        .then(data => data.json())
        .then(data => createQuiz(data))
        .then(data => { return data })
        .catch(err => console.error(err))
}


function createQuiz(questions) {
    quizData = questions
    questionEl.innerText = `${numberOfQuestion}/5: ` + quizData.title
    a_answer.innerText = quizData.optionA
    b_answer.innerText = quizData.optionB
    c_answer.innerText = quizData.optionC
    d_answer.innerText = quizData.optionD
}

function getSelected() {
    let answer
    answerEls.forEach(answerEl => {
        if (answerEl.checked) {
            answer = answerEl.id
        }
    })
    return answer
}

submitBtn.addEventListener('click', () => {
    numberOfQuestion++
    rounds++
    let answer = getSelected()
    candidateAnswerList.push(answer) 
    console.log(candidateAnswerList )
    if (answer == quizData.correctOption) {
        score++
    }
    answerList.push(quizData)
    if (rounds < 5) {
        req()
    } else {
        quizContainer.innerHTML =
            `
                    <h2>You scored ${score}/5</h2>
                    <button onclick="location.reload()" class="btn">Пройти тест еще раз</button>
                `
        for (let i = 0; i < 5; i++) {
            let answerContainer = document.createElement('div')
            answerContainer.classList.add('answer_card')

            answerContainer.innerHTML +=
                `
                    <span>Вопрос: ${answerList[i].title}</span>
                    <li>Вариант A: ${answerList[i].optionA}</li>
                    <li>Вариант B: ${answerList[i].optionB}</li>
                    <li>Вариант C: ${answerList[i].optionC}</li>
                    <li>Вариант D: ${answerList[i].optionD}</li>
                    <li >Ваш ответ: ${candidateAnswerList[i]}</li>
                    <li>Правильный ответ: ${answerList[i].correctOption}</li>
                    

                `
            document.querySelector('.quiz_container').appendChild(answerContainer)

        }
    }
})








