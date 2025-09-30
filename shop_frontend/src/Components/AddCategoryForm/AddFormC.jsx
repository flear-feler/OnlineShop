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
        name: ""
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
        const info = {
            "name": formData.name,
        }
        try {
            const { data } = axios.post("http://127.0.0.1:8000/api/categories/create/", info, {
                headers: {
                    "Content-type": "application/json",
                    "Authorization": "Bearer " + cookies.autif
                }
            });
            console.log(data);
            navigate(-1);
        } catch (err) {
            console.error(err);
        };
    }
    if (role === "user") {
        return (<h1 style={{ "textAlign": " center" }}>Доступ запрещен</h1>)
    }
    return (
        <Box
            component="form"
            style={{ "width": " 400px", "position": "absolute", "top": "50%", "left": "50%", "transform":"translate(-50%, -50%)" }}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
            <h2 style={{ "textAlign": " center" }}>Новая категория</h2>
            <TextField
                label="Название"
                name="name"
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