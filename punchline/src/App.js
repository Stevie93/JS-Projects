import React from 'react'

import Joke from './Joke'

function App () {
	return (
		<main>
			<Joke
				funnyJoke = {{question:"What is a cat?", punchLine:"A feline"}} />
				<Joke
				funnyJoke = {{punchLine:"A felines"}} />
		</main>
		)
}

export default App