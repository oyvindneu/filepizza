import Centered from './Centered'
import DownloadActions from '../actions/DownloadActions'
import DownloadButton from './DownloadButton'
import DownloadStore from '../stores/DownloadStore'
import ProgressBar from './ProgressBar'
import React from 'react'
import Spinner from './Spinner'
import peer from 'filepizza-peer'

export default class DownloadPage extends React.Component {

  constructor() {
    this.state = DownloadStore.getState()

    this._onChange = () => {
      this.setState(DownloadStore.getState())
    }

    this._onConnection = (conn) => {
      DownloadActions.beginDownload(conn)
    }
  }

  componentDidMount() {
    DownloadStore.listen(this._onChange)
    peer.on('connection', this._onConnection)
  }

  componentDidUnmount() {
    DownloadStore.unlisten(this._onChange)
    peer.removeListener('connection', this._onConnection)
  }

  downloadFile() {
    DownloadActions.requestDownload()
  }

  render() {
    switch (this.state.status) {
      case 'ready':
        return <Centered ver>

          <h1>FilePizza</h1>
          <Spinner dir="down"
            name={this.state.file.name}
            size={this.state.file.size} />

          <DownloadButton onClick={this.downloadFile.bind(this)} />

        </Centered>

      case 'requesting':
      case 'downloading':
        return <Centered ver>

          <h1>FilePizza</h1>
          <Spinner dir="down" animated
            name={this.state.file.name}
            size={this.state.file.size} />

          <ProgressBar value={this.state.progress} />

        </Centered>

      case 'cancelled':
        return <Centered ver>

          <h1>FilePizza</h1>
          <Spinner dir="down"
            name={this.state.file.name}
            size={this.state.file.size} />

          <ProgressBar value={-1} />

        </Centered>

      case 'done':
        return <Centered ver>

          <h1>FilePizza</h1>
          <Spinner dir="down"
            name={this.state.file.name}
            size={this.state.file.size} />

          <ProgressBar value={1} />

        </Centered>
    }
  }

}
