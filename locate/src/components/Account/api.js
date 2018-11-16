import {axios} from '../Config/config'

export const Register=(email,password,name)=> axios.post(`/users/register`,{email,password,role:"locate",name})
export const Login=(email,password) => axios.post(`/users/login`,{email,password,role:"locate"})