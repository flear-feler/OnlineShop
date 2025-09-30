// Material UI imports
import { useState, useEffect } from "react";
import { TextField, Button, Box } from "@mui/material";
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';

export default function ControlledForm() {
    let navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['autif']);
    const { state } = useLocation();

    console.log(state)
    const [formData, setFormData] = useState({
        id: state["id"],
        num: state["price"]
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
            "good_id": formData.id,
            "price": formData.num
        }
        try {
            const { data } = axios.post("http://127.0.0.1:8000/api/deals/create/", info, {
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
    
    return (
        <Box
            component="form"
            style={{ "width": " 400px", "position": "absolute", "top": "50%", "left": "50%", "transform":"translate(-50%, -50%)" }}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
            <h2 style={{ "textAlign": " center" }}>Новая покупка</h2>
            <TextField
                label="Количество товара"
                name="num"
                value={formData.num}
                onChange={handleChange}
                fullWidth
            />
            <Button type="button" onClick={() => handleSubmit()} variant="contained">
                Сохранить
            </Button>
        </Box>
    );
}