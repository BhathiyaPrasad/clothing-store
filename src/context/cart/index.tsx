import { PropsWithChildren, createContext, useState, useContext } from 'react'
import { Cart, CartContextProps, ProductCartItemAttr } from './types'

const CartContext = createContext({} as CartContextProps)

export function CartProvider ({ children }: PropsWithChildren) {
  const [cart, setCart] = useState<Cart>({})

  const handleAdd = (payload: ProductCartItemAttr) => {
    setCart(prevState => {
      const product = prevState[payload.id]

      if (!product) return {
        ...prevState,
        [payload.id]: payload
      }

      const parsedSizes = Object
        .entries(payload.sizes)
        .map(([key, value]) => ({
          [key]: {
            ...value,
            ...(product.sizes[key] && ({
              quantity: product.sizes[key].quantity + value.quantity,
            })),
          },
        }))
        .reduce((prev, next) => ({
          ...prev,
          ...next,
        }), {});

      const sizes = {
        ...product.sizes,
        ...parsedSizes
      }

      return {
        ...prevState,
        [product.id]: {
          ...product,
          sizes
        }
      }
    })
  }

  const handleRemove = (value: ProductCartItemAttr) => {
    
  }

  const totalProducts = Object
    .entries(cart)
    .map(([key, value]) => {
      return Object
        .entries(value.sizes)
        .map(([key, value]) => value.quantity)
        .reduce((prev, next) => prev + next)
    })
    .reduce((prev, next) => prev + next, 0)

  return (
    <CartContext.Provider
      value={{
        cart,
        onAdd: handleAdd,
        onRemove: handleRemove,
        totalProducts
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)