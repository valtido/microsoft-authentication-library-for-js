import React from 'react';
import AuthProvider from "./auth";
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar'
import './App.css';

const TitleBar = (props) => {
    return (
        <>
            <Navbar bg="primary" variant="dark">
                <a className="navbar-brand" href="/">MS Identity Platform</a>
                {props.children}
            </Navbar>
            <h5><center>Welcome to the Microsoft Authentication Library For Javascript - React Quickstart</center></h5>
            <br/>
            <br/>
        </>
    )
}

const ProfileData = (props) => {
    return (
        <>
            <h5 className="card-title">Welcome {props.name}</h5>
            {props.data && (
                <div id="profile-div">
                    <p><strong>Title: </strong> {props.data.jobTitle}</p>
                    <p><strong>Mail: </strong> {props.data.mail}</p>
                    <p><strong>Phone: </strong> {props.data.businessPhones[0]}</p>
                    <p><strong>Location: </strong> {props.data.officeLocation}</p>
                </div>
            )}
        </>
    )
}

const AuthenticatedContent = (props) => {
    return (
        <div className="App">
            <ProfileData name={props.account.name} data={props.graphProfile} />
            <br/>
            <br/>
            <Button variant="secondary" onClick={props.onRequestProfile}>Request Profile Information</Button>
        </div>
    )
}

const UnauthenticatedContent = (props) => {
    return (
        <div className="App">
            <h5 className="card-title">Please sign-in to see your profile and read your mails</h5>
        </div>
    )
}

const ErrorComponent = (props) => {
    return (
        <h3 className="card-title">An error occurred: {props.error}</h3>
    )
}

class App extends React.Component {

    render() {
        return (
            <>
                <TitleBar>
                    {!this.props.account ? 
                        (<Button variant="secondary" onClick={this.props.onSignIn} className="ml-auto">Sign In</Button>) : 
                        (<Button variant="secondary" onClick={this.props.onSignOut} className="ml-auto">Sign Out</Button>)
                    }
                </TitleBar>

                {!this.props.error && (
                    (<ErrorComponent error={this.props.error}/>)
                )}
                
                {!this.props.account ? 
                    (<UnauthenticatedContent />) : 
                    (<AuthenticatedContent 
                        account={this.props.account} 
                        graphProfile={this.props.graphProfile}
                        onRequestProfile={this.props.onRequestProfile}
                    />)
                }
                )
            </>
        )
  }
}

export default AuthProvider(App);
