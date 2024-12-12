import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import Header from '../Header'
import Result from '../Results'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Assessment extends Component {
  state = {
    totalQuestions: 0,
    answeredQuestionsCount: 0,
    unansweredQuestionsCount: 0,
    apiStatus: apiStatusConstants.initial,
    count: 0,
    question: null,
    min: '10',
    sec: '00',
    showRes: false,
    selectedOptionId:null
  }

  componentDidMount() {
    this.getPrimeDeals()
    this.timeChanger()
  }

  getPrimeDeals = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {count} = this.state
    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = 'https://apis.ccbp.in/assess/questions'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const {total, questions} = fetchedData

      const currentQue = questions[count]
      const questionsFun = (currentQuestion) => {
         let questionData = null
         if (currentQuestion.options_type === 'DEFAULT') {
           questionData = {
             id: currentQuestion.id,
             optionsType: currentQuestion.options_type,
            questionText: currentQuestion.question_text,
            options: currentQuestion.options.map(eachD => ({
            id: eachD.id,
            text: eachD.text,
            isCorrect: eachD.is_correct,
            })),
         }
        }
         else if (currentQuestion.options_type === 'IMAGE') {
           questionData = {
          id: currentQuestion.id,
          optionsType: currentQuestion.options_type,
          questionText: currentQuestion.question_text,
          options: currentQuestion.options.map(eachI => ({
            id: eachI.id,
            text: eachI.text,
            imageUrl: eachI.image_url,
            isCorrect: eachI.is_correct,
           })),
          }
         }
         else  {
          questionData = {
          id: currentQuestion.id,
          optionsType: currentQuestion.options_type,
          questionText: currentQuestion.question_text,
          options: currentQuestion.options.map(eachI => ({
            id: eachI.id,
            text: eachI.text,
            isCorrect: eachI.is_correct,
          })),
        }
      }
      return questionData
    } 
    const resultQue = questionsFun(currentQue)
      this.setState({
        totalQuestions: total,
        unansweredQuestionsCount: total,
        question: resultQue,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  timeChanger = () => {
    let {min, sec} = this.state
    let s = parseInt(sec)
    let m = parseInt(min)
    this.timeId = setInterval(() => {
      if (m === 0 && s === 0) {
        clearInterval(this.timeId)
        this.setState({showRes: true})
      } else if (s === 0) {
        m -= 1
        s = 59
      } else {
        s -= 1
      }
      this.setState({
        min: m.toString().padStart(2, '0'),
        sec: s.toString().padStart(2, '0'),
      })
    }, 1000)
  }
   handleOptionSelect = event => {
    const selectedOptionId = event.target.value;
    const { answeredQuestionsCount, unansweredQuestionsCount, selectedOptionId: prevSelectedId } = this.state;

    if (selectedOptionId !== prevSelectedId) {
      this.setState({
        selectedOptionId,
        answeredQuestionsCount: answeredQuestionsCount + 1,
        unansweredQuestionsCount: unansweredQuestionsCount - 1,
      });
    }
  };
  handleOption = () => {
   
    const { answeredQuestionsCount, unansweredQuestionsCount} = this.state;

    
      this.setState(prevState => ({
        
        answeredQuestionsCount: prevState.answeredQuestionsCount + 1,
        unansweredQuestionsCount:prevState.unansweredQuestionsCount - 1,
      }));
    
  };
  handleNextQuestion = () => {
    this.setState(
      prevState => ({count: prevState.count + 1}),
      this.getPrimeDeals,
    )
  }

  renderPrimeDealsList = () => {
     const { totalQuestions, question, min, sec, showRes, selectedOptionId, answeredQuestionsCount, unansweredQuestionsCount } = this.state;


    if (!question) {
      return null
    }

    const {optionsType, questionText, options,id} = question

    return (
      <>
        <Header />
        <div>
          <div>
            {optionsType === 'DEFAULT' && (
              <>
                <ul>
                  <li key={id}>
                    <p>{questionText}</p>
                  </li>
                  <li>
                    <ul>
                      {options.map(eachOp => (
                        <li key={eachOp.id} onClick={this.handleOption}>
                          <button>{eachOp.text}</button>
                        </li>
                      ))}
                    </ul>
                  </li>
                </ul>
                <button onClick={this.handleNextQuestion}>Next Question</button>
              </>
            )}
            {optionsType === 'IMAGE' && (
              <>
                <ul>
                  <li key={id}>
                    <p>{questionText}</p>
                  </li>
                  <li>
                    <ul>
                      {options.map(option => (
                        <li key={option.id} onClick={this.handleOption}>
                          <button>
                            <img src={option.imageUrl} alt={option.text} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </li>
                </ul>
                <button onClick={this.handleNextQuestion}>Next Question</button>
              </>
            )}
            {optionsType === 'SINGLE_SELECT' && (
              <>
                <p>{questionText}</p>
                <p>First option is selected by default</p>
                <select value={selectedOptionId} onChange={this.handleOptionSelect}>
                  {options.map(eachOption => (
                    <option key={eachOption.id} value={eachOption.id}>
                      {eachOption.text}
                    </option>
                  ))}
                </select>
                <button onClick={this.handleNextQuestion}>Next Question</button>
              </>
            )}
          </div>
          <div>
            <div>
              <p>Time Left</p>
              <p>
                00:{min}:{sec}
              </p>
            </div>
            <div>
              <p>{answeredQuestionsCount}</p>
              <p>Answered Questions</p>
              <p>{unansweredQuestionsCount}</p>
              <p>Unanswered Questions</p>
            </div>
            <div>
              <h1>Questions ({totalQuestions})</h1>
              <ul>
                {[...Array(totalQuestions)].map((_, index) => (
                  <li key={index + 1}>
                    <button>{index + 1}</button>
                  </li>
                ))}
              </ul>
            </div>
            <Link to="/results">
              <button>Submit Assessment</button>
            </Link>
          </div>
        </div>
        {showRes && <Result isBool={true} />}
      </>
    )
  }

  onRetry = () => {
    this.getPrimeDeals()
  }

  renderPrimeDealsFailureView = () => (
    <>
      <Header />
      <img
        src="https://assets.ccbp.in/frontend/react-js/exclusive-deals-banner-img.png"
        alt="failure view"
        className="register"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We are having some trouble</p>
      <button onClick={this.onRetry}>Retry</button>
    </>
  )

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#263868" height={50} width={50} />
    </div>
  )

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderPrimeDealsList()
      case apiStatusConstants.failure:
        return this.renderPrimeDealsFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}

export default Assessment
