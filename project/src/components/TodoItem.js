import React from 'react'


class TodoItem extends React.Component {

	render(){

const completedStyle = {
	fontStyle :'italic',
	color : 'grey',
	textDecoration : 'line-through'

}

		return (
		<p>
 			<input 
 				type="checkbox" 
 				checked = {this.props.item.completed} 
 				onChange = {() => this.props.handleChange(this.props.item.id)} 
			/>
 			<label style = {this.props.item.completed ? completedStyle : null} > {this.props.item.text}</label>
 		</p>
 		)
	}
}

export default TodoItem