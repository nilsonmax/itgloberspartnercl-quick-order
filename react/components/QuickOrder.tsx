import React, { useState, useEffect } from "react"
import { useMutation, useLazyQuery } from "react-apollo"
import UPDATE_CART from "../graphql/updateCart.graphql"
import GET_PRODUCT from "../graphql/getProductBySku.graphql"
import styles from "./styles.css"

/**
 * Este componente sirve para hacer una consulta por SKU, y cuando esta se realice; agregarla al carrito y llevarnos al checkout a pagar
 * @returns formulario de consulta
 */

const QuickOrder = () => {
  const [inputText, setInputText] = useState("")
  const [search, setSearch] = useState("")

  const [getProductData, { data: product }] = useLazyQuery(GET_PRODUCT)
  const [addToCart] = useMutation(UPDATE_CART)

  const handleChange = (event: any) => setInputText(event.target.value)

  const searchProduct = (event: any) => {
    event.preventDefault()
    if (!inputText) alert("Por favor ingresa un SKU")
    else setSearch(inputText); addProductToCart(); console.log("Estamos buscando:", inputText)

   }

  useEffect(() => {
    console.log("El resultado de mi producto es:", product, search )
    if (product) {
      let skuId = parseInt(inputText)
      addToCart({
        variables: {
          salesChannel: "1",
          items: [{
            id: skuId,
            quantity: 1,
            seller: "1"
          }]
        }
      })
        .then(() => {
          window.location.href = "/checkout"
        })
    }
  }, [product, search])

  const addProductToCart = () => {
    getProductData({
      variables: {
        sku: inputText
      }
    })
  }
  return (
    <div className={`${styles.quick__order}`}>
      {/* <h1 className={`${styles["quick__order--title"]}`}>Quick Order</h1> */}
      <form onSubmit={searchProduct} className={`${styles["quick__order--form"]}`}>
        <label htmlFor="sku" className={`${styles.form__label}`}>Ingresa el número de SKU deseado:</label>
        <input placeholder="SKU..." id="sku" type="text" onChange={handleChange} className={`${styles.form__input}`} />
        <input type="submit" value="Añadir el carrito" className={`${styles.form__submit}`} />
      </form>
    </div>
  )
}

export default QuickOrder
