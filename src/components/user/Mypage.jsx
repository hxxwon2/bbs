import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Form, Button, InputGroup } from 'react-bootstrap'
import { app } from '../../firebaseInit'
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore'
import ModalAddress from './ModalAddress'
import ModalPhoto from './ModalPhoto'

const Mypage = () => {
    
    const uid=sessionStorage.getItem('uid');
    const db=getFirestore(app);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        email: sessionStorage.getItem("email"),
        name: '신짱구',
        phone: '010-1234-1234',
        address1:'인천 서구 청라동',
        address2:'떡잎마을 123-1',
    });

    const {name, phone, address1, address2} = form;

    const onChangeForm = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
    }

    const onSubmit = async(e) => {
        e.preventDefault();
        if(name === ''){
            alert("이름을 입력하세요!");
            return;
        }

        if(!window.confirm("변경된 내용을 저장하겠습니까?")) return;
        setLoading(true);
        await setDoc(doc(db, `users/${uid}`), form);
        setLoading(false);
    };

    const callAPI = async () => {
        setLoading(true);
        const res = await getDoc(doc(db, `users/${uid}`));
        if (res.data()) {
          setForm(res.data());
        }
        setLoading(false);
      };

      useEffect(() => {
        callAPI();
    }, []);

    if(loading) return <h1 className='my-5'>로딩중입니다......</h1>
    return (
        <div>
        <Row className='justify-content-center my-5'>
            <Col xs={12} md={10} lg={8}>
                <Card>
                    <Card.Header>
                        <h3 className='text-center'>마이페이지</h3>
                    </Card.Header>
                    <Card.Body>
                        <div className='text-center'>
                            <ModalPhoto form={form} setLoading={setLoading} setForm={setForm} />
                        
                        </div>
                        <form onSubmit={onSubmit}>
                            <InputGroup className='mb-3'>
                                <InputGroup.Text>이름</InputGroup.Text>
                                <Form.Control name="name" value={name} onChange={onChangeForm}/>
                            </InputGroup>
                            <InputGroup className='mb-3'>
                                <InputGroup.Text>전화번호</InputGroup.Text>
                                <Form.Control name="phone" value={phone} onChange={onChangeForm}/>
                            </InputGroup>
                            <InputGroup className='mb-2'>
                                <InputGroup.Text>주소</InputGroup.Text>
                                <Form.Control name="address1" value={address1} onChange={onChangeForm}/>
                                <ModalAddress form={form} setForm={setForm}/>
                            </InputGroup>
                            <InputGroup.Text>상세주소</InputGroup.Text>
                                <Form.Control name="address2" value={address2} onChange={onChangeForm}/>
                            <div className='text-center mt-3'>
                                <Button className='px-5' type="submit">저장</Button>
                                <Button className='ms-2 px-5' variant='"danger'>취소</Button>
                            </div>
                        </form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
        </div>
    );
}

export default Mypage