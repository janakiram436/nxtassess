import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'

import Header from '../Header'

const Result = props => {
  const {isBool} = props
  return (
    <>
      <Header />
      <div>
        <h1>Congrats! You completed the assessment</h1>
        <p>Time Taken</p>
        <p>Your score: 2</p>
        <Link to="/assessment">
          <button>Reattempt</button>
        </Link>
      </div>
      <div>
        <img
          className="website-logo"
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
          alt="submit"
        />
      </div>
      {isBool && (
        <>
          <div>
            <p>You did not complete the assessment within the time</p>
            <p>Your score: 2</p>
            <Link to="/assessment">
              <button>Reattempt</button>
            </Link>
          </div>
          <div>
            <img
              className="website-logo"
              src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
              alt="time up"
            />
          </div>
        </>
      )}
    </>
  )
}

export default Result
