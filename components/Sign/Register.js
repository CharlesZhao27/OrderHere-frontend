import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Divider,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import Yup from '../../utils/yupValidation';
import hotToast from '../../utils/hotToast';
import { register, uniqueUsername, uniqueEmail } from '../../services/Public';
import loginAction from '../../store/actions/httpAction';
import {GoogleOAuthProvider} from '@react-oauth/google';
import {GoogleLogin} from '@react-oauth/google';

const Register = ({ login }) => {
  const [isLoading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      submit: null,
    },
    validationSchema: Yup.object({
      email: Yup.string().sequence([
        () =>
          Yup.string()
            .email('Must be a valid email')
            .max(255)
            .required('Email is required'),
        () => Yup.string().unique('Email is already in use', uniqueEmail),
      ]),
      username: Yup.string().sequence([
        () => Yup.string().max(20).required('Username is required'),
        () => Yup.string().unique('Username is already taken', uniqueUsername),
      ]),
      password: Yup.string()
        .min(6, 'must be at least 6 characters long')
        .max(16)
        .required('Password is required'),
    }),
    onSubmit: async (values) => {
      // preview mode
      const { email, username, password } = values;
      setLoading(true);
      register({ email, username, password })
        .then(() => {
          hotToast('success', 'Register Success');
          dispatch(
            loginAction(
              email,
              password,
              () => {},
              (fail) => {
                setLoading(false);
                if (fail && fail.response && fail.response.status === 403) {
                  hotToast('error', 'Invalid Email or Password');
                }
                hotToast('error', `something wrong${fail}`);
              },
            ),
          );
        })
        .catch((error) => {
          setLoading(false);
          hotToast('error', `Something wrong: ${error}`);
        });
    },
  });

  return (
    <Box
      component="main"
      sx={{
        bgcolor: '#FEF6E9',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
        minWidth: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="md">
        <form onSubmit={formik.handleSubmit}>
          <Typography align="center">
            <img src="/logo.svg" height="85" width="348" alt="logo" />
          </Typography>
          <Typography color="textPrimary" variant="h4" align="center">
            CREATE ACCOUNT
          </Typography>
          <Typography
            color="textSecondary"
            sx={{ mt: 2 }}
            variant="body2"
            align="center"
          >
            Please Enter your Email Address to Start your Online Application
          </Typography>
          <Box sx={{ my: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  error={Boolean(
                    formik.touched.firstname && formik.errors.firstname,
                  )}
                  fullWidth
                  helperText={
                    formik.touched.firstname && formik.errors.firstname
                  }
                  label="First Name"
                  margin="normal"
                  name="firstname"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="firstname"
                  value={formik.values.firstname}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  error={Boolean(
                    formik.touched.lastname && formik.errors.lastname,
                  )}
                  fullWidth
                  helperText={formik.touched.lastname && formik.errors.lastname}
                  label="Last name"
                  margin="normal"
                  name="lastname"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  type="lastname"
                  value={formik.values.lastname}
                  variant="outlined"
                />
              </Grid>
            </Grid>

            <TextField
              error={Boolean(formik.touched.email && formik.errors.email)}
              fullWidth
              helperText={formik.touched.email && formik.errors.email}
              label="Enter your Email..."
              margin="normal"
              name="email"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="email"
              value={formik.values.email}
              variant="outlined"
            />

            <TextField
              error={Boolean(formik.touched.password && formik.errors.password)}
              fullWidth
              helperText={formik.touched.password && formik.errors.password}
              label="Enter your password..."
              margin="normal"
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="password"
              value={formik.values.password}
              variant="outlined"
            />

            <Grid sx={{ pt: 3, }}>
              <LoadingButton
                loading={isLoading}
                disabled={formik.isSubmitting}
                color="error"
                fullWidth
                size="large"
                variant="contained"
                onClick={() => {
                  if (process.env.NEXT_PUBLIC_PREVIEW_ENABLED) {
                    dispatch(
                      loginAction(
                        'asd@asd.com',
                        '123456',
                        () => {
                          // preview mode
                          if (process.env.NEXT_PUBLIC_PREVIEW_ENABLED) {
                            hotToast(
                              'success',
                              `Preview Simulate Login Success`,
                            );
                            return;
                          }
                          hotToast('success', 'Login Success');
                        },
                        (fail) => {
                          setLoading(false);
                          if (
                            fail &&
                            fail.response &&
                            fail.response.status === 403
                          ) {
                            hotToast('error', 'Invalid Email or Password');
                          } else {
                            hotToast('error', `Something wrong ${fail}`);
                          }
                        },
                      ),
                    );
                  } else {
                    formik.handleSubmit();
                  }
                }}
              >
                SIGN UP
              </LoadingButton>
            </Grid>
            
            <Box sx={{mt:2, mb:1}}>
              <Divider> OR </Divider>
            </Box>

            <Box sx={{ pt: 1 }}>
              <Grid
                container
                spacing={1}
                alignItems="center"
                justifyContent="center"
              >
                <Grid item>
                  <Typography>
                    <text>Already have an account?</text>
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography
                    color="textSecondary"
                    variant="body2"
                    sx={{ ml: -2.5 }}
                  >
                    <Button onClick={() => login()}> Log in</Button>
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </form>
      </Container>
    </Box>
  );
};

export default Register;
