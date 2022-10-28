import { Indicator } from "../utilities/views.js"

export default class TheMealDB {
    constructor(){
    }
    filterById(i,cb) {
        this.reqApi(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${i}`,(d)=>{cb(d)})
    }
    search(n,cb) {
        this.reqApi(`https://www.themealdb.com/api/json/v1/1/search.php?s=${n}`,(d)=>{cb(d)})
    }
    searchByFirstLetter(l,cb) {
        this.reqApi(`https://www.themealdb.com/api/json/v1/1/search.php?f=${l}`,(d)=>{cb(d)})
    }

    getCategories(cb) {
        this.reqApi('https://www.themealdb.com/api/json/v1/1/categories.php',(d)=>{cb(d)})
    }
    filterByCategory(c,cb) {
        this.reqApi(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${c}`,(d)=>{cb(d)})
    }

    getAreas(cb) {
        this.reqApi('https://www.themealdb.com/api/json/v1/1/list.php?a=list',(d)=>{cb(d)})
    }
    filterByAreas(a,cb) {
        this.reqApi(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${a}`,(d)=>{cb(d)})
    }

    getIngredients(cb) {
        this.reqApi('https://www.themealdb.com/api/json/v1/1/list.php?i=list',(d)=>{cb(d)})
    }
    filterByMainIngredient(i,cb) {
        this.reqApi(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${i}`,(d)=>{cb(d)})
    }
    
    async reqApi(u,cb) {
        let r = await fetch(u)
        let d = await r.json()
        cb(d)
    }
}