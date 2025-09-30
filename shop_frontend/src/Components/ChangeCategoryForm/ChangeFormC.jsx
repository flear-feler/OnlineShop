// Material UI imports
import { useState, Fragment, useEffect } from "react";
import { TextField, Button, Box, MenuItem, Select } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ImageIcon from '@mui/icons-material/UploadFile';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';


export default function ControlledForm() {
    let navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['autif']);
    const [categories, setCategories] = useState();
    const { state } = useLocation();

    const [formData, setFormData] = useState({
        id: state["info"].id,
        name: state["info"].name,
    });

    useEffect(() => {
        const params = new URLSearchParams();
        params.append('page', 1);
        params.append('size', "50");
        axios({
            url: "http://127.0.0.1:8000/api/categories/list/",
            method: "get",
            params: params,
            headers: {
                "accept": "application/json"
            }
        }).then(response => {
            const data = response.data;
            console.log(data);
            setCategories(data.items);
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
            const { data } = axios.patch("http://127.0.0.1:8000/api/categories/update/{event_id}/?category_id=" + formData.id, info, {
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

    console.error(state);

    return (
        <Box
            component="form"
            style={{ "width": " 400px", "position": "absolute", "top": "50%", "left": "50%", "transform": "translate(-50%, -50%)" }}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
            <h2 style={{ "textAlign": " center" }}>Изменение категории</h2>
            <TextField
                label="Название"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
            />
            <Button type="button" onClick={() => { handleSubmit() }} variant="contained">
                Сохранить
            </Button>
        </Box>
    );
}