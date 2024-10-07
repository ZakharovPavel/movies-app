/* eslint no-unused-vars: 0 */
/* eslint react/jsx-boolean-value: 1 */
import { LeftCircleTwoTone } from '@ant-design/icons'
import { Card, Flex, Typography, Tag, Space, ConfigProvider } from 'antd'
import Title from 'antd/es/typography/Title'
import { useState } from 'react'
import { Header } from 'antd/es/layout/layout'
import Paragraph from 'antd/es/typography/Paragraph'
import { parseISO, format } from 'date-fns'
import { ru } from 'date-fns/locale'

import './Movie.css'

function Movie({ movie }) {
  const { Text } = Typography
  const { posterPath, title, releaseDate, overview } = movie

  return (
    <Flex gap={0} horizontal="true" style={{ width: 450 }}>
      <img
        src={
          movie.posterPath
            ? `https://image.tmdb.org/t/p/w500${posterPath}`
            : 'https://cdn-jpojb.nitrocdn.com/jAlWQzkyuTYqWNBrkljClYXTYVQpJDRw/assets/images/optimized/rev-bfc9be9/hollywoodscriptshop.com/wp-content/uploads/woocommerce-placeholder.png'
        }
        alt="cool movie"
        style={{ width: 180, height: 280, paddingLeft: 0 }}
      />
      <Card
        className="movie-card"
        style={{
          width: 270,
          height: 280,
          borderRadius: 0,
        }}
        styles={{ body: { padding: 0 } }}
      >
        <Flex
          vertical
          style={{
            width: '100%',
            height: '100%',
            paddingTop: 10,
            paddingRight: 20,
            paddingBottom: 10,
            paddingLeft: 20,
          }}
        >
          <Title level={4} style={{ margin: 0, fontSize: 20, paddingLeft: 0 }}>
            {title}
          </Title>
          <Text type="secondary">{releaseDate && format(new Date(releaseDate), 'MMMM d, y')}</Text>
          <Flex>
            {/* {movie.genre.map((el) => {
              return <Tag>{el}</Tag>
            })} */}
            <Tag>Action</Tag>
            <Tag>Drama</Tag>
          </Flex>
          <Typography.Paragraph ellipsis={{ rows: 6 }} style={{ width: 230 }}>
            {overview}
          </Typography.Paragraph>
        </Flex>
      </Card>
    </Flex>
  )
}

export default Movie
