import React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import Header from './components/Header'
import MainContent from './components/MainContent'
import Footer from './components/Footer'


class App extends React.Component {
	render(){

	return (
		<Container fluid >
			<Row className="justify-content-md-center">
				<Col>
				<Header />
				<MainContent />
				<Footer />
				</Col>
			</Row>
		</Container>
		)

	}
}

export default App 