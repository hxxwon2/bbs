import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Row, Col, Card, InputGroup, Form, Button } from 'react-bootstrap'
import { FaCartPlus } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { app } from '../../firebaseInit'
import { getDatabase, ref, set, get } from 'firebase/database'

const Books = () => {
  const db = getDatabase(app);
  const navi = useNavigate();
  const uid = sessionStorage.getItem('uid');
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('리액트');
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState([]);
  const callAPI = async () => {
    setLoading(true);
    const url = `https://dapi.kakao.com/v3/search/book?target=title&query=${query}&size=12&page=${page}`;
    const config = { headers: { "Authorization": "KakaoAK 52d7f58041770d9379624d31e28ea377" } };
    const res = await axios.get(url, config);
    setBooks(res.data.documents);
    setLoading(false);
  }

  useEffect(() => {
    callAPI();
  }, [page]);

  const onSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    callAPI();
  }

  const onClickCart = (book) => {
    if (uid) {
      //장바구니에 도서 넣기
      if (window.confirm(`${book.title}\n도서를 장바구니에 넣으실래요?`)) {
        //장바구니체크
        get(ref(db, `cart/${uid}/${book.isbn}`)).then(snapshot => {
          if (snapshot.exists()) {
            alert("이미 장바구니있습니다!");
          } else {
            set(ref(db, `cart/${uid}/${book.isbn}`), { ...book });
            alert("성공!");
          }
        });
      }
    } else {
      sessionStorage.setItem('target', '/books');
      navi('/login');
    }
  }

  if (loading) return <h1 className='my-5'>로딩중입니다</h1>
  return (
    <div>
      <h1 className='my-5'>도서검색</h1>

      <Row className='mb-2'>
        <Col xs={8} md={6} lg={4}>
          <Form onSubmit={onSubmit}>
            <InputGroup>
              <Form.Control onChange={(e) => setQuery(e.target.value)} placeholder='검색어' value={query} />
              <Button type="submit">검색</Button>
            </InputGroup>
          </Form>
        </Col>
      </Row>

      <Row>
        {books.map(book =>
          <Col key={book.isbn} lg={2} xs={6} md={3} className='mb-2'>
            <Card>
              <Card.Body className='d-flex justify-content-center'>
                <img src={book.thumbnail || 'http://via.placeholder.com/120x170'} />
              </Card.Body>
              <Card.Footer>
                <div className='ellipsis'>{book.title}</div>
                <FaCartPlus onClick={() => onClickCart(book)}
                  style={{ cursor: 'pointer', fontSize: '20px', color: 'green' }} />
              </Card.Footer>
            </Card>
          </Col>

        )}
      </Row>

      <div className="text-center my-3">
        <Button onClick={() => setPage(page - 1)} disabled={page === 1} variant='success'>이전</Button>
        <span className='mx-3'>{page}</span>
        <Button onClick={() => setPage(page + 1)}>다음</Button>
      </div>

    </div>
  )
}

export default Books