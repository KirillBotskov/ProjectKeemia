import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginInput = () => {

  // Создаются различные хуки от различных библиотек
  // useNavigate() - это хук библиотеки react-router-dom нужен для реализации перехода на новую страницу
  // useState() - это хук нужен для изменения состояния переменой имеет два элемента первый постояный второй нужен для обновления состояния
  const navigate = useNavigate();
  const [logshow, setLogShow] = useState(false);
  const [logsuccess, setLogSuccess] = useState(false);
  const [incorrectlog, setIncorrectLog] = useState(false);
  const [regshow, setRegShow] = useState(false);

  const [addressReg, setAddressReg] = useState("");
  const [passReg, setPassReg] = useState("");
  const [usernameReg, setUsernameReg] = useState("");

  const [addressLog, setAddressLog] = useState("");
  const [passLog, setPassLog] = useState("");

  const [userState, setUserAuthentication] = useState("");

  // Функция для авторизации пользователя делает запрос на сервер через соответствующий запрос в базу данных
  // Сохраняет получаемые с сервера значения в json
  const UserAuthentication = async e => {
    e.preventDefault();
    try {
      const response1 = await fetch(`http://localhost:5000/keemia/user/authentication/${addressLog}/${passLog}`);
      setUserAuthentication(await response1.json());
    } catch (err) {
      console.error(err.message);
    }
  }
 
  // Функция служит для того что бы осуществлять проверку при авторизации правильность заполняемых полей а также проверяет правильно ли вводится логин и пароль
  const GoNewPage = async e => {
    e.preventDefault();
    try {
      if (addressLog.length === 0 || passLog.length === 0) {
        console.log("Log Empty value");
        setLogShow(true);
        setLogSuccess(false);
        setIncorrectLog(false);
      }
      else {
        if (userState.length > 0) {
          console.log("Log Not Empty value");
          setLogSuccess(true);
          setLogShow(false);
          setIncorrectLog(false);
          navigate("/mainpage");
        } else {
          console.log("userState empty");
          setIncorrectLog(true);
          setLogSuccess(false);
          setLogShow(false);
        }
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  // Функция релизует регистрацию нового пользователя делая запрос на сервер через который путем команды INSERT добавлет нового пользователя в базу данных
  const UserRegistration = e => {
    e.preventDefault();
    try {
      const body = { addressReg, passReg, usernameReg };
      if (usernameReg.length === 0 || addressReg.length === 0 || passReg.length === 0) {
        console.log("Reg Empty value")
        setRegShow(true);
      }
      else {
        fetch(`http://localhost:5000/keemia/user/registration`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        window.location = "/";
        console.log("Reg Not Empty value");
        setRegShow(false);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  // Тут реализуется вся дальнейшая логика сайта
  return (
    <Fragment>
      <div className="container">
        <div className="row">
          <div className="col-sm-6 p-5 my-5">
            <img src="https://haldus.taltech.ee/sites/default/files/news-image/Logo_veeb_esitlus_png.png?_ga=2.237806976.1040993723.1651945043-304029665.1651488388"
              width={500} title="TalTech" alt='TalTechLogo'></img>
          </div>
          <div className="col-sm-6 p-5 my-5">

            <ul className="nav nav-tabs">
              <li class="nav-item">
                <a class="nav-link" data-bs-toggle="tab" href="#Authorization">Authorization form</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" data-bs-toggle="tab" href="#Registration">Registration form</a>
              </li>
            </ul>

            <div class="tab-content">
              <div class="tab-pane fade active show" id="Authorization">
                <legend>Authorization</legend>
                <fieldset>

                  <div class="form-group">
                    <label class="form-label">Email address:
                      <small class="text-danger" style={{ display: logshow ? "block" : "none" }}>Check address!!!</small>
                      <small class="text-danger" style={{ display: incorrectlog ? "block" : "none" }}>Wrong address!!!</small>
                    </label>
                    <input type="email" class="form-control my-1 shadow" aria-describedby="emailHelp" placeholder="Enter email" value={addressLog} onChange={e => setAddressLog(e.target.value)} />
                    <small class="form-text text-muted">We'll never share your email with anyone else.</small>
                  </div>

                  <div class="form-group">
                    <label class="form-label">Password:
                      <small class="text-danger" style={{ display: logshow ? "block" : "none" }}>Check password!!!</small>
                      <small class="text-danger" style={{ display: incorrectlog ? "block" : "none" }}>Wrong password!!!</small>
                    </label>
                    <input type="password" class="form-control my-1 shadow" placeholder="Password" value={passLog} onChange={e => setPassLog(e.target.value)} />
                  </div>

                  <div class="alert alert-dismissible alert-danger" style={{ display: logshow ? "block" : "none" }}>
                    <strong>Authorization failed!</strong> Check that the fields are filled.
                  </div>

                  <div class="alert alert-dismissible alert-danger" style={{ display: incorrectlog ? "block" : "none" }}>
                    <strong>Authorization failed!</strong> Wrong address or password.
                  </div>

                  <div class="alert alert-dismissible alert-success" style={{ display: logsuccess ? "block" : "none" }}>
                    <strong>Authorization success!</strong>
                  </div>

                  <button className="btn btn-primary me-1 shadow" onClick={UserAuthentication} >Сonfirm entered data</button>
                  <button className="btn btn-primary me-1 shadow" onClick={GoNewPage}>Login</button>

                </fieldset>
              </div>

              <div class="tab-pane fade" id="Registration">
                <legend>Registration</legend>
                <fieldset>
                  <div class="form-group">
                    <label class="form-label">User name: <small class="text-danger" style={{ display: regshow ? "block" : "none" }}>Check user name!!!</small></label>
                    <input type="name" class="form-control my-1 shadow" placeholder="Enter name" value={usernameReg} onChange={e => setUsernameReg(e.target.value)} />
                  </div>

                  <div class="form-group">
                    <label class="form-label">Email address: <small class="text-danger" style={{ display: regshow ? "block" : "none" }}>Check address!!!</small></label>
                    <input type="email" class="form-control my-1 shadow" aria-describedby="emailHelp" placeholder="Enter email" value={addressReg} onChange={e => setAddressReg(e.target.value)} />
                  </div>

                  <div class="form-group">
                    <label class="form-label">Password: <small class="text-danger" style={{ display: regshow ? "block" : "none" }}>Check password!!!</small></label>
                    <input type="password" class="form-control my-1 shadow" placeholder="Password" value={passReg} onChange={e => setPassReg(e.target.value)} />
                  </div>

                  <div class="alert alert-dismissible alert-danger" style={{ display: regshow ? "block" : "none" }}>
                    <strong>Registration failed!</strong> Check that the fields are filled.
                  </div>

                  <button className="btn btn-primary me-1 shadow" onClick={UserRegistration}>Create a new account</button>
                </fieldset>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default LoginInput;

