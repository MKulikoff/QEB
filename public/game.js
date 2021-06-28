    let socket = io()
    let nickname = document.querySelector(".nickname")

    socket.emit('getNickname', nickname.value)

    socket.on('numberOfConnected', (userNumber) => {
        if (userNumber > 1) {
            timer = setInterval(countdown, 900)
            timeout = setTimeout(req, 10000)
            waitRoom.classList.add("hidden")
        }
        else {
            waitRoom.classList.remove("hidden")

        }
    })

    socket.on('stateUpdate', data => {
        addPlayers(data)
    })

    function addPlayers(players) {
        playerList.innerHTML = ""
        players.forEach(player => {
            const playerElement = document.createElement("li")
            playerElement.innerHTML = `${player.nickname}: ${player.points}`
            playerList.appendChild(playerElement)
        })
    }
    const playerList = document.querySelector('.player_list')
    const waitMsg = document.querySelector('.wait_msg')
    const mainContainer = document.querySelector(".quiz_wrapper")
    const quiz = document.querySelector('.quiz')
    const quizContainer = document.querySelector(".quiz_container")
    const startQuizContainer = document.querySelector(".start_quiz_container")
    const waitRoom = document.querySelector('.waiting_room')
    const waitTimer = document.querySelector('.wait_timer')

    const answerEls = document.querySelectorAll('.quiz_input')
    const questionEl = document.querySelector('.quiz_question')
    const a_answer = document.getElementById('a_answer')
    const b_answer = document.getElementById('b_answer')
    const c_answer = document.getElementById('c_answer')
    const d_answer = document.getElementById('d_answer')
    const submitBtn = document.getElementById('answerBtn')
    const hiddenAnswer = document.querySelector('hidden_answer')

    let time = 10
    let i = 0
    let rounds = 0
    let score = 0
    let numberOfQuestion = 1;
    let quizData
    let answerList = []
    let candidateAnswerList = []
    let interval

    function req() {

        fetch("http://localhost:5000/quizData")
            .then(data => data.json())
            .then(data => createQuiz(data))
            .catch(err => console.error(err))

        interval = setInterval(workingQuiz, 10000)
    }

    function createQuiz(data) {
        quizData = data
        quizContainer.classList.remove("hidden")
        quiz.classList.remove("hidden")

        questionEl.innerText = `${numberOfQuestion}/5: ` + quizData[i].title
        a_answer.innerText = quizData[i].optionA
        b_answer.innerText = quizData[i].optionB
        c_answer.innerText = quizData[i].optionC
        d_answer.innerText = quizData[i].optionD
    }

    function countdown() {
        if (time <= 0) {
            clearInterval(timer);
            waitTimer.classList.add("hidden")
            quizContainer.classList.remove("hidden")
            playerList.classList.remove("hidden")
        }
        waitTimer.innerHTML = `Игра начнется через ${time}`
        time--
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

    function selectWinner(players) {
        if (players[0].points > players[1].points) {
            playerList.innerHTML = `Победитель ${players[0].nickname} c результатом ${players[0].points}/5`
        } if (players[0].points == players[1].points) {
            playerList.innerHTML = 'Ничья'
        } if (players[0].points < players[1].points) {
            playerList.innerHTML = `Победитель ${players[1].nickname} c результатом ${players[1].points}/5`
        }
    }



    submitBtn.addEventListener('click', () => {
        let answer = getSelected()
        submitBtn.classList.remove("quiz_btn")
        submitBtn.classList.add("disBtn")
        candidateAnswerList.push(answer)
        if (answer == quizData[i].correctOption) {
            score++
            socket.emit('scoreUpdate', socket.id)
        }
        submitBtn.disabled = true
    })


    function workingQuiz() {
        rounds++
        if (rounds < 5) {
            i++
            numberOfQuestion++
            createQuiz(quizData)
            submitBtn.disabled = false
            submitBtn.classList.remove("disBtn")
            submitBtn.classList.add("quiz_btn")
        } else {
            clearInterval(interval)
            socket.emit('sumPoints')
            socket.on('stateUpdate', data => {
                selectWinner(data)
            })

            quizContainer.innerHTML =
                `
             <h2>You scored ${score}/5</h2>
             <a class="btn" href="/card">Пройти тест еще раз</a>
            `
            for (let i = 0; i < 5; i++) {
                let answerContainer = document.createElement('div')
                answerContainer.classList.add('answer_card')
                if(typeof candidateAnswerList[i] == "undefined") {
                    candidateAnswerList[i] = "Вы не дали ответ на этот вопрос"
                }
                answerContainer.innerHTML +=
                    `
                            <span>Вопрос: ${quizData[i].title}</span>
                            <li>Вариант A: ${quizData[i].optionA}</li>
                            <li>Вариант B: ${quizData[i].optionB}</li>
                            <li>Вариант C: ${quizData[i].optionC}</li>
                            <li>Вариант D: ${quizData[i].optionD}</li>
                            <li >Ваш ответ: ${candidateAnswerList[i]}</li>
                            <li>Правильный ответ: ${quizData[i].correctOption}</li>
                            
        
                        `
                document.querySelector('.quiz_container').appendChild(answerContainer)

            }
        }
    }





