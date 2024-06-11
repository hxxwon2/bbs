import moment from "moment";
import React, { useEffect, useState } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { app } from "../../firebaseInit";
import {
  addDoc,
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  where,
  query,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

const Comments = () => {
  const email = sessionStorage.getItem("email");
  const { id } = useParams();
  const db = getFirestore(app);

  const [contents, setContents] = useState("");
  const [comments, setComments] = useState([]);

  const callAPI = () => {
    const q = query(
      collection(db, "comments"),
      where("pid", "==", id),
      orderBy("date", "desc")
    );

    onSnapshot(q, (snapshot) => {
      let rows = [];
      snapshot.forEach((row) => {
        rows.push({ id: row.id, ...row.data() });
      });
      const data = rows.map(
        (row) =>
          row && { ...row, ellip: true, isEdit: false, text: row.contents }
      );
      setComments(data);
    });
  };

  // 미로그인 상태로 댓글 등록
  const onClickInsert = () => {
    sessionStorage.setItem("target", `/bbs/read/${id}`);
    window.location.href = "/login";
  };

  // 댓글 등록
  const onInsert = async () => {
    if (contents === "") {
      alert("댓글 내용을 입력하세요!");
      return;
    }

    const data = {
      pid: id,
      email,
      contents,
      date: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
    };

    await addDoc(collection(db, `/comments`), data);
    alert("댓글 등록이 완료되었습니다!");
    setContents("");
  };

  // ellipsis(토글) 적용
  const onClickContents = (id) => {
    const data = comments.map((com) =>
      com.id === id ? { ...com, ellip: !com.ellip } : com
    );
    setComments(data);
  };

  // 댓글 삭제
  const onClickDelete = async (id) => {
    if (!window.confirm(`${id}번 댓글을 삭제하시겠습니까?`)) return;
    await deleteDoc(doc(db, `/comments/${id}`));
    alert("댓글이 삭제되었습니다.");
  };

  // 댓글 수정
  const onClickUpdate = (id) => {
    const data = comments.map((com) =>
      com.id === id ? { ...com, isEdit: true } : com
    );
    setComments(data);
  };

  const onChangeContents = (e, id) => {
    const data = comments.map((com) =>
      com.id === id ? { ...com, contents: e.target.value } : com
    );
    setComments(data);
  };

  // 댓글 수정 취소
  const onClickCancel = (comment) => {
    if (comment.contents !== comment.text) {
      if (window.confirm("수정을 취소하시겠습니까?")) {
        const data = comments.map((com) =>
          com.id === comment.id
            ? { ...com, isEdit: false, contents: com.text }
            : com
        );
        setComments(data);
      }
    } else {
      const data = comments.map((com) =>
        com.id === comment.id ? { ...com, isEdit: false } : com
      );
      setComments(data);
    }
  };

  // 댓글 수정 저장
  const onClickSave = async (com) => {
    if (com.text !== com.contents) {
      if (!window.confirm("변경된 내용을 저장하시겠습니까?")) return;
      await updateDoc(doc(db, `/comments/${com.id}`), com);
      alert("댓글 수정이 완료되었습니다!");
    }
    callAPI();
  };

  useEffect(() => {
    callAPI();
  }, []);

  return (
    <div className="my-5">
      {!email ? (
        <div className="text-end">
          <Button onClick={onClickInsert}>댓글 등록</Button>
        </div>
      ) : (
        <div>
          <Form.Control
            as="textarea"
            rows={5}
            value={contents}
            onChange={(e) => setContents(e.target.value)}
            placeholder="댓글 내용을 입력하세요."
          />
          <div className="text-end mt-2">
            <Button className="px-5" onClick={onInsert}>
              등록
            </Button>
          </div>
        </div>
      )}
      <div className="my-5">
        {comments.map((com) => (
          <div key={com.id}>
            <Row>
              <Col className="text-muted">
                <span className="me-2">{com.email}</span>
                <span>{com.date}</span>
              </Col>
              {email === com.email && !com.isEdit && (
                <Col className="text-end">
                  <Button
                    size="sm"
                    className="me-2"
                    onClick={() => onClickUpdate(com.id)}
                  >
                    수정
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => onClickDelete(com.id)}
                  >
                    삭제
                  </Button>
                </Col>
              )}
              {email === com.email && com.isEdit && (
                <Col className="text-end">
                  <Button
                    size="sm"
                    className="me-2"
                    onClick={() => onClickSave(com)}
                  >
                    저장
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => onClickCancel(com)}
                  >
                    취소
                  </Button>
                </Col>
              )}
            </Row>
            {com.isEdit ? (
              <Form.Control
                onChange={(e) => onChangeContents(e, com.id)}
                value={com.contents}
                as="textarea"
                rows={5}
              />
            ) : (
              <div
                style={{ whiteSpace: "pre-wrap", cursor: "pointer" }}
                className={com.ellip && "ellipsis"}
                onClick={() => onClickContents(com.id)}
              >
                {com.contents}
              </div>
            )}
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;