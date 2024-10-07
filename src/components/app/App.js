/* eslint no-unused-vars: 0 */
/* eslint react/jsx-boolean-value: 1 */
/* eslint react/state-in-constructor: 0 */
/* eslint react/no-unused-class-component-methods: 0 */

import { LeftCircleTwoTone, LoadingOutlined } from '@ant-design/icons'
import './App.css'
import { Card, Flex, Typography, Tag, Space, ConfigProvider, Spin, Alert } from 'antd'
import Title from 'antd/es/typography/Title'
import { Component, useState } from 'react'
import { Header } from 'antd/es/layout/layout'
import Paragraph from 'antd/es/typography/Paragraph'
import ErrorBoundary from 'antd/es/alert/ErrorBoundary'

import MovieList from '../movie-list/MovieList'
import TmdbService from '../../services/tmdb-service'

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
    loading: true,
    error: false,
  }

  constructor() {
    super()
    this.updateMovies()
  }

  updateMovies = () => {
    this.tmdbService.getMovies('remove').then(this.onMoviesLoaded).catch(this.onError)
  }

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
    const { movies, error, loading } = this.state

    const hasData = !(loading || error)

    const errorMessage = error ? <Alert message="Error Text" type="error" /> : null
    const spinner = loading ? <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} /> : null
    const content = hasData ? <MovieList movies={movies} /> : null

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
        <LeftCircleTwoTone spin style={{ fontSize: '50px' }} />
        <ErrorBoundary>
          {errorMessage}
          {spinner}
          {content}
        </ErrorBoundary>
        {/* {errorMessage}
        {spinner}
        {content} */}
      </section>
    )
  }
}
