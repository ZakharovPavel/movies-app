import { LeftCircleTwoTone, LoadingOutlined } from '@ant-design/icons'
import './App.css'
import { Typography, Spin, Alert, Input, Tabs, Button } from 'antd'
import { Component } from 'react'
import ErrorBoundary from 'antd/es/alert/ErrorBoundary'
import { Offline, Online } from 'react-detect-offline'
import { debounce } from 'lodash'

import MovieList from '../movie-list/MovieList'
import TmdbService from '../../services/TmdbService'
import { TmdbServiceProvider } from '../tmdb-service-context'
import RatedMovieList from '../rated-movie-list/RatedMovieList'

const { Text } = Typography

export default class App extends Component {
  tmdbService = new TmdbService()

  state = {
    movies: [],
    genres: [],
    totalResults: null,
    currentPage: 1,
    loading: false,
    error: false,
    searchQuery: '',
    isInitial: true,
    hasMovies: false,
    guestSessionId: null,
    ratedMovies: [],
    ratedTotalResults: null,
    ratedCurrentPage: 1,
    hasRatedMovies: false,
    ratedError: false,
    bufferedMoviesRate: {},
  }

  componentDidMount() {
    this.getGuestSession()

    this.getGenres()
  }

  handleChangeInput = debounce((query) => {
    const { currentPage } = this.state
    this.updateMovies(query, currentPage)
  }, 500)

  getGuestSession = () => {
    this.tmdbService.createGuestSession().then((res) => {
      this.setState({
        guestSessionId: res.guest_session_id,
      })
    })
  }

  getGenres = () => {
    this.tmdbService
      .getGenres()
      .then((res) => {
        const { genres } = res
        this.setState({
          genres,
        })
      })
      .catch(this.onError)
  }

  updateMovies = (query, page) => {
    const { ratedMovies } = this.state
    this.setState({ loading: true, isInitial: false, hasMovies: true })
    this.tmdbService
      .getMoviesResource(query, page)
      .then((res) => {
        this.setState({
          currentPage: page,
          movies: res.results.map((el) => TmdbService.transformMovie(el, ratedMovies)),
          totalResults: res.total_results,
          loading: false,
          searchQuery: query.trim(),
          isInitial: !query,
          hasMovies: res.results.length > 0,
          error: false,
        })
      })
      .catch(this.onError)
  }

  updateRatedMovies = (page = 1) => {
    const { guestSessionId } = this.state
    this.setState({ loading: true })
    this.tmdbService
      .getRatedMoviesResource(guestSessionId, page)
      .then((res) => {
        this.setState(() => ({
          ratedCurrentPage: page,
          ratedMovies: res.results.map((el) => TmdbService.transformRatedMovie(el)),
          ratedTotalResults: res.total_results,
          loading: false,
          hasRatedMovies: res.results.length > 0,
          ratedError: false,
        }))
      })
      .catch(this.onRatedError)
  }

  onRateChange = (id, rate) => {
    this.setState(({ movies, bufferedMoviesRate }) => {
      const movie = movies.filter((el) => el.id === id)[0]
      const newMovie = {
        ...bufferedMoviesRate,
        [movie.id]: rate,
      }
      return {
        bufferedMoviesRate: newMovie,
      }
    })
  }

  onError = () => {
    this.setState({
      error: true,
      loading: false,
    })
  }

  onRatedError = () => {
    this.setState({
      ratedError: true,
      loading: false,
    })
  }

  onTabChange = (activeKey) => {
    const { ratedCurrentPage } = this.state
    if (activeKey === 'ratedTab') {
      this.updateRatedMovies(ratedCurrentPage)
    }
  }

  render() {
    const {
      movies,
      totalResults,
      error,
      loading,
      currentPage,
      searchQuery,
      isInitial,
      hasMovies,
      genres,
      ratedMovies,
      guestSessionId,
      hasRatedMovies,
      ratedTotalResults,
      ratedCurrentPage,
      ratedError,
      bufferedMoviesRate,
    } = this.state

    const initialText = isInitial ? <Text type="secondary">Введите ваш запрос</Text> : null

    const hasData = !(loading || error)
    const noData = !hasMovies && !isInitial ? <Text type="secondary">Ничего не найдено</Text> : null
    const noRatedData = !hasRatedMovies && !loading ? <Text type="secondary">Ничего не найдено</Text> : null

    const errorMessage = error ? <Alert message="Movies fetch error" type="error" /> : null
    const ratedErrorMessage =
      ratedError && hasRatedMovies ? <Alert message="Rated movies fetch error" type="error" /> : null
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
          bufferedMoviesRate={bufferedMoviesRate}
        />
      ) : null

    const ratedContent =
      hasData && !noRatedData ? (
        <RatedMovieList
          ratedMovies={ratedMovies}
          ratedTotalResults={ratedTotalResults}
          isLoading={loading}
          onRatedMoviesUpdate={this.updateRatedMovies}
          ratedCurrentPage={ratedCurrentPage}
          guestSessionId={guestSessionId}
          bufferedMoviesRate={bufferedMoviesRate}
        />
      ) : null

    const tabItems = [
      {
        key: 'searchTab',
        label: 'Search',
        children: (
          <ErrorBoundary>
            <Input
              placeholder="Название фильма"
              onChange={(e) => {
                this.handleChangeInput(e.target.value.trim())
              }}
            />
            {errorMessage}
            {initialText}
            {noData}
            {spinner}
            {content}
          </ErrorBoundary>
        ),
      },
      {
        key: 'ratedTab',
        label: 'Rated',
        children: (
          <ErrorBoundary>
            {ratedErrorMessage}
            {noRatedData}
            {spinner}
            {ratedContent}
          </ErrorBoundary>
        ),
      },
    ]

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
          <ErrorBoundary>
            <LeftCircleTwoTone spin style={{ fontSize: '50px' }} />
            <TmdbServiceProvider
              value={{
                genres,
                guestSessionId,
                tmdbService: this.tmdbService,
                updateRatedMovies: this.updateRatedMovies,
                onRateChange: this.onRateChange,
                bufferedMoviesRate,
              }}
            >
              <Tabs
                defaultActiveKey="searchTab"
                items={tabItems}
                onChange={this.onTabChange}
                destroyInactiveTabPane
                centered
              />
            </TmdbServiceProvider>
          </ErrorBoundary>
        </Online>
        <Offline>
          <Alert message="You're offline right now. Check your connection." type="error" />
        </Offline>
      </section>
    )
  }
}
