import * as yup from 'yup'

export const createTaskValidateSchema = yup.object().shape({
  text: yup.string().required('Task is required'),
})

export default createTaskValidateSchema
