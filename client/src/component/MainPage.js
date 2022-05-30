import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
    const navigate = useNavigate();

    const [elementName, setElemetName] = useState("");
    const [elementlistState, setElementsList] = useState([]);

    const [elementnumAdd, setElementnumAdd] = useState("");
    const [elementnameAdd, setElementnameAdd] = useState("");
    const [casAdd, setCasAdd] = useState("");
    const [formulaAdd, setFormulaAdd] = useState("");
    const [unitsAdd, setUnitsAdd] = useState("");
    const [typeAdd, setTypeAdd] = useState("");
    const [qtyAdd, setQtyAdd] = useState("");
    const [usernameAdd, setUsernameAdd] = useState("");

    const [addidUpd, setAddIdUpd] = useState("");
    const [commentDel, setCommentDel] = useState("");
    const [usernameDel, setUsernameDel] = useState("");

    const [chemdellist, setChemdellist] = useState([]);
    const [idDel, setIdDel] = useState("");

    const [addalert, setAddAlert] = useState(false);
    const [addsuccess, setAddSuccess] = useState(false);

    const [deletealert, setDeleteAlert] = useState(false);
    const [deletesuccess, setDeleteSuccess] = useState(false);


    // Функция выводит список химических элементов по их названию
    const SearchElementbyName = async e => {
        e.preventDefault();
        try {
            const res1 = await fetch(`http://localhost:5000/keemia/get/element/${elementName}`);
            setElementsList(await res1.json());
        } catch (err) {
            console.error(err.message);
        }
    };

    // Функция выводит список всех элементов
    const GetAllElements = async e => {
        e.preventDefault();
        try {
            const res2 = await fetch(`http://localhost:5000/keemia/get/all/elements`);
            setElementsList(await res2.json());
        } catch (err) {
            console.error(err.message);
        }
    };

    // Функция позволяет добавить новый хим. элемент в базу данных
    const AddNewElement = e => {
        e.preventDefault();
        try {
            const body = { elementnumAdd, elementnameAdd, casAdd, formulaAdd, unitsAdd, typeAdd, qtyAdd, usernameAdd };
            if (elementnumAdd.length === 0 || elementnameAdd.length === 0 || casAdd.length === 0 || formulaAdd.length === 0 || typeAdd.length === 0 || unitsAdd.length === 0 || qtyAdd.length === 0 || usernameAdd.length === 0) {
                setAddAlert(true);
                setAddSuccess(false);
            }
            else {
                fetch(`http://localhost:5000/keemia/add/element`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                });
                window.location = "/mainpage";
                setAddAlert(false);
                setAddSuccess(true);
            }
        } catch (err) {
            console.error(err.message);
        }
    };

    // Функция удаляет хим. элемент из общей таблицы путем изменения его статуса и помещения его в таблицу удаленных хим. элементов
    const AddElementToSpendTable = e => {
        e.preventDefault();
        try {
            const body = { addidUpd };
            const body2 = { commentDel, usernameDel, addidUpd };
            if (commentDel.length === 0 && usernameDel.length === 0) {
                setDeleteAlert(true);
                setDeleteSuccess(false);
            } else {
                fetch(`http://localhost:5000/keemia/update/element/status/${addidUpd}`,
                    {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(body)
                    }
                );

                fetch(`http://localhost:5000/keemia/add/elements/spendtable`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body2)
                });
                window.location = "/mainpage";
                setDeleteAlert(false);
                setDeleteSuccess(true);
            }
        } catch (err) {
            console.error(err.message);
        }
    };

    // Функция выводит список всех удаленных элементов 
    const getElementsDeleteList = async e => {
        e.preventDefault();
        try {
            const res4 = await fetch(`http://localhost:5000/keemia/get/deleted/elements`);
            setChemdellist(await res4.json());
        } catch (err) {
            console.error(err.message);
        }
    };

    // Функция удаляет на всегда хим. элементы из таблицы удаленных элементов у которых был изменен статус
    const ClearDeletedElementsTable = async e => {
        e.preventDefault();
        try {
            await fetch(`http://localhost:5000/keemia/clear/deleted/elements/table/${idDel}`, {
                method: "DELETE"
            });
            window.location = "/mainpage";
        } catch (err) {
            console.error(err.message);
        }
    };

    // Тут реализуется вся дальнейшая логика сайта
    return (
        <Fragment>
            <div className="container p-5 my-5">
                <div className="row">
                    <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
                        <div class="container-fluid">
                            <a class="navbar-brand">Chemical element</a>
                            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                                <span class="navbar-toggler-icon"></span>
                            </button>
                            <div class="collapse navbar-collapse" id="navbarColor01">
                                <p className="my-2 me-auto"></p>
                                <button className="btn btn-secondary me-1 shadow" onClick={() => navigate("/")}>Exit</button>
                            </div>
                        </div>
                    </nav>

                    <h3 class="my-1">Search chemical element by name</h3>
                    <div class="my-2 d-flex">
                        <input type="text" name="name" placeholder="Enter chemical element name..." class="form-control me-1 shadow" value={elementName} onChange={e => setElemetName(e.target.value)} />
                        <button class="btn btn-success me-1 shadow btn-sm" onClick={SearchElementbyName}>Search</button>
                        <button class="btn btn-primary me-1 shadow btn-sm" onClick={GetAllElements}>View all elements</button>
                        <button class="btn btn-primary me-1 shadow btn-sm" data-bs-toggle="modal" data-bs-target="#addmodal">Add new chemical element</button>
                    </div>
                    <table class="table table-hover shadow text-center">
                        <thead>
                            <tr class="table-dark">
                                <th scope="col">№</th>
                                <th scope="col">Chemical Element</th>
                                <th scope="col">Formula</th>
                                <th scope="col">Type</th>
                                <th scope="col">Qty</th>
                                <th scope="col">Units</th>
                                <th scope="col">CAS</th>
                                <th scope="col">Date add</th>
                                <th scope="col">User</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {elementlistState.map(value => (
                                <tr class="table-active">
                                    <td>{value.elementnumber}</td>
                                    <td>{value.name}</td>
                                    <td>{value.formula}</td>
                                    <td>{value.type}</td>
                                    <td>{value.qty}</td>
                                    <td>{value.units}</td>
                                    <td><a href={value.cas} class="btn btn-success btn-sm" target="_blank">CAS info</a></td>
                                    <td>{value.dateadd}</td>
                                    <td>{value.username}</td>
                                    <td>
                                        <button className="btn btn-danger shadow btn-sm" data-bs-toggle="modal" data-bs-target="#del" value={value.addid} onClick={e => setAddIdUpd(e.target.value)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div class="modal" id="addmodal">
                        <div class="modal-dialog modal-lg">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h2 class="modal-title">Add new chemical element</h2>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true"></span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <form onSubmit={AddNewElement}>
                                        <div class="col-md-12">
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <div class="form-group">
                                                        <label class="form-label mt-2"><strong>Enter element number: </strong></label>
                                                        <small class="text-danger" style={{ display: addalert ? "block" : "none" }}>Check element number!!!</small>
                                                        <input name="num" placeholder="Number..." className="form-control my-1" value={elementnumAdd} onChange={e => setElementnumAdd(e.target.value)} />
                                                    </div>

                                                    <div class="form-group">
                                                        <label class="form-label mt-2"><strong>Enter element name: </strong></label>
                                                        <small class="text-danger" style={{ display: addalert ? "block" : "none" }}>Check element name!!!</small>
                                                        <input name="element" placeholder="Name..." className="form-control my-1" value={elementnameAdd} onChange={e => setElementnameAdd(e.target.value)} />
                                                    </div>

                                                    <div class="form-group">
                                                        <label class="form-label mt-2"><strong>Enter cas link: </strong></label>
                                                        <small class="text-danger" style={{ display: addalert ? "block" : "none" }}>Check cas link!!!</small>
                                                        <input name="cas" placeholder="Cas link..." className="form-control my-1" value={casAdd} onChange={e => setCasAdd(e.target.value)} />
                                                    </div>

                                                    <div class="form-group">
                                                        <label class="form-label mt-2"><strong>Enter element formula: </strong></label>
                                                        <small class="text-danger" style={{ display: addalert ? "block" : "none" }}>Check element formula!!!</small>
                                                        <input name="formula" placeholder="Element formula..." className="form-control my-1" value={formulaAdd} onChange={e => setFormulaAdd(e.target.value)} />
                                                    </div>
                                                </div>

                                                <div class="col-md-6">
                                                    <div class="form-group">
                                                        <label class="form-label mt-2"><strong>Enter qty: </strong></label>
                                                        <small class="text-danger" style={{ display: addalert ? "block" : "none" }}>Check qty!!!</small>
                                                        <input name="qty" placeholder="Qty..." className="form-control my-1" value={qtyAdd} onChange={e => setQtyAdd(e.target.value)} />
                                                    </div>

                                                    <div class="form-group">
                                                        <label class="form-label mt-2"><strong>Select units: </strong></label>
                                                        <small class="text-danger" style={{ display: addalert ? "block" : "none" }}>Check units!!!</small>
                                                        <select class="form-select my-1" value={unitsAdd} onChange={e => setUnitsAdd(e.target.value)}>
                                                            <option selected>Choose...</option>
                                                            <option value="g">g</option>
                                                            <option value="kg">kg</option>
                                                            <option value="t">t</option>
                                                            <option value="ml">ml</option>
                                                            <option value="l">l</option>
                                                        </select>
                                                        <input name="units" placeholder="Or add your units..." className="form-control my-1" value={unitsAdd} onChange={e => setUnitsAdd(e.target.value)} />
                                                    </div>

                                                    <div class="form-group">
                                                        <label class="form-label mt-2"><strong>Select type: </strong></label>
                                                        <small class="text-danger" style={{ display: addalert ? "block" : "none" }}>Check type!!!</small>
                                                        <select class="form-select my-1" value={typeAdd} onChange={e => setTypeAdd(e.target.value)}>
                                                            <option selected>Choose...</option>
                                                            <option value="organic">organic</option>
                                                            <option value="inorganic">inorganic</option>
                                                        </select>
                                                        <input name="ензу" placeholder="Or add your type..." className="form-control my-1" value={typeAdd} onChange={e => setTypeAdd(e.target.value)} />
                                                    </div>

                                                    <div class="form-group">
                                                        <label class="form-label mt-2"><strong>Enter your username: </strong></label>
                                                        <small class="text-danger" style={{ display: addalert ? "block" : "none" }}>Check username!!!</small>
                                                        <input name="username" placeholder="Username..." className="form-control my-1" value={usernameAdd} onChange={e => setUsernameAdd(e.target.value)} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="alert alert-dismissible alert-danger" style={{ display: addalert ? "block" : "none" }}>
                                            <strong>Error!</strong> Check that the fields are filled.
                                        </div>

                                        <div class="alert alert-dismissible alert-success" style={{ display: addsuccess ? "block" : "none" }}>
                                            <strong>Success!</strong> New chemical element added.
                                        </div>

                                        <button className="btn btn-primary mt-2 shadow">Add new element</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="modal" id="del">
                        <div class="modal-dialog modal-dialog-centered modal-lg">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h2 class="modal-title">Delete chemical element</h2>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true"></span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <form onSubmit={AddElementToSpendTable}>
                                        <div class="form-group">
                                            <label class="form-label mt-2"><strong>Enter comment: </strong></label>
                                            <textarea class="form-control my-1" placeholder="Comment..." value={commentDel} onChange={e => setCommentDel(e.target.value)}></textarea>
                                            <small class="form-text text-muted">Describe the reason for removing a chemical element.</small>
                                        </div>

                                        <div class="form-group">
                                            <label class="form-label mt-2"><strong>Enter your username: </strong></label>
                                            <input name="username" placeholder="Username..." className="form-control my-1" value={usernameDel} onChange={e => setUsernameDel(e.target.value)} />
                                        </div>

                                        <div class="alert alert-dismissible alert-danger" style={{ display: deletealert ? "block" : "none" }}>
                                            <strong>Error!</strong> Check that the fields are filled.
                                        </div>

                                        <div class="alert alert-dismissible alert-success" style={{ display: deletesuccess ? "block" : "none" }}>
                                            <strong>Success!</strong> Chemical element successfully deleted.
                                        </div>

                                        <button className="btn btn-danger my-2 shadow">Delete element</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h3 class="my-1">Deleted elements</h3>
                    <div class="my-2 d-flex">
                        <button class="btn btn-danger me-1 shadow btn-sm" onClick={getElementsDeleteList}>View all deleted elements</button>
                    </div>
                    <table class="table table-hover shadow my-1 text-center">
                        <thead>
                            <tr class="table-danger">
                                <th scope="col">№</th>
                                <th scope="col">Chemical Element</th>
                                <th scope="col">Date delete</th>
                                <th scope="col">Comment</th>
                                <th scope="col">User</th>
                                <th scope="col">Status</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {chemdellist.map(value => (
                                <tr class="table-active">
                                    <td>{value.elementnumber}</td>
                                    <td>{value.name}</td>
                                    <td>{value.datedelete}</td>
                                    <td>{value.elementcomment}</td>
                                    <td>{value.username}</td>
                                    <td><button type="button" class="btn btn-warning disabled btn-sm">Used</button></td>
                                    <td>
                                        <form onSubmit={ClearDeletedElementsTable}>
                                            <button className="btn btn-danger shadow btn-sm" value={value.substanceid} onClick={e => setIdDel(e.target.value)}>Delete</button>
                                        </form>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Fragment >
    );
};

export default MainPage;


