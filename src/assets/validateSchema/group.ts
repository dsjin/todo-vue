import * as yup from 'yup'

export const createGroupValidateSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
})

export default createGroupValidateSchema
