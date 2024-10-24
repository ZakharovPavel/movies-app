/* eslint no-else-return: 1 */

import { Flex, Typography, Tag, Rate } from 'antd'
import Title from 'antd/es/typography/Title'
import { format } from 'date-fns'

import './Movie.css'
import { TmdbServiceConsumer } from '../tmdb-service-context'

function Movie({ movie = {}, bufferedMoviesRate = {} }) {
  const { Text } = Typography
  const { posterPath, title, releaseDate, overview, genre, id, ratingGiven, voteAverage } = movie

  const movieRate = bufferedMoviesRate[movie.id] ?? 0
  const imageBaseUrl = 'https://image.tmdb.org/t/p/w500'
  const placeholderImageUrl =
    'https://cdn-jpojb.nitrocdn.com/jAlWQzkyuTYqWNBrkljClYXTYVQpJDRw/assets/images/optimized/rev-bfc9be9/hollywoodscriptshop.com/wp-content/uploads/woocommerce-placeholder.png'

  const getRateColor = (rating) => {
    if (rating >= 0 && rating < 3) {
      return '#E90000'
    } else if (rating >= 3 && rating < 5) {
      return '#E97E00'
    } else if (rating >= 5 && rating < 7) {
      return '#E9D100'
    }

    return '#66E900'
  }

  function truncateText(text, maxLength) {
    if (text.length <= maxLength) {
      return text
    }

    let truncatedText = text.slice(0, maxLength)
    const lastSpaceIndex = truncatedText.lastIndexOf(' ')

    if (lastSpaceIndex > -1) {
      truncatedText = truncatedText.slice(0, lastSpaceIndex)
    }

    return `${truncatedText}...`
  }

  return (
    <TmdbServiceConsumer>
      {({ genres, guestSessionId, tmdbService, onRateChange }) => {
        return (
          <Flex className="movie-card" gap={0}>
            <img
              className="movie-card__poster--md"
              src={movie.posterPath ? `${imageBaseUrl}${posterPath}` : placeholderImageUrl}
              alt="cool movie"
            />
            <div className="movie-card__content">
              <img
                className="movie-card__poster--xs"
                src={movie.posterPath ? `${imageBaseUrl}${posterPath}` : placeholderImageUrl}
                alt="cool movie"
              />
              <Flex className="movie-card__content-wrapper" vertical gap={9}>
                <Flex className="movie-card__header-container" justify="space-between">
                  <Title className="movie-card__title" level={4} ellipsis={{ rows: 1 }} style={{ margin: 0 }}>
                    {title}
                  </Title>
                  <Flex
                    className="movie-card__circle-rating-container"
                    style={{
                      border: `2px solid ${getRateColor(voteAverage)}`,
                    }}
                  >
                    <Text>{voteAverage}</Text>
                  </Flex>
                </Flex>
                <Text type="secondary">{releaseDate && format(new Date(releaseDate), 'MMMM d, y')}</Text>
                <Flex>
                  {movie.genre.map((genreId) => {
                    const { name } = genres.filter((el) => el.id === genreId)[0]
                    return <Tag key={`${title}${genreId}`}>{name}</Tag>
                  })}
                </Flex>
                <Typography.Paragraph className="movie-card__overview--md">
                  {truncateText(overview, 150)}
                </Typography.Paragraph>
                <Rate
                  className="movie-card__rate--md"
                  allowHalf
                  count={10}
                  defaultValue={0}
                  value={movieRate || ratingGiven}
                  onChange={(r) => {
                    tmdbService.rateMovie(guestSessionId, id, r)
                    onRateChange(id, r)
                    return r
                  }}
                  style={{ width: '239px', fontSize: 16 }}
                />
              </Flex>
            </div>
            <Typography.Paragraph className="movie-card__overview--xs">
              {truncateText(overview, 150)}
            </Typography.Paragraph>
            <Rate
              className="movie-card__rate--xs"
              allowHalf
              count={10}
              defaultValue={0}
              value={movieRate || ratingGiven}
              onChange={(r) => {
                tmdbService.rateMovie(guestSessionId, id, r)
                onRateChange(id, r)
                return r
              }}
              style={{ width: '239px', fontSize: 16 }}
            />
          </Flex>
        )
      }}
    </TmdbServiceConsumer>
  )
}

export default Movie
