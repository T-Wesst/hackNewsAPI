import React, { Component } from 'react';
import './App.css';
import Table from './Table';
import Search from './Search';
import Button from './Button';
import axios from 'axios';
// build library to reference icons through out app
import { library } from '@fortawesome/fontawesome-svg-core';
// fab: array of all brand icons can be referenced by string name
import { fab } from '@fortawesome/free-brands-svg-icons';
// import icons
import {
  faCheckSquare,
  faCoffee,
  faSearch,
  faChevronCircleRight,
  faTrashAlt,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
// use FA Icon component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// adds icons to library and can be used throughout application without reimporting icons. just import the FA Icon component and supply the icon prop an icon name as a string.
// to use brand icons import the FA Icon component and supply the icon prop = {["fab", "apple"]}
library.add(
  fab,
  faCheckSquare,
  faCoffee,
  faSearch,
  faChevronCircleRight,
  faTrashAlt,
  faSpinner
);
const defaultQuery = 'redux';
const pathBase = 'https://hn.algolia.com/api/v1';
const pathSearch = '/search?';
const paramSearch = 'query=';
const paramPage = '&page=';
const paramHPP = '&hitsPerPage=';
const defaultHPP = '10';
const Loading = () => (
  <div>
    <FontAwesomeIcon icon="spinner" spin pulse />
  </div>
);
// const url = `${pathBase}${pathSearch}${paramSearch}${searchTerm}&${paramPage}`;
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: null,
      searchKey: '',
      searchTerm: defaultQuery,
      error: null,
      isLoading: false
    };
  }
  onDismiss = id => {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];
    const isNotId = item => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);
    this.setState({
      results: { ...results, [searchKey]: { hits: updatedHits, page } }
    });
  };

  needsToSearchTopStories = searchTerm => {
    return !this.state.results[searchTerm];
  };

  setSearchTopStories = result => {
    const { hits, page } = result.data;
    const { searchKey, results } = this.state;

    const oldHits =
      results && results[searchKey] ? results[searchKey].hits : [];
    const updatedHits = [...oldHits, ...hits];
    this.setState({
      results: { ...results, [searchKey]: { hits: updatedHits, page } },
      isLoading: false
    });
  };

  onSearchSubmit = event => {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.getTopStories(searchTerm);
    event.preventDefault();
  };

  getTopStories = (searchTerm, page = 0) => {
    this.setState({ isLoading: true });
    axios
      .get(
        `${pathBase}${pathSearch}${paramSearch}${searchTerm}${paramPage}${page}${paramHPP}${defaultHPP}`
      )
      .then(result => this.setSearchTopStories(result))
      .catch(error => this.setState({ error }));
  };
  // ! not used anymore
  // deleteById = id => {
  //   const isNotId = item => item.objectID !== id;
  //   const updatedHits = this.state.result.hits.filter(isNotId);
  // * SPREAD OPERATOR
  //   this.setState({ result: { ...this.state.result, hits: updatedHits } });
  // };

  handleInput = event => {
    this.setState({ searchTerm: event.target.value });
  };

  componentDidMount() {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.getTopStories(searchTerm);
  }
  render() {
    const { searchTerm, results, searchKey, error, isLoading } = this.state;
    const page =
      (results && results[searchKey] && results[searchKey].page) || 0;
    const list =
      (results && results[searchKey] && results[searchKey].hits) || [];
    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onSubmit={this.onSearchSubmit}
            onChange={this.handleInput}
          >
            Search <FontAwesomeIcon icon="search" />
          </Search>
        </div>
        {error ? (
          <div className="interaction">
            <p>Something went wrong.</p>
          </div>
        ) : (
          <Table list={list} onDismiss={this.onDismiss} />
        )}
        <div className="interactions">
          {isLoading ? (
            <Loading />
          ) : (
            <Button onClick={() => this.getTopStories(searchKey, page + 1)}>
              More
            </Button>
          )}
        </div>
      </div>
    );
  }
}
export default App;
