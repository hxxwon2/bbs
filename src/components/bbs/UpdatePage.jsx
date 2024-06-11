import React, { useEffect, useState } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { app } from "../../firebaseInit";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";

const UpdatePage = () => {
  const db = getFirestore(app);
  const { id } = useParams();

  const [form, setForm] = useState({
    contents: "",
    title: "",
    email: "",
    date: "",
  });
  const { contents, title } = form;

  const callAPI = async () => {
    const res = await getDoc(doc(db, `posts/${id}`));
    console.log(res.data());
    setForm(res.data());
  };

  const onChangeForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 게시글 수정
  const onClickUpdate = async () => {
    if (!window.confirm(`${id}번 게시글을 수정하시겠습니까?`)) return;
    await updateDoc(doc(db, `/posts/${id}`), form);
    window.location.href = `/bbs/read/${id}`;
  };

  useEffect(() => {
    callAPI();
  }, []);

  return (
    <Row className="my-5 justify-content-center">
      <Col xs={12} md={10} lg={8}>
        <h1>게시글 수정</h1>

        <div className="mt-5">
          <Form.Control
            name="title"
            value={title}
            onChange={onChangeForm}
            placeholder="제목을 입력하세요."
            className="mb-2"
          ></Form.Control>
          <Form.Control
            as="textarea"
            name="contents"
            value={contents}
            onChange={onChangeForm}
            rows={10}
            placeholder="내용을 입력하세요."
          ></Form.Control>

          <div className="text-center mt-3">
            <Button className="px-5 me-2" onClick={onClickUpdate}>
              수정
            </Button>
            <Button variant="secondary" className="px-5">
              취소
            </Button>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default UpdatePage;