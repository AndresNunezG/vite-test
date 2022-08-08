export const copCoLocale = Intl.NumberFormat('es-CO', {style: 'currency', currency: 'COP'})

export const productTemplate = `
<div class='product'>
  <div class='image-container'>
    <img src='/assets/images/{{ product.img }}' class='product-image' alt='{{ product.name }}-image' />
  </div>
  <p class='product-name'>{{ product.name }}</p>
  <p class='product-description'>{{ product.description }}</p>
  <p class='product-price'>{{ product.price }}</p>
  <button class='product-add'>agregar</button>
</div>
`

export const filterOptions = {
    "1": false,
    "2": false,
    "3": false,
}
