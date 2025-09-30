// Material UI imports
import { useState, useEffect } from "react";
import { TextField, Button, Box } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';

export default function ControlledForm() {
    let navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['autif']);

    const [formData, setFormData] = useState({
        "email": "user@example.com",
        "password": "string",
        "is_active": true,
        "is_superuser": false,
        "is_verified": false,
        "username": "string",
        "role": "string"
    });
    const [role, setRole] = useState("");
    useEffect(() => {
        
        axios({
            url: "http://127.0.0.1:8000/api/users/me",
            method: "get",
            headers: {
                "Content-type": "application/json",
                "Authorization": "Bearer " + cookies.autif
            }
        }).then(response => {
            const data = response.data;
            console.log(data.role);
            setRole(data.role);
        });
    }, []);

    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        const submitInfo = {
            "email": formData.email,
            "password": formData.password,
            "is_active": true,
            "is_superuser": false,
            "is_verified": false,
            "username": formData.email,
            "role": formData.role
        }
        const fetch = async () => {
            try {
                const { data } = await axios.post("http://127.0.0.1:8000/api/users/register", submitInfo, {
                    headers: { "Content-type": "application/json" }
                });
                console.log(data);
                navigate("/adminPanel")
            } catch (err) {

                console.error(err);
            }
        };
        fetch();
    }
    if (role !== "admin") {
        return (<h1 style={{ "textAlign": " center" }}>Доступ запрещен</h1>)
    }
    return (
        <Box
            component="form"
            style={{ "width": " 400px", "position": "absolute", "top": "50%", "left": "50%", "transform":"translate(-50%, -50%)" }}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
            <h2 style={{ "textAlign": " center" }}>Новый пользователь</h2>
            <TextField
                label="Логин"
                name="email"
                value={formData.name}
                onChange={handleChange}
                fullWidth
            />
            <TextField
                label="Роль"
                name="role"
                value={formData.name}
                onChange={handleChange}
                fullWidth
            />
            <TextField
                label="Пароль"
                name="password"
                value={formData.name}
                onChange={handleChange}
                fullWidth
            />
            <Button type="button" onClick={() => handleSubmit()} variant="contained">
                Сохранить
            </Button>
        </Box>
    );
}