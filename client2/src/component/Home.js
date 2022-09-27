import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const auth = JSON.parse(localStorage.getItem('user'));
  const useridAdd = auth.userid;
  const userName = auth.username;

  const [elementName, setElemetName] = useState("");
  const [elementlistState, setElementsList] = useState([]);
  const [chemlist, setChemList] = useState([]);

  const [elementnumAdd, setElementnumAdd] = useState("");
  const [elementnameAdd, setElementnameAdd] = useState("");
  const [casAdd, setCasAdd] = useState("");
  const [formulaAdd, setFormulaAdd] = useState("");
  const [unitsAdd, setUnitsAdd] = useState("");
  const [typeAdd, setTypeAdd] = useState("");
  const [qtyAdd, setQtyAdd] = useState("");

  const [addidUpd, setAddIdUpd] = useState("");
  const [commentDel, setCommentDel] = useState("");

  const [chemdellist, setChemdellist] = useState([]);
  const [idDel, setIdDel] = useState("");

  const [errorAdd, setErrorAdd] = useState(false);
  const [errorDel, setErrorDel] = useState(false);

  useEffect(() => {
    GetAllElements();
    getElementsDeleteList();
  }, [])


  const GetChemElement = async e => {
    e.preventDefault();
    try {
      const res1 = await fetch(`http://localhost:5000/keemia/get/chemelement`, {
        headers: {
          authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`
        }
        });
      setChemList(await res1.json());
    } catch (err) {
      console.error(err.message);
    }
  };

  // Функция выводит список химических элементов по их названию
  const SearchElementbyName = async e => {
    e.preventDefault();
    try {
      const res1 = await fetch(`http://localhost:5000/keemia/get/element/${elementName}`,{
        headers: {
          authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`
        }
      });
      setElementsList(await res1.json());
    } catch (err) {
      console.error(err.message);
    }
  };

  // Функция выводит список всех элементов
  const GetAllElements = async () => {
    try {
      const res2 = await fetch(`http://localhost:5000/keemia/get/all/elements`, {
        headers: {
          authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`
        }
      });
      setElementsList(await res2.json());
    } catch (err) {
      console.error(err.message);
    }
  };

  // Функция позволяет добавить новый хим. элемент в базу данных
  const AddNewElement = e => {
    e.preventDefault();
    try {
      const body = { elementnumAdd, elementnameAdd, casAdd, formulaAdd, unitsAdd, typeAdd, qtyAdd, useridAdd };

      if (elementnumAdd.length === 0 || elementnameAdd.length === 0 || casAdd.length === 0 || formulaAdd.length === 0 || typeAdd.length === 0 || unitsAdd.length === 0 || qtyAdd.length === 0) {
        setErrorAdd(true);
        return (false)
      }
      else if (isNaN(qtyAdd) && isNaN(elementnumAdd)) {
        setErrorAdd(true);
        return (false)
      }
      else if (isNaN(qtyAdd)) {
        setErrorAdd(true);
        return (false)
      }
      else if (isNaN(elementnumAdd)) {
        setErrorAdd(true);
        return (false)
      }

      fetch(`http://localhost:5000/keemia/add/element`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`
        },
        body: JSON.stringify(body)
      });
      window.location = "/home";
    } catch (err) {
      console.error(err.message);
    }
  };

  // Функция удаляет хим. элемент из общей таблицы путем изменения его статуса и помещения его в таблицу удаленных хим. элементов
  const AddElementToSpendTable = e => {
    e.preventDefault();
    try {
      const body = { addidUpd };
      const body2 = { commentDel, addidUpd };
      if (commentDel.length === 0) {
        setErrorDel(true);
        return (false)
      }
      fetch(`http://localhost:5000/keemia/update/element/status/${addidUpd}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`
          },
          body: JSON.stringify(body)
        }
      );

      fetch(`http://localhost:5000/keemia/add/elements/spendtable`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`
        },
        body: JSON.stringify(body2)
      });
      window.location = "/home";

    } catch (err) {
      console.error(err.message);
    }
  };

  // Функция выводит список всех удаленных элементов 
  const getElementsDeleteList = async () => {
    try {
      const res4 = await fetch(`http://localhost:5000/keemia/get/deleted/elements`, {
        headers: {
          authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`
        }
      });
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
        method: "DELETE",
        headers: {
          authorization: `bearer ${JSON.parse(localStorage.getItem("token"))}`
        }
      });
      window.location = '/home';
    } catch (err) {
      console.error(err.message);
    }
  };

  const Logout = () => {
    localStorage.clear();
    navigate('/');
  };

  // Тут реализуется вся дальнейшая логика сайта
  return (
    <Fragment>
      <div className="container p-5 my-5">
        <div className="row">
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
            <div className="container-fluid">
              <a className="navbar-brand">Chemical element</a>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarColor01">
                <p className="my-2 me-auto"></p>
                <form>
                  <button className="btn btn-secondary me-1 shadow" onClick={Logout}>Logout ({userName})</button>
                </form>
              </div>
            </div>
          </nav>

          <ul className="nav nav-tabs">
            <li className="nav-item">
              <a className="nav-link active" data-bs-toggle="tab" href="#home">Table with chemical elements</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" data-bs-toggle="tab" href="#delete">Table with removed chemical elements</a>
            </li>
          </ul>
          <div className="tab-content">
            <div className="tab-pane fade show active" id="home">
              <h3 className="my-2 text-center">Search chemical element by name</h3>

              <div className="input-group my-2">
                <input type="text" name="name" list="exampleList" placeholder="Enter chemical element name..." className="form-control me-1 shadow" onClick={GetChemElement} onChange={e => setElemetName(e.target.value)} />
                <button className="btn btn-success me-1 shadow btn-sm" onClick={SearchElementbyName}>Search</button>
              </div>

              <select className="form-select form-select-sm" onClick={GetChemElement} onChange={e => setElemetName(e.target.value)}>
                <option selected>Choose...</option>
                {chemlist.map(value => (
                  <option value={value.name} onClick={e => setElemetName(e.target.value)}>{value.name}</option>
                ))}
              </select>

              <div className="my-2 d-flex">
                {/* <button className="btn btn-primary me-1 shadow btn-sm" onClick={GetAllElements}>View all elements</button> */}
                <button className="btn btn-primary me-1 shadow btn-sm" data-bs-toggle="modal" data-bs-target="#addmodal">Add new chemical element</button>
              </div>

              <table className="table table-hover shadow text-center">
                <thead>
                  <tr className="table-dark">
                    <th scope="col">№</th>
                    <th scope="col">Chemical Element</th>
                    <th scope="col">Formula</th>
                    <th scope="col">Type</th>
                    <th scope="col">Qty</th>
                    <th scope="col">CAS</th>
                    <th scope="col">Date add</th>
                    <th scope="col">User</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {elementlistState.map(value => (
                    <tr className="table-active">
                      <td>{value.elementnumber}</td>
                      <td>{value.name}</td>
                      <td>{value.formula}</td>
                      <td>{value.type}</td>
                      <td>{value.qty} {value.units}</td>
                      <td><a href={value.cas} className="btn btn-success btn-sm" target="_blank">CAS info</a></td>
                      <td>{value.dateadd}</td>
                      <td>{value.username}</td>
                      <td>
                        <button className="btn btn-danger shadow btn-sm" data-bs-toggle="modal" data-bs-target="#del" value={value.addid} onClick={e => setAddIdUpd(e.target.value)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="tab-pane fade" id="delete">
              <h3 className="my-2 text-center">Deleted elements</h3>
              {/* <div className="my-2 d-flex">
                <button className="btn btn-danger me-1 shadow btn-sm" onClick={getElementsDeleteList}>View all deleted elements</button>
              </div> */}
              <table className="table table-hover shadow my-2 text-center">
                <thead>
                  <tr className="table-danger">
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
                    <tr className="table-active">
                      <td>{value.elementnumber}</td>
                      <td>{value.name}</td>
                      <td>{value.datedelete}</td>
                      <td>{value.elementcomment}</td>
                      <td>{value.username}</td>
                      <td><button type="button" className="btn btn-warning disabled btn-sm">Used</button></td>
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

          <div className="modal" id="addmodal">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h2 className="modal-title">Add new chemical element</h2>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true"></span>
                  </button>
                </div>
                <div className="modal-body">
                  <form onSubmit={AddNewElement}>
                    <div className="col-md-12">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="form-label mt-2"><strong>Enter element number: </strong></label>
                            <input name="num" placeholder="Number..." className="form-control my-1" value={elementnumAdd} onChange={e => setElementnumAdd(e.target.value)} />
                            {errorAdd && !elementnumAdd && <small className="text-danger">Enter valid element number</small>}
                            {errorAdd && isNaN(elementnumAdd) && <small className="text-danger">Is not number</small>}
                          </div>

                          <div className="form-group">
                            <label className="form-label mt-2"><strong>Enter element name: </strong></label>
                            <input name="element" placeholder="Name..." className="form-control my-1" value={elementnameAdd} onChange={e => setElementnameAdd(e.target.value)} />
                            {errorAdd && !elementnameAdd && <small className="text-danger">Enter valid element name</small>}
                          </div>

                          <div className="form-group">
                            <label className="form-label mt-2"><strong>Enter cas link: </strong></label>
                            <input name="cas" placeholder="Cas link..." className="form-control my-1" value={casAdd} onChange={e => setCasAdd(e.target.value)} />
                            {errorAdd && !casAdd && <small className="text-danger">Enter valid cas link</small>}
                          </div>

                          <div className="form-group">
                            <label className="form-label mt-2"><strong>Enter element formula: </strong></label>
                            <input name="formula" placeholder="Element formula..." className="form-control my-1" value={formulaAdd} onChange={e => setFormulaAdd(e.target.value)} />
                            {errorAdd && !formulaAdd && <small className="text-danger">Enter valid element formula</small>}
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="form-label mt-2"><strong>Enter qty: </strong></label>
                            <input name="qty" placeholder="Qty..." className="form-control my-1" value={qtyAdd} onChange={e => setQtyAdd(e.target.value)} />
                            {errorAdd && !qtyAdd && <small className="text-danger">Enter valid qty</small>}
                            {errorAdd && isNaN(qtyAdd) && <small className="text-danger">Is not number</small>}
                          </div>

                          <div className="form-group">
                            <label className="form-label mt-2"><strong>Select units: </strong></label>

                            <select className="form-select my-1" value={unitsAdd} onChange={e => setUnitsAdd(e.target.value)}>
                              <option selected>Choose...</option>
                              <option value="g">g</option>
                              <option value="kg">kg</option>
                              <option value="t">t</option>
                              <option value="ml">ml</option>
                              <option value="dl">dl</option>
                              <option value="l">l</option>
                              <option value="tk">tk</option>
                            </select>
                            {errorAdd && !unitsAdd && <small className="text-danger">Choose valid units</small>}
                          </div>

                          <div className="form-group">
                            <label className="form-label mt-2"><strong>Select type: </strong></label>

                            <select className="form-select my-1" value={typeAdd} onChange={e => setTypeAdd(e.target.value)}>
                              <option selected>Choose...</option>
                              <option value="organic">organic</option>
                              <option value="inorganic">inorganic</option>
                            </select>
                            {errorAdd && !typeAdd && <small className="text-danger">Choose valid type</small>}
                          </div>
                        </div>
                      </div>
                    </div>
                    <button className="btn btn-primary mt-2 shadow">Add new element</button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div className="modal" id="del">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h2 className="modal-title">Delete chemical element</h2>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true"></span>
                  </button>
                </div>
                <div className="modal-body">
                  <form onSubmit={AddElementToSpendTable}>
                    <div className="form-group">
                      <label className="form-label mt-2"><strong>Describe the reason for removing a chemical element: </strong></label>
                      <textarea className="form-control my-1" placeholder="Comment..." value={commentDel} onChange={e => setCommentDel(e.target.value)}></textarea>
                      {errorDel && !commentDel && <small className="text-danger">Enter comment</small>}
                    </div>

                    <button className="btn btn-danger my-2 shadow">Delete element</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment >
  );
};

export default Home;