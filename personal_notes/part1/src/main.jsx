import ReactDOM from 'react-dom/client'

import App from './App'

let counter1 = 1
const root = ReactDOM.createRoot(document.getElementById('root'))

const refresh = () => {
    root.render(<App counter1={counter1} />)
}

const intervalID = setInterval( () => {
    if (counter1 <= 100) {
        refresh()
    counter1 += 1
    } else {
        clearInterval(intervalID)
        console.log("spent over 100 seconds")
    }
}, 1000)
