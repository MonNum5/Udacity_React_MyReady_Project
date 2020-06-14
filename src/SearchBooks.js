import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import ListBooks from './ListBooks'

class SearchBooks extends Component {

    state ={
        query:'',
        results:[]

    }

    componentDidUpdate() {
        if (this.state.query!=='') {
            BooksAPI.search(this.state.query).then((results) => 
            {
                this.setState(() => ({
                    results
                  }))
            })
            ;
        } 
      }

    updateQuery = (query) => {
        this.setState(()=>({
            query: query.trim()
        })
        )
    }

    

    render(){

        const { moveTo } = this.props

        return(
        <div className="search-books">
            <div className="search-books-bar">
            <Link to='/' className='add-contact'><button className="close-search">Close</button></Link>
              
              <div className="search-books-input-wrapper">
                {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md
                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
                <input type="text" onChange ={(event) => this.updateQuery(event.target.value)} placeholder="Search by title or author"/>

              </div>
            </div>
            <div className="search-books-results">
            {this.state.query == '' &&
                    <p style={{'text-align': 'center'}}>Please enter query</p>
                    
                }
              <ol className="books-grid">
              {this.state.query !== '' &&
                    <ListBooks books = {this.state.results} defaultSel= {"none"} moveTo = {moveTo}/>
                }
              </ol>
            </div>
          </div>
          )
    }
}


export default SearchBooks