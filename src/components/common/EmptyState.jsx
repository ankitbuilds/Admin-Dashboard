function EmptyState({message = "No products found."}){
    return(
        <div>
            <p>{message}</p>
        </div>
    )
}
export default EmptyState;