import { List } from 'antd'

import Movie from '../movie/Movie'

export default function MovieList({
  movies = [],
  totalResults = null,
  isLoading = false,
  onMoviesUpdate = () => {},
  currentPage = 1,
  searchQuery = '',
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
      loading={isLoading}
      pagination={{
        align: 'center',
        pageSize: '20',
        current: currentPage,
        total: totalResults,
        onChange: (page) => {
          onMoviesUpdate(searchQuery, page)
        },
      }}
      dataSource={movies}
      renderItem={(item) => {
        return (
          <List.Item key={item.id}>
            <Movie movie={item} bufferedMoviesRate={bufferedMoviesRate} />
          </List.Item>
        )
      }}
      style={{ paddingTop: '34px' }}
    />
  )
}
