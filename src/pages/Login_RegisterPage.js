import React from "react";
import Login from "../components/Login";
import Register from "../components/Register";
import * as Mui from "@mui/material";
import { Modal, ModalDialog, ModalClose } from "@mui/joy";
import Layout from "../components/common/Layout";
const Login_RegisterPage = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      <Layout>
      <Mui.Button id="open-button" onClick={handleOpen}>
        LOGIN
      </Mui.Button>

      <Modal open={open} onClose={handleClose}>
        <ModalDialog
          sx={{
            width: "65vw",
            maxWidth: "lg",
            maxHeight: "100vh",
            overflowY: "auto",
          }}
        >
          <ModalClose onClick={handleClose} />
          <Mui.Container sx={{ display: "flex", gap: 2 }}>
            <Login />
            <Mui.Divider orientation="vertical" flexItem />
            <Register />
          </Mui.Container>
        </ModalDialog>
      </Modal>
      </Layout>
    </>
  );
};

export default Login_RegisterPage;
