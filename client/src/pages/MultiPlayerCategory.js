import React, { Component } from "react";
import { Redirect, withRouter } from "react-router-dom";
import socketAPI from "../utils/socketAPI";
import API from "../utils/API";
import MPCategory from "../components/MPCategory";


class MultiPlayer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            category: [],
            selected: "",
            position: "",
            gameStart: false,
            matchmakingOpen: false,
        }
        this.handleCatSelect = this.handleCatSelect.bind(this);
    }

    componentDidMount() {
        API.getGames().then(res => {
            this.setState({
                category: res.data
            })
            // () => console.log(this.state.category))
        });

        socketAPI.subscribeMatchmaking((message) => {
            //this message says that the player is waiting in matchmaking
            console.log(message);
            //function that shows matchmaking modal
            this.setState({ matchmakingOpen: true });
        });

        socketAPI.subscribeGameStart((info) => {
            // console.log("Game information", info);
            this.setState({
                position: info.position
            }, () => {
                console.log("MultiplayerCat Position = " + this.state.position);
                this.props.history.push('/game');
                this.setState({ matchmakingOpen: false });
            })
        });
    }

    publishSeekGame = (category) => {
        console.log("Looking for a Session to create or join with ID of: " + category);
        socketAPI.publishSeekGame(category);
    }

    handleCatSelect = (id) => {
        console.log("User chose: " + id);
        this.publishSeekGame(id);
    }

    render() {
        if (this.state.matchmakingOpen) {
            return (
                <div className="circlecontainer">
                    <div className="lds-circle"><div>
                    </div><h5 className="match">Looking for a match...</h5></div>
                </div>
            );
        }
        if (this.state.redirectTo) {
            return <Redirect to={this.state.redirectTo} />
        }
        return (
            <div>
                <div className="scatContain">
                    {this.state.category.map(category => (
                        <MPCategory
                            id={category._id}
                            key={category._id}
                            category={category.category}
                            handleSelect={this.handleCatSelect}
                        />
                    ))}
                </div>
            </div>
        )
    };
}


export default withRouter(MultiPlayer);