import React, { Component } from "react";
import swal from "sweetalert";
import "../App.css";

class Bday extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      dob: "",
      addedSuccess: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.addedData = this.addedData.bind(this);
  }
  async addedData(e) {
    const name = this.state.name;
    const email = this.state.email;
    const dob = this.state.dob;

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        email: email,
        dob: dob,
      }),
    };
    const response = await fetch("http://localhost:5000/", requestOptions);
    const data = await response.json();
    console.log(data);
    if (data.success) {
      this.setState({
          name: "",
          email: "",
          dob: "",
          addedSuccess: false,
        });
      swal({
        icon: "success",
        title: "Submitted!",
      })
      
    }
  }
  handleChange(event) {
    this.setState({
      [event.target.id]: event.target.value,
    });
    console.log(event.target.value);
  }
  render() {
    return (
      <div>
        <div>
          <nav class="navbar navbar-light bg-primary">
            <span class="navbar-brand h2">iQube</span>
          </nav>
        </div>
        <div className="container">
          <div className="card shadow">
            <div className="card-body">
              <div class="form-group">
                <label for="name">Name</label>
                <input
                  onChange={this.handleChange}
                  type="text"
                  class="form-control"
                  name="name"
                  id="name"
                  value={this.state.name}
                />
              </div>
              <div class="form-group">
                <label for="email">e-Mail</label>
                <input
                  onChange={this.handleChange}
                  type="email"
                  class="form-control"
                  name="email"
                  id="email"
                  value={this.state.email}
                />
              </div>
              <div className="form-group">
                <label for="dob">Date of Birth</label>
                <input
                  id="dob"
                  onChange={this.handleChange}
                  className="form-control"
                  name="dob"
                  type="date"
                  value={this.state.dob}
                />
              </div>
              <button
                onClick={this.addedData}
                type="submit"
                class="btn btn-primary"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Bday;
