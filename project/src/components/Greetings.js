import React from 'react'
import {Navbar} from 'react-bootstrap'


class Greetings extends React.Component {

render (){

	const firstname = "Stephen"
	const date = new Date()
	const hour = date.getHours()
	let timeOfDay
	let timeColor

	const styles = {
		morningStyle : {
			color: 'yellow'
		},
		afternoonStyle : {
			color: 'white'
		},
		nightStyle : {
			color: 'green'
		}
	}

	if (hour<12) {
		timeOfDay = "morning"
		timeColor = styles.morningStyle
	} else if (hour >=12 && hour <= 17) {
		timeOfDay = "afternoon"
		timeColor = styles.afternoonStyle
	} else {
		timeOfDay = "night"
		timeColor = styles.nightStyle
	}

	
	return (

		<Navbar bg="dark" style = {timeColor}>
			Good {`${timeOfDay} ${firstname}`}
		</Navbar>

		)

	}
}


export default Greetings