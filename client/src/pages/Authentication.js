import React, { Component } from "react";
import { withRouter, Redirect } from 'react-router-dom'
import { Container, Row, Col, Button, Jumbotron } from 'react-bootstrap';
import Leaderboard from "../components/Leaderboard";
import mainImg from "../images/friends.svg";


import Modal from 'react-modal';
import axios from 'axios';
import API from "../utils/API.js";
import socketAPI from "../utils/socketAPI";
import '../styles/Authentication.scss'

class Authentication extends Component {
    state = {
        users: [],
        username: "",
        picLink: "",
        email: "",
        password: "",
        loginErrorMessage: "",
        registerErrorMessage: "",
        welcomeEmail: "",
        googleSigninUrl: "",
        redirectTo: null,
        loginOpen: false,
        registerOpen: false
    }


    openModal = modal => {
        this.setState({ [modal]: true });
    }

    closeModal = modal => {
        this.setState({ [modal]: false });
    }

    handleInput = event => {
        const { name, value } = event.target
        this.setState({
            [name]: value
        })
    }

    // Login and redirect 
    handleFormSubmit = event => {
        event.preventDefault();
        const { email, password } = this.state
        axios.post('/login', { email, password })
            .then(result => {
                socketAPI.publishLogin(email);
                this.setState({ redirectTo: "/home" });
            })
            .catch(err => {
                this.setState({ loginErrorMessage: "*Please enter a valid email or password" })
            })
    }

    //User registration and redirect
    handleFormRegister = event => {
        event.preventDefault();
        const { username, picLink, email, password } = this.state
        console.log(this.state);
        const emailReg = /^([\w-.]+@([\w-]+.)+[\w-]{2,4})?$/;
        if (!username || !picLink || !email || !password) {
            this.setState({ registerErrorMessage: "*Please fill in all fields" })
        }
        else if (password.length < 6) {
            this.setState({ registerErrorMessage: "*Password needs to be at least 6 characters" })
        }
        else if (!emailReg.test(email)) {
            this.setState({ registerErrorMessage: "*Please enter a valid email" })
        }
        else {
            axios.post("/register", { username, picLink, email, password })
                .then(result => {
                    console.log("AFTER REGISTRATION POST REQUEST IN AUTHENTICATION.JS " + result)
                    window.location.href = "/";
                })
                .catch(err => {
                    this.setState({ registerErrorMessage: "*Email is already in use" })
                })
        }
    }

    handleFormLogout = event => {
        event.preventDefault();
        API.logout().then(result => {
            this.setState({ welcomeEmail: "" })
        });
    }

    loadProfileInfo = () => {
        axios.get('/api/user/me')
            .then(response => {
                this.setState({ welcomeEmail: response.data.email })
            })
            .catch(err => {
                // axios.get("/api/google/url").then(response => {
                //     this.setState({ googleSigninUrl: response.data.url })
                // })
            });
    };

    componentDidMount() {
        // Mostly just for developing locally
        // if (window.location.pathname === "/api/google/callback") {
        //     const searchParams = new URLSearchParams(window.location.search);
        //     axios.post("/api/google/code", { code: searchParams.get('code') }).then(() => {
        //         this.setState({ redirectTo: "/" });
        //     })
        // } else {
        //     // this.loadProfileInfo()
        // }

        //Load top scores on mount
        this.loadUsers();
    };

    loadUsers() {
        API.getUsers()
            .then(res => {
                this.setState({
                    users: res.data
                })
            })
            .catch(err => console.log(err));
    }

