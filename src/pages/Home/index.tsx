import React, { useState, useEffect } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';

import { ProductList } from './styles';
import { api } from '../../services/api';
import { formatPrice } from '../../util/format';
import { useCart } from '../../hooks/useCart';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}

interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
   const [products, setProducts] = useState<ProductFormatted[]>([]);
   const { addProduct, cart } = useCart();

    //Percorre o array CART e retorna um novo objeto con o ID e a quantidade do produto
    const cartItemsAmount = cart.reduce((sumAmount, product) => {
     
    //Cira um novo objeto
    const newSumAmount = {...sumAmount};

    //Cria uma nova propriedade no objeto com o id do product
    //Coloca a quantidade do product na nova propriedade do objeto
    newSumAmount[product.id] = product.amount;

    return newSumAmount;

   }, {} as CartItemsAmount)

  useEffect(() => {
    async function loadProducts() {
        const response = await api.get<Product[]>('products')

        //Map para que os preços sejam formatados
        const data = response.data.map(product => ({
          ...product,
          priceFormatted: formatPrice(product.price)
        }))
        setProducts(data)
    }

    loadProducts();
  }, []);

  function handleAddProduct(id: number) {
      addProduct(id)
  }

  return (

    <ProductList>

      {
        products.map(product => 
        
          <li key={product.id}>

            <img src={product.image} alt={product.title} />
            <strong>{product.title}</strong>
            <span>{product.priceFormatted}</span>
            <button
              type="button"
              data-testid="add-product-button"
              onClick={() => handleAddProduct(product.id)}
            >

              <div data-testid="cart-product-quantity">
                <MdAddShoppingCart size={16} color="#FFF" />
                {cartItemsAmount[product.id] || 0}
              </div>

              <span>ADICIONAR AO CARRINHO</span>
            </button>

          </li>)
      }

    </ProductList>

     
  );
};

export default Home;
