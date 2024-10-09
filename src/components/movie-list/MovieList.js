/* eslint no-unused-vars: 0 */
/* eslint react/no-unused-state: 0 */
import { Component } from 'react'
import { Card, List } from 'antd'

import Movie from '../movie/Movie'

export default class MovieList extends Component {
  state = {
    totalPages: null,
  }

  render() {
    const { movies, totalResults, isLoading, onMoviesUpdate, currentPage, searchQuery } = this.props
    // console.log(totalPages)

    return (
      <List
        grid={{
          gutter: 16,
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
              <Movie movie={item} />
            </List.Item>
          )
        }}
      />
    )
  }
}