    render() {
        if (this.state.redirectTo) {
            return <Redirect to={this.state.redirectTo} />
        }

        return (
            <>
                <Container className="auth-cont">
                    <Row>
                        <Col className="auth-col" md="5">
                            <h3>Welcome to Trivia War!</h3>
                            <p>Please feel free to create an account or use our guest login. guest@guest.com | password123</p>
                            <Row className="d-flex justify-content-around">
                                {/* Login button */}
                                <Col>
                                    <Button className="btn-custom-primary ml-3"
                                            variant="info" 
                                            id="login-btn"
                                            onClick={() => this.openModal("loginOpen")}
                                            data-target="#loginModal">
                                            Login
                                    </Button>
                                </Col>
                                <Col>
                                    {/* Register button */}
                                    <Button className="btn-custom-primary"
                                            variant="info" 
                                            id="register-btn"
                                            onClick={() => this.openModal("registerOpen")}
                                            data-target="#registerModal">
                                            Register
                                    </Button>
                                </Col>
                            </Row>

                            {/* Login Modal */}
                            <Modal
                                ariaHideApp={false}
                                isOpen={this.state.loginOpen}
                                onAfterOpen={this.afterOpenModal}
                                onRequestClose={() => this.closeModal("loginOpen")}
                                contentLabel="Example Modal"
                                id="loginModal"
                                style={{
                                    overlay: {
                                        position: 'fixed',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: 'rgba(52, 58, 64, 0.56)'
                                    },
                                    content: {
                                        width: "350px",
                                        height: "200px",
                                        border: '1px solid #ccc',
                                        background: '#fff',
                                        overflow: 'auto',
                                        WebkitOverflowScrolling: 'touch',
                                        borderRadius: '4px',
                                        outline: 'none',
                                        padding: '20px'
                                    }
                                }}
                            >
                                {/* Form inputs */}
                                <form>
                                    <input onChange={this.handleInput} style={{ marginTop: "10px" }} name="email" value={this.state.email} type="email" className="form-control" id="loginEmail" aria-describedby="emailHelp" placeholder="Enter email"></input>
                                    <input onChange={this.handleInput} style={{ marginTop: "10px" }} name="password" value={this.state.password} type="password" className="form-control" id="loginPassword" placeholder="Password"></input>
                                    {this.state.loginErrorMessage ? <div style={{ marginTop: "5px", color: "red", fontSize: "10px" }} className="fail">{this.state.loginErrorMessage}</div> : null}

                                    <button type="submit" style={{ marginTop: "15px", marginLeft: "40%" }} className="btn btn-dark" onClick={this.handleFormSubmit}>Login</button>

                                </form>
                            </Modal>

                            {/* Register modal */}
                            <Modal
                                ariaHideApp={false}
                                isOpen={this.state.registerOpen}
                                onAfterOpen={this.afterOpenModal}
                                onRequestClose={() => this.closeModal("registerOpen")}
                                contentLabel="Example Modal"
                                id="registerModal"
                                style={{
                                    overlay: {
                                        position: 'fixed',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        backgroundColor: 'rgba(52, 58, 64, 0.56)'
                                    },
                                    content: {
                                        width: "350px",
                                        height: "300px",
                                        border: '1px solid #ccc',
                                        background: '#fff',
                                        overflow: 'auto',
                                        WebkitOverflowScrolling: 'touch',
                                        borderRadius: '4px',
                                        outline: 'none',
                                        padding: '20px'
                                    }
                                }}
                            >
                                {/* Form inputs */}
                                <form>
                                    <input onChange={this.handleInput} style={{ marginTop: "10px" }} name="username" value={this.state.username} type="text" className="form-control" id="registerName" aria-describedby="emailHelp" placeholder="Enter Your Name"></input>
                                    <input onChange={this.handleInput} style={{ marginTop: "10px" }} name="picLink" value={this.state.picLink} type="text" className="form-control" id="registerImage" aria-describedby="emailHelp" placeholder="Link to your image"></input>
                                    <input onChange={this.handleInput} style={{ marginTop: "10px" }} name="email" value={this.state.email} type="email" className="form-control" id="registerEmail" aria-describedby="emailHelp" placeholder="Enter email"></input>
                                    <input onChange={this.handleInput} style={{ marginTop: "10px" }} name="password" value={this.state.password} type="password" className="form-control" id="registerPassword" placeholder="Password"></input>
                                    {this.state.registerErrorMessage ? <div style={{ marginTop: "5px", color: "red", fontSize: "10px" }} className="fail">{this.state.registerErrorMessage}</div> : null}

                                    <button type="submit" className="btn btn-dark" style={{ marginTop: "20px", marginLeft: "38%" }} onClick={this.handleFormRegister}>Register</button>
                                </form>
                            </Modal>
                        </Col>
                        <Col md="auto" />
                        <Col className="img-col" md="6">
                            <img className="w-100" src={mainImg} alt="Girl standing next to circular-shaped images on her friends" />
                            <p className="mt-3 ml-5">"Get ready to compete with friends for ultimate trivia bragging rights!</p>
                        </Col>
                    </Row>
                </Container>

                <Container className="leaderboard-cont" fluid="true">
                    <Jumbotron className="leaderboard-jumbo" fluid="true">
                        <Leaderboard
                            id="main-leaderboard"
                            leaders={this.state.users}
                            height='auto'
                            width='100%'
                        />
                    </Jumbotron>
                </Container>

                <Container className="info-container" fluid="true">
                    <Row className="info-row d-flex justify-content-around">
                        <Col className="p-3">
                            <h3>How to play?</h3>
                            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sequi cumque molestiae deserunt incidunt similique. Quas natus sapiente, corporis doloremque ipsa voluptatum consectetur tempore itaque necessitatibus, sint sequi amet quam voluptates. </p>
                        </Col>
                        <Col className="p-3">
                            <h3>How to play?</h3>
                            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sequi cumque molestiae deserunt incidunt similique. Quas natus sapiente, corporis doloremque ipsa voluptatum consectetur tempore itaque necessitatibus, sint sequi amet quam voluptates. </p>
                        </Col>
                        <Col className="p-3">
                            <h3>How to play?</h3>
                            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sequi cumque molestiae deserunt incidunt similique. Quas natus sapiente, corporis doloremque ipsa voluptatum consectetur tempore itaque necessitatibus, sint sequi amet quam voluptates. </p>
                        </Col>
                    </Row>
                </Container>
            </>
        )
    }
}

export default withRouter(Authentication);
