const React = require('react')
export const LogTypeFilter = ({checked, label, onChange}) => {
  return (
  <label>
    <input type="checkbox" checked={checked} onChange={onChange} />
    <span>{label}</span>
  </label>
)}

export class Filters extends React.Component {
  state = {
    // string name for each log type
    types: [],
    // boolean for each log type
    enabled: {}
  }

  constructor(props) {
    super(props)
    this.state.types = props.types
    // initially every log type is enabled
    this.state.types.forEach(type => {
      this.state.enabled[type] = true
    })
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (event) {
    console.log(event)
    // this.setState({ checked: event.target.checked })
  }

  render () {
    return (
      <div>{
        this.state.types.map(type =>
          <LogTypeFilter checked={this.state.enabled[type]}
            label={type} key={type} onChange={this.handleChange} />
        )
      }
      </div>
    )
  }
}
