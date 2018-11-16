import axios from 'axios'
export const fetchData=()=>
    axios.get('http://localhost:8080/locates')
