import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import DropdownButton from "react-bootstrap/DropdownButton";
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
import { forgotPasswordRequest, loginRequest } from "./authConfig";
import Dropdown from "react-bootstrap/esm/Dropdown";

function signIn(instance, interactionType) {
    if (interactionType === "popup") {
        instance.loginPopup(loginRequest).catch((error) => {
            if (error.errorMessage && error.errorMessage.indexOf("AADB2C90118") > -1) {
                instance.loginPopup(forgotPasswordRequest)
                    .then(() => {
                        window.alert("Password has been reset successfully. \nPlease sign-in with your new password.");
                    });
            }
        });
    } else if (interactionType === "redirect") {
        instance.loginRedirect(loginRequest).catch((e) => {
            console.log(`Error occurred: ${e}`);
        });
    }

    return null;
}

const SignInSignOutButton = () => {
    const { instance } = useMsal();
    return (
        <>
            <AuthenticatedTemplate>
                <Button variant="secondary" onClick={() => instance.logout()} className="ml-auto">Sign Out</Button>
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate>
                <DropdownButton variant="secondary" className="ml-auto" drop="left" title="Sign In">
                    <Dropdown.Item as="button" onClick={() => signIn(instance, "popup")}>Sign in using Popup</Dropdown.Item>
                    <Dropdown.Item as="button" onClick={() => signIn(instance, "redirect")}>Sign in using Redirect</Dropdown.Item>
                </DropdownButton>
            </UnauthenticatedTemplate>
        </>
    );
};

export const PageLayout = (props) => {
    return (
        <>
            <Navbar bg="primary" variant="dark">
                <a className="navbar-brand" href="/">MS Identity Platform</a>
                <SignInSignOutButton/>
            </Navbar>
            <h5><center>Welcome to the Microsoft Authentication Library For Javascript - React Quickstart</center></h5>
            <br/>
            <br/>
            {props.children}
        </>
    );
};
