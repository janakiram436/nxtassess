import Cookies from 'js-cookie'
import {Redirect, Link} from 'react-router-dom'

import Header from '../Header'

const Home = () => {
  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken === undefined) {
    return <Redirect to="/login" />
  }

  return (
    <>
      <Header />
      <div>
        <h1>Instructions</h1>
        <ol>
          <li>Total Questions: 10</li>
          <li>Types of Questions: MCQs</li>
          <li>Duration: 10 Mins</li>
          <li>Marking Scheme: Every Correct response, get 1 mark</li>
          <li>
            All the progress will be lost, if you reload during the assessment
          </li>
        </ol>
        <Link to="/assessment">
          <button>Start Assessment</button>
        </Link>
      </div>
      <div>
        <img
          className="website-logo"
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
          alt="assessment"
        />
      </div>
    </>
  )
}

export default Home
