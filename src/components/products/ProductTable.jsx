function ProductTable({products}){
    return(
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Rating</th>
                        <th>Stock</th>
                    </tr>
                </thead>

                <tbody>
                    {products.map((product)=>(
                        <tr key={product.id}>
                            <td>
                                <img
                                src={product.thumbnail}
                                alt={product.title}
                                width="60"/>
                            </td>
                            <td>{product.title}</td>
                            <td>{product.category}</td>
                            <td>{product.price}</td>
                            <td>{product.rating}</td>
                            <td>{product.stock}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ProductTable;