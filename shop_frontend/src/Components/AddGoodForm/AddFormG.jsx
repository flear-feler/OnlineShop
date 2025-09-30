// Material UI imports
import { useState, Fragment, useEffect } from "react";
import { TextField, Button, Box, MenuItem, Select } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ImageIcon from '@mui/icons-material/UploadFile';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export default function ControlledForm() {
    let navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['autif']);
    const [categories, setCategories] = useState();

    const [formData, setFormData] = useState({
        name: "",
        price: 0,
        color: "",
        size: "",
        id_category: "1"
    });
    const [role, setRole] = useState("");
    const [file, setFile] = useState();

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

    const handleClick = () => {
        navigate("/addCategory");
    };

    const DeleteParams = (param_id) => {
        axios({
            url: "http://127.0.0.1:8000/api/categories/delete/" + param_id + "/",
            method: "delete",
            headers: {
                "Content-type": "application/json",
                "Authorization": "Bearer " + cookies.autif
            }
        }).then(response => {
            const data = response.data;
            window.location.reload();
        });
    };

    const handleSubmit = () => {
        const info = {
            "name": formData.name,
            "price": formData.price,
            "rating": 1,
            "category_id": parseInt(formData.id_category),
            "color": formData.color,
            "size": formData.size,
            "number_in_storage": 0,
            "description": "string"
        }

        axios({
            url: "http://127.0.0.1:8000/api/goods/create/",
            method: "post",
            data: info,
            headers: {
                "Content-type": "application/json",
                "Authorization": "Bearer " + cookies.autif
            }
        }).then(response => {
            const data = response.data;
            console.log(data);

            if (file !== null) {
                console.log(file)

                const forminf = new FormData();
                forminf.append("data", file);
                const { data1 } = axios.post('http://127.0.0.1:8000/api/images/create/?good_id=' + data, forminf, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        "Authorization": "Bearer " + cookies.autif
                    }
                });
                console.log(data1);
            }
            else {
                console.log("nofile");
            }
        });
        navigate("/goodsPage/1/");
    }
    if (role === "user") {
        return (<h1 style={{ "textAlign": " center" }}>Доступ запрещен</h1>)
    }

    const handleChangeSelect = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        console.log(name, value);
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            style={{ "width": " 400px", "position": "absolute", "top": "50%", "left": "50%", "transform":"translate(-50%, -50%)" }}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
            <h2 style={{ "textAlign": " center" }}>Новый товар</h2>
            <TextField
                label="Название"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
            />
            <TextField
                label="Цена"
                name="price"
                value={formData.price}
                onChange={handleChange}
                fullWidth
            />

            <TextField
                label="Цвет"
                name="color"
                value={formData.color}
                onChange={handleChange}
                fullWidth
            />

            <TextField
                label="Размер"
                name="size"
                value={formData.size}
                onChange={handleChange}
                fullWidth
            />
            <input
                accept="image/*"
                style={{ display: 'none' }}
                id="raised-button-file"
                multiple
                type="file"
            />
            <Fragment>
                <input
                    color="primary"
                    accept="image/*"
                    type="file"
                    name="file"
                    id="icon-button-file"
                    style={{ display: 'none', }}
                    onChange={(e) => { setFile(e.target.files[0]); }}
                />
                <label htmlFor="icon-button-file">
                    <Button
                        variant="contained"
                        component="span"
                        size="large"
                        color="primary"
                    >
                        Загрузить фото <ImageIcon/>
                    </Button>
                </label>
            </Fragment> 
            <div>
                <Select name="id_category" id="select" label="Категория" onChange={handleChangeSelect} style={{ "width": " 320px"}}>
                    {categories?.map(item =>
                        <MenuItem value={item.id}>{item.name}
                            <span onClick={() => { DeleteParams(item.id); }} style={{ "position": "absolute", "top": "5px", "right": "5px", "background": "white", "width": "30px", "textAlign": "center", "borderRadius": "5px", "zIndex": "100" }}><DeleteIcon /></span>
                            <span onClick={() => { navigate("/changeCategory", { state: { "info": item } }) }} style={{ "position": "absolute", "top": "5px", "right": "40px", "background": "white", "width": "30px", "textAlign": "center", "borderRadius": "5px" }}><EditIcon /></span>
                        </MenuItem>
                    )}
                </Select>
                <Button onClick={handleClick}>{<AddCircleIcon />}</Button>
            </div>
            
            <Button type="button" onClick={() => { handleSubmit()} } variant="contained">
                Сохранить
            </Button>
        </Box>
    );
}