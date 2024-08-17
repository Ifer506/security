import axios from "axios";

const baseUrl = 'http://10.0.2.2:3000/jobs'

const getToken = () => `bearer ${window.localStorage.getItem('token')}`

const getAllJobs=()=>{
    return axios.get(baseUrl)
}

const getJobById=(jobId)=>{
    return axios.get(`${baseUrl}/${jobId}`)
}

const getJobByTitle=(jobId)=>{
    return axios.get(`${baseUrl}/getJob`)
}

const createJob =(newJob)=>{
    return axios.post(baseUrl,newJob,{
        headers:{
            Authorization:getToken()
        }
    })
}

const updateJob =(jobId,updatedJob)=>{
    return axios.put(`${baseUrl}/${jobId}`,updatedJob,{
        headers:{
            Authorization:getToken()
        }
    })
}

const deleteJob =(jobId)=>{
    return axios.delete(`${baseUrl}/${jobId}`,{
        headers:{
            Authorization:getToken()
        }
    })
}

const addBookmark=(jobId)=>{
    return axios.post(`${baseUrl}/addBookmark/${jobId}`,{
            headers:{
                Authorization:getToken()
            }
        })
}

const removeBookmark=(jobId)=>{
    return axios.delete(`${baseUrl}/removeBookmark/${jobId}`,{
        headers:{
            Authorization:getToken()
        }
    })
}

const getBookmark=()=>{
    return axios.get(`${baseUrl}/getBpokmarked`,{
        headers:{
            Authorization:getToken()
        }
    })
}
const jobService={
    getAllJobs,
    getJobById,
    getJobByTitle,
    createJob,
    updateJob,
    deleteJob,
    addBookmark,
    removeBookmark,
    getBookmark
}
export default jobService