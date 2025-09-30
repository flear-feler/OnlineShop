// Material UI imports
import { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';




export default function ControlledForm() {
    let navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['autif']);
    const { state } = useLocation();

    const [formData, setFormData] = useState({
        id: state.id,
        email: state.email,
        password: "",
        role: state.role,
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        const info = {
            "email": formData.email,
            "password": formData.password,
            "is_active": true,
            "is_superuser": false,
            "is_verified": false,
            "username": formData.email,
            "role": formData.role
        }
        try {
            const { data } = axios.patch("http://127.0.0.1:8000/api/users/" + formData.id, info, {
                headers: {
                    "Content-type": "application/json",
                    "Authorization": "Bearer " + cookies.autif
                }
            });
            console.log(data);
            navigate("/adminPanel");
        } catch (err) {
            console.error(err);
        };
    }

    console.error(state);

    return (
        <Box
            component="form"
            style={{ "width": " 400px", "position": "absolute", "top": "50%", "left": "50%", "transform": "translate(-50%, -50%)" }}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
            <h2 style={{ "textAlign": " center" }}>Изменение пользователя</h2>
            <TextField
                label="Название"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
            />
            <TextField
                label="Пароль"
                name="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
            />
            <TextField
                label="Роль"
                name="role"
                value={formData.role}
                onChange={handleChange}
                fullWidth
            />
            <Button type="button" onClick={() => { handleSubmit() }} variant="contained">
                Сохранить
            </Button>
        </Box>
    );
}