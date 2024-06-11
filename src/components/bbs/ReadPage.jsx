import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { app } from "../../firebaseInit";
import { getFirestore, doc, getDoc, deleteDoc } from "firebase/firestore";
import { Row, Col, Button, Card } from "react-bootstrap";
import Comments from "./Comments";

const ReadPage = () => {
  const navi = useNavigate();
  const { id } = useParams();
  const loginEmail = sessionStorage.getItem("email");
  const db = getFirestore(app);

  const [post, setPost] = useState("");

  const callAPI = async () => {
    const res = await getDoc(doc(db, `posts/${id}`));
    setPost(res.data());
  };

  const { email, date, title, contents } = post;

  // 게시글 삭제
  const onClickDelete = async () => {
    if (!window.confirm(`${id}번 게시글을 삭제하시겠습니까?`)) return;
    await deleteDoc(doc(db, `/posts/${id}`));
    // window.location.href = "/bbs";
    navi("/bbs");
  };

  useEffect(() => {
    callAPI();
  }, []);

  return (
    <Row className="my-5 justify-content-center">
      <Col xs={12} md={10} lg={8}>
        <h1 className="mb-5">게시글 정보</h1>
        {loginEmail === email && (
          <div className="text-end mb-2">
            <Button
              onClick={() => navi(`/bbs/update/${id}`)}
              variant="success"
              size="sm"
              className="me-2"
            >
              수정
            </Button>
            <Button onClick={onClickDelete} variant="danger" size="sm">
              삭제
            </Button>
          </div>
        )}
        <Card>
          <Card.Body>
            <h5>{title}</h5>
            <div className="text-muted">
              <span className="me-3">{date}</span>
              <span>{email}</span>
            </div>
            <hr />
            <div style={{ whiteSpace: "pre-wrap" }}>{contents}</div>
          </Card.Body>
        </Card>
        <Comments />
      </Col>
    </Row>
  );
};

export default ReadPage;