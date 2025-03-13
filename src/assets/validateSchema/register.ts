import * as yup from 'yup'

export const registerValidateSchema = yup.object().shape({
  email: yup.string().email().required('Email is required'),
  password: yup.string().required('Password is required'),
  confirmPassword: yup
    .string()
    // .oneOf([yup.ref('password'), undefined], 'Passwords must match'),
    .test('passwords-match', 'Passwords must match', function (value) {
      return this.parent.password === value
    }),
})

export default registerValidateSchema
