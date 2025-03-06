// Feature: FetchHttp class for making http requests

export class FetchHttp{
    constructor(){
        this.http = new XMLHttpRequest();
    }

    //GET request
    static get(url){
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type' : 'application/json'
                }
            }).then((response) => {
                response.json().then((data) => {
                    resolve(data);
                })
            }).catch((err) => {
                reject(err);
            })
        })
    }

    //POST request
    static post(url, data){
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify(data)
            }).then((response) => {
                response.json().then((data) => {
                    resolve(data);
                })
            }).catch((err) => {
                reject(err);
            })
        })
    }
    
    //PUT request
    static put(url, data){
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify(data)
            }).then((response) => {
                response.json().then((data) => {
                    resolve(data);
                })
            }).catch((err) => {
                reject(err);
            })
        })
    }
    
    //DELETE request
    static delete(url){
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type' : 'application/json'
                }
            }).then((response) => {
                response.json().then((data) => {
                    resolve(data);
                })
            }).catch((err) => {
                reject(err);
            })
        })
    }
}