import React from 'react'

function Joke (props) {
	return(
		<div>
			<p style = {{display: props.funnyJoke.question ? "block" : "none"}}>
			Question: {props.funnyJoke.question}</p>
			<p>Punch line: {props.funnyJoke.punchLine}</p>
			<hr />
		</div>
		)
}

export default Joke