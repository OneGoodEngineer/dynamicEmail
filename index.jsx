var App = React.createClass({
  getInitialState () {
    return { content: null, id: null }
  },
  componentWillMount () {
    this.firebaseRef = new Firebase("https://dynamicemail.firebaseio.com/")
    this.firebaseRef.on("child_added", (dataSnapshot => {
      var id = dataSnapshot.name()
      console.log(`firebase added ${id}`)
      this.setState({id: id})
    }).bind(this))
    this.firebaseRef.on("child_removed", (dataSnapshot => {
      var id = dataSnapshot.name()
      console.log(`firebase removed ${id}`)
      this.setState({id: null})
    }).bind(this))
  },
  componentWillUnmount () {
    this.firebaseRef.off()
  },
  contentUpdated (event) {
    this.setState({ content: event.target.value })
  },
  destroyIdUpdated (event) {
    this.setState({ id: event.target.value })
  },
  createMessage (content) {
    console.log('creating message from content', content)
    var fontPx = 12
    var canvas = document.getElementById('textCanvas')
    canvas.setAttribute("height", fontPx)
    var canvasContext = canvas.getContext('2d')
    canvasContext.canvas.width = fontPx * (canvasContext.measureText(content).width) + 1
    canvasContext.font = fontPx + "px Arial"
    canvasContext.fillText(content, 0, 0.75*fontPx)
    // canvasContext.scale(2,2)
    var dataUrl = canvasContext.canvas.toDataURL()
    this.firebaseRef.push({message: content, img: dataUrl})
  },
  destroyMessage (id) {
    console.log('destroying message with id', id)
    this.firebaseRef.child(id).remove(x => {console.log(`finished deleting ${JSON.stringify(arguments)}`)})
  },
  render () {
    return (
      <div>
        <div class="titlebar">
          <h1>Generate dynamic email:</h1>
        </div>
        <div id="container">
          <div id="createMessage">
            <textarea id="text" placeholder="Type your message here" onChange={this.contentUpdated}></textarea>
            <button onClick={this.createMessage.bind(this, this.state.content)}>create message</button>
            <label>Font size:</label>
            <input type="number" placeholder="12" disabled />
          </div>
          <div id="destroyMessage">
            <button onClick={this.destroyMessage.bind(this, this.state.id)}>destroy message</button>
            <input onChange={this.destroyIdUpdated} placeholder="message id" value={this.state.id} />
            <label>{this.state.destroyMessageStatus}</label>
          </div>
          <div id="viewMessage" ng-show="messageID">
            <div>Message:
              <p>{this.state.content}</p>
            </div>
            <div>Generated Canvas:
              <canvas id='textCanvas' height="20"></canvas>
            </div>
            <div>Image from API:
              <img src={`https://dynamicemail.herokuapp.com/api/${this.state.id}/message.png`} />
            </div>
            <div>Image URL:
              <a href={`https://dynamicemail.herokuapp.com/api/${this.state.id}/message.png`}>https://dynamicemail.herokuapp.com/api/{this.state.id}/message.png</a>
            </div>
            <div>HTML to copy:
              <p>&lt;img url="https://dynamicemail.herokuapp.com/api/{this.state.id}/message.png"&gt;</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
})

React.render(<App />, document.body)
