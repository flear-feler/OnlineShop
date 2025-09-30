import React, { useState } from "react";

// Material UI Imports
import {
    TextField,
    InputAdornment,
    FormControl,
    InputLabel,
    IconButton,
    Button,
    Input,
    Checkbox,
    Alert,
    Stack,
} from "@mui/material";

// Material UI Icon Imports
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LoginIcon from "@mui/icons-material/Login";
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

// Email Validation
const isEmail = (email) =>
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

export default function Login() {
    let navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['autif']);
    const [showPassword, setShowPassword] = React.useState(false);

    //Inputs
    const [emailInput, setEmailInput] = useState();
    const [passwordInput, setPasswordInput] = useState();

    // Inputs Errors
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    // Overall Form Validity
    const [formValid, setFormValid] = useState();
    const [success, setSuccess] = useState();

    // Handles Display and Hide Password
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    // Label for Checkbox
    const label = { inputProps: { "aria-label": "Checkbox demo" } };

    // Validation for onBlur Email
    const handleEmail = () => {
        console.log(isEmail(emailInput));
        if (!isEmail(emailInput)) {
            setEmailError(true);
            return;
        }

        setEmailError(false);
    };

    // Validation for onBlur Password
    const handlePassword = () => {
        if (
            !passwordInput ||
            passwordInput.length < 5 ||
            passwordInput.length > 20
        ) {
            setPasswordError(true);
            return;
        }

        setPasswordError(false);
    };

    //handle Submittion
    const handleSubmit = () => {
        setSuccess(null);
        //First of all Check for Errors

        // If Email error is true
        if (emailError || !emailInput) {
            setFormValid("Неверный email");
            return;
        }

        // If Password error is true
        if (passwordError || !passwordInput) {
            setFormValid(
                "Слишком короткий пароль"
            );
            return;
        }
        setFormValid(null);

        // Proceed to use the information passed
        console.log("Email : " + emailInput);
        console.log("Password : " + passwordInput);

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);


        //Show Successfull Submittion
        
        const fetch = async () => {
            const params = new URLSearchParams();
            params.append('username', emailInput);
            params.append('password', passwordInput);



            try {
                const { data } = await axios.post("http://127.0.0.1:8000/api/users/login", params, {
                    headers: { "Content-type": "application/x-www-form-urlencoded" }
                });
                console.log(data);
                setCookie("autif", data.access_token, {
                    expires: tomorrow,
                    path: '/',
                })
                navigate("/goodsPage/1");
            } catch (err) {
                console.error(err);
                setFormValid("Неверные данные");
            }
        };
        fetch();
    };

    return (
        <div>
            <div style={{ marginTop: "5px" }}>
                <TextField
                    label="Логин"
                    fullWidth
                    error={emailError}
                    id="standard-basic"
                    variant="standard"
                    sx={{ width: "100%" }}
                    value={emailInput}
                    InputProps={{}}
                    size="small"
                    onBlur={handleEmail}
                    onChange={(event) => {
                        setEmailInput(event.target.value);
                    }}
                />
            </div>
            <div style={{ marginTop: "5px" }}>
                <FormControl sx={{ width: "100%" }} variant="standard">
                    <InputLabel
                        error={passwordError}
                        htmlFor="standard-adornment-password"
                    >
                        Пароль
                    </InputLabel>
                    <Input
                        error={passwordError}
                        onBlur={handlePassword}
                        id="standard-adornment-password"
                        type={showPassword ? "text" : "password"}
                        onChange={(event) => {
                            setPasswordInput(event.target.value);
                        }}
                        value={passwordInput}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>
            </div>

            <div style={{ marginTop: "20px" }}>
                <Button
                    variant="contained"
                    fullWidth
                    startIcon={<LoginIcon />}
                    onClick={handleSubmit}
                >
                </Button>
            </div>

            {/* Show Form Error if any */}
            {formValid && (
                <Stack sx={{ width: "100%", paddingTop: "12px" }} spacing={2}>
                    <Alert severity="error" size="small">
                        {formValid}
                    </Alert>
                </Stack>
            )}

            {/* Show Success if no issues */}
            {success && (
                <Stack sx={{ width: "100%", paddingTop: "12px" }} spacing={2}>
                    <Alert severity="success" size="small">
                        {success}
                    </Alert>
                </Stack>
            )}

        </div>
    );
}