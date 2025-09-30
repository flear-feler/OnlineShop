import { useState, useEffect } from "react";
import { CardMedia, Card, Stack, Typography, Chip, Rating, Grid, Box, Input } from "@mui/material";
import NoImg from "./No_Image_Available.jpg"
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import { useNavigate } from 'react-router-dom';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useParams } from "react-router"
import { useCookies } from 'react-cookie';

const pages = ['Панель админа', 'Корзина'];
const pages1 = ['Корзина'];
const settings = ['Выйти из аккаунта'];

export default function ControlledForm() {
    let navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['autif']);
    let params_url = useParams()
    const [isLoading, setLoading] = useState(true);
    const [role, setRole] = useState("");
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [goods, setGoods] = useState(null);
    const [search, setSearch] = useState("");
    const [imgs, setImgs] = useState([NoImg, NoImg, NoImg, NoImg, NoImg, NoImg, NoImg, NoImg, NoImg, NoImg, NoImg, NoImg, NoImg]);
    useEffect(() => {
        const params = new URLSearchParams();
        params.append('page', params_url.page_num);
        params.append('size', "12");
        if (params_url.search !== undefined) {
            params.append('search', params_url.search);
        }
        //console.log(cookies);
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

        axios({
            url: "http://127.0.0.1:8000/api/goods/list/",
            method: "get",
            params: params,
            headers: {
                "accept": "application/json"
            }
        }).then(response => {
            const info = response.data;
            console.log(info);
            setGoods(info.items);
            setLoading(false);

            var lst_id = []
            for (let i = 0; i < info.items.length; i++) {
                lst_id.push(info.items[i].id)
            }
            console.log(lst_id)

            axios({
                url: "http://127.0.0.1:8000/api/images/list/",
                method: "post",
                data: lst_id,
                headers: {
                    "Content-type": "application/json",
                }
            }).then(response => {
                const data1 = response.data;
                console.log(data1);
                var lst_id_pic = []
                for (let i = 0; i < info.items.length; i++) {
                    console.log(1)
                    var found = -1
                    for (let j = 0; j < data1.length; j++) {
                        if (info.items[i].id === data1[j].good_id) {
                            found = data1[j].photo_id
                        }
                    }
                    if (found === -1) {
                        lst_id_pic.push(NoImg)
                    }
                    else {
                        lst_id_pic.push("http://localhost:8000/api/images/download/"+found)
                    }
                }
                console.log(lst_id_pic)
                setImgs(lst_id_pic)
            });

        });
    }, []);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    if (isLoading) {
        return <div className="App">Loading...</div>;
    }

    const SendData = (item) => {
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
            const data = response.data["items"];
            console.log(data);
            var cat_id = 0;
            //console.log(data[0].name)
            //console.log(item.category)
            for (let i = 0; i < data.length; i++) {
                //console.log(data[i].name)
                if (data[i].name === item.category) {
                    
                    cat_id = data[i].id
                }
            }
            navigate("/changeGood", { state: { "info": { "id": item.id, "name": item.name, "price": item.price, "color": item.color, "size": item.size, "cat_id": cat_id } } })
        });
        
        
    }

    const Buy = (item) => {
        const info = {
            "good_id": item.id,
            "price": item.price
        }
        try {
            const { data } = axios.post("http://127.0.0.1:8000/api/deals/create/", info, {
                headers: {
                    "Content-type": "application/json",
                    "Authorization": "Bearer " + cookies.autif
                }
            });
            console.log(data);
        } catch (err) {
            console.error(err);
        };
    }

    const handleLogOutClick = () => {
        setCookie("autif", "", {
            expires: 0,
            path: '/',
        })
        navigate("/login");
    };

    const DeleteParams = (param_id) => {
        axios({
            url: "http://127.0.0.1:8000/api/goods/delete/" + param_id + "/",
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

    if (role === "admin") {
        return (
            <div>
                <AppBar position="static">
                    <Container maxWidth="100vw">
                        <Toolbar disableGutters>
                            <ShoppingBasketIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                            <Typography
                                variant="h6"
                                noWrap
                                component="a"
                                href="#app-bar-with-responsive-menu"
                                sx={{
                                    mr: 2,
                                    display: { xs: 'none', md: 'flex' },
                                    fontFamily: 'monospace',
                                    fontWeight: 700,
                                    letterSpacing: '.3rem',
                                    color: 'inherit',
                                    textDecoration: 'none',
                                }}
                            >
                                Товары
                            </Typography>
                            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                                <IconButton
                                    size="large"
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={handleOpenNavMenu}
                                    color="inherit"
                                >
                                    <MenuIcon />
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorElNav}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                    open={Boolean(anchorElNav)}
                                    onClose={handleCloseNavMenu}
                                    sx={{ display: { xs: 'block', md: 'none' } }}
                                >
                                    <MenuItem onClick={() => { navigate("/adminPanel") } }>
                                        <Typography sx={{ textAlign: 'center' }}>Панель админа</Typography>
                                    </MenuItem>
                                    <MenuItem onClick={{}}>
                                        <Typography sx={{ textAlign: 'center' }}>Корзина</Typography>
                                    </MenuItem>
                                </Menu>
                            </Box>
                            <ShoppingBasketIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                            <Typography
                                variant="h5"
                                noWrap
                                component="a"
                                href="#app-bar-with-responsive-menu"
                                sx={{
                                    mr: 2,
                                    display: { xs: 'flex', md: 'none' },
                                    flexGrow: 1,
                                    fontFamily: 'monospace',
                                    fontWeight: 700,
                                    letterSpacing: '.3rem',
                                    color: 'inherit',
                                    textDecoration: 'none',
                                }}
                            >
                                LOGO
                            </Typography>
                            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                                <Button
                                    onClick={() => { navigate("/adminPanel") }}
                                    sx={{ my: 2, color: 'white', display: 'block' }}
                                >Панель админа</Button>
                                <Button
                                    onClick={() => { navigate("/cart") }}
                                    sx={{ my: 2, color: 'white', display: 'block' }}
                                >Корзина</Button>
                            </Box>
                            <Box sx={{ flexGrow: 0 }}>
                                <Tooltip title="Open settings">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    {settings.map((setting) => (
                                        <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                            <Typography sx={{ textAlign: 'center' }} onClick={() => handleLogOutClick()}>{setting}</Typography>
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>
                <Box style={{ "margin": "0 auto", "width": "90%", "textAlign": "center" }}>
                    <Button color="action" onClick={() => { if (parseInt(params_url.page_num) !== 1) { window.open('http://localhost:3000/shop/goodsPage/' + (parseInt(params_url.page_num) - 1), '_self'); } }}><ChevronLeftIcon /></Button>
                    <Input style={{ "width": "500px", "marginTop": "20px" }} onChange={(event) => { setSearch(event.target.value); }}></Input>
                    <Button onClick={() => { window.open('http://localhost:3000/shop/goodsPage/1/' + search, '_self'); }}>
                        <SearchIcon />
                    </Button>
                    <Button onClick={() => { navigate("/addGood"); }} ><AddIcon /></Button>
                    <Button color="action" onClick={() => { if (goods.length === 12) { window.open('http://localhost:3000/shop/goodsPage/' + (parseInt(params_url.page_num) + 1), '_self'); } }}><ChevronRightIcon /></Button>
                </Box>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    style={{ "margin": "20px auto", "width": "90%" }}
                >
                    <Grid container spacing={2} >
                        {goods.map((item,index) =>
                            <Grid item key={index} xs={4} container alignItems="center"
                                justify="center">
                                <Card
                                    sx={{
                                        maxWidth: 266,
                                        padding: "0.1em"
                                    }}
                                    style={{ "position": "relative", "height": "500px" }}
                                >
                                    <CardMedia 
                                        component="img"
                                        alt="Yosemite National Park"
                                        image={imgs[index]}
                                    />
                                    <Typography style={{ "margin": "5px 0 0 10px", "textAlign": "center" }}> {item.name}</Typography>
                                    <Stack direction="row" alignItems="center" spacing={3} p={2} useFlexGap>
                                        <Stack direction="column" spacing={0.5} useFlexGap>
                                            <Typography>Цена: {item.price}р.</Typography>
                                            <Typography>Категория: {item.category}</Typography>
                                            <Typography>Цвет: {item.color}</Typography>
                                            <Typography>Размер: {item.size}</Typography>
                                            <Rating defaultValue={Math.round(item.rating)} size="small" />
                                        </Stack>
                                        <span onClick={() => { DeleteParams(item.id); }} style={{ "position": "absolute", "top": "5px", "right": "5px", "background": "white", "width": "30px", "textAlign": "center", "borderRadius": "5px","zIndex":"100" }}><DeleteIcon /></span>
                                        <span onClick={() => { SendData(item) }}  style={{ "position": "absolute", "top": "5px", "right": "40px", "background": "white", "width": "30px", "textAlign": "center", "borderRadius": "5px" }}><EditIcon /></span>
                                        <span onClick={() => { Buy(item) }} style={{ "position": "absolute", "bottom": "5px", "right": "5px", "background": "white", "width": "30px", "textAlign": "center", "borderRadius": "5px" }}><ShoppingCartIcon /></span>

                                    </Stack>
                                </Card>
                            </Grid>
                        )}
                    </Grid>
                </Box>
            </div>

        );
    }
    if (role === "manager") {
        return (
            <div>
                <AppBar position="static">
                    <Container maxWidth="100vw">
                        <Toolbar disableGutters>
                            <ShoppingBasketIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                            <Typography
                                variant="h6"
                                noWrap
                                component="a"
                                href="#app-bar-with-responsive-menu"
                                sx={{
                                    mr: 2,
                                    display: { xs: 'none', md: 'flex' },
                                    fontFamily: 'monospace',
                                    fontWeight: 700,
                                    letterSpacing: '.3rem',
                                    color: 'inherit',
                                    textDecoration: 'none',
                                }}
                            >
                                Товары
                            </Typography>
                            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                                <IconButton
                                    size="large"
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={handleOpenNavMenu}
                                    color="inherit"
                                >
                                    <MenuIcon />
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorElNav}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                    open={Boolean(anchorElNav)}
                                    onClose={handleCloseNavMenu}
                                    sx={{ display: { xs: 'block', md: 'none' } }}
                                >
                                    {pages1.map((page) => (
                                        <MenuItem key={page} onClick={handleCloseNavMenu}>
                                            <Typography sx={{ textAlign: 'center' }}>{page}</Typography>
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </Box>
                            <ShoppingBasketIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                            <Typography
                                variant="h5"
                                noWrap
                                component="a"
                                href="#app-bar-with-responsive-menu"
                                sx={{
                                    mr: 2,
                                    display: { xs: 'flex', md: 'none' },
                                    flexGrow: 1,
                                    fontFamily: 'monospace',
                                    fontWeight: 700,
                                    letterSpacing: '.3rem',
                                    color: 'inherit',
                                    textDecoration: 'none',
                                }}
                            >
                                LOGO
                            </Typography>
                            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                                <Button
                                    onClick={() => { navigate("/cart") }}
                                    sx={{ my: 2, color: 'white', display: 'block' }}
                                >Корзина</Button>
                            </Box>
                            <Box sx={{ flexGrow: 0 }}>
                                <Tooltip title="Open settings">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    {settings.map((setting) => (
                                        <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                            <Typography sx={{ textAlign: 'center' }} onClick={() => handleLogOutClick()}>{setting}</Typography>
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>
                <Box style={{ "margin": "0 auto", "width": "90%", "textAlign": "center" }}>
                    <Button color="action" onClick={() => { if (parseInt(params_url.page_num) !== 1) { window.open('http://localhost:3000/shop/goodsPage/' + (parseInt(params_url.page_num) - 1), '_self'); } }}><ChevronLeftIcon /></Button>
                    <Input style={{ "width": "500px", "marginTop": "20px" }} onChange={(event) => { setSearch(event.target.value); }}></Input>
                    <Button onClick={() => { window.open('http://localhost:3000/shop/goodsPage/1/' + search, '_self'); }}>
                        <SearchIcon />
                    </Button>
                    <Button onClick={() => { navigate("/addGood"); }} ><AddIcon /></Button>
                    <Button color="action" onClick={() => { if (goods.length === 12) { window.open('http://localhost:3000/shop/goodsPage/' + (parseInt(params_url.page_num) + 1), '_self'); } }}><ChevronRightIcon /></Button>
                </Box>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    style={{ "margin": "20px auto", "width": "90%" }}
                >
                    <Grid container spacing={2} >
                        {goods.map((item,index) =>
                            <Grid item key={index} xs={4} container alignItems="center"
                                justify="center">
                                <Card
                                    sx={{
                                        maxWidth: 266,
                                        padding: "0.1em"
                                    }}
                                    style={{ "position": "relative", "height": "500px" }}
                                >
                                    <CardMedia
                                        component="img"
                                        alt="Yosemite National Park"
                                        image={imgs[index]}
                                    />
                                    <Typography style={{ "margin": "5px 0 0 10px", "textAlign": "center" }}> {item.name}</Typography>
                                    <Stack direction="row" alignItems="center" spacing={3} p={2} useFlexGap>
                                        <Stack direction="column" spacing={0.5} useFlexGap>
                                            <Typography>Цена: {item.price}р.</Typography>
                                            <Typography>Категория: {item.category}</Typography>
                                            <Typography>Цвет: {item.color}</Typography>
                                            <Typography>Размер: {item.size}</Typography>
                                            <Rating defaultValue={Math.round(item.rating)} size="small" />
                                        </Stack>
                                        <span onClick={() => { DeleteParams(item.id); }} style={{ "position": "absolute", "top": "5px", "right": "5px", "background": "white", "width": "30px", "textAlign": "center", "borderRadius": "5px", "zIndex": "100" }}><DeleteIcon /></span>
                                        <span onClick={() => { SendData(item) }} style={{ "position": "absolute", "top": "5px", "right": "40px", "background": "white", "width": "30px", "textAlign": "center", "borderRadius": "5px" }}><EditIcon /></span>
                                        <span onClick={() => { Buy(item) }} style={{ "position": "absolute", "bottom": "5px", "right": "5px", "background": "white", "width": "30px", "textAlign": "center", "borderRadius": "5px" }}><ShoppingCartIcon /></span>
                                    </Stack>
                                </Card>
                            </Grid>
                        )}
                    </Grid>
                </Box>
            </div>

        );
    }
    if (role==="user") {
        return (
            <div>
                <AppBar position="static">
                    <Container maxWidth="100vw">
                        <Toolbar disableGutters>
                            <ShoppingBasketIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                            <Typography
                                variant="h6"
                                noWrap
                                component="a"
                                href="#app-bar-with-responsive-menu"
                                sx={{
                                    mr: 2,
                                    display: { xs: 'none', md: 'flex' },
                                    fontFamily: 'monospace',
                                    fontWeight: 700,
                                    letterSpacing: '.3rem',
                                    color: 'inherit',
                                    textDecoration: 'none',
                                }}
                            >
                                Товары
                            </Typography>
                            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                                <IconButton
                                    size="large"
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={handleOpenNavMenu}
                                    color="inherit"
                                >
                                    <MenuIcon />
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorElNav}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                    open={Boolean(anchorElNav)}
                                    onClose={handleCloseNavMenu}
                                    sx={{ display: { xs: 'block', md: 'none' } }}
                                >
                                    {pages1.map((page) => (
                                        <MenuItem key={page} onClick={handleCloseNavMenu}>
                                            <Typography sx={{ textAlign: 'center' }}>{page}</Typography>
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </Box>
                            <ShoppingBasketIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                            <Typography
                                variant="h5"
                                noWrap
                                component="a"
                                href="#app-bar-with-responsive-menu"
                                sx={{
                                    mr: 2,
                                    display: { xs: 'flex', md: 'none' },
                                    flexGrow: 1,
                                    fontFamily: 'monospace',
                                    fontWeight: 700,
                                    letterSpacing: '.3rem',
                                    color: 'inherit',
                                    textDecoration: 'none',
                                }}
                            >
                                LOGO
                            </Typography>
                            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                                <Button
                                    onClick={() => { navigate("/cart") }}
                                    sx={{ my: 2, color: 'white', display: 'block' }}
                                >Корзина</Button>
                            </Box>
                            <Box sx={{ flexGrow: 0 }}>
                                <Tooltip title="Open settings">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    {settings.map((setting) => (
                                        <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                            <Typography sx={{ textAlign: 'center' }} onClick={() => handleLogOutClick()}>{setting}</Typography>
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>
                <Box style={{ "margin": "0 auto", "width": "90%", "textAlign": "center" }}>
                    <Button color="action" onClick={() => { if (parseInt(params_url.page_num) !== 1) { window.open('http://localhost:3000/shop/goodsPage/' + (parseInt(params_url.page_num) - 1), '_self'); } }}><ChevronLeftIcon /></Button>
                    <Input style={{ "width": "500px", "marginTop": "20px" }} onChange={(event) => { setSearch(event.target.value); }}></Input>
                    <Button onClick={() => { window.open('http://localhost:3000/shop/goodsPage/1/' + search, '_self'); }}>
                        <SearchIcon />
                    </Button>
                    <Button color="action" onClick={() => { if (goods.length === 12) { window.open('http://localhost:3000/shop/goodsPage/' + (parseInt(params_url.page_num) + 1), '_self'); } }}><ChevronRightIcon /></Button>
                </Box>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    style={{ "margin": "20px auto", "width": "90%" }}
                >
                    <Grid container spacing={2} >
                        {goods.map((item,index) =>
                            <Grid item key={index} xs={4} container alignItems="center"
                                justify="center">
                                <Card
                                    sx={{
                                        maxWidth: 266,
                                        padding: "0.1em"
                                    }}
                                    style={{ "position": "relative", "height": "500px" }}
                                >
                                    <CardMedia
                                        component="img"
                                        alt="Yosemite National Park"
                                        image={imgs[index]}
                                    />
                                    <Typography style={{ "margin": "5px 0 0 10px", "textAlign": "center" }}> {item.name}</Typography>
                                    <Stack direction="row" alignItems="center" spacing={3} p={2} useFlexGap>
                                        <Stack direction="column" spacing={0.5} useFlexGap>
                                            <Typography>Цена: {item.price}р.</Typography>
                                            <Typography>Категория: {item.category}</Typography>
                                            <Typography>Цвет: {item.color}</Typography>
                                            <Typography>Размер: {item.size}</Typography>
                                            <Typography>Количество: {item.number_in_storage}</Typography>
                                            <Rating defaultValue={Math.round(item.rating)} size="small" />
                                        </Stack>
                                        <span onClick={() => { Buy(item) }} style={{ "position": "absolute", "bottom": "5px", "right": "5px", "background": "white", "width": "30px", "textAlign": "center", "borderRadius": "5px" }}><ShoppingCartIcon /></span>
                                        </Stack>
                                </Card>
                            </Grid>
                        )}
                    </Grid>
                </Box>
                
            </div>

        );
    }
}