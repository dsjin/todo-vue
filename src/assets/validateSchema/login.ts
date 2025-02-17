import * as yup from 'yup'

export const loginValidateSchema = yup.object().shape({
  email: yup.string().email().required('Email is required'),
  password: yup.string().required('Password is required'),
})

export default loginValidateSchema
