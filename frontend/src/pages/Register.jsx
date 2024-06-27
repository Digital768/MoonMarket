
import { useNavigate, Form } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { TextField, Box, Card, Typography, Button } from "@mui/material";
import WebsiteName from '@/components/WebsiteName';

function Register() {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();


    return (
        <Box
            sx={{
                height: "100vh",
                display: "grid",
                placeItems: "center",
                backgroundImage: "url(https://i.redd.it/exu4qasg7tr61.png)",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
            }}
        >
            <Card
                component={Form}
                // onSubmit={handleSubmit(onSubmit)}
                method="post"
                action="/register"
                sx={{ padding: 4, display: "flex", flexDirection: "column", gap: 3, width: '400px'}}
            >
                <WebsiteName />
                <TextField
                    {...register("email", {
                        required: true,
                    })}
                    type="email"
                    placeholder="Email"
                />
                <TextField
                    {...register("username", {
                        required: true,
                    })}
                    type="name"
                    placeholder="Username"
                />

                <TextField
                    {...register("password", {
                        required: true,
                    })}
                    type="password"
                    placeholder="Password"
                />
                <TextField
                    {...register("confirmPassword", {
                        required: true,
                    })}
                    type="password"
                    placeholder="Confirm Password"
                />
                <TextField
                    {...register("initialDeposit", {
                        required: true,
                    })}
                    type="number"
                    placeholder="Initial Deposit"
                />

                <Button variant="contained" type="submit">
                    Login
                </Button>
            </Card>
        </Box>
    );
};


export default Register