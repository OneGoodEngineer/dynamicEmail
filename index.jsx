var App = React.createClass({
  getInitialState () {
    return {
      selectedMessage: this.props.data.messages[1]
    }
  },
  render () {
    return (
      <div>
        <h1>Dynamic Email</h1>
        <Messages messages={this.props.data.messages}/>
        <MessageEditor selectedMessage={this.state.selectedMessage}/>
      </div>
    )
  }
})

var Messages = React.createClass({
  renderMessages (messages) {
    return (messages.map(message => {
      return (<Message id={message.id} content={message.content}/>)
    }))
  },
  render () {
    return (
      <div>
        <h2>Messages:</h2>
        {this.props.messages.map(m => {return (
          <Message id={m.id} content={m.content}/>
        )})}
      </div>
    )
  }
})

var Message = React.createClass({
  render () {
    return (
      <div>
        <span>id: {this.props.id}</span>
        <span>content: {this.props.content}</span>
      </div>
    )
  }
})

var MessageEditor = React.createClass({
  m () { return this.props.selectedMessage },
  render () {
    return (
      <form>
        <h3>Message:</h3>
        {this.props.selectedMessage}
        <textarea>{this.m().content}</textarea>
        <CreateMessage content={this.m().content} />
        <UpdateMessage id={this.m().id} content={this.m().content} />
        <DeleteMessage id={this.m().id} />
      </form>
    )
  }
})

var CreateMessage = React.createClass({
  render () {
    return (
      <button>Create</button>
    )
  }
})

var UpdateMessage = React.createClass({
  render () {
    return (
      <button>Update</button>
    )
  }
})

var DeleteMessage = React.createClass({
  render () {
    return (
      <button>Delete</button>
    )
  }
})

var DATA = {messages:[
  {id:1, content:'first!'},
  {id:2, content:'ho hum'},
  {id:3, content:'last :('}
]}
React.render(<App data={DATA}/>, document.body)




/*
var firebaseURL = 'https://dynamicemail.firebaseio.com/'
var ref = new Firebase(firebaseURL)
var sync = $firebase(ref)

function destroyMessage (messageID) {
  console.log('destroying messageID', messageID)
  var list = $firebase(ref).$asArray()
  return list.$loaded(function(loadedList){
    console.log('firebase loaded, deleting messageID', messageID)
    return loadedList.$remove(loadedList.$getRecord(messageID))
  })
}

function createImage (message) {
  var fontPx = 12
  var canvas = document.getElementById('textCanvas')
  canvas.setAttribute("height", fontPx)
  var canvasContext = canvas.getContext('2d')
  canvasContext.canvas.width = fontPx * (canvasContext.measureText(message).width) + 1
  canvasContext.font = fontPx + "px Arial"
  canvasContext.fillText(message, 0, 0.75*fontPx)
  // canvasContext.scale(2,2)
  var dataUrl = canvasContext.canvas.toDataURL()
  return sync.$push({message: message, img: dataUrl}).then(function(newChildRef) {
    console.log("added record with id " + newChildRef.name())
    return newChildRef.name()
  })
}
*/
