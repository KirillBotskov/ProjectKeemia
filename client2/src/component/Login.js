import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [addressReg, setAddressReg] = useState("");
  const [passReg, setPassReg] = useState("");
  const [usernameReg, setUsernameReg] = useState("");

  const [addressLog, setAddressLog] = useState("");
  const [passLog, setPassLog] = useState("");


  const UserAuthentication = async e => {
    e.preventDefault();
    try {
      const logbody = { addressLog, passLog};
      let response1 = await fetch(`http://localhost:5000/keemia/user/authentication`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logbody)
      });
      response1 = await response1.json()
      const result = response1.result;
      if(response1.auth){
        localStorage.setItem("user",JSON.stringify(result[0]))
        localStorage.setItem("token",JSON.stringify(response1.auth))
        navigate('/home');
      } else{
        alert("Please enter correct detail")
      }

    } catch (err) {
      console.error(err.message);
    }
  }

  const UserRegistration = e => {
    e.preventDefault();
    try {
      const regbody = { addressReg, passReg, usernameReg };
      fetch(`http://localhost:5000/keemia/user/registration`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(regbody)
      });
      window.location = "/";
    } catch (err) {
      console.error(err.message);
    }
  };

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
              <li className="nav-item">
                <a className="nav-link" data-bs-toggle="tab" href="#Authorization">Log in</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" data-bs-toggle="tab" href="#Registration">Sign up</a>
              </li>
            </ul>

            <div className="tab-content">
              <div className="tab-pane fade active show" id="Authorization">
                <form>
                  <div className="form-group">
                    <label className="form-label">Email address:</label>
                    <input type="email" className="form-control my-1 shadow" aria-describedby="emailHelp" placeholder="Enter email..." value={addressLog} onChange={e => setAddressLog(e.target.value)} />
                    <small className="form-text text-muted">We'll never share your email with anyone else.</small>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Password:</label>
                    <input type="password" className="form-control my-1 shadow" placeholder="Password..." value={passLog} onChange={e => setPassLog(e.target.value)} />
                  </div>
                    <button className="btn btn-primary my-1 shadow" onClick={UserAuthentication}>Login</button>
                </form>
              </div>

              <div className="tab-pane fade" id="Registration">
                <form>
                  <div className="form-group">
                    <label className="form-label">User name:</label>
                    <input type="name" className="form-control my-1 shadow" placeholder="Enter name..." value={usernameReg} onChange={e => setUsernameReg(e.target.value)} />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email address:</label>
                    <input type="email" className="form-control my-1 shadow" aria-describedby="emailHelp" placeholder="Enter email..." value={addressReg} onChange={e => setAddressReg(e.target.value)} />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Password:</label>
                    <input type="password" className="form-control my-1 shadow" placeholder="Password..." value={passReg} onChange={e => setPassReg(e.target.value)} />
                  </div>
                  <button className="btn btn-primary my-1 shadow" onClick={UserRegistration}>Create a new account</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
  
};

export default Login;
