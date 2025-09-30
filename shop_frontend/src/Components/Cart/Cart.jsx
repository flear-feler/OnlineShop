// Material UI imports
import { useState, useEffect } from "react";
import { List, ListItem, ListItemText, Typography, Box } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';


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

const settings = ['Выйти из аккаунта'];

export default function ControlledForm() {
    let navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['autif']);
    const [categories, setCategories] = useState();
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        price: 0,
        color: "",
        size: "",
        id_category: "1"
    });
    const [role, setRole] = useState("");


    useEffect(() => {
        var id = 1
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
            id = data.id

            const params = new URLSearchParams();
            params.append('page', 1);
            params.append('size', "50");

            axios({
                url: "http://127.0.0.1:8000/api/deals/list/",
                method: "get",
                params: params,
                headers: {
                    "accept": "application/json",
                    "Authorization": "Bearer " + cookies.autif
                }
            }).then(response => {
                const data = response.data;
                console.log(data);
                setCategories(data.items);
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

    const handleLogOutClick = () => {
        setCookie("autif", "", {
            expires: 0,
            path: '/',
        })
        navigate("/login");
    };

    const DeleteParams = (param_id) => {
        axios({
            url: "http://127.0.0.1:8000/api/deals/delete/{good_id}/?deal_id=" + param_id,
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
                            <ShoppingBasketIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} onClick={() => { navigate("/goodsPage/1") }} />
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
                                    <MenuItem onClick={() => { navigate("/adminPanel") }}>
                                        <Typography sx={{ textAlign: 'center' }}>Панель админа</Typography>
                                    </MenuItem>
                                    <MenuItem onClick={handleCloseNavMenu}>
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
                                    onClick={() => { console.log("/a") }}
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
                <h2 style={{ textAlign: 'center' }}>Корзина</h2>
                <List sx={{ width: '80%', maxWidth: 800, bgcolor: 'background.paper', margin: "20px auto" }}>
                    {categories?.map(item =>
                        <ListItem>
                            <ListItemText key={item.id} primary={item.name} secondary={item.price + "р."} />
                            <span onClick={() => { DeleteParams(item.id); }} style={{ "position": "absolute", "top": "5px", "right": "5px", "background": "white", "width": "30px", "textAlign": "center", "borderRadius": "5px", "zIndex": "100" }}><DeleteIcon /></span>
                        </ListItem>
                    )}
                </List>
            </div>

        );
    }
    return (
        <div>
            <AppBar position="static">
                <Container maxWidth="100vw">
                    <Toolbar disableGutters>
                        <ShoppingBasketIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} onClick={() => { navigate("/goodsPage/1") }} />
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
                                <MenuItem onClick={handleCloseNavMenu}>
                                    <Typography sx={{ textAlign: 'center' }}>Корзина</Typography>
                                </MenuItem>
                            </Menu>
                        </Box>
                        <ShoppingBasketIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}  />
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
                                onClick={() => { console.log("/a") }}
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
            <h2 style={{ textAlign: 'center' }}>Корзина</h2>
            <List sx={{ width: '80%', maxWidth: 800, bgcolor: 'background.paper', margin: "20px auto" }}>
                {categories?.map(item =>
                    <ListItem>
                        <ListItemText key={item.id} primary={item.name} secondary={item.price+"р."} />
                        <span onClick={() => { DeleteParams(item.id); }} style={{ "position": "absolute", "top": "5px", "right": "5px", "background": "white", "width": "30px", "textAlign": "center", "borderRadius": "5px", "zIndex": "100" }}><DeleteIcon /></span>
                        </ListItem>
                )}
            </List>
        </div>
        
    );
}