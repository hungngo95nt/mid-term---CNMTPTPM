import axios from 'axios'
import BaseApp from '../Config/config'

export const Register=(email,password,name)=> axios.post(`http://localhost:8080/users/register`,{email,password,role:"point",name})
export const Login=(email,password)=> axios.post(`http://localhost:8080/users/login`,{email,password,role:"point"})