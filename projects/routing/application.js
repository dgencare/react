import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link } from 'react-router'
import getJSON from './lib/getJSON'
import { asyncProps } from './lib/AsyncProps'

class Main extends React.Component {
  render() {
    return (
      <div>
        <h1>AsyncProps</h1>
        {this.props.children}
      </div>
    )
  }
}

class Index extends React.Component {
  render() {
    return (
      <div>
        <ul>
          <li><Link to="/contacts">Contacts</Link></li>
          <li><Link to="/star-wars">Star Wars</Link></li>
        </ul>
      </div>
    )
  }
}


class Contacts extends React.Component {
  render() {
    return (
      <div>
        <h2>Contacts</h2>
        {this.props.children}
      </div>
    )
  }
}

class ContactsIndex extends React.Component {

  static loadProps(params, cb) {
    getJSON('https://addressbook-api.herokuapp.com/contacts', cb)
  }

  render() {
    return (
      <div>
        <ul>
          {this.props.contacts.map((contact) => (
            <li key={contact.id}><Link to={`/contacts/${contact.id}`}>{contact.first}</Link></li>
          ))}
        </ul>
      </div>
    )
  }
}

class Contact extends React.Component {

  static loadProps(params, cb) {
    getJSON(`https://addressbook-api.herokuapp.com/contacts/${params.contactId}`, cb)
  }

  render() {
    let { first, last } = this.props.contact
    return (
      <div>
        <h3>{first} {last}</h3>
      </div>
    )
  }
}

class StarWars extends React.Component {

  static loadProps(params, cb) {
    getJSON(`http://swapi.co/api/people/`, (err, res) => {
      cb(err, { people: res.results })
    })
  }

  render() {
    return (
      <div>
        <h3>Star Wars People</h3>
        <ul>
          {this.props.people.map((person) => (
            <li key={person.url}>{person.name}</li>
          ))}
        </ul>
      </div>
    )
  }
}

render((
  <Router createElement={asyncProps}>
    <Route path="/" component={Main}>
      <IndexRoute component={Index}/>
      <Route path="contacts" component={Contacts}>
        <IndexRoute component={ContactsIndex}/>
        <Route path=":contactId" component={Contact}/>
      </Route>
      <Route path="star-wars" component={StarWars}/>
    </Route>
  </Router>
), document.getElementById('app'))


