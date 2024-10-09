/* eslint no-unused-vars: 0 */
/* eslint react/no-unused-state: 0 */
/* eslint prefer-destructuring: 0 */
/* eslint react/jsx-boolean-value: 1 */
/* eslint react/state-in-constructor: 0 */
/* eslint react/no-unused-class-component-methods: 0 */

import { LeftCircleTwoTone, LoadingOutlined } from '@ant-design/icons'
import './App.css'
import { Card, Flex, Typography, Tag, Space, ConfigProvider, Spin, Alert, List, Pagination, Input } from 'antd'
import Title from 'antd/es/typography/Title'
import { Component, useState } from 'react'
import { Header } from 'antd/es/layout/layout'
import Paragraph from 'antd/es/typography/Paragraph'
import ErrorBoundary from 'antd/es/alert/ErrorBoundary'
import { Offline, Online } from 'react-detect-offline'
import { debounce } from 'lodash'

import MovieList from '../movie-list/MovieList'
import TmdbService from '../../services/tmdb-service'
import Movie from '../movie/Movie'

const { Text } = Typography

export default class App extends Component {
  initialMovies = [
    {
      posterPath: 'https://m.media-amazon.com/images/M/MV5BMTQ2MTgxNTU3Ml5BMl5BanBnXkFtZTcwMzg4OTAzMQ@@._V1_.jpg',
      title: 'Cool movie 1',
      releaseDate: 'Feb 2 2022',
      genre: ['Action', 'Drama'],
      overview: 'bla blabla blabla bla blablabla labla',
      id: 1,
    },
    {
      posterPath: 'https://m.media-amazon.com/images/M/MV5BMTQ2MTgxNTU3Ml5BMl5BanBnXkFtZTcwMzg4OTAzMQ@@._V1_.jpg',
      title: 'Cool movie 2: Return',
      releaseDate: 'Feb 2 2023',
      genre: ['Action', 'Not drama'],
      overview: 'bla blabla blabla bla labla',
      id: 2,
    },
    {
      posterPath: 'https://m.media-amazon.com/images/M/MV5BMTQ2MTgxNTU3Ml5BMl5BanBnXkFtZTcwMzg4OTAzMQ@@._V1_.jpg',
      title: 'Cool movie 3: Revenge',
      releaseDate: 'Feb 2 2024',
      genre: ['Action', 'A little drama'],
      overview: 'bla blabla blabla bla blablabla',
      id: 3,
    },
  ]

  tmdbService = new TmdbService()

  state = {
    movies: [],
    totalResults: null,
    currentPage: 1,
    loading: false,
    error: false,
    searchQuery: '',
    isInitial: true,
    hasMovies: false,
  }

  componentDidMount() {
    // const { currentPage, searchQuery } = this.state
    // this.updateMovies(searchQuery, currentPage)
    // this.setState({isInitial: false})
    // console.log('mounted')
  }

  // updateMovies = () => {
  //   this.tmdbService.getMovies('remove').then(this.onMoviesLoaded).catch(this.onError)
  // }

  handleChangeInput = debounce((query) => {
    const { currentPage } = this.state
    this.updateMovies(query, currentPage)
  }, 500)

  updateMovies = (query, page) => {
    this.setState({ loading: true, isInitial: false, hasMovies: true })
    this.tmdbService
      .getMoviesResource(query, page)
      .then((res) => {
        // const { movies } = this.state
        this.setState({
          currentPage: page,
          movies: res.results.map((el) => TmdbService.transformMovie(el)),
          totalResults: res.total_results,
          loading: false,
          searchQuery: query,
          isInitial: !query,
          hasMovies: res.results.length > 0,
        })
        // console.log(movies)
      })
      .catch(this.onError)
  }

  // updateMovies = () => {
  //   this.tmdbService
  //     .getMoviesResource('remove')
  //     .then((res) => {
  //       console.log(res)

  //       return res.results
  //     })
  //     .then(this.onMoviesLoaded)
  //     .catch(this.onError)
  // }

  onMoviesLoaded = (movies) => {
    this.setState({ movies, loading: false })
  }

  onError = () => {
    this.setState({
      error: true,
      loading: false,
    })
  }

  render() {
    const { movies, totalResults, error, loading, currentPage, searchQuery, isInitial, hasMovies } = this.state

    const initialText = isInitial ? <Text type="secondary">Введите ваш запрос</Text> : null

    const hasData = !(loading || error)
    const noData = !hasMovies && !isInitial ? <Text type="secondary">Ничего не найдено</Text> : null

    const errorMessage = error ? <Alert message="Error Text" type="error" /> : null
    const spinner = loading ? <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} /> : null
    const content =
      hasData && !isInitial && !noData ? (
        <MovieList
          movies={movies}
          totalResults={totalResults}
          isLoading={loading}
          onMoviesUpdate={this.updateMovies}
          currentPage={currentPage}
          searchQuery={searchQuery}
        />
      ) : null

    return (
      <section
        className="movies-app"
        style={{
          paddingTop: 20,
          paddingRight: 32,
          paddingBottom: 20,
          paddingLeft: 32,
        }}
      >
        <Online>
          <LeftCircleTwoTone spin style={{ fontSize: '50px' }} />
          <Input
            placeholder="Название фильма"
            onChange={(e) => {
              this.handleChangeInput(e.target.value)
            }}
          />
          <ErrorBoundary>
            {errorMessage}
            {initialText}
            {noData}
            {spinner}
            {content}
          </ErrorBoundary>
        </Online>
        <Offline>
          <Alert message="You're offline right now. Check your connection." type="error" />
        </Offline>
      </section>
    )
  }
}
