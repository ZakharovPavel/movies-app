export default class TmdbService {
  apiBase = 'https://api.themoviedb.org/3'

  async getResource(url, options) {
    const res = await fetch(`${this.apiBase}${url}`, options)

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`)
    }
    const result = await res.json()

    return result
  }

  async getMoviesResource(query, page) {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZWRjZmZkNWQxNmY3MzQwYmEyYzRlYjgzMjJiM2NmMyIsIm5iZiI6MTcyNzg3NDgyOC41NTQwMjIsInN1YiI6IjY2ZmQ0MTdiZTI2YTUzYzEyMjU5NWM0YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.sJbvLjdx6YU1fTUXj-emD2efq4m6B_4RrOM6Qz6TXL0',
      },
    }

    const response = await this.getResource(
      `/search/movie?query=${query}&include_adult=true&language=en-US&page=${page}`,
      options
    )

    // console.log(response)

    // const moviesArr = response.map((el) => TmdbService.transformMovie(el))

    return response
  }

  async getMovies(query) {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZWRjZmZkNWQxNmY3MzQwYmEyYzRlYjgzMjJiM2NmMyIsIm5iZiI6MTcyNzg3NDgyOC41NTQwMjIsInN1YiI6IjY2ZmQ0MTdiZTI2YTUzYzEyMjU5NWM0YiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.sJbvLjdx6YU1fTUXj-emD2efq4m6B_4RrOM6Qz6TXL0',
      },
    }

    const response = await this.getResource(
      `/search/movie?query=${query}&include_adult=true&language=en-US&page=1`,
      options
    ).then((res) => res.results)

    // const response = await this.getResource(
    //   `/search/movie?query=${query}&include_adult=true&language=en-US&page=1`,
    //   options
    // )

    console.log(response)

    const moviesArr = response.map((el) => TmdbService.transformMovie(el))

    return moviesArr
  }

  static transformMovie(movie) {
    return {
      posterPath: movie.poster_path,
      title: movie.title,
      releaseDate: movie.release_date,
      genre: movie.genre_ids,
      overview: movie.overview,
      id: movie.id,
    }
  }
}
