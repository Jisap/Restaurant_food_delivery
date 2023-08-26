import { ActionTypes, CartType } from "@/types/type"
import { create } from "zustand"
import { persist } from "zustand/middleware";



const INITIAL_STATE = {
    products: [],
    totalItems: 0,
    totalPrice: 0,
}

// LAMA DEV

// export const  useCartStore = create(persist<CartType & ActionTypes>(( set, get ) => ({
//     products: INITIAL_STATE.products,
//     totalItems: INITIAL_STATE.totalItems,
//     totalPrice: INITIAL_STATE.totalPrice,
//     addToCart( item ){

//         const products = get().products;                                        // Buscamos todos los productos del carrito(state)
//         const productInState = products.find(product => product.id === item.id) // Buscamos si el producto que queremos añadir ya esta en el carrito

//         if(productInState){ // Si si lo esta
        
//             const updatedProducts = products.map(product => product.id === productInState.id // Buscamos dentro de products el item que ya existe en el carrito
//                 ? { ...item,                                                       // actualizamos de ese item
//                     quantity: item.quantity + product.quantity,                    // la cantidad 
//                     price: item.price + product.price                              // y el precio
//                 } 
//                 : item                                                             // Si en products el item no esta updateProducts solo contendrá ese item
//             );
//             set((state) => ({                                                      // Acontinuación actualizamos el state 
//                 products: updatedProducts,                                         // con updateproducts, 
//                 totalItems: state.totalItems + item.quantity,                      // el total de Items del carrito
//                 totalPrice: state.totalPrice + item.price * item.quantity          // y la cantidad total a pagar
                
//             }));

//         }else{  // Si el producto a añadir no esta en el state
//             set((state) => ({
//                 products: [...state.products, item],                            // Agrega el nuevo ítem al array de productos
//                 totalItems: state.totalItems + item.quantity,                   // se actualizan cantidades
//                 totalPrice: state.totalPrice + item.price * item.quantity       // y precios a pagar
//             }))
//         }

//     },
//     removeFromCart( item ){
//         set((state) => ({
//             products: state.products.filter((product) => product.id !== item.id), // Filtra los productos, excluyendo el ítem a eliminar
//             totalItems: state.totalItems - item.quantity,
//             totalPrice: state.totalPrice - item.price * item.quantity
//         }));
//     },
// }),{name:"cart", skipHydration: true}));

// refactorización 1

export const useCartStore = create(
    persist<CartType & ActionTypes>((set, get) => ({
        ...INITIAL_STATE,

        addToCart(item) {
            const products = get().products;
            const existingProduct = products.find((product) => product.id === item.id);     // Vemos is el item ya estaba en el carrito

            if (existingProduct) {                                                          // Si ya lo estaba
                const updatedProducts = products.map((product) =>                           // creamos un [updatedProducts]
                    product.id === existingProduct.id                                       // con el item repetido     
                        ? {
                            ...product,                                                     // que contiene las props existentes del producto 
                            quantity: product.quantity + item.quantity,                     // pero actualizando la cantidad del mismo con la del nuevo item
                        }
                        : product                                                           // el resto de productos del carrito quedan como estabán
                );
                set((state) => ({                                                           // Se actualiza el state
                    products: updatedProducts,                                              // Products con el updateProducts que tiene el item del carrito actualizado 
                    totalItems: state.totalItems + item.quantity,                           // totalItems con la suma de la cantidad del nuevo item
                    totalPrice: state.totalPrice + item.price * item.quantity,              // totalPrice con el precio de los ptos que ya existian + item * su cantidad
                }));
            } else {                                                                        // Si el item no estaba en el carrito
                set((state) => ({                                                           // se actualiza el state
                    products: [...state.products, item],                                    // productos con el nuevo item
                    totalItems: state.totalItems + item.quantity,                           // totalItems con la cantidad del nuevo item
                    totalPrice: state.totalPrice + item.price * item.quantity,              // totalPrice con el nuevo precio del nuevo item * su cantidad
                }));
            }
        },

        removeFromCart(item) {
            set((state) => ({
                products: state.products.filter((product) => product.id !== item.id),
                totalItems: state.totalItems - item.quantity,
                totalPrice: state.totalPrice - item.price * item.quantity,
            }));
        },
    }), { name: "cart", skipHydration: true })
);

