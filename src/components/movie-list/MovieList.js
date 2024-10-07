import { Card, List } from 'antd'

import Movie from '../movie/Movie'

function MovieList({ movies }) {
  // const dataSource = movies.map((item) => ({ ...item, key: item.id }))

  // const someArr = []

  // for (const element of movies) {
  //   someArr.push(element)
  // }

  return (
    <List
      grid={{
        gutter: 16,
      }}
      // dataSource={dataSource}
      dataSource={movies}
      // dataSource={someArr}
      renderItem={(item) => {
        return (
          <List.Item key={item.id}>
            <Movie movie={item} />
          </List.Item>
        )
      }}
    />
  )
}

export default MovieList
