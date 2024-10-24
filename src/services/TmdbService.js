export default class TmdbService {
  apiBase = 'https://api.themoviedb.org/3'

  apiToken =
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZWRjZmZkNWQxNmY3MzQwYmEyYzRlYjgzMjJiM2NmMyIsIm5iZiI6MTcyODk3NzczNy4zNDkzMTMsInN1YiI6IjY2ZmQ0MTdiZTI2YTUzYzEyMjU5NWM0YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.An1427sLKmhxQZZUQrygHkzWTo2aK7Hs0S0beqTALWU'

  apiKey = 'cedcffd5d16f7340ba2c4eb8322b3cf3'

  options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${this.apiToken}`,
    },
  }

  async getResource(url, options) {
    const res = await fetch(`${this.apiBase}${url}`, options)

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`)
    }
    const result = await res.json()

    return result
  }

  async getMoviesResource(query, page) {
    const result = await this.getResource(
      `/search/movie?query=${query}&include_adult=true&language=en-US&page=${page}`,
      this.options
    )

    return result
  }

  async getRatedMoviesResource(guestSessionId, page) {
    const url = `${this.apiBase}/guest_session/${guestSessionId}/rated/movies?api_key=${this.apiKey}&language=en-US&page=${page}&sort_by=created_at.asc`

    const response = await fetch(url, this.options)

    if (!response.ok) {
      throw new Error(`Could not fetch ${url}, received ${response.status}`)
    }
    const result = await response.json()

    return result
  }

  async rateMovie(guestSessionId, movieId, rating) {
    const url = `${this.apiBase}/movie/${movieId}/rating?guest_session_id=${guestSessionId}`

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Bearer ${this.apiToken}`,
      },
      body: `{"value":${rating}}`,
    }

    const response = await fetch(url, options)
    if (!response.ok) {
      throw new Error(`Could not fetch ${url}, received ${response.status}`)
    }
    const result = await response.json()

    return result
  }

  async getGenres() {
    const url = `${this.apiBase}/genre/movie/list?api_key=${this.apiKey}&language=en`

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Could not fetch ${url}, received ${response.status}`)
    }
    const result = await response.json()

    return result
  }

  async createGuestSession() {
    const url = `${this.apiBase}/authentication/guest_session/new`
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${this.apiToken}`,
      },
    }

    const response = await fetch(url, options)

    if (!response.ok) {
      throw new Error(`Could not fetch ${url}, received ${response.status}`)
    }

    const result = await response.json()

    return result
  }

  static transformMovie(movie) {
    return {
      posterPath: movie.poster_path,
      title: movie.title,
      releaseDate: movie.release_date,
      genre: movie.genre_ids,
      overview: movie.overview,
      id: movie.id,
      ratingGiven: movie.ratingGiven,
      voteAverage: parseFloat(movie.vote_average.toFixed(1)),
    }
  }

  static transformRatedMovie(movie) {
    return {
      posterPath: movie.poster_path,
      title: movie.title,
      releaseDate: movie.release_date,
      genre: movie.genre_ids,
      overview: movie.overview,
      id: movie.id,
      ratingGiven: parseFloat(movie.rating.toFixed(1)),
      voteAverage: parseFloat(movie.vote_average.toFixed(1)),
    }
  }
}
