import "./Lib/bootstrap.bundle.min.js";
import "./Lib/jquery-3.6.1.min.js";
import {
	constStrings
} from "./utilities/constants.js";
import RegEx from "./utilities/regex.js";
import {
	createElement,
	isEmpty,
	cutHasslePara,
	Indicator
} from "./utilities/views.js";
import {
	animateLeftSlider,
	toggleClass
} from "./animation.js";
import TheMealDB from "./apis/themealdb.js";
import Validation from "./utilities/regex.js";
let win = $(window);
let indicator = new Indicator()
let main;

document.body.appendChild(indicator.indicator)

win.on("load", () => {
	main = new Main();
	indicator.hide()
});

class Main {
	constructor() {
		this.spinner = new Indicator()
		this.meal = new TheMealDB();
		this.navComponent = {
			slider: $(".slider"),
			list: $(".list-container li"),
			toggleBtn: $(".toggel-menu"),
			toggleIco: $(".toggel-menu-ico"),
			listBtns: {
				searchBtn: $("#searchBtn"),
				CategoriesBtn: $("#CategoriesBtn"),
				AreaBtn: $("#AreaBtn"),
				IngredientsBtn: $("#IngredientsBtn"),
				ContactBtn: $("#ContactBtn"),
			},
		};
		this.mainSection = $('.sections-container')
		this.dataSection = $(".sections-container .data");
		this.searchComponent = {
			searchContainer: $(".search-container"),
			searchByNameInput: $("#searchInput"),
			searchByfirstLetter: $("#letter"),
		};
		this.formComponent = {
			form: $(".form-container"),
			nameInput: document.getElementById("username"),
			emailInput: document.getElementById("email"),
			phoneInput: document.getElementById("phone"),
			ageInput: document.getElementById("age"),
			passInput: document.getElementById("password"),
			rePassInput: document.getElementById("rePassword"),
			nameAlertErr: $("#usernameAlert"),
			emailAlertErr: $("#emailAlert"),
			phoneAlertErr: $("#phoneAlert"),
			ageAlertErr: $("#ageAlert"),
			passAlertErr: $("#passwordAlert"),
			rePassAlertErr: $("#rePasswordAlert"),
			submitBtn: $("#submitBtn"),
		};
		this.navComponent.toggleBtn.on("click", this.toggleBtnTapped.bind(this));
		this.navComponent.listBtns.searchBtn.on("click", this.searchBtnTapped.bind(this));
		this.navComponent.listBtns.CategoriesBtn.on("click", this.CategoriesBtnTapped.bind(this));
		this.navComponent.listBtns.AreaBtn.on("click", this.AreaBtn.bind(this));
		this.navComponent.listBtns.IngredientsBtn.on("click", this.IngredientsBtn.bind(this));
		this.navComponent.listBtns.ContactBtn.on("click", this.ContactBtn.bind(this));
		this.init();
	}
	init() {
		$('.loading').append(this.spinner.indicator)
		this.spinner.show($('.loading'))
		
		this.meal.search("", (d) => {
			this.displaySearchSection(d);
			this.spinner.hide($('.loading'))
		});
	}
	toggleBtnTapped() {
		toggleClass(this.navComponent.toggleIco, "fa-times");
		animateLeftSlider(this.navComponent.slider);
		toggleClass(this.navComponent.list, "listUp");
	}
	searchBtnTapped() {
		this.searchComponent.searchContainer.removeClass("d-none");
		this.formComponent.form.slideUp(100);
		this.toggleBtnTapped();
		this.dataSection.html("");
		this.searchComponent.searchByNameInput.on("input", (e) => {
			if(!isEmpty(e.target.value)) {
				this.spinner.show(this.mainSection)
				this.meal.search(e.target.value, (d) => {
					this.displaySearchSection(d);
					this.spinner.hide(this.mainSection)

				});
			} else {
				this.dataSection.html("");
			}
		});
		this.searchComponent.searchByfirstLetter.on("input", (e) => {
			if(!isEmpty(e.target.value)) {
				this.spinner.show(this.mainSection)
				this.meal.searchByFirstLetter(e.target.value, (d) => {
					this.displaySearchSection(d);
					this.spinner.hide(this.mainSection)
				});
			} else {
				this.dataSection.html("");
			}
		});
	}
	CategoriesBtnTapped() {
		this.staticCodes();
		this.spinner.show(this.mainSection)
		this.meal.getCategories((d) => {
			this.displayCategories(d);
			this.spinner.hide(this.mainSection)
		});
	}
	AreaBtn() {
		this.staticCodes();
		this.spinner.show(this.mainSection)
		this.meal.getAreas((d) => {
			this.displayAreas(d);
			this.spinner.hide(this.mainSection)
		});
	}
	IngredientsBtn() {
		this.staticCodes();
		this.spinner.show(this.mainSection)
		this.meal.getIngredients((d) => {
			this.displayIngredients(d);
			this.spinner.hide(this.mainSection)
		});
	}
	ContactBtn() {
		this.staticCodes();
		this.formComponent.form.slideDown(500);
		this.validateContactForm();
	}
	// Display
	staticCodes() {
		this.searchComponent.searchContainer.slideUp(500);
		this.formComponent.form.slideUp(500);
		this.toggleBtnTapped();
		this.dataSection.html("");
	}
	displayIngredients(data) {
		let array = data.meals;
		let children = [];
		if (array != null) {
			for(let i = 0; i < 20; i++) {
			const element = array[i];
			let p = createElement("p", ["text-center"], null, [
				cutHasslePara(element.strDescription, 55),
			]);
			let h2 = createElement("h2", null, null, [element.strIngredient]);
			let ico = createElement("i", ["fa-solid", "fa-bowl-food", "fa-3x"]);
			let post = createElement("div",
				["post", "area-post"], null,
				[ico, h2, p],
				[{
					Ingredients: element.strIngredient,
				}, ]);
			let postContainer = createElement("div",
				["movie", "shadow", "rounded", "position-relative"], null,
				[post]);
			let col = createElement("div", ["col-md-6", "col-lg-3", "my-3"], null, [
				postContainer,
			]);
			children.push(col);
		}
		this.dataSection.html("");
		this.dataSection.append(createElement("div", ["row", "mt-3", "p-2"], "rowData", children));
		$(".post").bind("click", (e) => {
			this.spinner.show(this.mainSection)
			this.meal.filterByMainIngredient(e.currentTarget.getAttribute("Ingredients"),
				(d) => {
					this.displaySearchSection(d);
					this.spinner.hide(this.mainSection)
				});
		});
		}
		
	}
	displayAreas(data) {
		let array = data.meals;
		if (array != null) {
					let children = [];
		for(let i = 0; i < array.length; i++) {
			const element = array[i];
			let h2 = createElement("h2", null, null, [element.strArea]);
			let ico = createElement("i", ["fa-solid", "fa-city", "fa-3x"]);
			let post = createElement("div",
				["post", "area-post"], null,
				[ico, h2],
				[{
					area: element.strArea,
				}, ]);
			let postContainer = createElement("div",
				["movie", "shadow", "rounded", "position-relative"], null,
				[post]);
			let col = createElement("div", ["col-md-6", "col-lg-3", "my-3"], null, [
				postContainer,
			]);
			children.push(col);
		}
		this.dataSection.html("");
		this.dataSection.append(createElement("div", ["row", "mt-3", "p-2"], "rowData", children));
		$(".post").bind("click", (e) => {
			this.spinner.show(this.mainSection)
			this.meal.filterByAreas(e.currentTarget.getAttribute("area"), (d) => {
				this.displaySearchSection(d);
				this.spinner.hide(this.mainSection)
			});
		});
		}
	}
	displaySearchSection(data) {
		let array = data.meals;
		if (array != null) {
			let children = [];
		for(let i = 0; i < array.length; i++) {
			const element = array[i];
			let h2 = createElement("h2", ["text-center"], null, [element.strMeal]);
			let info = createElement("div", ["info", "p-2"], null, [h2]);
			let layer = createElement("div",
				["layer", "d-flex", "align-items-center", "justify-content-center"], null,
				[info]);
			let img = createElement("img", ["w-100", "rounded"], null, null, [{
				src: element.strMealThumb,
			}, ]);
			let post = createElement("div",
				["post"], null,
				[img, layer],
				[{
					meal: element.idMeal,
				}, ]);
			let postContainer = createElement("div",
				["movie", "shadow", "rounded", "position-relative"], null,
				[post]);
			let col = createElement("div", ["col-md-6", "col-lg-3", "my-3"], null, [
				postContainer,
			]);
			children.push(col);
		}
		this.dataSection.html("");
		let row = createElement("div", ["row", "mt-3", "p-2"], "rowData");
		if(children.length > 20) {
			for(let i = 0; i < 20; i++) {
				row.append(children[i]);
			}
			this.dataSection.append(row);
		} else {
			this.dataSection.append(createElement("div", ["row", "mt-3", "p-2"], "rowData", children));
		}
		$(".post").bind("click", (e) => {
			this.spinner.show(this.mainSection)
			this.getDetails(e.currentTarget.getAttribute("meal"));
		});
		}
	}
	displayCategories(data) {
		console.log(data);
		let array = data.categories;
		if (array != null) {
			let children = [];
		for(let i = 0; i < array.length; i++) {
			const element = array[i];
			let p = createElement("p", null, null, [
				cutHasslePara(element.strCategoryDescription, 35),
			]);
			let h2 = createElement("h2", ["text-center"], null, [
				element.strCategory,
			]);
			let info = createElement("div", ["info", "p-2"], null, [h2, p]);
			let layer = createElement("div",
				["layer", "d-flex", "align-items-center", "justify-content-center"], null,
				[info]);
			let img = createElement("img", ["w-100", "rounded"], null, null, [{
				src: element.strCategoryThumb,
			}, ]);
			let post = createElement("div",
				["post"], null,
				[img, layer],
				[{
					meal: element.strCategory,
				}, ]);
			let postContainer = createElement("div",
				["movie", "shadow", "rounded", "position-relative"], null,
				[post]);
			let col = createElement("div", ["col-md-6", "col-lg-3", "my-3"], null, [
				postContainer,
			]);
			children.push(col);
		}
		this.dataSection.html("");
		let row = createElement("div", ["row", "mt-3", "p-2"], "rowData");
		if(children.length > 20) {
			for(let i = 0; i < 20; i++) {
				row.append(children[i]);
			}
			this.dataSection.append(row);
		} else {
			this.dataSection.append(createElement("div", ["row", "mt-3", "p-2"], "rowData", children));
		}
		$(".post").bind("click", (e) => {
			this.spinner.show(this.mainSection)
			this.meal.filterByCategory(e.currentTarget.getAttribute("meal"), (d) => {
				this.displaySearchSection(d);
				this.spinner.hide(this.mainSection)
			});
		});
		}
	}
	getDetails(id) {
		this.spinner.show(this.mainSection)
		this.meal.filterById(id, (details) => {
			this.spinner.hide(this.mainSection)
			this.dataSection.html("");
			let meal = details.meals[0];
			// start left content
			let img = createElement("img", ["w-75", "rounded"], null, null, [{
				src: meal.strMealThumb,
			}, ]);
			let h1 = createElement("h1", ["text-center"], null, [meal.strMeal]);
			let leftCol = createElement("div",
				["col-md-4", "text-white", "d-flex", "flex-column", "align-items-center", "gap-2", ], null,
				[img, h1]);
			// start right content
			let boldTag = createElement("p",
				["fw-bloder", "d-inline-block", "mx-2", "display-6"], null,
				["Tag : "]);
			let boldCategory = createElement("p",
				["fw-bloder", "d-inline-block", "mx-2"], null,
				["Category : "]);
			let boldRecipes = createElement("p",
				["fw-bloder", "d-inline-block", "mx-2", "display-6"], null,
				["Recipes : "]);
			let boldArea = createElement("p",
				["fw-bloder", "d-inline-block", "mx-2"], null,
				["Area : "]);
			let source = createElement("a",
				["btn", "btn-success", "text-white", "mx-2", "p-3"], null,
				["Source"],
				[{
					href: meal.strSource,
				}, ]);
			let youtube = createElement("a",
				["btn", "btn-danger", "text-white", "mx-2", "p-3"], null,
				["Youtube"],
				[{
					href: meal.strYoutube,
				}, ]);
			let category = createElement("p", null, null, [
				boldCategory, `${meal.strCategory}`,
			]);
			let area = createElement("p", null, null, [boldArea, `${meal.strArea}`]);
			let instruction = createElement("p", null, null, [meal.strInstructions]);
			let h2 = createElement("h1", null, null, ["Instructions"]);
			let rightCol = createElement("div",
				["col-md-8", "text-white", "text-left"], null,
				[
					h2,
					instruction,
					area,
					category,
					boldRecipes,
					strRecipes(meal),
					boldTag,
					strTag(meal),
					source,
					youtube,
				]);
			// row container
			let row = createElement("div", ["row", "mt-3", "p-5"], "rowData", [
				leftCol,
				rightCol,
			]);
			this.dataSection.append(row);
		});

		function strRecipes(meal) {
			let children = [];
			let recipes = getArrRecipes(meal);
			for(let i = 0; i < recipes.length; i++) {
				let li = createElement("li",
					["my-3", "mx-1", "p-1", "alert", "alert-success", "rounded"], null,
					[recipes[i]]);
				children.push(li);
			}
			return createElement("ul", ["d-flex"], "recipes", children);
		}

		function strTag(meal) {
			if(meal.strTags != null) {
				let children = [];
				let array = meal.strTags.split(",");
				for(let i = 0; i < array.length; i++) {
					let li = createElement("li",
						["my-3", "mx-1", "p-1", "alert", "alert-danger", "rounded"], null,
						[array[i]]);
					children.push(li);
				}
				return createElement("ul", ["d-flex"], "tags", children);
			} else {
				return createElement("p", null, null, ["No Tags Available"]);
			}
		}

		function getArrRecipes(meal) {
			let ingredients = Object.keys(meal).filter((key) => key.includes("strIngredient")).reduce((cur, key) => {
				return Object.assign(cur, {
					[key]: meal[key],
				});
			}, {});
			let measures = Object.keys(meal).filter((key) => key.includes("strMeasure")).reduce((cur, key) => {
				return Object.assign(cur, {
					[key]: meal[key],
				});
			}, {});
			let ingredientsArr = new Map(Object.entries(ingredients));
			let measuresArr = new Map(Object.entries(measures));
			let ingArr = [];
			let measArr = [];
			var merge = [];
			for(const value of ingredientsArr.values()) {
				if(value != "") {
					ingArr.push(value);
				}
			}
			for(const value of measuresArr.values()) {
				if(value != "") {
					measArr.push(value);
				}
			}
			for(let i = 0; i < ingArr.length; i++) {
				const Reciepe = `${measArr[i]} ${ingArr[i]}`;
				merge.push(Reciepe);
			}
			return merge;
		}
	}
	validateContactForm() {
		/// set regex for name
		var nameValidation = new Validation(this.formComponent.nameInput, {
			regex: constStrings.regex.username,
		});
		this.formComponent.nameInput.addEventListener("input", (e) => {
			let i = $(e.target);
			if(!nameValidation.isMatch()) {
				this.formComponent.nameAlertErr.removeClass("d-none");
				isValid(i, false);
			} else {
				this.formComponent.nameAlertErr.addClass("d-none");
				isValid(i, true);
			}
			checkAll(this.formComponent.submitBtn);
		});
		/// set regex for email
		var emailValidation = new Validation(this.formComponent.emailInput, {
			regex: constStrings.regex.email,
		});
		this.formComponent.emailInput.addEventListener("input", (e) => {
			let i = $(e.target);
			if(!emailValidation.isMatch()) {
				this.formComponent.emailAlertErr.removeClass("d-none");
				isValid(i, false);
			} else {
				this.formComponent.emailAlertErr.addClass("d-none");
				isValid(i, true);
			}
			checkAll(this.formComponent.submitBtn);
		});
		/// set regex for age
		var ageValidation = new Validation(this.formComponent.ageInput, {
			regex: constStrings.regex.age,
		});
		this.formComponent.ageInput.addEventListener("input", (e) => {
			let i = $(e.target);
			if(!ageValidation.isMatch()) {
				this.formComponent.ageAlertErr.removeClass("d-none");
				isValid(i, false);
			} else {
				this.formComponent.ageAlertErr.addClass("d-none");
				isValid(i, true);
			}
			checkAll(this.formComponent.submitBtn);
		});
		/// set regex for phone
		var phoneValidation = new Validation(this.formComponent.phoneInput, {
			regex: constStrings.regex.phone,
		});
		this.formComponent.phoneInput.addEventListener("input", (e) => {
			let i = $(e.target);
			if(!phoneValidation.isMatch()) {
				this.formComponent.phoneAlertErr.removeClass("d-none");
				isValid(i, false);
			} else {
				this.formComponent.phoneAlertErr.addClass("d-none");
				isValid(i, true);
			}
			checkAll(this.formComponent.submitBtn);
		});
		/// set regex for password
		var passValidation = new Validation(this.formComponent.passInput, {
			regex: constStrings.regex.pass,
		});
		this.formComponent.passInput.addEventListener("input", (e) => {
			let i = $(e.target);
			if(!passValidation.isMatch()) {
				this.formComponent.passAlertErr.removeClass("d-none");
				isValid(i, false);
			} else {
				this.formComponent.passAlertErr.addClass("d-none");
				isValid(i, true);
			}
			checkAll(this.formComponent.submitBtn);
		});
		/// set regex for repassword
		var rePassValidation = new Validation(this.formComponent.rePassInput, {
			equal: this.formComponent.passInput,
		});
		this.formComponent.rePassInput.addEventListener("input", (e) => {
			let i = $(e.target);
			if(!rePassValidation.isEqual()) {
				this.formComponent.rePassAlertErr.removeClass("d-none");
				isValid(i, false);
			} else {
				this.formComponent.rePassAlertErr.addClass("d-none");
				isValid(i, true);
			}
			checkAll(this.formComponent.submitBtn);
		});

		function checkAll(btn) {
			btn.attr("disabled", "");
			if(nameValidation.isMatch() && emailValidation.isMatch() && phoneValidation.isMatch() && ageValidation.isMatch() && passValidation.isMatch() && rePassValidation.isEqual()) {
				btn.removeAttr("disabled");
			} else {
				btn.attr("disabled", "");
			}
		}

		function isValid(i, b) {
			if(b) {
				i.addClass("is-valid");
				i.removeClass("is-invalid");
			} else {
				i.addClass("is-invalid");
				i.removeClass("is-valid");
			}
		}
	}
}
