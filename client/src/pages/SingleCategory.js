import React, { Component } from "react";
import './Pages.css';


import '../styles/Authentication.scss'
import { Container, Row, Col, Button, Jumbotron } from 'react-bootstrap';
import API from "../utils/API";
import SPGameCard from "../components/SPGameCard";
import SPGameContainer from './SPGameContainer';


class SingleCategory extends Component {
    state = {
        cat: [],
        id: ""
    };

    componentDidMount() {
        API.getGames()
            .then(res => {
                this.setState ({
                    cat: res.data
                });
        });
    }

    loadPage = (id) => {
        this.setState({ id: id });
    };


    render() {
        return (
            <>
                {this.state.id === "" ? (
                    <Container className="scatContain">
                        <Row className="d-flex justify-content-around">
                        {this.state.cat.map((c, i) => (
                            <SPGameCard
                                id={c._id}
                                key={i}
                                category={c.category}
                                image={c.image}
                                loadPage={this.loadPage}
                            />
                        ))}
                        </Row>
                    </Container>
                ) 
                : 
                (<SPGameContainer id={this.state.id} />)}
            </>
        )

    };

}


export default SingleCategory;
