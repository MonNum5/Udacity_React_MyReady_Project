import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import ListBooks from './ListBooks'
import { Route, Link } from 'react-router-dom'
import SearchBooks from './SearchBooks'

class BooksApp extends React.Component {
  state = {
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */

    wantToRead: [],
    currentlyReading: [],
    read: [],
    books : [],
    shelfs: {}
  }

  componentDidMount(){

    BooksAPI.getAll()
    .then((wantToRead) => {
      this.setState(() => ({
        wantToRead: wantToRead,
        books: wantToRead
      }))
    })

    BooksAPI.update('', 'read').then((result)=> {
      this.setState(()=> ({
        shelfs: result
      })
      )
    }).then(()=>{

      BooksAPI.getAll()
        .then((wantToRead) => {
          this.setState(() => ({
            books: wantToRead
          }))
        }).then(() => {
          this.setState(() => ({
            read:this.state.books.filter(b => this.state.shelfs.read.includes(b.id)),
            wantToRead:this.state.books.filter(b => this.state.shelfs.wantToRead.includes(b.id)),
            currentlyReading:this.state.books.filter(b => this.state.shelfs.currentlyReading.includes(b.id)),
          }))
        })

      
    })

    
  }

  getBook(arr){
    let bookArr = [5]
    for (var i of arr){
      BooksAPI.get(i).then((book) => {
        bookArr.push(book)
      }
      )
    }
    return bookArr
  }

  removeBook = (book) => {
    var index = this.state.wantToRead.findIndex(p => p.id === book.id)
    if (index > -1) {
      this.state.wantToRead.splice(index, 1);
    }
    var index = this.state.currentlyReading.findIndex(p => p.id === book.id)
    if (index > -1) {
      this.state.currentlyReading.splice(index, 1);
    }
    var index = this.state.read.findIndex(p => p.id === book.id)
    if (index > -1) {
      this.state.read.splice(index, 1);
    }
  }

  moveTo = (key, book) => {

    this.removeBook(book)

    if (key !== 'none'){
      this.setState((state) => ({
        [key] : state[key].concat([book])
      }))
  
    BooksAPI.update(book, key).then((books)=> {
      console.log(books)
    })
  } else {
    this.setState(() => ({
      books: this.state.books
    }))

  }
  }

  render() {
    return (
      <div className="app">
        <Route exact path='/' render = {() => (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Currently Reading</h2>

                  {this.state.currentlyReading !== [] && (
                        <ListBooks books = {this.state.currentlyReading} defaultSel= {"currentlyReading"} moveTo = {this.moveTo}/>
                  )}

                </div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Want to Read</h2>

                  {this.state.wantToRead !== [] && (
                      <ListBooks books = {this.state.wantToRead} defaultSel= {"wantToRead"} moveTo = {this.moveTo}/>
                  )}

                </div>

                <div className="bookshelf">
                  <h2 className="bookshelf-title">Read</h2>

                  {this.state.wantToRead !== [] && (
                      <ListBooks books = {this.state.read} defaultSel= {"read"} moveTo = {this.moveTo}/>
                  )}

                </div>

              </div>
            </div>
            <div className="open-search">
              <Link to='/create' className='add-contact'><button >Add a book</button></Link>
            </div>
          </div>
    )}/>

    <Route exact path='/create' render = {
              ({ history }) => (

                <SearchBooks moveTo = {this.moveTo}/>
              
            )}/>

    </div>
    )
  }
}

export default BooksApp

/*
     {this.state.wantToRead !== [] && (
                      <ListBooks books = {this.state.currentlyReading} moveTo = {this.moveTo}/>
                  )}

    


            {this.state.wantToRead !== [] && (
                      <ListBooks books = {this.state.read} moveTo = {this.moveTo}/>
                  )}

                  this.setState((state) => ({
            [key]: state[key].concat([key])
          }))
                  */