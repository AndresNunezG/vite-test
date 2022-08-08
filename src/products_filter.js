import products from '../data/products.json'
import {
  copCoLocale,
  productTemplate,
  filterOptions,
} from './utils'

export default class ProductsFilter {
  constructor() {
    this.rawProducts = products
    this.formattedProducts = this.formatProducts()
    this.productTemplate = productTemplate
    this.filterOptions = filterOptions
    this.localStorage = window.localStorage;
    
    this.dispatchMethods()
  }
  
  dispatchMethods() {
    this.initModalEvents()
    this.setStateFromLocalStorage()
    this.watchFilters()
    this.watchApplyFilters()
    this.watchRemoveFilters()
  }
  
  formatProducts() {
    const products = this.rawProducts["products"]
    return products.map((product) => ({
      ...product,
      price: copCoLocale.format(Number(product.price))
    }))
  }

  renderProducts(products = undefined) {
    const productsToRender = products ? products : this.formattedProducts
    var template = Handlebars.compile(this.productTemplate)
    const productList = document.getElementById('products-list')
    let productsWithTemplates = ""
    Array.from(productsToRender).forEach(product => {
      productsWithTemplates += template({product})
    });
    productList.innerHTML = productsWithTemplates
  }

  initModalEvents() {
    const btnOpenModal = document.querySelector("[data-modal]");
    btnOpenModal.addEventListener('click', (event) => {
      event.preventDefault()
      const modal = document.getElementById(btnOpenModal.dataset.modal)
      if (!modal.classList.contains("open")) {
        modal.classList.add("open");
        modal.classList.remove("close");
      }
      modal.classList.add('open')
      const exitsModal = modal.querySelectorAll('.modal-exit')
      exitsModal.forEach((exit) => {
        exit.addEventListener("click", (event) => {
          event.preventDefault()
          if (modal.classList.contains("open")) {
            modal.classList.remove("open")
            modal.classList.add("close")
            this.setStateFromLocalStorage()
          }
        })
      })
    })
  }

  closeFilterModal() {
    const filterModal = document.getElementById(document.querySelector("[data-modal]").dataset.modal)
    if (filterModal.classList.contains("open")) {
      filterModal.classList.remove("open");
      filterModal.classList.add("close");
    }
  }

  watchFilters() {
    const filterOptionsInputs = document.querySelectorAll("[data-filter-option]")
    filterOptionsInputs.forEach(filterOption => {
      filterOption.addEventListener('change', (event) => {
        event.preventDefault()
        this.filterOptions[filterOption.dataset.filterOption] = filterOption.checked
        this.updateDialogFilterButtons()
      })
    })
  }

  updateDialogFilterButtons() {
    const filtersSelectedLabels = document.querySelectorAll('.filters-selected-label')
    const cleanFilters = document.querySelector('.clean-filters')
    const amountFiltersSelected = Object.values(this.filterOptions).filter(value => value).length

    if (amountFiltersSelected >= 1) {
      filtersSelectedLabels.forEach(filterSelectedLabel => {
        filterSelectedLabel.classList.add('visible')
        filterSelectedLabel.innerText = amountFiltersSelected
        cleanFilters.classList.add('enabled')
      })
    } else {
      filtersSelectedLabels.forEach(filterSelectedLabel => {
        filterSelectedLabel.classList.remove('visible')
        filterSelectedLabel.innerText = ""
        cleanFilters.classList.remove('enabled')
      })
    }
  }

  getActiveFilters() {
    return Object.keys(this.filterOptions).filter(key => Boolean(this.filterOptions[key]))
  }

  watchApplyFilters() {
    const applyBtn = document.getElementById("apply-filters")
    applyBtn.addEventListener('click', (event) => {
      event.preventDefault()
      this.filterProducts()
    })
  }

  filterProducts() {
    const allProducts = this.formattedProducts
    const activeFilters = this.getActiveFilters()
    let filteredProducts = []
    if (activeFilters.length) {
      filteredProducts = allProducts.filter(product => activeFilters.includes(String(product.filterId)))
    } else {
      filteredProducts = allProducts
    }
    this.saveFiltersInLocalStorage()
    this.renderProducts(filteredProducts)
    this.closeFilterModal()
  }

  watchRemoveFilters() {
    const cleanBtn = document.getElementById("clean-filters")
    cleanBtn.addEventListener('click', (event) => {
      event.preventDefault()
      const activeFilters = this.getActiveFilters()
      if (activeFilters.length) {
        this.removeFilters()
        this.updateDialogFilterButtons()
      }
    })
  }

  removeFilters() {
    const filterOptionsInputs = document.querySelectorAll("[data-filter-option]")
    filterOptionsInputs.forEach(filterOption => {
      this.filterOptions[filterOption.dataset.filterOption] = false
      filterOption.checked = false
    })
    this.cleanFiltersFromLocalStorage()
    this.renderProducts()
    this.closeFilterModal()
  }

  checkFilterInputs() {
    const filterOptionsInputs = document.querySelectorAll("[data-filter-option]")
    filterOptionsInputs.forEach(filterOption => {
      if (this.filterOptions[filterOption.dataset.filterOption]) {
        filterOption.checked = true
      } else {
        filterOption.checked = false
      }
    })
  }

  saveFiltersInLocalStorage() {
    this.localStorage.setItem('filters', JSON.stringify(this.getActiveFilters()))
  }
  
  getFiltersFromLocalStorage() {
    return JSON.parse(this.localStorage.getItem('filters'))
  }

  cleanFiltersFromLocalStorage() {
    this.localStorage.clear()
  }

  setStateFromLocalStorage() {
    const filtersActive = this.getFiltersFromLocalStorage()
    if (filtersActive && filtersActive.length > 0) {
      filtersActive.forEach(filterActive => {
        this.filterOptions[String(filterActive)] = true
      });
      this.checkFilterInputs()
      this.updateDialogFilterButtons()
      this.filterProducts()
    } else {
      this.renderProducts()
    }
  }

}
