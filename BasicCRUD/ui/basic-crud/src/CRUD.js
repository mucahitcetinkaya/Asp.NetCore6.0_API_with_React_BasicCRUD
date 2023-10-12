import React, { Fragment, useEffect, useState } from 'react'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CRUD = () => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [isActive, setIsActive] = useState(0);

    // eslint-disable-next-line no-unused-vars
    const [editId, setEditId] = useState('');
    const [editName, setEditName] = useState('');
    const [editAge, setEditAge] = useState('');
    const [editIsActive, setEditIsActive] = useState(0);

    // eslint-disable-next-line no-unused-vars
    const empdata = [
        {
            id: 1,
            name: "Mücahit Çetinkaya",
            age: 29,
            isActive: 1
        },
        {
            id: 2,
            name: "Zayn Aslan",
            age: 28,
            isActive: 1
        },
        {
            id: 3,
            name: "Zeyn Safir",
            age: 28,
            isActive: 1
        },
    ]

    const [data, setData] = useState([]);


    /*
    burası setData(empdata idi burdan alıyordu verileri sonra getData yapıp api ile bagladık)

    useEffect(() => {
        setData(empdata);
    }, [])
    */

    useEffect(() => {
        getData();
    }, [])

    const getData = () => {
        axios.get(`https://localhost:7172/api/Employee`)
            .then((result) => {
                setData(result.data)
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const handleEdit = (id) => {
        handleShow();
        axios.get(`https://localhost:7172/api/Employee/${id}`)
            .then((result) => {
                setEditName(result.data.name);
                setEditAge(result.data.age);
                setEditIsActive(result.data.isActive);
                setEditId(id);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const handleDelete = (id) => {
        // eslint-disable-next-line eqeqeq
        if (window.confirm("Are you sure to delete this employee") == true) {
            axios.delete(`https://localhost:7172/api/Employee/${id}`)
                .then((result) => {
                    if (result.status === 200) {
                        toast.success("Employee has been deleted");
                        getData()
                    }
                })
                .catch((error) => {
                    toast.error(error);
                })
        }
    }

    const handleUpdate = () => {
        const url = `https://localhost:7172/api/Employee/${editId}`;
        const data = {
            "id": editId,
            "name": editName,
            "age": editAge,
            "isActive": editIsActive
        }
        axios.put(url, data)
            .then((result) => {
                handleClose();
                getData();
                clear();
                toast.success("Employee has been updated");
            }).catch((error) => {
                toast.error(error);
            })
    }

    const handleSave = () => {
        const url = `https://localhost:7172/api/Employee`;
        const data = {
            "name": name,
            "age": age,
            "isActive": isActive
        }
        axios.post(url, data)
            .then((result) => {
                getData();
                clear();
                toast.success("Employee has been added");
            }).catch((error) => {
                toast.error(error);
            })
    }

    const clear = () => {
        setName('');
        setAge('');
        setIsActive(0);
        setEditName('');
        setEditAge('');
        setEditIsActive(0);
        setEditId('');

    }


    const handleActiveChange = (e) => {
        if (e.target.checked) {
            setIsActive(1);
        }
        else {
            setIsActive(0);
        }
    }

    const handleEditActiveChange = (e) => {
        if (e.target.checked) {
            setEditIsActive(1);
        }
        else {
            setEditIsActive(0);
        }
    }

    const customToastOptions = {
        position: "bottom-left", // Toast mesajlarının görüneceği konum (örneğin, "top-left", "top-center", "top-right", "bottom-left", vb. seçenekler mevcut)
        autoClose: 5000, // Toast mesajının otomatik olarak kapanma süresi (milisaniye cinsinden)
        hideProgressBar: false, // İlerleme çubuğunun görünürlüğünü kontrol eder
        pauseOnHover: true, // Fare üzerine gelindiğinde toast mesajının zamanının durmasını sağlar
        draggable: true, // Toast mesajları sürüklenip taşınabilir
    };

    return (
        <>
            <Fragment>
                <ToastContainer position={customToastOptions.position} />
                <Container>
                    <Row>
                        <Col>
                            <input type='text' className='form-control' placeholder='Enter Name' value={name} onChange={(e) => setName(e.target.value)} />
                        </Col>
                        <Col>
                            <input type='text' className='form-control' placeholder='Enter Age' value={age} onChange={(e) => setAge(e.target.value)} />
                        </Col>
                        <Col>
                            <input type='checkbox' checked={isActive === 1 ? true : false} onChange={(e) => handleActiveChange(e)} value={isActive} /> &nbsp;
                            <label>isActive</label>
                        </Col>
                        <Col>
                            <button className='btn btn-primary' onClick={() => handleSave()}>Submit</button>
                        </Col>
                    </Row>
                </Container>
                <br></br>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Age</th>
                            <th>isActive</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data && data.length > 0 ?
                                data.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{item.name}</td>
                                            <td>{item.age}</td>
                                            <td>{item.isActive}</td>
                                            <td colSpan={2}>
                                                <button className='btn btn-primary' onClick={() => handleEdit(item.id)}>Edit</button> &nbsp;
                                                <button className='btn btn-danger' onClick={() => handleDelete(item.id)}>Delete</button>
                                            </td>
                                        </tr>
                                    )
                                })
                                :
                                "Loading..."
                        }

                    </tbody>
                </Table>

                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Modify | Employee</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col>
                                <input type='text' className='form-control' placeholder='Enter Name' value={editName} onChange={(e) => setEditName(e.target.value)} />
                            </Col>
                            <Col>
                                <input type='text' className='form-control' placeholder='Enter Age' value={editAge} onChange={(e) => setEditAge(e.target.value)} />
                            </Col>
                            <Col>
                                <input type='checkbox' checked={editIsActive === 1 ? true : false} onChange={(e) => handleEditActiveChange(e)} value={editIsActive} /> &nbsp;
                                <label>isActive</label>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleUpdate}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>

            </Fragment>
        </>
    )
}

export default CRUD;