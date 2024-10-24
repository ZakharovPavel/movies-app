import { List } from 'antd'

import Movie from '../movie/Movie'

export default function RatedMovieList({
  ratedMovies = [],
  ratedTotalResults = null,
  onRatedMoviesUpdate = () => {},
  ratedCurrentPage = 1,
  bufferedMoviesRate = {},
}) {
  return (
    <List
      grid={{
        gutter: [
          { md: 26, lg: 26 },
          { xs: 4, sm: 4, md: 20, lg: 20 },
        ],
      }}
      pagination={{
        align: 'center',
        pageSize: '20',
        current: ratedCurrentPage,
        total: ratedTotalResults,
        onChange: (page) => {
          onRatedMoviesUpdate(page)
        },
      }}
      dataSource={ratedMovies}
      renderItem={(item) => {
        return (
          <List.Item key={item.id}>
            <Movie movie={item} bufferedMoviesRate={bufferedMoviesRate} />
          </List.Item>
        )
      }}
    />
  )
}
